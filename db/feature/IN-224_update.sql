CREATE TABLE holiday_timetable (
	id SERIAL NOT NULL,
	schedule_id INT NOT NULL,
	holiday_id INT NOT NULL,
	start_time TIME WITH TIME ZONE NULL,
	end_time TIME WITH TIME ZONE NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_holiday_timetable_schedule_holiday
	FOREIGN KEY (schedule_id, holiday_id)
	REFERENCES schedule_holiday(schedule_id, holiday_id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_holiday_timetable_schedule_holiday_idx ON holiday_timetable(schedule_id, holiday_id ASC);