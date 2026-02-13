
import React, { useState, useEffect } from 'react';
import { uploadToCloudinary } from '../services/cloudinary';
import { Newspaper, Users, LogOut, Plus, Loader2, Save, Search, Trash2, Eye, EyeOff, X, Menu as MenuIcon, ImagePlus, Lock, Phone, User, MapPin, Mail, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSecretRoute, setIsSecretRoute] = useState(false);

  useEffect(() => {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simple authentication check (ideally this should be server-side too for real security)
    if (username === 'admin' && password === '01012026') {
      setIsAuthenticated(true);
    } else {
      setLoginError('بيانات الدخول غير صحيحة');
    }
    setIsLoggingIn(false);
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
        const res = await fetch('/api/admin?type=registrations');
        if (res.ok) {
            const data = await res.json();
            setRegistrations(data);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingReg(false);
    }
  };

  const fetchNews = async () => {
    setLoadingNewsList(true);
    try {
        const res = await fetch('/api/news');
        if (res.ok) {
            const data = await res.json();
            setNewsList(data);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingNewsList(false);
    }
  };

  const fetchSettings = async () => {
    try {
        const res = await fetch('/api/admin?type=settings');
        if (res.ok) {
            const data = await res.json();
            setEvaluationEmails(data);
        }
    } catch (e) {
        console.error(e);
    }
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
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ emails: evaluationEmails })
      });
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
              await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
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
          headers: {'Content-Type': 'application/json'},
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

      if (!res.ok) throw new Error("API Error");

      alert("تم نشر الخبر بنجاح!");
      setNewsTitle(''); setNewsDesc(''); setNewsFiles(null); setNewsDate('');
      fetchNews();
    } catch (err: any) { alert(err.message || "خطأ في النشر"); } finally { setUploading(false); }
  };

  if (!isSecretRoute) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6"><Lock size={64} className="text-gray-300 mb-4" /><h1 className="text-2xl font-black text-gray-800">الدخول غير مصرح به</h1></div>;

  if (!isAuthenticated) return <div className="min-h-screen bg-[#7e1d51] flex items-center justify-center p-4 font-sans"><div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md"><h1 className="text-2xl font-black text-[#7e1d51] text-center mb-10">لوحة التحكم السرية</h1><form onSubmit={handleLogin} className="space-y-5"><input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 border p-4 rounded-xl outline-none" placeholder="اسم المستخدم" /><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border p-4 rounded-xl outline-none pr-12" placeholder="كلمة المرور" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{loginError && <p className="text-red-600 text-sm text-center font-bold">{loginError}</p>}<button type="submit" disabled={isLoggingIn} className="w-full py-4 bg-[#7e1d51] text-white font-black rounded-xl hover:bg-[#5e153b] transition-all">{isLoggingIn ? <Loader2 className="animate-spin mx-auto" /> : 'دخول للمنصة'}</button></form></div></div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex font-sans" dir="rtl">
      <aside className={`w-72 bg-white fixed h-full right-0 z-40 border-l shadow-sm transition-transform md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 border-b"><h2 className="text-lg font-black text-[#7e1d51]">لوحة القيادة</h2></div>
        <nav className="p-6 space-y-4">
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl ${activeTab === 'news' ? 'bg-[#7e1d51] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Newspaper size={20} /> <span className="font-bold">الأخبار</span></button>
          <button onClick={() => setActiveTab('registrations')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl ${activeTab === 'registrations' ? 'bg-[#7e1d51] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={20} /> <span className="font-bold">المنخرطين</span></button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl ${activeTab === 'settings' ? 'bg-[#7e1d51] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Settings size={20} /> <span className="font-bold">إعدادات الإيميل</span></button>
        </nav>
        <div className="p-6 border-t mt-auto"><button onClick={() => window.location.href = '/'} className="flex items-center gap-3 text-red-500 w-full p-4 font-bold"><LogOut size={18} /> خروج</button></div>
      </aside>

      <main className="flex-1 p-4 md:p-10 md:mr-72 w-full">
        {activeTab === 'news' && (
          <div className="space-y-10">
            <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border"><h2 className="text-xl font-bold mb-8">إضافة خبر جديد</h2><form onSubmit={handlePostNews} className="space-y-6"><input type="text" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="عنوان الخبر..." required /><div className="grid grid-cols-2 gap-4"><input type="date" value={newsDate} onChange={e => setNewsDate(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" required /><select value={newsCategory} onChange={e => setNewsCategory(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none"><option>عام</option><option>نشاط خيري</option><option>دورة تكوينية</option></select></div><textarea rows={4} value={newsDesc} onChange={e => setNewsDesc(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="التفاصيل..." required /><div className="border-2 border-dashed rounded-3xl p-6 text-center relative hover:bg-gray-50"><input type="file" multiple onChange={e => setNewsFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" /><ImagePlus className="mx-auto text-gray-400 mb-2" /><span className="text-gray-500 font-bold">{newsFiles ? `${newsFiles.length} ملفات` : 'اختر الوسائط'}</span></div><button type="submit" disabled={uploading} className="w-full py-4 bg-[#7e1d51] text-white font-black rounded-2xl shadow-lg flex justify-center items-center gap-2">{uploading ? <Loader2 className="animate-spin" /> : <Save size={20} />}{uploading ? 'جاري الرفع...' : 'نشر الخبر'}</button></form></div>
            <div className="bg-white rounded-[2rem] p-6 border shadow-sm"><h3 className="font-bold mb-4">الأخبار المنشورة</h3><div className="space-y-3">{newsList.map(item => (<div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border"><span className="font-bold text-sm">{item.title}</span><button onClick={() => handleDeleteNews(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button></div>))}</div></div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="bg-white rounded-[2rem] p-6 border shadow-sm overflow-x-auto"><table className="w-full text-right min-w-[600px]"><thead className="bg-gray-50 text-xs text-gray-400"><tr><th className="p-4">الاسم</th><th className="p-4">الولاية</th><th className="p-4">الهاتف</th><th className="p-4">إجراء</th></tr></thead><tbody className="text-sm">{registrations.map(reg => (<tr key={reg.id} className="border-t hover:bg-gray-50 transition-colors"><td className="p-4 font-bold">{reg.fullName}</td><td className="p-4">{reg.wilaya}</td><td className="p-4 font-mono">{reg.phone}</td><td className="p-4"><button onClick={() => setSelectedReg(reg)} className="text-[#7e1d51] font-bold">عرض</button></td></tr>))}</tbody></table></div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-[2rem] p-10 border shadow-sm max-w-2xl mx-auto animate-fadeInUp">
            <h2 className="text-2xl font-black text-[#7e1d51] mb-8 flex items-center gap-3"><Mail /> إعدادات استقبال التقييمات</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">قائمة الإيميلات المستقبلة</label>
                <div className="space-y-2">
                  {evaluationEmails.map(email => (
                    <div key={email} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border group">
                      <span className="font-bold text-gray-700">{email}</span>
                      <button onClick={() => handleRemoveEmail(email)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"><X size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="flex-1 p-4 bg-gray-50 border rounded-xl outline-none focus:border-[#7e1d51]" placeholder="أضف إيميل جديد..." />
                <button onClick={handleAddEmail} className="px-6 py-4 bg-[#7e1d51] text-white font-bold rounded-xl hover:bg-[#5e153b]"><Plus /></button>
              </div>
              <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full py-4 bg-[#1a0510] text-white font-black rounded-xl shadow-lg flex justify-center items-center gap-2">
                {isSavingSettings ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isSavingSettings ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedReg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setSelectedReg(null)}><div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-fadeInUp shadow-2xl" onClick={e => e.stopPropagation()}><button onClick={() => setSelectedReg(null)} className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20} /></button><div className="flex items-center gap-4 mb-8"><div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center"><User size={32} className="text-[#7e1d51]" /></div><div><h2 className="text-2xl font-black text-[#7e1d51] leading-none">{selectedReg.fullName}</h2><p className="text-gray-400 text-sm mt-2">تاريخ التسجيل: {new Date(selectedReg.timestamp).toLocaleDateString('ar-DZ')}</p></div></div><div className="space-y-8"><div className="bg-gray-50/50 p-6 rounded-[1.5rem] border"><h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><MapPin size={14} /> المعلومات الشخصية</h3><div className="grid grid-cols-2 gap-4 text-sm"><div className="bg-white p-4 rounded-xl shadow-sm border"><span className="text-gray-400 block mb-1">تاريخ الميلاد</span><span className="font-bold text-gray-800">{selectedReg.birthDate}</span></div><div className="bg-white p-4 rounded-xl shadow-sm border"><span className="text-gray-400 block mb-1">مكان الميلاد</span><span className="font-bold text-gray-800">{selectedReg.birthPlace}</span></div><div className="bg-white p-4 rounded-xl shadow-sm border col-span-2"><span className="text-gray-400 block mb-1">العنوان الكامل</span><span className="font-bold text-gray-800">{selectedReg.wilaya} - {selectedReg.address}</span></div></div></div><div className="bg-gray-50/50 p-6 rounded-[1.5rem] border"><h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Phone size={14} /> التواصل</h3><div className="grid grid-cols-2 gap-4 text-sm"><div className="bg-white p-4 rounded-xl shadow-sm border"><span className="text-gray-400 block mb-1">الهاتف</span><span className="font-black text-[#7e1d51] font-mono text-lg">{selectedReg.phone}</span></div><div className="bg-white p-4 rounded-xl shadow-sm border"><span className="text-gray-400 block mb-1">فيسبوك</span>{selectedReg.facebookLink ? (<a href={selectedReg.facebookLink} target="_blank" className="text-blue-600 font-bold">رابط الحساب</a>) : <span>غير متوفر</span>}</div></div></div></div></div></div>
      )}
    </div>
  );
};

export default AdminDashboard;
