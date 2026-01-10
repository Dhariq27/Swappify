export const mockSkills = [
  {
    id: '1',
    title: 'Learn Guitar - Acoustic & Electric',
    description: 'I can teach you guitar from beginner to intermediate level. We\'ll cover basic chords, strumming patterns, and your favorite songs.',
    category: 'Music',
    teacher: {
      name: 'monish',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      location: 'San Francisco, CA'
    },
    wantedSkills: ['Web Development', 'Python Programming', 'Digital Marketing'],
    duration: '1-2 hours/week',
    difficulty: 'Beginner' as const,
    isOnline: true
  },
  {
    id: '2',
    title: 'Professional Photography & Photo Editing',
    description: 'Master DSLR photography, composition, lighting, and post-processing with Lightroom and Photoshop.',
    category: 'Photography',
    teacher: {
      name: 'asif',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      location: 'New York, NY'
    },
    wantedSkills: ['Cooking', 'Language Tutoring', 'Yoga'],
    duration: '2-3 hours/week',
    difficulty: 'Intermediate' as const,
    isOnline: false
  },
  {
    id: '3',
    title: 'Full-Stack Web Development',
    description: 'Learn React, Node.js, and modern web development. Build real projects and deploy them to production.',
    category: 'Technology',
    teacher: {
      name: 'monish',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5.0,
      location: 'Austin, TX'
    },
    wantedSkills: ['Guitar Lessons', 'Personal Training', 'Graphic Design'],
    duration: '3-4 hours/week',
    difficulty: 'Advanced' as const,
    isOnline: true
  },
  {
    id: '4',
    title: 'Italian Language & Culture',
    description: 'Native Italian speaker offering conversational practice, grammar lessons, and cultural insights.',
    category: 'Languages',
    teacher: {
      name: 'asif',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      location: 'Los Angeles, CA'
    },
    wantedSkills: ['Piano Lessons', 'Interior Design', 'Jewelry Making'],
    duration: '1-2 hours/week',
    difficulty: 'Beginner' as const,
    isOnline: true
  },
  {
    id: '5',
    title: 'Digital Art & Illustration',
    description: 'Learn digital painting, character design, and illustration using Procreate and Adobe Creative Suite.',
    category: 'Art & Design',
    teacher: {
      name: 'monish',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      location: 'Seattle, WA'
    },
    wantedSkills: ['Video Editing', 'Dance Lessons', 'Cooking'],
    duration: '2 hours/week',
    difficulty: 'Intermediate' as const,
    isOnline: true
  },
  {
    id: '6',
    title: 'Yoga & Mindfulness Practice',
    description: 'Certified yoga instructor offering Hatha and Vinyasa classes, plus meditation and breathing techniques.',
    category: 'Health & Wellness',
    teacher: {
      name: 'asif',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      location: 'Denver, CO'
    },
    wantedSkills: ['Photography', 'Creative Writing', 'Spanish Tutoring'],
    duration: '1 hour/week',
    difficulty: 'Beginner' as const,
    isOnline: false
  }
];

export const mockCategories = [
  { id: 'technology', name: 'Technology', icon: '💻', count: 45 },
  { id: 'music', name: 'Music', icon: '🎵', count: 32 },
  { id: 'languages', name: 'Languages', icon: '🗣️', count: 28 },
  { id: 'art-design', name: 'Art & Design', icon: '🎨', count: 24 },
  { id: 'cooking', name: 'Cooking', icon: '👨‍🍳', count: 19 },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', count: 22 },
  { id: 'photography', name: 'Photography', icon: '📸', count: 15 },
  { id: 'wellness', name: 'Health & Wellness', icon: '🧘‍♀️', count: 18 }
];

export const mockUser = {
  id: 'user-1',
  name: 'Mohammed Dhariq I B',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
  location: 'San Francisco, CA',
  rating: 4.7,
  totalSwaps: 12,
  skillsOffered: [
    {
      id: 'skill-1',
      title: 'React & TypeScript Development',
      category: 'Technology',
      description: 'Frontend development with modern React patterns and TypeScript',
      level: 'Advanced'
    },
    {
      id: 'skill-2', 
      title: 'Piano Lessons',
      category: 'Music',
      description: 'Classical and jazz piano for all levels',
      level: 'Intermediate'
    }
  ],
  skillsWanted: ['Photography', 'Spanish Language', 'Cooking', 'Digital Art'],
  bio: 'Software engineer by day, music enthusiast by night. Love teaching and learning new skills!',
  joinedDate: '2023-06-15'
};

export const mockChats = [
  {
    id: 'chat-1',
    participant: {
      name: 'monish',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=150&h=150&fit=crop&crop=face'
    },
    lastMessage: 'Sounds great! When would you like to start the guitar lessons?',
    timestamp: '2024-01-15T10:30:00Z',
    unreadCount: 2,
    skillExchange: {
      offered: 'Guitar Lessons',
      wanted: 'React Development'
    }
  },
  {
    id: 'chat-2',
    participant: {
      name: 'asif',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    lastMessage: 'I can teach you photography basics this weekend if you\'re free',
    timestamp: '2024-01-14T15:45:00Z',
    unreadCount: 0,
    skillExchange: {
      offered: 'Photography',
      wanted: 'Piano Lessons'
    }
  }
];

export const mockBarterRequests = [
  {
    id: 'request-1',
    from: {
      name: 'asif',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    skillOffered: 'Italian Language Tutoring',
    skillWanted: 'Piano Lessons',
    message: 'Hi! I saw your piano lessons offer. I\'d love to exchange Italian lessons for piano lessons. I\'m a native speaker and certified language teacher.',
    timestamp: '2024-01-15T09:00:00Z',
    status: 'pending'
  },
  {
    id: 'request-2',
    from: {
      name: 'monish',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    skillOffered: 'Digital Art Lessons',
    skillWanted: 'React Development',
    message: 'I\'m interested in learning React and TypeScript. I can teach you digital art and illustration in exchange!',
    timestamp: '2024-01-14T14:30:00Z',
    status: 'pending'
  }
];