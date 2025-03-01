// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

const { defineConfig } = require("cypress");
const fs = require("fs-extra"); // ✅ Import fs-extra for file operations

module.exports = defineConfig({
  projectId: "svaivz",
  e2e: {
    baseUrl: "https://sweetshop.netlify.app",
    specPattern: "cypress/e2e/**/*.cy.js",
    chromeWebSecurity: false, // ✅ Disable Chrome security to bypass CORS issues

    setupNodeEvents(on, config) {
      // ✅ Task to save data as JSON
      on("task", {
        saveJSON(data) {
          fs.writeFileSync("cypress/fixtures/sweetsData.json", JSON.stringify(data, null, 2));
          return null; // Cypress tasks must return a value
        },

        // ✅ Task to log messages to the Cypress terminal
        log(message) {
          console.log(message);
          return null;
        }
      });

      return config;
    },
  },
});
