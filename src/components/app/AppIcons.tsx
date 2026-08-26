import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.8 5.2A2.2 2.2 0 0 1 7 3h12v16H7a2.2 2.2 0 0 0-2.2 2.2V5.2Z" />
      <path d="M4.8 5.2v16" />
      <path d="M8 7h7" />
      <path d="M8 10h6" />
    </IconBase>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.3 8.7-2 5.1-4.6 1.5 2-5.1 4.6-1.5Z" />
    </IconBase>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m8 18-5 2V5l5-2 8 3 5-2v15l-5 2-8-3Z" />
      <path d="M8 3v15" />
      <path d="M16 6v15" />
    </IconBase>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 13.7 9l5.3 1.8-5.3 1.8L12 18l-1.7-5.4L5 10.8 10.3 9 12 3.5Z" />
      <path d="m18.5 15.5.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1Z" />
    </IconBase>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.2 2.2 0 0 1-3.1 3.1l-.05-.04a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.08 1.65V21.5a2.2 2.2 0 0 1-4.4 0v-.13a1.8 1.8 0 0 0-1.08-1.65 1.8 1.8 0 0 0-1.98.36l-.05.04a2.2 2.2 0 0 1-3.1-3.1l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-1.65-1.08H2.8a2.2 2.2 0 0 1 0-4.4h.15A1.8 1.8 0 0 0 4.6 8.44a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.2 2.2 0 0 1 3.1-3.1l.05.04a1.8 1.8 0 0 0 1.98.36 1.8 1.8 0 0 0 1.08-1.65V1.9a2.2 2.2 0 0 1 4.4 0v.17a1.8 1.8 0 0 0 1.08 1.65 1.8 1.8 0 0 0 1.98-.36l.05-.04a2.2 2.2 0 0 1 3.1 3.1l-.04.04a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.65 1.08h.13a2.2 2.2 0 0 1 0 4.4h-.13A1.8 1.8 0 0 0 19.4 15Z" />
    </IconBase>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 7V5.8A2.8 2.8 0 0 1 12.8 3H18v18h-5.2A2.8 2.8 0 0 1 10 18.2V17" />
      <path d="M4 12h10" />
      <path d="m7.5 8.5-3.5 3.5 3.5 3.5" />
    </IconBase>
  );
}

export function SidebarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M9 5v14" />
      <path d="m15 9-2.8 3 2.8 3" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </IconBase>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m21 3-6.8 18-3.1-7.7L3 10.2 21 3Z" />
      <path d="m11.1 13.3 4.5-4.5" />
    </IconBase>
  );
}
