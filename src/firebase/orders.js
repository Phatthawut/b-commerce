import { db } from "./config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const ordersCollection = collection(db, "orders");

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const order = {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: "pending", // pending, processing, shipped, delivered, cancelled
    };

    const docRef = await addDoc(ordersCollection, order);
    return {
      id: docRef.id,
      ...order,
    };
  } catch (error) {
    throw error;
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const q = query(ordersCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

// Get orders by user ID
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      ordersCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
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

// Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Order not found");
    }

    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });

    return {
      id,
      ...docSnap.data(),
      status,
      updatedAt: Timestamp.now(),
    };
  } catch (error) {
    throw error;
  }
};
