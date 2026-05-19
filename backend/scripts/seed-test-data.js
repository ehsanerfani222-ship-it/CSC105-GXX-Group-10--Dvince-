const bcrypt = require("bcrypt");
const prisma = require("../src/prisma");

const PASSWORD = "Test123!";

const postImage = (title, colorA, colorB) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colorA}"/>
          <stop offset="100%" stop-color="${colorB}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g)"/>
      <circle cx="980" cy="160" r="120" fill="rgba(255,255,255,0.18)"/>
      <circle cx="170" cy="740" r="170" fill="rgba(255,255,255,0.14)"/>
      <text x="80" y="470" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="white">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const users = [
  {
    email: "maya.test@dvince.local",
    name: "Maya Chen",
    username: "maya.design",
    city: "Bangkok",
    country: "Thailand",
    phoneNumber: "+66 80 100 2001",
    dateOfBirth: "1997-04-18",
    skills: [
      {
        name: "Editorial Makeup",
        category: "Art",
        subCategory: "Digital Art",
        experienceLevel: "Advanced",
        description: "Creative makeup looks, color palettes, and styling for photoshoots.",
        preferences: "Weekend practice sessions",
        scheduleDays: JSON.stringify(["Saturday", "Sunday"]),
        scheduleStart: "10:00",
        scheduleEnd: "14:00",
      },
      {
        name: "Portrait Photography",
        category: "Art",
        subCategory: "Photography",
        experienceLevel: "Beginner",
        description: "Soft lighting and simple portrait composition.",
        preferences: "Outdoor shoots",
        scheduleDays: JSON.stringify(["Friday"]),
        scheduleStart: "16:00",
        scheduleEnd: "19:00",
      },
    ],
    posts: [
      {
        caption: "Testing a soft glam look with warm highlights.",
        imageUrl: postImage("Soft Glam", "#06b6d4", "#f97316"),
      },
      {
        caption: "Color board for this week's creative session.",
        imageUrl: postImage("Color Board", "#14b8a6", "#8b5cf6"),
      },
    ],
  },
  {
    email: "omar.test@dvince.local",
    name: "Omar Rahman",
    username: "omar.codes",
    city: "Kuala Lumpur",
    country: "Malaysia",
    phoneNumber: "+60 12 555 0190",
    dateOfBirth: "1995-09-02",
    skills: [
      {
        name: "React Coaching",
        category: "Technology",
        subCategory: "Web Design",
        experienceLevel: "Master",
        description: "I help beginners build clean React apps with real project structure.",
        preferences: "Screen-share sessions",
        scheduleDays: JSON.stringify(["Monday", "Wednesday"]),
        scheduleStart: "19:00",
        scheduleEnd: "21:00",
      },
    ],
    posts: [
      {
        caption: "Built a small dashboard layout for today's mentoring session.",
        imageUrl: postImage("React Lab", "#0ea5e9", "#22c55e"),
      },
      {
        caption: "Debugging tip: make the state visible first.",
        imageUrl: postImage("Debug Notes", "#334155", "#06b6d4"),
      },
    ],
  },
  {
    email: "lina.test@dvince.local",
    name: "Lina Morales",
    username: "lina.music",
    city: "Barcelona",
    country: "Spain",
    phoneNumber: "+34 600 123 456",
    dateOfBirth: "1998-01-27",
    skills: [
      {
        name: "Acoustic Guitar",
        category: "Music",
        subCategory: "Guitar",
        experienceLevel: "Advanced",
        description: "Chord progressions, rhythm, and easy song practice.",
        preferences: "Friendly beginner groups",
        scheduleDays: JSON.stringify(["Tuesday", "Thursday"]),
        scheduleStart: "17:30",
        scheduleEnd: "20:00",
      },
    ],
    posts: [
      {
        caption: "Three-chord practice set ready for learners.",
        imageUrl: postImage("Guitar Set", "#f59e0b", "#ef4444"),
      },
      {
        caption: "Quick warmup before class.",
        imageUrl: postImage("Warmup", "#ec4899", "#06b6d4"),
      },
    ],
  },
  {
    email: "noah.test@dvince.local",
    name: "Noah Williams",
    username: "noah.fitness",
    city: "New York",
    country: "United States",
    phoneNumber: "+1 555 0142",
    dateOfBirth: "1993-11-12",
    skills: [
      {
        name: "Mobility Training",
        category: "Sports",
        subCategory: "Yoga",
        experienceLevel: "Advanced",
        description: "Simple mobility routines for desk workers and beginners.",
        preferences: "Morning sessions",
        scheduleDays: JSON.stringify(["Monday", "Friday"]),
        scheduleStart: "07:00",
        scheduleEnd: "09:00",
      },
    ],
    posts: [
      {
        caption: "Five-minute shoulder mobility routine.",
        imageUrl: postImage("Mobility", "#22c55e", "#0f766e"),
      },
    ],
  },
];

async function main() {
  const password = await bcrypt.hash(PASSWORD, 10);
  const emails = users.map((user) => user.email);

  await prisma.user.deleteMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  const createdUsers = [];

  for (const user of users) {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        password,
        name: user.name,
        username: user.username,
        city: user.city,
        country: user.country,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        skills: {
          create: user.skills,
        },
        posts: {
          create: user.posts,
        },
      },
      include: {
        posts: true,
      },
    });

    createdUsers.push(created);
  }

  const [maya, omar, lina, noah] = createdUsers;
  const allPosts = createdUsers.flatMap((user) => user.posts);

  await prisma.follow.createMany({
    data: [
      { followerId: maya.id, followingId: omar.id },
      { followerId: maya.id, followingId: lina.id },
      { followerId: omar.id, followingId: maya.id },
      { followerId: lina.id, followingId: maya.id },
      { followerId: noah.id, followingId: omar.id },
    ],
  });

  await prisma.like.createMany({
    data: allPosts.flatMap((post) =>
      createdUsers
        .filter((user) => user.id !== post.userId)
        .slice(0, 2)
        .map((user) => ({
          postId: post.id,
          userId: user.id,
        }))
    ),
  });

  await prisma.comment.createMany({
    data: [
      { postId: maya.posts[0].id, userId: omar.id, content: "This looks ready for a real shoot." },
      { postId: maya.posts[1].id, userId: lina.id, content: "The colors are so good." },
      { postId: omar.posts[0].id, userId: maya.id, content: "Clean layout and easy to scan." },
      { postId: omar.posts[1].id, userId: noah.id, content: "That debugging note helped me." },
      { postId: lina.posts[0].id, userId: maya.id, content: "I want to try this lesson." },
      { postId: noah.posts[0].id, userId: omar.id, content: "Saving this for the morning." },
    ],
  });

  await prisma.message.createMany({
    data: [
      { senderId: maya.id, receiverId: omar.id, content: "Can you review my profile page idea?" },
      { senderId: omar.id, receiverId: maya.id, content: "Yes, send me the layout and I will check it." },
      { senderId: lina.id, receiverId: maya.id, content: "Do you have a beginner makeup color list?" },
      { senderId: maya.id, receiverId: lina.id, content: "Yes, I can share a small warm palette." },
      { senderId: noah.id, receiverId: omar.id, content: "Do you teach React after work hours?" },
      { senderId: omar.id, receiverId: noah.id, content: "I usually do Monday and Wednesday evenings." },
    ],
  });

  console.log("Seeded test data:");
  console.log(`- ${createdUsers.length} profiles`);
  console.log(`- ${allPosts.length} posts`);
  console.log("- 6 comments, 6 chats/messages, likes, and follows");
  console.log(`Login with any test email and password: ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
