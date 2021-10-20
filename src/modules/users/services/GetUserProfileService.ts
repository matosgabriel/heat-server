import { AppError } from "../../../shared/errors/AppError";
import { prismaClient } from "../../../shared/infra/http/prisma"

class GetUserProfileService {
  async execute(user_id: string) {
    // Get user info
    const user = await prismaClient.user.findFirst({ where: { id: user_id } });

    // If user does not exists, then throw a new AppError
    if(!user) {
      throw new AppError('User not found.', 400);
    }

    return user;
  }
}

export { GetUserProfileService }