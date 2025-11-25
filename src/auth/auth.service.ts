import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose'; // Used for generating random data when hashing social login passwords
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User): {
    accessToken: string;
    user: { _id: string; email: string; role: string };
  } {
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    if (await this.usersService.findByEmail(createUserDto.email)) {
      throw new UnauthorizedException('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.passwordHash, salt);

    const newUser = await this.usersService.createUser({
      ...createUserDto,
      passwordHash,
    });

    newUser.passwordHash = '';
    return newUser;
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    user: { _id: string; email: string; role: string };
  }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  /**
   * Handles user creation/login logic for social platforms (e.g., Google, Facebook).
   * This method is called by the Passport Strategy's validate method.
   * @param email The user's verified email from the social provider.
   * @param firstName The user's first name.
   * @param lastName The user's last name.
   * @param defaultRole The default role for new users.
   * @returns The authenticated user object with a generated JWT.
   */
  async validateSocialUser(
    email: string,
    firstName: string,
    lastName: string,
    defaultRole: 'Candidate',
  ): Promise<{
    accessToken: string;
    user: { _id: string; email: string; role: string };
  }> {
    let user = await this.usersService.findByEmail(email);
    if (user) {
      return this.generateToken(user);
    }

    const tempPasswordHash = await bcrypt.hash(
      new Types.ObjectId().toHexString(),
      10,
    );

    user = await this.usersService.createUser({
      email,
      firstName,
      lastName,
      role: defaultRole,
      passwordHash: tempPasswordHash,
    });

    return this.generateToken(user);
  }
}
