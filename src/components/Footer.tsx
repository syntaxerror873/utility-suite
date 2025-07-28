import { Settings, Heart, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechToolbox</span>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              Simplifying your daily tech problems with modern, efficient tools. 
              Built with love for developers and creators.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-foreground hover:text-primary-glow hover:bg-white/20 transition-all duration-300"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-foreground hover:text-primary-glow hover:bg-white/20 transition-all duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@techtoolbox.com" 
                className="p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-foreground hover:text-primary-glow hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Tools', href: '/#tools' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary-glow transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-3">
              {[
                { name: 'Image Arranger', href: '/tools/image-arranger' },
                { name: 'Image Compressor', href: '/tools/image-compressor' },
                { name: 'Background Remover', href: '/tools/background-remover' },
                { name: 'To-Do Generator', href: '/tools/todo-generator' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary-glow transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} TechToolbox. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary-glow text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary-glow text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Made with Love */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for the tech community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;