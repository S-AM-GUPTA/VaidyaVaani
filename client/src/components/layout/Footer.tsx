import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, ArrowUpRight, HeartHandshake } from 'lucide-react';
import Logo from '../Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 text-xs border-t border-slate-800/80">
      
      {/* Emergency & Medical Assistance Strip */}
      <div className="border-b border-slate-800/60 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>National Medical Emergency: <strong className="text-white font-mono tracking-wider font-bold">108 / 102</strong> (24/7 Toll-Free)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>AI-Assisted Health Companion • Verification Required</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4 text-left">
            <Logo to="/" theme="dark" size="md" />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              An AI-assisted health record companion helping people understand difficult handwritten doctor prescriptions, laboratory reports, and medication safety in their regional language.
            </p>
            <div className="pt-2 flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
              <span>Engineered for patients and caregivers across India.</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Prescription Reader</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/lab-decoder" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Lab Report Decoder</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/safety-matrix" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Medication Safety</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/regional-care" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                  <span>Regional Audio Guide</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Trust */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</a>
              </li>
              <li>
                <a href="#technology" className="hover:text-emerald-400 transition-colors">Vision Pipeline</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy & Vault</a>
              </li>
              <li>
                <Link to="/annotation" className="hover:text-emerald-400 transition-colors">Annotation Studio</Link>
              </li>
            </ul>
          </div>

          {/* Account & Vault */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase font-mono">Patient Vault</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In to Vault</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Create Patient Account</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Health Dashboard</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">Family Records & SOS</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Medical Notice */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 text-slate-500 text-[11px] leading-relaxed flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono">
            © {new Date().getFullYear()} VaidyaVaani. All rights reserved.
          </p>
          <div className="max-w-xl text-center md:text-right bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-slate-400">
            <p>
              <strong className="text-slate-200">Clinical Disclaimer:</strong> VaidyaVaani is an AI-assisted interpretation companion and does not provide medical diagnoses or replace doctor consultations. Always confirm dosages with your prescribing physician or pharmacist.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
