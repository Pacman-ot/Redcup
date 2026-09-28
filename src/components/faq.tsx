import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export interface QA {
  q: string;
  a: string;
}

// Native <details>: works without JavaScript and with the keyboard.
export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
            {item.q}
            <CaretDown
              size={20}
              className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-[62ch] pr-10 pb-6 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
