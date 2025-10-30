/**
 * 論文を検索する処理
 * Google Spreadsheetから論文データを検索し、取得する。
 */

const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
const FETCH_URL_SEARCH = "https://script.google.com/macros/s/AKfycbwDzroeSATgUyyun5RVG3rqcidLzafud3h7-fnV20E1etExiKxuVU3u1rl3j3vJPw/exec";
// CSSクラス追加
function addClass(obj, cls) {
    if (!obj.classList.contains(cls)) {
        obj.classList.add(cls);
    }
}

// CSSクラス削除
function removeClass(obj, cls) {
    if (obj.classList.contains(cls)) {
        obj.classList.remove(cls);
    }
}

// 文字列エスケープ処理
function escapeHTML(string){
    return string.replace(/&/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

async function HandleWordSearch () {
    // 必要な値の取得 ========================================
    const beforeScreen = document.getElementById("before-search");
    const loadScreen   = document.getElementById("searching");
    const failScreen   = document.getElementById("search-fail");
    const resultScreen = document.getElementById("search-result");
    const showSearchWords = document.getElementsByClassName("show-search-word");

    const searchCompo  = document.getElementById("search-word");
    const searchWord   = escapeHTML(searchCompo.value);

    // 検索状態に遷移 ========================================
    // 画面全て非表示
    
    // 全てのボタンを取得して無効化
    const btns = document.getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        addClass(btns[i], "opacity-50");
        btns[i].disabled = true;
    }

    // ロード画面表示
    addClass(beforeScreen, "hidden");
    addClass(failScreen, "hidden");
    addClass(resultScreen, "hidden");
    removeClass(loadScreen, "hidden");

    // 値の検証 ========================================

    // 値が不適だった場合「検索失敗」へ
    // 検索結果の取得 ========================================
    const url = FETCH_URL_SEARCH + `?type=search&keyword=${ searchWord }&category1=&category2`;
    const fetchs = await fetch(url)
        .then(res => res.json())
        .then(data => {
            return data;
        });

    if (fetchs.datas.length == 0) {
        // 検索結果がない場合 ========================================

        // 検索ワードの反映
        for (let i = 0; i < showSearchWords.length; i++) {
            showSearchWords[i].innerHTML = searchWord;
        }
    
        // 失敗画面表示
        addClass(beforeScreen, "hidden");
        addClass(loadScreen, "hidden");
        addClass(resultScreen, "hidden");
        removeClass(failScreen, "hidden");
        
    } else {
        // 検索結果があった場合 ======================================
        const datas = fetchs.datas;

        const ul = document.getElementById("paper-list");
        // 子要素の削除
        ul.innerHTML = "";

        // 検索結果の追加
        for (let i = 0; i < datas.length; i++) {
            const li = document.createElement("li");
            let keywords = "";

            for (let j = 0; j < datas[i].keyword.length; j++) {
                keywords = keywords + `<li class="m-1"><button onclick="HandleTagSearch('${ datas[i].keyword[j] }')" class="bg-purple-600 text-white p-2 py-1 rounded-full">${ datas[i].keyword[j] }</button></li>`;
            };

            li.innerHTML = `
<li class="py-4">
    <div class="bg-white rounded-md border p-4">
        <h3 class="text-2xl font-black mt-2 mb-4"><span class="bg-black p-2 rounded text-white">${ datas[i].type }</span>${ datas[i].title }</h3>
        <div class="flex mt-1 mb-1">
            <h4 class="text-lg font-black my-1 mr-4 text-gray-500">大カテゴリー：${ datas[i].category1 }</h4>
            <h4 class="text-lg font-black my-1 mr-4 text-gray-500">小カテゴリー：${ datas[i].category2.filter(c => c != "") }</h4>
        </div>
        <ul class="flex items-center mb-2">
        <li class="font-bold">キーワード：</li>
        ${ keywords }
        </ul>
        <div class="flex justify-end">
            <a href="javascript:openPdf('${ datas[i].pdfUrl }')" class="w-32 text-center bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-md shadow-md">開く</a>
        </div>
    </div>
</li>
            `;
            ul.appendChild(li);
        }

        // 検索ワードの反映
        for (let i = 0; i < showSearchWords.length; i++) {
            showSearchWords[i].innerHTML = searchWord;
        }

        // 取得画面表示
        addClass(beforeScreen, "hidden");
        addClass(loadScreen, "hidden");
        addClass(failScreen, "hidden");
        removeClass(resultScreen, "hidden");
    }

    // ボタン有効
    for (let i = 0; i < btns.length; i++) {
        removeClass(btns[i], "opacity-50");
        btns[i].disabled = false;
    }
}

async function HandleTagSearch(tag) {
    const s = document.getElementById("search-word");
    s.value = tag;
    await HandleWordSearch();
}

async function HandleCategorySearch(type, ctgry) {
    // 必要な値の取得 ========================================
    const beforeScreen = document.getElementById("before-search");
    const loadScreen   = document.getElementById("searching");
    const failScreen   = document.getElementById("search-fail");
    const resultScreen = document.getElementById("search-result");

    const showSearchWords = document.getElementsByClassName("show-search-word");

    let category1 = "";
    let category2 = "";

    if (type == 1) category1 = ctgry;
    if (type == 2) category2 = ctgry;

    // 検索状態に遷移 ========================================
    // 画面全て非表示
    
    // 全てのボタンを取得して無効化
    const btns = document.getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        addClass(btns[i], "opacity-50");
        btns[i].disabled = true;
    }

    // ロード画面表示
    addClass(beforeScreen, "hidden");
    addClass(failScreen, "hidden");
    addClass(resultScreen, "hidden");
    removeClass(loadScreen, "hidden");
    // 値の検証 ========================================

    // 値が不適だった場合「検索失敗」へ
    // 検索結果の取得 ========================================
    const url = FETCH_URL_SEARCH + `?type=search&keyword=&category1=${ category1 }&category2=${ category2 }`;
    const fetchs = await fetch(url)
        .then(res => res.json())
        .then(data => {
            return data;
        });

        console.log(fetchs);

        if (fetchs.datas.length == 0) {
            // 検索結果がない場合 ========================================
    
            // 検索ワードの反映
            for (let i = 0; i < showSearchWords.length; i++) {
                showSearchWords[i].innerHTML = ctgry;
            }
        
            // 失敗画面表示
            addClass(beforeScreen, "hidden");
            addClass(loadScreen, "hidden");
            addClass(resultScreen, "hidden");
            removeClass(failScreen, "hidden");
            
        } else {
            // 検索結果があった場合 ======================================
            const datas = fetchs.datas;
    
            const ul = document.getElementById("paper-list");
            // 子要素の削除
            ul.innerHTML = "";
    
            // 検索結果の追加
            for (let i = 0; i < datas.length; i++) {
                const li = document.createElement("li");
                let keywords = "";
    
                for (let j = 0; j < datas[i].keyword.length; j++) {
                    keywords = keywords + `<li class="m-1"><button onclick="HandleTagSearch('${ datas[i].keyword[j] }')" class="bg-purple-600 text-white p-2 py-1 rounded-full">${ datas[i].keyword[j] }</button></li>`;
                };
    
                li.innerHTML = `
    <li class="py-4">
        <div class="bg-white rounded-md border p-4">
            <h3 class="text-2xl font-black mt-2 mb-4"><span class="bg-black p-2 rounded text-white">${ datas[i].type }</span>${ datas[i].title }</h3>
            <div class="flex mt-1 mb-1">
                <h4 class="text-lg font-black my-1 mr-4 text-gray-500">大カテゴリー：${ datas[i].category1 }</h4>
                <h4 class="text-lg font-black my-1 mr-4 text-gray-500">小カテゴリー：${ datas[i].category2.filter(c => c != "") }</h4>
            </div>
            <ul class="flex items-center mb-2">
            <li class="font-bold">キーワード：</li>
            ${ keywords }
            </ul>
            <div class="flex justify-end">
                <a href="javascript:openPdf('${ datas[i].pdfUrl }')" class="w-32 text-center bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-md shadow-md">開く</a>
            </div>
        </div>
    </li>
                `;
                ul.appendChild(li);
            }
    
            // 検索ワードの反映
            for (let i = 0; i < showSearchWords.length; i++) {
                showSearchWords[i].innerHTML = ctgry;
            }
    
            // 取得画面表示
            addClass(beforeScreen, "hidden");
            addClass(loadScreen, "hidden");
            addClass(failScreen, "hidden");
            removeClass(resultScreen, "hidden");
        }

    // ボタン有効
    for (let i = 0; i < btns.length; i++) {
        removeClass(btns[i], "opacity-50");
        btns[i].disabled = false;
    }
}