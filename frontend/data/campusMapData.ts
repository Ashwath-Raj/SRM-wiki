// REAL SRM University - AP Campus Map Data
// Surveyed from OpenStreetMap Open Data & University Master Plan
// Location: Neerukonda, Mangalagiri Mandal, Amaravati, Andhra Pradesh 522240

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
  cx: number;
  cy: number;
  path: string;
  bbox: { x: number; y: number; width: number; height: number };
  amenities: string[];
  keyLandmarks: string[];
  rooms: RoomLocation[];
}

export interface Landmark {
  id: string;
  name: string;
  category: "gate" | "food" | "sports" | "plaza" | "facility";
  cx: number;
  cy: number;
  path: string;
  color: string;
  description: string;
}

export const CAMPUS_BUILDINGS: Building[] = [
  {
    "id": "cv-raman-block",
    "name": "CV Raman Block",
    "shortCode": "CVR",
    "subtitle": "School of Engineering & Applied Sciences (SEAS)",
    "description": "Primary multi-story academic complex housing the Department of Computer Science & Engineering, Central Library stacks, Active Learning Classrooms (ALC), Dean SEAS office, and specialized computing laboratories.",
    "totalFloors": 7,
    "floors": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "color": "#3B82F6",
    "cx": 149.8,
    "cy": 817.3,
    "path": "M 96.9,760.7 L 286.6,761.1 L 287.4,803.0 L 263.4,845.0 L 132.5,854.1 L 102.7,868.3 L 86.4,869.8 L 72.5,850.0 L 72.5,800.4 L 96.9,760.7 Z",
    "bbox": {
      "x": 72.5,
      "y": 760.7,
      "width": 214.89999999999998,
      "height": 109.09999999999991
    },
    "amenities": [
      "Central Library Stacks",
      "Active Learning Classrooms (ALC 1-4)",
      "Dean SEAS Secretariat",
      "AI & Machine Learning Lab",
      "Tiered Smart Lecture Halls",
      "High-Speed Wi-Fi Lounges"
    ],
    "keyLandmarks": [
      "Central Library (Level 1 & 2)",
      "ALC-1 & ALC-2 (Level 2)",
      "Dean SEAS Office (Level 3)",
      "CSE Faculty Cabins (Level 3 & 4)",
      "Advanced AI & Cloud Lab (Level 5)",
      "Tiered Classroom S-712 (Level 7)"
    ],
    "rooms": [
      {
        "id": "cvr-lib",
        "roomNumber": "LIB-101",
        "name": "Central Library & Digital Reading Room",
        "category": "amenity",
        "floor": 1,
        "buildingId": "cv-raman-block",
        "department": "Library & Information Services",
        "description": "30,000+ volumes, IEEE/ACM digital access terminals, RFID checkout, and silent study cubicles.",
        "directions": "Enter CV Raman Block main porch; the library entrance is immediately to the right of the central atrium."
      },
      {
        "id": "cvr-alc1",
        "roomNumber": "ALC-1",
        "name": "Active Learning Classroom 1 (ALC-1)",
        "category": "seminar_hall",
        "floor": 2,
        "buildingId": "cv-raman-block",
        "department": "SEAS",
        "description": "Collaborative multi-display smart classroom with interactive digital whiteboards and round-table pods.",
        "directions": "Take central elevator or stairs to Level 2; turn left down the academic corridor, ALC-1 is on your left."
      },
      {
        "id": "cvr-alc2",
        "roomNumber": "ALC-2",
        "name": "Active Learning Classroom 2 (ALC-2)",
        "category": "seminar_hall",
        "floor": 2,
        "buildingId": "cv-raman-block",
        "department": "SEAS",
        "description": "120-capacity tiered active learning hall equipped with dual 4K laser projection and audio conferencing.",
        "directions": "Level 2, directly adjacent to ALC-1 facing the central courtyard."
      },
      {
        "id": "cvr-dean",
        "roomNumber": "CVR-301",
        "name": "Dean SEAS Secretariat & Conference Room",
        "category": "administrative",
        "floor": 3,
        "buildingId": "cv-raman-block",
        "department": "School of Engineering & Applied Sciences",
        "description": "Executive office of the Dean, academic governance, and accreditation conference hall.",
        "directions": "Take central lift to Level 3; exit into the north wing executive suite."
      },
      {
        "id": "cvr-cabin-sravanthi",
        "roomNumber": "Cabin 312",
        "name": "Faculty Cabin \u2014 Dr. Naga Sravanthi Puppala",
        "category": "faculty_cabin",
        "floor": 3,
        "buildingId": "cv-raman-block",
        "department": "Computer Science & Engineering",
        "facultyName": "Dr. Naga Sravanthi Puppala",
        "facultyEmail": "dr_sravanthi@srmap.edu.in",
        "timings": "Mon, Wed, Fri: 2:30 PM - 4:30 PM",
        "description": "Associate Professor, CSE. Research areas: Agentic Artificial Intelligence, Generative AI, Machine Learning, and Intelligent Search.",
        "directions": "Level 3, CSE Faculty Corridor (East Wing), Cabin 312 on the right-hand side."
      },
      {
        "id": "cvr-cabin-sobin",
        "roomNumber": "Cabin 402",
        "name": "Faculty Cabin \u2014 Dr. Sobin C C (HoD CSE)",
        "category": "faculty_cabin",
        "floor": 4,
        "buildingId": "cv-raman-block",
        "department": "Computer Science & Engineering",
        "facultyName": "Dr. Sobin C C",
        "facultyEmail": "sobin.c@srmap.edu.in",
        "timings": "Tue & Thu: 10:30 AM - 1:00 PM",
        "description": "Head of Department (HoD) CSE. Specialization: Wireless Sensor Networks, Internet of Things, Mobile Edge Computing.",
        "directions": "Level 4, HoD Office Suite directly opposite the central department library."
      },
      {
        "id": "cvr-ai-lab",
        "roomNumber": "CVR-504",
        "name": "Advanced AI, Deep Learning & GPU Cluster Lab",
        "category": "lab",
        "floor": 5,
        "buildingId": "cv-raman-block",
        "department": "CSE",
        "description": "High-performance computing lab with NVIDIA A100/RTX GPU workstations for deep learning research.",
        "directions": "Take West elevator to Level 5; head to the end of the computing corridor, room 504."
      },
      {
        "id": "cvr-s712",
        "roomNumber": "S-712",
        "name": "Tiered Lecture Hall S-712",
        "category": "classroom",
        "floor": 7,
        "buildingId": "cv-raman-block",
        "department": "Engineering Sciences",
        "description": "180-seater tiered auditorium-style lecture theater with acoustic panelling and multi-screen projection.",
        "directions": "Level 7 (South Wing), turn right from the South lift lobby."
      }
    ]
  },
  {
    "id": "sr-block",
    "name": "Srinivasa Ramanujan Block (SR Block)",
    "shortCode": "SRB",
    "subtitle": "School of Management (SEAMS) & Mathematical Sciences",
    "description": "Dedicated academic facility for Department of Mathematics, Management Studies, Economics, and Liberal Arts with corporate seminar suites.",
    "totalFloors": 5,
    "floors": [
      1,
      2,
      3,
      4,
      5
    ],
    "color": "#8B5CF6",
    "cx": 427.2,
    "cy": 677.0,
    "path": "M 355.9,616.1 L 422.0,616.1 L 421.0,623.8 L 455.4,626.6 L 454.1,618.7 L 481.1,615.8 L 484.8,683.4 L 467.5,683.4 L 467.5,704.3 L 483.4,706.0 L 485.7,773.1 L 472.7,797.3 L 383.9,796.5 L 382.0,696.9 L 346.2,695.7 L 342.9,639.5 L 355.9,616.1 Z",
    "bbox": {
      "x": 342.9,
      "y": 615.8,
      "width": 142.8,
      "height": 181.5
    },
    "amenities": [
      "Case Study Lecture Theaters",
      "Bloomberg Financial Terminal Lab",
      "SEAMS Placement Cell",
      "Faculty Cabins",
      "Department Library"
    ],
    "keyLandmarks": [
      "Bloomberg Trading Terminal (Level 1)",
      "SEAMS Seminar Hall (Level 2)",
      "Department of Mathematics (Level 3)",
      "Dean SEAMS Office (Level 4)"
    ],
    "rooms": [
      {
        "id": "srb-bloomberg",
        "roomNumber": "SRB-102",
        "name": "Bloomberg Financial Analytics & Market Lab",
        "category": "lab",
        "floor": 1,
        "buildingId": "sr-block",
        "department": "Management Studies",
        "description": "Real-time financial market data terminals for algorithmic trading and portfolio management research.",
        "directions": "Ground floor concourse, left wing past the central reception."
      },
      {
        "id": "srb-seminar",
        "roomNumber": "SRB-201",
        "name": "Ramanujan Executive Seminar Hall",
        "category": "seminar_hall",
        "floor": 2,
        "buildingId": "sr-block",
        "department": "Management Studies",
        "description": "200-capacity executive amphitheater for guest lectures, business symposiums, and startup pitches.",
        "directions": "Level 2, directly facing the main central staircase."
      },
      {
        "id": "srb-math",
        "roomNumber": "SRB-305",
        "name": "Department of Mathematics & Computing",
        "category": "administrative",
        "floor": 3,
        "buildingId": "sr-block",
        "department": "Mathematics",
        "description": "Faculty research suites in applied mathematics, cryptography, and numerical simulations.",
        "directions": "Level 3, East corridor."
      }
    ]
  },
  {
    "id": "x-lab",
    "name": "X - Lab Innovation Complex",
    "shortCode": "X-Lab",
    "subtitle": "24/7 Student Innovation Hub, Next Tech Lab & Startups",
    "description": "Iconic 24-hour student-run research and entrepreneurial sandbox housing Next Tech Lab, Ennovab incubator, Hatchlab, MakerSpace, and Hackathon Arena.",
    "totalFloors": 3,
    "floors": [
      1,
      2,
      3
    ],
    "color": "#F59E0B",
    "cx": 594.6,
    "cy": 486.7,
    "path": "M 554.8,433.8 L 657.6,434.6 L 655.8,565.6 L 549.8,565.6 L 554.8,433.8 Z",
    "bbox": {
      "x": 549.8,
      "y": 433.8,
      "width": 107.80000000000007,
      "height": 131.8
    },
    "amenities": [
      "24/7 Access for Students",
      "High-Speed Fiber Gigabit LAN",
      "3D Rapid Prototyping MakerSpace",
      "Hackathon Arena",
      "Next Tech Lab Research Pods"
    ],
    "keyLandmarks": [
      "X-Lab Hackathon Arena (Level 1)",
      "Next Tech Lab Satoshi, Tesla, Turing Pods (Level 2)",
      "Ennovab Startup Incubation Center (Level 3)"
    ],
    "rooms": [
      {
        "id": "xlab-arena",
        "roomNumber": "X-Arena",
        "name": "X-Lab Hackathon Arena & Pitch Stage",
        "category": "seminar_hall",
        "floor": 1,
        "buildingId": "x-lab",
        "department": "Innovation Council",
        "description": "The live venue for GDG Google Solution Hunt Challenge, overnight 36-hour hackathons, demo days, and developer meetups.",
        "directions": "Enter X-Lab through the main double glass doors; opens directly into the ground floor open-plan arena."
      },
      {
        "id": "xlab-nexttech",
        "roomNumber": "X-201",
        "name": "Next Tech Lab (Satoshi, Tesla, Turing & Feynman)",
        "category": "lab",
        "floor": 2,
        "buildingId": "x-lab",
        "department": "Next Tech Lab",
        "description": "Multi-award-winning QS Reimagine Education student lab conducting research in Blockchain (Satoshi), Deep Learning (Turing), IoT/Robotics (Tesla), and Quantum Computing (Feynman).",
        "directions": "Level 2, glass studio on the right with neon signboards."
      },
      {
        "id": "xlab-ennovab",
        "roomNumber": "X-301",
        "name": "Ennovab & Hatchlab Startup Incubator",
        "category": "administrative",
        "floor": 3,
        "buildingId": "x-lab",
        "department": "Innovation & Entrepreneurship",
        "description": "Student co-working desks, venture incubation office, patent filing cell, and angel investor meeting lounge.",
        "directions": "Level 3, top floor open co-working space."
      }
    ]
  },
  {
    "id": "jc-bose-block",
    "name": "JC Bose Block",
    "shortCode": "JCB",
    "subtitle": "School of Basic Sciences & Advanced Research Labs",
    "description": "Dedicated science complex for Chemistry, Physics, and Biological Sciences research equipped with spectroscopy, microscopy, and synthesis facilities.",
    "totalFloors": 4,
    "floors": [
      1,
      2,
      3,
      4
    ],
    "color": "#06B6D4",
    "cx": 708.2,
    "cy": 486.6,
    "path": "M 683.2,436.0 L 749.7,436.0 L 742.3,561.9 L 682.8,562.8 L 683.2,436.0 Z",
    "bbox": {
      "x": 682.8,
      "y": 436.0,
      "width": 66.90000000000009,
      "height": 126.79999999999995
    },
    "amenities": [
      "Chemical Wet Synthesis Labs",
      "Analytical Instrumentation Center",
      "Cleanroom Facility",
      "Bio-Nano Research Lab"
    ],
    "keyLandmarks": [
      "Advanced Chemistry Research Facility (Level 1)",
      "Nanotechnology & Materials Lab (Level 2)",
      "Physics Quantum Optics Lab (Level 3)"
    ],
    "rooms": [
      {
        "id": "jcb-chem",
        "roomNumber": "JCB-105",
        "name": "Advanced Synthetic Chemistry Lab",
        "category": "lab",
        "floor": 1,
        "buildingId": "jc-bose-block",
        "department": "Chemistry",
        "description": "Fume hoods, rotary evaporators, and organic synthesis analytical benches.",
        "directions": "Level 1, North wing with specialized exhaust systems."
      },
      {
        "id": "jcb-nano",
        "roomNumber": "JCB-210",
        "name": "Nanotechnology & Quantum Materials Lab",
        "category": "lab",
        "floor": 2,
        "buildingId": "jc-bose-block",
        "department": "Physics",
        "description": "Thin film deposition, XRD, AFM characterization, and cleanroom experimental benches.",
        "directions": "Level 2, East corridor room 210."
      }
    ]
  },
  {
    "id": "vikram-sarabhai-block",
    "name": "Vikram Sarabhai Block",
    "shortCode": "VSB",
    "subtitle": "School of Mechanical, Civil & Aerospace Engineering",
    "description": "Heavy engineering workshop complex housing robotics, autonomous vehicle testing, fluid dynamics wind tunnels, and structural engineering testing frames.",
    "totalFloors": 4,
    "floors": [
      1,
      2,
      3,
      4
    ],
    "color": "#10B981",
    "cx": 709.1,
    "cy": 326.6,
    "path": "M 552.2,280.9 L 877.2,280.6 L 878.6,365.9 L 843.8,377.6 L 550.8,373.9 L 552.2,280.9 Z",
    "bbox": {
      "x": 550.8,
      "y": 280.6,
      "width": 327.80000000000007,
      "height": 97.0
    },
    "amenities": [
      "Robotics & Drone Testing Arena",
      "Subsonic Wind Tunnel Lab",
      "CNC Machining Workshop",
      "Heavy Structural Testing Bed"
    ],
    "keyLandmarks": [
      "Central Mechanical Workshop (Level 1)",
      "Drone & Autonomous Robotics Bay (Level 2)",
      "CAD/CAM Simulation Center (Level 3)"
    ],
    "rooms": [
      {
        "id": "vsb-drone",
        "roomNumber": "VSB-201",
        "name": "Autonomous Drone & Robotics Testing Bay",
        "category": "lab",
        "floor": 2,
        "buildingId": "vikram-sarabhai-block",
        "department": "Mechanical Engineering",
        "description": "Indoor netting enclosure for autonomous quadcopter obstacle avoidance testing and LiDAR SLAM verification.",
        "directions": "Level 2, high-ceiling central bay."
      },
      {
        "id": "vsb-workshop",
        "roomNumber": "VSB-101",
        "name": "Advanced CNC & Precision Machine Shop",
        "category": "lab",
        "floor": 1,
        "buildingId": "vikram-sarabhai-block",
        "department": "Mechanical Engineering",
        "description": "5-axis CNC milling, lathe bays, laser cutters, and metal 3D additive manufacturing.",
        "directions": "Ground level heavy machinery roll-up door entrance at the rear."
      }
    ]
  },
  {
    "id": "annapurna-mess",
    "name": "Annapurna Mess",
    "shortCode": "Mess",
    "subtitle": "Central Student Dining Complex",
    "description": "Massive multi-level central student dining facility serving 4 hygienic meals daily with dedicated North Indian, South Indian, and special dietary counters.",
    "totalFloors": 2,
    "floors": [
      1,
      2
    ],
    "color": "#EC4899",
    "cx": 789.9,
    "cy": 212.1,
    "path": "M 760.6,168.6 L 740.1,214.5 L 764.8,212.8 L 768.3,218.8 L 747.0,225.2 L 826.0,277.0 L 869.0,256.4 L 872.5,167.0 L 760.6,168.6 Z",
    "bbox": {
      "x": 740.1,
      "y": 167.0,
      "width": 132.39999999999998,
      "height": 110.0
    },
    "amenities": [
      "1500+ Seating Capacity",
      "North & South Indian Dining Halls",
      "Jain & Special Diet Counters",
      "Water Filtration Plant",
      "Hand Sanitization Bays"
    ],
    "keyLandmarks": [
      "South Indian Dining Hall (Level 1)",
      "North Indian & Special Dining Hall (Level 2)",
      "Outdoor Tree Court Veranda"
    ],
    "rooms": [
      {
        "id": "mess-l1",
        "roomNumber": "MESS-L1",
        "name": "South Indian Cuisine Dining Hall",
        "category": "amenity",
        "floor": 1,
        "buildingId": "annapurna-mess",
        "description": "Buffet style dining serving fresh dosas, idlis, sambar, rice meals, and evening snacks.",
        "directions": "Enter through the main front glass gates on the ground level."
      },
      {
        "id": "mess-l2",
        "roomNumber": "MESS-L2",
        "name": "North Indian & Continental Dining Hall",
        "category": "amenity",
        "floor": 2,
        "buildingId": "annapurna-mess",
        "description": "Air-conditioned dining hall serving rotis, dal makhani, paneer dishes, and continental options.",
        "directions": "Take internal wide staircase or ramp to Level 2."
      }
    ]
  },
  {
    "id": "food-court",
    "name": "Campus Food Court & Cafeterias",
    "shortCode": "Food Court",
    "subtitle": "Retail Cafes, Juice Bars & Night Canteen",
    "description": "Vibrant student hangout hub featuring multiple food kiosks, cafes, tea/coffee counters, fresh juice stalls, and midnight snack counters.",
    "totalFloors": 1,
    "floors": [
      1
    ],
    "color": "#E11D48",
    "cx": 790.5,
    "cy": 641.6,
    "path": "M 752.1,619.0 L 758.6,619.1 L 867.6,619.3 L 861.0,687.0 L 751.4,686.1 L 752.1,619.0 Z",
    "bbox": {
      "x": 751.4,
      "y": 619.0,
      "width": 116.20000000000005,
      "height": 68.0
    },
    "amenities": [
      "Late Night Canteen (Open till 2:00 AM)",
      "Fresh Fruit Juice Bar",
      "Subway & Sandwich Kiosks",
      "Outdoor Canopy Seating"
    ],
    "keyLandmarks": [
      "Central Coffee Lounge",
      "Juice & Shake Counters",
      "Midnight Canteen Station"
    ],
    "rooms": [
      {
        "id": "fc-main",
        "roomNumber": "FC-Main",
        "name": "Food Court Concourse & Outlets",
        "category": "amenity",
        "floor": 1,
        "buildingId": "food-court",
        "description": "Diverse menu of wraps, noodles, burgers, milkshakes, and hot beverages.",
        "directions": "Located adjacent to sports tennis courts; open paved pavilion."
      }
    ]
  },
  {
    "id": "ganga-hostel",
    "name": "Ganga Hostel Tower",
    "shortCode": "Ganga",
    "subtitle": "Student Residence & 24/7 Health Clinic",
    "description": "Multi-story hostel tower housing student residences, study rooms, gym, and the 24/7 University Health Clinic & Pharmacy.",
    "totalFloors": 8,
    "floors": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "color": "#6366F1",
    "cx": 418.3,
    "cy": 508.6,
    "path": "M 384.6,462.0 L 493.9,460.3 L 494.3,482.3 L 475.7,585.0 L 349.2,587.9 L 345.5,520.8 L 384.6,462.0 Z",
    "bbox": {
      "x": 345.5,
      "y": 460.3,
      "width": 148.8,
      "height": 127.59999999999997
    },
    "amenities": [
      "24/7 University Health Clinic",
      "Emergency Ambulance Bay",
      "Hostel Warden Office",
      "Student Gym",
      "Indoor Games Arena"
    ],
    "keyLandmarks": [
      "24/7 Campus Health Clinic (Level 1)",
      "Chief Warden Office (Level 1)",
      "Hostel Recreation Hall (Level 2)"
    ],
    "rooms": [
      {
        "id": "ganga-clinic",
        "roomNumber": "HC-01",
        "name": "24/7 University Health Clinic & Pharmacy",
        "category": "service",
        "floor": 1,
        "buildingId": "ganga-hostel",
        "department": "Student Health Services",
        "description": "Round-the-clock doctor on duty, emergency medical beds, pharmacy, and ambulance standby.",
        "directions": "Ground level of Ganga Block; marked clearly with illuminated Red Cross signage near the east entrance."
      },
      {
        "id": "ganga-warden",
        "roomNumber": "WO-Ganga",
        "name": "Hostel Warden Office & Helpdesk",
        "category": "administrative",
        "floor": 1,
        "buildingId": "ganga-hostel",
        "department": "Hostel Administration",
        "description": "Out-pass verification, room maintenance requests, and residential student support.",
        "directions": "Immediately inside the security checkpost at Ganga tower reception."
      }
    ]
  },
  {
    "id": "yamuna-hostel",
    "name": "Yamuna Hostel Tower",
    "shortCode": "Yamuna",
    "subtitle": "Student Residence Tower",
    "description": "Modern student residential tower equipped with air-conditioned and non-AC rooms, high-speed Wi-Fi, and laundry services.",
    "totalFloors": 8,
    "floors": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "color": "#4F46E5",
    "cx": 771.3,
    "cy": 76.7,
    "path": "M 728.6,59.5 L 853.7,60.7 L 854.1,82.8 L 826.2,100.9 L 705.8,98.7 L 701.9,74.5 L 728.6,59.5 Z",
    "bbox": {
      "x": 701.9,
      "y": 59.5,
      "width": 152.20000000000005,
      "height": 41.400000000000006
    },
    "amenities": [
      "Laundromat Facility",
      "Quiet Reading Lounge",
      "Table Tennis & Foosball Room",
      "Elevators"
    ],
    "keyLandmarks": [
      "Hostel Common Room (Level 1)",
      "Reading Lounge (Level 3)"
    ],
    "rooms": [
      {
        "id": "yamuna-lounge",
        "roomNumber": "YAM-CR",
        "name": "Yamuna Common Room & Study Hall",
        "category": "amenity",
        "floor": 1,
        "buildingId": "yamuna-hostel",
        "description": "Air-conditioned group study and reading hall with high-speed campus Wi-Fi.",
        "directions": "Ground floor lobby, right corridor past reception."
      }
    ]
  },
  {
    "id": "sports-complex",
    "name": "Sports Complex & Athletic Grounds",
    "shortCode": "Sports",
    "subtitle": "Cricket Oval, Football Pitch & Floodlit Courts",
    "description": "Comprehensive university sports infrastructure featuring a full-sized cricket turf, standard football field with running track, floodlit tennis, basketball, and volleyball courts.",
    "totalFloors": 1,
    "floors": [
      1
    ],
    "color": "#059669",
    "cx": 683.5,
    "cy": 768.9,
    "path": "M 551.8,774.9 L 555.8,747.3 L 573.7,721.9 L 603.7,701.2 L 642.8,687.4 L 687.0,681.7 L 734.7,685.5 L 777.7,698.8 L 811.0,720.1 L 830.7,747.0 L 834.6,776.5 L 822.3,805.0 L 795.1,829.4 L 756.3,846.8 L 710.1,855.2 L 662.1,853.7 L 620.2,843.4 L 585.7,825.5 L 562.1,801.9 L 551.8,774.9 Z",
    "bbox": {
      "x": 551.8,
      "y": 681.7,
      "width": 282.80000000000007,
      "height": 173.5
    },
    "amenities": [
      "Floodlit Basketball Courts",
      "Championship Tennis Courts",
      "Cricket Practice Nets",
      "Synthetic Athletic Track",
      "Volleyball Arena"
    ],
    "keyLandmarks": [
      "Cricket Ground (South)",
      "Football Field & 400m Track",
      "Tennis & Volleyball Courts",
      "Basketball Courts (near Mess)"
    ],
    "rooms": [
      {
        "id": "sports-cricket",
        "roomNumber": "SPT-CRK",
        "name": "University Cricket Oval & Pavilion",
        "category": "amenity",
        "floor": 1,
        "buildingId": "sports-complex",
        "description": "Full-size natural turf cricket ground with practice nets for inter-university tournaments.",
        "directions": "South of the Food Court; accessible via main sports avenue."
      },
      {
        "id": "sports-bb",
        "roomNumber": "SPT-BB",
        "name": "Floodlit Basketball Arena",
        "category": "amenity",
        "floor": 1,
        "buildingId": "sports-complex",
        "description": "Standard acrylic coated dual basketball courts with evening LED floodlighting.",
        "directions": "Located between Annapurna Mess and Tree Court area."
      }
    ]
  }
];

export const CAMPUS_LANDMARKS: Landmark[] = [
  {
    "id": "gate-3",
    "name": "Gate - 3 & Security Checkpost",
    "category": "gate",
    "cx": 904.4,
    "cy": 415.0,
    "path": "M 898.7,411.6 L 913.2,410.9 L 912.8,421.2 L 898.7,419.8 L 898.7,411.6 Z",
    "color": "#2563EB",
    "description": "Main Eastern Entrance and Security verification for students, faculty, and visitors."
  },
  {
    "id": "courier-point",
    "name": "Courier Point & Delivery Bay",
    "category": "facility",
    "cx": 905.2,
    "cy": 448.8,
    "path": "M 898.3,434.9 L 914.5,434.9 L 915.9,469.9 L 898.9,469.4 L 898.3,434.9 Z",
    "color": "#D97706",
    "description": "Designated campus parcel pickup point for Amazon, Flipkart, BlueDart, and personal packages."
  },
  {
    "id": "tree-court",
    "name": "Tree Court Area",
    "category": "plaza",
    "cx": 688.8,
    "cy": 248.1,
    "path": "M 667.1,233.6 L 720.1,233.9 L 723.5,270.1 L 666.4,269.5 L 667.1,233.6 Z",
    "color": "#10B981",
    "description": "Shaded natural canopy seating plaza popular for student discussions, group work, and relaxation."
  },
  {
    "id": "event-ground",
    "name": "Event Ground (Festival & Cultural Lawn)",
    "category": "plaza",
    "cx": 337.9,
    "cy": 900.2,
    "path": "M 308.3,834.2 L 467.6,835.2 L 465.5,964.7 L 306.1,963.7 L 240.3,964.7 L 269.6,904.4 L 308.3,834.2 Z",
    "color": "#8B5CF6",
    "description": "Expansive outdoor lawn venue for annual cultural festivals (Milan, Infinitus), concerts, and DJ nights."
  },
  {
    "id": "flag-area",
    "name": "Ceremonial Flag Plaza",
    "category": "plaza",
    "cx": 333.9,
    "cy": 1046.2,
    "path": "M 232.3,972.5 L 226.2,1137.5 L 371.3,1135.5 L 470.4,1090.7 L 470.8,968.5 L 232.3,972.5 Z",
    "color": "#F59E0B",
    "description": "Central monumental flag mast for Independence Day, Republic Day, and university celebrations."
  },
  {
    "id": "fountain",
    "name": "Campus Central Fountain",
    "category": "plaza",
    "cx": 503.0,
    "cy": 416.3,
    "path": "M 501.6,425.1 L 496.5,424.1 L 492.3,422.0 L 492.0,420.2 L 492.0,416.3 L 492.1,412.3 L 491.8,409.9 L 495.8,407.7 L 500.3,406.5 L 505.1,406.3 L 509.8,407.0 L 513.9,410.6 L 513.5,412.7 L 514.2,415.2 L 514.2,418.4 L 512.5,421.6 L 511.9,423.8 L 507.0,425.1 L 501.6,425.1 Z",
    "color": "#06B6D4",
    "description": "Decorative illuminated fountain plaza connecting the academic spine to the residential zone."
  }
];

export const ALL_ROOMS: RoomLocation[] = CAMPUS_BUILDINGS.flatMap(b => b.rooms);

export const CATEGORY_LABELS: Record<RoomLocation["category"], { label: string; color: string; bg: string }> = {
  faculty_cabin: { label: "Faculty Cabin", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" },
  lab: { label: "Research Lab", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/30" },
  seminar_hall: { label: "Seminar Hall / ALC", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" },
  classroom: { label: "Smart Classroom", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" },
  administrative: { label: "Administrative Office", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/30" },
  amenity: { label: "Campus Amenity", color: "text-cyan-500", bg: "bg-cyan-500/10 border-cyan-500/30" },
  service: { label: "Health & Clinic", color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/30" },
};
