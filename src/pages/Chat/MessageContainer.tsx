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

// Define los estilos que quieres para el contenido del agente
const MarkdownComponents = {
    // Aplica márgenes a los encabezados
    h1: (props: any) => <Box as="h1" fontSize="2xl" fontWeight="bold" mt={6} mb={3} {...props} />,
    h2: (props: any) => <Box as="h2" fontSize="xl" fontWeight="semibold" mt={5} mb={2} {...props} />,
    // Aplica márgenes a las listas (esto es clave)
    ul: (props: any) => <Box as="ul" pl={5} mb={3} sx={{ listStyleType: 'disc' }} {...props} />,
    ol: (props: any) => <Box as="ol" pl={5} mb={3} {...props} />,
    // Aplica margen a los párrafos
    p: (props: any) => <Box as="p" mb={2} {...props} />,
    // Estilos para el bloque de código (sección pre)
    pre: (props: any) => <Box as="pre" p={3} my={3} bg="gray.700" color="white" borderRadius="md" overflowX="auto" {...props} />,
    // Estilos para las tablas
    table: (props: any) => <Box as="table" width="full" borderCollapse="collapse" my={4} {...props} />,
    th: (props: any) => <Box as="th" border="1px solid" borderColor="gray.300" p={2} textAlign="left" bg="gray.100" {...props} />,
    td: (props: any) => <Box as="td" border="1px solid" borderColor="gray.300" p={2} {...props} />,
};

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
                                            components={MarkdownComponents}
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