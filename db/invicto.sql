--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET search_path TO public;

--
-- Name: type_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_role AS ENUM (
    'GUEST',
    'MEMBER',
    'ADMIN',
	'SECURITY',
	'USER_MANAGER',
	'FRONT_DESK',
	'SUPER_ADMIN'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: role; Type: TABLE; Schema: public;
--

CREATE TABLE public.role (
    id integer NOT NULL,
    value public.type_role NOT NULL
);



--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public;

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;

--
-- Name: user_role; Type: TABLE; Schema: public;

CREATE TABLE public.user_role (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);

create table company (
	id serial not null,
	name varchar not null,
	address VARCHAR NOT NULL,
	city VARCHAR NOT NULL,
	postal_code VARCHAR NOT NULL,
	country VARCHAR NOT NULL,
	created_at timestamp with time zone DEFAULT now() NOT NULL,
	primary key(id)
);


create type TYPE_USER_STATUS as enum ('PENDING',  'INCOMPLETE', 'ACTIVE', 'INACTIVE', 'ARCHIVED');
--
-- Name: users; Type: TABLE; Schema: public;
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying NOT NULL,
    phone_number character varying NULL,
    password character varying,
    email character varying NOT NULL,
    employee_number integer,
    profile_picture bytea,
    job_title character varying,
	department varchar NULL,
    address character varying,
    city character varying,
    country character varying,
    allow_sso boolean DEFAULT false NOT NULL,
    status type_user_status null,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
	updated_by int NULL,
	primary key (id),
	unique (email),
	CONSTRAINT fk_users_users
	FOREIGN KEY(updated_by)
	REFERENCES users(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_users_users_idx ON users(updated_by ASC);

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: role id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: fk_user_role_role_idx; Type: INDEX; Schema: public;
--

CREATE INDEX fk_user_role_role_idx ON public.user_role USING btree (role_id);


--
-- Name: fk_user_role_user_idx; Type: INDEX; Schema: public;
--

CREATE INDEX fk_user_role_user_idx ON public.user_role USING btree (user_id);


--
-- Name: role_value_u_idx; Type: INDEX; Schema: public;
--

CREATE UNIQUE INDEX role_value_u_idx ON public.role USING btree (value);

CREATE TYPE TYPE_PERMISSION as ENUM ('BUILDING_ACCESS',
									 'ACCOUNT_MANAGEMENT',
									 'CARD_REQUEST',
									 'READ_ACTIVITY',
									 'USER_MANAGEMENT',
									 'KEY_MANAGEMENT',
									 'ALL_ACCESS',
									 'COMPANY_MANAGEMENT',
									 'ACCESS_CONTROL_MANAGEMENT',
									 'HARDWARE_MANAGEMENT',
									 'ACTIVITY_MANAGEMENT'
									 );

CREATE TABLE role_permission (
    role_id int NOT NULL,
    permission TYPE_PERMISSION NOT NULL,
    PRIMARY KEY (role_id, permission),
    CONSTRAINT fk_role_permission_permission
	FOREIGN KEY (role_id)
	REFERENCES role(id)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
);
CREATE INDEX fk_role_permission_permission_idx ON role_permission(role_id ASC);

--
-- Name: user_role fk_user_role_role; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: user_role fk_user_role_user; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES public.users(id);

CREATE TABLE user_company (
    user_id INT NOT NULL,
    company_id INT NOT NULL,
	is_main BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, company_id),
    CONSTRAINT fk_user_company_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT fk_user_company_company
    FOREIGN KEY (company_id)
    REFERENCES company(id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);
CREATE INDEX fk_user_company_user_idx ON user_company(user_id ASC);
CREATE INDEX fk_user_company_company_idx ON user_company(company_id ASC);


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

create table access_group (
	id serial not null,
	name varchar not null,
	updated_at timestamp with time zone DEFAULT now() NOT NULL,
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
	is_active boolean NOT NULL DEFAULT TRUE,
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

create type TYPE_DAY_OF_WEEK as enum ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

create table timetable (
	id serial not null,
	day TYPE_DAY_OF_WEEK not null,
	start_time time with time zone null,
	end_time time with time zone null,
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

create table access_group_schedule_zone (
	access_group_id int not null,
	schedule_id int not null,
	zone_id int not null,
	primary key (access_group_id, schedule_id, zone_id),
	constraint fk_access_group_schedule_zone_access_group
	foreign key (access_group_id)
	references access_group(id)
	on delete no action
	on update no action,
	constraint fk_access_group_schedule_zone_schedule
	foreign key (schedule_id)
	references schedule(id)
	on delete no action
	on update no action,
	constraint fk_access_group_schedule_zone_zone
	foreign key (zone_id)
	references zone(id)
	on delete no action
	on update no action
);

create index fk_access_group_schedule_zone_access_group_idx on access_group_schedule_zone(access_group_id asc);
create index fk_access_group_schedule_zone_schedule_idx on access_group_schedule_zone(schedule_id asc);
create index fk_access_group_schedule_zone_zone_idx on access_group_schedule_zone(zone_id asc);

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

--
-- PostgreSQL database dump complete
--

