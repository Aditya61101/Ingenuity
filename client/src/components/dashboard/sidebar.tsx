import { Link, useLocation } from "react-router-dom";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
// import { FreeCounter } from "@/components/free-counter";

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-sky-500"
    },
    {
        label: 'Conversation',
        icon: MessageSquare,
        href: '/dashboard/conversation',
        color: "text-violet-500",
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: "text-pink-700",
        href: '/dashboard/image',
    },
    {
        label: 'Video Generation',
        icon: VideoIcon,
        color: "text-orange-700",
        href: '/dashboard/video',
    },
    {
        label: 'Music Generation',
        icon: Music,
        color: "text-emerald-500",
        href: '/dashboard/music',
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: "text-green-700",
        href: '/dashboard/code',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
];

export const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link to="/" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        <img alt="Logo" src="/logo.png" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Ingenuity
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            to={route.href}
                            className={
                                `text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition
                                ${pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"}`
                            }
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      /> */}
        </div>
    );
};