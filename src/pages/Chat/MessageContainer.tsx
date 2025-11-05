import { Avatar, Box, Button } from "@chakra-ui/react";
import { SquareArrowOutUpRight } from "lucide-react";
import LogoAv from "../../assets/avianca-logo-desk.png";
import ShinyTextAgent from "../../components/animations/agent-dashboard/shinyEffectComponent";
import FadeAnimationText from "../../components/transitions/FadeText";
import type { Messages } from "./ChatAgentPage";
import MessageAgentUI from "./MessageAgent";
import MessageUserUI from "./MessageUser";

interface MessageContainerProps {
    messages: Messages[],
    isLoading: boolean
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ messages, isLoading }) => {
    return (
        <>
            {
                messages.map((msg, index) => (
                    <>
                        <FadeAnimationText
                            key={index}
                            marginBottom={msg.htmlContent ? 10 : 4}
                            display="flex"
                            flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                            alignItems="flex-start"
                            className="chat-ai"
                        >
                            {
                                msg.role === "user" ? <MessageUserUI {...msg} /> : <MessageAgentUI {...msg} />
                            }
                        </FadeAnimationText>
                        <FadeAnimationText>
                            {
                                msg.htmlContent && (
                                    <Box width={"80%"} margin={"auto"} pb={20}>
                                        <iframe
                                            srcDoc={msg.htmlContent}
                                            title={`Reporte Playwright ${index}`}
                                            sandbox="allow-scripts allow-same-origin"
                                            style={{
                                                width: "100%",
                                                margin: "auto",
                                                height: "250px",
                                                border: "none",
                                                pointerEvents: "none",
                                                background: "#F4F4F4",
                                                borderRadius: "15px",
                                            }}
                                        />
                                        <Box mt={5} float={"inline-end"}>
                                            <Button
                                                onClick={() => {
                                                    const blob = new Blob([msg.htmlContent!], { type: 'text/html' });
                                                    const url = URL.createObjectURL(blob);
                                                    window.open(url, '_blank');
                                                }}
                                                rightIcon={<SquareArrowOutUpRight size={15} />}
                                                size={"sm"}
                                                bg="black"
                                                color="white"
                                                _hover={{
                                                    bg: "blackAlpha.700",
                                                }}
                                            >
                                                Abrir en otra pestaña
                                            </Button>
                                        </Box>
                                    </Box>
                                )
                            }
                        </FadeAnimationText>
                    </>
                ))
            }
            {
                isLoading && (
                    <Box display={"flex"} gap={2} alignItems={"center"} height={200}>
                        <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                        <ShinyTextAgent text="Pensando..." />
                    </Box>
                )
            }
        </>
    )
}