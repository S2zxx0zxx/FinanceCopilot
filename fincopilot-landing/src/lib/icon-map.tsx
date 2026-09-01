import {
  Wallet,
  Receipt,
  HelpCircle,
  Link,
  Tags,
  Sparkles,
  PieChart,
  TrendingUp,
  Search,
  BarChart2,
  Bell,
  ShieldCheck,
  EyeOff,
  FileCheck,
  Lock,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Receipt,
  HelpCircle,
  Link,
  Tags,
  Sparkles,
  PieChart,
  TrendingUp,
  Search,
  BarChart2,
  Bell,
  ShieldCheck,
  EyeOff,
  FileCheck,
  Lock,
  Target,
  Zap,
};

export function getIcon(key: string): LucideIcon {
  return iconMap[key] ?? HelpCircle;
}
