import { ApiProperty } from '@nestjs/swagger';
import { Door } from '../../door/door.model';
import { LocationResponse } from '../../location/response/location.response';
import { Zone } from '../zone.model';
import { ChildZoneResponse } from './child-zone.response';

export class ZoneInfo extends ChildZoneResponse {
  @ApiProperty({ type: LocationResponse })
  readonly location: LocationResponse;

  @ApiProperty({ isArray: true, type: Door })
  readonly doors: Door[];

  @ApiProperty({ isArray: true, type: ChildZoneResponse })
  readonly childZones: Zone[];
}
