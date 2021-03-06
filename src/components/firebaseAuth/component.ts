import * as firebase from 'firebase';
import { IUserMapping, UserStatus, IRoleInfo, RegistrationRoles, ILocation, RegistrationType } from '../interfaces';


var config = {
    apiKey: "AIzaSyA-Y-PwwThMfyUuQVIliAIU9JHsuQF03_k",
    authDomain: "charityfundpool-staging.firebaseapp.com",
    databaseURL: "https://charityfundpool-staging.firebaseio.com",
    storageBucket: "charityfundpool-staging.appspot.com",
    messagingSenderId: "692978726080"
}

/*
const config = {
    apiKey: "AIzaSyAh5vjIaONRfbKPjeHiAc-UvV5nOXseA8Y",
    authDomain: "charityfundpool.firebaseapp.com",
    databaseURL: "https://charityfundpool.firebaseio.com",
    projectId: "charityfundpool",
    storageBucket: "charityfundpool.appspot.com",
    messagingSenderId: "42018346299"
}*/

export const _firebaseApp : firebase.app.App = firebase.initializeApp(config);
export const _firebaseAuth : firebase.auth.Auth = _firebaseApp.auth();
export const _firebaseStorage : firebase.storage.Storage = _firebaseApp.storage();
export let _currentRegistrationRole : RegistrationRoles = RegistrationRoles.UnAuthenticated;

let secondaryApp : firebase.app.App;

function setCurrentRegistrationRole(role : RegistrationRoles){
    _currentRegistrationRole = role;
}

function requireAuth(nextState : any, replace : any) { 

    if(null === _firebaseApp.auth().currentUser) {
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
    }
}

function register(email: string, password: string, shouldSendVerificationEmail : boolean, registration : any, dbRef : string, registerUser :  boolean, registrationType : RegistrationType) : Promise<firebase.User>{
    return new Promise((resolve, reject) => {        
        if(registerUser){
            if (!email || !password) {
                resolve(false);
                console.log('email and password required');
            }
            // Register user
            createUserWithEmailAndPassword(email, password).then((userRef => {
                if(shouldSendVerificationEmail){
                    if(userRef){                        
                        resetPassword(email).then(hasPasswordResetEmailSuccessfullySent => {
                            if(hasPasswordResetEmailSuccessfullySent){
                                //Update UID field
                                registration.uid = userRef.uid;
                                updateRegistration(dbRef,registration).then(response => {                            
                                    //TODO create a new Item under /Users this will make locating users easier
                                    
                                    const location : Array<ILocation> = [ {location : dbRef, default : true, registrationType : registrationType, createdAt : new Date().toString()} ]

                                    let mapping : IUserMapping = {
                                        uid : registration.uid,
                                        status : UserStatus.Pending,
                                        loggedInFirstTime : false,
                                        loggedInFirstTimeDate : null,
                                        locations : location,
                                        profileImageURL : registration.profileImageURL,
                                        displayName : registration.fullName
                                    }

                                    addNewRegistrationToMapping(mapping).then(response => {
                                        //Add new entry under ROLES

                                        const role : IRoleInfo = {
                                            active : true,
                                            registrationType : RegistrationRoles.User
                                        }

                                        addNewRole(registration.uid,role).then((response) => {
                                            resolve(true)
                                        })
                                    }).catch((error) => {
                                        reject('Failed to add mapping information to Users')
                                    })                                                                           
                                });
                            }
                        }).catch(error => {                            
                            reject('Verification Email was not sent due to error: ' + error.message);
                        })
                    }
                }else{            
                    resolve(userRef);
                }
            }))
            .catch(function (error : any) {
                console.log('register error', error);
                if (error.code === 'auth/email-already-in-use') {
                    reject();
                }
            });
        }else{
            //TODO -> implement
            unRegisterUser(registration, dbRef).then(response => {
                resolve();
            });
        }
    });
}

function addNewRole(uid :string, role : IRoleInfo){ 
    return new Promise<any>((resolve) => {
        _firebaseApp.database().ref('roles/' + uid).set(role).then(result => {
            resolve(result);                       
        });
    });
}

function getUserRole(uid : string) : Promise<IRoleInfo>{
    return new Promise<IRoleInfo>((resolve,reject) => {
        _firebaseApp.database().ref('roles/' + uid).once('value', (snapshot) => {
            resolve(snapshot.val());     
        }).catch((error) => {
            console.log('Unable to fetch roles =>', error.message)
        })
    });
}

function createUserWithEmailAndPassword(email : string, password : string) : Promise<firebase.User> {
    return new Promise<firebase.User>((resolve) => {        
        if(!secondaryApp){
            secondaryApp = firebase.initializeApp(config, "Secondary");
        }
        
        secondaryApp.auth().createUserWithEmailAndPassword(email, password).then((firebaseUser : firebase.User) => {
            secondaryApp.auth().signOut();
            resolve(firebaseUser);
        });    
    });
}

//Firebase doesnt seem to have Admin API available from Web, so need to fake Disable Client
function unRegisterUser(registration : any, dbRef : string) : Promise<any>{
    const uid : string = registration.uid;
    return new Promise<any>((resolve) => {
        //Update UID field
        registration.uid = '';
        updateRegistration(dbRef,registration).then(response => {                            
            //TODO update Mapping Item under /Users this will\
            getMappingInfoForUser(uid).then(mapping => {
                mapping.status = UserStatus.Disabled;
                updateRegistrationToMapping(mapping).then(response => {
                    resolve()
                })    
            })                                                                                
        })
    })   
}

function updateMappingInfoForUser(uid : string, registrationType : RegistrationType, location : string){
    return new Promise<any>((resolve) => {
        getMappingInfoForUser(uid).then(mapping => {
            if(mapping){
                if(!mapping.locations || mapping.locations.length === 0){
                    mapping.locations = [{ createdAt : new Date().toString(), default : true, location : location, registrationType  }]
                }else{
                    mapping.locations.push({ createdAt : new Date().toString(), default : true, location : location, registrationType  })
                }
                updateRegistrationToMapping(mapping).then(response => {
                    resolve();
                }) 
            }
        })
    })
}

function addNewRegistrationToMapping(mapping : IUserMapping) : Promise<any> {
    return new Promise<any>((resolve) => {
        _firebaseApp.database().ref('users/' + mapping.uid).set(mapping).then(result => {
            resolve(result);                       
        });
    });
};

function updateRegistrationToMapping(mapping : IUserMapping) : Promise<any> {
    return new Promise<any>((resolve) => {
        _firebaseApp.database().ref('users/' + mapping.uid).update(mapping)
        .then(result => {
            resolve(result);                       
        });
    });
};

function getMappingInfoForUser (uid : string) : Promise<IUserMapping> {
    return new Promise<IUserMapping>((resolve) => {     
        _firebaseApp.database().ref('users/' + uid).once('value', (snapshot) => {
            resolve(snapshot.val());
        }).catch(error => {
            console.log('Ooops => {0}',error.message);
        })
    });
};

function updateRegistration(dbRef : string, registration : any) : Promise<any> {
    return new Promise<any>((resolve) => {
        _firebaseApp.database().ref(dbRef).update(registration).then(result => {                
            resolve(result);                       
        });
    });
};

function signIn(email:string, password:string) : Promise<boolean>{
    return new Promise((resolve,reject) => {
        if (!email || !password) {
            console.log('email and password required');
            resolve(false);
        }

        // Sign in user
        _firebaseAuth.signInWithEmailAndPassword(email, password)
            .then((response) => {                
                resolve(true);
            }).catch(error => {
                reject(error);
            });
    });
}

function signOut() : Promise<boolean> {
    return new Promise((resolve,reject) => {
        _firebaseAuth.signOut().then(response => {
            resolve(true);
        }).catch(error => {
            reject(error);            
        })
    });
}

function resetPassword(email:string) : Promise<boolean>{
    return new Promise((resolve,reject) => {
        _firebaseAuth.sendPasswordResetEmail(email).then(response => {
            resolve(true);
        }).catch(error => {
            reject(error);            
        })
    });    
}


export { requireAuth, register, signIn, signOut, resetPassword, 
        addNewRegistrationToMapping, getMappingInfoForUser, 
        updateRegistrationToMapping, getUserRole, setCurrentRegistrationRole, updateMappingInfoForUser  };