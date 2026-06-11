/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface DailyGoalMeterProps {
  completedCount: number;
  totalCount: number;
}

export default function DailyGoalMeter({ completedCount, totalCount }: DailyGoalMeterProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const encouragementInfo = useMemo(() => {
    if (totalCount === 0) {
      return {
        text: 'วันนี้ยังไม่มีรายการงาน แตะปุ่มสร้างงานเพื่อลุยเลย!',
        color: 'text-vibrant-yellow',
        icon: Sparkles,
      };
    }
    if (percentage === 0) {
      return {
        text: 'มาเริ่มต้นลุยภารกิจวันนี้กันเลย! 💪',
        color: 'text-vibrant-yellow',
        icon: TrendingUp,
      };
    }
    if (percentage < 50) {
      return {
        text: 'กำลังเดินหน้าได้ดี! พยายามต่อยอดอีกนิดนะ 😊',
        color: 'text-vibrant-yellow',
        icon: TrendingUp,
      };
    }
    if (percentage < 100) {
      return {
        text: 'ทำเสร็จเกินครึ่งแล้ว! อีกนิดเดียวจะครบแล้วนะ ✨',
        color: 'text-vibrant-yellow',
        icon: Sparkles,
      };
    }
    return {
      text: 'ยอดเยี่ยมมาก! คุณทำสำเร็จครบถ้วนทุกรายการแล้ว 🎉',
      color: 'text-[#4ECDC4]',
      icon: CheckCircle2,
    };
  }, [percentage, totalCount]);

  const IconComponent = encouragementInfo.icon;

  return (
    <div className="w-full bg-vibrant-purple text-white border-4 border-vibrant-dark rounded-[32px] p-6 shadow-md relative overflow-hidden">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-vibrant-yellow/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Statistics Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <IconComponent className={`w-5 h-5 ${encouragementInfo.color} stroke-[2.5]`} />
            <span className={`text-sm font-black uppercase tracking-wider ${encouragementInfo.color}`}>
              {totalCount > 0 ? `ความสำเร็จวันนี้: ${percentage}%` : 'ไม่มีภารกิจ'}
            </span>
          </div>
          
          <h4 className="text-white font-black text-xl leading-snug line-clamp-2">
            {encouragementInfo.text}
          </h4>

          {totalCount > 0 && (
            <p className="text-sm text-vibrant-light/80 font-bold mt-2">
              ทำเสร็จแล้ว <span className="font-extrabold text-vibrant-yellow">{completedCount}</span> จากทั้งหมด <span className="font-extrabold text-vibrant-yellow">{totalCount}</span> รายการ
            </p>
          )}
        </div>

        {/* Circular Dial represented beautifully */}
        {totalCount > 0 ? (
          <div className="relative flex items-center justify-center shrink-0 mx-auto sm:mx-0 bg-vibrant-dark p-1.5 border-2 border-white rounded-3xl">
            {/* SVG Progress Circle */}
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-white/20"
                strokeWidth="5"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-vibrant-yellow"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="163.36" // 2 * pi * r (2 * 3.1415 * 26)
                initial={{ strokeDashoffset: 163.36 }}
                animate={{ strokeDashoffset: 163.36 - (163.36 * percentage) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-white">
                {percentage}%
              </span>
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-3xl bg-white/10 border-2 border-white/25 flex items-center justify-center text-vibrant-yellow shrink-0 mx-auto sm:mx-0">
            <Sparkles className="w-7 h-7 text-vibrant-yellow" />
          </div>
        )}
      </div>

      {/* Progress gradient strip for extra visual delight */}
      {totalCount > 0 && (
        <div className="w-full bg-white/20 h-4 rounded-full mt-5 overflow-hidden border-2 border-vibrant-dark">
          <motion.div
            className="h-full bg-vibrant-yellow rounded-full shadow-[0_0_10px_rgba(255,217,61,0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
