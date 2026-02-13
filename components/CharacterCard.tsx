import React from 'react';
import { Character } from '../types';
import { 
  Sword, 
  Heart, 
  Droplet, 
  Sparkles, 
  Image as ImageIcon,
  RefreshCw,
  Loader2,
  Save
} from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onGenerateImage?: () => void;
  isGeneratingImage?: boolean;
  onGenerateBackstory?: () => void;
  isGeneratingBackstory?: boolean;
  onSaveToDeck?: () => void;
  isSaved?: boolean;
  variant?: 'full' | 'mini';
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onGenerateImage, 
  isGeneratingImage = false,
  onGenerateBackstory,
  isGeneratingBackstory = false,
  onSaveToDeck,
  isSaved = false,
  variant = 'full'
}) => {
  
  const isMini = variant === 'mini';

  if (isMini) {
    return (
      <div className="relative w-48 h-64 bg-slate-800 rounded-lg border-2 border-amber-600/50 overflow-hidden shadow-lg flex flex-col group hover:scale-105 transition-transform cursor-pointer">
        {/* Mini Header */}
        <div className="bg-slate-900 p-2 border-b border-amber-600/30">
            <h3 className="text-amber-100 font-fantasy text-xs font-bold truncate text-center">{character.name}</h3>
        </div>
        
        {/* Mini Image Area */}
        <div className="flex-1 bg-black relative">
             {character.imageUrl ? (
                <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Sparkles size={24} />
                </div>
             )}
             
             {/* Stats Overlay */}
             <div className="absolute bottom-0 w-full flex justify-between px-2 pb-1 bg-gradient-to-t from-black/80 to-transparent pt-4">
                <div className="flex items-center gap-1 text-red-400 font-bold text-xs drop-shadow-md">
                    <Sword size={10} /> {character.tcgStats.strength}
                </div>
                <div className="flex items-center gap-1 text-green-400 font-bold text-xs drop-shadow-md">
                    <Heart size={10} /> {character.tcgStats.health}
                </div>
             </div>
        </div>

        {/* Mini Footer */}
        <div className="bg-slate-900 p-1 text-[10px] text-center text-slate-400 border-t border-amber-600/30 truncate">
            {character.race} {character.characterClass}
        </div>
      </div>
    );
  }

  // FULL SIZE CARD
  return (
    <div className="relative group animate-fade-in-up">
        {/* Main Card Container */}
        <div className="w-[320px] md:w-[380px] aspect-[2.5/3.5] bg-slate-800 rounded-xl p-2 relative shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-900">
            
            {/* Outer Border Frame */}
            <div className="absolute inset-0 rounded-xl border-[6px] border-amber-700/60 pointer-events-none z-20 shadow-inner"></div>
            <div className="absolute inset-1 rounded-lg border-2 border-amber-500/30 pointer-events-none z-20"></div>

            {/* Inner Content Area */}
            <div className="h-full w-full bg-slate-900 rounded-lg flex flex-col overflow-hidden relative">
                
                {/* 1. Header: Name & Mana */}
                <div className="h-10 bg-gradient-to-r from-slate-800 to-slate-900 border-b-2 border-amber-600/50 flex items-center justify-between px-3 relative z-10">
                    <h2 className="font-fantasy text-amber-100 font-bold tracking-wider text-sm truncate shadow-black drop-shadow-md">
                        {character.name}
                    </h2>
                    
                    {/* Mana Crystal */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 border-2 border-slate-300 shadow-[0_0_10px_rgba(59,130,246,0.6)] flex items-center justify-center font-bold text-white text-sm -mr-1">
                        {character.tcgStats.mana}
                    </div>
                </div>

                {/* 2. Image Area */}
                <div className="relative h-48 bg-black border-b-4 border-amber-800/80 group/image overflow-hidden">
                    {character.imageUrl ? (
                        <>
                            <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
                            <button
                                onClick={onGenerateImage}
                                disabled={isGeneratingImage}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity border border-white/20"
                                title="Regenerate Art"
                            >
                                {isGeneratingImage ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                             <button
                                onClick={onGenerateImage}
                                disabled={isGeneratingImage}
                                className="flex flex-col items-center gap-2 text-slate-500 hover:text-amber-400 transition-colors"
                             >
                                {isGeneratingImage ? <Loader2 size={32} className="animate-spin" /> : <ImageIcon size={32} />}
                                <span className="font-fantasy text-xs uppercase tracking-widest">Generate Art</span>
                             </button>
                        </div>
                    )}
                </div>

                {/* 3. Type Line */}
                <div className="h-7 bg-slate-800 border-y border-amber-600/30 flex items-center justify-center relative shadow-md z-10">
                     <span className="text-xs font-serif italic text-amber-200/80">
                        {character.race} • {character.characterClass}
                     </span>
                </div>

                {/* 4. Text Box */}
                <div className="flex-1 bg-slate-800/80 p-3 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-10"></div>
                    
                    {/* Skills */}
                    <div className="space-y-1 mb-2">
                        {character.skills.slice(0, 2).map((skill, i) => (
                            <div key={i} className="text-xs text-slate-200 font-bold flex items-center gap-1">
                                <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                {skill}
                            </div>
                        ))}
                    </div>

                    {/* Flavor Text */}
                    <div className="mt-2 border-t border-slate-600/30 pt-1 relative group/bio">
                         <p className="text-[11px] leading-tight text-slate-400 font-serif italic">
                            "{character.bio}"
                         </p>
                         <button
                            onClick={onGenerateBackstory}
                            disabled={isGeneratingBackstory}
                            className="absolute -top-3 right-0 text-slate-600 hover:text-amber-500 opacity-0 group-hover/bio:opacity-100 transition-opacity"
                         >
                            <RefreshCw size={10} />
                         </button>
                    </div>
                </div>

                {/* 5. Footer Stats */}
                <div className="h-12 bg-slate-900 relative">
                     {/* Strength */}
                     <div className="absolute bottom-2 left-2 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-400 rounded-lg transform rotate-45 border-2 border-amber-700 shadow-lg flex items-center justify-center z-20">
                        <div className="transform -rotate-45 flex flex-col items-center justify-center">
                            <Sword size={12} className="text-amber-900 mb-[-2px]" />
                            <span className="text-amber-950 font-black text-sm">{character.tcgStats.strength}</span>
                        </div>
                     </div>

                     {/* Health */}
                     <div className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-red-400 to-red-700 rounded-full border-2 border-red-900 shadow-lg flex items-center justify-center z-20">
                         <div className="flex flex-col items-center justify-center">
                            <span className="text-white font-black text-sm drop-shadow-md">{character.tcgStats.health}</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="mt-6 flex justify-center gap-4">
            <button
                onClick={onSaveToDeck}
                disabled={isSaved}
                className={`
                    flex items-center gap-2 px-6 py-2 rounded-full font-fantasy uppercase tracking-wider text-sm border-2 transition-all
                    ${isSaved 
                        ? 'bg-green-900/50 border-green-500/50 text-green-400 cursor-default' 
                        : 'bg-slate-800 border-amber-600/50 text-amber-100 hover:bg-slate-700 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                    }
                `}
            >
                {isSaved ? (
                    <>
                        <Sparkles size={16} /> Added to Deck
                    </>
                ) : (
                    <>
                        <Save size={16} /> Save to Deck
                    </>
                )}
            </button>
        </div>
    </div>
  );
};