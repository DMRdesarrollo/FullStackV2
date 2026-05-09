import app from "./firebase.config.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app);

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return products.sort((a, b) => Number(a.id) - Number(b.id));
    } catch (error) {
        console.error("Error fetching products from Firestore:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const docRef = doc(db, "products", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }
};
