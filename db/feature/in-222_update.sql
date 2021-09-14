ALTER TYPE TYPE_ROLE ADD VALUE 'SUPER_ADMIN';

ALTER TYPE TYPE_PERMISSION ADD VALUE 'COMPANY_MANAGEMENT';
ALTER TYPE TYPE_PERMISSION ADD VALUE 'ACCESS_CONTROL_MANAGEMENT';
ALTER TYPE TYPE_PERMISSION ADD VALUE 'HARDWARE_MANAGEMENT';
ALTER TYPE TYPE_PERMISSION ADD VALUE 'ACTIVITY_MANAGEMENT';

DELETE
FROM role_permission AS rp
USING role AS r
WHERE rp.role_id = r.id AND r.value = 'ADMIN';

INSERT INTO role_permission
SELECT id, UNNEST(ARRAY['ACCOUNT_MANAGEMENT'::TYPE_PERMISSION,
                        'ACTIVITY_MANAGEMENT'::TYPE_PERMISSION,
                        'USER_MANAGEMENT'::TYPE_PERMISSION,
                        'KEY_MANAGEMENT'::TYPE_PERMISSION,
                        'ACCESS_CONTROL_MANAGEMENT'::TYPE_PERMISSION,
                        'HARDWARE_MANAGEMENT'::TYPE_PERMISSION])
FROM role
WHERE value = 'ADMIN';

INSERT INTO role VALUES (DEFAULT, 'SUPER_ADMIN');

INSERT INTO role_permission
SELECT id, 'ALL_ACCESS'
FROM role
WHERE value = 'SUPER_ADMIN';

CREATE TABLE user_company (
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    is_main BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, company_id),
    CONSTRAINT fk_user_company_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT fk_user_company_company
    FOREIGN KEY (company_id)
    REFERENCES company(id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
CREATE INDEX fk_user_company_user_idx ON user_company(user_id ASC);
CREATE INDEX fk_user_company_company_idx ON user_company(company_id ASC);

INSERT INTO user_company
SELECT id, company_id, true
FROM users;

ALTER TABLE users
DROP COLUMN company_id;