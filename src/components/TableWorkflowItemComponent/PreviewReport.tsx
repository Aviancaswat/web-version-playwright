import { Button, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { ScanEye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getReportHTMLPreview } from "../../github/api";

interface PreviewReportProps {
    workflowID: number;
}

export default function PreviewReport({ workflowID }: PreviewReportProps) {

    const refIframe = useRef<HTMLIFrameElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [reporteHTML, setReporteHTML] = useState<string>("");
    const [loadingReporteHTML, setLoadingReporteHTML] = useState<boolean>(false);

    const previewReporteHTML = async (workflowId: number) => {
        setLoadingReporteHTML(true);
        const contentHTML = await getReportHTMLPreview(workflowId);

        const injectedScript = `
            <script>
            document.addEventListener('click', function(event) {
                let target = event.target;
                while (target && target.tagName !== 'A') {
                target = target.parentElement;
                }
                if (target && target.tagName === 'A') {
                const href = target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Es un enlace interno: evitar navegación que afecte padre
                    event.preventDefault();
                    window.location.hash = href;
                }
                }
            }, true);
            </script>
            `;
        const modifiedHtml = contentHTML.replace('</body>', `${injectedScript}</body>`);
        console.log("html content modified: ", modifiedHtml)
        setReporteHTML(modifiedHtml);
        setLoadingReporteHTML(false);
    };

    useEffect(() => {
        if (workflowID) {
            previewReporteHTML(workflowID);
        }
    }, [])

    useEffect(() => {
        const iframe = refIframe.current;
        if (!iframe) return;

        const onNavigation = (e: Event) => {
            e.preventDefault();
        };

        iframe.contentWindow?.addEventListener('beforeunload', onNavigation);

        return () => {
            iframe.contentWindow?.removeEventListener('beforeunload', onNavigation);
        };
    }, [reporteHTML]);


    return (
        <>
            <Button
                as={MenuItem}
                icon={<ScanEye />}
                onClick={onOpen}
            >
                Visualizar reporte
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            loadingReporteHTML ? (
                                <p>Cargando reporte...</p>
                            ) : (
                                <>
                                    {
                                        reporteHTML && <iframe
                                            ref={refIframe}
                                            title="Preview Report"
                                            srcDoc={reporteHTML}
                                            sandbox="allow-scripts allow-same-origin allow-popups"
                                            style={{ width: '100%', height: '80vh', border: 'none' }}
                                        />
                                    }
                                </>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}