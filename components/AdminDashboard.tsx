
import React, { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../services/cloudinary';
import { Newspaper, Users, LogOut, Plus, Loader2, Save, Trash2, Eye, EyeOff, X, ImagePlus, Lock, Phone, User, MapPin, Mail, Settings, ShieldCheck, AlertOctagon, ExternalLink } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSecretRoute, setIsSecretRoute] = useState(false);

  useEffect(() => {
    // Check for cached session
    const token = localStorage.getItem('adminToken');
    if (token) {
        setIsAuthenticated(true);
    }
    
    if (window.location.hash === '#//admin') {
      setIsSecretRoute(true);
    } else {
      setIsSecretRoute(false);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<'news' | 'registrations' | 'settings'>('news');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loadingReg, setLoadingReg] = useState(false);
  const [loadingNewsList, setLoadingNewsList] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // News Form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsCategory, setNewsCategory] = useState('عام');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsFiles, setNewsFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  // Settings State
  const [evaluationEmails, setEvaluationEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Helper for Auth Headers
  const getAuthHeaders = () => {
      const token = localStorage.getItem('adminToken');
      return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem('adminToken', data.token);
            setIsAuthenticated(true);
        } else {
            setLoginError(data.error || 'خطأ في الدخول');
        }
    } catch (err) {
        setLoginError('تعذر الاتصال بالخادم');
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      window.location.href = '/';
  };

  useEffect(() => {
    if (isAuthenticated) {
        if (activeTab === 'registrations') fetchRegistrations();
        if (activeTab === 'news') fetchNews();
        if (activeTab === 'settings') fetchSettings();
    }
  }, [isAuthenticated, activeTab]);

  const fetchRegistrations = async () => {
    setLoadingReg(true);
    try {
        const res = await fetch('/api/admin?type=registrations', { headers: getAuthHeaders() });
        if (res.status === 401) { handleLogout(); return; }
        if (res.ok) {
            const data = await res.json();
            setRegistrations(data);
        }
    } catch (e) { console.error(e); } finally { setLoadingReg(false); }
  };

  const fetchNews = async () => {
    setLoadingNewsList(true);
    try {
        const res = await fetch('/api/news'); // Public GET
        if (res.ok) {
            const data = await res.json();
            setNewsList(data);
        }
    } catch (e) { console.error(e); } finally { setLoadingNewsList(false); }
  };

  const fetchSettings = async () => {
    try {
        const res = await fetch('/api/admin?type=settings', { headers: getAuthHeaders() });
        if (res.status === 401) { handleLogout(); return; }
        if (res.ok) {
            const data = await res.json();
            setEvaluationEmails(data);
        }
    } catch (e) { console.error(e); }
  };

  const handleAddEmail = () => {
    if (newEmail && !evaluationEmails.includes(newEmail)) {
      setEvaluationEmails([...evaluationEmails, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEvaluationEmails(evaluationEmails.filter(e => e !== email));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin?type=settings', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ emails: evaluationEmails })
      });
      if (res.status === 401) { handleLogout(); return; }
      if (res.ok) alert("تم حفظ الإعدادات بنجاح");
      else alert("خطأ في حفظ الإعدادات");
    } catch (err) {
      alert("خطأ في حفظ الإعدادات");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
      if (window.confirm("حذف هذا الخبر؟")) {
          try {
              const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE', headers: getAuthHeaders() });
              if (res.status === 401) { handleLogout(); return; }
              fetchNews();
          } catch(e) {
              alert("خطأ في الحذف");
          }
      }
  }

  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const mediaUrls: string[] = [];
      if (newsFiles && newsFiles.length > 0) {
        for (let i = 0; i < newsFiles.length; i++) {
            const url = await uploadToCloudinary(newsFiles[i]);
            if (url && url.startsWith('https')) mediaUrls.push(url);
            else throw new Error(`فشل رفع الملف رقم ${i + 1}.`);
        }
      }
      
      const res = await fetch('/api/news', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: newsTitle, 
            date: newsDate, 
            category: newsCategory, 
            description: newsDesc,
            mediaUrls, 
            imageUrl: mediaUrls.find(u => !u.includes('.mp4')) || null,
            videoUrl: mediaUrls.find(u => u.includes('.mp4')) || null
          })
      });

      if (res.status === 401) { handleLogout(); return; }
      if (!res.ok) throw new Error("API Error");

      alert("تم نشر الخبر بنجاح!");
      setNewsTitle(''); setNewsDesc(''); setNewsFiles(null); setNewsDate('');
      fetchNews();
    } catch (err: any) { alert(err.message || "خطأ في النشر"); } finally { setUploading(false); }
  };

  if (!isSecretRoute) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6"><AlertOctagon size={80} className="text-red-500 mb-6" /><h1 className="text-3xl font-black text-gray-900 mb-2">منطقة محظورة</h1><p className="text-gray-500">تم تسجيل محاولة الدخول غير المصرح به.</p></div>;

  if (!isAuthenticated) return (
      <div className="min-h-screen bg-gradient-to-br from-[#7e1d51] to-[#4a1130] flex items-center justify-center p-4 font-sans relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 border border-white/20">
              <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                      <ShieldCheck size={40} className="text-[#7e1d51]" />
                  </div>
              </div>
              <h1 className="text-2xl font-black text-[#1a0510] text-center mb-2">لوحة القيادة المؤمنة</h1>
              <p className="text-gray-400 text-center text-xs mb-8">شباب فور إرشاد - الوصول للمسؤولين فقط</p>
              
              <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 mr-2">اسم المستخدم</label>
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-[#7e1d51] p-4 rounded-xl outline-none transition-all font-bold" required />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 mr-2">كلمة المرور</label>
                      <div className="relative">
                          <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-[#7e1d51] p-4 rounded-xl outline-none pr-12 transition-all font-bold" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                      </div>
                  </div>
                  
                  {loginError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                          <AlertOctagon size={14} /> {loginError}
                      </div>
                  )}
                  
                  <button type="submit" disabled={isLoggingIn} className="w-full py-4 bg-[#7e1d51] text-white font-black rounded-xl hover:bg-[#5e153b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      {isLoggingIn ? <Loader2 className="animate-spin mx-auto" /> : 'تسجيل الدخول الآمن'}
                  </button>
              </form>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className={`w-72 bg-white fixed h-full right-0 z-40 border-l border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b border-gray-50 bg-[#fafafa]">
            <h2 className="text-xl font-black text-[#7e1d51] flex items-center gap-2"><Lock size={18} /> منطقة الإدارة</h2>
            <p className="text-gray-400 text-[10px] mt-1 font-bold">جلسة مؤمنة ومشفرة</p>
        </div>
        <nav className="p-6 space-y-4">
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'news' ? 'bg-[#7e1d51] text-white shadow-lg shadow-[#7e1d51]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-[#7e1d51]'}`}><Newspaper size={20} /> <span className="font-bold">إدارة الأخبار</span></button>
          <button onClick={() => setActiveTab('registrations')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'registrations' ? 'bg-[#7e1d51] text-white shadow-lg shadow-[#7e1d51]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-[#7e1d51]'}`}><Users size={20} /> <span className="font-bold">قائمة المنخرطين</span></button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-[#7e1d51] text-white shadow-lg shadow-[#7e1d51]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-[#7e1d51]'}`}><Settings size={20} /> <span className="font-bold">إعدادات النظام</span></button>
        </nav>
        <div className="p-6 border-t border-gray-50 mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 w-full p-4 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"><LogOut size={18} /> إنهاء الجلسة</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 md:mr-72 w-full max-w-[1600px]">
        {activeTab === 'news' && (
          <div className="space-y-10 animate-fadeInUp">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100"><h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3"><Plus className="bg-[#fcd34d] rounded-full p-1 text-[#7e1d51]" /> إضافة خبر جديد</h2><form onSubmit={handlePostNews} className="space-y-6"><input type="text" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#7e1d51] transition-all font-bold" placeholder="عنوان الخبر الرئيسي..." required /><div className="grid grid-cols-2 gap-4"><input type="date" value={newsDate} onChange={e => setNewsDate(e.target.value)} className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#7e1d51] transition-all" required /><select value={newsCategory} onChange={e => setNewsCategory(e.target.value)} className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#7e1d51] transition-all font-bold cursor-pointer"><option>عام</option><option>نشاط خيري</option><option>دورة تكوينية</option></select></div><textarea rows={5} value={newsDesc} onChange={e => setNewsDesc(e.target.value)} className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#7e1d51] transition-all resize-none" placeholder="اكتب تفاصيل الخبر هنا..." required /><div className="border-2 border-dashed border-gray-300 rounded-[2rem] p-10 text-center relative hover:bg-gray-50 transition-colors group"><input type="file" multiple onChange={e => setNewsFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" /><div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><ImagePlus className="text-[#7e1d51]" size={28} /></div><span className="text-gray-500 font-bold block">{newsFiles ? `تم اختيار ${newsFiles.length} ملفات` : 'اسحب الصور أو اضغط هنا للرفع'}</span><p className="text-xs text-gray-400 mt-2">يدعم الصور (JPG, PNG) والفيديو (MP4)</p></div><button type="submit" disabled={uploading} className="w-full py-5 bg-[#7e1d51] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex justify-center items-center gap-3 text-lg">{uploading ? <Loader2 className="animate-spin" /> : <Save size={24} />}{uploading ? 'جاري رفع الملفات وتأمين البيانات...' : 'نشر الخبر فوراً'}</button></form></div>
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm"><h3 className="font-black text-xl text-gray-800 mb-6 px-2">الأرشيف المنشور</h3><div className="space-y-3">{newsList.map(item => (<div key={item.id} className="flex justify-between items-center p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group"><span className="font-bold text-gray-700">{item.title}</span><button onClick={() => handleDeleteNews(item.id)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button></div>))}</div></div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp">
             <div className="overflow-x-auto">
                 <table className="w-full text-right min-w-[700px] border-collapse">
                     <thead>
                         <tr className="border-b border-gray-100">
                             <th className="p-5 text-gray-400 text-xs font-bold uppercase tracking-wider">الاسم الكامل</th>
                             <th className="p-5 text-gray-400 text-xs font-bold uppercase tracking-wider">الولاية</th>
                             <th className="p-5 text-gray-400 text-xs font-bold uppercase tracking-wider">رقم الهاتف</th>
                             <th className="p-5 text-gray-400 text-xs font-bold uppercase tracking-wider">الإجراء</th>
                         </tr>
                     </thead>
                     <tbody className="text-sm">
                         {registrations.map((reg, idx) => (
                             <tr key={reg.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                                 <td className="p-5 font-bold text-gray-800">{reg.fullName}</td>
                                 <td className="p-5 text-gray-600">{reg.wilaya}</td>
                                 <td className="p-5 font-mono text-[#7e1d51] font-bold">{reg.phone}</td>
                                 <td className="p-5"><button onClick={() => setSelectedReg(reg)} className="px-4 py-2 bg-pink-50 text-[#7e1d51] rounded-xl font-bold hover:bg-[#7e1d51] hover:text-white transition-all text-xs">عرض الملف</button></td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm max-w-3xl mx-auto animate-fadeInUp">
            <h2 className="text-2xl font-black text-[#7e1d51] mb-2 flex items-center gap-3"><ShieldCheck size={28} /> الحماية والإشعارات</h2>
            <p className="text-gray-400 text-sm mb-8 border-b border-gray-100 pb-8">إدارة بروتوكولات الأمان وقوائم البريد الإلكتروني المصرح لها باستلام التقييمات.</p>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Mail size={16} /> القائمة البيضاء للإيميلات (Whitelist)</label>
                <div className="space-y-3">
                  {evaluationEmails.map(email => (
                    <div key={email} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#7e1d51] transition-colors">
                      <span className="font-bold text-gray-700 font-mono text-sm">{email}</span>
                      <button onClick={() => handleRemoveEmail(email)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#7e1d51] transition-all font-bold" placeholder="أضف بريد إلكتروني مسؤول..." />
                <button onClick={handleAddEmail} className="px-6 py-4 bg-[#1a0510] text-white font-bold rounded-2xl hover:scale-105 transition-all"><Plus /></button>
              </div>
              <div className="pt-8 border-t border-gray-100">
                  <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full py-4 bg-[#7e1d51] text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-3">
                    {isSavingSettings ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isSavingSettings ? 'جاري تحديث البروتوكولات...' : 'حفظ التغييرات الأمنية'}
                  </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal for User Details */}
      {selectedReg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a0510]/80 backdrop-blur-md p-4 animate-fadeInUp" onClick={() => setSelectedReg(null)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border-4 border-white/10" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedReg(null)} className="absolute top-6 left-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><X size={20} /></button>
                <div className="flex items-center gap-5 mb-10 border-b border-gray-100 pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#7e1d51] to-[#b92b72] rounded-[1.5rem] flex items-center justify-center shadow-lg text-white font-black text-2xl">
                        {selectedReg.fullName.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 leading-none mb-2">{selectedReg.fullName}</h2>
                        <div className="flex gap-3">
                             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">منخرط نشط</span>
                             <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold flex items-center gap-1"><MapPin size={12} /> {selectedReg.wilaya}</span>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase mb-5 flex items-center gap-2"><User size={14} /> البيانات الشخصية</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-2xl shadow-sm"><span className="block text-gray-400 text-[10px] mb-1">تاريخ الميلاد</span><span className="font-bold text-gray-800">{selectedReg.birthDate}</span></div>
                             <div className="bg-white p-4 rounded-2xl shadow-sm"><span className="block text-gray-400 text-[10px] mb-1">مكان الميلاد</span><span className="font-bold text-gray-800">{selectedReg.birthPlace}</span></div>
                             <div className="bg-white p-4 rounded-2xl shadow-sm col-span-2"><span className="block text-gray-400 text-[10px] mb-1">العنوان الكامل</span><span className="font-bold text-gray-800">{selectedReg.address}</span></div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase mb-5 flex items-center gap-2"><Phone size={14} /> قنوات الاتصال</h3>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200"><span className="block text-gray-400 text-[10px] mb-1">الهاتف المحمول</span><span className="font-black text-[#7e1d51] font-mono text-lg">{selectedReg.phone}</span></div>
                             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
                                 {selectedReg.facebookLink ? (<a href={selectedReg.facebookLink} target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-2">فتح الفيسبوك <ExternalLink size={14} /></a>) : <span className="text-gray-400 text-sm font-bold">غير متوفر</span>}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
    