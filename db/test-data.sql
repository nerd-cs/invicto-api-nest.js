DELETE FROM user_role;
DELETE FROM role;
DELETE FROM users;
DELETE FROM access_group;
DELETE FROM location;
DELETE FROM company;

INSERT INTO company(id, name, address, city, postal_code, country)
VALUES(default, 'Desjardins', '101-211 King Street', 'Montreal', 'H1x 3K9', 'Canada');

INSERT INTO role(value)
SELECT unnest(enum_range(NULL::type_role));

INSERT INTO role_permission
SELECT id, 'BUILDING_ACCESS'
FROM role
WHERE value = 'GUEST';

INSERT INTO role_permission
SELECT id, 'ALL_ACCESS'
FROM role
WHERE value = 'SUPER_ADMIN';

INSERT INTO role_permission
SELECT id, UNNEST(ARRAY['ACCOUNT_MANAGEMENT'::TYPE_PERMISSION,
                        'ACTIVITY_MANAGEMENT'::TYPE_PERMISSION,
                        'USER_MANAGEMENT'::TYPE_PERMISSION,
                        'KEY_MANAGEMENT'::TYPE_PERMISSION,
                        'ACCESS_CONTROL_MANAGEMENT'::TYPE_PERMISSION,
                        'HARDWARE_MANAGEMENT'::TYPE_PERMISSION])
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

INSERT INTO users(id,
                  full_name,
                  email,
                  phone_number,
                  password,
                  status)
VALUES (default,
        'John Doe',
        'johndoe@example.com',
        '+15145866598',
        '$2a$05$Z62.QHKSgWQIXjAqAWDLOedgerEXvz0ob5AADEu/3L9LtomloNGV.',
        'ACTIVE');

INSERT INTO user_role
SELECT CURRVAL(pg_get_serial_sequence('users','id')), id
FROM role
WHERE value = 'SUPER_ADMIN';

INSERT INTO user_company
VALUES(CURRVAL(pg_get_serial_sequence('users','id')), CURRVAL(pg_get_serial_sequence('company','id')), true);

INSERT INTO users(id,
                  full_name,
                  email,
                  phone_number,
                  password,
                  status)
VALUES (default,
        'Test',
        'test@test.com',
        '+15145866598',
        '$2y$12$BbwIaaySC0QfrDRMa2u2p.FdqPt9MDV.r1fbQj/qzznmjKfyT.aw.',
        'ACTIVE');

INSERT INTO user_role
SELECT CURRVAL(pg_get_serial_sequence('users','id')), id
FROM role
WHERE value = 'SUPER_ADMIN';

INSERT INTO user_company
VALUES(CURRVAL(pg_get_serial_sequence('users','id')), CURRVAL(pg_get_serial_sequence('company','id')), true);

INSERT INTO location(id, name, company_id)
VALUES(default, 'Quebec Office', CURRVAL(pg_get_serial_sequence('company','id'))),
	   (default, 'Quebec HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		(default, 'Montreal HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		 (default, 'Trois-Rivieres HQ', CURRVAL(pg_get_serial_sequence('company','id')));

INSERT INTO access_group(id, name, location_id)
VALUES (default, 'Lobby', 2),
(default, 'Main Entrance', 2),
(default, 'Garage', 2);

insert into door(id, name, status, location_id)
values (default, 'Door 1', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
       (default, 'Door 2', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 3', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 4', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 5', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 6', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 7', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 8', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 9', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 10', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 11', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 12', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 13', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 14', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 15', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
        (default, 'Door 16', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1);

insert into controller(id, name, status, location_id)
values (default, 'Controller 1', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 1),
       (default, 'Controller 2', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 2),
	   (default, 'Controller 3', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 3),
	   (default, 'Controller 4', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 4);