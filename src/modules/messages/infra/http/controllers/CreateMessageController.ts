import { Request, Response } from 'express';
import { CreateMessageService } from '../../../service/CreateMessageService';

const createMessageService = new CreateMessageService();

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { text } = request.body;
    const { user_id } = request;

    const message = await createMessageService.execute({ text, user_id });

    return response.json(message);
  }
}

export { CreateMessageController }