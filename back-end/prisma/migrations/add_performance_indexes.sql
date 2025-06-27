-- Add performance indexes for Real Estate SaaS

-- Index on apartment status for filtering
CREATE INDEX IF NOT EXISTS "idx_apartment_status" ON "Apartment"("status");

-- Index on apartment updatedAt for recent activity queries
CREATE INDEX IF NOT EXISTS "idx_apartment_updated_at" ON "Apartment"("updatedAt" DESC);

-- Composite index for user apartments (agent performance queries)
CREATE INDEX IF NOT EXISTS "idx_apartment_user_status" ON "Apartment"("userId", "status");

-- Index on project apartments relationship
CREATE INDEX IF NOT EXISTS "idx_apartment_project" ON "Apartment"("projectId");

-- Index on client apartments relationship
CREATE INDEX IF NOT EXISTS "idx_apartment_client" ON "Apartment"("clientId");

-- Index on user role for agent/admin queries
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "User"("role");

-- Index on user email for authentication
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"("email");

-- Index on task status for kanban queries
CREATE INDEX IF NOT EXISTS "idx_task_status" ON "Task"("status");

-- Index on task createdAt for recent tasks
CREATE INDEX IF NOT EXISTS "idx_task_created_at" ON "Task"("createdAt" DESC);

-- Index on client status for filtering
CREATE INDEX IF NOT EXISTS "idx_client_status" ON "Client"("status");

-- Index on monthly target dates for current target lookup
CREATE INDEX IF NOT EXISTS "idx_monthly_target_dates" ON "monthlyTarget"("startDate", "endDate");
