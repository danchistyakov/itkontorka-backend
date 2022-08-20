import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
  }

  async addUser(CreateUserDTO): Promise<UserDocument> {
    try {
      const newUser = await new this.userModel(CreateUserDTO);
      return newUser.save();
    } catch (e) {
    }
  }

  async getUser(email: string, filter?: any): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }, filter).exec();
    if (user) {
      return user.toObject();
    } else {
      return undefined;
    }
  }

  async editUser(email: string, data: any, filter?: any): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ email }, data, {
      new: true,
      projection: filter
    });
  }

  async setRefreshToken(rToken: string, email: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(rToken, 10);
    await this.userModel.findOneAndUpdate({ email }, { rToken: hashedRefreshToken }, { new: true });
  }

  async removeRefreshToken(email: string) {
    await this.userModel.findOneAndUpdate({ email }, { rToken: null });
  }

  // async ifRefreshTokenMatches(rToken: string, email: string) {
  //   const user = await this.userModel.findOne({ email }).exec();
  //   const data = {
  //     chatId: user?.chatId,
  //     email: user.email,
  //     telegramId: user.telegramId,
  //     name: user.name,
  //     phone: user.phone,
  //   };
  //   const isRefreshTokenMatching = await bcrypt.compare(rToken, user.rToken);
  //   return isRefreshTokenMatching ? data : false;
  // }
}