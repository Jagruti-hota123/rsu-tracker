import * as Dialog from "@radix-ui/react-dialog";
import { X, LayoutDashboard, FileText, Plus, BarChart3 } from "lucide-react";
import { ModeToggle } from "./ui/toggleButton";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const menuItems = [
    {
      href: "./dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "./all-grants",
      icon: FileText,
      label: "Grants",
    },
    {
      href: "./addEditGrantPage",
      icon: Plus,
      label: "Add Grants",
    },
    {
      href: "./analytics",
      icon: BarChart3,
      label: "Analytics",
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" />

      <Dialog.Content
        className="
          fixed top-0 left-0 h-full w-64 
          bg-background border-r border-border z-50 shadow-lg
          transform transition-transform duration-300
          data-[state=open]:translate-x-0
          data-[state=closed]:-translate-x-full
          flex flex-col
        "
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Menu</h2>
          <button
            type="button"
            title="Close"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-1 hover:bg-accent"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="
                  flex items-center gap-3 rounded-md px-3 py-2.5
                  text-muted-foreground hover:text-foreground
                  hover:bg-accent transition-colors
                  text-sm font-medium
                "
                onClick={onClose}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Theme
            </span>
            <ModeToggle />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground text-center">
          &copy; 2025 Rovia
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
