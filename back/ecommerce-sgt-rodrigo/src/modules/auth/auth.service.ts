  import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
  import { LoginAuthDto } from './dto/login-auth.dto';
  import { AuthRepositoryService } from './auth.repository';
  import { CreateUserDto } from '../users/dto/create-user.dto';
  import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../roles/roles.enum';
  const bcrypt = require('bcrypt');

  @Injectable()
  export class AuthService {

    constructor(private readonly authRepo:AuthRepositoryService,
                private readonly usersService:UsersService,
                private readonly jwtService:JwtService
    ) {}

    async signIn(loginAuthDto:LoginAuthDto){
      try {
        const dbUser = await this.usersService.findUserByEmail(loginAuthDto.email);
        if(!dbUser) throw new BadRequestException('Invalid email or password');

        //w validates password/hash
        const isValidPassword = await bcrypt.compare(loginAuthDto.password, dbUser.password);
        if(!isValidPassword) throw new BadRequestException('Invalid email or password');

        //w token jwt to persist connection for 1h
        //w three steps header, payload, signature > here we use the default header but can be manually set > 
        //? Manually specify the JWT header
      // const header = {
      //   alg: 'HS256',
      //   typ: 'JWT'
      // };
        //w read the docs for more options
        //! bear in mind all users are not admins by default, you must change it directly from the database
        const userPayload = {
          sub:dbUser.id,
          id: dbUser.id,
          email: dbUser.email,
          //? isAdmin: dbUser.isAdmin (ideally you get the value from the db)
          roles: [dbUser.isAdmin ? Role.ADMIN : Role.USER]  
        }
        
        //w this creates de token 
        const token = this.jwtService.sign(userPayload)

       //? creates the token with manually set header
      // const token = this.jwtService.sign(userPayload, {
      //   header: header
      // });

        return {success: 'User Logged In Succesfully', token}
      } catch (error) {
        throw error
      }
    }

 

    async signUpUser(userData: CreateUserDto) {
     try {
       //w checks if user already exists
       const dbUser = await this.usersService.findUserByEmail(userData.email); 
       if(dbUser) throw new BadRequestException('User already exists');
 
        //w extracts fields from DTO excluding passwordConfirmation
       const { passwordConfirmation, ...userDto } = userData;

        //? interesting fact: even if two users happen to have the same password, bycrypt creates a different hash every time (prevents rainbow table attacks)
         const hashedPassword = await bcrypt.hash(userData.password, 10);
         if(!hashedPassword) throw new HttpException('Error hashing password', HttpStatus.SERVICE_UNAVAILABLE)
           
           const newUser = {
             ...userDto,
             password: hashedPassword
           }
          //  console.log(newUser);
 
           const response = await this.usersService.saveUser(newUser);
 
         return response
     } catch (error) {
      console.error('Error in AuthService signUpUser:', error);
       throw error
     }   
    }

    findAll() {
      return `This action returns all auth`;
    }

    findOne(id: string) {
      return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: any) {
      return `This action updates a #${id} auth`;
    }

    remove(id: number) {
      return `This action removes a #${id} auth`;
    }
  }
