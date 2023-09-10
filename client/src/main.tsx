import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles.css'
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
          <App />
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
