// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:8000',
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 4000,
        requestTimeout: 5000,
        responseTimeout: 5000,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        }
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack'
        }
    }
});
