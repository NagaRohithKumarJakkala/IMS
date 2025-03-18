package models

import (
	"log"
	"net/http"

	"backend/initializers"
	"github.com/gin-gonic/gin"
)

func CreateTables(c *gin.Context) {
	queries := []string{
		// Seller Table
		`CREATE TABLE IF NOT EXISTS Seller_Table (
			seller_id INT PRIMARY KEY AUTO_INCREMENT,
			seller_name VARCHAR(64) NOT NULL
		);`,

		// Product Table
		`CREATE TABLE IF NOT EXISTS Product_Table (
			product_id VARCHAR(16) PRIMARY KEY,
			product_brand VARCHAR(32),
			product_name VARCHAR(128),
			description VARCHAR(512)
		);`,

		// Branch Table
		`CREATE TABLE IF NOT EXISTS Branch_Table (
			branch_id VARCHAR(16) PRIMARY KEY,
			branch_name VARCHAR(128) NOT NULL
		);`,

		// Cost Table (Links Branch & Product)
		`CREATE TABLE IF NOT EXISTS Cost_Table (
			branch_id VARCHAR(16),
			product_id VARCHAR(16),
			cost_of_item DECIMAL (10,2),
			mrp DECIMAL (10,2),
			SP DECIMAL (10,2),
			PRIMARY KEY (branch_id, product_id),
			FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
			FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
		);`,

		// Selling Table (No Changes)
		`CREATE TABLE IF NOT EXISTS Selling_Table (
			order_id BIGINT AUTO_INCREMENT,
			product_id VARCHAR(16),
			quantity_of_item INT CHECK (quantity_of_item > 0),
			selling_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			branch_id VARCHAR(16),
			SP DECIMAL (10,2),
			PRIMARY KEY (order_id, product_id),
			FOREIGN KEY (branch_id) REFERENCES Branch_Table(branch_id) ON DELETE CASCADE,
			FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
		);`,

		// Category Table
		`CREATE TABLE IF NOT EXISTS Category_Table (
			product_id VARCHAR(16),
			category VARCHAR(64),
			PRIMARY KEY (product_id, category),
			FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE
		);`,

		// Duration Table (Product Shelf Life)
		`CREATE TABLE IF NOT EXISTS Duration_Table (
			product_id VARCHAR(16),
			seller_id INT,
			manufactured_date DATE,
			duration_value INT,
			duration_unit ENUM('D', 'M', 'Y'),
			quantity_of_item INT CHECK (quantity_of_item >= 0),
			PRIMARY KEY (product_id, manufactured_date),
			FOREIGN KEY (product_id) REFERENCES Product_Table(product_id) ON DELETE CASCADE,
			FOREIGN KEY (seller_id) REFERENCES Seller_Table(seller_id) ON DELETE CASCADE
		);`,

		// User Level Table (Access Control)
		`CREATE TABLE IF NOT EXISTS user_level_table (
			user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
			user_email VARCHAR(64) UNIQUE NOT NULL,
			level_of_access VARCHAR(16) NOT NULL
		);`,

		// User Log Table
		`CREATE TABLE IF NOT EXISTS user_log (
			log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
			user_id BIGINT,
			login_time DATETIME,
			logout_time DATETIME,
			FOREIGN KEY (user_id) REFERENCES user_level_table(user_id) ON DELETE CASCADE
		);`,
	}

	for _, query := range queries {
		_, err := connect.Db.Exec(query)
		if err != nil {
			log.Println("Error executing query:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tables"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "All tables created successfully"})
}

