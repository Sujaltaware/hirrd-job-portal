import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import "../App.css";
import GridBackground from "@/components/GridBackground";


const AppLayout = () => {
  return (
    <div>
      <GridBackground />
      <main className="min-h-screen container mx-auto ">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10 text-white">
        Made by Sujal Taware 💗
      </div>
    </div>
  );
};

export default AppLayout;