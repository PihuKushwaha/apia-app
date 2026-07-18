// Default investigation workflow steps per crime type.
export const CASE_WORKFLOWS = {
  "Missing Person": ["FIR Registration", "Preliminary Search", "CCTV/Location Check", "Witness Statements", "Case Diary", "Closure/Trace Report"],
  "Marg Inquiry": ["Merg Registration", "Panchanama", "Postmortem", "Case Diary", "Closure"],
  Murder: ["FIR Registration", "Spot Inspection", "Panchanama", "Seizure", "Witness Statements", "Postmortem", "Case Diary", "Charge Sheet"],
  "Attempt to Murder": ["FIR Registration", "Spot Inspection", "Medical Report", "Witness Statements", "Seizure", "Case Diary", "Charge Sheet"],
  Theft: ["FIR Registration", "Spot Inspection", "Evidence Collection", "Witness Statements", "Recovery", "Case Diary", "Charge Sheet"],
  Burglary: ["FIR Registration", "Spot Inspection", "Evidence Collection", "Witness Statements", "Recovery", "Case Diary", "Charge Sheet"],
  Robbery: ["FIR Registration", "Spot Inspection", "Witness Statements", "Seizure", "Case Diary", "Charge Sheet"],
  Dacoity: ["FIR Registration", "Spot Inspection", "Witness Statements", "Seizure", "Case Diary", "Charge Sheet"],
  Cheating: ["FIR Registration", "Document Collection", "Witness Statements", "Financial Trail", "Case Diary", "Charge Sheet"],
  "Cyber Crime": ["FIR Registration", "Digital Evidence Collection", "CDR/IP Analysis", "Witness Statements", "Case Diary", "Charge Sheet"],
  "UPI Fraud": ["FIR Registration", "Bank/UPI Trail Request", "Account Freeze Request", "Witness Statements", "Case Diary", "Charge Sheet"],
  "Domestic Violence": ["Complaint Registration", "Statement Recording", "Medical Report (if any)", "Counseling Referral", "Case Diary", "Closure"],
  POCSO: ["FIR Registration", "Medical Examination", "Statement Recording (CWC/Magistrate)", "Evidence Collection", "Case Diary", "Charge Sheet"],
  "Other Criminal Cases": ["FIR Registration", "Investigation", "Witness Statements", "Evidence Collection", "Case Diary", "Charge Sheet"],
};

export const getWorkflowForType = (type) => CASE_WORKFLOWS[type] || CASE_WORKFLOWS["Other Criminal Cases"];