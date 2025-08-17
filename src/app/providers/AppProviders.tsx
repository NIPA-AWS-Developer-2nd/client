import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "../../shared/styles";
import { ThemeProvider, AlertProvider } from "../../shared/components/common";
import { NotificationProvider } from "../../shared/components/NotificationProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AlertProvider>
        <NotificationProvider>
          <GlobalStyle />
          <Router>
            {children}
          </Router>
        </NotificationProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};