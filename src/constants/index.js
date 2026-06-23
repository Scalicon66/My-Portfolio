const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 4, suffix: "+", label: "Years of Experience" },
  { value: 1, suffix: "+", label: "Completed Projects" },
];


const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];


const expCards = [
  {
    logoPath: "/images/js.png",
    themeColor: "#62e0ff",
    title: "Frontend Developer",
    date: "January 2022 - Present",
    responsibilities: [
      "Created responsive and interactive websites using HTML, CSS, JavaScript, and React.",
      "Developed reusable UI components and modern frontend layouts.",
      "Integrated APIs using Fetch API and Axios..",
    ],
  },
  {
    logoPath: "/images/php.png",
    themeColor: "#2496ed",
    title: "Full Stack Developer",
    date: "August 2025 - present",
    responsibilities: [
      "Worked on authentication systems, database architecture, and deployment workflows.",
      "Built scalable dashboards, management systems, and dynamic web platforms.",
      "Improved application performance, responsiveness, and user experience.",
    ],
  },
  {
    logoPath: "/images/React.png",
    themeColor: "#fd5c79",
    title: "React Developer",
    date: "May 2024 - present",
    responsibilities: [
      "Built modern user interfaces with React.js and component-based architecture.",
      "Implemented routing, state management, and responsive navigation systems.",
      "Converted UI/UX designs into fully functional web applications.",
    ],
  },
];


const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
    imgPath: "/images/react.svg",
  },
  {
    name: "Laravel Developer",
    modelPath: "/models/laravel-transformed.glb",
    scale: 1.5,
    rotation: [0, 0, 0],
    imgPath: "/images/laravel.svg",
  },
  {
    name: "Backend Developer",
    modelPath: "/models/php-transformed.glb",
    scale: 2.2,
    rotation: [0, 0, 0],
    imgPath: "/images/php.svg",
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
    imgPath: "/images/threejs.svg",
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
    imgPath: "/images/git.svg",
  },
];


const socialImgs = [
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    url: "https://linkedin.com/in/omar-ash1/",
  },
  {
    name: "github",
    imgPath: "/images/github.svg",
    url: "https://github.com/Scalicon66",
  },
];

const projects = [
  {
    id: "ryde1",
    name: "Minimal E-Commerce Experience",
    sub: "Built with PHP",
    imgPath: "/images/project1.png",
    shortDesc: "A clean and responsive shopping platform focused on simplicity, performance, and elegant product browsing.",
    longDesc: "This is a minimal E-Commerce experience designed to highlight speed, simplicity, and user-centric navigation. Built using PHP on the backend for clean database interactions, user authentication, and shopping cart management, combined with a responsive frontend utilizing custom styled CSS layouts and smooth transitions.\n\nKey features include dynamic product search, category filtering, a persistence shopping cart, checkout processing simulation, and a dashboard interface to manage items. Perfect for lightweight, self-hosted e-commerce solutions.",
    visitUrl: "https://secret-preheated-untruth.ngrok-free.dev/Backend/shop/",
  },
  {
    id: "ryde2",
    name: "Basma Ashraf – Mathematics Educator Portfolio",
    sub: "Built with React.js",
    imgPath: "/images/project2.png",
    shortDesc: "A professional portfolio website showcasing the teaching experience, qualifications, achievements, and educational services of mathematics teacher Basma Ashraf.",
    longDesc: "Basma Ashraf – Mathematics Educator Portfolio is a professional portfolio website designed to showcase the teacher's experience, qualifications, teaching approach, and educational services. The website provides students, parents, and educational institutions with a clear overview of her academic background, achievements, and areas of expertise.\n\n Featuring a modern and responsive design, the portfolio serves as a digital presence that highlights professionalism, builds credibility, and makes it easy for visitors to learn more about the teacher and get in touch for educational opportunities and inquiries.",
    visitUrl: "https://basma-ashraf.vercel.app/",
  },
  {
    id: "coming-soon",
    name: "Coming soon",
    sub: "coming soon",
    imgPath: "/images/project3.png",
    shortDesc: "Coming soon.",
    longDesc: "Coming soon.",
    visitUrl: "#",
    isPlaceholder: true,
  }
];

export {
  words,
  abilities,
  counterItems,
  expCards,
  socialImgs,
  techStackIcons,
  navLinks,
  projects,
};
