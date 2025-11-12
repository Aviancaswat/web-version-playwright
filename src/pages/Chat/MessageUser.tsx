import { Box, Text } from "@chakra-ui/react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Messages } from "./ChatAgentPage";

const MessageUserUI = (msg: Messages) => {
    return (
        <>
            <Box
                className="chat-message"
                display={"flex"}
                flexDirection={"column"}
            >
                <Box alignSelf={"flex-start"}>
                    <Text fontSize={"xs"} color={"gray.600"}>
                        {moment(msg.timestamp).format("hh:mm a")}
                    </Text>
                </Box>
                <Box
                    padding={2}
                    borderRadius="full"
                    backgroundColor={"black"}
                    color={"white"}
                    paddingLeft={6}
                    paddingRight={6}
                >
                    <ReactMarkdown
                        children={msg.message}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                    />
                </Box>
            </Box>
        </>
    )
}

export default MessageUserUI;