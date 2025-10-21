import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack
} from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, SquareArrowOutUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ShinyTextAnimation from "../../components/animations/ShinyText/ShinyText";
import InformDocument from "../../components/InformDocument/InformDocument";
import SkeletonCardsBilling from "../../components/skeletons/skeleton-billing-card";
import SkeletonCards from "../../components/skeletons/skeleton-card";
import SkeletonTable from "../../components/skeletons/skeleton-table";
import { getGreeting } from "../../utils/getGreetings";

const CardDetailsDashLazy = lazy(() => import("../../components/CardDetailsComponent/CardDetailsComponent"))
const TableDashLazy = lazy(() => import("../../components/TableWorkflowComponent/TableWorkflowComponent"))
const CardBillingActionsMinutes = lazy(() => import("../../components/Billing/CardBillingMinutes"))
const CardBillingActionsStorage = lazy(() => import("../../components/Billing/CardBillingStorage"))

const DashboardPage = () => {
  return (
    <Box height={"95vh"} overflow={"auto"} position={"relative"}>
      <Box
        mb={5}
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Heading as="h1" size={"lg"} >{getGreeting()}</Heading>
        <Box display={"flex"} gap={2}>
          <Link to={"/create-test"}>
            <Button
              variant={"outline"}
              rightIcon={<SquareArrowOutUpRight size={16} />}
              borderColor={"black"}
              size={"sm"}
              _hover={{ bg: "" }}
            >
              Crear test
            </Button>
          </Link>
          <PDFDownloadLink
            document={<InformDocument />}
            fileName="informe-avianca-playwright.pdf"
          >
            {({ loading }) =>
              <Button
                rightIcon={<FileDown size={16} />}
                bg={"black"}
                color={"white"}
                _hover={{ bg: "gray.800" }}
                size={"sm"}
              >
                {loading ? <Spinner size={"sm"} /> : "Reporte"}
              </Button>
            }
          </PDFDownloadLink>
        </Box>
      </Box>
      <Box className="container-dash" mt={2}>
        <Box
          position={"relative"}
          display={"flex"}
          gap={3}
          flexWrap={"wrap"}
        >
          <HStack
            borderRadius={"md"}
            p={2}
            width={{ base: "100%", md: "50%" }}
            bg={"#1B1B1B"}
            height={200}
            justify={"space-between"}
            backgroundImage={`
            radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
          `}
            display={"grid"}
            placeContent={"center"}
          >
            <Heading color={"white"} textAlign={"center"}>
              Dashboard <br />
              <ShinyTextAnimation
                key={uuid()}
                text="Avianca Playwright"
                speed={3}
              />
            </Heading>
            <Text color={"gray.400"} textAlign={"center"}>Visualiza, Revisa y gestiona tus workflows</Text>
          </HStack>
          <VStack width={{ base: "100%", md: "48%" }} height={"100%"}>
            <Suspense fallback={<SkeletonCardsBilling />}>
              <CardBillingActionsMinutes />
            </Suspense>
            <Suspense fallback={<SkeletonCardsBilling />}>
              <CardBillingActionsStorage />
            </Suspense>
          </VStack>
        </Box>
        <HStack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          flexWrap={"wrap"}
          mt={5}
        >
          <Suspense fallback={<SkeletonCards />}>
            <CardDetailsDashLazy />
          </Suspense>
        </HStack>
      </Box>
      <Box mt={5}>
        <Box width={"95%"} margin={"auto"}>
          <Suspense fallback={<SkeletonTable />}>
            <TableDashLazy />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
