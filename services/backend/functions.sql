-------------------------------------------------------------------------------------
-- calculate total money from an order
DELIMITER //
CREATE OR REPLACE FUNCTION get_order_total_money(p_order_id BIGINT)
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE money_total DECIMAL(10, 2);
    
    SELECT COALESCE(SUM(o_items.quantity_of_item * o_items.selling_price), 0)
    INTO money_total
    FROM Order_Items o_items
    WHERE o_items.order_id = p_order_id;
    
    RETURN money_total;
END//
DELIMITER ;

-- calculate total buying cost for an entry
DELIMITER //
CREATE OR REPLACE FUNCTION get_entry_total_cost(p_entry_id BIGINT)
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE money_total DECIMAL(10, 2);
    
    SELECT COALESCE(SUM(e_item.quantity_of_item * e_item.cost_of_item), 0)
    INTO money_total
    FROM Entry_Items e_item
    WHERE e_item.entry_id = p_entry_id;
    
    RETURN money_total;
END//
DELIMITER ;


-- Calculate total profit for a product
DELIMITER //
CREATE OR REPLACE FUNCTION get_product_current_month_profit(p_product_id VARCHAR(16),p_branch_id VARCHAR(16))
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE v_revenue DECIMAL(10, 2);
    DECLARE v_cost DECIMAL(10, 2);
    
    -- Total revenue from sales in current month for specific branchs specific product
    -- oi is for order item(for p_id,sp,quantitiy) table and ot is for order table(branch,date)
    SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
    INTO v_revenue
    FROM Order_Items oi
    JOIN Order_Table ot ON oi.order_id = ot.order_id
    WHERE oi.product_id = p_product_id
      AND ot.branch_id = p_branch_id
      AND MONTH(ot.order_time) = MONTH(CURDATE())
      AND YEAR(ot.order_time) = YEAR(CURDATE());
    
    -- Total cost from purchases in current month for specific branchs specific product
    -- ei and et is similat to oi and ot
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
DELIMITER ;

DELIMITER //
CREATE OR REPLACE FUNCTION get_branch_current_month_profit(p_branch_id VARCHAR(16))
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE v_revenue DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_cost DECIMAL(10, 2) DEFAULT 0;
    
    -- Calculate current month's revenue for the branch
    SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
    INTO v_revenue
    FROM Order_Items oi
    JOIN Order_Table ot ON oi.order_id = ot.order_id
    WHERE ot.branch_id = p_branch_id
      AND MONTH(ot.order_time) = MONTH(CURDATE())
      AND YEAR(ot.order_time) = YEAR(CURDATE());
    
    -- Calculate current month's procurement costs for the branch
    SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
    INTO v_cost
    FROM Entry_Items ei
    JOIN Entry_Table et ON ei.entry_id = et.entry_id
    WHERE et.branch_id = p_branch_id
      AND MONTH(et.entry_time) = MONTH(CURDATE())
      AND YEAR(et.entry_time) = YEAR(CURDATE());
    
    RETURN v_revenue - v_cost;
END//
DELIMITER ;



-- function to find a branches monthly profit
DELIMITER //
CREATE OR REPLACE FUNCTION get_branch_monthly_profit(p_branch_id VARCHAR(16),p_month INT,p_year INT) 
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE v_revenue DECIMAL(10, 2) DEFAULT 0;
    DECLARE v_cost DECIMAL(10, 2) DEFAULT 0;
    
    -- calculate total revenue for the branch in specified month/year
    SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
    INTO v_revenue
    FROM Order_Items oi
    JOIN Order_Table ot ON oi.order_id = ot.order_id
    WHERE ot.branch_id = p_branch_id
      AND MONTH(ot.order_time) = p_month
      AND YEAR(ot.order_time) = p_year;
    
    -- calculate total procurement cost for the branch in specified month/year
    SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
    INTO v_cost
    FROM Entry_Items ei
    JOIN Entry_Table et ON ei.entry_id = et.entry_id
    WHERE et.branch_id = p_branch_id
      AND MONTH(et.entry_time) = p_month
      AND YEAR(et.entry_time) = p_year;
    
    RETURN v_revenue - v_cost;
END//
DELIMITER ;

--for that particular day a products profit in that branch
DELIMITER //
CREATE OR REPLACE FUNCTION get_product_today_profit(p_product_id VARCHAR(16),p_branch_id VARCHAR(16))
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE v_revenue DECIMAL(10, 2);
    DECLARE v_cost DECIMAL(10, 2);
    
    -- Total revenue from sales today for specific branchs specific product
    -- oi is for order item(for p_id,sp,quantitiy) table and ot is for order table(branch,date)
    SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
    INTO v_revenue
    FROM Order_Items oi
    JOIN Order_Table ot ON oi.order_id = ot.order_id
    WHERE oi.product_id = p_product_id
      AND ot.branch_id = p_branch_id
      AND DAY(ot.order_time) = DAY(CURDATE())
      AND MONTH(ot.order_time) = MONTH(CURDATE())
      AND YEAR(ot.order_time) = YEAR(CURDATE());
    
    -- Total cost from purchases today for specific branchs specific product
    -- ei and et is similat to oi and ot
    SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
    INTO v_cost
    FROM Entry_Items ei
    JOIN Entry_Table et ON ei.entry_id = et.entry_id    
    WHERE ei.product_id = p_product_id
      AND et.branch_id = p_branch_id      
      AND DAY(et.entry_time) = DAY(CURDATE())
      AND MONTH(et.entry_time) = MONTH(CURDATE())
      AND YEAR(et.entry_time) = YEAR(CURDATE());
    
    RETURN v_revenue - v_cost;
END//
DELIMITER ;

