import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext({
  state: { session: null },
  dispatch: function () {},
  login: function () {},
});

const authReducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case 'LOGIN':
      localStorage.setItem('session', JSON.stringify(action.payload));
      return {
        session: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('session');
      return {
        session: null,
      };
    default:
      console.log('Unexpected action type');
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    session: null,
  });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      dispatch({
        type: 'LOGIN',
        payload: session,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
