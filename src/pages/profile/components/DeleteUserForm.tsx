import { useState, useContext, FormEvent } from 'react';
import secureLocalStorage  from  'react-secure-storage';
import createAxios from '@/lib/axios';
import DangerButton from '@/components/DangerButton';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import { UserContextType, ErrorsType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import validateUserDeleteClient from '@/validate/userdelete-client';

export default function DeleteUserForm({ className = '' }) {
    const userContext: UserContextType = useContext(UserContext);
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorsType>({});
    const axios = createAxios(userContext ? userContext.authToken: '');

    const deleteAccount = (event: FormEvent) => {
        event.preventDefault()
        
        setErrors({});

        const inputObj = {
            password
        }

        const validateResult = validateUserDeleteClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }
        
        axios
            .post('/userdelete', inputObj)
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
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    }

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setPassword('');
        setErrors({});
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Delete Account</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before
                    deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <DangerButton onClick={() => setConfirmingUserDeletion(true)}>Delete Account</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteAccount} className="p-6 dark:bg-black">

                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please
                        enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="mt-6">
                        <Label htmlFor="password" className="sr-only">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event: FormEvent) => setPassword((event.target as HTMLInputElement).value)}
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                            required
                            autoFocus
                       />

                        <InputError
                            messages={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ml-3">
                            Delete Account
                        </DangerButton>
                    </div>

                </form>
            </Modal>

        </section>
    );

}   