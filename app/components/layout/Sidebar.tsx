import Link from 'next/link'

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col gap-4 border-r border-zinc-800">
            <h2 className="text-xl font-bold mb-4 px-2 text-blue-400">Student Panel</h2>
            <nav className="flex flex-col gap-2">
                <Link 
                    href="/cob/student/profile" 
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Profile & Password
                </Link>
                <Link 
                    href="/cob/student/opportunities" 
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    Browse Opportunities
                </Link>
                <Link 
                    href="/cob/student/applications" 
                    className="px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium"
                >
                    My Applications
                </Link>
            </nav>
        </div>
    );   
}