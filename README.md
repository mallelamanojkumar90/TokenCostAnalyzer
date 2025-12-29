# 🎯 Token Cost Analyzer

A powerful React-based application that helps developers understand and optimize the financial impact of their AI prompts. Visualize token usage, compare costs across different LLM models, and learn prompt engineering best practices.

![Token Cost Analyzer](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📊 Core Functionality

- **Real-time Token Estimation**: Accurate token counting using `gpt-tokenizer`
- **Multi-Model Cost Comparison**: Compare costs across GPT-4, GPT-3.5-turbo, Claude Sonnet, and Claude Haiku
- **Interactive Visualizations**: Beautiful charts powered by Recharts
  - Bar charts for cost breakdown
  - Pie charts for cost distribution
  - Line charts for usage projections

### 🔍 Prompt Analysis

- **Issue Detection**: Automatically identifies:
  - Excessive repetition
  - Unnecessary verbosity
  - Large token counts
  - Cost warnings
- **Optimization Suggestions**: AI-powered recommendations to reduce token usage
- **Severity Levels**: Color-coded warnings (low, medium, high)

### 💰 Cost Projections

- **Usage Frequency Selector**: Project costs at different usage levels (10-1000 requests/day)
- **Monthly & Yearly Estimates**: See long-term cost implications
- **Savings Calculator**: Compare potential savings across models

### 📚 Educational Content

- **Good vs Bad Examples**: Learn from 10+ curated prompt examples
- **Best Practices**: Built-in tips for effective prompt engineering
- **Interactive Learning**: Copy and test examples instantly

### 💾 Data Management

- **Prompt History**: Save and manage multiple prompts
- **Comparison Mode**: Select and compare prompts side-by-side
- **Local Storage**: Automatic persistence of your data
- **Export Options**: Download as JSON, PNG, or PDF

### 🎨 User Experience

- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Smooth Animations**: Polished micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the repository**

   ```bash
   cd TokenCostAnalyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 📖 Usage Guide

### Analyzing a Prompt

1. **Enter Your Prompt**: Type or paste your prompt in the text area
2. **View Token Count**: See real-time token estimation as you type
3. **Review Analysis**: Check for issues and optimization suggestions
4. **Compare Costs**: See cost breakdown across all supported models
5. **Save for Later**: Click "Save Prompt" to add to history

### Comparing Multiple Prompts

1. **Save Prompts**: Save multiple prompts to your history
2. **Select Prompts**: Check the boxes next to prompts you want to compare
3. **View Comparison**: See side-by-side cost comparisons

### Projecting Usage Costs

1. **Select Frequency**: Choose your expected daily usage (10-1000 requests/day)
2. **View Projections**: See monthly and yearly cost estimates
3. **Identify Savings**: Compare costs across models to find the best option

### Learning from Examples

1. **Browse Examples**: View curated good vs bad prompt examples
2. **Filter by Type**: Show only good or bad examples
3. **Use Examples**: Click "Use This Example" to test it yourself
4. **Copy Examples**: Copy examples to your clipboard

### Exporting Results

1. **JSON Export**: Download all data for programmatic use
2. **PNG Export**: Save a high-quality screenshot
3. **PDF Export**: Generate a comprehensive PDF report

## 🎨 Model Pricing

The application includes pricing for the following models:

| Model         | Input (per 1K tokens) | Output (per 1K tokens) | Provider  |
| ------------- | --------------------- | ---------------------- | --------- |
| GPT-4         | $0.03                 | $0.06                  | OpenAI    |
| GPT-3.5-turbo | $0.0015               | $0.002                 | OpenAI    |
| Claude Sonnet | $0.003                | $0.015                 | Anthropic |
| Claude Haiku  | $0.00025              | $0.00125               | Anthropic |

_Note: Prices are accurate as of December 2025. Always verify current pricing with providers._

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Tokenization**: gpt-tokenizer
- **PDF Generation**: jsPDF
- **Screenshot**: html2canvas
- **Icons**: Lucide React

## 📁 Project Structure

```
TokenCostAnalyzer/
├── src/
│   ├── components/          # React components
│   │   ├── PromptInput.tsx
│   │   ├── TokenStats.tsx
│   │   ├── CostComparison.tsx
│   │   ├── PromptAnalysis.tsx
│   │   ├── UsageProjection.tsx
│   │   ├── PromptHistory.tsx
│   │   ├── ExamplesSection.tsx
│   │   └── ExportSection.tsx
│   ├── data/                # Static data
│   │   └── examples.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── constants.ts
│   │   └── tokenUtils.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Key Features Explained

### Token Estimation

Uses the `gpt-tokenizer` library for accurate GPT-style tokenization. Falls back to a simple character-based estimation (1 token ≈ 4 characters) if the tokenizer fails.

### Cost Calculation

- Input tokens and output tokens are calculated separately
- Output tokens are estimated at 1.75x input tokens (typical for conversational responses)
- Costs are calculated per model using current pricing

### Issue Detection

The analyzer checks for:

- **Repetition**: Words appearing more than 2 times
- **Verbosity**: Sentences averaging more than 25 words
- **Token Count**: Prompts exceeding 1000 tokens
- **Cost Warnings**: Prompts with high estimated costs

### Optimization Suggestions

Automatically suggests improvements like:

- Removing filler words ("very", "really", "just")
- Replacing wordy phrases ("in order to" → "to")
- Using active voice
- Breaking long prompts into smaller chunks

## 🌙 Dark Mode

Dark mode is automatically enabled based on:

1. User's saved preference (localStorage)
2. System preference (prefers-color-scheme)

Toggle dark mode using the moon/sun icon in the header.

## 💡 Tips for Best Results

1. **Be Specific**: Clear, specific prompts are more efficient
2. **Use Structure**: Bullet points and formatting help reduce tokens
3. **Avoid Repetition**: Don't repeat context or instructions
4. **Test Variations**: Try different phrasings to find the most efficient version
5. **Monitor Costs**: Regularly check your usage projections

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Token pricing data from OpenAI and Anthropic
- Icons from Lucide React
- Charts powered by Recharts
- Tokenization by gpt-tokenizer

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ to help developers optimize their AI costs**
