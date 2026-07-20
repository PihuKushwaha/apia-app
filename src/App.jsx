
import AppRoutes from "./routes/AppRoutes.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MergProvider } from "./context/MergContext.jsx";
import { CaseProvider } from "./context/CaseContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CaseProvider>
        <MergProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </MergProvider>
      </CaseProvider>
    </AuthProvider>
  );
}