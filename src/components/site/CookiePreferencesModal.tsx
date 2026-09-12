import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { CookieConsentFields } from "@/components/site/CookieConsentFields";

export function CookiePreferencesModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation("cookies");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("dialogLabel")}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />

      {/* wrapper externo SEM overflow-hidden — só ele fica com "relative",
          pra o pop-out "Preferências salvas" (absolute, poking pra fora do
          card com -top-3) não ser cortado pelo clip do card lá embaixo.
          Antes o overflow-hidden tava no MESMO elemento que o badge, e
          cortava o próprio badge junto com os cantos dos painéis. */}
      <div className="relative w-full max-w-md sm:max-w-2xl">
        {/* o card em si — este SIM tem overflow-hidden, pra clipar os dois
            painéis (cookie + configurações) nos cantos arredondados. */}
        <div className="flex overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_80px_-24px] shadow-black/60">
        {/* painel decorativo — mesma cor do card (bg-surface, herdada do
            wrapper), só pra abrir um respiro do lado das configurações e
            deixar o conjunto mais largo/centralizado. Escondido no mobile
            (sem espaço sobrando pra duas colunas ali). Cookie ilustrado
            (não mais um ícone de linha simples) SEMPRE em preto/branco/
            cinza — nada de marrom/dourado — pra continuar dentro do
            design system monocromático do site. Os tons são fixos (não
            usam currentColor/var de tema) de propósito: um cinza médio
            pro biscoito e quase-preto pras gotas de chocolate leem bem
            tanto no painel escuro quanto no claro, sem precisar de duas
            versões. */}
        <div className="hidden w-44 shrink-0 items-center justify-center border-r border-border sm:flex md:w-52">
          <svg
            className="cookie-float size-24 drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
            viewBox="0 0 200 200"
            aria-hidden
          >
            <defs>
              <radialGradient id="cookie-dough-grad" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#cfcfcf" />
                <stop offset="55%" stopColor="#9c9c9c" />
                <stop offset="100%" stopColor="#707070" />
              </radialGradient>
              <radialGradient id="cookie-chip-grad" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>

            {/* massa — contorno levemente irregular (não um círculo
                perfeito), como um biscoito feito à mão */}
            <path
              d="M 176.35,100.00 C 175.40,111.27 171.80,122.08 167.33,132.42 C 162.86,142.77 157.99,155.47 149.51,162.09 C 141.04,168.71 127.62,169.76 116.47,172.14 C 105.31,174.52 93.29,178.40 82.57,176.37 C 71.85,174.35 60.34,167.39 52.15,160.00 C 43.97,152.61 38.49,142.05 33.45,132.05 C 28.41,122.05 21.90,110.67 21.93,100.00 C 21.96,89.33 28.65,78.12 33.62,68.04 C 38.60,57.95 43.44,46.20 51.76,39.50 C 60.07,32.81 72.75,29.85 83.54,27.88 C 94.33,25.91 105.73,25.74 116.50,27.69 C 127.28,29.64 138.77,33.38 148.19,39.57 C 157.61,45.76 168.34,54.76 173.03,64.83 C 177.73,74.90 177.30,88.73 176.35,100.00 Z"
              fill="url(#cookie-dough-grad)"
              stroke="#5c5c5c"
              strokeWidth="1.5"
            />

            {/* rachaduras */}
            <g stroke="#5f5f5f" strokeWidth="1.4" fill="none" opacity="0.55" strokeLinecap="round">
              <path d="M 70,60 Q 85,75 78,95 T 90,130" />
              <path d="M 130,50 Q 118,70 128,90" />
              <path d="M 145,110 Q 130,120 135,140" />
              <path d="M 55,120 Q 65,135 60,150" />
              <path d="M 100,140 Q 105,155 95,165" />
            </g>

            {/* gotas de chocolate */}
            <g fill="url(#cookie-chip-grad)" stroke="#000000" strokeWidth="0.5">
              <path d="M 70.82,55.00 C 70.71,57.32 69.49,60.16 67.96,61.68 C 66.42,63.19 64.00,63.38 61.61,64.11 C 59.22,64.84 55.23,67.09 53.61,66.06 C 52.00,65.04 52.57,60.42 51.91,57.95 C 51.25,55.47 49.38,53.59 49.65,51.23 C 49.92,48.88 51.55,44.65 53.54,43.80 C 55.52,42.96 59.04,45.51 61.56,46.17 C 64.07,46.82 67.08,46.29 68.63,47.76 C 70.17,49.23 70.93,52.68 70.82,55.00 Z" />
              <path d="M 129.79,48.00 C 129.75,50.23 129.15,52.65 127.86,54.60 C 126.57,56.54 124.19,59.36 122.06,59.69 C 119.93,60.01 116.99,57.91 115.08,56.53 C 113.16,55.15 111.38,53.45 110.57,51.43 C 109.77,49.42 109.39,46.26 110.24,44.45 C 111.10,42.63 113.78,41.60 115.69,40.54 C 117.61,39.48 119.68,37.99 121.75,38.10 C 123.81,38.21 126.76,39.55 128.10,41.20 C 129.44,42.85 129.83,45.77 129.79,48.00 Z" />
              <path d="M 153.05,85.00 C 153.02,87.11 153.52,89.66 152.46,91.26 C 151.40,92.85 148.80,94.13 146.69,94.58 C 144.58,95.04 141.30,95.15 139.81,93.99 C 138.31,92.84 138.09,89.60 137.71,87.65 C 137.34,85.70 136.96,83.83 137.55,82.29 C 138.13,80.75 139.73,79.26 141.20,78.42 C 142.67,77.57 144.47,77.17 146.37,77.21 C 148.27,77.24 151.49,77.32 152.60,78.62 C 153.72,79.92 153.07,82.89 153.05,85.00 Z" />
              <path d="M 48.85,95.00 C 49.01,97.05 49.01,100.01 47.81,101.55 C 46.61,103.10 43.81,103.87 41.64,104.28 C 39.46,104.70 36.70,105.00 34.77,104.06 C 32.85,103.11 30.48,100.58 30.08,98.61 C 29.69,96.64 31.40,93.97 32.40,92.23 C 33.40,90.50 34.47,89.62 36.07,88.19 C 37.67,86.77 40.20,83.51 41.99,83.69 C 43.79,83.87 45.71,87.37 46.85,89.25 C 47.99,91.14 48.69,92.95 48.85,95.00 Z" />
              <path d="M 88.55,100.00 C 88.85,102.68 87.41,106.85 85.49,108.81 C 83.58,110.76 79.71,111.66 77.07,111.74 C 74.43,111.82 71.44,110.73 69.63,109.30 C 67.82,107.88 67.32,105.49 66.20,103.20 C 65.08,100.92 62.44,97.84 62.92,95.60 C 63.40,93.36 66.68,91.21 69.08,89.74 C 71.48,88.28 74.89,86.34 77.32,86.83 C 79.76,87.33 81.81,90.52 83.68,92.72 C 85.55,94.91 88.25,97.32 88.55,100.00 Z" />
              <path d="M 120.10,110.00 C 120.53,112.06 120.03,115.32 118.69,117.30 C 117.36,119.27 114.29,121.75 112.09,121.84 C 109.88,121.94 107.56,119.20 105.46,117.86 C 103.37,116.52 100.45,115.75 99.50,113.82 C 98.55,111.89 98.90,108.46 99.76,106.27 C 100.62,104.09 102.70,101.46 104.64,100.72 C 106.59,99.99 109.54,101.14 111.44,101.84 C 113.34,102.54 114.62,103.55 116.07,104.91 C 117.51,106.27 119.66,107.94 120.10,110.00 Z" />
              <path d="M 142.67,130.00 C 142.77,132.01 143.47,134.70 142.47,136.27 C 141.47,137.83 138.64,139.15 136.66,139.39 C 134.67,139.63 132.05,138.84 130.54,137.72 C 129.03,136.61 128.45,134.56 127.60,132.69 C 126.75,130.83 125.07,128.45 125.45,126.53 C 125.84,124.60 128.04,122.06 129.89,121.15 C 131.74,120.24 134.57,120.58 136.57,121.09 C 138.57,121.60 140.89,122.72 141.91,124.20 C 142.93,125.69 142.58,127.99 142.67,130.00 Z" />
              <path d="M 75.40,140.00 C 75.82,142.45 76.38,146.32 75.01,148.40 C 73.64,150.48 69.67,152.48 67.20,152.47 C 64.73,152.46 62.56,149.68 60.19,148.33 C 57.82,146.98 54.00,146.43 52.97,144.38 C 51.95,142.32 52.77,138.01 54.04,136.01 C 55.32,134.01 58.40,133.89 60.61,132.39 C 62.82,130.89 65.31,126.79 67.29,127.01 C 69.28,127.22 71.17,131.52 72.52,133.69 C 73.87,135.85 74.99,137.55 75.40,140.00 Z" />
              <path d="M 103.14,150.00 C 102.82,151.82 101.73,153.62 100.56,154.67 C 99.39,155.71 97.74,155.79 96.10,156.25 C 94.46,156.70 92.01,158.04 90.73,157.40 C 89.45,156.75 88.85,154.03 88.44,152.39 C 88.03,150.75 87.83,149.06 88.29,147.56 C 88.74,146.06 89.82,144.37 91.18,143.39 C 92.55,142.40 94.60,141.57 96.48,141.63 C 98.35,141.69 101.34,142.36 102.45,143.75 C 103.56,145.15 103.45,148.18 103.14,150.00 Z" />
              <path d="M 156.19,150.00 C 155.93,151.46 155.26,152.62 154.43,153.71 C 153.59,154.81 152.39,156.34 151.16,156.58 C 149.93,156.82 148.11,155.92 147.03,155.14 C 145.95,154.37 145.23,153.18 144.68,151.94 C 144.12,150.70 143.51,149.23 143.71,147.71 C 143.90,146.19 144.58,143.74 145.86,142.82 C 147.13,141.90 149.69,141.84 151.38,142.20 C 153.06,142.55 155.19,143.67 155.99,144.98 C 156.79,146.28 156.45,148.54 156.19,150.00 Z" />
              <path d="M 43.25,130.00 C 43.24,131.82 42.60,133.95 41.48,135.44 C 40.37,136.94 38.27,138.84 36.58,138.98 C 34.90,139.11 32.99,137.26 31.39,136.25 C 29.79,135.24 27.85,134.49 26.98,132.92 C 26.11,131.34 25.64,128.64 26.19,126.79 C 26.74,124.94 28.61,122.42 30.28,121.83 C 31.95,121.23 34.32,122.76 36.20,123.21 C 38.07,123.66 40.36,123.38 41.54,124.51 C 42.71,125.65 43.26,128.18 43.25,130.00 Z" />
            </g>

            {/* brilho pontual em cada gota — sugere "chocolate derretido"
                sem precisar de cor nenhuma */}
            <g fill="#ffffff" opacity="0.35">
              <ellipse cx="58" cy="50" rx="2.6" ry="1.6" transform="rotate(-20 58 50)" />
              <ellipse cx="117" cy="43" rx="2.4" ry="1.5" transform="rotate(-20 117 43)" />
              <ellipse cx="141" cy="80" rx="2.2" ry="1.4" transform="rotate(-20 141 80)" />
              <ellipse cx="37" cy="90" rx="2.2" ry="1.4" transform="rotate(-20 37 90)" />
              <ellipse cx="70" cy="93" rx="2.6" ry="1.6" transform="rotate(-20 70 93)" />
              <ellipse cx="105" cy="104" rx="2.4" ry="1.5" transform="rotate(-20 105 104)" />
            </g>

            {/* brilho geral, canto superior-esquerdo — reforça o volume
                arredondado do biscoito */}
            <ellipse cx="75" cy="65" rx="45" ry="34" fill="#ffffff" opacity="0.1" />
          </svg>
        </div>

        <div className="min-w-0 flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="display text-xl text-foreground">{t("title")}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="-mt-1 -mr-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            {t("description")}
          </p>

          <div className="mt-5">
            <CookieConsentFields onCancel={onClose} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
