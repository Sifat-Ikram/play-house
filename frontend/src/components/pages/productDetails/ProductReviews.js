"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiSend } from "react-icons/fi";

const RatingBar = ({ star, count, total }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-8 text-xs sm:text-sm font-semibold text-[var(--ph-text-soft)] shrink-0"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {star}★
      </span>
      <div className="flex-1 h-2 sm:h-2.5 rounded-full overflow-hidden bg-[var(--ph-border)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--ph-primary)" }}
        />
      </div>
      <span
        className="w-8 text-right text-xs sm:text-sm text-[var(--ph-text-faint)] shrink-0"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {count}
      </span>
    </div>
  );
};

const ReplyRow = ({ reply }) => (
  <div className="flex items-start gap-2.5">
    <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 border border-[var(--ph-border)]">
      <Image
        src={reply.reply_image_url}
        alt={reply.replier_name}
        fill
        className="object-cover"
      />
    </div>
    <div>
      <p
        className="text-[11px] sm:text-xs font-bold text-[var(--ph-text)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {reply.replier_name}
      </p>
      <p
        className="text-[11px] sm:text-xs text-[var(--ph-text-soft)] leading-relaxed"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {reply.reply_comment}
      </p>
    </div>
  </div>
);

const ReplyForm = ({ reviewId, onSubmitReply }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmitReply?.(reviewId, trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 rounded-full border px-3.5 py-2 text-xs sm:text-sm outline-none transition-colors"
        style={{
          borderColor: "var(--ph-border)",
          backgroundColor: "var(--ph-bg)",
          color: "var(--ph-text)",
          fontFamily: "var(--font-body)",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        type="submit"
        aria-label="Send reply"
        className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: "var(--ph-accent)" }}
      >
        <FiSend className="text-xs sm:text-sm" />
      </motion.button>
    </form>
  );
};

const ReviewCard = ({ review, onSubmitReply }) => {
  const replies = review.replies || [];

  return (
    <div className="border-b border-[var(--ph-border)] py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border border-[var(--ph-border)]">
          <Image
            src={review.user_image_url}
            alt={review.user_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-xs sm:text-sm font-bold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {review.user_name}
          </p>

          <div className="flex items-center gap-1 mt-0.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className="text-xs sm:text-sm"
                style={{
                  color:
                    i < review.review_rating
                      ? "var(--ph-primary)"
                      : "var(--ph-border)",
                  fill: i < review.review_rating ? "var(--ph-primary)" : "none",
                }}
              />
            ))}
          </div>

          <p
            className="text-xs sm:text-sm text-[var(--ph-text-soft)] leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {review.review_comment}
          </p>

          {/* Replies — always visible, no toggle */}
          {replies.length > 0 && (
            <div
              className="mt-3 ml-2 sm:ml-3 space-y-3 border-l-2 pl-3 sm:pl-4"
              style={{ borderColor: "var(--ph-border)" }}
            >
              {replies.map((reply) => (
                <ReplyRow key={reply.reply_id} reply={reply} />
              ))}
            </div>
          )}

          {/* Anyone can reply — no sign-in required */}
          <ReplyForm
            reviewId={review.review_id}
            onSubmitReply={onSubmitReply}
          />
        </div>
      </div>
    </div>
  );
};

const ProductReviews = ({ reviews = [], onSubmitReply }) => {
  const { average, total, breakdown } = useMemo(() => {
    const total = reviews.length;

    if (total === 0) {
      return {
        average: 0,
        total: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rating = Math.round(r.review_rating || 0);
      if (breakdown[rating] !== undefined) breakdown[rating] += 1;
      sum += r.review_rating || 0;
    });

    return { average: sum / total, total, breakdown };
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-6 text-center">
        <p
          className="text-sm text-[var(--ph-text-faint)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          No reviews yet for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 sm:p-6 md:p-8">
      <h3
        className="text-lg sm:text-xl font-semibold text-[var(--ph-text)] mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Ratings & Reviews
      </h3>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 pb-6 mb-6 border-b border-[var(--ph-border)]">
        <div className="flex flex-col items-center justify-center shrink-0 sm:w-32">
          <p
            className="text-3xl sm:text-4xl font-bold text-[var(--ph-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {average.toFixed(1)}
            <span className="text-base sm:text-lg text-[var(--ph-text-faint)]">
              /5
            </span>
          </p>
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className="text-sm sm:text-base"
                style={{
                  color:
                    i < Math.round(average)
                      ? "var(--ph-primary)"
                      : "var(--ph-border)",
                  fill: i < Math.round(average) ? "var(--ph-primary)" : "none",
                }}
              />
            ))}
          </div>
          <p
            className="text-[11px] sm:text-xs text-[var(--ph-text-faint)] mt-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {total} {total === 1 ? "Rating" : "Ratings"}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 justify-center">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              star={star}
              count={breakdown[star]}
              total={total}
            />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div>
        {reviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            review={review}
            onSubmitReply={onSubmitReply}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
