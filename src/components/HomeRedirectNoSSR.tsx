import Link from 'next/link';

const HomeRedirectNoSSR = ({userExist}: {userExist: boolean}) => {
    if (userExist){
        return (
            <Link
              href="/dashboard"
              className="ml-4 text-sm text-gray-700 underline">
              Dashboard
            </Link>
        );
    }
    return (
        <>
        <Link
          href="/login"
          className="text-sm text-gray-700 underline">
          Login
        </Link>

        <Link
          href="/register"
          className="ml-4 text-sm text-gray-700 underline">
          Register
        </Link>
        </>
    );
}    

export default HomeRedirectNoSSR;
