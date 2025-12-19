import { getColor } from "@/utils/colors";
import { Box, Icon, IconButton } from "@chakra-ui/react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import '../../components/agent-dashboard-ui/agent.css';
import type { Messages } from "./ChatAgentPage";
import './styles/chat/chat.styles.css';

interface MessageContainerProps {
    messages: Messages[],
    isLoading: boolean,
    statusStream: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ messages, isLoading, statusStream }) => {

    const [iconType, setIconCopy] = useState<LucideIcon>(Copy);
    const [userColors] = useState<string[]>(() => getColor());
    const [bgColor, textColor] = userColors;

    const handleCopy = async (content: string) => {
        await navigator.clipboard.writeText(content);
        setIconCopy(Check);
        setTimeout(() => {
            setIconCopy(Copy)
        }, 600)
    }

    return (
        <>
            {
                messages.map((msg, index) => {

                    const isUser = msg.role === "user";
                    const isLastMessage = index === messages.length - 1;
                    const showLoader = !isUser && isLastMessage && isLoading;

                    return (
                        <Box
                            key={`${msg.role}-${index}`}
                            display="flex"
                            justifyContent={isUser ? "flex-end" : "flex-start"}
                            mb={10}
                        >
                            <Box
                                className="chat-ai"
                                maxWidth="80%"
                                pt={2}
                                px={4}
                                borderRadius={"full"}
                                bg={isUser ? bgColor : "transparent"}
                                color={isUser ? textColor : "text.primary"}
                                sx={{ wordBreak: "break-word" }}
                            >
                                {isUser ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                    >
                                        {msg.message}
                                    </ReactMarkdown>
                                ) : (
                                    <>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.message}
                                        </ReactMarkdown>
                                        
                                        {msg.role === "agent" && !statusStream && msg.message.trim() !== "" && (
                                            <Box mt={2}>
                                                <IconButton
                                                    aria-label="Copy to clipboard"
                                                    size="sm"
                                                    onClick={() => handleCopy(msg.message)}
                                                    icon={<Icon as={iconType} boxSize={4} />}
                                                    variant="ghost"
                                                    sx={{
                                                        _focus: {
                                                            outline: "none",
                                                            border: "transparent"
                                                        },
                                                        _hover: {
                                                            border: "transparent",
                                                            bg: "gray.200"
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>

                            {showLoader && (
                                <Box ml={1} mt={1} mb={5} className="loader-model" />
                            )}
                        </Box>
                    );
                })
            }
        </>
    )
}