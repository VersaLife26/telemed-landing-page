"use client";

import { useEffect, useState } from "react";

export function useVisible<T extends HTMLElement>(rootMargin = "120px") {
  const [node, setNode] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(node);
    return () => io.disconnect();
  }, [node, rootMargin]);

  return { setNode, visible };
}
