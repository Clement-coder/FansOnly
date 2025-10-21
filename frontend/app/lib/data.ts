export const mockCreators = [
  {
    id: 1,
    name: "Alex Chen",
    category: "Music Producer",
    followers: 45000,
    campaigns: 8,
    bio: "Creating beats and building community",
  },
  {
    id: 2,
    name: "Sarah Dev",
    category: "Tech Educator",
    followers: 32000,
    campaigns: 5,
    bio: "Teaching web development to the world",
  },
  {
    id: 3,
    name: "Mike Art",
    category: "Digital Artist",
    followers: 28000,
    campaigns: 6,
    bio: "Digital art and design inspiration",
  },
]

export const mockCampaigns = [
  {
    id: 1,
    title: "Summer Music Festival",
    description: "Exclusive behind-the-scenes content",
    progress: 7500,
    target: 10000,
    daysLeft: 12,
    status: "active" as const,
  },
  {
    id: 2,
    title: "Fan Appreciation Month",
    description: "Special rewards for loyal supporters",
    progress: 5200,
    target: 5000,
    daysLeft: 5,
    status: "active" as const,
  },
]

export const mockRewards = [
  {
    id: 1,
    title: "Exclusive Content",
    description: "Access to behind-the-scenes videos",
    points: 500,
    claimed: false,
  },
  {
    id: 2,
    title: "Meet & Greet",
    description: "Virtual meet and greet session",
    points: 1000,
    claimed: false,
  },
]
