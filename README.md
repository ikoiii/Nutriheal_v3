# Nutriheal

This repository contains the source code for the Nutriheal application, separated into a client and a server.

## Client

The `client` directory contains the frontend of the application, built with React and Vite.

### To run the client:

1.  Navigate to the `client` directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

### Client Dependencies:

*   **axios**: For making HTTP requests to the server.
*   **react**: The core React library for building user interfaces.
*   **react-dom**: Serves as the entry point to the DOM and server renderers for React.
*   **react-router-dom**: For handling routing within the application.

### Client Dev Dependencies:

*   **@vitejs/plugin-react**: Vite plugin for React.
*   **vite**: A modern frontend build tool that provides a faster and leaner development experience.
*   **eslint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
*   **tailwindcss**: A utility-first CSS framework for rapidly building custom designs.
*   **autoprefixer**: A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.
*   **postcss**: A tool for transforming CSS with JavaScript.

## Server

The `server` directory contains the backend of the application, built with Node.js and Express.

### To run the server:

1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Start the server: `npm start`

### Server Dependencies:

*   **@google/generative-ai**: The official Google Generative AI SDK for Node.js.
*   **bcrypt**: A library for hashing passwords.
*   **cors**: A Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
*   **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
*   **express**: A fast, unopinionated, minimalist web framework for Node.js.
*   **jsonwebtoken**: An implementation of JSON Web Tokens.
*   **multer**: A node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files.
*   **mysql2**: A MySQL client for Node.js with a focus on performance.
*   **node-fetch**: A light-weight module that brings the `window.fetch` API to Node.js.
*   **pdfreader**: A tool to extract text from PDF files.

### Server Dev Dependencies:

*   **nodemon**: A utility that will monitor for any changes in your source and automatically restart your server.