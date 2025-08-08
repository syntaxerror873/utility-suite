import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ImageArranger from "./pages/tools/ImageArranger";
import ImageCompressor from "./pages/tools/ImageCompressor";
import BackgroundRemover from "./pages/tools/BackgroundRemover";
import TodoGenerator from "./pages/tools/TodoGenerator";
import ColorPalette from "./pages/tools/ColorPalette";
import QRScanner from "./pages/tools/QRScanner";
import CoinFlipper from "./pages/tools/CoinFlipper";
import ImageToQR from "./pages/tools/ImageToQR";
import ThreeDConverter from "./pages/tools/ThreeDConverter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools/image-arranger" element={<ImageArranger />} />
          <Route path="/tools/image-compressor" element={<ImageCompressor />} />
          <Route path="/tools/background-remover" element={<BackgroundRemover />} />
          <Route path="/tools/todo-generator" element={<TodoGenerator />} />
          <Route path="/tools/color-palette" element={<ColorPalette />} />
          <Route path="/tools/qr-scanner" element={<QRScanner />} />
          <Route path="/tools/coin-flipper" element={<CoinFlipper />} />
          <Route path="/tools/image-to-qr" element={<ImageToQR />} />
          <Route path="/tools/3d-converter" element={<ThreeDConverter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
