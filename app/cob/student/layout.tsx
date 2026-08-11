import Sidebar from "@/app/components/layout/Sidebar";

export default function StudentLayout({ children }:{children: React.ReactNode}) {
    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
}