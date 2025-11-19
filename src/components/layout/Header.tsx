import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useCurrentUser } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const handleLogout = useLogout();
  const { data: currentUser } = useCurrentUser();
  
  console.log('Current User Data:', currentUser);
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo for mobile/tablet */}
          <div className="lg:hidden">
            <img
              src="/medeva-logo.svg"
              alt="Medeva Mint"
              className="h-8"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling!.classList.remove("hidden");
              }}
            />
            <div className="hidden text-lg font-bold text-gray-800">
              Medeva <span className="text-teal-500">Mint</span>
            </div>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <img
              src="/medeva-logo.svg"
              alt="Medeva Mint"
              className="h-8"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling!.classList.remove("hidden");
              }}
            />
            <div className="hidden text-xl font-bold text-gray-800">
              Medeva <span className="text-teal-500">Mint</span>
            </div>
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              3
            </Badge>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.role || "User"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {currentUser?.username
                    ? currentUser.username.substring(0, 2).toUpperCase()
                    : "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
