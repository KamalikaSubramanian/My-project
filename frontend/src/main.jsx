import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</BrowserRouter>
	</React.StrictMode>
);
// React = builds virtual components (like blueprints).ReactDOM = actually renders those blueprints into real HTML on the screen.
// ReactDOM is the package that connects React (JavaScript) to the real DOM (HTML page in browser).


// ReactDOM is the bridge between React components and the browser DOM.Without it, your <App /> would never show up in the actual webpage.

// <BrowserRouter> enables navigation between pages in your React app without refreshing the whole page.
// React.StrictMode is a development-only wrapper that enables extra checks and warnings (e.g., detecting unsafe lifecycles, deprecated APIs, and double-invoking certain functions to reveal side-effects).It does not affect production behavior; it helps you find bugs during development.

// ChakraProvider comes from Chakra UI. It provides the UI library’s context (theme, color mode, component defaults) to all Chakra components inside your app.

// Virtual DOM = React’s brain (decides what changed),Helps React calculate changes fast
// React DOM = A package/library- React’s hands (updates the real DOM),Applies the calculated changes to the real DOM
// No curly braces → importing the default export.
// Curly braces {} → importing a specific named export from many exports.