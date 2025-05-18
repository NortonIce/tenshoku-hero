import { Application } from "@/types/Application";
import { useState, useEffect } from "react";
import Modal from "./Modal";

type ApplicationStatus = Application['status'];

interface EditApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (application: Application) => void;
    application: Application | null;
}

export default function EditApplicationModal({ isOpen, onClose, onSubmit, application }: EditApplicationModalProps) {
    const [editedApplication, setEditedApplication] = useState<Application | null>(null);

    useEffect(() => {
        if (application) {
            setEditedApplication({
                ...application,
                position: application.position || '',
                recruiter: application.recruiter || '',
                resume: application.resume || '',
                coverLetter: application.coverLetter || ''
            });
        }
    }, [application]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedApplication) {
            onSubmit(editedApplication);
        }
    };

    if (!editedApplication) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Application"
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                        type="text"
                        value={editedApplication.company}
                        onChange={(e) => setEditedApplication({...editedApplication, company: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                        type="text"
                        value={editedApplication.position}
                        onChange={(e) => setEditedApplication({...editedApplication, position: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Site</label>
                    <input
                        type="text"
                        value={editedApplication.jobSite}
                        onChange={(e) => setEditedApplication({...editedApplication, jobSite: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recruiter</label>
                    <input
                        type="text"
                        value={editedApplication.recruiter || ''}
                        onChange={(e) => setEditedApplication({...editedApplication, recruiter: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Application Date</label>
                    <input
                        type="date"
                        value={editedApplication.applicationDate.split('T')[0]}
                        onChange={(e) => setEditedApplication({...editedApplication, applicationDate: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={editedApplication.status}
                        onChange={(e) => setEditedApplication({...editedApplication, status: e.target.value as ApplicationStatus})}
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
                        value={editedApplication.resume || ''}
                        onChange={(e) => setEditedApplication({...editedApplication, resume: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                    <textarea
                        value={editedApplication.coverLetter || ''}
                        onChange={(e) => setEditedApplication({...editedApplication, coverLetter: e.target.value})}
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
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
} 