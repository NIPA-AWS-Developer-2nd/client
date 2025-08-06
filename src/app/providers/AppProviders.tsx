import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "../../shared/styles";
import { ThemeProvider } from "../../shared/components/common";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        {children}
      </Router>
    </ThemeProvider>
  );
};