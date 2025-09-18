import { Box, Button, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react"
import { AlignJustify, Bug, CirclePause, FileChartLine, TestTube, Timer } from "lucide-react"
import type { CardDetailsDashProps } from "../components/dashboard/card-details"
import CardDetailsDash from "../components/dashboard/card-details"
import TableWorkflowsDash from "../components/dashboard/table-workflows"

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total exitosas",
        value: 150,
        type: "success"
    },
    {
        icon: Bug,
        title: "Total fallidas",
        value: 10,
        type: "error"
    },
    {
        icon: CirclePause,
        title: "Total canceladas",
        value: 5,
        type: "cancelated"
    },
    {
        icon: Timer,
        title: "Total tiempo",
        value: 5,
        type: "time"
    }
]

const DashboardPage = () => {
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
                        <MenuItem icon={<FileChartLine />}>Exportar informe a PDF</MenuItem>
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
                        dataCardsDetailsDash.map((data, index) => (
                            <CardDetailsDash key={index} {...data} />
                        ))
                    }
                </HStack>
            </Box>
            <Box mt={10}>
                <Heading as="h3" size={"md"} mb={5}>
                    Información general de los workflows
                </Heading>
                <Box width={"100%"} margin={"auto"}>
                    <TableWorkflowsDash />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage