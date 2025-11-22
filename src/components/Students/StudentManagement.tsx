import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  GraduationCap,
  MoreVertical
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import { supabase } from '../../supabaseClient';

const StudentManagement: React.FC = () => {
  const { students, fetchStudents } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = Array.from(new Set(students.map(s => s.course)));

  // CSV export helper
  function exportToCSV() {
    const headers = [
      'Name',
      'Enrollment Number',
      'Email',
      'Phone',
      'Course',
      'Branch',
      'Registered'
    ];
    const rows = filteredStudents.map(s => [
      s.name,
      s.enrollmentNumber,
      s.email,
      s.phone,
      s.course,
      s.branch,
      s.createdAt.toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Bulk import handler
  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        alert('CSV must have a header and at least one row.');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const required = ['enrollment number','name','email','phone','course','branch'];
      if (!required.every(r => headers.includes(r))) {
        alert('CSV must include headers: ' + required.join(', '));
        return;
      }
      const studentsToAdd = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i]?.trim() || ''; });
        return {
          enrollment_number: obj['enrollment number'],
          student_name: obj['name'],
          student_email: obj['email'],
          student_phone: obj['phone'],
          course: obj['course'],
          branch: obj['branch']
        };
      }).filter(s => s.enrollment_number && s.student_name && s.student_email);
      if (!studentsToAdd.length) {
        alert('No valid students found in CSV.');
        return;
      }
      const { error } = await supabase.from('students').insert(studentsToAdd);
      if (error) {
        alert('Bulk import failed: ' + error.message);
      } else {
        alert('Bulk import successful!');
        fetchStudents();
      }
    };
    reader.readAsText(file);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage student registrations and profiles</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base"
            onClick={() => fileInputRef.current?.click()}
            title="Bulk Import Students"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Bulk Import</span>
            <span className="sm:hidden">Import</span>
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleBulkImport}
            title="Import students CSV"
          />
          <button
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm sm:text-base"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
            title="Add Student"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base flex-1 sm:flex-none"
                title="Course"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base">Student</th>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base">Enrollment</th>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base hidden md:table-cell">Course & Branch</th>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base hidden lg:table-cell">Contact</th>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base hidden lg:table-cell">Registered</th>
                <th className="text-left py-3 px-3 sm:px-6 font-medium text-gray-700 text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-3 sm:px-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{student.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate hidden md:block">{student.email}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate md:hidden">{student.course}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 sm:px-6">
                    <span className="font-mono text-xs sm:text-sm font-medium text-gray-900">
                      {student.enrollmentNumber}
                    </span>
                  </td>
                  <td className="py-4 px-3 sm:px-6 hidden md:table-cell">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{student.course}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{student.branch}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {student.createdAt.toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-3 sm:px-6">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No students found matching your criteria</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default StudentManagement;