import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { GetLoggedUserProfileController } from '../controllers/GetLoggedUserProfileController';

const profileRoutes = Router();

profileRoutes.get('/', ensureAuthenticated, new GetLoggedUserProfileController().handle);

export { profileRoutes }