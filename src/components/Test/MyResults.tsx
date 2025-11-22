import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyResults: React.FC = () => {
  const { results, tests } = useApp();

  // Since we removed student-specific logic for now, we display all results.
  // The results are sorted to show the most recent first.
  const myResults = results.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  if (myResults.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
        <p>You haven't completed any tests yet.</p>
        <Link to="/available-tests" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          View Available Tests
        </Link>
      </div>
    );
  }

  const getTestTitle = (testId: string) => {
    return tests.find(t => t.id === testId)?.title || 'Unknown Test';
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Results</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <ul className="space-y-4">
          {myResults.map(result => (
            <li key={result.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{getTestTitle(result.testId)}</h3>
                <p className="text-sm text-gray-600">Completed on: {new Date(result.generatedAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{result.percentage.toFixed(2)}%</p>
                <div className="flex items-center justify-end space-x-2 mt-1">
                  {result.status === 'pass' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyResults; 