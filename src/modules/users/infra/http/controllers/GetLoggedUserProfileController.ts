import { Request, Response } from 'express';
import { GetUserProfileService } from '../../../services/GetUserProfileService';

class GetLoggedUserProfileController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;

    const getUserProfileService = new GetUserProfileService();

    const user = await getUserProfileService.execute(user_id);

    return response.json(user);
  }
}

export { GetLoggedUserProfileController }