ALTER TABLE access_group
ADD COLUMN location_id INT NULL,
ADD CONSTRAINT fk_access_group_location
FOREIGN KEY (location_id)
REFERENCES location(id)
ON UPDATE NO ACTION
ON DELETE NO ACTION,
DROP COLUMN description;

CREATE INDEX fk_access_group_location_idx ON access_group(location_id ASC);

UPDATE access_group AS ag
SET location_id = agscz.location_id
FROM access_group_schedule_zone AS agscz
WHERE ag.id = agscz.access_group_id;

ALTER TABLE access_group
ALTER COLUMN location_id SET NOT NULL;

ALTER TABLE access_group_schedule_zone
DROP COLUMN location_id;