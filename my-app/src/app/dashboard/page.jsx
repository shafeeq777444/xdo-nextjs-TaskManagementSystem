"use client";
import React, { useEffect, useState } from "react";
import DesktopKanban from "@/components/Desktop/DesktopKanban";
import MobileKanban from "@/components/Mobile/MobileKanban";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import useAuthRedirect from "@/components/useAuthRedirect";

const KanbanBoard = () => {

        useAuthRedirect(); // ✅ Now runs only once when the component mounts

    return (
        <div className=" bg-teal-50 ">
            
            {/* Mobile View - Dropdowns */}
            <MobileKanban />
            {/* Desktop View - Kanban Board */}
            <DesktopKanban />
        </div>
    );
};

export default KanbanBoard;
