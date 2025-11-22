import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import {
  FileText,
  Clock,
  Settings,
  Plus,
  Trash2,
  Upload,
  Brain,
  Shield,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Save,
  ChevronLeft,
  ChevronRight,
  Building,
  BookText,
  Star,
  Tag,
  Hash
} from 'lucide-react';

const CreateTest: React.FC = () => {
  const { addTest, fetchTests } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [testData, setTestData] = useState({
    title: '',
    description: '',
    duration: 60,
    companyName: '',
    isActive: true,
    settings: {
      shuffleQuestions: true,
      negativeMarking: false,
      proctoringLevel: 'strict' as 'strict' | 'moderate' | 'off',
      allowTabSwitch: false
    }
  });

  const [questions, setQuestions] = useState([
    {
      id: `q_${Date.now()}`,
      type: 'mcq' as const,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'medium' as const,
      topic: '',
      marks: 1
    }
  ]);

  const handleTestDataChange = (field: string, value: any) => {
    if (field.startsWith('settings.')) {
      const settingField = field.split('.')[1];
      setTestData(prev => ({
        ...prev,
        settings: { ...prev.settings, [settingField]: value }
      }));
    } else {
      setTestData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: `q_${Date.now()}`,
      type: 'mcq' as const,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'medium' as const,
      topic: '',
      marks: 1
    }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions(prev => {
      const updated = [...prev];
      const questionToUpdate = { ...updated[index] };

      if (field.startsWith('options.')) {
        const optionIndex = parseInt(field.split('.')[1]);
        const newOptions = [...(questionToUpdate.options || [])];
        newOptions[optionIndex] = value;
        questionToUpdate.options = newOptions;
      } else {
        (questionToUpdate as any)[field] = value;
      }
      
      updated[index] = questionToUpdate;
      return updated;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (questions.some(q => !q.question)) {
      alert('Please fill out all question fields.');
      return;
    }

    setIsLoading(true);

    const testPayload = {
      title: testData.title,
      description: testData.description,
      duration_minutes: testData.duration,
      companyName: testData.companyName,
      settings: testData.settings,
      is_active: testData.isActive,
      questions: questions
    };

    const { error } = await supabase.from('tests').insert([testPayload]);

    if (error) {
      alert('Failed to create test: ' + error.message);
      setIsLoading(false);
      return;
    }

    await fetchTests();
    setIsLoading(false);
    navigate('/my-tests');
  };
  
  const renderStepOne = () => (
    <div className="p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Test Details</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
            <div className="relative">
              <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input id="title" type="text" value={testData.title} onChange={(e) => handleTestDataChange('title', e.target.value)} className="w-full input pl-10" placeholder="e.g., Frontend Developer Assessment" />
            </div>
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <div className="relative">
              <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input id="companyName" type="text" value={testData.companyName} onChange={(e) => handleTestDataChange('companyName', e.target.value)} className="w-full input pl-10" placeholder="e.g., Tech Solutions Inc." />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <BookText className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            <textarea id="description" value={testData.description} onChange={(e) => handleTestDataChange('description', e.target.value)} rows={4} className="w-full input pl-10 pt-2" placeholder="Describe the purpose and scope of this assessment..." />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <div className="relative w-40">
            <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input id="duration" type="number" value={testData.duration} onChange={(e) => handleTestDataChange('duration', parseInt(e.target.value))} min="5" className="w-full input pl-10" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Questions</h3>
        <button onClick={addQuestion} className="btn-primary flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Question</button>
      </div>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:border-blue-300">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold text-gray-800">Question {i + 1}</p>
              <button onClick={() => removeQuestion(i)} title="Remove Question" className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea value={q.question} onChange={(e) => updateQuestion(i, 'question', e.target.value)} placeholder="Enter the question..." className="w-full input" rows={3} />
              </div>

              {q.type === 'mcq' && q.options && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer Options</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => (
                      <input key={optIndex} type="text" value={opt} onChange={(e) => updateQuestion(i, `options.${optIndex}`, e.target.value)} placeholder={`Option ${optIndex + 1}`} className="input" />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <select value={q.correctAnswer} onChange={(e) => updateQuestion(i, 'correctAnswer', parseInt(e.target.value))} title="Correct Answer" className="input w-full">
                    {q.options?.map((_, optIndex) => (
                      <option key={optIndex} value={optIndex}>Option {optIndex + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select value={q.difficulty} onChange={(e) => updateQuestion(i, 'difficulty', e.target.value)} title="Difficulty" className="input w-full">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input type="text" value={q.topic} onChange={(e) => updateQuestion(i, 'topic', e.target.value)} placeholder="e.g., React Hooks" className="input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                  <input type="number" value={q.marks} onChange={(e) => updateQuestion(i, 'marks', parseInt(e.target.value))} min="1" className="input w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Test Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-800">General Settings</h4>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label htmlFor="shuffleQuestions" className="font-medium text-gray-800">Shuffle Questions</label>
              <p className="text-sm text-gray-600">Randomize question order for each candidate.</p>
            </div>
            <button id="shuffleQuestions" onClick={() => handleTestDataChange('settings.shuffleQuestions', !testData.settings.shuffleQuestions)} className="flex-shrink-0">
              {testData.settings.shuffleQuestions ? <ToggleRight className="w-9 h-9 text-blue-600" /> : <ToggleLeft className="w-9 h-9 text-gray-300" />}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label htmlFor="negativeMarking" className="font-medium text-gray-800">Negative Marking</label>
              <p className="text-sm text-gray-600">Deduct marks for incorrect answers.</p>
            </div>
            <button id="negativeMarking" onClick={() => handleTestDataChange('settings.negativeMarking', !testData.settings.negativeMarking)} className="flex-shrink-0">
              {testData.settings.negativeMarking ? <ToggleRight className="w-9 h-9 text-blue-600" /> : <ToggleLeft className="w-9 h-9 text-gray-300" />}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-800">AI Proctoring</h4>
          <div className="p-4 border rounded-lg">
            <label htmlFor="proctoringLevel" className="block font-medium text-gray-800 mb-2">Proctoring Level</label>
            <p className="text-sm text-gray-600 mb-3">Set the intensity of AI-powered monitoring.</p>
            <select id="proctoringLevel" value={testData.settings.proctoringLevel} onChange={(e) => handleTestDataChange('settings.proctoringLevel', e.target.value)} className="w-full input">
              <option value="strict">Strict</option>
              <option value="moderate">Moderate</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
             <div>
              <label htmlFor="allowTabSwitch" className="font-medium text-gray-800">Allow Tab Switching</label>
              <p className="text-sm text-gray-600">Permit candidates to switch browser tabs.</p>
            </div>
            <button id="allowTabSwitch" onClick={() => handleTestDataChange('settings.allowTabSwitch', !testData.settings.allowTabSwitch)} className="flex-shrink-0">
              {testData.settings.allowTabSwitch ? <ToggleRight className="w-9 h-9 text-blue-600" /> : <ToggleLeft className="w-9 h-9 text-gray-300" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Test</h1>
      <p className="text-gray-600 mb-8">Follow the steps to build your assessment.</p>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentStep(1)} className={`px-4 py-2 rounded-lg font-medium ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>1. Details</button>
            <button onClick={() => setCurrentStep(2)} className={`px-4 py-2 rounded-lg font-medium ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>2. Questions</button>
            <button onClick={() => setCurrentStep(3)} className={`px-4 py-2 rounded-lg font-medium ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>3. Settings</button>
          </div>
        </div>
        
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}

        <div className="p-4 border-t flex justify-between items-center bg-gray-50 rounded-b-xl">
          {currentStep === 1 && <div />}
          {currentStep > 1 && (
            <button onClick={() => setCurrentStep(currentStep - 1)} className="btn-secondary flex items-center"><ChevronLeft className="w-4 h-4 mr-2" /> Back</button>
          )}

          {currentStep < 3 && (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="btn-primary flex items-center">Next <ChevronRight className="w-4 h-4 ml-2" /></button>
          )}
          
          {currentStep === 3 && (
            <button onClick={handleSubmit} className="btn-primary flex items-center" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isLoading ? 'Saving...' : 'Save Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTest;