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



// Connect Database
await connectDB();



// Clear Database
const clearDatabase = async () => {

  console.log("\nClearing database...\n");

  await Promise.all([

    User.deleteMany(),

    Job.deleteMany(),

    Application.deleteMany(),

    Notification.deleteMany(),

    SavedJob.deleteMany(),

    MatchCache.deleteMany()
  ]);

  console.log("Database cleared successfully\n");
};



// Create Users
const createUsers = async () => {

  const hashedPassword =
    await bcrypt.hash("123456", 10);



  // Recruiters
  const recruiters = await User.insertMany([

    {
      name: "Ananya Sharma",
      email: "ananya.recruiter@google.com",
      password: hashedPassword,
      role: ROLES.RECRUITER
    },

    {
      name: "Rahul Verma",
      email: "rahul.hr@microsoft.com",
      password: hashedPassword,
      role: ROLES.RECRUITER
    },

    {
      name: "Sneha Reddy",
      email: "sneha.talent@amazon.com",
      password: hashedPassword,
      role: ROLES.RECRUITER
    }
  ]);



  // Students
  const students = await User.insertMany([

    {
      name: "Sai Teja",
      email: "student1@test.com",
      password: hashedPassword,
      role: ROLES.STUDENT,

      skills: [
        "Java",
        "Spring Boot",
        "MySQL",
        "DSA",
        "REST APIs",
        "Git"
      ],

      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_backend.pdf",

      resumeText:
        `
        Sai Teja
        Backend Developer

        Skills:
        Java, Spring Boot, MySQL, REST APIs,
        Data Structures and Algorithms, Git.

        Projects:
        1. Internship Portal using MERN Stack.
        2. Real-time Chat Application.

        Education:
        B.Tech Computer Science Engineering.
        `
    },



    {
      name: "Priya Nair",
      email: "student2@test.com",
      password: hashedPassword,
      role: ROLES.STUDENT,

      skills: [
        "React",
        "JavaScript",
        "Tailwind CSS",
        "Redux",
        "Figma"
      ],

      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_frontend.pdf",

      resumeText:
        `
        Priya Nair
        Frontend Developer

        Skills:
        React, JavaScript, Tailwind CSS,
        Redux, Responsive UI Design.

        Projects:
        1. E-Commerce Frontend.
        2. Portfolio Website.

        Education:
        B.Tech Information Technology.
        `
    },



    {
      name: "Arjun Patel",
      email: "student3@test.com",
      password: hashedPassword,
      role: ROLES.STUDENT,

      skills: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "Data Analysis",
        "Pandas"
      ],

      resumeUrl:
        "https://res.cloudinary.com/demo/raw/upload/sample_resume_ai.pdf",

      resumeText:
        `
        Arjun Patel
        AI/ML Enthusiast

        Skills:
        Python, TensorFlow, Machine Learning,
        Data Analysis, Pandas, NumPy.

        Projects:
        1. AI Resume Matcher.
        2. Student Prediction System.

        Education:
        B.Tech Artificial Intelligence.
        `
    }
  ]);



  console.log("Users created successfully\n");

  return {
    recruiters,
    students
  };
};



// Create Jobs
const createJobs = async (recruiters) => {

  const jobs = await Job.insertMany([

    {
      title: "Backend Developer Intern",

      company: "Google",

      description:
        `We are looking for a backend developer intern with strong knowledge in Java, APIs, databases, and scalable backend systems. The candidate should be comfortable working with REST APIs, debugging backend issues, and collaborating with frontend teams. Experience in Spring Boot and SQL databases is preferred.`,

      requiredSkills: [
        "Java",
        "Spring Boot",
        "MySQL",
        "REST APIs",
        "Git"
      ],

      location: "Bangalore",

      type: JOB_TYPES.HYBRID,

      stipend: 40000,

      deadline:
        new Date("2026-08-15"),

      createdBy:
        recruiters[0]._id
    },



    {
      title: "Frontend React Intern",

      company: "Microsoft",

      description:
        `Seeking a frontend developer intern proficient in React.js and modern UI development. The role includes building reusable components, integrating APIs, improving responsiveness, and collaborating with designers. Knowledge of state management and Tailwind CSS is preferred.`,

      requiredSkills: [
        "React",
        "JavaScript",
        "Tailwind CSS",
        "Redux"
      ],

      location: "Hyderabad",

      type: JOB_TYPES.ONSITE,

      stipend: 35000,

      deadline:
        new Date("2026-09-01"),

      createdBy:
        recruiters[1]._id
    },



    {
      title: "AI/ML Intern",

      company: "Amazon",

      description:
        `Amazon is hiring AI/ML interns passionate about machine learning systems and intelligent applications. Responsibilities include model development, experimentation, dataset preprocessing, and evaluation. Prior experience with TensorFlow or PyTorch is an advantage.`,

      requiredSkills: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "Pandas"
      ],

      location: "Remote",

      type: JOB_TYPES.REMOTE,

      stipend: 50000,

      deadline:
        new Date("2026-08-30"),

      createdBy:
        recruiters[2]._id
    }
  ]);



  console.log("Jobs created successfully\n");

  return jobs;
};



// Create Match Cache
const createMatchCache = async (students, jobs) => {

  const matchData = [

    {
      student: students[0]._id,
      job: jobs[0]._id,
      score: 92,

      matchedSkills: [
        "Java",
        "Spring Boot",
        "MySQL",
        "REST APIs"
      ],

      missingSkills: [
        "Docker"
      ],

      suggestion:
        "Strong backend profile. Improve DevOps knowledge for better fit."
    },



    {
      student: students[1]._id,
      job: jobs[1]._id,
      score: 95,

      matchedSkills: [
        "React",
        "JavaScript",
        "Tailwind CSS",
        "Redux"
      ],

      missingSkills: [],

      suggestion:
        "Excellent frontend candidate with strong UI development skills."
    },



    {
      student: students[2]._id,
      job: jobs[2]._id,
      score: 96,

      matchedSkills: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "Pandas"
      ],

      missingSkills: [
        "PyTorch"
      ],

      suggestion:
        "Very strong AI profile. Learning PyTorch would further improve match."
    }
  ];



  await MatchCache.insertMany(matchData);

  console.log("Match cache inserted successfully\n");
};



// Create Applications
const createApplications = async (students, jobs) => {

  const applications = await Application.insertMany([

    {
      student: students[0]._id,
      job: jobs[0]._id,

      resumeUrl:
        students[0].resumeUrl,

      status: "shortlisted",

      matchScore: 92,

      matchedSkills: [
        "Java",
        "Spring Boot",
        "MySQL"
      ],

      missingSkills: [
        "Docker"
      ],

      aiSuggestion:
        "Strong backend fundamentals."
    },



    {
      student: students[1]._id,
      job: jobs[1]._id,

      resumeUrl:
        students[1].resumeUrl,

      status: "reviewing",

      matchScore: 95,

      matchedSkills: [
        "React",
        "Redux"
      ],

      missingSkills: [],

      aiSuggestion:
        "Excellent frontend alignment."
    }
  ]);



  console.log("Applications created successfully\n");

  return applications;
};



// Create Notifications
const createNotifications = async (students, jobs) => {

  await Notification.insertMany([

    {
      user: students[0]._id,

      message:
        `You were shortlisted for Backend Developer Intern at Google`,

      type: "SHORTLIST",

      relatedJob: jobs[0]._id
    },



    {
      user: students[1]._id,

      message:
        `Successfully applied for Frontend React Intern`,

      type: "APPLICATION",

      relatedJob: jobs[1]._id
    }
  ]);



  console.log("Notifications created successfully\n");
};



// Create Saved Jobs
const createSavedJobs = async (students, jobs) => {

  await SavedJob.insertMany([

    {
      student: students[0]._id,
      job: jobs[2]._id
    },

    {
      student: students[1]._id,
      job: jobs[0]._id
    }
  ]);



  console.log("Saved jobs created successfully\n");
};



// Main Seed Function
const seedDatabase = async () => {

  try {

    await clearDatabase();

    const {
      recruiters,
      students
    } = await createUsers();

    const jobs =
      await createJobs(recruiters);

    await createMatchCache(
      students,
      jobs
    );

    await createApplications(
      students,
      jobs
    );

    await createNotifications(
      students,
      jobs
    );

    await createSavedJobs(
      students,
      jobs
    );



    console.log(
      "Database seeded successfully"
    );



    console.log("\nTest Accounts:\n");

    console.log(
      "Recruiter: ananya.recruiter@google.com | Password: 123456"
    );

    console.log(
      "Student: student1@test.com | Password: 123456"
    );



    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);
  }
};



seedDatabase();