import Link from 'next/link'

export default function StaffSidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col gap-4 border-r border-zinc-800">
            <h2 className="text-xl font-bold mb-4 px-2 text-indigo-400">Staff Panel</h2>
            <nav className="flex flex-col gap-2">
                <Link 
                    href="/cob/staff/submit" 
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Post Opportunity
                </Link>
                <Link 
                    href="/cob/staff/applications" 
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Review Applicants
                </Link>
                <Link 
                    href="/cob/staff/user-manage"
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    User Management
                </Link>
            </nav>
        </div>
    );   
}
