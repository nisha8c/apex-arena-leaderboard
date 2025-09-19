import React from "react";
import { motion } from "framer-motion";

type IconProps = { className?: string };

// Tailwind gradient like: "from-purple-500 to-pink-500"
export interface StatsCardProps {
    title: string;
    value: number | string | React.ReactNode;
    icon: React.ComponentType<IconProps>;
    color: string;
    subtitle?: string;
    trend?: string; // e.g. "+12%" or "-3%"
}

export default function StatsCard({
                                      title,
                                      value,
                                      icon: Icon,
                                      color,
                                      subtitle,
                                      trend,
                                  }: StatsCardProps) {
    const isPositive = typeof trend === "string" && trend.trim().startsWith("+");

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-6 rounded-xl border border-white/10 relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 rounded-xl`} />

            <div className="relative flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <h3 className="text-3xl font-bold text-white">{value}</h3>
                        {trend && (
                            <span
                                className={`text-sm font-medium ${
                                    isPositive ? "text-green-400" : "text-red-400"
                                }`}
                            >
                {trend}
              </span>
                        )}
                    </div>
                    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
                </div>

                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 animate-pulse-glow`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </motion.div>
    );
}
