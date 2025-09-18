import { Box, Heading, HStack, Text } from "@chakra-ui/react"
import { Bug, CirclePause, TestTube } from "lucide-react"
import type { CardDetailsDashProps } from "../components/dashboard/card-details"
import CardDetailsDash from "../components/dashboard/card-details"
import TableWorkflowsDash from "../components/dashboard/table-workflows"

const dataCardsDetailsDash: CardDetailsDashProps[] = [
    {
        icon: TestTube,
        title: "Total pruebas existosas",
        value: 150,
        type: "success"
    },
    {
        icon: Bug,
        title: "Total pruebas fallidas",
        value: 10,
        type: "error"
    },
    {
        icon: CirclePause,
        title: "Total pruebas canceladas",
        value: 5,
        type: "cancelated"
    }
]

const DashboardPage = () => {
    return (
        <Box height={"100%"}>
            <Heading as="h1" size={"lg"}>Dashboard</Heading>
            <Text>Análisis del desempeño de tus procesos de CI/CD en GitHub Actions</Text>
            <Box className="container-dash" mt={5}>
                <HStack
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {
                        dataCardsDetailsDash.map((data, index) => (
                            <CardDetailsDash key={index} {...data} />
                        ))
                    }
                </HStack>
            </Box>
            <Box mt={10}>
                <Heading as="h3" size={"md"}>
                    Información general de los workflows
                </Heading>
                <Box mt={10} width={"100%"}>
                    <TableWorkflowsDash />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage