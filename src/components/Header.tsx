"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import UsageGuide from './UsageGuide';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUsage, setShowUsage] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // メニューを閉じるときは、使い方の表示もリセット
    if (isMenuOpen) {
      setShowUsage(false);
    }
  };

  const handleShowUsage = () => {
    setShowUsage(true);
  };

  const handleBackToMenu = () => {
    setShowUsage(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/whomvp-logo.svg"
              alt="WhoMVP Logo"
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>
        <button onClick={toggleMenu} className={styles.menuButton}>
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
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>
      {isMenuOpen && (
        <div className={styles.menuOverlay} onClick={toggleMenu}>
          <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={toggleMenu} className={styles.closeButton}>
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            {showUsage ? (
              <div>
                <button onClick={handleBackToMenu} className={styles.backButton}>
                  &larr; 戻る
                </button>
                <UsageGuide />
              </div>
            ) : (
              <nav>
                <ul>
                  <li>
                    <button onClick={handleShowUsage} className={styles.menuItemButton}>
                      使い方
                    </button>
                  </li>
                  {/* 他にメニュー項目があればここに追加 */}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
