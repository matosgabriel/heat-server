interface IAuthenticateUserDTO {
  code: string;
  environment: 'mobile' | 'web';
}

export { IAuthenticateUserDTO }