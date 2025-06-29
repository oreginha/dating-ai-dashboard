// Mock data for testing the dashboard components
export const mockProfiles = [
  {
    id: '1',
    instagramUrl: 'https://instagram.com/ana_madrid',
    name: 'Ana García',
    age: 28,
    location: 'Madrid, Spain',
    compatibilityScore: 85,
    status: 'analyzed',
    lastActivity: new Date('2025-06-29T10:30:00'),
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b6617b2?w=150&h=150&fit=crop&crop=face',
    ],
    bio: 'Photographer & travel enthusiast. Love exploring new places and capturing moments.',
    interests: ['Photography', 'Travel', 'Yoga', 'Coffee', 'Art'],
  },
  {
    id: '2',
    instagramUrl: 'https://instagram.com/laura_bcn',
    name: 'Laura Martín',
    age: 26,
    location: 'Barcelona, Spain',
    compatibilityScore: 78,
    status: 'contacted',
    lastActivity: new Date('2025-06-29T14:15:00'),
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    ],
    bio: 'Marketing professional who loves fitness and good food. Always up for new adventures!',
    interests: ['Fitness', 'Food', 'Marketing', 'Beach', 'Dancing'],
  },
  {
    id: '3',
    instagramUrl: 'https://instagram.com/sofia_sev',
    name: 'Sofía López',
    age: 30,
    location: 'Sevilla, Spain',
    compatibilityScore: 92,
    status: 'active',
    lastActivity: new Date('2025-06-29T09:45:00'),
    photos: [
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    ],
    bio: 'Architect and wine lover. Passionate about design and good conversations.',
    interests: ['Architecture', 'Wine', 'Design', 'Museums', 'Books'],
  },
];

export const mockConversations = [
  {
    id: 'conv-1',
    profileId: '1',
    profileName: 'Ana García',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b6617b2?w=150&h=150&fit=crop&crop=face',
    messages: [],
    state: 'active',
    lastMessageTime: new Date('2025-06-29T15:30:00'),
    responseRate: 0.85,
    engagementScore: 78,
    nextScheduledAction: new Date('2025-06-30T10:00:00'),
  },
  {
    id: 'conv-2',
    profileId: '2',
    profileName: 'Laura Martín',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    messages: [],
    state: 'engaged',
    lastMessageTime: new Date('2025-06-29T12:45:00'),
    responseRate: 0.92,
    engagementScore: 85,
    nextScheduledAction: new Date('2025-06-30T14:00:00'),
  },
  {
    id: 'conv-3',
    profileId: '3',
    profileName: 'Sofía López',
    profilePhoto: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    messages: [],
    state: 'opportunity',
    lastMessageTime: new Date('2025-06-29T16:20:00'),
    responseRate: 0.95,
    engagementScore: 92,
    nextScheduledAction: new Date('2025-06-29T18:00:00'),
  },
];

export const mockOpportunities = [
  {
    id: 'opp-1',
    conversationId: 'conv-1',
    profileName: 'Ana García',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b6617b2?w=150&h=150&fit=crop&crop=face',
    type: 'story_reaction',
    description: 'Ana reacted to your story about coffee. Perfect opportunity to start a conversation about her favorite coffee spots.',
    confidence: 88,
    priority: 'high',
    detectedAt: new Date('2025-06-29T16:45:00'),
    actionTaken: false,
    suggestedResponse: "Hey Ana! I saw you liked my coffee story 😊 Do you have a favorite coffee spot in Madrid? I\'m always looking for new places to try!",
  },
  {
    id: 'opp-2',
    conversationId: 'conv-2',
    profileName: 'Laura Martín',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    type: 'online_status',
    description: 'Laura is currently online. She has been responsive in the past and this could be a good time to continue the conversation.',
    confidence: 75,
    priority: 'medium',
    detectedAt: new Date('2025-06-29T17:10:00'),
    actionTaken: false,
    suggestedResponse: "Hey Laura! How was your day? I remember you mentioned trying that new restaurant - did you end up going?",
  },
  {
    id: 'opp-3',
    conversationId: 'conv-3',
    profileName: 'Sofía López',
    profilePhoto: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    type: 'similar_interests',
    description: 'Sofía posted about visiting a wine museum. You both share interests in wine and culture - perfect conversation starter.',
    confidence: 94,
    priority: 'urgent',
    detectedAt: new Date('2025-06-29T17:30:00'),
    actionTaken: false,
    suggestedResponse: "That wine museum looks amazing! 🍷 I saw your post and I\'m actually planning to visit Sevilla soon. Would love to get some recommendations from a local wine expert!",
  },
];

export const mockPendingMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    profileName: 'Ana García',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b6617b2?w=150&h=150&fit=crop&crop=face',
    variants: [
      {
        content: "Hey Ana! I saw you liked my coffee story 😊 Do you have a favorite coffee spot in Madrid? I'm always looking for new places to try!",
        confidence: 88,
        tone: 'friendly',
      },
      {
        content: "Coffee lover detected! ☕ What's your go-to spot in Madrid? I'm on a mission to find the best cortado in the city!",
        confidence: 82,
        tone: 'casual',
      },
      {
        content: "That coffee story caught your attention! 😉 I bet you know all the best hidden gems in Madrid... care to share a favorite?",
        confidence: 75,
        tone: 'flirty',
      },
    ],
    context: 'Ana reacted to coffee story, shared interests in photography and travel',
    generatedAt: new Date('2025-06-29T16:45:00'),
    expiresAt: new Date('2025-06-30T04:45:00'),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-2',
    profileName: 'Laura Martín',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    variants: [
      {
        content: "Hey Laura! How was your day? I remember you mentioned trying that new restaurant - did you end up going?",
        confidence: 92,
        tone: 'friendly',
      },
      {
        content: "Hope you're having a great day! 😊 Did you ever make it to that restaurant you were excited about?",
        confidence: 87,
        tone: 'casual',
      },
      {
        content: "Quick question - did you try that restaurant yet? I need a good recommendation for this weekend! 🍽️",
        confidence: 83,
        tone: 'humorous',
      },
    ],
    context: 'Laura is online, previous conversation about restaurants, high engagement',
    generatedAt: new Date('2025-06-29T17:10:00'),
    expiresAt: new Date('2025-06-30T05:10:00'),
  },
];

export const mockMetrics = {
  dailyProfiles: 12,
  weeklyProfiles: 78,
  activeConversations: 23,
  opportunitiesDetected: 8,
  messagesApproved: 15,
  responseRate: 0.84,
  successRate: 0.67,
};

// Function to populate store with mock data
export const populateStoreWithMockData = (store: any) => {
  // Add profiles
  mockProfiles.forEach(profile => {
    store.getState().addProfile(profile);
  });

  // Add conversations
  mockConversations.forEach(conversation => {
    store.getState().addConversation(conversation);
  });

  // Add opportunities
  mockOpportunities.forEach(opportunity => {
    store.getState().addOpportunity(opportunity);
  });

  // Add pending messages
  mockPendingMessages.forEach(message => {
    store.getState().addPendingMessage(message);
  });

  // Update metrics
  store.getState().updateMetrics(mockMetrics);

  // Set system as connected
  store.getState().setConnectionStatus(true);
  store.getState().setSystemStatus('online');
};
