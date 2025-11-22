import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard: React.FC = () => {
  const { tests, results, students } = useApp();
  const { user } = useAuth();

  // Only show tests created by this recruiter
  const myTests = tests.filter(t => t.recruiterId === user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const myResults = results; // You can filter by recruiter if needed

  const activeTests = myTests.filter(t => t.isActive);
  
  const stats = [
    {
      title: 'Active Tests',
      value: activeTests.length.toString(),
      icon: FileText,
      color: 'bg-blue-500',
      change: `+${activeTests.length}`
    },
    {
      title: 'Total Candidates',
      value: students.length.toString(),
      icon: Users,
      color: 'bg-green-500',
      change: `+${students.length}`
    },
    {
      title: 'Assessments Taken',
      value: myResults.length.toString(),
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: `+${myResults.length}`
    },
    {
      title: 'Average Score',
      value: myResults.length > 0 ? `${Math.round(myResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / myResults.length)}%` : 'N/A',
      icon: BarChart3,
      color: 'bg-indigo-500',
      change: '+0%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your tests and track candidate performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
          <div className="space-y-4">
            {myTests.length > 0 ? (
              myTests.slice(0, 4).map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{test.title}</p>
                    <p className="text-sm text-gray-600">{test.companyName}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {test.duration} min
                    </div>
                    <p className={`mt-1 text-xs font-medium ${test.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-2">No tests created yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Top Performing Test</h4>
              <p className="text-sm text-blue-700">Software Developer Assessment</p>
              <p className="text-xs text-blue-600 mt-1">Average Score: 82%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Proctoring Efficiency</h4>
              <p className="text-sm text-green-700">94% violation detection rate</p>
              <p className="text-xs text-green-600 mt-1">2% false positives</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Candidate Quality</h4>
              <p className="text-sm text-purple-700">78% pass rate</p>
              <p className="text-xs text-purple-600 mt-1">High engagement scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;