import { useState, useContext, FormEvent } from 'react';
import Link from 'next/link';
import createAxios from '@/lib/axios';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import { UserContextType, ErrorsType } from '@/lib/types';
import { encryptSessionData } from '@/lib/cryptosession';
import { UserContext } from '@/lib/context';
import useRedirectIfAuthenticated from '@/lib/useredirectifauthenticated';
import validateRegisterClient from '@/validate/register-client';

const RegisterForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    
    useRedirectIfAuthenticated(userContext.user.id, userContext.authToken, '/dashboard');

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});

        const inputObj = {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        }

        const validateResult = validateRegisterClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }

        axios
            .post('/register', inputObj)
            .then(res => {
                if (res.data){
                    encryptSessionData('user_data', res.data);
                    userContext.userlLogin(res.data);
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;

                const {message, ...errorData} = error.response.data;
                if (message){
                    if (errorData.email){
                        errorData.email.push(message);
                    }else{
                        errorData.email = [message];
                    }
                }
                setErrors(errorData);
            });
    }

    return (
        <form onSubmit={submitForm}>
            {/* Name */}
            <div>
                <Label htmlFor="name">Name</Label>

                <Input
                    id="name"
                    type="text"
                    value={name}
                    className="block mt-1 w-full"
                    onChange={(event: FormEvent) => setName((event.target as HTMLInputElement).value)}
                    required
                    autoFocus
                />

                <InputError messages={errors.name} className="mt-2" />
            </div>

        {/* Email Address */}
        <div className="mt-4">
            <Label htmlFor="email">Email</Label>

            <Input
                id="email"
                type="email"
                value={email}
                className="block mt-1 w-full"
                onChange={(event: FormEvent) => setEmail((event.target as HTMLInputElement).value)}
                required
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
                autoComplete="new-password"
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
            <Link
                href="/login"
                className="underline text-sm text-gray-600 hover:text-gray-900">
                Already registered?
            </Link>

            <Button className="ml-4">Register</Button>
        </div>
    </form>


    );

}

export default RegisterForm;
