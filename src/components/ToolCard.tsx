import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
    keywords: string;
  };
  category: {
    color: string;
  };
}

const colorMap = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900",
    hoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    hoverText: "group-hover:text-blue-700 dark:group-hover:text-blue-300",
    border: "hover:border-blue-300 dark:hover:border-blue-600",
    badge: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900",
    hoverBg: "group-hover:bg-red-200 dark:group-hover:bg-red-800",
    text: "text-red-600 dark:text-red-400",
    hoverText: "group-hover:text-red-700 dark:group-hover:text-red-300",
    border: "hover:border-red-300 dark:hover:border-red-600",
    badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900",
    hoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-800",
    text: "text-green-600 dark:text-green-400",
    hoverText: "group-hover:text-green-700 dark:group-hover:text-green-300",
    border: "hover:border-green-300 dark:hover:border-green-600",
    badge: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900",
    hoverBg: "group-hover:bg-purple-200 dark:group-hover:bg-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    hoverText: "group-hover:text-purple-700 dark:group-hover:text-purple-300",
    border: "hover:border-purple-300 dark:hover:border-purple-600",
    badge: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900",
    hoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    hoverText: "group-hover:text-orange-700 dark:group-hover:text-orange-300",
    border: "hover:border-orange-300 dark:hover:border-orange-600",
    badge: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900",
    hoverBg: "group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800",
    text: "text-cyan-600 dark:text-cyan-400",
    hoverText: "group-hover:text-cyan-700 dark:group-hover:text-cyan-300",
    border: "hover:border-cyan-300 dark:hover:border-cyan-600",
    badge: "bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300"
  }
};

export default function ToolCard({ tool, category }: ToolCardProps) {
  const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <Link href={tool.href} className="group">
      <article className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 ${colors.border} hover:-translate-y-1 h-full`}>
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.hoverBg} transition-colors`}>
          <tool.icon className={`h-6 w-6 ${colors.text}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {tool.description}
        </p>
        <div className="flex items-center justify-between">
          <div className={`${colors.text} font-medium ${colors.hoverText} transition-colors`}>
            Use tool →
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className={`text-xs ${colors.badge} px-2 py-1 rounded-full`}>
              Free
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
