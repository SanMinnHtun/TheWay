import type {
  Career,
  CareerCategory,
  InterviewQuestion,
  LearningGuide,
  LearningResource,
  LocalizedText,
  PortfolioProject,
  Roadmap,
  RoadmapSkill,
  RoadmapStage,
  SkillPriority
} from "../types/learning";
import type { UserMode } from "../types/profile";

const text = (en: string, my: string): LocalizedText => ({ en, my });

const resourceIdsBySkill: Record<string, string[]> = {
  "java-fundamentals": ["java-dev-tutorial"],
  "git-workflow": ["pro-git"],
  "http-fundamentals": ["mdn-http"],
  "api-debugging": ["postman-learning"],
  "sql-fundamentals": ["postgresql-tutorial", "sqlbolt"],
  "postgresql-data-modeling": ["postgresql-ddl"],
  "spring-boot-fundamentals": ["spring-rest"],
  "dependency-injection": ["spring-di"],
  "rest-api-design": ["mdn-http", "rest-api-guide"],
  "validation-error-handling": ["spring-validation"],
  "authentication-authorization": ["spring-security"],
  "owasp-basics": ["owasp-top-ten"],
  "unit-integration-testing": ["junit-guide"],
  testcontainers: ["testcontainers-guide"],
  "docker-fundamentals": ["docker-get-started"],
  "cloud-deployment": ["docker-get-started", "deployment-guide"],
  "semantic-html": ["mdn-html"],
  "responsive-css": ["mdn-css"],
  typescript: ["typescript-handbook"],
  react: ["react-learn"],
  python: ["python-tutorial"],
  linux: ["linux-command-line"],
  security: ["owasp-top-ten"],
  testing: ["testing-guide"],
  "system-design": ["system-design-guide"],
  default: ["developer-workflow-guide"]
};

function createSkill(
  id: string,
  name: LocalizedText,
  priority: SkillPriority,
  options: Partial<Omit<RoadmapSkill, "id" | "name" | "priority">> = {}
): RoadmapSkill {
  return {
    id,
    name,
    priority,
    description:
      options.description ??
      text(
        `Build practical confidence with ${name.en} through focused exercises and a working feature.`,
        `${name.my} ကို လက်တွေ့လေ့ကျင့်ခန်းများနှင့် အလုပ်လုပ်သော feature တစ်ခုတည်ဆောက်ရင်း ကျွမ်းကျင်မှုရယူပါ။`
      ),
    whyItMatters:
      options.whyItMatters ??
      text(
        `${name.en} is a recurring part of real delivery work and prepares you for the next roadmap dependency.`,
        `${name.my} သည် လက်တွေ့အလုပ်များတွင် မကြာခဏအသုံးပြုရပြီး နောက်လမ်းပြအဆင့်အတွက် အခြေခံပေးသည်။`
      ),
    learningObjectives:
      options.learningObjectives ?? [
        text(`Explain the core ideas behind ${name.en}.`, `${name.my} ၏ အခြေခံသဘောတရားများကို ရှင်းပြနိုင်ရန်။`),
        text(`Use ${name.en} in a small working example.`, `${name.my} ကို လက်တွေ့နမူနာငယ်တစ်ခုတွင် အသုံးပြုနိုင်ရန်။`),
        text("Recognize common mistakes and debug them.", "အဖြစ်များသောအမှားများကို သိရှိပြီး ဖြေရှင်းနိုင်ရန်။")
      ],
    resourceIds: options.resourceIds ?? resourceIdsBySkill[id] ?? resourceIdsBySkill.default,
    projectIds: options.projectIds
  };
}

function createStage(
  id: string,
  order: number,
  title: LocalizedText,
  skills: RoadmapSkill[],
  description?: LocalizedText,
  projectIds?: string[]
): RoadmapStage {
  return {
    id,
    order,
    title,
    description:
      description ??
      text(
        `Learn the ${title.en.toLowerCase()} skills that unlock the next part of this career path.`,
        `ဤအလုပ်အကိုင်လမ်းကြောင်း၏ နောက်အဆင့်ကို ဖွင့်ပေးမည့် ${title.my} ကျွမ်းကျင်မှုများကို လေ့လာပါ။`
      ),
    whyItMatters: text(
      `This stage groups skills that are most useful when learned together before moving forward.`,
      "ဤအဆင့်တွင် ရှေ့ဆက်မသွားမီ အတူတကွသင်ယူသင့်သော ကျွမ်းကျင်မှုများကို စုစည်းထားသည်။"
    ),
    skills,
    projectIds
  };
}

const backendRoadmap: Roadmap = {
  id: "backend-developer-roadmap",
  careerId: "backend-developer",
  title: text("Backend Developer Roadmap", "Backend Developer လမ်းပြမြေပုံ"),
  description: text(
    "Move from programming foundations to secure, tested, deployable backend services.",
    "Programming အခြေခံမှ လုံခြုံပြီး စမ်းသပ်ကာ deploy လုပ်နိုင်သော backend services များအထိ တစ်ဆင့်ချင်းသွားပါ။"
  ),
  stages: [
    createStage(
      "programming-foundations",
      1,
      text("Programming Foundations", "Programming အခြေခံ"),
      [
        createSkill("java-fundamentals", text("Java Fundamentals", "Java အခြေခံ"), "essential", {
          description: text(
            "Write clear Java using types, control flow, collections, classes, and exceptions.",
            "Types၊ control flow၊ collections၊ classes နှင့် exceptions များဖြင့် ရှင်းလင်းသော Java code ရေးပါ။"
          ),
          whyItMatters: text(
            "Spring applications assume you can already model data and behavior confidently in Java.",
            "Spring application များသည် Java ဖြင့် data နှင့် behavior ကို ယုံကြည်စွာ တည်ဆောက်နိုင်သည်ဟု ယူဆထားသည်။"
          ),
          learningObjectives: [
            text("Types, methods, and control flow", "Types၊ methods နှင့် control flow"),
            text("Collections and generics", "Collections နှင့် generics"),
            text("Classes, interfaces, and exceptions", "Classes၊ interfaces နှင့် exceptions")
          ]
        }),
        createSkill("git-workflow", text("Git & Developer Workflow", "Git နှင့် Developer Workflow"), "recommended")
      ],
      text(
        "Build the language and workflow habits every later backend stage depends on.",
        "နောက်ပိုင်း backend အဆင့်တိုင်းလိုအပ်သော language နှင့် workflow အလေ့အကျင့်များကို တည်ဆောက်ပါ။"
      )
    ),
    createStage(
      "web-service-foundations",
      2,
      text("Web & Service Foundations", "Web နှင့် Service အခြေခံ"),
      [
        createSkill("http-fundamentals", text("HTTP Fundamentals", "HTTP အခြေခံ"), "essential"),
        createSkill("api-debugging", text("API Debugging", "API Debugging"), "recommended")
      ]
    ),
    createStage(
      "databases-sql",
      3,
      text("Databases & SQL", "Databases နှင့် SQL"),
      [
        createSkill("sql-fundamentals", text("SQL Fundamentals", "SQL အခြေခံ"), "essential", {
          description: text(
            "Query and change relational data using clear SQL before relying on an ORM.",
            "ORM ကို မမှီခိုမီ relational data ကို ရှင်းလင်းသော SQL ဖြင့် query နှင့် ပြင်ဆင်ပါ။"
          ),
          whyItMatters: text(
            "Almost every production backend depends on persistent relational data, and SQL helps you understand what an ORM actually does.",
            "Production backend အများစုသည် relational data ပေါ် မူတည်ပြီး SQL သည် ORM အတွင်း အမှန်တကယ်ဖြစ်နေသည်ကို နားလည်စေသည်။"
          ),
          learningObjectives: [
            text("SELECT, filtering, and ordering", "SELECT၊ filtering နှင့် ordering"),
            text("JOIN, GROUP BY, and subqueries", "JOIN၊ GROUP BY နှင့် subqueries"),
            text("Indexes and transactions", "Indexes နှင့် transactions")
          ],
          projectIds: ["url-shortener-api"]
        }),
        createSkill(
          "postgresql-data-modeling",
          text("PostgreSQL Data Modeling", "PostgreSQL Data Modeling"),
          "essential",
          { projectIds: ["url-shortener-api"] }
        )
      ],
      text(
        "Understand structured data before adding application frameworks and persistence abstractions.",
        "Application framework နှင့် persistence abstraction များမထည့်မီ structured data ကို နားလည်ပါ။"
      ),
      ["url-shortener-api"]
    ),
    createStage(
      "spring-boot",
      4,
      text("Spring Boot", "Spring Boot"),
      [
        createSkill("spring-boot-fundamentals", text("Spring Boot Fundamentals", "Spring Boot အခြေခံ"), "essential"),
        createSkill("dependency-injection", text("Dependency Injection", "Dependency Injection"), "recommended")
      ]
    ),
    createStage(
      "rest-api-design",
      5,
      text("REST API Design", "REST API Design"),
      [
        createSkill("rest-api-design", text("REST API Design", "REST API Design"), "essential", {
          projectIds: ["url-shortener-api"]
        }),
        createSkill(
          "validation-error-handling",
          text("Validation & Error Handling", "Validation နှင့် Error Handling"),
          "essential",
          { projectIds: ["url-shortener-api"] }
        )
      ],
      undefined,
      ["url-shortener-api"]
    ),
    createStage(
      "authentication-security",
      6,
      text("Authentication & Security", "Authentication နှင့် Security"),
      [
        createSkill(
          "authentication-authorization",
          text("Authentication & Authorization", "Authentication နှင့် Authorization"),
          "essential",
          { projectIds: ["authentication-service"] }
        ),
        createSkill("owasp-basics", text("OWASP Security Basics", "OWASP Security အခြေခံ"), "recommended", {
          projectIds: ["authentication-service"]
        })
      ],
      undefined,
      ["authentication-service"]
    ),
    createStage(
      "backend-testing",
      7,
      text("Testing", "Testing"),
      [
        createSkill(
          "unit-integration-testing",
          text("Unit & Integration Testing", "Unit နှင့် Integration Testing"),
          "essential"
        ),
        createSkill("testcontainers", text("Testcontainers", "Testcontainers"), "optional")
      ]
    ),
    createStage(
      "docker-deployment",
      8,
      text("Docker & Deployment", "Docker နှင့် Deployment"),
      [
        createSkill("docker-fundamentals", text("Docker Fundamentals", "Docker အခြေခံ"), "essential", {
          projectIds: ["mini-deployment-platform"]
        }),
        createSkill("cloud-deployment", text("Cloud Deployment", "Cloud Deployment"), "recommended", {
          projectIds: ["mini-deployment-platform"]
        })
      ],
      undefined,
      ["mini-deployment-platform"]
    )
  ]
};

interface RoadmapBlueprint {
  careerId: string;
  title: LocalizedText;
  stages: Array<{
    id: string;
    title: LocalizedText;
    skills: Array<[string, LocalizedText, SkillPriority]>;
    projectIds?: string[];
  }>;
}

function createBlueprintRoadmap(blueprint: RoadmapBlueprint): Roadmap {
  return {
    id: `${blueprint.careerId}-roadmap`,
    careerId: blueprint.careerId,
    title: blueprint.title,
    description: text(
      "Learn the foundations, apply the core stack, build proof, and prepare to ship real work.",
      "အခြေခံကိုလေ့လာပါ၊ core stack ကိုအသုံးချပါ၊ လက်တွေ့သက်သေတည်ဆောက်ပြီး အလုပ်ကိုပေးပို့ရန် ပြင်ဆင်ပါ။"
    ),
    stages: blueprint.stages.map((stage, index) =>
      createStage(
        stage.id,
        index + 1,
        stage.title,
        stage.skills.map(([id, name, priority]) =>
          createSkill(id, name, priority, { projectIds: stage.projectIds })
        ),
        undefined,
        stage.projectIds
      )
    )
  };
}

const roadmapBlueprints: RoadmapBlueprint[] = [
  {
    careerId: "frontend-developer",
    title: text("Frontend Developer Roadmap", "Frontend Developer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "frontend-web-foundations",
        title: text("Web Foundations", "Web အခြေခံ"),
        skills: [
          ["semantic-html", text("Semantic HTML", "Semantic HTML"), "essential"],
          ["responsive-css", text("Responsive CSS", "Responsive CSS"), "essential"]
        ]
      },
      {
        id: "frontend-language-tooling",
        title: text("Language & Tooling", "Language နှင့် Tooling"),
        skills: [
          ["typescript", text("TypeScript", "TypeScript"), "essential"],
          ["git-workflow", text("Git Workflow", "Git Workflow"), "recommended"]
        ]
      },
      {
        id: "frontend-react",
        title: text("React Applications", "React Applications"),
        skills: [
          ["react", text("React Components & State", "React Components နှင့် State"), "essential"],
          ["frontend-accessibility", text("Frontend Accessibility", "Frontend Accessibility"), "recommended"]
        ],
        projectIds: ["accessible-job-board"]
      },
      {
        id: "frontend-quality-delivery",
        title: text("Quality & Delivery", "Quality နှင့် Delivery"),
        skills: [
          ["frontend-testing", text("Frontend Testing", "Frontend Testing"), "recommended"],
          ["cloud-deployment", text("Web Deployment", "Web Deployment"), "essential"]
        ],
        projectIds: ["accessible-job-board"]
      }
    ]
  },
  {
    careerId: "full-stack-developer",
    title: text("Full Stack Developer Roadmap", "Full Stack Developer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "fullstack-web",
        title: text("Web Foundations", "Web အခြေခံ"),
        skills: [
          ["semantic-html", text("HTML & CSS", "HTML နှင့် CSS"), "essential"],
          ["typescript", text("TypeScript", "TypeScript"), "essential"]
        ]
      },
      {
        id: "fullstack-frontend",
        title: text("Frontend Applications", "Frontend Applications"),
        skills: [
          ["react", text("React", "React"), "essential"],
          ["frontend-accessibility", text("Accessible UI", "Accessible UI"), "recommended"]
        ]
      },
      {
        id: "fullstack-backend",
        title: text("APIs & Data", "APIs နှင့် Data"),
        skills: [
          ["rest-api-design", text("REST APIs", "REST APIs"), "essential"],
          ["sql-fundamentals", text("SQL", "SQL"), "essential"]
        ],
        projectIds: ["url-shortener-api"]
      },
      {
        id: "fullstack-ship",
        title: text("Ship the Product", "Product ကိုပေးပို့ခြင်း"),
        skills: [
          ["authentication-authorization", text("Authentication", "Authentication"), "essential"],
          ["docker-fundamentals", text("Docker", "Docker"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "mobile-developer",
    title: text("Mobile Developer Roadmap", "Mobile Developer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "mobile-programming",
        title: text("Mobile Programming", "Mobile Programming"),
        skills: [
          ["mobile-language", text("Dart or Kotlin", "Dart သို့မဟုတ် Kotlin"), "essential"],
          ["git-workflow", text("Git Workflow", "Git Workflow"), "recommended"]
        ]
      },
      {
        id: "mobile-ui",
        title: text("Mobile Interfaces", "Mobile Interfaces"),
        skills: [
          ["mobile-layout", text("Adaptive Layouts", "Adaptive Layouts"), "essential"],
          ["mobile-accessibility", text("Mobile Accessibility", "Mobile Accessibility"), "recommended"]
        ]
      },
      {
        id: "mobile-data",
        title: text("Data & Device APIs", "Data နှင့် Device APIs"),
        skills: [
          ["mobile-networking", text("Networking & Offline Data", "Networking နှင့် Offline Data"), "essential"],
          ["mobile-platform-apis", text("Platform APIs", "Platform APIs"), "recommended"]
        ]
      },
      {
        id: "mobile-release",
        title: text("Testing & Release", "Testing နှင့် Release"),
        skills: [
          ["mobile-testing", text("Mobile Testing", "Mobile Testing"), "essential"],
          ["app-release", text("App Release", "App Release"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "devops-sre",
    title: text("DevOps / SRE Roadmap", "DevOps / SRE လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "devops-systems",
        title: text("Systems Foundations", "Systems အခြေခံ"),
        skills: [
          ["linux", text("Linux", "Linux"), "essential"],
          ["networking", text("Networking", "Networking"), "essential"]
        ]
      },
      {
        id: "devops-automation",
        title: text("Automation", "Automation"),
        skills: [
          ["scripting", text("Scripting", "Scripting"), "essential"],
          ["ci-cd", text("CI/CD", "CI/CD"), "essential"]
        ]
      },
      {
        id: "devops-containers",
        title: text("Containers & Cloud", "Containers နှင့် Cloud"),
        skills: [
          ["docker-fundamentals", text("Docker", "Docker"), "essential"],
          ["cloud-deployment", text("Cloud Deployment", "Cloud Deployment"), "essential"]
        ],
        projectIds: ["mini-deployment-platform"]
      },
      {
        id: "devops-reliability",
        title: text("Reliability", "Reliability"),
        skills: [
          ["observability", text("Observability", "Observability"), "essential"],
          ["incident-response", text("Incident Response", "Incident Response"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "cloud-engineer",
    title: text("Cloud Engineer Roadmap", "Cloud Engineer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "cloud-foundations",
        title: text("Cloud Foundations", "Cloud အခြေခံ"),
        skills: [
          ["linux", text("Linux", "Linux"), "essential"],
          ["networking", text("Cloud Networking", "Cloud Networking"), "essential"]
        ]
      },
      {
        id: "cloud-services",
        title: text("Core Cloud Services", "Core Cloud Services"),
        skills: [
          ["cloud-compute", text("Compute & Storage", "Compute နှင့် Storage"), "essential"],
          ["cloud-iam", text("Identity & Access", "Identity နှင့် Access"), "essential"]
        ]
      },
      {
        id: "cloud-automation",
        title: text("Infrastructure Automation", "Infrastructure Automation"),
        skills: [
          ["infrastructure-code", text("Infrastructure as Code", "Infrastructure as Code"), "essential"],
          ["docker-fundamentals", text("Containers", "Containers"), "recommended"]
        ],
        projectIds: ["mini-deployment-platform"]
      },
      {
        id: "cloud-operations",
        title: text("Cloud Operations", "Cloud Operations"),
        skills: [
          ["observability", text("Monitoring & Cost", "Monitoring နှင့် Cost"), "essential"],
          ["cloud-security", text("Cloud Security", "Cloud Security"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "data-engineer",
    title: text("Data Engineer Roadmap", "Data Engineer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "data-programming",
        title: text("Programming & SQL", "Programming နှင့် SQL"),
        skills: [
          ["python", text("Python", "Python"), "essential"],
          ["sql-fundamentals", text("Advanced SQL", "Advanced SQL"), "essential"]
        ]
      },
      {
        id: "data-modeling",
        title: text("Data Modeling", "Data Modeling"),
        skills: [
          ["postgresql-data-modeling", text("Relational Modeling", "Relational Modeling"), "essential"],
          ["warehouse-modeling", text("Warehouse Modeling", "Warehouse Modeling"), "recommended"]
        ]
      },
      {
        id: "data-pipelines",
        title: text("Data Pipelines", "Data Pipelines"),
        skills: [
          ["batch-pipelines", text("Batch Pipelines", "Batch Pipelines"), "essential"],
          ["streaming", text("Streaming Basics", "Streaming အခြေခံ"), "recommended"]
        ],
        projectIds: ["data-pipeline-monitor"]
      },
      {
        id: "data-platform",
        title: text("Data Platform", "Data Platform"),
        skills: [
          ["data-quality", text("Data Quality", "Data Quality"), "essential"],
          ["cloud-deployment", text("Cloud Data Services", "Cloud Data Services"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "data-scientist",
    title: text("Data Scientist Roadmap", "Data Scientist လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "science-foundations",
        title: text("Analysis Foundations", "Analysis အခြေခံ"),
        skills: [
          ["python", text("Python", "Python"), "essential"],
          ["statistics", text("Statistics", "Statistics"), "essential"]
        ]
      },
      {
        id: "science-data",
        title: text("Working with Data", "Data ဖြင့်လုပ်ဆောင်ခြင်း"),
        skills: [
          ["sql-fundamentals", text("SQL", "SQL"), "essential"],
          ["data-visualization", text("Data Visualization", "Data Visualization"), "essential"]
        ]
      },
      {
        id: "science-modeling",
        title: text("Statistical Modeling", "Statistical Modeling"),
        skills: [
          ["experimentation", text("Experimentation", "Experimentation"), "essential"],
          ["machine-learning", text("Machine Learning", "Machine Learning"), "recommended"]
        ]
      },
      {
        id: "science-communication",
        title: text("Communicate Results", "ရလဒ်များဆက်သွယ်ခြင်း"),
        skills: [
          ["data-storytelling", text("Data Storytelling", "Data Storytelling"), "essential"],
          ["model-evaluation", text("Model Evaluation", "Model Evaluation"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "ml-ai-engineer",
    title: text("ML / AI Engineer Roadmap", "ML / AI Engineer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "ml-engineering",
        title: text("Engineering Foundations", "Engineering အခြေခံ"),
        skills: [
          ["python", text("Production Python", "Production Python"), "essential"],
          ["git-workflow", text("Engineering Workflow", "Engineering Workflow"), "essential"]
        ]
      },
      {
        id: "ml-modeling",
        title: text("Machine Learning", "Machine Learning"),
        skills: [
          ["machine-learning", text("ML Fundamentals", "ML အခြေခံ"), "essential"],
          ["deep-learning", text("Deep Learning", "Deep Learning"), "recommended"]
        ]
      },
      {
        id: "ml-systems",
        title: text("ML Systems", "ML Systems"),
        skills: [
          ["model-serving", text("Model Serving", "Model Serving"), "essential"],
          ["ml-evaluation", text("Evaluation & Monitoring", "Evaluation နှင့် Monitoring"), "essential"]
        ],
        projectIds: ["data-pipeline-monitor"]
      },
      {
        id: "ml-production",
        title: text("Production AI", "Production AI"),
        skills: [
          ["llm-integration", text("LLM Integration", "LLM Integration"), "recommended"],
          ["mlops", text("MLOps", "MLOps"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "cybersecurity-engineer",
    title: text("Cybersecurity Engineer Roadmap", "Cybersecurity Engineer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "security-foundations",
        title: text("Security Foundations", "Security အခြေခံ"),
        skills: [
          ["linux", text("Linux", "Linux"), "essential"],
          ["networking", text("Networking", "Networking"), "essential"]
        ]
      },
      {
        id: "security-defense",
        title: text("Defensive Security", "Defensive Security"),
        skills: [
          ["security", text("Threat Modeling", "Threat Modeling"), "essential"],
          ["security-monitoring", text("Security Monitoring", "Security Monitoring"), "essential"]
        ]
      },
      {
        id: "security-applications",
        title: text("Application Security", "Application Security"),
        skills: [
          ["owasp-basics", text("OWASP Basics", "OWASP အခြေခံ"), "essential"],
          ["authentication-authorization", text("Identity Security", "Identity Security"), "recommended"]
        ],
        projectIds: ["authentication-service"]
      },
      {
        id: "security-operations",
        title: text("Security Operations", "Security Operations"),
        skills: [
          ["incident-response", text("Incident Response", "Incident Response"), "essential"],
          ["security-automation", text("Security Automation", "Security Automation"), "recommended"]
        ]
      }
    ]
  },
  {
    careerId: "qa-sdet",
    title: text("QA / SDET Roadmap", "QA / SDET လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "qa-foundations",
        title: text("Quality Foundations", "Quality အခြေခံ"),
        skills: [
          ["testing", text("Testing Fundamentals", "Testing အခြေခံ"), "essential"],
          ["test-design", text("Test Design", "Test Design"), "essential"]
        ]
      },
      {
        id: "qa-automation",
        title: text("Test Automation", "Test Automation"),
        skills: [
          ["automation-language", text("Automation Programming", "Automation Programming"), "essential"],
          ["api-testing", text("API Testing", "API Testing"), "essential"]
        ]
      },
      {
        id: "qa-web",
        title: text("Web & Mobile Quality", "Web နှင့် Mobile Quality"),
        skills: [
          ["e2e-testing", text("End-to-End Testing", "End-to-End Testing"), "essential"],
          ["accessibility-testing", text("Accessibility Testing", "Accessibility Testing"), "recommended"]
        ],
        projectIds: ["accessible-job-board"]
      },
      {
        id: "qa-delivery",
        title: text("Quality in Delivery", "Delivery အတွင်း Quality"),
        skills: [
          ["ci-cd", text("CI Quality Gates", "CI Quality Gates"), "recommended"],
          ["performance-testing", text("Performance Testing", "Performance Testing"), "optional"]
        ]
      }
    ]
  },
  {
    careerId: "embedded-systems-engineer",
    title: text("Embedded / Systems Engineer Roadmap", "Embedded / Systems Engineer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "systems-programming",
        title: text("Systems Programming", "Systems Programming"),
        skills: [
          ["c-programming", text("C Programming", "C Programming"), "essential"],
          ["computer-architecture", text("Computer Architecture", "Computer Architecture"), "essential"]
        ]
      },
      {
        id: "systems-hardware",
        title: text("Hardware Interfaces", "Hardware Interfaces"),
        skills: [
          ["microcontrollers", text("Microcontrollers", "Microcontrollers"), "essential"],
          ["hardware-protocols", text("Hardware Protocols", "Hardware Protocols"), "recommended"]
        ]
      },
      {
        id: "systems-realtime",
        title: text("Real-Time Systems", "Real-Time Systems"),
        skills: [
          ["rtos", text("RTOS Basics", "RTOS အခြေခံ"), "essential"],
          ["systems-debugging", text("Systems Debugging", "Systems Debugging"), "essential"]
        ]
      },
      {
        id: "systems-delivery",
        title: text("Reliable Firmware", "Reliable Firmware"),
        skills: [
          ["embedded-testing", text("Embedded Testing", "Embedded Testing"), "recommended"],
          ["embedded-linux", text("Embedded Linux", "Embedded Linux"), "optional"]
        ]
      }
    ]
  },
  {
    careerId: "game-developer",
    title: text("Game Developer Roadmap", "Game Developer လမ်းပြမြေပုံ"),
    stages: [
      {
        id: "game-programming",
        title: text("Game Programming", "Game Programming"),
        skills: [
          ["csharp", text("C# Fundamentals", "C# အခြေခံ"), "essential"],
          ["game-math", text("Game Math", "Game Math"), "recommended"]
        ]
      },
      {
        id: "game-engine",
        title: text("Game Engine", "Game Engine"),
        skills: [
          ["unity", text("Unity", "Unity"), "essential"],
          ["game-physics", text("Physics & Animation", "Physics နှင့် Animation"), "recommended"]
        ]
      },
      {
        id: "game-systems",
        title: text("Gameplay Systems", "Gameplay Systems"),
        skills: [
          ["game-architecture", text("Gameplay Architecture", "Gameplay Architecture"), "essential"],
          ["game-ai", text("Game AI", "Game AI"), "optional"]
        ]
      },
      {
        id: "game-polish",
        title: text("Testing & Polish", "Testing နှင့် Polish"),
        skills: [
          ["game-testing", text("Playtesting", "Playtesting"), "essential"],
          ["game-performance", text("Performance", "Performance"), "recommended"]
        ]
      }
    ]
  }
];

const blueprintRoadmaps: Roadmap[] = roadmapBlueprints.map(createBlueprintRoadmap);

export const roadmaps: Roadmap[] = [backendRoadmap, ...blueprintRoadmaps];

interface CareerSeed {
  id: string;
  name: LocalizedText;
  category: CareerCategory;
  categoryLabel: LocalizedText;
  shortDescription: LocalizedText;
  stack: string[];
  matches: Record<UserMode, number>;
  responsibilities: LocalizedText[];
  traits: LocalizedText[];
}

const careerSeeds: CareerSeed[] = [
  {
    id: "frontend-developer",
    name: text("Frontend Developer", "Frontend Developer"),
    category: "web",
    categoryLabel: text("Web", "Web"),
    shortDescription: text(
      "Build accessible interfaces and interactions people use every day.",
      "လူများနေ့စဉ်အသုံးပြုသော နားလည်လွယ်ပြီး accessible ဖြစ်သည့် interface များကို တည်ဆောက်ပါ။"
    ),
    stack: ["React", "TypeScript", "CSS", "Vite"],
    matches: { EXPLORE: 82, GOAL: 58 },
    responsibilities: [
      text("Build responsive product interfaces", "Responsive product interface များတည်ဆောက်ရန်"),
      text("Manage client-side state and data", "Client-side state နှင့် data ကိုစီမံရန်"),
      text("Improve accessibility and performance", "Accessibility နှင့် performance ကိုတိုးတက်စေရန်")
    ],
    traits: [
      text("You enjoy visual feedback.", "Visual feedback ကိုနှစ်သက်သည်။"),
      text("You care about usability details.", "အသုံးပြုရလွယ်ကူမှုအသေးစိတ်ကိုဂရုစိုက်သည်။")
    ]
  },
  {
    id: "backend-developer",
    name: text("Backend Developer", "Backend Developer"),
    category: "web",
    categoryLabel: text("Web", "Web"),
    shortDescription: text(
      "Build APIs, services, and data systems that power modern applications.",
      "ခေတ်မီ application များကို လည်ပတ်စေသော APIs၊ services နှင့် data systems များတည်ဆောက်ပါ။"
    ),
    stack: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
    matches: { EXPLORE: 88, GOAL: 62 },
    responsibilities: [
      text("Design REST APIs", "REST APIs များဒီဇိုင်းဆွဲရန်"),
      text("Model and query databases", "Database များကို model နှင့် query လုပ်ရန်"),
      text("Implement business logic", "Business logic တည်ဆောက်ရန်"),
      text("Handle authentication and security", "Authentication နှင့် security ကိုကိုင်တွယ်ရန်"),
      text("Test and deploy services", "Services များကို စမ်းသပ်ပြီး deploy လုပ်ရန်")
    ],
    traits: [
      text("You enjoy logical problem solving.", "ယုတ္တိကျကျ ပြဿနာဖြေရှင်းခြင်းကို နှစ်သက်သည်။"),
      text("You prefer building systems over visual design.", "Visual design ထက် system တည်ဆောက်ခြင်းကိုပိုနှစ်သက်သည်။"),
      text("You like organizing data and rules.", "Data နှင့် rules များကိုစနစ်တကျပြုလုပ်ရခြင်းကိုနှစ်သက်သည်။")
    ]
  },
  {
    id: "full-stack-developer",
    name: text("Full Stack Developer", "Full Stack Developer"),
    category: "web",
    categoryLabel: text("Web", "Web"),
    shortDescription: text(
      "Deliver complete web features across interface, API, and database layers.",
      "Interface၊ API နှင့် database layer များတစ်လျှောက် web feature အပြည့်အစုံပေးပို့ပါ။"
    ),
    stack: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    matches: { EXPLORE: 76, GOAL: 60 },
    responsibilities: [
      text("Build end-to-end features", "End-to-end features များတည်ဆောက်ရန်"),
      text("Connect interfaces to APIs", "Interfaces များကို APIs နှင့်ချိတ်ဆက်ရန်"),
      text("Ship and maintain applications", "Applications များကိုပေးပို့ပြီးထိန်းသိမ်းရန်")
    ],
    traits: [
      text("You enjoy seeing the whole product.", "Product တစ်ခုလုံးကိုမြင်ရခြင်းကိုနှစ်သက်သည်။"),
      text("You switch comfortably between layers.", "Layer များကြား အဆင်ပြေစွာပြောင်းလဲလုပ်နိုင်သည်။")
    ]
  },
  {
    id: "mobile-developer",
    name: text("Mobile Developer", "Mobile Developer"),
    category: "mobile",
    categoryLabel: text("Mobile", "Mobile"),
    shortDescription: text(
      "Create reliable mobile experiences for phones and tablets.",
      "ဖုန်းနှင့် tablet များအတွက် ယုံကြည်ရသော mobile experience များဖန်တီးပါ။"
    ),
    stack: ["Flutter", "Dart", "Kotlin", "Firebase"],
    matches: { EXPLORE: 68, GOAL: 56 },
    responsibilities: [
      text("Build adaptive mobile screens", "Adaptive mobile screen များတည်ဆောက်ရန်"),
      text("Integrate device and network APIs", "Device နှင့် network APIs များချိတ်ဆက်ရန်"),
      text("Test and release mobile apps", "Mobile apps များကိုစမ်းသပ်ပြီး release လုပ်ရန်")
    ],
    traits: [
      text("You care about focused user journeys.", "Focused user journey များကိုဂရုစိုက်သည်။"),
      text("You enjoy building for real devices.", "Real device များအတွက်တည်ဆောက်ရခြင်းကိုနှစ်သက်သည်။")
    ]
  },
  {
    id: "devops-sre",
    name: text("DevOps / SRE", "DevOps / SRE"),
    category: "cloud-devops",
    categoryLabel: text("Cloud & DevOps", "Cloud နှင့် DevOps"),
    shortDescription: text(
      "Automate delivery and keep services observable, reliable, and recoverable.",
      "Delivery ကို automate လုပ်ပြီး services များကို စောင့်ကြည့်နိုင်၊ ယုံကြည်ရပြီး ပြန်လည်ကယ်တင်နိုင်အောင်ပြုလုပ်ပါ။"
    ),
    stack: ["Linux", "Docker", "Kubernetes", "Terraform"],
    matches: { EXPLORE: 71, GOAL: 55 },
    responsibilities: [
      text("Automate deployment workflows", "Deployment workflow များ automate လုပ်ရန်"),
      text("Monitor reliability", "Reliability ကိုစောင့်ကြည့်ရန်"),
      text("Respond to incidents", "Incident များကိုတုံ့ပြန်ရန်")
    ],
    traits: [
      text("You enjoy automation and systems thinking.", "Automation နှင့် systems thinking ကိုနှစ်သက်သည်။"),
      text("You stay calm while diagnosing failures.", "Failure များစစ်ဆေးရာတွင် တည်ငြိမ်စွာလုပ်နိုင်သည်။")
    ]
  },
  {
    id: "cloud-engineer",
    name: text("Cloud Engineer", "Cloud Engineer"),
    category: "cloud-devops",
    categoryLabel: text("Cloud & DevOps", "Cloud နှင့် DevOps"),
    shortDescription: text(
      "Design secure cloud infrastructure and reusable delivery platforms.",
      "လုံခြုံသော cloud infrastructure နှင့် ပြန်သုံးနိုင်သော delivery platform များတည်ဆောက်ပါ။"
    ),
    stack: ["AWS", "Terraform", "Docker", "Linux"],
    matches: { EXPLORE: 69, GOAL: 57 },
    responsibilities: [
      text("Design cloud environments", "Cloud environment များဒီဇိုင်းဆွဲရန်"),
      text("Automate infrastructure", "Infrastructure ကို automate လုပ်ရန်"),
      text("Manage access and cost", "Access နှင့် cost ကိုစီမံရန်")
    ],
    traits: [
      text("You like reusable systems.", "ပြန်သုံးနိုင်သော system များကိုနှစ်သက်သည်။"),
      text("You balance reliability, security, and cost.", "Reliability၊ security နှင့် cost ကိုမျှတစွာစဉ်းစားသည်။")
    ]
  },
  {
    id: "data-engineer",
    name: text("Data Engineer", "Data Engineer"),
    category: "data-ai",
    categoryLabel: text("Data & AI", "Data နှင့် AI"),
    shortDescription: text(
      "Build dependable pipelines and data platforms for analytics and AI.",
      "Analytics နှင့် AI အတွက် ယုံကြည်ရသော pipeline နှင့် data platform များတည်ဆောက်ပါ။"
    ),
    stack: ["Python", "SQL", "Spark", "Airflow"],
    matches: { EXPLORE: 79, GOAL: 59 },
    responsibilities: [
      text("Build data pipelines", "Data pipeline များတည်ဆောက်ရန်"),
      text("Model analytics data", "Analytics data ကို model လုပ်ရန်"),
      text("Monitor data quality", "Data quality ကိုစောင့်ကြည့်ရန်")
    ],
    traits: [
      text("You enjoy structure and scale.", "Structure နှင့် scale ကိုနှစ်သက်သည်။"),
      text("You want data to be trustworthy.", "Data ကိုယုံကြည်စိတ်ချရစေချင်သည်။")
    ]
  },
  {
    id: "data-scientist",
    name: text("Data Scientist", "Data Scientist"),
    category: "data-ai",
    categoryLabel: text("Data & AI", "Data နှင့် AI"),
    shortDescription: text(
      "Use analysis and experimentation to turn data into decisions.",
      "Analysis နှင့် experimentation ဖြင့် data ကိုဆုံးဖြတ်ချက်များအဖြစ်ပြောင်းပါ။"
    ),
    stack: ["Python", "SQL", "Pandas", "Jupyter"],
    matches: { EXPLORE: 73, GOAL: 54 },
    responsibilities: [
      text("Analyze data and test hypotheses", "Data ကို analyze လုပ်ပြီး hypothesis များစမ်းသပ်ရန်"),
      text("Build and evaluate models", "Models များတည်ဆောက်ပြီးအကဲဖြတ်ရန်"),
      text("Communicate findings", "တွေ့ရှိချက်များကိုဆက်သွယ်ရန်")
    ],
    traits: [
      text("You ask evidence-driven questions.", "Evidence ပေါ်မူတည်သောမေးခွန်းများမေးတတ်သည်။"),
      text("You enjoy finding patterns.", "Pattern များရှာဖွေရခြင်းကိုနှစ်သက်သည်။")
    ]
  },
  {
    id: "ml-ai-engineer",
    name: text("ML / AI Engineer", "ML / AI Engineer"),
    category: "data-ai",
    categoryLabel: text("Data & AI", "Data နှင့် AI"),
    shortDescription: text(
      "Turn machine-learning models into evaluated, reliable product features.",
      "Machine-learning model များကို အကဲဖြတ်ပြီး ယုံကြည်ရသော product feature များအဖြစ်ပြောင်းပါ။"
    ),
    stack: ["Python", "PyTorch", "Hugging Face", "Docker"],
    matches: { EXPLORE: 70, GOAL: 61 },
    responsibilities: [
      text("Train and evaluate models", "Models များ train နှင့် evaluate လုပ်ရန်"),
      text("Serve models in products", "Models များကို product များတွင်အသုံးချရန်"),
      text("Monitor quality and drift", "Quality နှင့် drift ကိုစောင့်ကြည့်ရန်")
    ],
    traits: [
      text("You enjoy experimentation and engineering.", "Experimentation နှင့် engineering ကိုနှစ်သက်သည်။"),
      text("You verify outputs instead of trusting them blindly.", "Output များကို မျက်ကန်းယုံကြည်ခြင်းမရှိဘဲ စစ်ဆေးတတ်သည်။")
    ]
  },
  {
    id: "cybersecurity-engineer",
    name: text("Cybersecurity Engineer", "Cybersecurity Engineer"),
    category: "security",
    categoryLabel: text("Security", "Security"),
    shortDescription: text(
      "Find risk, strengthen defenses, and help systems recover safely.",
      "Risk များရှာဖွေပြီး ကာကွယ်ရေးတိုးတက်စေကာ systems များလုံခြုံစွာပြန်လည်ကောင်းမွန်အောင်ကူညီပါ။"
    ),
    stack: ["Linux", "Python", "SIEM", "OWASP"],
    matches: { EXPLORE: 67, GOAL: 56 },
    responsibilities: [
      text("Assess threats and vulnerabilities", "Threat နှင့် vulnerability များအကဲဖြတ်ရန်"),
      text("Build and monitor defenses", "ကာကွယ်ရေးတည်ဆောက်ပြီးစောင့်ကြည့်ရန်"),
      text("Respond to security incidents", "Security incident များတုံ့ပြန်ရန်")
    ],
    traits: [
      text("You are careful and investigative.", "ဂရုစိုက်ပြီး စူးစမ်းတတ်သည်။"),
      text("You think about how systems can fail.", "System များဘယ်လိုပျက်နိုင်သည်ကို စဉ်းစားတတ်သည်။")
    ]
  },
  {
    id: "qa-sdet",
    name: text("QA / SDET", "QA / SDET"),
    category: "qa",
    categoryLabel: text("QA", "QA"),
    shortDescription: text(
      "Design quality strategies and automation that keep releases trustworthy.",
      "Release များကို ယုံကြည်ရစေရန် quality strategy နှင့် automation များတည်ဆောက်ပါ။"
    ),
    stack: ["Playwright", "Java", "Postman", "CI/CD"],
    matches: { EXPLORE: 65, GOAL: 52 },
    responsibilities: [
      text("Design useful test coverage", "အသုံးဝင်သော test coverage ဒီဇိုင်းဆွဲရန်"),
      text("Automate critical journeys", "အရေးကြီး journey များ automate လုပ်ရန်"),
      text("Improve release confidence", "Release confidence ကိုတိုးတက်စေရန်")
    ],
    traits: [
      text("You notice edge cases.", "Edge case များကိုသတိထားတတ်သည်။"),
      text("You enjoy making systems dependable.", "System များယုံကြည်ရအောင်ပြုလုပ်ရခြင်းကိုနှစ်သက်သည်။")
    ]
  },
  {
    id: "embedded-systems-engineer",
    name: text("Embedded / Systems Engineer", "Embedded / Systems Engineer"),
    category: "systems",
    categoryLabel: text("Systems", "Systems"),
    shortDescription: text(
      "Make software behave correctly on devices with real hardware constraints.",
      "Hardware constraint ရှိသော device များပေါ်တွင် software မှန်ကန်စွာလုပ်ဆောင်အောင်တည်ဆောက်ပါ။"
    ),
    stack: ["C", "C++", "Linux", "Microcontrollers"],
    matches: { EXPLORE: 60, GOAL: 51 },
    responsibilities: [
      text("Write hardware-aware software", "Hardware ကိုနားလည်သော software ရေးရန်"),
      text("Debug timing and memory issues", "Timing နှင့် memory ပြဿနာများ debug လုပ်ရန်"),
      text("Test reliable firmware", "ယုံကြည်ရသော firmware စမ်းသပ်ရန်")
    ],
    traits: [
      text("You enjoy precise low-level work.", "တိကျသော low-level အလုပ်ကိုနှစ်သက်သည်။"),
      text("You are curious about how devices work.", "Device များအလုပ်လုပ်ပုံကိုစိတ်ဝင်စားသည်။")
    ]
  },
  {
    id: "game-developer",
    name: text("Game Developer", "Game Developer"),
    category: "game",
    categoryLabel: text("Game Development", "Game Development"),
    shortDescription: text(
      "Combine programming, interaction, and iteration to create playable systems.",
      "ကစားနိုင်သော system များဖန်တီးရန် programming၊ interaction နှင့် iteration ကိုပေါင်းစပ်ပါ။"
    ),
    stack: ["Unity", "C#", "Blender", "Git"],
    matches: { EXPLORE: 63, GOAL: 50 },
    responsibilities: [
      text("Build gameplay systems", "Gameplay system များတည်ဆောက်ရန်"),
      text("Integrate art, audio, and input", "Art၊ audio နှင့် input ကိုပေါင်းစပ်ရန်"),
      text("Playtest and improve feel", "Playtest လုပ်ပြီး feel ကိုတိုးတက်စေရန်")
    ],
    traits: [
      text("You enjoy creative technical problems.", "ဖန်တီးမှုပါသော technical ပြဿနာများကိုနှစ်သက်သည်။"),
      text("You learn through rapid iteration.", "မြန်ဆန်သော iteration ဖြင့်သင်ယူတတ်သည်။")
    ]
  }
];

export const careers: Career[] = careerSeeds.map((seed) => {
  const roadmap = roadmaps.find((item) => item.careerId === seed.id);
  const allSkills = roadmap?.stages.flatMap((stage) => stage.skills) ?? [];
  const midpoint = Math.ceil(allSkills.length / 2);

  return {
    id: seed.id,
    slug: seed.id,
    name: seed.name,
    category: seed.category,
    categoryLabel: seed.categoryLabel,
    shortDescription: seed.shortDescription,
    description: text(
      `${seed.shortDescription.en} Follow an ordered learn, practice, build, and prove path rather than collecting disconnected tutorials.`,
      `${seed.shortDescription.my} မချိတ်ဆက်သော tutorial များစုစည်းမနေဘဲ learn၊ practice၊ build နှင့် prove လမ်းကြောင်းအတိုင်းသွားပါ။`
    ),
    coreStack: seed.stack,
    responsibilities: seed.responsibilities,
    traits: seed.traits,
    fitReasons: seed.traits,
    skillGroups: [
      { id: "foundations", label: text("Foundations", "အခြေခံ"), skills: allSkills.slice(0, midpoint).map((skill) => skill.id) },
      { id: "delivery", label: text("Core & Delivery", "Core နှင့် Delivery"), skills: allSkills.slice(midpoint).map((skill) => skill.id) }
    ],
    roadmapId: `${seed.id}-roadmap`,
    matchByMode: seed.matches
  };
});

export const learningResources: LearningResource[] = [
  {
    id: "java-dev-tutorial",
    slug: "java-dev-tutorial",
    title: text("Java Language Basics", "Java Language အခြေခံ"),
    description: text("Learn Java syntax, objects, collections, and exceptions from the official tutorials.", "Official tutorial များဖြင့် Java syntax၊ objects၊ collections နှင့် exceptions များကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["backend-developer"],
    skills: ["java-fundamentals"],
    level: "beginner",
    provider: "dev.java",
    duration: text("3 hours", "၃ နာရီ"),
    url: "https://dev.java/learn/"
  },
  {
    id: "pro-git",
    slug: "pro-git",
    title: text("Pro Git: Getting Started", "Pro Git: စတင်လေ့လာခြင်း"),
    description: text("Build a durable mental model for commits, branches, remotes, and collaboration.", "Commits၊ branches၊ remotes နှင့် collaboration အတွက် ခိုင်မာသောနားလည်မှုတည်ဆောက်ပါ။"),
    type: "guide",
    roles: careers.map((career) => career.id),
    skills: ["git-workflow"],
    level: "beginner",
    provider: "Git",
    duration: text("90 minutes", "၉၀ မိနစ်"),
    url: "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control"
  },
  {
    id: "mdn-http",
    slug: "mdn-http",
    title: text("An Overview of HTTP", "HTTP အကြောင်းခြုံငုံလေ့လာရန်"),
    description: text("Understand requests, responses, methods, status codes, headers, and caching.", "Requests၊ responses၊ methods၊ status codes၊ headers နှင့် caching ကိုနားလည်ပါ။"),
    type: "docs",
    roles: ["backend-developer", "full-stack-developer", "frontend-developer"],
    skills: ["http-fundamentals", "rest-api-design"],
    level: "beginner",
    provider: "MDN",
    duration: text("45 minutes", "၄၅ မိနစ်"),
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
  },
  {
    id: "postman-learning",
    slug: "postman-learning",
    title: text("Send Your First API Request", "ပထမဆုံး API Request ပို့ရန်"),
    description: text("Inspect and debug API requests with a repeatable client workflow.", "ထပ်ခါတလဲလဲအသုံးပြုနိုင်သော client workflow ဖြင့် API request များစစ်ဆေးပြီး debug လုပ်ပါ။"),
    type: "guide",
    roles: ["backend-developer", "qa-sdet"],
    skills: ["api-debugging", "api-testing"],
    level: "beginner",
    provider: "Postman",
    duration: text("30 minutes", "၃၀ မိနစ်"),
    url: "https://learning.postman.com/docs/getting-started/first-steps/sending-the-first-request/"
  },
  {
    id: "postgresql-tutorial",
    slug: "postgresql-tutorial",
    title: text("PostgreSQL Tutorial", "PostgreSQL Tutorial"),
    description: text("Work through relational concepts and SQL using the official PostgreSQL tutorial.", "Official PostgreSQL tutorial ဖြင့် relational concepts နှင့် SQL ကိုလက်တွေ့လေ့လာပါ။"),
    type: "docs",
    roles: ["backend-developer", "full-stack-developer", "data-engineer", "data-scientist"],
    skills: ["sql-fundamentals"],
    level: "beginner",
    provider: "PostgreSQL",
    duration: text("2 hours", "၂ နာရီ"),
    url: "https://www.postgresql.org/docs/current/tutorial.html"
  },
  {
    id: "sqlbolt",
    slug: "sqlbolt",
    title: text("Interactive SQL Lessons", "Interactive SQL သင်ခန်းစာများ"),
    description: text("Practice SELECT, JOIN, aggregation, and data changes in short browser exercises.", "Browser exercise အတိုများဖြင့် SELECT၊ JOIN၊ aggregation နှင့် data change များလေ့ကျင့်ပါ။"),
    type: "course",
    roles: ["backend-developer", "data-engineer", "data-scientist"],
    skills: ["sql-fundamentals"],
    level: "beginner",
    provider: "SQLBolt",
    duration: text("3 hours", "၃ နာရီ"),
    url: "https://sqlbolt.com/"
  },
  {
    id: "postgresql-ddl",
    slug: "postgresql-ddl",
    title: text("PostgreSQL Data Definition", "PostgreSQL Data Definition"),
    description: text("Learn tables, constraints, defaults, and schemas for reliable relational models.", "ယုံကြည်ရသော relational model များအတွက် tables၊ constraints၊ defaults နှင့် schemas ကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["backend-developer", "data-engineer"],
    skills: ["postgresql-data-modeling"],
    level: "intermediate",
    provider: "PostgreSQL",
    duration: text("75 minutes", "၇၅ မိနစ်"),
    url: "https://www.postgresql.org/docs/current/ddl.html"
  },
  {
    id: "spring-rest",
    slug: "spring-rest",
    title: text("Building a RESTful Web Service", "RESTful Web Service တည်ဆောက်ခြင်း"),
    description: text("Create a small Spring Boot service using the official getting-started guide.", "Official getting-started guide ဖြင့် Spring Boot service ငယ်တစ်ခုတည်ဆောက်ပါ။"),
    type: "guide",
    roles: ["backend-developer"],
    skills: ["spring-boot-fundamentals"],
    level: "beginner",
    provider: "Spring",
    duration: text("45 minutes", "၄၅ မိနစ်"),
    url: "https://spring.io/guides/gs/rest-service"
  },
  {
    id: "spring-di",
    slug: "spring-di",
    title: text("Spring IoC Container", "Spring IoC Container"),
    description: text("Understand dependency injection, beans, configuration, and lifecycle boundaries.", "Dependency injection၊ beans၊ configuration နှင့် lifecycle boundary များကိုနားလည်ပါ။"),
    type: "docs",
    roles: ["backend-developer"],
    skills: ["dependency-injection"],
    level: "intermediate",
    provider: "Spring",
    duration: text("90 minutes", "၉၀ မိနစ်"),
    url: "https://docs.spring.io/spring-framework/reference/core/beans.html"
  },
  {
    id: "rest-api-guide",
    slug: "rest-api-guide",
    title: text("Designing Clear REST APIs", "ရှင်းလင်းသော REST APIs ဒီဇိုင်းဆွဲခြင်း"),
    description: text("A focused TheWay guide to resources, status codes, errors, pagination, and consistency.", "Resources၊ status codes၊ errors၊ pagination နှင့် consistency အတွက် TheWay လမ်းညွှန်။"),
    type: "guide",
    roles: ["backend-developer", "full-stack-developer"],
    skills: ["rest-api-design"],
    level: "intermediate",
    provider: "TheWay",
    duration: text("10 min read", "၁၀ မိနစ်ဖတ်ရန်"),
    internalPath: "/app/resources/guides/rest-api-design-checklist"
  },
  {
    id: "spring-validation",
    slug: "spring-validation",
    title: text("Validating Form Input", "Input Validation ပြုလုပ်ခြင်း"),
    description: text("Apply validation constraints and return useful errors in a Spring service.", "Spring service တွင် validation constraint များအသုံးချပြီး အသုံးဝင်သော error များပြန်ပေးပါ။"),
    type: "guide",
    roles: ["backend-developer"],
    skills: ["validation-error-handling"],
    level: "intermediate",
    provider: "Spring",
    duration: text("45 minutes", "၄၅ မိနစ်"),
    url: "https://spring.io/guides/gs/validating-form-input"
  },
  {
    id: "spring-security",
    slug: "spring-security",
    title: text("Securing a Web Application", "Web Application တစ်ခုလုံခြုံစေခြင်း"),
    description: text("Introduce authentication and authorization through the official Spring guide.", "Official Spring guide ဖြင့် authentication နှင့် authorization ကိုမိတ်ဆက်လေ့လာပါ။"),
    type: "guide",
    roles: ["backend-developer"],
    skills: ["authentication-authorization"],
    level: "intermediate",
    provider: "Spring",
    duration: text("60 minutes", "၆၀ မိနစ်"),
    url: "https://spring.io/guides/gs/securing-web"
  },
  {
    id: "owasp-top-ten",
    slug: "owasp-top-ten",
    title: text("OWASP Top 10", "OWASP Top 10"),
    description: text("Learn the most important web application security risk categories and mitigations.", "အရေးကြီးသော web application security risk အမျိုးအစားများနှင့် ကာကွယ်နည်းများကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["backend-developer", "cybersecurity-engineer"],
    skills: ["owasp-basics", "security"],
    level: "intermediate",
    provider: "OWASP",
    duration: text("2 hours", "၂ နာရီ"),
    url: "https://owasp.org/www-project-top-ten/"
  },
  {
    id: "junit-guide",
    slug: "junit-guide",
    title: text("JUnit 5 User Guide", "JUnit 5 User Guide"),
    description: text("Write focused tests and understand test lifecycle, assertions, and organization.", "Focused test များရေးပြီး test lifecycle၊ assertions နှင့် organization ကိုနားလည်ပါ။"),
    type: "docs",
    roles: ["backend-developer"],
    skills: ["unit-integration-testing"],
    level: "intermediate",
    provider: "JUnit",
    duration: text("2 hours", "၂ နာရီ"),
    url: "https://docs.junit.org/current/user-guide/"
  },
  {
    id: "testcontainers-guide",
    slug: "testcontainers-guide",
    title: text("Testcontainers for Java", "Java အတွက် Testcontainers"),
    description: text("Run disposable real dependencies for trustworthy integration tests.", "ယုံကြည်ရသော integration test အတွက် disposable real dependency များ run ပါ။"),
    type: "docs",
    roles: ["backend-developer"],
    skills: ["testcontainers"],
    level: "advanced",
    provider: "Testcontainers",
    duration: text("90 minutes", "၉၀ မိနစ်"),
    url: "https://java.testcontainers.org/quickstart/junit_5_quickstart/"
  },
  {
    id: "docker-get-started",
    slug: "docker-get-started",
    title: text("Docker Get Started", "Docker စတင်လေ့လာရန်"),
    description: text("Learn images, containers, Dockerfiles, ports, volumes, and multi-container apps.", "Images၊ containers၊ Dockerfiles၊ ports၊ volumes နှင့် multi-container apps များကိုလေ့လာပါ။"),
    type: "course",
    roles: ["backend-developer", "full-stack-developer", "devops-sre", "cloud-engineer"],
    skills: ["docker-fundamentals", "cloud-deployment"],
    level: "beginner",
    provider: "Docker",
    duration: text("2 hours", "၂ နာရီ"),
    url: "https://docs.docker.com/get-started/"
  },
  {
    id: "deployment-guide",
    slug: "deployment-guide",
    title: text("Your First Production Deployment", "ပထမဆုံး Production Deployment"),
    description: text("A practical checklist for configuration, secrets, health checks, logs, and rollback.", "Configuration၊ secrets၊ health checks၊ logs နှင့် rollback အတွက် လက်တွေ့ checklist။"),
    type: "guide",
    roles: ["backend-developer", "devops-sre", "cloud-engineer"],
    skills: ["cloud-deployment"],
    level: "intermediate",
    provider: "TheWay",
    duration: text("12 min read", "၁၂ မိနစ်ဖတ်ရန်"),
    internalPath: "/app/resources/guides/first-production-deployment"
  },
  {
    id: "mdn-html",
    slug: "mdn-html",
    title: text("Structuring Content with HTML", "HTML ဖြင့် Content တည်ဆောက်ခြင်း"),
    description: text("Use semantic elements, forms, landmarks, and accessible document structure.", "Semantic elements၊ forms၊ landmarks နှင့် accessible document structure ကိုအသုံးပြုပါ။"),
    type: "docs",
    roles: ["frontend-developer", "full-stack-developer"],
    skills: ["semantic-html"],
    level: "beginner",
    provider: "MDN",
    duration: text("2 hours", "၂ နာရီ"),
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"
  },
  {
    id: "mdn-css",
    slug: "mdn-css",
    title: text("CSS Layout", "CSS Layout"),
    description: text("Learn responsive layout with normal flow, flexbox, grid, and media queries.", "Normal flow၊ flexbox၊ grid နှင့် media queries ဖြင့် responsive layout ကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["frontend-developer", "full-stack-developer"],
    skills: ["responsive-css"],
    level: "beginner",
    provider: "MDN",
    duration: text("3 hours", "၃ နာရီ"),
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout"
  },
  {
    id: "typescript-handbook",
    slug: "typescript-handbook",
    title: text("TypeScript Handbook", "TypeScript Handbook"),
    description: text("Learn types, narrowing, functions, objects, generics, and modules.", "Types၊ narrowing၊ functions၊ objects၊ generics နှင့် modules ကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["frontend-developer", "full-stack-developer"],
    skills: ["typescript"],
    level: "beginner",
    provider: "TypeScript",
    duration: text("4 hours", "၄ နာရီ"),
    url: "https://www.typescriptlang.org/docs/handbook/intro.html"
  },
  {
    id: "react-learn",
    slug: "react-learn",
    title: text("React: Learn", "React လေ့လာရန်"),
    description: text("Build components, add interactivity, manage state, and share data.", "Components တည်ဆောက်ပြီး interactivity ထည့်ကာ state နှင့် data ကိုစီမံပါ။"),
    type: "course",
    roles: ["frontend-developer", "full-stack-developer"],
    skills: ["react"],
    level: "beginner",
    provider: "React",
    duration: text("5 hours", "၅ နာရီ"),
    url: "https://react.dev/learn"
  },
  {
    id: "python-tutorial",
    slug: "python-tutorial",
    title: text("The Python Tutorial", "Python Tutorial"),
    description: text("Learn Python's language fundamentals from the official documentation.", "Official documentation မှ Python language အခြေခံကိုလေ့လာပါ။"),
    type: "docs",
    roles: ["data-engineer", "data-scientist", "ml-ai-engineer", "cybersecurity-engineer"],
    skills: ["python"],
    level: "beginner",
    provider: "Python",
    duration: text("5 hours", "၅ နာရီ"),
    url: "https://docs.python.org/3/tutorial/"
  },
  {
    id: "linux-command-line",
    slug: "linux-command-line",
    title: text("The Linux Command Line", "Linux Command Line"),
    description: text("Build command-line confidence with files, processes, permissions, and networking tools.", "Files၊ processes၊ permissions နှင့် networking tools များဖြင့် command-line ကျွမ်းကျင်မှုတည်ဆောက်ပါ။"),
    type: "course",
    roles: ["devops-sre", "cloud-engineer", "cybersecurity-engineer"],
    skills: ["linux"],
    level: "beginner",
    provider: "Linux Foundation",
    duration: text("4 hours", "၄ နာရီ"),
    url: "https://training.linuxfoundation.org/training/introduction-to-linux/"
  },
  {
    id: "testing-guide",
    slug: "testing-guide",
    title: text("A Practical Testing Strategy", "လက်တွေ့ Testing Strategy"),
    description: text("Choose useful unit, integration, and end-to-end coverage without duplicating effort.", "အလုပ်ထပ်မဖြစ်စေဘဲ အသုံးဝင်သော unit၊ integration နှင့် end-to-end coverage ကိုရွေးချယ်ပါ။"),
    type: "guide",
    roles: ["qa-sdet", "backend-developer", "frontend-developer"],
    skills: ["testing", "frontend-testing", "mobile-testing"],
    level: "intermediate",
    provider: "TheWay",
    duration: text("9 min read", "၉ မိနစ်ဖတ်ရန်"),
    internalPath: "/app/resources/guides/practical-testing-strategy"
  },
  {
    id: "system-design-guide",
    slug: "system-design-guide",
    title: text("System Design from Requirements", "Requirements မှ System Design"),
    description: text("Turn product requirements into constraints, components, data flow, and tradeoffs.", "Product requirement များကို constraints၊ components၊ data flow နှင့် tradeoffs အဖြစ်ပြောင်းပါ။"),
    type: "guide",
    roles: ["backend-developer", "full-stack-developer", "cloud-engineer"],
    skills: ["system-design"],
    level: "intermediate",
    provider: "TheWay",
    duration: text("14 min read", "၁၄ မိနစ်ဖတ်ရန်"),
    internalPath: "/app/resources/guides/system-design-from-requirements"
  },
  {
    id: "developer-workflow-guide",
    slug: "developer-workflow-guide",
    title: text("A Repeatable Learning Workflow", "ထပ်ခါတလဲလဲအသုံးပြုနိုင်သော သင်ယူမှု Workflow"),
    description: text("Move from explanation to exercise, project proof, reflection, and the next milestone.", "ရှင်းပြချက်မှ exercise၊ project proof၊ reflection နှင့် နောက် milestone အထိ သွားပါ။"),
    type: "guide",
    roles: careers.map((career) => career.id),
    skills: ["default"],
    level: "beginner",
    provider: "TheWay",
    duration: text("8 min read", "၈ မိနစ်ဖတ်ရန်"),
    internalPath: "/app/resources/guides/repeatable-learning-workflow"
  }
];

export const projects: PortfolioProject[] = [
  {
    id: "url-shortener-api",
    slug: "url-shortener-api",
    name: text("URL Shortener API", "URL Shortener API"),
    domain: "backend-apis",
    domainLabel: text("Backend & APIs", "Backend နှင့် APIs"),
    level: "intermediate",
    duration: text("8–12 hours", "၈–၁၂ နာရီ"),
    description: text(
      "Build a REST API that creates short links, redirects requests, and tracks usage.",
      "Short link များဖန်တီး၊ request များ redirect လုပ်ပြီး usage ကိုမှတ်တမ်းတင်သော REST API တည်ဆောက်ပါ။"
    ),
    roleIds: ["backend-developer", "full-stack-developer"],
    skillIds: ["sql-fundamentals", "postgresql-data-modeling", "rest-api-design", "validation-error-handling"],
    whatYouBuild: [
      text("Create and resolve short links", "Short link များဖန်တီးပြီး resolve လုပ်ရန်"),
      text("Persist mappings and visit counts", "Mapping နှင့် visit count များသိမ်းရန်"),
      text("Return consistent validation errors", "Consistent validation error များပြန်ပေးရန်")
    ],
    learningOutcomes: [
      text("Resource-oriented API design", "Resource-oriented API design"),
      text("Relational modeling and indexes", "Relational modeling နှင့် indexes"),
      text("Testing success and failure paths", "Success နှင့် failure path များစမ်းသပ်ခြင်း")
    ],
    architecture: [
      text("User submits URL", "User က URL ပို့သည်"),
      text("Validate request", "Request ကို validate လုပ်သည်"),
      text("Generate short code", "Short code ဖန်တီးသည်"),
      text("Persist mapping", "Mapping သိမ်းသည်"),
      text("Return short URL", "Short URL ပြန်ပေးသည်"),
      text("Redirect and count later", "နောက်တွင် redirect လုပ်ပြီး count တိုးသည်")
    ],
    buildSteps: [
      { id: "setup", title: text("Project Setup", "Project Setup"), description: text("Create the service, environment configuration, and health endpoint.", "Service၊ environment configuration နှင့် health endpoint တည်ဆောက်ပါ။") },
      { id: "model", title: text("Data Model", "Data Model"), description: text("Model links, unique codes, timestamps, and visit counts.", "Links၊ unique codes၊ timestamps နှင့် visit counts ကို model လုပ်ပါ။") },
      { id: "endpoints", title: text("API Endpoints", "API Endpoints"), description: text("Implement create, resolve, redirect, and statistics endpoints.", "Create၊ resolve၊ redirect နှင့် statistics endpoints များတည်ဆောက်ပါ။") },
      { id: "persistence", title: text("Persistence", "Persistence"), description: text("Add repositories, migrations, indexes, and transaction boundaries.", "Repositories၊ migrations၊ indexes နှင့် transaction boundaries ထည့်ပါ။") },
      { id: "validation", title: text("Validation & Errors", "Validation နှင့် Errors"), description: text("Return stable error shapes for invalid, missing, and conflicting data.", "Invalid၊ missing နှင့် conflicting data အတွက် stable error shape ပြန်ပေးပါ။") },
      { id: "testing", title: text("Testing", "Testing"), description: text("Cover redirect, collision, validation, and persistence behavior.", "Redirect၊ collision၊ validation နှင့် persistence behavior ကိုစမ်းသပ်ပါ။") },
      { id: "deployment", title: text("Deployment", "Deployment"), description: text("Containerize the service and deploy with health checks and logs.", "Service ကို containerize လုပ်ပြီး health checks နှင့် logs ဖြင့် deploy လုပ်ပါ။") }
    ],
    extensions: [
      text("Add Redis caching", "Redis caching ထည့်ရန်"),
      text("Add rate limiting", "Rate limiting ထည့်ရန်"),
      text("Add analytics dashboards", "Analytics dashboard ထည့်ရန်"),
      text("Add authentication", "Authentication ထည့်ရန်"),
      text("Add CI/CD", "CI/CD ထည့်ရန်")
    ]
  },
  {
    id: "authentication-service",
    slug: "authentication-service",
    name: text("Authentication Service", "Authentication Service"),
    domain: "security",
    domainLabel: text("Security", "Security"),
    level: "intermediate",
    duration: text("10–14 hours", "၁၀–၁၄ နာရီ"),
    description: text("Build registration, sign-in, roles, session handling, and audit events.", "Registration၊ sign-in၊ roles၊ session handling နှင့် audit events များတည်ဆောက်ပါ။"),
    roleIds: ["backend-developer", "cybersecurity-engineer"],
    skillIds: ["authentication-authorization", "owasp-basics", "unit-integration-testing"],
    whatYouBuild: [text("Account and session endpoints", "Account နှင့် session endpoints"), text("Role-protected operations", "Role ဖြင့်ကာကွယ်ထားသော operations"), text("Security event log", "Security event log")],
    learningOutcomes: [text("Password and session boundaries", "Password နှင့် session boundaries"), text("Authorization rules", "Authorization rules"), text("Abuse-resistant error handling", "Abuse-resistant error handling")],
    architecture: [text("Receive credentials", "Credentials လက်ခံသည်"), text("Validate and rate limit", "Validate နှင့် rate limit လုပ်သည်"), text("Verify identity", "Identity စစ်ဆေးသည်"), text("Create session", "Session ဖန်တီးသည်"), text("Authorize action", "Action ကို authorize လုပ်သည်")],
    buildSteps: [
      { id: "identity", title: text("Identity Model", "Identity Model"), description: text("Define users, credentials, roles, and sessions.", "Users၊ credentials၊ roles နှင့် sessions သတ်မှတ်ပါ။") },
      { id: "registration", title: text("Registration", "Registration"), description: text("Validate input and store password hashes safely.", "Input validate လုပ်ပြီး password hash များလုံခြုံစွာသိမ်းပါ။") },
      { id: "sessions", title: text("Sessions", "Sessions"), description: text("Issue, rotate, expire, and revoke sessions.", "Sessions များ issue၊ rotate၊ expire နှင့် revoke လုပ်ပါ။") },
      { id: "authorization", title: text("Authorization", "Authorization"), description: text("Protect operations with explicit ownership and role checks.", "Ownership နှင့် role check များဖြင့် operation များကိုကာကွယ်ပါ။") },
      { id: "security-tests", title: text("Security Tests", "Security Tests"), description: text("Test invalid, expired, unauthorized, and repeated requests.", "Invalid၊ expired၊ unauthorized နှင့် repeated request များစမ်းသပ်ပါ။") }
    ],
    extensions: [text("Add multi-factor authentication", "Multi-factor authentication ထည့်ရန်"), text("Add social sign-in", "Social sign-in ထည့်ရန်"), text("Add suspicious-login alerts", "Suspicious-login alerts ထည့်ရန်")]
  },
  {
    id: "mini-deployment-platform",
    slug: "mini-deployment-platform",
    name: text("Mini Deployment Platform", "Mini Deployment Platform"),
    domain: "devops-cloud",
    domainLabel: text("DevOps & Cloud", "DevOps နှင့် Cloud"),
    level: "advanced",
    duration: text("16–24 hours", "၁၆–၂၄ နာရီ"),
    description: text("Package, deploy, observe, and roll back a small service through one repeatable workflow.", "Service ငယ်တစ်ခုကို repeatable workflow တစ်ခုဖြင့် package၊ deploy၊ observe နှင့် rollback လုပ်ပါ။"),
    roleIds: ["backend-developer", "devops-sre", "cloud-engineer"],
    skillIds: ["docker-fundamentals", "cloud-deployment", "ci-cd", "observability"],
    whatYouBuild: [text("Container build pipeline", "Container build pipeline"), text("Environment configuration", "Environment configuration"), text("Health, log, and rollback workflow", "Health၊ log နှင့် rollback workflow")],
    learningOutcomes: [text("Immutable builds", "Immutable builds"), text("Safe configuration", "Safe configuration"), text("Operational feedback loops", "Operational feedback loops")],
    architecture: [text("Push commit", "Commit push လုပ်သည်"), text("Run checks", "Checks run လုပ်သည်"), text("Build image", "Image တည်ဆောက်သည်"), text("Deploy release", "Release deploy လုပ်သည်"), text("Observe health", "Health စောင့်ကြည့်သည်"), text("Promote or roll back", "Promote သို့မဟုတ် rollback လုပ်သည်")],
    buildSteps: [
      { id: "container", title: text("Containerize", "Containerize"), description: text("Create a small, reproducible production image.", "သေးငယ်ပြီး reproducible ဖြစ်သော production image တည်ဆောက်ပါ။") },
      { id: "checks", title: text("Automated Checks", "Automated Checks"), description: text("Run tests and image checks before publishing.", "Publish မလုပ်မီ tests နှင့် image checks run ပါ။") },
      { id: "release", title: text("Release Workflow", "Release Workflow"), description: text("Deploy immutable versions with explicit configuration.", "Explicit configuration ဖြင့် immutable version များ deploy လုပ်ပါ။") },
      { id: "observe", title: text("Observe", "Observe"), description: text("Add health checks, structured logs, and simple alerts.", "Health checks၊ structured logs နှင့် simple alerts ထည့်ပါ။") },
      { id: "rollback", title: text("Rollback", "Rollback"), description: text("Document and test a safe rollback path.", "လုံခြုံသော rollback လမ်းကြောင်းကို document နှင့် test လုပ်ပါ။") }
    ],
    extensions: [text("Add blue/green deployment", "Blue/green deployment ထည့်ရန်"), text("Add infrastructure as code", "Infrastructure as code ထည့်ရန်"), text("Add cost reporting", "Cost reporting ထည့်ရန်")]
  },
  {
    id: "accessible-job-board",
    slug: "accessible-job-board",
    name: text("Accessible Job Board", "Accessible Job Board"),
    domain: "web",
    domainLabel: text("Web", "Web"),
    level: "intermediate",
    duration: text("10–16 hours", "၁၀–၁၆ နာရီ"),
    description: text("Build a responsive job search interface with filters, keyboard support, and saved roles.", "Filters၊ keyboard support နှင့် saved roles ပါသော responsive job search interface တည်ဆောက်ပါ။"),
    roleIds: ["frontend-developer", "full-stack-developer", "qa-sdet"],
    skillIds: ["semantic-html", "responsive-css", "react", "frontend-accessibility", "e2e-testing"],
    whatYouBuild: [text("Searchable job list", "ရှာဖွေနိုင်သော job list"), text("Accessible filters", "Accessible filters"), text("Saved-job state", "Saved-job state")],
    learningOutcomes: [text("Semantic interaction design", "Semantic interaction design"), text("URL-backed filters", "URL-backed filters"), text("Keyboard and screen-reader QA", "Keyboard နှင့် screen-reader QA")],
    architecture: [text("Load jobs", "Jobs load လုပ်သည်"), text("Apply URL filters", "URL filters အသုံးချသည်"), text("Render results", "Results ပြသည်"), text("Save role", "Role သိမ်းသည်")],
    buildSteps: [
      { id: "layout", title: text("Responsive Layout", "Responsive Layout"), description: text("Build the page hierarchy and card grid.", "Page hierarchy နှင့် card grid တည်ဆောက်ပါ။") },
      { id: "filters", title: text("Search & Filters", "Search နှင့် Filters"), description: text("Keep filters keyboard-friendly and URL-backed.", "Filters များကို keyboard-friendly နှင့် URL-backed ဖြစ်အောင်ပြုလုပ်ပါ။") },
      { id: "states", title: text("Loading & Empty States", "Loading နှင့် Empty States"), description: text("Communicate every data state clearly.", "Data state တိုင်းကိုရှင်းလင်းစွာဖော်ပြပါ။") },
      { id: "qa", title: text("Accessibility QA", "Accessibility QA"), description: text("Test headings, names, focus, and contrast.", "Headings၊ names၊ focus နှင့် contrast ကိုစမ်းသပ်ပါ။") }
    ],
    extensions: [text("Add pagination", "Pagination ထည့်ရန်"), text("Add company pages", "Company pages ထည့်ရန်"), text("Add notification preferences", "Notification preferences ထည့်ရန်")]
  },
  {
    id: "data-pipeline-monitor",
    slug: "data-pipeline-monitor",
    name: text("Data Pipeline Monitor", "Data Pipeline Monitor"),
    domain: "data-ml",
    domainLabel: text("Data & ML", "Data နှင့် ML"),
    level: "advanced",
    duration: text("14–20 hours", "၁၄–၂၀ နာရီ"),
    description: text("Ingest scheduled data, validate quality, and expose health and freshness signals.", "Scheduled data ကို ingest လုပ်ပြီး quality validate လုပ်ကာ health နှင့် freshness signal များဖော်ပြပါ။"),
    roleIds: ["data-engineer", "ml-ai-engineer"],
    skillIds: ["python", "sql-fundamentals", "batch-pipelines", "data-quality", "ml-evaluation"],
    whatYouBuild: [text("Scheduled ingestion", "Scheduled ingestion"), text("Quality checks", "Quality checks"), text("Freshness dashboard", "Freshness dashboard")],
    learningOutcomes: [text("Idempotent pipelines", "Idempotent pipelines"), text("Data observability", "Data observability"), text("Failure recovery", "Failure recovery")],
    architecture: [text("Schedule run", "Run schedule လုပ်သည်"), text("Ingest source", "Source ingest လုပ်သည်"), text("Validate records", "Records validate လုပ်သည်"), text("Store results", "Results သိမ်းသည်"), text("Publish health", "Health publish လုပ်သည်")],
    buildSteps: [
      { id: "source", title: text("Source Contract", "Source Contract"), description: text("Define expected input, timing, and ownership.", "မျှော်မှန်း input၊ timing နှင့် ownership သတ်မှတ်ပါ။") },
      { id: "pipeline", title: text("Pipeline", "Pipeline"), description: text("Build idempotent extract, transform, and load steps.", "Idempotent extract၊ transform နှင့် load steps များတည်ဆောက်ပါ။") },
      { id: "quality", title: text("Quality Rules", "Quality Rules"), description: text("Check schema, completeness, uniqueness, and freshness.", "Schema၊ completeness၊ uniqueness နှင့် freshness စစ်ဆေးပါ။") },
      { id: "operations", title: text("Operations", "Operations"), description: text("Add retries, alerting, and recovery documentation.", "Retries၊ alerting နှင့် recovery documentation ထည့်ပါ။") }
    ],
    extensions: [text("Add streaming ingestion", "Streaming ingestion ထည့်ရန်"), text("Add lineage", "Lineage ထည့်ရန်"), text("Add anomaly detection", "Anomaly detection ထည့်ရန်")]
  }
];

export const guides: LearningGuide[] = [
  {
    id: "backend-first-role",
    slug: "backend-first-role",
    category: "career",
    categoryLabel: text("Career Guide", "အလုပ်အကိုင်လမ်းညွှန်"),
    title: text("Prepare for Your First Backend Developer Role", "ပထမဆုံး Backend Developer အလုပ်အတွက်ပြင်ဆင်ရန်"),
    summary: text("Focus your skills, projects, and interview preparation on evidence employers can verify.", "Employer များစစ်ဆေးနိုင်သော skill၊ project နှင့် interview preparation ကိုအာရုံစိုက်ပါ။"),
    readTime: text("10 min read", "၁၀ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "baseline", heading: text("Build the baseline", "အခြေခံတည်ဆောက်ပါ"), paragraphs: [text("Become comfortable with one language, HTTP, SQL, Git, and testing before collecting more frameworks.", "Framework များထပ်မစုမီ language တစ်ခု၊ HTTP၊ SQL၊ Git နှင့် testing ကိုကျွမ်းကျင်ပါ။")] },
      { id: "proof", heading: text("Turn skills into proof", "Skill ကိုသက်သေအဖြစ်ပြောင်းပါ"), paragraphs: [text("Ship two focused services with tests, documentation, and a clear explanation of your decisions.", "Tests၊ documentation နှင့် ဆုံးဖြတ်ချက်ရှင်းပြချက်ပါသော focused service နှစ်ခုတည်ဆောက်ပါ။")] },
      { id: "interview", heading: text("Prepare deliberately", "ရည်ရွယ်ချက်ရှိရှိပြင်ဆင်ပါ"), paragraphs: [text("Practice explaining tradeoffs, debugging aloud, and telling concise stories about setbacks and learning.", "Tradeoff ရှင်းပြခြင်း၊ အသံထွက် debug လုပ်ခြင်းနှင့် အခက်အခဲမှသင်ယူပုံကိုတိုတောင်းစွာပြောခြင်းလေ့ကျင့်ပါ။")] }
    ],
    checklist: [text("One deployed API", "Deploy လုပ်ထားသော API တစ်ခု"), text("One database-backed project", "Database ပါသော project တစ်ခု"), text("Tests and README for each project", "Project တိုင်းအတွက် tests နှင့် README"), text("Three practiced interview stories", "လေ့ကျင့်ထားသော interview story သုံးခု")],
    careerIds: ["backend-developer"],
    skillIds: ["rest-api-design", "sql-fundamentals", "unit-integration-testing"],
    resourceIds: ["spring-rest", "postgresql-tutorial", "junit-guide"]
  },
  {
    id: "rest-api-design-checklist",
    slug: "rest-api-design-checklist",
    category: "software-engineering",
    categoryLabel: text("Software Engineering", "Software Engineering"),
    title: text("Designing Clear REST APIs", "ရှင်းလင်းသော REST APIs ဒီဇိုင်းဆွဲခြင်း"),
    summary: text("A practical review path for resources, status codes, errors, pagination, and consistency.", "Resources၊ status codes၊ errors၊ pagination နှင့် consistency အတွက် လက်တွေ့ review လမ်းကြောင်း။"),
    readTime: text("10 min read", "၁၀ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "resources", heading: text("Start with resources", "Resources ဖြင့်စတင်ပါ"), paragraphs: [text("Name stable business concepts in URLs and use HTTP methods to express intent.", "URL များတွင် stable business concept များကိုအမည်ပေးပြီး intent ဖော်ပြရန် HTTP methods ကိုအသုံးပြုပါ။")] },
      { id: "errors", heading: text("Make failure predictable", "Failure ကိုခန့်မှန်းနိုင်စေပါ"), paragraphs: [text("Return a consistent error shape with a machine code, human message, and field details when useful.", "Machine code၊ လူဖတ်နိုင်သော message နှင့်လိုအပ်သော field details ပါသော consistent error shape ပြန်ပေးပါ။")] },
      { id: "change", heading: text("Design for change", "ပြောင်းလဲမှုအတွက်ဒီဇိုင်းဆွဲပါ"), paragraphs: [text("Document pagination, idempotency, authentication, and compatibility before clients depend on accidental behavior.", "Client များ accidental behavior ပေါ်မူတည်မီ pagination၊ idempotency၊ authentication နှင့် compatibility ကို document လုပ်ပါ။")] }
    ],
    checklist: [text("Resource-oriented URLs", "Resource-oriented URLs"), text("Consistent status codes", "Consistent status codes"), text("Stable error contract", "Stable error contract"), text("Documented pagination", "Documented pagination")],
    careerIds: ["backend-developer", "full-stack-developer"],
    skillIds: ["rest-api-design", "validation-error-handling"],
    resourceIds: ["mdn-http", "spring-validation"]
  },
  {
    id: "first-production-deployment",
    slug: "first-production-deployment",
    category: "projects",
    categoryLabel: text("Project Guide", "Project လမ်းညွှန်"),
    title: text("Your First Production Deployment", "ပထမဆုံး Production Deployment"),
    summary: text("Ship a small service with safe configuration, health checks, logs, and a rollback plan.", "Service ငယ်တစ်ခုကို safe configuration၊ health checks၊ logs နှင့် rollback plan ဖြင့်ပေးပို့ပါ။"),
    readTime: text("12 min read", "၁၂ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "artifact", heading: text("Build one artifact", "Artifact တစ်ခုတည်ဆောက်ပါ"), paragraphs: [text("Use the same tested artifact in every environment so deployment does not rebuild unknown code.", "Deployment တွင်မသိသော code ပြန်မတည်ဆောက်စေရန် environment တိုင်းတွင် စမ်းသပ်ထားသော artifact တစ်ခုတည်းအသုံးပြုပါ။")] },
      { id: "configuration", heading: text("Separate configuration", "Configuration ခွဲထားပါ"), paragraphs: [text("Keep secrets and environment values outside the image while validating required values at startup.", "Secrets နှင့် environment values များကို image အပြင်ထားပြီး startup တွင်လိုအပ်ချက်စစ်ဆေးပါ။")] },
      { id: "feedback", heading: text("Create feedback", "Feedback တည်ဆောက်ပါ"), paragraphs: [text("Health checks, structured logs, and release markers tell you whether to continue or roll back.", "Health checks၊ structured logs နှင့် release markers များသည် ဆက်မလား rollback လုပ်မလားသိစေသည်။")] }
    ],
    checklist: [text("Immutable artifact", "Immutable artifact"), text("Validated configuration", "Validated configuration"), text("Health endpoint", "Health endpoint"), text("Rollback command", "Rollback command")],
    careerIds: ["backend-developer", "devops-sre", "cloud-engineer"],
    skillIds: ["docker-fundamentals", "cloud-deployment"],
    resourceIds: ["docker-get-started"]
  },
  {
    id: "practical-testing-strategy",
    slug: "practical-testing-strategy",
    category: "software-engineering",
    categoryLabel: text("Software Engineering", "Software Engineering"),
    title: text("A Practical Testing Strategy", "လက်တွေ့ Testing Strategy"),
    summary: text("Choose the smallest test layer that proves each important behavior with confidence.", "အရေးကြီး behavior တစ်ခုစီကိုယုံကြည်စွာသက်သေပြနိုင်သော အငယ်ဆုံး test layer ကိုရွေးပါ။"),
    readTime: text("9 min read", "၉ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "risk", heading: text("Start from risk", "Risk မှစတင်ပါ"), paragraphs: [text("List the failures that would hurt users or the team, then cover them at the fastest useful layer.", "User သို့မဟုတ် team ကိုထိခိုက်စေမည့် failure များစာရင်းလုပ်ပြီး အမြန်ဆုံးအသုံးဝင်သော layer တွင်စမ်းသပ်ပါ။")] },
      { id: "layers", heading: text("Use complementary layers", "အပြန်အလှန်ဖြည့်ဆည်းသော layers သုံးပါ"), paragraphs: [text("Unit tests explain logic, integration tests verify boundaries, and a few end-to-end tests protect critical journeys.", "Unit tests က logic ရှင်းပြပြီး integration tests က boundaries စစ်ဆေးကာ end-to-end tests အနည်းငယ်က critical journey များကာကွယ်သည်။")] }
    ],
    checklist: [text("Critical journeys listed", "Critical journeys စာရင်းပြုလုပ်ထားသည်"), text("Fast logic tests", "မြန်ဆန်သော logic tests"), text("Boundary integration tests", "Boundary integration tests"), text("Stable end-to-end selectors", "Stable end-to-end selectors")],
    careerIds: ["qa-sdet", "backend-developer", "frontend-developer"],
    skillIds: ["testing", "unit-integration-testing", "frontend-testing"],
    resourceIds: ["junit-guide", "testcontainers-guide"]
  },
  {
    id: "system-design-from-requirements",
    slug: "system-design-from-requirements",
    category: "system-design",
    categoryLabel: text("System Design", "System Design"),
    title: text("System Design from Requirements", "Requirements မှ System Design"),
    summary: text("Move from user needs to constraints, components, data flow, failure modes, and tradeoffs.", "User needs မှ constraints၊ components၊ data flow၊ failure modes နှင့် tradeoffs အထိသွားပါ။"),
    readTime: text("14 min read", "၁၄ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "clarify", heading: text("Clarify the job", "လိုအပ်ချက်ရှင်းပါ"), paragraphs: [text("Define users, core actions, volume, latency, consistency, and availability before choosing technology.", "Technology မရွေးမီ users၊ core actions၊ volume၊ latency၊ consistency နှင့် availability သတ်မှတ်ပါ။")] },
      { id: "flow", heading: text("Draw the data flow", "Data flow ဆွဲပါ"), paragraphs: [text("Start with the smallest end-to-end request path, then add storage, queues, caches, and boundaries only when a requirement needs them.", "အသေးဆုံး end-to-end request path ဖြင့်စပြီး requirement လိုမှ storage၊ queues၊ caches နှင့် boundaries ထည့်ပါ။")] },
      { id: "failure", heading: text("Discuss failure and tradeoffs", "Failure နှင့် tradeoffs ဆွေးနွေးပါ"), paragraphs: [text("Explain what can fail, how the system detects it, and why one tradeoff fits the stated constraints.", "ဘာပျက်နိုင်သည်၊ system ကဘယ်လိုသိသည်နှင့် tradeoff တစ်ခုက သတ်မှတ် constraints နှင့်ဘာကြောင့်ကိုက်ညီသည်ကိုရှင်းပြပါ။")] }
    ],
    checklist: [text("Functional requirements", "Functional requirements"), text("Scale assumptions", "Scale assumptions"), text("Core data flow", "Core data flow"), text("Failure modes", "Failure modes"), text("Explicit tradeoffs", "Explicit tradeoffs")],
    careerIds: ["backend-developer", "full-stack-developer", "cloud-engineer"],
    skillIds: ["system-design", "rest-api-design", "cloud-deployment"],
    resourceIds: ["mdn-http"]
  },
  {
    id: "repeatable-learning-workflow",
    slug: "repeatable-learning-workflow",
    category: "learning",
    categoryLabel: text("Learning Guide", "သင်ယူမှုလမ်းညွှန်"),
    title: text("A Repeatable Learning Workflow", "ထပ်ခါတလဲလဲအသုံးပြုနိုင်သော သင်ယူမှု Workflow"),
    summary: text("Turn each roadmap skill into understanding, practice, project proof, and reflection.", "Roadmap skill တစ်ခုစီကို နားလည်မှု၊ လေ့ကျင့်မှု၊ project proof နှင့် reflection အဖြစ်ပြောင်းပါ။"),
    readTime: text("8 min read", "၈ မိနစ်ဖတ်ရန်"),
    sections: [
      { id: "understand", heading: text("Understand", "နားလည်ပါ"), paragraphs: [text("Read one trusted explanation and write the idea in your own words.", "ယုံကြည်ရသောရှင်းပြချက်တစ်ခုဖတ်ပြီး အယူအဆကိုကိုယ်ပိုင်စကားဖြင့်ရေးပါ။")] },
      { id: "practice", heading: text("Practice", "လေ့ကျင့်ပါ"), paragraphs: [text("Complete a small exercise without copying, then debug one intentional mistake.", "Copy မလုပ်ဘဲ exercise ငယ်တစ်ခုပြီးစီးပြီး ရည်ရွယ်ချက်ရှိသောအမှားတစ်ခု debug လုပ်ပါ။")] },
      { id: "prove", heading: text("Build and prove", "တည်ဆောက်ပြီးသက်သေပြပါ"), paragraphs: [text("Use the skill in a project feature, test it, and document why you made the decision.", "Skill ကို project feature တွင်အသုံးပြုပြီး စမ်းသပ်ကာ ဘာကြောင့်ဤဆုံးဖြတ်ချက်လုပ်သည်ကိုရေးပါ။")] }
    ],
    checklist: [text("Explain it simply", "ရိုးရှင်းစွာရှင်းပြနိုင်သည်"), text("Use it without copying", "Copy မလုပ်ဘဲအသုံးပြုနိုင်သည်"), text("Debug a mistake", "အမှားတစ်ခု debug လုပ်နိုင်သည်"), text("Show it in a project", "Project တွင်ပြသနိုင်သည်")],
    careerIds: careers.map((career) => career.id),
    skillIds: ["default"],
    resourceIds: []
  }
];

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "learning-from-failure",
    slug: "learning-from-failure",
    category: "behavioral",
    categoryLabel: text("Behavioral", "Behavioral"),
    question: text("Tell me about a time you failed.", "သင်မအောင်မြင်ခဲ့သောအချိန်တစ်ခုအကြောင်း ပြောပြပါ။"),
    summary: text("Practice showing ownership, reflection, learning, and better follow-through.", "Ownership၊ reflection၊ learning နှင့် ပိုကောင်းသော follow-through ကိုပြသရန်လေ့ကျင့်ပါ။"),
    evaluates: [text("Ownership", "တာဝန်ယူမှု"), text("Reflection", "ပြန်လည်သုံးသပ်မှု"), text("Learning", "သင်ယူမှု"), text("Communication", "ဆက်သွယ်မှု")],
    approach: [text("Choose a real, contained failure.", "တကယ်ဖြစ်ခဲ့ပြီးအတိုင်းအတာရှင်းသော failure ရွေးပါ။"), text("Name your contribution without blaming others.", "အခြားသူများကိုအပြစ်မတင်ဘဲ သင့်ပါဝင်မှုကိုဖော်ပြပါ။"), text("Show the behavior you changed afterward.", "နောက်ပိုင်းပြောင်းလဲခဲ့သော behavior ကိုပြပါ။")],
    starFramework: {
      situation: text("Set only the context the listener needs.", "နားထောင်သူလိုအပ်သော context သာဖော်ပြပါ။"),
      task: text("Explain your responsibility and the expected outcome.", "သင့်တာဝန်နှင့်မျှော်မှန်းရလဒ်ကိုရှင်းပြပါ။"),
      action: text("Describe your decisions, including the mistake and correction.", "အမှားနှင့်ပြင်ဆင်မှုအပါအဝင် သင့်ဆုံးဖြတ်ချက်များဖော်ပြပါ။"),
      result: text("Share the outcome, learning, and later evidence of change.", "ရလဒ်၊ သင်ယူမှုနှင့်နောက်ပိုင်းပြောင်းလဲမှုသက်သေကိုမျှဝေပါ။")
    },
    commonMistakes: [text("Choosing a disguised success story", "Success story ကို failure အဖြစ်ဖုံးကွယ်ပြောခြင်း"), text("Blaming a teammate", "Team member ကိုအပြစ်တင်ခြင်း"), text("Ending without a changed behavior", "ပြောင်းလဲသော behavior မပါဘဲအဆုံးသတ်ခြင်း")],
    roleIds: careers.map((career) => career.id),
    skillIds: []
  },
  {
    id: "api-debugging-scenario",
    slug: "api-debugging-scenario",
    category: "technical",
    categoryLabel: text("Technical", "Technical"),
    question: text("How would you debug an API that suddenly became slow?", "ရုတ်တရက်နှေးသွားသော API ကိုဘယ်လို debug လုပ်မလဲ။"),
    summary: text("Structure the investigation from symptoms to evidence, isolation, mitigation, and prevention.", "လက္ခဏာမှ evidence၊ isolation၊ mitigation နှင့် prevention အထိ စနစ်တကျစစ်ဆေးပါ။"),
    evaluates: [text("Problem framing", "Problem framing"), text("Observability", "Observability"), text("Prioritization", "Prioritization"), text("Communication", "Communication")],
    approach: [text("Confirm scope and recent changes.", "Scope နှင့် recent changes စစ်ဆေးပါ။"), text("Use latency, error, dependency, and saturation signals.", "Latency၊ error၊ dependency နှင့် saturation signal များအသုံးပြုပါ။"), text("Mitigate user impact before deep optimization.", "Deep optimization မလုပ်မီ user impact ကိုလျှော့ပါ။")],
    commonMistakes: [text("Guessing one root cause too early", "Root cause တစ်ခုကိုစောလွန်းစွာခန့်မှန်းခြင်း"), text("Ignoring database and downstream calls", "Database နှင့် downstream calls ကိုလျစ်လျူရှုခြင်း"), text("Optimizing before measuring", "မတိုင်းတာမီ optimize လုပ်ခြင်း")],
    roleIds: ["backend-developer", "devops-sre", "cloud-engineer"],
    skillIds: ["api-debugging", "observability"]
  },
  {
    id: "design-url-shortener",
    slug: "design-url-shortener",
    category: "system-design",
    categoryLabel: text("System Design", "System Design"),
    question: text("Design a reliable URL shortener.", "ယုံကြည်ရသော URL shortener တစ်ခုဒီဇိုင်းဆွဲပါ။"),
    summary: text("Practice requirements, identifiers, redirects, storage, caching, abuse controls, and tradeoffs.", "Requirements၊ identifiers၊ redirects၊ storage၊ caching၊ abuse controls နှင့် tradeoffs ကိုလေ့ကျင့်ပါ။"),
    evaluates: [text("Requirements", "Requirements"), text("Data modeling", "Data modeling"), text("Scalability", "Scalability"), text("Tradeoffs", "Tradeoffs")],
    approach: [text("Clarify read/write volume and retention.", "Read/write volume နှင့် retention ရှင်းပါ။"), text("Design the create and redirect paths first.", "Create နှင့် redirect path ကိုအရင်ဒီဇိုင်းဆွဲပါ။"), text("Add cache, replication, and abuse controls from explicit needs.", "Explicit needs မှ cache၊ replication နှင့် abuse controls ထည့်ပါ။")],
    commonMistakes: [text("Starting with technology names", "Technology name များဖြင့်စတင်ခြင်း"), text("Skipping collision handling", "Collision handling ကျော်သွားခြင်း"), text("Ignoring malicious URLs", "Malicious URL များကိုလျစ်လျူရှုခြင်း")],
    roleIds: ["backend-developer", "full-stack-developer"],
    skillIds: ["system-design", "rest-api-design", "postgresql-data-modeling"]
  },
  {
    id: "explain-database-choice",
    slug: "explain-database-choice",
    category: "role-specific",
    categoryLabel: text("Role Specific", "Role Specific"),
    question: text("How would you choose a database for a new backend service?", "Backend service အသစ်တစ်ခုအတွက် database ကိုဘယ်လိုရွေးမလဲ။"),
    summary: text("Connect access patterns and guarantees to a concrete storage choice.", "Access patterns နှင့် guarantees ကို concrete storage choice နှင့်ချိတ်ဆက်ပါ။"),
    evaluates: [text("Data modeling", "Data modeling"), text("Tradeoffs", "Tradeoffs"), text("Operational judgment", "Operational judgment")],
    approach: [text("Describe entities, relationships, and access patterns.", "Entities၊ relationships နှင့် access patterns ဖော်ပြပါ။"), text("Clarify consistency, scale, and operational constraints.", "Consistency၊ scale နှင့် operational constraints ရှင်းပါ။"), text("Choose the simplest option that satisfies them.", "လိုအပ်ချက်ဖြည့်သော အရိုးရှင်းဆုံး option ကိုရွေးပါ။")],
    commonMistakes: [text("Choosing by popularity", "Popularity ဖြင့်ရွေးခြင်း"), text("Ignoring migration and operations", "Migration နှင့် operations ကိုလျစ်လျူရှုခြင်း"), text("Claiming one database fits everything", "Database တစ်ခုကအရာအားလုံးနှင့်ကိုက်သည်ဟုဆိုခြင်း")],
    roleIds: ["backend-developer", "data-engineer"],
    skillIds: ["sql-fundamentals", "postgresql-data-modeling"]
  }
];

export const careerCategories: Array<{ id: "all" | CareerCategory; label: LocalizedText }> = [
  { id: "all", label: text("All", "အားလုံး") },
  { id: "web", label: text("Web", "Web") },
  { id: "mobile", label: text("Mobile", "Mobile") },
  { id: "data-ai", label: text("Data & AI", "Data နှင့် AI") },
  { id: "cloud-devops", label: text("Cloud & DevOps", "Cloud နှင့် DevOps") },
  { id: "security", label: text("Security", "Security") },
  { id: "qa", label: text("QA", "QA") },
  { id: "systems", label: text("Systems", "Systems") },
  { id: "game", label: text("Game Development", "Game Development") }
];

export function getCareerBySlug(slug?: string) {
  return careers.find((career) => career.slug === slug);
}

export function getCareerById(id?: string | null) {
  return careers.find((career) => career.id === id);
}

export function getRoadmapById(id?: string | null) {
  return roadmaps.find((roadmap) => roadmap.id === id);
}

export function getRoadmapForCareer(careerId?: string | null) {
  return roadmaps.find((roadmap) => roadmap.careerId === careerId);
}

export function getSkillById(skillId?: string | null) {
  for (const roadmap of roadmaps) {
    for (const stage of roadmap.stages) {
      const skill = stage.skills.find((item) => item.id === skillId);
      if (skill) {
        return { skill, stage, roadmap };
      }
    }
  }

  return null;
}

export function getResourceById(id: string) {
  return learningResources.find((resource) => resource.id === id);
}

export function getProjectBySlug(slug?: string) {
  return projects.find((project) => project.slug === slug);
}

export function getGuideBySlug(slug?: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getInterviewQuestionBySlug(slug?: string) {
  return interviewQuestions.find((question) => question.slug === slug);
}

export function getCareerCounts(career: Career) {
  const roadmap = getRoadmapById(career.roadmapId);
  const skills = roadmap?.stages.flatMap((stage) => stage.skills) ?? [];
  const resourceIds = new Set(skills.flatMap((skill) => skill.resourceIds));

  return {
    stages: roadmap?.stages.length ?? 0,
    skills: skills.length,
    resources: resourceIds.size
  };
}

export function getCareerRecommendations(mode: UserMode) {
  return [...careers].sort((a, b) => b.matchByMode[mode] - a.matchByMode[mode]).slice(0, 3);
}

export function getRelatedProjects(skillIds: string[], roleId?: string | null) {
  return projects.filter(
    (project) =>
      (!roleId || project.roleIds.includes(roleId)) && project.skillIds.some((skillId) => skillIds.includes(skillId))
  );
}
