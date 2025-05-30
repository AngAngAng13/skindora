import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

import logo from "@/assets/logo.svg";

interface TopbarProps {
  branding?: string;
  navItems?: {
    displayText: string;
    path: string;
  }[];
}

function NavigationItems({ navItems }: { navItems: TopbarProps["navItems"] }) {
  const location = useLocation();
  return (
    <nav className="hidden space-x-8 md:flex">
      {navItems?.map((item, index) => {
        const path = `/${item.path}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={index}
            to={path}
            className={`p prose-a ${isActive ? "text-primary" : "hover:text-primary text-gray-600"}`}
          >
            {item.displayText}
          </Link>
        );
      })}
    </nav>
  );
}

function TopbarActions() {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/store">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
      <Link to="/">
        <Button variant="outline">Đăng nhập</Button>
      </Link>
    </div>
  );
}

export default function Topbar({ branding, navItems = [] }: TopbarProps = {}): React.JSX.Element {
  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" aria-label="Go to homepage">
              <img
                src={logo}
                alt="Skindora - Premium Skincare Products"
                title={branding || "Skindora"}
                loading="eager"
              />
            </Link>
          </div>
          <NavigationItems navItems={navItems} />
          <TopbarActions />
        </div>
      </div>
    </header>
  );
}
