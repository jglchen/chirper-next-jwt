import { useState, useEffect, useContext, FormEvent} from 'react';
import { useRouter } from 'next/router';
import secureLocalStorage  from  'react-secure-storage';
import { decryptSessionData, encryptSessionData } from '@/lib/cryptosession';
import createAxios from '@/lib/axios';
import { UserContext } from '@/lib/context';
import Button from '@/components/Button';
import { UserContextType, ErrorsType } from '@/lib/types';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import validateLoginClient from '@/validate/login-client';

const VerifyEmailForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const router = useRouter();
    const [status, setStatus] = useState<string | null>(null);
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRemember, setShouldRemember] = useState(false);
    const [errors, setErrors] = useState<ErrorsType>({});
    
    useEffect(()=> {
        if (userContext.authToken && router.query.id && router.query.hash){
            const currentUrl = window.location.href;
            axios
                .get(currentUrl.substring(currentUrl.indexOf('/verify-email')))
                .then(response => {
                    axios
                        .get('/user')
                        .then(res => {
                            console.log(res);
                            if (res.data){
                                const userData = {
                                    user: res.data,
                                    authorization: {
                                        token: userContext.authToken,
                                        type: 'bearer',
                                    }
                                }
                                if (secureLocalStorage.getItem('user_data')){
                                    secureLocalStorage.setItem('user_data', userData);
                                }
                                if (decryptSessionData('user_data', 'object')){
                                    encryptSessionData('user_data', userData);
                                }
                                userContext.userlLogin(userData);
                            }
                            router.push('/dashboard');
                        });
                })
                .catch(error => {
                   console.log(error.response.data);
                   setStatus(error.response.data.message);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userContext.authToken, router.query.id, router.query.hash]);
   
    const resendEmailVerification = () => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status));
    }

    const logout = async () => {
        await axios
            .post('/logout')
            .then(res => {
                if (res.data){
                    // Remove all saved data from secureLocalStorage
                    secureLocalStorage.clear();
                    // Remove all saved data from sessionStorage
                    sessionStorage.clear();
                    userContext.userlLogout();
                }
            })
        .catch(error => {
           throw error;
        });
        window.location.pathname = '/login';
    };

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
        {userContext.authToken
        ?
        (
        <>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-200">
            Thanks for signing up! Before getting started, could you
            verify your email address by clicking on the link we just
            emailed to you? If you didn&rsquo;t receive the email, we will
            gladly send you another.
        </div>

        {status === 'verification-link-sent' && (
            <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-200">
                A new verification link has been sent to the email
                address you provided during registration.
            </div>
        )}

        {status !== 'verification-link-sent' && status && (
            <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-200">
                {status}
            </div>
        )}

        <div className="mt-4 flex items-center justify-between">
            <Button
                onClick={() => resendEmailVerification()}>
                Resend Verification Email
            </Button>

            <button
                type="button"
                className="underline text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50"
                onClick={logout}>
                Logout
            </button>
        </div>
        </>
        ) 
        :
        (
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

                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-200">
                        Remember me
                    </span>
                </label>
            </div>
            <div className="flex items-center justify-end mt-4">
                <Button className="ml-3">Login</Button>
            </div>
        </form>
        )
        }
       </>
   );
}  

export default VerifyEmailForm;