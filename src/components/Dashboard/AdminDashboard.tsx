import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  FileText,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return date.toLocaleDateString();
}

const AdminDashboard: React.FC = () => {
  const { students, tests, results, examSessions } = useApp();

  // Count all violations from examSessions and results
  const violationCount = (
    (examSessions || []).reduce((sum, s) => sum + (s.violations?.length || 0), 0) +
    (results || []).reduce((sum, r) => sum + (r.violations?.length || 0), 0)
  );

  const stats = [
    {
      title: 'Total Students',
      value: students.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: `+${students.length}`
    },
    {
      title: 'Active Tests',
      value: tests.filter(t => t.isActive).length.toString(),
      icon: FileText,
      color: 'bg-green-500',
      change: `+${tests.filter(t => t.isActive).length}`
    },
    {
      title: 'Completed Exams',
      value: results.length.toString(),
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: `+${results.length}`
    },
    {
      title: 'Violations Detected',
      value: violationCount.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: `+${violationCount}`
    }
  ];

  // Recent Activity: get latest student, test, result, violation
  const recentStudent = students.length ? students[students.length - 1] : null;
  const recentTest = tests.length ? tests[tests.length - 1] : null;
  const recentResult = results.length ? results[results.length - 1] : null;
  // Find the most recent violation from examSessions or results
  let recentViolation: any = null;
  let recentViolationTime: Date | null = null;
  (examSessions || []).forEach(s => {
    if (s.violations && s.violations.length) {
      const v = s.violations[s.violations.length - 1];
      if (!recentViolationTime || v.timestamp > recentViolationTime) {
        recentViolation = v;
        recentViolationTime = v.timestamp;
      }
    }
  });
  (results || []).forEach(r => {
    if (r.violations && r.violations.length) {
      const v = r.violations[r.violations.length - 1];
      if (!recentViolationTime || v.timestamp > recentViolationTime) {
        recentViolation = v;
        recentViolationTime = v.timestamp;
      }
    }
  });

  const recentActivity = [
    recentStudent && {
      action: `New student registered${recentStudent.name ? ': ' + recentStudent.name : ''}`,
      time: getTimeAgo(recentStudent.createdAt),
      icon: Users,
      color: 'text-blue-600'
    },
    recentResult && {
      action: `Test completed by ${recentResult.studentId}`,
      time: getTimeAgo(recentResult.generatedAt),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    recentViolation && {
      action: recentViolation.description || 'Violation detected in exam session',
      time: getTimeAgo(new Date(recentViolation.timestamp)),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    recentTest && {
      action: `New test created${recentTest.companyName ? ' by ' + recentTest.companyName : ''}`,
      time: getTimeAgo(recentTest.createdAt),
      icon: FileText,
      color: 'text-purple-600'
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor platform activity and performance</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.length ? recentActivity.map((activity, index) => (
              activity && (
                <div key={index} className="flex items-center space-x-3">
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )
            )) : (
              <div className="text-gray-500">No recent activity found.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { metric: 'Server Uptime', value: '99.9%', status: 'healthy' },
              { metric: 'AI Proctoring Accuracy', value: '94.5%', status: 'healthy' },
              { metric: 'Database Performance', value: '98.2%', status: 'healthy' },
              { metric: 'Storage Usage', value: '67%', status: 'warning' }
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;