/**
 * Platform configuration constants
 * Optimized for tree-shaking and performance
 */
import { Linkedin, Twitter, Instagram } from "lucide-react";

export const PLATFORM_ICONS = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram
} as const;

export const PLATFORM_COLORS = {
  linkedin: "text-blue-400",
  twitter: "text-sky-400", 
  instagram: "text-pink-400"
} as const;

export const PLATFORM_BORDER_COLORS = {
  linkedin: "border-blue-400 bg-blue-400/10",
  twitter: "border-sky-400 bg-sky-400/10",
  instagram: "border-pink-400 bg-pink-400/10"
} as const;

export type PlatformKey = keyof typeof PLATFORM_ICONS;