import {observable, action, toJS, map } from 'mobx';
import { _firebaseApp, _firebaseAuth } from '../firebaseAuth/component';
import { convertData } from '../../utils/utils'
import { IRegistrationNeedHelpInd, IFieldValidation, IUserMapping, ILocation, IWhatINeedHelpWith, ISearchFilters, DataFilter, ITypeOfWork } from '../interfaces';
import { List } from 'linqts'

interface IRegisterIndividualFormFields{
    postCode : IFieldValidation;
    validationError : string;
}

export class JobSearchController {

    constructor() {
        this.registrationsForNeedHelp_Ind = []
        this.whatINeedHelpWith = []
        this.typesOfWork = []
        this.isLoading = false;  
        this.postCode = '';
        this.includeSurroundingSuburbs = false;
        
        this.registerIndividualFormState = {
            postCode : {
                fieldValidationError : '',
                touched : false
            },
            validationError : ''            
        }    
    }

    @observable registrationsForNeedHelp_Ind : Array<IRegistrationNeedHelpInd>;
    @observable isLoading : boolean;
    @observable registerIndividualFormState : IRegisterIndividualFormFields;
    @observable postCode : string;
    @observable includeSurroundingSuburbs : boolean;
    @observable whatINeedHelpWith : Array<IWhatINeedHelpWith>
    @observable typesOfWork : Array<ITypeOfWork>

    @action("get Registrations for NeedHelp from DB")
    getRegistrationsForNeedHelpInd = action((postCode : string, filters : Array<ISearchFilters>) => {
        return new Promise<Array<IRegistrationNeedHelpInd>>((resolve) => {
            _firebaseApp.database().ref('registrations/NeedHelp/Individuals').orderByChild('registrationType').equalTo('Individual').on('value', (snapshot) => {
                let filtered : boolean = false
                this.registrationsForNeedHelp_Ind = toJS<Array<IRegistrationNeedHelpInd>>(snapshot.val())                
                let combinedResults = new List<IRegistrationNeedHelpInd>([])
                let results = new List<IRegistrationNeedHelpInd>(convertData<IRegistrationNeedHelpInd>(this.registrationsForNeedHelp_Ind, DataFilter.ActiveOnly))
                                .Where(x => x.postCode === postCode)

                if(filters.length !== 0){
                    filters.map((filter) => {
                        if(filter.key && filter.value){
                            combinedResults.AddRange(results.Where(x => x.needHelpWithList !== undefined && convertData(x.needHelpWithList, DataFilter.ActiveOnly).filter(y => y[filter.key] === filter.value).length > 0).ToArray())
                            filtered = true
                        }
                    })
               
                    //filter has been passed in but no search results found
                    //otherwise filters were invalid (not passed in)
                    if(filtered){                    
                        resolve(combinedResults.Distinct().ToArray())
                        return
                    }
                }

                resolve(results.ToArray())
            })
        });
    })

    //Should be in Store
    @action("get current User registration from DB")
    async getCurrentUserDetails(uid:string){
        return new Promise<any>((resolve,reject) => {
            resolve(this.getUserRegistrationByUID(uid))
        })
    }


    /* Private */

    //should be in store
    async getUserRegistrationByUID(uid : string){
        return new Promise<any>((resolve) => {
            const dbRef = '/users/' + uid
            _firebaseApp.database().ref(dbRef).once('value', (snapshot) => {
                const user : IUserMapping = snapshot.val()
                if(user && user.locations){
                    //Only get Individual Registrations (this is because postCode is only required for Individual Registrations)
                    const defaultLocation : ILocation = user.locations.find(x => x.registrationType === 0)
                    if(defaultLocation){
                        this.getRegistrationByLocation(defaultLocation).then((response) => {
                            resolve(response)
                        })
                    }else{
                        resolve()
                    }
                }
                resolve()
            })
        })
    }

    //Should be in store
    async getRegistrationByLocation(location : ILocation){
        return new Promise<any>((resolve, reject) => {                           
            _firebaseApp.database().ref(location.location).once('value', (snapshot) => {
                resolve(snapshot.val())
            }).catch((error)=>{
                reject()
            })
        })   
    }

    //Should be in Store
    @action("get WhatINeedHelpWith from DB")
    async getWhatINeedHelpWith(){
        return new Promise<Array<IWhatINeedHelpWith>>((resolve) => {
            _firebaseApp.database().ref('utils/whatINeedHelpWith').once('value', (snapshot) => {
                this.whatINeedHelpWith = snapshot.val()
                resolve()
            }) 
        });
    }

    //Should be in store
    @action("get typesOfWork from DB")
    async getTypesOfWork(){
        return new Promise<Array<ITypeOfWork>>((resolve) => {
            _firebaseApp.database().ref('utils/typesOfWork').once('value', (snapshot) => {
                this.typesOfWork = snapshot.val()
                resolve()
            }) 
        })
    }    

}
