import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UsePipes,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { PasswordMatchPipe } from 'src/common/pipes/password_match.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @SetMetadata('isPublic', true)
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    try {
      const response = await this.authService.signIn(loginAuthDto);
      return res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  }

  @Post('signup')
  @SetMetadata('isPublic', true)
  @UsePipes(PasswordMatchPipe)
  async signUpUser(@Body() userData: CreateUserDto) {
    try {
      const normalizedUserData = {
        ...userData,
        email: userData.email.toLowerCase(),
      };
      const response = await this.authService.signUpUser(normalizedUserData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  //! delete the following endpoints after checking against rubric

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: any) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
