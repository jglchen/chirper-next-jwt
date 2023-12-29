import Link from 'next/link';
import ThemeToggler from '@/components/ThemeToggler';

const HomeRedirectNoSSR = ({userExist}: {userExist: boolean}) => {
  
  return (
    <div className="flex items-center">
      {userExist ?
      (
        <Link
          href="/dashboard"
          className="ml-4 text-sm text-gray-700 dark:text-gray-100 underline">
          Dashboard
        </Link>
      ):(
        <>
        <Link
          href="/login"
          className="text-sm text-gray-700 dark:text-gray-100 underline">
          Login
        </Link>
        <Link
          href="/register"
          className="ml-4 text-sm text-gray-700 dark:text-gray-100 underline">
          Register
        </Link>
       </>
      )} 
      <ThemeToggler /> 
    </div>
  );     
}    

export default HomeRedirectNoSSR;
