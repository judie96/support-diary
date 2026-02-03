import React, { useState, useEffect } from 'react';
import { Heart, TrendingDown, TrendingUp, Edit3, BarChart3, PlusCircle, X, CheckCircle } from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    text: '',
    mood: 3,
    tags: []
  });
  const [view, setView] = useState('write'); // 'write' or 'insights'
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const moodLabels = ['Drained', 'Rough', 'Okay', 'Good', 'Great'];
  const quickTags = [
    'Angry Customer', 'Felt Powerless', 'Repetitive Issue', 
    'Verbally Abused', 'System Failure', 'Win', 'Appreciated'
  ];

  // Load entries on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = localStorage.getItem('diary-entries');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.log('No existing entries');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.text.trim()) return;

    const newEntry = {
      ...currentEntry,
      timestamp: Date.now(),
      id: Date.now().toString()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    try {
      localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
      setCurrentEntry({ text: '', mood: 3, tags: [] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const deleteEntry = async (id) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    try {
      localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const toggleTag = (tag) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Calculate insights
  const avgMood = entries.length > 0 
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : 0;

  const recentAvgMood = entries.slice(0, 7).length > 0
    ? (entries.slice(0, 7).reduce((sum, e) => sum + e.mood, 0) / entries.slice(0, 7).length).toFixed(1)
    : 0;

  const trendDirection = recentAvgMood > avgMood ? 'up' : recentAvgMood < avgMood ? 'down' : 'stable';

  const topTags = entries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedTags = Object.entries(topTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 flex items-center justify-center">
        <div className="text-amber-800 text-lg font-serif">Loading your safe space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-4 md:p-8 font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Spectral:wght@300;400;600&display=swap');
        
        * {
          font-family: 'Spectral', serif;
        }
        
        h1, h2, h3 {
          font-family: 'Crimson Text', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        textarea:focus {
          outline: none;
          border-color: #d97706;
        }

        .grain {
          position: relative;
          overflow: hidden;
        }

        .grain::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-rose-600" fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900">Your Safe Space</h1>
          </div>
          <p className="text-amber-700 text-lg mt-2">
            A private place to process, reflect, and breathe
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 justify-center animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <button
            onClick={() => setView('write')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              view === 'write'
                ? 'bg-amber-800 text-amber-50 shadow-lg scale-105'
                : 'bg-white/60 text-amber-800 hover:bg-white/80'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            Write
          </button>
          <button
            onClick={() => setView('insights')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              view === 'insights'
                ? 'bg-amber-800 text-amber-50 shadow-lg scale-105'
                : 'bg-white/60 text-amber-800 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Insights
          </button>
        </div>

        {/* Write View */}
        {view === 'write' && (
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            {/* Quick Entry Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl grain border border-amber-200/50">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">How are you feeling?</h2>
              
              {/* Mood Slider */}
              <div className="mb-6">
                <label className="block text-amber-800 mb-3 font-semibold">Energy Level</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={currentEntry.mood}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                    className="flex-1 h-3 bg-amber-200 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #f59e0b 50%, #10b981 100%)`
                    }}
                  />
                  <span className="text-amber-900 font-semibold w-20 text-center">
                    {moodLabels[currentEntry.mood - 1]}
                  </span>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="mb-6">
                <label className="block text-amber-800 mb-3 font-semibold">What happened?</label>
                <div className="flex flex-wrap gap-2">
                  {quickTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        currentEntry.tags.includes(tag)
                          ? 'bg-amber-800 text-white shadow-md scale-105'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Entry */}
              <div className="mb-6">
                <label className="block text-amber-800 mb-3 font-semibold">
                  What's on your mind? (Private & stored locally)
                </label>
                <textarea
                  value={currentEntry.text}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Let it out. You're safe here. No one will see this but you..."
                  className="w-full h-40 p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-300/30 text-amber-900 placeholder-amber-400 resize-none"
                  style={{ lineHeight: '1.8' }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={saveEntry}
                disabled={!currentEntry.text.trim()}
                className="w-full bg-gradient-to-r from-amber-700 to-rose-700 text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <PlusCircle className="w-5 h-5 inline mr-2" />
                Save Entry
              </button>

              {showSuccess && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-xl flex items-center gap-2 animate-slideIn">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <span className="text-green-800 font-semibold">Entry saved securely</span>
                </div>
              )}
            </div>

            {/* Recent Entries */}
            {entries.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl grain border border-amber-200/50">
                <h3 className="text-2xl font-bold text-amber-900 mb-6">Recent Entries</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {entries.slice(0, 5).map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200/50 animate-slideIn"
                      style={{animationDelay: `${idx * 0.1}s`}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-sm text-amber-600 mb-1">
                            {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="font-semibold text-amber-900">
                            Feeling: {moodLabels[entry.mood - 1]}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-rose-600 hover:text-rose-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-amber-200/60 text-amber-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-amber-800 text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insights View */}
        {view === 'insights' && (
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            {entries.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl text-center grain border border-amber-200/50">
                <BarChart3 className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-900 mb-2">No entries yet</h3>
                <p className="text-amber-700">Start writing to see your patterns and insights</p>
              </div>
            ) : (
              <>
                {/* Overall Mood */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl grain border border-amber-200/50">
                  <h3 className="text-2xl font-bold text-amber-900 mb-6">Your Journey</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-rose-100 rounded-2xl">
                      <div className="text-4xl font-bold text-amber-900 mb-2">{avgMood}</div>
                      <div className="text-amber-700">Overall Average</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl">
                      <div className="text-4xl font-bold text-amber-900 mb-2">{recentAvgMood}</div>
                      <div className="text-amber-700">Last 7 Entries</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {trendDirection === 'up' && <TrendingUp className="w-8 h-8 text-green-600" />}
                        {trendDirection === 'down' && <TrendingDown className="w-8 h-8 text-rose-600" />}
                        {trendDirection === 'stable' && <div className="w-8 h-1 bg-amber-600 rounded" />}
                      </div>
                      <div className="text-amber-700">
                        {trendDirection === 'up' && 'Improving'}
                        {trendDirection === 'down' && 'Declining'}
                        {trendDirection === 'stable' && 'Stable'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Patterns */}
                {sortedTags.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl grain border border-amber-200/50">
                    <h3 className="text-2xl font-bold text-amber-900 mb-6">Common Patterns</h3>
                    <div className="space-y-4">
                      {sortedTags.map(([tag, count], idx) => (
                        <div key={tag} className="animate-slideIn" style={{animationDelay: `${idx * 0.1}s`}}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-amber-900 font-semibold">{tag}</span>
                            <span className="text-amber-700">{count} times</span>
                          </div>
                          <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-600 to-rose-600 rounded-full transition-all duration-1000"
                              style={{ width: `${(count / entries.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Encouragement */}
                <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-8 shadow-xl text-center grain border border-rose-200/50">
                  <Heart className="w-12 h-12 text-rose-600 mx-auto mb-4 animate-pulse-slow" fill="currentColor" />
                  <h3 className="text-xl font-bold text-amber-900 mb-2">You've logged {entries.length} entries</h3>
                  <p className="text-amber-800 leading-relaxed">
                    Taking time to process your experiences is an act of self-care. 
                    You're doing important work by showing up for yourself.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
