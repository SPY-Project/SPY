import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {

  const footerSections = {
    'Our offerings': [
      'Holidays',
      'Visa',
      'Forex',
      'Hotels',
      'Flights'
    ],
    'Popular destinations': [
      'Dubai',
      'Bali',
      'Thailand',
      'Singapore',
      'Malaysia'
    ],
    'Our Specials': [
      'Featured Experience',
      'Group Tours',
      'Backpackers Club',
      'Offline Events'
    ],
    'Company': [
      'About Us',
      'Careers',
      'SPY Blog',
      'Partner Portal',
      'Accreditations'
    ],
    'More': [
      'Investor Relations',
      'Forex',
      'FAQs',
      'Domestic Holidays'
    ]
  };

  return (
    <footer className="bg-white pt-8">

      {/* Middle: Links and Contact */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">

          {/* Footer Link Sections - RESTORED */}
          {Object.entries(footerSections).map(([title, links], i) => (
            <div key={title} className="md:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-purple-700 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="md:col-span-1 flex flex-col justify-right">
            <div className="bg-purple-100 rounded-lg p-4 mb-4 text-center">
              <div className="text-purple-800 font-semibold text-xs mb-1">Need help? Call us</div>
              <div className="text-purple-900 font-bold text-base">+91-98xxx64641</div>
            </div>
            <div className="text-xs text-right mb-2">
              <div className="font-semibold text-gray-900">Email</div>
              <div className="text-gray-700">contactus@spy.com</div>
            </div>
            <div className="text-xs text-right">
              {/* <div className="font-semibold text-gray-900">Address</div>
              <p>Have to decide to add or not</p> */}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-purple-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

          {/* Logo Section */}
          <div className="flex flex-col items-center gap-2 mb-4 md:mb-0">
            <span className="text-white text-2xl font-bold">SPY</span>
            <span className="text-purple-200 text-sm font-medium tracking-wide">
              Socho, Samjho , Yatra Karo!!
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"><Facebook className="w-5 h-5 text-purple-700" /></a>
            <a className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"><Instagram className="w-5 h-5 text-purple-700" /></a>
            <a className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"><Linkedin className="w-5 h-5 text-purple-700" /></a>
            <a className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"><Youtube className="w-5 h-5 text-purple-700" /></a>
          </div>

          {/* Legal Links */}
          <div className="flex space-x-6 text-xs text-purple-100">
            <a className="hover:text-white">Privacy policy</a>
            <a className="hover:text-white">Legal notice</a>
            <a className="hover:text-white">Accessibility</a>
          </div>
        </div>

        <div className="text-center text-xs text-purple-200 mt-4">
          © 2025 SPY Travel Technologies (P) Ltd. All rights reserved.
        </div>
      </div>

    </footer>
  );
};

export default Footer;
