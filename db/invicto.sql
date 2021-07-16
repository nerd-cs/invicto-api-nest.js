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

--
-- Name: type_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_role AS ENUM (
    'GUEST',
    'MEMBER',
    'TIER_ADMIN',
    'ADMIN'
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



--
-- Name: users; Type: TABLE; Schema: public;
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying NOT NULL,
    phone_number character varying NOT NULL,
    password character varying,
    email character varying NOT NULL,
    employee_number integer,
    profile_picture bytea,
    job_title character varying,
    address character varying,
    city character varying,
    country character varying,
    allow_sso boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


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
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


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


--
-- PostgreSQL database dump complete
--

