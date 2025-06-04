
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "accent";
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  variant = "primary" 
}: FeatureCardProps) => {
  const variants = {
    primary: "from-emerald-500 to-emerald-600",
    secondary: "from-blue-500 to-blue-600", 
    accent: "from-purple-500 to-purple-600"
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-3">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="text-center relative z-10">
        <div className={`w-20 h-20 bg-gradient-to-br ${variants[variant]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <p className="text-center text-lg leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </CardContent>

      {/* Decorative border on hover */}
      <div className="absolute inset-0 border-2 border-emerald-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
};
