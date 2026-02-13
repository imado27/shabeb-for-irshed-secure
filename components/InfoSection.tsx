
import React from 'react';
import { Target, Eye, HeartHandshake, CheckCircle2, Sprout, TrendingUp } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <section id="vision" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Abstract Pattern */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#7e1d51 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-right max-w-2xl">
            <span className="text-[#fcd34d] font-bold tracking-widest uppercase text-sm flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#fcd34d]"></span>
              المكتب البلدي
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#2d0a1d]">
              قيمنا <br/> <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#7e1d51] to-[#b92b72]">وأهدافنا</span>
            </h2>
          </div>
          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed">
            نعمل في بلدية بن عبد المالك رمضان على ترسيخ ثقافة العمل التطوعي النوعي وتمكين الكفاءات الشبانية لخدمة المجتمع المحلي بفاعلية واحترافية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* 1. Who We Are */}
          <div className="group bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#7e1d51]/10 transition-all duration-300 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <HeartHandshake className="text-[#7e1d51] w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#2d0a1d] mb-3">هويتنا</h3>
              <p className="text-gray-500 leading-relaxed mb-4 text-sm md:text-base">
                "شباب فور إرشاد" هي الذراع الشبانية التطوعية لجمعية الإرشاد والإصلاح الجزائرية، تتبنى منهجاً مؤسسياً في تسيير الطاقات الشبابية وتوجيهها نحو البناء المجتمعي.
              </p>
              
              <div className="mb-4 p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-[#7e1d51] font-bold text-sm text-center leading-relaxed">
                  "فريقٌ يؤمن بأن الموهبة رسالة، والتطوع مسؤولية، والتأثير الحقيقي يبدأ بالمبادرة"
                </p>
              </div>
            </div>
          </div>

          {/* 2. Our Vision */}
          <div className="group bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#7e1d51]/10 transition-all duration-300 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                <Eye className="text-[#7e1d51] w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#2d0a1d] mb-3">رؤيتنا الاستراتيجية</h3>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm md:text-base">
                نطمح لنكون الهيئة الشبانية الأكثر تأثيراً في العمل الخيري والتنموي في الجزائر، من خلال شبكة تضم 5000 كادر شاب، متواجدين في كافة ربوع الوطن عبر 69 ولاية.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                 <div className="text-center">
                    <span className="block font-black text-xl text-[#2d0a1d]">5000</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">متطوع</span>
                 </div>
                 <div className="w-px h-8 bg-gray-200"></div>
                 <div className="text-center">
                    <span className="block font-black text-xl text-[#2d0a1d]">69</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">ولاية</span>
                 </div>
              </div>
            </div>
          </div>

          {/* 3. Our Mission */}
          <div className="group bg-[#7e1d51] rounded-[2rem] p-8 shadow-2xl shadow-[#7e1d51]/30 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fcd34d] opacity-10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-6">
                <Target className="text-[#fcd34d] w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">رسالتنا</h3>
              <p className="text-white/80 leading-relaxed mb-6 text-sm md:text-base">
                تمكين الشباب وتنمية قدراتهم الإبداعية لإشراكهم بفاعلية في ميادين التضامن الاجتماعي، بما يضمن تحقيق تنمية مستدامة وتلبية احتياجات المجتمع بروح عصرية.
              </p>
              <ul className="space-y-2">
                {['تبني قضايا الشباب المعاصرة', 'تحفيز ثقافة العطاء والابتكار', 'تطوير المهارات القيادية'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/90 font-medium">
                    <CheckCircle2 size={16} className="text-[#fcd34d]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Impact of Membership */}
          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[#7e1d51]/10 transition-all duration-300 border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#fcd34d] to-[#7e1d51]"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                        <TrendingUp className="text-[#7e1d51] w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#2d0a1d]">أثر الانضمام</h3>
                        <p className="text-[10px] text-gray-500 font-bold">تطوير الذات وخدمة الوطن</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-[#7e1d51] font-bold text-sm mb-1 flex items-center gap-1"><Sprout size={14} /> البناء الشخصي</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">تعزيز الثقة بالنفس، وترسيخ قيم المسؤولية الفردية والجماعية.</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-[#7e1d51] font-bold text-sm mb-1 flex items-center gap-1"><Target size={14} /> التميز المهاري</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">اكتساب فنون القيادة، والعمل ضمن فرق احترافية، وإدارة المشاريع.</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-[#7e1d51] font-bold text-sm mb-1 flex items-center gap-1"><HeartHandshake size={14} /> المسؤولية المجتمعية</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">المساهمة الفعلية في حل المشكلات الاجتماعية وتعزيز التماسك الوطني.</p>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;
