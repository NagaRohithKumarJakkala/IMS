-------------------------------------------------------------------------------------
-- calculate total money from an order
DELIMITER //
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
DELIMITER ;

-- calculate total buying cost for an entry
DELIMITER //
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
DELIMITER ;

-- Calculate total profit for a product
DELIMITER //
CREATE FUNCTION get_product_total_profit(p_product_id VARCHAR(16))
RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE v_revenue DECIMAL(10, 2);
    DECLARE v_cost DECIMAL(10, 2);
    
    -- Total revenue from sales
    SELECT COALESCE(SUM(oi.quantity_of_item * oi.selling_price), 0)
    INTO v_revenue
    FROM Order_Items oi
    WHERE oi.product_id = p_product_id;
    
    -- Total cost from purchases
    SELECT COALESCE(SUM(ei.quantity_of_item * ei.cost_of_item), 0)
    INTO v_cost
    FROM Entry_Items ei
    WHERE ei.product_id = p_product_id;
    
    RETURN v_revenue - v_cost;
END//
DELIMITER ;

