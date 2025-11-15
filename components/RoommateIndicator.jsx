"use client";

import React from 'react';

/**
 * RoommateIndicator - Shows the composition of a flatshare with emoji indicators
 * @param {Array} currentRoommates - Array of gender strings: ["FEMALE", "MALE", etc.]
 * @param {string} lookingForGender - "FEMALE", "MALE", or "ANY"
 * @param {number} spotsAvailable - Number of available spots (default 1)
 */
export default function RoommateIndicator({ 
  currentRoommates = [], 
  lookingForGender = "ANY",
  spotsAvailable = 1 
}) {
  const getGenderEmoji = (gender) => {
    switch(gender?.toUpperCase()) {
      case 'FEMALE':
        return { emoji: '👩', color: 'text-pink-600', bg: 'bg-pink-50' };
      case 'MALE':
        return { emoji: '👨', color: 'text-blue-600', bg: 'bg-blue-50' };
      default:
        return { emoji: '👤', color: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  const getLookingForEmoji = (gender) => {
    switch(gender?.toUpperCase()) {
      case 'FEMALE':
        return { emoji: '👩', color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-300' };
      case 'MALE':
        return { emoji: '👨', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300' };
      default:
        return { emoji: '👤', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' };
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Current roommates */}
      {currentRoommates.map((gender, index) => {
        const { emoji, color, bg } = getGenderEmoji(gender);
        return (
          <div
            key={`current-${index}`}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} ${color} text-sm`}
            title={`Current roommate: ${gender}`}
          >
            {emoji}
          </div>
        );
      })}
      
      {/* Available spots */}
      {Array.from({ length: spotsAvailable }).map((_, index) => {
        const { emoji, color, bg, border } = getLookingForEmoji(lookingForGender);
        return (
          <div
            key={`available-${index}`}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${bg} ${color} border-2 ${border} border-dashed animate-pulse`}
            title={`Looking for: ${lookingForGender === 'ANY' ? 'Any gender' : lookingForGender}`}
          >
            {emoji}
          </div>
        );
      })}
      
      {/* Total count label */}
      <span className="text-xs text-slate-500 ml-1">
        {currentRoommates.length + spotsAvailable} person WG
      </span>
    </div>
  );
}
