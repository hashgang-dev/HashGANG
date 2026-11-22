// master_hashgang_e2e_test_suite.js
// HashGANG Corporate Hub (hashgang.com) Unified Master E2E & Integrity Test Suite
// Consolidates: UI Responsiveness, Navigation Equality, Mobile Drawer, Footer Consistency, Security, Performance, and Full User Journey

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// Resilient Playwright resolution across workspace
let chromium;
try {
  chromium = require("playwright").chromium;
} catch (e) {
  try {
    chromium = require(path.join(__dirname, "../myleader/backend/node_modules/playwright")).chromium;
  } catch (e2) {
    chromium = require(path.join(__dirname, "../omegle/node_modules/playwright")).chromium;
  }
}

const HASHGANG_ROOT = __dirname;
const PORT = 8899;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json",
};

// 1. Lightweight Static HTTP Server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = decodeURIComponent(parsedUrl.pathname);

      if (pathname.endsWith("/")) {
        pathname += "index.html";
      }

      let filePath = path.join(HASHGANG_ROOT, pathname);

      // Prevent directory traversal
      if (!filePath.startsWith(HASHGANG_ROOT)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`404 Not Found: ${pathname}`);
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        res.writeHead(200, {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, "127.0.0.1", () => {
      console.log(`[Static Server] Running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// 22 Core Pages to test
const TEST_PAGES = [
  { url: "/", name: "Homepage" },
  { url: "/about.html", name: "About Us" },
  { url: "/myleader.html", name: "MyLeader SaaS" },
  { url: "/contact.html", name: "Contact Us" },
  { url: "/careers.html", name: "Careers" },
  { url: "/pricing.html", name: "Pricing" },
  { url: "/doc-validation.html", name: "Doc Validation" },
  { url: "/culture-policy.html", name: "Culture Policy" },
  { url: "/privacy-policy.html", name: "Privacy Policy" },
  { url: "/terms-and-conditions.html", name: "Terms & Conditions" },
  { url: "/sitemap.html", name: "Sitemap" },
  { url: "/blog/", name: "Blog Catalog" },
  { url: "/blog/261122-hashgang-chat-flagship-anonymous-communication-platform.html", name: "Blog: HashGANG Chat" },
  { url: "/blog/261122-realtime-multiplayer-ludo-webrtc-audio-mesh-gaming.html", name: "Blog: Multiplayer Browser Gamin" },
  { url: "/blog/261122-voice-masking-privacy-realtime-audio-anonymity-hashgang-chat.html", name: "Blog: Voice Masking and Audio A" },
  { url: "/blog/261122-moderation-and-safety-in-anonymous-video-chat-platforms.html", name: "Blog: Building Trust in Anonymo" },
  { url: "/blog/261122-zero-cost-high-scale-p2p-chat-architecture-lessons.html", name: "Blog: Operating a High-Scale St" },
  { url: "/blog/261114-webrtc-peer-to-peer-mesh-scaling-without-sfu-bandwidth-costs.html", name: "Blog: WebRTC P2P Mesh" },
  { url: "/blog/261115-webassembly-dsp-audio-processing-pitch-shifting-browser.html", name: "Blog: WebAssembly DSP" },
  { url: "/blog/261116-socketio-high-concurrency-room-sharding-nodejs.html", name: "Blog: Socket.io Concurrency" },
  { url: "/blog/261117-zero-downtime-pwa-versioning-webapk-cache-eviction.html", name: "Blog: Zero-Downtime PWA" },
  { url: "/blog/261117-webrtc-turn-server-economics-coturn-bandwidth-optimization.html", name: "Blog: TURN Server Economics" },
  { url: "/blog/261118-client-side-shadow-moderation-realtime-chat-abuse-detection.html", name: "Blog: Shadow Moderation" },
  { url: "/blog/261118-multi-tenant-saas-security-company-isolation-tokenversion-jwt.html", name: "Blog: Multi-Tenant Security" },
  { url: "/blog/261119-measuring-developer-productivity-dora-vs-timesheet-telemetry.html", name: "Blog: Developer Productivity" },
  { url: "/blog/261119-anti-tamper-browser-fingerprinting-rate-limiting-webrtc.html", name: "Blog: Anti-Tamper Bot Defense" },
  { url: "/blog/261120-why-hybrid-mobile-apps-fail-enterprise-angular-ionic-capacitor.html", name: "Blog: Hybrid vs Capacitor" },
  { url: "/blog/261120-continuous-performance-feedback-eliminating-recency-bias.html", name: "Blog: Eliminating Recency Bias" },
  { url: "/blog/261121-http3-quic-zero-roundtrip-static-asset-delivery.html", name: "Blog: HTTP/3 & QUIC" },
  { url: "/blog/261121-optimistic-ui-local-state-synchronization-offline-first.html", name: "Blog: Optimistic UI" },
  { url: "/blog/261122-enterprise-timesheet-compliance-auditing-labor-law.html", name: "Blog: Timesheet Compliance" },
  { url: "/blog/261122-modern-monorepo-vs-polyrepo-micro-frontends-scaling.html", name: "Blog: Monorepo vs Micro-Frontends" },
  { url: "/blog/261113-building-zero-latency-progressive-web-apps-engineering-guide.html", name: "Blog: PWA Guide" },
  { url: "/blog/261113-how-task-based-timesheet-tracking-eliminates-appraisal-bias.html", name: "Blog: Task Timesheet" },
  { url: "/blog/261113-real-time-webrtc-architecture-vs-centralized-media-streaming.html", name: "Blog: WebRTC vs Centralized" },
  { url: "/blog/261113-why-static-websites-outperform-wordpress-for-modern-startups.html", name: "Blog: Static vs WP" },
  { url: "/blog/261108-how-continuous-performance-intelligence-drives-software-teams.html", name: "Blog: Continuous Perf" },
  { url: "/blog/260511-why-traditional-performance-appraisals-fail.html", name: "Blog: Appraisals Fail" },
  { url: "/blog/260517-why-attendance-is-not-real-productivity.html", name: "Blog: Attendance vs Productivity" },
  { url: "/blog/260602-why-managers-struggle-to-give-fair-performance-reviews.html", name: "Blog: Fair Reviews" },
  { url: "/blog/260609-why-employees-hate-surprise-performance-ratings.html", name: "Blog: Surprise Ratings" },
  { url: "/blog/260626-continuous-performance-intelligence-future-of-employee-performance-management.html", name: "Blog: Future of Perf" },
];

async function runMasterHashGANGTestSuite() {
  const server = await startServer();
  const browser = await chromium.launch();

  const results = {
    ui: { passed: 0, failed: 0, issues: [] },
    menu: { passed: 0, failed: 0, issues: [] },
    drawer: { passed: 0, failed: 0, issues: [] },
    footer: { passed: 0, failed: 0, issues: [] },
    security: { passed: 0, failed: 0, issues: [] },
    performance: { passed: 0, failed: 0, metrics: [], issues: [] },
    navigation: { passed: 0, failed: 0, issues: [] }
  };

  try {
    console.log("\n=======================================================");
    console.log("   HASHGANG.COM UNIFIED MASTER E2E & INTEGRITY SUITE   ");
    console.log("=======================================================\n");

    // ========================================================
    // PART 1: UI RESPONSIVENESS & INTEGRITY ACROSS ALL PAGES
    // ========================================================
    console.log("--- PART 1: UI RESPONSIVENESS & INTEGRITY TESTS (22 PAGES x 2 VIEWPORTS) ---");

    const viewports = [
      { width: 1280, height: 900, mode: "Desktop" },
      { width: 390, height: 844, mode: "Mobile (iPhone 14)" }
    ];

    for (const vp of viewports) {
      console.log(`\n  Testing Viewport: ${vp.mode} [${vp.width}x${vp.height}]...`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      for (const p of TEST_PAGES) {
        const fullUrl = `http://127.0.0.1:${PORT}${p.url}`;
        const response = await page.goto(fullUrl, { waitUntil: "networkidle" });
        const status = response ? response.status() : 0;

        if (status !== 200) {
          results.ui.failed++;
          results.ui.issues.push(`[${vp.mode}] ${p.name} returned status ${status}`);
          console.log(`    ❌ ${p.name}: HTTP ${status}`);
          continue;
        }

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          return {
            hasOverflow: docWidth > winWidth + 1,
            docWidth,
            winWidth
          };
        });

        // Check broken images
        const brokenImages = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll("img"));
          return imgs
            .filter((img) => img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"))
            .map((img) => img.src);
        });

        // Check top navigation visibility
        const navPresent = await page.evaluate(() => {
          const nav = document.querySelector(".navbar") || document.querySelector("#navMenu") || document.querySelector("nav") || document.querySelector("header");
          return nav !== null;
        });

        if (overflow.hasOverflow) {
          results.ui.failed++;
          results.ui.issues.push(`[${vp.mode}] ${p.name} horizontal overflow: ${overflow.docWidth}px > ${overflow.winWidth}px`);
          console.log(`    ❌ ${p.name}: Horizontal overflow (${overflow.docWidth}px > ${overflow.winWidth}px)`);
        } else if (brokenImages.length > 0) {
          results.ui.failed++;
          results.ui.issues.push(`[${vp.mode}] ${p.name} broken images: ${brokenImages.join(", ")}`);
          console.log(`    ❌ ${p.name}: Broken images found: ${brokenImages.join(", ")}`);
        } else if (!navPresent) {
          results.ui.failed++;
          results.ui.issues.push(`[${vp.mode}] ${p.name} navigation element missing`);
          console.log(`    ❌ ${p.name}: Navigation element missing`);
        } else {
          results.ui.passed++;
          console.log(`    ✅ ${p.name} (${vp.mode}): Clean layout, 0 overflow, nav present`);
        }
      }
      await context.close();
    }

    // ========================================================
    // PART 2: HEADER NAVIGATION MENU LINK CONSISTENCY
    // ========================================================
    console.log("\n--- PART 2: HEADER NAVIGATION MENU EQUALITY (HOME VS BLOG) ---");
    const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });
    const homeMenuLinks = await desktopPage.evaluate(() => {
      return Array.from(document.querySelectorAll("#navMenu a")).map(a => a.textContent.trim());
    });
    console.log("  Home navbar links:", homeMenuLinks);

    await desktopPage.goto(`http://127.0.0.1:${PORT}/blog/`, { waitUntil: "networkidle" });
    const blogMenuLinks = await desktopPage.evaluate(() => {
      return Array.from(document.querySelectorAll("#navMenu a")).map(a => a.textContent.trim());
    });
    console.log("  Blog navbar links:", blogMenuLinks);

    const menuMatches = JSON.stringify(homeMenuLinks) === JSON.stringify(blogMenuLinks);
    if (menuMatches && homeMenuLinks.length > 0) {
      results.menu.passed++;
      console.log("  ✅ Blog header navigation EXACTLY matches Home menu links 100%!");
    } else {
      results.menu.failed++;
      results.menu.issues.push("Mismatch between Home and Blog header navigation items");
      console.log("  ❌ Menu mismatch between Home and Blog!");
    }
    await desktopContext.close();

    // ========================================================
    // PART 3: MOBILE NAVIGATION DRAWER & OVERLAY CLICK-OUTSIDE
    // ========================================================
    console.log("\n--- PART 3: MOBILE DRAWER & DIMMED OVERLAY CLICK-OUTSIDE DISMISSAL ---");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();

    for (const testUrl of ["/", "/blog/"]) {
      const pageName = testUrl === "/" ? "Home" : "Blog";
      console.log(`  Testing mobile drawer dismiss on ${pageName} (${testUrl})...`);
      await mobilePage.goto(`http://127.0.0.1:${PORT}${testUrl}`, { waitUntil: "networkidle" });

      // Click hamburger button to open
      await mobilePage.click(".hamburger-btn");
      await mobilePage.waitForTimeout(300);

      const isOpen = await mobilePage.evaluate(() => document.getElementById("navMenu").classList.contains("active"));
      const isOverlayActive = await mobilePage.evaluate(() => {
        const overlay = document.getElementById("navOverlay");
        return overlay ? overlay.classList.contains("active") : false;
      });

      if (!isOpen || !isOverlayActive) {
        results.drawer.failed++;
        results.drawer.issues.push(`${pageName}: Drawer did not open properly`);
        console.log(`    ❌ ${pageName}: Drawer did not open properly`);
        continue;
      }

      // Click outside drawer at (40, 300) on the dimmed overlay
      await mobilePage.mouse.click(40, 300);
      await mobilePage.waitForTimeout(300);

      const isClosedAfterClickOutside = await mobilePage.evaluate(() => {
        const menu = document.getElementById("navMenu");
        const overlay = document.getElementById("navOverlay");
        return !menu.classList.contains("active") && (!overlay || !overlay.classList.contains("active"));
      });

      if (isClosedAfterClickOutside) {
        results.drawer.passed++;
        console.log(`    ✅ ${pageName}: Clicking outside drawer closes menu cleanly!`);
      } else {
        results.drawer.failed++;
        results.drawer.issues.push(`${pageName}: Drawer did NOT close after clicking outside overlay`);
        console.log(`    ❌ ${pageName}: Drawer did NOT close after clicking outside!`);
      }
    }
    await mobileContext.close();

    // ========================================================
    // PART 4: FOOTER CONSISTENCY ACROSS SUBPAGES
    // ========================================================
    console.log("\n--- PART 4: FOOTER CONSISTENCY & COMPLETENESS ---");
    const testFooterPages = ["/", "/blog/", "/about.html", "/myleader.html", "/contact.html"];
    const footContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const footPage = await footContext.newPage();

    const expectedSections = ["Products & Apps", "Company", "Legal & Trust"];

    for (const p of testFooterPages) {
      await footPage.goto(`http://127.0.0.1:${PORT}${p}`, { waitUntil: "networkidle" });
      await footPage.waitForTimeout(300);

      const footerInfo = await footPage.evaluate(() => {
        const titles = Array.from(document.querySelectorAll("footer.footer .footer-title")).map(t => t.textContent.trim());
        const linkCount = document.querySelectorAll("footer.footer .footer-links a").length;
        const brandPresent = document.querySelector("footer.footer .footer-brand") !== null;
        const bottomPresent = document.querySelector("footer.footer .footer-bottom") !== null;
        return { titles, linkCount, brandPresent, bottomPresent };
      });

      const hasAllSections = expectedSections.every(s => footerInfo.titles.includes(s));
      if (hasAllSections && footerInfo.linkCount >= 11 && footerInfo.brandPresent && footerInfo.bottomPresent) {
        results.footer.passed++;
        console.log(`  ✅ Footer on ${p}: Complete (Titles: ${footerInfo.titles.length}, Links: ${footerInfo.linkCount})`);
      } else {
        results.footer.failed++;
        results.footer.issues.push(`Footer on ${p} incomplete: missing sections or links`);
        console.log(`  ❌ Footer on ${p} is missing sections or links!`);
      }
    }
    await footContext.close();

    // ========================================================
    // PART 5: STATIC SECURITY & INTEGRITY AUDIT
    // ========================================================
    console.log("\n--- PART 5: SECURITY & INTEGRITY AUDIT (TABNABBING & MIXED CONTENT) ---");
    const secContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const secPage = await secContext.newPage();

    for (const p of TEST_PAGES) {
      const fullUrl = `http://127.0.0.1:${PORT}${p.url}`;
      await secPage.goto(fullUrl, { waitUntil: "networkidle" });

      const secAudit = await secPage.evaluate(() => {
        // 1. Insecure target="_blank"
        const blankLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
        const badBlankLinks = blankLinks
          .filter((a) => {
            const rel = (a.getAttribute("rel") || "").toLowerCase();
            return !rel.includes("noopener") && !rel.includes("noreferrer");
          })
          .map((a) => a.href || a.outerHTML);

        // 2. Mixed content: insecure HTTP script or stylesheet sources
        const scripts = Array.from(document.querySelectorAll("script[src]")).map((s) => s.src);
        const links = Array.from(document.querySelectorAll("link[href]")).map((l) => l.href);
        const insecureResources = [...scripts, ...links].filter((u) => u.startsWith("http://") && !u.includes("127.0.0.1") && !u.includes("localhost"));

        return {
          badBlankLinks,
          insecureResources
        };
      });

      if (secAudit.badBlankLinks.length > 0) {
        results.security.failed++;
        results.security.issues.push(`${p.name} has unsafe target="_blank" without rel="noopener"`);
        console.log(`  ❌ ${p.name}: ${secAudit.badBlankLinks.length} target="_blank" links missing rel="noopener"`);
      } else if (secAudit.insecureResources.length > 0) {
        results.security.failed++;
        results.security.issues.push(`${p.name} has insecure mixed-content HTTP resources`);
        console.log(`  ❌ ${p.name}: Insecure HTTP resources found`);
      } else {
        results.security.passed++;
        console.log(`  ✅ ${p.name}: Zero tabnabbing vulnerabilities, zero insecure mixed content`);
      }
    }
    await secContext.close();

    // ========================================================
    // PART 6: PERFORMANCE & CORE WEB VITALS TELEMETRY
    // ========================================================
    console.log("\n--- PART 6: PERFORMANCE & CORE METRICS TELEMETRY ---");
    const perfContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const perfPage = await perfContext.newPage();

    const keyPerfPages = [
      { url: "/", name: "Homepage" },
      { url: "/myleader.html", name: "MyLeader SaaS" },
      { url: "/blog/", name: "Blog Catalog" },
      { url: "/blog/261113-building-zero-latency-progressive-web-apps-engineering-guide.html", name: "Blog: PWA Guide" }
    ];

    for (const kp of keyPerfPages) {
      let totalBytes = 0;
      let requestCount = 0;

      perfPage.on("response", async (res) => {
        try {
          const buffer = await res.buffer();
          totalBytes += buffer.length;
          requestCount++;
        } catch (_) {}
      });

      const startTime = Date.now();
      await perfPage.goto(`http://127.0.0.1:${PORT}${kp.url}`, { waitUntil: "networkidle" });
      const loadTime = Date.now() - startTime;

      const timing = await perfPage.evaluate(() => {
        const perf = performance.getEntriesByType("navigation")[0];
        return {
          domContentLoaded: Math.round(perf ? perf.domContentLoadedEventEnd : 0),
          loadEvent: Math.round(perf ? perf.loadEventEnd : 0),
          domInteractive: Math.round(perf ? perf.domInteractive : 0)
        };
      });

      const totalKb = Math.round(totalBytes / 1024);
      results.performance.metrics.push({
        page: kp.name,
        loadTimeMs: loadTime,
        domContentLoadedMs: timing.domContentLoaded,
        totalKb,
        requestCount
      });

      console.log(`  ⚡ ${kp.name}: DOMContentLoaded=${timing.domContentLoaded}ms | LoadTime=${loadTime}ms | Payload=${totalKb}KB (${requestCount} requests)`);
      if (timing.domContentLoaded < 1500) {
        results.performance.passed++;
      } else {
        results.performance.failed++;
        results.performance.issues.push(`${kp.name} DOMContentLoaded (${timing.domContentLoaded}ms) exceeded 1500ms threshold`);
      }
    }
    await perfContext.close();

    // ========================================================
    // PART 7: FULL USER JOURNEY NAVIGATION LOOP
    // ========================================================
    console.log("\n--- PART 7: FULL USER JOURNEY NAVIGATION CIRCULAR LOOP ---");
    const navContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const navPage = await navContext.newPage();

    try {
      // Step 1: Start at Blog Catalog
      console.log("  Step 1: Navigating to /blog/...");
      await navPage.goto(`http://127.0.0.1:${PORT}/blog/`, { waitUntil: "networkidle" });

      // Step 2: Click first blog post card
      console.log("  Step 2: Clicking first blog post card...");
      await navPage.click(".blog-card:first-child");
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Arrived at: ${navPage.url()}`);

      // Step 3: Click "← All Articles" back to blog
      console.log("  Step 3: Clicking '← All Articles' back button...");
      await navPage.click(".back-to-blog");
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Returned to: ${navPage.url()}`);

      // Step 4: Click MyLeader SaaS in Solutions dropdown
      console.log("  Step 4: Clicking 'MyLeader SaaS' in Solutions dropdown...");
      await navPage.click("#dropdownSolutions .dropdown-btn");
      await navPage.click('#dropdownSolutions a[href="/myleader.html"]');
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Arrived at: ${navPage.url()}`);

      // Step 5: Click Home in navbar
      console.log("  Step 5: Clicking 'Home' in navbar...");
      await navPage.click('.navbar a[href="/"]');
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Arrived at: ${navPage.url()}`);

      // Step 6: On Home page, click Solutions Dropdown -> MyLeader
      console.log("  Step 6: Clicking Solutions Dropdown -> MyLeader on Homepage...");
      await navPage.click("#dropdownSolutions .dropdown-btn");
      await navPage.click('#dropdownSolutions a[href="/myleader.html"]');
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Arrived at: ${navPage.url()}`);

      // Step 7: Click Blog in navbar to complete the 360 circle
      console.log("  Step 7: Clicking 'Blog' in navbar to complete circular loop...");
      await navPage.click('.navbar a[href="/blog/"]');
      await navPage.waitForLoadState("networkidle");
      console.log(`    ➔ Completed loop at: ${navPage.url()}`);

      results.navigation.passed++;
      console.log("  ✅ Full 360-degree interactive navigation loop succeeded flawlessly!");
    } catch (err) {
      results.navigation.failed++;
      results.navigation.issues.push(err.message);
      console.log(`  ❌ Navigation Loop Failed: ${err.message}`);
    }
    await navContext.close();

    // ========================================================
    // FINAL MASTER REPORT
    // ========================================================
    console.log("\n=======================================================");
    console.log("       HASHGANG MASTER E2E TEST SUMMARY REPORT         ");
    console.log("=======================================================");
    console.log(`  Part 1: UI Responsiveness & Layout:  ${results.ui.passed} Passed, ${results.ui.failed} Failed`);
    console.log(`  Part 2: Header Navigation Equality:  ${results.menu.passed} Passed, ${results.menu.failed} Failed`);
    console.log(`  Part 3: Mobile Drawer Click-Outside: ${results.drawer.passed} Passed, ${results.drawer.failed} Failed`);
    console.log(`  Part 4: Global Footer Consistency:   ${results.footer.passed} Passed, ${results.footer.failed} Failed`);
    console.log(`  Part 5: Security & Target Audit:     ${results.security.passed} Passed, ${results.security.failed} Failed`);
    console.log(`  Part 6: Performance & Core Vitals:   ${results.performance.passed} Passed, ${results.performance.failed} Failed`);
    console.log(`  Part 7: Full Navigation Journey:     ${results.navigation.passed} Passed, ${results.navigation.failed} Failed`);

    const totalPassed = results.ui.passed + results.menu.passed + results.drawer.passed + results.footer.passed + results.security.passed + results.performance.passed + results.navigation.passed;
    const totalFailed = results.ui.failed + results.menu.failed + results.drawer.failed + results.footer.failed + results.security.failed + results.performance.failed + results.navigation.failed;

    console.log("-------------------------------------------------------");
    console.log(`  TOTAL: ${totalPassed} Passed | ${totalFailed} Failed (100% Target)`);
    console.log("=======================================================\n");

    if (totalFailed > 0) {
      console.error("Test failures detected. Review logs above.");
      process.exit(1);
    } else {
      console.log("🎉 ALL HASHGANG.COM TESTS PASSED CLEANLY!");
    }

  } finally {
    await browser.close();
    server.close();
  }
}

runMasterHashGANGTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
