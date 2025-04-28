import { cn } from "@/lib/utils";

interface SidebarNavItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function SidebarNavItem({
  active,
  className,
  ...props
}: SidebarNavItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
        "hover:bg-gray-100 hover:text-primary",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
