import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import theme from './utils/utils.ts'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </ChakraProvider>
)
