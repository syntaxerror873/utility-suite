import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onClose?: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const tools = [
    { name: 'Image Arranger', path: '/tools/image-arranger', keywords: ['image', 'arrange', 'photo', 'collage', 'crop'] },
    { name: 'Image Compressor', path: '/tools/image-compressor', keywords: ['compress', 'optimize', 'reduce', 'size'] },
    { name: 'Background Remover', path: '/tools/background-remover', keywords: ['background', 'remove', 'transparent'] },
    { name: 'To-Do Generator', path: '/tools/todo-generator', keywords: ['todo', 'task', 'list', 'organize'] },
    { name: 'Color Palette', path: '/tools/color-palette', keywords: ['color', 'palette', 'extract', 'scheme'] },
    { name: 'QR Code Scanner', path: '/tools/qr-scanner', keywords: ['qr', 'scan', 'code', 'reader'] },
    { name: 'Coin Flipper', path: '/tools/coin-flipper', keywords: ['coin', 'flip', 'random', 'heads', 'tails'] },
    { name: 'Image to QR', path: '/tools/image-to-qr', keywords: ['image', 'qr', 'convert', 'generate'] },
    { name: '3D Converter', path: '/tools/3d-converter', keywords: ['3d', 'convert', 'model', 'walk'] },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.keywords.some(keyword => keyword.includes(query.toLowerCase()))
  );

  const handleToolSelect = (path: string) => {
    navigate(path);
    setQuery('');
    onClose?.();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-background/80 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query && filteredTools.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
          {filteredTools.map((tool, index) => (
            <button
              key={index}
              onClick={() => handleToolSelect(tool.path)}
              className="w-full px-4 py-3 text-left hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg transition-colors border-b border-white/10 last:border-b-0"
            >
              <div className="font-medium text-foreground">{tool.name}</div>
              <div className="text-sm text-muted-foreground">
                {tool.keywords.slice(0, 3).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {query && filteredTools.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 px-4 py-3">
          <div className="text-muted-foreground text-center">No tools found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;