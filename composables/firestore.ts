import { doc, getDocs, collection,limit,getDoc,updateDoc,setDoc,serverTimestamp,addDoc,onSnapshot,query,orderBy,deleteDoc, Timestamp} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export async function getTrackerData(uid: string, errors:number) {
    const { $firestore } = useNuxtApp();
    const { $auth } = useNuxtApp();
    const db: any = $firestore;
    let items: any = [];
    let monthlyTotal = 0;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();
    const currentMonth = months[d.getMonth()];

    const itemsByMonth: { month: string; year: string; data: any[]; monthlyTotal: number }[] = [];
    
    let errorTracker = errors

    async function getData(){
        try {
            const colRef = collection(db, "users", uid, "expenseTracker");
            const q = query(colRef, orderBy("Date", "desc"));
            const collectionSnapshot = await getDocs(q);
    
            // Process each document in the collection
            collectionSnapshot.docs.forEach((thisDoc) => {
                try{
                    const requestedDoc = thisDoc.data();
                    if (requestedDoc !== undefined) {
                        const itemMonth = String(requestedDoc.Date.toDate()).substring(4, 7);
                        const itemYear = String(requestedDoc.Date.toDate()).substring(11,16)

                        // Check if the month object already exists in the array
                        const existingMonthIndex = itemsByMonth.findIndex((item) => item.month === itemMonth && item.year === itemYear);
                        if (existingMonthIndex >= 0) {
                            // Add the item to the existing month's array
                            itemsByMonth[existingMonthIndex].data.push([requestedDoc, thisDoc.id, requestedDoc.Date.toDate()]);

                            itemsByMonth[existingMonthIndex].monthlyTotal += parseFloat(requestedDoc.Price);
                        } else {
                            // Create a new month object and add the item to its array
                            const newMonthObject = { month: itemMonth, year: itemYear, data: [[requestedDoc, thisDoc.id, requestedDoc.Date.toDate()]], monthlyTotal: parseFloat(requestedDoc.Price) };
                            itemsByMonth.push(newMonthObject);
                        }
                    }
                }
                catch(error){
                    console.log(error)
                }
            });
    
            // Sort the array of month objects based on the month's value
            itemsByMonth.sort((a, b) => months.indexOf(b.month) - months.indexOf(a.month));
    
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    }
    await getData()

    return [itemsByMonth];
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

export async function changeExpenseDate(uid:String, docID:string, date:string, time:string){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    try{
        let newDate 
        if(date!=undefined){
            if(time==undefined){
                newDate = new Date(date)
                newDate.setDate(newDate.getDate()+1)
            }
            else{
                newDate = new Date(date+" "+time)
            }
            const docRef = doc(db, "users", uid, "expenseTracker", docID);
            await updateDoc(docRef, {
                Date: Timestamp.fromDate(newDate)
            });
        }
    }
    catch(error){
        console.log(error)
    }
}