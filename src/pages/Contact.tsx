import { PageContainer } from "@/components/layout/PageContainer";
import { SiteShell } from "@/components/layout/SiteShell";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { createInquiry } from "@/services/inquiries";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await createInquiry(formData);
      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <SiteShell>
      <PageContainer>
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                Get in <span className="text-accent">Touch</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                Whether you're selling your current vehicle, looking to buy your dream car, or just exploring options, our expert team is here to help you every step of the way.
              </p>
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                <div className="grid gap-6">
                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0f182a] p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Phone & WhatsApp</h3>
                      <p className="mt-1 text-slate-400">+{import.meta.env.VITE_WHATSAPP_NUMBER}</p>
                      <p className="text-slate-400">Mon-Sat, 8am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0f182a] p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email Address</h3>
                      <p className="mt-1 text-slate-400">{import.meta.env.VITE_ADMIN_EMAILS}</p>
                      <p className="text-slate-400">We respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-6 shadow-2xl sm:p-8">
                <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                {success ? (
                  <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-400">Message Sent!</h3>
                    <p className="mt-2 text-slate-300">
                      Thank you for reaching out. A Karh Auto Sales representative will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-6 inline-flex rounded-xl bg-slate-800 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                      <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="field">
                        <span className="font-medium text-slate-300">Full Name</span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-[#0f182a] border-white/10 text-white placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <label className="field">
                        <span className="font-medium text-slate-300">Phone Number</span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+254 700 000 000"
                          className="w-full bg-[#0f182a] border-white/10 text-white placeholder:text-slate-500"
                          required
                        />
                      </label>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="field">
                        <span className="font-medium text-slate-300">Email Address</span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full bg-[#0f182a] border-white/10 text-white placeholder:text-slate-500"
                          required
                        />
                      </label>
                      <label className="field">
                        <span className="font-medium text-slate-300">Subject</span>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Car Inquiry"
                          className="w-full bg-[#0f182a] border-white/10 text-white placeholder:text-slate-500"
                          required
                        />
                      </label>
                    </div>
                    <label className="field">
                      <span className="font-medium text-slate-300">Message</span>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="min-h-[120px] w-full bg-[#0f182a] border-white/10 text-white placeholder:text-slate-500"
                        required
                      ></textarea>
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-accent px-4 py-3.5 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </SiteShell>
  );
}
