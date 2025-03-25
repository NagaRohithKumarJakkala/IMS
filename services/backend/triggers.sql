
-- Trigger to add stock entries when a new branch is created

DELIMITER $$

CREATE TRIGGER after_branch_insert
AFTER INSERT ON Branch_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT product_id, NEW.branch_id, 0 FROM Product_Table;
END$$

DELIMITER ;


-- Trigger to add stock entries when a new product is created

DELIMITER $$

CREATE TRIGGER after_product_insert
AFTER INSERT ON Product_Table
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
    SELECT NEW.product_id, branch_id, 0 FROM Branch_Table;
END$$

DELIMITER ;

-- Update stock quantity by adding the new entry quantity

DELIMITER $$

CREATE TRIGGER after_entry_insert
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item + NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id);
END$$

DELIMITER ;
-- Reduce stock quantity when an order is placed

DELIMITER $$

CREATE TRIGGER after_order_insert
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    UPDATE Stock_Table 
    SET quantity_of_item = quantity_of_item - NEW.quantity_of_item
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);
END$$

DELIMITER ;


-- If stock is insufficient, prevent the order
DELIMITER $$

CREATE TRIGGER before_order_insert
BEFORE INSERT ON Order_Items
FOR EACH ROW
BEGIN
    DECLARE available_stock INT;

    -- Get the current stock quantity
    SELECT quantity_of_item INTO available_stock 
    FROM Stock_Table 
    WHERE product_id = NEW.product_id 
    AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);

    -- If stock is insufficient, prevent the order
    IF available_stock IS NULL OR available_stock < NEW.quantity_of_item THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient stock to place order';
    END IF;
END$$

DELIMITER ;

-- log entry after stock increase
DELIMITER $$

CREATE TRIGGER after_stock_increase
AFTER INSERT ON Entry_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id), NEW.quantity_of_item, 'INCREASE');
END$$

DELIMITER ;

-- log entry after stock decrease
DELIMITER $$

CREATE TRIGGER after_stock_decrease
AFTER INSERT ON Order_Items
FOR EACH ROW
BEGIN
    INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
    VALUES (NEW.product_id, (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id), -NEW.quantity_of_item, 'DECREASE');
END$$

DELIMITER ;
