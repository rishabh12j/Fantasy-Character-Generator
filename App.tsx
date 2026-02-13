import React, { useState } from 'react';
import { generateCharacter, generateCharacterPortrait, generateBackstory } from './services/geminiService';
import { Character } from './types';
import { CharacterCard } from './components/CharacterCard';
import { Sparkles, Dna, Dice5, Library } from 'lucide-react';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [deck, setDeck] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [backstoryLoading, setBackstoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummon = async () => {
    setLoading(true);
    setError(null);
    setImageLoading(false);
    setBackstoryLoading(false);
    try {
      const newCharacter = await generateCharacter();
      setCharacter(newCharacter);
    } catch (err) {
      setError("The summoning ritual failed. The spirits are silent. (Check your API Key)");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!character) return;
    
    setImageLoading(true);
    try {
      const imageUrl = await generateCharacterPortrait(character);
      setCharacter(prev => prev ? { ...prev, imageUrl } : null);
    } catch (err) {
      setError("The vision is clouded. Could not manifest the portrait.");
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateBackstory = async () => {
    if (!character) return;
    
    setBackstoryLoading(true);
    try {
      const newBio = await generateBackstory(character);
      setCharacter(prev => prev ? { ...prev, bio: newBio } : null);
    } catch (err) {
      setError("The ink has dried. Could not rewrite the scroll.");
      console.error(err);
    } finally {
      setBackstoryLoading(false);
    }
  };

  const handleSaveToDeck = () => {
    if (character && !deck.find(c => c.id === character.id)) {
      setDeck(prev => [...prev, character]);
    }
  };

  const isCurrentCharacterSaved = character ? deck.some(c => c.id === character.id) : false;

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 flex flex-col items-center py-8 px-4 md:px-8 overflow-y-auto">
      
      {/* Header */}
      <header className="mb-8 text-center max-w-2xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-fantasy font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] mb-2">
          Mythic TCG Forge
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-serif italic">
          Forge your deck from the chaos of the void.
        </p>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Generator */}
          <div className="lg:col-span-5 flex flex-col items-center gap-8">
            {/* Controls */}
            <div className="w-full flex justify-center">
                 <button
                  onClick={handleSummon}
                  disabled={loading}
                  className={`
                    w-full max-w-xs group relative px-6 py-4 rounded-lg font-fantasy text-lg tracking-widest uppercase font-bold text-amber-100
                    transition-all duration-300 ease-out flex items-center justify-center gap-3
                    ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105 active:scale-95 cursor-pointer'}
                  `}
                >
                  <div className="absolute inset-0 bg-slate-900 border-2 border-amber-600 rounded-lg shadow-[0_0_20px_rgba(217,119,6,0.3)] group-hover:shadow-[0_0_35px_rgba(217,119,6,0.6)] group-hover:border-amber-400 transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <><div className="animate-spin-slow"><Dna size={20} className="text-amber-400" /></div> Forging...</>
                    ) : (
                      <><Sparkles size={20} className="text-amber-400" /> Forge Card</>
                    )}
                  </span>
                </button>
            </div>

            {/* Main Card Display */}
            <div className="min-h-[500px] flex items-center justify-center w-full">
                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-6 py-4 rounded-md backdrop-blur-sm max-w-lg text-center animate-fade-in absolute z-50">
                        <p className="flex items-center justify-center gap-2"><span className="text-xl">⚠️</span> {error}</p>
                    </div>
                )}

                {character ? (
                  <CharacterCard 
                    character={character} 
                    onGenerateImage={handleGenerateImage}
                    isGeneratingImage={imageLoading}
                    onGenerateBackstory={handleGenerateBackstory}
                    isGeneratingBackstory={backstoryLoading}
                    onSaveToDeck={handleSaveToDeck}
                    isSaved={isCurrentCharacterSaved}
                    variant="full"
                  />
                ) : (
                  !loading && (
                    <div className="text-center text-slate-600 flex flex-col items-center gap-4 animate-pulse">
                      <div className="p-6 rounded-full bg-slate-900/50 border border-slate-800">
                        <Dice5 size={48} className="opacity-50" />
                      </div>
                      <p className="font-serif italic text-lg max-w-xs">
                        The workbench is empty. Forge a new card to begin.
                      </p>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: Deck List */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
                  <Library className="text-amber-500" size={28} />
                  <h2 className="text-2xl font-fantasy text-slate-200">My Deck <span className="text-slate-500 text-lg">({deck.length})</span></h2>
              </div>
              
              {deck.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-60">
                      <div className="w-24 h-32 border-2 border-dashed border-slate-700 rounded-lg mb-4"></div>
                      <p className="font-serif italic">No cards collected yet.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                      {deck.map((card) => (
                          <CharacterCard key={card.id} character={card} variant="mini" />
                      ))}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default App;