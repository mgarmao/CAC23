import { doc, updateDoc } from "firebase/firestore";


export default function test() {
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