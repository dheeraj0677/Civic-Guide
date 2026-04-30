# Matdata Marg (Civic Guide) 🇮🇳

**Matdata Marg** (meaning "Voter's Path") is a premium, interactive web application designed to educate citizens on the democratic election process in India. Powered by **Google Gemini**, it serves as a comprehensive guide for first-time voters and anyone interested in understanding the world's largest democracy.

![Matdata Marg Banner](assets/india-map-vibrant.png)

## 🌟 Key Features

- **🤖 AI VoteBot**: An intelligent assistant powered by `gemini-1.5-flash` to answer all your queries about Indian elections, ECI, and the constitutional framework.
- **⏳ Interactive Timeline**: A step-by-step walkthrough of the election cycle, from ECI announcements to the swearing-in ceremony.
- **📊 Real-time Stats**: Dynamic, animated statistics reflecting the scale of Indian democracy (96cr+ voters, 543 seats, etc.).
- **📚 Election Glossary**: Quick definitions of key terms like EVM, VVPAT, MCC, and NOTA.
- **🗺️ Process Flowchart**: A visual representation of how a single vote travels from a polling booth to the final ECI result.
- **📰 News & Updates**: Stay informed with the latest updates from the Election Commission of India.
- **📍 ECI Headquarters**: Integrated Google Maps view of the Nirvachan Sadan in New Delhi.

## 🚀 Tech Stack

- **Frontend**: React 19 (Vite)
- **Styling**: Vanilla CSS (Custom Design System)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **API**: Google Gemini 1.5 Flash
- **Icons**: Material Symbols

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/civic-guide.git
   cd civic-guide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📸 Screenshots

*(Add screenshots here after running the app)*

## ⚖️ Disclaimer

This application is for educational purposes only. Data is sourced from the official [Election Commission of India](https://eci.gov.in/) portal.

---

Built with ❤️ for the Google Solution Challenge / Prompt Wars.
