import { Mail, Phone, MapPin, Clock, Building2 } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm flex flex-col gap-8">
                
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">We're here to help!</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        If you have any questions regarding opportunities, applications, or technical issues with the portal, 
                        feel free to reach out to our administration office using the details below.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* General Inquiry */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Email Us</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">For general inquiries and support.</p>
                            <a href="mailto:support@university.edu" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                                support@university.edu
                            </a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Call Us</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">Mon-Fri from 8am to 5pm.</p>
                            <a href="tel:+1234567890" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                +9470 403 9411
                            </a>
                        </div>
                    </div>

                    {/* Office */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Visit the Office</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">Come speak to us in person.</p>
                            <p className="text-slate-700 dark:text-slate-300 font-medium">
                                Career Services Dept.<br />
                                Building A, Room 204
                            </p>
                        </div>
                    </div>

                    {/* Chatbot hint */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Live Chat</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">Quick questions? Use our chat widget.</p>
                            <p className="text-slate-700 dark:text-slate-300 font-medium">
                                Click the teal button in the bottom right corner of your screen anytime!
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
