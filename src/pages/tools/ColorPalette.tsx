import { useState, useRef } from 'react';
import { Upload, Palette, Download, Copy, RefreshCw, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  source: 'image' | 'generated';
}

const ColorPalette = () => {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorName = (hex: string): string => {
    // Simple color naming based on hue ranges
    const color = hex.substring(1);
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const hsl = rgbToHsl(r, g, b);
    
    if (hsl.s < 10) {
      if (hsl.l < 20) return 'Black';
      if (hsl.l < 40) return 'Dark Gray';
      if (hsl.l < 60) return 'Gray';
      if (hsl.l < 80) return 'Light Gray';
      return 'White';
    }
    
    const hue = hsl.h;
    if (hue < 15 || hue >= 345) return 'Red';
    if (hue < 45) return 'Orange';
    if (hue < 75) return 'Yellow';
    if (hue < 105) return 'Yellow Green';
    if (hue < 135) return 'Green';
    if (hue < 165) return 'Green Cyan';
    if (hue < 195) return 'Cyan';
    if (hue < 225) return 'Blue';
    if (hue < 255) return 'Blue Purple';
    if (hue < 285) return 'Purple';
    if (hue < 315) return 'Purple Pink';
    return 'Pink';
  };

  const extractColorsFromImage = (imageUrl: string): Promise<Color[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve([]);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        const colorMap = new Map<string, number>();

        // Sample colors from the image
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          if (alpha > 128) { // Only consider non-transparent pixels
            const hex = rgbToHex(r, g, b);
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
          }
        }

        // Get the most common colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([hex, count]) => {
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            return {
              hex,
              rgb: { r, g, b },
              hsl: rgbToHsl(r, g, b),
              name: getColorName(hex)
            };
          });

        resolve(sortedColors);
      };
      img.src = imageUrl;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    try {
      const colors = await extractColorsFromImage(imageUrl);
      const newPalette: ColorPalette = {
        id: Date.now().toString(),
        name: `Extracted from ${file.name}`,
        colors,
        source: 'image'
      };
      setPalettes(prev => [newPalette, ...prev]);
      toast.success('Color palette extracted successfully!');
    } catch (error) {
      toast.error('Failed to extract colors from image');
    }
  };

  const generateRandomPalette = () => {
    const colors: Color[] = [];
    const baseHue = Math.random() * 360;
    
    for (let i = 0; i < 5; i++) {
      // Generate harmonious colors using golden ratio
      const hue = (baseHue + (i * 137.5)) % 360;
      const saturation = 60 + Math.random() * 30;
      const lightness = 40 + Math.random() * 30;
      
      // Convert HSL to RGB
      const h = hue / 360;
      const s = saturation / 100;
      const l = lightness / 100;
      
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = l - c / 2;
      
      let r, g, b;
      if (h < 1/6) { r = c; g = x; b = 0; }
      else if (h < 2/6) { r = x; g = c; b = 0; }
      else if (h < 3/6) { r = 0; g = c; b = x; }
      else if (h < 4/6) { r = 0; g = x; b = c; }
      else if (h < 5/6) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      
      const rgb = {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
      
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex,
        rgb,
        hsl: { h: Math.round(hue), s: Math.round(saturation), l: Math.round(lightness) },
        name: getColorName(hex)
      });
    }
    
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `Generated Palette ${palettes.filter(p => p.source === 'generated').length + 1}`,
      colors,
      source: 'generated'
    };
    
    setPalettes(prev => [newPalette, ...prev]);
    toast.success('Random palette generated!');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const exportPalette = (palette: ColorPalette) => {
    const data = {
      name: palette.name,
      colors: palette.colors.map(color => ({
        hex: color.hex,
        rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
        hsl: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
        name: color.name
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Palette exported!');
  };

  const deletePalette = (id: string) => {
    setPalettes(prev => prev.filter(p => p.id !== id));
    toast.success('Palette deleted');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Color Palette Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Extract beautiful color palettes from images or generate harmonious color schemes
            </p>
          </div>

          {/* Controls */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Extract from Image */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Extract from Image</h3>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-primary w-full mb-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {uploadedImage && (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                  />
                )}
              </div>

              {/* Generate Random */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Generate Palette</h3>
                <Button 
                  onClick={generateRandomPalette} 
                  className="btn-glass w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Random Palette
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Creates harmonious color schemes using color theory
                </p>
              </div>
            </div>
          </div>

          {/* Palettes */}
          {palettes.length > 0 ? (
            <div className="space-y-6">
              {palettes.map((palette) => (
                <div key={palette.id} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{palette.name}</h3>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => exportPalette(palette)}
                        className="btn-glass"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        onClick={() => deletePalette(palette.id)}
                        className="btn-glass text-red-500 hover:text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {palette.colors.map((color, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-full h-24 rounded-lg mb-2 border border-white/10 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyToClipboard(color.hex, 'Hex color')}
                        />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{color.name}</div>
                          <div className="text-xs space-y-1">
                            <button 
                              onClick={() => copyToClipboard(color.hex, 'Hex')}
                              className="block w-full text-muted-foreground hover:text-primary-glow transition-colors"
                            >
                              {color.hex}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'RGB')}
                              className="block w-full text-muted-foreground hover:text-primary-glow transition-colors"
                            >
                              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                            </button>
                            <button 
                              onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'HSL')}
                              className="block w-full text-muted-foreground hover:text-primary-glow transition-colors"
                            >
                              HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No palettes created yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload an image to extract colors or generate a random palette to get started
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button 
                  onClick={generateRandomPalette} 
                  className="btn-glass"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Palette
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </Layout>
  );
};

export default ColorPalette;