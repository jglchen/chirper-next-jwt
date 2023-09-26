import { useState, useContext, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import createAxios from '@/lib/axios';
import secureLocalStorage  from  'react-secure-storage';
import AuthSessionStatus from '@/components/AuthSessionStatus';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import { UserContextType, ErrorsType } from '@/lib/types';
import { encryptSessionData } from '@/lib/cryptosession';
import { UserContext } from '@/lib/context';
import useRedirectIfAuthenticated from '@/lib/useredirectifauthenticated';
import validateLoginClient from '@/validate/login-client';

const LoginForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const router = useRouter();
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRemember, setShouldRemember] = useState(false);
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(null);

    useRedirectIfAuthenticated(userContext.user.id, userContext.authToken, '/dashboard');

    useEffect(() => {
        if ((router.query.reset as string)?.length > 0 && Object.keys(errors).length === 0) {
            setStatus(window.atob(router.query.reset as string))
        } else {
            setStatus(null)
        }
    },[errors, router.query.reset])

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
    
        setErrors({});
        setStatus(null);
        
        const inputObj = {
            email,
            password,
            remember: shouldRemember,            
        }

        const validateResult = validateLoginClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }
        
        axios
            .post('/login', inputObj)
            .then(res => {
                if (res.data){
                    if (shouldRemember){
                        secureLocalStorage.setItem('user_data', res.data);
                    }else{
                        encryptSessionData('user_data', res.data);
                    }
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
            })
    }

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
                        autoComplete="current-password"
                    />

                    <InputError
                        messages={errors.password}
                        className="mt-2"
                    />
                </div>

                {/* Remember Me */}
                <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={event =>
                                setShouldRemember(event.target.checked)
                            }
                        />

                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
            
                    <Link
                        href="/forgot-password"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Forgot your password?
                    </Link>
            
                    <Link
                        href="/register"
                        className="underline text-sm text-gray-600 hover:text-gray-900 ml-3">
                        Register
                    </Link>

                    <Button className="ml-3">Login</Button>
                </div>
            </form>
        </>
    );

}    

export default LoginForm;
