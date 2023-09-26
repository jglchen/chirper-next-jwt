import passwordValidator from 'password-validator';
import { UpdatePasswordType, ErrorsType } from '@/lib/types';

export default function validateUpdatePasswordClient(inputObj: UpdatePasswordType){
    const {current_password, password, password_confirmation} = inputObj;
    const errorMsg: ErrorsType = {};
    let valid = true;

    if (!current_password){
        errorMsg.current_password = ['This field is required.'];
        valid = false;
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
