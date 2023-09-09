import { doc, getDocs, collection,limit,getDoc,updateDoc,setDoc,serverTimestamp,addDoc,onSnapshot,query,orderBy,deleteDoc, Timestamp, where} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export async function getTrackerData(uid: string) {
    const { $firestore } = useNuxtApp();

    const db: any = $firestore;
    
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const itemsByMonth: { month: string; year: string; data: any[]; monthlyTotal: number }[] = [];
    

    async function getData(){
        try {
            const colRef = collection(db, "users", uid, "expenseTracker");

            const newDate = Timestamp.fromDate(new Date("2023-7-14"));

            const q = query(colRef, orderBy("Date", "desc"));
            const collectionSnapshot = await getDocs(q);            
            console.log("get docs")
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
            itemsByMonth.sort((a, b) => {
                if (a.year === b.year) {
                    // If the years are the same, sort by the month
                    return months.indexOf(b.month) - months.indexOf(a.month);
                } else {
                    // If the years are different, sort by the year
                    return b.year.localeCompare(a.year);
                }
            });
    
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    }
    await getData()

    return [itemsByMonth];
}

export function timestampToDate(timestamp:any){
    return timestamp.toDate()
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

export async function isThereUserDocWithUID(UID:string){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    return new Promise(async(resolve,reject)=>{
        try{
            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", UID));
            const querySnapshot = await getDocs(q);
            console.log("get docs")
            const queryDocsLength = querySnapshot.docs.length
            if(queryDocsLength>=1){
                resolve(true)
            }
            else{
                resolve(false)
            }
        }
        catch(error){
            reject(error)
        }
    })
}

export async function createUserDoc(userCredential:any){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    const email = userCredential.email
    const displayName = userCredential.displayName
    const uid = userCredential.uid
    return new Promise(async(resolve,reject)=>{
        try{
            await setDoc(doc(db, "users", uid), {
                email: email,
                uid: uid,
                displayName: displayName,
                categories:["Food","Housing","Transportation","Entertainment","Education","Utilities","Insurance","Gifts","Travel","Other"],
                budget:[]
            });
            resolve(true)
        }
        catch(error){
            reject(error)
        }
        
    })
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

export async function changeExpenseDate(uid:any, docID:string, date:string, time:string){
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

export async function thisMonthsData(uid: string) {
    const { $firestore } = useNuxtApp();
    const { $auth } = useNuxtApp();
    const db: any = $firestore;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();

    const itemsByMonth: { month: string; year: string; data: any[]; monthlyTotal: number }[] = [];
    
    async function getData(){
        try {
            const colRef = collection(db, "users", uid, "expenseTracker");

            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);


            const q = query(colRef, orderBy("Date"));
            const collectionSnapshot = await getDocs(q);        
            console.log("GET")    

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
            itemsByMonth.sort((a, b) => {
                if (a.year === b.year) {
                    // If the years are the same, sort by the month
                    return months.indexOf(b.month) - months.indexOf(a.month);
                } else {
                    // If the years are different, sort by the year
                    return b.year.localeCompare(a.year);
                }
            });
    
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    }
    await getData()

    return [itemsByMonth];
}

export function getUsersCategories(uid:any) {
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    return new Promise(async(resolve,reject)=>{
        try{
            const userRef = doc(db, "users", uid);

            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
               resolve(docSnap.data().categories);
            } 
            else {
                reject("No such document!");
            }
        }
        catch(error){
            reject(error)
        }
    })
}

export async function createNewUserCategory(uid:string,userCategories:any,newCategory:string){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    const userRef = doc(db, "users", uid);
    userCategories.push(newCategory)

    await updateDoc(userRef, {
        categories: userCategories
    });
}

export function getCatergoryBudgets(uid:any){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore

    return new Promise(async(resolve,reject)=>{
        try{
            const userRef = doc(db, "users", uid);

            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
               resolve(docSnap.data().budgets);
            } 
            else {
                reject("No such document!");
            }
        }
        catch(error){
            reject(error)
        }
    })
}

export async function updateCategoryBudgets(uid:any,userBudgets:any){
    const { $firestore } = useNuxtApp()
    const db:any = $firestore
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        budgets: userBudgets
    }); 
}
