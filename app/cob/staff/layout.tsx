import StaffSidebar from "@/app/components/layout/StaffSidebar";

export default function StaffLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex">
            <StaffSidebar />
            <main className="flex-1 p-4 overflow-auto max-h-screen">
                {children}
            </main>
        </div>
    );
}
