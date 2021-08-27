ALTER TYPE TYPE_ROLE RENAME TO TYPE_ROLE_OLD;

CREATE TYPE TYPE_ROLE AS ENUM ('GUEST', 'MEMBER', 'ADMIN', 'SECURITY', 'USER_MANAGER', 'FRONT_DESK');

ALTER TABLE user_role ALTER COLUMN role_id DROP NOT NULL;

UPDATE user_role 
SET role_id = NULL
FROM role
WHERE role.value = 'TIER_ADMIN'
AND user_role.role_id = role.id;

DELETE
FROM role
WHERE value = 'TIER_ADMIN';

ALTER TABLE role
    ALTER COLUMN value TYPE TYPE_ROLE USING value::text::TYPE_ROLE;

DROP TYPE TYPE_ROLE_OLD CASCADE;

INSERT INTO role VALUES (DEFAULT, 'SECURITY'), (DEFAULT, 'USER_MANAGER'), (DEFAULT, 'FRONT_DESK');

UPDATE user_role 
SET role_id = (SELECT id FROM role WHERE value = 'FRONT_DESK')
WHERE role_id IS NULL;

ALTER TABLE user_role ALTER COLUMN role_id SET NOT NULL;

CREATE TYPE TYPE_PERMISSION as ENUM ('BUILDING_ACCESS', 'ACCOUNT_MANAGEMENT', 'CARD_REQUEST', 'READ_ACTIVITY', 'USER_MANAGEMENT', 'KEY_MANAGEMENT', 'ALL_ACCESS');

CREATE TABLE role_permission (
    role_id int NOT NULL,
    permission TYPE_PERMISSION NOT NULL,
    PRIMARY KEY (role_id, permission),
    CONSTRAINT fk_role_permission_permission
	FOREIGN KEY (role_id)
	REFERENCES role(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_role_permission_permission_idx ON role_permission(role_id ASC);

INSERT INTO role_permission
SELECT id, 'BUILDING_ACCESS'
FROM role
WHERE value = 'GUEST';

INSERT INTO role_permission
SELECT id, 'ALL_ACCESS'
FROM role
WHERE value = 'ADMIN';

INSERT INTO role_permission
SELECT id, UNNEST(ARRAY['BUILDING_ACCESS'::TYPE_PERMISSION, 'ACCOUNT_MANAGEMENT'::TYPE_PERMISSION, 'CARD_REQUEST'::TYPE_PERMISSION])
FROM role
WHERE value = 'MEMBER';

INSERT INTO role_permission
SELECT id, UNNEST(ARRAY['ACCOUNT_MANAGEMENT'::TYPE_PERMISSION, 'READ_ACTIVITY'::TYPE_PERMISSION, 'USER_MANAGEMENT'::TYPE_PERMISSION, 'KEY_MANAGEMENT'::TYPE_PERMISSION])
FROM role
WHERE value = 'SECURITY' OR value = 'USER_MANAGER';

INSERT INTO role_permission
SELECT id, UNNEST(ARRAY['ACCOUNT_MANAGEMENT'::TYPE_PERMISSION, 'READ_ACTIVITY'::TYPE_PERMISSION])
FROM role
WHERE value = 'FRONT_DESK';
