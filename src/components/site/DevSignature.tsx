import { useEffect, useRef, useState } from "react";
import { DEVELOPER_NAME, DEVELOPER_URL } from "@/data/site";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

export function DevSignature() {
  const [open, setOpen] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const title =
      "font-size:18px;font-weight:800;color:#fff;background:#0d0d0e;padding:8px 14px;border-radius:4px;";
    const body = "font-size:12px;color:#9ca3af;";
    const link = "font-size:12px;color:#9ca3af;text-decoration:underline;";

    console.log("%cAll Frames Technology", title);
    console.log(`%cSite desenvolvido por ${DEVELOPER_NAME}\n%c${DEVELOPER_URL}`, body, link);
    console.log(
      "%cTem um easter egg escondido por aqui: o código Konami de qualquer joguinho antigo (↑ ↑ ↓ ↓ ← → ← → B A) também funciona neste site.",
      body,
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      const expected = KONAMI_SEQUENCE[progressRef.current];
      if (e.code === expected) {
        progressRef.current += 1;
        if (progressRef.current === KONAMI_SEQUENCE.length) {
          progressRef.current = 0;
          setOpen(true);
        }
      } else {
        progressRef.current = e.code === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Assinatura do desenvolvedor"
    >
      <div className="absolute inset-0 bg-black/80" onClick={() => setOpen(false)} aria-hidden />

      <div className="dev-signature-in relative w-full max-w-sm">
        <div
          aria-hidden
          className="glow-drift signature-rgb-glow absolute -inset-1 rounded-2xl opacity-80"
          style={{
            background:
              "conic-gradient(from 0deg, #ff2e63, #ffd23f, #3df58f, #3fa9f5, #b53fff, #ff2e63)",
          }}
        />

        <div className="relative rounded-2xl border border-border bg-surface p-7 text-center shadow-[0_24px_80px_-24px] shadow-black/60">
          <span className="eyebrow">Easter egg encontrado</span>
          <p className="display mt-4 text-2xl text-foreground">{DEVELOPER_NAME}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            Esse site foi construído por aqui. Valeu por curtir o projeto de perto
            (e por lembrar o código Konami).
          </p>

          <a
            href={DEVELOPER_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-background uppercase transition-colors hover:bg-foreground/90"
          >
            {DEVELOPER_URL.replace("https://", "")}
          </a>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-5 block w-full text-[11px] tracking-wide text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            ESC ou clique fora pra fechar
          </button>
        </div>
      </div>
    </div>
  );
}
