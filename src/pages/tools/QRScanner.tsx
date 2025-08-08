import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Copy, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';

const QRCodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScannedData(result.data);
          setIsScanning(false);
          scanner.stop();
          toast.success('QR Code scanned successfully!');
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setIsScanning(true);
      toast.success('Camera started. Point it at a QR code.');
    } catch (error) {
      console.error('Error starting scanner:', error);
      setHasCamera(false);
      toast.error('Failed to access camera. Please check permissions or upload an image.');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      setScannedData(result);
      toast.success('QR Code detected in image!');
    } catch (error) {
      toast.error('No QR code found in the image.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scannedData);
    toast.success('Copied to clipboard!');
  };

  const openLink = () => {
    if (scannedData.startsWith('http')) {
      window.open(scannedData, '_blank');
    } else {
      toast.error('Not a valid URL');
    }
  };

  const isUrl = scannedData.startsWith('http');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">QR Code Scanner</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Scan QR codes using your camera or upload an image
            </p>
          </div>

          {/* Scanner Section */}
          <div className="glass-card p-6 mb-8">
            <div className="text-center">
              {!isScanning ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      onClick={startScanning} 
                      className="btn-primary"
                      disabled={!hasCamera}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera Scanner
                    </Button>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="btn-glass"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  
                  {!hasCamera && (
                    <p className="text-sm text-yellow-500">
                      Camera access not available. Please upload an image instead.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <video 
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-lg border border-white/20"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <Button 
                    onClick={stopScanning} 
                    className="btn-glass"
                  >
                    Stop Scanning
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {scannedData && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Scanned Result</h3>
              <div className="bg-muted/20 rounded-lg p-4 mb-4">
                <div className="font-mono text-sm break-all text-foreground">
                  {scannedData}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={copyToClipboard}
                  className="btn-glass"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                {isUrl && (
                  <Button 
                    onClick={openLink}
                    className="btn-primary"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">How to use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">1</div>
                <p>Click "Start Camera" or upload image</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">2</div>
                <p>Point camera at QR code or wait for detection</p>
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

export default QRCodeScanner;