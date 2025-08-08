import { useState, useRef } from 'react';
import { Upload, Download, QrCode, Image as ImageIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QRCode from 'qrcode';

const ImageToQR = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    toast.success('Image uploaded successfully!');
  };

  const generateQRCode = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        try {
          // Generate QR code with the base64 image data
          const qrCodeDataURL = await QRCode.toDataURL(base64Data, {
            width: 512,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
          setQrCodeData(qrCodeDataURL);
          toast.success('QR code generated successfully!');
        } catch (error) {
          console.error('QR generation error:', error);
          toast.error('Error generating QR code. Image might be too large.');
        } finally {
          setIsGenerating(false);
        }
      };
      
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process image');
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qr-code-${selectedImage?.name || 'image'}.png`;
    link.click();
    toast.success('QR code downloaded!');
  };

  const clearAll = () => {
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
              <span className="gradient-text">Image to QR Code</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Convert any image into a QR code for easy sharing and storage
            </p>
          </div>

          {/* Upload Section */}
          <div className="glass-card p-6 mb-8">
            <div className="text-center">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-primary mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <p className="text-sm text-muted-foreground">
                Support formats: JPG, PNG, WebP, GIF (recommended: under 2MB)
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Original Image
              </h3>
              
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    className="w-full max-h-80 object-contain rounded-lg border border-white/20"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={generateQRCode}
                      disabled={isGenerating}
                      className="btn-primary flex-1"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate QR Code'}
                    </Button>
                    <Button 
                      onClick={clearAll}
                      className="btn-glass"
                    >
                      Clear
                    </Button>
                  </div>
                  
                  {selectedImage && (
                    <div className="text-sm text-muted-foreground">
                      <p>File: {selectedImage.name}</p>
                      <p>Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center cursor-pointer hover:border-white/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Click to upload an image</p>
                  <p className="text-sm text-muted-foreground">or drag and drop here</p>
                </div>
              )}
            </div>

            {/* QR Code Result */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                Generated QR Code
              </h3>
              
              {qrCodeData ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrCodeData} 
                      alt="Generated QR Code"
                      className="w-full max-w-sm mx-auto"
                    />
                  </div>
                  <Button 
                    onClick={downloadQRCode}
                    className="btn-primary w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>• Scan this QR code to view the original image</p>
                    <p>• Compatible with any QR code scanner</p>
                    <p>• Contains the full image data</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">QR code will appear here</p>
                  <p className="text-sm text-muted-foreground">Upload an image and click generate</p>
                </div>
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">1</div>
                <p>Upload your image file</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">2</div>
                <p>Image is encoded into QR code</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">3</div>
                <p>Download and share the QR code</p>
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
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </Layout>
  );
};

export default ImageToQR;