import {
  Box,
  Heading,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { v4 as uuid } from "uuid";
import ShinyTextAnimation from "../../components/animations/ShinyText/ShinyText";
import SkeletonCards from "../../components/skeletons/skeleton-card";
import SkeletonTable from "../../components/skeletons/skeleton-table";

const CardDetailsDashLazy = lazy(() => import("../../components/CardDetailsComponent/CardDetailsComponent"))
const TableDashLazy = lazy(() => import("../../components/TableWorkflowComponent/TableWorkflowComponent"))
const CardBillingActionsMinutes = lazy(() => import("../../components/Billing/CardBillingMinutes"))

const DashboardPage = () => {
  return (
    <Box height={"95vh"} overflow={"auto"}>
      {/* <HStack mt={5} justify={"space-between"}>
        <VStack align={"start"} display={"hidden"}>
          <Heading as="h1" size={"lg"} ml={4}>
            Panel
          </Heading>
          <Text color={"blackAlpha.900"} fontSize={"sm"} ml={4}>
            Visualiza, analiza y descarga tus informes de Avianca playwright
          </Text>
        </VStack>
        <Menu>
          <MenuButton
            as={Button}
            bg={"gray.900"}
            color={"white"}
            _hover={{
              bg: "gray.600",
            }}
          >
            <AlignJustify />
          </MenuButton>
          <MenuList>
            <PDFDownloadLink
              document={<InformDocument />}
              fileName="informe-avianca-playwright.pdf"
            >
              {({ loading }) =>
                loading ? (
                  "Generando PDF..."
                ) : (
                  <MenuItem icon={<FileChartLine />}>
                    Exportar Informe PDF
                  </MenuItem>
                )
              }
            </PDFDownloadLink>
            <MenuDivider />
            <MenuItem
              pointerEvents={"none"}
              color={"gray.500"}
              textAlign={"center"}
              width={"100%"}
            >
              Avianca Evolutivos
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack> */}
      <Box className="container-dash" mt={2}>
        <Box
          position={"relative"}
        >
          <HStack
            borderRadius={"md"}
            p={2}
            width={"50%"}
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
              Dashboard <br /> <ShinyTextAnimation
                key={uuid()}
                text="Avianca Playwright"
                speed={3}
              />
            </Heading>
            <Text color={"gray.400"} textAlign={"center"}>Visualiza, Revisa y gestiona tus workflows</Text>
          </HStack>
          <VStack>
            <Suspense fallback={<Text>Cargando datos...</Text>}>
              <CardBillingActionsMinutes />
            </Suspense>
          </VStack>
        </Box>
        <HStack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          flexWrap={"wrap"}
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
