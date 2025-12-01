import { useEffect, useState } from "react";
import { ConversationService } from "../services/conversation.service";
import type { ChatMessage } from "../types/conversation.type";

export const useChatApa = () => {
    const [users, setChats] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchChats = async () => {
        setLoading(true);
        const data = await ConversationService.getAllCoversations();
        setChats(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchChats();
    }, []);

    return {
        users,
        loading,
        fetchChats,
        createUser: ConversationService.createConversation,
        updateUser: ConversationService.updateConversation,
        deleteUser: ConversationService.deleteConversation
    };
};