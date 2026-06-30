import "../src/config/env.js";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../src/config/db.js";

import User from "../src/models/User.js";
import Job from "../src/models/Job.js";
import Application from "../src/models/Application.js";
import Notification from "../src/models/Notification.js";
import SavedJob from "../src/models/SavedJob.js";
import MatchCache from "../src/models/MatchCache.js";

import { ROLES } from "../src/constants/roles.js";
import { JOB_TYPES } from "../src/constants/jobTypes.js";
import { APPLICATION_STATUS } from "../src/constants/applicationStatus.js";
import { NOTIFICATION_TYPES } from "../src/constants/notificationTypes.js";

// ════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════

const NOW = new Date();

function daysFromNow(days) {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days) {
  return daysFromNow(-days);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function pickMany(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ════════════════════════════════════════════════════════════════
// DATA POOLS
// ════════════════════════════════════════════════════════════════

// Extended categories — recommend adding DevOps, Mobile, UI/UX, QA, Cloud
// to your frontend CATEGORIES array to match this richer dataset.
const CATEGORIES = [
  "frontend", "backend", "fullstack", "aiml",
  "datascience", "cybersecurity", "devops", "mobile", "uiux", "qa",
];

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Zomato", "Swiggy",
  "Razorpay", "Paytm", "PhonePe", "Cred", "Zoho", "Freshworks",
  "Postman", "BrowserStack", "Atlassian", "Adobe", "Salesforce",
  "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
  "Deloitte India", "Walmart Labs", "Uber India", "Ola", "Meesho",
  "Groww", "Unacademy", "Byju's", "Khatabook", "CRED", "Sharechat",
  "Dream11", "PolicyBazaar", "Nykaa", "Lenskart", "BharatPe", "Mamaearth",
];

const CITIES = [
  "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi",
  "Gurgaon", "Noida", "Kolkata", "Ahmedabad", "Kochi", "Vijayawada",
  "Coimbatore", "Indore", "Jaipur",
];

const COLLEGES = [
  "JNTUK", "VIT Vellore", "BITS Pilani", "NIT Trichy", "IIT Hyderabad",
  "Anna University", "SRM University", "Manipal Institute of Technology",
  "IIIT Hyderabad", "Amrita Vishwa Vidyapeetham", "PES University",
  "RV College of Engineering", "Thapar University", "Delhi Technological University",
  "VNR VJIET", "Andhra University", "Osmania University",
];

const DEGREES = ["B.Tech", "B.E", "M.Tech", "MCA", "BCA", "B.Sc"];

const BATCHES = ["2025", "2026", "2027", "2028"];

const PERKS_POOL = [
  "Certificate", "Letter of Recommendation", "PPI", "Flexible Hours",
  "Work From Home", "5-Day Week", "Mentorship Program", "Stipend on Time",
  "Networking Opportunities", "Free Snacks", "Health Insurance",
];

// Skill sets grouped by role archetype — used for both job requiredSkills
// and matching student skills, so AI match scores feel coherent.
const SKILL_SETS = {
  frontend: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Next.js", "Redux"],
  backend: ["Java", "Spring Boot", "Node.js", "Express.js", "MySQL", "MongoDB", "REST API", "Git"],
  fullstack: ["React", "Node.js", "Express.js", "MongoDB", "JavaScript", "REST API", "Git", "HTML", "CSS"],
  aiml: ["Python", "Machine Learning", "Artificial Intelligence", "Data Structures", "Algorithms"],
  datascience: ["Python", "Machine Learning", "Data Structures", "Algorithms", "MySQL", "PostgreSQL"],
  cybersecurity: ["Linux", "Python", "Git", "REST API", "AWS"],
  devops: ["Docker", "Kubernetes", "AWS", "Linux", "Git", "GitHub"],
  mobile: ["React", "JavaScript", "TypeScript", "Firebase", "REST API"],
  uiux: ["HTML", "CSS", "Tailwind CSS", "JavaScript"],
  qa: ["Java", "Python", "Git", "GitHub", "REST API"],
};

const JOB_TITLE_TEMPLATES = {
  frontend: ["Frontend Developer Intern", "React Developer Intern", "UI Engineer Intern", "Frontend Engineering Intern"],
  backend: ["Backend Developer Intern", "Java Backend Intern", "API Developer Intern", "Backend Engineering Intern"],
  fullstack: ["Full Stack Developer Intern", "MERN Stack Intern", "Full Stack Engineering Intern"],
  aiml: ["AI/ML Intern", "Machine Learning Intern", "AI Research Intern", "Applied ML Intern"],
  datascience: ["Data Science Intern", "Data Analyst Intern", "Data Engineering Intern"],
  cybersecurity: ["Cybersecurity Intern", "Security Analyst Intern", "Application Security Intern"],
  devops: ["DevOps Intern", "Cloud Infrastructure Intern", "Site Reliability Intern"],
  mobile: ["Mobile App Developer Intern", "React Native Intern", "Android Developer Intern"],
  uiux: ["UI/UX Design Intern", "Product Design Intern", "Visual Design Intern"],
  qa: ["QA Engineer Intern", "Software Test Engineer Intern", "Automation Testing Intern"],
};

const DESCRIPTION_TEMPLATES = {
  frontend: (company) => `${company} is looking for a frontend developer intern to build responsive, accessible user interfaces. You'll work closely with designers and backend engineers to ship production features, optimize performance, and maintain a component library used across multiple products.`,
  backend: (company) => `${company} is hiring a backend developer intern to design and build scalable APIs and services. Responsibilities include database schema design, writing efficient queries, implementing business logic, and collaborating with the frontend team on API contracts.`,
  fullstack: (company) => `${company} is seeking a full stack developer intern comfortable working across the entire stack — from database design to polished UI. You'll own features end-to-end, from requirement gathering through deployment.`,
  aiml: (company) => `${company} is hiring AI/ML interns passionate about machine learning systems and intelligent applications. Responsibilities include model development, experimentation, dataset preprocessing, and evaluation of model performance against production benchmarks.`,
  datascience: (company) => `${company} is looking for a data science intern to analyze large datasets, build predictive models, and present actionable insights to stakeholders. Strong statistical fundamentals and Python proficiency are expected.`,
  cybersecurity: (company) => `${company} is hiring a cybersecurity intern to assist with vulnerability assessments, security audits, and incident response. You'll work alongside the security team to harden infrastructure and review code for security flaws.`,
  devops: (company) => `${company} is seeking a DevOps intern to help build and maintain CI/CD pipelines, manage containerized deployments, and improve infrastructure reliability across cloud environments.`,
  mobile: (company) => `${company} is hiring a mobile app developer intern to build and ship features for our cross-platform mobile application, working closely with backend and design teams.`,
  uiux: (company) => `${company} is looking for a UI/UX design intern to create wireframes, prototypes, and polished interfaces for our core product. You'll collaborate with PMs and engineers throughout the design process.`,
  qa: (company) => `${company} is hiring a QA engineer intern to design test plans, write automated test suites, and ensure product quality before every release.`,
};

const SUGGESTION_TEMPLATES = [
  "Add a project demonstrating hands-on experience with the role's core technologies.",
  "Highlight measurable outcomes in your existing projects, such as performance improvements or user impact.",
  "Consider contributing to an open-source project to strengthen your GitHub profile.",
  "Add specific details about your role and contributions in team projects.",
  "Gaining experience with deployment and version control workflows would strengthen this application.",
];

const STRENGTH_TEMPLATES = [
  "Strong project portfolio relevant to the role",
  "Solid foundation in core required technologies",
  "Demonstrated problem-solving through DSA practice",
  "Good understanding of collaborative development workflows",
  "Relevant academic background for this domain",
];
// ════════════════════════════════════════════════════════════════
// CLEAR DATABASE
// ════════════════════════════════════════════════════════════════

const clearDatabase = async () => {
  console.log("\nClearing database...\n");

  await Promise.all([
    User.deleteMany(),
    Job.deleteMany(),
    Application.deleteMany(),
    Notification.deleteMany(),
    SavedJob.deleteMany(),
    MatchCache.deleteMany(),
  ]);

  console.log("Database cleared successfully\n");
};

// ════════════════════════════════════════════════════════════════
// CREATE RECRUITERS (15)
// ════════════════════════════════════════════════════════════════

const RECRUITER_NAMES = [
  "Ananya Sharma", "Rahul Verma", "Sneha Reddy", "Vikram Singh", "Pooja Iyer",
  "Karthik Nair", "Divya Menon", "Arjun Malhotra", "Neha Kapoor", "Sandeep Rao",
  "Meera Krishnan", "Aditya Joshi", "Ritu Bansal", "Manoj Pillai", "Kavya Desai",
];

const buildRecruiters = (hashedPassword) => {
  return RECRUITER_NAMES.map((name, i) => {
    const company = COMPANIES[i % COMPANIES.length];
    const emailName = name.toLowerCase().replace(/\s+/g, ".");
    return {
      name,
      email: `${emailName}@${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      password: hashedPassword,
      role: ROLES.RECRUITER,
      company,
      designation: pick(["HR Manager", "Talent Acquisition Lead", "Senior Recruiter", "People Operations Manager", "Engineering Manager"]),
      companyWebsite: `https://www.${company.toLowerCase().replace(/[^a-z]/g, "")}.com`,
      location: pick(CITIES),
      bio: i % 3 === 0 ? `Leading talent acquisition for ${company}'s engineering and product teams. Passionate about finding great early-career talent.` : "",
      profilePicture: "",
      linkedin: i % 2 === 0 ? `https://linkedin.com/in/${emailName}` : "",
      createdAt: daysAgo(randInt(30, 300)),
    };
  });
};

// ════════════════════════════════════════════════════════════════
// CREATE STUDENTS (30) — mixed profile completeness
// ════════════════════════════════════════════════════════════════

const STUDENT_NAMES = [
  "Sai Teja", "Priya Nair", "Arjun Patel", "Ananya Reddy", "Karan Mehta",
  "Sneha Iyer", "Rohit Sharma", "Divya Krishnan", "Aditya Kumar", "Pooja Singh",
  "Vikram Rao", "Meera Pillai", "Rahul Joshi", "Kavya Menon", "Siddharth Verma",
  "Anjali Gupta", "Naveen Reddy", "Shreya Bansal", "Akash Desai", "Riya Kapoor",
  "Manish Tiwari", "Sanjana Rao", "Varun Malhotra", "Lakshmi Narayan", "Yash Agarwal",
  "Ishita Sharma", "Pranav Kumar", "Tanvi Joshi", "Abhishek Singh", "Nandini Pillai",
];

const RESUME_TEMPLATES = {
  frontend: (name) => `${name}\nFrontend Developer\n\nSkills:\nReact, JavaScript, Tailwind CSS, Redux, Responsive UI Design, HTML, CSS.\n\nProjects:\n1. E-Commerce Frontend with React and Redux.\n2. Personal Portfolio Website with Tailwind CSS.\n3. Movie Recommendation UI consuming public APIs.\n\nEducation:\nB.Tech Computer Science Engineering.`,
  backend: (name) => `${name}\nBackend Developer\n\nSkills:\nJava, Spring Boot, MySQL, REST APIs, Data Structures and Algorithms, Git.\n\nProjects:\n1. Internship Portal Backend using Spring Boot and MySQL.\n2. Real-time Chat Application with WebSockets.\n3. Inventory Management REST API.\n\nEducation:\nB.Tech Computer Science Engineering.`,
  fullstack: (name) => `${name}\nFull Stack Developer\n\nSkills:\nReact, Node.js, Express.js, MongoDB, JavaScript, REST API, Git.\n\nProjects:\n1. InternPath - AI-powered internship platform (MERN stack).\n2. Social Media Clone with authentication and real-time chat.\n3. Task Management App with drag-and-drop.\n\nEducation:\nB.Tech Computer Science Engineering.`,
  aiml: (name) => `${name}\nAI/ML Enthusiast\n\nSkills:\nPython, TensorFlow, Machine Learning, Data Analysis, Pandas, NumPy.\n\nProjects:\n1. AI Resume Matcher using NLP.\n2. Student Performance Prediction System.\n3. Image Classification with CNN.\n\nEducation:\nB.Tech Artificial Intelligence.`,
  datascience: (name) => `${name}\nData Science Student\n\nSkills:\nPython, Machine Learning, Pandas, SQL, Data Visualization.\n\nProjects:\n1. Sales Forecasting Dashboard.\n2. Customer Churn Prediction Model.\n\nEducation:\nB.Tech Data Science.`,
};

const buildStudents = (hashedPassword) => {
  return STUDENT_NAMES.map((name, i) => {
    const emailName = name.toLowerCase().replace(/\s+/g, ".");
    const archetype = pick(["frontend", "backend", "fullstack", "aiml", "datascience"]);
    const skills = pickMany(SKILL_SETS[archetype] || SKILL_SETS.fullstack, randInt(4, 7));

    // Mixed completeness: roughly 1/3 fully complete, 1/3 partial, 1/3 minimal
    const completeness = i % 3; // 0 = full, 1 = partial, 2 = minimal

    const hasResume = completeness !== 2 || i % 5 === 0; // most have resumes
    const resumeFn = RESUME_TEMPLATES[archetype] || RESUME_TEMPLATES.fullstack;

    const base = {
      name,
      email: `${emailName.replace(/\./g, "")}${i}@test.com`,
      password: hashedPassword,
      role: ROLES.STUDENT,
      skills,
      college: pick(COLLEGES),
      location: pick(CITIES),
      createdAt: daysAgo(randInt(10, 280)),
      resumeVersion: randInt(1, 3),
    };

    if (hasResume) {
      base.resumeUrl = `https://res.cloudinary.com/internpath/raw/upload/resumes/${emailName.replace(/\./g, "_")}_resume.pdf`;
      base.resumeText = resumeFn(name);
    } else {
      base.resumeUrl = "";
      base.resumeText = "";
    }

    if (completeness === 0) {
      // Fully complete profile
      base.bio = pick([
        `${archetype === "aiml" ? "AI/ML enthusiast" : archetype === "frontend" ? "Frontend developer" : archetype === "backend" ? "Backend developer" : "Full stack developer"} passionate about building products that solve real problems. Always learning, always shipping.`,
        `Final-year student exploring ${archetype === "datascience" ? "data science" : "software engineering"}. Looking for an internship to apply classroom knowledge to real-world systems.`,
        `Competitive programmer turned product builder. Enjoys clean code, good architecture, and shipping fast.`,
      ]);
      base.github = `https://github.com/${emailName.replace(/\./g, "")}`;
      base.linkedin = `https://linkedin.com/in/${emailName.replace(/\./g, "-")}`;
      base.careerInterests = pickMany(
        ["Software Development", "Backend Development", "Frontend Development", "Machine Learning", "Cloud Computing", "Fintech", "Product Engineering"],
        randInt(2, 3)
      );
      base.achievements = pickMany([
        "Won college-level hackathon for best technical implementation",
        "Solved 250+ DSA problems on LeetCode",
        "Built and deployed 3 full-stack projects independently",
        "Contributed to an open-source repository on GitHub",
        "Completed AWS Cloud Practitioner certification",
        "Top 10 finisher in inter-college coding competition",
      ], randInt(2, 4));
      base.profilePicture = "";
    } else if (completeness === 1) {
      // Partial profile
      base.bio = i % 2 === 0 ? `${archetype === "frontend" ? "Frontend" : "Software"} developer in progress.` : "";
      base.github = i % 2 === 0 ? `https://github.com/${emailName.replace(/\./g, "")}` : "";
      base.linkedin = "";
      base.careerInterests = pickMany(["Software Development", "Web Development", "Backend Development"], 1);
      base.achievements = i % 2 === 0 ? ["Built a personal project using the MERN stack"] : [];
      base.profilePicture = "";
    } else {
      // Minimal profile — bare minimum, tests empty states
      base.bio = "";
      base.github = "";
      base.linkedin = "";
      base.careerInterests = [];
      base.achievements = [];
      base.profilePicture = "";
    }

    return { ...base, _archetype: archetype }; // _archetype used internally for job matching, stripped before insert
  });
};
// ════════════════════════════════════════════════════════════════
// CREATE JOBS (100) — spread across categories, mostly future deadlines
// ════════════════════════════════════════════════════════════════

const buildJobs = (recruiters) => {
  const jobs = [];

  for (let i = 0; i < 100; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const company = pick(COMPANIES);
    const recruiter = recruiters[i % recruiters.length];
    const titleTemplate = pick(JOB_TITLE_TEMPLATES[category] || JOB_TITLE_TEMPLATES.fullstack);
    const descFn = DESCRIPTION_TEMPLATES[category] || DESCRIPTION_TEMPLATES.fullstack;
    const skillPool = SKILL_SETS[category] || SKILL_SETS.fullstack;

    // Deadlines: ~80% in the future (platform feels active), ~20% recently closed
    const isClosed = i % 12 === 0; // ~8 closed listings for realism
    const deadline = isClosed
      ? daysAgo(randInt(1, 20))
      : daysFromNow(randInt(7, 120));

    const startDate = isClosed
      ? null
      : Math.random() > 0.4
        ? daysFromNow(randInt(5, 45))
        : null; // some jobs have "Flexible" start

    const openings = randInt(1, 15);
    const stipend = pick([0, 8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000]);

    jobs.push({
      title: titleTemplate,
      company,
      description: descFn(company),
      category,
      requiredSkills: pickMany(skillPool, randInt(4, Math.min(6, skillPool.length))),
      perks: pickMany(PERKS_POOL, randInt(2, 4)),
      location: pick([...CITIES, "Remote"]),
      mode: pick([JOB_TYPES.REMOTE, JOB_TYPES.HYBRID, JOB_TYPES.ONSITE]),
      stipend,
      duration: pick(["1 Month", "2 Months", "3 Months", "6 Months"]),
      openingsCount: openings,
      startDate,
      deadline,
      eligibleBatches: Math.random() > 0.3 ? pickMany(BATCHES, randInt(1, 3)) : [],
      eligibleDegrees: Math.random() > 0.3 ? pickMany(DEGREES, randInt(1, 2)) : [],
      minimumCGPA: Math.random() > 0.5 ? Number((randInt(60, 85) / 10).toFixed(1)) : undefined,
      status: isClosed ? "closed" : "active",
      featured: i % 15 === 0,
      createdBy: recruiter._id,
      isActive: !isClosed,
      createdAt: daysAgo(randInt(5, 200)),
      _category: category, // internal use for match generation, stripped before insert
    });
  }

  return jobs;
};
// ════════════════════════════════════════════════════════════════
// CREATE MATCH CACHE + APPLICATIONS — coherent, no 0% bugs
// ════════════════════════════════════════════════════════════════

// Generates a realistic match score by comparing a student's actual skills
// against a job's requiredSkills — never a random/fabricated number.
function computeRealisticMatch(studentSkills, jobSkills) {
  const studentSet = new Set(studentSkills.map((s) => s.toLowerCase()));
  const matchedSkills = jobSkills.filter((s) => studentSet.has(s.toLowerCase()));
  const missingSkills = jobSkills.filter((s) => !studentSet.has(s.toLowerCase()));

  const ratio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
  // Base score from skill overlap, with slight randomness so not every
  // student with the same overlap gets an identical score.
  const score = Math.min(100, Math.round(ratio * 100) + randInt(-5, 5));

  return {
    score: Math.max(5, score),
    matchedSkills,
    missingSkills,
  };
}

const buildMatchCacheAndApplications = (students, jobs) => {
  const matchCacheEntries = [];
  const applicationEntries = [];

  // Each student applies to 2-6 jobs that loosely match their archetype,
  // so AI scores feel coherent rather than random.
  students.forEach((student) => {
    if (!student.resumeUrl) return; // students without a resume can't have applied with a score

    const relevantJobs = jobs.filter((j) => j._category === student._archetype || j._category === "fullstack");
    const fallbackJobs = jobs.filter((j) => j.status === "active");
    const pool = relevantJobs.length >= 3 ? relevantJobs : fallbackJobs;

    const applyCount = randInt(2, 6);
    const chosenJobs = pickMany(pool, Math.min(applyCount, pool.length));

    chosenJobs.forEach((job, idx) => {
      const { score, matchedSkills, missingSkills } = computeRealisticMatch(student.skills, job.requiredSkills);

      const suggestion = missingSkills.length > 0
        ? `Consider strengthening: ${missingSkills.slice(0, 2).join(", ")}. ${pick(SUGGESTION_TEMPLATES)}`
        : pick(SUGGESTION_TEMPLATES);

      const strengths = matchedSkills.length > 0
        ? [`Strong alignment in ${matchedSkills.slice(0, 2).join(" and ")}`, pick(STRENGTH_TEMPLATES)]
        : [];

      // MatchCache entry — always created when a student has checked match
      matchCacheEntries.push({
        student: student._id,
        job: job._id,
        score,
        matchedSkills,
        missingSkills,
        strengths,
        suggestion,
        resumeVersion: student.resumeVersion,
      });

      // Not every checked match becomes an application (realistic funnel)
      const didApply = idx < Math.ceil(applyCount * 0.7);
      if (!didApply) return;

      // Status distribution: most applied, some progress further
      const statusRoll = Math.random();
      let status = APPLICATION_STATUS.APPLIED;
      if (statusRoll > 0.85) status = APPLICATION_STATUS.SELECTED;
      else if (statusRoll > 0.7) status = APPLICATION_STATUS.REJECTED;
      else if (statusRoll > 0.55) status = APPLICATION_STATUS.INTERVIEW;
      else if (statusRoll > 0.35) status = APPLICATION_STATUS.SHORTLISTED;

      applicationEntries.push({
        student: student._id,
        job: job._id,
        resumeUrl: student.resumeUrl,
        status,
        matchScore: score, // always the real computed score — never 0 by default
        matchedSkills,
        missingSkills,
        aiSuggestion: suggestion,
        createdAt: daysAgo(randInt(1, 60)),
      });
    });
  });

  return { matchCacheEntries, applicationEntries };
};

// ════════════════════════════════════════════════════════════════
// CREATE NOTIFICATIONS — derived from real application status changes
// ════════════════════════════════════════════════════════════════

const buildNotifications = (applications, jobsById, studentsById) => {
  const notifications = [];

  applications.forEach((app) => {
    const job = jobsById[app.job.toString()];
    const student = studentsById[app.student.toString()];
    if (!job || !student) return;

    // Always notify on the initial application
    notifications.push({
      user: app.student,
      message: `Successfully applied for ${job.title} at ${job.company}`,
      type: NOTIFICATION_TYPES.APPLICATION,
      job: app.job,
      isRead: Math.random() > 0.4,
      createdAt: app.createdAt,
    });

    const stageMessages = {
      [APPLICATION_STATUS.SHORTLISTED]: { type: NOTIFICATION_TYPES.SHORTLISTED, msg: `You were shortlisted for ${job.title} at ${job.company}` },
      [APPLICATION_STATUS.INTERVIEW]:   { type: NOTIFICATION_TYPES.INTERVIEW,   msg: `You've been moved to the interview stage for ${job.title} at ${job.company}` },
      [APPLICATION_STATUS.SELECTED]:    { type: NOTIFICATION_TYPES.SELECTED,    msg: `Congratulations! You were selected for ${job.title} at ${job.company}` },
      [APPLICATION_STATUS.REJECTED]:    { type: NOTIFICATION_TYPES.REJECTED,    msg: `Your application for ${job.title} at ${job.company} was not selected this time` },
    };

    if (stageMessages[app.status]) {
      notifications.push({
        user: app.student,
        message: stageMessages[app.status].msg,
        type: stageMessages[app.status].type,
        job: app.job,
        isRead: Math.random() > 0.5,
        createdAt: daysAgo(randInt(0, 15)),
      });
    }
  });

  // A few system notifications for variety
  Object.values(studentsById).slice(0, 10).forEach((student) => {
    if (Math.random() > 0.5) {
      notifications.push({
        user: student._id,
        message: "Complete your profile to get better AI match scores.",
        type: NOTIFICATION_TYPES.SYSTEM,
        job: null,
        isRead: Math.random() > 0.6,
        createdAt: daysAgo(randInt(1, 30)),
      });
    }
  });

  return notifications;
};

// ════════════════════════════════════════════════════════════════
// CREATE SAVED JOBS
// ════════════════════════════════════════════════════════════════

const buildSavedJobs = (students, jobs) => {
  const saved = [];
  const activeJobs = jobs.filter((j) => j.status === "active");

  students.forEach((student) => {
    if (Math.random() > 0.6) return; // not everyone saves jobs
    const count = randInt(1, 4);
    const chosen = pickMany(activeJobs, count);
    chosen.forEach((job) => {
      saved.push({
        student: student._id,
        job: job._id,
        createdAt: daysAgo(randInt(1, 90)),
      });
    });
  });

  return saved;
};

// ════════════════════════════════════════════════════════════════
// MAIN SEED RUNNER
// ════════════════════════════════════════════════════════════════

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    const hashedPassword = await bcrypt.hash("123456", 10);

    console.log("Creating recruiters...");
    const recruiterDocs = buildRecruiters(hashedPassword);
    const recruiters = await User.insertMany(recruiterDocs);
    console.log(`${recruiters.length} recruiters created\n`);

    console.log("Creating students...");
    const studentDocs = buildStudents(hashedPassword);
    // strip internal _archetype field before insert, keep a lookup map after
    const studentsToInsert = studentDocs.map(({ _archetype, ...rest }) => rest);
    const insertedStudents = await User.insertMany(studentsToInsert);
    // re-attach _archetype using index alignment for downstream matching logic
    const students = insertedStudents.map((doc, i) => ({ ...doc.toObject(), _archetype: studentDocs[i]._archetype }));
    console.log(`${students.length} students created\n`);

    console.log("Creating jobs...");
    const jobDocs = buildJobs(recruiters);
    const jobsToInsert = jobDocs.map(({ _category, ...rest }) => rest);
    const insertedJobs = await Job.insertMany(jobsToInsert);
    const jobs = insertedJobs.map((doc, i) => ({ ...doc.toObject(), _category: jobDocs[i]._category }));
    console.log(`${jobs.length} jobs created\n`);

    console.log("Generating match cache and applications...");
    const { matchCacheEntries, applicationEntries } = buildMatchCacheAndApplications(students, jobs);

    await MatchCache.insertMany(matchCacheEntries);
    console.log(`${matchCacheEntries.length} match cache entries created`);

    const insertedApplications = await Application.insertMany(applicationEntries);
    console.log(`${insertedApplications.length} applications created\n`);

    console.log("Creating notifications...");
    const jobsById = Object.fromEntries(jobs.map((j) => [j._id.toString(), j]));
    const studentsById = Object.fromEntries(students.map((s) => [s._id.toString(), s]));
    const notificationDocs = buildNotifications(insertedApplications, jobsById, studentsById);
    await Notification.insertMany(notificationDocs);
    console.log(`${notificationDocs.length} notifications created\n`);

    console.log("Creating saved jobs...");
    const savedJobDocs = buildSavedJobs(students, jobs);
    await SavedJob.insertMany(savedJobDocs);
    console.log(`${savedJobDocs.length} saved jobs created\n`);

    console.log("════════════════════════════════════════");
    console.log("✅ Database seeded successfully");
    console.log("════════════════════════════════════════\n");

    console.log("Test Accounts (all passwords: 123456):\n");
    console.log(`Recruiter: ${recruiters[0].email}`);
    console.log(`Recruiter: ${recruiters[1].email}`);
    console.log(`Student (full profile):    ${students[0].email}`);
    console.log(`Student (partial profile): ${students[1].email}`);
    console.log(`Student (minimal profile): ${students[2].email}\n`);

    console.log(`Summary: ${recruiters.length} recruiters · ${students.length} students · ${jobs.length} jobs · ${insertedApplications.length} applications · ${matchCacheEntries.length} match scores\n`);

    process.exit();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedDatabase();