import { createContext } from "react";
import { IUserContext } from "./app-context-types";

export const UserContext = createContext<IUserContext>({
    user:null,
    setUser: ()=>{},
    isFetchingUser:true,
    setIsFetchingUser: ()=>{}
});
