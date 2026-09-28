import { PrismaClient } from "@prisma/client";
type Standard = "S1"|"S2"|"S3"|"S4"|"S5"|"S6"|"S7"|"S8"|"S9"|"S10"|"S11"|"S12";
type ContentType = "ACTIVITY_LINK"|"THEORY"|"INTERACTIVE"|"ADVANCED_LAB";

// Note: Using DATABASE_URL (transaction pooler) because direct IPv6 connection fails on this network
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

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
      { title: "Draw a sun for the AI to guess", points: 10 },
    ]
  },
  {
    title: "AI Sees What You Draw!",
    description: "How does a computer learn to recognise pictures? Play and find out!",
    summary: "Computers cannot see like we do. Instead, they learn by looking at thousands and thousands of drawings. When you play Quick Draw, you are actually teaching the AI! Every drawing you make helps the computer get better at guessing. Isn't that amazing?",
    youtubeUrl: "https://www.youtube.com/embed/X8v1GWzZYJ4",
    standard: "S2", contentType: "ACTIVITY_LINK", externalUrl: "https://quickdraw.withgoogle.com/", order: 1,
    tasks: [
      { title: "Complete 3 Quick Draw rounds", points: 15 },
      { title: "Try 5 different drawing categories", points: 15 },
      { title: "Draw something the AI got wrong and try again", points: 10 },
    ]
  },
  {
    title: "Teaching Computers to See",
    description: "Play Quick Draw and discover how AI learns from millions of drawings.",
    summary: "Quick Draw by Google uses a special type of AI called a Neural Network. It has learned from over 50 million drawings made by people all over the world! The AI does not just memorize — it learns the pattern of how people draw things. A cat always has pointy ears, a house has a roof — the AI learns these patterns and uses them to guess your drawing!",
    youtubeUrl: "https://www.youtube.com/embed/X8v1GWzZYJ4",
    standard: "S3", contentType: "ACTIVITY_LINK", externalUrl: "https://quickdraw.withgoogle.com/", order: 1,
    tasks: [
      { title: "Complete a full Quick Draw challenge (6 rounds)", points: 20 },
      { title: "Write down 2 things the AI got wrong and why", points: 15 },
      { title: "Try to trick the AI by drawing differently", points: 15 },
    ]
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
      { title: "Train the model with 3 different classes (e.g. rock, paper, scissors)", points: 25 },
      { title: "Test your model and see how accurate it is", points: 20 },
    ]
  },
  {
    title: "Sound & Pose Recognition AI",
    description: "Build a sound or pose classifier using Teachable Machine.",
    summary: "AI can recognise not just images, but also sounds and body poses! With Teachable Machine, you can train it to tell the difference between clapping vs snapping, or standing vs sitting. This technology is used in real life for fitness apps, sign language recognition, and accessibility tools for people with disabilities.",
    youtubeUrl: "https://www.youtube.com/embed/T2qQGqZxkD0",
    standard: "S5", contentType: "ACTIVITY_LINK", externalUrl: "https://teachablemachine.withgoogle.com/", order: 1,
    tasks: [
      { title: "Build a sound classifier (e.g. clap vs snap)", points: 25 },
      { title: "Build a pose classifier (e.g. sitting vs standing)", points: 25 },
      { title: "Combine and demo your model to a friend", points: 30 },
    ]
  },

  // ============================================================
  // STD 6: What is Data + Teachable Machine Theory
  // ============================================================
  {
    title: "What is Data?",
    description: "Understand what data is, where it comes from, and why it matters for AI.",
    summary: `**What is Data?**

Data is any collection of facts, numbers, words, or observations. Everything around us produces data!

**Types of Data:**
- **Structured Data**: Organised in tables — like a student mark sheet (Name, Subject, Score)
- **Unstructured Data**: Not organised — like photos, videos, audio recordings, social media posts

**Where does data come from?**
- Your phone tracks your location, steps, and screen time
- Hospitals store patient records
- Schools record attendance and marks
- Social media collects your likes, shares, and comments

**Why does AI need data?**
AI learns from data the same way you learn from experience. The more examples (data) it sees, the better it gets. Without data, AI cannot learn!

**Key Terms:**
- **Dataset**: A collection of data used for training AI
- **Features**: The properties of data (e.g., height, weight, age)
- **Label**: The answer/category we want to predict`,
    youtubeUrl: "https://www.youtube.com/embed/bfmFfD2RIcg",
    quizJson: JSON.stringify([
      { q: "Which of the following is an example of structured data?", options: ["A photo album", "A student mark sheet with Name, Subject, Score", "A voice recording", "A YouTube video"], answer: 1 },
      { q: "Why does AI need a lot of data?", options: ["To make the computer heavier", "To learn patterns and make accurate predictions", "To slow down processing", "To confuse users"], answer: 1 },
      { q: "What is a 'label' in a dataset?", options: ["A sticker on a product", "The answer or category we want the AI to predict", "The name of the dataset", "A type of chart"], answer: 1 },
      { q: "Which is an example of unstructured data?", options: ["An Excel spreadsheet of marks", "A database of student names", "A social media photo", "A table of temperatures"], answer: 2 },
      { q: "What are 'features' in data?", options: ["Exciting properties of a game", "Properties or attributes used to describe data points", "Labels in a chart", "Types of databases"], answer: 1 },
    ]),
    standard: "S6", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read the summary and note 3 examples of data in your daily life", points: 10 },
      { title: "Complete the quiz: Structured vs Unstructured Data", points: 20 },
    ]
  },
  {
    title: "How Teachable Machine Works",
    description: "Understand the concept of training data and how AI models learn patterns.",
    summary: `**How Does Teachable Machine Work?**

Teachable Machine is powered by **Machine Learning** — a branch of AI where computers learn from examples.

**Step-by-Step Process:**

1. **Collect Training Data**: You show the camera examples of each class (e.g., 50 images of "thumbs up", 50 images of "thumbs down")
2. **Training**: The AI analyses all images and learns what makes each class different
3. **Model**: A mathematical formula is created that can classify new images
4. **Prediction**: When you show a new image, the model predicts which class it belongs to

**Key Concepts:**
- **Training Data**: The examples you give to teach the AI
- **Classes**: The categories the AI learns to tell apart
- **Confidence Score**: How sure the AI is about its prediction (e.g., 95% thumbs up)
- **Overfitting**: When AI memorizes training data but fails on new data

**Real World Uses:**
- Face recognition (unlock your phone)
- Medical imaging (detect cancer in X-rays)
- Self-driving cars (recognise road signs)`,
    youtubeUrl: "https://www.youtube.com/embed/T2qQGqZxkD0",
    quizJson: JSON.stringify([
      { q: "What is 'training data'?", options: ["Data used to test the final model", "Examples given to the AI to learn from", "A type of database", "Random numbers"], answer: 1 },
      { q: "What does a 'confidence score' mean in AI?", options: ["How fast the computer is", "How sure the AI is about its prediction", "The size of the dataset", "The number of classes"], answer: 1 },
      { q: "What is 'overfitting'?", options: ["When AI performs perfectly on new data", "When AI memorizes training data but fails on new data", "When data is too large", "When classes overlap"], answer: 1 },
      { q: "In Teachable Machine, what are 'classes'?", options: ["School classrooms", "Categories the AI learns to differentiate", "Layers in a neural network", "Types of hardware"], answer: 1 },
    ]),
    standard: "S6", contentType: "THEORY", order: 2,
    tasks: [
      { title: "Read: Training Data & Labels explanation", points: 10 },
      { title: "Complete the quiz on how AI learns", points: 20 },
    ]
  },

  // ============================================================
  // STD 7: Data Collection & Algorithms
  // ============================================================
  {
    title: "Collecting & Cleaning Data",
    description: "Learn why data quality matters and how to identify biased data.",
    summary: `**Data Collection & Data Quality**

In AI, we say: **"Garbage in, garbage out."** If we feed bad data to an AI, it gives bad results.

**Methods of Data Collection:**
- **Surveys & Forms**: Questionnaires filled by people
- **Sensors**: Weather stations, fitness trackers
- **Web Scraping**: Automatically collecting data from websites
- **Cameras & Microphones**: Images and audio data
- **Transactional Records**: Bank payments, online purchases

**Data Cleaning:**
Before using data, we must clean it:
- Remove duplicate entries
- Fill in missing values
- Fix spelling mistakes
- Remove irrelevant columns

**Data Bias:**
Bias happens when data does not fairly represent all groups. 

**Example:** An AI trained to recognise faces using only photos of one skin tone will perform poorly on others. This is called **Representation Bias**.

**Why it matters:** Biased AI can lead to unfair decisions in hiring, loans, and healthcare.`,
    youtubeUrl: "https://www.youtube.com/embed/59bMh59JQDo",
    quizJson: JSON.stringify([
      { q: "What does 'Garbage in, Garbage out' mean in AI?", options: ["AI creates waste", "Bad input data leads to bad AI output", "AI collects garbage data", "Data is always wrong"], answer: 1 },
      { q: "Which of these is a data cleaning step?", options: ["Adding more computers", "Removing duplicate entries", "Making the dataset smaller", "Hiding the data"], answer: 1 },
      { q: "What is 'Representation Bias'?", options: ["When data represents all groups equally", "When data unfairly favours certain groups over others", "A type of chart", "A cleaning technique"], answer: 1 },
      { q: "Which is an example of data collected by sensors?", options: ["A student essay", "A weather station recording temperature", "A phone call recording", "A survey response"], answer: 1 },
    ]),
    standard: "S7", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read: Data Collection Methods summary", points: 10 },
      { title: "Activity: Identify 3 examples of biased data in real life", points: 20 },
      { title: "Complete the data quality quiz", points: 20 },
    ]
  },
  {
    title: "Algorithms & Decision Trees",
    description: "Introduction to how algorithms make decisions using data.",
    summary: `**What is an Algorithm?**

An algorithm is a set of step-by-step instructions to solve a problem. Every computer program, every AI model runs on algorithms.

**Example Algorithm — Making Tea:**
1. Boil water
2. Add tea leaves
3. Wait 3 minutes
4. Add milk and sugar
5. Serve

**Decision Trees:**
A Decision Tree is an algorithm that makes decisions using a series of yes/no questions.

**Example — Should I carry an umbrella?**
- Is it cloudy? → Yes → Is rain predicted? → Yes → **Carry umbrella**
- Is it cloudy? → No → **Don't carry umbrella**

**Decision Trees in AI:**
- Used to classify emails as spam or not spam
- Diagnose diseases based on symptoms
- Decide loan approval based on credit score

**Key Terms:**
- **Root Node**: The first question/decision
- **Branches**: The yes/no paths
- **Leaf Node**: The final answer/prediction`,
    youtubeUrl: "https://www.youtube.com/embed/7VeUPuFGJHk",
    quizJson: JSON.stringify([
      { q: "What is an algorithm?", options: ["A type of computer chip", "A step-by-step set of instructions to solve a problem", "A database of numbers", "A programming language"], answer: 1 },
      { q: "What is a Decision Tree?", options: ["A tree planted in a computer lab", "An algorithm that makes decisions using yes/no questions", "A chart of student decisions", "A type of neural network"], answer: 1 },
      { q: "What is a 'Leaf Node' in a decision tree?", options: ["The first question", "A branch of choices", "The final answer or prediction", "A type of data"], answer: 2 },
      { q: "Which is a real-world use of Decision Trees?", options: ["Deciding lunch menu", "Spam email classification", "Playing video games", "Drawing pictures"], answer: 1 },
    ]),
    standard: "S7", contentType: "THEORY", order: 2,
    tasks: [
      { title: "Read: What is an Algorithm?", points: 10 },
      { title: "Draw a decision tree for a daily decision (e.g. what to wear)", points: 20 },
      { title: "Complete the algorithms quiz", points: 20 },
    ]
  },
  {
    title: "Introduction to Machine Learning",
    description: "Types of machine learning and how they work in the real world.",
    summary: `**Types of Machine Learning**

**1. Supervised Learning**
The AI learns from labeled examples.
- Example: Show 1000 cat photos (labeled "cat") and 1000 dog photos (labeled "dog") → AI learns to tell them apart
- Used for: Image recognition, spam detection, weather prediction

**2. Unsupervised Learning**
The AI finds patterns in unlabeled data on its own.
- Example: Show 1000 customer shopping records → AI groups similar customers together (clustering)
- Used for: Customer segmentation, anomaly detection

**3. Reinforcement Learning**
The AI learns by trial and error, getting rewards for correct actions.
- Example: AI plays a game, scores points for winning moves, and loses points for bad moves
- Used for: Game AI (AlphaGo), robotics, self-driving cars

**Comparison:**
| Type | Has Labels? | Learns by... |
|------|------------|-------------|
| Supervised | Yes | Examples |
| Unsupervised | No | Finding patterns |
| Reinforcement | No labels, but rewards | Trial & Error |`,
    youtubeUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
    quizJson: JSON.stringify([
      { q: "In Supervised Learning, what are 'labels'?", options: ["Stickers on computers", "The correct answers given to the AI during training", "Random data points", "Types of models"], answer: 1 },
      { q: "Which type of ML groups similar customers together?", options: ["Supervised Learning", "Reinforcement Learning", "Unsupervised Learning", "Deep Learning"], answer: 2 },
      { q: "AlphaGo (the chess-playing AI) uses which type of ML?", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Rule-based AI"], answer: 2 },
      { q: "What does Supervised Learning require that Unsupervised does not?", options: ["More computers", "Labeled training data", "A reward system", "A decision tree"], answer: 1 },
    ]),
    standard: "S8", contentType: "THEORY", order: 1,
    tasks: [
      { title: "Read: Types of Machine Learning summary", points: 10 },
      { title: "Match each ML type to a real-world example (activity)", points: 20 },
      { title: "Complete the ML types quiz", points: 20 },
    ]
  },

  // ============================================================
  // STD 9: Data Science + Chatbots
  // ============================================================
  {
    title: "Introduction to Data Science",
    description: "Explore how data drives real-world decisions in business, health, and government.",
    summary: `**What is Data Science?**

Data Science is the process of extracting useful knowledge and insights from data using statistics, programming, and domain knowledge.

**The Data Science Process:**
1. **Define the Problem**: What question do we want to answer?
2. **Collect Data**: Gather relevant data from various sources
3. **Clean Data**: Remove errors, handle missing values
4. **Explore Data (EDA)**: Visualise and understand patterns
5. **Model**: Apply ML algorithms to predict or classify
6. **Evaluate**: Test accuracy and performance
7. **Deploy**: Use the model in a real application
8. **Monitor**: Check if the model stays accurate over time

**Key Tools in Data Science:**
- **Python**: Most popular language for data science
- **Pandas**: Library for data manipulation
- **Matplotlib/Seaborn**: Data visualisation
- **Scikit-learn**: Machine learning library

**Real-world Impact:**
- Netflix recommends movies using your watch history
- Hospitals predict disease risk from patient data
- Banks detect fraud from transaction patterns
- Weather apps forecast rain using satellite data`,
    youtubeUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
    quizJson: JSON.stringify([
      { q: "What is the first step in the Data Science process?", options: ["Collect Data", "Define the Problem", "Build a Model", "Deploy"], answer: 1 },
      { q: "What does EDA stand for?", options: ["Electronic Data Analysis", "Exploratory Data Analysis", "Experimental Design Algorithm", "Extended Data Application"], answer: 1 },
      { q: "Which Python library is used for data manipulation?", options: ["NumPy", "Flask", "Pandas", "Django"], answer: 2 },
      { q: "How does Netflix decide what to recommend to you?", options: ["Random selection", "Your subscription plan", "Data Science using your watch history", "Alphabetical order"], answer: 2 },
      { q: "What does 'deploying a model' mean?", options: ["Deleting the model", "Using the trained model in a real application", "Printing the model", "Training more data"], answer: 1 },
    ]),
    standard: "S9", contentType: "INTERACTIVE", order: 1,
    tasks: [
      { title: "Read the Data Science process summary", points: 15 },
      { title: "Complete the Data Science concepts quiz", points: 25 },
      { title: "List 3 real-world applications of Data Science in India", points: 20 },
    ]
  },
  {
    title: "Chatbots & Conversational AI",
    description: "Understand how chatbots work and design your own rule-based chatbot flow.",
    summary: `**How Do Chatbots Work?**

A chatbot is a computer program that simulates human conversation. There are two main types:

**1. Rule-Based Chatbots**
Follow pre-written scripts and decision trees.
- Example: Bank customer service bot
- If user says "check balance" → respond with "Please enter your account number"
- Simple but cannot handle unexpected inputs

**2. AI-Powered Chatbots (LLMs)**
Use Large Language Models (like ChatGPT) trained on billions of text examples.
- Can understand context and generate natural responses
- Handle open-ended conversations
- Examples: ChatGPT, Gemini, Claude, Siri, Alexa

**Key Technologies:**
- **NLP (Natural Language Processing)**: Helps computers understand human language
- **Intent Recognition**: Identifying what the user wants
- **Entity Extraction**: Pulling out key information (name, date, location)
- **Dialogue Management**: Keeping track of conversation context

**Real-World Chatbots:**
- Customer service (Swiggy, Zomato support)
- Health symptom checkers
- Educational tutors
- Government helplines (DigiYatra)`,
    youtubeUrl: "https://www.youtube.com/embed/o9-ObGgfpEk",
    quizJson: JSON.stringify([
      { q: "What type of chatbot follows pre-written scripts?", options: ["AI-Powered Chatbot", "Rule-Based Chatbot", "Neural Chatbot", "Deep Learning Bot"], answer: 1 },
      { q: "What does NLP stand for?", options: ["Neural Learning Process", "Natural Language Processing", "Network Logic Protocol", "Numeric Learning Program"], answer: 1 },
      { q: "What is 'Intent Recognition' in chatbots?", options: ["Recognising the user's face", "Identifying what the user wants from their message", "Counting words in a sentence", "Translating languages"], answer: 1 },
      { q: "Which of these is an AI-powered chatbot?", options: ["A vending machine", "A calculator", "ChatGPT", "A TV remote"], answer: 2 },
      { q: "What is 'Entity Extraction'?", options: ["Deleting data from a database", "Pulling key information like name, date from text", "Categorising images", "Training a model"], answer: 1 },
    ]),
    standard: "S9", contentType: "INTERACTIVE", order: 2,
    tasks: [
      { title: "Read: How Chatbots Work summary", points: 15 },
      { title: "Design a chatbot flow diagram for a school helpdesk", points: 25 },
      { title: "Complete the Chatbots quiz", points: 20 },
    ]
  },

  // ============================================================
  // STD 10: AI Ethics & Bias
  // ============================================================
  {
    title: "AI Ethics & Bias",
    description: "Explore fairness, bias, privacy, and accountability in AI systems.",
    summary: `**AI Ethics — Why It Matters**

As AI becomes more powerful, it is important to ensure it is fair, transparent, and safe for everyone.

**Key Ethical Issues in AI:**

**1. Bias & Fairness**
AI learns from historical data. If that data reflects past inequalities, the AI inherits those biases.
- **Example**: Amazon's AI hiring tool penalised resumes with the word "women's" because it learned from 10 years of male-dominated tech hiring data.

**2. Privacy**
AI systems collect and analyse vast amounts of personal data.
- Your phone, social media, and shopping habits are constantly monitored.
- **Question**: Do you know what data apps collect from you?

**3. Transparency & Explainability**
Some AI models are "black boxes" — we cannot explain why they made a decision.
- **Example**: A loan rejection by AI may give no reason.

**4. Accountability**
If an AI makes a wrong decision (like a self-driving car accident), who is responsible? The company? The engineer? The user?

**5. Surveillance & Autonomy**
Facial recognition used by governments can be used for mass surveillance, limiting freedom.

**AI Ethics Principles (Google's Guidelines):**
- Be socially beneficial
- Avoid creating unfair bias
- Be built and tested for safety
- Be accountable to people
- Uphold high standards of privacy`,
    youtubeUrl: "https://www.youtube.com/embed/aGwYtUzMQUk",
    quizJson: JSON.stringify([
      { q: "Amazon's AI hiring tool had bias against women because:", options: ["Women cannot code", "It was trained on data where most hires were male", "Women did not apply", "The algorithm was broken"], answer: 1 },
      { q: "What is a 'Black Box' AI?", options: ["An AI painted black", "An AI model where decisions cannot be explained", "A hardware device", "A secure AI"], answer: 1 },
      { q: "If a self-driving car causes an accident, who is accountable?", options: ["The road", "Nobody", "This is an open ethical debate", "The passenger"], answer: 2 },
      { q: "Which AI principle means the AI should work well for all groups of people?", options: ["Privacy", "Fairness & Avoiding Bias", "Speed", "Transparency"], answer: 1 },
      { q: "What is 'mass surveillance' in the context of AI?", options: ["Counting website visitors", "Using AI to monitor large populations without their consent", "AI safety testing", "Data backup systems"], answer: 1 },
    ]),
    standard: "S10", contentType: "INTERACTIVE", order: 1,
    tasks: [
      { title: "Read the AI Ethics summary", points: 15 },
      { title: "Case Study: Research one real AI bias incident and write a paragraph", points: 25 },
      { title: "Complete the AI Ethics quiz", points: 20 },
      { title: "Write your own 'AI Ethics Pledge' — 5 principles you believe in", points: 20 },
    ]
  },

  // ============================================================
  // STD 11: Deep Learning + ML with Real Datasets
  // ============================================================
  {
    title: "Deep Learning Fundamentals",
    description: "Neural networks, layers, activation functions, and how deep learning achieves superhuman performance.",
    summary: `**Deep Learning — The Engine of Modern AI**

Deep Learning is a subset of Machine Learning that uses **Artificial Neural Networks (ANNs)** with many layers to learn complex patterns.

**How a Neural Network Works:**
- **Input Layer**: Receives raw data (e.g., pixels of an image)
- **Hidden Layers**: Each layer extracts more complex features
  - Layer 1: Detects edges and lines
  - Layer 2: Detects shapes (circles, squares)
  - Layer 3: Detects objects (eyes, wheels)
- **Output Layer**: Makes the final prediction (cat vs dog)

**Key Concepts:**
- **Weights**: Numbers that the network adjusts during learning
- **Activation Functions**: Decide if a neuron should "fire" (ReLU, Sigmoid, Softmax)
- **Backpropagation**: The process of adjusting weights based on errors
- **Gradient Descent**: The algorithm that minimises prediction errors
- **Epoch**: One complete pass through the entire training dataset
- **Batch Size**: Number of training examples used in one step

**Types of Neural Networks:**
- **CNN (Convolutional Neural Network)**: Best for images
- **RNN (Recurrent Neural Network)**: Best for sequences (text, audio)
- **Transformer**: Used in LLMs like GPT-4 and Gemini

**Why "Deep"?**
The "deep" in Deep Learning refers to the many hidden layers (sometimes hundreds) that allow the model to learn very complex representations.`,
    youtubeUrl: "https://www.youtube.com/embed/aircAruvnKk",
    quizJson: JSON.stringify([
      { q: "What does the 'deep' in Deep Learning refer to?", options: ["Deep thinking by computers", "Many hidden layers in a neural network", "Deep sea data", "High computing power"], answer: 1 },
      { q: "What is Backpropagation?", options: ["Going back to collect more data", "The process of adjusting weights based on prediction errors", "A type of activation function", "Running the model backwards"], answer: 1 },
      { q: "Which neural network type is best suited for image recognition?", options: ["RNN", "Transformer", "CNN (Convolutional Neural Network)", "Decision Tree"], answer: 2 },
      { q: "What is an 'Epoch' in deep learning?", options: ["A type of layer", "An activation function", "One complete pass through the training dataset", "A debugging tool"], answer: 2 },
      { q: "What does the ReLU activation function do?", options: ["Returns the input if positive, else 0", "Multiplies all values by 2", "Normalises data to 0-1", "Deletes negative weights"], answer: 0 },
    ]),
    standard: "S11", contentType: "ADVANCED_LAB", order: 1,
    tasks: [
      { title: "Read: Neural Networks & Deep Learning summary", points: 20 },
      { title: "Build a simple neural network in Teachable Machine and experiment with epoch count", points: 30 },
      { title: "Complete the Deep Learning quiz", points: 25 },
    ]
  },
  {
    title: "Machine Learning with Real Datasets",
    description: "Apply supervised ML techniques and evaluate model performance with real-world datasets.",
    summary: `**Applying Machine Learning to Real Data**

**The ML Pipeline:**
1. Load Dataset (e.g., Iris, MNIST, Titanic)
2. Explore & Visualise (understand distributions)
3. Preprocess (normalise, encode categories)
4. Split: Training set (80%) + Test set (20%)
5. Choose Algorithm (Logistic Regression, Random Forest, SVM)
6. Train the Model
7. Evaluate Performance

**Evaluation Metrics:**
- **Accuracy**: What % of predictions are correct?
- **Precision**: Of all "positive" predictions, how many were actually positive?
- **Recall**: Of all actual positives, how many did the model find?
- **F1 Score**: Harmonic mean of Precision and Recall
- **Confusion Matrix**: Table showing True/False Positives and Negatives

**Common Algorithms:**
| Algorithm | Best For |
|-----------|----------|
| Linear Regression | Predicting a number (e.g., house price) |
| Logistic Regression | Binary classification (yes/no) |
| Random Forest | Complex classification with many features |
| K-Means | Clustering (unsupervised) |
| SVM | High-dimensional data |

**Overfitting vs Underfitting:**
- **Overfitting**: Model memorises training data, fails on new data
- **Underfitting**: Model is too simple, fails on both
- **Solution**: Cross-validation, regularisation, more diverse data`,
    youtubeUrl: "https://www.youtube.com/embed/Gv9_4yMHFhI",
    quizJson: JSON.stringify([
      { q: "What is the typical training/test split ratio?", options: ["50/50", "90/10", "80/20", "70/10"], answer: 2 },
      { q: "What does 'Recall' measure?", options: ["How accurate the model is overall", "Of all actual positives, how many the model correctly identified", "How fast the model trains", "The size of the dataset"], answer: 1 },
      { q: "Which algorithm is best for predicting a numerical value like house price?", options: ["K-Means", "Logistic Regression", "Linear Regression", "Decision Tree"], answer: 2 },
      { q: "What is 'Overfitting'?", options: ["Model performs well on all data", "Model is too complex and memorises training data but fails on new data", "Model is too simple", "Model uses too many features"], answer: 1 },
      { q: "What does a Confusion Matrix show?", options: ["Why students are confused", "A table of True/False Positives and Negatives", "Types of algorithms", "Layers of a neural network"], answer: 1 },
    ]),
    standard: "S11", contentType: "ADVANCED_LAB", order: 2,
    tasks: [
      { title: "Read: ML Pipeline & Evaluation Metrics", points: 20 },
      { title: "Analyse a sample dataset and calculate accuracy manually", points: 30 },
      { title: "Complete the ML evaluation quiz", points: 25 },
    ]
  },

  // ============================================================
  // STD 12: Prompt Engineering + Neural Network Research
  // ============================================================
  {
    title: "Prompt Engineering",
    description: "Master the art of crafting prompts to get precise, useful outputs from Large Language Models.",
    summary: `**Prompt Engineering — The New Skill of the AI Era**

A **prompt** is the instruction or question you give to an AI model like GPT-4, Gemini, or Claude. The quality of your output depends heavily on the quality of your prompt.

**Prompting Techniques:**

**1. Zero-Shot Prompting**
Ask the AI without giving any examples.
- Example: "Translate this sentence to Tamil: 'The sky is blue.'"

**2. Few-Shot Prompting**
Give the AI 2-3 examples before asking it to do the task.
- Example: "Positive: I love this product! → Positive sentiment. Negative: This is terrible! → Negative sentiment. What about: 'It was okay I guess'?"

**3. Chain-of-Thought (CoT) Prompting**
Ask the AI to think step by step.
- Example: "Solve this problem step by step: If a train travels 60 km/h for 2 hours..."

**4. Role Prompting**
Give the AI a persona to adopt.
- Example: "You are an expert Tamil Nadu history professor. Explain the Chola dynasty to a 10-year-old."

**5. Structured Output Prompting**
Ask AI to respond in a specific format (JSON, table, list).
- Example: "Extract the name, age, and city from this text and return as JSON."

**Best Practices:**
- Be specific and clear
- Provide context
- Use examples when needed
- Specify the output format
- Iterate and refine your prompts`,
    youtubeUrl: "https://www.youtube.com/embed/1bUy-1hGZpI",
    quizJson: JSON.stringify([
      { q: "What is 'Zero-Shot Prompting'?", options: ["Giving 0 tokens to the AI", "Asking the AI without providing any examples", "A failed prompt", "Prompting with 0 context"], answer: 1 },
      { q: "What does 'Chain-of-Thought' prompting do?", options: ["Chains multiple AIs together", "Asks the AI to reason step by step", "Connects prompts to databases", "Links multiple outputs"], answer: 1 },
      { q: "You want the AI to respond in JSON format. Which technique should you use?", options: ["Few-Shot Prompting", "Role Prompting", "Structured Output Prompting", "Zero-Shot Prompting"], answer: 2 },
      { q: "What is 'Role Prompting'?", options: ["Asking AI about job roles", "Giving the AI a persona or expert role to adopt", "A type of error", "Training a new model"], answer: 1 },
      { q: "Which prompting technique provides 2-3 examples before the actual question?", options: ["Zero-Shot", "Chain-of-Thought", "Few-Shot", "Role Prompting"], answer: 2 },
    ]),
    standard: "S12", contentType: "ADVANCED_LAB", externalUrl: "https://ai.google.dev/gemini-api/docs/prompting-strategies", order: 1,
    tasks: [
      { title: "Read: 5 Prompting Techniques summary", points: 20 },
      { title: "Practice: Write a Zero-Shot, Few-Shot, and CoT prompt for the same task", points: 35 },
      { title: "Complete the Prompt Engineering quiz", points: 25 },
      { title: "Build a structured output prompt that returns JSON", points: 30 },
    ]
  },
  {
    title: "Neural Network Architectures & Research",
    description: "CNN, RNN, Transformers — deep dive into modern architectures and the attention mechanism.",
    summary: `**Modern Neural Network Architectures**

**1. CNN — Convolutional Neural Network**
Designed for grid-like data (images).
- Uses **filters/kernels** to detect features in images
- **Pooling layers** reduce dimensions
- Used in: Image classification, object detection, medical imaging, self-driving cars
- Famous models: ResNet, VGG, EfficientNet

**2. RNN — Recurrent Neural Network**
Designed for sequential data (time series, text).
- Has a "memory" — output of previous step feeds into next step
- Problem: Vanishing gradient over long sequences
- Solution: **LSTM (Long Short-Term Memory)** and **GRU (Gated Recurrent Unit)**

**3. Transformer Architecture**
The foundation of modern AI (GPT, Gemini, BERT).
- **Self-Attention Mechanism**: Each word attends to every other word in context
- **Positional Encoding**: Preserves word order information
- **Multi-Head Attention**: Multiple attention patterns simultaneously
- Does not process sequentially — processes all tokens in parallel (much faster!)

**The Attention Mechanism (simplified):**
"The animal didn't cross the street because **it** was too tired."
What does "it" refer to? Attention allows the AI to look at "animal" and understand the connection.

**Landmark Models:**
| Model | Type | Created By |
|-------|------|-----------|
| GPT-4 | Transformer (LLM) | OpenAI |
| Gemini | Transformer (LLM) | Google |
| BERT | Transformer (NLP) | Google |
| ResNet | CNN | Microsoft |
| AlphaFold | Transformer | DeepMind |`,
    youtubeUrl: "https://www.youtube.com/embed/ySEx_Bqxvvo",
    quizJson: JSON.stringify([
      { q: "Which neural network architecture is best for image recognition?", options: ["RNN", "LSTM", "CNN (Convolutional Neural Network)", "GRU"], answer: 2 },
      { q: "What problem do RNNs face with long sequences?", options: ["Too much memory", "Vanishing gradient problem", "Slow training on images", "Lack of attention mechanism"], answer: 1 },
      { q: "What is the key innovation in the Transformer architecture?", options: ["Convolutional filters", "Recurrent connections", "Self-Attention Mechanism", "Pooling layers"], answer: 2 },
      { q: "Which of these is a Transformer-based Large Language Model?", options: ["ResNet", "AlexNet", "GPT-4", "VGG-16"], answer: 2 },
      { q: "What does LSTM stand for?", options: ["Large Scale Training Model", "Long Short-Term Memory", "Layered Sequential Training Method", "Latent Space Training Module"], answer: 1 },
    ]),
    standard: "S12", contentType: "ADVANCED_LAB", order: 2,
    tasks: [
      { title: "Read: CNN, RNN, and Transformer architecture summary", points: 25 },
      { title: "Compare CNN vs Transformer — write 5 key differences", points: 30 },
      { title: "Complete the Neural Architecture quiz", points: 25 },
      { title: "Final Project: Present one landmark AI model and its impact", points: 50 },
    ]
  },
];

async function main() {
  console.log("Deleting existing modules and tasks...");
  await prisma.progress.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.module.deleteMany({});
  console.log("Old modules deleted.");

  // Helper to get target count based on standard
  const getTargetCount = (std: string) => {
    const num = parseInt(std.replace("S", ""));
    if (num >= 1 && num <= 3) return 10;
    if (num >= 4 && num <= 5) return 15;
    return 20; // 6 to 12
  };

  // Helper pools for generic questions
  const genericQuestions = [
    { q: "What is the primary goal of this activity?", options: ["To learn and explore", "To memorize facts", "To take a nap", "To skip classes"], answer: 0 },
    { q: "How does AI learn?", options: ["By sleeping", "From patterns in data", "By eating cables", "From magic"], answer: 1 },
    { q: "Which of these is a good practice when testing AI models?", options: ["Use only one example", "Give it diverse and varied data", "Turn off the screen", "Delete the code"], answer: 1 },
    { q: "Why is data important for Artificial Intelligence?", options: ["It powers the learning process", "It is used to paint pictures", "It makes computers heavy", "It does not matter"], answer: 0 },
    { q: "What is the best way to improve an AI model's accuracy?", options: ["Provide more quality training data", "Make the computer hotter", "Use fewer examples", "Rename the files"], answer: 0 },
    { q: "True or False: AI can recognize patterns faster than humans in large datasets.", options: ["True", "False", "Only on Sundays", "Not sure"], answer: 0 },
    { q: "What happens if we train an AI with biased data?", options: ["It becomes perfect", "It makes biased and unfair predictions", "It stops working", "It fixes the bias automatically"], answer: 1 },
    { q: "Can an AI learn without any data at all?", options: ["Yes, always", "No, it requires data to learn", "Sometimes", "Only if it is smart"], answer: 1 },
  ];

  for (let mod of modules) {
    const targetCount = getTargetCount(mod.standard);
    
    // 1. Expand Tasks
    while (mod.tasks.length < targetCount) {
      mod.tasks.push({
        title: `Challenge ${mod.tasks.length + 1}: Practice and Explore further concepts in ${mod.title}`,
        points: 10 + Math.floor(Math.random() * 10)
      });
    }

    // 2. Expand Quizzes
    let quizArray = [];
    if (mod.quizJson) {
      try { quizArray = JSON.parse(mod.quizJson); } catch (e) {}
    } else {
      // For S1-S5 which might not have a quiz initially
      quizArray = [
        { q: `What did you learn from ${mod.title}?`, options: ["New AI Concepts", "Nothing", "Just clicked around", "Not sure"], answer: 0 }
      ];
    }

    while (quizArray.length < targetCount) {
      const qTemplate = genericQuestions[quizArray.length % genericQuestions.length];
      quizArray.push({
        q: `Q${quizArray.length + 1}: ${qTemplate.q}`,
        options: qTemplate.options,
        answer: qTemplate.answer
      });
    }
    
    mod.quizJson = JSON.stringify(quizArray);

    const { tasks, ...moduleData } = mod;
    const created = await prisma.module.create({
      data: { ...moduleData, tasks: { create: tasks } },
    });
    console.log(`✓ Created: ${created.title} (${created.standard}) - Tasks: ${tasks.length}, Quizzes: ${quizArray.length}`);
  }
  console.log("\n🎉 Module seeding complete! Total:", modules.length, "modules.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
