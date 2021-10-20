import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';

const authenticateRoutes = Router();

authenticateRoutes.post('/', new AuthenticateUserController().handle);

export { authenticateRoutes }