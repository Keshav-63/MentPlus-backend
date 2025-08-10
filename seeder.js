import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "./models/question.model.js";

dotenv.config();

const questions = [
  // --- Programming Questions ---
  {
    domain: "programming",
    questionText:
      "What is the time complexity of accessing an element in a hash table in the average case?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctOptionIndex: 0,
  },
  {
    domain: "programming",
    questionText:
      "Which of the following is NOT a principle of Object-Oriented Programming?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    correctOptionIndex: 3,
  },
  {
    domain: "programming",
    questionText:
      "In C++, what does the 'virtual' keyword do when used with a function?",
    options: [
      "Makes the function private",
      "Enables function overloading",
      "Enables dynamic polymorphism",
      "Makes the function static",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText: "What is the difference between '==' and 'equals()' in Java?",
    options: [
      "No difference",
      "== compares references, equals() compares content",
      "== compares content, equals() compares references",
      "Both compare references only",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "programming",
    questionText: "Which design pattern ensures a class has only one instance?",
    options: [
      "Factory Pattern",
      "Observer Pattern",
      "Singleton Pattern",
      "Strategy Pattern",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText: "What is the purpose of a destructor in C++?",
    options: [
      "To create objects",
      "To initialize objects",
      "To clean up resources when object is destroyed",
      "To copy objects",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText:
      "In Java, which collection maintains insertion order and allows duplicates?",
    options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText: "What is method overriding in OOP?",
    options: [
      "Having multiple methods with same name but different parameters",
      "Redefining a method in derived class",
      "Creating private methods",
      "Using static methods",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "programming",
    questionText:
      "Which of the following is true about abstract classes in Java?",
    options: [
      "Can be instantiated",
      "Cannot have constructors",
      "Can have both abstract and concrete methods",
      "Cannot be inherited",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText: "What is the difference between stack and heap memory?",
    options: [
      "No difference",
      "Stack is for objects, heap is for primitives",
      "Stack is for local variables, heap is for objects",
      "Stack is slower than heap",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "programming",
    questionText: "In C++, what is RAII?",
    options: [
      "Resource Acquisition Is Initialization",
      "Random Access Iterator Interface",
      "Runtime Application Interface",
      "Recursive Algorithm Implementation",
    ],
    correctOptionIndex: 0,
  },
  {
    domain: "programming",
    questionText: "What is the purpose of the 'final' keyword in Java?",
    options: [
      "To make methods faster",
      "To prevent inheritance/modification",
      "To enable garbage collection",
      "To create static methods",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "programming",
    questionText:
      "Which sorting algorithm has the best worst-case time complexity?",
    options: ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
    correctOptionIndex: 1,
  },
  {
    domain: "programming",
    questionText: "What is polymorphism in OOP?",
    options: [
      "Having multiple classes",
      "Ability of objects to take multiple forms",
      "Creating multiple objects",
      "Using multiple inheritance",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "programming",
    questionText: "In Java, what happens if you don't provide a constructor?",
    options: [
      "Compilation error",
      "Runtime error",
      "Default constructor is provided",
      "Class cannot be instantiated",
    ],
    correctOptionIndex: 2,
  },

  // --- AI/ML Questions ---
  {
    domain: "aiml",
    questionText:
      "What is the vanishing gradient problem in deep neural networks?",
    options: [
      "Gradients become too large",
      "Gradients become very small in early layers",
      "Gradients disappear completely",
      "Gradients become negative",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText:
      "Which activation function is most commonly used in hidden layers of modern neural networks?",
    options: ["Sigmoid", "Tanh", "ReLU", "Linear"],
    correctOptionIndex: 2,
  },
  {
    domain: "aiml",
    questionText: "What is the purpose of dropout in neural networks?",
    options: [
      "To increase training speed",
      "To prevent overfitting",
      "To reduce model size",
      "To improve accuracy",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "In supervised learning, what is cross-validation used for?",
    options: [
      "Feature selection",
      "Model evaluation and selection",
      "Data preprocessing",
      "Hyperparameter initialization",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is the difference between bagging and boosting?",
    options: [
      "No difference",
      "Bagging trains models in parallel, boosting trains sequentially",
      "Bagging is for regression, boosting for classification",
      "Bagging uses decision trees, boosting uses neural networks",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is the curse of dimensionality?",
    options: [
      "Too many features make algorithms slow",
      "High-dimensional spaces become sparse",
      "Models become too complex",
      "Data becomes corrupted",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText:
      "Which loss function is typically used for multi-class classification?",
    options: [
      "Mean Squared Error",
      "Binary Cross-Entropy",
      "Categorical Cross-Entropy",
      "Hinge Loss",
    ],
    correctOptionIndex: 2,
  },
  {
    domain: "aiml",
    questionText: "What is the purpose of batch normalization?",
    options: [
      "To normalize input data",
      "To normalize activations within network layers",
      "To reduce batch size",
      "To improve gradient flow",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText:
      "In reinforcement learning, what is the exploration vs exploitation dilemma?",
    options: [
      "Choosing between different algorithms",
      "Balancing trying new actions vs using known good actions",
      "Selecting features vs selecting models",
      "Training vs testing",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is transfer learning?",
    options: [
      "Moving data between systems",
      "Using pre-trained models for new tasks",
      "Converting between model formats",
      "Transferring knowledge between humans",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is the difference between precision and recall?",
    options: [
      "No difference",
      "Precision is TP/(TP+FP), Recall is TP/(TP+FN)",
      "Precision is for regression, recall for classification",
      "Precision is accuracy, recall is error rate",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText:
      "What is a convolutional neural network (CNN) primarily used for?",
    options: [
      "Text processing",
      "Image processing",
      "Time series analysis",
      "Tabular data",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is the purpose of pooling layers in CNNs?",
    options: [
      "To increase image size",
      "To reduce spatial dimensions and computation",
      "To add more features",
      "To improve color accuracy",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText: "What is gradient descent?",
    options: [
      "A type of neural network",
      "An optimization algorithm to minimize loss",
      "A data preprocessing technique",
      "A model evaluation metric",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "aiml",
    questionText:
      "What is the difference between supervised and unsupervised learning?",
    options: [
      "Supervised uses labeled data, unsupervised doesn't",
      "Supervised is faster than unsupervised",
      "Supervised uses more data",
      "No significant difference",
    ],
    correctOptionIndex: 0,
  },

  // --- Cybersecurity Questions ---
  {
    domain: "cybersecurity",
    questionText: "What is the primary purpose of a firewall?",
    options: [
      "To encrypt data",
      "To control network traffic based on rules",
      "To detect malware",
      "To backup data",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What does CIA stand for in information security?",
    options: [
      "Central Intelligence Agency",
      "Confidentiality, Integrity, Availability",
      "Computer Information Access",
      "Cyber Intelligence Analysis",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is a zero-day vulnerability?",
    options: [
      "A vulnerability that takes zero days to exploit",
      "A vulnerability unknown to security vendors",
      "A vulnerability that causes zero damage",
      "A vulnerability in zero-cost software",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText:
      "What is the difference between symmetric and asymmetric encryption?",
    options: [
      "No difference",
      "Symmetric uses same key for encryption/decryption, asymmetric uses different keys",
      "Symmetric is faster, asymmetric is slower",
      "Symmetric is for text, asymmetric for images",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is SQL injection?",
    options: [
      "A type of database",
      "A method to inject malicious SQL code into applications",
      "A database optimization technique",
      "A SQL debugging tool",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is the purpose of penetration testing?",
    options: [
      "To break systems permanently",
      "To identify vulnerabilities by simulating attacks",
      "To install security software",
      "To train employees",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is a man-in-the-middle attack?",
    options: [
      "An attack on middleware",
      "Intercepting communication between two parties",
      "An attack by an insider",
      "A physical security breach",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is the purpose of hashing in security?",
    options: [
      "To encrypt data",
      "To verify data integrity",
      "To compress data",
      "To backup data",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is social engineering in cybersecurity?",
    options: [
      "Engineering social networks",
      "Manipulating people to divulge confidential information",
      "Building secure social platforms",
      "Analyzing social behavior",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is the difference between IDS and IPS?",
    options: [
    "No difference",
    "IDS detects intrusions, IPS prevents them",
    "IDS is faster than IPS",
    "IDS is used for encryption"
  ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is a DDoS attack?",
    options: [
      "Data Deletion of Service",
      "Distributed Denial of Service",
      "Direct Database of Service",
      "Dynamic Denial of Service",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is the purpose of digital certificates?",
    options: [
      "To store passwords",
      "To verify identity and enable secure communication",
      "To backup data",
      "To compress files",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is cross-site scripting (XSS)?",
    options: [
      "A scripting language",
      "Injecting malicious scripts into web pages",
      "A web development technique",
      "A database query method",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is the principle of least privilege?",
    options: [
      "Giving maximum access to all users",
      "Giving users minimum access needed for their job",
      "Removing all privileges",
      "Giving privileges based on seniority",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "cybersecurity",
    questionText: "What is a honeypot in cybersecurity?",
    options: [
      "A sweet security tool",
      "A decoy system to attract attackers",
      "A type of encryption",
      "A password manager",
    ],
    correctOptionIndex: 1,
  },

  // --- DSA Questions ---
  {
    domain: "dsa",
    questionText:
      "What is the time complexity of binary search in a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "Which data structure is used to implement recursion?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText:
      "In a binary search tree, what is the time complexity of searching for an element in the average case?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctOptionIndex: 2,
  },
  {
    domain: "dsa",
    questionText:
      "Which algorithm is used to find the shortest path in a weighted graph?",
    options: ["DFS", "BFS", "Dijkstra's Algorithm", "Binary Search"],
    correctOptionIndex: 2,
  },
  {
    domain: "dsa",
    questionText: "What is a hash collision?",
    options: [
      "When hash table is full",
      "When two keys hash to the same index",
      "When hash function fails",
      "When hash table is empty",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText:
      "What is the time complexity of inserting an element at the beginning of a linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctOptionIndex: 0,
  },
  {
    domain: "dsa",
    questionText:
      "Which traversal of a binary tree visits nodes in ascending order for a BST?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText:
      "What is the maximum number of edges in a simple graph with n vertices?",
    options: ["n", "n-1", "n(n-1)/2", "n²"],
    correctOptionIndex: 2,
  },
  {
    domain: "dsa",
    questionText: "What is dynamic programming?",
    options: [
      "A programming language",
      "An optimization technique using memoization",
      "A type of recursion",
      "A sorting algorithm",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "What is the time complexity of heap sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "In which scenario would you use a trie data structure?",
    options: [
      "Sorting numbers",
      "String prefix matching",
      "Graph traversal",
      "Mathematical calculations",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText: "What is the difference between BFS and DFS?",
    options: [
      "No difference",
      "BFS uses queue, DFS uses stack",
      "BFS is faster than DFS",
      "BFS is for trees, DFS for graphs",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "dsa",
    questionText:
      "What is the time complexity of finding the minimum element in a min-heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctOptionIndex: 0,
  },

  // --- Blockchain Questions ---
  {
    domain: "blockchain",
    questionText: "What is a blockchain?",
    options: [
      "A type of database",
      "A distributed ledger of transactions",
      "A programming language",
      "A cryptocurrency",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is the purpose of mining in blockchain?",
    options: [
      "To create new coins",
      "To validate transactions and add blocks",
      "To store data",
      "To encrypt information",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is a smart contract?",
    options: [
      "A legal document",
      "Self-executing contract with terms in code",
      "A type of cryptocurrency",
      "A blockchain protocol",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText:
      "What is the difference between public and private blockchains?",
    options: [
      "No difference",
      "Public is open to all, private is restricted",
      "Public is faster than private",
      "Public uses more energy",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is a hash function's role in blockchain?",
    options: [
      "To encrypt data",
      "To create unique fingerprints for blocks",
      "To mine cryptocurrency",
      "To store transactions",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is the 51% attack in blockchain?",
    options: [
      "Attacking 51% of users",
      "Controlling majority of network's mining power",
      "Stealing 51% of coins",
      "Hacking 51% of nodes",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is proof of work?",
    options: [
      "A job certificate",
      "A consensus mechanism requiring computational work",
      "A type of smart contract",
      "A blockchain protocol",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is a cryptocurrency wallet?",
    options: [
      "A physical wallet for coins",
      "Software to store and manage private keys",
      "A bank account",
      "A mining device",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is DeFi?",
    options: [
      "Decentralized Finance",
      "Digital Finance",
      "Distributed Finance",
      "Decrypted Finance",
    ],
    correctOptionIndex: 0,
  },
  {
    domain: "blockchain",
    questionText: "What is the purpose of a Merkle tree in blockchain?",
    options: [
      "To store user data",
      "To efficiently verify transaction integrity",
      "To mine blocks",
      "To create wallets",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is gas in Ethereum?",
    options: [
      "A type of fuel",
      "A unit to measure computational effort",
      "A cryptocurrency",
      "A smart contract language",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is the difference between coins and tokens?",
    options: [
      "No difference",
      "Coins have their own blockchain, tokens are built on existing blockchains",
      "Coins are physical, tokens are digital",
      "Coins are cheaper than tokens",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is an NFT?",
    options: [
      "New Financial Technology",
      "Non-Fungible Token",
      "Network File Transfer",
      "Next Future Token",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is consensus in blockchain?",
    options: [
      "Agreement between users",
      "Agreement on the state of the ledger",
      "A voting mechanism",
      "A type of transaction",
    ],
    correctOptionIndex: 1,
  },
  {
    domain: "blockchain",
    questionText: "What is the double-spending problem?",
    options: [
      "Spending money twice",
      "Using the same digital currency twice",
      "Paying double fees",
      "Making duplicate transactions",
    ],
    correctOptionIndex: 1,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding...");

    await Question.deleteMany({});
    console.log("Old questions removed.");

    await Question.insertMany(questions);
    console.log("Database seeded with new questions!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
