const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    env: {
      apiUrl: process.env.CYPRESS_API_URL || "http://127.0.0.1:8000",
      loginPath: "/login",
    },
    chromeWebSecurity: false,
    
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
  },

  
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    charts: true,
    reportPageTitle: "Relatório E2E",
    embeddedScreenshots: true,
    inlineAssets: true,      // gera um HTML auto-contido
    saveAllAttempts: false,
  },

  
  video: false,
  screenshotOnRunFailure: true,
});
