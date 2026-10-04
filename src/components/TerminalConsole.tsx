import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalConsoleProps {
  serviceId: string;
}

export default function TerminalConsole({ serviceId }: TerminalConsoleProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
      theme: {
        background: '#0a0a0b',
        foreground: '#e2e8f0',
        cursor: '#f97316',
        selectionBackground: 'rgba(249, 115, 22, 0.3)',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    // Connect WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/console`);
    socketRef.current = socket;

    socket.onopen = () => {
      term.writeln('\x1b[32m[SYSTEM] WebSocket Connection Established\x1b[0m');
    };

    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'output') {
        term.write(payload.data);
      }
    };

    socket.onclose = () => {
      term.writeln('\r\n\x1b[31m[SYSTEM] WebSocket Connection Closed\x1b[0m');
    };

    term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'input', data }));
      }
    });

    // Handle Resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.close();
      term.dispose();
    };
  }, [serviceId]);

  return (
    <div className="w-full h-[500px] bg-[#0a0a0b] rounded-2xl border border-white/5 overflow-hidden p-4">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
}
