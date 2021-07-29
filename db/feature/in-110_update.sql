-- access group
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