"use client";

import { useState, useCallback, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Tab {
  id: string;
  label: string;
  content?: ReactNode;
  href?: string;
}

interface HeaderProps {
  tabs?: Tab[];
  defaultTab?: string;
  showTabContent?: boolean;
}

const Header = ({
  tabs = [],
  defaultTab,
  showTabContent = false,
}: HeaderProps) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(
    defaultTab || (tabs.length > 0 ? tabs[0].id : "")
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white bg-opacity-90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 text-primary">
            <div className="relative w-36 h-10">
              <Image
                src="/logo.png"
                alt="PaneraTech Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#5B87B4]"
                >
                  <rect
                    x="4"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="14"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="4"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Main Navigation */}
          {tabs.length > 0 ? (
            <nav className="hidden md:flex items-center justify-center">
              <div className="flex border-0">
                {tabs.map((tab) =>
                  tab.href ? (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={cn(
                        "px-4 py-2 mx-1 rounded-lg text-sm md:text-base font-medium transition-all duration-200 relative",
                        pathname === tab.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                      aria-selected={pathname === tab.href}
                      role="tab"
                      tabIndex={0}
                    >
                      {tab.label}
                    </Link>
                  ) : (
                    <button
                      key={tab.id}
                      className={cn(
                        "px-4 py-2 mx-1 rounded-lg text-sm md:text-base font-medium transition-all duration-200 relative",
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                      onClick={() => handleTabChange(tab.id)}
                      aria-selected={activeTab === tab.id}
                      role="tab"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleTabChange(tab.id);
                        }
                      }}
                    >
                      {tab.label}
                    </button>
                  )
                )}
              </div>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center justify-center">
              <ul className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === "/"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/qr-template"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === "/qr-template"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    QR Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tags"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === "/tags"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Tags
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <button
            className="block md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle main menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${
                mobileMenuOpen ? "rotate-90" : ""
              }`}
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-300 transform"
          >
            <nav className="flex flex-col space-y-1 px-2">
              {tabs.length > 0 ? (
                tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href || "#"}
                    className={cn(
                      "px-4 py-3 rounded-lg transition-colors font-medium",
                      pathname === tab.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    {tab.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/"
                    className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === "/"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/qr-template"
                    className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === "/qr-template"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    QR Templates
                  </Link>
                  <Link
                    href="/tags"
                    className={`px-4 py-3 rounded-lg transition-colors font-medium ${
                      pathname === "/tags"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Tags
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Tab Content - Show if showTabContent is true */}
      {showTabContent && tabs.length > 0 && (
        <div className="container mx-auto max-w-screen-xl px-4 md:px-8 mt-4">
          {tabs.map(
            (tab) =>
              tab.content && (
                <div
                  key={tab.id}
                  className={cn(
                    "transition-opacity duration-300",
                    activeTab === tab.id
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  )}
                  role="tabpanel"
                  aria-labelledby={tab.id}
                >
                  {tab.content}
                </div>
              )
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
