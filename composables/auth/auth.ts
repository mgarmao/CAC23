import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

export default function createNewUser(email:string, password:string) {
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