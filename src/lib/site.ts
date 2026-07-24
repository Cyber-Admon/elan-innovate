/*
  Single source of truth for site-wide content.
  Edit copy here, not inside components.
*/

export const site = {
  name: "Elan Innovate",
  positioning: "Building businesses for scale, with momentum.",
  tagline: "Building with Momentum.",
  endorsement: "by Crelivio", // footer only, per brand rules
  email: "innovateelan@gmail.com",
  phone: "+234 803 370 8533",
  phoneRaw: "+2348033708533",
  community: "", // paste the WhatsApp community invite link here when you have it
  social: {
    instagram: "https://www.instagram.com/elan.innovate/",
    linkedin: "https://www.linkedin.com/company/elaninnovate/",
    tiktok: "",
    youtube: "",
  },
  program: {
    cohort: "First Incubation Cohort",
    cost: "Free",
    status: "Applications open now",
    timeline: "Program officially runs Q4 2026",
  },
} as const;

export const leadership = [
  {
    name: "Abdulmalik Adebayo Omoniyi",
    role: "President and CEO",
    bio: "Brand strategist and builder. Started Elan to make real support reachable for entrepreneurs building from nothing.",
  },
  {
    name: "Mujisatullahi Adedunke Bakare",
    role: "Vice President, Director of Operations",
    bio: "Business strategist and operator. Runs timelines and delivery across the firm and co-hosts the programs.",
  },
  {
    name: "Khadijah Ajayi",
    role: "Vice President, Director of Campus Network",
    bio: "Leads the campus network, taking Elan's programs to student entrepreneurs who are doing more than study.",
  },
  {
    name: "Fouad Kamildeen-Aransi",
    role: "Vice President and General Secretary",
    bio: "Keeps the institution solid. Governance, documentation, and the books.",
  },
] as const;