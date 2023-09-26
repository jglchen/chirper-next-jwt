import ApplicationLogo from '@/components/ApplicationLogo';
import AuthCard from '@/components/AuthCard';
import GuestLayout from '@/components/Layouts/GuestLayout';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

const Login = () => {

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <LoginForm />
            </AuthCard>
        </GuestLayout>
    )
}

export default Login;
