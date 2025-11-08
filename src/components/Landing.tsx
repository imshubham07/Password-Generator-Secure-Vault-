import React from 'react';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top nav */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <nav className="flex items-center justify-between">
          <div className="text-white font-semibold">🔐 SecureVault</div>
          <div>
            <Link href="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-medium">Sign in</Link>
          </div>
        </nav>
      </div>
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-gray-800/60 px-3 py-1 rounded-full shadow-sm mb-4">
              <span className="text-emerald-400 text-xl">🔐</span>
              <span className="text-sm text-gray-300">Privacy-first • Zero-tracking • End-to-end encryption</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">Generate. Protect. Secure.</h1>
            <p className="mt-4 text-gray-300 text-lg">Your passwords, your privacy — fortified with Secure Vault.</p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-semibold shadow-md">Get Started</Link>
              <a href="#how" className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800">How it works</a>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-800/60 rounded-lg text-center">
                <div className="text-emerald-400 text-2xl">⚡</div>
                <div className="mt-2 text-sm text-gray-300">Strong generator</div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-lg text-center">
                <div className="text-emerald-400 text-2xl">🔒</div>
                <div className="mt-2 text-sm text-gray-300">Encrypted storage</div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-lg text-center">
                <div className="text-emerald-400 text-2xl">📋</div>
                <div className="mt-2 text-sm text-gray-300">One-click copy</div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-lg text-center">
                <div className="text-emerald-400 text-2xl">👁️‍🗨️</div>
                <div className="mt-2 text-sm text-gray-300">No tracking</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800">
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-gray-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-emerald-400">�</div>
                    <div>
                      <div className="text-sm text-gray-300">SecureVault</div>
                      <div className="text-xs text-gray-500">Encrypted vault</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">v0.1</div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                <label className="text-xs text-gray-400 mb-1">Generated password</label>
                <div className="mt-2 flex gap-2">
                  <input readOnly value="• • • • • • • • • • • •" className="flex-1 rounded-lg bg-gray-900 text-gray-100 p-3 border border-gray-700" />
                  <button className="px-4 py-2 bg-emerald-500 text-black rounded-lg">Copy</button>
                </div>
                <div className="mt-3 text-xs text-gray-500">Length: 16 • Symbols: ✓ • Numbers: ✓ • Uppercase: ✓</div>
              </div>

              <div className="p-3 text-sm text-gray-400">Illustration: a lock or shield graphic would appear here (SVG placeholder).</div>
            </div>
          </div>
        </section>

        {/* Sign-in handled on the dedicated /login route */}

        {/* Features */}
        <section id="features" className="mt-16">
          <h2 className="text-2xl font-semibold text-white">Features</h2>
          <p className="mt-2 text-gray-400">Modern features built to help you stay secure without friction.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard title="Strong password generation" icon="⚙️">Fully customizable rules to generate passwords that meet any policy.</FeatureCard>
            <FeatureCard title="Encrypted storage" icon="🔒">AES-256 style encryption and client-side master-key handling.</FeatureCard>
            <FeatureCard title="One-click copy" icon="📋">Copy passwords securely to clipboard with automatic clearing.</FeatureCard>
            <FeatureCard title="No data tracking" icon="👁️‍🗨️">We don&apos;t collect or sell your data—privacy-first by design.</FeatureCard>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mt-16 bg-gray-900/20 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white">How it works</h2>
          <p className="mt-2 text-gray-400">A simple three-step workflow to generate and securely store passwords.</p>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Step number={1} title="Generate" desc="Create a strong password using customizable rules." />
            <div className="hidden sm:block text-emerald-400 text-2xl">→</div>
            <Step number={2} title="Save" desc="Encrypt and save to your Secure Vault with your master key." />
            <div className="hidden sm:block text-emerald-400 text-2xl">→</div>
            <Step number={3} title="Access" desc="Retrieve and copy passwords securely when you need them." />
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mt-16">
          <h2 className="text-2xl font-semibold text-white">Security & Privacy</h2>
          <p className="mt-2 text-gray-400">Designed around zero-trust and minimal data exposure.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-emerald-400 text-2xl">🔐</div>
              <h3 className="mt-3 font-semibold text-white">Encryption</h3>
              <p className="mt-1 text-gray-400 text-sm">Client-side encryption, server stores only ciphertext.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-emerald-400 text-2xl">🛡️</div>
              <h3 className="mt-3 font-semibold text-white">Privacy</h3>
              <p className="mt-1 text-gray-400 text-sm">No tracking, no analytics that identify users.</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-emerald-400 text-2xl">✅</div>
              <h3 className="mt-3 font-semibold text-white">Trust</h3>
              <p className="mt-1 text-gray-400 text-sm">Small audit logs and transparency for critical actions.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800/60 pt-8 pb-6 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Password Generator — Secure Vault • Built by Shubham Kumar Dubey</div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/imshubham07" target="_blank" rel="noreferrer" className="hover:text-emerald-400">GitHub</a>
              <a href="#" className="hover:text-emerald-400">Twitter</a>
              <a href="#" className="hover:text-emerald-400">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: string }) {
  return (
    <div className="p-5 bg-gray-800/40 rounded-xl border border-gray-700 hover:scale-[1.01] transition-transform">
      <div className="text-2xl text-emerald-400">{icon}</div>
      <h4 className="mt-3 font-semibold text-white">{title}</h4>
      <p className="mt-2 text-gray-400 text-sm">{children}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-emerald-400 font-semibold">{number}</div>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-gray-400">{desc}</div>
      </div>
    </div>
  );
}
