
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfoSection from './components/InfoSection';
import RegistrationForm from './components/RegistrationForm';
import ContactPage from './components/ContactPage';
import WorkAreas from './components/WorkAreas';
import NewsPage from './components/NewsPage';
import AdminDashboard from './components/AdminDashboard';
import WorkshopEvaluation from './components/WorkshopEvaluation';
import Footer from './components/Footer';
import AIChatBot from './components/AIChatBot';
import { AlertCircle, Home } from 'lucide-react';

type PageType = 'home' | 'register' | 'contact' | 'work-areas' | 'news' | 'admin' | 'workshop-evaluation' | '404';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  // Removed Firebase auth state logic as we rely on API now

  useEffect(() => {
    const handleNavigationLogic = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);
      const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');

      // Check for workshop evaluation page via query param studio=1
      if (cleanPath === '/page' && search.get('studio') === '1') {
        setCurrentPage('workshop-evaluation');
        return;
      }

      // 1. Secret Admin Route: /#//admin
      if (hash === '#//admin') {
        setCurrentPage('admin');
        return;
      }

      // 2. Explicitly Block /admin (Security)
      if (cleanPath === '/admin') {
        setCurrentPage('404');
        return;
      }

      // 3. SPA Route Handling
      const validPaths: Record<string, PageType> = {
        '/': 'home',
        '/home': 'home',
        '/register': 'register',
        '/contact': 'contact',
        '/work-areas': 'work-areas',
        '/news': 'news'
      };

      if (validPaths[cleanPath]) {
        setCurrentPage(validPaths[cleanPath]);
      } else {
        setCurrentPage('404');
      }
    };

    handleNavigationLogic();
    window.addEventListener('popstate', handleNavigationLogic);
    window.addEventListener('hashchange', handleNavigationLogic);
    return () => {
      window.removeEventListener('popstate', handleNavigationLogic);
      window.removeEventListener('hashchange', handleNavigationLogic);
    };
  }, []);

  const handleNavigation = (page: PageType) => {
    if (page === 'admin') {
      window.location.hash = '//admin';
    } else if (page === 'workshop-evaluation') {
      window.history.pushState(null, '', '/page?studio=1');
    } else {
      const path = page === 'home' ? '/' : `/${page}`;
      window.location.hash = '';
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'register': return <RegistrationForm />;
      case 'contact': return <ContactPage />;
      case 'work-areas': return <WorkAreas onJoinClick={() => handleNavigation('register')} />;
      case 'news': return <NewsPage />;
      case 'admin': return <AdminDashboard />;
      case 'workshop-evaluation': return <WorkshopEvaluation />;
      case '404':
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fadeInUp">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={48} className="text-[#7e1d51]" />
            </div>
            <h1 className="text-4xl font-black text-[#1a0510] mb-4">الصفحة غير موجودة</h1>
            <p className="text-gray-500 mb-8 max-w-md">نعتذر، الرابط الذي تحاول الوصول إليه غير متاح حالياً.</p>
            <button onClick={() => handleNavigation('home')} className="px-8 py-3 bg-[#7e1d51] text-white font-bold rounded-2xl shadow-xl flex items-center gap-2"><Home size={18} /> العودة للرئيسية</button>
          </div>
        );
      default:
        return (
          <>
            <Hero onJoinClick={() => handleNavigation('register')} />
            <InfoSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {currentPage !== 'admin' && currentPage !== '404' && currentPage !== 'workshop-evaluation' && (
        <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      )}
      <main className={`flex-grow ${currentPage !== 'admin' && currentPage !== '404' && currentPage !== 'workshop-evaluation' ? 'pt-[80px]' : ''}`}>
        {renderContent()}
      </main>
      {currentPage !== 'admin' && currentPage !== '404' && currentPage !== 'workshop-evaluation' && <Footer onNavigate={handleNavigation} />}
      {currentPage !== 'admin' && <AIChatBot />}
    </div>
  );
}

export default App;
