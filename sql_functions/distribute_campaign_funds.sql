CREATE OR REPLACE FUNCTION distribute_campaign_funds(campaign_id_input BIGINT)
RETURNS VOID AS $$
DECLARE
    total_pledged DECIMAL;
    participant_count BIGINT;
    participant_share DECIMAL;
    participant_id UUID;
    campaign_goal NUMERIC;

BEGIN
    -- Get total amount pledged for the campaign
    total_pledged := get_pledge_total(campaign_id_input);
    

    SELECT goal INTO campaign_goal FROM campaigns WHERE id = campaign_id;

    -- If campaign goal isn't null, the sum of all pledges must be greater than or equal to that number
    IF campaign_goal IS NOT NULL AND total_pledged < campaign_goal THEN
        RAISE EXCEPTION 'The total pledges % is less than the campaign goal %', total_pledged, campaign_goal;
    END IF;

    -- Get count of campaign participants
    SELECT COUNT(*) INTO participant_count
    FROM campaign_participants
    WHERE campaign_id = campaign_id_input;
    
    -- Calculate share for each participant
    IF participant_count > 0 THEN
        participant_share := total_pledged / participant_count;
    ELSE
        RAISE EXCEPTION 'No participants for campaign id %', campaign_id_input;
    END IF;
    
    -- Distribute funds to each participant
    FOR participant_id IN
        SELECT user_id
        FROM campaign_participants
        WHERE campaign_id = campaign_id_input
    LOOP
        INSERT INTO campaign_payouts(campaign_id, amount)
        VALUES(campaign_id_input, participant_share);
    END LOOP;
    
    UPDATE campaigns
    SET closed = true
    WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql;
