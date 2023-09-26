import { createContext } from 'react';

export const UserContext = createContext({
    user: {},
    authToken: '',
    userlLogin: () => {},
    userlLogout: () => {}
});