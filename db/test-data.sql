DELETE FROM user_role;
DELETE FROM role;
DELETE FROM users;

INSERT INTO role(value)
SELECT unnest(enum_range(NULL::type_role));

INSERT INTO users(id,
                  full_name,
                  email,
                  phone_number,
                  password)
VALUES (default,
        'John Doe',
        'johndoe@example.com',
        '+15145866598',
        '$2a$05$Z62.QHKSgWQIXjAqAWDLOedgerEXvz0ob5AADEu/3L9LtomloNGV.');

INSERT INTO user_role
SELECT CURRVAL(pg_get_serial_sequence('users','id')), id
FROM role
WHERE value = 'ADMIN';


