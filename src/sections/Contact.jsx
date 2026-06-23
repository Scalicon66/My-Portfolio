import { useRef, useState, useEffect, lazy, Suspense } from "react";
import emailjs from "@emailjs/browser";
import { useMediaQuery } from "react-responsive";

import TitleHeader from "../components/TitleHeader";

const ContactExperience = lazy(() => import("../components/models/contact/ContactExperience"));

const Contact = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [buttonStatus, setButtonStatus] = useState("idle"); // 'idle' | 'sending' | 'success' | 'error'

  useEffect(() => {
    if (buttonStatus === "success" || buttonStatus === "error") {
      const timer = setTimeout(() => {
        setButtonStatus("idle");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [buttonStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Reset form and set status to success
      setForm({ name: "", email: "", message: "" });
      setButtonStatus("success");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setButtonStatus("error");
    }
  };

  return (
    <section id="contact" className="flex-center section-padding relative">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Have questions or ideas? Let’s talk! 🚀"
        />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-5">
            <div className="flex-center card-border rounded-xl p-10">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-7"
              >
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What’s your good name?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What’s your email address?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" disabled={buttonStatus === "sending"}>
                  <div
                    className={`cta-button group transition-all duration-300 ${
                      buttonStatus === "success"
                        ? "!bg-emerald-600 border-emerald-500"
                        : buttonStatus === "error"
                        ? "!bg-rose-600 border-rose-500"
                        : ""
                    }`}
                  >
                    <div className="bg-circle" />
                    <p
                      className={`text transition-all duration-300 ${
                        buttonStatus === "success" || buttonStatus === "error"
                          ? "!text-white"
                          : ""
                      }`}
                    >
                      {buttonStatus === "idle" && "Send Message"}
                      {buttonStatus === "sending" && "Sending..."}
                      {buttonStatus === "success" && "Message Sent! 🚀"}
                      {buttonStatus === "error" && "Error! Try Again 😢"}
                    </p>
                    <div className={`arrow-wrapper transition-all duration-300 ${buttonStatus === "sending" ? "!bg-white/10" : ""} ${buttonStatus !== "idle" ? "status-active" : ""}`}>
                      {buttonStatus === "sending" ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : buttonStatus === "success" ? (
                        <span className="text-emerald-200 font-bold text-lg select-none">✓</span>
                      ) : buttonStatus === "error" ? (
                        <span className="text-rose-200 font-bold text-lg select-none">✗</span>
                      ) : (
                        <img src="/images/arrow-down.svg" alt="arrow" />
                      )}
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>
          {!isMobile && (
            <div className="xl:col-span-7 min-h-96">
              <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
                <Suspense fallback={null}>
                  <ContactExperience />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
