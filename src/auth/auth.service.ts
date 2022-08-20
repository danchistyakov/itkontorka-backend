import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterUserDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
  }

  async login(email: string, password: string): Promise<any> {
    const user: any = await this.userService.getUser(email, { _id: false, __v: false });
    if (!user) {
      throw new HttpException("Wrong email or user doesn't exist", HttpStatus.FORBIDDEN);
    }
    const isCorrectPass = await bcrypt.compare(password, user.password);
    if (!isCorrectPass) {
      throw new HttpException("Wrong email or password", HttpStatus.FORBIDDEN);
    }
    const { cookie, refreshToken } = await this.getCookieWithJwtRefreshToken(email);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const newUser: any = await this.userService.editUser(email, { refreshToken: hashedRefreshToken }, {
      _id: false,
      refreshToken: false,
      __v: false
    });
    const accessToken = this.getAccessToken(user.id);
    return { accessToken, cookie, user: newUser };
  }

  async register(payload: RegisterUserDTO) {
    const isUserExist = await this.userService.getUser(payload.email);
    if (isUserExist) {
      throw new HttpException("User already exists", HttpStatus.FORBIDDEN);
    }
    const password = await bcrypt.hash(payload.password, 10);
    const { refreshToken } = await this.getCookieWithJwtRefreshToken(payload.email);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const obj = { ...payload, password, refreshToken: hashedRefreshToken };
    let user = await this.userService.addUser(obj);
    delete user._id;
    delete user.refreshToken;
    return { user };
  }

  async refresh(refreshToken: string) {
    const { email } = this.decodeRefreshToken(refreshToken);
    const user = await this.isRefreshTokenMatches(refreshToken, email);
    if (!user) {
      throw new HttpException("Session expired", HttpStatus.UNAUTHORIZED);
    }
    const accessToken = this.getAccessToken(email);
    return { accessToken, user };
  }

  async logout() {

  }

  public decodeAccessToken(accessToken: string) {
    return this.jwtService.verify(accessToken, {
      ignoreExpiration: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET
    });
  }

  public decodeRefreshToken(refreshToken: string) {
    return this.jwtService.verify(refreshToken, {
      ignoreExpiration: true,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET
    });
  }

  public getAccessToken(email: string): string {
    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    });
  }

  async getCookieWithJwtRefreshToken(email: string) {
    const payload = { email };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    });
    const cookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return { cookie, refreshToken };
  }


  async removeRefreshToken(email: string) {
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new HttpException("User with this id does not exist", HttpStatus.NOT_FOUND);
    }
    // return this.userRepository.update({ email }, {
    //   refresh_token: null
    // });
  }

  async isRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userService.getUser(email);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    delete user.refreshToken;
    return isRefreshTokenMatching ? user : null;
  }
}