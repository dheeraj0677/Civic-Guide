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

## 🏆 Prompt Wars Submission Details

### Chosen Vertical
**Civic Guide / Election Assistant**
This project focuses on educating citizens and first-time voters about the Indian democratic process, making electoral information accessible, engaging, and easy to understand.

### Approach and Logic
The application employs a dual-layered approach to civic education:
1. **Structured Visual Learning**: Static, highly visual components (Timeline, Flowchart, Glossary, Statistics) break down complex procedures into easily digestible chunks.
2. **Dynamic Conversational Learning**: The AI-powered "VoteBot" handles personalized, open-ended queries. 
The logic strictly binds the AI's domain context via its system prompt. By instructing the model to *only* answer questions related to Indian elections, the ECI, and the constitutional framework, we ensure responsible AI usage and prevent hallucinations or off-topic discussions.

### How the Solution Works
- **Frontend Architecture**: Built as a Single Page Application (SPA) using React 19 and Vite, ensuring fast load times and a responsive UI.
- **Styling**: Utilizes a custom, premium design system featuring glassmorphism, fluid animations, and a vibrant color palette tailored to an Indian civic theme.
- **AI Integration**: Integrates the `gemini-1.5-flash` model via the `@google/generative-ai` SDK directly in the browser. User queries are prepended with a strong system prompt enforcing the civic domain before being sent to the Gemini API.
- **Interactive Elements**: Features like the Intersection Observer-driven animated statistics and interactive timeline enhance user engagement.

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


