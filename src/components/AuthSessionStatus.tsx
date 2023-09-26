import { ComponentPropsWithoutRef } from 'react';

interface AuthSessionProps extends ComponentPropsWithoutRef<'div'> {
    status: string | null;
    className: string;
}

const AuthSessionStatus = ({ status, className, ...props }: AuthSessionProps) => (
    <>
        {status && (
            <div
                className={`${className} font-medium text-sm text-green-600`}
                {...props}>
                {status}
            </div>
        )}
    </>
)

export default AuthSessionStatus
