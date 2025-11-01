import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Messages } from "./ChatAgentPage";

const MessageUserUI = (msg: Messages) => {
    return (
        <>
            <Box className="chat-message" display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    padding={2}
                    borderRadius="full"
                    backgroundColor={msg.role === "user" ? "black" : "gray.100"}
                    color={msg.role === "user" ? "white" : "black"}
                    paddingLeft={6}
                    paddingRight={6}
                >
                    <ReactMarkdown children={msg.message} remarkPlugins={[remarkGfm]} />
                </Box>
            </Box>
        </>
    )
}


export default MessageUserUI;