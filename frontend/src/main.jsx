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
// ReactDOM is the package that connects React (JavaScript) to the real DOM (HTML page in browser).React itself is just a UI library that builds virtual components.To actually show them on the screen, React needs a way to mount into the DOM tree → that’s what ReactDOM does.

// ReactDOM is the bridge between React components and the browser DOM.Without it, your <App /> would never show up in the actual webpage.

// <BrowserRouter> enables navigation between pages in your React app without refreshing the whole page.