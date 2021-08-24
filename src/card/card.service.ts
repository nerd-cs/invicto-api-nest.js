import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDateString } from 'class-validator';
import { Repository } from 'typeorm';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { UpdateUserCardDto } from '../users/dto/update-user-card.dto';
import { User } from '../users/users.model';
import { IsBeforeOrEqualConstraint } from '../validation/before-or-equal.constraint';
import { Card } from './card.model';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly isBeforeOrEqualConstraint: IsBeforeOrEqualConstraint,
  ) {}

  async createCards(dtos: CreateCardDto[], user: User) {
    const prepared = [];

    dtos.forEach((dto) => {
      const { ...fields } = dto;

      fields['user'] = user;

      prepared.push(fields);
    });

    return this.cardRepository.save(prepared);
  }

  async removeAll(cards: Card[]) {
    if (cards) {
      this.cardRepository.remove(cards);
    }
  }

  async updateActiveness(card: Card, isActive: boolean) {
    if ((card.isActive && isActive) || (!card.isActive && !isActive)) {
      throw new ConstraintViolationException('Activeness is the same');
    }

    card.isActive = isActive;

    return this.cardRepository.save(card);
  }

  async deleteCard(card: Card) {
    return await this.cardRepository.remove(card);
  }

  async updateCard(card: Card, dto: UpdateUserCardDto) {
    card.activationDate = dto.activationDate || card.activationDate;

    if (dto.expirationDate) {
      if (!isDateString(dto.expirationDate)) {
        throw new ConstraintViolationException(
          'expirationDate must be a valid date',
        );
      }

      card.expirationDate = dto.expirationDate;
    } else if (dto.expirationDate === null) {
      card.expirationDate = null;
    }

    if (card.activationDate && card.expirationDate) {
      this.validateDates(card);
    }

    card.cardNumber = dto.number || card.cardNumber;
    card.isActive =
      dto.isActive === false || dto.isActive === true
        ? dto.isActive
        : card.isActive;

    return await this.cardRepository.save(card);
  }

  private validateDates(card: Card) {
    const validationOptions = {
      object: card,
      constraints: ['expirationDate'],
      value: card.activationDate,
      targetName: 'activationDate',
      property: 'activationDate',
    };

    if (
      !this.isBeforeOrEqualConstraint.validate(
        card.activationDate,
        validationOptions,
      )
    ) {
      throw new ConstraintViolationException(
        this.isBeforeOrEqualConstraint.defaultMessage(validationOptions),
      );
    }
  }
}
