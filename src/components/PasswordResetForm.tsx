import { useEffect, useState, useContext, FormEvent } from 'react';
import { useRouter } from 'next/router';
import createAxios from '@/lib/axios';
import AuthSessionStatus from '@/components/AuthSessionStatus';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import { UserContextType, UserResponseType, ErrorsType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import useRedirectIfAuthenticated from '@/lib/useredirectifauthenticated';
import validatePasswordResetClient from '@/validate/password-reset-client';

const PasswordResetForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const router = useRouter();
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(null);

    useRedirectIfAuthenticated(userContext.user.id, userContext.authToken, '/dashboard');

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()

        setErrors({});
        setStatus(null);

        const inputObj = {
            token: router.query.token as string, 
            email,
            password,
            password_confirmation: passwordConfirmation,
        }

        const validateResult = validatePasswordResetClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }

        axios
            .post('/reset-password', inputObj)
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });
    }
 
    useEffect(() => {
        setEmail(router.query.email as string || '')
    }, [router.query.email])

    return (
        <>
            {/* Session Status */}
            <AuthSessionStatus className="mb-4" status={status} />

            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={(event: FormEvent) => setEmail((event.target as HTMLInputElement).value)}
                        required
                        autoFocus
                    />

                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={(event: FormEvent) => setPassword((event.target as HTMLInputElement).value)}
                        required
                    />

                    <InputError
                        messages={errors.password}
                        className="mt-2"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <Label htmlFor="passwordConfirmation">
                        Confirm Password
                    </Label>

                    <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        className="block mt-1 w-full"
                        onChange={(event: FormEvent) =>
                            setPasswordConfirmation((event.target as HTMLInputElement).value)
                        }
                        required
                    />

                    <InputError
                        messages={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button>Reset Password</Button>
                </div>
            </form>
        </>
    );
}  



export default PasswordResetForm;
