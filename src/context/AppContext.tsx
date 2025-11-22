import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Test, ExamSession, ExamResult, Question } from '../types';
import { supabase } from '../supabaseClient';

interface AppContextType {
  students: Student[];
  tests: Test[];
  examSessions: ExamSession[];
  results: ExamResult[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  updateTest: (test: Test) => Promise<void>;
  deleteTest: (testId: string) => Promise<void>;
  updateExamSession: (session: ExamSession) => void;
  addResult: (result: Omit<ExamResult, 'id' | 'generatedAt'>) => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchTests: () => Promise<void>;
  latestExamResult: ExamResult | null;
  setLatestExamResult: React.Dispatch<React.SetStateAction<ExamResult | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [latestExamResult, setLatestExamResult] = useState<ExamResult | null>(null);

  // Fetch all students from Supabase
  const fetchStudents = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (!error && data) {
      // Map Supabase data to Student type
      setStudents(
        data.map((s: any) => ({
          id: s.id,
          enrollmentNumber: s.enrollment_number,
          name: s.student_name,
          email: s.student_email,
          phone: s.student_phone,
          course: s.course,
          branch: s.branch,
          createdAt: s.created_at ? new Date(s.created_at) : new Date()
        }))
      );
    }
  };

  // Fetch all tests from Supabase
  const fetchTests = async () => {
    const { data, error } = await supabase.from('tests').select('*');
    if (!error && data) {
      setTests(
        data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          duration: t.duration_minutes,
          questions: t.questions || [],
          recruiterId: t.created_by,
          companyName: t.companyName || '',
          createdAt: t.created_at ? new Date(t.created_at) : new Date(),
          isActive: t.is_active,
          settings: t.settings || {},
        }))
      );
    }
  };

  const fetchResults = async () => {
    const { data, error } = await supabase.from('results').select('*');
    if (!error && data) {
      setResults(data.map((r: any) => ({
        id: r.id,
        examSessionId: r.exam_session_id,
        studentId: r.student_id,
        testId: r.test_id,
        score: r.score,
        totalMarks: r.total_marks,
        percentage: r.percentage,
        timeTaken: r.time_taken,
        violations: r.violations || [],
        cheatingProbability: r.cheating_probability,
        status: r.status,
        generatedAt: new Date(r.created_at),
        questions: r.questions || [],
        answers: r.answers || {}
      })));
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTests();
    fetchResults();
  }, []);

  // Remove addStudent's local state update, just call fetchStudents after insert
  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    // This function is now a placeholder, not used for local state
    // Use fetchStudents after adding a student
  };

  // Remove addTest's local state update, just call fetchTests after insert
  const addTest = async (testData: Omit<Test, 'id' | 'createdAt'>) => {
    // This function is now a placeholder, not used for local state
    // Use fetchTests after adding a test
  };

  const updateTest = async (test: Test) => {
    const { error } = await supabase.from('tests').update({
      title: test.title,
      description: test.description,
      duration_minutes: test.duration,
      is_active: test.isActive,
      questions: test.questions,
      settings: test.settings,
    }).eq('id', test.id);

    if (error) {
      console.error('Error updating test:', error);
    } else {
      await fetchTests();
    }
  };

  const deleteTest = async (testId: string) => {
    const { error } = await supabase.from('tests').delete().eq('id', testId);
    if (error) {
      console.error('Error deleting test:', error);
    } else {
      await fetchTests();
    }
  };

  const updateExamSession = (session: ExamSession) => {
    setExamSessions(prev => {
      const index = prev.findIndex(s => s.id === session.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = session;
        return updated;
      }
      return [...prev, session];
    });
  };

  const addResult = async (resultData: Omit<ExamResult, 'id' | 'generatedAt'>) => {
    const payload = {
      test_id: resultData.testId,
      score: resultData.score,
      total_marks: resultData.totalMarks,
      percentage: resultData.percentage,
      status: resultData.status,
      time_taken: resultData.timeTaken,
      violations: resultData.violations,
      answers: resultData.answers,
      questions: resultData.questions
    };

    const { error } = await supabase.from('results').insert([payload]);
    if (error) {
      alert('Failed to save result: ' + error.message);
    } else {
      await fetchResults(); // Refresh results from DB
    }
  };

  const value = {
    students,
    tests,
    examSessions,
    results,
    addStudent,
    addTest,
    updateTest,
    deleteTest,
    updateExamSession,
    addResult,
    fetchStudents,
    fetchTests, // expose fetchTests
    latestExamResult,
    setLatestExamResult
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};