/**
 * lp.htmlの背景のアニメーション処理
 */

var particleSystem = null;
var stage = null;

window.addEventListener("load", function () {
    const width = window.innerWidth;
    const height = this.window.innerHeight * 0.7;

    // Stageオブジェクトを作成します。表示リストのルートになります。
    stage = new createjs.Stage("bgCanvas");
    
    // パーティクルシステム作成します。
    particleSystem = new particlejs.ParticleSystem();
    
    // パーティクルシステムの描画コンテナーを表示リストに登録します。
    stage.addChild(particleSystem.container);
    
    // Particle Developから保存したパラメーターを反映します。
    particleSystem.importFromJson(
        // JSONテキストのコピー＆ペースト ここから-- 
        {
            "bgColor": "#00000",
            "width": 10000,
            "height": 514,
            "emitFrequency": 38,
            "startX": 10000,
            "startXVariance": 10000,
            "startY": 205,
            "startYVariance": 144,
            "initialDirection": "0",
            "initialDirectionVariance": 252,
            "initialSpeed": 0,
            "initialSpeedVariance": 1.7,
            "friction": 0.0085,
            "accelerationSpeed": 0.0465,
            "accelerationDirection": 266.7,
            "startScale": "0.76",
            "startScaleVariance": 0.76,
            "finishScale": 0.09,
            "finishScaleVariance": 0.15,
            "lifeSpan": 24,
            "lifeSpanVariance": "305",
            "startAlpha": 0.83,
            "startAlphaVariance": 0.13,
            "finishAlpha": "0.35",
            "finishAlphaVariance": 0.5,
            "shapeIdList": [
                "circle",
                "reverse_blur_circle"
            ],
            "startColor": {
                "hue": 233,
                "hueVariance": 60,
                "saturation": "71",
                "saturationVariance": "78",
                "luminance": "83",
                "luminanceVariance": "16"
            },
            "blendMode": true,
            "alphaCurveType": "1",
            "VERSION": "1.0.0"
        }
        // JSONテキストのコピー＆ペースト ここまで--
    );
    
    particleSystem.width = width;
    particleSystem.startX = width / 2;
    particleSystem.startXVariance = width;
    particleSystem.startY = height - 100;

    function handleTick() {
        // パーティクルの発生・更新
        particleSystem.update();
      
        // 描画を更新する
        stage.update();
    }
    
    // フレームレートの設定
    createjs.Ticker.framerate = 60;
    // 定期的に呼ばれる関数を登録
    createjs.Ticker.on("tick", handleTick);

    // 初期化のために実行
    onResize();
    // リサイズイベント発生時に実行
    window.addEventListener('resize', onResize);
    
    function onResize() {
        // サイズを取得
        const width = window.innerWidth;
        const height = this.window.innerHeight * 0.7;
      
        const canvas = document.getElementById("bgCanvas");
        canvas.width = width;
        canvas.height = height;

        particleSystem.width = width;
        particleSystem.height = height;
        particleSystem.startY = height - 100;
        particleSystem.startX = width / 2;
        particleSystem.startXVariance = width;
    }
});
