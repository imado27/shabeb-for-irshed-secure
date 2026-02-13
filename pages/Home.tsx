import React from 'react';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      {/* We add a subtle separator or negative margin if needed to blend them, 
          but usually component stacking is fine. 
          The Hero has a specific background color that transitions to the InfoSection's gray. */}
      <InfoSection />
    </div>
  );
};

export default Home;