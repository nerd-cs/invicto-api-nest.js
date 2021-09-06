import { ApiProperty } from '@nestjs/swagger';
import { TypeControllerStatus } from '../controller.model';

export class ControllerResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ enum: TypeControllerStatus, enumName: 'TypeControllerStatus' })
  readonly status: TypeControllerStatus;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly location: string;

  @ApiProperty()
  readonly doors: number;
}
