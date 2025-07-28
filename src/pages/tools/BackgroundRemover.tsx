import { useState, useRef } from 'react';
import { Upload, Download, Scissors, Image as ImageIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProcessedImage {
  originalFile: File;
  originalUrl: string;
  processedUrl?: string;
  isProcessing: boolean;
}

const BackgroundRemover = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => ({
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      isProcessing: false
    }));

    setImages(prev => [...prev, ...newImages]);
    toast.success(`${files.length} image(s) uploaded!`);
  };

  const removeBackground = async (index: number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, isProcessing: true } : img
    ));

    try {
      // Since this is a demo without actual API integration,
      // we'll simulate the background removal process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll use a canvas to create a processed version
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Add a simple demonstration effect (this would be replaced with actual AI processing)
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          
          // Create a simple demonstration of background removal
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Simple color-based background removal simulation
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Remove pixels that are close to white (demo logic)
            if (r > 200 && g > 200 && b > 200) {
              data[i + 3] = 0; // Make transparent
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const processedUrl = URL.createObjectURL(blob);
            setImages(prev => prev.map((img, i) => 
              i === index ? { ...img, processedUrl, isProcessing: false } : img
            ));
            toast.success('Background removed successfully!');
          }
        }, 'image/png');
      };
      
      img.src = images[index].originalUrl;
    } catch (error) {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, isProcessing: false } : img
      ));
      toast.error('Failed to remove background. This is a demo version.');
    }
  };

  const downloadProcessedImage = (image: ProcessedImage) => {
    if (!image.processedUrl) return;
    
    const a = document.createElement('a');
    a.href = image.processedUrl;
    a.download = `no-bg-${image.originalFile.name.replace(/\.[^/.]+$/, '')}.png`;
    a.click();
    toast.success('Image downloaded!');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Background Remover</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Remove backgrounds from images with AI precision
            </p>
            <div className="mt-4 p-4 glass-card">
              <p className="text-sm text-yellow-500">
                ⚠️ Demo Version: This tool demonstrates the interface. For production use, integrate with a background removal API like remove.bg or similar services.
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="glass-card p-6 mb-8">
            <div className="text-center">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-primary mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <p className="text-sm text-muted-foreground">
                Support formats: JPG, PNG, WEBP (up to 10MB each)
              </p>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div className="space-y-6">
              {images.map((image, index) => (
                <div key={index} className="glass-card p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Original Image */}
                    <div className="text-center">
                      <h4 className="font-medium mb-3">Original</h4>
                      <img 
                        src={image.originalUrl} 
                        alt="Original"
                        className="w-full max-w-xs h-48 object-cover rounded-lg mx-auto border border-white/10"
                      />
                    </div>

                    {/* Processing/Controls */}
                    <div className="text-center space-y-4">
                      {!image.processedUrl && !image.isProcessing && (
                        <Button 
                          onClick={() => removeBackground(index)}
                          className="btn-primary"
                        >
                          <Scissors className="h-4 w-4 mr-2" />
                          Remove Background
                        </Button>
                      )}
                      
                      {image.isProcessing && (
                        <div className="space-y-2">
                          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="text-sm text-muted-foreground">Processing...</p>
                        </div>
                      )}
                      
                      {image.processedUrl && (
                        <div className="space-y-2">
                          <Button 
                            onClick={() => downloadProcessedImage(image)}
                            className="btn-primary"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            onClick={() => removeImage(index)}
                            className="btn-glass block mx-auto"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Processed Image */}
                    <div className="text-center">
                      <h4 className="font-medium mb-3">Result</h4>
                      {image.processedUrl ? (
                        <img 
                          src={image.processedUrl} 
                          alt="Processed"
                          className="w-full max-w-xs h-48 object-cover rounded-lg mx-auto border border-white/10 bg-gray-100"
                          style={{ backgroundColor: 'transparent' }}
                        />
                      ) : (
                        <div className="w-full max-w-xs h-48 rounded-lg mx-auto border border-white/10 bg-muted/20 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Scissors className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No images uploaded yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your images to remove backgrounds with AI precision
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </div>
          )}

          {/* How it works */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">1</div>
                <p>Upload your image</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">2</div>
                <p>AI removes background</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">3</div>
                <p>Download transparent PNG</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Layout>
  );
};

export default BackgroundRemover;