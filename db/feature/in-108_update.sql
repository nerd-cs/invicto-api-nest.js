-- schedule
create table schedule (
	id serial not null,
	name varchar not null,
	description varchar null,
	updated_at timestamp with time zone DEFAULT now() NOT NULL,
	access_group_id int null,
	primary key (id),
	unique(name),
	constraint fk_schedule_access_group
	foreign key (access_group_id)
	references access_group(id)
	on delete no action
	on update no action
);
create index fk_schedule_access_group_idx on schedule(access_group_id asc);
create unique index schedule_name_u_idx on schedule(name asc);

create table schedule_holiday (
	schedule_id int not null,
	holiday_id int not null,
	is_active boolean not null,
	primary key (schedule_id, holiday_id),
	constraint fk_schedule_holiday_schedule
	foreign key (schedule_id)
	references schedule(id)
	on delete no action
	on update no action,
	constraint fk_schedule_holiday_holiday
	foreign key (holiday_id)
	references holiday(id)
	on delete no action
	on update no action
);
create index fk_schedule_holiday_schedule_idx on schedule_holiday(schedule_id asc);
create index fk_schedule_holiday_holiday_idx on schedule_holiday(holiday_id asc);

-- timetable
create type TYPE_DAY_OF_WEEK as enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

create table timetable (
	id serial not null,
	day TYPE_DAY_OF_WEEK not null,
	start_time time with time zone not null,
	end_time time with time zone not null,
	is_active boolean not null,
	schedule_id int not null,
	primary key(id),
	constraint fk_timetable_schedule
	foreign key (schedule_id)
	references schedule(id)
	on delete no action
	on update no action
);
create index fk_timetable_schedule_idx on timetable(schedule_id asc);