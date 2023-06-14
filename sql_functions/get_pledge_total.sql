CREATE OR REPLACE FUNCTION get_pledge_total(campaign_id bigint)
RETURNS DECIMAL AS $$
DECLARE
    total_amount DECIMAL;
BEGIN
    SELECT SUM(p.amount) INTO total_amount
    FROM pledges p
    WHERE p.campaign_id = get_pledge_total.campaign_id;
    
    RETURN total_amount;
END;
$$ LANGUAGE plpgsql;