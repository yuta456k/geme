# Neon Night Survivors

Canvas ベースで動く、見下ろし型のヴァンサバ風 2D サバイバルアクションです。アセット未配置でもプレースホルダーで必ず動くようにしてあり、後から画像・BGM・SE を差し替えやすい構成にしています。

## 初回起動手順

### 1. そのまま開く
- `index.html` をブラウザで開くとプレイできます。
- ES Modules 対応ブラウザを想定しています。

### 2. Node.js がある場合
- `npm install`
- `npm run dev`
- 表示されたローカル URL をブラウザで開く

この作業環境には `node` / `npm` が入っていなかったため、ここでの `npm run dev` 実行確認は未実施です。コードは Vite 構成にしてあります。

## 操作
- 移動: `WASD` / 矢印キー
- 攻撃: 自動
- ポーズ: `P` / `Esc`
- フルスクリーン: `F`
- モバイル: 左下の仮想スティック

## 実装済み要素
- タイトル画面
- ゲーム画面
- レベルアップ選択 UI
- ゲームオーバー画面
- HP / EXP / レベル / 生存時間 / スコア / 所持武器 UI
- 左右に壁のある縦長ステージ
- 経験値ドロップ
- コーラ回復アイテム
- 複数敵種
- 7 武器
- プレースホルダー描画と音声フェイルセーフ
- `window.render_game_to_text()`
- `window.advanceTime(ms)`

## 武器仕様
- スター: デフォルト所持。追尾寄りの投射武器
- シャボン玉: プレイヤー追従の持続範囲ダメージ
- 火炎瓶: ランダム地点へ投擲し炎床を生成
- ウンチ: 予兆付きで落下する範囲攻撃
- ペンライト: 縦長の高打点攻撃。Lv5 で残像ダメージ
- 箒: 進行方向へ飛ぶ貫通弾
- 猫: 1 体の猫を召喚。Lv2-Lv4 で連撃数増加、Lv5 で移動速度 2 倍級

## フォルダ構成

```text
.
├─ index.html
├─ package.json
├─ README.md
├─ progress.md
├─ assets/
│  ├─ images/
│  │  ├─ player/
│  │  ├─ enemies/
│  │  ├─ weapons/
│  │  ├─ items/
│  │  ├─ effects/
│  │  ├─ ui/
│  │  └─ stage/
│  └─ audio/
│     ├─ bgm/
│     └─ se/
└─ src/
   ├─ main.js
   ├─ styles.css
   ├─ data/
   │  ├─ assets.js
   │  ├─ constants.js
   │  ├─ enemies.js
   │  └─ weapons.js
   ├─ entities/
   │  ├─ CatMinion.js
   │  ├─ Enemy.js
   │  ├─ Pickup.js
   │  └─ Player.js
   ├─ game/
   │  ├─ AssetManager.js
   │  ├─ AudioManager.js
   │  ├─ Game.js
   │  ├─ InputManager.js
   │  └─ Renderer.js
   ├─ systems/
   │  ├─ LevelSystem.js
   │  └─ WeaponSystem.js
   ├─ ui/
   │  └─ dom.js
   └─ utils/
      └─ math.js
```

## アセット差し替え方法

画像・音声の参照先は `src/data/assets.js` に集約しています。ファイル名を合わせて配置するだけで差し替えできます。

### 画像
- プレイヤー: `assets/images/player/player.png`
- 敵: `assets/images/enemies/slime.png`, `bat.png`, `brute.png`, `witch.png`
- 武器: `assets/images/weapons/star.png`, `bubble.png`, `molotov.png`, `poop.png`, `penlight.png`, `broom.png`, `cat.png`
- アイテム: `assets/images/items/xp_gem.png`, `cola.png`
- エフェクト: `assets/images/effects/fire.png`, `hit.png`
- UI: `assets/images/ui/logo.png`
- ステージ: `assets/images/stage/floor.png`, `wall.png`

### 音声
- BGM: `assets/audio/bgm/main_theme.ogg`
- SE: `assets/audio/se/hit.wav`, `levelup.wav`, `heal.wav`, `gameover.wav`

アセットが存在しない場合:
- 画像は色付き図形や仮エフェクトで代替表示されます
- 音声は読み込み失敗でも無音で継続します

## 調整しやすい主要定数

### 全体設定
- `src/data/constants.js`
- `GAME_CONFIG.viewport`: 描画解像度
- `GAME_CONFIG.world`: ステージ幅・高さ・壁厚
- `GAME_CONFIG.player`: 基本 HP、移動速度、取得範囲、接触無敵
- `GAME_CONFIG.performance`: 敵数・弾数・ゾーン数の上限
- `GAME_CONFIG.cola`: コーラ回復量とドロップ率
- `GAME_CONFIG.spawn`: 敵出現間隔の基本値と加速率

### 敵バランス
- `src/data/enemies.js`
- 各敵の `hp`, `speed`, `damagePerSecond`, `xp`, `radius`

### 武器バランス
- `src/data/weapons.js`
- 各武器の `levels` 配列
- ダメージ、クールタイム、発射数、範囲、持続時間などをレベルごとに調整可能

### レベルアップ頻度
- `src/systems/LevelSystem.js`
- `getXpForLevel(level)` を調整

## 設計メモ
- 武器定義は `WEAPON_DEFS` に集約
- パッシブ強化は `PASSIVE_UPGRADES` に集約
- 画面 UI は `src/ui/dom.js`
- 描画は `src/game/Renderer.js`
- 武器挙動は `src/systems/WeaponSystem.js`
- 将来の武器追加は `src/data/weapons.js` に定義を追加し、`WeaponSystem.js` に発動ロジックを追加する流れです

## 補足
- プレイ開始時点でスター Lv1 を所持
- 猫は 1 体召喚仕様です
- アセット未配置でも遊べることを最優先にしています
