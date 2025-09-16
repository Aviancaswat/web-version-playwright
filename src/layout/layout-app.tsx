import { Box, HStack } from "@chakra-ui/react"
import { FlaskConical, House, LayoutDashboard } from "lucide-react"
import { useLocation } from "react-router-dom"
import BreadcrumbPage from "../components/breadcrumb-page"
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

const routesPage = {
    '/': 'Página principal',
    '/dashboard': 'Dashboard',
    '/create-test': 'Configuración de la test'
} as const;

type Routes = typeof routesPage;

const LayoutApp = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()
    return (
        <HStack width={"100vw"}>
            <Box minWidth={"25%"}>
                <SideBarDashboard childrens={routesConfig} />
            </Box>
            <Box
                height={"100vh"}
                width={"75%"}
                p={5}
            >
                <BreadcrumbPage currentPage={routesPage[location.pathname as keyof Routes]} />
                {children}
            </Box>
        </HStack>
    )
}

export default LayoutApp