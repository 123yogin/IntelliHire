import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AvailableTests: React.FC = () => {
  const { tests } = useApp();
  const availableTests = tests.filter(t => t.isActive);

  if (!availableTests.length) {
    return <div className="text-center py-12 text-gray-600">No available tests at the moment.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>
      <div className="space-y-4">
        {availableTests.map(test => (
          <div key={test.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{test.title}</h2>
              <p className="text-gray-600 mt-1">{test.companyName}</p>
              <div className="flex items-center mt-2 space-x-6">
                <span className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-1" />{test.duration} min</span>
                <span className="flex items-center text-sm text-gray-500"><BookOpen className="w-4 h-4 mr-1" />{test.questions.length || 25} questions</span>
              </div>
            </div>
            <Link
              to={`/exam/${test.id}`}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Start Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableTests; 