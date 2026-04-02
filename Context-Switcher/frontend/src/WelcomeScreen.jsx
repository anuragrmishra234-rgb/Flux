import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';
import fluxLogo from './assets/flux-logo.png';

const WelcomeScreen = ({ onFinish }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#030712] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gray-900 border border-gray-800 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={fluxLogo}
                alt="Flux Logo"
                className="w-full h-full object-cover rounded-[2.3rem]"
              />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Flux</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            All your tabs in one place.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={onFinish}
            className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)]"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <div className="flex items-center gap-6 text-gray-600 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>Global</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span>AI Powered</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Floating Symbols */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[15%] text-indigo-500/20"
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
