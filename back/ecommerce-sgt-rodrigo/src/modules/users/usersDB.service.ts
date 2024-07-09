import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersRepo{

    constructor(@InjectRepository(User)
            private usersRepository: Repository<User>){}

    private readonly jsonServerUrl = 'http://localhost:8000/users';
    

    async getAllUsers(page: number = 1, limit: number = 5):Promise<Partial<User>[]> {
       try {
         const skip = (page - 1) * limit;

         //? check the docs > select: {password:false}
         //? find (modern) vs findAll(Typeorm 0.2 and earlier)
          return await this.usersRepository.find({
            select: ['id', 'name', 'email', 'phone', 'country', 'address', 'city', 'isAdmin'],
           skip,
           take: limit,
         });
         
       
       } catch (error) {
        throw new HttpException('Error fectching all users', HttpStatus.INTERNAL_SERVER_ERROR)
       }
      }

    //w getAllUsers with pagination (json-server)
    // async getAllUsers(page:number = 1, limit:number = 5){
    //     try {
    //         const response = await axios.get(
    //             `${this.jsonServerUrl}?_page=${page}&_limit=${limit}`);
    //         const users = response.data.map(({password, ...user}:User) => user)
    //         return users
    //     } catch (error) {
    //         throw new HttpException('Error fetching all users', HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

        async getAllUsersWithPassword(){
            try {
                const response = await axios.get(`${this.jsonServerUrl}`);
                return response.data
            } catch (error) {
                throw new HttpException('Error fetching all users', HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }


    async getUserByID(id:string){
      try {
        const user = await this.usersRepository.findOne({where: {id}});
        if(!user) throw new NotFoundException('User was not found')

          //w excluded password
          const {password, ...userWithNoPassword} = user;

        
        return userWithNoPassword
      } catch (error) {
        if(error instanceof NotFoundException) {
          throw error
        } else {
          throw new HttpException('Error fetching user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }


      //  try {
      //    const response = await axios.get(`${this.jsonServerUrl}/${id}`)
      //   const {password, ...user} = response.data;
      //    return user
      //  } catch (error) {
      //   throw new HttpException('Error retrieveing user', HttpStatus.INTERNAL_SERVER_ERROR)
      //  }
    }

    async createUser(userData:CreateUserDto){
      try {
        const newUser = this.usersRepository.create([{
            ...userData,
            isAdmin: false,
        }]);

        return await this.usersRepository.save(newUser[0]);
        } catch (error) {
            throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePut(id: string, updatedUserData:UpdateUserDto){

      try {
        const user = await this.usersRepository.findOne({where:{id}});
        if(!user) throw new NotFoundException('User not found');

        const hashedPassword = await bcrypt.hash(updatedUserData.password, 10);
        if(!hashedPassword) throw new HttpException('Error hashing password', HttpStatus.SERVICE_UNAVAILABLE)

        user.name = updatedUserData.name;
        user.email = updatedUserData.email;
        user.password = hashedPassword;
        user.address = updatedUserData.address;
        user.phone = updatedUserData.phone;
        user.country = updatedUserData.country;
        user.city = updatedUserData.city;
        user.isAdmin = updatedUserData.isAdmin;

       

        const updatedUser =  await this.usersRepository.save(user);
        console.log(updatedUser);
        //w returns the updated user without showing the hashed pass
        const {password, ...updated } = updatedUser;
        return updated
       
      } catch (error) {
        throw new HttpException('Error modifying user', HttpStatus.INTERNAL_SERVER_ERROR)
      }


      //? json-server test (can be deleted)
    //  try {
    //     const response = await axios.put(`${this.jsonServerUrl}/${id}`, updatedUserData);
    //     return response.data
    //  } catch (error) {
    //     throw new HttpException('Error updating user', HttpStatus.INTERNAL_SERVER_ERROR)
    //  }
    }

    async remove(id: string) {

      try {
        const user = await this.usersRepository.findOne({where:{id}});
        if(!user) throw new NotFoundException('User not Found');
        
        await this.usersRepository.delete(user);

        return {
          name: user.name,
          id: user.id
        }
      } catch (error) {
        if(error instanceof NotFoundException) {
          throw error
        } else {
          throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR)
        }
      }


      //  try {
      //    const response = await axios.delete(`${this.jsonServerUrl}/${id}`);
      //    return response.data
      //  } catch (error) {
      //   throw new  HttpException('User Deletion Failed', HttpStatus.INTERNAL_SERVER_ERROR )
      //  }
    }
}
