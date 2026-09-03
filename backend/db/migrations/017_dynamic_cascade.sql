-- Migration 017 - Dynamic Cascade Delete
-- Dynamically adds ON DELETE CASCADE to all foreign keys referencing users(user_id)

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT 
            tc.table_name,
            kcu.column_name,
            tc.constraint_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_schema = 'public'
          AND EXISTS (
              SELECT 1 FROM information_schema.constraint_column_usage AS ccu
              WHERE ccu.constraint_name = tc.constraint_name
                AND ccu.table_name = 'users'
                AND ccu.column_name = 'user_id'
          )
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
        EXECUTE 'ALTER TABLE ' || quote_ident(r.table_name) || ' ADD CONSTRAINT ' || quote_ident(r.constraint_name) || ' FOREIGN KEY (' || quote_ident(r.column_name) || ') REFERENCES users(user_id) ON DELETE CASCADE';
    END LOOP;
END $$;
