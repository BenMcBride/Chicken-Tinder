import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext({
  session: null,
  setSession: function () {}
})

const AuthProvider = ({children}) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      setSession(session);
    }
  }, [])
  return (
    <AuthContext.Provider value={{session, setSession}}>
      {children}
    </AuthContext.Provider>
    );
}
export default AuthProvider;