import {observable, action } from 'mobx';
import { _firebaseApp} from '../firebaseAuth/component';
import { IContactUs, IFieldValidation, IContactUsReply} from '../interfaces'

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
    @observable isLoading : boolean
    @observable contactUsFormState : IContactUsFormFields

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
        })
    })

    @action("get ContactUs requests from DB")
    getContactUsRequests = action(() => {
        return new Promise<Array<IContactUs>>((resolve) => {
            const dbRef : string = 'contactus'
            _firebaseApp.database().ref(dbRef).on('value', (snapshot) => {
                resolve(snapshot.val())
            })
        })
    })

    @action("Physically deletes a Registration from DB")
    deleteContactUsRequest = action((key : string) : Promise<any> => {
        return new Promise<any>((resolve,reject) => {      
            const dbRef = 'contactus/' + key
             _firebaseApp.database().ref(dbRef).remove().then(() => {
                resolve()
             }).catch(error => {
                console.log('Remove failed: {0}', error.message)
                reject()
             })
        })
    })

    @action("Physically deletes a Registration from DB")
    sendReplyToContactUsRequest = action((request : IContactUs, reply : IContactUsReply) : Promise<boolean> => {
        return new Promise<boolean>((resolve,reject) => {      
            const dbRef = 'contactus/' + reply.ID
            _firebaseApp.database().ref(dbRef).push(reply).then(result => {
                
                //1. Send Email
                this.sendEmail(request,reply).then(response => {
                    //2. Update ContactUs request to Completed
                    this.contactUsRequestCompleted(reply.ID).then((response) => {
                        resolve(true)
                    })
                })
            })            
        })
    })

    /*Private methods*/
    private sendEmail = (request : IContactUs, reply : IContactUsReply) : Promise<boolean> => {
        return new Promise<boolean>((resolve,reject) => { 
            setTimeout(() => {
                console.log('SEnding reply email to => ', request.email )
                resolve()
            }, 3000)            
        })
    }

    //Update Request To from Outstanding to Processed (true => false)"
    private contactUsRequestCompleted = (key : string) : Promise<any> =>{
        return new Promise((resolve) => {
            this.getContactUsRequest(key).then(response => {                
                if(response){
                    response.active = false
                    response.outstanding = false
                    _firebaseApp.database().ref('contactus/' + key).update(response).then(result => {                
                        resolve();
                    })
                }
            })
        })
    }

    //get a particular ContactUs requests from DB
    private getContactUsRequest = (key : string) => {
        return new Promise<IContactUs>((resolve, reject) => {
            const dbRef : string = 'contactus/' + key
             _firebaseApp.database().ref(dbRef).once('value', (snapshot) => {
                resolve(snapshot.val())
            })
        })
    }


}
