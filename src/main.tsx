import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Components
import App from './App.tsx'

//Styles
import './index.css'
import theme from './utils/utils.ts'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </ChakraProvider>
)
