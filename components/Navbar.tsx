import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Home, UserPlus, Layers, Newspaper } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'register' | 'contact' | 'work-areas' | 'news' | 'admin') => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: 'home' | 'register' | 'contact' | 'work-areas' | 'news' | 'admin') => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
      handleNav('admin');
      setClickCount(0);
    } else {
      handleNav('home');
    }
  };

  const linkClass = (page: string) => 
    `px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
      currentPage === page 
      ? 'bg-[#7e1d51] text-white shadow-lg shadow-[#7e1d51]/20' 
      : 'text-gray-600 hover:text-[#7e1d51] hover:bg-pink-50'
    }`;

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 border-b ${
          isScrolled || currentPage !== 'home'
            ? 'bg-white/90 backdrop-blur-xl shadow-lg py-2 border-gray-100' 
            : 'bg-white py-4 border-transparent shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* Brand */}
          <button onClick={handleLogoClick} className="flex items-center gap-3 group">
             <img 
               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQocuxNQPjn5Sb1Uyp6P3ue0e3T6y5jE2Hu6Q&s" 
               alt="Logo" 
               className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md group-hover:scale-105 transition-transform border-2 border-[#7e1d51]"
             />
             <div className="flex flex-col items-start">
                <h1 className="text-[#7e1d51] font-black text-base md:text-lg leading-none">جمعية الإرشاد والإصلاح</h1>
                <span className="text-[#fcd34d] text-xs font-bold tracking-wide mt-1 bg-[#7e1d51] px-2 py-0.5 rounded-full">المكتب البلدي</span>
             </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            <button onClick={() => handleNav('home')} className={linkClass('home')}>
              الرئيسية
            </button>
            <button onClick={() => handleNav('news')} className={linkClass('news')}>
              الأخبار
            </button>
            <button onClick={() => handleNav('work-areas')} className={linkClass('work-areas')}>
              المجالات
            </button>
             <button onClick={() => handleNav('contact')} className={linkClass('contact')}>
              اتصل بنا
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => handleNav('register')}
              className="px-6 py-2.5 bg-[#fcd34d] text-[#7e1d51] font-black text-sm rounded-xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/40 hover:scale-105 transition-all transform flex items-center gap-2"
            >
              <UserPlus size={18} />
              عضوية جديدة
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-[#7e1d51] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
         className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 bottom-0 right-0 z-[70] w-[80%] max-w-[300px] bg-white shadow-2xl transition-transform duration-500 ease-out border-l border-gray-100 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-[#7e1d51]">
             <span className="text-white font-bold text-lg">القائمة</span>
             <button onClick={() => setMobileMenuOpen(false)} className="text-white bg-white/20 p-1.5 rounded-full hover:bg-white/30"><X size={20} /></button>
        </div>
        
        <div className="flex flex-col p-4 gap-2 h-[calc(100%-80px)] overflow-y-auto">
           {[
             { id: 'home', label: 'الرئيسية', icon: Home },
             { id: 'news', label: 'الأخبار', icon: Newspaper },
             { id: 'work-areas', label: 'مجالات العمل', icon: Layers },
             { id: 'contact', label: 'اتصل بنا', icon: Phone },
           ].map((item) => (
             <button 
               key={item.id}
               onClick={() => handleNav(item.id as any)} 
               className="flex items-center gap-4 text-base text-gray-700 font-bold py-4 px-4 hover:bg-pink-50 rounded-xl transition-all border-b border-gray-50"
             >
               <item.icon className="text-[#7e1d51]" size={20} /> {item.label}
             </button>
           ))}

           <div className="mt-auto pt-6">
              <button onClick={() => handleNav('register')} className="w-full py-4 bg-[#fcd34d] text-[#7e1d51] flex justify-center items-center gap-2 font-black rounded-xl text-base shadow-lg hover:brightness-110 transition-all">
                <UserPlus size={20} /> تسجيل العضوية
              </button>
           </div>
           
           <div className="text-center mt-6 text-gray-400 text-xs">
             <p>الإصدار 2.0.0</p>
           </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;