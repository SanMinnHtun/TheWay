export interface CareerRoadmapStage {
  stage: string;
  title: string;
  skills: string[];
  description: string;
}

export interface CareerRoadmapDefinition {
  role: string;
  stages: CareerRoadmapStage[];
}

export const CAREER_ROADMAPS: Record<string, CareerRoadmapDefinition> = {
  "Frontend / UI-UX Developer": {
    "role": "Frontend / UI-UX Developer",
    "stages": [
      {
        "stage": "Stage 1",
        "title": "Web Core & Layout Foundations",
        "skills": [
          "HTML5",
          "CSS3 / Modern Flex & Grid",
          "JavaScript (ES6+)",
          "UI/UX Principles"
        ],
        "description": "Master responsive design patterns, semantic markup, and cross-browser compatibility."
      },
      {
        "stage": "Stage 2",
        "title": "Modern Component Frameworks",
        "skills": [
          "React.js",
          "Vite",
          "Tailwind CSS",
          "State Management (Zustand/Redux)"
        ],
        "description": "Construct interactive component trees, responsive design tokens, and application state flows."
      },
      {
        "stage": "Stage 3",
        "title": "Type Safety & API Integration",
        "skills": [
          "TypeScript",
          "TanStack Query",
          "Axios",
          "REST & GraphQL Integration"
        ],
        "description": "Enforce type safety across frontend codebases and manage asynchronous client-side state caching."
      },
      {
        "stage": "Stage 4",
        "title": "Performance, Animation & Design Systems",
        "skills": [
          "Framer Motion",
          "Next.js / SSR",
          "Web Vitals Optimization",
          "Figma Design Tokens"
        ],
        "description": "Implement smooth micro-interactions, optimize Lighthouse Web Vitals, and build scalable UI libraries."
      }
    ]
  },
  "Knowledge Graph / Ontology Specialist": {
    "role": "Knowledge Graph / Ontology Specialist",
    "stages": [
      {
        "stage": "Stage 1",
        "title": "Knowledge Representation & Logic",
        "skills": [
          "Discrete Logic",
          "Set Theory",
          "Data Modeling",
          "JSON-LD"
        ],
        "description": "Understand formal semantics, taxonomy hierarchies, and linked data formats."
      },
      {
        "stage": "Stage 2",
        "title": "Semantic Web Standards",
        "skills": [
          "RDF / RDFS",
          "OWL (Web Ontology Language)",
          "Protégé",
          "SPARQL"
        ],
        "description": "Build domain ontologies and query semantic knowledge repositories."
      },
      {
        "stage": "Stage 3",
        "title": "Graph Databases & Vector Search",
        "skills": [
          "Neo4j / Cypher",
          "Vector DBs (Chroma/Qdrant)",
          "Entity Resolution"
        ],
        "description": "Manage property graph architectures and hybrid vector retrieval systems."
      },
      {
        "stage": "Stage 4",
        "title": "Graph RAG & AI Grounding",
        "skills": [
          "GraphRAG",
          "Knowledge-Grounded LLMs",
          "Ontology Alignment"
        ],
        "description": "Integrate knowledge graphs with LLMs to eliminate hallucinations and provide factual reasoning."
      }
    ]
  },
  "AI / ML / Data Science Engineer": {
    "role": "AI / ML / Data Science Engineer",
    "stages": [
      {
        "stage": "Stage 1",
        "title": "Mathematics & Python Foundations",
        "skills": [
          "Linear Algebra",
          "Probability & Statistics",
          "Python",
          "NumPy & Pandas"
        ],
        "description": "Build a strong mathematical foundation for machine learning algorithms and data manipulation."
      },
      {
        "stage": "Stage 2",
        "title": "Classical Machine Learning",
        "skills": [
          "Scikit-Learn",
          "Feature Engineering",
          "Supervised/Unsupervised Learning",
          "Evaluation Metrics"
        ],
        "description": "Train classification, regression, and clustering algorithms with cross-validation."
      },
      {
        "stage": "Stage 3",
        "title": "Deep Learning & Neural Networks",
        "skills": [
          "PyTorch / TensorFlow",
          "CNNs & Computer Vision",
          "Transformers",
          "NLP"
        ],
        "description": "Build and train neural network architectures for vision and language processing."
      },
      {
        "stage": "Stage 4",
        "title": "LLM Fine-Tuning & MLOps",
        "skills": [
          "Hugging Face",
          "LoRA / QLoRA",
          "FastAPI Model Serving",
          "Docker"
        ],
        "description": "Fine-tune open-source foundation models and deploy low-latency inference services."
      }
    ]
  },
  "Backend / API Engineer": {
    "role": "Backend / API Engineer",
    "stages": [
      {
        "stage": "Stage 1",
        "title": "Programming & Networking Basics",
        "skills": [
          "Java / Python / Node.js",
          "HTTP/REST",
          "Git & GitHub",
          "Linux CLI"
        ],
        "description": "Master a server-side language, version control, and web communication fundamentals."
      },
      {
        "stage": "Stage 2",
        "title": "Data Persistence & Endpoint Security",
        "skills": [
          "PostgreSQL / MongoDB",
          "FastAPI / Spring Boot",
          "JWT Authentication",
          "ORM Optimization"
        ],
        "description": "Structure database schemas and build protected API endpoints with role-based access control."
      },
      {
        "stage": "Stage 3",
        "title": "System Architecture & Messaging",
        "skills": [
          "Redis Caching",
          "RabbitMQ / Kafka",
          "GraphQL",
          "Microservices"
        ],
        "description": "Optimize high-concurrency requests with caching layers and event-driven architecture."
      },
      {
        "stage": "Stage 4",
        "title": "DevOps & Cloud Operations",
        "skills": [
          "Docker Containers",
          "CI/CD Pipelines",
          "Google Cloud Run / AWS",
          "Logging & Monitoring"
        ],
        "description": "Automate builds, containerize services, and monitor production backend infrastructure."
      }
    ]
  }
};
