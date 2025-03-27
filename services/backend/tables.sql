CREATE TABLE User_Table (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    level_of_access VARCHAR(16) NOT NULL
);


CREATE TABLE User_Log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME NOT NULL,
	CONSTRAINT fk_userlog_user FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE
);

CREATE TABLE Supplier_Table (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(64) NOT NULL
);

CREATE TABLE Product_Table (
    product_id VARCHAR(16) PRIMARY KEY,
    product_brand VARCHAR(32),
    product_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    category VARCHAR(64),
    mrp DECIMAL(10,2) NOT NULL CHECK (mrp >= 0),  
    selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0)  
);

CREATE TABLE Branch_Table( 
    branch_id VARCHAR(16) PRIMARY KEY, 
    branch_name VARCHAR(128) NOT NULL
);

CREATE TABLE Stock_Table (
    product_id VARCHAR(16),
    branch_id VARCHAR(16),
    quantity_of_item INT CHECK (quantity_of_item >= 0), 
    PRIMARY KEY (product_id, branch_id), 
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE 
);

CREATE TABLE Order_Table ( 
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    branch_id VARCHAR(16) NOT NULL, 
    user_id INT NOT NULL,
    order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE
);

CREATE TABLE Order_Items ( 
    order_id BIGINT, 
    product_id VARCHAR(16), 
    quantity_of_item INT CHECK (quantity_of_item > 0) NOT NULL, 
    selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0), 
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Order_Table(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);

CREATE TABLE Entry_Table (
    entry_id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    supplier_id INT NOT NULL,
    branch_id VARCHAR(16) NOT NULL,
    user_id INT NOT NULL,
    entry_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES Supplier_Table(supplier_id) ON DELETE CASCADE
);

CREATE TABLE Entry_Items (
    entry_id BIGINT, 
    product_id VARCHAR(16) NOT NULL,
    quantity_of_item INT CHECK (quantity_of_item > 0) NOT NULL,
    cost_of_item DECIMAL(10,2) NOT NULL CHECK (cost_of_item >= 0),  
    PRIMARY KEY (entry_id, product_id),
    FOREIGN KEY (entry_id) REFERENCES Entry_Table(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);

CREATE TABLE Stock_Log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(16),
    branch_id VARCHAR(16),
    quantity_change INT,
    change_type ENUM('INCREASE', 'DECREASE'),
    change_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
