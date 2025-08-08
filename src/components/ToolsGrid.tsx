import { 
  ImageIcon, 
  Minimize2, 
  Scissors, 
  CheckSquare, 
  Palette,
  QrCode,
  Coins,
  ImagePlus,
  Volume2
} from 'lucide-react';
import ToolCard from './ToolCard';

const ToolsGrid = () => {
  const tools = [
    {
      title: 'Image Arranger',
      description: 'Capture, arrange, and crop multiple photos into a single composition. Perfect for creating collages and layouts.',
      icon: ImageIcon,
      href: '/tools/image-arranger',
      gradient: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      title: 'Image Compressor',
      description: 'Reduce image file sizes without compromising quality. Optimize your images for web and storage.',
      icon: Minimize2,
      href: '/tools/image-compressor',
      gradient: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      title: 'Background Remover',
      description: 'Remove backgrounds from images with AI precision. Get professional results in seconds.',
      icon: Scissors,
      href: '/tools/background-remover',
      gradient: 'bg-gradient-to-br from-red-500 to-pink-600'
    },
    {
      title: 'To-Do List Generator',
      description: 'Create and organize tasks with priorities and due dates. Export as PDF or text files.',
      icon: CheckSquare,
      href: '/tools/todo-generator',
      gradient: 'bg-gradient-to-br from-orange-500 to-yellow-600'
    },
    {
      title: 'Color Palette Generator',
      description: 'Extract beautiful color palettes from images or generate harmonious color schemes for your projects.',
      icon: Palette,
      href: '/tools/color-palette',
      gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600'
    },
    {
      title: 'QR Code Scanner',
      description: 'Scan QR codes using your camera or upload images to decode QR codes instantly.',
      icon: QrCode,
      href: '/tools/qr-scanner',
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
    },
    {
      title: 'Coin Flipper',
      description: 'Unbiased coin flipping with 3 animation effects using cryptographically secure randomness.',
      icon: Coins,
      href: '/tools/coin-flipper',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600'
    },
    {
      title: 'Image to QR Code',
      description: 'Convert any image into a QR code for easy sharing and storage. Perfect for digital portfolios.',
      icon: ImagePlus,
      href: '/tools/image-to-qr',
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-600'
    },
    {
      title: 'PDF to Audio Converter',
      description: 'Convert PDF documents to speech audio with adjustable playback speed and download options.',
      icon: Volume2,
      href: '/tools/pdf-to-audio',
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Powerful Tools</span> for Every Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our collection of modern, efficient tools designed to solve your daily tech challenges.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
              gradient={tool.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;