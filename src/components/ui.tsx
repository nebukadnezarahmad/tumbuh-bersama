import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

const paths: Record<string, ReactNode> = {
  today: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </>
  ),
  plan: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18M8 15h3M8 18h6" />
    </>
  ),
  notes: (
    <>
      <path d="M4 20 20 4M6 4h8M4 6v8" />
      <path d="M9 15h6" />
    </>
  ),
  guide: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16M8 7h8M8 11h8" />
    </>
  ),
  family: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c2.8 0 5 2.2 5 5" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  check: <path d="m4 12 5 5L20 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 21h20z" />
      <path d="M12 9v5M12 17.5v.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  print: (
    <>
      <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="14" width="10" height="7" />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.5M3 12h.5M3 18h.5" />,
  shield: (
    <>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  heart: (
    <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z" />
  ),
  utensils: (
    <>
      <path d="M5 3v7a2 2 0 0 0 4 0V3M7 10v11M17 3c-2 2-3 5-3 9h4V3M17 12v9" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1" transform="rotate(-45 12 12)" />
      <path d="M8 10h2M11 13h2M14 16h2" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
}: {
  name: keyof typeof paths | string;
  size?: number;
}) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? null}
    </svg>
  );
}

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "teal" | "clay" | "warn" | "danger" | "success";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function DemoTag() {
  return <span className="demo-tag">Data contoh</span>;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="toggle-row">
      <div className="toggle-copy">
        <span id={id} className="toggle-label">
          {label}
        </span>
        {description ? <span className="field-hint">{description}</span> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        className={cx("switch", checked && "is-on")}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("modal", wide && "modal-wide")}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Tutup dialog"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p className="muted">{children}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <span className="field-error" role="alert">
      {children}
    </span>
  );
}

export function SkipLink({ target, children }: { target: string; children: ReactNode }) {
  return <a className="skip-link" href={`#${target}`} onClick={(event) => {
    const element = document.getElementById(target);
    if (!element) return;
    // Focus the content without replacing the hash used by the app router.
    event.preventDefault();
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: "start" });
  }}>{children}</a>;
}

export function SectionHead({
  kicker,
  title,
  lede,
  action,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h2>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}
