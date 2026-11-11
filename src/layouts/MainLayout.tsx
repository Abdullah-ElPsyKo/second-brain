import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}