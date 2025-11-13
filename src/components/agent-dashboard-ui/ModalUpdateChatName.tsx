import { Button, Heading, HStack, Input, List, ListIcon, ListItem, MenuItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@chakra-ui/react";
import { Check, Pen, Pencil } from "lucide-react";
import React, { useState } from "react";
import { useTestStore } from "../../store/test-store";
import AviancaToast from "../../utils/AviancaToast";

export const ModalUpdateChatName = ({ conversationId }: { conversationId: string }) => {
    const { conversationsAPA, setConversationsAPA } = useTestStore();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newChatName, setNewChatName] = useState<string | undefined>(undefined);

    const handleChangeNameChat = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Enter" && !e.shiftKey) {

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
                    <ModalHeader>
                        <HStack>
                            <Pen />
                            <Heading fontWeight={700} fontSize={"xl"}> Cambia el nombre de chat</Heading>
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            _focus={{
                                boxShadow: "none",
                                borderColor: "gray.300"
                            }}
                            placeholder="analiza fallo del reporte, generación de imagenes, etc..."
                            onKeyDown={handleChangeNameChat}
                            autoFocus
                        />
                        <List mt={5}>
                            {
                                [
                                    "Cambia el nombre para identificarlo más fácilmente",
                                    "Ponle un nombre que te ayude a recordarlo después.",
                                    "Renombra este chat para mantener tu historial organizado"
                                ].map(e => (
                                    <ListItem fontSize={"sm"}>
                                        <ListIcon as={Check} color={"black"} />
                                        {e}
                                    </ListItem>
                                ))
                            }
                        </List>
                    </ModalBody>

                    <ModalFooter>
                        <Heading fontSize={"lg"}>
                            chatAPA
                        </Heading>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}