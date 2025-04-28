import { cn } from "@/lib/utils";

export function SidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn("flex flex-col gap-1", className)} {...props} />;
}
