UPDATE timetable SET start_time = '12:00 AM' WHERE start_time IS NULL;
UPDATE timetable SET end_time = '12:00 AM' WHERE end_time IS NULL;

ALTER TABLE timetable
ALTER COLUMN start_time SET NOT NULL,
ALTER COLUMN end_time SET NOT NULL;
