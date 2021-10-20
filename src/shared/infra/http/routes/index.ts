import { Router } from 'express';

import { authenticateRoutes } from '../../../../modules/users/infra/http/routes/authenticate.routes';
import { profileRoutes } from '../../../../modules/users/infra/http/routes/profile.routes';
import { messagesRoutes } from '../../../../modules/messages/infra/http/routes/messages.routes';

const appRoutes = Router();

appRoutes.use('/authenticate', authenticateRoutes);

appRoutes.use('/messages', messagesRoutes);

appRoutes.use('/profile', profileRoutes);

export { appRoutes }