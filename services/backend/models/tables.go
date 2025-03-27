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
		announcement_text VARCHAR(512) NOT NULL,
		announcement_time DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE
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

	// Trigger to announce stock is below threshold
	`CREATE TRIGGER stock_less_than_20 
	AFTER INSERT ON Stock_Log 
	FOR EACH ROW
	BEGIN
		DECLARE current_quantity INT;
		DECLARE product_name VARCHAR(128);

		IF NEW.change_type = 'DECREASE' THEN

			SELECT quantity_of_item INTO current_quantity FROM Stock_Table 
			WHERE product_id = NEW.product_id AND branch_id = NEW.branch_id LIMIT 1;

			IF current_quantity < 20 THEN

				SELECT product_name INTO product_name FROM Product_Table 
				WHERE product_id = NEW.product_id LIMIT 1;

				INSERT INTO Announcement_Table (branch_id, announcement_text)
				VALUES (NEW.branch_id, CONCAT('Stock of ', product_name, ' (', NEW.product_id, ') is critically low(', current_quantity,')'));

			END IF;
		END IF;
	END//`,
}
