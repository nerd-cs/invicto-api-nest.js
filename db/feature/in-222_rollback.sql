DELETE
FROM role_permission AS rp
USING role AS r
WHERE rp.role_id = r.id AND (r.value = 'ADMIN' OR r.value = 'SUPER_ADMIN');

INSERT INTO role_permission
SELECT id, 'ALL_ACCESS'
FROM role
WHERE value = 'ADMIN';

UPDATE user_role 
SET role_id = (SELECT id FROM role WHERE value = 'ADMIN')
FROM role
WHERE role.value = 'SUPER_ADMIN'
AND user_role.role_id = role.id;

DELETE
FROM role
WHERE value = 'SUPER_ADMIN';

ALTER TYPE TYPE_ROLE RENAME TO TYPE_ROLE_OLD;

CREATE TYPE TYPE_ROLE AS ENUM ('GUEST', 'MEMBER', 'ADMIN', 'SECURITY', 'USER_MANAGER', 'FRONT_DESK');

ALTER TABLE role
    ALTER COLUMN value TYPE TYPE_ROLE USING value::text::TYPE_ROLE;

DROP TYPE TYPE_ROLE_OLD CASCADE;

ALTER TYPE TYPE_PERMISSION RENAME TO TYPE_PERMISSION_OLD;

CREATE TYPE TYPE_PERMISSION AS ENUM ('BUILDING_ACCESS', 'ACCOUNT_MANAGEMENT', 'CARD_REQUEST', 'READ_ACTIVITY', 'USER_MANAGEMENT', 'KEY_MANAGEMENT', 'ALL_ACCESS');

ALTER TABLE role_permission
    ALTER COLUMN permission TYPE TYPE_PERMISSION USING permission::text::TYPE_PERMISSION;

DROP TYPE TYPE_PERMISSION_OLD CASCADE;

ALTER TABLE users
ADD COLUMN company_id INT NULL,
ADD CONSTRAINT fk_users_company
FOREIGN KEY (company_id)
REFERENCES company(id)
ON UPDATE NO ACTION
ON DELETE NO ACTION;

CREATE INDEX fk_users_company_idx ON users (company_id ASC);

UPDATE users
SET company_id = user_company.company_id
FROM user_company
WHERE user_company.user_id = users.id AND user_company.is_main IS TRUE;

ALTER TABLE users
ALTER COLUMN company_id SET NOT NULL;

DROP TABLE user_company;

ALTER TABLE company
DROP COLUMN address,
DROP COLUMN city,
DROP COLUMN postal_code,
DROP COLUMN country,
DROP COLUMN created_at;