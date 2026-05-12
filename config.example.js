// config.js - API Configuration
// This file is gitignored for security. Copy this to config.js and add your tokens.

const config = {
    // Canvas API Configuration
    canvas: {
        // Get your access token from: https://learn.irvingisd.net/profile/settings
        // Or your school's Canvas instance: https://[school].instructure.com/profile/settings
        accessToken: 'YOUR_CANVAS_ACCESS_TOKEN_HERE',

        // Canvas instance URL (e.g., 'https://learn.irvingisd.net' for Irving ISD)
        baseUrl: 'https://learn.irvingisd.net'
    },

    // Other API configurations can go here
    // google: { ... },
    // etc: { ... }
};

module.exports = config;