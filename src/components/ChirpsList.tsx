import { useEffect, useState, useContext, FormEvent } from 'react';
import { useInView } from 'react-intersection-observer';
import createAxios from '@/lib/axios';
import Chirp from '@/components/Chirp';
import InputError from '@/components/InputError';
import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import { UserContext } from '@/lib/context';
import { UserContextType, ChirpType, MsgErrorsType } from '@/lib/types';

const ChirpsList = () => {
    const userContext: UserContextType = useContext(UserContext);
    const user = userContext.user;
    const axios = createAxios(userContext ? userContext.authToken: '');
    const [chirps, setChirps] = useState<ChirpType[]>([]);
    const [myFollowings, setMyFollowings] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [messageData, setMessageData] = useState<string>('');
    const [errors, setErrors] = useState<MsgErrorsType>({});
    const [processing, setProcessing] = useState(false);
    const { ref: moreChirpsRef, inView: moreChirpsIsVisible } = useInView();
    
    //Get myFollowings
    useEffect(() => {
        if (user.id){
           axios
                .get('/myfollowings')
                .then((response) => {
                    console.log(response);
                    setMyFollowings(response.data);
                });
        }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user.id]);
    
    useEffect(() => {
        if (user.id){
            initLoadChirps();
            const iniLoadInterval = setInterval(() => {
                initLoadChirps();
            }, 1000 * 60 * 15);
            return () => clearInterval(iniLoadInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user.id]);

    useEffect(() => {
        if (moreChirpsIsVisible){
            loadNextPageChirps();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[moreChirpsIsVisible]);
    
    const submitMessage = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});
        setProcessing(true);
        
        await axios
            .post('/chirps', {
                message: messageData
            })
            .then(() => {
                setMessageData('');
                initLoadChirps();
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            });
 
        setProcessing(false); 
    }

    const initLoadChirps = () => {
        axios
            .get('/chirps')
            .then((response) => {
                console.log(response);
                setPageCount(response.data.last_page);
                setChirps(response.data.data);
            });
    };

    const loadNextPageChirps = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        //console.log('Next',`/chirps?page=${nextPage}`);
        axios
            .get(`/chirps?page=${nextPage}`)
            .then((response) => {
                setPageCount(response.data.last_page);
                setChirps((prevChirps) => {
                    const addedChirps = response.data.data;
                    return prevChirps.filter(item => 
                        !addedChirps.find((itm: ChirpType) => itm.id === item.id)
                    ).concat(addedChirps)
                });
            });
    }
    
    const chirpsUpdate = (chirp: ChirpType) => {
        setChirps((prevChirps: ChirpType[]) => 
            prevChirps.map(item => {
                if (item.id === chirp.id){
                    return {...item, message: chirp.message, updated_at: chirp.updated_at};
                }
                return item;
           })
        );
    }

    const chirpsRefreshDestroy = (chirp: ChirpType) => {
        setChirps((prevChirps: ChirpType[]) => 
            prevChirps.filter(item => item.id !== chirp.id)
        );
    }

    const addMyFollowings = (followedId: number) => {
        setMyFollowings((prevFollow: number[]) => [...prevFollow, followedId]);
    }

    const deleteMyFollowings = (followedId: number) => {
        setMyFollowings((prevFollow: number[]) => prevFollow.filter(item => item !== followedId));
    }
    
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <form onSubmit={submitMessage}>
                    <textarea
                        value={messageData}
                        placeholder="What's on your mind?"
                        className="block w-full p-1 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        required
                        onChange={e => setMessageData(e.target.value)}
                    ></textarea>
                    <InputError messages={errors.message} className="mt-2" />
                    <Button className="mt-4" disabled={processing}>Chirp</Button>
            </form>

            <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                {chirps.map(chirp =>
                    <Chirp 
                        key={chirp.id} 
                        chirp={chirp} 
                        myFollowings={myFollowings}
                        chirpsUpdate={chirpsUpdate}
                        chirpsRefreshDestroy={chirpsRefreshDestroy}
                        addMyFollowings={addMyFollowings}
                        deleteMyFollowings={deleteMyFollowings}
                        />
                )}
            </div>

            {pageCount > (page+1) &&
            <div ref={moreChirpsRef} className="block mt-1 w-full">
                <div className="text-center">
                {moreChirpsIsVisible 
                    ?   
                    (<div role="status">
                        <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>)
                   :   <SecondaryButton onClick={() => loadNextPageChirps()}>Load More...</SecondaryButton>
                }
                </div>
            </div>
            }
        </div>
    );
}

export default ChirpsList;

