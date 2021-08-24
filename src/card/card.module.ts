import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsBeforeOrEqualConstraint } from '../validation/before-or-equal.constraint';
import { Card } from './card.model';
import { CardService } from './card.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardService, IsBeforeOrEqualConstraint],
  exports: [CardService],
})
export class CardModule {}
