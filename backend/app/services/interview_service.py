"""
AI Technical Mock Interviewer Service.
Provides role-specific scenario questions and real-time STAR method answer evaluation
powered by Google Gemini (with resilient offline curated bank fallbacks).
"""
import json
import re
from typing import Dict, Any, List, Optional
from app.core.config import settings

# Google Gemini client initialization
genai_client = None
if settings.GEMINI_API_KEY:
    try:
        from google import genai
        genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception:
        genai_client = None


FALLBACK_QUESTION_BANK: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "Machine Learning Engineer": {
        "Junior": [
            {
                "question": "Can you explain the difference between supervised and unsupervised learning, and give an example of an algorithm you have used for each?",
                "key_concepts": ["labeled data", "clustering", "classification", "regression", "scikit-learn"],
                "model_answer": "In supervised learning, the model is trained on labeled ground-truth data (e.g. predicting house prices with Ridge Regression or churn with XGBoost). In unsupervised learning, the model discovers latent patterns in unlabeled data without target guidance (e.g. customer segmentation using K-Means or PCA dimensionality reduction)."
            },
            {
                "question": "What is overfitting, and what are three concrete techniques you use to prevent it in your machine learning models?",
                "key_concepts": ["cross-validation", "regularization", "dropout", "early stopping", "training vs validation loss"],
                "model_answer": "Overfitting occurs when a model learns noise and specific quirks of the training data rather than generalizing. To prevent it, I use: 1) K-Fold Cross-Validation, 2) Regularization like L1/L2 or Dropout in neural networks, and 3) Early Stopping based on validation loss curves."
            },
            {
                "question": "How do you evaluate a classification model when the dataset has severe class imbalance (e.g., 98% negative, 2% positive)?",
                "key_concepts": ["precision", "recall", "f1-score", "pr-auc", "confusion matrix", "smote", "class weights"],
                "model_answer": "Accuracy is misleading with imbalanced data. Instead, I monitor Precision, Recall, and PR-AUC. In a fraud detection project, I optimized the F1-Score and set class weights in LightGBM, reducing missed fraud instances by 28% without flooding users with false positives."
            }
        ],
        "Mid-Level": [
            {
                "question": "Describe a time when you designed and deployed an end-to-end ML pipeline. How did you handle data validation, model versioning, and latency?",
                "key_concepts": ["mlflow", "fastapi", "docker", "feature store", "drift detection", "latency", "p95"],
                "model_answer": "In my previous project, I built a customer churn microservice using FastAPI, Docker, and MLflow. I implemented Pydantic schemas for input validation, stored versioned model artifacts with MLflow, and cached frequent query vectors in Redis, achieving a p95 latency under 45ms."
            },
            {
                "question": "How do you detect and mitigate data drift and concept drift once an ML model is serving live traffic in production?",
                "key_concepts": ["kolmogorov-smirnov", "psi", "drift", "monitoring", "retraining trigger", "evidently ai"],
                "model_answer": "I track Population Stability Index (PSI) and Kolmogorov-Smirnov statistics on incoming feature distributions compared against the training baseline. When PSI exceeds 0.2, an automated alert fires, triggering an asynchronous shadow evaluation pipeline before promoting a retrained model."
            },
            {
                "question": "Walk me through how you choose between a tree-based ensemble (like LightGBM/XGBoost) and a deep neural network for tabular data.",
                "key_concepts": ["tabular data", "feature interactions", "training speed", "interpretability", "shap", "hyperparameters"],
                "model_answer": "For structured tabular datasets, gradient boosted decision trees like LightGBM generally outperform deep learning in sample efficiency, memory footprint, and out-of-the-box handling of categorical features. I reserve neural networks for unstructured multimodal data or massive datasets with continuous embeddings."
            }
        ],
        "Senior": [
            {
                "question": "How would you architect a distributed real-time recommendation system handling 100,000 queries per second with sub-50ms latency?",
                "key_concepts": ["two-tower model", "ann search", "faiss", "redis", "kafka", "flink", "grpc", "sharding"],
                "model_answer": "I would use a two-stage architecture: 1) Candidate Retrieval using two-tower embedding models with FAISS/Milvus for Approximate Nearest Neighbors vector search, reducing millions of items to top 500 in 15ms; 2) Fine Ranking using a multi-task deep ranking model served via Triton Inference Server and gRPC with Redis feature caching."
            },
            {
                "question": "Tell me about a complex technical disagreement you had regarding model evaluation metrics vs. business KPIs. How did you resolve it?",
                "key_concepts": ["business impact", "ab testing", "stakeholders", "offline vs online", "star method"],
                "model_answer": "Our engineering team wanted to optimize pure log-loss, but business operations cared about revenue retention. I bridged this by mapping expected monetary value per prediction threshold and conducting a 50/50 randomized A/B test. The threshold with slightly lower log-loss delivered $120,000 higher quarterly retention."
            }
        ]
    },
    "Frontend Developer": {
        "Junior": [
            {
                "question": "Explain the difference between state and props in React, and how data flows between parent and child components.",
                "key_concepts": ["unidirectional data flow", "immutable props", "local state", "hooks", "useState"],
                "model_answer": "Props are read-only inputs passed from parent to child components, establishing unidirectional data flow. State is mutable internal data managed within a component using hooks like useState. When parent state changes, props update and child components re-render."
            },
            {
                "question": "What is the purpose of the virtual DOM, and how does React's reconciliation process improve performance?",
                "key_concepts": ["virtual dom", "reconciliation", "fiber", "diffing algorithm", "batched updates"],
                "model_answer": "The Virtual DOM is a lightweight in-memory representation of the real DOM. Instead of touching slow browser DOM nodes directly on every state update, React diffs virtual trees using its Fiber reconciler and applies the minimal set of batched real DOM mutations."
            }
        ],
        "Mid-Level": [
            {
                "question": "How do you systematically diagnose and resolve web performance issues like slow Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?",
                "key_concepts": ["core web vitals", "lighthouse", "code splitting", "font-display", "aspect-ratio", "cdn", "image optimization"],
                "model_answer": "I profile with Chrome DevTools Performance panel and Lighthouse. For LCP, I preload critical hero assets, enable modern WebP/AVIF formats, and eliminate render-blocking scripts via code splitting. For CLS, I enforce explicit aspect-ratio attributes on images and reserve skeleton dimensions."
            },
            {
                "question": "Describe how you would design a scalable client-side global state architecture for a complex SaaS application with frequent live updates.",
                "key_concepts": ["zustand", "tanstack query", "optimistic updates", "memoization", "normalized state"],
                "model_answer": "I separate server cache from client UI state: TanStack Query manages asynchronous API data, caching, and optimistic rollbacks, while lightweight stores like Zustand manage local UI preferences. I memoize selectors to prevent unnecessary subtree re-renders."
            }
        ],
        "Senior": [
            {
                "question": "How do you design a shared design system component library across multiple engineering teams while enforcing accessibility and zero regressions?",
                "key_concepts": ["storybook", "design tokens", "tailwind", "wcag 2.1 aa", "aria", "semantic versioning", "visual regression"],
                "model_answer": "I structure tokens in Figma, compile them to CSS variables, and document components in Storybook. I enforce WCAG 2.1 AA via automated axe-core CI checks and Chromatic visual regression tests, distributing the package through semantic versioning."
            }
        ]
    },
    "Backend Developer": {
        "Junior": [
            {
                "question": "What is the difference between synchronous and asynchronous code execution, and when would you use async/await in a web API?",
                "key_concepts": ["event loop", "non-blocking i/o", "concurrency", "database calls", "asyncio"],
                "model_answer": "Synchronous code blocks the thread until an operation finishes. Asynchronous code allows the event loop to handle other concurrent requests while waiting for I/O operations like database queries or external API calls, significantly increasing throughput."
            },
            {
                "question": "What are the common HTTP status code ranges (2xx, 4xx, 5xx), and when would you return 401 vs 403?",
                "key_concepts": ["status codes", "authentication vs authorization", "401 unauthorized", "403 forbidden"],
                "model_answer": "2xx denotes success, 4xx client errors, and 5xx server errors. Specifically, 401 Unauthorized means the user is not authenticated (missing or invalid token), whereas 403 Forbidden means they are authenticated but lack permissions for the resource."
            }
        ],
        "Mid-Level": [
            {
                "question": "How do you ensure an API endpoint that charges a credit card is completely idempotent in a distributed environment?",
                "key_concepts": ["idempotency key", "redis lock", "atomic transaction", "webhook", "duplicate request"],
                "model_answer": "Clients provide a unique UUID idempotency key in the header. The server acquires an atomic distributed lock in Redis. If the key exists in an ongoing state, subsequent requests wait or return 409; once complete, the cached charge receipt is returned without recharging."
            },
            {
                "question": "Explain database indexing: what data structures are used, when does an index slow down queries, and how do you analyze a slow query?",
                "key_concepts": ["b-tree", "explain analyze", "write penalty", "composite index", "cardinality", "table scan"],
                "model_answer": "Most relational DBs use B-Trees for fast O(log N) searches. Indexes speed up reads but add write/update overhead because index trees must be modified. I run EXPLAIN ANALYZE to identify sequential scans and missing composite indexes on high-cardinality filters."
            }
        ],
        "Senior": [
            {
                "question": "Walk me through how you would architect a resilient event-driven notification system handling 10 million daily push/email/SMS notifications.",
                "key_concepts": ["kafka", "rabbitmq", "celery", "rate limiting", "dead letter queue", "exponential backoff", "idempotency"],
                "model_answer": "I decouple request ingestion from delivery using Kafka topic partitions. Dedicated consumer worker pools handle specific providers (SendGrid, Twilio, APNs) with token bucket rate limiters, exponential backoff retries, and dead-letter queues (DLQ) for permanent inspection."
            }
        ]
    }
}


def _get_fallback_question(career: str, difficulty: str, asked_questions: List[str]) -> Dict[str, Any]:
    """Retrieves an unasked question from the curated fallback question bank."""
    career_bank = FALLBACK_QUESTION_BANK.get(career)
    if not career_bank:
        career_bank = FALLBACK_QUESTION_BANK["Machine Learning Engineer"]
    
    diff_bank = career_bank.get(difficulty) or career_bank.get("Mid-Level") or list(career_bank.values())[0]
    
    # Filter out already asked questions
    unasked = [q for q in diff_bank if q["question"] not in asked_questions]
    if unasked:
        return unasked[0]
    return diff_bank[0]


def generate_interview_question(career: str, difficulty: str = "Mid-Level", history: List[Dict[str, Any]] = None) -> str:
    """
    Generates a role-specific scenario question tailored to career and difficulty.
    Uses Gemini AI if available; falls back smoothly to curated database.
    """
    history = history or []
    asked = [h.get("question", "") for h in history if "question" in h]
    asked_str = "\n".join([f"- {q}" for q in asked[-4:]]) if asked else "None yet."

    if genai_client:
        prompt = (
            f"You are a Senior Technical Hiring Manager conducting a live mock interview for the role of '{career}' "
            f"at '{difficulty}' level.\n\n"
            f"Previous questions asked in this session:\n{asked_str}\n\n"
            f"Generate ONE new, highly realistic, scenario-based technical or situational interview question. "
            f"Requirements:\n"
            f"- Question must test practical skills, architectural decisions, or real-world problem solving for a {career}.\n"
            f"- Match difficulty level: {difficulty}.\n"
            f"- Keep it focused: exactly 1–2 sentences without preamble, greetings, or extra explanations.\n"
            f"- Return ONLY the question text."
        )
        import concurrent.futures

        def _call_gemini_q() -> Optional[str]:
            try:
                res = genai_client.models.generate_content(model="gemini-3.1-flash-lite", contents=prompt)
                if res and res.text:
                    clean_q = res.text.strip().strip('"').strip("'")
                    if len(clean_q) > 15:
                        return clean_q
            except Exception:
                return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_call_gemini_q)
            try:
                q_text = future.result(timeout=6.0)
                if q_text:
                    return q_text
            except Exception:
                pass

    # Fallback to curated bank
    item = _get_fallback_question(career, difficulty, asked)
    return item["question"]


def evaluate_interview_answer(
    career: str,
    difficulty: str,
    question: str,
    user_answer: str
) -> Dict[str, Any]:
    """
    Evaluates candidate's answer on a 1-10 scale based on:
    - Technical Depth & Framework Accuracy (1-10)
    - Communication Clarity & STAR Structure (1-10)
    - Actionable Feedback
    - Ideal Model STAR Answer
    """
    clean_ans = user_answer.strip()
    word_count = len(clean_ans.split())

    # Check for empty / trivial input
    if word_count < 3:
        return {
            "score": 2.0,
            "technical_accuracy": 2.0,
            "communication_clarity": 2.0,
            "feedback": "Your answer was very brief. In technical interviews, provide context, mention specific tools, and explain your reasoning using the STAR method (Situation, Task, Action, Result).",
            "model_answer": f"For {career} interviews, structure your response by framing the business problem, naming specific technologies, detailing the steps you took, and quantifying the outcome."
        }

    # Attempt Gemini evaluation first
    if genai_client:
        prompt = (
            f"You are an expert technical interviewer evaluating a candidate for the role of '{career}' ({difficulty} level).\n\n"
            f"QUESTION:\n\"{question}\"\n\n"
            f"CANDIDATE'S ANSWER:\n\"{user_answer}\"\n\n"
            f"Evaluate this response rigorously as an industry tech leader. Provide your evaluation strictly in valid JSON with these exact keys:\n"
            f"{{\n"
            f"  \"score\": <float from 1.0 to 10.0 overall score>,\n"
            f"  \"technical_accuracy\": <float from 1.0 to 10.0>,\n"
            f"  \"communication_clarity\": <float from 1.0 to 10.0>,\n"
            f"  \"feedback\": \"<2-3 sentences of actionable, constructive feedback highlighting strengths and what technical depth or STAR structure was missing>\",\n"
            f"  \"model_answer\": \"<An ideal, concise 3-4 sentence response adhering to the STAR method: Situation, Task, Action with specific tech stack, and Quantified Result>\"\n"
            f"}}\n"
            f"Output JSON ONLY without Markdown code fences."
        )
        import concurrent.futures

        def _call_gemini_eval() -> Optional[Dict[str, Any]]:
            try:
                res = genai_client.models.generate_content(model="gemini-3.1-flash-lite", contents=prompt)
                if res and res.text:
                    raw = res.text.strip()
                    raw = re.sub(r"^```(?:json)?", "", raw).rstrip("`").strip()
                    return json.loads(raw)
            except Exception:
                return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_call_gemini_eval)
            try:
                data = future.result(timeout=6.0)
                if data and isinstance(data, dict):
                    return {
                        "score": round(float(data.get("score", 7.0)), 1),
                        "technical_accuracy": round(float(data.get("technical_accuracy", 7.0)), 1),
                        "communication_clarity": round(float(data.get("communication_clarity", 7.0)), 1),
                        "feedback": str(data.get("feedback", "Solid technical foundation. Be sure to quantify your impact.")),
                        "model_answer": str(data.get("model_answer", "Situation: Handled production traffic... Action: Implemented caching... Result: Reduced latency by 40%."))
                    }
            except Exception:
                pass

    # Offline Rubric-based Fallback
    base_score = 6.0
    tech_score = 6.0
    comm_score = 6.0

    if word_count > 60:
        base_score += 1.5
        comm_score += 1.5
    elif word_count > 30:
        base_score += 0.8
        comm_score += 0.8

    # Keyword scanning
    tech_signals = ["model", "data", "pipeline", "api", "database", "cache", "performance", "docker", "test", "metric", "deploy", "scale", "optimize"]
    matched_signals = [s for s in tech_signals if s in clean_ans.lower()]
    if len(matched_signals) >= 3:
        tech_score += 2.0
        base_score += 1.0
    elif len(matched_signals) >= 1:
        tech_score += 1.0

    base_score = min(9.5, max(3.0, base_score))
    tech_score = min(9.5, max(3.0, tech_score))
    comm_score = min(9.5, max(3.0, comm_score))

    feedback = (
        f"Good effort. You addressed the core concept and touched on {', '.join(matched_signals[:2]) if matched_signals else 'key ideas'}. "
        f"To elevate this to a top-percentile response, structure your explanation with the STAR method (Situation, Task, Action, Result) "
        f"and include specific performance metrics (e.g. latency, throughput, error rate reduction)."
    )
    model_ans = (
        f"\"In my recent project as a {career}, our team needed to address this exact challenge (Situation). "
        f"My objective was to ensure reliability and low latency (Task). I implemented a modular solution using standard industry tools, "
        f"adding robust caching and automated test coverage (Action), which improved system throughput by 35% and eliminated production regressions (Result).\""
    )

    return {
        "score": round(base_score, 1),
        "technical_accuracy": round(tech_score, 1),
        "communication_clarity": round(comm_score, 1),
        "feedback": feedback,
        "model_answer": model_ans
    }
