import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Search, Download, Users } from 'lucide-react';
import '../styles/home.css';

interface APKCard {
  id: number;
  name: string;
  status: string;
  size: string;
  downloads: number;
  imageUrl: string;
  borderColor: string;
}

const borderColorMap: Record<string, string> = {
  blue: 'apk-card-border-blue',
  purple: 'apk-card-border-purple',
  orange: 'apk-card-border-orange',
  green: 'apk-card-border-green',
  red: 'apk-card-border-red',
  pink: 'apk-card-border-pink',
  cyan: 'apk-card-border-cyan',
  yellow: 'apk-card-border-yellow',
};

// Particle background component
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: ['#3b82f6', '#a855f7', '#f97316', '#22c55e', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 6)],
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAPKs, setFilteredAPKs] = useState<APKCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  // Fetch all APKs
  const { data: apks, isLoading } = trpc.apks.getAll.useQuery();

  useEffect(() => {
    if (apks) {
      if (searchQuery.trim() === '') {
        setFilteredAPKs(apks);
      } else {
        setFilteredAPKs(
          apks.filter((apk) =>
            apk.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }
  }, [apks, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="animated-bg relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <ParticleBackground />

        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-400 mb-4">
            Maxx Apks Hub
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Download Latest Modded Apks By Maxx
          </p>

          {/* Search Bar */}
          <div className="relative mb-12">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search premium APKs..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-6 py-3 bg-gray-800 border-2 border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
              />
              <Search className="absolute right-4 text-green-500" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Download APKs Section */}
      <section className="bg-gray-950 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">
            Download Apks
          </h2>

          {isLoading ? (
            <div className="text-center text-gray-400">Loading APKs...</div>
          ) : filteredAPKs.length === 0 ? (
            <div className="text-center text-gray-400">No APKs found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredAPKs.map((apk, index) => (
                <div
                  key={apk.id}
                  className={`apk-card ${borderColorMap[apk.borderColor] || 'apk-card-border-blue'}`}
                >
                  <img
                    src={apk.imageUrl}
                    alt={apk.name}
                    className="apk-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=' + apk.name;
                    }}
                  />
                  <div className="apk-card-overlay">
                    <div className="apk-card-header">
                      <span className="apk-card-number">{index + 1}</span>
                    </div>
                    <div className="apk-card-footer">
                      <h3 className="apk-card-title">{apk.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                        <span>{apk.status}</span>
                      </div>
                      <div className="apk-card-info">
                        <div className="apk-card-info-item">
                          <Users size={12} />
                          <span>{apk.downloads}K</span>
                        </div>
                        <div className="apk-card-info-item">
                          <Download size={12} />
                          <span>{apk.size}</span>
                        </div>
                      </div>
                      <button
                        className={`view-details-btn border-${apk.borderColor}-500`}
                        style={{ borderColor: getBorderColor(apk.borderColor) }}
                        onClick={() => alert(`Details for ${apk.name}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>© 2023-2025 <span className="text-blue-400">Maxx Apks Hub</span> | All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getBorderColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    blue: '#3b82f6',
    purple: '#a855f7',
    orange: '#f97316',
    green: '#22c55e',
    red: '#ef4444',
    pink: '#ec4899',
    cyan: '#06b6d4',
    yellow: '#eab308',
  };
  return colorMap[colorName] || '#3b82f6';
}
