import { createContext, useState } from "react";

import { UserType } from "../../globalTypes";

export interface SessionType {
  id: string;
  user_id: string;
  created_timestamp: string;
  last_modified_timestamp: string;
}

export interface SessionObjType {
  id: string;
  session: SessionType;
}

interface UserContextType {
  user: UserType | null;
  updateUser: Function;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: (newUser: UserType, cb: Function) => {}
});

/*
 * User Context Provider
 */
interface UserContextProviderProps {
  children?: any;
}

const UserContextProvider = ({
  children
}: UserContextProviderProps) => {
  // User
  const [user, setUser] = useState<UserType | null>({
      username: null,
      id: null,
      token: null,
      created_timestamp: null,
      last_modified_timestamp: null
    }),
    updateUser = (newUser: UserType) => {
      setUser(newUser);
    };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
