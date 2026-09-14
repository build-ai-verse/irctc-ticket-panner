"use client";

import { useEffect, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Renders a mailto link whose address is assembled after mount, so the raw
 * email is not a plain-text node in the server-rendered HTML — a light guard
 * against naive email harvesters. Stays clickable and accessible.
 */
export default function ContactEmail({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [href, setHref] = useState<string>();
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (!CONTACT_EMAIL) return;
    setHref(`mailto:${CONTACT_EMAIL}`);
    setText(CONTACT_EMAIL);
  }, []);

  if (!CONTACT_EMAIL) return null;

  return (
    <a href={href} className={className} aria-label="Email us">
      {children ?? text ?? "Email"}
    </a>
  );
}
