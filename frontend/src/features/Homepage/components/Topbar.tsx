import {Heart, Menu, Search, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { useCartQuery } from "@/hooks/queries/useCartQuery";

interface AppHeaderProps {
  branding?: string;
  navItems?: {
    displayText: string;
    path: string;
  }[];
}

function NavigationItems({ navItems }: { navItems: AppHeaderProps["navItems"] }) {
  const location = useLocation();
  return (
    <nav className="hidden items-center space-x-8 md:flex">
      {navItems?.map((item, index) => {
        const path = `/${item.path}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={index}
            to={path}
            className={`text-sm font-medium transition-colors ${isActive ? "text-primary font-semibold" : "hover:text-primary/80 text-gray-600"}`}
          >
            {item.displayText}
          </Link>
        );
      })}
    </nav>
  );
}

function SearchBar() {
  return (
    <div className="mx-6 hidden flex-1 justify-center md:flex">
      <div className="relative w-full max-w-lg">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search for products, brands, and more..." className="pl-10" />
      </div>
    </div>
  );
}

function HeaderActions() {
  const { user, actions, isAuthenticated } = useAuth();
  const { data: cartAPIResponse } = useCartQuery(isAuthenticated);
  const cartCount = cartAPIResponse?.result.Products.length || 0;
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {isAuthenticated && (
        <>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                {cartCount}
              </span>
            )}
          </Button>
        </>
      )}

      {user ? (
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-9 w-9 rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={actions.isLoggingOut} onClick={actions.logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link to="/auth/login" className="hidden md:block">
          <Button variant="outline">Đăng nhập</Button>
        </Link>
      )}
    </div>
  );
}

export default function Topbar({ branding, navItems = [] }: AppHeaderProps = {}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const onProductsPage = location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link to="/" aria-label="Go to homepage">
              <img src={logo} alt="Skindora" title={branding || "Skindora"} loading="eager" className="h-8 w-auto" />
            </Link>
          </div>

          {onProductsPage ? <SearchBar /> : <NavigationItems navItems={navItems} />}

          <HeaderActions />
        </div>

        {onProductsPage && (
          <div className="pb-4 md:hidden">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" />
            </div>
          </div>
        )}
      </div>

      {mobileMenuOpen && !onProductsPage && (
        <div className="border-t border-gray-200 md:hidden">
          <nav className="flex flex-col space-y-1 p-4">
            {navItems?.map((item) => (
              <Link
                key={item.path}
                to={`/${item.path}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                {item.displayText}
              </Link>
            ))}
            {!user && (
              <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="mt-2 w-full">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
