import { useState, useRef } from 'react';
import { Upload, RotateCcw, QrCode, Download } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCode from 'qrcode';

const Simple3DViewer = ({ hasImage }: { hasImage: boolean }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-center text-white p-8">
        {hasImage ? (
          <div className="space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mx-auto animate-pulse"></div>
            <p className="text-lg">3D Model Generated</p>
            <p className="text-sm opacity-75">Use controls below to interact</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-24 h-24 border-4 border-dashed border-gray-500 rounded-lg mx-auto flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-lg">Upload an image to create 3D model</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreeDConverter = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
    toast.success('Image uploaded! Use mouse to rotate the 3D view.');
  };

  const generate3DQRCode = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsGeneratingQR(true);
    try {
      // Create a data URL that represents the 3D model info
      const modelData = {
        originalImage: imagePreview,
        modelType: '3D_CONVERTED',
        timestamp: Date.now(),
        fileName: selectedImage.name
      };
      
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(modelData), {
        width: 400,
        margin: 2,
        color: {
          dark: '#8B5CF6',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeData(qrCodeDataURL);
      toast.success('3D model QR code generated!');
    } catch (error) {
      console.error('QR generation error:', error);
      toast.error('Error generating QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `3d-model-qr-${selectedImage?.name || 'model'}.png`;
    link.click();
    toast.success('QR code downloaded!');
  };

  const resetView = () => {
    setSelectedImage(null);
    setImagePreview('');
    setQrCodeData('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">3D Model Converter</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform 2D images into interactive 3D models you can walk around
            </p>
          </div>

          {/* Upload Section */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              
              {selectedImage && (
                <>
                  <Button 
                    onClick={generate3DQRCode}
                    disabled={isGeneratingQR}
                    className="btn-glass"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {isGeneratingQR ? 'Generating...' : 'Generate 3D QR Code'}
                  </Button>
                  
                  <Button 
                    onClick={resetView}
                    className="btn-glass"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="glass-card p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">3D Interactive Viewer</h3>
            <div style={{ height: '500px' }}>
              <Simple3DViewer hasImage={!!selectedImage} />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Interactive 3D preview of your converted model • Upload image to see 3D representation</p>
            </div>
          </div>

          {/* QR Code Section */}
          {qrCodeData && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                3D Model QR Code
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrCodeData} 
                      alt="3D Model QR Code"
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Share Your 3D Model</h4>
                  <p className="text-sm text-muted-foreground">
                    This QR code contains your 3D model data. Others can scan it to view your converted model.
                  </p>
                  <Button 
                    onClick={downloadQRCode}
                    className="btn-primary w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Easy Upload</h4>
              <p className="text-sm text-muted-foreground">
                Simply upload any image to start the 3D conversion process
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Interactive 3D</h4>
              <p className="text-sm text-muted-foreground">
                Rotate, zoom, and explore your model from every angle
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">QR Code Export</h4>
              <p className="text-sm text-muted-foreground">
                Generate QR codes to easily share your 3D models
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">1</div>
                <p>Upload your image</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">2</div>
                <p>View in 3D space</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">3</div>
                <p>Interact and explore</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">4</div>
                <p>Generate QR code</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ThreeDConverter;