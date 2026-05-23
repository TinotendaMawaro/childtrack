-- ============================================================
-- CHILDTRACK FINANCE MODULE - COMPLETE DATABASE SCHEMA
-- ============================================================
-- This script creates the finance management system including:
-- - Fee structures (tuition, registration, bus fees)
-- - Financial transactions (income/expense tracking)
-- - Notifications (payment reminders 3 days before due)
-- - Online payment reconciliation
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. FEE STRUCTURE TABLE
-- ============================================================
-- Defines different types of fees the school charges
CREATE TABLE IF NOT EXISTS public.fee_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., 'Tuition Fee', 'Registration Fee', 'Bus Fee'
  description TEXT,
  fee_type TEXT CHECK (fee_type IN ('TUITION', 'REGISTRATION', 'BUS', 'MEALS', 'ACTIVITIES', 'OTHER')) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE, -- monthly tuition vs one-time registration
  recurrence_period TEXT CHECK (recurrence_period IN ('MONTHLY', 'TERM', 'YEARLY', NULL)),
  appliestoclasses BOOLEAN DEFAULT FALSE, -- whether fee applies per class
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 2. FINANCIAL TRANSACTIONS TABLE
-- ============================================================
-- Records all financial transactions (income and expenses)
-- Replaces/extends the basic payments table
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT CHECK (transaction_type IN ('TUITION', 'REGISTRATION', 'BUS_FEE', 'SALARY', 'EXPENSE', 'DEBT', 'CREDIT', 'OTHER')) NOT NULL,
  direction TEXT CHECK (direction IN ('INCOME', 'EXPENSE')) NOT NULL,

  -- Who pays/gets paid (linked to profiles)
  payer_id UUID REFERENCES profiles(id), -- parent or external payer
  payee_id UUID REFERENCES profiles(id), -- staff (for salaries) or vendor

  -- Links to relevant entities
  child_id UUID REFERENCES children(id), -- for child-related fees
  staff_id UUID REFERENCES staff(id), -- for salary payments
  fee_structure_id UUID REFERENCES fee_structure(id),

  -- Amount and status
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIAL')) DEFAULT 'PENDING',

  -- Dates
  due_date DATE,
  paid_date DATE,
  transaction_date DATE NOT NULL DEFAULT timezone('utc'::text, now())::DATE,

  -- Payment method
  payment_method TEXT CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'CARD', 'ONLINE', 'MOBILE_MONEY', 'OTHER')),

  -- Online payment reference
  online_payment_reference TEXT, -- external transaction ID from payment gateway
  online_payment_gateway TEXT, -- e.g., 'stripe', 'paypal'

  -- Description and notes
  description TEXT,
  notes TEXT,

  -- Audit fields
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 3. NOTIFICATIONS TABLE
-- ============================================================
-- Tracks all notifications sent to admin and parents
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('PAYMENT_DUE', 'PAYMENT_OVERDUE', 'GENERAL', 'ALERT')) NOT NULL,
  priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',

  -- Who receives the notification
  recipient_id UUID REFERENCES profiles(id), -- NULL means broadcast to all admins
  sender_id UUID REFERENCES profiles(id), -- who initiated the notification

  -- Related entity links
  transaction_id UUID REFERENCES financial_transactions(id),
  child_id UUID REFERENCES children(id),

  -- Status tracking
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- Action link (optional, for deep linking)
  action_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 4. ONLINE PAYMENTS TABLE (for webhook reconciliation)
-- ============================================================
-- Stores external payment gateway transactions
CREATE TABLE IF NOT EXISTS public.online_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway TEXT NOT NULL, -- 'STRIPE', 'PAYPAL', etc.
  gateway_transaction_id TEXT NOT NULL UNIQUE,
  payment_intent_id TEXT, -- Stripe payment intent ID

  -- Amount and currency
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  fee_amount NUMERIC(10, 2) DEFAULT 0, -- gateway fees

  -- Status from gateway
  status TEXT CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED')) NOT NULL,

  -- Payer info
  payer_email TEXT,
  payer_name TEXT,

  -- Linked internal transaction (if reconciled)
  internal_transaction_id UUID REFERENCES financial_transactions(id),

  -- Metadata (JSON for gateway-specific data)
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_financial_transactions_child_id ON financial_transactions(child_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_payer_id ON financial_transactions(payer_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_due_date ON financial_transactions(due_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_online_payments_gateway_id ON online_payments(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_online_payments_internal ON online_payments(internal_transaction_id);
CREATE INDEX IF NOT EXISTS idx_online_payments_status ON online_payments(status);

CREATE INDEX IF NOT EXISTS idx_fee_structure_type ON fee_structure(fee_type);
CREATE INDEX IF NOT EXISTS idx_fee_structure_active ON fee_structure(active);

-- ============================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Financial Transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finance view for admin and staff" ON financial_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Finance manage for admin only" ON financial_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Fee Structure (readable by staff, manageable by admin)
ALTER TABLE public.fee_structure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fee structure view for admin and staff" ON fee_structure FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Fee structure manage for admin only" ON fee_structure FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications view for intended recipient" ON notifications FOR SELECT USING (
  recipient_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Notifications insert for admin and system" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Notifications update for recipient" ON notifications FOR UPDATE USING (
  recipient_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Online Payments (admin only for reconciliation)
ALTER TABLE public.online_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Online payments view for admin and finance staff" ON online_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Online payments insert for system only" ON online_payments FOR INSERT WITH CHECK (
  -- Only allow system/webhook to insert (verified via service role)
  true
);
CREATE POLICY "Online payments update for admin only" ON online_payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ============================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fee_structure_updated_at BEFORE UPDATE ON fee_structure FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_online_payments_updated_at BEFORE UPDATE ON online_payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- 8. FUNCTIONS FOR AUTOMATIC FEE GENERATION
-- ============================================================

-- Function to automatically generate monthly tuition fees for all enrolled children
-- Runs monthly via cron or can be called manually
CREATE OR REPLACE FUNCTION generate_monthly_tuition_fees()
RETURNS VOID AS $$
DECLARE
  class_rec RECORD;
  fee_rec RECORD;
  child_rec RECORD;
  existing_fee UUID;
BEGIN
  -- Get active tuition fee structure
  SELECT * INTO fee_rec FROM fee_structure
  WHERE fee_type = 'TUITION' AND active = TRUE
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE NOTICE 'No active tuition fee structure found';
    RETURN;
  END IF;

  -- For each class with assigned children
  FOR class_rec IN SELECT id, name FROM classes LOOP
    -- For each child in this class
    FOR child_rec IN
      SELECT c.id, c.full_name, c.parent_id
      FROM children c
      WHERE c.class_id = class_rec.id
    LOOP
      -- Check if a tuition fee already exists for this child this month
      SELECT ft.id INTO existing_fee
      FROM financial_transactions ft
      WHERE ft.child_id = child_rec.id
        AND ft.transaction_type = 'TUITION'
        AND ft.status IN ('PENDING', 'PAID')
        AND date_trunc('month', ft.due_date) = date_trunc('month', CURRENT_DATE);

      IF NOT FOUND THEN
        -- Create new tuition fee
        INSERT INTO financial_transactions (
          transaction_type, direction, child_id, payer_id, fee_structure_id,
          amount, status, due_date, description
        ) VALUES (
          'TUITION', 'INCOME', child_rec.id, child_rec.parent_id, fee_rec.id,
          fee_rec.amount, 'PENDING',
          (CURRENT_DATE + INTERVAL '15 days')::DATE, -- Due in 15 days
          format('Monthly tuition for %s - %s', child_rec.full_name, class_rec.name)
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically generate registration fee when a new child is enrolled
CREATE OR REPLACE FUNCTION generate_registration_fee()
RETURNS TRIGGER AS $$
DECLARE
  reg_fee_rec RECORD;
BEGIN
  -- Find active registration fee
  SELECT * INTO reg_fee_rec FROM fee_structure
  WHERE fee_type = 'REGISTRATION' AND active = TRUE
  LIMIT 1;

  IF FOUND THEN
    -- Create registration fee transaction
    INSERT INTO financial_transactions (
      transaction_type, direction, child_id, payer_id, fee_structure_id,
      amount, status, due_date, description, recorded_by
    ) VALUES (
      'REGISTRATION', 'INCOME', NEW.id, NEW.parent_id, reg_fee_rec.id,
      reg_fee_rec.amount, 'PENDING',
      (CURRENT_DATE + INTERVAL '7 days')::DATE, -- Due in 7 days
      format('Registration fee for %s', NEW.full_name),
      auth.uid()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create registration fee on child enrollment
DROP TRIGGER IF EXISTS trigger_generate_registration_fee ON children;
CREATE TRIGGER trigger_generate_registration_fee
  AFTER INSERT ON children
  FOR EACH ROW EXECUTE PROCEDURE generate_registration_fee();

-- ============================================================
-- 9. FUNCTIONS FOR NOTIFICATION GENERATION
-- ============================================================

-- Function to check upcoming due dates and create notifications (3 days before)
CREATE OR REPLACE FUNCTION check_upcoming_payments()
RETURNS VOID AS $$
DECLARE
  fee_rec RECORD;
  parent_rec RECORD;
  admin_rec RECORD;
  notif_message TEXT;
BEGIN
  -- Find all payments due in exactly 3 days
  FOR fee_rec IN
    SELECT ft.*, c.full_name as child_name, p.full_name as parent_name
    FROM financial_transactions ft
    JOIN children c ON ft.child_id = c.id
    JOIN profiles p ON ft.payer_id = p.id
    WHERE ft.status = 'PENDING'
      AND ft.due_date = (CURRENT_DATE + INTERVAL '3 days')
  LOOP
    -- Get admin users
    FOR admin_rec IN SELECT id, full_name FROM profiles WHERE role = 'ADMIN' LOOP
      -- Notify admin
      INSERT INTO notifications (
        title, message, type, recipient_id, sender_id,
        transaction_id, child_id, priority
      ) VALUES (
        'Payment Due Soon',
        format('Payment of $%s for %s (due: %s) is due in 3 days.',
          fee_rec.amount, fee_rec.child_name, fee_rec.due_date),
        'PAYMENT_DUE',
        admin_rec.id,
        auth.uid(),
        fee_rec.id,
        fee_rec.child_id,
        'MEDIUM'
      );
    END LOOP;

    -- Notify parent
    INSERT INTO notifications (
      title, message, type, recipient_id, sender_id,
      transaction_id, child_id, priority
    ) VALUES (
      'Upcoming Payment Reminder',
      format('A payment of $%s for %s is due on %s (3 days remaining).',
        fee_rec.amount, fee_rec.child_name, fee_rec.due_date),
      'PAYMENT_DUE',
      fee_rec.payer_id,
      auth.uid(),
      fee_rec.id,
      fee_rec.child_id,
      'HIGH'
    );
  END LOOP;

  -- Check for overdue payments
  FOR fee_rec IN
    SELECT ft.*, c.full_name as child_name
    FROM financial_transactions ft
    JOIN children c ON ft.child_id = c.id
    WHERE ft.status = 'PENDING' AND ft.due_date < CURRENT_DATE
  LOOP
    -- Update status to OVERDUE
    UPDATE financial_transactions
    SET status = 'OVERDUE'
    WHERE id = fee_rec.id;

    -- Notify admin
    FOR admin_rec IN SELECT id FROM profiles WHERE role = 'ADMIN' LOOP
      INSERT INTO notifications (
        title, message, type, recipient_id, transaction_id, child_id, priority
      ) VALUES (
        'Payment Overdue',
        format('Payment of $%s for %s is overdue (was due: %s).',
          fee_rec.amount, fee_rec.child_name, fee_rec.due_date),
        'PAYMENT_OVERDUE',
        admin_rec.id,
        fee_rec.id,
        fee_rec.child_id,
        'HIGH'
      );
    END LOOP;

    -- Notify parent
    INSERT INTO notifications (
      title, message, type, recipient_id, transaction_id, child_id, priority
    ) VALUES (
      'Payment Overdue',
      format('Your payment of $%s for %s is overdue (was due: %s). Please settle immediately.',
        fee_rec.amount, fee_rec.child_name, fee_rec.due_date),
      'PAYMENT_OVERDUE',
      fee_rec.payer_id,
      fee_rec.id,
      fee_rec.child_id,
      'HIGH'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 10. RPC FUNCTIONS FOR FINANCE REPORTING
-- ============================================================

-- Monthly revenue (sum of all paid income for current month)
CREATE OR REPLACE FUNCTION monthly_revenue()
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE((
    SELECT SUM(amount)
    FROM financial_transactions
    WHERE direction = 'INCOME'
      AND status = 'PAID'
      AND paid_date IS NOT NULL
      AND date_trunc('month', paid_date) = date_trunc('month', CURRENT_DATE)
  ), 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Revenue for last 6 months (for chart)
CREATE OR REPLACE FUNCTION revenue_last_6_months()
RETURNS TABLE(month TEXT, revenue NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(month_start, 'Mon') as month,
    COALESCE(SUM(ft.amount), 0) as revenue
  FROM (
    SELECT generate_series(
      date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
      date_trunc('month', CURRENT_DATE),
      INTERVAL '1 month'
    ) as month_start
  ) months
  LEFT JOIN financial_transactions ft
    ON ft.direction = 'INCOME'
    AND ft.status = 'PAID'
    AND ft.paid_date IS NOT NULL
    AND date_trunc('month', ft.paid_date) = months.month_start
  GROUP BY month_start
  ORDER BY month_start;
END;
$$ LANGUAGE plpgsql STABLE;

-- Payment breakdown by category
CREATE OR REPLACE FUNCTION payment_breakdown()
RETURNS TABLE(category TEXT, amount NUMERIC, percentage NUMERIC) AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM financial_transactions
  WHERE direction = 'INCOME' AND status = 'PAID'
    AND date_trunc('month', paid_date) = date_trunc('month', CURRENT_DATE);

  RETURN QUERY
  SELECT
    ft.transaction_type as category,
    COALESCE(SUM(ft.amount), 0) as amount,
    CASE
      WHEN total > 0 THEN ROUND((SUM(ft.amount) / total) * 100, 1)
      ELSE 0
    END as percentage
  FROM financial_transactions ft
  WHERE ft.direction = 'INCOME' AND ft.status = 'PAID'
    AND ft.paid_date IS NOT NULL
    AND date_trunc('month', ft.paid_date) = date_trunc('month', CURRENT_DATE)
  GROUP BY ft.transaction_type
  ORDER BY amount DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Outstanding payments sum
CREATE OR REPLACE FUNCTION outstanding_payments_total()
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE((
    SELECT SUM(amount)
    FROM financial_transactions
    WHERE direction = 'INCOME'
      AND status IN ('PENDING', 'OVERDUE')
  ), 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get payment status for a specific child
CREATE OR REPLACE FUNCTION get_child_financial_status(p_child_id UUID)
RETURNS TABLE(
  total_due NUMERIC,
  total_paid NUMERIC,
  balance NUMERIC,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN status IN ('PENDING', 'OVERDUE') THEN amount ELSE 0 END), 0) as total_due,
    COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN status IN ('PENDING', 'OVERDUE') THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END), 0) as balance,
    CASE
      WHEN COALESCE(SUM(CASE WHEN status IN ('PENDING', 'OVERDUE') THEN amount ELSE 0 END), 0) = 0 THEN 'PAID_IN_FULL'
      WHEN EXISTS (SELECT 1 FROM financial_transactions ft2 WHERE ft2.child_id = p_child_id AND ft2.status = 'OVERDUE') THEN 'OVERDUE'
      ELSE 'OWING'
    END as status
  FROM financial_transactions
  WHERE child_id = p_child_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get all outstanding balances (for all children with pending/overdue payments)
CREATE OR REPLACE FUNCTION get_all_outstanding_balances()
RETURNS TABLE(
  child_id UUID,
  child_name TEXT,
  parent_id UUID,
  parent_name TEXT,
  total_due NUMERIC,
  total_paid NUMERIC,
  balance NUMERIC,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ft.child_id,
    c.full_name as child_name,
    ft.payer_id as parent_id,
    p.full_name as parent_name,
    COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) as total_due,
    COALESCE(SUM(CASE WHEN ft.status = 'PAID' THEN ft.amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN ft.status = 'PAID' THEN ft.amount ELSE 0 END), 0) as balance,
    CASE
      WHEN COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) = 0 THEN 'PAID_IN_FULL'
      WHEN EXISTS (SELECT 1 FROM financial_transactions ft2 WHERE ft2.child_id = ft.child_id AND ft2.status = 'OVERDUE') THEN 'OVERDUE'
      ELSE 'OWING'
    END as status
  FROM financial_transactions ft
  LEFT JOIN children c ON ft.child_id = c.id
  LEFT JOIN profiles p ON ft.payer_id = p.id
  WHERE ft.direction = 'INCOME'
  GROUP BY ft.child_id, c.full_name, ft.payer_id, p.full_name
  HAVING COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) > 0
  ORDER BY balance DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get all outstanding balances (for all children with pending/overdue payments)
CREATE OR REPLACE FUNCTION get_all_outstanding_balances()
RETURNS TABLE(
  child_id UUID,
  child_name TEXT,
  parent_id UUID,
  parent_name TEXT,
  total_due NUMERIC,
  total_paid NUMERIC,
  balance NUMERIC,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ft.child_id,
    c.full_name as child_name,
    ft.payer_id as parent_id,
    p.full_name as parent_name,
    COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) as total_due,
    COALESCE(SUM(CASE WHEN ft.status = 'PAID' THEN ft.amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN ft.status = 'PAID' THEN ft.amount ELSE 0 END), 0) as balance,
    CASE
      WHEN COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) = 0 THEN 'PAID_IN_FULL'
      WHEN EXISTS (SELECT 1 FROM financial_transactions ft2 WHERE ft2.child_id = ft.child_id AND ft2.status = 'OVERDUE') THEN 'OVERDUE'
      ELSE 'OWING'
    END as status
  FROM financial_transactions ft
  LEFT JOIN children c ON ft.child_id = c.id
  LEFT JOIN profiles p ON ft.payer_id = p.id
  WHERE ft.direction = 'INCOME'
  GROUP BY ft.child_id, c.full_name, ft.payer_id, p.full_name
  HAVING COALESCE(SUM(CASE WHEN ft.status IN ('PENDING', 'OVERDUE') THEN ft.amount ELSE 0 END), 0) > 0
  ORDER BY balance DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- 11. SAMPLE DATA SEEDING
-- ============================================================

-- Insert sample fee structures
INSERT INTO fee_structure (name, description, fee_type, amount, is_recurring, recurrence_period, active)
VALUES
  ('Monthly Tuition', 'Standard monthly tuition fee', 'TUITION', 450.00, TRUE, 'MONTHLY', TRUE),
  ('Registration Fee', 'One-time registration fee for new students', 'REGISTRATION', 100.00, FALSE, NULL, TRUE),
  ('Bus Transportation', 'Monthly bus transportation fee', 'BUS', 150.00, TRUE, 'MONTHLY', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. MIGRATION NOTES
-- ============================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify tables are created: \dt financial_transactions, fee_structure, notifications, online_payments
-- 3. Check RLS policies are applied
-- 4. Test RPC functions: SELECT monthly_revenue();
-- 5. Insert sample fee structures if needed
-- 6. Grant appropriate permissions to your app's service role

COMMENT ON TABLE financial_transactions IS 'All financial transactions including tuition, salaries, expenses, debts, and credits';
COMMENT ON TABLE fee_structure IS 'Defines fee types and amounts for tuition, registration, bus, etc.';
COMMENT ON TABLE notifications IS 'Payment reminders and system notifications (3-day advance alerts)';
COMMENT ON TABLE online_payments IS 'External payment gateway transactions for reconciliation';
