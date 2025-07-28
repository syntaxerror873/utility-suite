import Layout from '@/components/Layout';
import { Mail, MessageSquare, Github, Twitter, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email for general inquiries',
      action: 'hello@techtoolbox.com',
      href: 'mailto:hello@techtoolbox.com'
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Report bugs or contribute to the project',
      action: 'View Repository',
      href: 'https://github.com'
    },
    {
      icon: Twitter,
      title: 'Twitter',
      description: 'Follow us for updates and announcements',
      action: '@techtoolbox',
      href: 'https://twitter.com'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Get in Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions, suggestions, or feedback? We'd love to hear from you. 
              Reach out through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary-glow" />
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us more..."
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
              
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="glass-card p-6 hover-lift">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                        <p className="text-muted-foreground mb-3">{method.description}</p>
                        <a
                          href={method.href}
                          className="text-primary-glow hover:text-primary transition-colors font-medium"
                        >
                          {method.action}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* FAQ Section */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Are my files stored on your servers?
                    </h4>
                    <p className="text-muted-foreground">
                      No, all processing happens in your browser. Your files never leave your device.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Is TechToolbox free to use?
                    </h4>
                    <p className="text-muted-foreground">
                      Yes, all our tools are completely free with no hidden fees or limitations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Can I suggest new tools?
                    </h4>
                    <p className="text-muted-foreground">
                      Absolutely! We love hearing from our users. Send us your ideas through any contact method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="glass-card p-8 mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Most questions can be answered by exploring our tools and their built-in help features.
              For technical support or feature requests, please don't hesitate to reach out.
            </p>
            <p className="text-sm text-muted-foreground">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;