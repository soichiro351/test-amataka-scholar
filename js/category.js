/**
 * Google Spreadsheetからカテゴリー一覧を取得する。
 * inline onclick をやめ、addEventListener で確実に発火させる。
 * （モジュール記法は使わない：export/import なし）
 */

const FETCH_URL_CATEGORY =
  "https://script.google.com/macros/s/AKfycbwDzroeSATgUyyun5RVG3rqcidLzafud3h7-fnV20E1etExiKxuVU3u1rl3j3vJPw/exec";

// DOMユーティリティ（最小）
function _el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "className") e.className = v;
    else if (k === "text") e.textContent = v;
    else e.setAttribute(k, v);
  }
  for (const c of children) e.appendChild(c);
  return e;
}

// 既存 index.html と互換：await getCategories() → updateCategory(...)
async function getCategories() {
  const url = FETCH_URL_CATEGORY + `?type=category`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  // 既存実装は配列をそのまま返している想定（必要なら .datas に合わせる）
  return await res.json();
}

function updateCategory(ctgry) {
  const wrap = document.getElementById("category-list");
  if (!wrap) return;

  // リセット
  while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

  const frag = document.createDocumentFragment();

  for (let i = 0; i < ctgry.length; i++) {
    const c1 = ctgry[i].category1;
    const c2s = Array.isArray(ctgry[i].category2) ? ctgry[i].category2 : [];

    const detail = _el("details", {
      className:
        "open:bg-purple-300 rounded open:shadow-md border-purple-600 p-1 my-1",
    });

    const summary = _el("summary", {
      className:
        "text-lg font-bold hover:bg-purple-300 p-1 rounded cursor-pointer",
      text: c1,
      role: "button",
      "aria-label": c1,
    });
    detail.appendChild(summary);

    const row = _el("div", { className: "flex items-center" });

    // 大カテゴリー
    const bigBtn = _el("button", {
      className:
        "bg-purple-600 text-white px-8 py-1 rounded-full hover:bg-purple-500 m-2 text-2xl",
      type: "button",
      "aria-label": c1,
    });
    bigBtn.textContent = c1;
    bigBtn.addEventListener("click", () => {
      if (typeof window.HandleCategorySearch === "function") {
        window.HandleCategorySearch(1, c1);
      } else {
        console.error("HandleCategorySearch is not available");
      }
    });

    const bigBox = _el("div");
    bigBox.appendChild(bigBtn);
    row.appendChild(bigBox);

    // 小カテゴリー
    const ul = _el("ul", { className: "ml-4" });
    for (let j = 0; j < c2s.length; j++) {
      const name = c2s[j];
      const li = _el("li");
      const sBtn = _el("button", {
        className:
          "bg-purple-600 text-white px-8 py-1 rounded-full hover:bg-purple-500 m-1 cursor-pointer",
        type: "button",
        "aria-label": name,
      });
      sBtn.textContent = name;
      sBtn.addEventListener("click", () => {
        if (typeof window.HandleCategorySearch === "function") {
          window.HandleCategorySearch(2, name);
        } else {
          console.error("HandleCategorySearch is not available");
        }
      });
      li.appendChild(sBtn);
      ul.appendChild(li);
    }
    row.appendChild(ul);

    detail.appendChild(row);
    frag.appendChild(detail);
  }

  wrap.appendChild(frag);
}
