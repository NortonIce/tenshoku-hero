'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Application } from '@/app/types/Applications';
import AddApplicationModal from '@/app/components/AddApplicationModal';

export default function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/applications');
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
            setError(null);
        } catch (err) {
            setError('Failed to load applications. Please try again later.');
            console.error('Error fetching applications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddApplication = async (application: Omit<Application, 'id' | 'applicationDate' | 'createdAt'>) => {
        try {
            const newApplication = {
                ...application,
                id: crypto.randomUUID(),
                applicationDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            };

            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newApplication),
            });

            if (!response.ok) {
                throw new Error('Failed to add application');
            }

            const addedApplication = await response.json();
            setApplications(prev => [...prev, addedApplication]);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error adding application:', err);
            // You might want to show an error message to the user here
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="flex m-2 justify-between items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add new application
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex gap-6">
                {/* Applications list */}
                <div className="w-1/3 overflow-y-auto pr-4">
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                onClick={() => setSelectedApplication(application)}
                                className={`p-4 m-2 rounded-lg border cursor-pointer transition-all bg-white hover:bg-white shadow-lg hover:shadow-xl ${
                                    selectedApplication?.id === application.id
                                        ? 'border-blue-500 ring-2 ring-blue-500 bg-white shadow-xl'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold">{application.company}</h3>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                        application.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                                        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {application.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{application.jobSite}</p>
                                <p className="text-sm text-gray-500">
                                    Applied on {new Date(application.applicationDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details panel */}
                <div className="w-2/3 m-2 bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto shadow-2xl">
                    {selectedApplication ? (
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedApplication.company}</h2>
                                    <p className="text-gray-600">{selectedApplication.jobSite}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                        Edit
                                    </button>
                                    <button className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-1">Status</h3>
                                    <p className="text-gray-600">{selectedApplication.status}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Recruiter</h3>
                                    <p className="text-gray-600">{selectedApplication.recruiter}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Application Date</h3>
                                    <p className="text-gray-600">
                                        {new Date(selectedApplication.applicationDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Resume</h3>
                                    <p className="text-gray-600">{selectedApplication.resume}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Cover Letter</h3>
                                    <p className="text-gray-600">{selectedApplication.coverLetter}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select an application to view details
                        </div>
                    )}
                </div>
            </div>

            <AddApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddApplication}
            />
        </div>
    );
} 