import React from 'react';
import { BuddyId, OutfitId, HeadwearId, ToolItemId, ExpressionId, ThemeColorId } from '../types';

interface CharacterAvatarProps {
  buddyId: BuddyId;
  outfit?: OutfitId;
  headwear?: HeadwearId;
  toolItem?: ToolItemId;
  expression?: ExpressionId;
  themeColor?: ThemeColorId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  hasHonorMedal?: boolean;
  showAura?: boolean;
  animate?: boolean;
}

const THEME_ACCENTS: Record<ThemeColorId, { aura: string; outfitTint: string; ribbon: string }> = {
  amber: { aura: '#FEF3C7', outfitTint: '#D97706', ribbon: '#F59E0B' },
  emerald: { aura: '#D1FAE5', outfitTint: '#059669', ribbon: '#10B981' },
  sky: { aura: '#E0F2FE', outfitTint: '#0284C7', ribbon: '#38BDF8' },
  purple: { aura: '#F3E8FF', outfitTint: '#7C3AED', ribbon: '#A855F7' },
  rose: { aura: '#FFE4E6', outfitTint: '#E11D48', ribbon: '#FB7185' },
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  buddyId = 'owl',
  outfit = 'vest',
  headwear = 'safari',
  toolItem = 'magnifier',
  expression = 'smile',
  themeColor = 'amber',
  size = 'md',
  className = '',
  hasHonorMedal = false,
  showAura = true,
  animate = true,
}) => {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'xs' ? 36 
    : size === 'sm' ? 52 
    : size === 'md' ? 96 
    : size === 'lg' ? 144 
    : 196;

  const theme = THEME_ACCENTS[themeColor] || THEME_ACCENTS.amber;

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 200 220"
        className={`w-full h-full drop-shadow-sm ${animate ? 'hover:scale-105 transition-transform duration-300' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.12" />
          </filter>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="denim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <radialGradient id="glass-glare" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* 1. Background Aura Circle */}
        {showAura && (
          <circle cx="100" cy="110" r="92" fill={theme.aura} opacity="0.65" />
        )}

        {/* 2. BACK LAYERS (Cape, Wings, Tails) */}
        {outfit === 'cape' && (
          <path
            d="M 68 115 C 45 130 38 185 52 200 C 72 195 128 195 148 200 C 162 185 155 130 132 115 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="3"
            filter="url(#soft-shadow)"
          />
        )}

        {/* Tail / Back parts by Buddy */}
        {buddyId === 'cat' && (
          <path
            d="M 140 165 C 170 170 185 140 175 125 C 168 115 160 125 162 135 C 165 148 150 160 138 158"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}

        {buddyId === 'puppy' && (
          <path
            d="M 145 160 C 165 155 180 140 176 130 C 172 124 165 130 167 138 C 168 148 155 155 140 155"
            fill="none"
            stroke="#B45309"
            strokeWidth="9"
            strokeLinecap="round"
          />
        )}

        {buddyId === 'rabbit' && (
          <circle cx="148" cy="168" r="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
        )}

        {buddyId === 'bear' && (
          <circle cx="148" cy="165" r="10" fill="#92400E" />
        )}

        {buddyId === 'girl' && (
          /* Girl's Bouncy Twin Tails ( 양갈래 머리 ) */
          <g>
            {/* Left Pigtail */}
            <path
              d="M 52 75 C 28 65 18 90 28 110 C 35 122 48 115 50 100 Z"
              fill="#78350F"
            />
            <circle cx="50" cy="85" r="5" fill="#F43F5E" />

            {/* Right Pigtail */}
            <path
              d="M 148 75 C 172 65 182 90 172 110 C 165 122 152 115 150 100 Z"
              fill="#78350F"
            />
            <circle cx="150" cy="85" r="5" fill="#F43F5E" />
          </g>
        )}

        {/* 3. MAIN BODY BASE */}
        <g id="body-base">
          {/* Base body oval/torso */}
          {buddyId === 'owl' ? (
            <ellipse cx="100" cy="148" rx="46" ry="42" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
          ) : buddyId === 'cat' ? (
            <ellipse cx="100" cy="150" rx="44" ry="38" fill="#FDE68A" stroke="#F59E0B" strokeWidth="3" />
          ) : buddyId === 'puppy' ? (
            <ellipse cx="100" cy="150" rx="44" ry="38" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
          ) : buddyId === 'bear' ? (
            <ellipse cx="100" cy="150" rx="46" ry="40" fill="#B45309" stroke="#78350F" strokeWidth="3" />
          ) : buddyId === 'rabbit' ? (
            <ellipse cx="100" cy="150" rx="42" ry="38" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          ) : (
            /* Boy & Girl student body */
            <ellipse cx="100" cy="150" rx="40" ry="36" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
          )}

          {/* Feet / Paws */}
          <ellipse cx="78" cy="188" rx="14" ry="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#F8FAFC' : buddyId === 'owl' ? '#F59E0B' : '#64748B'} />
          <ellipse cx="122" cy="188" rx="14" ry="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#F8FAFC' : buddyId === 'owl' ? '#F59E0B' : '#64748B'} />
        </g>

        {/* 4. OUTFIT / CLOTHES LAYER (Worn on Body) */}
        <g id="outfit-layer">
          {outfit === 'vest' && (
            /* Explorer Safari Vest with pockets and zip */
            <g>
              <path
                d="M 62 125 C 60 148 64 178 76 182 C 90 184 100 184 100 135 C 80 130 68 120 62 125 Z"
                fill="#CA8A04"
                stroke="#854D0E"
                strokeWidth="2.5"
              />
              <path
                d="M 138 125 C 140 148 136 178 124 182 C 110 184 100 184 100 135 C 120 130 132 120 138 125 Z"
                fill="#CA8A04"
                stroke="#854D0E"
                strokeWidth="2.5"
              />
              {/* Vest Pockets */}
              <rect x="68" y="152" width="16" height="15" rx="3" fill="#A16207" stroke="#713F12" strokeWidth="1.5" />
              <rect x="116" y="152" width="16" height="15" rx="3" fill="#A16207" stroke="#713F12" strokeWidth="1.5" />
              {/* Explorer Compass Badge */}
              <circle cx="76" cy="138" r="4.5" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
            </g>
          )}

          {outfit === 'uniform' && (
            /* School Uniform: White collar + Navy Blazer + Tie */
            <g>
              {/* Shirt Base */}
              <path d="M 68 122 L 132 122 L 126 182 L 74 182 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
              {/* Blazer Sides */}
              <path d="M 64 124 L 84 124 L 74 182 L 64 180 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
              <path d="M 136 124 L 116 124 L 126 182 L 136 180 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="2" />
              {/* Red Tie */}
              <polygon points="97,126 103,126 105,155 100,162 95,155" fill="#DC2626" />
              <polygon points="95,124 105,124 102,130 98,130" fill="#B91C1C" />
            </g>
          )}

          {outfit === 'hoodie' && (
            /* Cozy Hoodie with kangaroo pocket */
            <g>
              <path
                d="M 64 125 C 62 150 66 180 80 182 C 100 184 120 184 136 182 C 142 165 140 140 136 125 C 118 132 82 132 64 125 Z"
                fill="#3B82F6"
                stroke="#1D4ED8"
                strokeWidth="2.5"
              />
              {/* Kangaroo Pocket */}
              <path d="M 80 156 L 120 156 L 116 178 L 84 178 Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5" />
              {/* Hoodie strings */}
              <line x1="93" y1="128" x2="93" y2="145" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="107" y1="128" x2="107" y2="145" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {outfit === 'overalls' && (
            /* Denim Overalls with Straps */
            <g>
              {/* Undershirt */}
              <path d="M 70 124 L 130 124 L 126 150 L 74 150 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              {/* Overalls Pants / Bib */}
              <path d="M 78 140 L 122 140 L 124 182 L 76 182 Z" fill="url(#denim-grad)" stroke="#0369A1" strokeWidth="2" />
              {/* Straps */}
              <line x1="82" y1="124" x2="84" y2="145" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
              <line x1="118" y1="124" x2="116" y2="145" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
              {/* Buttons */}
              <circle cx="84" cy="144" r="2.5" fill="#FDE047" stroke="#854D0E" strokeWidth="1" />
              <circle cx="116" cy="144" r="2.5" fill="#FDE047" stroke="#854D0E" strokeWidth="1" />
            </g>
          )}

          {outfit === 'cape' && (
            /* Front golden star clasp for the cape */
            <g>
              <polygon points="100,123 102,128 107,128 103,131 105,136 100,133 95,136 97,131 93,128 98,128" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 5. HEAD & EARS LAYER (Per Buddy) */}
        <g id="head-layer">
          {/* Owl Head & Feathers */}
          {buddyId === 'owl' && (
            <g>
              {/* Ear tufts */}
              <polygon points="68,60 55,30 80,48" fill="#64748B" stroke="#475569" strokeWidth="2.5" />
              <polygon points="132,60 145,30 120,48" fill="#64748B" stroke="#475569" strokeWidth="2.5" />
              {/* Head */}
              <circle cx="100" cy="80" r="44" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
              {/* Mask / Eye area */}
              <ellipse cx="80" cy="78" rx="18" ry="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <ellipse cx="120" cy="78" rx="18" ry="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              {/* Cute orange beak */}
              <polygon points="100,78 94,88 106,88" fill="#EA580C" />
            </g>
          )}

          {/* Cat Head & Ears */}
          {buddyId === 'cat' && (
            <g>
              {/* Ears */}
              <polygon points="62,60 50,28 78,45" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
              <polygon points="62,56 55,36 74,48" fill="#FBCFE8" />
              <polygon points="138,60 150,28 122,45" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
              <polygon points="138,56 145,36 126,48" fill="#FBCFE8" />
              {/* Round Head */}
              <circle cx="100" cy="82" r="43" fill="#FCD34D" stroke="#D97706" strokeWidth="3" />
              {/* Whiskers */}
              <line x1="56" y1="84" x2="38" y2="82" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="56" y1="90" x2="36" y2="92" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="144" y1="84" x2="162" y2="82" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              <line x1="144" y1="90" x2="164" y2="92" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
              {/* Cat Pink Nose */}
              <polygon points="100,85 96,81 104,81" fill="#F43F5E" />
            </g>
          )}

          {/* Puppy Head & Floppy Ears */}
          {buddyId === 'puppy' && (
            <g>
              {/* Floppy Left Ear */}
              <ellipse cx="58" cy="72" rx="14" ry="24" fill="#B45309" stroke="#78350F" strokeWidth="3" transform="rotate(25 58 72)" />
              {/* Floppy Right Ear */}
              <ellipse cx="142" cy="72" rx="14" ry="24" fill="#B45309" stroke="#78350F" strokeWidth="3" transform="rotate(-25 142 72)" />
              {/* Round Head */}
              <circle cx="100" cy="82" r="44" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
              {/* Puppy Eye Patch */}
              <circle cx="82" cy="76" r="16" fill="#FDBA74" opacity="0.6" />
              {/* Shiny Black Nose */}
              <ellipse cx="100" cy="86" rx="6" ry="4.5" fill="#1E293B" />
              <circle cx="98" cy="85" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Bear Head & Round Ears */}
          {buddyId === 'bear' && (
            <g>
              {/* Round Left Ear */}
              <circle cx="64" cy="46" r="16" fill="#92400E" stroke="#78350F" strokeWidth="3" />
              <circle cx="64" cy="46" r="9" fill="#FDE68A" />
              {/* Round Right Ear */}
              <circle cx="136" cy="46" r="16" fill="#92400E" stroke="#78350F" strokeWidth="3" />
              <circle cx="136" cy="46" r="9" fill="#FDE68A" />
              {/* Bear Head */}
              <circle cx="100" cy="82" r="44" fill="#B45309" stroke="#78350F" strokeWidth="3" />
              {/* Snout Muzzle Oval */}
              <ellipse cx="100" cy="90" rx="18" ry="14" fill="#FEF3C7" stroke="#CA8A04" strokeWidth="1.5" />
              <ellipse cx="100" cy="86" rx="6" ry="4.5" fill="#451A03" />
            </g>
          )}

          {/* Rabbit Head & Tall Ears */}
          {buddyId === 'rabbit' && (
            <g>
              {/* Tall Left Ear */}
              <path d="M 68 55 C 55 20 65 5 76 6 C 84 8 86 35 78 55 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
              <path d="M 70 50 C 62 25 70 12 75 13 C 80 15 80 35 76 50 Z" fill="#FCE7F3" />
              {/* Tall Right Ear */}
              <path d="M 132 55 C 145 20 135 5 124 6 C 116 8 114 35 122 55 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
              <path d="M 130 50 C 138 25 130 12 125 13 C 120 15 120 35 124 50 Z" fill="#FCE7F3" />
              {/* Rabbit Head */}
              <circle cx="100" cy="82" r="42" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
              {/* Tiny Pink Bunny Nose */}
              <polygon points="100,86 96,82 104,82" fill="#FB7185" />
            </g>
          )}

          {/* Boy Student Head & Hair */}
          {buddyId === 'boy' && (
            <g>
              {/* Boy Head Base */}
              <circle cx="100" cy="82" r="42" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="3" />
              {/* Boy Ears */}
              <circle cx="58" cy="82" r="8" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="2" />
              <circle cx="142" cy="82" r="8" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="2" />
              {/* Cool Brown Hair Bangs */}
              <path
                d="M 58 75 C 54 42 75 32 100 32 C 125 32 146 42 142 75 C 138 62 130 58 122 65 C 114 56 102 56 94 66 C 86 58 72 60 58 75 Z"
                fill="#451A03"
              />
              {/* Tiny nose */}
              <circle cx="100" cy="84" r="2" fill="#EA580C" />
            </g>
          )}

          {/* Girl Student Head & Hair */}
          {buddyId === 'girl' && (
            <g>
              {/* Girl Head Base */}
              <circle cx="100" cy="82" r="42" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="3" />
              {/* Girl Ears */}
              <circle cx="58" cy="82" r="8" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="2" />
              <circle cx="142" cy="82" r="8" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="2" />
              {/* Cute Bangs */}
              <path
                d="M 58 78 C 55 42 75 34 100 34 C 125 34 145 42 142 78 C 134 68 126 66 118 70 C 110 65 90 65 82 70 C 74 66 66 68 58 78 Z"
                fill="#78350F"
              />
              {/* Tiny nose */}
              <circle cx="100" cy="84" r="2" fill="#EA580C" />
            </g>
          )}
        </g>

        {/* 6. FACIAL EXPRESSIONS & BLUSH */}
        <g id="face-expression">
          {/* Pastel Cheek Blushes */}
          <ellipse cx="76" cy="90" rx="8" ry="4.5" fill="#FB7185" opacity="0.6" />
          <ellipse cx="124" cy="90" rx="8" ry="4.5" fill="#FB7185" opacity="0.6" />

          {/* Eyes depending on expression */}
          {expression === 'smile' && (
            /* Cute happy curved eyes ^_^ */
            <g>
              <path d="M 74 78 Q 83 70 92 78" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 108 78 Q 117 70 126 78" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          {expression === 'wink' && (
            /* Left winking eye > and right open sparkling eye */
            <g>
              <path d="M 74 74 L 84 79 L 74 84" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right Open Eye */}
              <circle cx="118" cy="78" r="7.5" fill="#1E293B" />
              <circle cx="116" cy="75" r="2.5" fill="#FFFFFF" />
              <circle cx="120" cy="80" r="1.2" fill="#FFFFFF" />
            </g>
          )}

          {expression === 'sparkle' && (
            /* Ultra sparkling manga stars in both eyes */
            <g>
              {/* Left Eye */}
              <ellipse cx="82" cy="78" rx="8" ry="9" fill="#1E293B" />
              <polygon points="82,72 84,76 88,77 84,79 83,83 80,80 76,80 79,77" fill="#FDE047" />
              <circle cx="85" cy="75" r="2" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="118" cy="78" rx="8" ry="9" fill="#1E293B" />
              <polygon points="118,72 120,76 124,77 120,79 119,83 116,80 112,80 115,77" fill="#FDE047" />
              <circle cx="121" cy="75" r="2" fill="#FFFFFF" />
            </g>
          )}

          {expression === 'proud' && (
            /* Determined, confident smile */
            <g>
              <line x1="74" y1="72" x2="88" y2="75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="82" cy="78" r="6" fill="#1E293B" />
              <circle cx="80" cy="76" r="2" fill="#FFFFFF" />

              <line x1="126" y1="72" x2="112" y2="75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="118" cy="78" r="6" fill="#1E293B" />
              <circle cx="116" cy="76" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Joyful open mouth */}
          {buddyId !== 'owl' && (
            <path
              d="M 93 93 Q 100 102 107 93 Z"
              fill="#E11D48"
              stroke="#9F1239"
              strokeWidth="1.5"
            />
          )}
        </g>

        {/* 7. HEADWEAR / HATS (PROPERLY FITTED ON TOP OF HEAD!) */}
        <g id="headwear-layer">
          {headwear === 'safari' && (
            /* Wide-brimmed Khaki Explorer Hat with Badge & Strap */
            <g filter="url(#soft-shadow)">
              {/* Hat Crown Dome */}
              <path
                d="M 72 45 C 72 20 128 20 128 45 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="2.5"
              />
              {/* Hat Leather Band */}
              <rect x="73" y="38" width="54" height="7" rx="2" fill="#78350F" />
              {/* Golden Badge */}
              <circle cx="100" cy="41" r="3.5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
              {/* Hat Brim */}
              <ellipse cx="100" cy="46" rx="46" ry="12" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            </g>
          )}

          {headwear === 'cap' && (
            /* Athletic Baseball Cap with Visor */
            <g filter="url(#soft-shadow)">
              {/* Dome */}
              <path d="M 68 46 C 68 18 132 18 132 46 Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="2.5" />
              {/* Front Logo 'S' */}
              <circle cx="100" cy="33" r="6" fill="#FFFFFF" />
              <text x="100" y="36.5" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1E40AF">S</text>
              {/* Front Visor Brim */}
              <path d="M 66 46 C 66 46 90 58 140 48 C 135 44 125 43 66 46 Z" fill="#1D4ED8" stroke="#1E3A8A" strokeWidth="2" />
              {/* Top button */}
              <circle cx="100" cy="20" r="3" fill="#1E40AF" />
            </g>
          )}

          {headwear === 'crown' && (
            /* Shiny 5-Point Royal Crown with Jewels */
            <g filter="url(#soft-shadow)">
              <polygon
                points="72,44 68,18 84,32 100,10 116,32 132,18 128,44"
                fill="url(#gold-grad)"
                stroke="#B45309"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <rect x="70" y="40" width="60" height="7" rx="2" fill="#EAB308" stroke="#A16207" strokeWidth="1.5" />
              {/* Jewels */}
              <circle cx="100" cy="24" r="3" fill="#EF4444" stroke="#991B1B" strokeWidth="0.8" />
              <circle cx="84" cy="34" r="2.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.8" />
              <circle cx="116" cy="34" r="2.5" fill="#10B981" stroke="#047857" strokeWidth="0.8" />
            </g>
          )}

          {headwear === 'beret' && (
            /* Artist Beret tilted on Head */
            <g filter="url(#soft-shadow)">
              <ellipse cx="104" cy="38" rx="38" ry="16" fill="#BE185D" stroke="#831843" strokeWidth="2.5" transform="rotate(-10 104 38)" />
              {/* Top stem */}
              <line x1="104" y1="22" x2="104" y2="16" stroke="#831843" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {headwear === 'flower' && (
            /* Beautiful Cherry Blossom Flower Hairpin on Ear */
            <g filter="url(#soft-shadow)">
              <g transform="translate(132, 42)">
                <circle cx="0" cy="0" r="5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
                <circle cx="0" cy="-9" r="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                <circle cx="9" cy="-3" r="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                <circle cx="6" cy="8" r="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                <circle cx="-6" cy="8" r="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                <circle cx="-9" cy="-3" r="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />
                {/* Green Leaf */}
                <path d="M 5 12 Q 15 16 12 6 Z" fill="#22C55E" />
              </g>
            </g>
          )}

          {headwear === 'headphone' && (
            /* DJ Audio Headphones across Head */
            <g filter="url(#soft-shadow)">
              {/* Headband arch */}
              <path d="M 56 80 C 54 25 146 25 144 80" fill="none" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
              {/* Left Earcup */}
              <rect x="48" y="65" width="12" height="26" rx="6" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
              {/* Right Earcup */}
              <rect x="140" y="65" width="12" height="26" rx="6" fill="#A855F7" stroke="#6B21A8" strokeWidth="2" />
            </g>
          )}

          {headwear === 'grad' && (
            /* Academic Mortarboard Graduation Cap with Golden Tassel */
            <g filter="url(#soft-shadow)">
              {/* Skull cap band */}
              <path d="M 78 44 C 78 35 122 35 122 44 Z" fill="#1E293B" />
              {/* Diamond Board */}
              <polygon points="100,16 148,32 100,48 52,32" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              {/* Button & Golden Tassel */}
              <circle cx="100" cy="32" r="3" fill="#FDE047" />
              <path d="M 100 32 C 120 34 135 44 135 60" fill="none" stroke="#EAB308" strokeWidth="2.5" />
              <polygon points="133,60 137,60 138,70 132,70" fill="#CA8A04" />
            </g>
          )}
        </g>

        {/* 8. HANDS & EQUIPPED TOOL ITEM (PROPERLY HELD IN HAND!) */}
        <g id="tool-layer">
          {/* Left Hand / Paw (Rests gently) */}
          <circle cx="64" cy="155" r="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />

          {/* Right Hand / Paw holding the selected tool! */}
          {toolItem === 'magnifier' && (
            /* Big Golden Magnifier Held Up */
            <g filter="url(#soft-shadow)">
              {/* Wooden Handle */}
              <line x1="140" y1="160" x2="162" y2="185" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
              {/* Glass Frame */}
              <circle cx="155" cy="145" r="18" fill="url(#glass-glare)" stroke="#EAB308" strokeWidth="4" />
              {/* Glass Glare arc */}
              <path d="M 144 136 A 14 14 0 0 1 164 140" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right Hand clasping */}
              <circle cx="144" cy="162" r="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'camera' && (
            /* Vintage Explorer Camera with Neckstrap and Flash */
            <g filter="url(#soft-shadow)">
              {/* Neck strap line */}
              <path d="M 90 125 C 105 145 130 148 145 152" fill="none" stroke="#475569" strokeWidth="2.5" strokeDasharray="3 2" />
              {/* Camera Body */}
              <rect x="130" y="140" width="34" height="25" rx="5" fill="#334155" stroke="#1E293B" strokeWidth="2" />
              <rect x="130" y="147" width="34" height="11" fill="#64748B" />
              {/* Lens */}
              <circle cx="147" cy="152" r="8" fill="#0284C7" stroke="#E2E8F0" strokeWidth="2" />
              <circle cx="145" cy="150" r="2" fill="#FFFFFF" />
              {/* Flash / Shutter button */}
              <rect x="135" y="137" width="6" height="3" fill="#EF4444" rx="1" />
              {/* Hand */}
              <circle cx="134" cy="155" r="8" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'flag' && (
            /* School Explorer Swallowtail Flag waving */
            <g filter="url(#soft-shadow)">
              {/* Pole */}
              <line x1="148" y1="90" x2="148" y2="185" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
              {/* Flag pennant */}
              <polygon points="148,94 185,108 148,122" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
              <circle cx="160" cy="108" r="4" fill="#FDE047" />
              {/* Hand clasping pole */}
              <circle cx="148" cy="150" r="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'map' && (
            /* Rolled Treasure Map with 'X' */
            <g filter="url(#soft-shadow)">
              <rect x="132" y="135" width="28" height="36" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" transform="rotate(-15 146 153)" />
              <path d="M 136 146 Q 146 152 142 160" fill="none" stroke="#B45309" strokeWidth="2" strokeDasharray="2 2" />
              <text x="145" y="162" fontSize="9" fontWeight="bold" fill="#DC2626">✕</text>
              <circle cx="140" cy="155" r="9" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'palette' && (
            /* Artist Palette with Paint Splatters & Brush */
            <g filter="url(#soft-shadow)">
              <ellipse cx="152" cy="152" rx="18" ry="14" fill="#D97706" stroke="#92400E" strokeWidth="2" />
              <circle cx="160" cy="152" r="3.5" fill="#FFFFFF" />
              {/* Paint blobs */}
              <circle cx="144" cy="146" r="2.5" fill="#EF4444" />
              <circle cx="148" cy="143" r="2.5" fill="#3B82F6" />
              <circle cx="154" cy="144" r="2.5" fill="#FACC15" />
              <circle cx="145" cy="154" r="2.5" fill="#10B981" />
              {/* Brush */}
              <line x1="165" y1="135" x2="148" y2="162" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <circle cx="138" cy="155" r="8" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'trophy' && (
            /* Golden Champion Trophy */
            <g filter="url(#soft-shadow)">
              {/* Cup */}
              <path d="M 134 135 L 160 135 L 155 155 Q 147 163 147 166 L 143 166 L 143 172 L 154 172 L 154 175 L 138 175 L 138 172 L 143 172" fill="url(#gold-grad)" stroke="#B45309" strokeWidth="1.5" />
              {/* Trophy Handles */}
              <path d="M 134 140 C 127 140 127 148 135 150" fill="none" stroke="#CA8A04" strokeWidth="2" />
              <path d="M 160 140 C 167 140 167 148 159 150" fill="none" stroke="#CA8A04" strokeWidth="2" />
              {/* Star on Cup */}
              <polygon points="147,143 148,146 151,146 149,148 150,151 147,149 144,151 145,148 143,146 146,146" fill="#FFFFFF" />
              <circle cx="138" cy="155" r="8" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}

          {toolItem === 'ball' && (
            /* Basketball held */
            <g filter="url(#soft-shadow)">
              <circle cx="150" cy="152" r="15" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
              <line x1="135" y1="152" x2="165" y2="152" stroke="#431407" strokeWidth="1.5" />
              <line x1="150" y1="137" x2="150" y2="167" stroke="#431407" strokeWidth="1.5" />
              <circle cx="138" cy="155" r="8" fill={buddyId === 'bear' ? '#78350F' : buddyId === 'rabbit' ? '#FFFFFF' : '#FBBF24'} stroke="#94A3B8" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* 9. STAMP HONOR MEDAL (if unlocked) */}
        {hasHonorMedal && (
          <g filter="url(#soft-shadow)">
            {/* V-neck Ribbon */}
            <path d="M 85 125 L 100 148 L 115 125" fill="none" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" />
            {/* Gold Medal */}
            <circle cx="100" cy="150" r="10" fill="url(#gold-grad)" stroke="#B45309" strokeWidth="2" />
            <polygon points="100,144 102,148 106,148 103,151 104,155 100,153 96,155 97,151 94,148 98,148" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
