import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // можно оставить пустым
    },
  },
});

//npx cypress open --config-file cypress.config.mts
