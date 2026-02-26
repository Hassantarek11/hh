import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 mb-12">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      
      <div className="relative z-10 px-8 py-16 md:py-24 md:px-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
              وصل حديثاً
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              مستقبل <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                التكنولوجيا
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto md:mx-0">
              اكتشف مجموعتنا المميزة من إلكترونيات الجيل القادم.
              مصممة لأولئك الذين يطلبون الأفضل.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => {
              const element = document.getElementById('products-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-12 -translate-x-[150%]"></div>
            <span className="relative z-10">تسوق الآن</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:-translate-x-1 transition-transform rotate-180" />
          </motion.button>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative z-10"
          >
             {/* Abstract 3D-like visual or hero image */}
             <img 
               src="https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&q=80&w=800" 
               alt="Hero Device" 
               className="w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500"
               style={{ filter: 'drop-shadow(0 20px 40px rgba(109, 40, 217, 0.3))' }}
             />
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-600/20 blur-[100px] rounded-full -z-10"></div>
        </div>
      </div>
    </div>
  );
}
