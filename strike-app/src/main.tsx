import React from 'react'
import {createRoot} from 'react-dom/client'
import {createTheme, ThemeProvider} from "@mui/material";
import "./main.scss";
import Home from "./components/pages/Home/Home";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import NotFound from "./components/pages/NotFound/NotFound";

const Theme = createTheme({
    palette: {
        primary: {
            main: "#000000"
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root > .MuiInputBase-input': {
                        height: '30px',
                    }
                },
            },
        },
    },
})

const REACT_ROUTER_DOM = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

createRoot(document.getElementById("root") as Element).render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
        <RouterProvider router={REACT_ROUTER_DOM} />
    </ThemeProvider>
  </React.StrictMode>,
)
