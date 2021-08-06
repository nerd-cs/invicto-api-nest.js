-- user status
create type TYPE_USER_STATUS as enum ('PENDING',  'INCOMPLETE', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

alter table users add column status type_user_status null;

-- company
create table company (
	id serial not null,
	name varchar not null,
	primary key(id)
);
insert into company(id, name) values(default, 'Desjardins');

alter table users add column company_id int not null default '1';
alter table users add constraint fk_user_company_id foreign key(company_id) references company(id) on delete no action on update no action;
create index fk_user_company_id_idx on users(company_id asc);

-- location
create table location (
	id serial not null,
	name varchar not null,
	company_id int not null,
	primary key(id),
	constraint fk_location_company
		foreign key (company_id)
		references company(id)
		on delete no action
		on update no action
);
create index fk_location_company_idx on location(company_id asc);

insert into location(id, name, company_id)
values(default, 'Quebec Office', CURRVAL(pg_get_serial_sequence('company','id'))),
	   (default, 'Quebec HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		(default, 'Montreal HQ', CURRVAL(pg_get_serial_sequence('company','id'))),
		 (default, 'Trois-Rivieres HQ', CURRVAL(pg_get_serial_sequence('company','id')));

-- access group
create table access_group (
	id serial not null,
	name varchar not null,
	description varchar null,
	updated_at timestamp with time zone DEFAULT now() NOT NULL,
	is_active boolean not null default true,
	location_id int not null,
	primary key(id),
	constraint fk_access_group_location
		foreign key (location_id)
		references location(id)
		on delete no action
		on update no action
);
create index fk_access_group_location_idx on access_group(location_id asc);

create table user_access_group (
	user_id int not null,
	access_group_id int not null,
	primary key(user_id, access_group_id),
	constraint fk_user_access_group_user
		foreign key (user_id)
		references users(id)
		on delete no action
		on update no action,
	constraint fk_user_access_group_access_group
		foreign key (access_group_id)
		references access_group(id)
		on delete no action
		on update no action
);
create index fk_user_access_group_user_idx on user_access_group(user_id asc);
create index fk_user_access_group_access_group_idx on user_access_group(access_group_id asc);

-- card
create type TYPE_CARD_TYPE as enum ('KEY', 'MOBILE');

create table card (
	id serial not null,
	type TYPE_CARD_TYPE not null,
	card_number int null,
	activation_date date not null default now(),
	expiration_date date null,
	is_active boolean not null default true,
	created_at timestamp with time zone not null default now(),
	user_id int not null, 
	primary key(id),
	constraint fk_card_user
		foreign key (user_id)
		references users(id)
		on delete no action
		on update no action
);
create index fk_card_user_idx on card(user_id asc);

insert into access_group(id, name, location_id)
values (default, 'Lobby', 2),
(default, 'Main Entrance', 2),
(default, 'Garage', 2);

-- token
create table token (
	id serial not null,
	value varchar not null,
	valid_through timestamp with time zone not null default now(),
	user_id int not null,
	primary key(id),
	unique(value),
	constraint fk_token_users
	foreign key (user_id)
	references users(id)
	on delete no action
	on update no action
);
create unique index token_value_u_idx on token(value asc);
create index fk_token_users_idx on token(user_id asc);