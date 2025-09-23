import { Box, Button, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { AlignJustify, Bug, CirclePause, FileChartLine, TestTube } from "lucide-react"
import { useEffect, useState } from "react"
import type { CardDetailsDashProps } from "../components/dashboard/card-details"
import CardDetailsDash from "../components/dashboard/card-details"
import InformDocument from "../components/dashboard/inform-document"
import TableWorkflowsDash from "../components/dashboard/table-workflows"
import { useTestStore } from "../store/test-store"

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total exitosas",
        value: 0,
        type: "success",
        stat: 0
    },
    {
        icon: Bug,
        title: "Total fallidas",
        value: 0,
        type: "error",
        stat: 0
    },
    {
        icon: CirclePause,
        title: "Total canceladas",
        value: 0,
        type: "cancelled",
        stat: 0
    }
]

const DashboardPage = () => {

    const { dataWorkflows } = useTestStore()
    const [data, setDataCardsDetailsDash] = useState<CardDetailsDashProps[]>([])

    useEffect(() => {
        if (dataWorkflows.length > 0) {

            const successWorkflows = dataWorkflows.filter(item => item.conclusion === "success").length;
            const failureWorkflows = dataWorkflows.filter(item => item.conclusion === "failure").length;
            const cancelledWorkflows = dataWorkflows.filter(item => item.conclusion === "cancelled").length;
            const totalWorkflows = dataWorkflows.length;

            const newData = dataCardsDetailsDash.map(card => {
                switch (card.title) {
                    case "Total exitosas":
                        return { ...card, value: successWorkflows, stat: ((successWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total fallidas":
                        return { ...card, value: failureWorkflows, stat: ((failureWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total canceladas":
                        return { ...card, value: cancelledWorkflows, stat: ((cancelledWorkflows / totalWorkflows) * 100).toFixed(2) }
                    case "Total tiempo":
                        return { ...card, value: totalWorkflows, stat: ((totalWorkflows / totalWorkflows) * 100).toFixed(2) }
                    default:
                        return card
                }
            })

            setDataCardsDetailsDash(newData)
        }
    }, [dataWorkflows])

    const handleDownloadPDF = () => {

    }

    return (
        <Box height={"100%"}>
            <HStack justify={"space-between"}>
                <VStack align={"start"}>
                    <Heading as="h1" size={"lg"}>Dashboard</Heading>
                    <Text color={"gray.500"}>Visualiza, analiza y descarga tus informes de Avianca playwright</Text>
                </VStack>
                <Menu>
                    <MenuButton
                        as={Button}
                        bg={"green.900"}
                        color={"white"}
                        _hover={{
                            bg: "green.600"
                        }}
                    >
                        <AlignJustify />
                    </MenuButton>
                    <MenuList>

                        <PDFDownloadLink document={<InformDocument />} fileName="informe-avianca-playwright.pdf">
                            {({ loading }) => (loading ? 'Generando PDF...' : (
                                <MenuItem
                                    icon={<FileChartLine />}
                                >
                                    Exportar Informe PDF

                                </MenuItem>
                            ))}
                        </PDFDownloadLink>
                        <MenuDivider />
                        <MenuItem pointerEvents={"none"} color={"gray.500"} textAlign={"center"} width={"100%"}>Avianca Evolutivos</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
            <Box className="container-dash" mt={5}>
                <HStack
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"100%"}
                    flexWrap={"wrap"}
                >
                    {
                        data.map((data, index) => (
                            <CardDetailsDash key={index} {...data} />
                        ))
                    }
                </HStack>
            </Box>
            <Box mt={5}>
                <Heading as="h3" size={"md"} mb={5}>
                    Información general de los workflows
                </Heading>
                <Box width={"95%"} margin={"auto"}>
                    <TableWorkflowsDash />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage