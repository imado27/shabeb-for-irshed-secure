
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Star, MessageSquare, Clock, Users, ThumbsUp, User, Phone, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const WorkshopEvaluation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({ firstName: '', lastName: '', phone: '' });
  const [formData, setFormData] = useState({
    q1: '', q2: '', q3_clarity: '', q3_interaction: '', q3_delivery: '', q4: '', q5: '', q7: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateStep1 = () => {
    if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim()) return "يرجى إدخال الاسم واللقب.";
    const cleanPhone = personalInfo.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 8) return "يرجى إدخال رقم هاتف صحيح (8 أرقام على الأقل).";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sanitizeText = (text: string) => text.replace(/[<>]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.q1 || !formData.q3_clarity || !formData.q3_interaction || !formData.q3_delivery || !formData.q4 || !formData.q7) {
      setError("يرجى الإجابة على جميع الأسئلة ذات الخيارات للمتابعة.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      participant: personalInfo,
      responses: {
        ...formData,
        q2: sanitizeText(formData.q2),
        q5: sanitizeText(formData.q5)
      }
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "حدث خطأ أثناء الإرسال.");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7e1d51]/10 to-[#fcd34d]/10 flex items-center justify-center p-6" dir="rtl">
        <div className="glass-card p-10 rounded-[2.5rem] text-center max-w-lg w-full animate-fadeInUp">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-[#1a0510] mb-4">تم الإرسال بنجاح!</h2>
          <p className="text-gray-600 mb-8">شكراً لمساهمتكم القيمة. آراؤكم تساعدنا على التطور والتحسن المستمر.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-[#7e1d51] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20 relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7e1d51]/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcd34d]/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10 pt-10">
        
        {/* Hero Image Frame */}
        <div className="glass-card p-2 rounded-[2.5rem] mb-8 shadow-2xl overflow-hidden border border-white/40">
           <div className="aspect-[16/9] md:aspect-[21/9] w-full bg-gray-50 rounded-[2rem] overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dxqbn7i5l/image/upload/v1770433939/u8glfvii0uzzgiw6hzwr.jpg" 
                alt="Workshop Hero" 
                className="w-full h-full object-contain"
              />
           </div>
        </div>

        {/* Info Glass Card */}
        <div className="glass-card p-8 rounded-[2.5rem] mb-8 border border-white/50 shadow-xl text-center">
            <h2 className="text-[#7e1d51] text-lg font-black mb-1">هيئة شباب فور ارشاد - الفريق البلدي</h2>
            <p className="text-gray-500 text-sm font-bold mb-4">بلدية بن عبد المالك رمضان</p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a0510] mb-3 leading-tight">
               📌 استمارة تقييم ورشة العمل التطوعي
            </h1>
            <p className="text-[#7e1d51] font-bold text-lg mb-4 italic">"العمل التطوعي: شباب مجتمعي – تطوع شبابي – تطور"</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100">
               <Award className="text-[#7e1d51]" size={18} />
               <span className="text-[#7e1d51] font-black">اسم الأستاذ: #محمد_شهري</span>
            </div>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/60 shadow-2xl">
          
          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#7e1d51]' : 'text-gray-400'}`}>
               <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 ${step === 1 ? 'bg-[#7e1d51] text-white border-[#7e1d51]' : 'border-gray-200'}`}>1</span>
               <span className="font-bold">المعلومات</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-100 rounded-full"></div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#7e1d51]' : 'text-gray-400'}`}>
               <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 ${step === 2 ? 'bg-[#7e1d51] text-white border-[#7e1d51]' : 'border-gray-200'}`}>2</span>
               <span className="font-bold">التقييم</span>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50/50 backdrop-blur-md text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
              <AlertCircle size={20} className="shrink-0" />
              <span className="font-bold text-sm">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6 animate-fadeInUp">
               <div className="text-center mb-8">
                  <h3 className="text-xl font-black text-[#1a0510]">أهلاً بك في منصة التقييم</h3>
                  <p className="text-gray-500 text-sm mt-1">يرجى إدخال بياناتك للمتابعة</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={16} className="text-[#7e1d51]" /> الاسم</label>
                    <input type="text" value={personalInfo.firstName} onChange={e => setPersonalInfo({...personalInfo, firstName: e.target.value})} className="glass-input" placeholder="اسمك الشخصي" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={16} className="text-[#7e1d51]" /> اللقب</label>
                    <input type="text" value={personalInfo.lastName} onChange={e => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="glass-input" placeholder="لقبك العائلي" />
                  </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Phone size={16} className="text-[#7e1d51]" /> رقم الهاتف</label>
                 <input type="tel" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} className="glass-input" placeholder="مثلاً: 06XXXXXXXX" />
               </div>
               <button onClick={handleNext} className="w-full py-5 bg-[#7e1d51] text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4">
                  الانتقال للتقييم <ChevronLeft />
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 animate-fadeInUp">
              
              {/* Q1 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  1️⃣ كيف كان انطباعك العام عن الورشة؟
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['ممتاز', 'جيد جدًا', 'جيد', 'مقبول'].map(opt => (
                    <label key={opt} className={`cursor-pointer p-4 rounded-2xl border-2 text-center font-bold transition-all shadow-sm ${formData.q1 === opt ? 'border-[#7e1d51] bg-[#7e1d51] text-white' : 'border-white/40 bg-white/50 text-gray-500 hover:bg-white/80'}`}>
                      <input type="radio" name="q1" value={opt} onChange={e => setFormData({...formData, q1: e.target.value})} className="hidden" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  2️⃣ ما أكثر شيء أعجبك في الورشة؟
                </label>
                <textarea rows={4} className="glass-input resize-none" value={formData.q2} onChange={e => setFormData({...formData, q2: e.target.value})} placeholder="اكتب ما لفت انتباهك بكل صراحة..."></textarea>
              </div>

              {/* Q3 */}
              <div className="space-y-6">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  3️⃣ كيف تقيّم أداء الأستاذ المحاضر من حيث:
                </label>
                <div className="space-y-6">
                  {[
                    { key: 'q3_clarity', label: 'وضوح الشرح' },
                    { key: 'q3_interaction', label: 'التفاعل مع الحضور' },
                    { key: 'q3_delivery', label: 'إيصال الفكرة' }
                  ].map(sub => (
                    <div key={sub.key} className="p-5 bg-white/30 rounded-2xl border border-white/40">
                      <p className="font-bold text-gray-700 mb-4 text-sm">{sub.label}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['ممتاز', 'جيد', 'متوسط', 'يحتاج تحسين'].map(opt => (
                          <label key={opt} className={`cursor-pointer p-3 rounded-xl border text-xs text-center font-bold transition-all ${formData[sub.key as keyof typeof formData] === opt ? 'bg-[#7e1d51] text-white' : 'bg-white/50 text-gray-400 border-white/50 hover:bg-white'}`}>
                            <input type="radio" name={sub.key} value={opt} onChange={e => setFormData({...formData, [sub.key]: e.target.value})} className="hidden" />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  4️⃣ هل كانت مدة الورشة مناسبة؟
                </label>
                <div className="space-y-3">
                  {['مناسبة جدًا', 'طويلة نوعًا ما', 'قصيرة وتحتاج وقتًا أكثر'].map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm ${formData.q4 === opt ? 'border-[#7e1d51] bg-white text-[#7e1d51]' : 'border-white/40 bg-white/50 text-gray-500 hover:bg-white'}`}>
                      <input type="radio" name="q4" value={opt} onChange={e => setFormData({...formData, q4: e.target.value})} className="accent-[#7e1d51] w-5 h-5" />
                      <span className="font-bold">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q5 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  5️⃣ هل ترى أن هناك نقاطًا كانت ناقصة أو تحتاج إضافة؟
                </label>
                <textarea rows={4} className="glass-input resize-none" value={formData.q5} onChange={e => setFormData({...formData, q5: e.target.value})} placeholder="اقتراحاتك تهمنا للتحسين..."></textarea>
              </div>

              {/* Q7 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-[#1a0510] flex items-center gap-3 border-r-4 border-[#7e1d51] pr-3">
                  7️⃣ هل شجعتك الورشة على الانخراط أكثر في العمل التطوعي؟
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['نعم جدًا', 'نعم إلى حد ما', 'لا'].map(opt => (
                    <label key={opt} className={`cursor-pointer p-5 rounded-2xl border-2 text-center font-bold transition-all shadow-sm ${formData.q7 === opt ? 'border-[#7e1d51] bg-[#7e1d51] text-white' : 'border-white/40 bg-white/50 text-gray-500 hover:bg-white'}`}>
                      <input type="radio" name="q7" value={opt} onChange={e => setFormData({...formData, q7: e.target.value})} className="hidden" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/40 text-center">
                <p className="text-gray-400 text-xs mb-8 leading-relaxed font-bold">
                  "آراؤكم تهمّنا، وهدفنا من هذا التقييم هو التطوير والتحسين، وليس النقد السلبي. شكرًا لمساهمتكم."
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                   <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-white/50 text-gray-500 font-bold rounded-2xl border border-white/60 hover:bg-white transition-all flex items-center justify-center gap-2">
                      <ChevronRight size={20} /> السابق
                   </button>
                   <button disabled={isSubmitting} type="submit" className="flex-[2] py-5 bg-[#7e1d51] text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم النهائي'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
        }
        .glass-input {
          width: 100%;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.4);
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 1.25rem;
          font-weight: 700;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .glass-input:focus {
          border-color: #7e1d51;
          background: white;
          box-shadow: 0 0 15px rgba(126, 29, 81, 0.1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out 2; }
      `}</style>
    </div>
  );
};

export default WorkshopEvaluation;
