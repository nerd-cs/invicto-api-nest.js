import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../location/location.model';
import { LocationResponse } from '../../location/response/location.response';
import { ChildZoneResponse } from './child-zone.response';

export class ZoneResponse extends ChildZoneResponse {
  @ApiProperty({ type: LocationResponse })
  readonly location: Location;
}
