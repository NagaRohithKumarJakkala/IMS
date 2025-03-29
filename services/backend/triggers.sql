
-- trigger to add stock entries when a new branch is created
DELIMITER //
CREATE OR REPLACE TRIGGER after_branch_insert
AFTER INSERT ON Branch_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT product_id, NEW.branch_id, 0 FROM Product_Table;
END//

-- trigger to add stock entries when a new product is created
CREATE OR REPLACE TRIGGER after_product_insert
AFTER INSERT ON Product_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT NEW.product_id, branch_id, 0 FROM Branch_Table;
END//

-- trigger to update stock quantity when an entry is made
CREATE OR REPLACE TRIGGER after_entry_insert
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item + NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id);
END//

-- trigger to reduce stock when an order is placed
CREATE OR REPLACE TRIGGER after_order_insert
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item - NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);
END//

-- prevent orders when stock is insufficient
CREATE OR REPLACE TRIGGER before_order_insert
BEFORE INSERT ON Order_Items
FOR EACH ROW
BEGIN
    DECLARE available_stock INT;

    SELECT COALESCE(quantity_of_item, 0) INTO available_stock 
    FROM Stock_Table 
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);

    IF available_stock < NEW.quantity_of_item THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient stock to place order';
    END IF;
END//

-- log stock increase after entry
CREATE OR REPLACE TRIGGER after_stock_increase
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id), NEW.quantity_of_item, 'INCREASE');
END//

-- log stock decrease after order
CREATE OR REPLACE TRIGGER after_stock_decrease
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id), -NEW.quantity_of_item, 'DECREASE');
END//



CREATE OR REPLACE TRIGGER stock_less_than_20 
AFTER INSERT ON Stock_Log 
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT DEFAULT 0;
    DECLARE product_name VARCHAR(128);
    DECLARE existing_announcement_id BIGINT DEFAULT NULL;

    IF NEW.change_type = 'DECREASE' THEN
        -- Get product name and current stock in single query
        SELECT 
            COALESCE(p.product_name, 'Unknown Product'),
            COALESCE(s.quantity_of_item, 0)
        INTO 
            product_name,
            current_quantity
        FROM Product_Table p
        LEFT JOIN Stock_Table s
            ON s.product_id = NEW.product_id
            AND s.branch_id = NEW.branch_id
        WHERE p.product_id = NEW.product_id
        LIMIT 1;


        IF current_quantity < 20 THEN
            -- Check for existing announcement
            SELECT announcement_id INTO existing_announcement_id
            FROM Announcement_Table
            WHERE product_id = NEW.product_id
              AND branch_id = NEW.branch_id
              AND announcement_type = 'STOCK'
            LIMIT 1;

            -- Remove existing announcement if exists
            IF existing_announcement_id IS NOT NULL THEN
                DELETE FROM Announcement_Table 
                WHERE announcement_id = existing_announcement_id;
            END IF;

            -- Create new announcement with accurate quantity
            INSERT INTO Announcement_Table 
            (branch_id, product_id, announcement_type, announcement_text)
            VALUES (
                NEW.branch_id,
                NEW.product_id,
                'STOCK',
                CONCAT('Stock of ', product_name, 
                      ' (ID: ', NEW.product_id, 
                      ') is low: ', current_quantity, ' units remaining')
            );
        END IF;
    END IF;
END//

-- announcement to remove when the stock of that respective productid has increased above threshold(20)
CREATE OR REPLACE TRIGGER stock_greater_than_20 
AFTER INSERT ON Stock_Log 
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT;

    IF NEW.change_type = 'INCREASE' THEN
        -- get current stock quantity after the increase\--ifmore than 20 then we need to remove from announcemnets
        SELECT quantity_of_item INTO current_quantity 
        FROM Stock_Table 
        WHERE product_id = NEW.product_id 
          AND branch_id = NEW.branch_id
        LIMIT 1;

        -- Only delete if stock has crossed the threshold
        IF current_quantity >= 20 THEN
            DELETE FROM Announcement_Table 
            WHERE product_id = NEW.product_id
              AND branch_id = NEW.branch_id
              AND announcement_type = 'STOCK';
        END IF;
    END IF;
END//

CREATE OR REPLACE TRIGGER stock_over_120
AFTER INSERT ON Stock_Log 
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT DEFAULT 0;
    DECLARE product_name VARCHAR(128);
    DECLARE existing_announcement_id BIGINT DEFAULT NULL;

    IF NEW.change_type = 'INCREASE' THEN
        -- Get product details and current stock
        SELECT 
            COALESCE(p.product_name, 'Unknown Product'),
            COALESCE(s.quantity_of_item, 0)
        INTO 
            product_name,
            current_quantity
        FROM Product_Table p
        LEFT JOIN Stock_Table s
            ON s.product_id = NEW.product_id
            AND s.branch_id = NEW.branch_id
        WHERE p.product_id = NEW.product_id
        LIMIT 1;

        IF current_quantity >= 120 THEN
            -- Check for existing overstock announcement
            SELECT announcement_id INTO existing_announcement_id
            FROM Announcement_Table
            WHERE product_id = NEW.product_id
              AND branch_id = NEW.branch_id
              AND announcement_type = 'STOCK'
            LIMIT 1;

            -- Update existing announcement if needed
            IF existing_announcement_id IS NOT NULL THEN
                DELETE FROM Announcement_Table 
                WHERE announcement_id = existing_announcement_id;
            END IF;

            -- Create new overstock announcement
            INSERT INTO Announcement_Table 
            (branch_id, product_id, announcement_type, announcement_text)
            VALUES (
                NEW.branch_id,
                NEW.product_id,
                'STOCK',
                CONCAT('Overstock alert: ', product_name, 
                      ' (', NEW.product_id, ') has ', 
                      current_quantity, ' units in stock')
            );
        END IF;
    END IF;
END//

-- 2. Trigger for removing overstock announcements
CREATE OR REPLACE TRIGGER stock_below_120 
AFTER INSERT ON Stock_Log 
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT DEFAULT 0;

    IF NEW.change_type = 'DECREASE' THEN
        -- Get current stock quantity
        SELECT COALESCE(quantity_of_item, 0) INTO current_quantity 
        FROM Stock_Table 
        WHERE product_id = NEW.product_id 
          AND branch_id = NEW.branch_id
        LIMIT 1;

        IF current_quantity < 120 THEN
            -- Remove overstock announcement if exists
            DELETE FROM Announcement_Table 
            WHERE product_id = NEW.product_id
              AND branch_id = NEW.branch_id
              AND announcement_type = 'STOCK';
        END IF;
    END IF;
END//

DELIMITER ;
