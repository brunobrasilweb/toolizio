import { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
  category: {
    title: string;
    description: string;
    longDescription?: string;
    icon: LucideIcon;
    color: string;
  };
}

const colorMap = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-600 dark:text-blue-400"
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900", 
    text: "text-red-600 dark:text-red-400"
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-600 dark:text-green-400"
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-600 dark:text-purple-400"
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-600 dark:text-orange-400"
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900",
    text: "text-cyan-600 dark:text-cyan-400"
  }
};

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className="flex items-center gap-3 mb-8">
      <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
        <category.icon className={`w-6 h-6 ${colors.text}`} />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {category.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {category.description}
        </p>
        {category.longDescription && (
          <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm leading-relaxed">
            {category.longDescription}
          </p>
        )}
      </div>
    </div>
  );
}
