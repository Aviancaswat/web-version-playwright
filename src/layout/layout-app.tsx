import { Box, HStack } from "@chakra-ui/react"
import { FlaskConical, House, LayoutDashboard } from "lucide-react"
import SideBarDashboard, { type ChildrenSideBarDashboardProps } from "../components/dashboard/sidebar"

const routesConfig: ChildrenSideBarDashboardProps[] = [
    {
        name: "Home",
        path: "/",
        icon: House
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Configurar Test",
        path: "/create-test",
        icon: FlaskConical
    }
]

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <HStack width={"100vw"} height={"100vh"}>
            <Box minWidth={"25%"}>
                <SideBarDashboard
                    childrens={routesConfig}
                />
            </Box>
            <Box
                width={"75%"}
                p={2}
                height={"100%"}
            >
                {children}
            </Box>
        </HStack>
    )
}

export default LayoutApp