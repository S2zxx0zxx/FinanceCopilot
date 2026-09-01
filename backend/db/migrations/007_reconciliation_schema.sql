-- Migration 007 - PHASE 4 - RECONCILIATION SCHEMA
-- Creates the relationship graph tables required by Phase 4.
-- Replaces the need for legacy group IDs in the transactions table per Rule 23.

CREATE TABLE reconciliation_runs (
    run_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(user_id),
    reconciliation_version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started','completed','failed')),
    records_examined INTEGER NOT NULL DEFAULT 0,
    matches_found INTEGER NOT NULL DEFAULT 0,
    reviews_created INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_log TEXT
);
CREATE INDEX idx_recon_runs_tenant ON reconciliation_runs(tenant_id, started_at DESC);

CREATE TABLE transaction_relationships (
    relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(user_id),
    source_transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    target_transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('duplicate', 'transfer', 'settlement', 'refund', 'reversal', 'posting')),
    status TEXT NOT NULL CHECK (status IN ('candidate', 'confirmed', 'rejected', 'needs_review', 'conflict')),
    
    reconciliation_version TEXT NOT NULL,
    reconciliation_run_id UUID REFERENCES reconciliation_runs(run_id),
    
    confidence_score NUMERIC(4,3) CHECK (confidence_score BETWEEN 0 AND 1),
    evidence JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_tx_relationship UNIQUE (source_transaction_id, target_transaction_id, relationship_type)
);
CREATE INDEX idx_tx_rel_source ON transaction_relationships(source_transaction_id);
CREATE INDEX idx_tx_rel_target ON transaction_relationships(target_transaction_id);
CREATE INDEX idx_tx_rel_type ON transaction_relationships(relationship_type, status);

CREATE TABLE review_items (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(user_id),
    
    relationship_id UUID REFERENCES transaction_relationships(relationship_id),
    transaction_id UUID REFERENCES transactions(transaction_id),
    
    reason_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'rejected', 'escalated')),
    
    evidence JSONB,
    score NUMERIC(4,3),
    
    resolver_id UUID REFERENCES users(user_id),
    resolution_event JSONB,
    resolved_at TIMESTAMPTZ,
    
    reconciliation_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reviews_tenant_status ON review_items(tenant_id, status);

CREATE TABLE correction_events (
    correction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES users(user_id),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('transaction_relationship', 'transaction', 'review_item')),
    entity_id UUID NOT NULL,
    
    actor_id UUID NOT NULL REFERENCES users(user_id),
    reason TEXT NOT NULL,
    
    before_state JSONB NOT NULL,
    after_state JSONB NOT NULL,
    
    reconciliation_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_corrections_entity ON correction_events(entity_type, entity_id);

-- Enforce that a transaction cannot be a duplicate of itself
ALTER TABLE transaction_relationships
ADD CONSTRAINT chk_not_self_referencing CHECK (source_transaction_id != target_transaction_id);
