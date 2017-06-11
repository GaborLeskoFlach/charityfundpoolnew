import {observable, action } from 'mobx';
import { _firebaseApp} from '../firebaseAuth/component';
import { IContactUs, IFieldValidation} from '../interfaces'

interface IContactUsFormFields{
    name : IFieldValidation
    subject : IFieldValidation
    email : IFieldValidation
    message : IFieldValidation
    validationError : string
}

export class ContactUsController {

    constructor() {
        this.isLoading = false;  
        this.resetForm()    
    }

    @observable name : string
    @observable email : string
    @observable subject : string
    @observable message : string
    @observable isLoading : boolean;
    @observable contactUsFormState : IContactUsFormFields;

    @action('Reset Form')
    resetForm = action(() => {
        this.contactUsFormState = {
            name : {
                fieldValidationError : '',
                touched : false
            },
            email : {
                fieldValidationError : '',
                touched : false
            },
            subject : {
                fieldValidationError : '',
                touched : false
            },
            message :  {
                fieldValidationError : '',
                touched : false
            },
            validationError : ''            
        }
        this.name = ''
        this.subject = ''
        this.email = ''
        this.message = ''
    })

    @action("save new Contact Us request in DB")
    saveContactUsRequest = action((contactUs : IContactUs) => {
        return new Promise<any>((resolve) => {
            const dbRef : string = '/contactus'
            _firebaseApp.database().ref(dbRef).push(contactUs).then(result => {
                resolve(result)
            })            
        });
    })

}