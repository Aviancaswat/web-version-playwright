import { addDoc, arrayUnion, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import type { Messages } from "../../../pages/Chat/ChatAgentPage";
import { coversationCollection } from "../collections/conversation.collection";
import type { ChatMessage } from "../types/conversation.type";

export const coversationRepository = {
    async getAll(): Promise<ChatMessage[]> {
        const snapShots = await getDocs(coversationCollection);
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
        return await addDoc(coversationCollection, conversation);
    },

    async update(id: string, data: Partial<ChatMessage>) {
        const ref = doc(coversationCollection, id);
        return await updateDoc(ref, data);
    },

    async delete(id: string) {
        const ref = doc(coversationCollection, id);
        return await deleteDoc(ref);
    },

    async addMessage(conversationId: string, message: Messages) {
        const ref = doc(coversationCollection, conversationId);

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