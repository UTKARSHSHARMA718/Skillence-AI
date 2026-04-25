import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/resgiter.dto';
import * as bcrypt from 'bcrypt';
import { NotificationService } from 'src/notification/notification.service';
import { Role } from '@prisma/client';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetTokenService } from 'src/reset-token/reset-token.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { getRegisterEmailTemplate } from './emailTemplates/register.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly resetTokenService: ResetTokenService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.userService.getUniqueUser(
      { email: payload.email },
      { isPasswordIncluded: true },
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const { password } = user;

    const isPasswordValid = await this.comparePasswords(
      payload.password,
      password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // generate JWT token
    const accessToken = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      { expiresIn: '7d' },
    );

    // reset the states once the user logs in successfully
    await this.userService.updateUser(
      { refreshToken, cachedAccessToken: '', refreshTokenRotatedAt: null },
      { id: user.id },
    );

    const decodedToken = this.jwtService.decode(accessToken) as { exp: number };
    const expiresIn = decodedToken.exp;

    return {
      token: accessToken,
      user,
      refreshToken,
      expiresIn,
      message: 'Login successful',
    };
  }

  async register(payload: RegisterUserDto) {
    const existingUser = await this.userService.getUniqueUser({
      email: payload.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const password = await this.generateRandomPassword();

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.createUser(payload, hashedPassword);

    // send email notification to user with their credentials
    await this.notificationService.sendEmail(
      newUser.email,
      'Welcome to AI Bootcamp',
      getRegisterEmailTemplate({
        userName: newUser.name,
        userEmail: newUser.email,
        generatedPassword: password,
      }),
    );

    return {
      user: newUser,
      password: undefined,
      message: 'Registration successful',
    };
  }

  async createAdmin(payload: RegisterAdminDto) {
    const { users } = await this.userService.getUsers({
      where: { role: Role.ADMIN },
      page: 1,
      pageSize: 1,
    });

    if (users && users.length > 0) {
      throw new BadRequestException('Admin already exists');
    }

    const hashedPassword = await this.hashPassword(payload.password);

    await this.userService.createAdmin({
      email: payload.email,
      name: payload.name,
      password: hashedPassword,
    });

    return {
      message: 'Admin created successfully',
    };
  }

  async changePassword(payload: ChangePasswordDto, userId: string) {
    const { currentPassword, newPassword } = payload;

    const user = await this.userService.getUniqueUser(
      { id: userId },
      { isPasswordIncluded: true },
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid = await this.comparePasswords(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);

    await this.userService.updateUser(
      { password: hashedNewPassword },
      { id: userId },
    );

    return {
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const { email } = payload;
    const user = await this.userService.getUniqueUser({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = await this.resetTokenService.findUnique({
      userId: user.id,
    });

    // Invalidate any existing token for the user before creating a new one
    if (resetToken) {
      await this.resetTokenService.delete({ id: resetToken.id });
    }

    const verificationToken = await this.generateRandomPassword(32); // Generate a random token

    const jwtVerificationToken = this.jwtService.sign(
      { verificationToken },
      { expiresIn: '5m' }, // Token expires in 5 minutes
    );

    // Store the token in the database with an expiration time (e.g., 5 minutes)
    // Store the token in the database with an expiration time (e.g., 5 minutes)
    // To auto-delete after expiry in MongoDB, use a TTL index on the expiresAt field in your resetToken collection.
    await this.resetTokenService.create({
      token: verificationToken,
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Token expires in 5 minutes
    });
    // NOTE: Ensure your MongoDB collection has a TTL index on expiresAt, e.g.:
    // db.resetToken.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })

    const url =
      `${process.env.FRONTEND_URL}/reset-password?token=` +
      jwtVerificationToken;

    await this.notificationService.sendEmail(
      user.email,
      'Password Reset Request',
      `You requested a password reset. Click the link below to reset your password. This link will expire in 5 minutes.\n\n${url}`,
    );

    return {
      message: 'Password reset email sent successfully',
    };
  }

  async resetPassword(jwtVerificationToken: string, newPassword: string) {
    const { verificationToken: token } =
      this.jwtService.decode(jwtVerificationToken);

    if (!token) {
      throw new BadRequestException('Invalid or expired token');
    }

    const resetToken = await this.resetTokenService.findUnique({
      token,
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);

    await this.userService.updateUser(
      { password: hashedNewPassword },
      { id: resetToken.userId },
    );

    // Invalidate the token after use
    await this.resetTokenService.delete({ id: resetToken.id });

    return {
      message: 'Password reset successfully',
    };
  }

  async logout(userId: string) {
    const user = await this.userService.getUniqueUser({ id: userId });

    if (!user) throw new BadRequestException('User not found');

    // Verify the refresh token actually belongs to this user
    if(!user.refreshToken){
      throw new BadRequestException('No active session found');
    }

    // Invalidate refresh token in DB — this is the critical step
    await this.userService.updateUser(
      {
        refreshToken: "", // wipe refresh token
        refreshTokenRotatedAt: null,
        cachedAccessToken: null,
      },
      { id: userId },
    );

    return { message: 'Logged out successfully' };
  }

  async generateRandomPassword(length: number = 12): Promise<string> {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async refreshToken(refreshToken: string) {
    let refreshTokenDecoded;
    try {
      refreshTokenDecoded = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new BadRequestException('Refresh token expired');
    }

    const userId = refreshTokenDecoded.userId;
    const user = await this.userService.getUniqueUser({ id: userId });

    if (!user) throw new BadRequestException('User not found');

    // also accept the *previous* refresh token within a short reuse window
    // This handles the race where multiple requests arrive with the old token
    // just as it was being rotated
    const tokenIsValid = user.refreshToken === refreshToken;
    const tokenWasRecentlyRotated =
      user.refreshTokenRotatedAt &&
      Date.now() - user.refreshTokenRotatedAt.getTime() < 3_000; // 3s grace window

    if (!tokenIsValid && !tokenWasRecentlyRotated) {
      throw new BadRequestException('Invalid refresh token');
    }

    // If this is the already-rotated token, return the SAME new tokens
    // without re-rotating (idempotent response for duplicate requests)
    if (tokenWasRecentlyRotated) {
      console.log(
        'Returning cached rotation result for duplicate refresh request',
      );
      return {
        newAccessToken: user.cachedAccessToken, // store this on rotation
        newRefreshToken: user.refreshToken, // current token IS the new one
        expiresIn: this.getExpiry(user.cachedAccessToken),
        message: 'Token refreshed successfully',
      };
    }

    // Normal rotation path
    const newAccessToken = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });
    const newRefreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    const decodedToken = this.jwtService.decode(newAccessToken) as {
      exp: number;
    };

    await this.userService.updateUser(
      {
        // Current fields
        refreshToken: newRefreshToken,
        refreshTokenRotatedAt: new Date(),
        cachedAccessToken: newAccessToken, // store the new access token for potential reuse
      },
      { id: user.id },
    );

    return {
      newAccessToken,
      newRefreshToken,
      expiresIn: decodedToken.exp,
      message: 'Token refreshed successfully',
    };
  }

  private getExpiry(token: string): number {
    const decoded = this.jwtService.decode(token) as { exp: number };
    return decoded.exp;
  }
}
