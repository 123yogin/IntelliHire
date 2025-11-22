import { Download, Eye, Filter, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Results: React.FC = () => {
  const { results, tests, students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail' | 'under-review'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'percentage'>('date');

  // Filter and sort results
  const filteredResults = results
    .filter(result => {
      const test = tests.find(t => t.id === result.testId);
      const student = students.find(s => s.id === result.studentId);
      const matchesSearch = 
        test?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
        case 'score':
          return b.score - a.score;
        case 'percentage':
          return b.percentage - a.percentage;
        default:
          return 0;
      }
    });

  const downloadAllResults = () => {
    const reportContent = generateAllResultsReport();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-exam-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateAllResultsReport = () => {
    const timestamp = new Date().toLocaleString();
    let report = `ALL EXAM RESULTS REPORT\n`;
    report += `Generated on: ${timestamp}\n`;
    report += `Total Results: ${filteredResults.length}\n`;
    report += `==========================================\n\n`;

    filteredResults.forEach((result, index) => {
      const test = tests.find(t => t.id === result.testId);
      const student = students.find(s => s.id === result.studentId);
      
      report += `RESULT ${index + 1}\n`;
      report += `==========================================\n`;
      report += `Student: ${student?.name || 'Unknown'} (${student?.enrollmentNumber || 'N/A'})\n`;
      report += `Test: ${test?.title || 'Unknown Test'}\n`;
      report += `Score: ${result.score}/${result.totalMarks}\n`;
      report += `Percentage: ${result.percentage.toFixed(2)}%\n`;
      report += `Status: ${result.status.toUpperCase()}\n`;
      report += `Time Taken: ${result.timeTaken} minutes\n`;
      report += `Date: ${new Date(result.generatedAt).toLocaleString()}\n`;
      
      if (result.violations.length > 0) {
        report += `Violations: ${result.violations.length}\n`;
      }
      
      report += `\n`;
    });

    return report;
  };

  const getTestTitle = (testId: string) => {
    return tests.find(t => t.id === testId)?.title || 'Unknown Test';
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getStudentEnrollment = (studentId: string) => {
    return students.find(s => s.id === studentId)?.enrollmentNumber || 'N/A';
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600">No exam results have been generated yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
              <p className="text-gray-600 mt-2">View and manage all exam results</p>
            </div>
            <button
              onClick={downloadAllResults}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download All Results
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by test name, student name, or enrollment number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="under-review">Under Review</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Sort results"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="percentage">Sort by Percentage</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => {
            const test = tests.find(t => t.id === result.testId);
            const student = students.find(s => s.id === result.studentId);
            
            return (
              <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {test?.title || 'Unknown Test'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student?.name} ({student?.enrollmentNumber})
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.status === 'pass' 
                      ? 'bg-green-100 text-green-800' 
                      : result.status === 'fail'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </div>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="font-bold text-lg text-blue-600">{result.score}/{result.totalMarks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Percentage</p>
                    <p className="font-bold text-lg text-green-600">{result.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-bold text-lg text-gray-600">{result.timeTaken}m</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">
                    <strong>Date:</strong> {new Date(result.generatedAt).toLocaleDateString()}
                  </p>
                  {result.violations.length > 0 && (
                    <p className="text-xs text-red-600">
                      <strong>Violations:</strong> {result.violations.length}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Navigate to detailed view or open modal
                      window.open(`/exam-results?resultId=${result.id}`, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      // Download individual result
                      const reportContent = generateIndividualReport(result);
                      const blob = new Blob([reportContent], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `exam-result-${student?.enrollmentNumber || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    title="Download individual result"
                    aria-label="Download individual result"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  function generateIndividualReport(result: any) {
    const test = tests.find(t => t.id === result.testId);
    const student = students.find(s => s.id === result.studentId);
    const timestamp = new Date().toLocaleString();
    
    let report = `EXAM RESULT REPORT\n`;
    report += `Generated on: ${timestamp}\n`;
    report += `==========================================\n\n`;
    
    report += `STUDENT INFORMATION\n`;
    report += `Name: ${student?.name || 'Unknown'}\n`;
    report += `Enrollment: ${student?.enrollmentNumber || 'N/A'}\n`;
    report += `Email: ${student?.email || 'N/A'}\n\n`;
    
    report += `TEST INFORMATION\n`;
    report += `Test: ${test?.title || 'Unknown Test'}\n`;
    report += `Company: ${test?.companyName || 'N/A'}\n\n`;
    
    report += `RESULT SUMMARY\n`;
    report += `Score: ${result.score}/${result.totalMarks}\n`;
    report += `Percentage: ${result.percentage.toFixed(2)}%\n`;
    report += `Status: ${result.status.toUpperCase()}\n`;
    report += `Time Taken: ${result.timeTaken} minutes\n`;
    report += `Date: ${new Date(result.generatedAt).toLocaleString()}\n\n`;
    
    if (result.violations.length > 0) {
      report += `VIOLATIONS RECORDED\n`;
      report += `==========================================\n\n`;
      result.violations.forEach((v: any, index: number) => {
        report += `Violation ${index + 1}:\n`;
        report += `Type: ${v.type}\n`;
        report += `Description: ${v.description}\n`;
        report += `Severity: ${v.severity}\n`;
        report += `Timestamp: ${new Date(v.timestamp).toLocaleString()}\n`;
        report += `----------------------------------------\n\n`;
      });
    }
    
    return report;
  }
};

export default Results;
