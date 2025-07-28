import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  comingSoon?: boolean;
}

const ToolCard = ({ title, description, icon: Icon, href, gradient, comingSoon = false }: ToolCardProps) => {
  const CardContent = () => (
    <div className="glass-card p-6 hover-lift cursor-pointer group relative overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${gradient}`} />
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary-glow transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
      
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs bg-primary/20 text-primary-glow rounded-full border border-primary/30">
            Coming Soon
          </span>
        </div>
      )}
      
      {/* Hover Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary" />
      </div>
    </div>
  );

  if (comingSoon) {
    return <CardContent />;
  }

  return (
    <Link to={href}>
      <CardContent />
    </Link>
  );
};

export default ToolCard;