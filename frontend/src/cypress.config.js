const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    env: {
      apiUrl: process.env.CYPRESS_API_URL || "http://127.0.0.1:8000",
      loginPath: "/login"
    },
    video: false,
    chromeWebSecurity: false,
  },
});
