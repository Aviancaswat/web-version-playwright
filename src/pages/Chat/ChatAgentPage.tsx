import { Box, Heading, HStack, Image, Text, Textarea } from "@chakra-ui/react";
import 'highlight.js/styles/felipec.css';
import { Bot } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { RunAgentDashboard } from "../../agent/apa-agent";
import logo from "../../assets/avianca-logo-desk.png";
import '../../components/agent-dashboard-ui/agent.css';
import { SidebarChatHistory } from "../../components/agent-dashboard-ui/SidebarChatHistory";
import WelcomeAgentDashboard from "../../components/agent-dashboard-ui/welcomeAgent";
import type { DataWorkflows } from "../../components/TableWorkflowComponent/TableWorkflowComponent.types";
import { getRunsByRepo } from "../../github/api";
import { useTestStore, type JSONDashboardAgentAvianca, type TopUser } from "../../store/test-store";
import { MessageContainer } from "./MessageContainer";

export type Messages = {
    role: "user" | "agent"
    message: string,
    htmlContent?: string,
    imageContent?: string,
    timestamp: string
}

const ChatAgentPage = () => {

    const {
        setDataWorkflows,
        setDashboardDataAgentAvianca,
        dashboardDataAgentAvianca,
        conversationsAPA,
        setConversationsAPA
    } = useTestStore();
    const chatRef = useRef<HTMLDivElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingWorkflows, setLoadingWorkflows] = useState<boolean>(false);
    const [questionUser, setQuestionUser] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);
    const [workflowToAnalize, setWorkflowAnalize] = useState<string | undefined>(undefined)
    const [conversationId, setConversationId] = useState<string | undefined>(undefined)

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
        try {
            setLoadingWorkflows(true);
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
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        console.log("Obteniendo workflows...")
        getWorkflows();
        //Obteniendo conversaciones ID
        const conversationUUID = uuid();
        setConversationId(conversationUUID);
        console.log("Se creo la conversación con id: ", conversationUUID);
        console.log("conversationsAPA: ", conversationsAPA);
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(new URL(document.URL).search);
        if (params.size === 0) return;
        const workflowParam = params.get("workflowID");

        if (workflowParam && workflowParam !== workflowToAnalize) {
            setWorkflowAnalize(workflowParam)
            setQuestionUser(`Analiza el reporte asociado al workflow: ${workflowParam}`)
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            setTimeout(() => {
                textAreaRef?.current?.dispatchEvent(enterEvent);
                setQuestionUser("");
                const url = new URL(document.URL);
                url.searchParams.delete('workflowID');
                window.history.replaceState({}, document.title, url.pathname + url.search);
            }, 1000)
        }
    }, [workflowToAnalize])

    useEffect(() => {
        console.log("Se actualiza las conversaciones: ", conversationsAPA)
    }, [conversationsAPA])

    const getResponseModel = useCallback(
        async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey && questionUser.trim() !== "") {
                e.preventDefault();

                const userMessage: Messages = {
                    role: "user",
                    message: questionUser,
                    timestamp: new Date().toISOString(),
                };

                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, userMessage];

                    setConversationsAPA((prev) => {
                        const existing = prev.find(
                            (c) => c.converdationId === conversationId
                        );

                        if (!existing) {
                            return [
                                ...prev,
                                { converdationId: conversationId!, messages: updatedMessages },
                            ];
                        }

                        const updatedConversations = prev.map((c) =>
                            c.converdationId === conversationId
                                ? { ...c, messages: [...c.messages, userMessage] }
                                : c
                        );

                        return updatedConversations;
                    });

                    return updatedMessages;
                });

                setLoading(true);
                setQuestionUser("");

                try {

                    const responseAgent = await RunAgentDashboard(
                        JSON.stringify(dashboardDataAgentAvianca),
                        questionUser
                    );

                    const newMessages: Messages[] = [];

                    const resultFunctionCall: any = responseAgent.output.find(
                        (e: any) => e.type === "function_call_result"
                    );

                    if (resultFunctionCall) {
                        const responseFunctionCallReport = resultFunctionCall?.output;
                        const textResultReport = responseFunctionCallReport?.text;

                        if (textResultReport) {
                            const result = JSON.parse(textResultReport);
                            const reportData = window.__playwrightReport;

                            if (result.success && result.reportReady && reportData?.htmlContent) {
                                newMessages.push({
                                    role: "agent",
                                    message: result?.message ?? "",
                                    htmlContent: reportData?.htmlContent,
                                    timestamp: new Date().toISOString(),
                                });
                                delete window.__playwrightReport;
                            }
                        }
                    }

                    const responseCallFunctionImage: any = responseAgent?.output.find(
                        (e: any) =>
                            e.type === "hosted_tool_call" && e.name === "image_generation_call"
                    );

                    if (responseCallFunctionImage?.output) {
                        newMessages.push({
                            role: "agent",
                            message: "",
                            timestamp: new Date().toISOString(),
                            imageContent: responseCallFunctionImage.output,
                        });
                    }

                    if (responseAgent.finalOutput && newMessages.length === 0) {
                        newMessages.push({
                            role: "agent",
                            message: responseAgent.finalOutput,
                            timestamp: new Date().toISOString(),
                        });
                    } else if (responseAgent.finalOutput && newMessages.length > 0) {
                        newMessages[0].message =
                            responseAgent.finalOutput + "\n\n" + newMessages[0].message;
                    }

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, ...newMessages];

                        setConversationsAPA((prev) => {
                            const existing = prev.find(
                                (c) => c.converdationId === conversationId
                            );

                            if (!existing) {
                                return [
                                    ...prev,
                                    { converdationId: conversationId!, messages: updatedMessages },
                                ];
                            }

                            const updatedConversations = prev.map((c) =>
                                c.converdationId === conversationId
                                    ? { ...c, messages: [...c.messages, ...newMessages] }
                                    : c
                            );

                            return updatedConversations;
                        });

                        return updatedMessages;
                    });
                } catch (error) {

                    console.error("Error al obtener respuesta:", error);

                    const errorMsg: Messages = {
                        role: "agent",
                        message: "Lo siento, ocurrió un error al procesar tu solicitud.",
                        timestamp: new Date().toISOString(),
                    };

                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, errorMsg];

                        setConversationsAPA((prev) => {
                            const existing = prev.find(
                                (c) => c.converdationId === conversationId
                            );

                            if (!existing) {
                                return [
                                    ...prev,
                                    { converdationId: conversationId!, messages: updatedMessages },
                                ];
                            }

                            const updatedConversations = prev.map((c) =>
                                c.converdationId === conversationId
                                    ? { ...c, messages: [...c.messages, errorMsg] }
                                    : c
                            );

                            return updatedConversations;
                        });

                        return updatedMessages;
                    });
                } finally {
                    setLoading(false);
                }
            }
        },
        [questionUser, dashboardDataAgentAvianca, conversationId, setConversationsAPA]
    );


    return (
        <Box
            height={"full"}
            width={"full"}
            display={"flex"}
            flexDirection={"column"}
        >
            <Box
                width={"full"}
                height={"100%"}
                overflowY="auto"
                padding="0px 4px 4px 4px"
                flex="1"
            >
                <HStack
                    p={7}
                    height={10}
                    bg="black"
                    color="white"
                    justify="space-between"
                    position="sticky"
                    top={0}
                    width="100%"
                    zIndex={10}
                >
                    <HStack alignItems={"center"}>
                        <Bot />
                        <Heading size="sm">
                            Chat APA
                        </Heading>
                    </HStack>
                    <HStack>
                        <Box className="actions-agent" width={"100%"} bg={"transparent"}>
                            <SidebarChatHistory />
                        </Box>
                        <Box bg="black" borderRadius="full" minW={10}>
                            <Image src={logo} width={10} height={10} />
                        </Box>
                    </HStack>
                </HStack>
                {
                    messages.length === 0 ? (
                        <WelcomeAgentDashboard
                            isLoading={loadingWorkflows}
                        />
                    ) : (
                        <Box width={"100%"}>
                            <Box mt="20px">
                                <MessageContainer
                                    messages={messages}
                                    isLoading={loading}
                                />
                                <Box ref={chatRef} />
                            </Box>
                        </Box>
                    )
                }
            </Box>
            <Box height={"auto"} mt={6}>
                <Textarea
                    ref={textAreaRef}
                    isDisabled={loadingWorkflows}
                    value={questionUser}
                    width={"95%"}
                    margin={"auto"}
                    height={"auto"}
                    placeholder="Preguntar algo..."
                    onKeyDown={getResponseModel}
                    onChange={(e) => setQuestionUser(e.target.value)}
                    bg={"white"}
                    color={"black"}
                    borderRadius={"xl"}
                    textAlign={"left"}
                    display={"flex"}
                    alignItems={"center"}
                    _focus={{
                        outline: "none",
                        border: "1px solid #000",
                        boxShadow: "none"
                    }}
                />
            </Box>
            <Box width={"100%"} pt={1} pb={1}>
                <Text textAlign={"center"} color={"gray.400"} fontSize={"sm"}>
                    Chat APA puede cometer errores, verifique la información
                </Text>
            </Box>
        </Box>
    );
}

export default ChatAgentPage;
