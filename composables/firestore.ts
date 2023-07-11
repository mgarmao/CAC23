import { doc, getDocs, collection,limit,getDoc,updateDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export async function getTrackerData(uid:string)  {
    const { $firestore } = useNuxtApp()
    const { $auth } = useNuxtApp()
    const db:any = $firestore
    const auth:any = $auth

    const data = ref([])
    let items:any = []


    try {
        const colRef = collection(db, "users",uid,"expenseTracker");
        const collectionSnapshot = await getDocs(colRef)
        console.log(collectionSnapshot)
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


export async function test(collectionName:string, docName:string) {
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    const data = ref([])
    let items

    try {
        const docSnapshot = await getDoc(doc(db, collectionName,docName))
        if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
            items = docSnapshot.data()
        } 
        else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    } 
    catch (error) {
        console.error('Error fetching data from Firestore:', error)
    }

    
    return {
        items
    }
}

export default function addExpense(uid:any) {
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    const updateData = async () => {
        try {
            const washingtonRef = doc(db, "users", uid);
            await updateDoc(washingtonRef, {
                capital: true
            });
        } 
        catch (error) {
            console.error('Error fetching data from Firestore:', error)
        }
    }
  
    updateData() 
  
    return {
        
    }
}