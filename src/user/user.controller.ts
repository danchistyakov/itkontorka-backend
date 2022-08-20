import { Controller, Res, HttpStatus, Headers, UseGuards, Get, Body, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
//import { RateService } from '../rate/rate.service';
import { EditUserDTO } from "../auth/auth.dto";

@Controller("api")
@UseGuards(AuthGuard("jwt"))

export class UserController {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
  }

  // @Post("/editUser")
  // async editUser(@Headers() headers, @Res() res, @Body() payload: EditUserDTO) {
  //   const jwtToken = headers.authorization.split(" ")[1];
  //   const decodedData = this.jwtService.verify(jwtToken, { secret: "Ctrhtnysqrk.xlkz[tqcfnjib22!" });
  //   const data: any = await this.userService.editUser(decodedData.email, payload, {
  //     _id: false,
  //     password: false,
  //     rToken: false,
  //     __v: false
  //   });
  //   data.rate = await this.rateService.getRate({ _id: data.rate }, { _id: false });
  //   return res.status(HttpStatus.OK).json({
  //     data,
  //     statusCode: HttpStatus.OK,
  //     success: true
  //   });
  // }

  // @Get("/getUser")
  // async getUser(@Headers() headers, @Res() res) {
  //   const jwtToken = headers.authorization.split(" ")[1];
  //   const decodedData = this.jwtService.verify(jwtToken, { secret: "Ctrhtnysqrk.xlkz[tqcfnjib22!" });
  //   const data: any = await this.userService.getUser(decodedData.email, {
  //     _id: false,
  //     password: false,
  //     rToken: false,
  //     __v: false
  //   });
  //   data.rate = await this.rateService.getRate({ _id: data.rate }, { _id: false });
  //   return res.status(HttpStatus.OK).json({
  //     data,
  //     statusCode: HttpStatus.OK,
  //     success: true
  //   });
  // }
}