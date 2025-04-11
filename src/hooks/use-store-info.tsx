import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SocialMedia = {
  url: string;
  enabled: boolean;
};

type StoreInfo = {
  name: string;
  phone: string;
  address: string;
  logoUrl: string;
  socials: {
    instagram: SocialMedia;
    facebook: SocialMedia;
    whatsapp: SocialMedia;
    x: SocialMedia;
    tiktok: SocialMedia;
    telegram: SocialMedia;
    email: SocialMedia;
    website: SocialMedia;
  };
};

type StoreInfoContextType = {
  storeInfo: StoreInfo;
  updateStoreInfo: (info: Partial<StoreInfo>) => void;
  updateSocialMedia: (key: string, data: Partial<SocialMedia>) => void;
};

const StoreInfoContext = createContext<StoreInfoContextType | undefined>(undefined);

export const StoreInfoProvider = ({ children }: { children: ReactNode }) => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: "Loja Online",
    phone: "(11) 99999-9999",
    address: "Rua Exemplo, 123 - São Paulo, SP",
    logoUrl: "",
    socials: {
      instagram: { url: "", enabled: false },
      facebook: { url: "", enabled: false },
      whatsapp: { url: "", enabled: false },
      x: { url: "", enabled: false },
      tiktok: { url: "", enabled: false },
      telegram: { url: "", enabled: false },
      email: { url: "", enabled: false },
      website: { url: "", enabled: false }
    }
  });

  // Load store info from localStorage on component mount
  useEffect(() => {
    const savedStoreInfo = localStorage.getItem('storeInfo');
    if (savedStoreInfo) {
      try {
        const parsedInfo = JSON.parse(savedStoreInfo);
        // Handle case where the saved data doesn't have the socials property
        if (!parsedInfo.socials) {
          parsedInfo.socials = {
            instagram: { url: "", enabled: false },
            facebook: { url: "", enabled: false },
            whatsapp: { url: "", enabled: false },
            x: { url: "", enabled: false },
            tiktok: { url: "", enabled: false },
            telegram: { url: "", enabled: false },
            email: { url: "", enabled: false },
            website: { url: "", enabled: false }
          };
        }
        // Handle case where website is not in socials
        if (!parsedInfo.socials.website) {
          parsedInfo.socials.website = { url: "", enabled: false };
        }
        setStoreInfo(parsedInfo);
      } catch (error) {
        console.error("Failed to parse store info:", error);
      }
    }
  }, []);

  const updateStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfo(prev => {
      const newInfo = { ...prev, ...info };
      // Save to localStorage whenever it changes
      localStorage.setItem('storeInfo', JSON.stringify(newInfo));
      return newInfo;
    });
  };

  const updateSocialMedia = (key: string, data: Partial<SocialMedia>) => {
    setStoreInfo(prev => {
      const newSocials = { 
        ...prev.socials, 
        [key]: { ...prev.socials[key as keyof typeof prev.socials], ...data } 
      };
      
      const newInfo = { ...prev, socials: newSocials };
      localStorage.setItem('storeInfo', JSON.stringify(newInfo));
      return newInfo;
    });
  };

  return (
    <StoreInfoContext.Provider value={{ storeInfo, updateStoreInfo, updateSocialMedia }}>
      {children}
    </StoreInfoContext.Provider>
  );
};

export const useStoreInfo = () => {
  const context = useContext(StoreInfoContext);
  if (context === undefined) {
    throw new Error("useStoreInfo must be used within a StoreInfoProvider");
  }
  return context;
};
