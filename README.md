# ghg-worldbank-frontend

# Frontend Setup

This README provides instructions on how to set up and run the React+Vite project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/aptopspeed/ghg-worldbank-frontend.git
   cd ghg-worldbank-frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

## Running the Development Server

To start the development server:

```
npm run dev
```

This command will start the Vite development server. By default, it will run on `http://localhost:5173`.

You should see output similar to this:

```
  VITE v[version]  ready in [time] ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Your default web browser should open automatically. If it doesn't, you can manually open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

If you need to change the default port or add other Vite configurations, you can do so in the `vite.config.js` file.

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed correctly (`npm install`).
2. Check that you're using a compatible version of Node.js.
3. Clear your browser cache or try in an incognito/private window.
4. Make sure no other process is using port 5173.