'use client';

import { useState, ReactNode, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  content?: ReactNode;
  href?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const TabNavigation = ({ tabs, defaultTab, className }: TabNavigationProps) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className={className}>
      {/* Tab Navigasyon Butonları */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          tab.href ? (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                'flex-1 py-4 px-2 text-sm md:text-base font-medium transition-all duration-200 relative',
                pathname === tab.href
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-selected={pathname === tab.href}
              role="tab"
              tabIndex={0}
            >
              {tab.label}
              {pathname === tab.href && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          ) : (
            <button
              key={tab.id}
              className={cn(
                'flex-1 py-4 px-2 text-sm md:text-base font-medium transition-all duration-200 relative',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              onClick={() => handleTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTabChange(tab.id);
                }
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          )
        ))}
      </div>

      {/* Tab İçeriği */}
      <div>
        {tabs.map((tab) => (
          tab.content && (
            <div 
              key={tab.id} 
              className={cn(
                'transition-opacity duration-300',
                activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0'
              )}
              role="tabpanel"
              aria-labelledby={tab.id}
            >
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default TabNavigation; 