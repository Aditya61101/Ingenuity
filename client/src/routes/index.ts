import { lazy } from 'react';

const LandingPage = lazy(() => import('./landing/page.tsx'));
const Dashboard = lazy(() => import('./dashboard/main/page.tsx'));
const SignInPage = lazy(() => import('./auth/sign-in/page.tsx'));
const SignUpPage = lazy(() => import('./auth/sign-up/page.tsx'));
const Code = lazy(() => import('./dashboard/code/page.tsx'));
const Conversation = lazy(() => import('./dashboard/conversation/page.tsx'));
const Image = lazy(() => import('./dashboard/image/page.tsx'));
const Music = lazy(() => import('./dashboard/music/page.tsx'));
const Video = lazy(() => import('./dashboard/video/page.tsx'));
const Settings = lazy(() => import('./dashboard/settings/page.tsx'));

export {
    LandingPage,
    Dashboard,
    SignInPage,
    SignUpPage,
    Code,
    Conversation,
    Image,
    Music,
    Video,
    Settings
};