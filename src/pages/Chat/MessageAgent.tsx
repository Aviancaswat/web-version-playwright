import { Avatar, Box, Button, ButtonGroup, HStack, Text, Tooltip, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import moment from "moment";
import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import LogoAv from "../../assets/avianca-logo-desk.png";
import AviancaToast from "../../utils/AviancaToast";
import type { Messages } from "./ChatAgentPage";

const MessageAgentUI = (msg: Messages) => {

    const copyResponse = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            AviancaToast.success("Respuesta copiada")
        } catch (error) {
            console.error("Error copying text: ", error);
            AviancaToast.error("Error copiando la respuesta al portapapeles")
        }
    }, [])

    return (
        <VStack>
            <Box className="chat-message" display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    display="flex"
                    flexDirection={"row"}
                >
                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                </Box>
                <Box
                    paddingLeft={5}
                    paddingRight={5}
                    paddingTop={2}
                    borderRadius="md"
                    backgroundColor={"transparent"}
                    color={"black"}
                    display={"flex"}
                    flexDirection={"column"}
                >
                    <Box alignSelf={"flex-end"} width={"100%"}>
                        <Text fontSize={"xs"} color={"gray.600"}>
                            {moment(msg.timestamp).format("hh:mm a")}
                        </Text>
                    </Box>
                    {
                        (msg.message.trim().includes("<svg") ||
                            msg.message.trim().includes("<img") ||
                            msg.message.trim().includes("<video") ||
                            msg.message.trim().includes("<table") ||
                            msg.message.trim().includes("<html")) ?
                            <div dangerouslySetInnerHTML={{ __html: msg.message }} /> :
                            <ReactMarkdown
                                children={msg.message}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]} />
                    }
                </Box>
            </Box>
            <HStack alignSelf={"start"} ml={50} spacing={0} width={"95%"}>
                <ButtonGroup>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ cursor: 'pointer', alignSelf: "start" }}
                        onClick={() => {
                            navigator.clipboard.writeText(msg.message);
                        }}
                    >
                        <Tooltip label="Copiar respuesta" bg={"black"} color={"white"} borderRadius={"md"}>
                            <Button
                                bg={"transparent"}
                                size={"xs"}
                                onClick={() => copyResponse(msg.message)}
                                _hover={{
                                    bg: "none",
                                    border: "none"
                                }}
                            >
                                <Copy size={15} />
                            </Button>
                        </Tooltip>
                    </motion.div>
                </ButtonGroup>
            </HStack>
        </VStack>
    )
}

export default MessageAgentUI;