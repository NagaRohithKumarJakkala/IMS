package models

var CreateTablesQueries = []string{
	// User Table
	`CREATE TABLE IF NOT EXISTS User_Table (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    level_of_access VARCHAR(16) NOT NULL
);`,

	// User Log Table
	`CREATE TABLE IF NOT EXISTS User_Log (
		log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		login_time DATETIME NOT NULL,
		logout_time DATETIME NOT NULL,
		CONSTRAINT fk_userlog_user FOREIGN KEY (user_id) REFERENCES User_Table(user_id)
	);`,

	// Supplier Table
	`CREATE TABLE IF NOT EXISTS Supplier_Table (
		supplier_id INT PRIMARY KEY,
		supplier_name VARCHAR(64) NOT NULL
	);`,

	// Product Table
	`CREATE TABLE IF NOT EXISTS Product_Table (
		product_id VARCHAR(16) PRIMARY KEY,
		product_brand VARCHAR(32),
		product_name VARCHAR(128) NOT NULL,
		description VARCHAR(512),
		category VARCHAR(64),
		mrp DECIMAL(10,2) NOT NULL,
		selling_price DECIMAL(10,2) NOT NULL
	);`,

	// Branch Table
	`CREATE TABLE IF NOT EXISTS Branch_Table (
		branch_id VARCHAR(16) PRIMARY KEY,
		branch_name VARCHAR(128) NOT NULL
	);`,

	// Stock Table
	`CREATE TABLE IF NOT EXISTS Stock_Table (
		product_id VARCHAR(16),
		branch_id VARCHAR(16),
		quantity_of_item INT,
		PRIMARY KEY (product_id, branch_id),
		FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
		FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
	);`,

	// Order Table
	`CREATE TABLE IF NOT EXISTS Order_Table (
		order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
		branch_id VARCHAR(16) NOT NULL,
		user_id INT NOT NULL,
		order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE
	);`,

	// Order Items Table
	`CREATE TABLE IF NOT EXISTS Order_Items (
		order_id BIGINT NOT NULL,
		product_id VARCHAR(16) NOT NULL,
		quantity_of_item INT NOT NULL CHECK (quantity_of_item > 0) ,
		selling_price DECIMAL(10,2) NOT NULL,
		PRIMARY KEY (order_id, product_id),
		FOREIGN KEY (order_id) REFERENCES Order_Table(order_id) ON DELETE CASCADE,
		FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
	);`,

	// Entry Table
	`CREATE TABLE IF NOT EXISTS Entry_Table (
		entry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
		supplier_id INT NOT NULL,
		branch_id VARCHAR(16) NOT NULL,
		user_id INT NOT NULL,
		entry_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE,
		FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
		FOREIGN KEY (supplier_id) REFERENCES Supplier_Table(supplier_id) ON DELETE CASCADE
	);`,

	// Entry Items Table
	`CREATE TABLE IF NOT EXISTS Entry_Items (
		entry_id BIGINT,
		product_id VARCHAR(16) NOT NULL,
		quantity_of_item INT,
		cost_of_item DECIMAL(10,2) NOT NULL,
		PRIMARY KEY (entry_id, product_id),
		FOREIGN KEY (entry_id) REFERENCES Entry_Table(entry_id) ON DELETE CASCADE,
		FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
	);`,

	// Stock Log Table
	`CREATE TABLE IF NOT EXISTS Stock_Log (
		log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
		product_id VARCHAR(16),
		branch_id VARCHAR(16),
		quantity_change INT,
		change_type ENUM('INCREASE', 'DECREASE'),
		change_time DATETIME DEFAULT CURRENT_TIMESTAMP
	);`,

	//announcement table
	`CREATE TABLE IF NOT EXISTS Announcement_Table (
		announcement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
		branch_id VARCHAR(16) NOT NULL,
		product_id VARCHAR(16),
		announcement_type ENUM('STOCK', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
		announcement_text VARCHAR(512) NOT NULL,
		announcement_time DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
		FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
	);`,
}

var CreateTriggersQueries = []string{
	// Trigger to add stock entries when a new branch is created
	`CREATE TRIGGER after_branch_insert
	AFTER INSERT ON Branch_Table
	FOR EACH ROW
	BEGIN
		INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
		SELECT product_id, NEW.branch_id, 0 FROM Product_Table;
	END;`,

	// Trigger to add stock entries when a new product is created
	`CREATE TRIGGER after_product_insert
	AFTER INSERT ON Product_Table
	FOR EACH ROW
	BEGIN
		INSERT INTO Stock_Table (product_id, branch_id, quantity_of_item)
		SELECT NEW.product_id, branch_id, 0 FROM Branch_Table;
	END;`,

	// Trigger to update stock quantity when an entry is made
	`CREATE TRIGGER after_entry_insert
	AFTER INSERT ON Entry_Items
	FOR EACH ROW
	BEGIN
		UPDATE Stock_Table 
		SET quantity_of_item = quantity_of_item + NEW.quantity_of_item
		WHERE product_id = NEW.product_id 
		AND branch_id = (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id);
	END;`,

	// Trigger to reduce stock when an order is placed
	`CREATE TRIGGER after_order_insert
	AFTER INSERT ON Order_Items
	FOR EACH ROW
	BEGIN
		UPDATE Stock_Table 
		SET quantity_of_item = quantity_of_item - NEW.quantity_of_item
		WHERE product_id = NEW.product_id 
		AND branch_id = (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id);
	END;`,

	// Prevent orders when stock is insufficient
	`CREATE TRIGGER before_order_insert
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
	END;`,

	// Log stock increase after entry
	`CREATE TRIGGER after_stock_increase
	AFTER INSERT ON Entry_Items
	FOR EACH ROW
	BEGIN
		INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
		VALUES (NEW.product_id, (SELECT branch_id FROM Entry_Table WHERE entry_id = NEW.entry_id), NEW.quantity_of_item, 'INCREASE');
	END;`,

	// Log stock decrease after order
	`CREATE TRIGGER after_stock_decrease
	AFTER INSERT ON Order_Items
	FOR EACH ROW
	BEGIN
		INSERT INTO Stock_Log (product_id, branch_id, quantity_change, change_type)
		VALUES (NEW.product_id, (SELECT branch_id FROM Order_Table WHERE order_id = NEW.order_id), -NEW.quantity_of_item, 'DECREASE');
	END;`,

	
	//announcement to tell that the stock of that respective productid has decreased below threshold(20)
`CREATE TRIGGER stock_less_than_20 
AFTER INSERT ON Stock_Log 
FOR EACH ROW
BEGIN
    DECLARE current_quantity INT;
    DECLARE product_name VARCHAR(128);
    DECLARE existing_announcement_id BIGINT;

    IF NEW.change_type = 'DECREASE' THEN
        -- get current stock quantity
        SELECT quantity_of_item INTO current_quantity 
        FROM Stock_Table 
        WHERE product_id = NEW.product_id 
        AND branch_id = NEW.branch_id
        LIMIT 1;

        IF current_quantity < 20 THEN
            -- get product name
            SELECT product_name INTO product_name 
            FROM Product_Table 
            WHERE product_id = NEW.product_id 
            LIMIT 1;

            -- if announcement alreadu exists
            SELECT announcement_id INTO existing_announcement_id
            FROM Announcement_Table
            WHERE product_id = NEW.product_id
              AND branch_id = NEW.branch_id
              AND announcement_text LIKE CONCAT('Stock of ', product_name, ' (%')
            LIMIT 1;

            -- delete existing announcement if found
            IF existing_announcement_id IS NOT NULL THEN
                DELETE FROM Announcement_Table 
                WHERE announcement_id = existing_announcement_id;
            END IF;

            -- insert new announcement of stock being critically low
            INSERT INTO Announcement_Table 
            (branch_id, product_id, announcement_type, announcement_text)
            VALUES (
                NEW.branch_id,
                NEW.product_id,
                'STOCK',
                CONCAT('Stock of ', product_name, ' (', NEW.product_id, ') is critically low(', current_quantity,')')
            );
        END IF;
    END IF;
END//`,


// announcement to remove when the stock of that respective productid has increased above threshold(20)
`CREATE TRIGGER stock_greater_than_20 
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
DELIMITER ;`,

}

var CreateFunctionsQueries = []string{
	`DELIMITER //
	CREATE FUNCTION get_order_total_money(p_order_id BIGINT)
	RETURNS DECIMAL(10, 2)
	BEGIN
		DECLARE money_total DECIMAL(10, 2);
		
		SELECT COALESCE(SUM(o_items.quantity_of_item * o_items.selling_price), 0)
		INTO money_total
		FROM Order_Items o_items
		WHERE o_items.order_id = p_order_id;
		
		RETURN money_total;
	END//
	DELIMITER ;`,

	`DELIMITER //
	CREATE FUNCTION get_entry_total_cost(p_entry_id BIGINT)
	RETURNS DECIMAL(10, 2)
	BEGIN
		DECLARE money_total DECIMAL(10, 2);
		
		SELECT COALESCE(SUM(e_item.quantity_of_item * e_item.cost_of_item), 0)
		INTO money_total
		FROM Entry_Items e_item
		WHERE e_item.entry_id = p_entry_id;
		
		RETURN money_total;
	END//
	DELIMITER ;`,

	`DELIMITER //
	CREATE FUNCTION get_product_current_month_profit(p_product_id VARCHAR(16), p_branch_id VARCHAR(16))
	RETURNS DECIMAL(10, 2)
	BEGIN
		DECLARE v_revenue DECIMAL(10, 2);
		DECLARE v_cost DECIMAL(10, 2);
		
		SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
		INTO v_revenue
		FROM Order_Items oi
		JOIN Order_Table ot ON oi.order_id = ot.order_id
		WHERE oi.product_id = p_product_id
		  AND ot.branch_id = p_branch_id
		  AND MONTH(ot.order_time) = MONTH(CURDATE())
		  AND YEAR(ot.order_time) = YEAR(CURDATE());
		
		SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
		INTO v_cost
		FROM Entry_Items ei
		JOIN Entry_Table et ON ei.entry_id = et.entry_id
		WHERE ei.product_id = p_product_id
		  AND et.branch_id = p_branch_id
		  AND MONTH(et.entry_time) = MONTH(CURDATE())
		  AND YEAR(et.entry_time) = YEAR(CURDATE());
		
		RETURN v_revenue - v_cost;
	END//
	DELIMITER ;`,

	`DELIMITER //
	CREATE FUNCTION get_product_today_profit(p_product_id VARCHAR(16), p_branch_id VARCHAR(16))
	RETURNS DECIMAL(10, 2)
	BEGIN
		DECLARE v_revenue DECIMAL(10, 2);
		DECLARE v_cost DECIMAL(10, 2);
		
		SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
		INTO v_revenue
		FROM Order_Items oi
		JOIN Order_Table ot ON oi.order_id = ot.order_id
		WHERE oi.product_id = p_product_id
		  AND ot.branch_id = p_branch_id
		  AND DATE(ot.order_time) = CURDATE();
		
		SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
		INTO v_cost
		FROM Entry_Items ei
		JOIN Entry_Table et ON ei.entry_id = et.entry_id    
		WHERE ei.product_id = p_product_id
		  AND et.branch_id = p_branch_id      
		  AND DATE(et.entry_time) = CURDATE();
		
		RETURN v_revenue - v_cost;
	END//
	DELIMITER ;`,
}

