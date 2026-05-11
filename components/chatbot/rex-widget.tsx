"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { RexAvatar } from "./rex-avatar";
import { answer, FACTS } from "./knowledge-base";

const WHATSAPP = "523521889522";
const EMAIL = "karollevitafollasalazar@gmail.com";

type Message =
  | {
      id: string;
      from: "rex";
      text: string;
      suggestions?: string[];
      escalate?: boolean;
    }
  | { id: string; from: "user"; text: string }
  | { id: string; from: "system"; kind: "escalate" }
  | { id: string; from: "system"; kind: "form-sent" };

const INITIAL: Message[] = [
  {
    id: "welcome",
    from: "rex",
    text: "¡Guau! 🐕 Soy Rex. Estoy aquí para resolverte dudas sobre RescueNow: planes, funciones, privacidad o soporte. ¿En qué te echo una pata?",
    suggestions: [
      "¿Cómo se juega Rex al Rescate?",
      "¿Qué incluye el Premium?",
      "¿Tienes easter eggs?",
    ],
  },
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function RexWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapAt, setTapAt] = useState(0);
  const [cookie, setCookie] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setBubble(null);
      return;
    }
    let idx = 0;
    const schedule = () => {
      const fact = FACTS[idx % FACTS.length];
      idx++;
      setBubble(fact);
      const hideT = setTimeout(() => setBubble(null), 7000);
      return () => clearTimeout(hideT);
    };
    const firstT = setTimeout(schedule, 4500);
    const interval = setInterval(schedule, 22000);
    return () => {
      clearTimeout(firstT);
      clearInterval(interval);
      setBubble(null);
    };
  }, [open]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { id: uid(), from: "user", text: clean }]);
    setInput("");
    setTyping(true);

    const history = messages
      .filter((m) => m.from === "rex" || m.from === "user")
      .map((m) =>
        m.from === "rex"
          ? { role: "assistant" as const, content: (m as any).text }
          : { role: "user" as const, content: (m as any).text },
      );

    const payload = [...history, { role: "user" as const, content: clean }];

    try {
      const res = await fetch("/api/rex", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!res.ok) throw new Error("API error");

      const data = (await res.json()) as {
        text: string;
        suggestions?: string[];
        escalate?: boolean;
      };

      setMessages((m) => [
        ...m,
        {
          id: uid(),
          from: "rex",
          text: data.text || "Guau, no capté eso. ¿Me lo preguntas de otra forma? 🐾",
          suggestions: data.suggestions,
          escalate: data.escalate,
        },
      ]);
      if (data.escalate) {
        setMessages((m) => [
          ...m,
          { id: uid(), from: "system", kind: "escalate" },
        ]);
      }
    } catch {
      const reply = answer(clean);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          from: "rex",
          text: reply.text,
          suggestions: reply.suggestions,
          escalate: reply.escalate,
        },
      ]);
      if (reply.escalate) {
        setMessages((m) => [
          ...m,
          { id: uid(), from: "system", kind: "escalate" },
        ]);
      }
    } finally {
      setTyping(false);
    }
  };

  const openForm = () => setShowForm(true);

  return (
    <>
      <AnimatePresence>
        {bubble && !open && (
          <motion.button
            key={bubble}
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed z-[70] bottom-28 right-5 sm:right-6 max-w-[260px] text-left"
            aria-label="Abrir chat"
          >
            <div
              className="relative rounded-2xl bg-white text-black px-4 py-3 text-sm font-semibold leading-snug shadow-2xl"
              style={{ border: "2.5px solid #0B1120" }}
            >
              {bubble}
              <span
                className="absolute -bottom-[9px] right-6 h-4 w-4 rotate-45 bg-white"
                style={{
                  borderRight: "2.5px solid #0B1120",
                  borderBottom: "2.5px solid #0B1120",
                }}
              />
              <span
                className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-brand-crimson"
                style={{ border: "2px solid #0B1120" }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cookie && (
          <motion.div
            key="cookie"
            initial={{ y: -200, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed z-[72] bottom-24 right-7 sm:bottom-28 sm:right-9 text-4xl pointer-events-none select-none"
            aria-hidden
          >
            🍪
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          const now = Date.now();
          const fresh = now - tapAt > 3000 ? 1 : tapCount + 1;
          setTapAt(now);
          setTapCount(fresh);
          if (fresh >= 7) {
            setCookie(true);
            setTapCount(0);
            // Disparar bark del audio del juego (importamos abajo)
            try {
              import("@/components/game/audio").then((m) => (m as any).barkHappy?.());
            } catch {}
            setTimeout(() => setCookie(false), 1800);
          } else {
            setOpen(true);
          }
        }}
        whileTap={{ scale: 0.92 }}
        className="fixed z-[71] bottom-5 right-5 sm:bottom-6 sm:right-6 rounded-full focus:outline-none"
        aria-label={open ? "Cerrar chat" : "Abrir chat con Rex"}
      >
        <div className="relative">
          <RexAvatar size={64} animate={!open} />
          {!open && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-brand-success ring-2 ring-white dark:ring-dark-bg" />
          )}
          {open && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <X className="h-6 w-6 text-white" />
            </span>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[70] bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[560px] max-h-[calc(100vh-120px)] rounded-3xl overflow-hidden glass shadow-2xl flex flex-col"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-light-border dark:border-dark-border"
              style={{
                background:
                  "linear-gradient(180deg, rgba(245,158,11,0.12), transparent)",
              }}
            >
              <RexAvatar size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base font-extrabold">
                    Rex
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-success/15 px-2 py-0.5 text-[10px] font-bold text-brand-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-success" />
                    En línea
                  </span>
                </div>
                <div className="text-[11px] text-light-muted dark:text-dark-muted">
                  Asistente de RescueNow
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm"
            >
              {messages.map((m) =>
                m.from === "rex" ? (
                  <RexBubble
                    key={m.id}
                    text={m.text}
                    suggestions={m.suggestions}
                    onPick={(s) => send(s)}
                  />
                ) : m.from === "user" ? (
                  <UserBubble key={m.id} text={m.text} />
                ) : m.kind === "escalate" ? (
                  <EscalateCard
                    key={m.id}
                    onRedact={openForm}
                  />
                ) : (
                  <SystemNote
                    key={m.id}
                    text="Correo listo para enviar. Revísalo y confirma en tu cliente de correo. 🐾"
                  />
                ),
              )}

              {typing && <TypingBubble />}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-3 py-3 border-t border-light-border dark:border-dark-border flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale algo a Rex..."
                className="flex-1 rounded-full px-4 py-2.5 text-sm bg-black/5 dark:bg-white/5 outline-none focus:ring-2 focus:ring-brand-crimson/30 placeholder:text-light-muted dark:placeholder:text-dark-muted"
              />
              <button
                type="submit"
                aria-label="Enviar"
                disabled={!input.trim()}
                className="h-10 w-10 rounded-full bg-brand-crimson text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <AnimatePresence>
              {showForm && (
                <SupportForm
                  onClose={() => setShowForm(false)}
                  onSent={() => {
                    setShowForm(false);
                    setMessages((m) => [
                      ...m,
                      { id: uid(), from: "system", kind: "form-sent" },
                    ]);
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RexBubble({
  text,
  suggestions,
  onPick,
}: {
  text: string;
  suggestions?: string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <RexAvatar size={30} />
      <div className="flex-1 min-w-0">
        <div className="inline-block max-w-full rounded-2xl rounded-tl-sm bg-black/5 dark:bg-white/5 px-4 py-2.5 whitespace-pre-wrap">
          <FormattedText text={text} />
        </div>
        {suggestions && suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onPick(s)}
                className="rounded-full border border-brand-crimson/20 bg-brand-crimson/5 text-brand-crimson px-3 py-1 text-xs font-semibold hover:bg-brand-crimson hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-brand-crimson text-white px-4 py-2.5">
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <RexAvatar size={30} />
      <div className="rounded-2xl rounded-tl-sm bg-black/5 dark:bg-white/5 px-4 py-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-light-muted dark:bg-dark-muted animate-bounce" />
        <span
          className="h-1.5 w-1.5 rounded-full bg-light-muted dark:bg-dark-muted animate-bounce"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-light-muted dark:bg-dark-muted animate-bounce"
          style={{ animationDelay: "240ms" }}
        />
      </div>
    </div>
  );
}

function EscalateCard({ onRedact }: { onRedact: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-crimson/30 bg-brand-crimson/5 p-3 flex flex-col gap-2">
      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, tengo una consulta sobre RescueNow")}`}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex items-center gap-3 rounded-xl bg-white dark:bg-black/30 px-3 py-2.5 hover:-translate-y-0.5 transition-transform"
      >
        <div className="h-9 w-9 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">WhatsApp directo</div>
          <div className="text-[11px] text-light-muted dark:text-dark-muted">
            Soporte humano, respuesta rápida
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform" />
      </a>

      <button
        onClick={onRedact}
        className="group flex items-center gap-3 rounded-xl bg-white dark:bg-black/30 px-3 py-2.5 hover:-translate-y-0.5 transition-transform text-left"
      >
        <div className="h-9 w-9 rounded-full bg-brand-medical/15 text-brand-medical flex items-center justify-center">
          <Mail className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">Redactar correo a soporte</div>
          <div className="text-[11px] text-light-muted dark:text-dark-muted">
            Yo te ayudo a componerlo 🐾
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
}

function SystemNote({ text }: { text: string }) {
  return (
    <div className="text-center text-[11px] text-light-muted dark:text-dark-muted italic">
      {text}
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-extrabold">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

function SupportForm({
  onClose,
  onSent,
}: {
  onClose: () => void;
  onSent: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim() || !problem.trim()) return;
    const body = [
      `Hola equipo de RescueNow,`,
      ``,
      `Mi nombre es ${name} y estoy escribiendo desde la página.`,
      phone ? `Mi teléfono de contacto: ${phone}` : null,
      `Mi correo: ${email}`,
      ``,
      `Mi consulta:`,
      problem,
      ``,
      `Gracias.`,
    ]
      .filter(Boolean)
      .join("\n");
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent("Consulta desde web - RescueNow")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    onSent();
  };

  const ready = name.trim() && email.trim() && problem.trim();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "absolute inset-0 flex flex-col",
        "bg-light-surface dark:bg-dark-surfaceAlt",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-light-border dark:border-dark-border">
        <RexAvatar size={40} />
        <div className="flex-1">
          <div className="font-display text-base font-extrabold">
            Componer correo
          </div>
          <div className="text-[11px] text-light-muted dark:text-dark-muted">
            Lleno los datos y te abro tu cliente
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        <Field
          label="Tu nombre"
          value={name}
          onChange={setName}
          placeholder="Ej. Karol Levi"
        />
        <Field
          label="Correo"
          value={email}
          onChange={setEmail}
          placeholder="tu@correo.com"
          type="email"
        />
        <Field
          label="Teléfono (opcional)"
          value={phone}
          onChange={setPhone}
          placeholder="352 188 9522"
          type="tel"
        />
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
            ¿En qué podemos ayudarte?
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={5}
            placeholder="Describe tu consulta con detalle..."
            className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-crimson/30 resize-none"
          />
        </div>
      </div>

      <div className="p-3 border-t border-light-border dark:border-dark-border">
        <button
          onClick={submit}
          disabled={!ready}
          className="w-full rounded-full bg-brand-crimson text-white py-3 text-sm font-bold disabled:opacity-40 hover:-translate-y-0.5 transition-transform"
        >
          Enviar correo a soporte
        </button>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-crimson/30"
      />
    </div>
  );
}
