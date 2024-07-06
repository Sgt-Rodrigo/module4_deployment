//w the difference with createUserDto is that you can change the isAdmin here

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  /**
   * Name of the user, must be a string up to 50 characters
   * @example 'George Constanza'
   */
  @IsString()
  @Length(3, 80)
  'name': string;
  /**
   * Email of the user, must be a unique string up to 50 characters
   * @example george@constanza.com
   */
  @IsEmail(
    {},
    { message: 'Please, provide a valid email >> example@example.com' },
  )
  'email': string;
  /**
   * Password of the user, must be a string up to 150 characters
   * @example 'PasswordNewman123!'
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,150}$/, {
    message: 'Password must meet the specified criteria',
  })
  'password': string;

  /**
   * Password Confirmation of the user, must be a string up to 150 characters
   * @example 'PasswordNewman123!'
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,150}$/, {
    message: 'Password must meet the specified criteria',
  })
  'passwordConfirmation': string;

  /**
   * Address must be a string from 3 to 80 characters
   * @example '123 Main St'
   */
  @IsString()
  @Length(3, 80)
  'address': string;
  /**
   * Phone number of the user, stored as an integer
   * @example 1234567890
   */
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumberString()
  'phone': string;
  /**
   * Country of the user, must be a string up to 50 characters
   * @example 'United States'
   */
  @IsString()
  @Length(5, 50)
  'country': string;
  /**
   * City of the user, must be a string up to 50 characters
   * @example 'New York'
   */
  @IsString()
  @Length(5, 20)
  'city': string;

  /**
   * City of the user, must be a string up to 50 characters
   * @example false
   */
  @IsBoolean()
  'isAdmin': boolean;
}
