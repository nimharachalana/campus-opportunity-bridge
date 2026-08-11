import AdminSidebar from "@/app/components/layout/AdminSidebar";

export default function AdminLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="flex h-full">
            <AdminSidebar />
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
}
