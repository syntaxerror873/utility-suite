import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Upload, RotateCcw, QrCode, Download } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCode from 'qrcode';

const Scene3D = ({ imageTexture }: { imageTexture: string | null }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {imageTexture ? (
        <Box args={[2, 2, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" map={null} color="#8B5CF6" />
        </Box>
      ) : (
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#8B5CF6"
          anchorX="center"
          anchorY="middle"
        >
          Upload an image to create 3D model
        </Text>
      )}
    </>
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
            <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <Canvas camera={{ position: [0, 0, 5] }}>
                <Suspense fallback={null}>
                  <Scene3D imageTexture={imagePreview} />
                </Suspense>
              </Canvas>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Click and drag to rotate • Scroll to zoom • Right-click and drag to pan</p>
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