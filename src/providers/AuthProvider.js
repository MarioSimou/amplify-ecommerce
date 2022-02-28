import React from "react";
import { Auth } from "aws-amplify";

export const AuthContext = React.createContext({});
export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("error: please wrap your component within 'AuthProvider'");
  }
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState();
  console.log("cognito user: ", currentUser);

  const getCurrentUser = async () => {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      setCurrentUser(cognitoUser);
    } catch (e) {
      return [e];
    }
  };

  const getCurrentUserGroups = React.useCallback(() => {
    return (
      currentUser?.signInUserSession?.accessToken?.payload["cognito:groups"] ??
      []
    );
  }, [currentUser]);

  const isAdmin = React.useMemo(() => {
    return getCurrentUserGroups().includes("Admin");
  }, [getCurrentUserGroups]);

  const signOut = React.useCallback(async () => {
    try {
      await Auth.signOut();
      return [undefined];
    } catch (e) {
      return [e];
    }
  }, []);

  React.useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, signOut, getCurrentUserGroups, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
