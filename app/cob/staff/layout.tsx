import StaffSidebar from "@/app/components/layout/StaffSidebar";

export default function StaffLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex bg-[#0b0f19] text-white">
            <StaffSidebar />
            <main className="flex-1 p-4 overflow-auto max-h-screen">
                {children}
            </main>
        </div>
    );
}
