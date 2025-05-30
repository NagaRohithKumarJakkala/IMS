-- User Table
CREATE TABLE IF NOT EXISTS User_Table (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    level_of_access VARCHAR(16) NOT NULL
);

-- User Log Table
CREATE TABLE IF NOT EXISTS User_Log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME NOT NULL,
    CONSTRAINT fk_userlog_user FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE
);

-- Supplier Table
CREATE TABLE IF NOT EXISTS Supplier_Table (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(64) NOT NULL
);

-- Product Table
CREATE TABLE IF NOT EXISTS Product_Table (
    product_id VARCHAR(16) PRIMARY KEY,
    product_brand VARCHAR(32),
    product_name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    category VARCHAR(64),
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL
);

-- Branch Table
CREATE TABLE IF NOT EXISTS Branch_Table (
    branch_id VARCHAR(16) PRIMARY KEY,
    branch_name VARCHAR(128) NOT NULL
);

-- Stock Table
CREATE TABLE IF NOT EXISTS Stock_Table (
    product_id VARCHAR(16),
    branch_id VARCHAR(16),
    quantity_of_item INT,
    PRIMARY KEY (product_id, branch_id),
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);

-- Order Table
CREATE TABLE IF NOT EXISTS Order_Table (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id VARCHAR(16) NOT NULL,
    user_id INT NOT NULL,
    order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS Order_Items (
    order_id BIGINT NOT NULL,
    product_id VARCHAR(16) NOT NULL,
    quantity_of_item INT NOT NULL CHECK (quantity_of_item > 0),
    selling_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Order_Table(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);

-- Entry Table
CREATE TABLE IF NOT EXISTS Entry_Table (
    entry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    branch_id VARCHAR(16) NOT NULL,
    user_id INT NOT NULL,
    entry_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Table(user_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES Supplier_Table(supplier_id) ON DELETE CASCADE
);

-- Entry Items Table
CREATE TABLE IF NOT EXISTS Entry_Items (
    entry_id BIGINT,
    product_id VARCHAR(16) NOT NULL,
    quantity_of_item INT,
    cost_of_item DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (entry_id, product_id),
    FOREIGN KEY (entry_id) REFERENCES Entry_Table(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);

-- Stock Log Table
CREATE TABLE IF NOT EXISTS Stock_Log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(16),
    branch_id VARCHAR(16),
    quantity_change INT,
    change_type ENUM('INCREASE', 'DECREASE'),
    change_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

--want a table which will store announcements which will be sent to the logged in
--it will contain announcements such as stock critically low and other examples being some string
--will be stored in this table

CREATE TABLE IF NOT EXISTS Announcement_Table (
    announcement_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_id VARCHAR(16) NOT NULL,
    product_id VARCHAR(16),
    announcement_type ENUM('STOCK', 'GENERAL','OVERSTOCK') NOT NULL DEFAULT 'GENERAL',
    announcement_text VARCHAR(512) NOT NULL,
    announcement_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
);
