'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { Youtube, Twitter, Instagram, Linkedin } from 'lucide-react';
import Button from './ui/Button';

export default function Footer() {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Templates', href: '/templates' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Updates', href: '#updates' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Tutorials', href: '#tutorials' },
      { name: 'Blog', href: '#blog' },
      { name: 'Support', href: '#support' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
      { name: 'Partners', href: '#partners' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Licenses', href: '#licenses' },
    ],
  };

  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: '#youtube' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
  ];

  return (
    <footer className={`${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <h3 className="font-bold">Frameflow</h3>
            </Link>
            <p className="text-body mb-6 opacity-80">
              Create stunning videos in minutes with our powerful online video editor. 
              No experience needed.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDark
                        ? 'bg-neutral-800 hover:bg-turquoise hover:text-neutral-900'
                        : 'bg-neutral-200 hover:bg-turquoise hover:text-neutral-900'
                    }`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-body opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-body opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-body opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-body opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={`p-8 rounded-xl mb-12 border-2 ${
          isDark ? 'bg-neutral-900 border-white/20' : 'bg-white border-black/20'
        }`}>
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="mb-3">Stay Updated</h4>
            <p className="text-body opacity-70 mb-6">
              Get the latest updates, tips, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-6 py-3 rounded-xl text-body font-semibold border-2 transition-all ${
                  isDark
                    ? 'bg-neutral-800 border-white/20 focus:border-turquoise text-white'
                    : 'bg-white border-black/20 focus:border-turquoise text-black'
                }`}
              />
              <Button
                type="submit"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t-2 ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body opacity-60">
              © {currentYear} Frameflow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#status" className="text-body opacity-60 hover:opacity-100 transition-opacity">
                Status
              </Link>
              <Link href="#sitemap" className="text-body opacity-60 hover:opacity-100 transition-opacity">
                Sitemap
              </Link>
              <Link href="#accessibility" className="text-body opacity-60 hover:opacity-100 transition-opacity">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}