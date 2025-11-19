import { collection } from "firebase/firestore";
import { db } from "../../configuration";

export const coversationCollection = collection(db, "conversations");