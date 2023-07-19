import { doc, getDocs, collection,limit,getDoc,updateDoc,setDoc,serverTimestamp,addDoc,onSnapshot,query,orderBy,deleteDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export async function getTrackerData(uid: string) {
    const { $firestore } = useNuxtApp();
    const { $auth } = useNuxtApp();
    const db: any = $firestore;
    let items: any = [];
    
    let monthlyTotal = 0
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();
    const month = months[d.getMonth()]
  
    try {
        const colRef = collection(db, "users", uid, "expenseTracker");
        const q = query(colRef, orderBy("Date","desc"));
        const collectionSnapshot = await getDocs(q);
        const promiseArray = collectionSnapshot.docs.map(async (thisDoc) => {
            const requestedDoc = await getDoc(doc(db, "users", uid, "expenseTracker", thisDoc.id));
            if ((requestedDoc != null)&&(requestedDoc!=undefined)) {
                if(requestedDoc.data()==undefined){
                    console.log(requestedDoc)
                } 

                const itemMonth =  await String(requestedDoc.data().Date.toDate()).substring(4,7)
                if(month == itemMonth){
                    monthlyTotal+= parseFloat(requestedDoc.data().Price)
                }

                
                return [requestedDoc.data(),thisDoc.id,requestedDoc.data().Date.toDate()];
                
            }
        });
  
      const fulfilledItems = await Promise.all(promiseArray);
      items = fulfilledItems.filter((item) => item !== undefined);
    } 
    catch (error) {
        console.error("Error fetching data from Firestore:", error);
    }
  
    return [items,monthlyTotal];
}

export async function  deleteExpense(uid:any, docID:string){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    try {
        const docRef = doc(db, "users", uid,"expenseTracker", docID);
        await deleteDoc(docRef);
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
            await addDoc(collection(db, "users", uid, "expenseTracker"), {
                visible:true,
                Name: name,
                Description: description,
                Date:serverTimestamp(),
                Price: price,
                Category: category,
            });
            return true
        } 
        catch (error) {
            console.error('Error fetching data from Firestore:', error)
        }
    }
  
    updateData()
}


export async function realTimeDB (){
    let uid = await getUID()
    console.log("realTimeDB")
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    let data:any = []
    const collectionRef = query(collection(db, "users",uid,"expenseTracker"));
    const stopListening = onSnapshot(collectionRef,(querySnapshot) => {
        querySnapshot.forEach((doc) => {
            data.push([doc.data(),doc.id]);
        });
    });
    return data
}