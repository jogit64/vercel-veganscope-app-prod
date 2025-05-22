
import BottomNavigation from '@/components/BottomNavigation';
import { AppProvider } from '@/contexts/AppContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen">
      <main className="container px-4 max-w-md mx-auto">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <Layout>
        {/* Ce contenu sera remplacé par l'App.tsx qui charge la page appropriée */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur Veganscope</h1>
            <p className="text-xl text-gray-600">L'application pour des choix de films et séries éthiques</p>
          </div>
        </div>
      </Layout>
    </AppProvider>
  );
};

export default Index;
