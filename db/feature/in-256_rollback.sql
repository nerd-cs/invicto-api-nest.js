ALTER TABLE access_group_schedule_zone
ADD COLUMN location_id INT NULL,
ADD CONSTRAINT fk_access_group_schedule_zone_location
FOREIGN KEY (location_id)
REFERENCES location(id)
ON UPDATE NO ACTION
ON DELETE NO ACTION;

CREATE INDEX fk_access_group_schedule_zone_location_idx ON access_group_schedule_zone(location_id ASC);

UPDATE access_group_schedule_zone AS agscz
SET location_id = ag.location_id
FROM access_group AS ag
WHERE agscz.access_group_id = ag.id;

ALTER TABLE access_group_schedule_zone
ALTER COLUMN location_id SET NOT NULL;

ALTER TABLE access_group
DROP COLUMN location_id,
ADD COLUMN description VARCHAR NULL;