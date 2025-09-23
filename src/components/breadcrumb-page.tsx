import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

type BreadcrumbPageProps = {
    currentPage: string
}

const BreadcrumbPage: React.FC<BreadcrumbPageProps> = ({ currentPage }) => {
    return (
        <Breadcrumb spacing='5px' separator={<ChevronRightIcon />}>
            <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={"/"}>Avianca Playwright</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#'>
                {
                    currentPage === "/" ? "home" : currentPage.replace("/", "")
                }
                </BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    )
}

export default BreadcrumbPage;