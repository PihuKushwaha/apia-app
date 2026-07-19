export const CASE_TYPES = [
  { code: "CMP", label: "Complaint Inquiry", labelHi: "शिकायत जांच", steps: [
    "Complaint Letter", "Application Letter", "Inquiry Order", "Notice (Complainant)", "Notice (Respondent)",
    "Interrogation Statement", "Spot Inspection Panchanama", "Settlement Letter", "Inquiry Report",
    "Closure Proposal", "Report to Senior Officer",
  ]},
  { code: "FIR", label: "FIR Crime", labelHi: "एफआईआर अपराध", steps: [
    "FIR Copy", "Rojnamcha Sanha", "Crime Registration", "Investigation Start Order", "Case Diary",
    "Section Add/Remove Order", "Charge Sheet", "Final Report (FR)",
  ]},
  { code: "MISS", label: "Missing Person", labelHi: "गुम इंसान", steps: [
    "Missing Person Report", "Photo Upload Form", "Hulia (Description) Form", "Wireless Message",
    "ZIPNET Entry", "Missing Person Publicity Letter", "Relatives' Statements", "Recovery Panchanama",
    "Identification Panchanama", "Handover Letter", "Missing Person Closure Report",
  ]},
  { code: "MERG", label: "Merg Inquiry", labelHi: "मर्ग जांच", steps: [
    "Merg Intimation", "Body Panchanama", "Postmortem Request Letter", "Body Identification Panchanama",
    "Spot Map", "Witness Statements", "PM Report", "FSL Letter", "Merg Inquiry Report",
    "Crime Registration Recommendation / Merg Closure",
  ]},
  { code: "MUR", label: "Murder", labelHi: "हत्या", steps: [
    "FIR", "Spot Panchanama", "Spot Map", "Photography/Videography", "Blood/Soil Seizure", "Weapon Seizure",
    "Witness Statements", "Accused Arrest Memo", "Memorandum Statement", "Recovery Panchanama",
    "TIP Proceedings", "CDR Request", "CCTV Seizure", "FSL Report", "PM Report", "Case Diary", "Charge Sheet",
  ]},
  { code: "THEFT", label: "Theft", labelHi: "चोरी", steps: [
    "FIR", "Stolen Property List", "Spot Panchanama", "Map", "CCTV Seizure", "Suspects' Statements",
    "Recovery Panchanama", "Identification Panchanama", "Seizure Handover", "Charge Sheet",
  ]},
  { code: "ROBB", label: "Robbery / Dacoity", labelHi: "लूट / डकैती", steps: [
    "FIR", "Weapon Details", "Injury Examination Report", "Accused Identification Parade",
    "Vehicle Seizure", "Mobile Location Analysis", "Gang Chart", "Charge Sheet",
  ]},
  { code: "FIRE", label: "Fire / Arson", labelHi: "आगजनी", steps: [
    "Information Letter", "Fire Brigade Report", "Spot Inspection", "Burnt Property List", "Photo/Video",
    "Electrical Inspector Report", "Insurance Documents", "Witness Statements", "FSL (Flammable Substance)",
    "Arson Inquiry Report",
  ]},
  { code: "ACC", label: "Road Accident", labelHi: "सड़क दुर्घटना", steps: [
    "FIR / Merg", "Accident Spot Map", "Vehicle Inspection Report", "Mechanical Report", "Driver Statement",
    "Eyewitness Statements", "MLC", "PM Report (if death)", "Driving License / RC / Insurance",
    "CCTV Footage", "Charge Sheet",
  ]},
  { code: "WOM", label: "Women Crime", labelHi: "महिला अपराध", steps: [
    "FIR", "Relevant BNS Sections", "Victim Statement", "Woman Officer Certification", "Medical Examination Letter",
    "Counseling Report", "Protection Order", "Accused Arrest", "Digital Evidence Seizure", "Charge Sheet",
  ]},
  { code: "RAPE", label: "Rape / Sexual Offence", labelHi: "दुष्कर्म / लैंगिक अपराध", steps: [
    "Zero FIR (if applicable)", "Victim Statement (Sec 183 BNSS)", "Magistrate Statement", "Medical Examination",
    "DNA Sample", "Clothes Seizure", "FSL", "Age Proof Documents", "Accused Medical", "Charge Sheet",
  ]},
  { code: "POCSO", label: "POCSO", labelHi: "पोक्सो", steps: [
    "Child Welfare Committee Intimation", "Guardian Presence", "Child-Friendly Statement", "Age Proof",
    "School Records", "Psychological Support Report",
  ]},
  { code: "SCST", label: "SC/ST Atrocities", labelHi: "अनुसूचित जाति/जनजाति अत्याचार", steps: [
    "Caste Certificate", "Special Report", "DSP Inquiry", "Relief Amount Proposal", "Special Court Forms",
  ]},
  { code: "NDPS", label: "NDPS", labelHi: "एनडीपीएस", steps: [
    "Search Intimation", "Section 42/43 Compliance", "Independent Witness Panchanama", "Weighing Panchanama",
    "Seal Sample", "Malkhana Deposit", "FSL Form", "Arrest Memo", "Section 52A Proceedings", "Charge Sheet",
  ]},
  { code: "CYB", label: "Cyber Crime", labelHi: "साइबर अपराध", steps: [
    "Cyber Complaint", "URL/Domain Details", "Bank Account Information", "Freeze Request", "65B Certificate",
    "Log Request", "IP Details", "Social Media Request", "CDR", "Data Analysis Report",
    "Digital Seizure Panchanama", "Charge Sheet",
  ]},
  { code: "EOW", label: "Economic Offence", labelHi: "आर्थिक अपराध", steps: [
    "Account Statement", "Audit Report", "Document Seizure", "Signature Samples", "Bank Correspondence",
    "Property Details", "Expert Opinion", "Financial Analysis Report",
  ]},
  { code: "ARMS", label: "Arms Act", labelHi: "अवैध हथियार", steps: [
    "Recovery Panchanama", "Weapon Details", "License Verification", "Ballistic Test", "FSL Report", "Arrest Memo", "Charge Sheet",
  ]},
  { code: "EXC", label: "Excise", labelHi: "आबकारी अपराध", steps: [
    "Liquor Seizure Panchanama", "Sample Seal", "Quantity Details", "Vehicle Seizure", "Laboratory Report", "Charge Sheet",
  ]},
  { code: "FOR", label: "Forest", labelHi: "वन अपराध", steps: [
    "Timber/Forest Produce Seizure", "Spot Map", "Forest Officer Report", "Vehicle Seizure", "Species Certification", "Charge Sheet",
  ]},
  { code: "REV", label: "Revenue / Encroachment Assistance", labelHi: "राजस्व / अतिक्रमण सहायता", steps: [
    "Demarcation Report", "Panchanama", "Possession Details", "Revenue Record", "Photo Evidence", "Report",
  ]},
];

export const UNIVERSAL_DOCUMENTS = [
  "Witness Statement", "Panch Statement", "Spot Map", "Seizure Panchanama", "Arrest Memo",
  "Personal Search", "Notice", "Summons", "Case Diary", "Forwarding Letter",
];

export function getCaseTypeConfig(code) {
  return CASE_TYPES.find((t) => t.code === code) || null;
}