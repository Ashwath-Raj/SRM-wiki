export interface RoomLocation {
  id: string;
  roomNumber: string;
  name: string;
  category: "faculty_cabin" | "lab" | "classroom" | "seminar_hall" | "administrative" | "amenity" | "service";
  floor: number;
  buildingId: string;
  department?: string;
  facultyName?: string;
  facultyEmail?: string;
  timings?: string;
  description: string;
  directions: string;
  coordinates?: { x: number; y: number; width: number; height: number };
}

export interface Building {
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
  rooms: RoomLocation[];
}

export const CAMPUS_BUILDINGS: Building[] = [
  {
    id: "admin-block",
    name: "Administrative Block",
    shortCode: "Admin",
    subtitle: "University Governance & Student Services",
    description: "Executive leadership offices including Vice Chancellor, Registrar, Directorate of Student Affairs (DSA), Admissions, and Finance.",
    totalFloors: 4,
    floors: [0, 1, 2, 3],
    color: "#10B981", // Emerald
    coordinates: { x: 420, y: 80, width: 180, height: 110 },
    amenities: ["Main Auditorium", "Student Helpdesk", "Fee Payment Counter", "Board Rooms", "Executive Lounge"],
    keyLandmarks: ["Main Auditorium (Ground Floor)", "Directorate of Student Affairs (DSA - 1st Floor)", "Registrar Office (2nd Floor)", "Vice Chancellor Secretariat (3rd Floor)"],
    rooms: [
      {
        id: "admin-g01",
        roomNumber: "Auditorium-1",
        name: "University Main Auditorium",
        category: "seminar_hall",
        floor: 0,
        buildingId: "admin-block",
        description: "1000-seater central university auditorium for convocations, inaugural ceremonies, and cultural fests.",
        directions: "Enter through the central glass portico of Admin Block; the auditorium entrance is straight ahead.",
      },
      {
        id: "admin-g02",
        roomNumber: "ADM-G02",
        name: "Student Helpdesk & Admissions Cell",
        category: "administrative",
        floor: 0,
        buildingId: "admin-block",
        department: "Admissions",
        description: "Enquiry desk for student verification, ID card renewals, and new admissions verification.",
        directions: "Ground floor lobby, immediately on your left after entering the main door.",
      },
      {
        id: "admin-101",
        roomNumber: "ADM-101",
        name: "Directorate of Student Affairs (DSA)",
        category: "administrative",
        floor: 1,
        buildingId: "admin-block",
        department: "Student Affairs",
        description: "Office for student club approvals, event permissions, hostel grievances, and student council.",
        directions: "Take the central stairs or elevator to 1st Floor; turn right and follow the DSA signboards.",
      },
      {
        id: "admin-105",
        roomNumber: "ADM-105",
        name: "Finance & Accounts Counter",
        category: "administrative",
        floor: 1,
        buildingId: "admin-block",
        department: "Finance",
        description: "Tuition fee challans, scholarship endorsements, and financial clearance desk.",
        directions: "1st Floor, East Wing, adjacent to the Directorate of Student Affairs.",
      },
      {
        id: "admin-201",
        roomNumber: "ADM-201",
        name: "Registrar Office",
        category: "administrative",
        floor: 2,
        buildingId: "admin-block",
        department: "Registrar Secretariat",
        description: "Official academic attestations, transcripts dispatch, and university administration.",
        directions: "2nd Floor, central hallway directly opposite the main elevators.",
      },
      {
        id: "admin-301",
        roomNumber: "ADM-301",
        name: "Vice Chancellor Secretariat",
        category: "administrative",
        floor: 3,
        buildingId: "admin-block",
        department: "Executive Office",
        description: "Office of the Vice Chancellor and Executive Deans.",
        directions: "3rd Floor executive wing with restricted visitor badge access.",
      }
    ]
  },
  {
    id: "block-a",
    name: "Academic Block A",
    shortCode: "Block A",
    subtitle: "School of Engineering & Applied Sciences (SEAS)",
    description: "Primary academic building for Computer Science & Engineering, Artificial Intelligence, and Applied Sciences.",
    totalFloors: 5,
    floors: [0, 1, 2, 3, 4],
    color: "#3B82F6", // Blue
    coordinates: { x: 140, y: 80, width: 220, height: 130 },
    amenities: ["ALC Seminar Hall", "High-Tech Computer Labs", "Dean SEAS Office", "Faculty Cabins", "Smart Classrooms"],
    keyLandmarks: ["ALC Seminar Hall (Ground)", "Dean SEAS (Level 1)", "CSE Research Lab (Level 3)", "Supercomputing Cluster (Level 4)"],
    rooms: [
      {
        id: "block-a-g01",
        roomNumber: "ALC-Sem-Hall",
        name: "ALC Seminar Hall (Block A)",
        category: "seminar_hall",
        floor: 0,
        buildingId: "block-a",
        description: "300-capacity state-of-the-art acoustic seminar hall for guest lectures, hackathons, and technical symposiums.",
        directions: "Enter Block A main lobby; turn left past security desk, ALC entrance is 20 meters down the corridor.",
      },
      {
        id: "block-a-101",
        roomNumber: "A-101",
        name: "Dean SEAS Secretariat",
        category: "administrative",
        floor: 1,
        buildingId: "block-a",
        department: "School of Engineering & Applied Sciences",
        description: "Office of the Dean, School of Engineering & Applied Sciences.",
        directions: "Take staircase A1 to 1st floor; turn right to the Dean Suite.",
      },
      {
        id: "block-a-108",
        roomNumber: "A-108",
        name: "Faculty Cabin — Dr. Naga Sravanthi Puppala",
        category: "faculty_cabin",
        floor: 1,
        buildingId: "block-a",
        department: "Computer Science & Engineering",
        facultyName: "Dr. Naga Sravanthi Puppala",
        facultyEmail: "dr_sravanthi@srmap.edu.in",
        timings: "Mon-Fri: 2:00 PM - 4:30 PM",
        description: "Associate Professor, Specializing in Machine Learning, Agentic Systems & Data Analytics.",
        directions: "1st Floor, Corridor A-North, Room 108 on the right wing.",
      },
      {
        id: "block-a-204",
        roomNumber: "A-204",
        name: "Faculty Cabin — Dr. Sobin C C",
        category: "faculty_cabin",
        floor: 2,
        buildingId: "block-a",
        department: "Computer Science & Engineering",
        facultyName: "Dr. Sobin C C",
        facultyEmail: "sobin.c@srmap.edu.in",
        timings: "Tue & Thu: 10:00 AM - 1:00 PM",
        description: "Head of Department (HoD) CSE, Distributed Systems & Wireless Sensor Networks.",
        directions: "2nd Floor, HoD CSE Wing, Room 204 near the central atrium.",
      },
      {
        id: "block-a-212",
        roomNumber: "A-212",
        name: "Advanced Artificial Intelligence & NLP Lab",
        category: "lab",
        floor: 2,
        buildingId: "block-a",
        department: "CSE / AI",
        description: "GPU-enabled workstation facility with 60 high-performance Dell workstations.",
        directions: "2nd floor, West Wing corner past the smart classroom cluster.",
      },
      {
        id: "block-a-301",
        roomNumber: "A-301",
        name: "Smart Lecture Hall A-301",
        category: "classroom",
        floor: 3,
        buildingId: "block-a",
        department: "Engineering Sciences",
        description: "Tiered 120-seat interactive lecture hall with dual 4K laser projection.",
        directions: "3rd floor, central hallway directly facing the elevator bank.",
      },
      {
        id: "block-a-401",
        roomNumber: "A-401",
        name: "High Performance Computing & Cloud Server Lab",
        category: "lab",
        floor: 4,
        buildingId: "block-a",
        department: "CSE / IT Infrastructure",
        description: "University primary research server node and private cloud computing facility.",
        directions: "4th floor, restricted access glass bay at the north corner.",
      }
    ]
  },
  {
    id: "block-b",
    name: "Academic Block B",
    shortCode: "Block B",
    subtitle: "School of Entrepreneurship, Management & Allied Sciences",
    description: "Hub for Electronics, Mechanical, Civil, Management Studies, Chemistry and Physics Laboratories.",
    totalFloors: 5,
    floors: [0, 1, 2, 3, 4],
    color: "#8B5CF6", // Purple
    coordinates: { x: 140, y: 260, width: 220, height: 130 },
    amenities: ["Robotics & Mechatronics Lab", "SEAMS Management Center", "Physics Research Center", "Faculty Cabins"],
    keyLandmarks: ["Mechatronics & Drone Testing Lab (Ground)", "SEAMS Center (Level 2)", "VLSI Design Lab (Level 3)"],
    rooms: [
      {
        id: "block-b-g05",
        roomNumber: "B-G05",
        name: "Robotics & Autonomous Mechatronics Lab",
        category: "lab",
        floor: 0,
        buildingId: "block-b",
        department: "Mechanical & Mechatronics",
        description: "Industrial robotic arms, LiDAR sensor testing arena, and drone assembly station.",
        directions: "Ground Floor, South Wing, heavy machinery entrance at the rear bay.",
      },
      {
        id: "block-b-102",
        roomNumber: "B-102",
        name: "Faculty Cabin — Dr. Mahesh Kumar",
        category: "faculty_cabin",
        floor: 1,
        buildingId: "block-b",
        department: "Electronics & Communication Engineering",
        facultyName: "Dr. Mahesh Kumar",
        facultyEmail: "mahesh.k@srmap.edu.in",
        timings: "Mon & Wed: 11:30 AM - 1:30 PM",
        description: "Professor, VLSI & Embedded IoT Systems.",
        directions: "1st Floor, ECE Department Faculty Corridor, Room 102.",
      },
      {
        id: "block-b-201",
        roomNumber: "B-201",
        name: "Smart Lecture Hall B-201",
        category: "classroom",
        floor: 2,
        buildingId: "block-b",
        department: "Management Studies",
        description: "Case study lecture hall with collaborative round-table layout.",
        directions: "2nd Floor, central concourse overlooking the garden courtyard.",
      },
      {
        id: "block-b-308",
        roomNumber: "B-308",
        name: "VLSI & Semiconductor Research Facility",
        category: "lab",
        floor: 3,
        buildingId: "block-b",
        department: "ECE",
        description: "Cadence & Synopsys EDA tool licenses with cleanroom workstation environment.",
        directions: "3rd floor, East Wing end corridor.",
      }
    ]
  },
  {
    id: "x-lab",
    name: "X-Lab Innovation Complex",
    shortCode: "X-Lab",
    subtitle: "Student Research, Startups & Hackathons",
    description: "24/7 student-led multidisciplinary laboratory complex housing Next Tech Lab, Ennovab, Hatchlab, and the X-Lab Auditorium.",
    totalFloors: 3,
    floors: [0, 1, 2],
    color: "#F59E0B", // Amber
    coordinates: { x: 420, y: 240, width: 180, height: 130 },
    amenities: ["High Performance GPU Cluster", "Maker Space & 3D Printers", "Hackathon Arena", "Startup Lounge"],
    keyLandmarks: ["X-Lab Main Auditorium (Ground)", "Next Tech Lab (Level 1)", "Ennovab Startup Hub (Level 2)"],
    rooms: [
      {
        id: "xlab-aud",
        roomNumber: "X-Auditorium",
        name: "X-Lab Main Auditorium & Hackathon Arena",
        category: "seminar_hall",
        floor: 0,
        buildingId: "x-lab",
        description: "Flagship 24-hour hackathon arena equipped with high-speed fiber gigabit networking and presentation stages (Venue for GDG Google Solution Hunt).",
        directions: "Enter through X-Lab main revolving doors; the arena opens directly into the ground floor atrium.",
      },
      {
        id: "xlab-101",
        roomNumber: "X-101",
        name: "Next Tech Lab (Satoshi, Tesla, Turing Pods)",
        category: "lab",
        floor: 1,
        buildingId: "x-lab",
        department: "Next Tech Lab",
        description: "Student-driven research lab operating across Quantum Computing, Blockchain (Satoshi), Deep Learning (Turing), and IoT (Tesla).",
        directions: "Take the spiral stairs to 1st floor; transparent glass studio with neon signboards.",
      },
      {
        id: "xlab-201",
        roomNumber: "X-201",
        name: "Ennovab & Hatchlab Incubation Center",
        category: "administrative",
        floor: 2,
        buildingId: "x-lab",
        department: "Innovation & Incubation",
        description: "SRM AP startup incubator with co-working desks, mentorship meeting rooms, and angel pitch boards.",
        directions: "2nd floor, accessible via lift B.",
      }
    ]
  },
  {
    id: "library",
    name: "Central Library",
    shortCode: "Library",
    subtitle: "Knowledge Resource Centre",
    description: "3-tier state-of-the-art central library with print repositories, digital reading cubicles, research discussion rooms, and OPAC terminals.",
    totalFloors: 3,
    floors: [0, 1, 2],
    color: "#06B6D4", // Cyan
    coordinates: { x: 650, y: 120, width: 170, height: 120 },
    amenities: ["OPAC Terminals", "Silent Study Cubicles", "Research Pods", "Digital Media Lab", "Cafeteria Terrace"],
    keyLandmarks: ["Circulation Counter (Ground)", "Engineering & Science Stacks (Level 1)", "Doctoral Research Lounge (Level 2)"],
    rooms: [
      {
        id: "lib-g01",
        roomNumber: "LIB-G01",
        name: "Circulation Desk & RFID Check-In",
        category: "service",
        floor: 0,
        buildingId: "library",
        description: "Automated RFID book check-in/out stations, new arrival displays, and librarian helpdesk.",
        directions: "Ground floor entry immediately past the security turnstiles.",
      },
      {
        id: "lib-101",
        roomNumber: "LIB-101",
        name: "Engineering & Technology Print Stacks",
        category: "amenity",
        floor: 1,
        buildingId: "library",
        description: "Over 40,000 reference textbooks and IEEE/ACM monographs with quiet study bays.",
        directions: "1st floor, take the open staircase up from the main lobby.",
      },
      {
        id: "lib-201",
        roomNumber: "LIB-201",
        name: "Digital Reading Lounge & Research Pods",
        category: "amenity",
        floor: 2,
        buildingId: "library",
        description: "Acoustic glass discussion pods with video conferencing monitors for research groups.",
        directions: "2nd floor, turn left into the North Wing quiet zone.",
      }
    ]
  },
  {
    id: "dining-complex",
    name: "Dining & Food Court Complex",
    shortCode: "Dining",
    subtitle: "Hostel Mess & Food Court",
    description: "Central dining facility housing North/South Indian mess halls, bakery, juice bars, and retail cafeterias.",
    totalFloors: 2,
    floors: [0, 1],
    color: "#EC4899", // Pink
    coordinates: { x: 650, y: 280, width: 170, height: 110 },
    amenities: ["Central Mess Halls", "Food Court / Kiosks", "Juice Bar", "Bakery & Coffee Hub"],
    keyLandmarks: ["Student Mess Ground Floor", "Food Court First Floor", "Amul & Bakery Kiosk"],
    rooms: [
      {
        id: "dining-g01",
        roomNumber: "MESS-1",
        name: "Central Student Mess (North & South Wings)",
        category: "amenity",
        floor: 0,
        buildingId: "dining-complex",
        description: "Air-conditioned 1200-seat multi-cuisine dining hall serving 4 meals daily.",
        directions: "Ground floor main portico entrance.",
      },
      {
        id: "dining-101",
        roomNumber: "FC-101",
        name: "Food Court, Cafes & Night Canteen",
        category: "amenity",
        floor: 1,
        buildingId: "dining-complex",
        description: "Quick-service food outlets, coffee stations, fresh fruit juices, and midnight snacks.",
        directions: "1st floor via the external covered ramp or internal stairs.",
      }
    ]
  },
  {
    id: "hostels",
    name: "Residential Hostels & Towers",
    shortCode: "Hostels",
    subtitle: "Student Living Quarters",
    description: "Residential towers (Ganga, Yamuna, Godavari, Krishna, Narmada) with warden offices, gym, and medical centre.",
    totalFloors: 10,
    floors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    color: "#6366F1", // Indigo
    coordinates: { x: 860, y: 120, width: 150, height: 260 },
    amenities: ["24/7 University Health Clinic", "Gymnasium", "Warden Offices", "Laundromat", "Indoor Games Room"],
    keyLandmarks: ["Health & Emergency Clinic (Ganga Ground)", "Hostel Warden Office (Yamuna 1st Floor)", "Central Gym"],
    rooms: [
      {
        id: "hostel-clinic",
        roomNumber: "HC-G01",
        name: "24/7 Campus Health Center & Pharmacy",
        category: "service",
        floor: 0,
        buildingId: "hostels",
        description: "Full-time resident medical doctors, emergency ambulances, and essential medicine pharmacy.",
        directions: "Ground floor of Ganga Hostel Tower, clearly marked with Red Cross signage.",
      },
      {
        id: "hostel-warden",
        roomNumber: "WO-101",
        name: "Chief Hostel Warden Secretariat",
        category: "administrative",
        floor: 1,
        buildingId: "hostels",
        department: "Hostel Administration",
        description: "Out-pass verification, room allotments, and resident student affairs.",
        directions: "Yamuna Block, 1st Floor Administrative Lobby.",
      }
    ]
  }
];

export const ALL_ROOMS: RoomLocation[] = CAMPUS_BUILDINGS.flatMap(b => b.rooms);

export const CATEGORY_LABELS: Record<RoomLocation["category"], { label: string; color: string; bg: string }> = {
  faculty_cabin: { label: "Faculty Cabin", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" },
  lab: { label: "Research Lab", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/30" },
  seminar_hall: { label: "Seminar Hall / Auditorium", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" },
  classroom: { label: "Lecture Hall", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" },
  administrative: { label: "Administrative Office", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/30" },
  amenity: { label: "Campus Amenity", color: "text-cyan-500", bg: "bg-cyan-500/10 border-cyan-500/30" },
  service: { label: "Student Service & Clinic", color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/30" },
};
