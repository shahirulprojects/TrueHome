// this file gives the global context to the app meaning we can access the user object and isLoggedIn from any component

import { createContext, ReactNode, useContext } from "react";
import { useAppwrite } from "./useAppwrite";
import { getCurrentUser } from "./appwrite";

// matches appwrite's user model structure
interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  avatar: string;
  registration: string;
  status: boolean;
  passwordUpdate: string;
  emailVerification: boolean;
  prefs: object;
  accessedAt: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>; // this function accepts optional parameters as a record of string or number types and returns a promise that resolves to void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined); // createContext of a type GlobalContextType or undefined where at the start is undefined

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });

  // this checks if the user object exists and converts it to a boolean value, so isLoggedIn will be true if user is not null or undefined
  const isLoggedIn = !!user;

  // cast the refetch function to match the expected type signature
  const typedRefetch: GlobalContextType["refetch"] = async (newParams) => {
    await refetch(newParams || {});
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user: (user === undefined ? null : user) as User | null,
        loading,
        refetch: typedRefetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
