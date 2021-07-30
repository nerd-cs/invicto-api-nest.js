create type TYPE_CONTROLLER_STATUS as enum ('PENDING', 'PAIRED', 'NO_SIGNAL');

create table controller (
	id serial not null,
	name varchar not null,
	status TYPE_CONTROLLER_STATUS not null,
	updated_at timestamp with time zone not null default now(),
	location_id int not null,
	primary key (id),
	unique (name, location_id),
	constraint fk_controller_location
	foreign key (location_id)
	references location(id)
	on delete no action
	on update no action
);
create unique index controller_name_u_idx on controller(name asc);
create index fk_controller_location_idx on controller(location_id asc);

insert into controller(id, name, status, location_id)
values (default, 'Controller 1', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 1),
       (default, 'Controller 2', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 2),
	   (default, 'Controller 3', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 3),
	   (default, 'Controller 4', (SELECT status FROM unnest(enum_range(NULL::TYPE_CONTROLLER_STATUS)) status ORDER BY random() LIMIT 1), 4);