import { Button, Input, MenuItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@chakra-ui/react";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { useTestStore } from "../../store/test-store";
import AviancaToast from "../../utils/AviancaToast";

export const ModalChangeNameChat = ({ conversationId }: { conversationId: string }) => {
    const { conversationsAPA, setConversationsAPA } = useTestStore();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newChatName, setNewChatName] = useState<string | undefined>(undefined);

    const handleChangeNameChat = () => {

        if (!newChatName || newChatName.trim() === "") return;

        const indexConversationFound = conversationsAPA.findIndex(e => e.converdationId === conversationId);
        if (indexConversationFound === -1) return;

        setConversationsAPA(prev => {
            const index = prev.findIndex(e => e.converdationId === conversationId);
            prev[index].title = newChatName;
            return prev;
        })
        onClose();
        AviancaToast.success("Chat cambiado", {
            description: "El nombre del chat se ha cambiado con éxito"
        })
    }

    return (
        <>
            <MenuItem
                as={Button}
                icon={<Pencil size={15} />}
                _hover={{
                    borderColor: "transparent",
                    bg: "gray.100",
                    color: "black"
                }}
                _focus={{
                    outline: "none"
                }}
                onClick={onOpen}
                fontSize={12}
            >
                Cambiar el nombre
            </MenuItem>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Cambia el nombre de chat</ModalHeader>
                    <ModalBody>
                        <Input
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            bg={"black"}
                            color={"white"}
                            mr={3}
                            onClick={handleChangeNameChat}
                            size={"sm"}
                            _hover={{
                                bg: "gray.800",
                                color: "white",
                                borderColor: "transparent"
                            }}
                        >
                            <Save size={20} />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}