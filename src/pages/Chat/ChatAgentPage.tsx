import { Avatar, Box, Button, ButtonGroup, Center, Heading, HStack, Textarea, Tooltip, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import 'highlight.js/styles/felipec.css';
import { ArrowDownToLine, Copy, SquareArrowOutUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from "rehype-raw";
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
import AviancaToast from "../../utils/AviancaToast";
import { createPDF } from "../../utils/generatePDF";


type Messages = {
    role: "user" | "agent"
    message: string,
    htmlContent?: string,
    imageContent?: string
}

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
                    <ReactMarkdown children={msg.message} remarkPlugins={[remarkGFM]} />
                </Box>
            </Box>
        </>
    )
}

const MessageAgentUI = (msg: Messages) => {

    const copyResponse = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            AviancaToast.success("Respuesta copiada")
        } catch (error) {
            console.log("Error copying text: ", error);
            AviancaToast.error("Error copiando la respuesta al portapapeles")
        }
    }, [])

    const downloadResponse = useCallback(async (text: string) => {
        try {
            await createPDF(text);
            AviancaToast.success("Respuesta descargada")
        }
        catch (error) {
            console.log("Error downloading text: ", error);
            AviancaToast.error("Error descargando la respuesta")
        }
    }, [])

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
                    {
                        (msg.message.trim().includes("<svg") ||
                            msg.message.trim().includes("<img") ||
                            msg.message.trim().includes("<video") ||
                            msg.message.trim().includes("<table") ||
                            msg.message.trim().includes("<html")) ?
                            <div dangerouslySetInnerHTML={{ __html: msg.message }} /> :
                            <ReactMarkdown
                                children={msg.message}
                                remarkPlugins={[remarkGFM]}
                                rehypePlugins={[rehypeRaw, rehypeHighlight]} />
                    }
                </Box>
            </Box>
            <HStack alignSelf={"start"} ml={50} spacing={0}>
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
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ cursor: 'pointer', alignSelf: "start" }}
                        onClick={() => {
                            navigator.clipboard.writeText(msg.message);
                        }}
                    >
                        <Tooltip label="Descargar respuesta" bg={"black"} color={"white"} borderRadius={"md"}>
                            <Button
                                bg={"transparent"}
                                size={"xs"}
                                onClick={() => downloadResponse(msg.message)}
                                _hover={{
                                    bg: "none",
                                    border: "none"
                                }}
                            >
                                <ArrowDownToLine size={15} />
                            </Button>
                        </Tooltip>
                    </motion.div>
                </ButtonGroup>
            </HStack>
        </VStack>
    )
}

const ChatAgentPage = () => {

    const chatRef = useRef<HTMLDivElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const { setDataWorkflows, setDashboardDataAgentAvianca, dashboardDataAgentAvianca } = useTestStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingWorkflows, setLoadingWorkflows] = useState<boolean>(false);
    const [questionUser, setQuestionUser] = useState<string>("");
    const [messages, setMessages] = useState<Messages[]>([]);
    const [workflowToAnalize, setWorkflowAnalize] = useState<string | undefined>(undefined)

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
        getWorkflows()
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
            }, 1000)

        }
    }, [workflowToAnalize])

    const getResponseModel = useCallback(async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "user", message: questionUser }
            ]);

            setLoading(true);

            const responseAgent = await RunAgentDashboard(JSON.stringify(dashboardDataAgentAvianca), questionUser);
            console.log("Response agent dashboard: ", responseAgent);

            setMessages(prevMessages => [
                ...prevMessages,
                { role: "agent", message: responseAgent.finalOutput ?? "" }
            ]);

            setLoading(false);
            setQuestionUser("")

            const resultFunctionCall = responseAgent.output.find(e => e.type === "function_call_result")
            if (!resultFunctionCall) return;

            type OutputResponse = {
                type: "text" | "image",
                text?: string
            }

            const responseFunctionCallReport = resultFunctionCall?.output as OutputResponse;
            console.log("responseFunctionCallReport: ", responseFunctionCallReport)
            const textResultReport = responseFunctionCallReport?.text;
            if (!textResultReport) return;

            const result = JSON.parse(textResultReport);
            console.log("result report Object: ", result)

            if (result.success && result.reportReady) {
                const reportData = (window as any).__playwrightReport;

                if (reportData?.htmlContent) {
                    console.log("ENTRO R")
                    //es posible agregar un agente al tool para que analize el reporte 
                    //con la data que retrona el método
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            role: "agent",
                            message: result?.message ?? "",
                            htmlContent: reportData?.htmlContent
                        }
                    ]);
                    delete (window as any).__playwrightReport;
                }
                else {
                    console.log("NO ENTRÓ: ", reportData)
                }
            }
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
                                            msg.role === "user" ? <MessageUserUI key={v4()} {...msg} /> : <MessageAgentUI key={v4()} {...msg} />
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
                            ))}
                            {loading && (
                                <Box display={"flex"} gap={2} alignItems={"center"} height={200}>
                                    <Avatar size='sm' name='Avianca Agent' src={LogoAv} bg={"black"} color={"white"} />
                                    <ShinyTextAgent text="Pensando..." />
                                </Box>
                            )}
                            <Box ref={chatRef} />
                        </Box>
                    )
                }
            </Box>
            <Box height={"auto"}>
                <Textarea
                    ref={textAreaRef}
                    isDisabled={loadingWorkflows}
                    value={questionUser}
                    width={"full"}
                    height={"auto"}
                    placeholder="Preguntar algo..."
                    onKeyDown={getResponseModel}
                    onChange={(e) => setQuestionUser(e.target.value)}
                    bg={"white"}
                    color={"black"}
                    borderRadius={"full"}
                    textAlign={"left"}
                    pt={7}
                />
            </Box>
        </Box>
    );
}

export default ChatAgentPage;
