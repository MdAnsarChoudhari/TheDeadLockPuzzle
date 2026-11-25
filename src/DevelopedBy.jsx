import React from 'react';

// ==========================================
// DEVELOPER CONFIG — edit these before deploy
// ==========================================

const DEVELOPER_NAME = 'Muhammad Ansar M Choudhari';

const DEVELOPER_LINKS = {
  linkedin: 'https://www.linkedin.com/in/muhammadansarmchoudhari/',
  github: 'https://github.com/MdAnsarChoudhari',
  profile: '', // optional — leave empty to hide
};

const DEVELOPER_STORY = [
  'It started in a classroom. Our teacher set up a team activity — ten of us standing in ' +
  'a line, two team leaders (I was one of them), trying to swap sides following strict ' +
  'slide-and-hop rules. A 4v4, right there on our feet. We couldn\'t crack it. The whole ' +
  'class tried, argued, shuffled around, and still ended up stuck. Deadlocked.',

  'After class I kept thinking about it. Sat down with pen and paper and tried to work ' +
  'through the logic. The 4v4 still beat me. So I scaled it down — tried 2v2 first. And ' +
  'it clicked. That small moment of "oh, I see it now" felt genuinely satisfying.',

  'But solving puzzles on paper gets old fast. I wanted something I could actually tap, ' +
  'hear, and feel — so with the help of just three prompts and a lot of love for the idea, ' +
  'DEADLOCK was born. A dark, quiet little puzzle game, developed with love, purely for fun.',

  'No timers, no leaderboards, no pressure. Just a clean board, two teams, and the calm ' +
  'satisfaction of finding a way through the gridlock. Made for fun — for anyone who wants ' +
  'a small challenge to pick up, get stuck on, and try again.',
];

// ==========================================
// COMPONENTS
// ==========================================

function LinkButton({ href, label, icon }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="capsule-btn inline-flex items-center justify-center gap-2 px-5 py-2 text-sm"
    >
      <span className="text-gray-300" aria-hidden="true">
        {icon}
      </span>
      {label}
    </a>
  );
}

export default function DevelopedBy({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col select-none px-4 sm:px-6 lg:px-10 py-5 sm:py-8 text-[#F3F4F6]">
      {/* ================= HEADER ================= */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4 pt-1 pb-5">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans truncate">
            DEADLOCK
          </h1>
          <span className="border border-white/35 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase text-white/90 flex-shrink-0">
            PUZZLE
          </span>
        </div>
        <button
          onClick={onBack}
          className="capsule-btn px-4 py-1.5 text-xs sm:text-sm flex-shrink-0"
          title="Return to the game"
        >
          ← Back to Game
        </button>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col gap-5 sm:gap-6">
        <div>
          <p className="text-xs font-mono font-bold tracking-widest uppercase text-amber-500/90 mb-1.5">
            Credits
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Developed By
          </h2>
        </div>

        {/* Developer Details & Links */}
        <section className="credits-card">
          <h3 className="credits-card-title">Developer Details</h3>

          <p className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {DEVELOPER_NAME}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <LinkButton
              href={DEVELOPER_LINKS.linkedin}
              label="LinkedIn"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.34 8.25h4.33v2.01h.06c.6-1.14 2.08-2.35 4.28-2.35 4.58 0 5.42 3.01 5.42 6.93V23h-4.52v-7.28c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.89-2.8 3.85V23H8.34V8.25z" />
                </svg>
              }
            />
            <LinkButton
              href={DEVELOPER_LINKS.github}
              label="GitHub"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              }
            />
            <LinkButton
              href={DEVELOPER_LINKS.profile}
              label="Profile"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Story Behind Building It */}
        <section className="credits-card">
          <h3 className="credits-card-title">Story Behind Building It</h3>
          <div className="space-y-3 text-sm sm:text-[0.935rem] leading-relaxed text-gray-300">
            {DEVELOPER_STORY.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-500 text-center sm:text-left pb-2">
          DEADLOCK · developed with love for fun · just for fun
        </p>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full max-w-3xl mx-auto pt-5 pb-1 border-t border-white/10 flex items-center justify-center">
        <button
          onClick={onBack}
          className="capsule-btn bg-white text-gray-900 border-none hover:bg-gray-200 px-6 py-2 text-sm"
        >
          Return to DEADLOCK
        </button>
      </footer>
    </div>
  );
}
