import { useContext } from 'react';
import { UserContextType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import dynamic from 'next/dynamic';

const HomeRedirect = () => {
    const userContext: UserContextType = useContext(UserContext);
    const userExist = userContext.user.id && userContext.authToken ? true:false;
    const HomeRedirectNoSSR = dynamic(() => import('./HomeRedirectNoSSR'), { ssr: false })

    return (
      <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
        <HomeRedirectNoSSR userExist={userExist} />
      </div>
    );
}

export default HomeRedirect;
