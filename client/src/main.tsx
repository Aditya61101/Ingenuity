import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from './components/theme-provider.tsx';
//routes
import { LandingPage, SignInPage, SignUpPage, Code, Conversation, Dashboard, Image, Music, Settings, Video } from './routes/index.ts';
//layouts
import RootLayout from './layouts/root-layout.tsx';
import DashboardLayout from './layouts/dashboard-layout.tsx';
//react-redux
import { Provider } from 'react-redux'
import { store } from './store/index.ts';
//loader for Suspense
import { Loader } from './components/loader.tsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/code", element: <Code /> },
          { path: "/dashboard/conversation", element: <Conversation /> },
          { path: "/dashboard/image", element: <Image /> },
          { path: "/dashboard/music", element: <Music /> },
          { path: "/dashboard/video", element: <Video /> },
          { path: "/dashboard/settings", element: <Settings /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);