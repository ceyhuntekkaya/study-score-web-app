"use client";
import React, { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Globe, User, LogOut, Settings, HelpCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";
import Link from "next/link";
// import Image from "next/image";
// import logo from "@/assets/logo.png";

export default function HeaderSidebar() {
  const { user, logout } = useAuth();
  const { getPathByRole } = useAuthContext();
  const togglerRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: "tr", name: "Türkçe" },
    { code: "en", name: "English" },
  ];

  // Menu'yu kapatma fonksiyonu
  const closeMenu = () => {
    if (togglerRef.current) {
      togglerRef.current.checked = false;
    }
  };

  // Link tıklandığında menu'yu kapat
  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      {/* Hamburger Menu */}
      <div className="menu-wrap">
        <input type="checkbox" className="toggler" ref={togglerRef} />
        <div className="hamburger">
          <div></div>
        </div>
        <div className="menu">
          <div>
            <div>
              <ul>
                {/* Logo in Menu */}
                {/* <li className="menu-logo">
                  <Link
                    href={getPathByRole()}
                    className="flex items-center justify-center"
                    onClick={handleLinkClick}
                  >
                    <Image src={logo} alt="Logo" className="h-12 w-auto" />
                  </Link>
                </li> */}

                {/* User Info */}
                <li className="menu-user-info">
                  <div className="flex items-center justify-center space-x-2 py-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                  </div>
                </li>

                {/* LEARNER Navigation - Only what's in header */}
                {user?.roleSet.includes("LEARNER") && (
                  <>
                    <li>
                      <Link href={getPathByRole()} onClick={handleLinkClick}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/learner/ai"
                        onClick={handleLinkClick}
                        prefetch={true}
                      >
                        Chat with AI
                      </Link>
                    </li>
                  </>
                )}

                {/* ADMIN Navigation - Only what's in header */}
                {user?.roleSet.includes("ADMIN") && (
                  <>
                    <li>
                      <Link href="/admin/course" onClick={handleLinkClick}>
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/exam" onClick={handleLinkClick}>
                        Exams
                      </Link>
                    </li>
                  </>
                )}

                {/* Language Selector in Menu */}
                <li className="menu-divider">
                  <hr className="my-2 border-gray-300" />
                </li>
                <li className="menu-section-title">
                  <div className="flex items-center justify-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Dil Seçimi</span>
                  </div>
                </li>
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <Link
                      href="#"
                      className="language-option"
                      onClick={handleLinkClick}
                    >
                      {lang.name}
                    </Link>
                  </li>
                ))}

                {/* Profile Options in Menu - Only what's in header */}
                <li className="menu-divider">
                  <hr className="my-2 border-gray-300" />
                </li>
                <li>
                  <Link
                    href="#"
                    className="profile-option flex items-center"
                    onClick={handleLinkClick}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="profile-option flex items-center"
                    onClick={handleLinkClick}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Yardım
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      closeMenu();
                    }}
                    className="logout-option flex items-center text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
