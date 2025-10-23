import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, apiClient } from "@/contexts/AuthContext";
import { useState, FC } from "react";
import { 
  Menu, X, Flame, ChevronDown, Home, Info, Stethoscope, UploadCloud, MessageCircle, 
  Mail, Star, ClipboardCheck, Target, BarChart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DailyCheckinModal from "./DailyCheckinModal";
import StreakCounter from "./StreakCounter";
import { useQuery } from "@tanstack/react-query";
import NotificationToggle from "./NotificationToggle";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current location
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDailyCheckinModalOpen, setIsDailyCheckinModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // navigate("/"); // Removed for more robust logout flow
  };

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add icons to link objects
  const mainLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: Info },
    { to: "/service", label: "Service", icon: Stethoscope },
    { to: "/upload", label: "Upload", icon: UploadCloud },
    { to: "/chat", label: "Chat AI", icon: MessageCircle },
  ];

  const appLinks = [
    { to: "/contact", label: "Contact", icon: Mail },
    { to: "/features", label: "Features", icon: Star },
    { to: "/results", label: "Results", icon: ClipboardCheck },
    { to: "/goals", label: "Goals", icon: Target },
    { to: "/insights", label: "Insights", icon: BarChart },
  ];
  
  const allLinks = [...mainLinks, ...appLinks];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Grup Kiri (Logo) */}
        <h1 className="text-2xl font-bold tracking-tight">
          <Link to="/">
            <span className="text-black">nutri</span>
            <span className="text-green-600">heal.</span>
          </Link>
        </h1>

        {/* Grup Tengah (Nav Links & Dropdown) */}
        <div className="hidden md:flex flex-row items-center space-x-6 font-semibold">
          {mainLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-green-600">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center font-semibold hover:text-green-600 focus:outline-none">
              Aplikasi Saya
              <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {appLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link to={link.to}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Grup Kanan (Actions) */}
        <div className="hidden md:flex items-center space-x-3">
          {userProfile && userProfile.daily_checkin_streak !== undefined && (
            <StreakCounter streakCount={userProfile.daily_checkin_streak} />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDailyCheckinModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Flame className="h-4 w-4" />
            <span>Check-in</span>
          </Button>
          <NotificationToggle />
          <Button
            size="sm"
            onClick={handleLogout}
            className="bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105"
          >
            Logout
          </Button>
        </div>

        {/* Tombol Hamburger dan Elemen Mobile */}
        <div className="md:hidden flex items-center gap-x-2">
          {userProfile && userProfile.daily_checkin_streak !== undefined && (
            <StreakCounter streakCount={userProfile.daily_checkin_streak} />
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 hover:text-green-600 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile - REFACTORED */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white shadow-lg border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {allLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon as FC<{ className?: string }>;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center py-3 px-4 text-lg rounded-md transition-colors duration-200",
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-6 w-6 mr-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-around items-center p-2">
            <Button
              variant="ghost"
              onClick={() => { setIsDailyCheckinModalOpen(true); setIsMenuOpen(false); }}
              className="flex items-center space-x-2 text-base"
            >
              <Flame className="h-5 w-5" />
              <span>Check-in Harian</span>
            </Button>
            <NotificationToggle />
        </div>
        <button
          onClick={() => { handleLogout(); setIsMenuOpen(false); }}
          className="block w-full text-left py-3 px-4 text-base font-bold text-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      <DailyCheckinModal
        isOpen={isDailyCheckinModalOpen}
        onClose={() => setIsDailyCheckinModalOpen(false)}
      />
    </nav>
  );
};

export default DashboardHeader;
