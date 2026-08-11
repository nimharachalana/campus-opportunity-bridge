import Link from 'next/link'

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Student Panel</h2>
            <nav className="flex flex-col gap-2">
                <Link 
                    href="/cob/student/profile" 
                    className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    Profile
                </Link>
                <Link 
                    href="/cob/student/applications" 
                    className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                    Applications
                </Link>
            </nav>
        </div>
    );   
}