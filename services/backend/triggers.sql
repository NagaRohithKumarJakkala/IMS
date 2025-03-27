
-- Trigger to add stock entries when a new branch is created
DELIMITER //
CREATE TRIGGER after_branch_insert
AFTER INSERT ON Branch_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT product_id, NEW.branch_id, 0 FROM Product_Table;
END//

-- Trigger to add stock entries when a new product is created
CREATE TRIGGER after_product_insert
AFTER INSERT ON Product_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT NEW.product_id, branch_id, 0 FROM Branch_Table;
END//

-- Trigger to update stock quantity when an entry is made
CREATE TRIGGER after_entry_insert
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item + NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id);
END//

-- Trigger to reduce stock when an order is placed
CREATE TRIGGER after_order_insert
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item - NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);
END//

-- Prevent orders when stock is insufficient
CREATE TRIGGER before_order_insert
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

-- Log stock increase after entry
CREATE TRIGGER after_stock_increase
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id), NEW.quantity_of_item, 'INCREASE');
END//

-- Log stock decrease after order
CREATE TRIGGER after_stock_decrease
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id), -NEW.quantity_of_item, 'DECREASE');
END//

DELIMITER ;