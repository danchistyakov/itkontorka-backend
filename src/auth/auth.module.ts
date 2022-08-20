import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../user/user.schema";
// import { RateService } from '../rate/rate.service';
// import { RateSchema } from '../rate/rate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {
}