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
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
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
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
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
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export Results
        </h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Save your analysis for future reference or sharing
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export as JSON */}
        <button
          onClick={handleExportJSON}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-blue-300 dark:border-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <FileJson className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export as JSON
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download all data in JSON format for programmatic use
          </p>
        </button>

        {/* Export as PNG */}
        <button
          onClick={handleExportPNG}
          disabled={exporting}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-2 border-purple-300 dark:border-purple-700 hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ImageIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export as PNG
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exporting ? 'Generating...' : 'Save as high-quality image'}
          </p>
        </button>

        {/* Export as PDF */}
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg border-2 border-pink-300 dark:border-pink-700 hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Download className="w-12 h-12 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export as PDF
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exporting ? 'Generating...' : 'Create a PDF report'}
          </p>
        </button>
      </div>

      {exporting && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            ⏳ Generating export... This may take a few seconds.
          </p>
        </div>
      )}
    </div>
  );
}
