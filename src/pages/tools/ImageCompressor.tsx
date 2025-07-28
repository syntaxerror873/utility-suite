import { useState, useRef } from 'react';
import { Upload, Download, FileImage, Minimize2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
}

const ImageCompressor = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsCompressing(true);
    toast.info('Compressing images...');

    try {
      const compressedImages: CompressedImage[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        const options = {
          maxSizeMB: maxSizeMB,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          quality: compressionQuality
        };

        try {
          const compressedFile = await imageCompression(file, options);
          
          const originalSize = file.size;
          const compressedSize = compressedFile.size;
          const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);

          const compressedImage: CompressedImage = {
            originalFile: file,
            compressedFile,
            originalSize,
            compressedSize,
            compressionRatio,
            originalUrl: URL.createObjectURL(file),
            compressedUrl: URL.createObjectURL(compressedFile)
          };

          compressedImages.push(compressedImage);
        } catch (error) {
          toast.error(`Failed to compress ${file.name}`);
        }
      }

      setImages(prev => [...prev, ...compressedImages]);
      toast.success(`Successfully compressed ${compressedImages.length} image(s)!`);
    } catch (error) {
      toast.error('Failed to compress images');
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressedImage = (image: CompressedImage) => {
    const a = document.createElement('a');
    a.href = image.compressedUrl;
    a.download = `compressed_${image.originalFile.name}`;
    a.click();
    toast.success('Image downloaded!');
  };

  const downloadAllCompressed = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        downloadCompressedImage(image);
      }, index * 200);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
    toast.info('All images cleared');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Image Compressor</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Reduce image file sizes without compromising quality
            </p>
          </div>

          {/* Controls */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-primary w-full mb-4"
                  disabled={isCompressing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isCompressing ? 'Compressing...' : 'Select Images'}
                </Button>
                
                {images.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={downloadAllCompressed} 
                      className="btn-glass flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                    <Button 
                      onClick={clearAll} 
                      className="btn-glass"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {/* Settings Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Compression Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quality: {Math.round(compressionQuality * 100)}%
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.1}
                      value={compressionQuality}
                      onChange={(e) => setCompressionQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max File Size: {maxSizeMB} MB
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={maxSizeMB}
                      onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {images.length > 0 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4">Compression Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-glow">
                      {images.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Images Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {formatFileSize(images.reduce((acc, img) => acc + (img.originalSize - img.compressedSize), 0))}
                    </div>
                    <div className="text-sm text-muted-foreground">Space Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {Math.round(images.reduce((acc, img) => acc + img.compressionRatio, 0) / images.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Compression</div>
                  </div>
                </div>
              </div>

              {/* Image List */}
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="glass-card p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Image Preview */}
                      <div className="flex gap-4">
                        <div className="text-center">
                          <img 
                            src={image.originalUrl} 
                            alt="Original"
                            className="w-24 h-24 object-cover rounded-lg mb-2"
                          />
                          <div className="text-xs text-muted-foreground">Original</div>
                        </div>
                        <div className="text-center">
                          <img 
                            src={image.compressedUrl} 
                            alt="Compressed"
                            className="w-24 h-24 object-cover rounded-lg mb-2"
                          />
                          <div className="text-xs text-muted-foreground">Compressed</div>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="space-y-2">
                        <div className="font-medium truncate">{image.originalFile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <div>Original: {formatFileSize(image.originalSize)}</div>
                          <div>Compressed: {formatFileSize(image.compressedSize)}</div>
                          <div className="text-green-500">
                            Saved: {image.compressionRatio}% ({formatFileSize(image.originalSize - image.compressedSize)})
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end">
                        <Button 
                          onClick={() => downloadCompressedImage(image)}
                          className="btn-primary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          onClick={() => removeImage(index)}
                          className="btn-glass"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && !isCompressing && (
            <div className="glass-card p-12 text-center">
              <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No images uploaded yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your images to start compressing them and save storage space
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

export default ImageCompressor;