-- zone
create table zone (
	id serial not null,
	name varchar not null,
    description varchar null,
	access_group_id int null,
	location_id int not null,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
	primary key(id),
	unique(name),
	constraint fk_zone_access_group
	foreign key (access_group_id)
	references access_group(id)
	on delete no action
	on update no action,
	constraint fk_zone_location
	foreign key (location_id)
	references location(id)
	on delete no action
	on update no action
);
create unique index zone_name_u_idx on zone(name asc);
create index fk_zone_access_group_idx on zone(access_group_id asc);
create index fk_zone_location_idx on zone(location_id asc);

create table meta_zone (
	parent_zone_id int not null,
	child_zone_id int not null,
	primary key(parent_zone_id, child_zone_id),
	constraint fk_meta_zone_zone_parent
	foreign key (parent_zone_id)
	references zone(id)
	on delete no action
	on update no action,
	constraint fk_meta_zone_zone_child
	foreign key (child_zone_id)
	references zone(id)
	on delete no action
	on update no action
);
create index fk_meta_zone_zone_parent_idx on meta_zone(parent_zone_id asc);
create index fk_meta_zone_zone_child_idx on meta_zone(child_zone_id asc);

-- door
create type TYPE_DOOR_STATUS as enum ('PENDING', 'NOT_PAIRED', 'PAIRED');

create table door (
	id serial not null,
	name varchar not null,
	status TYPE_DOOR_STATUS not null,
	updated_at timestamp with time zone DEFAULT now() NOT NULL,
	location_id int not null,
	primary key(id),
	unique(name),
	constraint fk_door_location
	foreign key (location_id)
	references location(id)
	on delete no action
	on update no action
);
create index fk_door_location_idx on door(location_id asc);
create unique index door_name_u_idx on door(name asc);

create table zone_door (
	zone_id int not null,
	door_id int not null,
	primary key(zone_id, door_id),
	constraint fk_zone_door_zone
	foreign key (zone_id)
	references zone(id)
	on delete no action
	on update no action,
	constraint fk_zone_door_door
	foreign key (door_id)
	references door(id)
	on delete no action
	on update no action
);

insert into door(id, name, status, location_id)
values (default, 'Door 1', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
       (default, 'Door 2', (SELECT status FROM unnest(enum_range(NULL::TYPE_DOOR_STATUS)) status ORDER BY random() LIMIT 1), floor(random()*4)+1),
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