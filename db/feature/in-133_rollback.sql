ALTER TABLE users
DROP COLUMN department,
DROP COLUMN updated_by;

ALTER TABLE user_access_group
DROP COLUMN is_active;

ALTER TABLE access_group
ADD COLUMN is_active boolean NOT NULL DEFAULT TRUE;