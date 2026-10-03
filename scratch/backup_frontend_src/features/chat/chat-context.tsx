"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { useChat, type ChatState } from "./use-chat";

export type ChatContextValue = ChatState;

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Provider untuk sinkronisasi state sesi obrolan antara Kolom 2 (Session Drawer)
 * dan Kolom 3 (Main Chat Canvas).
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

/**
 * Hook untuk mengakses sesi dan pesan aktif dari mana saja dalam AppShell.
 */
export function useChatContext(): ChatState {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext harus digunakan di dalam <ChatProvider>");
  }
  return ctx;
}
