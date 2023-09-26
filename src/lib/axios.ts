import Axios from 'axios';

const createAxios = (authToken: string = '') => {
    const axios = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            authorization: `Bearer ${authToken}`,
        },
        //withCredentials: true,
    });

    return axios;
}        

export default createAxios;

