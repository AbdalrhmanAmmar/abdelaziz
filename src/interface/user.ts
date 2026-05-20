export interface IUser {
  id: string;
  username: string;
  createdAt: string | Date;
}

export interface ICreateUserInput {
  username: string;
  password: string;
}

export interface IUpdateUserInput {
  username?: string;
}

export interface ILoginInput {
  username: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface IUpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
