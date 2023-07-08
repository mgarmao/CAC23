import { doc, getDoc,collection } from "firebase/firestore";

export default function useFirestore(collectionName:string, docName:string) {
    const { $firestore } = useNuxtApp()
    const db = $firestore
    
    const data = ref([])
    let items
    const fetchData = async () => {
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
    }
  
    fetchData() // Fetch data on component mount
  
    return {
        items
    }
  }