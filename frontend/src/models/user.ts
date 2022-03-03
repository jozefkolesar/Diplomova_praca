export interface IUser {
  status: string;
  token: string;
  data: Data;
}

export interface Data {
  user: User;
}

export interface User {
  role: string;
  _id: string;
  name: string;
  faculty: string;
  year: number;
  department: string;
  email: string;
  __v: number;
}

export interface IContextUser extends User {
  token: string;
}

export interface IRefreshUser {
  status: string;
  data: TopLevelData;
}

export interface TopLevelData {
  data: User;
}
