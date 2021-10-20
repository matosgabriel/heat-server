import { AppError } from '../../../shared/errors/AppError';
import { prismaClient } from '../../../shared/infra/http/prisma';

import { io } from '../../../shared/infra/http/app';

import { ICreateMessageDTO } from '../dtos/ICreateMessageDTO';

class CreateMessageService {
  async execute({ text, user_id }: ICreateMessageDTO) {
    const user = await prismaClient.user.findFirst({ where: { id: user_id } });

    // If did not exists an user with the id received, then throw a new AppError
    if (!user) {
      throw new AppError('Did not exists user with this id.', 400);
    }

    // Create the new message
    const message = await prismaClient.message.create({
      data: { text, user_id },
      include: { user: true }
    });

    const infoWS = {
      text: message.text,
      created_at: message.created_at,
      user: {
        id: message.user.id,
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit('new_message', infoWS);

    return message;
  }
}

export { CreateMessageService }