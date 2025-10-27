import { Box, Button, Center, Heading, Image, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Bell, ScanEye } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import logoAv from "../../assets/avianca-logo-desk.png";
import { getReportHTMLPreview } from "../../github/api";
import AnimatedLoader from "../loaders/AnimatedLoader";

interface PreviewReportProps {
    workflowID: number;
}

export default function PreviewReport({ workflowID }: PreviewReportProps) {

    const refIframe = useRef<HTMLIFrameElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [reporteHTML, setReporteHTML] = useState<string>("");
    const [loadingReporteHTML, setLoadingReporteHTML] = useState<boolean>(false);
    const [errorLoadingReporteHTML, setErrorLoadingReporteHTML] = useState<boolean>(false);

    const previewReporteHTML = useCallback(async (workflowId: number) => {
        try {
            setLoadingReporteHTML(true);
            const contentHTML = await getReportHTMLPreview(workflowId);
            setReporteHTML(contentHTML);
        }
        catch (error) {
            console.log("Error loading preview report: ", error);
            setErrorLoadingReporteHTML(true);
        } finally {
            setLoadingReporteHTML(false);
        }
    }, [workflowID]);

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
                    border: "2px solid #000000",
                    borderRadius: "md",
                    color: "black"
                }}
            >
                Visualizar reporte
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size={"8xl"} scrollBehavior="inside">
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
                    <ModalBody minHeight={"5xl"}>
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
                                            style={{ width: '100%', height: '60vh', border: 'none' }}
                                        />
                                    }
                                </>
                            )
                        }
                        {errorLoadingReporteHTML && (
                            <Center height={"50vh"} display={"flex"} flexDirection={"column"} gap={4}>
                                <Bell size={80} />
                                <Heading size={"md"}>
                                    No hay reporte asociado a este workflow
                                </Heading>
                            </Center>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}