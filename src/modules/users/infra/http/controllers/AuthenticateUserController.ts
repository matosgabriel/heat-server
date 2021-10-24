import { Request, Response } from 'express';
import { AuthenticateUserService } from '../../../services/AuthenticateUserService';
import { IncomingHttpHeaders } from 'http';

interface IHeader extends IncomingHttpHeaders {
  environment: 'web' | 'mobile';
}

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { environment } = request.headers as IHeader;
    const { code } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    const result = await authenticateUserService.execute({ code: code as string, environment });
  
    return response.json(result);
  }
}

export { AuthenticateUserController }