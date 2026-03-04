import { jwtDecode } from "jwt-decode";

export function isLoggedIn() {
        const accessToken = localStorage.getItem("accessToken");
        // todo: verify token validity later
        return accessToken !== null;
}

export function getAccessToken() {
        return localStorage.getItem("accessToken");
}

export function getUsername() {
        const token = getAccessToken();
        if (!token) return null;

        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
}

export function getUserRole() {
        const token = getAccessToken();
        if (!token) return null;
        const decodedToken = jwtDecode(token);
        return decodedToken.role;
}
