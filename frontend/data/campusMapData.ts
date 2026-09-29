export interface RoomLocation {
  id: string;
  name: string;
  code: string;
  type: "faculty" | "lab" | "seminar" | "classroom" | "admin" | "dining" | "facility" | "library";
  buildingId: string;
  floor: number; // 0 for Ground, 1 for 1st floor, etc.
  facultyName?: string;
  designation?: string;
  department?: string;
  email?: string;
  timings?: string;
  capacity?: number;
  description: string;
  tags: string[];
}

export interface BuildingInfo {
  id: string;
  name: string;
  shortCode: string;
  subtitle: string;
  description: string;
  totalFloors: number;
  floors: number[];
  color: string;
  coordinates: { x: number; y: number; width: number; height: number };
  amenities: string[];
  keyLandmarks: string[];
}

export const BUILDINGS: BuildingInfo[] = [
  {
    id: "block-a",
    name: "Academic Block A",
    shortCode: "Block A",
    subtitle: "Computing, Electronics & Core Engineering",
    description: "Main academic hub housing CSE & ECE Departments, ALC Seminar Halls, Advanced Computing Labs, and Faculty Cabins.",
    totalFloors: 6,
    floors: [0, 1, 2, 3, 4, 5],
    color: "#3B82F6",
    coordinates: { x: 340, y: 180, width: 180, height: 130 },
    amenities: ["Elevators (East & West)", "ALC Seminar Halls", "Restrooms on all floors", "Water Dispensers"],
    keyLandmarks: ["ALC Seminar Hall 1 & 2", "Dept of Computer Science", "AI & Robotics Lab", "Dean Office"]
  },
  {
    id: "block-b",
    name: "Academic Block B",
    shortCode: "Block B",
    subtitle: "Sciences, Liberal Arts & Management",
    description: "Houses School of Entrepreneurship and Management Studies (SEAMS), Physics/Chemistry Research Labs, and Smart Classrooms.",
    totalFloors: 5,
    floors: [0, 1, 2, 3, 4],
    color: "#8B5CF6",
    coordinates: { x: 550, y: 180, width: 170, height: 130 },
    amenities: ["Elevators", "Lecture Theatres", "Physics Research Labs", "Chemistry Clean Rooms"],
    keyLandmarks: ["SEAMS Department", "Smart Lecture Hall B-201", "Material Science Center"]
  },
  {
    id: "admin-block",
    name: "Administrative Block",
    shortCode: "Admin",
    subtitle: "University Governance & Student Services",
    description: "Executive leadership offices including Vice Chancellor, Registrar, Directorate of Student Affairs (DSA), Admissions, and Finance.",
    totalFloors: 4,
    floors: [0, 1, 2, 3],
    color: "#10B981",
    coordinates: { x: 450, y: 50, width: 160, height: 100 },
    amenities: ["Main Auditorium", "Student Helpdesk", "Fee Payment Counter", "Board Rooms"],
    keyLandmarks: ["Main Auditorium", "Directorate of Student Affairs (DSA)", "Registrar Office", "Admissions Cell"]
  },
  {
    id: "x-lab",
    name: "X-Lab Innovation Complex",
    shortCode: "X-Lab",
    subtitle: "Student Research, Startups & Hackathons",
    description: "24/7 student-led multidisciplinary laboratory complex housing Next Tech Lab, Ennovab, Hatchlab, and the X-Lab Auditorium.",
    totalFloors: 3,
    floors: [0, 1, 2],
    color: "#F59E0B",
    coordinates: { x: 150, y: 220, width: 160, height: 120 },
    amenities: ["High Performance GPU Cluster", "Maker Space & 3D Printers", "Hackathon Arena", "Lounge"],
    keyLandmarks: ["X-Lab Main Auditorium", "Next Tech Lab (Satoshi, Tesla, Turing)", "Ennovab Startup Hub"]
  },
  {
    id: "library",
    name: "Central Library",
    shortCode: "Library",
    subtitle: "Knowledge Resource Centre",
    description: "3-tier state-of-the-art central library with print repositories, digital reading cubicles, research discussion rooms, and OPAC terminals.",
    totalFloors: 3,
    floors: [0, 1, 2],
    color: "#EC4899",
    coordinates: { x: 230, y: 80, width: 140, height: 100 },
    amenities: ["OPAC Terminals", "Discussion Cubicles", "Digital Resource Center", "Silent Study Zones"],
    keyLandmarks: ["Circulation Desk", "Periodicals Section", "E-Resource Lab (Floor 2)"]
  },
  {
    id: "dining",
    name: "Central Dining & Food Street",
    shortCode: "Dining",
    subtitle: "Mess Halls & Food Courts",
    description: "Primary dining facilities featuring North & South Indian mess halls, Night Canteens, and Cafe Coffee Day.",
    totalFloors: 2,
    floors: [0, 1],
    color: "#EF4444",
    coordinates: { x: 740, y: 200, width: 150, height: 110 },
    amenities: ["Student Mess 1 & 2", "Faculty Dining Hall", "Cafe Coffee Day", "Night Canteen"],
    keyLandmarks: ["Central Mess Ground Floor", "Food Street & Juice Bar"]
  },
  {
    id: "hostels",
    name: "Student Residential Hostels",
    shortCode: "Hostels",
    subtitle: "Ganga, Yamuna, Godavari & Krishna Hostels",
    description: "Student residential living towers with indoor recreation, gymnasiums, medical dispensary, and study halls.",
    totalFloors: 10,
    floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    color: "#06B6D4",
    coordinates: { x: 750, y: 50, width: 160, height: 120 },
    amenities: ["Campus Clinic & Ambulance", "Gymnasium", "Laundromat", "Hostel Warden Offices"],
    keyLandmarks: ["Hostel Reception", "Medical Health Centre", "Convenience Store"]
  },
  {
    id: "sports",
    name: "Sports Complex & Grounds",
    shortCode: "Sports",
    subtitle: "Indoor & Outdoor Athletics",
    description: "Comprehensive athletic facilities including basketball courts, synthetic tennis courts, football turf, and indoor badminton arena.",
    totalFloors: 2,
    floors: [0, 1],
    color: "#14B8A6",
    coordinates: { x: 120, y: 370, width: 220, height: 110 },
    amenities: ["Indoor Badminton Arena", "Basketball & Tennis Courts", "Athletic Track", "Physical Education Office"],
    keyLandmarks: ["Main Football Arena", "Indoor Gymnasium"]
  }
];

export const CAMPUS_ROOMS: RoomLocation[] = [
  // Block A - Academic & Faculty
  {
    id: "alc-hall-1",
    name: "ALC Seminar Hall 1",
    code: "ALC-101",
    type: "seminar",
    buildingId: "block-a",
    floor: 1,
    capacity: 250,
    description: "Primary seminar hall with dual projectors, surround sound, and acoustic paneling for guest lectures and conferences.",
    tags: ["seminar", "auditorium", "alc", "event", "hall", "conference"]
  },
  {
    id: "alc-hall-2",
    name: "ALC Seminar Hall 2",
    code: "ALC-102",
    type: "seminar",
    buildingId: "block-a",
    floor: 1,
    capacity: 200,
    description: "Air-conditioned seminar and workshop hall frequently used for tech symposiums and department orientations.",
    tags: ["seminar", "workshop", "hall", "alc"]
  },
  {
    id: "fac-sravanthi",
    name: "Dr. Naga Sravanthi Puppala's Cabin",
    code: "A-412",
    type: "faculty",
    buildingId: "block-a",
    floor: 4,
    facultyName: "Dr. Naga Sravanthi Puppala",
    designation: "Assistant Professor & Research Mentor",
    department: "Department of Computer Science & Engineering",
    email: "dr_sravanthi@srmap.edu.in",
    timings: "Mon-Fri: 2:00 PM - 4:30 PM",
    description: "Faculty cabin specializing in AI, Machine Learning, and Agentic Systems research guidance.",
    tags: ["faculty", "cabin", "sravanthi", "cse", "ai", "mentor", "professor"]
  },
  {
    id: "fac-dean-cse",
    name: "Dean Office - School of Engineering & Sciences",
    code: "A-501",
    type: "admin",
    buildingId: "block-a",
    floor: 5,
    facultyName: "Prof. Dean SEAS",
    designation: "Dean of Engineering",
    department: "SEAS Academic Administration",
    email: "dean.seas@srmap.edu.in",
    timings: "Mon-Fri: 10:00 AM - 1:00 PM",
    description: "Executive office for academic approvals, curriculum guidelines, and department inquiries.",
    tags: ["dean", "seas", "engineering", "office", "admin"]
  },
  {
    id: "lab-ai-robotics",
    name: "Advanced AI & Robotics Lab",
    code: "A-304",
    type: "lab",
    buildingId: "block-a",
    floor: 3,
    capacity: 60,
    description: "High-spec GPU computing lab equipped with NVIDIA RTX workstations, ROS robotics kits, and edge computing rigs.",
    tags: ["lab", "ai", "robotics", "gpu", "cse", "workstations"]
  },
  {
    id: "lab-cse-cloud",
    name: "Cloud Computing & Networks Lab",
    code: "A-308",
    type: "lab",
    buildingId: "block-a",
    floor: 3,
    capacity: 70,
    description: "Network virtualization and distributed systems experimental testbed lab.",
    tags: ["lab", "cloud", "networks", "cse", "servers"]
  },
  {
    id: "fac-hod-cse",
    name: "HOD Office - Computer Science & Engineering",
    code: "A-401",
    type: "faculty",
    buildingId: "block-a",
    floor: 4,
    facultyName: "Head of Department (CSE)",
    designation: "Professor & Head",
    department: "Computer Science and Engineering",
    email: "hod.cse@srmap.edu.in",
    timings: "Mon-Fri: 11:30 AM - 1:00 PM",
    description: "Department head cabin for student grievances, course registration petitions, and academic clearances.",
    tags: ["hod", "cse", "department", "head", "faculty", "cabin"]
  },
  {
    id: "fac-hod-ece",
    name: "HOD Office - Electronics & Communication",
    code: "A-201",
    type: "faculty",
    buildingId: "block-a",
    floor: 2,
    facultyName: "Head of Department (ECE)",
    designation: "Professor & Head",
    department: "Electronics and Communication Engineering",
    email: "hod.ece@srmap.edu.in",
    timings: "Mon-Fri: 2:00 PM - 3:30 PM",
    description: "Department head office for ECE department matters, VLSI and signal processing laboratories.",
    tags: ["hod", "ece", "electronics", "faculty", "cabin"]
  },

  // X-Lab Complex
  {
    id: "xlab-auditorium",
    name: "X-Lab Main Auditorium",
    code: "X-AUD-100",
    type: "seminar",
    buildingId: "x-lab",
    floor: 0,
    capacity: 350,
    description: "Venue for the Google Solution Hunt Challenge 2026, GDG Hackathons, and national tech summits.",
    tags: ["xlab", "auditorium", "hackathon", "gdg", "google", "event"]
  },
  {
    id: "xlab-nexttech",
    name: "Next Tech Lab (Satoshi, Tesla, Turing labs)",
    code: "X-LAB-201",
    type: "lab",
    buildingId: "x-lab",
    floor: 1,
    capacity: 80,
    description: "Student-run multidisciplinary lab working on Blockchain (Satoshi), Deep Learning (Tesla), and Quantum Computing (Turing).",
    tags: ["nexttech", "lab", "blockchain", "satoshi", "tesla", "turing", "ai"]
  },
  {
    id: "xlab-ennovab",
    name: "Ennovab Startup Incubation Cell",
    code: "X-LAB-205",
    type: "facility",
    buildingId: "x-lab",
    floor: 1,
    capacity: 40,
    description: "Incubation center providing co-working space, mentorship, and cloud credits for SRM AP student startups.",
    tags: ["ennovab", "startup", "incubation", "entrepreneurship", "hatchlab"]
  },

  // Admin Block
  {
    id: "admin-main-auditorium",
    name: "SRM AP Grand Auditorium",
    code: "ADM-AUD-01",
    type: "seminar",
    buildingId: "admin-block",
    floor: 0,
    capacity: 1000,
    description: "Main university tiered auditorium for convocations, orientation ceremonies, and cultural fests.",
    tags: ["auditorium", "grand", "admin", "convocation", "fest"]
  },
  {
    id: "admin-dsa",
    name: "Directorate of Student Affairs (DSA)",
    code: "ADM-104",
    type: "admin",
    buildingId: "admin-block",
    floor: 1,
    facultyName: "Director of Student Affairs",
    department: "Student Affairs & Campus Welfare",
    email: "dsa@srmap.edu.in",
    timings: "Mon-Fri: 9:30 AM - 5:00 PM",
    description: "Assists with student clubs, event permissions, hostel grievances, ID cards, and student welfare.",
    tags: ["dsa", "student affairs", "clubs", "permission", "welfare", "admin"]
  },
  {
    id: "admin-finance",
    name: "Finance & Accounts Counter",
    code: "ADM-G02",
    type: "admin",
    buildingId: "admin-block",
    floor: 0,
    department: "Finance & Accounts",
    timings: "Mon-Fri: 9:00 AM - 4:00 PM",
    description: "Student fee receipts, scholarship disbursements, and no-dues clearance verification desk.",
    tags: ["fee", "finance", "accounts", "challan", "scholarship", "no dues"]
  },
  {
    id: "admin-registrar",
    name: "Office of the Registrar",
    code: "ADM-201",
    type: "admin",
    buildingId: "admin-block",
    floor: 2,
    facultyName: "Registrar SRM AP",
    department: "University Governance",
    email: "registrar@srmap.edu.in",
    timings: "By Appointment",
    description: "Official university records, bonafide certificates, transcripts, and formal academic administration.",
    tags: ["registrar", "transcript", "bonafide", "certificate", "admin"]
  },

  // Central Library
  {
    id: "lib-circulation",
    name: "Library Circulation & OPAC Desk",
    code: "LIB-G01",
    type: "library",
    buildingId: "library",
    floor: 0,
    description: "Book issue/return, Koha OPAC search terminals, student RFID book card renewals.",
    tags: ["library", "opac", "books", "circulation", "koha"]
  },
  {
    id: "lib-digital-center",
    name: "Digital Research & Media Center",
    code: "LIB-201",
    type: "library",
    buildingId: "library",
    floor: 2,
    capacity: 90,
    description: "High-speed workstations with IEEE Xplore, ScienceDirect, Springer, and ACM Digital Library subscriptions.",
    tags: ["library", "digital", "research", "ieee", "journal", "reading"]
  },

  // Dining & Food
  {
    id: "dining-mess-1",
    name: "Central Dining Hall (North & South Indian)",
    code: "DINE-G01",
    type: "dining",
    buildingId: "dining",
    floor: 0,
    timings: "Breakfast: 7:30-9:30 AM | Lunch: 12:00-2:30 PM | Dinner: 7:30-9:30 PM",
    description: "Spacious buffet dining providing hygienic multi-cuisine meals for residential students.",
    tags: ["mess", "food", "dining", "breakfast", "lunch", "dinner", "meals"]
  },
  {
    id: "dining-ccd",
    name: "Cafe Coffee Day & Night Food Court",
    code: "DINE-F02",
    type: "dining",
    buildingId: "dining",
    floor: 1,
    timings: "10:00 AM - 1:00 AM",
    description: "Coffee, quick snacks, sandwiches, juices, and late-night food items.",
    tags: ["cafe", "ccd", "snacks", "coffee", "night canteen", "food"]
  },

  // Hostels & Facilities
  {
    id: "hostel-clinic",
    name: "Campus Medical Health Centre & Pharmacy",
    code: "HST-CLINIC",
    type: "facility",
    buildingId: "hostels",
    floor: 0,
    timings: "24/7 Emergency Care",
    description: "Resident doctor on duty, primary medication, first aid, and 24/7 on-campus ambulance.",
    tags: ["medical", "clinic", "doctor", "health", "hospital", "pharmacy", "ambulance", "emergency"]
  }
];

export interface WaypointRoute {
  fromId: string;
  toId: string;
  distanceMeters: number;
  estimatedMinutes: number;
  steps: string[];
}

export const WAYPOINTS: Record<string, string> = {
  "main-gate": "Main Campus Arch Gate",
  "block-a-ground": "Block A Main Atrium (Ground Floor)",
  "block-b-ground": "Block B Main Entrance",
  "admin-atrium": "Admin Block Front Portico",
  "xlab-entrance": "X-Lab Innovation Plaza",
  "central-library": "Library Main Entrance",
  "dining-hub": "Dining Hall Front Gate",
  "hostel-square": "Hostel Central Quadrangle"
};

export const getWalkingRoute = (startKey: string, destRoom: RoomLocation): WaypointRoute => {
  const building = BUILDINGS.find((b) => b.id === destRoom.buildingId);
  const buildingName = building ? building.name : "Target Building";
  const floorText =
    destRoom.floor === 0
      ? "Ground Floor"
      : destRoom.floor === 1
      ? "1st Floor"
      : destRoom.floor === 2
      ? "2nd Floor"
      : `${destRoom.floor}th Floor`;

  const steps: string[] = [
    `Start from ${WAYPOINTS[startKey] || "Starting Location"}.`,
    `Walk along the central palm avenue towards ${buildingName}.`,
    `Enter through the main front foyer of ${buildingName}.`,
  ];

  if (destRoom.floor > 0) {
    steps.push(
      `Take either the East Elevator or Central Staircase up to ${floorText}.`
    );
  } else {
    steps.push(`Stay on the Ground Floor corridor.`);
  }

  steps.push(
    `Follow corridor signage to Room / Cabin ${destRoom.code} (${destRoom.name}).`
  );

  const estimatedMeters = 80 + destRoom.floor * 30 + Math.floor(Math.random() * 60);
  const estimatedMinutes = Math.max(1, Math.ceil(estimatedMeters / 60));

  return {
    fromId: startKey,
    toId: destRoom.id,
    distanceMeters: estimatedMeters,
    estimatedMinutes: estimatedMinutes,
    steps: steps,
  };
};
