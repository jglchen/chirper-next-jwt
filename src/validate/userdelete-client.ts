import { UserDeleteType, ErrorsType } from '@/lib/types';

export default function validateUserDeleteClient(inputObj: UserDeleteType){
    const { password } = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

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