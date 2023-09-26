import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useRedirectIfAuthenticated(userID: number | undefined, authToken: string, redirectIfAuthenticated: string = '/'){
    const router = useRouter();

    useEffect(() => {
        if (userID && authToken){
            router.push(redirectIfAuthenticated);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userID, authToken, redirectIfAuthenticated]);
}