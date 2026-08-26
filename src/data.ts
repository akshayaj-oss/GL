export type Category = 'fitness' | 'food' | 'travel' | 'books';

export interface Question {
  question: string;
  options: {
    text: string;
    category: Category;
  }[];
}

export const questions: Question[] = [
  {
    question: "Which statement are you most likely to agree with?",
    options: [
      { text: "A good workout can fix a bad day.", category: 'fitness' },
      { text: "There is no such thing as 'too much good food.'", category: 'food' },
      { text: "I'd rather have a great trip than a great thing.", category: 'travel' },
      { text: "Books are better when nobody is interrupting you.", category: 'books' },
    ]
  },
  {
    question: "You're at a party where you know absolutely nobody. What's your first move?",
    options: [
      { text: "Find the most interesting person and start talking.", category: 'fitness' },
      { text: "Find the food. Immediately.", category: 'food' },
      { text: "Wander around and see what catches my eye.", category: 'travel' },
      { text: "Find a quiet corner and settle in.", category: 'books' },
    ]
  },
  {
    question: "Your camera roll is accidentally projected on a giant screen at work. What are you praying doesn't appear?",
    options: [
      { text: "47 screenshots of things I want to try.", category: 'fitness' },
      { text: "An embarrassing amount of food photos.", category: 'food' },
      { text: "800 photos from the same trip.", category: 'travel' },
      { text: "Photos of books, quotes and highlights I've saved.", category: 'books' },
    ]
  },
  {
    question: "Which of these would annoy you the MOST?",
    options: [
      { text: "Someone cancelling plans at the last minute.", category: 'fitness' },
      { text: "Someone saying 'let's eat somewhere' and having no suggestions.", category: 'food' },
      { text: "Someone visiting an amazing place and taking zero photos.", category: 'travel' },
      { text: "Someone interrupting you when you're finally into a good book.", category: 'books' },
    ]
  },
  {
    question: "You get one completely unnecessary luxury for the rest of your life. Pick one:",
    options: [
      { text: "Never feeling tired after a long day.", category: 'fitness' },
      { text: "Always finding an incredible meal wherever you go.", category: 'food' },
      { text: "Always having the perfect place to escape to.", category: 'travel' },
      { text: "Always having the perfect book for your mood.", category: 'books' },
    ]
  }
];

export const personalities: Record<Category, { title: string; subtitle: string; vibe: string; icon: string }> = {
  fitness: {
    title: "THE GO-GETTER",
    subtitle: "You're happiest when you're moving, challenging yourself and convincing everyone around you to get off the couch.",
    vibe: "Come on, let's do it.",
    icon: "💪"
  },
  food: {
    title: "THE FOOD EXPLORER",
    subtitle: "You don't simply eat. You investigate. You're always hunting for the next great place, dish or food recommendation.",
    vibe: "Trust me. I know a place.",
    icon: "🍴"
  },
  travel: {
    title: "THE WANDERER",
    subtitle: "You're curious, spontaneous and always looking for the next place, view or experience worth remembering.",
    vibe: "Where are we going next?",
    icon: "📸"
  },
  books: {
    title: "THE STORY COLLECTOR",
    subtitle: "You love getting lost in stories, discovering new perspectives and occasionally disappearing into a book for hours.",
    vibe: "Just one more chapter.",
    icon: "📚"
  }
};
