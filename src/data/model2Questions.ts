export interface Model2Option {
  value: 0 | 1 | 2 | 3 | 4;
  label: { en: string; my: string };
}

export interface Model2Question {
  id: string;
  text: { en: string; my: string };
  options: Model2Option[];
}

export const MODEL2_QUESTIONS_BILINGUAL: Model2Question[] = [
  {
    "id": "Q1",
    "text": {
      "en": "When creating a software project, which part is most exciting for you to work on?",
      "my": "Software project တစ်ခု ဖန်တီးတဲ့အခါ ဘယ်အပိုင်းကို လုပ်ရတာ အစိတ်လှုပ်ရှားဆုံးလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Training AI models, preparing datasets, and making useful AI predictions.",
          "my": "AI Model တွေကို Train တာ၊ Dataset တွေကို ပြင်ဆင်တာနဲ့ AI ကို အသုံးဝင်တဲ့ ခန့်မှန်းချက်တွေ ထုတ်ပေးနိုင်အောင် လုပ်ရတာ။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Creating clean visual layouts, UI interactions, and seamless user experiences.",
          "my": "Website/App ရဲ့ သပ်ရပ်လှပတဲ့ Visual Layout၊ UI Interaction တွေနဲ့ သုံးရတာ စိမ့်နေအောင် ဖန်တီးရတာ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Structuring data concepts, rules, and ontology to make the domain logic precise.",
          "my": "Data ရဲ့ အယူအဆတွေ၊ Rules တွေကို စနစ်တကျ ချိတ်ဆက်ပြီး System က Domain Logic ကို တိတိကျကျ နားလည်အောင် စီစဉ်ရတာ။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Writing server code, API logic, and creating high-performance endpoints.",
          "my": "Server Code တွေ၊ API Logic တွေ ရေးသားပြီး Endpoint တွေ မြန်မြန်ဆန်ဆန် အလုပ်လုပ်အောင် ဖန်တီးရတာ။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Designing clean database schemas and managing underlying data flow.",
          "my": "သပ်ရပ်တဲ့ Database Schema တွေ ဒီဇိုင်းထုတ်ပြီး အနောက်မှာ Data စီးဆင်းမှုတွေကို စနစ်တကျ ကိုင်တွယ်ရတာ။"
        }
      }
    ]
  },
  {
    "id": "Q2",
    "text": {
      "en": "When an app throws an error and you need to debug it, what do you check first?",
      "my": "App မှာ Error တစ်ခုခုတက်လို့ Debug လုပ်ရတော့မယ်ဆိုရင် ဘယ်အချက်ကို ပထမဆုံး စစ်ဆေးလေ့ရှိလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Server logs, API request payloads, HTTP status codes, and error tracebacks.",
          "my": "Server Log တွေ၊ API Request Payload တွေ၊ HTTP Status Code တွေနဲ့ Error Traceback တွေကို စစ်တာ။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Mismatched entity mappings or logical relationships defined in the system.",
          "my": "စနစ်ထဲမှာ သတ်မှတ်ထားတဲ့ Entity မက်ပင်းတွေ သို့မဟုတ် Logical Relationship တွေ လွဲနေသလား စစ်တာ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Browser DevTools to inspect CSS layouts, rendering issues, and component state.",
          "my": "Browser DevTools ဖွင့်ပြီး CSS Layout တွေ၊ Rendering တွေနဲ့ Component State တွေကို စစ်တာ။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Data quality in the dataset, data imbalances, or feature engineering requirements.",
          "my": "Dataset မှာ Data မသန့်တာ၊ မညီမညာဖြစ်နေတာလား သို့မဟုတ် Model Feature တွေကို ပြန်ပြင်ဖို့ လိုသလား စစ်တာ။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Database query performance, slow-running queries, and broken data transformations.",
          "my": "Database Query စွမ်းဆောင်ရည်၊ နှေးကွေးနေတဲ့ Query တွေနဲ့ Broken Data Transformations တွေကို စစ်တာ။"
        }
      }
    ]
  },
  {
    "id": "Q3",
    "text": {
      "en": "If you need to manage and store data for an application, which structure feels most natural?",
      "my": "App တစ်ခုအတွက် အချက်အလက် (Data) တွေကို သိမ်းဆည်း စီမံရမယ်ဆိုရင် ဘယ်လို ပုံစံနဲ့ အလုပ်လုပ်ရတာ အဆင်ပြေဆုံးလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Well-structured SQL tables with Foreign Keys and Indexes.",
          "my": "Foreign Keys၊ Indexes တွေနဲ့ သပ်သပ်ရပ်ရပ် ဖွဲ့စည်းထားတဲ့ SQL Tables တွေနဲ့ အလုပ်လုပ်ရတာ။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Connected Mind Maps or Graph structures using Nodes and Relationships.",
          "my": "Nodes တွေ၊ Relationships တွေနဲ့ ချိတ်ဆက်ထားတဲ့ Mind Map သို့မဟုတ် Graph ပုံစံနဲ့ အလုပ်လုပ်ရတာ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Matrices and Vector Embeddings ready for ML Model pipelines.",
          "my": "ML Model တွေအတွက် အဆင်သင့်ဖြစ်နေတဲ့ Matrix တွေ၊ Vector Embeddings တွေနဲ့ အလုပ်လုပ်ရတာ။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Browser Local Storage, Client-side State, or UI Props directly.",
          "my": "Browser Local Storage၊ Client-side State သို့မဟုတ် UI Props တွေနဲ့ တိုက်ရိုက် အလုပ်လုပ်ရတာ။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "High-speed JSON documents or Key-Value stores easy to integrate with REST APIs.",
          "my": "REST API တွေနဲ့ ချိတ်ဆက်ရလွယ်ကူတဲ့ မြန်နှုန်းမြင့် JSON Documents သို့မဟုတ် Key-Value Stores တွေနဲ့ အလုပ်လုပ်ရတာ။"
        }
      }
    ]
  },
  {
    "id": "Q4",
    "text": {
      "en": "When you open the Terminal or Command Line, what do you usually do?",
      "my": "Terminal သို့မဟုတ် Command Line ကို ဖွင့်လိုက်ရင် များသောအားဖြင့် ဘာလုပ်လေ့ရှိလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Running Vite/React dev servers, executing Git commands, and installing UI packages.",
          "my": "Vite/React Dev Server တွေ ပတ်တာ၊ Git Command တွေ ရိုက်တာနဲ့ UI Packages တွေ သွင်းတာ။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Executing Linux commands, Docker containers, SSH connections, and server deployments.",
          "my": "Linux Commands တွေ၊ Docker Containers၊ SSH Connections တွေနဲ့ Server Deployment တွေ လုပ်တာ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Setting up Python virtual environments, installing PyTorch/Pandas, and running Jupyter Notebooks.",
          "my": "Python Virtual Environment တွေ ဆောက်တာ၊ PyTorch/Pandas တွေ သွင်းတာနဲ့ Jupyter Notebook တွေ ပတ်တာ။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Running database migrations, seed scripts, and SQL query shells.",
          "my": "Database Migration တွေ၊ Seed Scripts တွေနဲ့ SQL Query Shell တွေကို ရိုက်တာ။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Querying Knowledge Graphs, parsing ontologies, and executing structured data scripts.",
          "my": "Knowledge Graph တွေကို Query လုပ်တာ၊ Ontologies တွေကို Parse လုပ်တာနဲ့ Structured Data Scripts တွေ ပတ်တာ။"
        }
      }
    ]
  },
  {
    "id": "Q5",
    "text": {
      "en": "If you were to build a personal project over the weekend, what would you prefer to build?",
      "my": "အကယ်၍ စနေ/တနင်္ဂနွေမှာ Personal Project တစ်ခု တည်ဆောက်မယ်ဆိုရင် ဘယ်ဟာကို အလုပ်ချင်ဆုံးလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "A REST or GraphQL Backend API Service with User Auth and Microservices.",
          "my": "User Auth နဲ့ Microservices တွေ ပါဝင်တဲ့ REST သို့မဟုတ် GraphQL Backend API Service တစ်ခု။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "A Knowledge Graph-based Recommendation Engine that explains reasons behind answers.",
          "my": "အဖြေတစ်ခုကို ဘာကြောင့် ရွေးချယ်ခဲ့သလဲဆိုတာ စနစ်တကျ ရှင်းပြနိုင်တဲ့ Knowledge Graph အခြေခံ Recommendation Engine တစ်ခု။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "A modern interactive Web Application with Dark Mode toggles and smooth animations.",
          "my": "Dark Mode Toggle၊ Animations တွေနဲ့ ခေတ်မီဆန်းသစ်တဲ့ Interactive Web Application တစ်ခု။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "An Image Classifier, Object Detector, or a fine-tuned Local LLM Agent.",
          "my": "Image Classifier၊ Object Detector သို့မဟုတ် Fine-tuned Local LLM Agent တစ်ခု။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "A Data Scraper Pipeline that gathers and cleans data from web sources into a warehouse.",
          "my": "Web ရင်းမြစ်ပေါင်းစုံကနေ Data တွေကို စုဆောင်းသန့်စင်ပြီး Warehouse ထဲ ထည့်ပေးတဲ့ Data Scraper Pipeline တစ်ခု။"
        }
      }
    ]
  },
  {
    "id": "Q6",
    "text": {
      "en": "When solving problems, which type of math or logic do you enjoy using most?",
      "my": "ပြဿနာဖြေရှင်းတဲ့အခါ ဘယ်လို သင်္ချာ သို့မဟုတ် Logic အမျိုးအစားကို အသုံးပြုရတာ ပိုသဘောကျလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Statistics, Probability, Matrices, and Linear Algebra equations.",
          "my": "Statistics၊ Probability၊ Matrices နဲ့ Linear Algebra ညီမျှခြင်းများ။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Discrete Math, Binary Logic, Hash Functions, and Cryptographic steps.",
          "my": "Discrete Math၊ Binary Logic၊ Hash Functions နဲ့ Cryptographic Steps များ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Spatial Geometry, Grid Proportions, Responsive Math, and Color Contrast Ratios.",
          "my": "Spatial Geometry၊ Grid Proportions၊ Responsive Math နဲ့ Color Contrast Ratios များ။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Logic Diagrams, Entity-Relationship Maps, Taxonomies, and Step-by-Step Reasoning Rules.",
          "my": "Logic Diagrams၊ Entity-Relationship Maps၊ Taxonomies နဲ့ Step-by-Step Reasoning Rules များ။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Relational Algebra, Set Theory, SQL Join Logic, and Data Structure Efficiency.",
          "my": "Relational Algebra၊ Set Theory၊ SQL Join Logic နဲ့ Data Structure Efficiency များ။"
        }
      }
    ]
  },
  {
    "id": "Q7",
    "text": {
      "en": "Before launching a project online, which aspect do you prioritize to ensure highest quality?",
      "my": "Project တစ်ခုကို Online ပေါ် မတင်မီ ဘယ်အချက်ကို အရည်အသွေးအမြင့်ဆုံး ဖြစ်အောင် ဦးစားပေးမလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Ensuring the website loads lightning fast and lightweight on both mobile and desktop.",
          "my": "Website က ဖုန်းမှာရော Computer မှာပါ ချက်ချင်း ပေါ့ပါးမြန်ဆန်စွာ တက်လာစေဖို့။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Securing User Accounts, Passwords, JWT Tokens, and closing API vulnerabilities.",
          "my": "User Accounts၊ Passwords၊ JWT Tokens တွေကို လုံခြုံစေပြီး API Vulnerabilities တွေကို ပိတ်ဆို့ဖို့။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Ensuring the system produces clear, hallucination-free answers grounded in facts.",
          "my": "System က လျှောက်ပြောတာ (Hallucination) မရှိဘဲ တိကျခိုင်မာတဲ့ အကြောင်းပြချက်တွေနဲ့ အဖြေထုတ်ပေးဖို့။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Preventing data loss, duplication, or corruption during high user traffic spikes.",
          "my": "User Traffic များလာရင် Data တွေ ပျောက်ပျက်တာ၊ ထပ်နေတာနဲ့ ပျက်စီးတာမျိုး မရှိစေဖို့။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Keeping server resources, container uptime, and cloud deployments running smoothly.",
          "my": "Server Resources၊ Container Uptime နဲ့ Cloud Deployments တွေကို ချောမွေ့နေစေဖို့။"
        }
      }
    ]
  },
  {
    "id": "Q8",
    "text": {
      "en": "When browsing technical videos on YouTube, which topic would you click on first?",
      "my": "YouTube မှာ နည်းပညာ ဗီဒီယို ကြည့်မယ်ဆိုရင် ဘယ်ခေါင်းစဉ်ကို ပထမဆုံး နှိပ်ကြည့်မိမလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "How to build scalable data pipelines that effortlessly process millions of records.",
          "my": "Data Record သန်းပေါင်းများစွာကို အားစိုက်စရာမလိုဘေး Processing လုပ်ပေးမယ့် Scalable Data Pipeline တည်ဆောက်နည်း"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "How to write professional, production-ready REST APIs and Microservices.",
          "my": "Professional ကျပြီး Production-Ready ဖြစ်တဲ့ REST APIs နဲ့ Microservices တွေ စနစ်တကျ ရေးသားနည်း"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "How to make AI systems 10x smarter and hallucination-free using Knowledge Graphs & RAG.",
          "my": "Knowledge Graph နဲ့ RAG ကိုသုံးပြီး AI System တွေကို Hallucination မရှိဘဲ ၁၀ ဆ ပိုမို စမတ်ကျအောင် လုပ်ဆောင်နည်း"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "How to create modern React animations and Tailwind UI components in 30 minutes.",
          "my": "မိနစ် ၃၀ အတွင်း ခေတ်မီ React Animations များနှင့် Tailwind UI Components များ ဖန်တီးနည်း"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "How to fine-tune your own custom AI model from scratch using Python.",
          "my": "Python ကို အသုံးပြု၍ မိမိပိုင် AI Model ကို စတင်မှစ၍ Fine-tune လုပ်ယူနည်း"
        }
      }
    ]
  },
  {
    "id": "Q9",
    "text": {
      "en": "Which tech stack ecosystem feels most comfortable and exciting for you?",
      "my": "ဘယ် နည်းပညာ Tools အစုအဝေးက သင့်အတွက် အဆင်ပြေဆုံးနဲ့ စိတ်ဝင်စားဖို့ အကောင်းဆုံးဖြစ်လဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "Frontend Stacks (React, Vite, Tailwind CSS, TypeScript).",
          "my": "Frontend Stacks များ (React, Vite, Tailwind CSS, TypeScript)။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "Knowledge Graph Tools (Neo4j), Semantic Frameworks, and Structured RAG Engines.",
          "my": "Knowledge Graph Tools များ (Neo4j)၊ Semantic Frameworks နှင့် Structured RAG Engines များ။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "Backend Frameworks (FastAPI, Spring Boot, Express.js) and API Tools (Postman).",
          "my": "Backend Frameworks များ (FastAPI, Spring Boot, Express.js) နှင့် API Testing Tools (Postman)။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "Python Data Science Tools (Jupyter Notebooks, Pandas, PyTorch, Scikit-Learn).",
          "my": "Python Data Science Tools များ (Jupyter Notebooks, Pandas, PyTorch, Scikit-Learn)။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "Linux CLI, Docker Containers, Kubernetes, and CI/CD Deployment Pipelines.",
          "my": "Linux CLI၊ Docker Containers၊ Kubernetes နှင့် CI/CD Deployment Pipelines များ။"
        }
      }
    ]
  },
  {
    "id": "Q10",
    "text": {
      "en": "How would you describe your future career goal in one sentence?",
      "my": "သင့်ရဲ့ အနာဂတ် ရည်မှန်းချက် အလုပ်အကိုင်ကို စာကြောင်းတစ်ကြောင်းထဲနဲ့ ဖော်ပြရရင် ဘာဖြစ်မလဲ?"
    },
    "options": [
      {
        "value": 0,
        "label": {
          "en": "I write fast, secure Backend APIs and server logic that power applications.",
          "my": "ကျွန်တော်/ကျွန်မက App တွေကို ပေါ့ပါးမြန်ဆန်ပြီး လုံခြုံစေမယ့် Backend APIs နဲ့ Server Logic တွေကို ရေးသားပါတယ်။"
        }
      },
      {
        "value": 1,
        "label": {
          "en": "I structure domain knowledge and rules so AI systems stay accurate and factual.",
          "my": "ကျွန်တော်/ကျွန်မက AI က မမှန်မကန် မပြောရအောင် Domain Information နဲ့ Rules တွေကို စနစ်တကျ စီမံခန့်ခွဲပေးပါတယ်။"
        }
      },
      {
        "value": 2,
        "label": {
          "en": "I create stunning, responsive interactive web apps that users love.",
          "my": "ကျွန်တော်/ကျွန်မက သုံးစွဲသူတွေ သဘောကျပြီး ရုပ်ထွက်လှပတဲ့ Interactive Web Apps တွေကို ဖန်တီးပါတယ်။"
        }
      },
      {
        "value": 3,
        "label": {
          "en": "I train smart AI models that process data to solve complex problems.",
          "my": "ကျွန်တော်/ကျွန်မက Data တွေကို အသုံးပြုပြီး ပြဿနာတွေကို ဖြေရှင်းနိုင်မယ့် စမတ်ကျတဲ့ AI Models တွေကို Train ပေးပါတယ်။"
        }
      },
      {
        "value": 4,
        "label": {
          "en": "I build resilient data pipelines and database architectures for entire organizations.",
          "my": "ကျွန်တော်/ကျွန်မက ကုမ္ပဏီတစ်ခုလုံး အလုပ်လုပ်နိုင်အောင် ခိုင်မာတဲ့ Data Pipelines နဲ့ Database Architectures တွေကို တည်ဆောက်ပါတယ်။"
        }
      }
    ]
  }
];
