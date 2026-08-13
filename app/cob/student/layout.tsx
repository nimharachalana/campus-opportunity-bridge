import Sidebar from "@/app/components/layout/Sidebar";
import NotificationBell from "@/app/components/layout/NotificationBell";
import ProfileMenu from "@/app/components/layout/ProfileMenu";
import SupportChatWidget from "@/app/components/layout/SupportChatWidget";

export default function StudentLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto max-h-screen">
                {children}
            </main>
        </div>
    );
}