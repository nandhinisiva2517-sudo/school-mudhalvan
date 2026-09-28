"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { DemoModal } from "@/components/ui/DemoModal";
export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-spark-bg overflow-hidden">
      <nav className="flex items-center justify-between px-4 md:px-12 py-4 md:py-5 border-b border-spark-border bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-105">
            {/* Glassmorphism Logo Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-pink-500/80 rounded-xl" />
            <div className="absolute inset-0.5 bg-white/30 backdrop-blur-md rounded-[10px] border border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex items-center justify-center">
              {/* Play / Sparkle Icon inside */}
              <svg className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse blur-[2px]" />
          </div>
          <span className="font-baloo text-xl md:text-2xl font-bold text-spark-ink tracking-tight">AI Video <span style={{color:"var(--spark-primary)"}}>Summarization</span></span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowDemo(true)}
            className="text-xs md:text-sm font-semibold text-spark-primary hover:underline px-1 md:px-2"
          >
            Try Demo
          </button>
          <Link href="/login" className="spark-btn-secondary text-xs md:text-sm py-2 px-4 md:px-5">Log In</Link>
          <Link href="/register/student" className="spark-btn-primary text-xs md:text-sm py-2 px-4 md:px-5 hidden md:inline-flex">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-4 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32 bg-[#F8F9FA] overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-bold tracking-widest text-gray-500 uppercase mb-6">
              AI-POWERED LEARNING PLATFORM
            </motion.span>
            
            <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-[4.5rem] lg:text-[5.5rem] font-bold text-[#1A202C] leading-[1.05] tracking-tight mb-8">
              AI Based<br/>
              Educational<br/>
              Video<br/>
              Summarization<br/>
              and Quiz<br/>
              Generation<br/>
              System Using<br/>
              <span className="italic font-normal" style={{color: "#2a7a7b"}}>Whisper and LLMs</span>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link href="/register/student" className="spark-btn-primary px-8 py-4 bg-[#2a7a7b] hover:bg-[#235e5f] text-white border-none shadow-lg">
                Explore Platform →
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="spark-btn-secondary px-8 py-4 bg-white border border-[#2a7a7b] text-[#2a7a7b] hover:bg-gray-50 shadow-sm"
              >
                Try Demo Now
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative flex items-center justify-center w-full pl-0 md:pl-10"
          >
            <div className="w-full max-w-[450px] aspect-[4/3] bg-[#2a7a7b] p-6 md:p-8 relative">
              <div className="w-full h-full bg-[#1A365D] relative flex flex-col justify-end p-6 shadow-inner">
                {/* Play button centered in the top area */}
                <div className="absolute inset-0 flex items-center justify-center pb-8">
                   <div className="w-14 h-14 rounded-full bg-[#D1F072] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
                     <svg className="w-6 h-6 text-[#2a7a7b] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
                
                <div className="text-[#A0AEC0] text-sm md:text-base font-medium relative z-10">
                  Biology 101 - Cell Division
                </div>
              </div>
              
              {/* Key Insight Popup */}
              <div className="absolute -bottom-8 right-0 md:-right-8 bg-white p-5 max-w-[240px] shadow-2xl z-20">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Key Insight</div>
                <div className="text-sm text-gray-600 leading-relaxed">During mitosis, one cell divides into 2 identical daughter cells.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grade bands */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-baloo text-3xl md:text-4xl font-bold text-center mb-3">Learning for Every Grade</h2>
          <p className="text-spark-ink-muted text-center mb-12 text-base md:text-lg">Three age-tailored experiences, one platform.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { grades: "Std 1–5", title: "Spark & Play", desc: "Hands-on activities with Quick Draw and Teachable Machine. No reading required — just draw, train, and discover!", icon: "🎨", color: "var(--spark-primary)" },
            { grades: "Std 6–10", title: "Think & Build", desc: "Understand data, algorithms, AI ethics, and chatbots through digital notebooks and interactive quizzes.", icon: "📓", color: "var(--spark-success)" },
            { grades: "Std 11–12", title: "Code & Create", desc: "Deep Learning, Neural Networks, Machine Learning, and Prompt Engineering with live sandboxes.", icon: "🧠", color: "var(--spark-tech)" },
          ].map((band, idx) => (
            <motion.div 
              key={band.grades} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="spark-card bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="text-5xl md:text-6xl mb-5 transform transition-transform hover:scale-110 origin-left">{band.icon}</div>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:band.color}}>{band.grades}</div>
              <h3 className="font-baloo text-2xl font-bold mb-3 text-spark-ink">{band.title}</h3>
              <p className="text-spark-ink-muted text-sm leading-relaxed">{band.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 py-16 mt-10 relative overflow-hidden" style={{background:"var(--spark-ink)"}}>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center relative z-10"
        >
          {[
            { value: "58,000+", label: "Schools across Tamil Nadu" },
            { value: "Std 1–12", label: "All grades covered" },
            { value: "DPDP", label: "Privacy compliant" },
            { value: "Free", label: "For all students" },
          ].map((s, idx) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="font-baloo text-4xl md:text-5xl font-extrabold mb-2" style={{color:"var(--spark-primary)"}}>{s.value}</div>
              <div className="text-sm md:text-base font-medium" style={{color:"rgba(255,249,240,0.8)"}}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Ratings & Feedback */}
      <section className="px-6 md:px-12 py-20 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-baloo text-3xl md:text-4xl font-bold mb-4">Loved by Students & Teachers</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl text-yellow-400">★★★★★</span>
              <span className="text-xl font-bold">4.9/5</span>
            </div>
            <p className="text-spark-ink-muted">Based on 12,450+ ratings from schools across Tamil Nadu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Fake Reviews */}
            <div className="space-y-6">
              {[
                { name: "Suresh K.", role: "Student, Std 8", rating: 5, text: "The interactive quizzes help me understand concepts much better than reading textbooks alone. The videos are great!" },
                { name: "Priya M.", role: "Science Teacher", rating: 5, text: "I use this platform in my classroom every day. The progression from simple activities to deep learning is incredible." },
                { name: "Arun V.", role: "Student, Std 11", rating: 4, text: "The machine learning sandbox is very useful. It makes complex concepts like Neural Networks easy to visualize." }
              ].map((review, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-spark-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-spark-ink">{review.name}</h4>
                      <p className="text-xs text-spark-ink-muted">{review.role}</p>
                    </div>
                    <div className="text-yellow-400 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                </div>
              ))}
            </div>

            {/* Feedback Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-spark-border/50">
              <h3 className="font-baloo text-2xl font-bold mb-6">Leave Your Feedback</h3>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thank you for your feedback!"); e.currentTarget.reset(); }}>
                <div>
                  <label className="block text-sm font-medium text-spark-ink mb-1.5">Email Address</label>
                  <input type="email" required placeholder="your.email@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spark-primary focus:ring-1 focus:ring-spark-primary outline-none transition-colors" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-spark-ink mb-2">Rating</label>
                  <div className="flex gap-2 text-2xl text-gray-300">
                    <button type="button" className="hover:text-yellow-400 focus:text-yellow-400 transition-colors">★</button>
                    <button type="button" className="hover:text-yellow-400 focus:text-yellow-400 transition-colors">★</button>
                    <button type="button" className="hover:text-yellow-400 focus:text-yellow-400 transition-colors">★</button>
                    <button type="button" className="hover:text-yellow-400 focus:text-yellow-400 transition-colors">★</button>
                    <button type="button" className="hover:text-yellow-400 focus:text-yellow-400 transition-colors">★</button>
                  </div>
                  <p className="text-xs text-spark-ink-muted mt-1">(Select a star to rate)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-spark-ink mb-1.5">Your Thoughts</label>
                  <textarea required rows={4} placeholder="What did you like? What can we improve?" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spark-primary focus:ring-1 focus:ring-spark-primary outline-none transition-colors resize-none"></textarea>
                </div>

                <button type="submit" className="w-full spark-btn-primary py-3">Submit Rating</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 text-center bg-white border-t border-spark-border">
        <p className="text-spark-ink-muted text-sm font-medium">
          © 2026 SparkLearn · Built for Tamil Nadu Schools · 
          <a href="mailto:privacy@sparklearn.in" className="underline ml-1 hover:text-spark-primary transition-colors">Data & Privacy Contact</a>
        </p>
      </footer>
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </main>
  );
}