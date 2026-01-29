// src/lib/data.js

const mockCollections = [
  {
    id: 1,
    title: "City Apartments",
    imageUrl:
      "/home/city.png",
    alt: "Modern city apartment",
    href: "/buy",
  },
  {
    id: 2,
    title: "Beach Villas",
    imageUrl:
      "/home/beach.png",
    alt: "Luxurious beach villa",
    href: "/buy",
  },
  {
    id: 3,
    title: "Investment Units",
    imageUrl:
      "/home/invest.jpg",
    alt: "Investment townhouses",
    href: "/buy",
  },
  {
    id: 4,
    title: "New Developments",
    imageUrl:
      "/home/newDevelopment.png",
    href: "/properties/residential",
  },
  
];

const mockTestimonials = [
  {
    id: 1,
    quote:
      "The team at Q HOMES made our dream of owning a beachfront villa a reality. Their professionalism and local knowledge are unmatched. The entire process was seamless, from the virtual tours to the final paperwork.",
    name: "Amina Diop (Sample)",
    title: "Investor from France",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxV9ZnK1KhYV1TXZbKZBM35XAN52r0_ijPviuX0Zx9WeQ8xpmKx281EXp3ADJnUdFG1EAzulwBFGRQu8zh2TNEbi5CmNdnuhlfp8mUBsA30ikb4FkS_pEpszbYLSpVWUM1ZhQffM4CoucJBhVPHWtPIJdVJkDnRsgpGRtQcVG-BJf5H5aKCRoiMUgwDqlYsiBjS2cjJGw2IICQbW6pTOewbdtL22LvyITQZg3OctnshccxaBfK5JOCKu7LQbZm0LqmUxkNw624u2k",
  },
  {
    id: 2,
    quote:
      "As a first-time buyer in Abidjan, I was nervous. Q HOMES guided me every step of the way with patience and expertise. I couldn't be happier with my new apartment and the secure transaction process.",
    name: "Koffi Brou (Sample)",
    title: "Abidjan Resident",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtnqzNHlkh-mSieej3A5QiFCkoBqsbH8VizjdgsLcww-vqSny1AGpJLrr8y7K18m8mLd1rHWxYjcQfSbV3gr783KA9QsYxN3Sg3RuKL5wkYfPAHoihAmJiGvgRpJSwgifU-5IVSTHjw8CNp42zVCls09NkSMerhvz8sQsutcZSsjdD76DqLlU2as6iIim7x9qTtnF4VTwZapUbeC1k7GfujzK04A8Wqwnff51IqxH1V7f6Cql88oTZkF0c4L80bw2q4kfuF7l_4UE",
  },
  {
    id: 3,
    quote:
      "Selling our family property from overseas seemed daunting, but Q HOMES handled everything. Their marketing was fantastic, and they found a verified buyer quickly. Highly recommended for diaspora owners!",
    name: "Fatou Camara (Sample)",
    title: "Seller from Canada",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCG0ONCJDurc9bifsOTJSCV4_QI3wFy5deujc385awPKUJT--MjK9iTjBFaa7pKeQ3Mz3YwgvnHGf_MFIqnz6zzUzIJVulauf52HGeu18CQMf3ai261qiRJglhKHUG47Nqh7AMOjRbb__lS5wOJpwzC_R28s_LfoJVaxDLaQB7rs9w2wQX-MF3DfedzkCL9zgrQ9ijxQkrlTUVN4HciE1sn-uumm_H7_bU9WETZ8eCzr5Dn-uqdD53yKZvGxj7wg1o2Q2XtvpkieXA",
  },
  {
    id: 4,
    quote:
      "I invested in three commercial properties through Q HOMES. Their market analysis was spot-on, and the rental yields exceeded my expectations. They truly understand the local real estate landscape.",
    name: "Marcus Johnson (Sample)",
    title: "Business Owner from USA",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    quote:
      "Outstanding service from start to finish! Q HOMES helped us find the perfect family home in Cocody. The virtual tour technology made it easy to view properties from abroad before our visit.",
    name: "Aisha Mensah (Sample)",
    title: "Teacher from Ghana",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    quote:
      "Q HOMES made relocating to Côte d'Ivoire stress-free. They understood our needs, showed us great options, and negotiated a fair price. We love our new home and the community.",
    name: "David Okafor (Sample)",
    title: "Engineer from Nigeria",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
];

//return mock data functions
export const getCollections = () => {
  return mockCollections;
};

export const getTestimonials = () => {
  return mockTestimonials;
};
