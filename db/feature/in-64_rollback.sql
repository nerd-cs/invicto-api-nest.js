alter table users drop column status;
drop type type_user_status;

alter table users drop column company_id;

drop table card;
drop type TYPE_CARD_TYPE;
drop table user_access_group;
drop table access_group;
drop table location;
drop table company;
drop table token;