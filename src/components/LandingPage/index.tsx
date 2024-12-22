import React, { useEffect, useState } from 'react';
import Swap from 'views/Swap';
import throttle from "lodash/throttle";

declare global {
  interface Window {
    StickyShowcase: (config: {
      data: { image: string; meta: string; title: string }[];
      containerId: string;
      waveOptions: { speed: number; frequency: number; amplitude: number };
    }) => void;
  }
}

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const initShowcase = () => {
      if (typeof window !== 'undefined' && window.StickyShowcase) {
        try {
          const showcase = window.StickyShowcase({
            data: [
              {
                image: "https://cdn.prod.website-files.com/675ec55f3d5ef80a2006d90b/675ef28a79db0accf36e7d4b_E2025EC5-DAE6-4E4C-B6DB-7FFE331C6D19.jpeg",
                meta: `<p style="font-size: 12px;">BEMU is a community-driven meme coin inspired by a brave alien's journey to Mars. Join the mission and become part of this cosmic adventure!</p>`,
                title: "BEMU",
              },
              {
                image: "https://cdn.prod.website-files.com/675ec55f3d5ef80a2006d90b/675ef28addcb91047372c997_5A638526-7156-497E-B500-DE420AA2342F.jpeg",
                meta: `<p style="font-size: 12px;">
                  <strong>Total Supply:</strong> 3.14B BEMU • 
                  <strong>Starting Price:</strong> $0.00001 • 
                  <strong>Fees:</strong> Buy: 4% Liquidity | 3% Marketing | 3% Rewards
                </p>`,
                title: "TOKENOMICS",
              },
              {
                image: "https://cdn.prod.website-files.com/675ec55f3d5ef80a2006d90b/675ef28ad118cc5e422f93b4_B8326C56-2FA6-4391-869E-2D9A359AAB9F.jpeg",
                meta: `<p style="font-size: 12px;"><strong>Key Features:</strong> BEMU isn't just a meme coin—it's a mission-driven ecosystem!</p>`,
                title: "UTILITY",
              },
            ],
            containerId: "app",
            waveOptions: {
              speed: 0.6,
              frequency: 16,
              amplitude: 1.5,
            },
        
          });
        } catch (error) {
          console.error("Error initializing StickyShowcase:", error);
        }
      }
    };

    initShowcase();

 
  }, []);
  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 500) {
        setVisible(true);
        // alert(scrolled)
      } else if (scrolled <= 500) {
        setVisible(false);
      }
    };

    const throttledToggleVisible = throttle(toggleVisible, 200);

    window.addEventListener("scroll", throttledToggleVisible);

    return () => window.removeEventListener("scroll", throttledToggleVisible);
  }, []);

  return (
      <main>
      <div
        className='swap-component-c'
        style={{
          opacity: activeSection === 0 ? 1 : 0,
          pointerEvents: activeSection === 0 ? 'auto' : 'none',
        }}
      >
        <Swap />
      </div>

      <div id="app" className="content" />
      <div className="hint-text">
        <div>
         
          <div className="text-block">Contract Address</div>
          <a 
            href="https://basescan.org/address/0x2444b07c5b5B6d4EeFFfe9D62b4e7ebFae9Fa889" 
            target="_blank"
            rel="noopener noreferrer"
            className="div-block w-inline-block"
          >
            <div className="text-block copy">CA: 0x9df….</div>
            <img 
              src="/images/icons8-external-link-30.png" 
              loading="lazy" 
              alt="external link" 
              className="ico"
            />
            
          </a>
        </div>
      </div>
      <div className="hint-text icons">
        <div className="socials">
          <a 
            href="https://x.com/bemucoin" 
            target="_blank"
            rel="noopener noreferrer" 
            className="link-block w-inline-block"
          >
            <img 
              src="/images/icons8-twitterx-32.png" 
              loading="lazy" 
              alt="Twitter" 
              className="image"
            />
          </a>
          <a href="#" className="link-block w-inline-block">
            <img 
              src="/images/icons8-discord-new-32.png" 
              loading="lazy" 
              alt="Discord" 
              className="image"
            />
          </a>
        </div>
        </div>
        
    
    </main>
  );
};

export default LandingPage;
