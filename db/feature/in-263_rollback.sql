UPDATE users
SET department_id = NULL;

ALTER TABLE users
DROP COLUMN cost_center_id,
DROP CONSTRAINT fk_users_department;

DROP INDEX fk_users_department_idx;

ALTER TABLE users
RENAME COLUMN department_id TO department;

ALTER TABLE users
ALTER COLUMN department SET DATA TYPE VARCHAR USING department::varchar;

DROP TABLE department;