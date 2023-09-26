import ApplicationLogo from '@/components/ApplicationLogo';
import AuthCard from '@/components/AuthCard';
import GuestLayout from '@/components/Layouts/GuestLayout';
import Link from 'next/link';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

const ForgotPassword = () => {
    
    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <ForgotPasswordForm />
            </AuthCard>
        </GuestLayout>
    )
}

export default ForgotPassword
