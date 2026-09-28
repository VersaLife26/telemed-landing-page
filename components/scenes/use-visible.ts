"use client";

import { useEffect, useState } from "react";

export function useVisible<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(node);
    return () => io.disconnect();
  }, [node]);

  return { setNode, visible };
}
