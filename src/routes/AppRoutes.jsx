import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import MyCases from "../pages/Cases/MyCases.jsx";
import NewCaseIntake from "../pages/Cases/NewCaseIntake.jsx";
import CaseWorkspace from "../pages/Cases/CaseWorkspace/CaseWorkspace.jsx";
import LegalKB from "../pages/LegalKnowledgeBase/LegalKB.jsx";
import Reports from "../pages/Reports/Reports.jsx";

import MergDashboard from "../pages/Merg/MergDashboard.jsx";
import NewMergWizard from "../pages/Merg/NewMergWizard.jsx";
import MergList from "../pages/Merg/MergList.jsx";
import MergCaseWorkspace from "../pages/Merg/MergCaseWorkspace.jsx";
import DoctorManagement from "../pages/Merg/DoctorManagement.jsx";
import PendingDashboard from "../pages/Merg/PendingDashboard.jsx";

import ProtectedRoute from "../components/routing/ProtectedRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/cases" element={<MyCases />} />
        <Route path="/cases/new" element={<NewCaseIntake />} />
        <Route path="/cases/:caseId/*" element={<CaseWorkspace />} />

        <Route path="/merg" element={<MergDashboard />} />
        <Route path="/merg/new" element={<NewMergWizard />} />
        <Route path="/merg/cases" element={<MergList />} />
        <Route path="/merg/cases/:mergId/*" element={<MergCaseWorkspace />} />
        <Route path="/merg/doctors" element={<DoctorManagement />} />
        <Route path="/merg/pending" element={<PendingDashboard />} />

        <Route path="/legal-kb" element={<LegalKB />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
