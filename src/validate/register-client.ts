import * as EmailValidator from 'email-validator';
import passwordValidator from 'password-validator';
import { RegisterInputType, ErrorsType } from '@/lib/types';

export default function validateRegisterClient(inputObj: RegisterInputType){
    const {name, email, password, password_confirmation} = inputObj;
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

    //Check the validity of password
    const schema = new passwordValidator();
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces();                          // Should not have spaces
    if (!password){
        errorMsg.password = ['This field is required.'];
        valid = false;
    }else if(!schema.validate(password)){
        if (errorMsg.password){
            errorMsg.password.push('The password must have both uppercase and lowercase letters as well as minimum 2 digits.');
        }else{
            errorMsg.password = ['The password must have both uppercase and lowercase letters as well as minimum 2 digits.'];
            valid = false;
        }
    }else if (password !== password_confirmation){
        if (errorMsg.password){
            errorMsg.password.push('The password field confirmation does not match.');
        }else{
            errorMsg.password = ['The password field confirmation does not match.'];
            valid = false;
        }
    }
    
    if (!password_confirmation){
        if (errorMsg.password_confirmation){
            errorMsg.password_confirmation.push('This field is required.');
        }else{
            errorMsg.password_confirmation = ['This field is required.'];
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

