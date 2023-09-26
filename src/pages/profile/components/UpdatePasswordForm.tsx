import { useEffect, useState, useContext, FormEvent } from 'react';
import createAxios from '@/lib/axios';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Button from '@/components/Button';
import { Transition } from '@headlessui/react';
import { UserContextType, ErrorsType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import validateUpdatePasswordClient from '@/validate/update-password-client';

export default function UpdatePasswordForm({ className = '' }) {
    const userContext: UserContextType = useContext(UserContext);
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
       if (status === 'updatepassword_done') {
          const statusTimeout = setTimeout(() => {
            setBackToDefault();
          }, 1000);

          return () => clearTimeout(statusTimeout);
       }
    },[status]);

    const updatePasswd = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(null);
        setProcessing(true);

        const inputObj = {
            current_password: currentPassword,
            password,
            password_confirmation: passwordConfirmation,
        }

        const validateResult = validateUpdatePasswordClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }

        await axios
            .put('/update-password', inputObj)
            .then(() => setStatus('updatepassword_done'))
            .catch(error => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
        });

        setProcessing(false);
    }
    
    const setBackToDefault = () => {
        setStatus(null);
        setErrors({});
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirmation('');
    }


    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePasswd} className="mt-6 space-y-6">

                <div>
                    <Label htmlFor="current_password">Current Password</Label>

                    <Input
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(event: FormEvent) => setCurrentPassword((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        required
                    />

                    <InputError
                            messages={errors.current_password}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label htmlFor="password">New Password</Label>

                    <Input
                        id="password"
                        value={password}
                        onChange={(event: FormEvent) => setPassword((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        required
                    />

                    <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label htmlFor="passwordConfirmation">Confirm Password</Label>

                    <Input
                        id="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(event: FormEvent) => setPasswordConfirmation((event.target as HTMLInputElement).value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        required
                    />

                    <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>
                    
                    <Transition
                        show={status === 'updatepassword_done'}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>

        </section>
    );

}    