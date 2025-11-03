import { Box, Textarea } from "@chakra-ui/react";
import 'highlight.js/styles/felipec.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { RunAgentDashboard } from "../../agent/dashboard-agent-ai";
import '../../components/agent-dashboard-ui/agent.css';
import WelcomeAgentDashboard from "../../components/agent-dashboard-ui/welcomeAgent";
import type { DataWorkflows } from "../../components/TableWorkflowComponent/TableWorkflowComponent.types";
import { getRunsByRepo } from "../../github/api";
import { useTestStore, type JSONDashboardAgentAvianca, type TopUser } from "../../store/test-store";
import { MessageContainer } from "./MessageContainer";


export type Messages = {
    role: "user" | "agent"
    message: string,
    htmlContent?: string,
    imageContent?: string
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
                const url = new URL(document.URL);
                url.searchParams.delete('workflowID');
                window.history.replaceState({}, document.title, url.pathname + url.search);
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
                        <WelcomeAgentDashboard
                            isLoading={loadingWorkflows}
                        />
                    ) : (
                        <Box>
                            <MessageContainer
                                messages={messages}
                                isLoading={loading}
                            />
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
