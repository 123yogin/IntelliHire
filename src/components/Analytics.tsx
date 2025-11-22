import React from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const Analytics: React.FC = () => {
  const { students, tests, results } = useApp();

  const studentGrowthData = students
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .reduce((acc, student) => {
      const month = student.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const last = acc.length ? acc[acc.length - 1] : { month: '', count: 0 };
      if (last.month === month) {
        last.count += 1;
      } else {
        acc.push({ month, count: (last.count || 0) + 1 });
      }
      return acc;
    }, [] as { month: string; count: number }[]);

  const participationRate = tests.length > 0 ? (results.length / (students.length * tests.length)) * 100 : 0;
  const averageScore = results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;
  const passRate = results.length > 0 ? (results.filter(r => r.percentage >= 50).length / results.length) * 100 : 0;
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);

  const violationData = results.map(r => ({
    name: `Test ${r.testId.substring(0, 5)}`,
    violations: r.violations.length,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-sm">{`Students: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total Students" value={students.length} color="blue" />
        <StatCard icon={FileText} title="Total Tests" value={tests.length} color="green" />
        <StatCard icon={CheckCircle} title="Completed Exams" value={results.length} color="purple" />
        <StatCard icon={AlertTriangle} title="Total Violations" value={totalViolations} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Candidate Growth Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Cumulative Students" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Proctoring Violation Trends">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="violations" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Test Participation Rate" value={`${participationRate.toFixed(2)}%`} color="indigo" />
        <StatCard title="Average Score" value={`${averageScore.toFixed(2)}`} color="yellow" />
        <StatCard title="Pass Rate (>=50%)" value={`${passRate.toFixed(2)}%`} color="teal" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center text-gray-500">
        More advanced analytics and reporting features will be added in future updates.
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon?: React.ElementType; title: string; value: string | number; color: string }> = ({ icon: Icon, title, value, color }) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
    yellow: 'text-yellow-600',
    teal: 'text-teal-600',
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 flex items-center space-x-4">
      {Icon && <Icon className={`w-8 h-8 ${colors[color]}`} />}
      <div>
        <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
        <div className="text-gray-600 mt-1">{title}</div>
      </div>
    </div>
  );
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    {children}
  </div>
);

export default Analytics; 