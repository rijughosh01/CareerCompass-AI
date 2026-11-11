import re
import os
from typing import Dict, Any, List, Optional
from app.services.career_data import CAREER_KNOWLEDGE_BASE
from app.core.config import settings

# Optional Google Gemini LLM Integration
gemini_model = None
if settings.GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        gemini_model = None


# Detailed Project Blueprints for Top Domains
ROLE_PROJECT_BLUEPRINTS = {
    "Machine Learning Engineer": [
        {
            "title": "End-to-End MLOps Customer Churn Prediction Pipeline",
            "stack": "Python, Scikit-learn, XGBoost, FastAPI, Docker, MLflow, GitHub Actions",
            "description": "Build an automated ML training, tracking, and inference service containerized with Docker, complete with drift detection and live REST API endpoints."
        },
        {
            "title": "Real-time Retrieval-Augmented Generation (RAG) Document Assistant",
            "stack": "LangChain, ChromaDB/Pinecone, HuggingFace/OpenAI, FastAPI, Streamlit",
            "description": "Construct a semantic search and question-answering system indexing technical PDFs with dense vector embeddings and conversational memory."
        },
        {
            "title": "Computer Vision Defect Detection System",
            "stack": "PyTorch, YOLOv8/ResNet, OpenCV, FastAPI",
            "description": "Train and deploy a convolutional network classifying surface anomalies with real-time bounding box visualizations and inference benchmark logging."
        }
    ],
    "Data Scientist": [
        {
            "title": "E-Commerce Recommendation & Collaborative Filtering Engine",
            "stack": "Python, Pandas, Scikit-learn, Surprise, Streamlit",
            "description": "Develop user-item collaborative filtering and matrix factorization with real-time top-N recommendations and simulated A/B testing metrics."
        },
        {
            "title": "Financial Credit Risk & Default Prediction System",
            "stack": "Python, LightGBM, Imbalanced-learn, SHAP, Matplotlib",
            "description": "Predict consumer loan default likelihood with thorough EDA, class imbalance mitigation (SMOTE), and model interpretability via SHAP values."
        },
        {
            "title": "Multi-Variate Time-Series Sales & Demand Forecasting",
            "stack": "Prophet, Statsmodels, ARIMA, Plotly, Streamlit",
            "description": "Forecast regional retail demand with seasonality decomposition, confidence intervals, and interactive Plotly scenario planning dashboards."
        }
    ],
    "Data Analyst": [
        {
            "title": "Executive Business Intelligence Revenue & Retention Dashboard",
            "stack": "SQL, PostgreSQL, Tableau/Power BI, Python (Pandas)",
            "description": "Create an automated multi-page BI dashboard tracking Monthly Recurring Revenue (MRR), customer churn cohorts, and LTV."
        },
        {
            "title": "Customer Segmentation & RFM Behavioral Analysis",
            "stack": "Python, K-Means Clustering, Seaborn, SQL",
            "description": "Segment 100K+ transactional records using Recency-Frequency-Monetary (RFM) scoring and cluster profiles to drive targeted marketing campaigns."
        },
        {
            "title": "Supply Chain Inventory Optimization & KPI Telemetry",
            "stack": "SQL, Excel (Power Query), Power BI",
            "description": "Model vendor lead times, safety stock levels, and warehouse turnaround delays with drill-down visual hierarchies."
        }
    ],
    "Frontend Developer": [
        {
            "title": "High-Performance Interactive Analytics Dashboard",
            "stack": "React 18, TypeScript, Tailwind CSS, Recharts, Vite",
            "description": "Build a responsive SaaS interface with live telemetry, theme switching (dark/light), optimistic UI updates, and sub-100ms interaction latency."
        },
        {
            "title": "Kanban Workflow & Task Management Application",
            "stack": "Next.js 14, TypeScript, Zustand, @hello-pangea/dnd, Tailwind",
            "description": "Trello-style project workflow tool with optimistic drag-and-drop state persistence, keyboard accessibility, and column filtering."
        },
        {
            "title": "Modern Component Design System with Storybook",
            "stack": "React, TypeScript, Storybook, Tailwind, NPM packaging",
            "description": "Author an accessible, modular UI component library following WCAG 2.1 AA standards with automated regression tests."
        }
    ],
    "Backend Developer": [
        {
            "title": "Scalable URL Shortener & High-Throughput Analytics Microservice",
            "stack": "FastAPI/Go, Redis, PostgreSQL, Docker, Nginx",
            "description": "High-throughput redirect service handling caching with Redis, write-through DB persistence, and token bucket rate-limiting middleware."
        },
        {
            "title": "Real-time Collaborative Chat & Notification Engine",
            "stack": "Node.js/FastAPI, WebSockets, Redis Pub/Sub, JWT Auth",
            "description": "Event-driven architecture broadcasting room-based messages and persistent unread notification counts with token authentication."
        },
        {
            "title": "Event-Driven Order Processing & Payment Webhook Architecture",
            "stack": "Python, Celery, RabbitMQ/Kafka, PostgreSQL, Stripe SDK",
            "description": "Distributed asynchronous order workflow with dead-letter queue retries, transaction rollbacks, and idempotent webhook handlers."
        }
    ],
    "Full Stack Developer": [
        {
            "title": "AI-Powered SaaS Document & Knowledge Base Management Platform",
            "stack": "Next.js, FastAPI, PostgreSQL, Prisma, Docker, OpenAI/Gemini API",
            "description": "Complete full-stack platform with auth, subscription billing, vector search, and customizable user dashboards."
        },
        {
            "title": "Multi-Tenant E-Commerce Marketplace with Live Inventory",
            "stack": "React, TypeScript, Node.js, Express, MongoDB/PostgreSQL, Redis",
            "description": "Full-featured shopping platform with vendor portals, cart persistence, real-time stock reservations, and payment processing."
        }
    ],
    "Cybersecurity Analyst": [
        {
            "title": "Automated Network Vulnerability & Port Scanner",
            "stack": "Python, Scapy, Nmap, Socket, SQLite",
            "description": "Audit local subnet nodes, detect open vulnerable ports, compare against CVE databases, and generate automated PDF audit reports."
        },
        {
            "title": "Security Information & Event Management (SIEM) Log Parser",
            "stack": "Python, ELK Stack (Elasticsearch, Logstash, Kibana) / Splunk",
            "description": "Ingest Apache/Nginx and Linux auth logs to trigger automated alerts on brute-force SSH attempts and suspicious IP geolocation spikes."
        },
        {
            "title": "SOC Incident Response Playbook Automation & Phishing Triage",
            "stack": "Python, VirusTotal API, AbuseIPDB, Shodan",
            "description": "Parse suspicious email headers, extract URLs/IPs/hashes, query threat intelligence APIs, and calculate threat severity scores automatically."
        }
    ],
    "Ethical Hacker": [
        {
            "title": "Custom Web Application Vulnerability & Parameter Fuzzer",
            "stack": "Python, Requests, Beautiful Soup, Burp Suite Extensions",
            "description": "Automated tool scanning for SQL Injection, Reflected XSS, and IDOR vulnerabilities across authenticated web endpoints."
        },
        {
            "title": "Wi-Fi Security Auditor & Rogue AP Detection Tool",
            "stack": "Python, Scapy, Aircrack-ng, Linux Wi-Fi drivers",
            "description": "Audit enterprise wireless networks for weak WPA2/WPA3 handshakes and deauthentication anomalies."
        }
    ],
    "UI/UX Designer": [
        {
            "title": "FinTech Mobile Banking App Design System & Prototype",
            "stack": "Figma, FigJam, Protopie, Design Tokens, User Testing",
            "description": "End-to-end UX case study including user personas, empathy maps, wireframes, accessible design system, and clickable micro-interaction prototypes."
        },
        {
            "title": "B2B SaaS Cloud Management Platform Redesign Case Study",
            "stack": "Figma, Maze, Google Analytics, Information Architecture",
            "description": "Information architecture overhaul reducing user task completion time by 35% with comprehensive usability test reports."
        }
    ],
    "Software Engineer": [
        {
            "title": "Distributed In-Memory Key-Value Store with Raft Consensus",
            "stack": "Go or C++ / Python, TCP Sockets, Raft Consensus, Docker",
            "description": "Implement a replicated in-memory store supporting GET/SET commands, persistent log compaction, and leader election."
        },
        {
            "title": "Concurrent Web Crawler & Search Indexer",
            "stack": "Python/Go, Asyncio, Redis, SQLite, Trie/Inverted Index",
            "description": "Multi-threaded crawler respecting robots.txt, extracting page metadata, and computing TF-IDF relevance scores for search queries."
        }
    ]
}


# High-Frequency Interview Questions
ROLE_INTERVIEW_QUESTIONS = {
    "Machine Learning Engineer": [
        ("How do you handle severe class imbalance in a classification dataset?", 
         "Discuss SMOTE/ADASYN oversampling, class-weighted loss functions (e.g. focal loss), optimizing PR-AUC instead of ROC-AUC, and tuning the decision threshold."),
        ("Explain the bias-variance tradeoff in ensemble models.", 
         "Explain how Random Forests reduce variance via bagging and random feature selection, while Gradient Boosting reduces bias sequentially by fitting residuals."),
        ("How do you detect and mitigate data drift in production ML models?", 
         "Monitor statistical distribution shifts (Kolmogorov-Smirnov test, PSI), track input feature distributions, and establish automated retraining triggers in your MLOps pipeline."),
        ("What is the difference between L1 (Lasso) and L2 (Ridge) regularization mathematically?", 
         "L1 penalizes absolute weights leading to sparse feature selection (zeros); L2 penalizes squared weights pushing values toward zero smoothly without zeroing them out."),
        ("How would you optimize inference latency for a Transformer or Deep Learning model?", 
         "Techniques include model quantization (INT8/FP16), ONNX Runtime conversion, weight pruning, knowledge distillation, and dynamic batching.")
    ],
    "Data Scientist": [
        ("What is the central limit theorem and why is it critical in A/B testing?", 
         "Sample means approximate a normal distribution regardless of the underlying population distribution as sample size grows, enabling z-tests and t-tests."),
        ("How do you interpret a p-value to a non-technical stakeholder?", 
         "It is the probability that our observed metric difference happened purely by random chance under the assumption that the feature made no real difference."),
        ("When would you choose a tree-based model (e.g. XGBoost) over logistic regression?", 
         "Tree-based models capture non-linear relationships and high-order feature interactions automatically without requiring manual feature transformations."),
        ("How do you prevent data leakage during feature engineering?", 
         "Always fit transformers (scalers, encoders, imputers) strictly on training folds inside a cross-validation pipeline, transforming validation/test folds downstream.")
    ],
    "Data Analyst": [
        ("Explain the difference between WHERE and HAVING in SQL.", 
         "WHERE filters individual rows before aggregation occurs; HAVING filters grouped summary rows after the GROUP BY clause."),
        ("How do you calculate Customer Lifetime Value (LTV) and Churn Rate in SQL?", 
         "Use window functions (`LAG`, `LEAD`) to calculate time between purchases, compute average purchase value multiplied by purchase frequency divided by churn rate."),
        ("What are Window Functions in SQL, and when would you use `ROW_NUMBER()` vs `RANK()` vs `DENSE_RANK()`?", 
         "Window functions compute values across sets of rows without collapsing them. `ROW_NUMBER()` gives unique sequential numbers, `RANK()` leaves gaps on ties, and `DENSE_RANK()` does not leave gaps.")
    ],
    "Frontend Developer": [
        ("Explain the Virtual DOM and React reconciliation algorithm.", 
         "React maintains an in-memory virtual tree, computes diffs via the Fiber reconciler, and batches minimal real DOM mutations."),
        ("What strategies do you use to optimize Largest Contentful Paint (LCP)?", 
         "Preload hero images, eliminate render-blocking CSS/JS, use modern image formats (AVIF/WebP), and leverage SSR or CDN edge caching."),
        ("Explain closure in JavaScript and give a real-world frontend use case.", 
         "A function retaining access to its lexical scope after the outer function has closed; used in custom hooks, debounce functions, and memoization.")
    ],
    "Backend Developer": [
        ("Explain the difference between horizontal and vertical database scaling.", 
         "Vertical adds CPU/RAM to a single server; horizontal distributes data across nodes via sharding, read-replicas, and partitioning."),
        ("How do you design an idempotent payment processing API endpoint?", 
         "Clients pass a unique Idempotency-Key header; server caches key state in Redis/DB to prevent duplicate charges upon retries."),
        ("Explain ACID transactions and when you might relax them for BASE in distributed systems.", 
         "Atomicity, Consistency, Isolation, Durability ensure strict transactional integrity. Distributed systems often adopt Eventual Consistency (BASE) for high availability.")
    ],
    "Cybersecurity Analyst": [
        ("Explain the difference between symmetric and asymmetric encryption.", 
         "Symmetric encryption uses the same key for encryption and decryption (fast, AES); asymmetric uses a public/private key pair (RSA, ECC, used for key exchange)."),
        ("What is the MITRE ATT&CK framework and how is it used in a SOC?", 
         "A curated knowledge base of adversary tactics, techniques, and procedures (TTPs) used to map alerts, identify defensive coverage gaps, and simulate threats."),
        ("How do you distinguish a false positive from a true positive incident during alert triage?", 
         "Correlate IP reputation, check endpoint logs for parent-child process anomalies (e.g. powershell spawned by word.exe), and verify legitimate admin activity.")
    ]
}


def normalize_role_name(query: str, default_career: str = "Machine Learning Engineer") -> str:
    """Intelligently maps user query mentions to standardized career catalog names."""
    q = query.lower()

    if any(k in q for k in ["machine learning", "ml engineer", "mle"]):
        return "Machine Learning Engineer"
    if any(k in q for k in ["data science", "data scientist"]):
        return "Data Scientist"
    if any(k in q for k in ["data analyst", "data analysis", "bi analyst"]):
        return "Data Analyst"
    if any(k in q for k in ["frontend", "front-end", "front end", "react"]):
        return "Frontend Developer"
    if any(k in q for k in ["backend", "back-end", "back end", "node", "django", "fastapi"]):
        return "Backend Developer"
    if any(k in q for k in ["full stack", "fullstack", "full-stack", "mern"]):
        return "Full Stack Developer"
    if any(k in q for k in ["cyber security", "cybersecurity", "security analyst", "soc"]):
        return "Cybersecurity Analyst"
    if any(k in q for k in ["ethical hack", "ethical hacker", "pentest", "penetration tester"]):
        return "Ethical Hacker"
    if any(k in q for k in ["ai research", "ai researcher"]):
        return "AI Researcher"
    if any(k in q for k in ["deep learning"]):
        return "Deep Learning Engineer"
    if any(k in q for k in ["ui/ux", "ui ux", "ux designer", "ui designer", "product design"]):
        return "UI/UX Designer"
    if any(k in q for k in ["business analyst"]):
        return "Business Analyst"
    if any(k in q for k in ["software engineer", "software developer", "sde"]):
        return "Software Engineer"
    if any(k in q for k in ["cloud", "devops"]):
        return "Backend Developer"

    # Direct match from knowledge base
    for career_name in CAREER_KNOWLEDGE_BASE.keys():
        if career_name.lower() in q:
            return career_name

    return default_career


def call_gemini_llm(prompt: str, user_profile: Dict[str, Any]) -> Optional[str]:
    """Invokes Google Gemini 1.5 Flash if API key is configured."""
    if not gemini_model:
        return None

    name = user_profile.get("full_name", "Student")
    stream = user_profile.get("stream", "Computer Science")
    qual = user_profile.get("highest_qualification", "B.Tech")
    cgpa = user_profile.get("grade_cgpa_percentage", 85.0)
    skills = user_profile.get("technical_skills", "Python, SQL")
    career = user_profile.get("latest_top_career", "Machine Learning Engineer")
    score = user_profile.get("latest_top_score", 95.0)

    system_instruction = (
        f"You are CareerCompass AI Counselor, an expert senior career counselor and technical mentor. "
        f"You are advising a student named {name} who studies/holds {qual} in {stream} with a grade of {cgpa}%. "
        f"Their technical competencies include: {skills}. "
        f"Their top predicted career path on our platform is {career} with a {score}% match score.\n\n"
        f"Guidelines:\n"
        f"- Format your response using clean, professional GitHub markdown with headers (###), bullet points, bold keywords, and code chips.\n"
        f"- Ground your answers in their background and career goals.\n"
        f"- Be encouraging, highly specific, and actionable (mention realistic frameworks, projects, interview tips).\n"
        f"- Keep responses under 400 words so they remain clear and concise."
    )

    full_prompt = f"{system_instruction}\n\nStudent Query: {prompt}\n\nResponse:"
    try:
        response = gemini_model.generate_content(full_prompt)
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        pass
    return None


def get_chatbot_response(user_message: str, user_profile: Dict[str, Any] = None) -> str:
    """
    Intelligent career guidance chatbot engine.
    Combines optional Gemini LLM with an expert domain reasoning engine.
    """
    if user_profile is None:
        user_profile = {}

    student_name = user_profile.get("full_name", "Student")
    student_skills = user_profile.get("technical_skills", "Python, SQL")
    stream = user_profile.get("stream", "Computer Science")
    qual = user_profile.get("highest_qualification", "B.Tech")
    top_career = user_profile.get("latest_top_career", "Machine Learning Engineer")
    top_score = user_profile.get("latest_top_score", 95.0)

    # 1. Attempt Gemini LLM inference first if API key is present
    llm_reply = call_gemini_llm(user_message, user_profile)
    if llm_reply:
        return llm_reply

    # 2. Local Expert Domain Engine
    msg = user_message.lower().strip()
    target_role = normalize_role_name(msg, default_career=top_career)

    # Intent A: Comparison / Difference between roles
    if any(k in msg for k in ["difference", "vs", "versus", "compare", "comparison"]):
        if ("data science" in msg or "data scientist" in msg) and ("data analyst" in msg or "data analysis" in msg):
            return (
                "### ⚖️ Comparison: Data Scientist vs. Data Analyst\n\n"
                "| Dimension | Data Analyst | Data Scientist |\n"
                "|---|---|---|\n"
                "| **Primary Focus** | Historical trends, business KPIs, dashboards, reporting | Predictive modeling, machine learning, future forecasting |\n"
                "| **Core Tooling** | SQL, Excel, Tableau, Power BI, Python basics | Python, Scikit-learn, PyTorch, SQL, Statistics |\n"
                "| **Mathematics** | Descriptive statistics, aggregations, percentiles | Linear algebra, multivariable calculus, probability distributions |\n"
                "| **Typical Output** | BI dashboards, stakeholder executive reports | Deployed ML models, automated scoring pipelines |\n\n"
                "👉 **Recommendation:** If you enjoy storytelling, data visualization, and business strategy, target **Data Analyst**. "
                "If you enjoy algorithmic coding and mathematical modeling, target **Data Scientist**!"
            )
        elif ("machine learning" in msg or "ml" in msg) and ("data science" in msg or "data scientist" in msg):
            return (
                "### ⚖️ Comparison: Machine Learning Engineer vs. Data Scientist\n\n"
                "| Dimension | Data Scientist | Machine Learning Engineer |\n"
                "|---|---|---|\n"
                "| **Focus** | Formulating hypotheses, EDA, prototyping ML models | Software engineering, MLOps, low-latency deployment |\n"
                "| **Coding Depth** | Python notebooks, SQL, visualization libraries | Production Python/C++, Docker, Kubernetes, CI/CD, APIs |\n"
                "| **Core Challenge** | Finding actionable insights and statistical signals | Scaling models, minimizing inference latency, handling data drift |\n\n"
                "👉 **Recommendation:** Start with Data Science fundamentals, then level up software engineering and containerization skills to become an ML Engineer!"
            )
        elif ("frontend" in msg or "front-end" in msg) and ("backend" in msg or "back-end" in msg):
            return (
                "### ⚖️ Comparison: Frontend Developer vs. Backend Developer\n\n"
                "| Dimension | Frontend Developer | Backend Developer |\n"
                "|---|---|---|\n"
                "| **Focus** | User interface, responsiveness, accessibility, client state | Business logic, databases, API design, security, scalability |\n"
                "| **Core Tech** | React, TypeScript, Tailwind CSS, Next.js, HTML/CSS | Python (FastAPI/Django), Node.js, Go, PostgreSQL, Redis, Docker |\n"
                "| **Key Challenge** | Performance (LCP, FID), cross-browser compatibility | High throughput, data consistency (ACID), microservice reliability |\n\n"
                "👉 **Recommendation:** If you love visual creativity and user interaction, choose **Frontend**; if you love system design and data architecture, choose **Backend**!"
            )

    # Intent B: Transition / How to become
    if any(k in msg for k in ["transition", "switch", "shift", "how to become", "how do i transition", "change career", "switch to"]):
        return (
            f"### 🚀 Structured Transition Blueprint: Becoming a {target_role}\n\n"
            f"Hello **{student_name}**! Transitioning into **{target_role}** with your background (**{qual} in {stream}**) is a realistic and high-ROI move. "
            f"Here is your prioritized 4-phase transition blueprint:\n\n"
            f"#### 1. Core Competency Foundation (Weeks 1–6)\n"
            f"- Master programming fundamentals: Focus on clean code, modular architecture, and algorithms.\n"
            f"- Domain Math & Theory: Solidify the foundational principles needed for {target_role}.\n\n"
            f"#### 2. Toolchain & Industry Frameworks (Weeks 7–14)\n"
            f"- Hands-on framework mastery: Build small functional prototypes using modern frameworks.\n"
            f"- Version Control: Establish a professional GitHub profile with structured commits and documentation.\n\n"
            f"#### 3. Capstone Portfolio Artifacts (Weeks 15–20)\n"
            f"- Build 2 end-to-end production projects rather than generic tutorial clones.\n"
            f"- Containerize with Docker, write unit tests, and provide live deployed demonstrations.\n\n"
            f"#### 4. Outreach & Technical Interview Prep (Weeks 21+)\n"
            f"- Practice domain coding and system architecture questions.\n"
            f"- Optimize your resume with measurable impact metrics using our **Resume Analyzer**.\n\n"
            f"💡 *Visit the **Learning Roadmap** tab for detailed week-by-week course recommendations!*"
        )

    # Intent C: Portfolio Projects / What to build
    if any(k in msg for k in ["portfolio", "project", "what should i build", "what to build", "projects to build", "github"]):
        blueprints = ROLE_PROJECT_BLUEPRINTS.get(target_role)
        if not blueprints:
            kb = CAREER_KNOWLEDGE_BASE.get(target_role, {})
            req_tech = kb.get("required_technical_skills", ["Python", "SQL", "Git", "Docker"])
            blueprints = [
                {
                    "title": f"Full-Lifecycle Production {target_role} Application",
                    "stack": ", ".join(req_tech[:4]),
                    "description": f"Build an end-to-end system integrating core {target_role} workflows with automated testing and containerized deployment."
                },
                {
                    "title": f"Real-Time Telemetry & Monitoring Dashboard for {target_role}",
                    "stack": f"{req_tech[0] if req_tech else 'Python'}, REST API, Docker",
                    "description": "Construct an interactive dashboard tracking key domain metrics, error rates, and automated alerts."
                }
            ]

        projects_md = ""
        for i, p in enumerate(blueprints, 1):
            projects_md += f"**{i}. {p['title']}**\n- **Tech Stack:** `{p['stack']}`\n- **Architecture:** {p['description']}\n\n"

        return (
            f"### 💼 Recommended Portfolio Projects for {target_role}\n\n"
            f"To stand out to recruiters, your GitHub needs projects that demonstrate production architecture, not simple tutorial clones. "
            f"Here are high-impact project blueprints tailored for **{target_role}**:\n\n"
            f"{projects_md}"
            f"#### 🌟 What Makes a Portfolio Stand Out:\n"
            f"- **Live Interactive Demo:** Hosted on Vercel, Render, or cloud providers.\n"
            f"- **Production Standards:** Include a `Dockerfile`, clean `README.md` with architectural diagram, and unit tests.\n"
            f"- **Measurable Impact:** Highlight latency, accuracy, or business metric improvements in your summary.\n\n"
            f"👉 *Check the **Learning Roadmap** tab for milestone project prompts!*"
        )

    # Intent D: Technical Interview Preparation & Questions
    if any(k in msg for k in ["interview", "mock interview", "questions", "coding round", "system design", "behavioral"]):
        q_pairs = ROLE_INTERVIEW_QUESTIONS.get(target_role)
        if not q_pairs:
            kb = CAREER_KNOWLEDGE_BASE.get(target_role, {})
            req_tech = kb.get("required_technical_skills", ["Core Principles", "Architecture", "Tooling"])
            q_pairs = [
                (f"How do you design and optimize systems for {target_role}?", 
                 f"Focus on modularity, testing, scalability, and applying {req_tech[0] if req_tech else 'core'} best practices."),
                (f"What trade-offs do you consider when selecting tools for {target_role}?", 
                 "Discuss performance, team familiarity, latency, and long-term maintainability.")
            ]

        qa_md = ""
        for i, (q, a) in enumerate(q_pairs[:3], 1):
            qa_md += f"**Q{i}: {q}**\n- *Key Answer Angle:* {a}\n\n"

        return (
            f"### 🎯 Technical Interview Preparation for {target_role}\n\n"
            f"Interviews for **{target_role}** typically consist of 4 distinct stages:\n\n"
            f"1. **Coding & Data Structures (45–60 min):** Arrays, Hash Maps, Trees, Graphs, and Big-O efficiency.\n"
            f"2. **Domain Knowledge & Theory (45 min):** Core principles, architectural trade-offs, and optimization techniques.\n"
            f"3. **System Design & Practical Task (45–60 min):** Designing scalable component architectures.\n"
            f"4. **Behavioral & STAR Leadership:** Conflict resolution, cross-functional collaboration, and ownership.\n\n"
            f"#### 🔍 Sample High-Frequency Questions:\n\n"
            f"{qa_md}"
            f"💡 *Tip: Practice speaking through your thought process out loud before writing any code.*"
        )

    # Intent E: Skill Gap Analysis & Profile Evaluation
    if any(k in msg for k in ["skill", "gap", "missing", "lack", "profile", "what should i learn", "what do i need", "skills am i missing"]):
        kb = CAREER_KNOWLEDGE_BASE.get(target_role, {})
        req_tech = kb.get("required_technical_skills", ["Python", "SQL", "Git", "Docker"])
        
        # Match against current skills
        student_skill_list = [s.strip().lower() for s in student_skills.split(",") if s.strip()]
        acquired = [r for r in req_tech if any(s in r.lower() or r.lower() in s for s in student_skill_list)]
        missing = [r for r in req_tech if r not in acquired]

        acquired_str = ", ".join(acquired) if acquired else "None recorded yet"
        missing_str = ", ".join(missing[:4]) if missing else "You already cover the primary technical prerequisites!"

        return (
            f"### 📊 Profile & Skill Gap Review for {target_role}\n\n"
            f"Based on your profile (**{qual} in {stream}**):\n\n"
            f"- **Skills You Already Have:** `{acquired_str}`\n"
            f"- **Critical Skills to Learn Next:** `{missing_str}`\n"
            f"- **Target Role Match Affinity:** ~{top_score}%\n\n"
            f"#### 🎯 Recommended Action Plan:\n"
            f"1. Prioritize learning `{missing[0] if missing else 'Advanced System Architecture'}` over the next 2–3 weeks.\n"
            f"2. Build a concrete GitHub project implementing this technology.\n"
            f"3. Visit our **Skill Gap Analysis** tab for an interactive breakdown and course links!"
        )

    # Intent F: Resume & ATS Optimization
    if any(k in msg for k in ["resume", "cv", "ats", "score", "format"]):
        return (
            f"### 📝 ATS Resume Optimization Guide for Tech Roles\n\n"
            f"To maximize your callback rate for **{target_role}**:\n\n"
            f"#### 1. Use the XYZ Impact Formula\n"
            f"Transform passive bullet points into measurable accomplishments:\n"
            f"- ❌ *'Created a machine learning model for churn.'*\n"
            f"- ✅ *'Developed an XGBoost customer churn model in Python, improving precision by 24% and saving $40K in annual retention costs.'*\n\n"
            f"#### 2. ATS Formatting Rules\n"
            f"- **Single Column Layout:** Multi-column tables confuse ATS parsers.\n"
            f"- **Standard Section Headers:** Use `Skills`, `Experience`, `Education`, and `Projects`.\n"
            f"- **File Format:** Upload clean PDF or DOCX format without scanned image text.\n\n"
            f"👉 *Upload your CV to our **Resume Analyzer** tab to get an instant 0–100 ATS score and keyword gap analysis!*"
        )

    # Intent G: Salary & Market Trends
    if any(k in msg for k in ["salary", "pay", "compensation", "package", "market trend", "demand", "2025", "2026"]):
        return (
            f"### 💰 2025/2026 Tech Market & Compensation Overview\n\n"
            f"For roles in **{target_role}** and related domains:\n\n"
            f"- **Entry-Level (0–2 yrs):** High demand for strong algorithmic problem-solving and demonstrable GitHub repos.\n"
            f"- **Mid-Level (3–5 yrs):** Premium placed on end-to-end system ownership, cloud deployment, and system architecture.\n"
            f"- **Senior/Lead (5+ yrs):** Cross-functional leadership, architectural trade-offs, and scaling systems.\n\n"
            f"#### 🚀 Highest Growth Niches:\n"
            f"- Generative AI & LLMOps\n"
            f"- Cloud-Native Infrastructure & Kubernetes\n"
            f"- Application Security & Zero-Trust Architecture\n\n"
            f"👉 *Focus on building production-grade projects to command top-tier compensation brackets!*"
        )

    # Intent H: Specific Career Catalog Lookup
    if target_role in CAREER_KNOWLEDGE_BASE and target_role != top_career:
        data = CAREER_KNOWLEDGE_BASE[target_role]
        skills = ", ".join(data.get("required_technical_skills", [])[:5])
        soft = ", ".join(data.get("required_soft_skills", [])[:3])
        opps = ", ".join(data.get("opportunities", [])[:3])
        return (
            f"### 🌟 Career Profile: {target_role}\n\n"
            f"{data.get('description', '')}\n\n"
            f"- **Market Demand:** {data.get('market_outlook', 'High Growth')}\n"
            f"- **Core Technical Stack:** `{skills}`\n"
            f"- **Essential Soft Skills:** `{soft}`\n"
            f"- **Industry Pathways:** {opps}\n\n"
            f"💡 *Would you like to see portfolio projects, learning milestones, or interview questions for {target_role}?*"
        )

    # Intent I: Greetings & Help
    if any(k in msg for k in ["hello", "hi", "hey", "help", "who are you", "start"]):
        return (
            f"Hello **{student_name}**! 👋 I am your **CareerCompass AI Counselor**.\n\n"
            f"I have analyzed your profile (**{qual} in {stream}**) with your top career match: **{top_career}** ({top_score}% match).\n\n"
            f"Here is how I can help you today:\n"
            f"- 🚀 **Career Transition:** Ask *'How do I transition into {top_career}?'*\n"
            f"- 💼 **Portfolio Projects:** Ask *'What portfolio projects should I build?'*\n"
            f"- 🎯 **Interview Prep:** Ask *'Give me mock interview questions for {top_career}'*\n"
            f"- 📊 **Skill Gap Review:** Ask *'What skills am I missing?'*\n"
            f"- 📝 **Resume Tips:** Ask *'How can I optimize my resume for ATS?'*\n\n"
            f"What would you like to explore next?"
        )

    # Intelligent Contextual Fallback
    return (
        f"Thank you for your question, **{student_name}**! Regarding *\"{user_message}\"*:\n\n"
        f"In the context of your background (**{qual} in {stream}**) and your affinity for **{top_career}**, "
        f"I recommend exploring the following tailored paths:\n\n"
        f"1. **Check Your Learning Roadmap:** Follow structured Beginner, Intermediate, and Advanced stages under the **Roadmap** tab.\n"
        f"2. **Bridge Core Competencies:** Inspect missing skills in the **Skill Gap Analysis** module.\n"
        f"3. **Validate Your Resume:** Scan your CV with our **Resume Analyzer** to check your 0–100 ATS score.\n\n"
        f"💬 *Feel free to ask me about specific projects, mock interview questions, or transition steps for any career!*"
    )
