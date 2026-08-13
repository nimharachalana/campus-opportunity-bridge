import Sidebar from "@/app/components/layout/Sidebar";
import NotificationBell from "@/app/components/layout/NotificationBell";
import ProfileMenu from "@/app/components/layout/ProfileMenu";
import SupportChatWidget from "@/app/components/layout/SupportChatWidget";

export default function StudentLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#020617] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shrink-0 flex items-center justify-end px-8">
                    <NotificationBell />
                    <ProfileMenu />
                </header>
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto w-full h-full">
                        {children}
                    </div>
                </main>

                {/* Floating Support Chat */}
                <SupportChatWidget />
            </div>
        </div>
    );
}