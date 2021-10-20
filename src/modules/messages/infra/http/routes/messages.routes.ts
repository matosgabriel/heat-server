import { Router } from 'express';
import { CreateMessageController } from '../controllers/CreateMessageController';

import { ensureAuthenticated } from '../../../../users/infra/http/middlewares/ensureAuthenticated';
import { GetLast3MessagesController } from '../controllers/GetLast3MessagesController';

const messagesRoutes = Router();

messagesRoutes.post('/', ensureAuthenticated, new CreateMessageController().handle);
messagesRoutes.get('/last3', new GetLast3MessagesController().handle)

export { messagesRoutes }