import { IsEmail, IsNotEmpty } from "class-validator";

//w this is the LoginUserDto asked by the assignment
export class LoginAuthDto {
     /**
   * Email of the user, must be a valid email address and not empty
   * @example 'newman@example.com'
   */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
   * Password of the user, must not be empty
   * @example 'PasswordNewman123!'
   */
    @IsNotEmpty()
    password: string
}