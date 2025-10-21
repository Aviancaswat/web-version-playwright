import { Avatar, Box, Text, Textarea } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { v4 } from "uuid";
import { RunAgentDashboard } from "../../agent/dashboard-agent-ai";
import LogoAv from "../../assets/avianca-logo-desk.png";
import WelcomeAgentDashbaord from "../../components/agent-dashboard-ui/welcomeAgent";
import ShinyTextAgent from "../../components/animations/agent/ShinyTextAgent";
import { useTestStore } from "../../store/test-store";

type ResponseStreamModel = {
    type: string;
    delta?: string
}

type Messages = {
    role: "user" | "agent"
    message: string,
}

const MessageUserUI = (msg: Messages) => {
    return (
        <>
            <Box display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    padding={2}
                    borderRadius="md"
                    backgroundColor={msg.role === "user" ? "black" : "gray.100"}
                    color={msg.role === "user" ? "white" : "black"}
                >
                    <ReactMarkdown>
                        {msg.message}
                    </ReactMarkdown>
                </Box>
            </Box>
        </>
    )
}

const MessageAgentUI = (msg: Messages) => {
    return (
        <>
            <Box display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    display="flex"
                    flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                >
                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                </Box>
                <Box
                    padding={5}
                    borderRadius="md"
                    backgroundColor={msg.role === "user" ? "black" : "gray.100"}
                    color={msg.role === "user" ? "white" : "black"}
                >
                    <ReactMarkdown>
                        {msg.message}
                    </ReactMarkdown>
                </Box>
            </Box>
        </>
    )
}

const ChatAgentPage = () => {
    const chatRef = useRef<HTMLDivElement | null>(null);
    const { dashboardDataAgentAvianca } = useTestStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [questionUser, setQuestionUser] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);

    useEffect(() => {
        if (chatRef.current) {
            const isAtBottom = chatRef.current.scrollHeight === chatRef.current.scrollTop + chatRef.current.clientHeight;
            if (isAtBottom) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }
    }, [messages]);

    const getResponseModel = useCallback(async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "user", message: questionUser }
            ]);

            setLoading(true);

            const response = await RunAgentDashboard(
                `${JSON.stringify(dashboardDataAgentAvianca)}`,
                questionUser
            );

            let agentResponse = "";

            for await (const event of response) {
                if (event.type === 'raw_model_stream_event') {
                    const { type, delta } = event.data as ResponseStreamModel;
                    if (type === "output_text_delta" && delta) {
                        agentResponse += delta;
                    }
                }
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "agent", message: agentResponse }
            ]);

            setLoading(false);
        }
    }, [questionUser, dashboardDataAgentAvianca]);

    return (
        <Box
            height={"full"}
            width={"full"}
            display={"flex"}
            flexDirection={"column"}
        >
            <Box
                ref={chatRef}
                width={"full"}
                height={"100%"}
                overflowY="auto"
                padding="2"
                flex="1"
            >
                {
                    messages.length === 0 ? (
                        <WelcomeAgentDashbaord />
                    ) : (
                        <Box>
                            {messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    marginBottom={4}
                                    display="flex"
                                    flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                                    alignItems="flex-start"
                                >
                                    {
                                        msg.role === "user" ? <MessageUserUI key={v4()} {...msg} /> : <MessageAgentUI key={v4()} {...msg} />
                                    }
                                </Box>
                            ))}
                            {loading && (
                                <Box display={"flex"} gap={2} alignItems={"center"}>
                                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                                    <Text>
                                        <ShinyTextAgent />
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    )
                }
            </Box>
            <Box>
                <Textarea
                    value={questionUser}
                    width={"full"}
                    minHeight={100}
                    placeholder="Preguntar algo..."
                    onKeyDown={getResponseModel}
                    onChange={(e) => setQuestionUser(e.target.value)}
                    bg={"white"}
                    color={"black"}
                />
            </Box>
        </Box>
    );
}

export default ChatAgentPage;
