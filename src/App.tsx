import { Button, useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import './App.css'
import { executeWorkflow } from './github'

const App = () => {

  const toast = useToast();

  const handleWorkflow = useCallback(async () => {

    try {
      console.log("Ejecutando workflow...");
      await executeWorkflow();
      console.log("Workflow ejecutado.");
      toast({
        title: "Workflow ejecutado.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al ejecutar el workflow:", error);
      toast({
        title: "Error al ejecutar el workflow.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [])

  return (
    <div>
      <h1>Pruebas de workflows en Github</h1>
      <Button colorScheme='teal' onClick={handleWorkflow}>Ejecutar Workflows</Button>
    </div>
  )
}

export default App