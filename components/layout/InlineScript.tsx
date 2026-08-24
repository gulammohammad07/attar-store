'use client';

import { useEffect } from 'react';

export function InlineScript({ html }: { html: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = html;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [html]);

  return null;
}
