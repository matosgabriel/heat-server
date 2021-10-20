import { Request, Response } from 'express';

import { GetLast3MessagesService } from '../../../service/GetLast3MessagesService';

class GetLast3MessagesController {
  async handle(request: Request, response: Response) {
    const getLast3MessagesService = new GetLast3MessagesService();

    const messages = await getLast3MessagesService.execute();
  
    return response.json(messages);
  }
}

export { GetLast3MessagesController }