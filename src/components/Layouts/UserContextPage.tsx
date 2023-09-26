import { useState } from 'react';
import { UserContext } from '@/lib/context';
import { getSecureStorage } from '@/lib/securestorage';
import { UserResponseType, UserType, UserContextType } from '@/lib/types';

interface PropsType {
    children: React.ReactNode;
}

const UserContextPage = ({ children }: PropsType) => {
    const secureStorage = getSecureStorage('user_data');
    const [user, setUser] = useState<UserType>(secureStorage ? secureStorage.user:{});
    const [authToken, setAuthToken] = useState<string>(secureStorage ? secureStorage.authorization.token:'');
    
    const userlLogin = (userResponse?: UserResponseType) => {
        if (userResponse){
            setUser(userResponse.user);
            setAuthToken(userResponse.authorization?.token);
        }
    };
     
    const userlLogout = () => {
        setUser({});
        setAuthToken('');
    }

    const userContext: UserContextType = {
        user: user,
        authToken: authToken,
        userlLogin: userlLogin,
        userlLogout: userlLogout
    };
  
    return (
        <UserContext.Provider value={userContext}>
        {children}
        </UserContext.Provider>
    );
}

export default UserContextPage;
