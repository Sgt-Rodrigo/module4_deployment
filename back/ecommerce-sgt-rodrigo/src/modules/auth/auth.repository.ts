import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepo } from '../users/usersDB.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from '../users/entities/user.entity';
import axios from 'axios';

@Injectable()
export class AuthRepositoryService {
    constructor(private readonly usersRepo: UsersRepo) {}

    async login(loginAuthDto:LoginAuthDto){
       //w validation is done through class-validator in dto file
        //! is pagination only for products then?, cause here I need to get all users, not just a page.
        //! And what about the password, getAllUsers does NOT return the password
       try {
        const response = await this.usersRepo.getAllUsersWithPassword()
        
        console.log(response)

        //w find user
        const user = response.find((user:User) => user.email === loginAuthDto.email);

        if(!user || user.password !== loginAuthDto.password){
            throw new BadRequestException('Incorrect email or password');
        }

        return 'user logged in'

       } catch (error) {
        throw error
        
       }
    }
}
