import { LoginInputType, ErrorsType } from '@/lib/types';

export default function validateLoginClient(inputObj: LoginInputType){
    const { email, password } = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    if (!email){
        errorMsg.email = ['This field is required.'];
        valid = false;
    }

    if (!password){
        errorMsg.password = ['This field is required.'];
        valid = false;
    }


    if (valid){
        return {
         valid
        };
    }
 
    return {
        valid,
        errorMsg
    };
}    