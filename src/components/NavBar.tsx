import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Define a type for the navigation link objects.
// This enforces that each link in the array has a 'href' (string) and 'label' (string).
export interface LinkData {
  href: string;
  label: string;
}

// Define the props for the Navbar component using the LinkData interface.
export interface NavbarProps {
  links: LinkData[];
}

/**
 * A responsive navigation bar component.
 * It shows a full menu on medium and larger screens and a hamburger icon
 * that toggles a dropdown menu on smaller screens.
 * @param {NavbarProps} { links } The array of navigation links.
 */

export const Navbar: React.FC<NavbarProps> = ({ links }) => {
  // State to manage the visibility of the mobile menu.
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  // Early return for invalid data to prevent runtime errors.
  if (!Array.isArray(links) || links.length === 0) {
    console.error("Error: 'links' prop must be a non-empty array of LinkData.");
    return (
      <nav className="bg-gray-800 text-white p-4">
        Error: Invalid navigation data.
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white font-sans shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-100">AI Suite</h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {links.map((link: LinkData, index: number) => (
              <a
                key={index}
                href={link.href}
                className="text-lg text-gray-300 hover:text-white transition-colors duration-200 ease-in-out"
                onClick={(e) => {
                  if (!link.href) {
                    e.preventDefault();
                    console.error("Error: Link is missing 'href' property.");
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <a
                className="text-lg text-gray-300 hover:text-white transition-colors duration-200 ease-in-out"
                onClick={(e) => {
                  logout();
                  // Close the menu after a link is clicked
                  setIsOpen(false);
                }}
              >
                Logout
              </a>
            ) : (
              <a
                href="/login"
                className="text-lg text-gray-300 hover:text-white transition-colors duration-200 ease-in-out"
                onClick={(e) => {
                  // Close the menu after a link is clicked
                  setIsOpen(false);
                }}
              >
                Login
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white rounded-md p-2"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Conditionally Rendered) */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 pb-2 shadow-inner">
          {links.map((link: LinkData, index: number) => (
            <a
              key={index}
              href={link.href}
              className="block px-4 py-3 text-lg text-white hover:bg-gray-600 transition-colors duration-200"
              onClick={(e) => {
                if (!link.href) {
                  e.preventDefault();
                  console.error("Error: Link is missing 'href' property.");
                }
                // Close the menu after a link is clicked
                setIsOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <a
              className="block px-4 py-3 text-lg text-white hover:bg-gray-600 transition-colors duration-200"
              onClick={(e) => {
                logout();
                // Close the menu after a link is clicked
                setIsOpen(false);
              }}
            >
              Logout
            </a>
          ) : (
            <a
              href="/login"
              className="block px-4 py-3 text-lg text-white hover:bg-gray-600 transition-colors duration-200"
              onClick={(e) => {
                // Close the menu after a link is clicked
                setIsOpen(false);
              }}
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
};
