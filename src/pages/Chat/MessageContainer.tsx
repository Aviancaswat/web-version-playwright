import { getColor } from "@/utils/colors";
import { Box, Icon, IconButton } from "@chakra-ui/react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
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
                                py={2}
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
                                    <Box
                                        sx={{
                                            '& > *': {
                                                animation: isLastMessage && statusStream
                                                    ? 'fadeIn 0.3s ease-out'
                                                    : 'none',
                                            },
                                            '@keyframes fadeIn': {
                                                '0%': { opacity: 0.5 },
                                                '100%': { opacity: 1 },
                                            },
                                        }}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                        >
                                            {msg.message}
                                        </ReactMarkdown>
                                    </Box>
                                )}

                                {msg.role === "agent" && statusStream === false && (
                                    <Box className="animate__animated animate__fadeIn">
                                        <IconButton
                                            aria-label="Copy to clipboard"
                                            size="sm"
                                            ml={1}
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