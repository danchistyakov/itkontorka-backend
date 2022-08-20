import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { JwtService } from "@nestjs/jwt";
//import { RateSchema } from '../rate/rate.schema';
//import { RateService } from '../rate/rate.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
  controllers: [UserController],
  providers: [JwtService, UserService],
  exports: [UserService]
})
export class UserModule {
}
