import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Try service role key first (for seeding), fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY in your .env file');
  console.error('Note: Using SERVICE_ROLE_KEY is recommended for seeding to bypass RLS policies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate UUID
function generateUUID() {
  return randomUUID();
}

// Sample data arrays
const companyNames = [
  'TechCorp Solutions', 'InnovateHub', 'DataSphere Inc', 'CloudVantage', 'CodeForge Technologies',
  'Digital Dynamics', 'SmartSystems', 'FutureTech Labs', 'Quantum Solutions', 'Nexus Enterprises'
];

const institutionNames = [
  'State University', 'Tech Institute', 'Engineering College', 'Science Academy', 'Professional University'
];

const courses = ['B.Tech', 'B.E.', 'MCA', 'M.Tech', 'BCA', 'B.Sc'];
const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const firstNames = ['Raj', 'Priya', 'Amit', 'Sneha', 'Rahul', 'Anjali', 'Vikram', 'Kavya', 'Arjun', 'Divya'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Mehta', 'Verma', 'Jain', 'Agarwal'];

const topics = [
  'Data Structures', 'Algorithms', 'Database Management', 'Operating Systems', 'Computer Networks',
  'Software Engineering', 'Web Development', 'Machine Learning', 'Cybersecurity', 'Cloud Computing',
  'Object-Oriented Programming', 'System Design', 'Mobile Development', 'DevOps', 'Blockchain'
];

const subjects = ['Computer Science', 'Mathematics', 'Programming', 'Database', 'Networking', 'Software Engineering'];

// Generate random data functions
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEmail(name) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  return `${cleanName}${randomInt(100, 999)}@${randomElement(['gmail.com', 'yahoo.com', 'university.edu', 'student.edu'])}`;
}

function generatePhone() {
  return `+91${randomInt(7000000000, 9999999999)}`;
}

function generateEnrollmentNumber(index) {
  const year = randomInt(2020, 2024);
  const branchCode = randomElement(['CS', 'IT', 'EC', 'ME', 'CE', 'EE']);
  return `${year}${branchCode}${String(index).padStart(4, '0')}`;
}

// Seed Organizations
async function seedOrganizations() {
  console.log('📦 Seeding Organizations...');
  const organizations = [];
  
  // Add companies
  for (let i = 0; i < 8; i++) {
    organizations.push({
      name: companyNames[i],
      type: 'company',
      domain: `${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
      contact_email: `contact@${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
      contact_phone: generatePhone(),
      address: {
        street: `${randomInt(1, 999)} Main Street`,
        city: randomElement(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune']),
        state: randomElement(['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu']),
        zip: randomInt(100000, 999999),
        country: 'India'
      },
      is_active: true,
      settings: {}
    });
  }
  
  // Add institutions
  for (let i = 0; i < 3; i++) {
    organizations.push({
      name: `${randomElement(['State', 'National', 'Premier'])} ${institutionNames[i]}`,
      type: 'institution',
      domain: `${institutionNames[i].toLowerCase().replace(/\s+/g, '')}.edu`,
      contact_email: `admin@${institutionNames[i].toLowerCase().replace(/\s+/g, '')}.edu`,
      contact_phone: generatePhone(),
      address: {
        street: `${randomInt(1, 999)} Education Avenue`,
        city: randomElement(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']),
        state: randomElement(['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu']),
        zip: randomInt(100000, 999999),
        country: 'India'
      },
      is_active: true,
      settings: {}
    });
  }
  
  const { data, error } = await supabase.from('organizations').insert(organizations).select();
  
  if (error) {
    console.error('❌ Error seeding organizations:', error);
    throw error;
  }
  
  console.log(`✅ Seeded ${data.length} organizations`);
  return data;
}

// Seed Profiles
// NOTE: Profiles table has a foreign key to auth.users(id).
// If you get foreign key errors, you have two options:
// 1. Use SUPABASE_SERVICE_ROLE_KEY instead of VITE_SUPABASE_ANON_KEY in .env (bypasses RLS)
// 2. Create auth users first using Supabase Auth API, then use those IDs
async function seedProfiles(organizations) {
  console.log('👥 Seeding Profiles...');
  const profiles = [];
  const companyOrgs = organizations.filter(org => org.type === 'company');
  const institutionOrgs = organizations.filter(org => org.type === 'institution');
  
  // Super Admin
  profiles.push({
    id: generateUUID(),
    email: 'superadmin@intellihire.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    is_active: true,
    preferences: {}
  });
  
  // Admin
  profiles.push({
    id: generateUUID(),
    email: 'admin@intellihire.com',
    full_name: 'System Admin',
    role: 'admin',
    organization_id: institutionOrgs[0]?.id,
    is_active: true,
    preferences: {}
  });
  
  // Recruiters (8)
  for (let i = 0; i < 8; i++) {
    const name = `${randomElement(firstNames)} ${randomElement(lastNames)}`;
    profiles.push({
      id: generateUUID(),
      email: generateEmail(name),
      full_name: name,
      role: 'recruiter',
      organization_id: companyOrgs[i % companyOrgs.length]?.id,
      phone: generatePhone(),
      is_active: true,
      preferences: {}
    });
  }
  
  // Students (100)
  for (let i = 0; i < 100; i++) {
    const name = `${randomElement(firstNames)} ${randomElement(lastNames)}`;
    profiles.push({
      id: generateUUID(),
      email: generateEmail(name),
      full_name: name,
      role: 'student',
      organization_id: institutionOrgs[Math.floor(i / 20) % institutionOrgs.length]?.id,
      phone: generatePhone(),
      is_active: true,
      preferences: {}
    });
  }
  
  // Insert in batches to avoid timeout
  const batchSize = 20;
  const insertedProfiles = [];
  
  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    const { data, error } = await supabase.from('profiles').insert(batch).select();
    
    if (error) {
      console.error(`❌ Error seeding profiles batch ${i / batchSize + 1}:`, error);
      throw error;
    }
    
    insertedProfiles.push(...data);
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(profiles.length / batchSize)}`);
  }
  
  console.log(`✅ Seeded ${insertedProfiles.length} profiles`);
  return insertedProfiles;
}

// Seed Students
async function seedStudents(profiles) {
  console.log('🎓 Seeding Students...');
  const studentProfiles = profiles.filter(p => p.role === 'student');
  const students = [];
  
  for (let i = 0; i < studentProfiles.length; i++) {
    const profile = studentProfiles[i];
    students.push({
      profile_id: profile.id,
      enrollment_number: generateEnrollmentNumber(i + 1),
      course: randomElement(courses),
      branch: randomElement(branches),
      year_of_study: randomInt(1, 4),
      cgpa: randomFloat(6.0, 9.5),
      student_name: profile.full_name,
      student_email: profile.email,
      student_phone: profile.phone || generatePhone(),
      skills: [
        randomElement(['Java', 'Python', 'JavaScript', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB']),
        randomElement(['Data Structures', 'Algorithms', 'Web Development', 'Mobile Development']),
        randomElement(['Machine Learning', 'Cloud Computing', 'DevOps', 'Cybersecurity'])
      ].slice(0, randomInt(2, 3)),
      certifications: [
        { name: 'AWS Certified', issuer: 'Amazon', year: randomInt(2022, 2024) },
        { name: 'Google Cloud', issuer: 'Google', year: randomInt(2022, 2024) }
      ].slice(0, randomInt(0, 2)),
      academic_records: {
        semester1: randomFloat(7.0, 9.5),
        semester2: randomFloat(7.0, 9.5),
        semester3: randomFloat(7.0, 9.5)
      },
      placement_status: randomElement(['available', 'placed', 'not_interested'])
    });
  }
  
  // Insert in batches
  const batchSize = 25;
  const insertedStudents = [];
  
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    const { data, error } = await supabase.from('students').insert(batch).select();
    
    if (error) {
      console.error(`❌ Error seeding students batch ${i / batchSize + 1}:`, error);
      throw error;
    }
    
    insertedStudents.push(...data);
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(students.length / batchSize)}`);
  }
  
  console.log(`✅ Seeded ${insertedStudents.length} students`);
  return insertedStudents;
}

// Seed Questions
async function seedQuestions(profiles, organizations) {
  console.log('❓ Seeding Questions...');
  const recruiterProfiles = profiles.filter(p => p.role === 'recruiter' || p.role === 'admin');
  const companyOrgs = organizations.filter(org => org.type === 'company');
  const questions = [];
  
  const questionTypes = ['mcq', 'multiple_select', 'subjective', 'coding'];
  
  for (let i = 0; i < 200; i++) {
    const questionType = randomElement(questionTypes);
    const difficulty = randomElement(['easy', 'medium', 'hard']);
    const topic = randomElement(topics);
    const subject = randomElement(subjects);
    
    let questionData = {
      question_text: `Sample ${questionType} question ${i + 1} about ${topic}`,
      question_type: questionType,
      marks: randomInt(1, 5),
      negative_marks: questionType === 'mcq' ? randomFloat(0, 0.5) : 0,
      difficulty_level: difficulty,
      topic: topic,
      subject: subject,
      tags: [topic, subject, difficulty].slice(0, randomInt(2, 3)),
      created_by: randomElement(recruiterProfiles).id,
      organization_id: randomElement(companyOrgs).id,
      is_active: true,
      usage_count: randomInt(0, 50),
      time_limit_seconds: randomInt(30, 300)
    };
    
    // Add type-specific fields
    if (questionType === 'mcq' || questionType === 'multiple_select') {
      const numOptions = randomInt(4, 6);
      const options = Array.from({ length: numOptions }, (_, idx) => 
        `Option ${String.fromCharCode(65 + idx)}: Answer choice ${idx + 1}`
      );
      questionData.options = options;
      questionData.correct_answer = questionType === 'mcq' 
        ? randomInt(0, numOptions - 1)
        : [randomInt(0, numOptions - 1), randomInt(0, numOptions - 1)].filter((v, i, a) => a.indexOf(v) === i);
      questionData.explanation = `The correct answer is option ${String.fromCharCode(65 + (Array.isArray(questionData.correct_answer) ? questionData.correct_answer[0] : questionData.correct_answer))}`;
    } else if (questionType === 'coding') {
      questionData.code_template = `function solution(input) {\n  // Write your code here\n  return input;\n}`;
      questionData.test_cases = [
        { input: 'test1', expected_output: 'output1', is_public: true },
        { input: 'test2', expected_output: 'output2', is_public: false }
      ];
    } else if (questionType === 'subjective') {
      questionData.correct_answer = { keywords: ['important', 'concept', 'example'], min_length: 50 };
    }
    
    questions.push(questionData);
  }
  
  // Insert in batches
  const batchSize = 25;
  const insertedQuestions = [];
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const { data, error } = await supabase.from('questions').insert(batch).select();
    
    if (error) {
      console.error(`❌ Error seeding questions batch ${i / batchSize + 1}:`, error);
      throw error;
    }
    
    insertedQuestions.push(...data);
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questions.length / batchSize)}`);
  }
  
  console.log(`✅ Seeded ${insertedQuestions.length} questions`);
  return insertedQuestions;
}

// Seed Tests
async function seedTests(profiles, organizations, questions) {
  console.log('📝 Seeding Tests...');
  const recruiterProfiles = profiles.filter(p => p.role === 'recruiter' || p.role === 'admin');
  const companyOrgs = organizations.filter(org => org.type === 'company');
  const tests = [];
  
  const testTypes = ['placement', 'assessment', 'certification'];
  
  for (let i = 0; i < 20; i++) {
    const testType = randomElement(testTypes);
    const difficulty = randomElement(['easy', 'medium', 'hard']);
    const numQuestions = randomInt(10, 30);
    const selectedQuestions = questions
      .filter(q => q.difficulty_level === difficulty || Math.random() > 0.5)
      .slice(0, numQuestions)
      .map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        marks: q.marks,
        negative_marks: q.negative_marks
      }));
    
    const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);
    
    tests.push({
      title: `${testType.charAt(0).toUpperCase() + testType.slice(1)} Test ${i + 1}: ${randomElement(topics)} Assessment`,
      description: `Comprehensive ${testType} test covering ${randomElement(topics)} and related concepts. This test evaluates your knowledge and problem-solving skills.`,
      organization_id: randomElement(companyOrgs).id,
      created_by: randomElement(recruiterProfiles).id,
      duration_minutes: randomInt(30, 120),
      total_marks: totalMarks,
      passing_marks: Math.floor(totalMarks * 0.4),
      instructions: `1. Read all questions carefully\n2. Manage your time effectively\n3. No external resources allowed\n4. Proctoring is enabled`,
      test_type: testType,
      difficulty_level: difficulty,
      tags: [randomElement(topics), randomElement(subjects), difficulty],
      settings: {
        allow_review: true,
        face_detection: true,
        max_violations: randomInt(3, 7),
        noise_detection: true,
        negative_marking: Math.random() > 0.5,
        proctoring_level: randomElement(['strict', 'moderate', 'off']),
        shuffle_questions: true,
        proctoring_enabled: true,
        copy_paste_detection: true,
        mobile_phone_detection: true,
        negative_marking_ratio: 0.25,
        tab_switching_detection: true,
        auto_submit_on_violation: false,
        show_results_immediately: false,
        multiple_monitor_detection: true
      },
      is_active: Math.random() > 0.2,
      scheduled_start: randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
      scheduled_end: randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31)),
      questions: selectedQuestions,
      companyName: randomElement(companyNames)
    });
  }
  
  const { data, error } = await supabase.from('tests').insert(tests).select();
  
  if (error) {
    console.error('❌ Error seeding tests:', error);
    throw error;
  }
  
  console.log(`✅ Seeded ${data.length} tests`);
  return data;
}

// Seed Exam Sessions
async function seedExamSessions(tests, students) {
  console.log('📋 Seeding Exam Sessions...');
  const sessions = [];
  const statuses = ['scheduled', 'in_progress', 'completed', 'terminated', 'expired'];
  
  for (let i = 0; i < 50; i++) {
    const test = randomElement(tests);
    const student = randomElement(students);
    const status = randomElement(statuses);
    const startTime = randomDate(new Date(2024, 0, 1), new Date());
    const endTime = status === 'completed' || status === 'terminated' 
      ? new Date(startTime.getTime() + randomInt(10, test.duration_minutes) * 60000)
      : null;
    
    sessions.push({
      test_id: test.id,
      student_id: student.id,
      session_token: `token_${generateUUID().replace(/-/g, '')}`,
      status: status,
      start_time: startTime.toISOString(),
      end_time: endTime ? endTime.toISOString() : null,
      actual_duration_minutes: endTime ? Math.floor((endTime - startTime) / 60000) : null,
      browser_info: {
        name: randomElement(['Chrome', 'Firefox', 'Edge', 'Safari']),
        version: `${randomInt(100, 120)}.0.${randomInt(0, 9999)}`,
        platform: randomElement(['Windows', 'macOS', 'Linux'])
      },
      device_info: {
        type: randomElement(['desktop', 'laptop']),
        os: randomElement(['Windows 11', 'macOS', 'Linux']),
        screen_resolution: randomElement(['1920x1080', '1366x768', '2560x1440'])
      },
      ip_address: `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      location_data: {
        city: randomElement(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']),
        country: 'India',
        timezone: 'Asia/Kolkata'
      },
      proctoring_data: {
        face_detected: status !== 'terminated',
        violations_detected: randomInt(0, 5)
      },
      violation_count: randomInt(0, 5),
      is_flagged: Math.random() > 0.7,
      termination_reason: status === 'terminated' ? randomElement(['Multiple violations', 'Suspicious activity', 'Time exceeded']) : null
    });
  }
  
  const { data, error } = await supabase.from('exam_sessions').insert(sessions).select();
  
  if (error) {
    console.error('❌ Error seeding exam sessions:', error);
    throw error;
  }
  
  console.log(`✅ Seeded ${data.length} exam sessions`);
  return data;
}

// Seed Exam Responses
async function seedExamResponses(sessions, questions) {
  console.log('✍️ Seeding Exam Responses...');
  const responses = [];
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  for (const session of completedSessions) {
    // Get test questions for this session
    const { data: testData } = await supabase.from('tests').select('questions').eq('id', session.test_id).single();
    if (!testData || !testData.questions) continue;
    
    const sessionQuestions = testData.questions.slice(0, randomInt(5, Math.min(15, testData.questions.length)));
    
    for (const question of sessionQuestions) {
      const questionData = questions.find(q => q.id === question.id);
      if (!questionData) continue;
      
      let responseData = {};
      let isCorrect = false;
      
      if (questionData.question_type === 'mcq') {
        const selectedOption = Math.random() > 0.3 ? questionData.correct_answer : randomInt(0, (questionData.options?.length || 4) - 1);
        responseData = { selected_option: selectedOption };
        isCorrect = selectedOption === questionData.correct_answer;
      } else if (questionData.question_type === 'multiple_select') {
        const selectedOptions = [randomInt(0, 3), randomInt(0, 3)].filter((v, i, a) => a.indexOf(v) === i);
        responseData = { selected_options: selectedOptions };
        isCorrect = JSON.stringify(selectedOptions.sort()) === JSON.stringify((questionData.correct_answer || []).sort());
      } else if (questionData.question_type === 'subjective') {
        responseData = { answer_text: `This is a sample answer for the subjective question. It contains relevant information about the topic.` };
        isCorrect = Math.random() > 0.4; // 60% chance of being correct
      } else if (questionData.question_type === 'coding') {
        responseData = { code: `function solution(input) {\n  return input * 2;\n}` };
        isCorrect = Math.random() > 0.5; // 50% chance
      }
      
      const marksAwarded = isCorrect ? questionData.marks : (questionData.negative_marks ? -questionData.negative_marks : 0);
      
      responses.push({
        session_id: session.id,
        question_id: questionData.id,
        response_data: responseData,
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
        time_spent_seconds: randomInt(30, 300),
        attempt_count: randomInt(1, 3),
        is_flagged: Math.random() > 0.9,
        response_metadata: {
          timestamp: new Date().toISOString(),
          browser: session.browser_info?.name
        }
      });
    }
  }
  
  // Insert in batches
  const batchSize = 50;
  let insertedCount = 0;
  
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { data, error } = await supabase.from('exam_responses').insert(batch).select();
    
    if (error) {
      console.error(`❌ Error seeding exam responses batch ${i / batchSize + 1}:`, error);
      // Continue instead of throwing to allow partial success
      console.log(`  ⚠️ Skipping batch ${i / batchSize + 1}`);
      continue;
    }
    
    insertedCount += data.length;
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(responses.length / batchSize)}`);
  }
  
  console.log(`✅ Seeded ${insertedCount} exam responses`);
  return insertedCount;
}

// Seed Results
async function seedResults(sessions, students, tests) {
  console.log('📊 Seeding Results...');
  const results = [];
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  for (const session of completedSessions.slice(0, 25)) {
    const test = tests.find(t => t.id === session.test_id);
    const student = students.find(s => s.id === session.student_id);
    if (!test || !student) continue;
    
    // Get responses for this session
    const { data: responses } = await supabase
      .from('exam_responses')
      .select('marks_awarded, question_id, response_data')
      .eq('session_id', session.id);
    
    const score = responses ? responses.reduce((sum, r) => sum + (r.marks_awarded || 0), 0) : randomInt(0, test.total_marks);
    const percentage = (score / test.total_marks) * 100;
    const status = percentage >= (test.passing_marks / test.total_marks * 100) ? 'pass' : 'fail';
    
    // Get questions and answers
    const { data: testData } = await supabase.from('tests').select('questions').eq('id', test.id).single();
    const questions = testData?.questions || [];
    const answers = {};
    if (responses) {
      responses.forEach(r => {
        answers[r.question_id] = r.response_data;
      });
    }
    
    results.push({
      student_id: student.id,
      test_id: test.id,
      score: Math.max(0, score),
      total_marks: test.total_marks,
      percentage: parseFloat(percentage.toFixed(2)),
      status: status,
      time_taken: session.actual_duration_minutes || randomInt(10, test.duration_minutes),
      violations: Array.from({ length: session.violation_count || 0 }, (_, i) => ({
        type: randomElement(['face_not_detected', 'tab_switch', 'suspicious_movement']),
        timestamp: new Date().toISOString(),
        severity: randomElement(['low', 'medium', 'high'])
      })),
      answers: answers,
      questions: questions
    });
  }
  
  const { data, error } = await supabase.from('results').insert(results).select();
  
  if (error) {
    console.error('❌ Error seeding results:', error);
    throw error;
  }
  
  console.log(`✅ Seeded ${data.length} results`);
  return data;
}

// Seed Proctoring Events
async function seedProctoringEvents(sessions) {
  console.log('🔍 Seeding Proctoring Events...');
  const events = [];
  const eventTypes = [
    'face_detected', 'face_not_detected', 'multiple_faces', 'face_obscured',
    'tab_switch', 'window_blur', 'fullscreen_exit', 'right_click',
    'copy_attempt', 'paste_attempt', 'suspicious_movement', 'noise_detected'
  ];
  
  const flaggedSessions = sessions.filter(s => s.is_flagged || s.violation_count > 0);
  
  for (const session of flaggedSessions) {
    const numEvents = randomInt(1, session.violation_count + 2);
    
    for (let i = 0; i < numEvents; i++) {
      const eventType = randomElement(eventTypes);
      let severity = 'medium';
      if (['face_not_detected', 'tab_switch', 'copy_attempt'].includes(eventType)) {
        severity = 'high';
      } else if (['face_detected', 'noise_detected'].includes(eventType)) {
        severity = 'low';
      }
      
      events.push({
        session_id: session.id,
        event_type: eventType,
        severity: severity,
        confidence_score: randomFloat(0.5, 1.0),
        event_data: {
          timestamp: randomDate(
            new Date(session.start_time),
            session.end_time ? new Date(session.end_time) : new Date()
          ).toISOString(),
          description: `Proctoring event: ${eventType}`
        },
        is_processed: Math.random() > 0.3,
        action_taken: Math.random() > 0.5 ? randomElement(['warning', 'flag', 'none']) : null
      });
    }
  }
  
  // Insert in batches
  const batchSize = 30;
  let insertedCount = 0;
  
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    const { data, error } = await supabase.from('proctoring_events').insert(batch).select();
    
    if (error) {
      console.error(`❌ Error seeding proctoring events batch ${i / batchSize + 1}:`, error);
      continue;
    }
    
    insertedCount += data.length;
    console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}`);
  }
  
  console.log(`✅ Seeded ${insertedCount} proctoring events`);
  return insertedCount;
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Seed in order (respecting foreign keys)
    const organizations = await seedOrganizations();
    const profiles = await seedProfiles(organizations);
    const students = await seedStudents(profiles);
    const questions = await seedQuestions(profiles, organizations);
    const tests = await seedTests(profiles, organizations, questions);
    const sessions = await seedExamSessions(tests, students);
    const responsesCount = await seedExamResponses(sessions, questions);
    const results = await seedResults(sessions, students, tests);
    const eventsCount = await seedProctoringEvents(sessions);
    
    console.log('\n✨ Seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   - Organizations: ${organizations.length}`);
    console.log(`   - Profiles: ${profiles.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - Tests: ${tests.length}`);
    console.log(`   - Exam Sessions: ${sessions.length}`);
    console.log(`   - Exam Responses: ${responsesCount}`);
    console.log(`   - Results: ${results.length}`);
    console.log(`   - Proctoring Events: ${eventsCount}`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

