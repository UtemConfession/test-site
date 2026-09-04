// calendar.js — Academic calendar timeline rendering logic with date range support

const calendarSearch = document.getElementById("calendarSearch");
const calendarFilterButtons = document.querySelectorAll(".cal-filter-btn");
const calendarTimeline = document.getElementById("calendarTimeline");

const academicEvents = [
    // --- SEMESTER 1 (2026/2027) ---
    { 
        startDate: "2026-09-28", 
        endDate: "2026-11-06", 
        title: "Semester 1 — Lecture Phase 1", 
        category: "academic",
        duration: "6 Weeks",
        desc: "Main undergraduate lecture & lab sessions (Part 1)"
    },
    { 
        startDate: "2026-11-07", 
        endDate: "2026-11-15", 
        title: "Mid-Semester 1 Break", 
        category: "break",
        duration: "9 Days",
        desc: "Mid-term recess for students"
    },
    { 
        startDate: "2026-11-16", 
        endDate: "2027-01-08", 
        title: "Semester 1 — Lecture Phase 2", 
        category: "academic",
        duration: "8 Weeks",
        desc: "Final teaching weeks & project submission"
    },
    { 
        startDate: "2027-01-09", 
        endDate: "2027-01-17", 
        title: "Study & Revision Week", 
        category: "break",
        duration: "9 Days",
        desc: "Preparation period for final examinations"
    },
    { 
        startDate: "2027-01-18", 
        endDate: "2027-01-31", 
        title: "Semester 1 Final Examinations", 
        category: "exam",
        duration: "2 Weeks",
        desc: "End-of-semester examination period"
    },
    { 
        startDate: "2027-02-01", 
        endDate: "2027-03-21", 
        title: "Semester Break (Inter-Semester Holiday)", 
        category: "break",
        duration: "7 Weeks",
        desc: "End of Semester 1 vacation & inter-semester break"
    },

    // --- SEMESTER 2 (2026/2027) ---
    { 
        startDate: "2027-03-22", 
        endDate: "2027-05-07", 
        title: "Semester 2 — Lecture Phase 1", 
        category: "academic",
        duration: "7 Weeks",
        desc: "Semester 2 undergraduate lecture sessions (Part 1)"
    },
    { 
        startDate: "2027-05-08", 
        endDate: "2027-05-16", 
        title: "Mid-Semester 2 Break", 
        category: "break",
        duration: "9 Days",
        desc: "Mid-term recess"
    },
    { 
        startDate: "2027-05-17", 
        endDate: "2027-07-02", 
        title: "Semester 2 — Lecture Phase 2", 
        category: "academic",
        duration: "7 Weeks",
        desc: "Lecture phase continuation & final assignments"
    },
    { 
        startDate: "2027-07-03", 
        endDate: "2027-07-11", 
        title: "Study & Revision Week", 
        category: "break",
        duration: "9 Days",
        desc: "Revision week before finals"
    },
    { 
        startDate: "2027-07-12", 
        endDate: "2027-07-25", 
        title: "Semester 2 Final Examinations", 
        category: "exam",
        duration: "2 Weeks",
        desc: "Semester 2 final examinations"
    },
    { 
        startDate: "2027-07-26", 
        endDate: "2027-09-26", 
        title: "Long Vacation / Inter-Session Break", 
        category: "break",
        duration: "9 Weeks",
        desc: "End of Session 2026/2027 long vacation"
    },

    // --- PUBLIC HOLIDAYS & SPECIAL DATES ---
    { startDate: "2026-08-31", endDate: "2026-08-31", title: "National Day (Hari Kebangsaan)", category: "holiday", duration: "1 Day" },
    { startDate: "2026-09-16", endDate: "2026-09-16", title: "Malaysia Day Holiday", category: "holiday", duration: "1 Day" },
    { startDate: "2026-09-24", endDate: "2026-09-24", title: "Prophet Muhammad's Birthday (Maulidur Rasul)", category: "holiday", duration: "1 Day" },
    { startDate: "2026-11-08", endDate: "2026-11-08", title: "Deepavali Festival Holiday", category: "holiday", duration: "1 Day" },
    { startDate: "2026-12-25", endDate: "2026-12-25", title: "Christmas Day Holiday", category: "holiday", duration: "1 Day" },
    { startDate: "2027-01-01", endDate: "2027-01-01", title: "New Year's Day 2027", category: "holiday", duration: "1 Day" },
    { startDate: "2027-02-06", endDate: "2027-02-07", title: "Chinese New Year (CNY Holiday)", category: "holiday", duration: "2 Days" },
    { startDate: "2027-03-09", endDate: "2027-03-10", title: "Hari Raya Aidilfitri Holiday", category: "holiday", duration: "2 Days" },
    { startDate: "2027-05-01", endDate: "2027-05-01", title: "Labour Day Holiday", category: "holiday", duration: "1 Day" },
    { startDate: "2027-05-20", endDate: "2027-05-20", title: "Wesak Day Holiday", category: "holiday", duration: "1 Day" }
];

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDateParts(dateString) {
    const parts = dateString.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const month = monthNames[monthIndex];
    return { day, month, year };
}

function renderCalendarEvents(filterCategory = 'all', searchQuery = '') {
    const timeline = document.getElementById("calendarTimeline");
    if (!timeline) return;
    timeline.innerHTML = '';

    const sorted = [...academicEvents].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const query = searchQuery.toLowerCase().trim();
    let eventsFound = 0;

    sorted.forEach(ev => {
        if (filterCategory !== 'all' && ev.category !== filterCategory) return;
        if (query && !ev.title.toLowerCase().includes(query) && !ev.startDate.includes(query) && !ev.endDate.includes(query)) return;

        eventsFound++;
        const start = formatDateParts(ev.startDate);
        const end = formatDateParts(ev.endDate);
        const isRange = ev.startDate !== ev.endDate;

        const categoryLabels = {
            academic: "Academic Lecture",
            break: "Semester Break",
            exam: "Final Examination",
            holiday: "Public Holiday"
        };

        const categoryColors = {
            academic: "#3b82f6",
            break: "#10b981",
            exam: "#ef4444",
            holiday: "#eab308"
        };
        const categoryColor = categoryColors[ev.category] || "#3b82f6";

        const item = document.createElement("div");
        item.className = `calendar-event-card cat-${ev.category}`;
        
        item.innerHTML = `
            <div class="cal-card-content">
                <div class="cal-card-top-row">
                    <div class="cal-date-badge">
                        ${isRange ? `
                            <span class="cal-date-text"><strong>${start.day} ${start.month}</strong> <span class="cal-arrow">➔</span> <strong>${end.day} ${end.month}</strong></span>
                            <span class="cal-year">${start.year}</span>
                        ` : `
                            <span class="cal-date-text"><strong>${start.day} ${start.month}</strong></span>
                            <span class="cal-year">${start.year}</span>
                        `}
                    </div>
                    <div class="cal-badges-right">
                        <span class="calendar-event-category cat-${ev.category}">${categoryLabels[ev.category] || ev.category}</span>
                        <span class="cal-duration-pill">⏳ ${ev.duration}</span>
                    </div>
                </div>
                <h3 class="cal-event-title">${ev.title}</h3>
                ${ev.desc ? `<p class="cal-event-desc">${ev.desc}</p>` : ''}
            </div>
        `;
        timeline.appendChild(item);
    });

    if (eventsFound === 0) {
        timeline.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">No matching academic events found.</p>`;
    }
}

calendarFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        calendarFilterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderCalendarEvents(btn.getAttribute("data-category"), calendarSearch ? calendarSearch.value : '');
    });
});

if (calendarSearch) {
    calendarSearch.addEventListener("input", () => {
        const activeBtn = document.querySelector(".cal-filter-btn.active");
        const category = activeBtn ? activeBtn.getAttribute("data-category") : 'all';
        renderCalendarEvents(category, calendarSearch.value);
    });
}

// --- 1-CLICK CALENDAR SYNC (.ICS GENERATOR) ---
function exportCalendarICS() {
    const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//UTeM Confessions Pro Max//Academic Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:UTeM Academic Calendar 2026/2027",
        "X-WR-TIMEZONE:Asia/Kuala_Lumpur"
    ];

    const formatDateForICS = (dateStr) => dateStr.replace(/-/g, "");

    const addDays = (dateStr, days) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}${mm}${dd}`;
    };

    academicEvents.forEach((ev, idx) => {
        const uid = `utem-cal-${idx}-${formatDateForICS(ev.startDate)}@ucpm`;
        const dtStart = formatDateForICS(ev.startDate);
        const dtEnd = addDays(ev.endDate, 1);
        const summary = (ev.title || "").replace(/,/g, "\\,");
        const description = (ev.desc || ev.title || "").replace(/,/g, "\\,");

        icsLines.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${formatDateForICS(ev.startDate)}T000000Z`,
            `DTSTART;VALUE=DATE:${dtStart}`,
            `DTEND;VALUE=DATE:${dtEnd}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            "LOCATION:Universiti Teknikal Malaysia Melaka (UTeM)",
            "STATUS:CONFIRMED",
            "END:VEVENT"
        );
    });

    icsLines.push("END:VCALENDAR");

    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "UTeM_Academic_Calendar_2026_2027.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof showToast === "function") {
        showToast("Calendar downloaded! Open to import into Google or Apple Calendar.", "success", 4000);
    }
}

const syncCalendarBtn = document.getElementById("syncCalendarBtn");
if (syncCalendarBtn) {
    syncCalendarBtn.addEventListener("click", exportCalendarICS);
}

// Dynamic Academic Milestone Countdown Pill
function renderMilestonePill() {
    const pill = document.getElementById("calendarMilestonePill");
    const icon = document.getElementById("milestoneIcon");
    const text = document.getElementById("milestoneText");
    const badge = document.getElementById("milestoneBadge");
    if (!pill || !text) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isMs = (typeof currentLang !== 'undefined' && currentLang === 'ms') || document.documentElement.lang === 'ms';
    const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const monthsMs = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sept", "Okt", "Nov", "Dis"];
    const months = isMs ? monthsMs : monthsEn;

    function formatShortDate(dateStr) {
        const d = new Date(dateStr);
        return `${d.getDate()} ${months[d.getMonth()]}`;
    }

    const majorMilestones = academicEvents.filter(ev => ev.category === "academic" || ev.category === "break" || ev.category === "exam");

    let currentEvent = null;
    let nextEvent = null;

    for (const ev of majorMilestones) {
        const start = new Date(ev.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(ev.endDate);
        end.setHours(23, 59, 59, 999);

        if (today >= start && today <= end) {
            currentEvent = ev;
        } else if (today < start && !nextEvent) {
            nextEvent = ev;
        }
    }

    if (currentEvent && currentEvent.category === "academic") {
        if (nextEvent) {
            const nextStart = new Date(nextEvent.startDate);
            nextStart.setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((nextStart - today) / (1000 * 60 * 60 * 24));
            if (icon) icon.textContent = "📚";
            const dayWord = isMs ? "hari" : (daysLeft === 1 ? "day" : "days");
            text.textContent = isMs 
                ? `Fasa Kuliah: ${nextEvent.title} dlm ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`
                : `Lecture Phase: ${nextEvent.title} in ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`;
        }
    } else if (currentEvent && (currentEvent.category === "break" || currentEvent.category === "exam")) {
        if (nextEvent) {
            const nextStart = new Date(nextEvent.startDate);
            nextStart.setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((nextStart - today) / (1000 * 60 * 60 * 24));
            if (icon) icon.textContent = currentEvent.category === "break" ? "🏖️" : "📝";
            const dayWord = isMs ? "hari" : (daysLeft === 1 ? "day" : "days");
            text.textContent = isMs
                ? `${currentEvent.title}: ${nextEvent.title} dlm ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`
                : `${currentEvent.title}: ${nextEvent.title} in ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`;
        }
    } else if (nextEvent) {
        const nextStart = new Date(nextEvent.startDate);
        nextStart.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((nextStart - today) / (1000 * 60 * 60 * 24));
        if (icon) icon.textContent = "🌴";
        const dayWord = isMs ? "hari" : (daysLeft === 1 ? "day" : "days");
        text.textContent = isMs
            ? `Cuti Semester: Sem 1 bermula dlm ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`
            : `Semester Break: Sem 1 begins in ${daysLeft} ${dayWord} (${formatShortDate(nextEvent.startDate)})`;
    }

    if (badge) badge.textContent = isMs ? "Pencapaian" : "Milestone";
}

// Initial render
function initCalendar() {
    renderCalendarEvents();
    renderMilestonePill();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalendar);
} else {
    initCalendar();
}

