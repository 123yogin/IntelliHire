import React from 'react';
import { useApp } from '../../context/AppContext';

const MyTests: React.FC = () => {
  const { tests } = useApp();

  if (!tests.length) {
    return <div className="text-center py-12 text-gray-600">No tests found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Tests</h1>
      <div className="space-y-4">
        {tests.map(test => (
          <div key={test.id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">{test.title}</h2>
            <p className="text-gray-600 mt-1">{test.description}</p>
            <div className="flex items-center space-x-6 mt-4">
              <span className="text-sm text-gray-500">Duration: {test.duration} min</span>
              <span className="text-sm text-gray-500">Created: {test.createdAt.toLocaleString()}</span>
              <span className="text-sm text-gray-500">Active: {test.isActive ? 'Yes' : 'No'}</span>
            </div>
            {/* Questions List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions</h3>
              {Array.isArray(test.questions) && test.questions.length ? (
                <ol className="list-decimal ml-6 space-y-2">
                  {test.questions.map((q: any, idx: number) => (
                    <li key={q.id || idx} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                      <div className="flex-1">
                        <span className="font-medium">{q.question}</span>
                        <span className="ml-2 text-sm text-gray-500">({q.marks} marks)</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Type: {q.type || 'N/A'} | Topic: {q.topic || 'N/A'} | Difficulty: {q.difficulty || 'N/A'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-gray-500 text-sm">No questions found for this test.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTests; 