import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import {
    checkAuthStatus,
    loginUser,
    logoutUser,
    signupUser,
  } from "../lib/apiCommunicators";

  
  const AuthContext = createContext(null);
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        console.log(data)
        if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    }
  
    useEffect(() => {
      checkStatus();
    }, []);
  
    
    const login = async (email, password) => {
      const data = await loginUser(email, password);
      if (data) {
        setUser({ email: data.email, name: data.name });
        setIsLoggedIn(true);
  
        checkStatus();
      }
    };
    const signup = async (name, email, password) => {
      const data = await signupUser(name, email, password);
      if (data) {
        setUser({ email: data.email, name: data.name });
        setIsLoggedIn(true);
  
        checkStatus();
      }
    };
    const logout = async () => {
      await logoutUser();
      setIsLoggedIn(false);
      setUser(null);
    };
  
    const value = {
      user,
      isLoggedIn,
      isLoading,
      login,
      logout,
      signup,
    };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
  
    if(context === undefined){
      throw new Error("useAuth must be used inside AuthProvider/AuthContext");
    }
  
    return context;
  };