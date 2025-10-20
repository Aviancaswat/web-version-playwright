import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { MessageCircleCode } from "lucide-react"
import React, { useEffect, useState } from "react"
import { RunAgentDashboard } from "../../agent/dashboard-agent-ai"
import { useTestStore } from "../../store/test-store"

const AgentDashboardUI: React.FC = () => {

    const btnRef = React.useRef<HTMLButtonElement | null>(null)
    const { dashboardDataAgentAvianca, dataWorkflows } = useTestStore()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [responseModel, setResponseModel] = useState<string | undefined>(undefined)

    useEffect(() => {
        setResponseModel("Hola! Bienvenido ¿en que te puedo ayudar hoy?")
        const getResponseModel = async () => {
            await RunAgentDashboard(`${JSON.stringify(dashboardDataAgentAvianca)}`)
            //const finalOutput = result.finalOutput;
            //setResponseModel(finalOutput);
        };
        getResponseModel()
    }, [dataWorkflows])

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
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Dahboard Agent AI</DrawerHeader>
                    <DrawerBody>
                        <Textarea height={"full"} width={"full"} value={responseModel} />
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