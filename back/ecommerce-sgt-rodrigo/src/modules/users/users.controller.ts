import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
  SetMetadata,
  ParseUUIDPipe,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../roles/roles.enum';
import { RolesGuard } from '../../guards/roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PasswordMatchPipe } from 'src/common/pipes/password_match.pipe';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //w Decorators order > Swagger > Route > Metadata > Guards
  @ApiBearerAuth()
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
 async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.usersService.findAll();

      return res.status(200).send(response)
      // return res.status(200).json({
      //   users: response,
      //   auth0: req.oidc.user
      // })
    } catch (error) {
      throw error
    }
  }

  @ApiBearerAuth()
  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin(){
      return 'Protected Route: for admins only'
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
   try {
     const response = await this.usersService.findOne(id);
     return res.status(200).json(response)
   } catch (error) {
    throw error
   }
  }

  @ApiBearerAuth()
  @UsePipes(PasswordMatchPipe)
  @Put(':id')
  async updatePut(@Param('id', ParseUUIDPipe) id: string, 
            @Body() updateUserDto: UpdateUserDto, 
            @Res() res: Response) {
    try {
      const response = await this.usersService.updatePut(id, updateUserDto);
      return res.status(200).json({
        message: 'user modified',
        user: response
      })
    } catch (error) {
      throw error
    }
  }

  //w review how this works
  // @Patch(':id')
  // updatePatch(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
   try {
    const response = await this.usersService.remove(id);
    return res.status(200).json({
      message:`User Removed Succesfully`,
      user: response
    })
   } catch (error) {
    throw error
   }
  }
}
