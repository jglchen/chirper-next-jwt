import { useState, useContext, FormEvent } from 'react';
import createAxios from '@/lib/axios';
import AuthSessionStatus from '@/components/AuthSessionStatus';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import { UserContextType, ErrorsType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import useRedirectIfAuthenticated from '@/lib/useredirectifauthenticated';
import validateForgotPasswordClient from '@/validate/forgot-password-client';

const ForgotPasswordForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<ErrorsType>({})
    const [status, setStatus] = useState<string | null>(null)

    useRedirectIfAuthenticated(userContext.user.id, userContext.authToken, '/dashboard');


    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(null);

        const validateResult = validateForgotPasswordClient({email});
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return (
        <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-200">
                Forgot your password? No problem. Just let us know your
                email address and we will email you a password reset link
                that will allow you to choose a new one.
            </div>

            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={(event: FormEvent) => setEmail((event.target as HTMLInputElement).value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button>Email Password Reset Link</Button>
                </div>
            </form>
        </>
    );    
}    

export default ForgotPasswordForm;
