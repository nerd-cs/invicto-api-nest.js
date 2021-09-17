CREATE TABLE door_timetable (
	id SERIAL NOT NULL,
	day TYPE_DAY_OF_WEEK NOT NULL,
	start_time TIME WITH TIME ZONE NULL,
	end_time TIME WITH TIME ZONE NULL,
	is_active BOOLEAN NOT NULL,
	door_id INT NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_door_timetable_door
	FOREIGN KEY (door_id)
	REFERENCES door(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_door_timetable_door_idx ON door_timetable(door_id ASC);

CREATE TABLE door_holiday (
	door_id INT NOT NULL,
	holiday_id INT NOT NULL,
	is_active BOOLEAN NOT NULL,
	PRIMARY KEY (door_id, holiday_id),
	CONSTRAINT fk_door_holiday_door
	FOREIGN KEY (door_id)
	REFERENCES door(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION,
	CONSTRAINT fk_door_holiday_holiday
	FOREIGN KEY (holiday_id)
	REFERENCES holiday(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_door_holiday_door_idx ON door_holiday(door_id ASC);
CREATE INDEX fk_door_holiday_holiday_idx ON door_holiday(holiday_id ASC);

CREATE TABLE door_holiday_timetable (
	id SERIAL NOT NULL,
	door_id INT NOT NULL,
	holiday_id INT NOT NULL,
	start_time TIME WITH TIME ZONE NULL,
	end_time TIME WITH TIME ZONE NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_door_holiday_timetable_door_holiday
	FOREIGN KEY (door_id, holiday_id)
	REFERENCES door_holiday(door_id, holiday_id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_door_holiday_timetable_door_holiday_idx ON door_holiday_timetable(door_id, holiday_id ASC);