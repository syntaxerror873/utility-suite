import Layout from '@/components/Layout';
import { Sparkles, Target, Users, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern web technologies for optimal performance and speed.'
    },
    {
      icon: Target,
      title: 'Purpose-Built',
      description: 'Each tool is designed to solve specific daily tech challenges efficiently.'
    },
    {
      icon: Users,
      title: 'User-Focused',
      description: 'Intuitive interfaces designed for both beginners and professionals.'
    },
    {
      icon: Sparkles,
      title: 'Always Improving',
      description: 'Regular updates and new tools based on user feedback and needs.'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">About TechToolbox</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to simplify your daily tech problems with powerful, 
              easy-to-use tools that save you time and effort.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              In today's digital world, simple tasks often require complex solutions. We believe 
              technology should make your life easier, not harder. That's why we've created a 
              collection of intuitive tools that handle common tech challenges with just a few clicks.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Story */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                TechToolbox was born from a simple frustration: why did basic tasks like 
                compressing images or removing backgrounds require expensive software or 
                complex online services?
              </p>
              <p>
                We started with a vision to create a centralized hub of essential tools 
                that anyone could use, regardless of their technical expertise. Every tool 
                in our collection is built with simplicity, speed, and privacy in mind.
              </p>
              <p>
                Today, TechToolbox serves thousands of users worldwide, from content creators 
                and developers to business professionals and students. We're proud to be part 
                of your daily workflow.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your data stays in your browser. We don't store or track your files.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Speed & Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast processing with optimized algorithms and modern tech.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">User-Centric</h3>
                <p className="text-sm text-muted-foreground">
                  Every feature is designed with real user needs and feedback in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;