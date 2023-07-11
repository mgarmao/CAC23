import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

export function createNewUser (email:string, password:string) {
    const { $auth } = useNuxtApp()
    const {$firestore} = useNuxtApp()
    const auth:any = $auth
    const db:any = $firestore

    createUserWithEmailAndPassword(auth, email, password)
    .then( async(userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const email = userCredential.user.email
        const displayName = userCredential.user.displayName
        const uid = userCredential.user.uid
        await setDoc(doc(db, "users", uid), {
            email: email,
            displayName: displayName,
            expenseTracker: []
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}

export async function login(email:string,password:string) {
    const { $auth } = useNuxtApp()
    const auth:any = $auth

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log("login")
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        console.log("login error")
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}

export async function getUID()  {
    const { $auth } = useNuxtApp()
    const auth:any = $auth
    let uid:string = ''
    
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } 
    });


    return {
        UID: uid
    }
}

