import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Test } from '../../types';
import EditTestModal from './EditTestModal';
import { Search, Edit, Trash2 } from 'lucide-react';

const AllTests: React.FC = () => {
  const { tests, deleteTest } = useApp();
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (testId: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      await deleteTest(testId);
    }
  };

  const filteredTests = useMemo(() => {
    if (!searchQuery) return tests;
    return tests.filter(test =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tests, searchQuery]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Tests</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Title</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Duration</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Created At</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.length > 0 ? (
                filteredTests.map(test => (
                  <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{test.title}</td>
                    <td className="py-4 px-6 text-gray-600">{test.description}</td>
                    <td className="py-4 px-6 text-gray-600">{test.duration} min</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{new Date(test.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => setEditingTest(test)} className="text-blue-600 hover:text-blue-800" title="Edit Test">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-800" title="Delete Test">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    {searchQuery ? 'No tests found matching your search.' : 'No tests available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingTest && <EditTestModal test={editingTest} onClose={() => setEditingTest(null)} />}
    </div>
  );
};

export default AllTests; 