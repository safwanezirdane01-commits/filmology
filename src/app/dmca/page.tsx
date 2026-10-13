import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Mail, AlertTriangle, FileText, CheckCircle2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy | FilmologyX",
  description: "Digital Millennium Copyright Act (DMCA) compliance notice, non-hosting disclaimer, and copyright infringement takedown request procedures for FilmologyX.",
};

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-300/80 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cinema Hub</span>
      </Link>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-slate-900/90 p-6 sm:p-10 shadow-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Legal & Copyright Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          DMCA & Content Disclaimer
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          FilmologyX respects the intellectual property rights of others and complies with the <strong>Digital Millennium Copyright Act (17 U.S.C. § 512)</strong>. Please read our operational policy below.
        </p>
      </div>

      {/* Core Non-Hosting Disclaimer Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-6 mb-8 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h3 className="font-bold text-amber-200">Strict Non-Hosting Statement</h3>
          <p className="text-slate-300 leading-relaxed">
            <strong>FilmologyX does not host, store, upload, or transmit any video files, media streams, or copyrighted data on its servers.</strong> All content is provided strictly through automated third-party embed links and iframes operated by independent external services. FilmologyX operates solely as an index of publicly available links found across the internet.
          </p>
        </div>
      </div>

      {/* Main Policy Sections */}
      <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>1. Notice and Takedown Procedure</span>
          </h2>
          <p>
            If you are a copyright owner, or authorized to act on behalf of one, and believe in good faith that any material indexed on FilmologyX infringes upon your copyright, you may submit a formal notification pursuant to <strong>17 U.S.C. § 512(c)(3)</strong>.
          </p>
          <p>
            Upon receipt of a valid and complete notification, FilmologyX will expeditiously remove or disable access to the infringing link within <strong>24 to 48 business hours</strong>.
          </p>
        </section>

        {/* Section 2: Requirements */}
        <section className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>2. Required Information for DMCA Takedown Requests</span>
          </h2>
          <p>To ensure prompt processing, your written notice must include all of the following:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright interest.
            </li>
            <li>
              Clear identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works are covered).
            </li>
            <li>
              The exact URL(s) on <strong>filmologyx.vercel.app</strong> where the allegedly infringing link or embed is located.
            </li>
            <li>
              Information reasonably sufficient to permit us to contact you, such as your full legal name, company, email address, physical address, and telephone number.
            </li>
            <li>
              A statement that you have a <em>good faith belief</em> that the disputed use of the material is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement, made under <em>penalty of perjury</em>, that the information in the notification is accurate and that you are the copyright owner or authorized to act on the owner's behalf.
            </li>
          </ul>
        </section>

        {/* Section 3: Contact Box */}
        <section className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-purple-950/30 p-6 sm:p-8 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-400" />
            <span>3. Designated Copyright Agent Contact</span>
          </h2>
          <p className="text-slate-300">
            Please direct all official infringement notifications to our designated copyright mailbox:
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-300 font-mono text-xs sm:text-sm font-bold shadow-inner">
            <Mail className="w-4 h-4 text-rose-400" />
            <span>dmca.filmologyx@gmail.com</span>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-300/70">
            Requests containing valid and complete information will be acknowledged and processed within 24–48 hours. Incomplete requests lacking specific FilmologyX URLs cannot be processed.
          </p>
          <div>
            <a
              href="mailto:dmca.filmologyx@gmail.com?subject=DMCA%20Takedown%20Notice%20-%20FilmologyX&body=Please%20provide%20the%20following%20details:%0A1.%20Copyrighted%20Work%20Title:%0A2.%20FilmologyX%20URL(s):%0A3.%20Your%20Name%20and%20Organization:%0A4.%20Contact%20Email:%0A5.%20Statement%20of%20Good%20Faith:%20I%20have%20a%20good%20faith%20belief%20that%20use%20of%20the%20material%20is%20not%20authorized.%0A6.%20Signature:"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Submit DMCA Notice via Email</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
