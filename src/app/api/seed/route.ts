import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Standard = "S1"|"S2"|"S3"|"S4"|"S5"|"S6"|"S7"|"S8"|"S9"|"S10"|"S11"|"S12";
type ContentType = "ACTIVITY_LINK"|"THEORY"|"INTERACTIVE"|"ADVANCED_LAB";

const modules: {
  title: string;
  description: string;
  summary?: string;
  youtubeUrl?: string;
  quizJson?: string;
  standard: Standard;
  contentType: ContentType;
  externalUrl?: string;
  order: number;
  tasks: { title: string; points: number }[];
}[] = [
  // ============================================================
  // STD 1-3: Quick Draw (Activity Link)
  // ============================================================
  {
    title: "Let's Draw with AI!",
    description: "Draw pictures and watch AI guess what you drew in 20 seconds!",
    summary: "AI (Artificial Intelligence) is like a super-smart computer friend! When you draw a picture, the AI looks at millions of other drawings to guess what you made. The more people draw, the smarter it gets. Let's play and help teach the AI!",
    youtubeUrl: "https://www.youtube.com/embed/X8v1GWzZYJ4",
    standard: "S1", contentType: "ACTIVITY_LINK", externalUrl: "https://quickdraw.withgoogle.com/", order: 1,
    tasks: [
      { title: "Draw a cat for the AI to guess", points: 10 },
      { title: "Draw a house for the AI to guess", points: 10 },
      { title: "Complete Quiz: Fun with AI!", points: 20 },
      { title: "Final Test: Can you beat the AI?", points: 20 }
    ],
    quizJson: JSON.stringify([
      { q: "What does AI stand for?", options: ["Apple Ice", "Artificial Intelligence", "Active Internet"], answer: 1 }
    ])
  },
  {
    title: "AI Sees What You Draw!",
    description: "How does a computer learn to recognise pictures? Play and find out!",
    summary: "Computers cannot see like we do. Instead, they learn by looking at thousands and thousands of drawings. When you play Quick Draw, you are actually teaching the AI! Every drawing you make helps the computer get better at guessing. Isn't that amazing?",
    youtubeUrl: "https://www.youtube.com/embed/X8v1GWzZYJ4",
    standard: "S2", contentType: "ACTIVITY_LINK", externalUrl: "https://quickdraw.withgoogle.com/", order: 1,
    tasks: [
      { title: "Complete 3 Quick Draw rounds", points: 15 },
      { title: "Complete Quiz: How Computers See", points: 20 },
      { title: "Final Test: Draw 5 items perfectly", points: 20 }
    ],
    quizJson: JSON.stringify([
      { q: "How do computers learn to see?", options: ["By wearing glasses", "By looking at thousands of examples", "By sleeping"], answer: 1 }
    ])
  },
  {
    title: "Teaching Computers to See",
    description: "Play Quick Draw and discover how AI learns from millions of drawings.",
    summary: "Quick Draw by Google uses a special type of AI called a Neural Network. It has learned from over 50 million drawings made by people all over the world! The AI does not just memorize — it learns the pattern of how people draw things. A cat always has pointy ears, a house has a roof — the AI learns these patterns and uses them to guess your drawing!",
    youtubeUrl: "https://www.youtube.com/embed/X8v1GWzZYJ4",
    standard: "S3", contentType: "ACTIVITY_LINK", externalUrl: "https://quickdraw.withgoogle.com/", order: 1,
    tasks: [
      { title: "Complete a full Quick Draw challenge (6 rounds)", points: 20 },
      { title: "Complete Quiz: Neural Networks for Kids", points: 20 },
      { title: "Final Test: Tricks and Patterns", points: 20 }
    ],
    quizJson: JSON.stringify([
      { q: "What does a Neural Network look for in your drawings?", options: ["Colors", "Patterns and shapes like pointy ears", "Smells"], answer: 1 }
    ])
  },

  // ============================================================
  // STD 4-5: Teachable Machine (Activity Link)
  // ============================================================
  {
    title: "Train Your Own AI Model!",
    description: "Teach a computer to recognise your hand gestures using Teachable Machine.",
    summary: "Teachable Machine is a tool made by Google that lets YOU train an AI without writing any code! You show it examples of different things (like thumbs up vs thumbs down) and it learns to tell them apart. This is called Machine Learning — teaching machines using examples, just like how you learn by practice!",
    youtubeUrl: "https://www.youtube.com/embed/T2qQGqZxkD0",
    standard: "S4", contentType: "ACTIVITY_LINK", externalUrl: "https://teachablemachine.withgoogle.com/", order: 1,
    tasks: [
      { title: "Create an Image Project on Teachable Machine", points: 20 },
      { title: "Complete Quiz: What is Machine Learning?", points: 20 },
      { title: "Final Test: Train a model with 3 classes", points: 30 }
    ],
    quizJson: JSON.stringify([
      { q: "What is Machine Learning?", options: ["A robot that goes to school", "Teaching machines using examples", "A type of car"], answer: 1 }
    ])
  },
  {
    title: "Sound & Pose Recognition AI",
    description: "Build a sound or pose classifier using Teachable Machine.",
    summary: "AI can recognise not just images, but also sounds and body poses! With Teachable Machine, you can train it to tell the difference between clapping vs snapping, or standing vs sitting. This technology is used in real life for fitness apps, sign language recognition, and accessibility tools for people with disabilities.",
    youtubeUrl: "https://www.youtube.com/embed/T2qQGqZxkD0",
    standard: "S5", contentType: "ACTIVITY_LINK", externalUrl: "https://teachablemachine.withgoogle.com/", order: 1,
    tasks: [
      { title: "Build a sound classifier (e.g. clap vs snap)", points: 25 },
      { title: "Complete Quiz: Beyond Images", points: 20 },
      { title: "Final Test: Build a working pose classifier", points: 30 }
    ],
    quizJson: JSON.stringify([
      { q: "Can AI understand sounds?", options: ["Yes, we can train it to hear the difference between a clap and a snap", "No, AI is deaf"], answer: 0 }
    ])
  },

  // ============================================================
  // STD 6: What is Data + Teachable Machine Theory
  // ============================================================
  {
    title: "What is Data?",
    description: "Understand what data is, where it comes from, and why it matters for AI.",
    summary: `**What is Data?**\n\nData is any collection of facts, numbers, words, or observations. Everything around us produces data!\n\n**Types of Data:**\n- **Structured Data**: Organised in tables — like a student mark sheet\n- **Unstructured Data**: Not organised — like photos, videos\n\n**Why does AI need data?**\nAI learns from data the same way you learn from experience. The more examples (data) it sees, the better it gets.`,
    youtubeUrl: "https://www.youtube.com/embed/bfmFfD2RIcg",
    quizJson: JSON.stringify([
      { q: "Which of the following is an example of structured data?", options: ["A photo album", "A student mark sheet", "A voice recording"], answer: 1 },
      { q: "Why does AI need data?", options: ["To get heavier", "To learn patterns and predict", "To slow down"], answer: 1 }
    ]),
    standard: "S6", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read the summary and note 3 examples", points: 10 },
      { title: "Complete Quiz: Data Types", points: 20 },
      { title: "Final Test: Identify structured vs unstructured data in real life", points: 30 }
    ]
  },
  {
    title: "How Teachable Machine Works",
    description: "Understand the concept of training data and how AI models learn patterns.",
    summary: `**How Does Teachable Machine Work?**\n\nTeachable Machine uses **Machine Learning**.\n\n**Step-by-Step Process:**\n1. **Collect Data**: Give examples (images/sounds)\n2. **Training**: The AI learns the differences\n3. **Prediction**: AI guesses new inputs\n\n**Key Concepts:**\n- **Training Data**: Examples given\n- **Classes**: Categories\n- **Confidence Score**: How sure the AI is`,
    youtubeUrl: "https://www.youtube.com/embed/T2qQGqZxkD0",
    quizJson: JSON.stringify([
      { q: "What is 'training data'?", options: ["Test data", "Examples given to the AI to learn", "Random numbers"], answer: 1 }
    ]),
    standard: "S6", contentType: "THEORY", order: 2,
    tasks: [
      { title: "Read: Training Data explanation", points: 10 },
      { title: "Complete Quiz: How AI Learns", points: 20 },
      { title: "Final Test: Explain training to a friend", points: 30 }
    ]
  },

  // ============================================================
  // STD 7: Data Collection & Algorithms
  // ============================================================
  {
    title: "Collecting & Cleaning Data",
    description: "Learn why data quality matters and how to identify biased data.",
    summary: `**Data Collection & Data Quality**\n\nIn AI, we say: **"Garbage in, garbage out."** If we feed bad data to an AI, it gives bad results.\n\n**Data Cleaning:**\nRemove duplicate entries, fill missing values, fix mistakes.\n\n**Data Bias:**\nBias happens when data does not fairly represent all groups. Biased AI can lead to unfair decisions.`,
    youtubeUrl: "https://www.youtube.com/embed/59bMh59JQDo",
    quizJson: JSON.stringify([
      { q: "What does 'Garbage in, Garbage out' mean?", options: ["AI creates waste", "Bad input data leads to bad output", "AI collects garbage"], answer: 1 }
    ]),
    standard: "S7", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read: Data Collection Methods", points: 10 },
      { title: "Complete Quiz: Bias & Cleaning", points: 20 },
      { title: "Final Test: Clean a sample dataset on paper", points: 30 }
    ]
  },
  {
    title: "Algorithms & Decision Trees",
    description: "Introduction to how algorithms make decisions using data.",
    summary: `**What is an Algorithm?**\n\nA set of step-by-step instructions to solve a problem.\n\n**Decision Trees:**\nAn algorithm that makes decisions using yes/no questions.\n\n**Example — Should I carry an umbrella?**\n- Is it cloudy? → Yes → Is rain predicted? → Yes → Carry umbrella`,
    youtubeUrl: "https://www.youtube.com/embed/7VeUPuFGJHk",
    quizJson: JSON.stringify([
      { q: "What is an algorithm?", options: ["A step-by-step set of instructions", "A chip", "A database"], answer: 0 }
    ]),
    standard: "S7", contentType: "THEORY", order: 2,
    tasks: [
      { title: "Read: What is an Algorithm?", points: 10 },
      { title: "Complete Quiz: Decision Trees", points: 20 },
      { title: "Final Test: Draw a decision tree for your morning routine", points: 30 }
    ]
  },

  // ============================================================
  // STD 8: Intro to ML
  // ============================================================
  {
    title: "Introduction to Machine Learning",
    description: "Types of machine learning and how they work in the real world.",
    summary: `**Types of Machine Learning**\n\n**1. Supervised Learning**: AI learns from labeled examples.\n**2. Unsupervised Learning**: AI finds patterns in unlabeled data.\n**3. Reinforcement Learning**: AI learns by trial and error with rewards.`,
    youtubeUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
    quizJson: JSON.stringify([
      { q: "In Supervised Learning, what are 'labels'?", options: ["The correct answers given during training", "Stickers", "Random points"], answer: 0 }
    ]),
    standard: "S8", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read: ML Types", points: 10 },
      { title: "Complete Quiz: Supervised vs Unsupervised", points: 20 },
      { title: "Final Test: Classify 3 real-world apps into the ML types", points: 30 }
    ]
  },

  // ============================================================
  // STD 9: Data Science + Chatbots
  // ============================================================
  {
    title: "Introduction to Data Science",
    description: "Explore how data drives real-world decisions.",
    summary: `**What is Data Science?**\n\nExtracting insights from data using stats, programming, and knowledge.\n\n**The Process:**\nDefine Problem -> Collect Data -> Clean Data -> Explore (EDA) -> Model -> Evaluate -> Deploy.\n\n**Tools:** Python, Pandas, Scikit-learn.`,
    youtubeUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
    quizJson: JSON.stringify([
      { q: "What is the first step in Data Science?", options: ["Deploy", "Define the Problem", "Build a Model"], answer: 1 }
    ]),
    standard: "S9", contentType: "INTERACTIVE", order: 1,
    tasks: [
      { title: "Read Data Science Process", points: 15 },
      { title: "Complete Quiz: Data Science Basics", points: 20 },
      { title: "Final Test: Write a plan for a new data project", points: 30 }
    ]
  },
  {
    title: "Chatbots & Conversational AI",
    description: "Understand how chatbots work and design your own flow.",
    summary: `**How Do Chatbots Work?**\n\n**1. Rule-Based Chatbots**: Follow pre-written scripts (e.g., press 1 for balance).\n**2. AI-Powered Chatbots (LLMs)**: Understand context (e.g., ChatGPT).\n\n**Technologies**: NLP (Natural Language Processing), Intent Recognition.`,
    youtubeUrl: "https://www.youtube.com/embed/o9-ObGgfpEk",
    quizJson: JSON.stringify([
      { q: "What type of chatbot follows pre-written scripts?", options: ["Rule-Based", "AI-Powered", "Neural"], answer: 0 }
    ]),
    standard: "S9", contentType: "INTERACTIVE", order: 2,
    tasks: [
      { title: "Read Chatbot Types", points: 15 },
      { title: "Complete Quiz: NLP & Intents", points: 20 },
      { title: "Final Test: Design a chatbot flowchart", points: 30 }
    ]
  },

  // ============================================================
  // STD 10: AI Ethics
  // ============================================================
  {
    title: "AI Ethics & Bias",
    description: "Explore fairness, bias, privacy, and accountability.",
    summary: `**AI Ethics — Why It Matters**\n\n**1. Bias & Fairness**: If trained on biased data, AI becomes biased.\n**2. Privacy**: AI needs lots of personal data.\n**3. Accountability**: Who is responsible if AI makes a mistake?\n**4. Transparency**: We need to know how AI makes decisions.`,
    youtubeUrl: "https://www.youtube.com/embed/aGwYtUzMQUk",
    quizJson: JSON.stringify([
      { q: "What causes bias in AI?", options: ["Bad hardware", "Biased training data", "Slow internet"], answer: 1 }
    ]),
    standard: "S10", contentType: "INTERACTIVE", order: 1,
    tasks: [
      { title: "Read AI Ethics", points: 15 },
      { title: "Complete Quiz: Bias & Privacy", points: 20 },
      { title: "Final Test: Write an essay on AI Accountability", points: 40 }
    ]
  },

  // ============================================================
  // STD 11: Deep Learning
  // ============================================================
  {
    title: "Deep Learning Fundamentals",
    description: "Neural networks, layers, and architectures.",
    summary: `**Deep Learning**\n\nUses Artificial Neural Networks with many layers.\n\n- **Input Layer**: Receives data\n- **Hidden Layers**: Extracts features (deep = many layers)\n- **Output Layer**: Makes prediction\n\n**Types**: CNN (Images), RNN (Sequences), Transformers (Text/GenAI).`,
    youtubeUrl: "https://www.youtube.com/embed/aircAruvnKk",
    quizJson: JSON.stringify([
      { q: "What does the 'deep' mean in Deep Learning?", options: ["Ocean depth", "Many hidden layers", "Deep thoughts"], answer: 1 }
    ]),
    standard: "S11", contentType: "ADVANCED_LAB", order: 1,
    tasks: [
      { title: "Read Neural Networks", points: 20 },
      { title: "Complete Quiz: CNN vs RNN", points: 25 },
      { title: "Final Test: Draw a 3-layer architecture", points: 30 }
    ]
  },

  // ============================================================
  // STD 12: Prompt Engineering
  // ============================================================
  {
    title: "Prompt Engineering",
    description: "Master crafting prompts for LLMs.",
    summary: `**Prompt Engineering**\n\nThe art of talking to AI.\n\n**Techniques:**\n- **Zero-Shot**: No examples\n- **Few-Shot**: Give 2-3 examples\n- **Chain-of-Thought (CoT)**: Ask it to think step-by-step\n- **Role Prompting**: Give it a persona.`,
    youtubeUrl: "https://www.youtube.com/embed/1bUy-1hGZpI",
    quizJson: JSON.stringify([
      { q: "What is Few-Shot prompting?", options: ["No examples", "Providing 2-3 examples", "Deleting the AI"], answer: 1 }
    ]),
    standard: "S12", contentType: "ADVANCED_LAB", order: 1,
    tasks: [
      { title: "Read Prompt Techniques", points: 20 },
      { title: "Complete Quiz: Zero vs Few Shot", points: 25 },
      { title: "Final Test: Build a complex CoT prompt", points: 50 }
    ]
  }
];

export async function GET() {
  try {
    await prisma.progress.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.module.deleteMany({});
    
    for (const mod of modules) {
      const { tasks, ...moduleData } = mod;
      await prisma.module.create({
        data: { ...moduleData, tasks: { create: tasks } },
      });
    }
    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
