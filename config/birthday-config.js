// ============================================================
// EDIT YOUR NEPHEW'S DETAILS HERE
// This is the single source of truth for the public birthday wish.
// ============================================================

export const BIRTHDAY_CONFIG = {
  recipient: {
    name: "Moiz",
    nickname: "Dear Moiz",
    age: 1,
    birthdayLabel: "1st",
    dateOfBirth: "2025-07-31",
  },

  from: {
    name: "Rehman",
    relationship: "Your very proud Mamu",
  },

  copy: {
    introEyebrow: "A LITTLE SURPRISE IS WAITING",
    introTitle: "For our Little superstar",
    introBody: "One whole year of giggles, cuddles and magic deserves a celebration made only for you.",
    chapterOneTitle: "Once upon a tiny star…",
    chapterOneBody: "You arrived, looked at the world with those curious little eyes, and somehow made every ordinary day feel brighter.",
    oneYearTitle: "One whole year of you",
    giftTitle: "A tiny gift, just for you",
    cakeTitle: "Make your first birthday wish",
    memoriesTitle: "A year full of little memories",
    reasonsTitle: "The little things we adore",
    letterTitle: "A note from Mamu",
    finalLine: "Keep growing, keep smiling, and keep making our world softer and happier just by being in it.",
    letter: [
      "My dearest little star,",
      "You may be too small to remember this birthday, but one day I hope you see this and know how deeply you were celebrated from the very beginning.",
      "May your life always be full of kind people, brave little adventures, loud laughter, warm hugs and dreams that grow as beautifully as you do.",
      "Happy first birthday. Mamu will always be cheering for you — in every tiny step and every giant dream.",
    ],
  },

  stats: [
    { value: "12", label: "months of magic" },
    { value: "365", label: "days of wonder" },
    { value: "∞", label: "smiles you gave us" },
  ],

  reasons: [
    { icon: "☀️", title: "Your sunshine smile", text: "The kind that can fix a tired day in one second." },
    { icon: "🧸", title: "Your tiny cuddles", text: "Small arms. Extremely powerful happiness." },
    { icon: "👣", title: "Every little milestone", text: "Every clap, crawl, sound and step feels like a celebration." },
    { icon: "✨", title: "The magic you brought", text: "Home feels warmer, louder and a lot more joyful with you in it." },
  ],

  memories: [
    { src: "assets/photos/photo-1.jpeg", alt: "First memory placeholder", caption: "That first tiny hello", note: "The day our family got a little more magical." },
    { src: "assets/photos/photo-2.jpeg", alt: "Second memory placeholder", caption: "The sweetest little smile", note: "Proof that happiness can fit inside one tiny face." },
    { src: "assets/photos/photo-3.jpeg", alt: "Third memory placeholder", caption: "Tiny adventures", note: "A whole world to discover, one curious look at a time." },
    { src: "assets/photos/photo-4.jpeg", alt: "Fourth memory placeholder", caption: "Our little superstar", note: "One year down. A lifetime of beautiful stories to go." },
  ],

  media: {
    heroPhoto: "assets/photos/Hero.jpeg",
    finalPhoto: "assets/photos/final.jpeg",
    cakeImage: "", // Optional: e.g. "assets/uploads/Cake.jpeg". Blank = premium coded cake.
    candleImage: "", // Optional: e.g. "assets/uploads/candle.png". Blank = coded candle.
    music: "assets/audio/Happy Birthday To You.mp3",
  },

  theme: {
    accent: "#ff7d6e",
    sky: "#bde8ff",
    cream: "#fff8e9",
    sunshine: "#ffd66b",
    mint: "#bdebd3",
    ink: "#2d3442",
  },
};
