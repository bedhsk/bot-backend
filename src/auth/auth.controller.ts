import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { IsPublic } from './common/is-public.decorator';
import { LocalGuard } from './guards/local.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  @IsPublic()
  @ApiCreatedResponse({
    status: 201,
    description: 'Inicia sesión y devuelve un token de acceso.',
  })
  @UseGuards(LocalGuard)
  async login(@Req() request: Request) {
    const user = request.user as User;

    const payload = {
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
    };
  }
}
