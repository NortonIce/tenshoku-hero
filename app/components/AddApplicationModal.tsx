import { Application } from "@/types/Application";
import { useState } from "react";

type ApplicationStatus = Application['status'];

interface AddApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (application: Omit<Application, 'id' | 'createdAt'>) => void;
}

export default function AddApplicationModal({ isOpen, onClose, onSubmit }: AddApplicationModalProps) {
    const [newApplication, setNewApplication] = useState({
        company: '',
        position: '',
        jobSite: '',
        recruiter: '',
        status: 'Applied' as ApplicationStatus,
        resume: '',
        coverLetter: '',
        applicationDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(newApplication);
        setNewApplication({
            company: '',
            position: '',
            jobSite: '',
            recruiter: '',
            status: 'Applied' as ApplicationStatus,
            resume: '',
            coverLetter: '',
            applicationDate: new Date().toISOString().split('T')[0]
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-[1px] rounded-xl shadow-lg w-full max-w-2xl mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Application</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                type="text"
                                value={newApplication.company}
                                onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Position</label>
                            <input
                                type="text"
                                value={newApplication.position}
                                onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Site</label>
                            <input
                                type="text"
                                value={newApplication.jobSite}
                                onChange={(e) => setNewApplication({...newApplication, jobSite: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Recruiter</label>
                            <input
                                type="text"
                                value={newApplication.recruiter}
                                onChange={(e) => setNewApplication({...newApplication, recruiter: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Application Date</label>
                            <input
                                type="date"
                                value={newApplication.applicationDate}
                                onChange={(e) => setNewApplication({...newApplication, applicationDate: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={newApplication.status}
                                onChange={(e) => setNewApplication({...newApplication, status: e.target.value as ApplicationStatus})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Take home assignment">Take home assignment</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Offer">Offer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Resume</label>
                            <input
                                type="text"
                                value={newApplication.resume}
                                onChange={(e) => setNewApplication({...newApplication, resume: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                            <textarea
                                value={newApplication.coverLetter}
                                onChange={(e) => setNewApplication({...newApplication, coverLetter: e.target.value})}
                                rows={4}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 