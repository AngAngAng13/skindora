import { Bell, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";

const HeaderAdmin: React.FC = () => {
  return (
    <>
      <div className="top-0 left-0 box-border w-full border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-primary text-2xl font-bold">Tổng quan</Typography>
          </div>
          <div className="flex items-center gap-4">
            <Button className="text-ba cursor-pointer" variant="ghost" size="icon">
              <Bell size={18} />
            </Button>
            <Button className="cursor-pointer rounded-3xl" variant="outline" size="icon">
              <Link to={"/profile"}>
                <User size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderAdmin;
