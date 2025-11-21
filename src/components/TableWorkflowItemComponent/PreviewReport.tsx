import { Box, Button, ButtonGroup, Center, Heading, Image, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Bell, Bot, FolderDown, ScanEye } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import logoAv from "../../assets/avianca-logo-desk.png";
import { GithubService } from "../../github/service/github.service";
import AviancaToast from "../../utils/AviancaToast";
import AnimatedLoader from "../loaders/AnimatedLoader";

interface PreviewReportProps {
    workflowID: number;
}

export default function PreviewReport({ workflowID }: PreviewReportProps) {

    const refIframe = useRef<HTMLIFrameElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [reporteHTML, setReporteHTML] = useState<string>("");
    const [loadingReporteHTML, setLoadingReporteHTML] = useState<boolean>(false);
    const [errorLoadingReportHTML, setErrorLoadingReportHTML] = useState<boolean>(false);
    const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false)

    const previewReporteHTML = useCallback(async (workflowId: number) => {

        try {

            setLoadingReporteHTML(true);
            const { modifiedHtml: contentHTML } = await GithubService.getReportHTMLPreviewGithub(workflowId);
            setReporteHTML(contentHTML);
        }
        catch (error) {
            console.log("Error loading preview report: ", error);
            setErrorLoadingReportHTML(true);
        } finally {
            setLoadingReporteHTML(false);
        }
    }, [workflowID]);

    const downloadReportPreview = useCallback(async (workflowID: number) => {
        try {
            setIsLoadingReport(true)
            await GithubService.downLoadReportHTMLGithub(workflowID)
        } catch (error) {
            console.error("Ocurrió un error al descargar el reporte")
            AviancaToast.error("Upps! Error al descargar el reporte");
        } finally {
            setIsLoadingReport(false)
        }
    }, [workflowID])

    useEffect(() => {
        if (workflowID) {
            previewReporteHTML(workflowID);
        }
    }, [])

    return (
        <>
            <MenuItem
                as={Button}
                icon={<ScanEye />}
                onClick={onOpen}
                fontSize={"sm"}
                fontWeight={"medium"}
                _hover={{
                    bg: "gray.100",
                    borderColor: "transparent"
                }}
                _focus={{
                    outline: "none"
                }}
            >
                Visualizar reporte
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Box display={"flex"} alignItems={"center"} gap={2}>
                            <Image
                                src={logoAv}
                                alt="Avianca Logo"
                                boxSize="34px"
                                bg={"black"}
                                color={"white"}
                                borderRadius={"md"}
                            />
                            Avianca Playwright Report
                        </Box>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box width={{ base: "100%" }}>
                            {
                                loadingReporteHTML ? (
                                    <Center height={"50vh"} display={"flex"} flexDirection={"column"}>
                                        <AnimatedLoader width={20} height={20} />
                                        <Box>Cargando reporte</Box>
                                    </Center>
                                ) : (
                                    <>
                                        {
                                            reporteHTML && <iframe
                                                ref={refIframe}
                                                title="Preview Report"
                                                srcDoc={reporteHTML}
                                                sandbox="allow-scripts allow-same-origin allow-popups"
                                                style={{ width: '100%', height: '50vh', border: 'none' }}
                                            />
                                        }
                                    </>
                                )
                            }
                            {errorLoadingReportHTML && (
                                <Center height={"50vh"} display={"flex"} flexDirection={"column"} gap={4}>
                                    <Bell size={80} />
                                    <Heading size={"md"}>
                                        No hay reporte asociado a este workflow
                                    </Heading>
                                </Center>
                            )}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={2}>
                            <Button
                                leftIcon={isLoadingReport ? <AnimatedLoader /> : <FolderDown />}
                                onClick={() => downloadReportPreview(workflowID)}
                                bg={"black"}
                                color={"white"}
                                _hover={{
                                    bg: "black"
                                }}
                                size={"sm"}
                            >
                                Descargar reporte
                            </Button>
                            <Button
                                leftIcon={<Bot />}
                                onClick={() => {
                                    const url = new URL(document.URL).origin;
                                    const urlChatAPA = url + "/chat-ai?workflowID=" + workflowID;
                                    console.log("urlchatapa: ", urlChatAPA);
                                    window.location.href = urlChatAPA;
                                }}
                                size={"sm"}
                                variant={"outline"}
                                _hover={{
                                    bg: "white",
                                    color: "black",
                                    border: "1px solid #000"
                                }}
                            >
                                Analizar con APA
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}