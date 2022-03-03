import { Dispatch, SetStateAction } from "react";
import { IContextUser } from "../models/user";

export interface IUserContext {
  user: IContextUser | null;
  setUser: Dispatch<SetStateAction<IContextUser | null>>;
  isFetchingUser: boolean;
  setIsFetchingUser: React.Dispatch<React.SetStateAction<boolean>>;
}
