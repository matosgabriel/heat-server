import axios from 'axios';
import { IAuthenticateUserDTO } from '../dtos/AuthenticateUserDTO';
import { prismaClient } from '../../../shared/infra/http/prisma';
import { sign } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import { AppError } from '../../../shared/errors/AppError';

/**
 * Receber code -> string
 * Recuperar o access_token do github
 * Acessar informações do usuário através do access_token
 * Verificar se o usuário existe no banco
 *     Caso afirmativo: Gerar um token para o mesmo
 *     Caso negativo: Cria no banco e gera um token
 * Retornar o token e as informações do usuário
 */

interface IAcessTokenResponse {
  access_token: string
}

interface IUserData {
  login: string,
  avatar_url: string,
  id: number,
  name: string,

}

class AuthenticateUserService {
  async execute({ code, environment }: IAuthenticateUserDTO) {
    const url = `https://github.com/login/oauth/access_token`;

    let accessTokenResponse: IAcessTokenResponse;

    try {
      const { data } = await axios.post<IAcessTokenResponse>(url, null, {
        params: {
          client_id: environment === 'web' ? process.env.GITHUB_CLIENT_ID_WEB : process.env.GITHUB_CLIENT_ID_MOBILE,
          client_secret: environment === 'web' ? process.env.GITHUB_CLIENT_SECRET_WEB : process.env.GITHUB_CLIENT_SECRET_MOBILE,
          code,
        },
        headers: {
          "Accept": "application/json"
        }
      });

      accessTokenResponse = data;
    } catch(err) {
      throw new AppError(err.message, 401);
    }

    if (!accessTokenResponse) {
      throw new AppError('Invalid token.', 401);
    }

    const { data: userData } = await axios.get<IUserData>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    });

    const { avatar_url, id, login, name } = userData;

    // Verifying if already exists an user with the github id received from login
    let user = await prismaClient.user.findFirst({ where: { github_id: id } });
    
    // If does not exists in the db an user with the github id
    if (!user) {
      user = await prismaClient.user.create({ data: { avatar_url, github_id: id, login, name } });
    }

    const token = sign({}, authConfig.jwt.secret, { expiresIn: authConfig.jwt.expiresIn, subject: user.id });
    
    return { token, user };
  }
}

export { AuthenticateUserService }