import { Box, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react"
import { AlignJustify, Bug, CirclePause, FileChartLine, TestTube, Timer } from "lucide-react"
import type { CardDetailsDashProps } from "../components/dashboard/card-details"
import CardDetailsDash from "../components/dashboard/card-details"
import TableWorkflowsDash from "../components/dashboard/table-workflows"

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total exitosas",
        value: 150,
        type: "success",
        stat: 75.25
    },
    {
        icon: Bug,
        title: "Total fallidas",
        value: 10,
        type: "error",
        stat: 10.75
    },
    {
        icon: CirclePause,
        title: "Total canceladas",
        value: 5,
        type: "cancelated",
        stat: 10
    },
    {
        icon: Timer,
        title: "Total tiempo",
        value: 5.45,
        type: "time",
        stat: 0
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
                        aria-label="Abrir menú"
                        color="gray.700"
                        _hover={{ bg: "gray.100" }}
                        _active={{ bg: "gray.200" }}
                        _focusVisible={{ boxShadow: "0 0 0 2px var(--chakra-colors-gray-300)" }}
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
            <Box mt={5}>
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