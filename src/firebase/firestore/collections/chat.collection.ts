import { collection } from "firebase/firestore";
import { db } from "../../configuration";

export const chatCollection = collection(db, "chats");