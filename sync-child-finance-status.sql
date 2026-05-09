-- Function to synchronize child status with finance module
-- Updates financial transactions when child status changes
CREATE OR REPLACE FUNCTION sync_child_status_with_finance()
RETURNS TRIGGER AS $$
BEGIN
  -- If child is being deactivated (ACTIVE -> INACTIVE)
  IF OLD.status = 'ACTIVE' AND NEW.status = 'INACTIVE' THEN
    -- Update all pending/overdue payments to be excluded from active billing
    UPDATE financial_transactions
    SET status = 'CANCELLED',
        updated_at = NOW(),
        notes = COALESCE(notes, '') || ' | Cancelled due to child deactivation'
    WHERE child_id = NEW.id
      AND status IN ('PENDING', 'OVERDUE')
      AND direction = 'INCOME';

  -- If child is being reactivated (INACTIVE -> ACTIVE)
  ELSIF OLD.status = 'INACTIVE' AND NEW.status = 'ACTIVE' THEN
    -- Reactivate cancelled payments back to pending
    UPDATE financial_transactions
    SET status = 'PENDING',
        updated_at = NOW(),
        notes = COALESCE(notes, '') || ' | Reactivated due to child reactivation'
    WHERE child_id = NEW.id
      AND status = 'CANCELLED'
      AND direction = 'INCOME'
      AND notes LIKE '%Cancelled due to child deactivation%';

  -- If child is being archived (any status -> ARCHIVED)
  ELSIF NEW.status = 'ARCHIVED' THEN
    -- Permanently cancel all outstanding payments
    UPDATE financial_transactions
    SET status = 'CANCELLED',
        updated_at = NOW(),
        notes = COALESCE(notes, '') || ' | Permanently cancelled - child archived'
    WHERE child_id = NEW.id
      AND status IN ('PENDING', 'OVERDUE')
      AND direction = 'INCOME';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the sync function
DROP TRIGGER IF EXISTS trg_sync_child_finance ON children;
CREATE TRIGGER trg_sync_child_finance
  AFTER UPDATE OF status ON children
  FOR EACH ROW EXECUTE PROCEDURE sync_child_status_with_finance();

-- Create a view for financial aggregates per child (real-time)
CREATE OR REPLACE VIEW child_financial_summary AS
SELECT
  c.id as child_id,
  c.full_name,
  c.status as child_status,
  COALESCE(SUM(CASE WHEN ft.direction = 'INCOME' AND ft.status = 'PAID' THEN ft.amount ELSE 0 END), 0) as total_paid,
  COALESCE(SUM(CASE WHEN ft.direction = 'INCOME' AND ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) as total_owed,
  COALESCE(SUM(CASE WHEN ft.direction = 'INCOME' AND ft.status = 'OVERDUE' THEN ft.amount ELSE 0 END), 0) as overdue_amount,
  COUNT(CASE WHEN ft.direction = 'INCOME' AND ft.status IN ('PENDING', 'OVERDUE') THEN 1 END) as pending_transactions,
  MAX(ft.transaction_date) as last_payment_date
FROM children c
LEFT JOIN financial_transactions ft ON c.id = ft.child_id
GROUP BY c.id, c.full_name, c.status;

-- Create materialized view for better performance on large datasets
CREATE MATERIALIZED VIEW IF NOT EXISTS child_financial_summary_mat AS
SELECT * FROM child_financial_summary;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_child_financial_summary_mat_child_id ON child_financial_summary_mat(child_id);
CREATE INDEX IF NOT EXISTS idx_child_financial_summary_mat_status ON child_financial_summary_mat(child_status);

-- Function to refresh the materialized view (call periodically or after bulk operations)
CREATE OR REPLACE FUNCTION refresh_child_financial_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY child_financial_summary_mat;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT ON child_financial_summary TO authenticated;
GRANT SELECT ON child_financial_summary_mat TO authenticated;