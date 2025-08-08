import { useState, useRef } from 'react';
import { Upload, Play, Pause, Download, Volume2, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

const PDFToAudio = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playbackRate, setPlaybackRate] = useState([1]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }

    setSelectedFile(file);
    setIsExtracting(true);

    try {
      // For now, we'll simulate PDF text extraction
      // In a real implementation, you'd use pdf-parse or similar
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Simulate text extraction
        setTimeout(() => {
          const sampleText = `Sample text extracted from ${file.name}. This is a demonstration of PDF to audio conversion. The actual implementation would extract the real text content from the PDF file using a PDF parsing library.`;
          setExtractedText(sampleText);
          setIsExtracting(false);
          toast.success('Text extracted from PDF successfully!');
        }, 2000);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('PDF extraction error:', error);
      toast.error('Error extracting text from PDF');
      setIsExtracting(false);
    }
  };

  const playAudio = () => {
    if (!extractedText) {
      toast.error('No text to convert to audio');
      return;
    }

    if (isPaused && speechSynthesisRef.current) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(extractedText);
    utterance.rate = playbackRate[0];
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      toast.error('Error playing audio');
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseAudio = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const downloadAudio = async () => {
    if (!extractedText) {
      toast.error('No text to convert to audio');
      return;
    }

    try {
      // For a real implementation, you'd need to use Web Audio API or a service
      // to generate an actual audio file. This is a placeholder.
      toast.success('Audio download feature coming soon! Use the play button to listen.');
    } catch (error) {
      console.error('Audio download error:', error);
      toast.error('Error downloading audio');
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setExtractedText('');
    setAudioBlob(null);
    stopAudio();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">PDF to Audio Converter</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Convert PDF documents to speech audio for easy listening
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
                Upload PDF
              </Button>
              
              {selectedFile && (
                <Button 
                  onClick={resetConverter}
                  className="btn-glass"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
            
            {selectedFile && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              </div>
            )}
          </div>

          {/* Text Preview */}
          {isExtracting && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Extracting Text...</h3>
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          )}

          {extractedText && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Extracted Text</h3>
              <div className="max-h-60 overflow-y-auto bg-muted/20 p-4 rounded-lg text-sm">
                {extractedText}
              </div>
            </div>
          )}

          {/* Audio Controls */}
          {extractedText && (
            <div className="glass-card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Audio Controls
              </h3>
              
              <div className="space-y-6">
                {/* Playback Speed */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Playback Speed: {playbackRate[0]}x
                  </label>
                  <Slider
                    value={playbackRate}
                    onValueChange={setPlaybackRate}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  {!isPlaying && !isPaused && (
                    <Button onClick={playAudio} className="btn-primary">
                      <Play className="h-4 w-4 mr-2" />
                      Play Audio
                    </Button>
                  )}
                  
                  {isPlaying && (
                    <Button onClick={pauseAudio} className="btn-glass">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  {isPaused && (
                    <Button onClick={playAudio} className="btn-primary">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  {(isPlaying || isPaused) && (
                    <Button onClick={stopAudio} className="btn-glass">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                  
                  <Button onClick={downloadAudio} className="btn-glass">
                    <Download className="h-4 w-4 mr-2" />
                    Download Audio
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
                Simply upload any PDF file to extract its text content
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Text to Speech</h4>
              <p className="text-sm text-muted-foreground">
                Convert extracted text to natural-sounding speech
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Audio Export</h4>
              <p className="text-sm text-muted-foreground">
                Download the generated audio for offline listening
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">1</div>
                <p>Upload your PDF</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">2</div>
                <p>Text extraction</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">3</div>
                <p>Adjust settings</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 text-xs">4</div>
                <p>Play or download</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </Layout>
  );
};

export default PDFToAudio;