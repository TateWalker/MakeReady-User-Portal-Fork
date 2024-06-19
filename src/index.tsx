import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { light, dark } from "./styles/Theme";
import { ThemeProvider } from "styled-components";
import { MainProvider } from "./contexts/MainContext";

// Layouts
import HomeLayout from "./layouts/HomeLayout";
import SeriesLayout from "./layouts/SeriesLayout";
import MyPlaylistsLayout from "./layouts/MyPlaylistsLayout";
import AllSeriesLayout from "./layouts/AllSeriesLayout";
import PlaylistLayout from "./layouts/PlaylistLayout";
import VideoLayout from "./layouts/VideoLayout";
import GiveLayout from "./layouts/GiveLayout";
import AboutLayout from "./layouts/AboutLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import FeaturedLayout from "./layouts/FeaturedLayout";
import ErrorPageLayout from "./layouts/ErrorLayout";

// Reset SCSS
import "./index.css";
import "./components/styles/_reset.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  { path: "*", element: <ErrorPageLayout /> },
  {
    path: "/",
    element: <HomeLayout />,
  },
  {
    path: "/series",
    element: <AllSeriesLayout />,
  },
  {
    path: "/series/:id",
    element: <SeriesLayout />,
  },
  {
    path: "/my_playlists",
    element: <MyPlaylistsLayout />,
  },
  {
    path: "/playlist/:linkSlug",
    element: <PlaylistLayout />,
  },
  {
    path: "/video/:id",
    element: <VideoLayout />,
  },
  {
    path: "/give",
    element: <GiveLayout />,
  },
  {
    path: "/about",
    element: <AboutLayout />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
  },
  {
    path: "/profile",
    element: <ProfileLayout />,
  },
  {
    path: "/featured/:id",
    element: <FeaturedLayout />,
  },
]);

root.render(
  <React.StrictMode>
    <MainProvider>
      <ThemeProvider theme={dark}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </MainProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
