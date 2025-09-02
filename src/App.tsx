import { Button, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import './App.css';
import { executeWorkflow } from './github';

const App = () => {

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleWorkflow = useCallback(async () => {

    try {
      setLoading(true)
      await executeWorkflow();
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
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <div>
      <h1>Pruebas de workflows en Github</h1>
      <Button 
        colorScheme='teal' 
        onClick={handleWorkflow}
        isLoading={loading}
      >
        Ejecutar Workflows
      </Button>
    </div>
  )
}

export default App