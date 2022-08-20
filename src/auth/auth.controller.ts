import { Controller, Request, Post, Body, HttpStatus, Res, Headers, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDTO, RegisterUserDTO } from "./auth.dto";
import { JwtService } from "@nestjs/jwt";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {
  }

  @Post("login")
  async login(@Res() res, @Request() req, @Body() payload: LoginUserDTO) {
    const { accessToken, cookie, user } = await this.authService.login(payload.email, payload.password);
    req.res.setHeader("Set-Cookie", cookie);
    return res.status(HttpStatus.OK).json({ accessToken, data: user, statusCode: HttpStatus.OK, success: true });
  }

  @Post("register")
  async register(@Res() res, @Request() req, @Body() payload: RegisterUserDTO) {
    const { user } = await this.authService.register(payload);
    return res.status(HttpStatus.OK).json({ data: user, statusCode: HttpStatus.OK, success: true });
  }

  @Get("refresh")
  async refresh(@Request() req, @Res() res, @Headers() headers) {
    const refreshToken = req.cookies?.Refresh;
    const { accessToken, user } = await this.authService.refresh(refreshToken);
    return res.status(HttpStatus.OK).json({ accessToken, user, statusCode: HttpStatus.OK, success: true });
  }

  @Get("logout")
  async logout(@Request() req, @Res() res, @Headers() headers) {
    const jwtToken = headers.authorization.split(" ")[1];
    const data = this.authService.decodeAccessToken(jwtToken);
    await this.authService.removeRefreshToken(data.email);
    req.res.setHeader("Set-Cookie", "Refresh=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0");
    return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, success: true });
  }
}