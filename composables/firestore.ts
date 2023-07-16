import { doc, getDocs, collection,limit,getDoc,updateDoc,setDoc,serverTimestamp,addDoc,onSnapshot} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export async function getTrackerData(uid: string) {
    const { $firestore } = useNuxtApp();
    const { $auth } = useNuxtApp();
    const db: any = $firestore;
    let items: any = [];
  
    try {
        const colRef = collection(db, "users", uid, "expenseTracker");
        const collectionSnapshot = await getDocs(colRef);

        const promiseArray = collectionSnapshot.docs.map(async (thisDoc) => {
            const requestedDoc = await getDoc(doc(db, "users", uid, "expenseTracker", thisDoc.id));
            if ((requestedDoc != null)&&(requestedDoc!=undefined)&&(requestedDoc.data().visible==true)) {
                return [requestedDoc.data(),thisDoc.id,requestedDoc.data().Date.toDate()];
            }
        });
  
      const fulfilledItems = await Promise.all(promiseArray);
      items = fulfilledItems.filter((item) => item !== undefined);
    } 
    catch (error) {
        console.error("Error fetching data from Firestore:", error);
    }
  
    return items;
}

export async function  deleteExpense(uid:any, docID:string){
    console.log("delete")
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    try {
        const docRef = doc(db, "users", uid,"expenseTracker", docID);
        await updateDoc(docRef, {
            visible: false
        });
    } 
    catch (error) {
        console.error('Error fetching data from Firestore:', error)
    }
}

export function createNewExpense(uid:string, name:string, description:string, price:any, category:string) {
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    const updateData = async () => {
        try {
            console.log(price)
            await addDoc(collection(db, "users", uid, "expenseTracker"), {
                visible:true,
                Name: name,
                Description: description,
                Date:serverTimestamp(),
                Price: price,
                Category: category,

              });
        } 
        catch (error) {
            console.error('Error fetching data from Firestore:', error)
        }
    }
  
    updateData() 
}



