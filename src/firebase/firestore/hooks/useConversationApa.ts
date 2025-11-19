import { useEffect, useState } from "react";
import { ChatService } from "../services/conversation.service";
import type { ChatMessage } from "../types/conversation.type";

export const useChatApa = () => {
    const [users, setChats] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchChats = async () => {
        setLoading(true);
        const data = await ChatService.getAllChats();
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
        createUser: ChatService.createChat,
        updateUser: ChatService.updateChat,
        deleteUser: ChatService.deleteChat
    };
};