import {
  Box,
  IconButton,
  Text,
  VStack,
  Input,
  Button,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import { useState } from "react";

// Components
import CreateTestFormComponent from "../CreateTestFormComponent/CreateTestFormComponent";
import TestListComponent from "../TestListComponent/TestListComponent";

// Services & Store
import { APAService } from "@/services/apa.services";
import { useTestStore } from "@/store/test-store";

// Constants
const NAVBAR_H = "63px";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

const CreateWorkflowBody: React.FC = () => {
  const DATA_TRANSFORM_PROMPT = (userInput: string) => `
Eres un transformador de texto a estructura de datos TypeScript.

Tu ÚNICA tarea es convertir el texto del usuario en un objeto que cumpla
ESTRICTAMENTE con el tipo TGenericCopys.

NO expliques nada.
NO agregues texto adicional.
NO uses markdown.
NO inventes datos.
NO agregues propiedades nuevas.
NO incluyas propiedades no listadas.
DEVUELVE SOLO CÓDIGO TYPESCRIPT VÁLIDO.

════════════════════════════════════
BLOQUE BASE (SIEMPRE OBLIGATORIO)
════════════════════════════════════

Estas propiedades DEBEN estar SIEMPRE presentes y NO pueden modificarse:

{
  id: "test-1-es",
  targetPage: "seat",
  targetMethod: "none",
  homeIdioma: "es",
  position: "CO",
  description: ""
}

════════════════════════════════════
PROPIEDADES OPCIONALES PERMITIDAS
(SOLO SE INCLUYEN SI EL USUARIO LAS MENCIONA)
════════════════════════════════════

homePassengerAdults?: number
homePassengerYouths?: number
homePassengerChildren?: number
homePassengerInfant?: number

homeCiudadOrigen?: string
homeCiudadDestino?: string

homeisActiveOptionOutbound?: "true" | "false"

homeFechaSalida?: string
homeFechaLlegada?: string

bookingNumeroVueloIda?: string
bookingNumeroVueloRegreso?: string
bookingTarifaIda?: "light" | "classic" | "flex" | "business"
bookingTarifaVuelta?: "light" | "classic" | "flex" | "business"

servicesEquipajeManoBodega?: boolean
servicesEquipajeDeportivo?: boolean
servicesAbordajePrioritario?: boolean
servicesAviancaLounges?: boolean
servicesAsistenciaEspecial?: boolean
servicesAsistenciaViaje?: boolean

════════════════════════════════════
REGLAS DE INCLUSIÓN
════════════════════════════════════

1. SOLO puedes usar las propiedades listadas arriba.
2. NO puedes crear propiedades nuevas.
3. Si el usuario NO menciona una propiedad → NO la incluyas.
4. NO incluyas propiedades con valores por defecto (0, false, "", null).
5. NO completes datos faltantes.
6. NO infieras información implícita.
7. NO transformes datos que el usuario no pidió.

════════════════════════════════════
REGLAS DE CIUDADES (OBLIGATORIAS)
════════════════════════════════════

homeCiudadOrigen y homeCiudadDestino SOLO pueden ser códigos IATA.

Mapeo permitido:
Bogotá → BOG
Medellín → MDE
Ciudad de México → CMX
Cali → CLO
Barranquilla → BAQ
Cartagena → CTG
Santa Marta → SMR
Miami → MIA
Madrid → MAD

Si la ciudad NO está en el mapeo → NO incluyas la propiedad.

════════════════════════════════════
FORMATO DE SALIDA (OBLIGATORIO)
════════════════════════════════════

La respuesta DEBE tener EXACTAMENTE esta forma:

import { TGenericCopys } from "../copys";

const tests: TGenericCopys[] = [
  {
    id: "test-1-es",
    targetPage: "seat",
    targetMethod: "none",
    homeIdioma: "es",
    position: "CO",
    description: "",
    // SOLO propiedades opcionales que el usuario haya mencionado
  }
];

export { tests };

════════════════════════════════════
TEXTO DEL USUARIO
════════════════════════════════════

"${userInput}"
`;


  const { dashboardDataAgentAvianca } = useTestStore();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "👋 Hola, ¿listo para hacer una prueba automática?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!dashboardDataAgentAvianca) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Aún no hay datos del dashboard para analizar." },
      ]);
      return;
    }

    const userText = inputValue;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInputValue("");

    // 2️⃣ Placeholder del bot (para streaming)
    let botIndex = -1;
    setMessages((prev) => {
      botIndex = prev.length;
      return [...prev, { role: "bot", text: "" }];
    });

    try {
      // 🔥 MISMA IA, MISMO PROMPT, MISMO CONTEXTO
      const stream = await APAService.generateContentDashboard(
        JSON.stringify(dashboardDataAgentAvianca),
        DATA_TRANSFORM_PROMPT(userText)
      );


      let currentText = "";

      for await (const chunk of stream) {
        if (!chunk) continue;

        currentText += chunk;

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === botIndex ? { ...msg, text: currentText } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === botIndex
            ? { ...msg, text: "⚠️ Error al contactar la IA" }
            : msg
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box display="flex" flexDirection="column" position="relative">
      {/* CONTENIDO PRINCIPAL */}
      <Box
        minH={`calc(100dvh - ${NAVBAR_H})`}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={{ base: 4, lg: 0 }}
      >
        <Box
          w={{ base: "unset", lg: "100%" }}
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          columnGap="5rem"
          rowGap="2rem"
        >
          <Box m={{ base: "0 1rem", lg: "0" }}>
            <CreateTestFormComponent />
          </Box>
          <Box m={{ base: "0 1rem", lg: "0" }}>
            <TestListComponent />
          </Box>
        </Box>
      </Box>

      {/* BOTÓN CHATBOT */}
      <IconButton
        aria-label="Abrir asistente"
        icon={<ChatIcon />}
        position="fixed"
        bottom="24px"
        right="24px"
        borderRadius="full"
        size="lg"
        bg="#FF0000"
        border="1px solid #FF0000"
        color="white"
        _hover={{ bg: "#cc0000" }}
        _active={{ bg: "#b30000" }}
        boxShadow="lg"
        onClick={() => setIsChatOpen(true)}
      />

      {/* CHAT */}
      {isChatOpen && (
        <Box
          position="fixed"
          bottom="90px"
          right="24px"
          w="320px"
          h="420px"
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            p={3}
            bg="#FF0000"
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderTopRadius="lg"
          >
            <Text fontWeight="bold">Asistente virtual</Text>
            <IconButton
              aria-label="Cerrar chat"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setIsChatOpen(false)}
            />
          </Box>

          {/* MENSAJES */}
          <VStack
            flex="1"
            p={3}
            spacing={2}
            align="stretch"
            overflowY="auto"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                bg={msg.role === "user" ? "#FF0000" : "gray.100"}
                color={msg.role === "user" ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="md"
                maxW="85%"
                fontSize="sm"
              >
                {msg.text}
              </Box>
            ))}
          </VStack>

          {/* INPUT */}
          <Box p={3} borderTop="1px solid" borderColor="gray.200">
            <Input
              placeholder="Escribe tu mensaje..."
              size="sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              mt={2}
              size="sm"
              bg="#FF0000"
              border="#FF0000"
              color="white"
              w="100%"
              onClick={sendMessage}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateWorkflowBody;
