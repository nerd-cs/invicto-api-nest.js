import { ApiProperty } from '@nestjs/swagger';
import { Door } from '../../door/door.model';
import { Zone } from '../zone.model';
import { ChildZoneResponse } from './child-zone.response';
import { ZoneResponse } from './zone.response';

export class ZoneInfo extends ZoneResponse {
  @ApiProperty({ isArray: true, type: Door })
  readonly doors: Door[];

  @ApiProperty({ isArray: true, type: ChildZoneResponse })
  readonly childZones: Zone[];
}
