import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { chatCollection } from "../collections/chat.collection";
import type { ChatMessage } from "../types/Chat.type";

export const chatRepository = {
    async getAll(): Promise<ChatMessage[]> {
        const snapShots = await getDocs(chatCollection);
        return snapShots.docs.map(doc => {
            const dataChat = doc.data();
            return {
                converdationId: dataChat.converdationId,
                title: dataChat.title,
                messages: dataChat.messages
            } as ChatMessage;
        })
    },

    async create(user: ChatMessage) {
        return await addDoc(chatCollection, user);
    },

    async update(id: string, data: Partial<ChatMessage>) {
        const ref = doc(chatCollection, id);
        return await updateDoc(ref, data);
    },

    async delete(id: string) {
        const ref = doc(chatCollection, id);
        return await deleteDoc(ref);
    }
}