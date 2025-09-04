import { Box, Textarea } from "@chakra-ui/react";

const FormTest = () => {
    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Textarea
                placeholder={
                    "Ejemplo de JSON:\n" +
                    JSON.stringify([{
                        id: "Mi id de prueba",
                        description: "Mi descripcion de prueba",
                        homeCiudadOrigen: "BAQ",
                        homeCiudadDestino: "BOG",
                        targetPage: "home",
                        targetMethod: "homeSeleccionarFechaLlegada"
                    }], null, 2)
                }
                cols={50}
                rows={14}
                resize={"none"}
            />
        </Box>
    );
}

export default FormTest;