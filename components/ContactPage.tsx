
import React, { useState } from 'react';
import { Mail, MapPin, Facebook, MessageCircle, ExternalLink, Send, User, Tag, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { sendTelegramMessageSecure } from '../services/telegram';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'استفسار عام', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'info' | 'cooldown', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setStatusMessage(null);
    setIsSubmitting(true);
    
    try {
      const uid = 'anonymous_contact';

      const result = await sendTelegramMessageSecure({
        ...formData,
        uid,
        type: 'contact'
      });

      if (result.success) {
        setIsSent(true);
        setFormData({ name: '', email: '', subject: 'استفسار عام', message: '' });
      } else {
        const type = result.error?.includes('ساعة') ? 'cooldown' : 'error';
        setStatusMessage({ type, text: result.error || 'فشل الإرسال، يرجى المحاولة لاحقاً' });
      }
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: "تعذر الاتصال بخادم الحماية الآمن" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeInUp font-sans">
      <div className="relative bg-[#1a0510] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7e1d51] rounded-full blur-[120px] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
           <div className="inline-block p-3 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <MessageCircle className="text-[#fcd34d] w-8 h-8 mx-auto" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white mb-6">تواصل معنا</h1>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">بوابة التواصل الرسمية والمؤمنة. رسالتك تصلنا مباشرة وبسرية تامة.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#7e1d51] transition-colors transition-all duration-300">
                   <Mail className="text-[#7e1d51] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">البريد الإلكتروني</h3>
                <p className="text-gray-500 text-xs mb-3">نرد خلال 24 ساعة</p>
                <a href="mailto:shabeb.for.irshed.bar@gmail.com" className="text-[#7e1d51] font-bold text-sm break-all hover:underline decoration-2">shabeb.for.irshed.bar@gmail.com</a>
             </div>
             <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#7e1d51] transition-colors transition-all duration-300">
                   <MapPin className="text-[#7e1d51] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">المقر البلدي</h3>
                <p className="text-gray-500 text-xs mb-3">تفضل بزيارتنا</p>
                <p className="text-[#7e1d51] font-bold text-sm">بن عبد المالك رمضان، مستغانم</p>
             </div>
             <a href="https://web.facebook.com/profile.php?id=100091139322121" target="_blank" className="flex items-center justify-between bg-[#1877f2] text-white p-6 rounded-3xl shadow-lg hover:brightness-110 transition-all">
                <div className="flex items-center gap-4">
                   <Facebook size={32} />
                   <div className="text-right">
                      <span className="block font-bold">تابعنا على فيسبوك</span>
                      <span className="text-xs opacity-80">آخر الأخبار والنشاطات</span>
                   </div>
                </div>
                <ExternalLink size={20} />
             </a>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 h-full">
                {isSent ? (
                   <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fadeInUp">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"><CheckCircle className="text-green-500 w-10 h-10" /></div>
                      <h2 className="text-2xl font-black text-gray-900 mb-4">تم الإرسال بنجاح!</h2>
                      <p className="text-gray-500 max-w-sm mb-8">وصلت رسالتك لفريقنا. يمكنك إرسال رسالة أخرى بعد 24 ساعة.</p>
                      <button onClick={() => setIsSent(false)} className="px-8 py-3 bg-[#7e1d51] text-white rounded-xl font-bold hover:bg-[#5e153b] transition-all shadow-lg">العودة للنموذج</button>
                   </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                      {statusMessage && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-shake ${
                          statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 
                          statusMessage.type === 'cooldown' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                          'bg-gray-50 text-gray-700 border-gray-100'
                        } border`}>
                           <AlertTriangle size={20} className="shrink-0" />
                           <span className="text-sm font-bold">{statusMessage.text}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User size={14} className="text-[#7e1d51]" /> الاسم الكامل</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="أدخل اسمك..." />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Mail size={14} className="text-[#7e1d51]" /> البريد الإلكتروني</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="email@example.com" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Tag size={14} className="text-[#7e1d51]" /> موضوع الرسالة</label>
                         <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="input-field cursor-pointer">
                            <option>استفسار عام</option>
                            <option>طلب انخراط</option>
                            <option>اقتراح مشروع</option>
                            <option>بلاغ أو شكوى</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MessageCircle size={14} className="text-[#7e1d51]" /> نص الرسالة</label>
                         <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="input-field resize-none" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#7e1d51] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-[#5e153b] transition-all flex items-center justify-center gap-3">
                         {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                         {isSubmitting ? 'جاري تأمين الاتصال...' : 'إرسال الرسالة الآن'}
                      </button>
                   </form>
                )}
             </div>
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
    </div>
  );
};

export default ContactPage;
