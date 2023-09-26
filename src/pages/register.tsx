import ApplicationLogo from '@/components/ApplicationLogo';
import AuthCard from '@/components/AuthCard';
import GuestLayout from '@/components/Layouts/GuestLayout';
import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';

const Register = () => {

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <RegisterForm />
            </AuthCard>
        </GuestLayout>
    )
}

export default Register;
