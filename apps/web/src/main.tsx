import "./styles/globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/root.layout.tsx";
import ReactDOM from "react-dom/client";
import React from "react";
import HomePage from "./pages/home/home.page.tsx";
import ChatPage from "./pages/chat/chat.page.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { element: <HomePage />, path: "/" },
      { element: <ChatPage />, path: "/chat/:id" },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
