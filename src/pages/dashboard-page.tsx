import { Box, Button, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { AlignJustify, FileChartLine } from "lucide-react"
import { lazy, Suspense } from "react"
import InformDocument from "../components/dashboard/inform-document"
import SkeletonCards from "../components/dashboard/skeleton-cards"
import SkeletonTable from "../components/dashboard/skeleton-table"

const CardsDashboardComponent = lazy(() => import('../components/dashboard/card-details'))
const TableGithubDashboardComponent = lazy(() => import('../components/dashboard/table-workflows'))

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
                    <Suspense fallback={<SkeletonCards />}>
                        <CardsDashboardComponent key={new Date().getTime()} />
                    </Suspense>
                </HStack>
            </Box>
            <Box mt={5}>
                <Box width={"95%"} margin={"auto"}>
                    <Suspense fallback={<SkeletonTable />}>
                        <TableGithubDashboardComponent />
                    </Suspense>
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage