import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { GlobalStyles } from './design-system/theme/GlobalStyles'
import { theme } from './design-system/theme/theme'
import { BrowserRouter, Route, Routes } from 'react-router'
import {
  ResourceBasicInfo,
  ResourceDetails,
  ResourceOverview,
  ResourceProjectDetails,
  ResourcesList,
} from './components'
import { AppRoutes } from './routes'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
