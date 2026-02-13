
import React, { useState } from 'react';
import { RegistrationFormData, cellOptions, wilayas } from '../types';
import { sendTelegramMessageSecure } from '../services/telegram';
import { Send, CheckCircle, AlertCircle, User, MapPin, Phone, Facebook, GraduationCap, Heart, ChevronLeft, ChevronRight, Loader2, Calendar, BookOpen } from 'lucide-react';

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '', birthDate: '', birthPlace: '', address: '', wilaya: '',
    phone: '', facebookLink: '', educationLevel: '', specialization: '',
    hasVolunteeredBefore: 'no', previousVolunteeringDetails: '',
    selectedCell: '', agreesToFee: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.fullName || !formData.birthDate || !formData.wilaya || !formData.phone) {
        setError("يرجى ملء الحقول الأساسية للمتابعة");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.educationLevel || !formData.specialization) {
        setError("يرجى إكمال البيانات التعليمية");
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreesToFee) {
      setError("يجب الموافقة على النظام الداخلي والاشتراكات للمتابعة.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uid = 'anonymous_reg';
      // نرسل البيانات مع تحديد النوع register لضمان عزل السياق الأمني
      const result = await sendTelegramMessageSecure({
        ...formData,
        uid: uid,
        type: 'register'
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "حدث خطأ أثناء معالجة طلبك");
      }
    } catch (err) {
      setError("فشل الاتصال بخادم الحماية");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fadeInUp">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-gray-100 text-center max-w-lg w-full">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
           </div>
           <h2 className="text-3xl font-black text-[#1a0510] mb-4">تم استلام طلبك!</h2>
           <p className="text-gray-500 mb-10 leading-relaxed">شكراً لاهتمامك بالانضمام لـ شباب فور إرشاد. سيقوم مكتبنا البلدي بمراجعة ملفك والتواصل معك عبر الهاتف قريباً.</p>
           <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-[#1a0510] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 animate-fadeInUp">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 flex items-center justify-between px-6">
           {[1, 2, 3].map(step => (
             <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-[#7e1d51] text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'}`}>
                   {step}
                </div>
                {step < 3 && <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > step ? 'bg-[#7e1d51]' : 'bg-gray-200'}`}></div>}
             </React.Fragment>
           ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
           <div className="bg-[#1a0510] p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7e1d51] rounded-full blur-3xl opacity-20"></div>
              <h2 className="text-2xl font-black relative z-10">استمارة العضوية الرسمية</h2>
              <p className="text-gray-400 text-sm mt-2 relative z-10">الخطوة {currentStep} من 3</p>
           </div>

           <div className="p-8 md:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
                   <AlertCircle size={20} className="shrink-0" />
                   <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                 {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeInUp">
                       <h3 className="text-lg font-bold text-[#7e1d51] flex items-center gap-2 mb-6 border-r-4 border-[#7e1d51] pr-3">المعلومات الشخصية</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><User size={14}/> الاسم واللقب</label>
                             <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="input-field" placeholder="الاسم الكامل كما في الهوية" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><Calendar size={14}/> تاريخ الميلاد</label>
                             <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleInputChange} className="input-field" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><MapPin size={14}/> مكان الميلاد</label>
                             <input type="text" name="birthPlace" required value={formData.birthPlace} onChange={handleInputChange} className="input-field" placeholder="بلدية الميلاد" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><MapPin size={14}/> الولاية</label>
                             <select name="wilaya" required value={formData.wilaya} onChange={handleInputChange} className="input-field">
                                <option value="">اختر الولاية</option>
                                {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><MapPin size={14}/> العنوان الكامل</label>
                             <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="input-field" placeholder="الحي، البلدية..." />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><Phone size={14}/> رقم الهاتف</label>
                             <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="05/06/07XXXXXXXX" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><Facebook size={14}/> رابط حساب الفيسبوك</label>
                          <input type="url" name="facebookLink" value={formData.facebookLink} onChange={handleInputChange} className="input-field" placeholder="https://facebook.com/your-profile" />
                       </div>
                    </div>
                 )}

                 {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeInUp">
                       <h3 className="text-lg font-bold text-[#7e1d51] flex items-center gap-2 mb-6 border-r-4 border-[#7e1d51] pr-3">المستوى التعليمي والمهني</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><GraduationCap size={14}/> المستوى التعليمي</label>
                             <select name="educationLevel" required value={formData.educationLevel} onChange={handleInputChange} className="input-field">
                                <option value="">اختر المستوى</option>
                                <option value="ثانوي">ثانوي</option>
                                <option value="جامعي">جامعي</option>
                                <option value="متخرج">متخرج</option>
                                <option value="تكوين مهني">تكوين مهني</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 flex items-center gap-2"><BookOpen size={14}/> التخصص</label>
                             <input type="text" name="specialization" required value={formData.specialization} onChange={handleInputChange} className="input-field" placeholder="التخصص الدراسي أو المهني" />
                          </div>
                       </div>
                       <div className="space-y-4 pt-4 border-t border-gray-50">
                          <label className="text-sm font-bold text-gray-700">هل سبق لك ممارسة العمل التطوعي؟</label>
                          <div className="flex gap-6">
                             {['yes', 'no'].map(val => (
                               <label key={val} className="flex items-center gap-2 cursor-pointer group">
                                  <input type="radio" name="hasVolunteeredBefore" value={val} checked={formData.hasVolunteeredBefore === val} onChange={handleInputChange} className="w-5 h-5 accent-[#7e1d51]" />
                                  <span className="text-sm font-medium group-hover:text-[#7e1d51] transition-colors">{val === 'yes' ? 'نعم' : 'لا'}</span>
                               </label>
                             ))}
                          </div>
                       </div>
                       {formData.hasVolunteeredBefore === 'yes' && (
                          <div className="space-y-2 animate-fadeInUp">
                             <label className="text-xs font-bold text-gray-500">تفاصيل الخبرة التطوعية السابقة</label>
                             <textarea name="previousVolunteeringDetails" rows={3} value={formData.previousVolunteeringDetails} onChange={handleInputChange} className="input-field resize-none" placeholder="اذكر الجمعيات أو المبادرات التي شاركت فيها..."></textarea>
                          </div>
                       )}
                    </div>
                 )}

                 {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeInUp">
                       <h3 className="text-lg font-bold text-[#7e1d51] flex items-center gap-2 mb-6 border-r-4 border-[#7e1d51] pr-3">اختيار الخلية المناسبة</h3>
                       <div className="space-y-4">
                          <label className="text-sm font-bold text-gray-700 block mb-4">اختيار الخلية التي تناسب ميول اهتمامك:</label>
                          <div className="grid grid-cols-1 gap-3">
                             {cellOptions.map(cell => (
                               <label 
                                 key={cell} 
                                 className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${formData.selectedCell === cell ? 'border-[#7e1d51] bg-pink-50 text-[#7e1d51] shadow-md' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}
                               >
                                  <input 
                                    type="radio" 
                                    name="selectedCell" 
                                    value={cell} 
                                    checked={formData.selectedCell === cell} 
                                    onChange={handleInputChange}
                                    className="w-5 h-5 accent-[#7e1d51]"
                                  />
                                  <span className="text-xs font-bold leading-tight">{cell}</span>
                               </label>
                             ))}
                          </div>
                       </div>
                       <div className="pt-8 border-t border-gray-100">
                          <label className="flex items-start gap-4 p-5 bg-pink-50/50 rounded-2xl border border-pink-100 cursor-pointer group">
                             <input type="checkbox" checked={formData.agreesToFee} onChange={e => setFormData({...formData, agreesToFee: e.target.checked})} className="mt-1 w-5 h-5 accent-[#7e1d51]" />
                             <span className="text-xs font-bold text-gray-600 leading-relaxed group-hover:text-[#7e1d51] transition-colors">أوافق على الالتزام بالقانون الأساسي والنظام الداخلي لجمعية الإرشاد والإصلاح الجزائرية، وأتعهد بدفع مبالغ الانخراط السنوي المقررة.</span>
                          </label>
                       </div>
                    </div>
                 )}

                 <div className="flex items-center justify-between pt-10">
                    {currentStep > 1 && (
                       <button type="button" onClick={prevStep} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all flex items-center gap-2">
                          <ChevronRight size={20} /> السابق
                       </button>
                    )}
                    
                    {currentStep < 3 ? (
                       <button type="button" onClick={nextStep} className="mr-auto px-10 py-4 bg-[#1a0510] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                          التالي <ChevronLeft size={20} />
                       </button>
                    ) : (
                       <button type="submit" disabled={isSubmitting} className="mr-auto px-12 py-4 bg-[#7e1d51] text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(126,29,81,0.3)] hover:shadow-[0_20px_40px_rgba(126,29,81,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                          {isSubmitting ? 'جاري تأمين الطلب...' : 'إرسال طلب العضوية'}
                       </button>
                    )}
                 </div>
              </form>
           </div>
        </div>
      </div>
      <style>{`
        .input-field {
          width: 100%;
          padding: 1rem;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          outline: none;
          transition: all 0.3s;
        }
        .input-field:focus {
          border-color: #7e1d51;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(126, 29, 81, 0.05);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out 2; }
      `}</style>
    </section>
  );
};

export default RegistrationForm;
