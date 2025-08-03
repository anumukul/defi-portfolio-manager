# 🚀 DeFi Portfolio Optimizer

A professional-grade DeFi portfolio management application built with real 1inch Protocol integration for hackathon submission.

![DeFi Portfolio Optimizer](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-13-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![1inch](https://img.shields.io/badge/1inch-API-orange)

## 🌐 **Live Demo**
**Production URL**: [https://your-app.vercel.app](https://your-deployed-url.vercel.app)

## ✨ **Key Features**

### 💰 **Real Portfolio Management**
- Live portfolio tracking with $20,600+ demo portfolio
- Real-time token balance calculations
- 24h change tracking with dynamic color indicators
- Professional allocation percentages and performance metrics

### 🔄 **Working Token Swap Interface**
- **Real 1inch API integration** for live swap quotes
- Token selection: NEAR ↔ cUSDCv3 (and more)
- Live quote generation with exchange rates
- Professional swap execution flow
- Real-time price calculations

### 📊 **Live Analytics Dashboard**
- ETH price movement charts with real-time data
- Professional gradient charts with price indicators
- 24h High/Low tracking ($2696/$2600)
- Volume and Market Cap displays
- Updates every 10 seconds

### 📈 **Real-Time Price Tracker**
- Live token prices from 1inch API
- Multi-token support (USDC, USDT, WBTC)
- 30-second price updates
- Professional price formatting

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS with custom gradients
- **APIs**: 1inch Protocol APIs for real DeFi data
- **Deployment**: Vercel with automatic CI/CD
- **Architecture**: Modern serverless with API routes

## 🚀 **Installation & Setup**

```bash
# Clone the repository
git clone https://github.com/anumukul456/defi-portfolio-optimizer.git

# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_1INCH_API_KEY=Q2K6ZXcOFktCtkeck8XNsYKGjWzFleSX" > .env.local

# Run development server
npm run dev

# Open http://localhost:3000
