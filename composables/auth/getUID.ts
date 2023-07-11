import { doc, getDoc,collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default async function getUID()  {
    const { $auth } = useNuxtApp()
    const auth:any = $auth
    let uid:string = ''
    
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
        } 
    });


    return {
        uid: uid
    }
}