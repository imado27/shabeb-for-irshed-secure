import React from 'react';
import { ArrowRight, Star, Globe, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
  onJoinClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      
      {/* 1. Sophisticated Bright Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Subtle texture */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
         
         {/* Bright Gradients */}
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#7e1d51] rounded-full blur-[150px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#fcd34d] rounded-full blur-[180px] opacity-5 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-24 pb-16">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-24">
          
          {/* RIGHT SIDE: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-right space-y-8">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full animate-fadeInUp mx-auto lg:mx-0 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-[#7e1d51]" />
               <span className="text-[#7e1d51] text-xs font-bold tracking-wide">المنصة الرسمية المعتمدة</span>
            </div>

            {/* Typography Stack */}
            <div className="space-y-2 animate-fadeInUp delay-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-500 tracking-wide">جمعية الإرشاد والإصلاح الجزائرية</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1a0510] leading-tight">
                شباب <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#7e1d51] to-[#5e153b] drop-shadow-sm">فور إرشاد</span>
              </h1>
              <div className="h-2 w-32 bg-[#fcd34d] rounded-full mx-auto lg:mx-0 mt-6 shadow-lg shadow-yellow-200"></div>
            </div>

            {/* Subtext */}
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fadeInUp delay-200">
              بوابة الشباب الطموح في بلدية <strong className="text-[#7e1d51]">بن عبد المالك رمضان</strong>. 
              نجمع بين أصالة العمل التطوعي واحترافية الأداء المؤسسي لبناء جيل قيادي يصنع الفارق.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6 animate-fadeInUp delay-300">
               <button 
                 onClick={onJoinClick}
                 className="relative group px-10 py-5 bg-[#7e1d51] text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(126,29,81,0.3)] hover:shadow-[0_20px_40px_rgba(126,29,81,0.4)] transition-all transform hover:-translate-y-1 overflow-hidden"
               >
                 <span className="relative flex items-center gap-3 z-10">
                   انضم إلينا الآن <ArrowRight size={20} />
                 </span>
               </button>
               
               <a href="#vision" className="px-10 py-5 bg-white border border-gray-200 text-[#7e1d51] font-bold text-lg rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3">
                 <Globe size={20} /> اكتشف الرؤية
               </a>
            </div>

          </div>

          {/* LEFT SIDE: Visual Identity (The Logo) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fadeInUp delay-200 relative">
             <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                
                {/* Orbit Rings */}
                <div className="absolute inset-0 border-2 border-[#7e1d51]/10 rounded-full scale-110 animate-spin-slow border-dashed"></div>
                <div className="absolute inset-0 border border-[#fcd34d]/20 rounded-full scale-125"></div>
                
                {/* Center Glow */}
                <div className="absolute inset-0 bg-[#7e1d51] rounded-full blur-[100px] opacity-10"></div>

                {/* Main Logo Container */}
                <div className="absolute inset-0 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[8px] border-white flex items-center justify-center z-10 p-4">
                   <img 
                     src="https://pbs.twimg.com/profile_images/927550563851669505/LXxa75Zg.jpg" 
                     alt="Shabab For Irshed Logo" 
                     className="w-full h-full object-cover"
                   />
                </div>

                {/* Floating Cards - Refined Glassmorphism */}
                <div className="absolute top-[10%] -left-4 md:-left-10 bg-white/90 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-xl animate-float z-20 max-w-[180px]">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#7e1d51] flex items-center justify-center">
                        <Star className="text-white" size={14} />
                      </div>
                      <span className="text-[#1a0510] font-bold text-sm">احترافية</span>
                   </div>
                   <p className="text-gray-500 text-xs leading-snug">معايير عالمية في العمل التطوعي</p>
                </div>

                <div className="absolute bottom-[10%] -right-4 md:-right-10 bg-white p-4 rounded-2xl shadow-xl animate-float-delayed z-20 border border-gray-100">
                   <div className="flex items-center gap-3">
                      <Users className="text-[#fcd34d]" size={24} />
                      <div>
                         <span className="block text-[#1a0510] font-black text-sm">فريق متكامل</span>
                         <span className="block text-gray-500 text-[10px]">نخبة الشباب</span>
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>

        {/* Stats Footer (Clean Minimalist) */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-100 bg-white/50 backdrop-blur-lg py-6 hidden lg:block">
           <div className="container mx-auto px-8 flex justify-between items-center text-gray-400 text-xs font-medium tracking-widest uppercase">
              <div className="flex gap-12">
                 <span>EST. 1990</span>
                 <span>ALGERIA</span>
                 <span>VOLUNTEERING</span>
              </div>
              <div className="flex gap-2 opacity-50">
                 <span>SCROLL DOWN</span>
              </div>
           </div>
        </div>

      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: scale(1.1) rotate(0deg); }
          to { transform: scale(1.1) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;