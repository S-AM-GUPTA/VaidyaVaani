import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone } from 'lucide-react';
import Logo from '../Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Emergency & Medical Helpline Strip */}
      <div className="border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>National Medical Emergency Helpline: <strong className="text-white font-mono">108 / 102</strong> (Toll-Free, 24/7 across India)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>AI-Assisted Health Companion • Human Review Recommended</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo to="/" theme="dark" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An AI-assisted health record companion helping people understand handwritten doctor prescriptions, laboratory reports, and medication safety in their preferred language.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Designed for patients, families, and caregivers across India.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">Prescription Reader</Link>
              </li>
              <li>
                <Link to="/lab-decoder" className="hover:text-emerald-400 transition-colors">Lab Report Decoder</Link>
              </li>
              <li>
                <Link to="/safety-matrix" className="hover:text-emerald-400 transition-colors">Medication Safety</Link>
              </li>
              <li>
                <Link to="/regional-care" className="hover:text-emerald-400 transition-colors">Regional Language Audio</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Trust */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
              </li>
              <li>
                <a href="#technology" className="hover:text-emerald-400 transition-colors">Technology & OCR</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy & Security</a>
              </li>
              <li>
                <Link to="/annotation" className="hover:text-emerald-400 transition-colors">Annotation Studio</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Create Patient Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Health Vault</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">Profile & Settings</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-slate-500 text-[11px] leading-relaxed flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} VaidyaVaani. All rights reserved. 
          </p>
          <p className="max-w-xl text-center md:text-right text-slate-500">
            <strong>Important Medical Notice:</strong> VaidyaVaani is an AI-assisted informational tool and does not provide medical diagnoses or replace professional medical consultations. Always verify prescription details with your pharmacist or doctor.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
