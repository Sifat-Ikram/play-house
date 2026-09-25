"use client";

import { useState, useEffect } from "react";

const parseDescription = (description) => {
    if (!description) return null;

    const doc = new DOMParser().parseFromString(description, "text/html");

    const handleList = (nodeList) => {
        return Array.from(nodeList).map((item, index) => {
            const text = item.textContent || item.innerText;
            return <li key={index}>{text}</li>;
        });
    };

    const handleLists = (listType, listElements) => {
        return Array.from(listElements).map((list, index) => {
            return listType === "ol" ? (
                <ol key={index}>{handleList(list.children)}</ol>
            ) : (
                <ul key={index}>{handleList(list.children)}</ul>
            );
        });
    };

    const handleTextWithStyles = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        const tagName = node.tagName.toLowerCase();
        let content = node.textContent;

        switch (tagName) {
            case "strong":
                return <strong>{content}</strong>;
            case "em":
                return <em>{content}</em>;
            case "u":
                return <u>{content}</u>;
            case "i":
                return <i>{content}</i>;
            default:
                return content;
        }
    };

    const handleOtherElements = (nodeList) => {
        return Array.from(nodeList).map((item, index) => {
            const tagName = item.tagName.toLowerCase();
            switch (tagName) {
                case "p":
                    return <p key={index}>{handleTextWithStyles(item)}</p>;
                case "h1":
                    return <h1 key={index}>{handleTextWithStyles(item)}</h1>;
                case "h2":
                    return <h2 key={index}>{handleTextWithStyles(item)}</h2>;
                case "h3":
                    return <h3 key={index}>{handleTextWithStyles(item)}</h3>;
                case "h4":
                    return <h4 key={index}>{handleTextWithStyles(item)}</h4>;
                case "h5":
                    return <h5 key={index}>{handleTextWithStyles(item)}</h5>;
                case "h6":
                    return <h6 key={index}>{handleTextWithStyles(item)}</h6>;
                case "a":
                    return (
                        <a key={index} href={item.href} target="_blank" rel="noopener noreferrer">
                            {handleTextWithStyles(item)}
                        </a>
                    );
                default:
                    return <span key={index}>{handleTextWithStyles(item)}</span>;
            }
        });
    };

    const orderedLists = doc.querySelectorAll("ol");
    const unorderedLists = doc.querySelectorAll("ul");
    const otherElements = doc.body.children;

    if (
        orderedLists.length === 0 &&
        unorderedLists.length === 0 &&
        otherElements.length === 0
    ) {
        return <p>{doc.body.textContent}</p>;
    }

    return (
        <>
            {orderedLists.length > 0 && handleLists("ol", orderedLists)}
            {unorderedLists.length > 0 && handleLists("ul", unorderedLists)}
            {handleOtherElements(otherElements)}
        </>
    );
};

const ProductDescription = ({ description }) => {
    const [content, setContent] = useState(null);

    // DOMParser is browser-only; parsing happens after mount so the very
    // first render (server AND client) stays identical — no hydration mismatch.
    useEffect(() => {
        if (!description) {
            setContent(null);
            return;
        }
        setContent(parseDescription(description));
    }, [description]);

    if (!description) return null;

    return (
        <div
            className="prose prose-sm sm:prose-base max-w-none text-[var(--ph-text-soft)] leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_a]:text-[var(--ph-accent)] [&_a]:underline"
            style={{ fontFamily: "var(--font-body)" }}
        >
            {content ?? (
                // Lightweight placeholder shown during SSR and the brief moment
                // before the client-side parse effect runs.
                <p className="animate-pulse text-[var(--ph-text-faint)]">Loading description…</p>
            )}
        </div>
    );
};

export default ProductDescription;