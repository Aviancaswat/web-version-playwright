import { Avatar, Box, Button, Center, Heading, Textarea, Tooltip, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";
import { v4 } from "uuid";
import { RunAgentDashboard } from "../../agent/dashboard-agent-ai";
import LogoAv from "../../assets/avianca-logo-desk.png";
import '../../components/agent-dashboard-ui/agent.css';
import PulsingBox from "../../components/agent-dashboard-ui/PulseBox";
import WelcomeAgentDashboard from "../../components/agent-dashboard-ui/welcomeAgent";
import ShinyTextAgent from "../../components/animations/agent-dashboard/shinyEffectComponent";
import type { DataWorkflows } from "../../components/TableWorkflowComponent/TableWorkflowComponent.types";
import FadeAnimationText from "../../components/transitions/FadeText";
import { getRunsByRepo } from "../../github/api";
import { useTestStore, type JSONDashboardAgentAvianca, type TopUser } from "../../store/test-store";

// type ResponseStreamModel = {
//     type: string;
//     delta?: string
// }

type Messages = {
    role: "user" | "agent"
    message: string,
}

const MessageUserUI = (msg: Messages) => {
    return (
        <>
            <Box className="chat-message" display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    padding={2}
                    borderRadius="md"
                    backgroundColor={msg.role === "user" ? "black" : "gray.100"}
                    color={msg.role === "user" ? "white" : "black"}
                >
                    <ReactMarkdown children={msg.message} remarkPlugins={[remarkGFM]} />
                </Box>
            </Box>
        </>
    )
}

const MessageAgentUI = (msg: Messages) => {
    return (
        <VStack>
            <Box className="chat-message" display={"flex"} gap={2} alignItems={"start"}>
                <Box
                    display="flex"
                    flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                >
                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                </Box>
                <Box
                    paddingLeft={5}
                    paddingRight={5}
                    paddingTop={2}
                    borderRadius="md"
                    backgroundColor={msg.role === "user" ? "black" : "gray.100"}
                    color={msg.role === "user" ? "white" : "black"}
                >
                    <ReactMarkdown children={msg.message} remarkPlugins={[remarkGFM]} />
                </Box>
            </Box>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: 'pointer', marginLeft: 30, alignSelf: "start" }}
                onClick={() => {
                    navigator.clipboard.writeText(msg.message);
                }}
            >
                <Tooltip label="Copiar respuesta" bg={"black"} color={"white"} borderRadius={"md"}>
                    <Button
                        bg={"transparent"}
                        size={"xs"}
                        onClick={async () => await navigator.clipboard.writeText(msg.message)}
                        _hover={{
                            bg: "none",
                            border: "none"
                        }}
                    >
                        <Copy size={15} />
                    </Button>
                </Tooltip>
            </motion.div>
        </VStack>
    )
}

const ChatAgentPage = () => {

    const { setDataWorkflows, setDashboardDataAgentAvianca } = useTestStore();
    const chatRef = useRef<HTMLDivElement | null>(null);
    const { dashboardDataAgentAvianca } = useTestStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingWorkflows, setLoadingWorkflows] = useState<boolean>(false);
    const [questionUser, setQuestionUser] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);

    const getTopUsers = (newData: DataWorkflows[]): TopUser[] => {
        const userStats: Record<string, TopUser> = {};

        newData.forEach(workflow => {
            const username = workflow.actor.autorname;
            const avatar = workflow.actor.avatar;

            if (!username) return;

            if (!userStats[username]) {
                userStats[username] = {
                    user: username,
                    avatar: avatar || "",
                    executions: 0,
                    passes: 0,
                    failures: 0,
                    cancelled: 0
                };
            }
            userStats[username].executions++;
            switch (workflow.conclusion) {
                case 'success':
                    userStats[username].passes++;
                    break;
                case 'failure':
                    userStats[username].failures++;
                    break;
                case 'cancelled':
                    userStats[username].cancelled++;
                    break;
            }
        });

        const topUsers = Object.values(userStats).sort(
            (a, b) => b.executions - a.executions
        );
        return topUsers;
    }

    const getWorkflows = async () => {
        setLoadingWorkflows(true);
        try {
            const runs = await getRunsByRepo();
            if (runs.length === 0) throw new Error("No hay workflows");
            console.log("Data workflows chat ai: ", runs)

            const newData: DataWorkflows[] = runs.map((workflow) => ({
                id: workflow.id,
                actor: {
                    autorname: workflow?.actor?.login,
                    avatar: workflow?.actor?.avatar_url,
                },
                display_title: workflow.display_title,
                status: workflow.status,
                conclusion: workflow.conclusion,
                total_count: workflow.total_count
            }));

            const successWorkflows = newData.filter(
                (item) => item.conclusion === "success"
            ).length;

            const failureWorkflows = newData.filter(
                (item) => item.conclusion === "failure"
            ).length;

            const cancelledWorkflows = newData.filter(
                (item) => item.conclusion === "cancelled"
            ).length;

            const totalWorkflows = newData.length;

            let dataJSON: JSONDashboardAgentAvianca = {
                workflowsData: newData,
                users: newData.map(e => e.actor?.autorname),
                top_users: getTopUsers(newData),
                recent_failures: newData.filter((item) => item.conclusion === "failure").slice(0, 5),
                summary: {
                    total_workflows: totalWorkflows,
                    total_passed: successWorkflows,
                    total_failed: failureWorkflows,
                    total_cancelled: cancelledWorkflows,
                    pass_rate: ((successWorkflows / totalWorkflows) * 100),
                    failure_rate: ((failureWorkflows / totalWorkflows) * 100),
                    cancel_rate: ((cancelledWorkflows / totalWorkflows) * 100)
                }
            }

            setDataWorkflows(newData);
            setDashboardDataAgentAvianca(dataJSON);

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWorkflows(false);
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        console.log("Obteniendo workflows...")
        getWorkflows()
    }, [])

    const getResponseModel = useCallback(async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "user", message: questionUser }
            ]);

            setLoading(true);

            const { finalOutput } = await RunAgentDashboard(
                `${JSON.stringify(dashboardDataAgentAvianca)}`,
                questionUser
            );

            // let agentResponse = "";

            // for await (const event of response) {
            //     if (event.type === 'raw_model_stream_event') {
            //         const { type, delta } = event.data as ResponseStreamModel;
            //         if (type === "output_text_delta" && delta) {
            //             agentResponse += delta;
            //         }
            //     }
            // }

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "agent", message: finalOutput ?? "" }
            ]);

            setLoading(false);
        }
    }, [questionUser]);

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
                        loadingWorkflows ? (
                            <Center height={"100%"} display={"flex"} flexDirection={"column"}>
                                <PulsingBox />
                                <Heading mt={5} size={"md"}>Avianca Playwright Agent</Heading>
                            </Center>
                        ) : <WelcomeAgentDashboard />
                    ) : (
                        <Box>
                            {messages.map((msg, index) => (
                                <FadeAnimationText
                                    key={index}
                                    marginBottom={4}
                                    display="flex"
                                    flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                                    alignItems="flex-start"
                                    className="chat-ai"
                                >
                                    {
                                        msg.role === "user" ? <MessageUserUI key={v4()} {...msg} /> : <MessageAgentUI key={v4()} {...msg} />
                                    }
                                </FadeAnimationText>
                            ))}
                            {loading && (
                                <Box display={"flex"} gap={2} alignItems={"center"} height={200}>
                                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                                    <ShinyTextAgent text="Pensando..." />
                                </Box>
                            )}
                        </Box>
                    )
                }
            </Box>
            <Box>
                <Textarea
                    isDisabled={loadingWorkflows}
                    value={questionUser}
                    width={"full"}
                    minHeight={100}
                    placeholder="Preguntar algo..."
                    onKeyDown={getResponseModel}
                    onChange={(e) => setQuestionUser(e.target.value)}
                    bg={"white"}
                    color={"black"}
                    borderRadius={"2xl"}
                />
            </Box>
        </Box>
    );
}

export default ChatAgentPage;
