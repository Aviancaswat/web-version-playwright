import { Button, Heading, HStack, Input, List, ListIcon, ListItem, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure } from "@chakra-ui/react";
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
                            <Heading fontWeight={700} fontSize={"xl"}> Nuevo nombre de chat</Heading>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton
                        _hover={{
                            borderColor: "transparent",
                            bg: "gray.100"
                        }}
                        _focus={{
                            outline: "none"
                        }}
                    />
                    <ModalBody>
                        <Input
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            _focus={{
                                boxShadow: "none",
                                borderColor: "gray.300"
                            }}
                            placeholder="preguntas sobre el reporte 12345..."
                            onKeyDown={handleChangeNameChat}
                            autoFocus
                        />
                        <Text fontSize={"sm"} color={"gray.500"}>
                            Presiona Enter para actualizar el nombre
                        </Text>
                        <List mt={5} bg={"gray.100"} p={2} borderRadius={"md"}>
                            <Heading fontSize={"sm"} fontWeight={800} mb={1}>
                                Sugerencias:
                            </Heading>
                            {
                                [
                                    "Cambia el nombre para identificarlo más fácilmente",
                                    "Ponle un nombre que te ayude a recordarlo después.",
                                    "Cambialo para mantener tu historial organizado"
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