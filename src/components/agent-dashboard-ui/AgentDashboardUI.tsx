import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Text, useDisclosure } from "@chakra-ui/react"
import { MessageCircleCode } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { RunAgentDashboard } from "../../agent/dashboard-agent-ai"
import { useTestStore } from "../../store/test-store"

type ResponseStreamModel = {
    type: string;
    delta?: string
}

const AgentDashboardUI: React.FC = () => {

    const textareaRef = useRef<HTMLDivElement | null>(null)
    const btnRef = React.useRef<HTMLButtonElement | null>(null)
    const { dashboardDataAgentAvianca } = useTestStore()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [responseModel, setResponseModel] = useState<string | undefined>(undefined)

    useEffect(() => {
        setResponseModel("Hola! Bienvenido ¿en que te puedo ayudar hoy?")
        const getResponseModel = async () => {
            const response = await RunAgentDashboard(`${JSON.stringify(dashboardDataAgentAvianca)}`)
            for await (const event of response) {
                if (event.type === 'raw_model_stream_event') {
                    const { type, delta } = event.data as ResponseStreamModel;
                    if (type === "output_text_delta") {
                        setResponseModel(prev => prev + (delta ?? ""))
                    }
                }
            }
        };
        getResponseModel()
    }, [])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [responseModel])

    return (
        <Box position={"fixed"} bottom={5} right={10}>
            <Button
                ref={btnRef}
                colorScheme='cyan'
                onClick={onOpen}
                borderRadius={"full"}
                width={"auto"}
                size={"lg"}
            >
                <MessageCircleCode />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
                size={"full"}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Dahboard Agent AI</DrawerHeader>
                    <DrawerBody>
                        <Box ref={textareaRef} height={"full"} width={"full"} p={4} overflowY="auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{responseModel}</ReactMarkdown>
                        </Box>
                    </DrawerBody>
                    <DrawerFooter width={"100%"} display={"flex"} flexDirection={"column"}>
                        <Input placeholder='Escribe aquí...' />
                        <Text mt={2} fontSize={"sm"} textAlign={"center"}>Avianca evolutivos @{new Date().getFullYear()}</Text>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default AgentDashboardUI;
