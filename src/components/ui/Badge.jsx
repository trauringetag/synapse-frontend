import * as React from "react";
import { cn } from "./Button";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    admin: "border-transparent bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30",
    user: "border-transparent bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", variants[variant] || variants.default, className)} {...props} />
  );
}