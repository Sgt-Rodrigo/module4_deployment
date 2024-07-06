import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';
// import { validate } from 'class-validator';

@Injectable()
export class PasswordMatchPipe implements PipeTransform {
  async transform(value: any): Promise<any> {
    const { password, passwordConfirmation } = value;

    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    return value;
  }
}