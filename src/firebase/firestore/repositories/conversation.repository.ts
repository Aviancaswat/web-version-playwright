import { addDoc, arrayUnion, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import type { Messages } from "../../../pages/Chat/ChatAgentPage";
import { conversationCollection } from "../collections/conversation.collection";
import type { ChatMessage } from "../types/conversation.type";

export const coversationRepository = {
    async getAll(): Promise<ChatMessage[]> {
        const snapShots = await getDocs(conversationCollection);
        return snapShots.docs.map(doc => {
            const dataChat = doc.data();
            return {
                converdationId: dataChat.converdationId,
                title: dataChat.title,
                messages: dataChat.messages
            } as ChatMessage;
        })
    },

    async create(conversation: ChatMessage) {
        return await addDoc(conversationCollection, conversation);
    },

    async update(id: string, data: Partial<ChatMessage>) {
        const ref = doc(conversationCollection, id);
        return await updateDoc(ref, data);
    },

    async delete(id: string) {
        const ref = doc(conversationCollection, id);
        return await deleteDoc(ref);
    },

    async addMessage(conversationId: string, message: Messages) {
        const ref = doc(conversationCollection, conversationId);

        return await setDoc(
            ref,
            {
                messages: arrayUnion(message),
                converdationId: conversationId,
            },
            { merge: true }
        );
    }
}