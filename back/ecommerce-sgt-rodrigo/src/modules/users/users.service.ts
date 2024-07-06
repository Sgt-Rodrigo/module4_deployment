import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { CreateUserDto, UserDtoNoPassConfirm } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepo } from './usersDB.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  constructor(private usersRepo: UsersRepo,
              @InjectRepository(User)
              private readonly usersRepository: Repository<User>
  ){}

 async create(createUserDto: CreateUserDto) {
   try {
     const response = await this.usersRepo.createUser(createUserDto);
     return response
   } catch (error) {
    //w re-throw error coming from repo
    throw error
   }
   
  }

  async saveUser(userData:Omit<CreateUserDto,'passwordConfirmation'>) {
    try { 
      //w creates an instance of User from the CreateUserDto
      const newUser = this.usersRepository.create(userData);
      const response = await this.usersRepository.save(newUser);
      console.log(response);

      //w checks if response is an array and extract the first user object
    const savedUser = Array.isArray(response) ? response[0] : response;

    if (!savedUser) {
      throw new HttpException('User could not be saved', HttpStatus.INTERNAL_SERVER_ERROR);
    }
      
      const {password, ...userWithNoPassword} = savedUser;

      return {success: 'user registered',
              user:userWithNoPassword
              }
    } catch (error) { 
      console.error('Error in UserService saveUser:', error);

      throw new HttpException('Error signing up user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
   try {
     const response = await this.usersRepo.getAllUsers();
     return response
   } catch (error) {
    throw error
   }
    
  }

  async findOne(id: string) {
   try {
     const response = await this.usersRepo.getUserByID(id);
     return response
   } catch (error) {
    throw error
   }
    
  }

  //w returns user by email or undefined if not user is found
  async findUserByEmail(email:string){
    return this.usersRepository.findOne({where:{email}})
  }

  //! CAREFUL: PUT overwrites the whole entry, it is not like patch.
  //! you must always pass the whole entry with the changes
  async updatePut(id: string, updateUserDto: UpdateUserDto) {
    try {
     return  await this.usersRepo.updatePut(id, updateUserDto);
    } catch (error) {
      throw error
    }
  }

  async remove(id: string) {
    try {
      const response = await this.usersRepo.remove(id);
      return response
    } catch (error) {
      throw error
    }
  }
}
