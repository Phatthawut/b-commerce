import { db, storage } from "../firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const productsCollection = collection(db, "products");

// Get all products
export const getProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(productsCollection, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const q = query(
      productsCollection,
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    throw error;
  }
};

// Add a new product
export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(
        storage,
        `products/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Add product with image URL
    const product = {
      ...productData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(productsCollection, product);
    return {
      id: docRef.id,
      ...product,
    };
  } catch (error) {
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, productData, imageFile) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Product not found");
    }

    let imageUrl = productData.imageUrl;

    // Upload new image if provided
    if (imageFile) {
      // Delete old image if exists
      if (docSnap.data().imageUrl) {
        try {
          const oldImageRef = ref(storage, docSnap.data().imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image
      const storageRef = ref(
        storage,
        `products/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Update product
    const updatedProduct = {
      ...productData,
      imageUrl,
      updatedAt: new Date(),
    };

    await updateDoc(docRef, updatedProduct);

    return {
      id,
      ...updatedProduct,
    };
  } catch (error) {
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Product not found");
    }

    // Delete image if exists
    if (docSnap.data().imageUrl) {
      try {
        const imageRef = ref(storage, docSnap.data().imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    await deleteDoc(docRef);
    return true;
  } catch (error) {
    throw error;
  }
};
