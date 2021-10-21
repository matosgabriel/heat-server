import { prismaClient } from '../../../shared/infra/http/prisma';

class GetLast3MessagesService {
  async execute() {
    // Get the last 3 messages created
    const messages = await prismaClient.message.findMany({
      orderBy: { created_at: 'desc' },
      take: 3,
      include: { user: true }
    });

    return messages;
  }
}

export { GetLast3MessagesService }