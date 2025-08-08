import { useState } from 'react';
import { Coins, RotateCcw, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CoinFlipper = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });
  const [effect, setEffect] = useState<'spin' | 'bounce' | 'pulse'>('spin');

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Simulate coin flip animation
    setTimeout(() => {
      // Use crypto.getRandomValues for true randomness
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const isHeads = randomArray[0] % 2 === 0;
      
      const newResult = isHeads ? 'heads' : 'tails';
      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 flips
      setStats(prev => ({
        ...prev,
        [newResult]: prev[newResult] + 1
      }));
      setIsFlipping(false);
      
      toast.success(`It's ${newResult}!`);
    }, 2000);
  };

  const resetStats = () => {
    setStats({ heads: 0, tails: 0 });
    setHistory([]);
    setResult(null);
    toast.success('Statistics reset!');
  };

  const getAnimationClass = () => {
    if (!isFlipping) return '';
    
    switch (effect) {
      case 'spin':
        return 'animate-spin';
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      default:
        return 'animate-spin';
    }
  };

  const totalFlips = stats.heads + stats.tails;
  const headsPercentage = totalFlips > 0 ? (stats.heads / totalFlips * 100).toFixed(1) : 0;
  const tailsPercentage = totalFlips > 0 ? (stats.tails / totalFlips * 100).toFixed(1) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Coin Flipper</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Unbiased coin flipping with cryptographically secure randomness
            </p>
          </div>

          {/* Animation Effects Selector */}
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Choose Animation Effect</h3>
            <div className="flex justify-center gap-4">
              {(['spin', 'bounce', 'pulse'] as const).map((effectType) => (
                <Button
                  key={effectType}
                  onClick={() => setEffect(effectType)}
                  className={effect === effectType ? 'btn-primary' : 'btn-glass'}
                >
                  {effectType.charAt(0).toUpperCase() + effectType.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Coin Section */}
          <div className="glass-card p-8 mb-8">
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div 
                  className={`w-48 h-48 mx-auto rounded-full border-8 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-6xl font-bold text-white shadow-2xl transition-all duration-500 ${getAnimationClass()}`}
                >
                  {isFlipping ? (
                    <Coins className="h-24 w-24" />
                  ) : result === 'heads' ? (
                    '👑'
                  ) : result === 'tails' ? (
                    '🔢'
                  ) : (
                    <Coins className="h-24 w-24" />
                  )}
                </div>
                
                {result && !isFlipping && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-2 rounded-full font-semibold animate-fade-in">
                      {result.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={flipCoin}
                disabled={isFlipping}
                className="btn-primary text-lg px-8 py-3"
              >
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
              </Button>
            </div>
          </div>

          {/* Statistics */}
          {totalFlips > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Flips:</span>
                    <span className="font-bold">{totalFlips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heads:</span>
                    <span className="font-bold">{stats.heads} ({headsPercentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tails:</span>
                    <span className="font-bold">{stats.tails} ({tailsPercentage}%)</span>
                  </div>
                </div>
                
                {/* Progress bars */}
                <div className="mt-4 space-y-2">
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${headsPercentage}%` }}
                    ></div>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${tailsPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent History</h3>
                <div className="grid grid-cols-5 gap-2">
                  {history.map((flip, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        flip === 'heads' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {flip === 'heads' ? 'H' : 'T'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {totalFlips > 0 && (
            <div className="text-center">
              <Button 
                onClick={resetStats}
                className="btn-glass"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Statistics
              </Button>
            </div>
          )}

          {/* Fairness Info */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Why This Is Truly Random</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Uses crypto.getRandomValues() for cryptographically secure randomness</p>
              <p>• Not dependent on predictable algorithms like Math.random()</p>
              <p>• Each flip is completely independent of previous results</p>
              <p>• Suitable for making unbiased decisions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoinFlipper;