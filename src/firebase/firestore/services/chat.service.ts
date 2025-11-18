import { chatRepository } from "../repositories/chat.repository";
import type { ChatMessage } from "../types/Chat.type";

export const ChatService = {
    async getAllChats() {
        return await chatRepository.getAll();
    },

    async createChat(user: ChatMessage) {
        user.createAt = Date.now();
        return await chatRepository.create(user);
    },

    async updateChat(id: string, data: Partial<ChatMessage>) {
        return await chatRepository.update(id, data);
    },

    async deleteChat(id: string) {
        return await chatRepository.delete(id);
    }
};