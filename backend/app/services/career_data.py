"""
CareerCompass AI - Career Knowledge Base & Domain Mapping
=========================================================
Contains comprehensive metadata for all 22 career categories:
- Descriptions & Market Opportunities
- Required Technical & Soft Skills
- Verified Learning Milestones & Course Recommendations
"""

CAREER_KNOWLEDGE_BASE = {
    "Machine Learning Engineer": {
        "description": "Designs, builds, and deploys predictive machine learning systems into production environments, optimizing scalable data pipelines and serving infrastructure.",
        "category": "AI/ML",
        "market_outlook": "High Demand - 28% Projected Industry Growth",
        "required_technical_skills": ["Python", "Machine Learning", "SQL", "C++", "Docker", "PyTorch", "Scikit-Learn"],
        "required_soft_skills": ["Problem Solving", "Mathematical Reasoning", "Teamwork", "Analytical Thinking"],
        "opportunities": ["AI Product Engineer", "MLOps Engineer", "Algorithm Engineer", "Data Platform Specialist"],
        "explanation": "Your background in programming, quantitative problem solving, and technical fields demonstrates strong aptitude for engineering machine learning pipelines.",
        "roadmap": {
            "timeline": "6 to 9 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master modern Python for scientific computing", "Understand linear algebra, probability & multivariate calculus", "Clean and manipulate tabular datasets"],
                    "skills": ["Python", "NumPy", "Pandas", "Matplotlib", "Git"],
                    "suggested_projects": ["Exploratory Data Analysis Portfolio", "Housing Price Regression Pipeline"],
                    "recommended_courses": [
                        {"title": "Scientific Computing with Python", "platform": "freeCodeCamp", "description": "Hands-on foundation in Python syntax, data structures, and algorithms.", "type": "free"},
                        {"title": "Mathematics for Machine Learning", "platform": "Coursera (Imperial College)", "description": "Linear algebra, multivariate calculus, and PCA foundations.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Implement supervised & unsupervised ML algorithms", "Master model evaluation, cross-validation & hyperparameter tuning", "Work with gradient boosted decision trees"],
                    "skills": ["Scikit-Learn", "XGBoost", "Feature Engineering", "SQL", "Model Evaluation"],
                    "suggested_projects": ["Customer Churn Prediction API", "Credit Scoring Risk Classifier"],
                    "recommended_courses": [
                        {"title": "Machine Learning Specialization", "platform": "DeepLearning.AI / Coursera", "description": "Core ML concepts taught by Andrew Ng.", "type": "certification"},
                        {"title": "Kaggle Intermediate Machine Learning", "platform": "Kaggle", "description": "Categorical encoders, missing value imputation, and XGBoost.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-9",
                    "objectives": ["Deploy models using FastAPI and Docker", "Set up CI/CD model tracking and telemetry", "Scale distributed training and MLOps"],
                    "skills": ["Docker", "FastAPI", "MLflow", "Cloud Deployment (AWS/GCP)", "PyTorch"],
                    "suggested_projects": ["End-to-End Real-Time Model Serving Microservice", "Automated Drift Monitoring Pipeline"],
                    "recommended_courses": [
                        {"title": "Machine Learning Engineering for Production (MLOps)", "platform": "DeepLearning.AI", "description": "Production pipelines, serving, and continuous monitoring.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Data Scientist": {
        "description": "Extracts actionable insights from complex unstructured and structured data using statistical inference, machine learning, and predictive modeling.",
        "category": "Data Science",
        "market_outlook": "High Demand - 25% Projected Growth",
        "required_technical_skills": ["Python", "Data Analysis", "SQL", "Machine Learning", "Statistics", "R"],
        "required_soft_skills": ["Critical Thinking", "Communication", "Business Acumen", "Curiosity"],
        "opportunities": ["Decision Scientist", "Quantitative Researcher", "Analytics Lead", "AI Strategist"],
        "explanation": "Your combination of analytical interest, statistical aptitude, and programming skills fits the cross-functional nature of modern data science.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master SQL data extraction and joining", "Perform rigorous EDA with Pandas and Seaborn", "Learn hypothesis testing and probability distributions"],
                    "skills": ["SQL", "Python", "Pandas", "Descriptive Statistics", "Data Storytelling"],
                    "suggested_projects": ["E-Commerce Customer Behavior Analysis", "COVID-19 Epidemiological Dashboard"],
                    "recommended_courses": [
                        {"title": "Google Data Analytics Professional Certificate", "platform": "Coursera", "description": "SQL, data cleaning, and spreadsheet analysis.", "type": "certification"},
                        {"title": "Data Analysis with Python", "platform": "freeCodeCamp", "description": "NumPy, Pandas, and interactive visual data representations.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Build regression, classification, and clustering models", "Conduct A/B testing and statistical power calculations", "Extract insights from unstructured text data"],
                    "skills": ["Scikit-Learn", "Hypothesis Testing", "A/B Testing", "Feature Engineering"],
                    "suggested_projects": ["A/B Testing Experiment Simulator", "Customer Segmentation Clustering Engine"],
                    "recommended_courses": [
                        {"title": "Applied Data Science with Python", "platform": "University of Michigan (Coursera)", "description": "Applied statistics and ML on real-world datasets.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Productionize analytics dashboards with Streamlit", "Build automated ETL pipelines and cloud data warehouse queries", "Present executive strategic findings"],
                    "skills": ["Streamlit", "BigQuery / Snowflake", "Data Storytelling", "Cloud Analytics"],
                    "suggested_projects": ["Executive Strategic Predictive Business Intelligence Portal"],
                    "recommended_courses": [
                        {"title": "Data Science Capstone & Portfolio", "platform": "edX / HarvardX", "description": "Comprehensive capstone project evaluation.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Data Analyst": {
        "description": "Transforms raw operational data into visual dashboards, key performance metrics, and business intelligence reports to empower executive decisions.",
        "category": "Data Science",
        "market_outlook": "High Demand - 22% Industry Growth",
        "required_technical_skills": ["SQL", "Data Analysis", "Excel", "PowerBI", "Python", "Tableau"],
        "required_soft_skills": ["Communication", "Attention to Detail", "Business Acumen", "Problem Solving"],
        "opportunities": ["BI Developer", "Marketing Analyst", "Operations Data Analyst", "Financial Analyst"],
        "explanation": "Your structured analytical mindset and strong attention to detail provide the ideal foundation for translating data into strategic dashboards.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master advanced Excel (VLOOKUP, INDEX-MATCH, Pivot Tables)", "Learn relational database querying with SQL"],
                    "skills": ["Advanced Excel", "SQL Queries", "Data Cleaning"],
                    "suggested_projects": ["Sales Performance Spreadsheet Model", "Retail Database Query Library"],
                    "recommended_courses": [
                        {"title": "Excel Skills for Business", "platform": "Macquarie University / Coursera", "description": "Professional spreadsheet data manipulation.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Build interactive executive dashboards in Power BI or Tableau", "Automate data workflows using Python"],
                    "skills": ["PowerBI / Tableau", "Python Basics", "DAX Formulas", "KPI Tracking"],
                    "suggested_projects": ["Interactive SaaS KPI Executive Dashboard"],
                    "recommended_courses": [
                        {"title": "Microsoft Power BI Data Analyst (PL-300)", "platform": "Microsoft Learn", "description": "Official Microsoft certification pathway.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Connect dashboards to live cloud databases", "Synthesize findings into strategic stakeholder presentations"],
                    "skills": ["Data Warehousing", "Executive Communication", "Data Storytelling"],
                    "suggested_projects": ["Full-Scale Business Intelligence Portfolio"],
                    "recommended_courses": [
                        {"title": "Storytelling with Data", "platform": "edX", "description": "Effective data visualization and stakeholder alignment.", "type": "free"}
                    ]
                }
            ]
        }
    },
    "Frontend Developer": {
        "description": "Architects responsive, accessible, high-performance web applications and delightful interactive user interfaces using modern client-side technologies.",
        "category": "Software Development",
        "market_outlook": "Very High Demand - 20% Industry Growth",
        "required_technical_skills": ["HTML/CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Next.js"],
        "required_soft_skills": ["Design Empathy", "Attention to Detail", "Communication", "Collaboration"],
        "opportunities": ["UI Engineer", "React Specialist", "Design Systems Engineer", "Web Application Architect"],
        "explanation": "Your creative orientation, interest in software development, and technical problem solving match client-side web development.",
        "roadmap": {
            "timeline": "5 to 7 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master semantic HTML5, modern CSS3 (Flexbox/Grid), and JavaScript ES6+ fundamentals", "Build accessible, responsive static sites"],
                    "skills": ["HTML5", "CSS3", "JavaScript (ES6+)", "Git & GitHub"],
                    "suggested_projects": ["Responsive Product Landing Page", "Interactive Task Management Web App"],
                    "recommended_courses": [
                        {"title": "Responsive Web Design Certification", "platform": "freeCodeCamp", "description": "HTML, CSS, accessibility, and modern responsive layouts.", "type": "free"},
                        {"title": "JavaScript Algorithms and Data Structures", "platform": "freeCodeCamp", "description": "Object-oriented, functional, and algorithmic JavaScript.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Master React component architecture, state hooks, and routing", "Implement Tailwind CSS and TypeScript for type-safe applications"],
                    "skills": ["React.js", "TypeScript", "Tailwind CSS", "React Router", "REST API Consumption"],
                    "suggested_projects": ["E-Commerce Storefront with Cart & Filtering", "Real-Time Weather & Location Hub"],
                    "recommended_courses": [
                        {"title": "The Joy of React", "platform": "Joy of React (Josh Comeau)", "description": "Deep component mental models and performance.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-7",
                    "objectives": ["Server-Side Rendering (SSR) with Next.js", "State management with Zustand/Redux", "Web performance optimization & Core Web Vitals"],
                    "skills": ["Next.js", "State Management", "Performance Optimization", "Testing (Jest / Playwright)"],
                    "suggested_projects": ["Full-Stack SaaS Client Application with Auth & Real-Time Sync"],
                    "recommended_courses": [
                        {"title": "Next.js Official Learn Platform", "platform": "Nextjs.org", "description": "Modern App Router, SSR, and dynamic route handlers.", "type": "free"}
                    ]
                }
            ]
        }
    },
    "Backend Developer": {
        "description": "Engineers robust server-side architectures, REST and GraphQL APIs, database schemas, and microservice infrastructures powering modern applications.",
        "category": "Software Development",
        "market_outlook": "High Demand - 24% Growth",
        "required_technical_skills": ["Node.js", "Python", "SQL", "Java", "Docker", "REST APIs", "Redis"],
        "required_soft_skills": ["Systems Thinking", "Debugging Persistence", "Security Mindset", "Teamwork"],
        "opportunities": ["API Architect", "Cloud Systems Engineer", "Microservices Engineer", "Database Specialist"],
        "explanation": "Your technical skills in languages like Python/Java/Node.js and relational databases match high-throughput backend systems engineering.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master server-side language fundamentals (Node.js/Python)", "Build basic REST endpoints and connect to relational databases"],
                    "skills": ["Python / Node.js", "SQL Basics", "HTTP Protocols", "Git"],
                    "suggested_projects": ["Book Review CRUD API", "CLI Database Management Utility"],
                    "recommended_courses": [
                        {"title": "Back End Development and APIs", "platform": "freeCodeCamp", "description": "Node.js, Express, and MongoDB basics.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Implement JWT authentication and RBAC security", "Design normalized PostgreSQL schemas with SQLAlchemy / Prisma", "Write unit and integration test suites"],
                    "skills": ["FastAPI / Express", "PostgreSQL", "JWT Authentication", "ORM Optimization"],
                    "suggested_projects": ["Multi-Tenant Authentication & Organization API", "E-Commerce Order Processing Engine"],
                    "recommended_courses": [
                        {"title": "FastAPI Masterclass", "platform": "FastAPI Official Docs & Tutorials", "description": "Pydantic validation, async endpoints, and dependency injection.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Containerize microservices with Docker and Docker Compose", "Implement Redis caching and background task workers (Celery)", "Deploy to AWS or GCP with CI/CD"],
                    "skills": ["Docker", "Redis", "Message Queues", "Cloud Deployment", "Microservices Architecture"],
                    "suggested_projects": ["High-Concurrency Real-Time Event Processing Backend"],
                    "recommended_courses": [
                        {"title": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "description": "Microservice containerization and orchestration.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Full Stack Developer": {
        "description": "Bridges frontend user experiences with backend services, managing end-to-end web architectures, databases, and continuous delivery.",
        "category": "Software Development",
        "market_outlook": "Extremely High Demand - 26% Growth",
        "required_technical_skills": ["JavaScript", "React", "Node.js", "Python", "SQL", "Tailwind CSS", "Docker"],
        "required_soft_skills": ["Adaptability", "Holistic Problem Solving", "Time Management", "Collaboration"],
        "opportunities": ["Lead Full Stack Engineer", "Technical Co-Founder", "Solutions Architect", "Product Engineer"],
        "explanation": "Your versatile proficiency across client-side interfaces and server-side data logic makes you ideal for full-stack product development.",
        "roadmap": {
            "timeline": "7 to 9 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-3",
                    "objectives": ["Master HTML, CSS, JavaScript, and Node.js fundamentals", "Understand relational databases and API design"],
                    "skills": ["HTML/CSS", "JavaScript", "Node.js", "PostgreSQL", "Git"],
                    "suggested_projects": ["Full-Stack Note Taking App with Authentication"],
                    "recommended_courses": [
                        {"title": "Full Stack Open", "platform": "University of Helsinki", "description": "Deep dive into React, Redux, Node.js, and TypeScript.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 4-6",
                    "objectives": ["Build production-grade Single Page Applications in React with TypeScript", "Develop secure RESTful backend APIs with relational ORMs"],
                    "skills": ["React.js", "TypeScript", "FastAPI / Express", "ORM", "Tailwind CSS"],
                    "suggested_projects": ["Collaborative Project Management Platform"],
                    "recommended_courses": [
                        {"title": "Meta Front-End & Back-End Certificates", "platform": "Coursera", "description": "Comprehensive full stack industry curriculum.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 7-9",
                    "objectives": ["Deploy end-to-end applications to cloud platforms (Vercel + Render / AWS)", "Implement automated CI/CD and containerized testing"],
                    "skills": ["Docker", "CI/CD Pipelines", "System Architecture", "Performance Tuning"],
                    "suggested_projects": ["Production SaaS Application with Stripe Payments & Analytics"],
                    "recommended_courses": [
                        {"title": "AWS Certified Developer - Associate", "platform": "AWS Skill Builder", "description": "Cloud native application architecture.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Cybersecurity Analyst": {
        "description": "Protects organizational networks, applications, and sensitive assets by monitoring threats, analyzing vulnerabilities, and mitigating security incidents.",
        "category": "Cybersecurity",
        "market_outlook": "Critical Demand - 32% Projected Growth",
        "required_technical_skills": ["Networking Protocols", "Security Principles", "Python", "SQL", "SIEM Tools", "Linux"],
        "required_soft_skills": ["Analytical Vigilance", "Ethics & Integrity", "Crisis Communication", "Curiosity"],
        "opportunities": ["SOC Analyst", "Threat Intelligence Researcher", "Incident Responder", "Compliance Officer"],
        "explanation": "Your vigilance, analytical rigor, and interest in system defense make you well suited for proactive cybersecurity operations.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master TCP/IP, OSI model, DNS, and subnetting", "Learn Linux commands, permissions, and bash scripting"],
                    "skills": ["Computer Networks", "Linux Administration", "Cyber Fundamentals"],
                    "suggested_projects": ["Home Security Lab on VirtualBox", "Network Traffic Sniffing with Wireshark"],
                    "recommended_courses": [
                        {"title": "Google Cybersecurity Professional Certificate", "platform": "Coursera", "description": "Hands-on SOC tools, Python scripting, and Linux commands.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Master vulnerability scanning and security frameworks (NIST / ISO)", "Analyze security event logs in SIEM environments (Splunk)"],
                    "skills": ["SIEM (Splunk)", "Vulnerability Assessment", "Python for Security", "Firewalls"],
                    "suggested_projects": ["Automated Log Anomaly Detector", "SOC Incident Simulation Lab"],
                    "recommended_courses": [
                        {"title": "CompTIA Security+ (SY0-701) Prep", "platform": "Professor Messer / edX", "description": "Universal gold-standard entry security certification.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Practice threat hunting and incident response scenarios", "Prepare for industry certifications (Security+, CySA+)"],
                    "skills": ["Threat Hunting", "Incident Response", "Cloud Security", "Hardening"],
                    "suggested_projects": ["Enterprise Security Audit and Compliance Policy Portfolio"],
                    "recommended_courses": [
                        {"title": "Certified SOC Analyst (CSA)", "platform": "EC-Council / TryHackMe", "description": "Practical SOC analyst cyber defense labs.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Ethical Hacker": {
        "description": "Simulates adversary attacks against networks, web applications, and physical systems to uncover and remediate exploitable vulnerabilities.",
        "category": "Cybersecurity",
        "market_outlook": "Very High Demand - 29% Growth",
        "required_technical_skills": ["Penetration Testing", "C++", "Python", "Linux", "Burp Suite", "Metasploit"],
        "required_soft_skills": ["Unconventional Problem Solving", "Tenacity", "Strict Ethical Compass", "Reporting"],
        "opportunities": ["Penetration Tester", "Red Team Specialist", "Security Researcher", "Bug Bounty Hunter"],
        "explanation": "Your strong technical orientation, curiosity to test system boundaries, and problem-solving tenacity match offensive security research.",
        "roadmap": {
            "timeline": "6 to 9 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master networking, Linux CLI, and Python automation", "Learn OWASP Top 10 vulnerabilities"],
                    "skills": ["Linux", "OWASP Top 10", "Python Scripting", "Networking"],
                    "suggested_projects": ["Basic Port Scanner in Python", "OWASP Juice Shop Vulnerability Exploit Lab"],
                    "recommended_courses": [
                        {"title": "Pre-Security Pathway", "platform": "TryHackMe", "description": "Interactive cybersecurity fundamentals and basics.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Master Burp Suite for web penetration testing", "Practice privilege escalation on Linux and Windows targets"],
                    "skills": ["Burp Suite", "Privilege Escalation", "Metasploit", "Vulnerability Discovery"],
                    "suggested_projects": ["Web Application Vulnerability Assessment Report", "CTF Walkthrough Portfolio"],
                    "recommended_courses": [
                        {"title": "Jr. Penetration Tester Pathway", "platform": "TryHackMe", "description": "Hands-on offensive penetration testing methodology.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-9",
                    "objectives": ["Solve active Hack The Box intermediate machines", "Author professional penetration test remediation reports", "Prepare for eJPT or OSCP"],
                    "skills": ["Advanced Exploitation", "Active Directory Attacks", "Security Remediation"],
                    "suggested_projects": ["Full External and Internal Penetration Testing Audit Report"],
                    "recommended_courses": [
                        {"title": "eLearnSecurity Junior Penetration Tester (eJPT)", "platform": "INE Security", "description": "Hands-on practical penetration testing exam.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Security Engineer": {
        "description": "Architects, engineers, and enforces security infrastructure, encryption protocols, IAM policies, and cloud defenses across software development lifecycles.",
        "category": "Cybersecurity",
        "market_outlook": "High Demand - 27% Growth",
        "required_technical_skills": ["Cloud Security (Azure/AWS)", "Java", "C++", "Docker", "Cryptography", "IAM"],
        "required_soft_skills": ["Risk Management", "Collaboration", "Process Discipline", "Communication"],
        "opportunities": ["Cloud Security Architect", "DevSecOps Engineer", "AppSec Specialist", "Infrastructure Lead"],
        "explanation": "Your engineering stream qualifications and technical depth match the systemic architecture and cloud security engineering domain.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand core cryptographic primitives, PKI, and TLS", "Master Linux hardening and network firewall configuration"],
                    "skills": ["Cryptography Basics", "Linux Hardening", "Firewalls", "Networking"],
                    "suggested_projects": ["Automated TLS Certificate Provisioner and Audit Tool"],
                    "recommended_courses": [
                        {"title": "Introduction to Cyber Security", "platform": "OpenLearn", "description": "Comprehensive engineering security principles.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Implement Identity & Access Management (IAM) and Zero Trust", "Integrate SAST and DAST security scanning into CI/CD pipelines"],
                    "skills": ["DevSecOps", "Cloud IAM", "Docker Security", "Security Automation"],
                    "suggested_projects": ["Secure CI/CD Pipeline with Automated SonarQube & Trivy Scans"],
                    "recommended_courses": [
                        {"title": "AWS Certified Security - Specialty", "platform": "AWS Training", "description": "Cloud security engineering and threat detection.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Architect resilient cloud infrastructure using Terraform", "Implement zero-trust security postures and disaster recovery plans"],
                    "skills": ["Infrastructure as Code", "Zero Trust Architecture", "SIEM Integration"],
                    "suggested_projects": ["Terraform-Hardened Multi-Region Cloud VPC Infrastructure"],
                    "recommended_courses": [
                        {"title": "Certified Cloud Security Professional (CCSP)", "platform": "ISC2", "description": "Premier global cloud security certification.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "AI Researcher": {
        "description": "Advances the theoretical and empirical frontiers of artificial intelligence, authoring papers, designing novel model architectures, and proving algorithmic advances.",
        "category": "AI/ML",
        "market_outlook": "High Prestige & Demand - 30% Growth",
        "required_technical_skills": ["Python", "PyTorch", "Mathematical Proofs", "Deep Learning", "Transformers", "NLP"],
        "required_soft_skills": ["Intellectual Rigor", "Scientific Curiosity", "Academic Writing", "Resilience"],
        "opportunities": ["Research Scientist", "AI Research Fellow", "Applied Scientist", "Algorithm Designer"],
        "explanation": "Your postgraduate educational background, academic achievements, and analytical interests align with experimental AI research.",
        "roadmap": {
            "timeline": "8 to 12 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-3",
                    "objectives": ["Master deep learning mathematics (calculus, linear algebra, information theory)", "Implement core neural networks from scratch in Python"],
                    "skills": ["Linear Algebra", "Calculus", "NumPy Neural Networks", "Python"],
                    "suggested_projects": ["Neural Network Built from Scratch without Frameworks"],
                    "recommended_courses": [
                        {"title": "Deep Learning Specialization", "platform": "DeepLearning.AI / Coursera", "description": "CNNs, RNNs, and optimization by Andrew Ng.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 4-7",
                    "objectives": ["Reproduce landmark research papers (Transformers, Diffusion models)", "Master PyTorch multi-GPU training and mixed precision"],
                    "skills": ["PyTorch", "Attention Mechanisms", "Transformers", "Paper Replication"],
                    "suggested_projects": ["Replication of 'Attention Is All You Need' in PyTorch"],
                    "recommended_courses": [
                        {"title": "CS25: Transformers United", "platform": "Stanford University", "description": "Advanced attention architectures and foundation models.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 8-12",
                    "objectives": ["Conduct original experimentation on model efficiency / interpretability", "Draft a scientific research paper preprint for arXiv or workshops"],
                    "skills": ["Experimental Design", "Ablation Studies", "Academic Manuscript Writing"],
                    "suggested_projects": ["Original Research Preprint on Parameter-Efficient Fine-Tuning"],
                    "recommended_courses": [
                        {"title": "Stanford CS224N: Natural Language Processing with Deep Learning", "platform": "Stanford Online", "description": "Premier graduate-level NLP research course.", "type": "free"}
                    ]
                }
            ]
        }
    },
    "Deep Learning Engineer": {
        "description": "Builds and optimizes specialized deep neural networks for computer vision, generative AI, speech recognition, and complex perceptual intelligence.",
        "category": "AI/ML",
        "market_outlook": "High Demand - 28% Growth",
        "required_technical_skills": ["Python", "PyTorch", "Computer Vision", "TensorFlow", "CUDA / GPUs", "Hugging Face"],
        "required_soft_skills": ["Experimental Discipline", "Problem Solving", "Collaboration", "Patience"],
        "opportunities": ["Perception Engineer", "Generative AI Developer", "Computer Vision Engineer", "Speech AI Specialist"],
        "explanation": "Your technical background, high GPA, and interest in advanced systems provide the foundations needed for neural network optimization.",
        "roadmap": {
            "timeline": "7 to 10 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-3",
                    "objectives": ["Understand backpropagation, loss surfaces, and activation functions", "Implement CNNs for image classification and feature maps"],
                    "skills": ["Python", "PyTorch Basics", "Computer Vision Fundamentals"],
                    "suggested_projects": ["Image Classification and Object Detection System"],
                    "recommended_courses": [
                        {"title": "Practical Deep Learning for Coders", "platform": "fast.ai", "description": "Top-down hands-on deep learning curriculum.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 4-6",
                    "objectives": ["Train generative models and fine-tune foundation models via Hugging Face", "Optimize inference latency using ONNX and TensorRT"],
                    "skills": ["Hugging Face", "Transfer Learning", "Inference Optimization", "CUDA"],
                    "suggested_projects": ["Domain-Specific Vision-Language Multimodal Search Engine"],
                    "recommended_courses": [
                        {"title": "Hugging Face Deep Learning Course", "platform": "Hugging Face", "description": "Transformers, fine-tuning, and model hub deployment.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 7-10",
                    "objectives": ["Scale distributed training across multiple GPUs", "Deploy real-time deep learning microservices with Triton Inference Server"],
                    "skills": ["Distributed Training", "Triton Server", "Quantization", "Model Compression"],
                    "suggested_projects": ["Edge Device Real-Time Computer Vision Pipeline"],
                    "recommended_courses": [
                        {"title": "NVIDIA Deep Learning Institute", "platform": "NVIDIA DLI", "description": "Hands-on GPU acceleration and neural network optimization.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "UI/UX Designer": {
        "description": "Designs intuitive user journeys, wireframes, high-fidelity prototypes, and design systems grounded in user research and behavioral psychology.",
        "category": "Design",
        "market_outlook": "High Demand - 18% Growth",
        "required_technical_skills": ["Figma", "HTML/CSS", "Wireframing", "User Research", "Prototyping", "Design Systems"],
        "required_soft_skills": ["Empathy", "Visual Communication", "Active Listening", "User Advocacy"],
        "opportunities": ["Product Designer", "Interaction Designer", "UX Researcher", "Design Lead"],
        "explanation": "Your creative orientation, interest in design, and understanding of web interactions align with user experience architecture.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master Figma typography, auto-layout, color harmony, and components", "Learn core UX principles (heuristics, user personas, journey mapping)"],
                    "skills": ["Figma", "Design Heuristics", "Wireframing", "Information Architecture"],
                    "suggested_projects": ["Mobile App Redesign Case Study", "Interactive Wireframe Click-Through Prototype"],
                    "recommended_courses": [
                        {"title": "Google UX Design Professional Certificate", "platform": "Coursera", "description": "End-to-end design research, wireframing, and Figma prototyping.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Conduct moderated user interviews and usability testing sessions", "Build reusable token-based design systems with auto-layout"],
                    "skills": ["Design Systems", "Usability Testing", "Interactive Micro-interactions"],
                    "suggested_projects": ["Multi-Platform Design System Component Library"],
                    "recommended_courses": [
                        {"title": "Design Systems with Figma", "platform": "Interaction Design Foundation", "description": "Scalable UI tokens, component variants, and handoff.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Create a high-impact portfolio case study documenting design decisions and business outcomes", "Learn developer handoff specifications"],
                    "skills": ["Portfolio Presentation", "Developer Handoff", "Business Metrics (CRO)"],
                    "suggested_projects": ["Complete End-to-End SaaS Web App UX Case Study"],
                    "recommended_courses": [
                        {"title": "UX Research at Scale", "platform": "edX / Michigan", "description": "Qualitative and quantitative user feedback methods.", "type": "free"}
                    ]
                }
            ]
        }
    },
    "Product Designer": {
        "description": "Blends UX/UI design with product strategy, aligning user needs, interface ergonomics, and commercial business objectives.",
        "category": "Design",
        "market_outlook": "High Demand - 21% Growth",
        "required_technical_skills": ["Figma", "Product Strategy", "Design Systems", "Analytics", "HTML/CSS"],
        "required_soft_skills": ["Leadership", "Strategic Vision", "Stakeholder Management", "Storytelling"],
        "opportunities": ["Senior Product Designer", "Principal Designer", "Director of Product Design", "Design Founder"],
        "explanation": "Your synthesis of creative thinking, leadership qualities, and management aptitude fits holistic product design.",
        "roadmap": {
            "timeline": "5 to 7 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master Figma design and prototyping workflows", "Understand product discovery frameworks and user personas"],
                    "skills": ["Figma", "UI Design", "User Discovery"],
                    "suggested_projects": ["B2B SaaS Dashboard Redesign"],
                    "recommended_courses": [
                        {"title": "Product Design by Google", "platform": "Udacity", "description": "Validation, UI/UX, and product sprints.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Tie UX changes directly to retention and conversion metrics", "Lead cross-functional design sprints with engineers and product managers"],
                    "skills": ["Product Metrics", "Design Sprints", "Design Systems"],
                    "suggested_projects": ["Complete Onboarding Funnel Optimization Case Study"],
                    "recommended_courses": [
                        {"title": "Product Strategy Specialization", "platform": "Coursera (Northwestern)", "description": "Aligning design deliverables with market success.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-7",
                    "objectives": ["Build a comprehensive senior product design portfolio with measurable ROI", "Master executive design presentations"],
                    "skills": ["Strategic Design", "Executive Pitching", "Product Leadership"],
                    "suggested_projects": ["Enterprise SaaS Product Suite Case Study"],
                    "recommended_courses": [
                        {"title": "Reforge Product Strategy", "platform": "Reforge", "description": "Elite product design and growth frameworks.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Graphic Designer": {
        "description": "Creates compelling visual identities, brand typography, digital marketing assets, and illustrations that convey memorable brand narratives.",
        "category": "Design",
        "market_outlook": "Moderate Demand - 12% Growth",
        "required_technical_skills": ["Adobe Illustrator", "Photoshop", "Typography", "Branding", "Layout Composition"],
        "required_soft_skills": ["Visual Creativity", "Active Listening", "Patience with Revisions", "Time Management"],
        "opportunities": ["Brand Designer", "Visual Identity Specialist", "Art Director", "Marketing Visual Designer"],
        "explanation": "Your artistic sensibility, appreciation for composition, and creative work preference match visual identity design.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master color theory, typography hierarchy, and composition grids", "Learn vector illustration tools in Illustrator and image editing in Photoshop"],
                    "skills": ["Illustrator", "Photoshop", "Typography", "Color Theory"],
                    "suggested_projects": ["Brand Identity Package for a Modern Coffee Company"],
                    "recommended_courses": [
                        {"title": "Graphic Design Specialization", "platform": "CalArts / Coursera", "description": "Foundational typography, image making, and design history.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Design comprehensive brand style guides and vector iconography", "Create multi-channel marketing campaigns (print and digital)"],
                    "skills": ["Brand Guidelines", "Print Layout", "Digital Marketing Creatives"],
                    "suggested_projects": ["Multi-Channel Product Launch Campaign Suite"],
                    "recommended_courses": [
                        {"title": "Branding & Identity Design", "platform": "Skillshare", "description": "Vector brand creation from concept to delivery.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Assemble a polished Behance/Dribbble portfolio showcasing commercial brand identities", "Master client revision management"],
                    "skills": ["Portfolio Curation", "Commercial Licensing", "Client Management"],
                    "suggested_projects": ["Complete Global Brand Identity & Packaging Portfolio"],
                    "recommended_courses": [
                        {"title": "Art Direction Masterclass", "platform": "Domestika", "description": "Directing visual campaigns and artistic cohesion.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Business Analyst": {
        "description": "Analyzes business workflows, technical requirements, and financial data to bridge business needs with software and process solutions.",
        "category": "Data Science",
        "market_outlook": "High Demand - 23% Growth",
        "required_technical_skills": ["SQL", "Excel", "Process Modeling", "PowerBI", "Requirement Documentation", "Agile"],
        "required_soft_skills": ["Stakeholder Communication", "Active Listening", "Negotiation", "Problem Solving"],
        "opportunities": ["Functional Consultant", "Agile Product Owner", "Operations Analyst", "Strategy Consultant"],
        "explanation": "Your blend of business/management stream knowledge, communication skills, and analytical capability fits business analysis.",
        "roadmap": {
            "timeline": "5 to 7 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Learn business requirement gathering (BRD/FRD) and user story writing", "Master advanced Excel functions and process flowcharts (BPMN)"],
                    "skills": ["User Stories", "BPMN Modeling", "Advanced Excel", "Requirement Gathering"],
                    "suggested_projects": ["Banking Loan Approval Workflow Optimization Model"],
                    "recommended_courses": [
                        {"title": "Business Analysis Fundamentals", "platform": "IIBA / Coursera", "description": "BABOK framework and core analysis techniques.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Write SQL queries for operational reporting", "Build interactive BI reports in Power BI to monitor business KPIs"],
                    "skills": ["SQL", "PowerBI", "Agile & Scrum Methodologies", "Jira"],
                    "suggested_projects": ["E-Commerce Customer Retention & Return-on-Ad-Spend Analysis"],
                    "recommended_courses": [
                        {"title": "Agile with Atlassian Jira", "platform": "Atlassian / Coursera", "description": "Agile sprint management and backlog grooming.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-7",
                    "objectives": ["Conduct financial cost-benefit and risk feasibility analyses", "Prepare for IIBA ECBA or CCBA professional certification"],
                    "skills": ["Financial Feasibility", "Change Management", "Executive Stakeholder Alignment"],
                    "suggested_projects": ["Digital Transformation Business Case & Implementation Roadmap"],
                    "recommended_courses": [
                        {"title": "Entry Certificate in Business Analysis (ECBA)", "platform": "IIBA Official", "description": "Premier entry certification for business analysts.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Project Manager": {
        "description": "Leads cross-functional teams to deliver initiatives on scope, on schedule, and on budget using structured Agile and predictive methodologies.",
        "category": "Management",
        "market_outlook": "Steady High Demand - 19% Growth",
        "required_technical_skills": ["Agile/Scrum", "Jira", "Asana", "Risk Management", "Budgeting", "Gantt Charts"],
        "required_soft_skills": ["Leadership", "Conflict Resolution", "Communication", "Time Management"],
        "opportunities": ["Scrum Master", "Technical Program Manager", "Delivery Lead", "Operations Director"],
        "explanation": "Your leadership track record, structured time management, and project management skills align with modern delivery management.",
        "roadmap": {
            "timeline": "5 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand project management phases (Initiation, Planning, Execution, Monitoring, Closing)", "Master task tracking in Jira and Trello"],
                    "skills": ["Project Lifecycles", "Jira", "Scope Definition", "Work Breakdown Structures (WBS)"],
                    "suggested_projects": ["Software Release Project Charter & Work Breakdown Structure"],
                    "recommended_courses": [
                        {"title": "Google Project Management Professional Certificate", "platform": "Coursera", "description": "Agile, traditional project planning, and documentation.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Master Scrum ceremonies (Sprint Planning, Standups, Retrospectives)", "Conduct quantitative risk analysis and resource allocation modeling"],
                    "skills": ["Scrum Ceremonies", "Risk Mitigation", "Budget Tracking", "Resource Leveling"],
                    "suggested_projects": ["Sprint Backlog & Velocity Burndown Tracking Simulation"],
                    "recommended_courses": [
                        {"title": "Scrum Master Certification (PSM I)", "platform": "Scrum.org", "description": "Premier certification in Scrum principles and leadership.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Prepare for CAPM or PMP accreditation", "Implement complex multi-stream program governance frameworks"],
                    "skills": ["Stakeholder Governance", "CAPM / PMP Standards", "Change Management"],
                    "suggested_projects": ["Enterprise Multi-Department Software Deployment Plan"],
                    "recommended_courses": [
                        {"title": "Certified Associate in Project Management (CAPM)", "platform": "PMI.org", "description": "PMI global benchmark certification.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Operations Manager": {
        "description": "Optimizes internal business processes, supply chains, resource efficiency, and departmental productivity to drive scalable operational excellence.",
        "category": "Management",
        "market_outlook": "High Demand - 16% Growth",
        "required_technical_skills": ["Process Optimization", "Excel", "ERP Systems", "KPI Tracking", "Budget Modeling"],
        "required_soft_skills": ["Team Leadership", "Decision Making", "Crisis Management", "Operational Discipline"],
        "opportunities": ["Director of Operations", "Chief of Staff", "Supply Chain Lead", "Plant / Facility Manager"],
        "explanation": "Your discipline in time management, engineering or operations stream qualifications, and leadership profile align with operational leadership.",
        "roadmap": {
            "timeline": "5 to 7 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand core operations metrics (throughput, cycle time, bottlenecks)", "Learn process mapping and Lean fundamentals"],
                    "skills": ["Lean Fundamentals", "Process Mapping", "Excel Dashboards"],
                    "suggested_projects": ["Warehouse Order Fulfillment Process Optimization Model"],
                    "recommended_courses": [
                        {"title": "Operations Management", "platform": "University of Illinois / Coursera", "description": "Operations strategy, capacity planning, and quality control.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Learn Six Sigma DMAIC methodology for defect reduction", "Implement ERP workflows (SAP / Odoo basics)"],
                    "skills": ["Six Sigma (Green Belt)", "Supply Chain Modeling", "Vendor Negotiations"],
                    "suggested_projects": ["Six Sigma Quality Improvement Case Study"],
                    "recommended_courses": [
                        {"title": "Six Sigma Yellow / Green Belt Specialization", "platform": "Coursera", "description": "Statistical process control and variance reduction.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-7",
                    "objectives": ["Lead business continuity and crisis management simulations", "Scale multi-site operational protocols and P&L budgeting"],
                    "skills": ["P&L Management", "Strategic Resource Allocation", "Business Continuity"],
                    "suggested_projects": ["Comprehensive Corporate Operational Scaling Blueprint"],
                    "recommended_courses": [
                        {"title": "Supply Chain Operations Specialization", "platform": "Rutgers University", "description": "Global supply logistics and operational synchronization.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Business Manager": {
        "description": "Oversees comprehensive business units, driving revenue growth, corporate strategy, team management, and financial profitability.",
        "category": "Management",
        "market_outlook": "Steady Demand - 17% Growth",
        "required_technical_skills": ["Financial Modeling", "Business Strategy", "CRM (Salesforce)", "Market Analysis", "Excel"],
        "required_soft_skills": ["Executive Leadership", "Negotiation", "Strategic Vision", "Persuasion"],
        "opportunities": ["General Manager", "Managing Director", "Strategy Executive", "Business Unit Lead"],
        "explanation": "Your management qualifications, leadership experience, and strategic preferences match corporate business management.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand financial statements (Balance Sheet, Income, Cash Flow)", "Analyze market dynamics using Porter's Five Forces and SWOT"],
                    "skills": ["Financial Statement Analysis", "Strategic Frameworks", "Market Research"],
                    "suggested_projects": ["Quarterly Corporate Financial Performance Deck"],
                    "recommended_courses": [
                        {"title": "Introduction to Business Management", "platform": "King's College London / FutureLearn", "description": "Management fundamentals and decision making.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Build financial DCF valuation models in Excel", "Lead cross-functional performance management reviews"],
                    "skills": ["DCF Financial Modeling", "Sales Pipeline Management", "Team Governance"],
                    "suggested_projects": ["New Market Expansion Commercial Feasibility Study"],
                    "recommended_courses": [
                        {"title": "Business Strategy Specialization", "platform": "Wharton / Coursera", "description": "Competitive advantage and strategic innovation.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Manage departmental P&L allocations and capital expenditure", "Lead executive shareholder strategy presentations"],
                    "skills": ["Corporate Strategy", "M&A Basics", "Executive Communication"],
                    "suggested_projects": ["3-Year Corporate Business Growth & Capital Strategy"],
                    "recommended_courses": [
                        {"title": "Leadership and Management Certificate", "platform": "Harvard Business School Online", "description": "Elite corporate executive decision-making.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "SEO Analyst": {
        "description": "Optimizes website structure, search indexing, content keyword architecture, and technical signals to maximize organic search visibility and traffic.",
        "category": "Marketing",
        "market_outlook": "High Demand - 22% Growth",
        "required_technical_skills": ["HTML/CSS", "Google Analytics 4", "Google Search Console", "Ahrefs / SEMrush", "Python"],
        "required_soft_skills": ["Analytical Rigor", "Curiosity", "Strategic Thinking", "Written Communication"],
        "opportunities": ["Organic Growth Lead", "Technical SEO Specialist", "Content Strategist", "Search Director"],
        "explanation": "Your mix of web fundamentals (HTML/CSS), analytical mindset, and data analysis capability matches organic search optimization.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand search engine crawling, indexing, and ranking algorithms", "Conduct thorough keyword research using free and freemium tools"],
                    "skills": ["Keyword Research", "On-Page SEO", "HTML Meta Tags", "Search Intent"],
                    "suggested_projects": ["Comprehensive On-Page SEO Audit of a Local Business Website"],
                    "recommended_courses": [
                        {"title": "Search Engine Optimization (SEO) Specialization", "platform": "UC Davis / Coursera", "description": "Search theory, on-page optimization, and algorithms.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Master technical SEO (schema markup, canonicals, robots.txt, XML sitemaps)", "Analyze performance using Google Search Console and GA4"],
                    "skills": ["Technical SEO", "Google Search Console", "Google Analytics 4", "Schema.org"],
                    "suggested_projects": ["Core Web Vitals & Technical Crawl Optimization Case Study"],
                    "recommended_courses": [
                        {"title": "Technical SEO Certification", "platform": "Semrush Academy", "description": "Crawlability, indexation, and architecture.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Automate rank tracking and competitor keyword analysis using Python", "Design international and programmatic SEO architectures"],
                    "skills": ["Python for SEO", "Programmatic SEO", "Link Building Strategy"],
                    "suggested_projects": ["Programmatic SEO Architecture Generating 100+ Landing Pages"],
                    "recommended_courses": [
                        {"title": "Advanced Search Engine Optimization", "platform": "HubSpot Academy", "description": "Topic clusters and enterprise search growth.", "type": "free"}
                    ]
                }
            ]
        }
    },
    "Digital Marketing Specialist": {
        "description": "Plans and executes multi-channel digital campaigns across paid ads (PPC), social media, email marketing, and content funnels to accelerate customer acquisition.",
        "category": "Marketing",
        "market_outlook": "High Demand - 24% Growth",
        "required_technical_skills": ["Google Ads", "Meta Ads Manager", "Google Analytics", "Email Automation", "Copywriting"],
        "required_soft_skills": ["Creative Thinking", "Persuasive Communication", "Experimentation", "Adaptability"],
        "opportunities": ["Performance Marketer", "Growth Hacker", "Paid Media Manager", "Lifecycle Marketing Lead"],
        "explanation": "Your creative orientation, communication skills, and social work interest align with multi-channel digital campaigns.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand customer acquisition funnels (TOFU, MOFU, BOFU)", "Master persuasive copywriting and email marketing campaigns"],
                    "skills": ["Copywriting", "Email Marketing", "Social Media Management"],
                    "suggested_projects": ["Automated 5-Stage Email Nurture Sequence"],
                    "recommended_courses": [
                        {"title": "Google Digital Marketing & E-commerce Certificate", "platform": "Coursera", "description": "Comprehensive digital channels, ads, and analytics.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Run paid search and social campaigns (Google Ads, Meta Ads)", "Optimize conversions (CRO) and analyze return on ad spend (ROAS)"],
                    "skills": ["Google Ads", "Meta Ads Manager", "A/B Testing", "ROAS Optimization"],
                    "suggested_projects": ["Mock $5,000 Paid Search Campaign Strategy with Budget Modeling"],
                    "recommended_courses": [
                        {"title": "Meta Certified Digital Marketing Associate", "platform": "Meta Blueprint", "description": "Official Meta ad targeting and budget deployment.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Implement multi-touch attribution models in GA4", "Lead comprehensive growth marketing sprints across paid and organic funnels"],
                    "skills": ["Growth Marketing", "Multi-Touch Attribution", "Customer Lifetime Value (LTV)"],
                    "suggested_projects": ["Complete Omnichannel Go-To-Market Growth Strategy"],
                    "recommended_courses": [
                        {"title": "Growth Marketing Mini-Degree", "platform": "CXL", "description": "Elite retention and user acquisition frameworks.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Marketing Executive": {
        "description": "Leads brand positioning, client outreach, campaign execution, and strategic partnership initiatives to build market awareness and drive commercial sales.",
        "category": "Marketing",
        "market_outlook": "Steady Demand - 15% Growth",
        "required_technical_skills": ["CRM Tools", "Market Research", "Presentation Design", "Event Marketing", "Campaign Planning"],
        "required_soft_skills": ["Public Speaking", "Negotiation", "Relationship Building", "Drive for Results"],
        "opportunities": ["Brand Manager", "Chief Marketing Officer", "Marketing Director", "Partnerships Lead"],
        "explanation": "Your outgoing communication profile, readiness to relocate, and strategic commercial orientation match corporate marketing management.",
        "roadmap": {
            "timeline": "4 to 6 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Understand market segmentation, targeting, and brand positioning (STP)", "Master stakeholder pitches and marketing presentation decks"],
                    "skills": ["Market Research", "Presentation Design", "Brand Positioning"],
                    "suggested_projects": ["Comprehensive Competitor Marketing & Brand Audit Deck"],
                    "recommended_courses": [
                        {"title": "Introduction to Marketing", "platform": "Wharton / Coursera", "description": "Branding, customer centricity, and go-to-market strategies.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-4",
                    "objectives": ["Plan regional promotional campaigns and trade events", "Manage client lead lifecycles in CRM platforms (HubSpot / Salesforce)"],
                    "skills": ["CRM Management", "Event Marketing", "Budget Administration"],
                    "suggested_projects": ["Regional Brand Activation & Event Strategy Plan"],
                    "recommended_courses": [
                        {"title": "Inbound Marketing Certification", "platform": "HubSpot Academy", "description": "Lead generation and client nurturing best practices.", "type": "free"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 5-6",
                    "objectives": ["Negotiate strategic commercial co-marketing partnerships", "Oversee brand health metrics and national promotional campaigns"],
                    "skills": ["Partnership Negotiations", "Brand Equity Tracking", "Executive Leadership"],
                    "suggested_projects": ["Full-Year Corporate Brand Marketing Strategy & Budget Allocation"],
                    "recommended_courses": [
                        {"title": "Strategic Marketing Management", "platform": "edX / IIMB", "description": "Advanced competitive positioning and market expansion.", "type": "certification"}
                    ]
                }
            ]
        }
    },
    "Software Engineer": {
        "description": "Designs, develops, tests, and maintains high-quality software applications, algorithms, and modular systems adhering to clean code and engineering best practices.",
        "category": "Software Development",
        "market_outlook": "Very High Demand - 25% Growth",
        "required_technical_skills": ["Data Structures & Algorithms", "C++", "Java", "Python", "Git", "Design Patterns", "Unit Testing"],
        "required_soft_skills": ["Algorithmic Rigor", "Debugging Discipline", "Collaboration", "Clean Code Ethics"],
        "opportunities": ["Senior Software Engineer", "Systems Architect", "Lead Developer", "Engineering Manager"],
        "explanation": "Your computer science/engineering degree stream, core programming foundation, and problem-solving focus match professional software engineering.",
        "roadmap": {
            "timeline": "6 to 8 Months",
            "milestones": [
                {
                    "stage": "Beginner",
                    "duration": "Months 1-2",
                    "objectives": ["Master Data Structures & Algorithms (Arrays, Linked Lists, Stacks, Queues, Binary Trees)", "Practice asymptotic time/space complexity analysis (Big O)"],
                    "skills": ["C++ / Java", "Data Structures", "Algorithms", "Git & GitHub"],
                    "suggested_projects": ["Custom Data Structures Library Implemented from Scratch"],
                    "recommended_courses": [
                        {"title": "Algorithms, Part I", "platform": "Princeton University / Coursera", "description": "Essential data structures, sorting, and search algorithms.", "type": "free"}
                    ]
                },
                {
                    "stage": "Intermediate",
                    "duration": "Months 3-5",
                    "objectives": ["Master Object-Oriented Design (SOLID principles) and classic design patterns", "Write robust automated unit tests with high code coverage"],
                    "skills": ["SOLID Principles", "Design Patterns", "Unit Testing (JUnit / PyTest)", "SQL"],
                    "suggested_projects": ["Modular CLI Tool or Desktop Application with Comprehensive Unit Tests"],
                    "recommended_courses": [
                        {"title": "Software Design and Architecture Specialization", "platform": "University of Alberta / Coursera", "description": "Design patterns, architecture, and clean code.", "type": "certification"}
                    ]
                },
                {
                    "stage": "Advanced",
                    "duration": "Months 6-8",
                    "objectives": ["Study distributed systems, caching strategies, and concurrency patterns", "Prepare for technical system design interviews and coding benchmarks"],
                    "skills": ["System Design", "Concurrency", "Distributed Systems", "CI/CD"],
                    "suggested_projects": ["Distributed In-Memory Key-Value Store with Replicated Logging"],
                    "recommended_courses": [
                        {"title": "System Design Interview Prep", "platform": "ByteByteGo", "description": "Scalability, load balancing, and distributed architecture.", "type": "certification"}
                    ]
                }
            ]
        }
    }
}

