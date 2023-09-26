import * as EmailValidator from 'email-validator';
import { UpdateProfileType, ErrorsType } from '@/lib/types';

export default function validateUpdateProfileClient(inputObj: UpdateProfileType){
    const {name, email} = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    if (!name){
        errorMsg.name = ['This field is required.'];
        valid = false;
    }else if(name.length > 255){
        if (errorMsg.name){
            errorMsg.name.push('The name field can not be longer than 255 characters.');
        }else{
            errorMsg.name = ['The name field can not be longer than 255 characters.'];
            valid = false;
        }
    }

    if (!email){
        errorMsg.email = ['This field is required.'];
        valid = false;
    }else if(email.length > 255){
        if (errorMsg.email){
            errorMsg.email.push('The email field can not be longer than 255 characters.');
        }else{
            errorMsg.email = ['The email field can not be longer than 255 characters.'];
            valid = false;
        }
    }else if (!EmailValidator.validate(email)){
        if (errorMsg.email){
            errorMsg.email.push('The email is not a valid email.');
        }else{
            errorMsg.email = ['The email is not a valid email.'];
            valid = false;
        }
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

