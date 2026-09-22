import { Bell, Menu, Search } from "lucide-react";

export function Topbar({ role, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e0e3da]/80 bg-[#f5f2ea]/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          className="icon-button lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 text-sm text-[#718080] sm:flex">
          <span>Operations</span>
          <span>/</span>
          <span className="font-semibold text-[#172629]">Today</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="icon-button" aria-label="Search">
          <Search size={18} />
        </button>
        <button className="icon-button relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d97757]" />
        </button>
        <div className="hidden h-7 w-px bg-[#dfe3d8] sm:block" />
        <span className="role-switch"><span className="hidden sm:inline">{role}</span><span className="sm:hidden">{role.split(" ")[0]}</span></span>
      </div>
    </header>
  );
}
