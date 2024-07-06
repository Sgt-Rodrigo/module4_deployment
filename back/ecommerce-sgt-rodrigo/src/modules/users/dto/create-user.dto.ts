import { IsString, IsEmail, Matches, Length, IsNumberString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /** 
  *name must be a string from 3 to 80 characters
  * @example Newman */
  @IsString()
  @Length(3, 80)
  name: string;
/**
   * Email must be a valid email address
   * @example newman@example.com
   */
  @IsEmail({},{message:'Please, provide a valid email >> example@example.com'})
  email: string;


   /**
   * Password must be 8-150 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character
   * @example 'PasswordNewman123!'
   */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,150}$/, {
              message: 'Password must meet the specified criteria',
          })
  password: string;


  /**
   * Password confirmation must match the password and meet the same criteria
   * @example 'PasswordNewman123!'
   */        
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,150}$/, {
            message: 'Password must meet the specified criteria',
          })
  passwordConfirmation: string;

  /**
   * Address must be a string from 3 to 80 characters
   * @example '123 Main St'
   */        
  @IsString()
  @Length(3, 80)
  address: string; 

   /**
   * Phone number must be a valid numeric string
   * @example 1234567890
   */
  //w it should be saved as a string to preserce posible leading ceros and special formats, symbols, etc, you can parse it in the service otherwise.
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumberString()
  phone: string;

  /**
   * Country must be a string from 5 to 20 characters
   * @example 'United States'
   */          
  @IsString()
  @Length(5, 50)
  country: string;

   /**
   * City must be a string from 5 to 20 characters
   * @example 'San Francisco'
   */
  @IsString()
  @Length(5, 20)
  city: string;

}

export type UserDtoNoPassConfirm = Omit<CreateUserDto, 'passwordConfirmation'>;