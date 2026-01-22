import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";


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


type RequiredTestData = {
  testName: string;
  targetPage: string;
  targetMethod: string;
  homeIdioma: string;
  position: string;
  description: string;
};


const CreateWorkflowBody: React.FC = () => {
  const DATA_TRANSFORM_PROMPT = (userInput: string) => `
Eres un transformador de texto a estructura de datos TypeScript.


Tu ÚNICA tarea es convertir el texto del usuario en uno o más objetos que cumplan
ESTRICTAMENTE con el tipo TGenericCopys.


NO expliques nada.
NO agregues texto adicional.
NO uses markdown.
NO inventes datos.
NO agregues propiedades nuevas.
NO incluyas propiedades no listadas.
DEVUELVE SOLO CÓDIGO TYPESCRIPT VÁLIDO.


════════════════════════════════════
DATOS OBLIGATORIOS QUE DEBES EXTRAER
════════════════════════════════════


DEBES extraer del texto del usuario los siguientes datos OBLIGATORIOS:


1. id (nombre de la prueba): Cualquier texto que el usuario proporcione como nombre/identificador
  - Si el usuario dice "prueba 1", "test 1", etc., usa exactamente ese formato
  - Normaliza espacios: "prueba 1" → "prueba-1" o mantén el formato original si es claro


2. targetPage: Debe ser uno de: "home", "booking", "passenger", "seat", "services"
  - Acepta variaciones: Home/Inicio, Booking/Reserva, Passenger/Pasajero, Seat/Asiento, Services/Servicio
  - Normaliza a minúsculas: home, booking, passenger, seat, services


3. targetMethod: Método objetivo mencionado por el usuario
  - Si menciona "seleccionar origen" → usa "homeSeleccionarOrigen"
  - Si menciona "seleccionar destino" → usa "homeSeleccionarDestino"
  - Mantén el formato camelCase cuando sea apropiado
  - Si el usuario dice "método de seleccionar origen" o similar, extrae la parte relevante


4. homeIdioma: Debe ser uno de: "es", "en", "pt", "fr"
  - Acepta variaciones: Español/Spanish/es, Inglés/English/en, Portugués/Portuguese/pt, Francés/French/fr
  - Normaliza a: es, en, pt, fr


5. position: Cualquier código de país (ej: CO, CL, MX)
  - Extrae códigos de país mencionados explícitamente


6. description: Texto descriptivo completo
  - Si el usuario dice "es una prueba general", incluye el texto completo
  - Si menciona detalles del vuelo (origen-destino), inclúyelos en la descripción
  - Genera descripciones descriptivas basadas en lo que el usuario menciona


════════════════════════════════════
DATOS OPCIONALES QUE DEBES EXTRAER
════════════════════════════════════


SI el usuario menciona estos datos, DEBES incluirlos:


- Pasajeros:
 * "un pasajero adulto" o "1 adulto" → homePassengerAdults: 1
 * "un niño" o "1 niño" o "un menor" → homePassengerChildren: 1
 * "un joven" o "1 joven" → homePassengerYouths: 1
 * "un bebé" o "1 bebé" o "un infante" → homePassengerInfant: 1


- Ciudades de vuelo:
 * "Bogotá a Medellín" o "BOG a MDE" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
 * "de Bogotá a Medellín" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
 * "vuelo de Bogotá a Medellín" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
 * Usa el mapeo de ciudades para convertir nombres a códigos IATA


⚠️ REGLAS CRÍTICAS:
- Si el usuario menciona ciudades de origen y destino, DEBES incluirlas como homeCiudadOrigen y homeCiudadDestino
- Si el usuario menciona pasajeros, DEBES incluirlos con los números correctos
- NO inventes datos que el usuario no haya mencionado
- NO uses valores genéricos como "hola", "test", "prueba" a menos que el usuario los especifique explícitamente
- SOLO extrae datos que el usuario haya proporcionado explícitamente o que puedas inferir claramente del contexto


════════════════════════════════════
DETECCIÓN DE MÚLTIPLES PRUEBAS
════════════════════════════════════


DEBES analizar el texto del usuario para determinar si solicita MÚLTIPLES pruebas.


Indicadores de múltiples pruebas:
- Números explícitos: "2 pruebas", "3 tests", "crea 5 pruebas"
- Enumeración: "prueba 1 y prueba 2", "primera prueba... segunda prueba"
- Listas: "una prueba de... otra prueba de...", "prueba A y prueba B"
- Separadores: "también", "además", "y otra", "y también"


Si detectas múltiples pruebas:
- Genera UN OBJETO por cada prueba solicitada
- Cada objeto debe tener un id único: "test-1-es", "test-2-es", etc.
- Cada objeto puede tener propiedades diferentes según lo que el usuario especifique para cada prueba


Si NO detectas indicadores de múltiples pruebas:
- Genera UN SOLO objeto con id único


════════════════════════════════════
BLOQUE BASE (SIEMPRE OBLIGATORIO)
════════════════════════════════════


Estas propiedades DEBEN estar SIEMPRE presentes en CADA objeto:


{
 id: "valor-extraído-del-usuario",  // Para múltiples pruebas: "valor-1", "valor-2", etc.
 targetPage: "home|booking|passenger|seat|services",  // Normalizado a minúsculas
 targetMethod: "valor-extraído-del-usuario",
 homeIdioma: "es|en|pt|fr",  // Normalizado
 position: "valor-extraído-del-usuario",
 description: "valor-extraído-del-usuario"
}


IMPORTANTE:
- Cada objeto en el array debe tener un id único y secuencial.
- TODAS estas propiedades son OBLIGATORIAS y deben estar presentes.


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
3. Para propiedades OPCIONALES (pasajeros, ciudades, fechas, etc.):
  - SI el usuario las menciona → DEBES incluirlas
  - Si el usuario dice "Bogotá a Medellín" → INCLUYE homeCiudadOrigen y homeCiudadDestino
  - Si el usuario dice "un adulto y un niño" → INCLUYE homePassengerAdults y homePassengerChildren
  - NO las omitas si el usuario las menciona explícitamente
4. NO incluyas propiedades con valores por defecto (0, false, "", null).
5. NO completes datos faltantes para propiedades opcionales que el usuario NO mencionó.
6. SÍ puedes inferir información clara del contexto (ej: "Bogotá a Medellín" claramente indica origen y destino).
7. NO transformes datos que el usuario no pidió.
8. Si hay múltiples pruebas, cada una puede tener propiedades diferentes según lo que el usuario especifique.


════════════════════════════════════
REGLAS DE CIUDADES (IMPORTANTE)
════════════════════════════════════


homeCiudadOrigen y homeCiudadDestino SOLO pueden ser códigos IATA.


Mapeo permitido (DEBES usar estos códigos):
Bogotá / Bogota → BOG
Medellín / Medellin → MDE
Ciudad de México / Mexico City / CMX → CMX
Cali → CLO
Barranquilla → BAQ
Cartagena → CTG
Santa Marta → SMR
Miami → MIA
Madrid → MAD


REGLAS DE EXTRACCIÓN:
- Si el usuario dice "Bogotá a Medellín" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
- Si el usuario dice "de Bogotá a Medellín" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
- Si el usuario dice "vuelo de Bogotá a Medellín" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
- Si el usuario dice "BOG a MDE" → homeCiudadOrigen: "BOG", homeCiudadDestino: "MDE"
- SIEMPRE convierte nombres de ciudades a códigos IATA usando el mapeo
- Si la ciudad NO está en el mapeo → NO incluyas la propiedad


════════════════════════════════════
FORMATO DE SALIDA (OBLIGATORIO)
════════════════════════════════════


La respuesta DEBE tener EXACTAMENTE esta forma:


Para UNA sola prueba:
import { TGenericCopys } from "../copys";


const tests: TGenericCopys[] = [
 {
   id: "valor-extraído",
   targetPage: "home",
   targetMethod: "homeSeleccionarOrigen",  // Normaliza métodos como "seleccionar origen" a "homeSeleccionarOrigen"
   homeIdioma: "es",
   position: "CO",
   description: "Descripción completa extraída del texto del usuario",
   // INCLUYE propiedades opcionales SI el usuario las menciona:
   // homeCiudadOrigen: "BOG",  // Si menciona origen
   // homeCiudadDestino: "MDE",  // Si menciona destino
   // homePassengerAdults: 1,    // Si menciona adultos
   // homePassengerChildren: 1,  // Si menciona niños
   // etc.
 }
];


export { tests };


Para MÚLTIPLES pruebas:
import { TGenericCopys } from "../copys";


const tests: TGenericCopys[] = [
 {
   id: "valor-1",
   targetPage: "home",
   targetMethod: "valor-extraído",
   homeIdioma: "es",
   position: "CO",
   description: "valor-extraído",
   // Propiedades específicas de la primera prueba
 },
 {
   id: "valor-2",
   targetPage: "home",
   targetMethod: "valor-extraído",
   homeIdioma: "es",
   position: "CO",
   description: "valor-extraído",
   // Propiedades específicas de la segunda prueba
 },
 // ... más objetos si hay más pruebas
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
      text: "👋 Hola, estoy listo para crear pruebas automáticas. Por favor, proporciona la siguiente información en tu mensaje:\n\n📋 Datos obligatorios:\n• Nombre de la prueba (id)\n• Página objetivo (home, booking, passenger, seat, services)\n• Método objetivo (ej: seleccionar origen)\n• Idioma (español/inglés/portugués/francés o es/en/pt/fr)\n• País (código como CO, CL, MX)\n• Descripción\n\n📋 Datos opcionales (se incluirán si los mencionas):\n• Ciudades de vuelo (ej: Bogotá a Medellín)\n• Pasajeros (ej: 1 adulto y 1 niño)\n• Fechas de salida/llegada\n• Otros datos específicos de la prueba\n\nPuedes escribir todo en un solo mensaje y yo extraeré la información necesaria.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");


  // Función para normalizar la página objetivo
  const normalizeTargetPage = (input: string): string => {
    const normalized = input.toLowerCase().trim();

    // Mapeo de variaciones en inglés y español
    const pageMap: Record<string, string> = {
      // home
      "home": "home",
      "inicio": "home",
      "principal": "home",
      // booking
      "booking": "booking",
      "reserva": "booking",
      "reservas": "booking",
      "reservación": "booking",
      "reservaciones": "booking",
      // passenger
      "passenger": "passenger",
      "pasajero": "passenger",
      "pasajeros": "passenger",
      // seat
      "seat": "seat",
      "asiento": "seat",
      "asientos": "seat",
      "silla": "seat",
      "sillas": "seat",
      // services
      "service": "services",
      "services": "services",
      "servicio": "services",
      "servicios": "services",
    };


    return pageMap[normalized] || normalized;
  };


  // Función para normalizar el idioma
  const normalizeLanguage = (input: string): string => {
    const normalized = input.toLowerCase().trim();

    // Mapeo de variaciones
    const languageMap: Record<string, string> = {
      // Español
      "es": "es",
      "español": "es",
      "spanish": "es",
      "sp": "es",
      // Inglés
      "en": "en",
      "inglés": "en",
      "ingles": "en",
      "english": "en",
      "eng": "en",
      // Portugués
      "pt": "pt",
      "portugués": "pt",
      "portugues": "pt",
      "portuguese": "pt",
      // Francés
      "fr": "fr",
      "francés": "fr",
      "frances": "fr",
      "french": "fr",
    };


    return languageMap[normalized] || "";
  };


  // Función para extraer datos del código TypeScript generado
  const extractDataFromCode = (code: string): RequiredTestData | null => {
    try {
      // Buscar el array de tests
      const arrayMatch = code.match(/const tests:\s*TGenericCopys\[\]\s*=\s*\[([\s\S]*?)\];/);
      if (!arrayMatch) return null;


      const arrayContent = arrayMatch[1];

      // Buscar el primer objeto (o todos si hay múltiples)
      const objectMatches = arrayContent.match(/\{([\s\S]*?)\}/g);
      if (!objectMatches || objectMatches.length === 0) return null;


      // Extraer datos del primer objeto
      const firstObject = objectMatches[0];

      const extractValue = (key: string): string => {
        const regex = new RegExp(`${key}:\\s*["']([^"']+)["']`, 'i');
        const match = firstObject.match(regex);
        return match ? match[1] : "";
      };


      const id = extractValue("id");
      const targetPage = extractValue("targetPage");
      const targetMethod = extractValue("targetMethod");
      const homeIdioma = extractValue("homeIdioma");
      const position = extractValue("position");
      const description = extractValue("description");


      return {
        testName: id,
        targetPage: targetPage,
        targetMethod: targetMethod,
        homeIdioma: homeIdioma,
        position: position,
        description: description,
      };
    } catch (error) {
      console.error("Error al extraer datos del código:", error);
      return null;
    }
  };


  // Validar que todos los datos obligatorios estén completos y no sean genéricos
  const validateRequiredData = (
    data: RequiredTestData,
    userInput?: string
  ): { valid: boolean; missing: string[] } => {
    const normalizedPage = normalizeTargetPage(data.targetPage);
    const normalizedLang = normalizeLanguage(data.homeIdioma);
    const validPages = ["home", "booking", "passenger", "seat", "services"];
    const validLanguages = ["es", "en", "pt", "fr"];


    // Valores genéricos que indican que fueron inventados
    const genericValues = ["hola", "test", "prueba", "ejemplo", "example", "hello", "hi"];
    const userInputLower = userInput?.toLowerCase().trim() || "";


    const missing: string[] = [];


    // Validar id (testName)
    if (!data.testName || data.testName.trim() === "") {
      missing.push("Nombre de la prueba (id)");
    } else {
      // Detectar si el id es igual al input del usuario (inventado)
      if (userInputLower && data.testName.toLowerCase().trim() === userInputLower) {
        missing.push("Nombre de la prueba (id) - parece ser un valor genérico");
      } else if (genericValues.includes(data.testName.toLowerCase().trim())) {
        missing.push("Nombre de la prueba (id) - valor genérico no permitido");
      }
    }


    // Validar targetPage
    if (!data.targetPage || data.targetPage.trim() === "" || !validPages.includes(normalizedPage)) {
      missing.push("Página objetivo válida (home, booking, passenger, seat, services)");
    }


    // Validar targetMethod
    if (!data.targetMethod || data.targetMethod.trim() === "") {
      missing.push("Método objetivo");
    } else {
      // Detectar si el método es igual al input del usuario (inventado)
      if (userInputLower && data.targetMethod.toLowerCase().trim() === userInputLower) {
        missing.push("Método objetivo - parece ser un valor genérico");
      } else if (genericValues.includes(data.targetMethod.toLowerCase().trim())) {
        missing.push("Método objetivo - valor genérico no permitido");
      }
    }


    // Validar homeIdioma
    if (!data.homeIdioma || data.homeIdioma.trim() === "" || !validLanguages.includes(normalizedLang)) {
      missing.push("Idioma válido (es, en, pt, fr)");
    }


    // Validar position
    if (!data.position || data.position.trim() === "") {
      missing.push("País (position)");
    }


    // Validar description
    if (!data.description || data.description.trim() === "") {
      missing.push("Descripción");
    } else {
      // Detectar si la descripción es igual al input del usuario (inventado)
      if (userInputLower && data.description.toLowerCase().trim() === userInputLower) {
        missing.push("Descripción - parece ser un valor genérico");
      } else if (genericValues.includes(data.description.toLowerCase().trim())) {
        missing.push("Descripción - valor genérico no permitido");
      }
    }


    return {
      valid: missing.length === 0,
      missing,
    };
  };


  // Función para obtener la configuración de GitHub
  const getGitHubConfig = () => {
    try {
      let env: Record<string, string> = {};


      // Intentar acceder a import.meta.env (Vite)
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        env = (import.meta as any).env as Record<string, string>;
      }
      // Si no es Vite, intentar process.env (solo en SSR o Node)
      else if (typeof process !== 'undefined' && process.env) {
        env = process.env as Record<string, string>;
      }


      const config = {
        token: env.REACT_APP_GITHUB_TOKEN || env.VITE_GITHUB_TOKEN_CHAT || "",
        owner: env.REACT_APP_GITHUB_OWNER || env.VITE_GITHUB_OWNER || "",
        repo: env.REACT_APP_GITHUB_REPO || env.VITE_GITHUB_REPO || "",
        branch: env.REACT_APP_GITHUB_BRANCH || env.VITE_GITHUB_BRANCH || "main",
      };


      return config;
    } catch (error) {
      console.error("❌ Error al obtener configuración de GitHub:", error);
      return {
        token: "",
        owner: "",
        repo: "",
        branch: "main",
      };
    }
  };


  // Función para disparar GitHub Actions
  const triggerGitHubWorkflow = async (
    aiMessage: string,
    userMessage: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const config = getGitHubConfig();


      if (!config.token || !config.owner || !config.repo) {
        console.warn("⚠️ Configuración de GitHub incompleta.");
        return { success: false, error: "Configuración incompleta" };
      }


      if (!aiMessage || !userMessage) {
        console.warn("⚠️ Mensajes vacíos.");
        return { success: false, error: "Mensajes vacíos" };
      }


      const payload = {
        ref: "feat/ImplementacionSlack",
        inputs: {
          mensaje: aiMessage
        },
      };


      const url = `https://api.github.com/repos/${config.owner}/${config.repo}/actions/workflows/slack-trigger.yml/dispatches`;


      console.log("🚀 Disparando workflow...");
      console.log("📦 Payload:", JSON.stringify(payload, null, 2));


      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);


      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.token}`,
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });


      clearTimeout(timeoutId);
      const responseText = await response.text();


      console.log(`📥 Status: ${response.status} ${response.statusText}`);


      if (response.ok || response.status === 204) {
        console.log("✅ GitHub Actions disparado exitosamente!");
        return { success: true };
      } else {
        console.error("❌ Error:", response.status, responseText);
        return { success: false, error: `Error ${response.status}: ${responseText}` };
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.error("❌ Timeout");
        return { success: false, error: "Timeout" };
      }
      console.error("❌ Error:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  };


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


    // Placeholder del bot (para streaming)
    let botIndex = -1;
    setMessages((prev) => {
      botIndex = prev.length;
      return [...prev, { role: "bot", text: "" }];
    });


    try {
      // Llamada a la IA sin datos predefinidos - la IA debe extraerlos del texto
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


      // Extraer y validar datos del código generado
      const extractedData = extractDataFromCode(currentText);

      if (!extractedData) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "⚠️ Error: No se pudieron extraer los datos del código generado. Por favor, verifica que el código incluya todos los campos obligatorios."
          },
        ]);
        return;
      }


      // Validar datos extraídos (pasando el texto del usuario para detectar valores inventados)
      const validation = validateRequiredData(extractedData, userText);

      if (!validation.valid) {
        const missingList = validation.missing.join("\n• ");
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `❌ Error: Faltan o son inválidos los siguientes datos obligatorios:\n\n• ${missingList}\n\nPor favor, proporciona toda la información necesaria en tu mensaje. Los datos deben ser específicos y no valores genéricos.`
          },
        ]);
        return;
      }


      // Disparar GitHub Actions solo si los datos son válidos
      try {
        const result = await triggerGitHubWorkflow(currentText, userText);
        if (result.success) {
          console.log("✅ Workflow disparado exitosamente");
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "✅ Prueba validada y enviada exitosamente a GitHub Actions" },
          ]);
        } else {
          console.warn("⚠️ No se pudo disparar el workflow:", result.error);
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: `⚠️ Error al enviar la prueba: ${result.error}` },
          ]);
        }
      } catch (workflowError) {
        console.error("Error al disparar workflow:", workflowError);
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "⚠️ Error al enviar la prueba a GitHub Actions" },
        ]);
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
          w="400px"
          h="500px"
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
              placeholder="Escribe tu mensaje con todos los datos necesarios..."
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





