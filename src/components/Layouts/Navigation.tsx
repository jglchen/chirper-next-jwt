import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import secureLocalStorage  from  'react-secure-storage';
import { decryptSessionData, encryptSessionData } from '@/lib/cryptosession';
import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink';
import { DropdownButton, DropdownLink } from '@/components/DropdownLink';
import ThemeToggler from '@/components/ThemeToggler';
import createAxios from '@/lib/axios';
import { UserContext } from '@/lib/context';
import { UserContextType } from'@/lib/types';

const Navigation = () => {
    const userContext: UserContextType = useContext(UserContext);
    const [user, setUser] = useState(userContext.user.id && userContext.authToken ? userContext.user: null);
    const router = useRouter();
    const axios = createAxios(userContext ? userContext.authToken: '');

    useEffect(() => {
        if (router.query.verified){
            axios
                .get('/user')
                .then(res => {
                    console.log(res);
                    if (res.data){
                        const userData = {
                            user: res.data,
                            authorization: {
                                token: userContext.authToken,
                                type: 'bearer',
                            }
                        }
                        if (secureLocalStorage.getItem('user_data')){
                            secureLocalStorage.setItem('user_data', userData);
                        }
                        if (decryptSessionData('user_data', 'object')){
                            encryptSessionData('user_data', userData);
                        }
                        userContext.userlLogin(userData);
                    }
                })

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[router.query.verified]);
    
    useEffect(() => {
       if (!userContext.user.id){
          window.location.pathname = '/login';
       }
       if (userContext.user.id){
            setUser( userContext.user);
       }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userContext.user.id, userContext.user.name, userContext.user.email]);
    
    const [open, setOpen] = useState(false);

    const logout = async () => {
         await axios
         .post('/logout')
         .then(res => {
             if (res.data){
                // Remove all saved data from secureLocalStorage
                secureLocalStorage.clear();
                // Remove all saved data from sessionStorage
                sessionStorage.clear();
                userContext.userlLogout();
             }
         })
         .catch(error => {
            throw error;
         });
         window.location.pathname = '/login';

    };

    const profile = () => {
        window.location.href = '/profile';
    };

    return (
        <nav className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-600">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600 dark:text-gray-200" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={router.pathname === '/dashboard'}>
                                Dashboard
                            </NavLink>
                            <NavLink
                                href="/chirps"
                                active={router.pathname === '/chirps'}>
                                Chirps
                            </NavLink>
                        </div>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        <ThemeToggler />
                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 dar:hover:text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                    <div>{user?.name}</div>

                                    <div className="ml-1">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            }>
                            {/* Profile */}
                            <DropdownLink href={'/profile'}>
                                Profile
                            </DropdownLink>
                            {/* Authentication */}
                            <DropdownButton onClick={logout}>
                                Logout
                            </DropdownButton>
                        </Dropdown>
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <ThemeToggler />
                        <button
                            onClick={() => setOpen(open => !open)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24">
                                {open ? (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        className="inline-flex"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href="/dashboard"
                            active={router.pathname === '/dashboard'}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="/chirps"
                            active={router.pathname === '/chirps'}>
                            Chirps
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-10 w-10 fill-current text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-100">
                                    {user?.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500 dark:text-gray-300">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={profile}>
                                Profile
                            </ResponsiveNavButton>
                           <ResponsiveNavButton onClick={logout}>
                                Logout
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navigation
