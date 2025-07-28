import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-background/80 via-background/60 to-primary/20" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-primary-glow/30 blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-accent/20 blur-md animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-primary-glow mr-2 animate-pulse" />
          <span className="text-primary-glow font-medium text-lg">Modern Tech Solutions</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Simplify Your</span>
          <br />
          <span className="text-foreground">Daily Tech Problems</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your workflow with our powerful collection of tools. From image processing to productivity utilities, 
          <span className="text-primary-glow"> everything you need in one place.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary group"
          >
            <span>Explore Tools</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <Link to="/about" className="btn-glass">
            Learn More
          </Link>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Tools Available', value: '5+' },
            { label: 'Happy Users', value: '10K+' },
            { label: 'Files Processed', value: '50K+' },
            { label: 'Time Saved', value: '1000h+' }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-4 hover-lift">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;