
// Expanded definitions for broader matching
export const defaultReplies = [
    "I'm not sure about that, but our team can help! Click 'Connect' to chat with a human.",
    "Could you rephrase that? Or you can connect with our support team directly.",
    "I'm a bot, and I'm still learning! Would you like to speak to an admin?",
    "That's a good question. Please connect with our admin for a detailed answer.",
    "I can help with basic queries, but for specific details, our counselors are best.",
    "Interesting! Tell me more, or ask about our courses.",
    "I'm here to assist with your study abroad dreams.",
    "Feel free to ask about specific countries or universities."
];

// Offensive or inappropriate words to filter
export const blockedWords = [
    "badword", "idiot", "stupid", "dumb", "hate", "kill", "shut up", "fuck", "shit", "bitch", "asshole"
    // Add real filter list as appropriate for a professional context
];

// Detailed Platform Data for Training
export const platformData = {
    name: "Interman Educational Services",
    contact: {
        phone: "+91 9747 44 22 22",
        email: "info@interman.in",
        address: "Valanchery, Dhana Tower, Opp. Bus Stand, Malappuram Dt. Kerala",
        branches: ["Malappuram", "Kottakkal", "Valanchery"]
    },
    services: [
        "Career Guidance",
        "Admission Assistance",
        "Visa Processing",
        "Document Verification",
        "Educational Loans",
        "Entrance Exam Coaching",
        "Post-Arrival Support"
    ],
    courses: [
        "MBBS", "BDS", "MD", "MS",
        "Engineering (B.Tech, M.Tech)",
        "Management (MBA, BBA)",
        "Nursing", "Pharmacy",
        "Aviation", "Hospitality"
    ],
    countries: [
        "India", "China", "Philippines", "Russia", "Ukraine", "Georgia",
        "Kyrgyzstan", "Kazakhstan", "UK", "Canada", "Germany", "Australia"
    ],
    features: [
        "Live Chat Support", "Course Finder", "Gallery", "Blog Updates", "Student Reviews"
    ]
};

// We use a keyword-based approach. The key is the trigger, the value is the response.
export const keywords: Record<string, string> = {
    // Basic Greetings
    "hi": "Hello! How can I assist you with your study abroad journey today?",
    "hello": "Hi there! Welcome to Interman. How can I help?",
    "hey": "Hey! Looking for information on universities or courses?",
    "greetings": "Greetings! Ready to explore global education opportunities?",
    "good morning": "Good morning! How can I help you start your study abroad journey?",
    "good afternoon": "Good afternoon! Hope you are having a great day.",
    "good evening": "Good evening! Feel free to ask me anything about our services.",
    "howdy": "Howdy! How can I be of service?",
    "sup": "Not much! Just helping students achieve their dreams. How about you?",
    "yo": "Yo! Ready to check out some universities?",

    // Phatic / Small Talk
    "how are you": "I'm just a bot, but I'm functioning perfectly! How can I help you?",
    "who are you": "I am the Interman Virtual Assistant, here to guide you.",
    "what is your name": "I'm Interman Bot. Nice to meet you!",
    "nice to meet you": "Nice to meet you too!",
    "thank you": "You're welcome! Let me know if you need anything else.",
    "thanks": "Anytime! Happy to help.",
    "thx": "You're welcome!",
    "bye": "Goodbye! Have a wonderful day.",
    "goodbye": "See you soon! Don't hesitate to reach out again.",
    "see ya": "Catch you later!",
    "cool": "Right? Studying abroad is very cool.",
    "ok": "Okay! What else would you like to know?",
    "okay": "Alright. Any other questions?",
    "great": "That's great to hear!",
    "awesome": "Awesome indeed!",
    "lol": "Glad I could make you smile (virtually)!",

    // Core Business Queries
    "courses": "We offer guidance for Medical, Engineering, Arts, Business, Nursing, Pharmacy, and Aviation courses. Which one interests you?",
    "course": "We have a wide range of courses like MBBS, B.Tech, MBA, and more. Are you looking for UG or PG?",
    "medical": "Great! We have excellent options for MBBS, BDS, and MD/MS in countries like Russia, China, and Philippines.",
    "mbbs": "MBBS is a popular choice. We can guide you to top medical universities in Russia, China, Georgia, and more.",
    "engineering": "Interman can help you get into top engineering colleges (B.Tech/M.Tech) in India and abroad.",
    "btech": "B.Tech options are available globally. Connect with us to explore.",
    "arts": "We support Arts and Humanities programs too!",
    "business": "MBA and BBA programs are available in top business schools worldwide.",
    "mba": "Looking for an MBA? We can help you find the best B-schools.",
    "nursing": "Nursing is a noble profession with great global demand. We can help you find the right college.",
    "aviation": "Fly high with our Aviation course guidance!",

    // Services & Logistics
    "contact": "You can reach us at +91 9747 44 22 22 or visit our 'Contact Us' page.",
    "phone": "Our support number is +91 9747 44 22 22.",
    "call": "Give us a call at +91 9747 44 22 22.",
    "email": "You can email us at info@interman.in",
    "location": "Our corporate office is in Valanchery, Kerala. We also have branches in Malappuram and Kottakkal.",
    "address": "Valanchery, Dhana Tower, Opp. Bus Stand, Malappuram Dt. Kerala.",
    "branch": "We have branches in Malappuram, Kottakkal, and Valanchery.",
    "visa": "We provide comprehensive visa assistance, from documentation to interview preparation.",
    "passport": "We can assist with passport documentation if needed. Do you have a valid passport?",
    "fee": "Fee structures vary significantly by university and country. Connect with our admin for a specific fee structure.",
    "cost": "The cost depends on the country and course. Our counselors can give you a tailored budget estimate.",
    "scholarship": "Yes, many universities offer scholarships based on merit! Our counselors can help you apply.",
    "admission": "Admission processes differ by country. We guide you through every step, from application to enrollment.",
    "documents": "Usually you need transcripts, passport, photos, and ID proof. Ask our admin for a detailed checklist.",
    "loan": "We assist with educational loan processing to make your studies affordable.",

    // Countries
    "country": "We deal with universities in many countries including UK, Canada, Germany, Russia, China, Philippines, and more.",
    "countries": "We cover UK, Europe, Russia, China, Philippines, Georgia, Kyrgyzstan, Kazakhstan, and more.",
    "uk": "The UK is a fantastic destination. We handle UK admissions.",
    "usa": "We can help with US universities.",
    "canada": "Canada is very popular. Ask our admin about upcoming intakes.",
    "germany": "Germany offers great engineering programs with low tuition fees in some cases.",
    "russia": "Russia is a top destination for medical studies with recognized universities.",
    "china": "China offers high-quality medical education.",
    "philippines": "Philippines is famous for its US-based medical curriculum.",
    "georgia": "Georgia is an emerging destination for medical students.",
    "india": "We also help with admissions in top colleges within India.",

    // Triggers for Human Handoff
    "admin": "connect_trigger",
    "human": "connect_trigger",
    "support": "connect_trigger",
    "talk": "connect_trigger",
    "agent": "connect_trigger",
    "representative": "connect_trigger",
    "person": "connect_trigger",
    "help": "I can help with basics, but if you're stuck, type 'admin' to chat with a person.",
    "speak": "connect_trigger",
    "connect": "connect_trigger",

    // Platform / Website Specific
    "platform": "The Interman platform is your gateway to global education. Usage is free for students!",
    "website": "Our website offers course searches, university details, and direct contact with counselors.",
    "app": "We are currently working on a mobile app. Stay tuned!",
    "login": "Admins can login via the footer link. Students don't need to login to browse.",
    "register": "No registration needed! Just browse and connect with us.",
    "signin": "Admin sign-in is available in the footer.",
    "signup": "No sign-up required for students.",
    "dashboard": "The dashboard is for our admin staff to manage inquiries.",
    "features": "You can search courses, view blogs, and chat with us live!",
    "details": "We provide detailed info on fees, visas, and admission requirements."
};
