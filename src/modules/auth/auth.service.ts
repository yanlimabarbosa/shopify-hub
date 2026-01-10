import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt.js";
import { authRepository } from "./auth.repository.js";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../shared/errors/AuthErrors.js";
import type { RegisterInput, LoginInput, UserResponse, LoginResponse } from "./auth.types.js";

export class AuthService {
  private readonly BCRYPT_ROUNDS = 10;

  async register(input: RegisterInput): Promise<UserResponse> {
    const { name, email, password } = input;

    const exists = await authRepository.emailExists(email);
    if (exists) {
      throw new EmailAlreadyExistsError();
    }

    const userCount = await authRepository.countUsers();
    const role = userCount === 0 ? "ADMIN" : "USER";

    const passwordHash = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    const user = await authRepository.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    return user;
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = signToken({
      sub: user.id,
      role: user.role,
    });

    return { token };
  }

  async getUserProfile(userId: string): Promise<UserResponse> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}

export const authService = new AuthService();
