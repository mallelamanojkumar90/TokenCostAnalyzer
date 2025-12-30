import { useState } from 'react';
import { Download, FileJson, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Prompt } from '../types';
import { getCostBreakdown, exportAsJSON } from '../utils/tokenUtils';

interface ExportSectionProps {
  currentPrompt: string;
  currentTokens: number;
  currentOutputTokens: number;
  prompts: Prompt[];
  selectedPrompts: string[];
}

export default function ExportSection({
  currentPrompt,
  currentTokens,
  currentOutputTokens,
  prompts,
  selectedPrompts
}: ExportSectionProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      currentPrompt: currentPrompt ? {
        text: currentPrompt,
        tokens: currentTokens,
        estimatedOutputTokens: currentOutputTokens,
        costs: getCostBreakdown(currentTokens, currentOutputTokens)
      } : null,
      savedPrompts: prompts.map(p => ({
        ...p,
        costs: getCostBreakdown(p.tokens, p.estimatedOutputTokens)
      })),
      selectedPrompts: prompts.filter(p => selectedPrompts.includes(p.id))
    };

    exportAsJSON(data, `token-analysis-${Date.now()}.json`);
  };

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      const element = document.querySelector('main');
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `token-analysis-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = document.querySelector('main');
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        scale: 2
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`token-analysis-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export as PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="card-premium p-6 fade-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Download className="w-6 h-6 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
          Intelligence Export
        </h2>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-10 font-medium">
        Preserve your configurations and findings for audit or collaboration.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Export as JSON */}
        <button
          onClick={handleExportJSON}
          className="group relative p-8 card-premium bg-white/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-500 hover:scale-[1.05] border-t-2 border-t-blue-500"
        >
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <FileJson className="w-10 h-10 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
            JSON Matrix
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
            Raw Data Object
          </p>
        </button>

        {/* Export as PNG */}
        <button
          onClick={handleExportPNG}
          disabled={exporting}
          className="group relative p-8 card-premium bg-white/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-500 hover:scale-[1.05] border-t-2 border-t-purple-500 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <ImageIcon className="w-10 h-10 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
            Snapshot PNG
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
            High-Res Visual
          </p>
        </button>

        {/* Export as PDF */}
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="group relative p-8 card-premium bg-white/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-500 hover:scale-[1.05] border-t-2 border-t-emerald-500 disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <Download className="w-10 h-10 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500" />
          <h3 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
            Dossier PDF
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
            Structured Report
          </p>
        </button>
      </div>

      {exporting && (
        <div className="mt-10 p-4 bg-slate-900 dark:bg-slate-100 rounded-2xl flex items-center justify-center space-x-3 text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-widest animate-pulse">
          <div className="w-4 h-4 border-2 border-white/20 dark:border-slate-900/20 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
          <span>Synchronizing Assets...</span>
        </div>
      )}
    </div>
  );
}
