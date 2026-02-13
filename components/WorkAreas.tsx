import React from 'react';
import { Heart, Leaf, BookOpen, Video, Monitor, Palette, Map, ArrowLeft, Star } from 'lucide-react';

interface WorkAreasProps {
  onJoinClick: () => void;
}

const areas = [
  {
    id: 1,
    title: "المجال الخيري",
    desc: "دعم الفئات الهشة، قفة رمضان، وكسوة العيد.",
    icon: <Heart size={32} />,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-rose-500/30"
  },
  {
    id: 2,
    title: "المجال البيئي",
    desc: "حملات التشجير، تنظيف الأحياء، والرسكلة.",
    icon: <Leaf size={32} />,
    color: "from-emerald-400 to-green-600",
    shadow: "shadow-green-500/30"
  },
  {
    id: 3,
    title: "المجال الثقافي",
    desc: "نوادي القراءة، المسابقات الفكرية، والمحاضرات.",
    icon: <BookOpen size={32} />,
    color: "from-blue-400 to-indigo-600",
    shadow: "shadow-indigo-500/30"
  },
  {
    id: 4,
    title: "المجال الإعلامي",
    desc: "صناعة المحتوى، التصوير، والتغطيات الصحفية.",
    icon: <Video size={32} />,
    color: "from-purple-400 to-violet-600",
    shadow: "shadow-violet-500/30"
  },
  {
    id: 5,
    title: "المجال التقني",
    desc: "تطوير المهارات الرقمية، البرمجة، والتصميم.",
    icon: <Monitor size={32} />,
    color: "from-cyan-400 to-blue-600",
    shadow: "shadow-blue-500/30"
  },
  {
    id: 6,
    title: "المجال الفني",
    desc: "المسرح، الانشاد، والفنون التشكيلية.",
    icon: <Palette size={32} />,
    color: "from-orange-400 to-red-500",
    shadow: "shadow-orange-500/30"
  },
  {
    id: 7,
    title: "المجال السياحي",
    desc: "الرحلات الاستكشافية، والمخيمات الصيفية.",
    icon: <Map size={32} />,
    color: "from-yellow-400 to-amber-600",
    shadow: "shadow-amber-500/30"
  }
];

const WorkAreas: React.FC<WorkAreasProps> = ({ onJoinClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 animate-fadeInUp">
      
      {/* Header with Parallax Feel */}
      <div className="relative py-24 md:py-32 bg-[#1a0510] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7e1d51] rounded-full blur-[150px] opacity-40 animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h2 className="text-[#fcd34d] font-bold text-sm tracking-[0.3em] mb-4 uppercase">استكشف شغفك</h2>
           <h1 className="text-4xl md:text-6xl font-black text-white mb-6">مجالات العمل</h1>
           <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed font-light">
             في شباب فور إرشاد، نؤمن بأن لكل شاب موهبة فريدة. لقد صممنا لجاننا ومجالاتنا لتكون الحاضنة المثالية لإبداعكم وخدمة مجتمعكم.
           </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container mx-auto px-4 py-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {areas.map((area, index) => (
            <div 
              key={area.id}
              className="group bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center text-white mb-6 shadow-lg ${area.shadow} transform group-hover:scale-110 transition-transform duration-500`}>
                {area.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#7e1d51] transition-colors">{area.title}</h3>
              <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                {area.desc}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fcd34d] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-[#7e1d51] to-[#5e153b] rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fcd34d] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
           
           <div className="relative z-10">
             <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md border border-white/10">
                <Star className="text-[#fcd34d] fill-[#fcd34d]" size={16} />
                <span className="text-sm font-bold">فرصتك الآن</span>
             </div>
             
             <h2 className="text-3xl md:text-5xl font-black mb-6">هل وجدت مجالك المفضل؟</h2>
             <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
               لا تتردد في الانضمام إلينا الآن وتفجير طاقاتك في بيئة محفزة وداعمة. نحن بانتظار لمستك الإبداعية.
             </p>
             
             <button 
               onClick={onJoinClick}
               className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#fcd34d] text-[#7e1d51] font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(252,211,77,0.4)] hover:shadow-[0_0_50px_rgba(252,211,77,0.6)] hover:scale-105 transition-all duration-300"
             >
               <span>سجل الآن</span>
               <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkAreas;