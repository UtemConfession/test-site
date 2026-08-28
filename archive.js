// archive.js — Confessions Archive Client Engine (Manual Local Dataset, Search, Filter & Modal)

// DOM Element Selectors
const archiveSearch = document.getElementById("archiveSearch");
const archiveContainer = document.getElementById("archiveContainer");
const archiveCatPills = document.getElementById("archiveCatPills");

// Pagination & Query State
let currentVisibleLimit = 12; // Initial cards shown
const pageIncrement = 12;     // Increment on Load More
let currentCategory = "all";

/**
 * Ensures Read More Modal overlay container exists in DOM
 */
function ensureArchiveModalExists() {
    let modal = document.getElementById("archiveDetailModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "archiveDetailModal";
        modal.className = "archive-modal-overlay";
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px);
            display: none; justify-content: center; align-items: center;
            z-index: 9999; padding: 20px; box-sizing: border-box;
        `;
        modal.innerHTML = `
            <div class="archive-modal-content" style="
                background: var(--bg-surface, #1e293b); color: var(--text-primary, #f8fafc);
                border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
                border-radius: 16px; width: 100%; max-width: 620px; max-height: 85vh;
                overflow-y: auto; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
                position: relative; animation: modalFadeIn 0.2s ease-out;
            ">
                <button id="closeArchiveModalBtn" style="
                    position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.1);
                    border: none; color: #f8fafc; font-size: 1.2rem; width: 32px; height: 32px;
                    border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s;
                " aria-label="Close modal">&times;</button>
                <div id="archiveModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind close events
        modal.querySelector("#closeArchiveModalBtn").addEventListener("click", closeArchiveModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeArchiveModal();
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeArchiveModal();
        });
    }
}

/**
 * Helper to count number of replies in reply string
 */
function getReplyCount(reply) {
    if (!reply) return 0;
    const matches = reply.match(/↳/g);
    return (matches && matches.length > 0) ? matches.length : 1;
}

/**
 * Opens Read More Modal displaying full confession content & metadata
 */
function openArchiveModal(item) {
    ensureArchiveModalExists();
    const modal = document.getElementById("archiveDetailModal");
    const body = document.getElementById("archiveModalBody");
    if (!modal || !body) return;

    const categoryBadgeColor = getCategoryColor(item.category);
    const replyCount = getReplyCount(item.reply);

    let replyHtml = "";
    if (item.reply) {
        replyHtml = `
            <div style="margin-top: 18px; padding: 14px 16px; background: rgba(212, 175, 55, 0.08); border-left: 3px solid var(--accent-gold, #d4af37); border-radius: 0 10px 10px 0;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-gold, #d4af37); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>💬 ${replyCount > 1 ? `${replyCount} Replies` : "Reply"}</span>
                </div>
                <div style="font-size: 0.92rem; line-height: 1.6; color: var(--text-primary, #f8fafc); white-space: pre-wrap;">${escapeHtml(item.reply)}</div>
            </div>
        `;
    }

    body.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
            <span style="background:${categoryBadgeColor.bg}; color:${categoryBadgeColor.text}; font-weight:700; font-size:0.8rem; padding:4px 12px; border-radius:12px; border: 1px solid ${categoryBadgeColor.border};">
                ${escapeHtml(item.category || "General")}
            </span>
            ${item.reply ? `<span style="background: rgba(255,255,255,0.08); color: var(--text-secondary, #cbd5e1); font-weight:600; font-size:0.75rem; padding:3px 10px; border-radius:12px; border: 1px solid rgba(255,255,255,0.12);">💬 ${replyCount} ${replyCount > 1 ? "Replies" : "Reply"}</span>` : ""}
        </div>
        <div style="font-size: 0.95rem; line-height: 1.65; color: var(--text-secondary, #cbd5e1); white-space: pre-wrap; margin-bottom: 14px; border-left: 3px solid var(--accent-gold, #d4af37); padding-left: 14px;">${escapeHtml(item.content)}</div>
        ${replyHtml}
        ${item.telegramLink ? `
            <div style="display:flex; justify-content:flex-end; align-items:center; border-top:1px solid var(--border-color, rgba(255,255,255,0.1)); padding-top:12px; margin-top:16px; font-size:0.85rem;">
                <a href="${escapeHtml(item.telegramLink)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-gold, #d4af37); text-decoration:none; font-weight:700; display:inline-flex; align-items:center; gap:6px;">✈️ View Original Post</a>
            </div>
        ` : ""}
    `;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeArchiveModal() {
    const modal = document.getElementById("archiveDetailModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}

/**
 * Returns distinct badge styling per category
 */
function getCategoryColor(category) {
    const cat = (category || "").toLowerCase();
    switch (cat) {
        case "rant":
            return { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc", border: "rgba(168, 85, 247, 0.3)" };
        case "funny":
        case "humor":
            return { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80", border: "rgba(34, 197, 94, 0.3)" };
        case "advise":
        case "advice":
            return { bg: "rgba(14, 165, 233, 0.15)", text: "#38bdf8", border: "rgba(14, 165, 233, 0.3)" };
        case "question":
            return { bg: "rgba(99, 102, 241, 0.15)", text: "#818cf8", border: "rgba(99, 102, 241, 0.35)" };
        case "romance":
        case "love":
            return { bg: "rgba(236, 72, 153, 0.15)", text: "#f472b6", border: "rgba(236, 72, 153, 0.3)" };
        case "random":
            return { bg: "rgba(168, 162, 158, 0.15)", text: "#d6d3d1", border: "rgba(168, 162, 158, 0.3)" };
        case "horror":
            return { bg: "rgba(249, 115, 22, 0.15)", text: "#fb923c", border: "rgba(249, 115, 22, 0.3)" };
        case "academic":
            return { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" };
        case "campus":
            return { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)" };
        default:
            return { bg: "rgba(212, 175, 55, 0.15)", text: "#d4af37", border: "rgba(212, 175, 55, 0.3)" };
    }
}

/**
 * Filter, sort and render confessions from manual dataset
 */
function renderArchiveConfessions() {
    if (!archiveContainer) return;
    archiveContainer.innerHTML = "";
    archiveContainer.style.display = "flex";
    archiveContainer.style.flexDirection = "column";
    archiveContainer.style.gap = "14px";

    const rawList = (typeof archiveData !== "undefined" && Array.isArray(archiveData)) ? archiveData : [];

    const searchQuery = archiveSearch ? archiveSearch.value.trim().toLowerCase() : "";

    // 1. Filter by category and search keyword
    let filtered = rawList.filter(item => {
        // Category filter
        if (currentCategory !== "all") {
            const itemCat = (item.category || "").toLowerCase();
            const targetCat = currentCategory.toLowerCase();
            if (itemCat !== targetCat) {
                const isAdviseAlias = (targetCat === "advise" || targetCat === "advice") && (itemCat === "advise" || itemCat === "advice");
                const isRomanceAlias = (targetCat === "romance" || targetCat === "love") && (itemCat === "romance" || itemCat === "love");
                const isFunnyAlias = (targetCat === "funny" || targetCat === "humor") && (itemCat === "funny" || itemCat === "humor");
                if (!isAdviseAlias && !isRomanceAlias && !isFunnyAlias) return false;
            }
        }

        // Search query
        if (searchQuery) {
            const matchContent = (item.content || "").toLowerCase().includes(searchQuery);
            const matchReply = (item.reply || "").toLowerCase().includes(searchQuery);
            const matchTags = (item.tags || "").toLowerCase().includes(searchQuery);
            const matchCategory = (item.category || "").toLowerCase().includes(searchQuery);
            if (!matchContent && !matchReply && !matchTags && !matchCategory) return false;
        }

        return true;
    });

    // 2. Sort results (latest first)
    filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    // 3. Render empty state if no results
    if (filtered.length === 0) {
        archiveContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px 20px; background: var(--bg-secondary); border-radius: 12px; border: 1px dashed var(--border-color);">
                <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
                <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">No archived confessions found matching your criteria.</p>
                <p style="margin: 6px 0 0 0; font-size: 0.82rem; color: var(--text-secondary);">Try clearing your search terms or selecting a different category filter.</p>
            </div>
        `;
        return;
    }

    // 4. Paginate items
    const visibleItems = filtered.slice(0, currentVisibleLimit);

    visibleItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "archive-card";
        card.style.cssText = `
            background: var(--bg-secondary, #1e293b); border: 1px solid var(--border-color, rgba(255,255,255,0.08));
            border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
            cursor: pointer;
        `;

        const isLongText = (item.content || "").length > 140;
        const displayText = isLongText ? item.content.substring(0, 137).trim() + "..." : item.content;
        const categoryBadgeColor = getCategoryColor(item.category);
        const replyCount = getReplyCount(item.reply);

        let replyBadgeHtml = item.reply ? `
            <span style="font-size: 0.72rem; font-weight: 600; padding: 2px 7px; border-radius: 8px; background: rgba(255, 255, 255, 0.06); color: var(--text-secondary, #cbd5e1); border: 1px solid rgba(255, 255, 255, 0.1); display: inline-flex; align-items: center; gap: 4px;">
                💬 ${replyCount > 1 ? `${replyCount} Replies` : "Has Reply"}
            </span>
        ` : "";

        let cardHeaderHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; background: ${categoryBadgeColor.bg}; color: ${categoryBadgeColor.text}; border: 1px solid ${categoryBadgeColor.border};">
                    ${escapeHtml(item.category || "General")}
                </span>
                ${replyBadgeHtml}
            </div>
        `;

        let readMoreBtnHtml = (isLongText || item.reply) ? `
            <button class="read-more-btn" style="
                background: none; border: none; color: var(--accent-gold, #d4af37); font-size: 0.82rem; font-weight: 700;
                cursor: pointer; padding: 8px 0 0 0; text-align: left; display: inline-flex; align-items: center; gap: 4px;
            ">${item.reply ? (replyCount > 1 ? "View Confession & Replies ➔" : "View Confession & Reply ➔") : "Read More ➔"}</button>
        ` : "";

        card.innerHTML = `
            <div>
                ${cardHeaderHtml}
                <p class="archive-card-content" style="margin: 0; font-size: 0.88rem; color: var(--text-secondary, #cbd5e1); line-height: 1.55; white-space: pre-wrap;">${escapeHtml(displayText)}</p>
                ${readMoreBtnHtml}
            </div>
        `;

        // Card click opens modal
        card.addEventListener("click", () => openArchiveModal(item));

        archiveContainer.appendChild(card);
    });

    // 5. Render "Load More" button if there are more items
    if (filtered.length > currentVisibleLimit) {
        const loadMoreContainer = document.createElement("div");
        loadMoreContainer.style.cssText = "grid-column: 1 / -1; text-align: center; margin-top: 20px; margin-bottom: 10px;";
        loadMoreContainer.innerHTML = `
            <button id="archiveLoadMoreBtn" class="btn btn-secondary" style="
                background: var(--bg-card-hover); color: var(--accent-gold); border: 1px solid var(--border-color);
                padding: 10px 24px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
                display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
            ">📥 Load More Confessions (${filtered.length - currentVisibleLimit} remaining)</button>
        `;
        archiveContainer.appendChild(loadMoreContainer);

        const loadMoreBtn = loadMoreContainer.querySelector("#archiveLoadMoreBtn");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", () => {
                currentVisibleLimit += pageIncrement;
                renderArchiveConfessions();
            });
        }
    }
}

// Category Pill Event Listeners
if (archiveCatPills) {
    const pills = archiveCatPills.querySelectorAll(".archive-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => {
                p.classList.remove("active");
                p.style.background = "rgba(255, 255, 255, 0.05)";
                p.style.color = "var(--text-secondary, #cbd5e1)";
                p.style.boxShadow = "none";
            });
            pill.classList.add("active");
            pill.style.background = "linear-gradient(135deg, #d4af37 0%, #ffeb3b 100%)";
            pill.style.color = "#000000";
            pill.style.boxShadow = "0 4px 12px rgba(212, 175, 55, 0.3)";

            currentCategory = pill.getAttribute("data-cat") || "all";
            currentVisibleLimit = 12;
            renderArchiveConfessions();
        });
    });
}



// Search Input Listener
if (archiveSearch) {
    archiveSearch.addEventListener("input", () => {
        currentVisibleLimit = 12;
        renderArchiveConfessions();
    });
}



// Initial render
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        ensureArchiveModalExists();
        renderArchiveConfessions();
    });
} else {
    ensureArchiveModalExists();
    renderArchiveConfessions();
}
