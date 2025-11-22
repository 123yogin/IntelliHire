import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { tests, results } = useApp();

  const availableTests = tests.filter(t => t.isActive);
  const myResults = results.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  const violationCount = myResults.reduce((sum, r) => sum + (r.violations?.length || 0), 0);

  const averageScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + r.percentage, 0) / myResults.length)
    : 0;

  const totalTimeMinutes = myResults.reduce((sum, r) => sum + (r.timeTaken || 0), 0);
  const totalTimeHours = totalTimeMinutes / 60;

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start
  const newTestsThisWeek = availableTests.filter(test => {
    if (!test.createdAt) return false;
    const created = new Date(test.createdAt);
    return created >= startOfWeek;
  });

  const stats = [
    {
      title: 'Available Tests',
      value: availableTests.length.toString(),
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'Ready to take'
    },
    {
      title: 'Completed Tests',
      value: myResults.length.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Successfully finished'
    },
    {
      title: 'Violations Detected',
      value: violationCount.toString(),
      icon: AlertCircle,
      color: 'bg-red-500',
      description: 'Proctoring issues detected'
    },
    {
      title: 'Average Score',
      value: myResults.length > 0 ? `${averageScore}%` : 'N/A',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Your performance'
    },
    {
      title: 'Test Hours',
      value: totalTimeHours.toFixed(1),
      icon: Clock,
      color: 'bg-indigo-500',
      description: 'Total time spent'
    }
  ];

  const getTestTitle = (testId: string) => tests.find(t => t.id === testId)?.title || 'Unknown Test';

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return 'just now';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your progress and take available tests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">{stat.title}</p>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Tests</h3>
            <Link
              to="/available-tests"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {availableTests.slice(0, 3).map((test) => (
              <div key={test.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{test.title}</h4>
                    <p className="text-sm text-gray-600">{test.companyName}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {test.duration} min
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {test.questions.length || 25} questions
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/exam/${test.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
          <div className="space-y-4">
            {myResults.length > 0 ? (
              myResults.slice(0, 2).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{getTestTitle(result.testId)}</p>
                    <p className="text-sm text-gray-600">{getTimeAgo(result.generatedAt)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-lg font-bold text-gray-900">{result.percentage.toFixed(0)}%</span>
                      {result.status === 'pass' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className={`text-xs capitalize font-medium ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                      {result.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4">You haven't completed any tests yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Opportunities</h3>
            <p className="text-gray-600 mt-1">Don't miss out on new test opportunities</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{newTestsThisWeek.length} new test{newTestsThisWeek.length !== 1 ? 's' : ''} this week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;