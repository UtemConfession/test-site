/**
 * =============================================================
 * SITE-WIDE AD MONETIZATION LOADER
 * ads.js — Centralized loader for Infolinks & site ad monetization.
 * =============================================================
 */

(function () {
    'use strict';

    // --- Infolinks Global Configuration ---
    window.infolinks_pid = 3448001;
    window.infolinks_wsid = 0;

    // Dynamically inject Infolinks main script across all pages if not already injected statically
    if (!document.querySelector('script[src*="resources.infolinks.com/js/infolinks_main.js"]')) {
        var infolinksScript = document.createElement('script');
        infolinksScript.type = 'text/javascript';
        infolinksScript.async = true;
        infolinksScript.src = 'https://resources.infolinks.com/js/infolinks_main.js';
        document.head.appendChild(infolinksScript);
    }

    // --- Device Detection ---
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 768;

    // Track loaded containers to prevent duplicates
    var loadedSlots = {};

    /**
     * Check if the slot should be blocked based on device class or visibility
     */
    function isSlotBlockedByDevice(element) {
        if (!element) return true;
        if (isMobile && (element.classList.contains('ad-slot--desktop-only') || element.classList.contains('ad-sidebar'))) return true;
        if (!isMobile && element.classList.contains('ad-slot--mobile-only')) return true;
        // Check if element or its parent is hidden
        if (element.offsetWidth === 0 && element.offsetHeight === 0) return true;
        return false;
    }

    /**
     * Trigger AdSense push for a specific container.
     */
    function loadAdSenseAd(container) {
        if (!container || isSlotBlockedByDevice(container)) return;

        // Check that container has a valid rendered width
        var cRect = container.getBoundingClientRect();
        if (cRect.width <= 0 || container.offsetWidth <= 0 || container.offsetParent === null) return;

        // Find all <ins class="adsbygoogle"> inside this container that haven't been loaded yet
        var insTags = container.querySelectorAll('ins.adsbygoogle:not([data-ad-status="unfilled"]):not([data-adsbygoogle-status="done"])');
        
        for (var i = 0; i < insTags.length; i++) {
            var ins = insTags[i];
            var slotId = ins.id || (ins.getAttribute('data-ad-slot') + '_' + i);
            
            if (loadedSlots['adsense_' + slotId]) continue;
            if (isSlotBlockedByDevice(container)) continue;
            if (container.offsetWidth <= 0 || cRect.width <= 0) continue;
            
            loadedSlots['adsense_' + slotId] = true;
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense Error: ", e);
            }
        }
    }

    /**
     * Discover all ads inside a specific container (e.g. a newly visible tab)
     */
    window.initAdsInContainer = function(containerElement) {
        if (!containerElement) return;

        // Load AdSense ads (by triggering push for ins tags within this container)
        loadAdSenseAd(containerElement);
    };

    /**
     * Discover all ads that are currently visible on page load (outside tabs or inside the active tab).
     */
    function initGlobalAds() {
        var allAdsenseIns = document.querySelectorAll('ins.adsbygoogle');
        for (var j = 0; j < allAdsenseIns.length; j++) {
            var ins = allAdsenseIns[j];
            var parentTab = ins.closest('.tab-content');
            if (!parentTab || parentTab.classList.contains('active')) {
                var container = ins.parentElement;
                loadAdSenseAd(container);
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalAds);
    } else {
        initGlobalAds();
    }
})();
