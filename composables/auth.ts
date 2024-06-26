import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,signOut, deleteUser} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

const provider = new GoogleAuthProvider();


export function createNewUserWithEmail (email:string, password:string) {
  const { $auth } = useNuxtApp()
  const {$firestore} = useNuxtApp()
  const auth:any = $auth
  const db:any = $firestore

  return new Promise((resolve,reject)=>{
    createUserWithEmailAndPassword(auth, email, password)
    .then( async(userCredential) => {
      resolve(userCredential)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      reject(error)
    });
  })
  
}

export async function loginWithEmail(email:string,password:string) {
  const { $auth } = useNuxtApp()
  const auth:any = $auth

  return new Promise((resolve, reject)=>{
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if(user){
        resolve(true)
      }
      else{
        resolve(false)
      }
    })
    .catch((error) => {
      console.log("login error")
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
      resolve(false)
    });
  })
}


export async function loginWithGoogle(){  
  const { $auth } = useNuxtApp()
  const auth:any = $auth

  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then(async (user) => {
        resolve(user.user); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorCode + " - " + errorMessage + " - " + email);
        reject(error); 
      });
  });
}

export function signOutUser(){
  const { $auth } = useNuxtApp()
  const auth:any = $auth
  signOut(auth).then(() => {
    location.reload()
  }).catch((error) => {

  });
}

export function getUID() {
  const { $auth } = useNuxtApp();
  const auth:any = $auth;
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); // Resolve the promise with uid
      } else {
        reject(new Error("User not found"));
      }
    });
  });
}

export function isUserSignedIn(){
  const { $auth } = useNuxtApp();
  const auth:any = $auth;
  return new Promise((resolve, reject) => {
    try{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true)
        } else {
          resolve(false)
        }
      });
    }
    catch(error){
      console.log(error)
    }
  });
}

export function deleteAccount(){
  const { $auth } = useNuxtApp();
  const auth:any = $auth;
  const user = auth.currentUser
  deleteUser(user).then(() => {
    location.reload()
  }).catch((error) => {
    // An error happened.
  });
}