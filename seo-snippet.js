// Single-file SEO snippet (CONFIG + META_DATA + LD_DATA + runtime)

(function () {
  "use strict";


  const CONFIG = {
    baseUrlFallback: "https://www.andreaborgaart.com",
    googleSiteVerification: ""
  };

  // === DATA (from your previous meta-tags.js) ===
  const META_DATA = {"meta_tags_list":[{"page_url":"https://www.andreaborgaart.com/","title_tag":"Scultore contemporaneo, arte in Trentino | Andrea Borga","meta_description":"Scultore contemporaneo in Trentino, specializzato in sculture in metallo e installazioni artistiche. Arte materica tra Dolomiti e design scultoreo italiano."},{"page_url":"https://www.andreaborgaart.com/about","title_tag":"Artista italiano, lavorazione dei metalli | Andrea Borga","meta_description":"Artista italiano tra le Dolomiti: sculture in metallo, design scultoreo e installazioni artistiche. Dalla tradizione del fabbro alla scultura contemporanea internazionale."},{"page_url":"https://www.andreaborgaart.com/gallery","title_tag":"Sculture in metallo, design scultoreo | Andrea Borga","meta_description":"Galleria di sculture in metallo: pezzi unici certificati, installazioni artistiche e design scultoreo. Arte in Trentino firmata dallo scultore contemporaneo Andrea Borga."},{"page_url":"https://www.andreaborgaart.com/design","title_tag":"Design scultoreo, sculture personalizzate | A. Borga","meta_description":"Design scultoreo contemporaneo e sculture in metallo su misura. Sculture personalizzate e installazioni artistiche per interni ed esterni in Trentino e in Italia."},{"page_url":"https://www.andreaborgaart.com/video","title_tag":"Scultore contemporaneo, installazioni artistiche | Video","meta_description":"Video dedicati alle sculture in metallo, alla lavorazione dei metalli e alle installazioni artistiche di Andrea Borga, artista italiano e scultore contemporaneo."},{"page_url":"https://www.andreaborgaart.com/eventi","title_tag":"Mostra d’arte, arte in Trentino | Eventi Andrea Borga","meta_description":"Eventi e mostre d’arte di Andrea Borga: arte in Trentino, installazioni artistiche e sculture in metallo esposte in Italia e all’estero dal noto artista italiano."},{"page_url":"https://www.andreaborgaart.com/contatti","title_tag":"Sculture personalizzate, arte in Trentino | Contatti","meta_description":"Contatta l’artista italiano Andrea Borga per sculture personalizzate, installazioni artistiche e sculture in metallo. Studio di arte contemporanea in Trentino."},{"page_url":"https://www.andreaborgaart.com/copia-di-chi-sono","title_tag":"Privacy sito artista italiano | Andrea Borga Art","meta_description":"Informativa sulla privacy del sito di Andrea Borga, artista italiano e scultore contemporaneo in Trentino, per la tutela dei dati personali dei visitatori."}],"keywords":["scultore contemporaneo","sculture in metallo","arte in trentino","arts & craft predai","installazioni artistiche","mostra d'arte","lavorazione dei metalli","design scultoreo","artista italiano","sculture personalizzate"]};

  // === DATA (from your previous LD.js) ===
  const LD_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.andreaborgaart.com/#website",
  "url": "https://www.andreaborgaart.com/",
  "name": "Andrea Borga art",
  "alternateName": "Andrea Borga Art | Scultore Metalli | Trentino",
  "inLanguage": "it",
  "publisher": {
    "@type": "Person",
    "@id": "https://www.andreaborgaart.com/#person",
    "name": "Andrea Borga",
    "jobTitle": "Scultore",
    "description": "Scultore italiano specializzato in sculture in metallo, attivo in Trentino Alto Adige con mostre e partecipazioni internazionali.",
    "email": "mailto:andreaborga.85@gmail.com",
    "telephone": "+39 338 8342155",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Predaia",
      "addressRegion": "Trentino Alto Adige",
      "addressCountry": "IT"
    },
    "image": "https://static.wixstatic.com/media/7dc69e_58706457e5cb4398ab57fd9c6c176b45%7Emv2.png/v1/fill/w_192%2Ch_192%2Clg_1%2Cusm_0.66_1.00_0.01/7dc69e_58706457e5cb4398ab57fd9c6c176b45%7Emv2.png",
    "sameAs": []
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.andreaborgaart.com/search?query={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

  /* ===== Helpers ===== */
  function clamp(str, max) {
    if (typeof str !== "string") str = String(str ?? "");
    return str.length <= max ? str : str.slice(0, Math.max(0, max - 1)) + "…";
  }

  function stripTrailingSlash(p) {
    if (!p) return "/";
    return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  }

  function normalizePathFromUrl(url) {
    try {
      const u = new URL(url);
      return stripTrailingSlash(u.pathname || "/");
    } catch {
      const m = String(url || "").match(/^https?:\/\/[^/]+(\/[^?#]*)?/i);
      return stripTrailingSlash((m && m[1]) || "/");
    }
  }

  function removeLangPrefix(pathname) {
    const m = String(pathname || "/").match(
      /^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)(.*)$/
    );
    if (!m) return pathname || "/";
    const rest = stripTrailingSlash(m[2] || "/");
    return rest || "/";
  }

  function currentPagePath() {
    const path = window.location.pathname || "/";
    return stripTrailingSlash(path || "/");
  }

  function currentKeyCandidates() {
    const path = currentPagePath();
    const origin = (window.location.origin || "").replace(/\/$/, "");
    const full = origin + path;

    if (path === "/") {
      return [full, "/"];
    }

    const noLang = removeLangPrefix(path);
    return [full, path, stripTrailingSlash(path), noLang, stripTrailingSlash(noLang)];
  }

  function buildIndex(metaJson) {
    const list = (metaJson && metaJson.meta_tags_list) || [];
    const index = {};
    for (const item of list) {
      const path = normalizePathFromUrl(item.page_url);
      let origin = "";
      try {
        origin = new URL(item.page_url).origin;
      } catch {
        origin = "";
      }
      const full = origin ? origin.replace(/\/$/, "") + path : "";

      const entry = {
        title: item.title_tag || "",
        description: item.meta_description || "",
      };

      index[path] = entry;
      index[stripTrailingSlash(path)] = entry;
      if (full) index[full] = entry;
    }
    return index;
  }

  function _stripQuotes(s) {
    return String(s ?? "")
      .replace(/["'“”‘’„«»]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^[\s\-–—·,;:]+|[\s\-–—·,;:]+$/g, "")
      .trim();
  }

  function normalizeKeywordsList(input, opts) {
    const { maxKeywords = 20 } = opts || {};
    if (input == null) return [];
    let items = Array.isArray(input)
      ? input.slice()
      : typeof input === "string"
      ? input.split(",")
      : [];
    const seen = new Set();
    return items
      .map(_stripQuotes)
      .filter((s) => s && s.length >= 2)
      .filter((s) => {
        const k = s.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, maxKeywords);
  }

  function normalizeKeywords(input, opts) {
    const { maxKeywords = 20, maxLength = 280 } = opts || {};
    const list = normalizeKeywordsList(input, { maxKeywords });
    const content = list.join(", ");
    return content.length > maxLength ? content.slice(0, maxLength) : content;
  }

  function applyAltFallbacks(keywordsPool) {
    if (!Array.isArray(keywordsPool) || keywordsPool.length === 0) return;
    try {
      const images = Array.from(document.querySelectorAll("img"));
      let i = 0;
      images.forEach((img) => {
        const curAlt = (img.getAttribute("alt") || "").trim().toLowerCase();
        const shouldReplace =
          !curAlt ||
          curAlt.endsWith(".jpg") ||
          curAlt.endsWith(".png") ||
          curAlt === "image" ||
          curAlt === "img";
        if (shouldReplace) {
          img.setAttribute("alt", keywordsPool[i % keywordsPool.length]);
          i++;
        }
      });
    } catch {
      /* ignore */
    }
  }

  function optimizeImages() {
    try {
      const images = Array.from(document.querySelectorAll("img"));
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              io.unobserve(img);
              // hook for tracking / lazy work if needed
            }
          });
        });
        images.forEach((img, index) => {
          if (index > 0) io.observe(img);
        });
      }
    } catch (err) {
      console.error("Image optimization error:", err);
    }
  }

  function upsertMeta(nameOrProperty, content, useProperty) {
    const selector = useProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (useProperty) el.setAttribute("property", nameOrProperty);
      else el.setAttribute("name", nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }

  function injectJsonLd(ldObject) {
    if (!ldObject) return;
    try {
      const existing = Array.from(
        document.head.querySelectorAll('script[type="application/ld+json"]')
      );
      existing.forEach((el) => {
        el.parentNode.removeChild(el);
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(ldObject);
      document.head.appendChild(script);
    } catch (err) {
      console.error("Error injecting JSON-LD:", err);
    }
  }

  function applyJsonLd() {
    injectJsonLd(LD_DATA);
  }

  function applySeoFromJson() {
    try {
      const metaJson = META_DATA;
      const index = buildIndex(metaJson);

      const path = currentPagePath();
      const isHome = path === "/";

      const fallbackBase =
        (CONFIG && CONFIG.baseUrlFallback) ? CONFIG.baseUrlFallback : "";
      const baseUrl = (window.location.origin || fallbackBase).replace(/\/$/, "");
      const canonicalUrl = baseUrl + path;

      const keys = currentKeyCandidates();
      let entry = null;
      for (const k of keys) {
        if (index[k]) {
          entry = index[k];
          break;
        }
      }

      if (!entry) {
        return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
      }

      const title = clamp(entry.title, 60);
      const desc = clamp(entry.description, 185);

      document.title = title;

      const metaList = [
        { type: "name", key: "description", content: desc },
        { type: "property", key: "og:url", content: canonicalUrl },
        { type: "name", key: "resource-hints", content: "preload" },
        { type: "name", key: "format-detection", content: "telephone=yes" },
        { type: "name", key: "mobile-web-app-capable", content: "yes" },
        { type: "name", key: "apple-mobile-web-app-capable", content: "yes" },
      ];

      // opcjonalnie dodaj google-site-verification, jeśli jest w CONFIG
      if (CONFIG && CONFIG.googleSiteVerification) {
        metaList.push({
          type: "name",
          key: "google-site-verification",
          content: CONFIG.googleSiteVerification
        });
      }

      if (isHome && metaJson && metaJson.keywords) {
        const kwContent = normalizeKeywords(metaJson.keywords, {
          maxKeywords: 25,
          maxLength: 512,
        });
        if (kwContent) {
          metaList.push({ type: "name", key: "keywords", content: kwContent });
        }
      }

      metaList.forEach((m) => {
        upsertMeta(m.key, m.content, m.type === "property");
      });

      upsertLink("canonical", canonicalUrl);

      return normalizeKeywordsList(metaJson.keywords, { maxKeywords: 25 });
    } catch (err) {
      console.error("Error meta settings:", err);
      return [];
    }
  }

  function initSnippetSEO() {
    const keywordsPool = applySeoFromJson();
    const path = currentPagePath();
    if (path === "/") {
      applyJsonLd();
    }
    optimizeImages();
    applyAltFallbacks(keywordsPool);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSnippetSEO);
  } else {
    initSnippetSEO();
  }
})();
