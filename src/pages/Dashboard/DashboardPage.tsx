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
  Bug,
  CirclePause,
  FileChartLine,
  TestTube,
} from "lucide-react";
import { useEffect, useState } from "react";

//Components
import CardDetailsDash from "../../components/CardDetailsComponent/CardDetailsComponent";
import InformDocument from "../../components/InformDocument/InformDocument";
import TableWorkflowsDash from "../../components/TableWorkflowComponent/TableWorkflowComponent";

//Store
import { useTestStore } from "../../store/test-store";

//Data
import dashboardCardData from "../../json/Dashboard/dashboardCardData.json";

//Types
import type { CardDetailsDashProps } from "../../components/CardDetailsComponent/CardDetailsComponent.types";

const DashboardPage = () => {
  const { dataWorkflows } = useTestStore();

  const [data, setDataCardsDetailsDash] = useState<CardDetailsDashProps[]>([]);

  const iconMap: Record<string, CardDetailsDashProps["icon"]> = {
    TestTube,
    Bug,
    CirclePause,
  };

  const dataCardsDetailsDash: CardDetailsDashProps[] = dashboardCardData.map(
    (item) => ({
      icon: iconMap[item.icon],
      title: item.title,
      value: item.value,
      type: item.type as "success" | "error" | "cancelled",
      stat: item.stat,
    })
  );

  useEffect(() => {
    if (dataWorkflows.length > 0) {
      const successWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "success"
      ).length;

      const failureWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "failure"
      ).length;

      const cancelledWorkflows = dataWorkflows.filter(
        (item) => item.conclusion === "cancelled"
      ).length;

      const totalWorkflows = dataWorkflows.length;

      const newData = dataCardsDetailsDash.map((card) => {
        switch (card.title) {
          case "Total exitosas":
            return {
              ...card,
              value: successWorkflows,
              stat: ((successWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total fallidas":
            return {
              ...card,
              value: failureWorkflows,
              stat: ((failureWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total canceladas":
            return {
              ...card,
              value: cancelledWorkflows,
              stat: ((cancelledWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          case "Total tiempo":
            return {
              ...card,
              value: totalWorkflows,
              stat: ((totalWorkflows / totalWorkflows) * 100).toFixed(2),
            };
          default:
            return card;
        }
      });

      setDataCardsDetailsDash(newData);
    }
  }, [dataWorkflows]);

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
          {data.map((data, index) => (
            <CardDetailsDash key={index} {...data} />
          ))}
        </HStack>
      </Box>
      <Box mt={5}>
        <Box width={"95%"} margin={"auto"}>
          <TableWorkflowsDash />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
