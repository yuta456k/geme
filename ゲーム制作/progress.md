Original prompt: 出力が長くなる場合は、まずフォルダ構成を確定し、その後に各ファイルを順番に全文出力してください。省略は禁止です。高品質な「Vampire Survivors風」の2Dサバイバルアクションゲームを、完成した状態で一式生成してください。

- 初期構成を作成。Canvas + ES Modules + Vite の形で開始。
- 依存や Node はこの環境に入っていないため、起動検証は後段で代替確認も含めて進める。
- ゲーム本体、データ定義、UI、描画、武器システム、README を追加。
- 次回の引き継ぎでは、Node を入れた環境で `npm install && npm run dev` を実行し、プレイフィールと見た目の微調整を行うのがよい。

- 2026-03-15: Start不能を調査。file:// で module script が動かない前提に合わせて src/standalone.js を生成し、index.html を standalone 読み込みに変更。src/ui/dom.js の文字化けで壊れていたボタン HTML も修正。

- 2026-03-15: standalone.js の生成処理がテンプレート文字列と日本語を壊していたため、src/data/weapons.js と src/systems/LevelSystem.js を ASCII ベースで再作成し、raw 連結で standalone を再生成。Start 無反応の根本原因は実行前構文エラーだった可能性が高い。

- 2026-03-19: プレイヤースプライト未反映の原因は実ファイル名が player_sheet.png.png だったこと。assets.js の参照を合わせ、standalone.js を再生成。

- 2026-03-19: プレイヤースプライトの表示倍率を 0.42 から 0.21 に変更して半分サイズに調整。

- 2026-03-19: 敵画像 img_shirasu.png を全敵タイプの参照先として assets.js に反映し、standalone.js を再生成。

- 2026-03-19: レベルアップ候補で使う武器名・補助強化名・説明を英語から日本語へ戻し、standalone.js を再生成。

- 2026-03-19: 火炎瓶描画を画像優先へ変更。weapon.molotov の画像があれば投擲角度に合わせて描画し、無ければプレースホルダーへフォールバック。standalone.js を再生成。

- 2026-03-19: 火炎瓶を4コマスプライトシート対応。投擲中は throwFrames [0,1,2] を使用し、設置後の火炎エリアは landedFrame 3 を表示するように調整。standalone.js を再生成。

- 2026-03-19: 火炎瓶スプライトシートの表示倍率を 0.34 から 0.17 に変更して半分サイズ化。

- 2026-03-20: ペンライト画像 penraito.PNG を weapon.penlight に反映。頭上で左から右へ振る剣軌道へ当たり判定を変更し、描画も画像追従型に更新。standalone.js を再生成。

- 2026-03-20: ペンライト画像を固定倍率ではなく zone.length 基準で拡大するよう変更し、見た目と攻撃範囲を一致させた。standalone.js を再生成。

- 2026-03-20: BGM を assets/audio/bgm/禁じられた御話し.mp3 に切り替え、standalone.js を再生成。
