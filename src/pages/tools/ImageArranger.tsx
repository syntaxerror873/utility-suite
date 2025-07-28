import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Download, RotateCcw, Grid3X3, AlignHorizontalJustifyCenter, AlignVerticalJustifyCenter } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';

interface ImageData {
  id: string;
  src: string;
  file: File;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels?: any;
}

const ImageArranger = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [arrangement, setArrangement] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    if (currentImageIndex !== null) {
      setImages(prev => prev.map((img, index) => 
        index === currentImageIndex 
          ? { ...img, croppedAreaPixels }
          : img
      ));
    }
  }, [currentImageIndex]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success('Camera started successfully!');
    } catch (error) {
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `captured-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const src = URL.createObjectURL(blob);
        const newImage: ImageData = {
          id: Date.now().toString(),
          src,
          file,
          crop: { x: 0, y: 0 },
          zoom: 1
        };
        setImages(prev => [...prev, newImage]);
        toast.success('Photo captured!');
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const src = URL.createObjectURL(file);
      const newImage: ImageData = {
        id: Date.now().toString() + Math.random(),
        src,
        file,
        crop: { x: 0, y: 0 },
        zoom: 1
      };
      setImages(prev => [...prev, newImage]);
    });

    toast.success(`${files.length} image(s) uploaded!`);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setCurrentImageIndex(null);
  };

  const downloadArrangedImage = async () => {
    if (images.length === 0) {
      toast.error('No images to arrange!');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageSize = 400;
    const padding = 20;

    // Set canvas size based on arrangement
    if (arrangement === 'horizontal') {
      canvas.width = (imageSize * images.length) + (padding * (images.length + 1));
      canvas.height = imageSize + (padding * 2);
    } else if (arrangement === 'vertical') {
      canvas.width = imageSize + (padding * 2);
      canvas.height = (imageSize * images.length) + (padding * (images.length + 1));
    } else { // grid
      const cols = Math.ceil(Math.sqrt(images.length));
      const rows = Math.ceil(images.length / cols);
      canvas.width = (imageSize * cols) + (padding * (cols + 1));
      canvas.height = (imageSize * rows) + (padding * (rows + 1));
    }

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw images
    for (let i = 0; i < images.length; i++) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let x, y;
        
        if (arrangement === 'horizontal') {
          x = padding + (i * (imageSize + padding));
          y = padding;
        } else if (arrangement === 'vertical') {
          x = padding;
          y = padding + (i * (imageSize + padding));
        } else { // grid
          const cols = Math.ceil(Math.sqrt(images.length));
          const col = i % cols;
          const row = Math.floor(i / cols);
          x = padding + (col * (imageSize + padding));
          y = padding + (row * (imageSize + padding));
        }

        ctx.drawImage(img, x, y, imageSize, imageSize);

        // Download when last image is drawn
        if (i === images.length - 1) {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `arranged-images-${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('Image downloaded successfully!');
            }
          });
        }
      };
      img.src = images[i].src;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Image Arranger</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Capture, arrange, and crop multiple photos into beautiful compositions
            </p>
          </div>

          {/* Controls */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <Button onClick={startCamera} className="btn-glass">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="btn-glass"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                
                <Button 
                  onClick={downloadArrangedImage} 
                  className="btn-primary"
                  disabled={images.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Arrangement Options */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setArrangement('horizontal')}
                  className={arrangement === 'horizontal' ? 'btn-primary' : 'btn-glass'}
                >
                  <AlignHorizontalJustifyCenter className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setArrangement('vertical')}
                  className={arrangement === 'vertical' ? 'btn-primary' : 'btn-glass'}
                >
                  <AlignVerticalJustifyCenter className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setArrangement('grid')}
                  className={arrangement === 'grid' ? 'btn-primary' : 'btn-glass'}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Camera Section */}
          {stream && (
            <div className="glass-card p-6 mb-8">
              <div className="flex flex-col items-center">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="rounded-lg mb-4 max-w-full"
                  style={{ maxHeight: '400px' }}
                />
                <div className="flex gap-4">
                  <Button onClick={capturePhoto} className="btn-primary">
                    Capture Photo
                  </Button>
                  <Button onClick={stopCamera} className="btn-glass">
                    Stop Camera
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Your Images ({images.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.src} 
                      alt={`Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setCurrentImageIndex(index)}
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crop Editor */}
          {currentImageIndex !== null && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Image {currentImageIndex + 1}</h3>
              <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                <Cropper
                  image={images[currentImageIndex].src}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <label className="text-sm">Zoom:</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                <Button 
                  onClick={() => setCurrentImageIndex(null)}
                  className="btn-glass"
                >
                  Done Editing
                </Button>
              </div>
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

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </Layout>
  );
};

export default ImageArranger;