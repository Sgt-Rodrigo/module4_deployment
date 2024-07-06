import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { JwtService } from "@nestjs/jwt";
import { UsersRepo } from "../users/usersDB.service";
import { User } from "../users/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { BadRequestException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { AuthRepositoryService } from "./auth.repository";

describe('authService', ()=>{
    
    let authService:AuthService;
    beforeEach(async ()=>{
         //w mocks UsersService to avoid importing all dependiencies
        //  const mockUsersService: Partial<UsersRepo> = {
        //     createUser:(userData:CreateUserDto) => 
        //         Promise.resolve({
        //             ...userData,
        //             isAdmin: false,
        //             id: '1234fs-234sd-24csfd-34sdfg',
        //             role: 'customer'
        //         })
        // }

        const mockUsersService: Partial<UsersRepo> = {
            createUser: (userData: CreateUserDto) => 
              Promise.resolve({
                ...userData,
                isAdmin: false,
                id: '1234fs-234sd-24csfd-34sdfg',
                role: 'customer',
              }),
            getAllUsersWithPassword: () => 
              Promise.resolve([
                {
                  email: 'test@example.com',
                  password: 'password123',
                },
              ] as User[]),
          };

        //w mockes repo service
        const mockAuthRepositoryService: Partial<AuthRepositoryService> = {
            login: (loginAuthDto: LoginAuthDto) => {
              if (
                loginAuthDto.email === 'test@example.com' &&
                loginAuthDto.password === 'password123'
              ) {
                return Promise.resolve('user logged in');
              } else {
                throw new BadRequestException('Incorrect email or password');
              }
            },
          };

        //w creates testing module (environment)
        const module = await Test.createTestingModule({
            //? imports the service to test along with its dependencies
            providers:[
                AuthService, 
                JwtService,
                {
                    provide: UsersRepo,
                    useValue:mockUsersService
                },
                {
                    provide: AuthRepositoryService,
                    useValue: mockAuthRepositoryService,
                  },
            ],
        }).compile();
    
         authService = module.get<AuthService>(AuthService);
    })

    //* TESTS

    it('Create an AuthService instance', async ()=> {

       
        expect(authService).toBeDefined();
    })
})
