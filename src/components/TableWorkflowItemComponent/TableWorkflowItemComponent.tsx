import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Td,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  FileX2,
  FolderDown,
  GripHorizontal,
  ImageDown,
  RefreshCw,
} from "lucide-react";
import { useState, type ReactElement } from "react";

//Services
import {
  deleteArtefactById,
  downLoadReportHTML,
  runWorkflowById,
  type ResultWorkflow,
  type StatusWorkflow,
} from "../../github/api";

//Components
import TagDash from "../TableTagItemComponent/TableTagItemComponent";

//Types
import AviancaToast from "../../utils/AviancaToast";
import type { TableWorkflowItemsProps } from "../TableWorkflowComponent/TableWorkflowComponent.types";

const TableWorkflowItemComponent: React.FC<TableWorkflowItemsProps> = ({
  data,
}) => {
  const toast = useToast();

  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [isLoadingScreenshots, setIsLoadingScreenshots] =
    useState<boolean>(false);
  const [isLoadingRun, setIsLoadingRun] = useState<boolean>(false);
  const [isLoadingDeleteArtifacts, setIsLoadingDeleteArtifacts] =
    useState<boolean>(false);

  const parserValueWorkflow = (
    value: StatusWorkflow | ResultWorkflow | undefined
  ): ReactElement => {
    switch (value) {
      case "success":
        return <TagDash key={new Date().getTime()} type="success" />;
      case "cancelled":
        return <TagDash key={new Date().getTime()} type="cancelled" />;
      case "completed":
        return <TagDash key={new Date().getTime()} type="completed" />;
      case "failure":
        return <TagDash key={new Date().getTime()} type="failure" />;
      case "in_progress":
        return <TagDash key={new Date().getTime()} type="in_progress" />;
      case "queued":
        return <TagDash key={new Date().getTime()} type="queued" />;
      case "neutral":
      case undefined:
      default:
        return <TagDash key={new Date().getTime()} type="neutral" />;
    }
  };

  const handleDownloadReport = async (workflowId: number) => {
    try {
      setIsLoadingReport(true);
      await downLoadReportHTML(workflowId);
      toast({
        status: "success",
        title: "Reporte descargado",
        description: `El reporte se descargó correctamente`,
      });
    } catch (error) {
      console.error(
        `Error al descargar el reporte para el workflow ${workflowId}:`,
        error
      );
      AviancaToast.error((error as Error).message)
      throw error;
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleDownloadScreenshots = async (workflowId: number) => {
    try {
      setIsLoadingScreenshots(true);
      await downLoadReportHTML(workflowId, "only-screenshots");
      toast({
        status: "success",
        title: "Imagenes descargadas",
        description: `Las imagenes se descargaron correctamente`,
      });
    } catch (error) {
      console.error(
        `Error al descargar las imagenes para el workflow ${workflowId}:`,
        error
      );
      toast({
        status: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al descargar las imagenes",
      });
      throw error;
    } finally {
      setIsLoadingScreenshots(false);
    }
  };

  const handleRunWorkflow = async (workflowId: number) => {
    try {
      setIsLoadingRun(true);
      await runWorkflowById(workflowId);
      toast({
        status: "success",
        title: "Workflow ejecutado",
        description: `El workflow se está ejecutando correctamente`,
      });
    } catch (error) {
      console.error(`Error al ejecutar el workflow ${workflowId}:`, error);
      toast({
        status: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al ejecutar el workflow",
      });
      throw error;
    } finally {
      setIsLoadingRun(false);
    }
  };

  const handleDeleteArtifactsByWorkflow = async (workflowId: number) => {
    try {
      setIsLoadingDeleteArtifacts(true);
      await deleteArtefactById(workflowId);
      toast({
        status: "success",
        title: "Artefacto eliminado",
        description: "Se ha eliminado los artefactos correctamente",
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al eliminar los artefactos",
      });
      throw error;
    } finally {
      setIsLoadingDeleteArtifacts(false);
    }
  };

  return (
    <>
      {data.map((row) => (
        <Tr key={row.id}>
          <Td>
            <Tooltip key={row.id} label={row?.actor?.autorname} placement="top" bg={"white"} color={"black"}>
              <Avatar key={row.id} size='sm' name='Avianca Playwright' src={row?.actor?.avatar} />
            </Tooltip>
          </Td>
          <Td maxWidth={300} isTruncated>{row.display_title}</Td>
          <Td>{parserValueWorkflow(row.status as StatusWorkflow)}</Td>
          <Td>{parserValueWorkflow(row.conclusion as ResultWorkflow)}</Td>
          <Td>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} bg="none">
                <GripHorizontal />
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={
                    isLoadingReport ? <Spinner size="sm" /> : <FolderDown />
                  }
                  onClick={() => handleDownloadReport(row.id)}
                >
                  Descargar Reporte
                </MenuItem>
                <MenuItem
                  icon={
                    isLoadingScreenshots ? <Spinner size="sm" /> : <ImageDown />
                  }
                  onClick={() => handleDownloadScreenshots(row.id)}
                >
                  Descargar Imagenes
                </MenuItem>
                <MenuItem
                  icon={isLoadingRun ? <Spinner size="sm" /> : <RefreshCw />}
                  onClick={() => handleRunWorkflow(row.id)}
                >
                  Volver a ejecutar workflow
                </MenuItem>
                <MenuItem
                  icon={
                    isLoadingDeleteArtifacts ? (
                      <Spinner size="sm" />
                    ) : (
                      <FileX2 />
                    )
                  }
                  onClick={() => handleDeleteArtifactsByWorkflow(row.id)}
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
