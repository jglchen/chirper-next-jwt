import { ForgotPasswordType, ErrorsType } from '@/lib/types';

export default function validateForgotPasswordClient(inputObj: ForgotPasswordType){
    const {email} = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    if (!email){
        errorMsg.email = ['This field is required.'];
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