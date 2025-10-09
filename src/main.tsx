import { ChakraProvider } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

//Components
import App from './App.tsx'

//Styles
import { Toaster } from 'sonner'
import './index.css'
import theme from './utils/theme.ts'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
      <Toaster />      
    </BrowserRouter>
  </ChakraProvider>
)