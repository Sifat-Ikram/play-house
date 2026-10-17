"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { sendChat } from "@/app/ai-assistant/actions";

const STARTER_PROMPTS = [
  "A gift for a 5-year-old who loves cars",
  "Something educational for a 3 year old",
  "Birthday gift under BDT 2000",
  "Building blocks for a creative kid",
];

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi there! 👋 I'm your Play House assistant. Tell me what kind of toy you're looking for — the child's age, interests, or occasion — and I'll find the perfect match!",
  products: [],
};

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: "var(--ph-accent)" }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const ProductMiniCard = ({ product }) => (
  <Link
    href={`/productDetails/${encodeURIComponent(product.product_name)}`}
    className="flex w-[160px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-surface)] shadow-sm transition-shadow hover:shadow-lg sm:w-[180px]"
  >
    <div
      className="relative aspect-[4/3] w-full"
      style={{
        background:
          "linear-gradient(to bottom, var(--ph-accent-soft), var(--ph-surface))",
      }}
    >
      <Image
        src={product.display_image_url || "/placeholder.png"}
        alt={product.product_name}
        fill
        sizes="180px"
        className="object-contain p-2"
      />
    </div>
    <div className="p-2.5">
      <p
        className="truncate text-[11px] font-semibold uppercase tracking-wide text-[var(--ph-primary-dark)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {product.brand_name || "Toy Store"}
      </p>
      <p
        className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[var(--ph-text)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {product.product_name}
      </p>
      <p
        className="mt-1 text-xs font-bold"
        style={{
          color: "var(--ph-primary-dark)",
          fontFamily: "var(--font-display)",
        }}
      >
        BDT {Number(product.selling_price).toLocaleString()}
      </p>
    </div>
  </Link>
);

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] gap-2.5 sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isUser && (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--ph-primary-soft)" }}
          >
            <HiOutlineSparkles
              className="text-sm"
              style={{ color: "var(--ph-primary-dark)" }}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2.5">
          <div
            className="px-4 py-2.5 text-sm leading-relaxed"
            style={{
              backgroundColor: isUser
                ? "var(--ph-accent)"
                : "var(--ph-surface)",
              color: isUser ? "#FFFFFF" : "var(--ph-text)",
              border: isUser ? "none" : "1px solid var(--ph-border)",
              fontFamily: "var(--font-body)",
              borderRadius: isUser
                ? "20px 20px 4px 20px"
                : "20px 20px 20px 4px",
            }}
          >
            {message.content}
          </div>

          {message.products?.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {message.products.map((p) => (
                <ProductMiniCard
                  key={p.inventory_id ?? p.product_id}
                  product={p}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AIAssistantContent = ({ initialProducts = [] }) => {
  const [messages, setMessages] = useState([
    { ...WELCOME_MESSAGE, products: initialProducts },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length <= 1 && !isLoading) return;

    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = messages
      .slice(1)
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendChat(trimmed, history);

      setMessages((prev) => [
        ...prev,
        result?.ok
          ? {
              role: "assistant",
              content: result.reply,
              products: result.products,
            }
          : {
              role: "assistant",
              content: result?.message || "Sorry, something went wrong.",
              products: [],
              isError: true,
            },
      ]);
    } catch (error) {
      console.error("sendChat failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hmm, I couldn't connect right now. Please try again.",
          products: [],
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(messages);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header strip */}
      <section
        className="relative isolate overflow-hidden"
        style={{ backgroundColor: "#FCD98C" }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl sm:h-40 sm:w-40"
          style={{ backgroundColor: "var(--ph-primary-dark)", opacity: 0.35 }}
        />
        <div className="ph-container relative z-10 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
              style={{ backgroundColor: "var(--ph-surface)" }}
            >
              <HiOutlineSparkles
                className="text-xl"
                style={{ color: "var(--ph-primary-dark)" }}
              />
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs"
                style={{
                  color: "var(--ph-primary-dark)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Play House
              </p>
              <h1
                className="text-lg font-semibold text-[#1E2B2B] sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AI Toy Assistant
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Chat area */}
      <div className="flex-1">
        <div className="ph-container space-y-4 py-5 sm:py-7">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--ph-primary-soft)" }}
                >
                  <HiOutlineSparkles
                    className="text-sm"
                    style={{ color: "var(--ph-primary-dark)" }}
                  />
                </div>
                <div
                  className="rounded-[20px_20px_20px_4px] border"
                  style={{
                    borderColor: "var(--ph-border)",
                    backgroundColor: "var(--ph-surface)",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Starter prompts — শুধু প্রথম user message-এর আগে */}
      {messages.length === 1 && (
        <div className="ph-container pb-3">
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-[var(--ph-primary-soft)]"
                style={{
                  borderColor: "var(--ph-border)",
                  color: "var(--ph-text)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-[var(--ph-border)] bg-[var(--ph-bg)]">
        <form
          onSubmit={handleSubmit}
          className="ph-container flex items-start gap-2.5 py-3.5 sm:py-4"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about any toy..."
            disabled={isLoading}
            rows={3}
            className="flex-1 resize-none overflow-y-auto rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--ph-primary)]"
            style={{
              borderColor: "var(--ph-border)",
              backgroundColor: "var(--ph-surface)",
              color: "var(--ph-text)",
              fontFamily: "var(--font-body)",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md disabled:opacity-50"
            style={{ backgroundColor: "var(--ph-accent)" }}
          >
            <FiSend className="text-base" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantContent;
