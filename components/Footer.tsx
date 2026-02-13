
import React from 'react';
import { Facebook, Mail, MapPin, ExternalLink, ArrowUp, Code } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: 'home' | 'register' | 'contact') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: 'home' | 'register' | 'contact') => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-[#1a0510] text-gray-300 border-t-4 border-[#7e1d51] relative z-20">
      
      {/* Upper Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg">
                 <img src="https://pbs.twimg.com/profile_images/927550563851669505/LXxa75Zg.jpg" className="w-full h-full object-contain" alt="Logo" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white">شباب فور إرشاد</h3>
                 <p className="text-xs text-[#7e1d51] font-bold bg-white px-2 rounded inline-block">الفريق البلدي</p>
               </div>
             </div>
             <p className="text-sm leading-relaxed opacity-80">
               هيئة شبانية وطنية رائدة، تعمل وفق رؤية استراتيجية لتمكين الشباب وتعزيز قيم المواطنة والعمل التطوعي المحترف في الجزائر.
             </p>
             <div className="flex gap-4">
               <a href="https://web.facebook.com/profile.php?id=100091139322121" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-all border border-white/10" aria-label="Facebook">
                 <Facebook size={18} />
               </a>
             </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-r-4 border-[#7e1d51] pr-3">روابط هامة</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={(e) => handleNav(e, 'home')} className="hover:text-[#7e1d51] transition-colors flex items-center gap-2"><ArrowUp size={14} className="rotate-[-45deg]" /> الرئيسية</button></li>
              <li><button onClick={(e) => handleNav(e, 'home')} className="hover:text-[#7e1d51] transition-colors flex items-center gap-2"><ArrowUp size={14} className="rotate-[-45deg]" /> من نحن</button></li>
              <li><button onClick={(e) => handleNav(e, 'register')} className="hover:text-[#7e1d51] transition-colors flex items-center gap-2"><ArrowUp size={14} className="rotate-[-45deg]" /> بوابة التسجيل</button></li>
              <li><a href="https://imad213.mosta.store" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:text-red-900 transition-colors flex items-center gap-2 mt-4 pt-4 border-t border-white/5 font-bold"><Code size={14} /> تواصل مع المطور</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
             <h4 className="text-white font-bold text-lg mb-6 border-r-4 border-[#7e1d51] pr-3">اتصل بنا</h4>
             <ul className="space-y-4 text-sm">
               <li className="flex items-start gap-3">
                 <MapPin className="text-[#7e1d51] mt-1 shrink-0" size={18} />
                 <span>المكتب البلدي بن عبد المالك رمضان،<br/>ولاية مستغانم، الجزائر</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail className="text-[#7e1d51] shrink-0" size={18} />
                 <span>shabeb.for.irshed.bar@gmail.com</span>
               </li>
             </ul>
          </div>

          {/* Network Section */}
          <div>
             <h4 className="text-white font-bold text-lg mb-6 border-r-4 border-[#7e1d51] pr-3">شبكتنا الوطنية</h4>
             <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <p className="text-xs text-gray-400 mb-3 font-bold">متواجدون ميدانياً عبر 69 ولاية</p>
                <div className="aspect-video bg-[#7e1d51]/20 rounded-lg flex items-center justify-center mb-3 border border-white/5">
                   <span className="text-[#7e1d51] text-xs font-black tracking-widest uppercase">Algeria Spread Map</span>
                </div>
                <button className="w-full py-2 bg-[#7e1d51] text-white text-xs font-bold rounded flex items-center justify-center gap-2 hover:bg-white hover:text-[#7e1d51] transition-colors">
                  تصفح الفروع الوطنية <ExternalLink size={12} />
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} شباب فور إرشاد. جميع الحقوق محفوظة للمكتب البلدي.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
