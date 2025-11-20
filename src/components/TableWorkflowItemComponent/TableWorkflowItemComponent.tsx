import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tooltip,
  Tr
} from "@chakra-ui/react";
import {
  FileX2,
  FolderDown,
  GripHorizontal,
  RefreshCw
} from "lucide-react";
import { useState, type ReactElement } from "react";
import { v4 as uuid } from "uuid";
import {
  deleteArtefactById,
  downLoadReportHTML,
  runWorkflowById,
  type ResultWorkflow,
  type StatusWorkflow
} from "../../github/api";
import AviancaToast from "../../utils/AviancaToast";
import TagDash from "../TableTagItemComponent/TableTagItemComponent";
import type { TableWorkflowItemsProps } from "../TableWorkflowComponent/TableWorkflowComponent.types";
import AnimatedLoader from "../loaders/AnimatedLoader";
import PreviewReport from "./PreviewReport";

const TableWorkflowItemComponent: React.FC<TableWorkflowItemsProps> = ({
  data,
}) => {

  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [isLoadingRun, setIsLoadingRun] = useState<boolean>(false);
  const [isLoadingDeleteArtifacts, setIsLoadingDeleteArtifacts] =
    useState<boolean>(false);

  const parserValueWorkflow = (
    value: StatusWorkflow | ResultWorkflow | undefined
  ): ReactElement => {
    switch (value) {
      case "success":
        return <TagDash key={uuid()} type="success" />;
      case "cancelled":
        return <TagDash key={uuid()} type="cancelled" />;
      case "completed":
        return <TagDash key={uuid()} type="completed" />;
      case "failure":
        return <TagDash key={uuid()} type="failure" />;
      case "in_progress":
        return <TagDash key={uuid()} type="in_progress" />;
      case "queued":
        return <TagDash key={uuid()} type="queued" />;
      case "neutral":
      case undefined:
      default:
        return <TagDash key={uuid()} type="neutral" />;
    }
  };

  const handleDownloadReport = async (workflowId: number) => {
    try {
      setIsLoadingReport(true);
      await downLoadReportHTML(workflowId);
      AviancaToast.success("Reporte descargado", {
        description: "Se ha descargado el reporte correctamente",
        position: "bottom-center"
      })
    } catch (error) {
      console.error(
        `Error al descargar el reporte para el workflow ${workflowId}:`,
        error
      );
      AviancaToast.error("Upps! el reporte no existe", {
        description: error instanceof Error ? error.message : "Ha ocurrido un error al descargar el reporte",
        position: "bottom-center"
      })
      throw error;
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleRunWorkflow = async (workflowId: number) => {
    try {
      setIsLoadingRun(true);
      await runWorkflowById(workflowId);
      AviancaToast.success("Run ejecutado", {
        description: "Se ha heco RUN del workflow correctamente",
        position: "bottom-center"
      })
    } catch (error) {
      console.error(`Error al ejecutar el workflow ${workflowId}:`, error);
      AviancaToast.error("Upps! Error al hacer RUN", {
        description: error instanceof Error ? error.message : "Ha ocurrido un error al hacer RUN del workflow",
        position: "bottom-center"
      })
      throw error;
    } finally {
      setIsLoadingRun(false);
    }
  };

  const handleDeleteArtifactsByWorkflow = async (workflowId: number) => {
    try {
      setIsLoadingDeleteArtifacts(true);
      await deleteArtefactById(workflowId);
      AviancaToast.success("Artefactos eliminados", {
        description: "Se ha eliminado el artefacto correctamente",
        position: "bottom-center"
      })
    } catch (error) {
      console.log(error);
      AviancaToast.success("Upps! Error al eliminar el artefacto", {
        description: error instanceof Error ? error.message : "Ocurrió un error al eliminar el artefacto",
        position: "bottom-center"
      })
      throw error;
    } finally {
      setIsLoadingDeleteArtifacts(false);
    }
  };

  return (
    <>
      {data.map((row) => (
        <Tr key={row.id}>
          <Td textAlign={"center"}>
            <Tooltip key={row.id} label={row?.actor?.autorname} placement="top" bg={"white"} color={"black"}>
              <Avatar key={row.id} size='sm' name='Avianca Playwright' src={row?.actor?.avatar} />
            </Tooltip>
          </Td>
          <Td textAlign={"center"} maxWidth={300} isTruncated>{row.display_title}</Td>
          <Td textAlign={"center"}>{parserValueWorkflow(row.status as StatusWorkflow)}</Td>
          <Td textAlign={"center"}>{parserValueWorkflow(row.conclusion as ResultWorkflow)}</Td>
          <Td textAlign={"center"}>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                bg="none"
                isDisabled={(row.status as StatusWorkflow) === "in_progress"}
                _hover={{
                  bg: "gray.300",
                  borderColor: "transparent"
                }}
                _focus={{
                  outline: "none"
                }}
              >
                <GripHorizontal />
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={
                    isLoadingReport ? <AnimatedLoader /> : <FolderDown />
                  }
                  onClick={() => handleDownloadReport(row.id)}
                  _hover={{
                    bg: "gray.100",
                    borderColor: "transparent"
                  }}
                  _focus={{
                    outline: "none"
                  }}
                >
                  Descargar Reporte
                </MenuItem>
                <PreviewReport key={uuid()} workflowID={row.id} />
                <MenuItem
                  icon={isLoadingRun ? <AnimatedLoader /> : <RefreshCw />}
                  onClick={() => handleRunWorkflow(row.id)}
                  _hover={{
                    bg: "gray.100",
                    borderColor: "transparent"
                  }}
                  _focus={{
                    outline: "none"
                  }}
                >
                  Volver a ejecutar workflow
                </MenuItem>
                <MenuItem
                  icon={
                    isLoadingDeleteArtifacts ? (
                      <AnimatedLoader />
                    ) : (
                      <FileX2 />
                    )
                  }
                  onClick={() => handleDeleteArtifactsByWorkflow(row.id)}
                  _hover={{
                    bg: "gray.100",
                    borderColor: "transparent"
                  }}
                  _focus={{
                    outline: "none"
                  }}
                >
                  Eliminar reportes
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </Tr>
      ))}
    </>
  );
};

export default TableWorkflowItemComponent;
