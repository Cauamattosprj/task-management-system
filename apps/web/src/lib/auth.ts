export const useAuth = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };
  const signIn = () => {
    return localStorage.setItem("isAuthenticated", "true");
  };
  const logOut = () => {
    return localStorage.removeItem("isAuthenticated");
  };

  return {signIn, logOut, isAuthenticated}
};

export type AuthContext = ReturnType<typeof useAuth>;
