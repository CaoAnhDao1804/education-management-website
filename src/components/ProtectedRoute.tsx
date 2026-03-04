import { getAccessToken, getUserRole } from "../utils/AuthUtils";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  requireRole: string; // admin/studentS
  children: ReactNode;
}

export default function ProtectedRoute({requireRole, children} : ProtectedRouteProps) {
    const role = getUserRole();
    const accessToken = getAccessToken();

    if (!accessToken) {
        window.location.href = "/login";
        return null;
    }
    if (requireRole && role !== requireRole) {
        window.location.href = "/no-permission";
        return null;
    }
    return children;
}