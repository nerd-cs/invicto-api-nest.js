create type TYPE_HOLIDAY_RECURRENCE as enum ('ONCE', 'EVERY_MONTH', 'EVERY_YEAR');

create table holiday (
	id serial not null,
	name varchar not null,
	recurrence TYPE_HOLIDAY_RECURRENCE not null,
	start_date date not null,
	end_date date not null,
	updated_at timestamp with time zone DEFAULT now() NOT NULL,
	primary key(id),
	unique(name)
);
create unique index holiday_name_u_idx on holiday(name asc);