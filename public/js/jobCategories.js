const jobCategories = [
    {
        jobCategory: "Software Development",
        jobNames: ["Software Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"],
        skillsNeeded: ["Python", "Java", "Golang", "JavaScript", "HTML/CSS", "Vue.js", "Bootstrap", "Tailwind CSS", "React", "Next.js", "Node.js", "Express.js", "Version Control (Git)", "Testing/Debugging", "Database Management", "Continuous Integration/Continuous Deployment (CI/CD)"]
    },
    {
        jobCategory: "Cybersecurity",
        jobNames: ["Cybersecurity Analyst", "Security Engineer", "Information Security Manager", "Penetration Tester", "Security Consultant"],
        skillsNeeded: ["Network Security", "Risk Assessment", "Penetration Testing", "Incident Response", "Cryptography", "Firewalls", "Security Information and Event Management (SIEM)", "Vulnerability Assessment"]
    },
    {
        jobCategory: "Data Science",
        jobNames: ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Data Engineer", "Statistician"],
        skillsNeeded: ["Python", "R", "Machine Learning", "Data Visualization", "Statistical Analysis", "SQL", "Big Data", "Data Cleaning", "Genetic Algorithms", "AWS Services", "Functions and Graphs", "Data Warehousing"]
    },
    {
        jobCategory: "Artificial Intelligence",
        jobNames: ["AI Researcher", "AI Engineer", "Machine Learning Scientist", "AI Product Manager", "Robotics Engineer"],
        skillsNeeded: ["Machine Learning", "Deep Learning", "Natural Language Processing", "Python", "TensorFlow", "PyTorch", "Computer Vision", "Algorithm Development", "Genetic Algorithms", "Sci-kit Learn", "AWS Services"]
    },
    {
        jobCategory: "Human Resources",
        jobNames: ["HR Manager", "Recruitment Specialist", "HR Analyst", "HR Coordinator", "Talent Acquisition Specialist"],
        skillsNeeded: ["Communication", "Conflict Resolution", "Employee Relations", "Recruitment", "HR Software", "Organizational Skills", "Performance Management", "Training and Development"]
    },
    {
        jobCategory: "Management",
        jobNames: ["IT Project Manager", "Product Manager", "Technical Program Manager", "IT Operations Manager", "Scrum Master"],
        skillsNeeded: ["Project Management", "Agile Methodologies", "Leadership", "Risk Management", "Budgeting", "Stakeholder Management", "Communication", "Team Building"]
    }
]

Object.freeze(jobCategories)

export default jobCategories
