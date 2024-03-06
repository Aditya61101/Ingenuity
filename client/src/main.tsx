import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from './components/theme-provider.tsx';
//routes
import LandingPage from './routes/landing/page.tsx';
import Dashboard from './routes/dashboard/main/page.tsx';
import SignInPage from './routes/auth/sign-in/page.tsx';
import SignUpPage from './routes/auth/sign-up/page.tsx';
import Code from './routes/dashboard/code/page.tsx';
import Conversation from './routes/dashboard/conversation/page.tsx';
import Image from './routes/dashboard/image/page.tsx';
import Music from './routes/dashboard/music/page.tsx';
import Video from './routes/dashboard/video/page.tsx';
import Settings from './routes/dashboard/settings/page.tsx';
//layouts
import RootLayout from './layouts/root-layout.tsx';
import DashboardLayout from './layouts/dashboard-layout.tsx';
//react-redux
import { Provider } from 'react-redux'
import { store } from './store/index.ts';

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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
)
