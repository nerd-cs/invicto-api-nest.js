DELETE FROM user_role;
DELETE FROM role;
DELETE FROM users;
DELETE FROM access_group;
DELETE FROM location;
DELETE FROM company;

INSERT INTO company(id, name) VALUES(default, 'Desjardins');

INSERT INTO role(value)
SELECT unnest(enum_range(NULL::type_role));

INSERT INTO users(id,
                  full_name,
                  email,
                  phone_number,
                  password,
                  company_id)
VALUES (default,
        'John Doe',
        'johndoe@example.com',
        '+15145866598',
        '$2a$05$Z62.QHKSgWQIXjAqAWDLOedgerEXvz0ob5AADEu/3L9LtomloNGV.',
        CURRVAL(pg_get_serial_sequence('company','id')));

INSERT INTO user_role
SELECT CURRVAL(pg_get_serial_sequence('users','id')), id
FROM role
WHERE value = 'ADMIN';

INSERT INTO location(id, name, company_id)
VALUES(default, 'Quebec Office', CURRVAL(pg_get_serial_sequence('company','id'))),
	   (default, 'Quebec HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		(default, 'Montreal HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		 (default, 'Trois-Rivieres HQ', CURRVAL(pg_get_serial_sequence('company','id')));

INSERT INTO access_group(id, name, location_id)
VALUES (default, 'Lobby', 2),
(default, 'Main Entrance', 2),
(default, 'Garage', 2);