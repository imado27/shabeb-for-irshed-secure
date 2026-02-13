
import React, { useEffect, useState, useRef } from 'react';
import { Calendar, Tag, ArrowRight, Loader2, PlayCircle, Image as ImageIcon, ChevronLeft, ChevronRight, Newspaper, Share2, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaUrls?: string[];
}

const safeFormatDate = (dateStr: string, options: Intl.DateTimeFormatOptions) => {
  if (!dateStr) return '---';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ar-DZ', options);
  } catch (e) {
    return dateStr;
  }
};

const formatDate = (dateStr: string) => safeFormatDate(dateStr, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatDateShort = (dateStr: string) => safeFormatDate(dateStr, { year: 'numeric', month: 'long', day: 'numeric' });

const NewsDetailView = ({ item, onBack }: { item: NewsItem; onBack: () => void }) => {
    const getMediaList = () => {
        let list: string[] = [];
        if (item.mediaUrls && Array.isArray(item.mediaUrls)) {
            list = item.mediaUrls.filter(url => typeof url === 'string' && url.trim() !== '');
        }
        
        if (list.length === 0) {
            if (item.videoUrl) list.push(item.videoUrl);
            if (item.imageUrl) list.push(item.imageUrl);
        }
        return list.filter(url => typeof url === 'string' && url.trim() !== '');
    };

    const mediaList = getMediaList();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
      if (mediaList.length > 1 && !isPaused) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
             setCurrentSlide((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
        }, 5000);
      }
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [currentSlide, mediaList.length, isPaused]);

    const nextSlide = () => setCurrentSlide((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));

    return (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-fadeInUp font-sans">
            <div className="sticky top-0 bg-white/80 backdrop-blur-2xl z-40 border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
                <button 
                  onClick={onBack} 
                  className="flex items-center gap-2 text-gray-700 hover:text-[#7e1d51] font-bold transition-all px-4 py-2 hover:bg-pink-50 rounded-2xl group"
                >
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> عودة للأخبار
                </button>
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-2">
                    <Clock size={14} /> تم النشر في {formatDateShort(item.date)}
                  </span>
                </div>
                <button className="p-2.5 text-gray-400 hover:text-[#7e1d51] hover:bg-pink-50 rounded-full transition-all">
                  <Share2 size={20} />
                </button>
            </div>

            <div className="max-w-6xl mx-auto pb-24">
                <div 
                   className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-gray-900 overflow-hidden md:rounded-b-[3rem] shadow-2xl group"
                   onMouseEnter={() => setIsPaused(true)}
                   onMouseLeave={() => setIsPaused(false)}
                >
                    {mediaList.length > 0 ? (
                        <>
                           {mediaList.map((url, index) => (
                               <div 
                                 key={index} 
                                 className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform ${
                                     index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                 }`}
                               >
                                  {url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('video') ? (
                                      <video src={url} controls className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="relative w-full h-full">
                                        <div className="absolute inset-0 bg-black/20 z-10"></div>
                                        <img 
                                          src={url} 
                                          alt="" 
                                          className="w-full h-full object-cover"
                                          loading="eager"
                                          onError={(e) => {
                                              const target = e.target as HTMLImageElement;
                                              if (target.src !== 'https://placehold.co/1200x600/f3f4f6/7e1d51?text=Image+Unavailable') {
                                                  target.src = 'https://placehold.co/1200x600/f3f4f6/7e1d51?text=Image+Unavailable';
                                              }
                                          }}
                                        />
                                      </div>
                                  )}
                               </div>
                           ))}

                           {mediaList.length > 1 && (
                               <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-4 md:px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <button onClick={prevSlide} className="pointer-events-auto w-12 h-12 bg-white/20 hover:bg-white text-gray-900 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"><ChevronLeft size={28} /></button>
                                   <button onClick={nextSlide} className="pointer-events-auto w-12 h-12 bg-white/20 hover:bg-white text-gray-900 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"><ChevronRight size={28} /></button>
                               </div>
                           )}

                           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

                           {mediaList.length > 1 && (
                               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                                   {mediaList.map((_, idx) => (
                                       <button 
                                          key={idx} 
                                          onClick={() => setCurrentSlide(idx)}
                                          className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentSlide ? 'bg-[#fcd34d] w-10' : 'bg-white/40 w-4 hover:bg-white/60'}`}
                                       />
                                   ))}
                               </div>
                           )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gray-50">
                            <ImageIcon size={60} className="opacity-10 mb-4" />
                            <span className="font-bold opacity-30">لا توجد وسائط متاحة</span>
                        </div>
                    )}
                </div>

                <div className="px-6 py-12 md:px-20 md:py-20 text-right" dir="rtl">
                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <span className="bg-[#7e1d51] text-white px-6 py-2.5 rounded-full text-xs font-black shadow-lg shadow-pink-900/10 flex items-center gap-2">
                            <Tag size={16} className="text-[#fcd34d]" /> {item.category}
                        </span>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-gray-500 text-sm font-bold flex items-center gap-2">
                            <Calendar size={16} className="text-[#7e1d51]" /> {formatDate(item.date)}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1a0510] mb-12 leading-[1.15] tracking-tight">
                        {item.title}
                    </h1>
                    <div className="prose prose-xl prose-pink max-w-none text-gray-600 leading-[1.9] font-medium whitespace-pre-line">
                        {item.description}
                    </div>
                    <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                       <h3 className="text-xl font-bold text-gray-800">هل ترغب في المشاركة في مبادراتنا؟</h3>
                       <p className="text-gray-500">انضم إلينا الآن وكن جزءاً من التغيير في بلدية بن عبد المالك رمضان.</p>
                       <button 
                         onClick={() => window.location.href = '/register'}
                         className="px-8 py-4 bg-[#7e1d51] text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:bg-[#5e153b] transition-all"
                       >
                         سجل كمنخرط الآن
                       </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20">
       {selectedNews && <NewsDetailView item={selectedNews} onBack={() => setSelectedNews(null)} />}
       <div className="bg-[#1a0510] pt-40 pb-48 relative overflow-hidden rounded-b-[4rem] md:rounded-b-[6rem] shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.15]"></div>
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#7e1d51] rounded-full blur-[150px] opacity-40"></div>
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-[#fcd34d] rounded-full blur-[150px] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-[#fcd34d] animate-pulse"></span>
                <span className="text-[#fcd34d] text-[10px] font-black tracking-widest uppercase">Latest Updates</span>
             </div>
             <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight">نبض <span className="text-[#fcd34d]">الإرشاد</span></h1>
             <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                نافذتكم على عالم العطاء والتميز الشاب في بلدية بن عبد المالك رمضان.
             </p>
          </div>
       </div>

       <div className="container mx-auto px-4 -mt-24 relative z-20">
          {loading ? (
             <div className="flex flex-col justify-center items-center py-40 bg-white rounded-[3rem] shadow-2xl border border-gray-50">
                <Loader2 className="w-16 h-16 text-[#7e1d51] animate-spin mb-6" />
                <span className="text-[#1a0510] font-black text-xl">نستحضر آخر الأخبار...</span>
             </div>
          ) : news.length === 0 ? (
             <div className="bg-white rounded-[3rem] p-24 text-center shadow-2xl border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                   <Newspaper className="text-gray-200 w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4">الأخبار في طريقها إليكم</h3>
                <p className="text-gray-400 max-w-md mx-auto">لم يتم نشر أي نشاطات بعد. ترقبوا انطلاقتنا القوية قريباً.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {news.map((item) => {
                   const displayImage = (item.mediaUrls || []).find(url => url && typeof url === 'string' && !url.toLowerCase().includes('.mp4') && !url.toLowerCase().includes('video')) || item.imageUrl;
                   const displayVideo = (item.mediaUrls || []).find(url => url && typeof url === 'string' && (url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('video'))) || item.videoUrl;
                   const mediaCount = item.mediaUrls ? item.mediaUrls.filter(u => typeof u === 'string' && u.trim() !== '').length : (displayImage || displayVideo ? 1 : 0);

                   return (
                   <div 
                     key={item.id} 
                     className="group bg-white rounded-[3rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(126,29,81,0.15)] hover:-translate-y-3 transition-all duration-500 border border-gray-100 flex flex-col h-full text-right cursor-pointer" 
                     dir="rtl"
                     onClick={() => setSelectedNews(item)}
                   >
                      <div className="h-72 overflow-hidden relative bg-gray-50">
                         {displayImage ? (
                            <img 
                                src={displayImage} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                alt={item.title} 
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== 'https://placehold.co/600x400/f3f4f6/7e1d51?text=Image+Unavailable') {
                                        target.src = 'https://placehold.co/600x400/f3f4f6/7e1d51?text=Image+Unavailable';
                                    }
                                }}
                            />
                         ) : displayVideo ? (
                            <div className="w-full h-full relative">
                               <video src={displayVideo} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                  <PlayCircle className="text-white opacity-90 drop-shadow-xl" size={56} />
                               </div>
                            </div>
                         ) : (
                            <div className="w-full h-full flex items-center justify-center bg-pink-50">
                               <ImageIcon className="text-[#7e1d51] opacity-10" size={60} />
                            </div>
                         )}
                         <div className="absolute top-6 right-6 z-20">
                            <span className="bg-[#7e1d51] text-white px-5 py-2 rounded-2xl text-[10px] font-black shadow-xl flex items-center gap-2">
                               <Tag size={12} className="text-[#fcd34d]" /> {item.category}
                            </span>
                         </div>
                         {mediaCount > 1 && (
                            <div className="absolute bottom-6 left-6 z-20 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-bold flex items-center gap-2 border border-white/20">
                               <ImageIcon size={14} /> +{mediaCount} صور
                            </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      <div className="p-8 md:p-10 flex flex-col flex-grow">
                         <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold mb-6 uppercase tracking-widest border-r-2 border-[#fcd34d] pr-3">
                            <Calendar size={14} className="text-[#7e1d51]" /> {formatDateShort(item.date)}
                         </div>
                         <h3 className="text-2xl font-black text-[#1a0510] mb-5 leading-tight group-hover:text-[#7e1d51] transition-colors line-clamp-2">
                            {item.title}
                         </h3>
                         <p className="text-gray-500 text-sm leading-[1.8] mb-10 flex-grow line-clamp-3">
                            {item.description}
                         </p>
                         <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
                            <span className="text-[#7e1d51] font-black text-sm flex items-center gap-2 group/btn">
                               التفاصيل الكاملة <ChevronLeft size={20} className="transition-transform group-hover/btn:-translate-x-1" />
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#7e1d51] group-hover:text-white transition-all">
                               <ArrowRight size={14} className="rotate-180" />
                            </div>
                         </div>
                      </div>
                   </div>
                )})}
             </div>
          )}
       </div>
    </div>
  );
};

export default NewsPage;
