import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- INDIAN ELECTION DATA ---

const TIMELINE_STEPS = [
  { id: 1, title: "Election Commission Announcement", desc: "EC issues election schedule & Model Code of Conduct kicks in", icon: "campaign" },
  { id: 2, title: "Constituency Delimitation", desc: "Boundaries drawn by Delimitation Commission", icon: "map" },
  { id: 3, title: "Voter List Finalization", desc: "Electoral rolls updated, EPIC cards issued", icon: "how_to_reg" },
  { id: 4, title: "Nomination Filing", desc: "Candidates file Form 2B with Returning Officer", icon: "description" },
  { id: 5, title: "Scrutiny & Withdrawal", desc: "Nomination scrutiny; last date for withdrawal", icon: "fact_check" },
  { id: 6, title: "Campaign Period", desc: "Political rallies, manifestos, Model Code of Conduct enforced", icon: "record_voice_over" },
  { id: 7, title: "Voting Day (EVM)", desc: "Voters cast ballot via EVM + VVPAT at polling booths", icon: "how_to_vote" },
  { id: 8, title: "Vote Counting", desc: "Counting begins at Counting Centers, round-by-round", icon: "calculate" },
  { id: 9, title: "Result Declaration", desc: "Winning candidates declared, certificates issued", icon: "emoji_events" },
  { id: 10, title: "Oath & Swearing In", desc: "Winners take oath, PM/CM formation, new government", icon: "account_balance" }
];

const GLOSSARY = [
  { term: "EVM", def: "Electronic Voting Machine: A device used to cast and count votes electronically, ensuring faster and more accurate results compared to paper ballots." },
  { term: "VVPAT", def: "Voter Verifiable Paper Audit Trail: An independent verification system for EVMs that allows voters to verify that their vote was cast correctly via a printed paper slip." },
  { term: "EPIC", def: "Elector's Photo Identity Card: The official voter ID card issued by the Election Commission of India to all eligible voters." },
  { term: "MCC", def: "Model Code of Conduct: A set of guidelines issued by the ECI to regulate political parties and candidates prior to elections, ensuring free and fair polling." },
  { term: "Delimitation", def: "The act of redrawing the boundaries of an assembly or Lok Sabha constituency to reflect changes in population, based on the latest census." },
  { term: "Lok Sabha vs Rajya Sabha", def: "Lok Sabha (House of the People) members are directly elected by the public. Rajya Sabha (Council of States) members are elected by the elected members of State Legislative Assemblies." },
  { term: "Hung Parliament", def: "A situation where no single political party or pre-existing coalition achieves an absolute majority of seats in the parliament." },
  { term: "Anti-Defection Law", def: "A law intended to prevent elected MLAs and MPs from changing parties after being elected, to ensure government stability." },
  { term: "NOTA", def: "None of the Above: A ballot option allowing voters to officially register a vote of rejection for all candidates running in an election." },
  { term: "Whip", def: "A written order that party members must be present for an important vote, or that they must vote only in a particular way." }
];

const FLOW_NODES = [
  { label: "Voter", icon: "person" },
  { label: "Polling Booth", icon: "storefront" },
  { label: "EVM Recording", icon: "dns" },
  { label: "VVPAT Slip", icon: "receipt" },
  { label: "Constituency Count", icon: "group_work" },
  { label: "State Tally", icon: "poll" },
  { label: "ECI Result", icon: "flag" }
];

const FAQS = [
  { q: "How do I register as a voter?", a: "You can register online through the Voter Service Portal (voters.eci.gov.in) or by using the Voter Helpline App. You need to be 18 years old and a citizen of India." },
  { q: "What documents are needed for voting?", a: "While the EPIC (Voter ID) card is preferred, you can also use 12 other alternative documents like Aadhaar Card, PAN Card, Driving License, or Passport if your name is in the electoral roll." },
  { q: "Can an NRI vote?", a: "Yes, NRIs can register as 'Overseas Voters'. However, they must be physically present at their polling station in India on the day of voting to cast their ballot." },
  { q: "What is the Model Code of Conduct?", a: "The MCC is a set of guidelines for political parties and candidates during elections, ensuring they don't use government resources or make provocative statements." }
];

const ECI_NEWS = [
  { title: "ECI announces General Elections 2024", date: "March 16, 2024", category: "Announcement", icon: "event_available" },
  { title: "New Voter Helpline App Version Released", date: "Feb 10, 2024", category: "Technology", icon: "smartphone" },
  { title: "SVEEP awareness drive launched across 28 states", date: "Jan 25, 2024", category: "Campaign", icon: "groups" },
  { title: "ECI hosts International Election Visitor Programme", date: "May 05, 2024", category: "International", icon: "public" }
];

// --- GEMINI INTEGRATION ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function MatdataMarg() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Namaste! I am VoteBot, your AI guide to the Indian election process powered by Google's Gemma. Ask me anything about Indian democracy, the ECI, EVMs, or how elections work." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [activeGlossary, setActiveGlossary] = useState(null);
  
  // Intersection Observer Stats
  const [stats, setStats] = useState({ voters: 0, seats: 0, states: 0, booths: 0, year: 0 });
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);
  
  const messagesEndRef = useRef(null);

  // Stats Animation Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTime;
        const duration = 2500;
        
        const animate = (time) => {
          if (!startTime) startTime = time;
          const progress = Math.min((time - startTime) / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          setStats({
            voters: Math.floor(easeOut * 96),
            seats: Math.floor(easeOut * 543),
            states: Math.floor(easeOut * 36), // 28 states + 8 UTs
            booths: +(easeOut * 10.5).toFixed(1),
            year: Math.floor(easeOut * 1950)
          });
          
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.2 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Chat Submit using Google Gemini
  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const prompt = `You are VoteBot, an expert on Indian elections and democracy. Answer only questions related to Indian elections, ECI, Lok Sabha, Rajya Sabha, EVMs, constituency system, or Indian constitutional democracy. Keep answers concise (under 120 words), factual, and use simple language suitable for first-time voters. Do not discuss other countries.\n\nUser: ${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "VoteBot is currently experiencing connectivity issues. Please check your API key and internet connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Timeline Click
  const handleTimelineClick = (step) => {
    setActiveStep(step.id);
    handleSendMessage(`Tell me about ${step.title} in the context of Indian elections.`);
  };

  // Typewriter Effect Component
  const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
      setDisplayedText('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }, [text]);
    
    return <span>{displayedText}</span>;
  };

  return (
    <div className="matdata-app">
      <style>{`
        /* --- DESIGN SYSTEM & FONTS --- */
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        :root {
          --bg-main: #FFFFFF;
          --bg-subtle: #F8FAFC;
          --bg-card: #FFFFFF;
          --saffron: #F97316;
          --saffron-subtle: #FFF7ED;
          --india-green: #059669;
          --green-subtle: #ECFDF5;
          --text-main: #1E293B;
          --text-muted: #64748B;
          --google-blue: #2563EB;
          --border-light: #E2E8F0;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --glass-bg: rgba(255, 255, 255, 0.7);
          --glass-border: rgba(255, 255, 255, 0.3);
          
          --font-heading: 'Noto Serif', serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          background-color: var(--bg-main);
          color: var(--text-main);
          font-family: var(--font-body);
          overflow-x: hidden;
          line-height: 1.6;
          position: relative;
        }

        .map-bg {
          position: fixed;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 95%;
          height: 95%;
          background-image: url('/assets/india-map-vibrant.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          opacity: 0.12;
          pointer-events: none;
          z-index: -1;
          filter: saturate(1.2) contrast(1.1);
        }

        /* Nav Bar */
        .top-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 2rem;
          box-shadow: var(--shadow-sm);
        }
        .nav-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex; align-items: center; gap: 12px;
        }
        .ashoka-chakra { width: 32px; height: 32px; animation: spin 20s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a {
          color: var(--text-muted); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: all 0.2s;
        }
        .nav-links a:hover { color: var(--saffron); }

        /* Ticker */
        .ticker-wrap {
          width: 100%; background: var(--saffron-subtle); border-bottom: 1px solid var(--border-light);
          padding: 10px 0; overflow: hidden; white-space: nowrap;
        }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .ticker-content {
          font-family: var(--font-mono); font-size: 0.85rem; color: var(--saffron);
          animation: ticker 35s linear infinite; display: inline-block; font-weight: 600;
        }
        .ticker-dot { color: var(--india-green); margin: 0 15px; }

        /* Hero */
        .hero {
          text-align: center; padding: 10rem 2rem; position: relative;
          background: transparent;
        }
        .hero-title {
          font-family: var(--font-heading); font-size: 72px; font-weight: 900; margin-bottom: 1.5rem;
          color: var(--text-main); letter-spacing: -0.04em;
          text-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .hero-subtitle { font-size: 1.5rem; color: var(--text-muted); max-width: 800px; margin: 0 auto; font-weight: 500; }

        /* Layout */
        .main-content {
          display: flex; gap: 3rem; max-width: 1400px; margin: 0 auto; padding: 4rem 2rem;
        }

        /* Timeline (Left) */
        .timeline { width: 45%; display: flex; flex-direction: column; gap: 1.5rem; position: relative; }
        .timeline::before {
          content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 2px;
          background: var(--border-light); z-index: 0;
        }
        
        .step-card {
          position: relative; z-index: 1; margin-left: 56px; padding: 1.75rem;
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          backdrop-filter: blur(8px);
          border-radius: 20px; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: var(--shadow-md);
        }
        .step-card:hover { transform: translateX(8px); border-color: var(--saffron); box-shadow: var(--shadow-md); }
        .step-card.active { border-color: var(--saffron); box-shadow: 0 0 0 2px var(--saffron-subtle), var(--shadow-md); }
        
        .step-dot {
          position: absolute; left: -41px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; background: white; border: 3px solid var(--border-light);
          border-radius: 50%; transition: all 0.3s;
        }
        .step-card.active .step-dot { border-color: var(--saffron); background: var(--saffron); }
        
        .step-header { display: flex; align-items: center; gap: 12px; margin-bottom: 0.75rem; }
        .step-header .material-icons { color: var(--saffron); font-size: 24px; }
        .step-num { font-family: var(--font-mono); color: var(--text-muted); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
        .step-title { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
        .step-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; }

        /* AI Panel (Right) */
        .ai-panel {
          width: 55%; background: var(--glass-bg); border: 1px solid var(--glass-border);
          backdrop-filter: blur(12px);
          border-radius: 24px; display: flex; flex-direction: column; height: 800px;
          position: sticky; top: 120px; overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .ai-header {
          padding: 1.25rem 1.5rem; background: #FFFFFF; border-bottom: 1px solid var(--border-light);
          display: flex; align-items: center; gap: 12px;
        }
        .gemini-icon { color: var(--google-blue); font-size: 28px; }
        .ai-title { font-family: var(--font-heading); font-weight: 700; font-size: 1.1rem; color: var(--text-main); }
        
        .chat-area { flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; background: #FBFCFE; }
        .msg { max-width: 85%; padding: 1rem 1.25rem; border-radius: 16px; line-height: 1.6; font-size: 0.95rem; }
        .msg-user { align-self: flex-end; background: var(--google-blue); color: #FFF; border-bottom-right-radius: 4px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .msg-ai { align-self: flex-start; background: #FFF; color: var(--text-main); border: 1px solid var(--border-light); border-bottom-left-radius: 4px; box-shadow: var(--shadow-sm); }
        
        .typing { display: flex; gap: 5px; padding: 1rem; }
        .dot { width: 8px; height: 8px; background: var(--border-light); border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        .input-area { padding: 1.5rem; border-top: 1px solid var(--border-light); background: #FFF; }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1.25rem; }
        .chip {
          background: #F1F5F9; border: 1px solid transparent; color: var(--text-muted);
          padding: 8px 16px; border-radius: 100px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .chip:hover { background: var(--saffron-subtle); color: var(--saffron); border-color: var(--saffron); }
        
        form { display: flex; gap: 12px; }
        input {
          flex: 1; background: #F8FAFC; border: 1px solid var(--border-light); color: var(--text-main);
          padding: 12px 20px; border-radius: 100px; font-family: var(--font-body); outline: none; font-size: 0.95rem; transition: all 0.2s;
        }
        input:focus { border-color: var(--google-blue); background: #FFF; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        button[type="submit"] {
          background: var(--google-blue); border: none; width: 48px; height: 48px; border-radius: 50%;
          color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        button[type="submit"]:hover { transform: scale(1.05); background: #1D4ED8; }

        /* Sections */
        .section-wrap { max-width: 1400px; margin: 6rem auto; padding: 0 2rem; }
        .sec-title { font-family: var(--font-heading); font-size: 36px; font-weight: 800; margin-bottom: 3rem; color: var(--text-main); text-align: center; }

        /* Flow Diagram */
        .flowchart {
          display: flex; align-items: center; justify-content: space-between; padding: 4rem 2rem;
          background: #FFFFFF; border-radius: 20px; border: 1px solid var(--border-light); position: relative;
          box-shadow: var(--shadow-md);
        }
        .flow-line-bg { position: absolute; top: 50%; left: 5%; right: 5%; height: 2px; background: var(--border-light); z-index: 0; }
        .flow-line-anim {
          position: absolute; top: -1px; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, transparent, var(--india-green), transparent);
          background-size: 200% 100%; animation: flow 2.5s linear infinite;
        }
        @keyframes flow { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        
        .node {
          position: relative; z-index: 1; background: #FFFFFF; border: 2px solid var(--india-green);
          border-radius: 16px; width: 120px; height: 120px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px; box-shadow: var(--shadow-md);
          transition: all 0.3s;
        }
        .node:hover { transform: translateY(-5px); border-color: var(--saffron); }
        .node .material-icons { color: var(--india-green); font-size: 32px; }
        .node-label { font-size: 0.85rem; font-weight: 700; text-align: center; color: var(--text-main); }

        /* Glossary */
        .glossary-scroll { display: flex; gap: 1rem; overflow-x: auto; padding: 0.5rem 0 1.5rem; scrollbar-width: none; }
        .glossary-scroll::-webkit-scrollbar { display: none; }
        .g-pill {
          flex-shrink: 0; padding: 12px 24px; background: #FFFFFF; border: 1px solid var(--border-light);
          border-radius: 100px; cursor: pointer; transition: all 0.3s; font-weight: 600; color: var(--text-muted);
          box-shadow: var(--shadow-sm);
        }
        .g-pill:hover, .g-pill.active { border-color: var(--saffron); color: var(--saffron); background: var(--saffron-subtle); box-shadow: var(--shadow-md); }
        .g-def {
          margin-top: 1rem; padding: 2.5rem; background: #FFFFFF; border: 1px solid var(--border-light); border-left: 6px solid var(--saffron); border-radius: 16px;
          box-shadow: var(--shadow-lg);
        }

        /* Stats */
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem; }
        .stat-box { background: #FFFFFF; padding: 3rem 1.5rem; text-align: center; border-radius: 16px; border: 1px solid var(--border-light); box-shadow: var(--shadow-md); transition: all 0.3s; }
        .stat-box:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
        .stat-val { font-family: var(--font-mono); font-size: 2.5rem; color: var(--saffron); font-weight: 800; margin-bottom: 0.75rem; }
        .stat-lbl { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Map */
        .map-container { width: 100%; height: 450px; border-radius: 20px; overflow: hidden; border: 1px solid var(--border-light); box-shadow: var(--shadow-lg); }
        .map-caption { text-align: center; margin-top: 1.5rem; font-weight: 600; color: var(--text-muted); font-size: 0.95rem; }

        /* Footer */
        footer { padding: 4rem 2rem; text-align: center; color: var(--text-muted); font-size: 0.95rem; background: var(--bg-subtle); border-top: 1px solid var(--border-light); }

        /* News & FAQ Styles */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .news-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(8px);
          padding: 2rem; border-radius: 24px; transition: all 0.3s; box-shadow: var(--shadow-md);
        }
        .news-card:hover { transform: translateY(-10px); border-color: var(--saffron); }
        .news-cat { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--saffron); margin-bottom: 0.5rem; letter-spacing: 1px; }
        .news-title { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-main); }
        .news-footer { display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.85rem; }
        
        .faq-wrap { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .faq-item {
          background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(8px);
          border-radius: 20px; overflow: hidden; transition: all 0.3s;
        }
        .faq-q { padding: 1.5rem 2rem; font-weight: 700; font-size: 1.1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-q:hover { color: var(--saffron); }
        .faq-a { padding: 0 2rem 1.5rem; color: var(--text-muted); line-height: 1.6; }

        @media (max-width: 900px) {
          .main-content { flex-direction: column; }
          .timeline, .ai-panel { width: 100%; }
          .ai-panel { height: 600px; position: static; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .flowchart { flex-direction: column; gap: 2rem; }
          .flow-line-bg { width: 2px; height: 100%; top: 0; left: 50%; right: auto; }
        }

      `}</style>

      {/* BACKGROUND MAP */}
      <div className="map-bg"></div>

      {/* NAV */}
      <nav className="top-nav">
        <div className="nav-logo">
          {/* Ashoka Chakra SVG */}
          <svg className="ashoka-chakra" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--google-blue)" strokeWidth="4"/>
            <circle cx="50" cy="50" r="8" fill="var(--google-blue)"/>
            {Array.from({length: 24}).map((_, i) => (
              <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="var(--google-blue)" strokeWidth="2" transform={`rotate(${i * 15} 50 50)`} />
            ))}
          </svg>
          Matdata Marg
        </div>
        <div className="nav-links">
          <a href="#timeline">Timeline</a>
          <a href="#process">Process</a>
          <a href="#stats">Stats</a>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          <span className="ticker-dot">●</span> ECI established January 25, 1950 
          <span className="ticker-dot">●</span> India has 543 Lok Sabha constituencies 
          <span className="ticker-dot">●</span> Over 96 crore registered voters in 2024 
          <span className="ticker-dot">●</span> Voting age lowered to 18 in 1988
          <span className="ticker-dot">●</span> Largest democracy in the world
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">Understand India's Democracy</h1>
        <p className="hero-subtitle">From Model Code of Conduct to Result Declaration</p>
      </section>

      {/* MAIN (Timeline + AI) */}
      <div className="main-content" id="timeline">
        <div className="timeline">
          {TIMELINE_STEPS.map(step => (
            <div key={step.id} className={`step-card ${activeStep === step.id ? 'active' : ''}`} onClick={() => handleTimelineClick(step)}>
              <div className="step-dot"></div>
              <div className="step-header">
                <span className="material-icons">{step.icon}</span>
                <span className="step-num">Step {step.id}</span>
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="ai-panel">
          <div className="ai-header">
            <span className="material-icons gemini-icon">auto_awesome</span>
            <span className="ai-title">VoteBot — Powered by Gemini</span>
          </div>
          
          <div className="chat-area">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
                {m.role === 'ai' && i === messages.length - 1 && !isTyping ? <TypewriterText text={m.text} /> : m.text}
              </div>
            ))}
            {isTyping && <div className="msg msg-ai typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <div className="chips">
              {["What is EVM?", "How does preferential voting work?", "What is MCC?", "Explain VVPAT", "Who is eligible to vote?"].map(chip => (
                <button key={chip} className="chip" onClick={() => handleSendMessage(chip)} disabled={isTyping}>{chip}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}>
              <input type="text" placeholder="Ask about Indian elections..." value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isTyping} />
              <button type="submit" disabled={!inputValue.trim() || isTyping}>
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* PROCESS / VOTE FLOW */}
      <div className="section-wrap" id="process">
        <h2 className="sec-title">The Voting Process</h2>
        <div className="flowchart">
          <div className="flow-line-bg"><div className="flow-line-anim"></div></div>
          {FLOW_NODES.map((node, i) => (
            <div key={i} className="node">
              <span className="material-icons">{node.icon}</span>
              <div className="node-label">{node.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GLOSSARY */}
      <div className="section-wrap">
        <h2 className="sec-title">Election Glossary</h2>
        <div className="glossary-scroll">
          {GLOSSARY.map((item, i) => (
            <button key={i} className={`g-pill ${activeGlossary?.term === item.term ? 'active' : ''}`} onClick={() => setActiveGlossary(item)}>
              {item.term}
            </button>
          ))}
        </div>
        {activeGlossary && (
          <div className="g-def">
            <h3 style={{fontFamily: 'var(--font-heading)', color: 'var(--saffron)', marginBottom: '8px'}}>{activeGlossary.term}</h3>
            <p>{activeGlossary.def}</p>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="section-wrap" id="stats" ref={statsRef}>
        <h2 className="sec-title">Democracy in Numbers (2024)</h2>
        <div className="stats-grid">
          <div className="stat-box"><div className="stat-val">{stats.voters}Cr+</div><div className="stat-lbl">Eligible Voters</div></div>
          <div className="stat-box"><div className="stat-val">{stats.seats}</div><div className="stat-lbl">Lok Sabha Seats</div></div>
          <div className="stat-box"><div className="stat-val">{stats.states}</div><div className="stat-lbl">States & UTs</div></div>
          <div className="stat-box"><div className="stat-val">{stats.booths}L+</div><div className="stat-lbl">Polling Stations</div></div>
          <div className="stat-box"><div className="stat-val">{stats.year}</div><div className="stat-lbl">ECI Founded</div></div>
        </div>
      </div>

      {/* MAP */}
      <div className="section-wrap">
        <h2 className="sec-title">Election Commission of India HQ</h2>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2619472935293!2d77.2076046150824!3d28.621946882421867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd515a815779%3A0xc4f5d21a7114cfd5!2sElection%20Commission%20of%20India!5e0!3m2!1sen!2sus!4v1714088019088!5m2!1sen!2sus" 
            width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
        <p className="map-caption">Nirvachan Sadan — Headquarters of the Election Commission of India, New Delhi</p>
      </div>

      {/* NEWS */}
      <div className="section-wrap">
        <h2 className="sec-title">ECI Latest Updates</h2>
        <div className="news-grid">
          {ECI_NEWS.map((news, i) => (
            <div key={i} className="news-card">
              <div className="news-cat">{news.category}</div>
              <div className="news-title">{news.title}</div>
              <div className="news-footer">
                <div style={{display:'flex', alignItems:'center', gap:'4px'}}><span className="material-icons" style={{fontSize:'16px'}}>{news.icon}</span> {news.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="section-wrap">
        <h2 className="sec-title">Frequently Asked Questions</h2>
        <div className="faq-wrap">
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">
                {faq.q}
                <span className="material-icons">expand_more</span>
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <p>Matdata Marg — For educational purposes only. Data sourced from eci.gov.in.</p>
      </footer>
    </div>
  );
}
