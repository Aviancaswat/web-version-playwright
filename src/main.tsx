import { ChakraProvider } from '@chakra-ui/react'
import 'animate.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'
import theme from './utils/theme.ts'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
      <Toaster expand={true} closeButton/>      
    </BrowserRouter>
  </ChakraProvider>
)