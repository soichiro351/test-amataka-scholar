const FETCH_URL_SEARCH = "https://script.google.com/macros/s/AKfycbwDzroeSATgUyyun5RVG3rqcidLzafud3h7-fnV20E1etExiKxuVU3u1rl3j3vJPw/exec";

/* ----- UI helpers ----- */
function showState(state) {
  const map = { before: "before-search", searching: "searching", fail: "search-fail", result: "search-result" };
  ["before-search", "searching", "search-fail", "search-result"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("hidden", id !== map[state]);
  });
}
function escapeHTML(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function setButtonsDisabled(disabled) {
  const btns = document.getElementsByTagName("button");
  for (let i = 0; i < btns.length; i++) {
    btns[i].disabled = disabled;
    btns[i].classList.toggle("opacity-50", disabled);
  }
}
function setShowSearchWord(text) {
  const els = document.getElementsByClassName("show-search-word");
  for (let i = 0; i < els.length; i++) els[i].textContent = text ?? "";
}
function buildSearchUrl(params) {
  const usp = new URLSearchParams();
  usp.set("type", "search");
  if (params.keyword) usp.set("keyword", params.keyword);
  if (params.category1) usp.set("category1", params.category1);
  if (params.category2) usp.set("category2", params.category2);
  return `${FETCH_URL_SEARCH}?${usp.toString()}`;
}
async function fetchJsonWithTimeout(url, timeoutMs = 30000) {
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs));
  const res = await Promise.race([fetch(url), timeout]);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

/* ----- render search results ----- */
function renderResults(datas) {
  const ul = document.getElementById("paper-list");
  ul.innerHTML = "";
  const frag = document.createDocumentFragment();

  for (let i = 0; i < datas.length; i++) {
    const d = datas[i];
    const li = document.createElement("li");
    li.className = "py-4";

    // keyword pills (クラス kw-btn を付与して同期ハンドラを付けやすくする)
    const kw = Array.isArray(d.keyword) ? d.keyword : [];
    const kwHtml = kw
      .map((k) =>
        '<li class="m-1"><button type="button" class="kw-btn bg-purple-600 text-white p-2 py-1 rounded-full">' +
        escapeHTML(k) +
        "</button></li>"
      )
      .join("");

    li.innerHTML =
      '<div class="bg-white rounded-md border p-4">' +
      '<h3 class="text-2xl font-black mt-2 mb-4"><span class="bg-black p-2 rounded text-white">' +
      escapeHTML(d.type ?? "") +
      "</span>" +
      escapeHTML(d.title ?? "無題") +
      "</h3>" +
      '<div class="flex mt-1 mb-1"><h4 class="text-lg font-black my-1 mr-4 text-gray-500">大カテゴリー：' +
      escapeHTML(d.category1 ?? "") +
      '</h4><h4 class="text-lg font-black my-1 mr-4 text-gray-500">小カテゴリー：' +
      escapeHTML((Array.isArray(d.category2) ? d.category2.filter(Boolean) : d.category2 || "").toString()) +
      "</h4></div>" +
      '<ul class="flex items-center mb-2"><li class="font-bold">キーワード：</li>' +
      kwHtml +
      "</ul>" +
      '<div class="flex justify-end"><button type="button" class="open-btn w-32 text-center bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-md shadow-md">開く</button></div>' +
      "</div>";

    /* --- 同期ハンドラを直付け（async/await・setTimeoutなし） --- */
    // 「開く」→ 同期で openPdf 呼び出し（ポップアップ扱い回避）
    const openBtn = li.querySelector(".open-btn");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        openPdf(d.pdfUrl);
      });
    }
    // タグピル → 同期でタグ検索
    const pills = li.querySelectorAll(".kw-btn");
    pills.forEach(function (btn) {
      btn.addEventListener("click", function () {
        HandleTagSearch(btn.textContent);
      });
    });

    frag.appendChild(li);
  }
  ul.appendChild(frag);
}

/* ----- handlers ----- */
async function HandleWordSearch() {
  const searchCompo = document.getElementById("search-word");
  const searchWord = (searchCompo?.value ?? "").trim();

  setButtonsDisabled(true);
  showState("searching");
  try {
    const url = buildSearchUrl({ keyword: searchWord });
    const data = await fetchJsonWithTimeout(url, 30000);
    const datas = Array.isArray(data?.datas) ? data.datas : [];
    setShowSearchWord(searchWord);
    if (datas.length === 0) showState("fail");
    else {
      renderResults(datas);
      showState("result");
    }
  } catch (e) {
    console.error(e);
    setShowSearchWord(searchWord);
    showState("fail");
  } finally {
    setButtonsDisabled(false);
  }
}

async function HandleTagSearch(tag) {
  const s = document.getElementById("search-word");
  if (s) s.value = tag;
  await HandleWordSearch();
}

async function HandleCategorySearch(type, ctgry) {
  let category1 = "", category2 = "";
  if (type === 1) category1 = ctgry;
  if (type === 2) category2 = ctgry;

  setButtonsDisabled(true);
  showState("searching");
  try {
    const url = buildSearchUrl({ category1, category2 });
    const data = await fetchJsonWithTimeout(url, 30000);
    const datas = Array.isArray(data?.datas) ? data.datas : [];
    setShowSearchWord(ctgry);
    if (datas.length === 0) showState("fail");
    else {
      renderResults(datas);
      showState("result");
    }
  } catch (e) {
    console.error(e);
    setShowSearchWord(ctgry);
    showState("fail");
  } finally {
    setButtonsDisabled(false);
  }
}

/* category.js から確実に呼べるよう公開 */
window.HandleWordSearch = HandleWordSearch;
window.HandleTagSearch = HandleTagSearch;
window.HandleCategorySearch = HandleCategorySearch;
