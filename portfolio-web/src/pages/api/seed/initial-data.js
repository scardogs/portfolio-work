import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";
import Skill from "../../../models/Skill";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Seed Projects (from your existing data)
    const projects = [
      {
        title: "LJIM - WEB",
        description: `Developed a MERN stack website for Lift Jesus International Ministries (LJIM), a global faith-based organization dedicated to spiritual growth and community service. The platform includes a dynamic music management system with full CRUD functionality for songs, an interactive events module for outreach coordination, and an information hub for the ministry's story, mission, and giving opportunities. Integrated an intelligent dual-role chat assistant for technical support and Bible Q&A, enhancing user engagement and accessibility. Designed with Chakra UI for a modern, responsive interface that delivers a seamless experience across all devices.`,
        github: "https://github.com/scardogs/ljim-app",
        img: "/LJIM.png",
        website: "https://ljim.vercel.app/",
        order: 1,
      },
      {
        title: "StoryType",
        description: `Built a MERN stack web app (StoryType) that combines typing practice with creative storytelling—users type to progress through interactive storylines across genres like fantasy, mystery, and sci-fi. Features include real-time typing feedback, progress tracking, and genre selection.`,
        github: "https://github.com/scardogs/storytype-web",
        img: "/storytype.png",
        website: "https://storytype-jjscrl.vercel.app/",
        order: 2,
      },
      {
        title: "Justine Cargo Services Integration System - WEB",
        description: `Developed a MERN stack system to automate and streamline company operations. The system includes modules for employee profiles, truck status tracking, delivery management, truck renewal scheduling, waybill verification, fuel monitoring, automated payroll, billing generation, and report creation. This reduces manual work, improves data accuracy, and helps the company manage information more efficiently.`,
        github: "https://github.com/scardogs/JustinesCargoServices-Web",
        img: "/LOGO.png",
        website: "https://apps.justinescargo.com/",
        order: 3,
      },
      {
        title:
          "Justine Cargo Services Integration System - Desktop Application",
        description: `Developed a C#-based desktop application to automate and streamline company operations. The system features modules for managing employee profiles (with integrated biometric login and attendance tracking), tracking truck statuses, handling deliveries, scheduling truck renewals, verifying waybills, monitoring fuel consumption, automating payroll, generating billing statements, and producing detailed reports. It also integrates with other internal systems to enable smooth data exchange and centralized control. This reduces manual processes, improves data accuracy, and enhances overall operational efficiency.`,
        github:
          "https://github.com/scardogs/justines-cargo-services-desktop-app",
        img: "/LOGO.png",
        order: 4,
      },
    ];

    // Seed Skills (from your existing data)
    const skills = [
      { name: "MongoDB", icon: "/mongodb.svg", order: 1 },
      { name: "Express.js", icon: "/express.svg", order: 2 },
      { name: "React", icon: "/react.svg", order: 3 },
      { name: "Node.js", icon: "/nodejs.svg", order: 4 },
      { name: "Next.js", icon: "/next-js.svg", order: 5 },
      { name: "CSS", icon: "/css.svg", order: 6 },
      { name: "PHP", icon: "/php.svg", order: 7 },
      { name: ".NET", icon: "/dotnet.svg", order: 8 },
      { name: "Python", icon: "/python.svg", order: 9 },
      { name: "C#", icon: "/csharp.svg", order: 10 },
      { name: "Chakra UI", icon: "/chakra-ui.svg", order: 11 },
    ];

    // Check if data already exists
    const existingProjects = await Project.countDocuments();
    const existingSkills = await Skill.countDocuments();

    let projectsCreated = 0;
    let skillsCreated = 0;

    // Only seed if no data exists
    if (existingProjects === 0) {
      await Project.insertMany(projects);
      projectsCreated = projects.length;
    }

    if (existingSkills === 0) {
      await Skill.insertMany(skills);
      skillsCreated = skills.length;
    }

    return res.status(200).json({
      success: true,
      message: "Initial data seeded successfully",
      data: {
        projectsCreated,
        skillsCreated,
        existingProjects,
        existingSkills,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
