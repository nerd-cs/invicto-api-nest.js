CREATE TABLE department (
    id SERIAL NOT NULL,
    name VARCHAR NOT NULL,
    is_cost_center BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    company_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (company_id, name),
    CONSTRAINT fk_department_company
    FOREIGN KEY (company_id)
    REFERENCES company(id)
    ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_department_company_idx ON department(company_id ASC);
CREATE UNIQUE INDEX department_u_name_company_idx ON department(name, company_id ASC);

UPDATE users
SET department = NULL;

ALTER TABLE users 
RENAME COLUMN department TO department_id;

ALTER TABLE users
ALTER COLUMN department_id SET DATA TYPE INT USING department_id::integer;

ALTER TABLE users
ADD COLUMN cost_center_id INT NULL;

ALTER TABLE users
ADD CONSTRAINT fk_users_department
FOREIGN KEY (department_id)
REFERENCES department(id)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
ADD CONSTRAINT fk_users_cost_center
FOREIGN KEY (cost_center_id)
REFERENCES department(id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

CREATE INDEX fk_users_department_idx ON users(department_id ASC);
CREATE INDEX fk_users_cost_center_idx ON users(cost_center_id ASC);

