import Link from 'next/link'

export default function StaffSidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Staff Panel</h2>
            <nav className="flex flex-col gap-2">
                <Link 
                    href="/cob/staff/submit" 
                    className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    Submit Reviews
                </Link>
                <Link 
                    href="/cob/staff/user-manage"
                    className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    User Management
                </Link>
            </nav>
        </div>
    );   
}
