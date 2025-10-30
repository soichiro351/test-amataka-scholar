/**
 * Google Spreadsheetからカテゴリー一覧を取得する。
 * （inline onclick を使わず、addEventListener で確実に発火させる）
 */

const FETCH_URL_CATEGORY =
  "https://script.google.com/macros/s/AKfycbwDzroeSATgUyyun5RVG3rqcidLzafud3h7-fnV20E1etExiKxuVU3u1rl3j3vJPw/exec";

// --- DOM utils
function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "className") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("data-")) e.setAttribute(k, v);
    else e.setAttribute(k, v);
  });
  for (const c of children) e.appendChild(c);
  return e;
}

export async function getCategories() {
  const url = FETCH_URL_CATEGORY + `?type=category`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json(); // 返り値は配列を想定（必要なら .datas に合わせてください）
}

export function updateCategory(ctgry) {
  const d = document.getElementById("category-list");
  if (!d) return;

  // クリア
  while (d.firstChild) d.removeChild(d.firstChild);

  const frag = document.createDocumentFragment();

  for (let i = 0; i < ctgry.length; i++) {
    const c1 = ctgry[i].category1;
    const c2s = Array.isArray(ctgry[i].category2) ? ctgry[i].category2 : [];

    const detail = el(
      "details",
      { className: "open:bg-purple-300 rounded open:shadow-md border-purple-600 p-1 my-1" }
    );

    const summary = el("summary", {
      className: "text-lg font-bold hover:bg-purple-300 p-1 rounded cursor-pointer",
      text: c1,
      role: "button",
      "aria-label": c1
    });
    detail.appendChild(summary);

    const div = el("div", { className: "flex items-center" });

    // 大カテゴリーのボタン（イベントで関数を呼ぶ）
    const btnDiv = el("div");
    const btn = el("button", {
      className: "bg-purple-600 text-white px-8 py-1 rounded-full hover:bg-purple-500 m-2 text-2xl",
      type: "button",
      "data-type": "1",
      "data-name": c1,
      "aria-label": c1
    });
    btn.textContent = c1;
    btn.addEventListener("click", () => {
      // window.* を直接参照せず、存在チェックしてから呼ぶ
      if (typeof window.HandleCategorySearch === "function") {
        window.HandleCategorySearch(1, c1);
      } else {
        console.error("HandleCategorySearch is not available.");
      }
    });
    btnDiv.appendChild(btn);
    div.appendChild(btnDiv);

    // 小カテゴリーのボタン群
    const ul = el("ul", { className: "ml-4" });
    for (let j = 0; j < c2s.length; j++) {
      const name = c2s[j];
      const li = el("li");
      const sBtn = el("button", {
        className:
          "bg-purple-600 text-white px-8 py-1 rounded-full hover:bg-purple-500 m-1 cursor-pointer",
        type: "button",
        "data-type": "2",
        "data-name": name,
        "aria-label": name
      });
      sBtn.textContent = name;
      sBtn.addEventListener("click", () => {
        if (typeof window.HandleCategorySearch === "function") {
          window.HandleCategorySearch(2, name);
        } else {
          console.error("HandleCategorySearch is not available.");
        }
      });
      li.appendChild(sBtn);
      ul.appendChild(li);
    }
    div.appendChild(ul);

    detail.appendChild(div);
    frag.appendChild(detail);
  }

  d.appendChild(frag);
}
