import type { Messages } from "../../../pages/Chat/ChatAgentPage";
import { coversationRepository } from "../repositories/conversation.repository";
import type { ChatMessage } from "../types/conversation.type";

export const ConversationService = {
    async getAllCoversations() {
        return await coversationRepository.getAll();
    },

    async createConversation(conversation: ChatMessage) {
        conversation.createAt = Date.now();
        return await coversationRepository.create(conversation);
    },

    async updateConversation(id: string, data: Partial<ChatMessage>) {
        data.updateAt = Date.now();
        return await coversationRepository.update(id, data);
    },

    async deleteConversation(id: string) {
        return await coversationRepository.delete(id);
    },

    async addMessage(conversationId: string, message: Messages) {
        return await coversationRepository.addMessage(conversationId, message);
    }
};