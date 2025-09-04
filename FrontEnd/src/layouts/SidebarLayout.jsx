import AppSidebar from "../layouts/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import CartSheet from "../views/CartSheet";

export default function SidebarLayout() {
  const { cart } = useContext(CartContext);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          {/* Cart / Notification */}
          <div className="relative">
            <CartSheet />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
