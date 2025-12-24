import { Outlet } from "react-router-dom";
import Sidebar from "./Navbar";
export default function MainLayout() {
  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />

      <div className="flex-1">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
