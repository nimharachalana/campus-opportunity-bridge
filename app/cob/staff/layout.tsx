import StaffSidebar from "@/app/components/layout/StaffSidebar";

export default function StaffLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="flex h-full">
            <StaffSidebar />
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
}
