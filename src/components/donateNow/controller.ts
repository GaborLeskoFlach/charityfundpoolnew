import {observable, action} from 'mobx';
import { _firebaseApp } from '../firebaseAuth/component'
import { toJS } from 'mobx';
import { IOrgNeedHelpWithListItem, IDonation, IFieldValidation } from '../interfaces';

interface IDonationFields{
    fullName : IFieldValidation;
    email : IFieldValidation;
    phoneNo : IFieldValidation;
    postCode : IFieldValidation; 
    amountToDonate : IFieldValidation;
    
    validationError : string;      
}

export class DonationController {
    
    constructor() {
        this.causes = [];
        this.isLoading = false;
        this.resetForm();
    }

    @observable causes : Array<IOrgNeedHelpWithListItem>;
    @observable isLoading : boolean;
    @observable donationRegistration : IDonation;
    @observable donationFormState : IDonationFields;

    @action("reset form(state)")
    resetForm = () => {

        this.donationRegistration = {
            fullName : '',
            email : '',
            phoneNo : '',
            postCode : '', 
            amountToDonate : ''
        }

        this.donationFormState = {
            fullName : {
                fieldValidationError : '',
                touched : false
            },
            email : {
                fieldValidationError : '',
                touched : false
            },
            phoneNo : {
                fieldValidationError : '',
                touched : false
            },
            postCode : {
                fieldValidationError : '',
                touched : false
            }, 
            amountToDonate : {
                fieldValidationError : '',
                touched : false
            },
            
            validationError : ''      
        }
    }

    @action("Add new Donation")
    addNewDonation = () : Promise<any> => {
        return new Promise((resolve) => {
            _firebaseApp.database().ref('donations').push(toJS(this.donationRegistration)).then(result => {
                resolve();
                console.log('New Donation has been successfully added');
            });
        });
    };

    @action("get causes from DB")
    getCauses = () : Promise<Array<IOrgNeedHelpWithListItem>> => {
        return new Promise<Array<IOrgNeedHelpWithListItem>>((resolve) => {        
            _firebaseApp.database().ref('needs').orderByChild('active').equalTo(true).on('value', (snapshot) => {
                this.causes = snapshot.val();
                resolve(this.causes);
            })
        })
    };
}
