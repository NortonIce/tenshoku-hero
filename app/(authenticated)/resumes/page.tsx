import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resumes | Tenshoku Hero',
  description: 'Manage your resumes and CVs',
};

export default function ResumesPage() {
  return (
    <div className="p-6">
      

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No resumes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new resume.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 