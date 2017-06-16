import {observable, action} from 'mobx';
import { _firebaseApp } from '../firebaseAuth/component'
import { convertFromObservable } from '../../utils/utils'
import { toJS } from 'mobx';
import { IOrgNeedHelpWithListItem, IDonation, IFieldValidation,IRegistrationNeedHelpOrg, DataFilter } from '../interfaces';

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
            _firebaseApp.database().ref('registrations/NeedHelp/Organisations').orderByChild('active').equalTo(true).on('value', (snapshot) => {
                const organisations : Array<IRegistrationNeedHelpOrg> = snapshot.val()                

                if(organisations){
                    const organisationsWithNeeds : Array<IRegistrationNeedHelpOrg> = convertFromObservable(organisations).filter(x => x.needHelpWithList !== undefined)
                    organisationsWithNeeds.map((org) => {
                        convertFromObservable(org.needHelpWithList).filter(x => x.active === true).map((needs) => {
                            this.causes.push(needs)
                        })
                    })
                }

                resolve(this.causes);
            })
        })
    };
}
