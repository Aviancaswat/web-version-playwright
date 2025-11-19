import { collection } from "firebase/firestore";
import { db } from "../../configuration";

export const conversationCollection = collection(db, "conversations");