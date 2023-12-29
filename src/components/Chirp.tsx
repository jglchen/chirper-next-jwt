import { useState, FormEvent, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import createAxios from '@/lib/axios';
import Dropdown from '@/components/Dropdown';
import { DropdownButton } from '@/components/DropdownLink';
import InputError from '@/components/InputError';
import Button from '@/components/Button';
import { UserContext } from '@/lib/context';
import { UserContextType, ChirpType, MsgErrorsType } from'@/lib/types';

dayjs.extend(relativeTime);

interface ChirpProps {
    chirp: ChirpType;
    myFollowings: number[];
    chirpsUpdate: (chirp: ChirpType) => void;
    chirpsRefreshDestroy: (chirp: ChirpType) => void;
    addMyFollowings: (followedId: number) => void;
    deleteMyFollowings: (followedId: number) => void;
}

 
export default function Chirp({ chirp, myFollowings, chirpsUpdate, chirpsRefreshDestroy, addMyFollowings, deleteMyFollowings }: ChirpProps) {
    const userContext: UserContextType = useContext(UserContext);
    const user = userContext.user;
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [editing, setEditing] = useState(false);
    const [messageData, setMessageData] = useState<string>(chirp.message);
    const [errors, setErrors] = useState<MsgErrorsType>({});
    const [processing, setProcessing] = useState(false);

    const submitUpdate = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});
        setProcessing(true);
        
        await axios
            .patch(`/chirps/${chirp.id}`, {
                message: messageData
            })
            .then(response => {
                chirpsUpdate(response.data);
                setEditing(false);
                setErrors({});
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                
            });
        
        setProcessing(false);
    } 
    
    const chirpDestroy = () => {
        axios
            .delete(`/chirps/${chirp.id}`)
            .then(() => {
                chirpsRefreshDestroy(chirp);
           })
    } 

    const followUser = (followedId: number) => {
        axios
            .post('/userfollow', {
                followed_id: followedId
            })
            .then((response) => {
                if (response.data.status === 'success'){
                    addMyFollowings(followedId);
                }
           });
    }

    const unfollowUser = (followedId: number) => {
        axios
            .delete(`/userfollow/${followedId}`)
            .then(() => {
                deleteMyFollowings(followedId);
            });
    }

    return (
        <div className="p-6 flex space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-200 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800 dark:text-gray-100">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600 dark:text-gray-200">{dayjs(chirp.created_at).fromNow()}</small>                    
                        { chirp.created_at !== chirp.updated_at && <small className="text-sm text-gray-600 dark:text-gray-200"> &middot; edited</small>}
                    </div>
                    {chirp.user.id === user.id ?
                    <Dropdown
                       align="right"
                       width="48"
                       trigger={
                            <button className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>                          
                            </button>
                       }>
                        <DropdownButton onClick={() => setEditing(true)}>
                            Edit
                        </DropdownButton>
                        <DropdownButton onClick={() => chirpDestroy()}>
                            Delete
                        </DropdownButton>
                    </Dropdown>
                    :
                    <Dropdown
                       align="right"
                       width="48"
                       trigger={
                            <button className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition duration-150 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>                          
                            </button>
                       }>
                       {myFollowings.includes(chirp.user.id as number) ?
                        <DropdownButton onClick={() => unfollowUser(chirp.user.id as number)}>
                            UnFollow
                        </DropdownButton>
                        :
                        <DropdownButton onClick={() => followUser(chirp.user.id as number)}>
                            Follow This Account
                        </DropdownButton>
                       }
                    </Dropdown>
                    }                
                </div>
                {editing
                    ? <form onSubmit={submitUpdate}>
                        <textarea 
                            value={messageData} 
                            onChange={e => setMessageData(e.target.value)} 
                            required
                            className="mt-4 w-full p-1 text-gray-900 dark:text-gray-50 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm">
                        </textarea>
                        <InputError messages={errors.message} className="mt-2" />
                        <div className="space-x-2">
                            <Button className="mt-4" disabled={processing}>Save</Button>
                            <button className="mt-4" onClick={() => { setEditing(false); setMessageData(chirp.message); setErrors({}); }}>Cancel</button>
                        </div>
                    </form>
                    : <p className="mt-4 text-lg text-gray-900 dark:text-gray-50">{chirp.message}</p>
                }
            </div>
        </div>
    );
}
