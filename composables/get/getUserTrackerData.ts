import { doc, getDocs, collection,limit,getDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getUID from "../auth/getUID"

export default async function getTrackerData(uid:string)  {
    const { $firestore } = useNuxtApp()
    const { $auth } = useNuxtApp()
    const db:any = $firestore
    const auth:any = $auth

    const data = ref([])
    let items:any = []

    

    try {
        const colRef = collection(db, "users",uid,"expenseTracker");
        const collectionSnapshot = await getDocs(colRef)
        collectionSnapshot.forEach(async(thisDoc) => {
            const requestedDoc = await getDoc(doc(db,"users",uid,"expenseTracker",thisDoc.id))
            if(requestedDoc!=null){
                items.push(requestedDoc.data())
            }
        })
    } 
    catch (error) {
        console.error('Error fetching data from Firestore:', error)
    } 
    
    return {
        items
    }    
}