UPDATE users SET phone_number = '+111111111111111' WHERE phone_number IS NULL;

ALTER TABLE users
ALTER COLUMN phone_number SET NOT NULL;