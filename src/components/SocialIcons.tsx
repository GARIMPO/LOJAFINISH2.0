import React from "react";
import { Facebook, Twitter, Mail, Globe } from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

interface SocialMedia {
  url: string;
  enabled: boolean;
}

type Socials = {
  [key: string]: SocialMedia;
};

export const InstagramIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const WhatsAppIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5m0 0a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1z" />
  </svg>
);

export const TiktokIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const TelegramIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 3L2 10l6 3M22 3l-4 16-6-6.5M22 3L10 16m-2-3v7l4-4" />
  </svg>
);

export const XIcon = ({ className = "h-5 w-5", ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Componente para exibir os ícones sociais na página principal
export const SocialMediaIcons = ({ socials }: { socials: Socials }) => {
  const getHref = (key: string, url: string) => {
    if (key === 'email') {
      return url.includes('@') ? `mailto:${url}` : url;
    }
    if (key === 'whatsapp') {
      return url.startsWith('http') ? url : `https://wa.me/${url.replace(/\D/g, '')}`;
    }
    if (key === 'website') {
      return url.startsWith('http') ? url : `https://${url}`;
    }
    return url;
  };

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {Object.entries(socials).map(([key, social]) => {
        if (!social.enabled || !social.url) return null;
        
        let icon;
        switch (key) {
          case 'instagram':
            icon = <InstagramIcon className="h-6 w-6" />;
            break;
          case 'facebook':
            icon = <Facebook className="h-6 w-6" />;
            break;
          case 'whatsapp':
            icon = <WhatsAppIcon className="h-6 w-6" />;
            break;
          case 'x':
            icon = <XIcon className="h-6 w-6" />;
            break;
          case 'tiktok':
            icon = <TiktokIcon className="h-6 w-6" />;
            break;
          case 'telegram':
            icon = <TelegramIcon className="h-6 w-6" />;
            break;
          case 'email':
            icon = <Mail className="h-6 w-6" />;
            break;
          case 'website':
            icon = <Globe className="h-6 w-6" />;
            break;
          default:
            return null;
        }

        return (
          <a 
            key={key}
            href={getHref(key, social.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label={`${key} link`}
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}; 