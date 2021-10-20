import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { errors} from 'celebrate';
import cors from 'cors';

import http from 'http';
import { Server } from 'socket.io';

import { AppError } from '../../errors/AppError';
import { appRoutes } from './routes/index';

const client_id = process.env.GITHUB_CLIENT_ID;

const app = express();
app.use(express.json());
app.use(errors());
app.use(appRoutes);
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: '*'
  }
});

io.on('connection', socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
})

// Error handle
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // If the error is instance of AppError, then show the status code of the error and his message
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ status: 'error', message: err.message });
  }
  
  console.log(err);
  
  // If the error isn't instance of AppError, then show the 500 status code (unknown internal error)
  return response.status(500).json({ status: 'error', message: 'Internal server error.' });
});

// Login com github
app.get('/github', (request: Request, response: Response) => {
  return response.redirect(`http://github.com/login/oauth/authorize?client_id=${client_id}`);
});

// Pegar o código retornado pelo login via github
app.get('/signin/callback', (request: Request, response: Response) => {
  const { code } = request.query;

  return response.json({ code });
});

export { serverHttp, io }