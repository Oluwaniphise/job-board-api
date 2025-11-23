import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  async findUser(id: string): Promise<User | null> {
    // We use select('-passwordHash') to ensure the sensitive field is never returned
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .select('-passwordHash')
      .exec();
  }

  async removeUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
