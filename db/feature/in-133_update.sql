ALTER TABLE users
ADD COLUMN department varchar NULL,
ADD COLUMN updated_by int NULL,
ADD CONSTRAINT fk_users_users
	FOREIGN KEY(updated_by)
	REFERENCES users(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION;

CREATE INDEX fk_users_users_idx ON users(updated_by ASC);

ALTER TABLE user_access_group
ADD COLUMN is_active boolean NOT NULL DEFAULT TRUE;

ALTER TABLE access_group
DROP COLUMN is_active;