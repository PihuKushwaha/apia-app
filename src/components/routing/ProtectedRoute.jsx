import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { officer, loading } = useAuthContext();

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Loading...</div>;
  }

  if (!officer) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}