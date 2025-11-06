import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { MoveDiagonal } from "lucide-react"

export default function PreviewImageGenerateAgent({ imageContent }: { imageContent: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen} size={"sm"} p={1}>
        <MoveDiagonal size={18}/>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Imagen Generada por APA</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"grid"} placeContent={"center"}>
            <Image
              src={`data:image/png;base64,${imageContent}`}
              alt='generate imagen agent'
              borderRadius='lg'
              maxHeight={450}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}