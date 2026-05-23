-- Create optimized views for financial aggregates per child
-- This provides real-time financial summaries without complex queries

-- Basic view for active children financial summary
CREATE OR REPLACE VIEW active_children_financial AS
SELECT
  c.id,
  c.full_name,
  c.enrollment_date,
  c.withdrawal_date,
  c.status,
  COALESCE(fin.total_paid, 0) as total_paid,
  COALESCE(fin.total_owed, 0) as total_owed,
  COALESCE(fin.overdue_amount, 0) as overdue_amount,
  COALESCE(fin.pending_transactions, 0) as pending_transactions,
  fin.last_payment_date
FROM children c
LEFT JOIN child_financial_summary fin ON c.id = fin.child_id
WHERE c.status = 'ACTIVE';

-- View for deactivated children with financial impact
CREATE OR REPLACE VIEW deactivated_children_financial AS
SELECT
  c.id,
  c.full_name,
  c.enrollment_date,
  c.withdrawal_date,
  c.status,
  c.updated_at as deactivated_at,
  COALESCE(fin.total_paid, 0) as total_paid,
  COALESCE(fin.total_owed, 0) as total_owed,
  COALESCE(fin.overdue_amount, 0) as overdue_amount,
  -- Calculate financial impact of deactivation
  CASE
    WHEN fin.total_owed > 0 THEN 'Outstanding balance cleared'
    ELSE 'No outstanding balance'
  END as financial_impact
FROM children c
LEFT JOIN child_financial_summary fin ON c.id = fin.child_id
WHERE c.status IN ('INACTIVE', 'ARCHIVED');

-- Summary view for dashboard metrics
CREATE OR REPLACE VIEW financial_dashboard_summary AS
SELECT
  COUNT(CASE WHEN child_status = 'ACTIVE' THEN 1 END) as active_children,
  COUNT(CASE WHEN child_status IN ('INACTIVE', 'ARCHIVED') THEN 1 END) as inactive_children,
  COALESCE(SUM(CASE WHEN child_status = 'ACTIVE' THEN total_paid END), 0) as total_paid_active,
  COALESCE(SUM(CASE WHEN child_status = 'ACTIVE' THEN total_owed END), 0) as total_owed_active,
  COALESCE(SUM(CASE WHEN child_status IN ('INACTIVE', 'ARCHIVED') THEN total_paid END), 0) as total_paid_inactive,
  COALESCE(SUM(CASE WHEN child_status IN ('INACTIVE', 'ARCHIVED') THEN total_owed END), 0) as total_owed_inactive,
  COALESCE(SUM(overdue_amount), 0) as total_overdue_all
FROM child_financial_summary;

-- Note: Indexes cannot be created on regular views in PostgreSQL.
-- For performance optimization, consider materialized views or query-level optimizations if needed.

-- Grant permissions
GRANT SELECT ON active_children_financial TO authenticated;
GRANT SELECT ON deactivated_children_financial TO authenticated;
GRANT SELECT ON financial_dashboard_summary TO authenticated;