import Sidebar from "@/app/components/layout/Sidebar";
import NotificationBell from "@/app/components/layout/NotificationBell";
import ProfileMenu from "@/app/components/layout/ProfileMenu";
import SupportChatWidget from "@/app/components/layout/SupportChatWidget";

export default function StudentLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex bg-[#0b0f19] text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col max-h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-end px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <ProfileMenu />
                    </div>
                </header>
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8 pt-0">
                    {children}
                </main>

                {/* Global Support Widget */}
                <SupportChatWidget />
            </div>
        </div>
    );
}