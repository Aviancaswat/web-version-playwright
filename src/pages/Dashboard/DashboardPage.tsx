import {
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  AlignJustify,
  FileChartLine
} from "lucide-react";
import { lazy, Suspense } from "react";
import InformDocument from "../../components/InformDocument/InformDocument";
import SkeletonCards from "../../components/skeletons/skeleton-card";
import SkeletonTable from "../../components/skeletons/skeleton-table";

const CardDetailsDashLazy = lazy(() => import("../../components/CardDetailsComponent/CardDetailsComponent"))
const TableDashLazy = lazy(() => import("../../components/TableWorkflowComponent/TableWorkflowComponent"))

const DashboardPage = () => {
  return (
    <Box height={"95vh"} overflow={"auto"}>
      <HStack mt={5} justify={"space-between"}>
        <VStack align={"start"}>
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
