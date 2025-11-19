import { Button, Heading, HStack, Input, List, ListIcon, ListItem, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure } from "@chakra-ui/react";
import { Check, Pen, Pencil } from "lucide-react";
import React, { useState } from "react";
import { ConversationService } from "../../firebase/firestore/services/conversation.service";
import AviancaToast from "../../utils/AviancaToast";

export const ModalUpdateChatName = ({ conversationId }: { conversationId: string }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newChatName, setNewChatName] = useState<string | undefined>(undefined);

    const handleChangeNameChat = async (e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key !== "Enter" || e.shiftKey) return;

        if (!newChatName || newChatName.trim() === "") return;

        if (!conversationId) return;

        try {

            await ConversationService.updateConversation(conversationId, {
                title: newChatName.trim()
            });

            onClose();
            AviancaToast.success("Chat cambiado", {
                description: "El nombre del chat se ha cambiado con éxito"
            });

        } catch (error) {
            console.error("Error cambiando nombre del chat:", error);
            AviancaToast.error("No se pudo cambiar el nombre del chat");
        }
    };

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