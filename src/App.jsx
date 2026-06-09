import { useState, useEffect, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════
// 🌐 I18N — 国際化システム（日・英・韓・中）
// ═══════════════════════════════════════════════════════════════

const LANG_KEY = "mamoru_lang";
const ONBOARDING_KEY = "mamoru_onboarding_v1";
const AGE_MODE_KEY = "mamoru_age_mode";
const LANGUAGES = [
  { code: "ja", flag: "🇯🇵", name: "日本語" },
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "ko", flag: "🇰🇷", name: "한국어" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
];

// 翻訳辞書（ホーム + Ep1 完全ローカライズ）
const I18N = {
  // ═══════ HOME ═══════
  home: {
    badge: {
      ja: "SNS LITERACY APP", en: "SNS LITERACY APP",
      ko: "SNS 리터러시 앱", zh: "社交媒体素养应用",
    },
    appName: {
      ja: "マモル 🛡️", en: "Mamoru 🛡️",
      ko: "마모루 🛡️", zh: "守护 🛡️",
    },
    beta: { ja: "β版", el: "β{版|ばん}", en: "Beta", ko: "베타", zh: "测试版" },
    greeting: {
      ja: "やあ！モリィだよ🦉", en: "Hi! I'm Morrie 🦉",
      ko: "안녕! 나는 모리야 🦉", zh: "你好！我是莫莉 🦉",
    },
    greetingDesc: {
      ja: "SNSの危険を**体験して学ぼう**。<br />どのモードからはじめる？",
      el: "SNSの{危険|きけん}を**{体験|たいけん}して{学|まな}ぼう**。<br />どのモードからはじめる？",
      en: "**Learn SNS dangers by experiencing them.**<br />Which mode will you start with?",
      ko: "SNS의 위험을 **체험하며 배워보자**.<br />어떤 모드부터 시작할까?",
      zh: "通过**体验来学习**社交媒体的危险。<br />从哪个模式开始？",
    },
    statsMode: { ja: "モード", en: "Modes", ko: "모드", zh: "模式" },
    statsStar: { ja: "スター", en: "Stars", ko: "스타", zh: "星星" },
    statsClear: { ja: "クリア", en: "Cleared", ko: "클리어", zh: "通关" },
    sectionPlay: { ja: "PLAY", en: "PLAY", ko: "플레이", zh: "开始游戏" },
    sectionSoon: { ja: "COMING SOON", en: "COMING SOON", ko: "곧 출시", zh: "即将推出" },
    soonLabel: { ja: "準備中", el: "{準備中|じゅんびちゅう}", en: "Soon", ko: "준비 중", zh: "准备中" },
    clearedBadge: { ja: "✓ クリア", en: "✓ Done", ko: "✓ 완료", zh: "✓ 已完成" },
    newBadge: { ja: "NEW", en: "NEW", ko: "NEW", zh: "新" },
    parentReport: { ja: "保護者向けレポート", el: "{保護者|ほごしゃ}{向|む}けレポート", en: "Parent Dashboard", ko: "보호자 리포트", zh: "家长报告" },
    parentReportDesc: {
      ja: "学習記録・アドバイス・次のステップ",
      el: "{学習|がくしゅう}{記録|きろく}・アドバイス・{次|つぎ}のステップ",
      en: "Records, advice, next steps",
      ko: "학습 기록 · 조언 · 다음 단계",
      zh: "学习记录·建议·下一步",
    },
  },

  // ═══════ MODES ═══════
  modes: {
    ep1: {
      tag: {
        ja: "EPISODE 01 · 探偵モード",
        el: "EPISODE 01 · {探偵|たんてい}モード",
        en: "EPISODE 01 · Detective Mode",
        ko: "EPISODE 01 · 탐정 모드",
        zh: "第01话 · 侦探模式",
      },
      title: {
        ja: "その写真、アップロードして大丈夫？",
        el: "その{写真|しゃしん}、アップロードして{大丈夫|だいじょうぶ}？",
        en: "That Photo — Is It Safe to Upload?",
        ko: "그 사진, 올려도 괜찮아?",
        zh: "那张照片，上传没问题吗？",
      },
      desc: {
        ja: "ミナちゃんの投稿から危険なポイントを見つける探偵体験。",
        el: "ミナちゃんの{投稿|とうこう}から{危険|きけん}なポイントを{見|み}つける{探偵|たんてい}{体験|たいけん}。",
        en: "Become a detective and find dangerous clues in Emma's SNS posts.",
        ko: "민아의 게시물에서 위험한 단서를 찾는 탐정 체험.",
        zh: "在小美的帖子中寻找危险线索的侦探体验。",
      },
      duration: { ja: "約7分", el: "{約|やく}7{分|ふん}", en: "About 7 min", ko: "약 7분", zh: "约7分钟" },
      audience: {
        ja: "小〜中学生", el: "{小|しょう}〜{中学生|ちゅうがくせい}",
        en: "Ages 9-14", ko: "초·중학생", zh: "小学高年级~初中",
      },
    },
    ep2: {
      tag: { ja: "EPISODE 02 · 情報鑑定モード", el: "EPISODE 02 · {情報|じょうほう}{鑑定|かんてい}モード", en: "EPISODE 02 · Fact Check Mode", ko: "EPISODE 02 · 정보 감정 모드", zh: "第02话 · 信息鉴定" },
      title: { ja: "フェイクニュースを見抜け", el: "フェイクニュースを{見抜|みぬ}け", en: "Spot the Fake News", ko: "가짜뉴스를 잡아라", zh: "识破假新闻" },
      desc: {
        ja: "SNSに流れる「本物・偽物」の投稿を見分ける情報鑑定ゲーム。",
        el: "SNSに{流|なが}れる「{本物|ほんもの}・{偽物|にせもの}」の{投稿|とうこう}を{見分|みわ}ける{情報|じょうほう}{鑑定|かんてい}ゲーム。",
        en: "Train your eye to distinguish real news from fakes on social media.",
        ko: "SNS에 흐르는 '진짜·가짜' 게시물을 구별하는 정보 감정 게임.",
        zh: "辨别社交媒体上真假帖子的信息鉴定游戏。",
      },
      duration: { ja: "約8分", el: "{約|やく}8{分|ふん}", en: "About 8 min", ko: "약 8분", zh: "约8分钟" },
      audience: { ja: "小〜中学生", el: "{小|しょう}〜{中学生|ちゅうがくせい}", en: "Ages 9-14", ko: "초·중학생", zh: "小学高年级~初中" },
    },
    ep3: {
      tag: { ja: "EPISODE 03 · 選択体験モード", el: "EPISODE 03 · {選択|せんたく}{体験|たいけん}モード", en: "EPISODE 03 · Choice Mode", ko: "EPISODE 03 · 선택 체험 모드", zh: "第03话 · 选择体验" },
      title: { ja: "断れなくなる前に", el: "{断|ことわ}れなくなる{前|まえ}に", en: "Before You Can't Say No", ko: "거절할 수 없게 되기 전에", zh: "在无法拒绝之前" },
      desc: {
        ja: "「高収入バイト」のDMに返信するとどうなる？闇バイト勧誘を体験。",
        el: "「{高収入|こうしゅうにゅう}バイト」のDMに{返信|へんしん}するとどうなる？{闇|やみ}バイト{勧誘|かんゆう}を{体験|たいけん}。",
        en: "Experience how 'easy money' messages trap teens into illegal work.",
        ko: "'고수익 알바' DM에 답장하면 어떻게 될까? 범죄 알바 유혹 체험.",
        zh: "回复\"高收入兼职\"的私信会怎样？体验非法兼职诱骗。",
      },
      duration: { ja: "約8分", el: "{約|やく}8{分|ふん}", en: "About 8 min", ko: "약 8분", zh: "约8分钟" },
      audience: { ja: "中学生〜・親子で", el: "{中学生|ちゅうがくせい}〜・{親子|おやこ}で", en: "Ages 12+ / With parents", ko: "중학생~ · 부모와 함께", zh: "初中~ · 亲子" },
    },
    ep32: {
      tag: { ja: "EPISODE 03-2 · 怪しい求人を見抜く", el: "EPISODE 03-2 · {怪|あや}しい{求人|きゅうじん}を{見抜|みぬ}く", en: "EPISODE 03-2 · Spot the Dark Job", ko: "EPISODE 03-2 · 이상한 구인 간파하기", zh: "第03-2话 · 识破可疑招募" },
      title: { ja: "その求人、闇バイトじゃない？", el: "その{求人|きゅうじん}、{闇|やみ}バイトじゃない？", en: "Is That Job Listing Legit?", ko: "그 구인, 불법 아르바이트 아냐?", zh: "那个招聘，是非法兼职吗？" },
      desc: {
        ja: "X・Instagram・求人サイト…3つの場面で怪しいポイントを全部タップして見つけよう。",
        el: "X・Instagram・{求人|きゅうじん}サイト…3つの{場面|ばめん}で{怪|あや}しいポイントを{全部|ぜんぶ}タップして{見|み}つけよう。",
        en: "X, Instagram, job sites... Find all the suspicious points in 3 real-looking scams.",
        ko: "X, 인스타그램, 구인 사이트... 3개 장면에서 수상한 포인트를 모두 찾아라.",
        zh: "X、Instagram、求职网站…在3个场景中找出所有可疑点。",
      },
      duration: { ja: "約8分", el: "{約|やく}8{分|ふん}", en: "About 8 min", ko: "약 8분", zh: "约8分钟" },
      audience: { ja: "中学生〜・親子で", el: "{中学生|ちゅうがくせい}〜・{親子|おやこ}で", en: "Ages 12+ / With parents", ko: "중학생~ · 부모와 함께", zh: "初中~ · 亲子" },
    },
    ep4: {
      tag: { ja: "EPISODE 04 · フィッシング詐欺体験", el: "EPISODE 04 · フィッシング{詐欺|さぎ}{体験|たいけん}", en: "EPISODE 04 · Impersonation", ko: "EPISODE 04 · 사칭 체험", zh: "第04话 · 假冒身份" },
      title: { ja: "そっくり！偽サイトの罠", el: "そっくり！{偽|にせ}サイトの{罠|わな}", en: "The Friend Who Wasn't", ko: "친구를 가장한 함정", zh: "假装是朋友的陷阱" },
      desc: {
        ja: "本物そっくりの偽サイトにIDとパスワードを入力してしまうと…フィッシング詐欺の手口を体験しよう。",
        el: "{本物|ほんもの}そっくりの{偽|にせ}サイトにIDとパスワードを{入力|にゅうりょく}してしまうと…フィッシング{詐欺|さぎ}の{手口|てぐち}を{体験|たいけん}しよう。",
        en: "A 'friend' asks for your verification code. Experience how accounts get hijacked.",
        ko: "'친구'에게서 온 인증코드 요청 메시지. 계정 탈취 수법 체험.",
        zh: "\"朋友\"要求验证码,体验账号被盗的过程。",
      },
      duration: { ja: "約7分", el: "{約|やく}7{分|ふん}", en: "About 7 min", ko: "약 7분", zh: "约7分钟" },
      audience: { ja: "小〜中学生・親子で", el: "{小|しょう}〜{中学生|ちゅうがくせい}・{親子|おやこ}で", en: "Ages 9-14 / With parents", ko: "초·중학생 · 부모와 함께", zh: "小学高年级~初中 · 亲子" },
    },
    attacker: {
      tag: { ja: "SPECIAL · 攻撃者体験", el: "SPECIAL · {攻撃者|こうげきしゃ}{体験|たいけん}", en: "SPECIAL · Attacker View", ko: "SPECIAL · 가해자 시점", zh: "特别篇 · 攻击者视角" },
      title: { ja: "投稿したら、何がバレる？", el: "{投稿|とうこう}したら、{何|なに}がバレる？", en: "What Will Your Post Reveal?", ko: "게시하면 무엇이 들킬까?", zh: "发帖会暴露什么?" },
      desc: {
        ja: "自分で投稿→AIが悪意ある人物に切り替わる。何がバレるか体験。",
        el: "{自分|じぶん}で{投稿|とうこう}→AIが{悪意|あくい}ある{人物|じんぶつ}に{切|き}り{替|か}わる。{何|なに}がバレるか{体験|たいけん}。",
        en: "Post like normal → AI switches to a malicious viewpoint. See what's exposed.",
        ko: "직접 게시 → AI가 악의적 인물 시점으로 전환. 무엇이 드러나는지 체험.",
        zh: "自己发帖→AI切换到恶意者视角。体验什么会被暴露。",
      },
      duration: { ja: "約5分", el: "{約|やく}5{分|ふん}", en: "About 5 min", ko: "약 5분", zh: "约5分钟" },
      audience: { ja: "親子で", el: "{親子|おやこ}で", en: "With parents", ko: "부모와 함께", zh: "亲子" },
    },
  },

  // ═══════ COMING SOON ═══════
  soon: {
    ep5: { ja: "ネットいじめ・グループ外し", el: "ネットいじめ・グループ{外|はず}し", en: "Cyberbullying & Group Exclusion", ko: "사이버 따돌림", zh: "网络欺凌·群组排挤" },
    ep6: { ja: "自画撮り被害・画像拡散", el: "{自画撮|じがど}り{被害|ひがい}・{画像|がぞう}{拡散|かくさん}", en: "Self-image Exposure", ko: "셀카 피해·이미지 유포", zh: "自拍受害·图像扩散" },
    twoDevice: { ja: "2台モード（親が犯罪者役）", el: "2{台|だい}モード（{親|おや}が{犯罪者|はんざいしゃ}{役|やく}）", en: "2-Device Mode (Parent as attacker)", ko: "2대 기기 모드 (부모가 가해자 역)", zh: "双设备模式(家长扮演)" },
  },

  // ═══════ EP1 ═══════
  ep1: {
    chapter: { ja: "EPISODE 01", en: "EPISODE 01", ko: "EPISODE 01", zh: "第 01 话" },
    title: { ja: "消えた写真の秘密", el: "{消|き}えた{写真|しゃしん}の{秘密|ひみつ}", en: "The Vanished Photo's Secret", ko: "사라진 사진의 비밀", zh: "消失照片的秘密" },
    subtitle: {
      ja: "— マモル: SNSリテラシーアドベンチャー —",
      en: "— Mamoru: SNS Literacy Adventure —",
      ko: "— 마모루: SNS 리터러시 어드벤처 —",
      zh: "— 守护:社交媒体素养冒险 —",
    },
    introDesc: {
      ja: "友だちの**ミナちゃん**が、知らない人からの怖いメッセージで困っているみたい。<br /><br />ミナの投稿から**「どこから情報がもれたか」**を一緒に見つけてあげよう。",
      el: "{友|とも}だちの**ミナちゃん**が、{知|し}らない{人|ひと}からの{怖|こわ}いメッセージで{困|こま}っているみたい。<br /><br />ミナの{投稿|とうこう}から**「どこから{情報|じょうほう}がもれたか」**を{一緒|いっしょ}に{見|み}つけてあげよう。",
      en: "Your friend **Emma** is being harassed by messages from a stranger.<br /><br />Help her find **\"where the leak came from\"** in her past posts.",
      ko: "친구 **민아**가 모르는 사람의 무서운 메시지로 곤란해하고 있어.<br /><br />민아의 게시물에서 **\"어디서 정보가 새었는지\"** 같이 찾아보자.",
      zh: "朋友**小美**收到陌生人的恐怖消息很困扰。<br /><br />一起从小美的帖子中找出**\"信息从哪里泄露的\"**吧。",
    },
    introStart: { ja: "はじめる", en: "Start", ko: "시작하기", zh: "开始" },
    characterName: {
      ja: "ミナ", en: "Emma", ko: "민아", zh: "小美",
    },
    characterHandle: {
      ja: "@mina_0414", en: "@emma_0414", ko: "@minah_0414", zh: "@xiaomei_0414",
    },
    characterAge: { ja: "中学1年生", el: "{中学|ちゅうがく}1{年生|ねんせい}", en: "13 years old", ko: "중학교 1학년", zh: "初一" },
    normalOwl: {
      ja: "まずは、ミナちゃんのいつものSNSをみてみよう🦉",
      en: "Let's look at Emma's usual SNS posts first 🦉",
      ko: "우선 민아의 평소 SNS를 살펴보자 🦉",
      zh: "先看看小美平时的社交媒体吧 🦉",
    },
    followers: { ja: "フォロワー", en: "Followers", ko: "팔로워", zh: "粉丝" },
    nextPost: { ja: "次の投稿をみる →", el: "{次|つぎ}の{投稿|とうこう}をみる →", en: "Next post →", ko: "다음 게시물 →", zh: "下一篇帖子 →" },
    looksHappy: {
      ja: "ミナちゃんは楽しそう ✨",
      el: "ミナちゃんは{楽|たの}しそう ✨",
      en: "Emma looks happy ✨",
      ko: "민아는 즐거워 보여 ✨",
      zh: "小美看起来很开心 ✨",
    },
    daysLater: { ja: "...数日後...", el: "...{数日後|すうにちご}...", en: "...A few days later...", ko: "...며칠 후...", zh: "...几天后..." },
    unknownSender: { ja: "UNKNOWN SENDER", en: "UNKNOWN SENDER", ko: "알 수 없는 발신자", zh: "未知发件人" },
    newDM: { ja: "新しいDM", el: "{新|あたら}しいDM", en: "New DM", ko: "새 DM", zh: "新私信" },
    justNow: { ja: "たった今", el: "たった{今|いま}", en: "Just now", ko: "방금", zh: "刚刚" },
    unknownUser: { ja: "不明なユーザー", el: "{不明|ふめい}なユーザー", en: "Unknown user", ko: "알 수 없는 사용자", zh: "未知用户" },
    online: { ja: "● オンライン", en: "● Online", ko: "● 온라인", zh: "● 在线" },
    dm1: {
      ja: "ミナちゃん、今日のおやつ美味しそうだったね。",
      el: "ミナちゃん、{今日|きょう}のおやつ{美味|おい}しそうだったね。",
      en: "Hey Emma, that snack looked delicious today.",
      ko: "민아야, 오늘 간식 맛있어 보였어.",
      zh: "小美,今天的点心看起来好好吃。",
    },
    dm2: {
      ja: "君の家、知ってるよ。",
      el: "{君|きみ}の{家|いえ}、{知|し}ってるよ。",
      en: "I know where you live.",
      ko: "네 집, 알고 있어.",
      zh: "我知道你家在哪。",
    },
    helpAlert: {
      ja: "⚠️ ミナちゃんが助けを求めている",
      el: "⚠️ ミナちゃんが{助|たす}けを{求|もと}めている",
      en: "⚠️ Emma needs help",
      ko: "⚠️ 민아가 도움을 청하고 있어",
      zh: "⚠️ 小美在求助",
    },
    investigate: { ja: "🔍 投稿を調べる", el: "🔍 {投稿|とうこう}を{調|しら}べる", en: "🔍 Investigate", ko: "🔍 게시물 조사하기", zh: "🔍 调查帖子" },
    evidenceScan: { ja: "EVIDENCE SCAN", en: "EVIDENCE SCAN", ko: "증거 스캔", zh: "证据扫描" },
    investigateOwl: {
      ja: "投稿の中から**「危険なポイント」**をタップして見つけよう。{n}個あるよ。",
      el: "{投稿|とうこう}の{中|なか}から**「{危険|きけん}なポイント」**をタップして{見|み}つけよう。{n}{個|こ}あるよ。",
      en: "Tap to find the **\"danger points\"** in the post. There are {n}.",
      ko: "게시물 속 **\"위험한 포인트\"**를 탭해서 찾아보자. {n}개야.",
      zh: "点击找出帖子中的**\"危险点\"**。共{n}个。",
    },
    foundCount: { ja: "発見済み", el: "{発見|はっけん}{済|す}み", en: "Found", ko: "발견함", zh: "已发现" },
    danger: { ja: "⚠️ キケン", en: "⚠️ DANGER", ko: "⚠️ 위험", zh: "⚠️ 危险" },
    safe: { ja: "✅ あんしん", en: "✅ SAFE", ko: "✅ 안전", zh: "✅ 安全" },
    gotIt: { ja: "なるほど！", en: "Got it!", ko: "알겠어!", zh: "明白了!" },
    nextInvestigate: { ja: "次の投稿を調べる →", el: "{次|つぎ}の{投稿|とうこう}を{調|しら}べる →", en: "Next post →", ko: "다음 게시물 →", zh: "下一篇 →" },
    toExplanation: { ja: "捜査完了 → 解説へ", el: "{捜査|そうさ}{完了|かんりょう} → {解説|かいせつ}へ", en: "Investigation done → Lesson", ko: "수사 완료 → 해설", zh: "调查完成 → 解说" },
    problemTitle: {
      ja: "ミナちゃんのSNSの問題点",
      el: "ミナちゃんのSNSの{問題点|もんだいてん}",
      en: "Issues with Emma's SNS",
      ko: "민아의 SNS 문제점",
      zh: "小美社交媒体的问题",
    },
    dangersFound: { ja: "個の危険発見", el: "{個|こ}の{危険|きけん}{発見|はっけん}", en: " dangers found", ko: "개의 위험 발견", zh: "处危险" },
    explanationOwl: {
      ja: "これだけの情報があれば、悪い人は**家まで突き止められる**んだ…",
      el: "これだけの{情報|じょうほう}があれば、{悪|わる}い{人|ひと}は**{家|いえ}まで{突|つ}き{止|と}められる**んだ…",
      en: "With this much info, a bad person can **find your home**...",
      ko: "이만큼의 정보가 있으면 나쁜 사람은 **집까지 알아낼 수 있어**…",
      zh: "有这么多信息,坏人可以**找到你家**…",
    },
    realCaseLabel: { ja: "実際の被害事例", el: "{実際|じっさい}の{被害|ひがい}{事例|じれい}", en: "Real Case", ko: "실제 피해 사례", zh: "真实案例" },
    realCase: {
      ja: "女子中学生がSNSに投稿した写真の**校章・背景**から、知らない男性が自宅を突き止め待ち伏せした事件が実際に報告されています。",
      el: "{女子中学生|じょしちゅうがくせい}がSNSに{投稿|とうこう}した{写真|しゃしん}の**{校章|こうしょう}・{背景|はいけい}**から、{知|し}らない{男性|だんせい}が{自宅|じたく}を{突|つ}き{止|と}め{待|ま}ち{伏|ふ}せした{事件|じけん}が{実際|じっさい}に{報告|ほうこく}されています。",
      en: "A real case: A middle school girl's photos with **school crest and background** allowed a stranger to find her home and wait for her there.",
      ko: "여중생이 SNS에 올린 사진의 **교표·배경**으로 모르는 남성이 집을 알아내 매복한 실제 사건이 보고됨.",
      zh: "实际报告:一名初中女生发的照片中**校徽·背景**让陌生男性找到她家并蹲守。",
    },
    tip1Title: {
      ja: "投稿する前に写真の隅々まで確認",
      el: "{投稿|とうこう}する{前|まえ}に{写真|しゃしん}の{隅々|すみずみ}まで{確認|かくにん}",
      en: "Check every corner of photos before posting",
      ko: "올리기 전에 사진 구석구석 확인",
      zh: "发布前检查照片每个角落",
    },
    tip1Desc: {
      ja: "校章・表札・看板・ナンバープレート",
      el: "{校章|こうしょう}・{表札|ひょうさつ}・{看板|かんばん}・ナンバープレート",
      en: "School crest, nameplate, signs, license plates",
      ko: "교표·문패·간판·번호판",
      zh: "校徽·门牌·招牌·车牌",
    },
    tip3Title: {
      ja: "「家の近く」がわかる投稿は控える",
      el: "「{家|いえ}の{近|ちか}く」がわかる{投稿|とうこう}は{控|ひか}える",
      en: "Avoid posts that reveal your neighborhood",
      ko: "'집 근처'를 알 수 있는 게시 자제",
      zh: "避免暴露住处附近的帖子",
    },
    tip3Desc: {
      ja: "自宅・通学路・行きつけのお店",
      el: "{自宅|じたく}・{通学路|つうがくろ}・{行|い}きつけのお{店|みせ}",
      en: "Home, school route, favorite spots",
      ko: "집·통학로·자주 가는 가게",
      zh: "家·上学路·常去的店",
    },
    talkToFamily: {
      ja: "おうちの人とお話しする →",
      el: "おうちの{人|ひと}とお{話|はな}しする →",
      en: "Talk with family →",
      ko: "가족과 이야기하기 →",
      zh: "和家人聊聊 →",
    },
    dialogueTitle: {
      ja: "おうちの人と話してみよう",
      el: "おうちの{人|ひと}と{話|はな}してみよう",
      en: "Talk With Your Family",
      ko: "가족과 이야기해 보자",
      zh: "和家人聊一聊",
    },
    dialogueSub: {
      ja: "今日学んだことを一緒に話し合おう",
      el: "{今日|きょう}{学|まな}んだことを{一緒|いっしょ}に{話|はな}し{合|あ}おう",
      en: "Discuss what you learned today together",
      ko: "오늘 배운 것을 함께 이야기해 보자",
      zh: "一起讨论今天学到的内容",
    },
    q1: {
      ja: ["わたしのSNS投稿、見直してみる？", "家がバレるヒントは入っていない？"],
      el: ["わたしのSNS{投稿|とうこう}、{見直|みなお}してみる？", "{家|いえ}がバレるヒントは{入|はい}っていない？"],
      en: ["Should I review my SNS posts?", "Are there hints that reveal where you live?"],
      ko: ["내 SNS 게시물 다시 볼까?", "집이 들킬 단서는 없나?"],
      zh: ["要不要重新看看我的帖子?", "有没有泄露住址的线索?"],
    },
    q2: {
      ja: ["スマホの位置情報、どうなってる？", "一緒に設定を確認しよう"],
      el: ["スマホの{位置情報|いちじょうほう}、どうなってる？", "{一緒|いっしょ}に{設定|せってい}を{確認|かくにん}しよう"],
      en: ["What about phone location?", "Let's check the settings together"],
      ko: ["스마트폰 위치 정보는?", "함께 설정을 확인하자"],
      zh: ["手机位置信息怎样?", "一起检查设置"],
    },
    q3: {
      ja: ["もし変なDMが来たらどうする？", "返事しない・スクショ・家の人に相談"],
      el: ["もし{変|へん}なDMが{来|き}たらどうする？", "{返事|へんじ}しない・スクショ・{家|いえ}の{人|ひと}に{相談|そうだん}"],
      en: ["What if you get a creepy DM?", "Don't reply, screenshot, tell family"],
      ko: ["이상한 DM이 오면 어떻게?", "답장 X·캡처·가족에게 상담"],
      zh: ["收到奇怪私信怎么办?", "不回复·截图·告诉家人"],
    },
    q4: {
      ja: ["「投稿しない勇気」って大切？", "全部をSNSにのせる必要はない"],
      el: ["「{投稿|とうこう}しない{勇気|ゆうき}」って{大切|たいせつ}？", "{全部|ぜんぶ}をSNSにのせる{必要|ひつよう}はない"],
      en: ["Is the courage NOT to post important?", "You don't need to share everything"],
      ko: ["'올리지 않는 용기'는 중요해?", "전부 SNS에 올릴 필요는 없어"],
      zh: ["\"不发的勇气\"重要吗?", "不必把一切都发上去"],
    },
    getCert: { ja: "🏆 修了証をもらう", el: "🏆 {修了証|しゅうりょうしょう}をもらう", en: "🏆 Get Certificate", ko: "🏆 수료증 받기", zh: "🏆 获得证书" },
    certLabel: { ja: "CERTIFICATE", en: "CERTIFICATE", ko: "CERTIFICATE", zh: "证书" },
    certTitle: { ja: "しゅうりょうしょう", en: "Certificate of Completion", ko: "수료증", zh: "结业证书" },
    certBody: {
      ja: "あなたは「マモル」第1話<br />**消えた写真の秘密**<br />をクリアしました。",
      el: "あなたは「マモル」{第|だい}1{話|わ}<br />**{消|き}えた{写真|しゃしん}の{秘密|ひみつ}**<br />をクリアしました。",
      en: "You completed Mamoru EP 1<br />**The Vanished Photo's Secret**",
      ko: "당신은 마모루 1화<br />**사라진 사진의 비밀**<br />을 완료했습니다.",
      zh: "你完成了「守护」第1话<br />**消失照片的秘密**",
    },
    ep1Complete: { ja: "EPISODE 01 COMPLETE", en: "EPISODE 01 COMPLETE", ko: "EPISODE 01 COMPLETE", zh: "第01话 完成" },
    masterTitle: {
      ja: "⭐ 個人情報マスター ⭐",
      el: "⭐ {個人情報|こじんじょうほう}マスター ⭐",
      en: "⭐ Privacy Master ⭐",
      ko: "⭐ 개인정보 마스터 ⭐",
      zh: "⭐ 个人信息大师 ⭐",
    },
    share: { ja: "📤 シェア", en: "📤 Share", ko: "📤 공유", zh: "📤 分享" },
    toHome: { ja: "🏠 ホームへ", en: "🏠 Home", ko: "🏠 홈으로", zh: "🏠 主页" },
    shareTitle: {
      ja: "マモル EP1 クリア！",
      en: "Mamoru EP1 Complete!",
      ko: "마모루 EP1 클리어!",
      zh: "守护 第1话 完成!",
    },
    shareText: {
      ja: "SNSリテラシーアプリ「マモル」で個人情報マスターになりました🏆",
      el: "SNSリテラシーアプリ「マモル」で{個人情報|こじんじょうほう}マスターになりました🏆",
      en: "I became a Privacy Master on Mamoru, the SNS literacy app 🏆",
      ko: "SNS 리터러시 앱 마모루에서 개인정보 마스터가 됐어요 🏆",
      zh: "在社交媒体素养应用「守护」中成为了个人信息大师 🏆",
    },
  },

  // ═══════ EP1_2 ═══════
  ep1_2: {
    certLabel: { ja: "CERTIFICATE", en: "CERTIFICATE", ko: "CERTIFICATE", zh: "证书" },
    certTitle: { ja: "しゅうりょうしょう", en: "Certificate of Completion", ko: "수료증", zh: "结业证书" },
    certBody: {
      ja: "あなたは「マモル」第1話-2<br />**本当は、位置情報が見えてるよ**<br />をクリアしました。",
      el: "あなたは「マモル」{第|だい}1{話|わ}-2<br />**{本当|ほんとう}は、{位置情報|いちじょうほう}が{見|み}えてるよ**<br />をクリアしました。",
      en: "You completed Mamoru EP 1-2<br />**Your Location Is Always Visible**",
      ko: "당신은 마모루 1-2화<br />**사실은 위치 정보가 보여**<br />을 완료했습니다.",
      zh: "你完成了「守护」第1-2话<br />**其实位置信息一直可见**",
    },
    epComplete: { ja: "EPISODE 01-2 COMPLETE", en: "EPISODE 01-2 COMPLETE", ko: "EPISODE 01-2 COMPLETE", zh: "第01-2话 完成" },
    masterTitle: {
      ja: "⭐ 位置情報マスター ⭐",
      el: "⭐ {位置情報|いちじょうほう}マスター ⭐",
      en: "⭐ Location Privacy Master ⭐",
      ko: "⭐ 위치 정보 마스터 ⭐",
      zh: "⭐ 位置信息大师 ⭐",
    },
    share: { ja: "📤 シェア", en: "📤 Share", ko: "📤 공유", zh: "📤 分享" },
    toHome: { ja: "🏠 ホームへ", en: "🏠 Home", ko: "🏠 홈으로", zh: "🏠 主页" },
    shareTitle: { ja: "マモル EP1-2 クリア！", en: "Mamoru EP1-2 Complete!", ko: "마모루 EP1-2 클리어!", zh: "守护 第1-2话 完成!" },
    shareText: {
      ja: "SNSリテラシーアプリ「マモル」で位置情報マスターになりました🏆",
      el: "SNSリテラシーアプリ「マモル」で{位置情報|いちじょうほう}マスターになりました🏆",
      en: "I became a Location Privacy Master on Mamoru 🏆",
      ko: "SNS 리터러시 앱 마모루에서 위치 정보 마스터가 됐어요 🏆",
      zh: "在社交媒体素养应用「守护」中成为了位置信息大师 🏆",
    },
  },

  // ═══════ EP1 POSTS DATA ═══════
  ep1Posts: {
    p1Text: {
      ja: "やっと新学期！1年生になったよ🌸 これから3年間よろしく！",
      el: "やっと{新学期|しんがっき}！1{年生|ねんせい}になったよ🌸 これから3{年間|ねんかん}よろしく！",
      en: "New semester at last! I'm in 7th grade now 🌸 Three years to go!",
      ko: "드디어 새 학기! 1학년이 됐어 🌸 3년 동안 잘 부탁해!",
      zh: "终于新学期了!上初一啦 🌸 接下来三年请多关照!",
    },
    p2Text: {
      ja: "今日のおやつ🍰 ベランダで食べると気持ちいい☀️",
      el: "{今日|きょう}のおやつ🍰 ベランダで{食|た}べると{気持|きも}ちいい☀️",
      en: "Today's snack 🍰 Eating on the balcony feels great ☀️",
      ko: "오늘 간식 🍰 베란다에서 먹으니 기분 좋아 ☀️",
      zh: "今天的点心 🍰 在阳台吃感觉真好 ☀️",
    },
    p3Text: {
      ja: "お気に入りのカフェ☕ ここのケーキ最高〜",
      el: "お{気|き}に{入|い}りのカフェ☕ ここのケーキ{最高|さいこう}〜",
      en: "My favorite cafe ☕ Their cake is the best ~",
      ko: "좋아하는 카페 ☕ 여기 케이크 최고~",
      zh: "我最爱的咖啡店 ☕ 这里的蛋糕超棒~",
    },
    p4Text: {
      ja: "今日はお散歩日和🐕 近所の桜がキレイ",
      el: "{今日|きょう}はお{散歩|さんぽ}{日和|びより}🐕 {近所|きんじょ}の{桜|さくら}がキレイ",
      en: "Perfect walking weather today 🐕 The cherry blossoms in my neighborhood are beautiful",
      ko: "오늘은 산책 날씨 🐕 동네 벚꽃이 예뻐",
      zh: "今天适合散步 🐕 附近的樱花真美",
    },
    schoolCrest: { ja: "校章", el: "{校章|こうしょう}", en: "School crest", ko: "교표", zh: "校徽" },
    schoolCrestInfo: {
      ja: "制服の左胸の校章 → 学校名が特定できる",
      el: "{制服|せいふく}の{左胸|ひだりむね}の{校章|こうしょう} → {学校|がっこう}{名|めい}が{特定|とくてい}できる",
      en: "School crest on uniform → school can be identified",
      ko: "교복 왼쪽 가슴 교표 → 학교 특정 가능",
      zh: "校服左胸的校徽 → 可识别学校",
    },
    schoolSign: { ja: "学校の表札", el: "{学校|がっこう}の{表札|ひょうさつ}", en: "School nameplate", ko: "학교 명판", zh: "学校铭牌" },
    schoolSignInfo: {
      ja: "「私立 桜花中学校」の表札 → 学校名・住所が完全に特定される。通学路や自宅付近もバレる可能性がある",
      el: "「{私立|しりつ} {桜花中学校|おうかちゅうがっこう}」の{表札|ひょうさつ} → {学校|がっこう}{名|めい}・{住所|じゅうしょ}が{完全|かんぜん}に{特定|とくてい}される。{通学路|つうがくろ}や{自宅|じたく}{付近|ふきん}もバレる{可能性|かのうせい}がある",
      en: "School nameplate visible → school name and location fully identified",
      ko: "학교 명판 → 학교명·주소가 완전히 특정됨",
      zh: "学校铭牌 → 校名和地址完全暴露",
    },
    cafeName: { ja: "カフェの店名", el: "カフェの{店名|みせめい}", en: "Café name", ko: "카페 이름", zh: "咖啡厅名称" },
    cafeNameInfo: {
      ja: "「カフェ ルブラン」の看板 → 検索すれば場所・住所が即判明。よく行くお店がバレると行動パターンが読まれる",
      el: "「カフェ ルブラン」の{看板|かんばん} → {検索|けんさく}すれば{場所|ばしょ}・{住所|じゅうしょ}が{即|そく}{判明|はんめい}。よく{行|い}くお{店|みせ}がバレると{行動|こうどう}パターンが{読|よ}まれる",
      en: "Café name visible → location found instantly via search",
      ko: "카페 이름 → 검색하면 위치·주소 즉시 확인 가능",
      zh: "咖啡厅名称 → 搜索即可找到位置和地址",
    },
    sign: { ja: "向かいの看板", el: "{向|む}かいの{看板|かんばん}", en: "Sign across the street", ko: "맞은편 간판", zh: "对面招牌" },
    signInfo: {
      ja: "特徴的な看板 → Google検索で場所が特定できる",
      el: "{特徴的|とくちょうてき}な{看板|かんばん} → Google{検索|けんさく}で{場所|ばしょ}が{特定|とくてい}できる",
      en: "Distinctive signs can be identified through Google search",
      ko: "특징적인 간판 → 구글 검색으로 장소 특정 가능",
      zh: "特征明显的招牌 → 谷歌搜索可定位",
    },
    landmark: { ja: "ランドマーク", en: "Landmark", ko: "랜드마크", zh: "地标" },
    landmarkInfo: {
      ja: "遠くのタワー → 区まで特定可能",
      el: "{遠|とお}くのタワー → {区|く}まで{特定|とくてい}{可能|かのう}",
      en: "Tower in the distance → narrows to a district",
      ko: "멀리 보이는 타워 → 구까지 특정 가능",
      zh: "远处的塔 → 可定位到区",
    },
    menu: { ja: "メニュー表", el: "メニュー{表|ひょう}", en: "Menu board", ko: "메뉴판", zh: "菜单牌" },
    menuInfo: {
      ja: "店名が写っている → 行動範囲がバレる",
      el: "{店名|みせめい}が{写|うつ}っている → {行動|こうどう}{範囲|はんい}がバレる",
      en: "Store name visible → reveals your activity area",
      ko: "가게 이름이 보임 → 행동 범위 노출",
      zh: "店名出现 → 暴露活动范围",
    },
    locationTag: { ja: "位置情報タグ", el: "{位置情報|いちじょうほう}タグ", en: "Location tag", ko: "위치 태그", zh: "位置标签" },
    locationTagInfo: {
      ja: "緯度経度が公開状態になっている",
      el: "{緯度|いど}{経度|けいど}が{公開|こうかい}{状態|じょうたい}になっている",
      en: "GPS coordinates are publicly exposed",
      ko: "위도·경도가 공개 상태",
      zh: "经纬度处于公开状态",
    },
    nameplate: { ja: "表札", el: "{表札|ひょうさつ}", en: "Nameplate", ko: "문패", zh: "门牌" },
    nameplateInfo: {
      ja: "ぼかしていない表札 → 苗字と住所が完全に判明",
      el: "ぼかしていない{表札|ひょうさつ} → {苗字|みょうじ}と{住所|じゅうしょ}が{完全|かんぜん}に{判明|はんめい}",
      en: "Unblurred nameplate → reveals your full last name & address",
      ko: "흐리지 않은 문패 → 성씨와 주소 완전 노출",
      zh: "未模糊的门牌 → 姓氏和地址完全暴露",
    },
    license: { ja: "ナンバープレート", en: "License plate", ko: "번호판", zh: "车牌" },
    licenseInfo: {
      ja: "車のナンバー → 所有者が特定可能",
      el: "{車|くるま}のナンバー → {所有者|しょゆうしゃ}が{特定|とくてい}{可能|かのう}",
      en: "Car license plate → owner can be identified",
      ko: "차 번호판 → 소유자 특정 가능",
      zh: "车牌号 → 可识别车主",
    },
  },
};

// 言語コンテキスト
const LangContext = createContext({ lang: "ja", setLang: () => {} });

// 年齢モードコンテキスト
const AgeModeContext = createContext({ ageMode: "middle", setAgeMode: () => {} });
function useAgeMode() { return useContext(AgeModeContext).ageMode; }
// useET: et(標準テキスト, 小学生テキスト) → elementaryモード時は小学生テキストを返す
function useET() {
  const ageMode = useAgeMode();
  return (std, el) => (ageMode === "elementary" && el !== undefined) ? el : std;
}

// ルビテキストコンポーネント：{漢字|よみ} 記法と <br /> を処理
// 例: "{設定|せってい}→プライバシー" → <ruby>設定<rt>せってい</rt></ruby>→プライバシー
// 例: "テキスト<br />続き"  → テキスト<br />続き
function RubyText({ text, style }) {
  if (!text && text !== 0) return null;
  const str = String(text);
  // まず <br /> で分割し、次に {漢字|よみ} を処理
  const segments = str.split(/(<br\s*\/?>)/gi);
  const renderSeg = (seg, si) =>
    seg.split(/(\{[^|{}]+\|[^|{}]+\})/g).map((part, i) => {
      const m = part.match(/^\{([^|]+)\|([^}]+)\}$/);
      if (m) return (
        <ruby key={`${si}-${i}`}>
          {m[1]}
          <rt style={{ fontSize: "0.6em", letterSpacing: 0 }}>{m[2]}</rt>
        </ruby>
      );
      return part ? <span key={`${si}-${i}`}>{part}</span> : null;
    });
  return (
    <span style={style}>
      {segments.map((seg, i) =>
        /^<br/i.test(seg) ? <br key={i} /> : renderSeg(seg, i)
      )}
    </span>
  );
}

// 翻訳取得関数：t("home.title") → 現在の言語の値を返す
// 小学生モード（elementary）かつ日本語の場合、el キーが存在すればルビ付きテキストを返す
function useT() {
  const { lang } = useContext(LangContext);
  const ageMode = useAgeMode();
  return (path, params) => {
    const keys = path.split(".");
    let v = I18N;
    for (const k of keys) {
      if (!v) return path;
      v = v[k];
    }
    if (!v) return path;
    let str;
    if (ageMode === "elementary" && lang === "ja" && typeof v === "object" && v.el) {
      str = v.el;
    } else {
      str = (typeof v === "object" && v[lang]) ? v[lang] : (typeof v === "string" ? v : path);
    }
    if (params) Object.keys(params).forEach(k => { str = str.replace(`{${k}}`, params[k]); });
    return str;
  };
}

// 配列翻訳（[質問, 説明]のような構造用）
function useTArr() {
  const { lang } = useContext(LangContext);
  return (path) => {
    const keys = path.split(".");
    let v = I18N;
    for (const k of keys) { if (!v) return [path]; v = v[k]; }
    if (!v || !v[lang]) return [path];
    return v[lang];
  };
}

// HTMLレンダリング用（**bold**と<br/>と{漢字|ふりがな}を変換）
function FormattedText({ text, style }) {
  if (!text && text !== 0) return null;
  const str = String(text);
  const parts = str.split(/(<br\s*\/?>)/g);
  return (
    <span style={style}>
      {parts.map((p, i) => {
        if (p.match(/<br/)) return <br key={i} />;
        // **bold** をパース
        const bold = p.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i}>
            {bold.map((b, j) => {
              if (b.startsWith("**") && b.endsWith("**")) {
                return <strong key={j} style={{ color: "inherit" }}><RubyText text={b.slice(2, -2)} /></strong>;
              }
              return <RubyText key={j} text={b} />;
            })}
          </span>
        );
      })}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🌐 LANGUAGE SWITCHER COMPONENT
// ═══════════════════════════════════════════════════════════════
function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useContext(LangContext);
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div style={{ position: "relative", zIndex: 50 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.15)",
          borderRadius: 10, padding: compact ? "6px 10px" : "7px 12px",
          color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
        }}>
        <span style={{ fontSize: 14 }}>{current.flag}</span>
        {!compact && <span>{current.name}</span>}
        <span style={{ fontSize: 9, opacity: .6 }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
          <div style={{
            position: "absolute", top: "100%", right: 0, marginTop: 6,
            background: "#1a1a2e", border: "1px solid rgba(255,255,255,.15)",
            borderRadius: 12, padding: 6, minWidth: 140, zIndex: 50,
            boxShadow: "0 12px 32px rgba(0,0,0,.5)",
          }}>
            {LANGUAGES.map(l => (
              <button key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); try{localStorage.setItem(LANG_KEY,l.code);}catch{} }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 11px", background: l.code === lang ? "rgba(255,255,255,.08)" : "transparent",
                  border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                  color: l.code === lang ? "#fff" : "rgba(255,255,255,.7)",
                  fontSize: 13, fontWeight: l.code === lang ? 700 : 500, textAlign: "left",
                }}>
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                <span>{l.name}</span>
                {l.code === lang && <span style={{ marginLeft: "auto", color: "#ffa940" }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// 🛡️ MAMORU — 統合版 v1.9c
// 「親主導」設計への転換
// ① オープニング刷新（保護者向け）
// ② ホームに「はじめての方へ」常設バナー
// ③ 各EP冒頭に保護者向け導入カード
// =============================================================================

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&family=DotGothic16&family=Share+Tech+Mono&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0d0d1a;overscroll-behavior:none;}

    @keyframes float     {0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)}}
    @keyframes float2    {0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}}
    @keyframes blink     {0%,100%{opacity:1} 50%{opacity:0.2}}
    @keyframes slideUp   {from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)}}
    @keyframes popIn     {0%{opacity:0;transform:scale(0.75)} 70%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)}}
    @keyframes shimmer   {0%{background-position:200% center} 100%{background-position:-200% center}}
    @keyframes orb       {0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-20px,10px) scale(0.95)}}
    @keyframes orb2      {0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-25px,15px) scale(1.08)} 66%{transform:translate(20px,-25px) scale(0.93)}}
    @keyframes pulse     {0%,100%{box-shadow:0 0 0 0 rgba(255,60,60,0.6)} 50%{box-shadow:0 0 0 10px rgba(255,60,60,0)}}
    @keyframes mamPulse  {0%,100%{opacity:1} 50%{opacity:.35}}
    @keyframes scanDown  {0%{top:0;opacity:0.7} 100%{top:100%;opacity:0}}
    @keyframes heartbeat {0%,100%{transform:scale(1)} 25%{transform:scale(1.18)} 75%{transform:scale(1.08)}}
    @keyframes shake     {0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 60%{transform:translateX(5px)}}
    @keyframes notifDrop {0%{transform:translateY(-80px);opacity:0} 60%{transform:translateY(8px)} 100%{transform:translateY(0);opacity:1}}
    @keyframes redFlash  {0%,100%{background:rgba(255,40,40,0)} 50%{background:rgba(255,40,40,0.12)}}
    @keyframes celebrate {0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-8deg) scale(1.1)} 75%{transform:rotate(8deg) scale(1.1)}}
    @keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
    @keyframes newBadge  {0%,100%{transform:scale(1)} 50%{transform:scale(1.14)}}
    @keyframes glitch1   {0%,100%{clip-path:inset(0 0 90% 0);transform:translate(-4px,0)} 50%{clip-path:inset(30% 0 50% 0);transform:translate(4px,0)}}
    @keyframes glitch2   {0%,100%{clip-path:inset(50% 0 20% 0);transform:translate(4px,0)} 50%{clip-path:inset(10% 0 70% 0);transform:translate(-4px,0)}}
    @keyframes matrixFall{0%{transform:translateY(-100%);opacity:1} 100%{transform:translateY(100vh);opacity:0}}
    @keyframes fadeIn    {from{opacity:0} to{opacity:1}}
    @keyframes scanLine  {0%{top:0} 100%{top:100%}}
    @keyframes hackBlink {0%,100%{opacity:1} 49%{opacity:1} 50%{opacity:0} 99%{opacity:0}}
    @keyframes shakeX    {0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}}
    @keyframes redPulse  {0%,100%{background:rgba(239,68,68,.08)} 50%{background:rgba(239,68,68,.22)}}
    @keyframes fadeInFast{from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)}}
    @keyframes darkWebFlicker{0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.4} 94%{opacity:1} 97%{opacity:.7} 98%{opacity:1}}
    @keyframes fadeIn    {from{opacity:0} to{opacity:1}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)}}
    @keyframes zoomIn    {from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)}}
    @keyframes logoReveal{0%{opacity:0;transform:scale(0.6) rotate(-8deg)} 60%{transform:scale(1.08) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes typeReveal{from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)}}
    @keyframes slideCard {from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)}}
    @keyframes glowPulse {0%,100%{box-shadow:0 0 20px rgba(255,169,64,.2)} 50%{box-shadow:0 0 40px rgba(255,169,64,.5)}}
    @keyframes mamFadeUp {from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)}}
  `}</style>
);

// ═══════════════════════════════════════════════════════════════
// 🎮 PHASE A — 没入感・怖さ強化コンポーネント群
// ═══════════════════════════════════════════════════════════════

// ① 強制クイズコンポーネント
// 正解しないと次に進めない。間違えると解説が出て再挑戦。
function MandatoryQuiz({ question, choices, correctId, onPass, accentColor = "#ffa940", mode = "dark" }) {
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(false);
  const [passed, setPassed] = useState(false);
  const ageMode = useAgeMode();

  const handleSelect = (ch) => {
    setSelected(ch.id);
    if (ch.id === correctId) {
      feedback("correct");
      setPassed(true);
      setTimeout(() => onPass(), 900);
    } else {
      feedback("wrong");
      setWrong(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const isLight = mode === "light";
  const m = {
    cardBg:      isLight ? "#fff"                     : "rgba(255,255,255,.04)",
    cardBorder:  isLight ? `${accentColor}55`          : `${accentColor}33`,
    cardShadow:  isLight ? `0 4px 16px ${accentColor}18` : "none",
    labelText:   isLight ? "rgba(0,0,0,.45)"           : "rgba(255,255,255,.5)",
    questionColor: isLight ? "#1e293b"                 : "#fff",
    optBg:       isLight ? "#f8fafc"                   : "rgba(255,255,255,.04)",
    optBorder:   isLight ? "#e2e8f0"                   : "rgba(255,255,255,.1)",
    optText:     isLight ? "#334155"                   : "rgba(255,255,255,.8)",
    circleBg:    isLight ? "#e2e8f0"                   : "rgba(255,255,255,.1)",
    circleText:  isLight ? "#64748b"                   : "#fff",
  };

  return (
    <div style={{
      background: m.cardBg,
      border: `1.5px solid ${m.cardBorder}`,
      borderRadius: 18, padding: "18px 16px",
      boxShadow: m.cardShadow,
      animation: shake ? "shake .4s ease" : "slideUp .4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          background: accentColor, color: "#fff",
          fontSize: 10, fontWeight: 900, padding: "3px 10px",
          borderRadius: 99, letterSpacing: ".1em",
          fontFamily: "'DotGothic16',monospace",
        }}>CHECK</div>
        <div style={{ fontSize: 12, color: m.labelText }}><RubyText text={ageMode === "elementary" ? "{正解|せいかい}しないと{先|さき}に{進|すす}めません" : "正解しないと先に進めません"} /></div>
      </div>

      <p style={{ fontSize: 14, fontWeight: 700, color: m.questionColor, lineHeight: 1.7, margin: "0 0 14px" }}>
        <RubyText text={question} />
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {choices.map((ch) => {
          const isSelected = selected === ch.id;
          const isCorrect = passed && ch.id === correctId;
          const isWrong = wrong && isSelected && ch.id !== correctId;
          return (
            <button key={ch.id} onClick={() => !passed && handleSelect(ch)}
              style={{
                width: "100%", padding: "12px 14px",
                background: isCorrect ? "rgba(74,222,128,.12)" :
                             isWrong   ? "rgba(239,68,68,.1)" :
                             isSelected ? `${accentColor}12` : m.optBg,
                border: `1.5px solid ${
                  isCorrect ? "rgba(74,222,128,.5)" :
                  isWrong   ? "rgba(239,68,68,.4)" :
                  isSelected ? accentColor + "66" : m.optBorder
                }`,
                borderRadius: 12, cursor: passed ? "default" : "pointer",
                fontFamily: "inherit", textAlign: "left",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all .15s",
              }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : m.circleBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: isCorrect || isWrong ? "#fff" : m.circleText,
                fontWeight: 900, flexShrink: 0,
              }}>
                {isCorrect ? "✓" : isWrong ? "✗" : ch.label}
              </div>
              <span style={{
                fontSize: 13, fontWeight: isSelected ? 700 : 400,
                color: isCorrect ? (isLight ? "#166534" : "#86efac") :
                       isWrong   ? (isLight ? "#dc2626" : "#fca5a5") :
                       m.optText,
              }}>
                <RubyText text={ch.text} />
              </span>
            </button>
          );
        })}
      </div>

      {wrong && !passed && (
        <div style={{ marginTop: 12, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#fca5a5", lineHeight: 1.7, animation: "slideUp .3s ease" }}>
          <RubyText text={ageMode === "elementary" ? "❌ {不正解|ふせいかい}。もう{一度|いちど}{考|かんが}えてみよう。ヒント：さっきの{解説|かいせつ}を{思|おも}い{出|だ}して。" : "❌ 不正解。もう一度考えてみよう。ヒント：さっきの解説を思い出して。"} />
        </div>
      )}
      {passed && (
        <div style={{ marginTop: 12, background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#86efac", lineHeight: 1.7, animation: "slideUp .3s ease" }}>
          <RubyText text={ageMode === "elementary" ? "✅ {正解|せいかい}！{次|つぎ}に{進|すす}みます…" : "✅ 正解！次に進みます…"} />
        </div>
      )}
    </div>
  );
}

// ③ タイマー選択コンポーネント
// 制限時間内に選ばないと「流されてしまった」エンドへ
function TimerChoice({ prompt, choices, seconds = 10, onChoice, onTimeout, accentColor = "#ffa940" }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [choosing, setChoosing] = useState(true);
  const ageMode = useAgeMode();

  useEffect(() => {
    if (!choosing) return;
    if (timeLeft <= 0) { setChoosing(false); onTimeout(); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, choosing]);

  const pct = (timeLeft / seconds) * 100;
  const barColor = pct > 50 ? accentColor : pct > 25 ? "#f97316" : "#dc2626";

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {/* Timer bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 5 }}>
          <span style={{ animation: timeLeft <= 3 ? "blink .5s infinite" : "none", color: timeLeft <= 3 ? "#dc2626" : "inherit", fontWeight: timeLeft <= 3 ? 900 : 400 }}>
            ⏰ <RubyText text={ageMode === "elementary" ? `{残|のこ}り ${timeLeft}{秒|びょう}` : `残り ${timeLeft}秒`} />
          </span>
          <span><RubyText text={ageMode === "elementary" ? "{相手|あいて}は{今|いま}も{待|ま}っています…" : "相手は今も待っています…"} /></span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: barColor, borderRadius: 3,
            transition: "width 1s linear, background .3s",
            boxShadow: `0 0 8px ${barColor}80`,
          }} />
        </div>
      </div>

      <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.7, margin: "0 0 12px" }}><RubyText text={prompt} /></p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {choices.map((ch) => (
          <button key={ch.id} onClick={() => { setChoosing(false); onChoice(ch); }}
            style={{
              width: "100%", padding: "13px 16px",
              background: ch.safe ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.04)",
              border: `1.5px solid ${ch.safe ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`,
              borderRadius: 14, color: ch.safe ? "#86efac" : "rgba(255,255,255,.8)",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              transition: "all .15s",
            }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{ch.emoji}</span>
            <span style={{ flex: 1 }}><RubyText text={ch.label} /></span>
            {ch.safe && <span style={{ fontSize: 11, color: "#4ade80" }}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ④ NG先体験コンポーネント
// まず悪い選択をさせて結果を見せ、その後「正解は？」と再挑戦
function NgFirstExperience({ situation, ngChoice, ngResult, correctChoice, correctResult, onComplete, accentColor = "#ffa940" }) {
  const [phase, setPhase] = useState("ng"); // ng|ng_result|correct|correct_result
  const ageMode = useAgeMode();

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {phase === "ng" && (
        <div>
          <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 4, fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}><RubyText text={ageMode === "elementary" ? "STEP 1：まず「よくある{反応|はんのう}」を{体験|たいけん}する" : "STEP 1：まず「よくある反応」を体験する"} /></div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}><RubyText text={situation} /></div>
          </div>
          <button onClick={() => setPhase("ng_result")}
            style={{ width: "100%", padding: "14px 16px", background: "rgba(239,68,68,.1)", border: "1.5px solid rgba(239,68,68,.35)", borderRadius: 14, color: "#fca5a5", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <span style={{ fontSize: 22 }}>{ngChoice.emoji}</span>
            <span><RubyText text={ngChoice.label} /></span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#f87171" }}><RubyText text={ageMode === "elementary" ? "{体験|たいけん}する →" : "体験する →"} /></span>
          </button>
        </div>
      )}

      {phase === "ng_result" && (
        <div>
          <div style={{ background: "rgba(239,68,68,.1)", border: "2px solid rgba(239,68,68,.4)", borderRadius: 16, padding: "16px", marginBottom: 14, animation: "shake .3s ease" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 13, color: "#fca5a5", lineHeight: 1.8 }}><RubyText text={ngResult} /></div>
          </div>
          <button onClick={() => setPhase("correct")}
            style={{ width: "100%", padding: 14, background: `${accentColor}18`, border: `1px solid ${accentColor}33`, borderRadius: 14, color: accentColor, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "では{正|ただ}しい{選択|せんたく}は？ →" : "では正しい選択は？ →"} />
          </button>
        </div>
      )}

      {phase === "correct" && (
        <div>
          <div style={{ background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 4, fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}><RubyText text={ageMode === "elementary" ? "STEP 2：では{正解|せいかい}は？" : "STEP 2：では正解は？"} /></div>
          </div>
          <button onClick={() => setPhase("correct_result")}
            style={{ width: "100%", padding: "14px 16px", background: "rgba(74,222,128,.08)", border: "1.5px solid rgba(74,222,128,.3)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <span style={{ fontSize: 22 }}>{correctChoice.emoji}</span>
            <span><RubyText text={correctChoice.label} /></span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}><RubyText text={ageMode === "elementary" ? "✓ {正解|せいかい}" : "✓ 正解"} /></span>
          </button>
        </div>
      )}

      {phase === "correct_result" && (
        <div>
          <div style={{ background: "rgba(74,222,128,.08)", border: "2px solid rgba(74,222,128,.3)", borderRadius: 16, padding: "16px", marginBottom: 14, animation: "popIn .4s ease" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 13, color: "#86efac", lineHeight: 1.8 }}><RubyText text={correctResult} /></div>
          </div>
          <button onClick={onComplete}
            style={{ width: "100%", padding: 14, background: `linear-gradient(135deg,${accentColor},${accentColor}bb)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解|りかい}できた！{次|つぎ}へ →" : "理解できた！次へ →"} />
          </button>
        </div>
      )}
    </div>
  );
}

// ⑦ モリィの感情表現強化（mood拡張版）
function OwlReaction({ mood, message, animate = true }) {
  const configs = {
    happy:   { bg: "rgba(255,169,64,.08)",  border: "rgba(255,169,64,.25)", text: "#ffd28a" },
    worried: { bg: "rgba(255,67,67,.08)",   border: "rgba(255,67,67,.25)",  text: "#ffaaaa" },
    excited: { bg: "rgba(74,222,128,.08)",  border: "rgba(74,222,128,.25)", text: "#86efac" },
    sad:     { bg: "rgba(147,197,253,.08)", border: "rgba(147,197,253,.25)", text: "#93c5fd" },
    scared:  { bg: "rgba(239,68,68,.12)",   border: "rgba(239,68,68,.4)",   text: "#fca5a5" },
  };
  const cfg = configs[mood] || configs.happy;

  return (
    <div style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 16, padding: "14px 16px",
      display: "flex", gap: 12, alignItems: "flex-start",
      margin: "14px 0",
      animation: animate ? "slideUp .4s ease" : "none",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: cfg.border, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
        animation: mood === "scared" ? "shake .5s ease" : mood === "excited" ? "celebrate 1s infinite" : "float2 3s infinite",
      }}>
        {mood === "happy" ? "🦉😊" : mood === "worried" ? "🦉😟" : mood === "excited" ? "🦉🎉" : mood === "sad" ? "🦉😢" : "🦉😱"}
      </div>
      <div>
        <div style={{ fontSize: 11, color: cfg.text, fontWeight: 700, marginBottom: 4, opacity: .7 }}>
          モリィ
        </div>
        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.75 }}>{message}</div>
      </div>
    </div>
  );
}

// ⑩ 今日の宿題コンポーネント
function TodaysHomework({ tasks, accentColor = "#ffa940", mode = "dark", onComplete }) {
  const [done, setDone] = useState([]);
  const allDone = done.length === tasks.length;
  const isLight = mode === "light";
  const ageMode = useAgeMode();

  return (
    <div style={{
      background: isLight ? "#fff" : "rgba(255,255,255,.03)",
      border: `1.5px solid ${accentColor}${isLight ? "55" : "33"}`,
      borderRadius: 18, padding: "18px 16px",
      marginTop: 14,
      boxShadow: isLight ? `0 4px 16px ${accentColor}14` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 20 }}>📋</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: isLight ? "#1e293b" : "#fff" }}><RubyText text={ageMode === "elementary" ? "{今日|きょう}の{宿題|しゅくだい}" : "今日の宿題"} /></div>
          <div style={{ fontSize: 11, color: isLight ? "#64748b" : "rgba(255,255,255,.4)" }}>
            <RubyText text={ageMode === "elementary" ? "3つ{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう" : "3つ全部チェックしてから次へ進もう"} />
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "'DotGothic16',monospace", fontSize: 11, color: accentColor }}>
          {done.length}/{tasks.length}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tasks.map((task, i) => {
          const isDone = done.includes(i);
          return (
            <button key={i} onClick={() => setDone(prev => isDone ? prev.filter(d => d !== i) : [...prev, i])}
              style={{
                width: "100%", padding: "12px 14px",
                background: isDone ? `${accentColor}12` : isLight ? "#f8fafc" : "rgba(255,255,255,.04)",
                border: `1px solid ${isDone ? accentColor + "55" : isLight ? "#e2e8f0" : "rgba(255,255,255,.08)"}`,
                borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left",
                transition: "all .2s",
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                background: isDone ? accentColor : isLight ? "#e2e8f0" : "rgba(255,255,255,.08)",
                border: `1.5px solid ${isDone ? accentColor : isLight ? "#cbd5e1" : "rgba(255,255,255,.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "#fff", transition: "all .2s",
              }}>
                {isDone ? "✓" : ""}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? accentColor : isLight ? "#1e293b" : "#fff", lineHeight: 1.5, textDecoration: isDone ? "line-through" : "none", opacity: isDone ? .7 : 1 }}>
                  <RubyText text={task.title} />
                </div>
                <div style={{ fontSize: 11, color: isLight ? "#64748b" : "rgba(255,255,255,.4)", marginTop: 3, lineHeight: 1.5 }}>
                  <RubyText text={task.desc} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 全完了時：お祝い + 次へボタン（onCompleteがある場合） */}
      {allDone && (
        <div style={{ marginTop: 12, animation: "popIn .4s ease" }}>
          <div style={{ background: isLight ? "#f0fdf4" : "rgba(74,222,128,.08)", border: `1px solid ${isLight ? "#bbf7d0" : "rgba(74,222,128,.25)"}`, borderRadius: 10, padding: "10px 12px", fontSize: 12, color: isLight ? "#166534" : "#86efac", textAlign: "center", marginBottom: onComplete ? 10 : 0 }}>
            <RubyText text={ageMode === "elementary" ? "🎉 {全部|ぜんぶ}チェックした！{素晴|すばら}らしい！" : "🎉 全部チェックした！素晴らしい！"} />
          </div>
          {onComplete && (
            <button onClick={onComplete}
              style={{ width: "100%", padding: 14, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${accentColor}33` }}>
              <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
            </button>
          )}
        </div>
      )}

      {/* 未完了時：次へボタンをロック表示 */}
      {!allDone && onComplete && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: isLight ? "#94a3b8" : "rgba(255,255,255,.3)" }}>
            <RubyText text={ageMode === "elementary" ? `3つ{全部|ぜんぶ}チェックすると{次|つぎ}へ{進|すす}めます（あと${tasks.length - done.length}つ）` : `3つ全部チェックすると次へ進めます（あと${tasks.length - done.length}つ）`} />
          </span>
        </div>
      )}
    </div>
  );
}

// ⑧ 「もしこの選択なら」比較コンポーネント
function ChoiceComparison({ myChoice, myResult, worstChoice, worstResult, accentColor = "#ffa940", mode = "dark", onRevealComplete }) {
  const [showWorst, setShowWorst] = useState(false);
  const [horrorStep, setHorrorStep] = useState(0); // 0=locked, 1〜4=アニメ段階, 5=reveal
  const isLight = mode === "light";
  const ageMode = useAgeMode();

  // ホラーアニメーションの段階的進行
  useEffect(() => {
    if (horrorStep === 0 || horrorStep >= 5) return;
    const delay = [0, 1800, 1800, 2200, 1800][horrorStep] || 1800;
    const t = setTimeout(() => setHorrorStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [horrorStep]);

  // horrorStep=5 で onRevealComplete を呼ぶ
  useEffect(() => {
    if (horrorStep >= 5) onRevealComplete?.();
  }, [horrorStep]);

  const horrorScenes = ageMode === "elementary" ? [
    { icon: "🔍", color: "#f97316", title: "{投稿|とうこう}を{分析|ぶんせき}{中|ちゅう}…", body: "AIが{画像|がぞう}から{情報|じょうほう}を{抽出|ちゅうしゅつ}しています", sub: "{校章|こうしょう}・{背景|はいけい}・{位置情報|いちじょうほう}を{解析中|かいせきちゅう}…" },
    { icon: "📍", color: "#ef4444", title: "{自宅|じたく}{住所|じゅうしょ}が{特定|とくてい}されました", body: "{緯度|いど} 35.6°N　{経度|けいど} 139.7°E\n{練馬区|ねりまく}〇〇{町|ちょう}△{丁目|ちょうめ}", sub: "Google{マップ|まっぷ}で{確認済|かくにんず}み" },
    { icon: "📩", color: "#dc2626", title: "{見|み}知らぬ{人|ひと}からDMが{届|とど}きました", body: "「きょう{桜花中学校|おうかちゅうがっこう}の{前|まえ}にいたよね？かわいいね」", sub: "アカウント{作成日|さくせいび}：{今日|きょう} / フォロワー：0" },
    { icon: "😱", color: "#991b1b", title: "{自宅|じたく}{近|ちか}くで{目撃|もくげき}されています", body: "「いつも〇〇{公園|こうえん}{通|とお}るよね。{毎日|まいにち}{見|み}てるよ」", sub: "あなたの{行動|こうどう}パターンが{完全|かんぜん}に{読|よ}まれています" },
  ] : [
    { icon: "🔍", color: "#f97316", title: "投稿を分析中…", body: "AIが画像から情報を抽出しています", sub: "校章・背景・位置情報を解析中…" },
    { icon: "📍", color: "#ef4444", title: "自宅住所が特定されました", body: "緯度 35.6°N　経度 139.7°E\n練馬区〇〇町△丁目", sub: "Googleマップで確認済み" },
    { icon: "📩", color: "#dc2626", title: "見知らぬ人からDMが届きました", body: "「きょう桜花中学校の前にいたよね？かわいいね」", sub: "アカウント作成日：今日 / フォロワー：0" },
    { icon: "😱", color: "#991b1b", title: "自宅近くで目撃されています", body: "「いつも〇〇公園通るよね。毎日見てるよ」", sub: "あなたの行動パターンが完全に読まれています" },
  ];

  return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: isLight ? "#64748b" : "rgba(255,255,255,.5)", letterSpacing: ".1em", marginBottom: 10, fontFamily: "'DotGothic16',monospace" }}>
        CHOICE COMPARISON
      </div>

      {/* あなたの選択（上） */}
      <div style={{ background: isLight ? "#f0fdf4" : "rgba(74,222,128,.06)", border: `1px solid ${isLight ? "#bbf7d0" : "rgba(74,222,128,.2)"}`, borderRadius: 14, padding: "14px 12px", marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: isLight ? "#16a34a" : "#4ade80", fontWeight: 700, marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "✓ あなたが{学|まな}んだこと" : "✓ あなたが学んだこと"} /></div>
        <div style={{ fontSize: 12, color: isLight ? "#166534" : "#86efac", fontWeight: 700, marginBottom: 6 }}><RubyText text={myChoice} /></div>
        <div style={{ fontSize: 11, color: isLight ? "#475569" : "rgba(255,255,255,.6)", lineHeight: 1.65 }}><RubyText text={myResult} /></div>
      </div>

      {/* 最悪の選択（下）→ タップでアニメ開始 */}
      {horrorStep === 0 ? (
        <button onClick={() => { setShowWorst(true); setHorrorStep(1); }}
          style={{ width: "100%", background: isLight ? "rgba(239,68,68,.06)" : "rgba(239,68,68,.08)", border: `1px solid ${isLight ? "rgba(239,68,68,.25)" : "rgba(239,68,68,.2)"}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 28 }}>👀</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: isLight ? "#dc2626" : "#f87171" }}><RubyText text={ageMode === "elementary" ? "もし{危険|きけん}を{無視|むし}していたら…" : "もし危険を無視していたら…"} /></div>
          <div style={{ fontSize: 11, color: isLight ? "#94a3b8" : "rgba(255,255,255,.4)" }}><RubyText text={ageMode === "elementary" ? "タップして{体験|たいけん}する" : "タップして体験する"} /></div>
        </button>
      ) : horrorStep < 5 ? (
        /* ホラーアニメーション画面 */
        <div style={{ background: "#000", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(239,68,68,.4)" }}>
          {/* 上部バー */}
          <div style={{ background: "#1a0000", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(239,68,68,.3)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "blink .8s infinite" }} />
            <div style={{ fontSize: 9, color: "#ef4444", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}><RubyText text={ageMode === "elementary" ? "SIMULATION MODE — もし{投稿|とうこう}し{続|つづ}けていたら" : "SIMULATION MODE — もし投稿し続けていたら"} /></div>
          </div>

          <div style={{ padding: "20px 16px", minHeight: 160, display: "flex", flexDirection: "column", gap: 12 }}>
            {horrorScenes.slice(0, horrorStep).map((scene, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "slideUp .5s ease" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${scene.color}22`, border: `1px solid ${scene.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {scene.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: scene.color, marginBottom: 3 }}><RubyText text={scene.title} /></div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.75)", lineHeight: 1.6, whiteSpace: "pre-line" }}><RubyText text={scene.body} /></div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", marginTop: 3 }}><RubyText text={scene.sub} /></div>
                </div>
              </div>
            ))}
            {/* ローディングドット */}
            {horrorStep < 4 && (
              <div style={{ display: "flex", gap: 4, paddingLeft: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", animation: `blink 1s ${i * .3}s infinite` }} />)}
              </div>
            )}
            {horrorStep >= 4 && (
              <button onClick={() => setHorrorStep(5)}
                style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#ef4444,#991b1b)", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 6, animation: "popIn .4s ease" }}>
                <RubyText text={ageMode === "elementary" ? "これが{現実|げんじつ}に{起|お}きること →" : "これが現実に起きること →"} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 種明かし・まとめ */
        <div style={{ background: isLight ? "#fef2f2" : "rgba(239,68,68,.08)", border: `1px solid ${isLight ? "#fecaca" : "rgba(239,68,68,.3)"}`, borderRadius: 14, padding: "16px 14px", animation: "slideUp .5s ease" }}>
          <div style={{ fontSize: 11, color: isLight ? "#dc2626" : "#f87171", fontWeight: 900, marginBottom: 10 }}><RubyText text={ageMode === "elementary" ? "⚠️ シミュレーション{結果|けっか}" : "⚠️ シミュレーション結果"} /></div>
          <div style={{ fontSize: 12, color: isLight ? "#7f1d1d" : "#fca5a5", fontWeight: 700, marginBottom: 8, lineHeight: 1.65 }}><RubyText text={worstChoice} /></div>
          <div style={{ fontSize: 12, color: isLight ? "#475569" : "rgba(255,255,255,.65)", lineHeight: 1.75, marginBottom: 12 }}><RubyText text={worstResult} /></div>

          <div style={{ background: isLight ? "#fff" : "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 12px", border: `1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,.08)"}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: isLight ? "#334155" : "rgba(255,255,255,.6)", marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "💡 これを{防|ふせ}ぐには" : "💡 これを防ぐには"} /></div>
            {(ageMode === "elementary" ? [
              "{投稿|とうこう}{前|まえ}に{校章|こうしょう}・{表札|ひょうさつ}・{看板|かんばん}が{写|うつ}っていないか{確認|かくにん}する",
              "カメラの{位置情報|いちじょうほう}タグを{常|つね}にオフにする",
              "{知|し}らない{人|ひと}からのDMは{無視|むし}・ブロックする",
            ] : [
              "投稿前に校章・表札・看板が写っていないか確認する",
              "カメラの位置情報タグを常にオフにする",
              "知らない人からのDMは無視・ブロックする",
            ]).map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#22c55e", fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 11, color: isLight ? "#475569" : "rgba(255,255,255,.6)", lineHeight: 1.6 }}><RubyText text={tip} /></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── サブフェーズランナー ──
// steps配列を受け取り、1画面ずつ順番に表示して最後にonComplete
// 各stepは { render: (onNext) => JSX } の形式
function SubPhaseRunner({ steps, onComplete, bg = "linear-gradient(180deg,#0f0a14,#1a091e)" }) {
  const [idx, setIdx] = useState(0);
  const next = () => {
    if (idx < steps.length - 1) setIdx(i => i + 1);
    else onComplete();
  };
  const step = steps[idx];
  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      {/* Step indicator */}
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= idx ? step.accentColor || "#ffa940" : "rgba(255,255,255,.1)", transition: "background .3s" }} />
          ))}
        </div>
        {step.render(next)}
      </div>
    </div>
  );
}
function SwipeJudge({ posts, onComplete, accentColor = "#7c3aed" }) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const ageMode = useAgeMode();

  const post = posts[idx];
  const isLast = idx === posts.length - 1;

  const handleJudge = (verdict) => {
    const correct = verdict === post.verdict;
    const result = { correct, verdict, postId: post.id };
    setLastChoice(result);
    setShowFeedback(true);
    setTimeout(() => {
      setResults(prev => [...prev, result]);
      setShowFeedback(false);
      setLastChoice(null);
      if (!isLast) setIdx(i => i + 1);
      else onComplete(results.length + 1, results.filter(r => r.correct).length + (correct ? 1 : 0));
    }, 1400);
  };

  if (!post) return null;

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: accentColor, letterSpacing: ".1em" }}>
          FACT CHECK {idx + 1}/{posts.length}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {posts.map((_, i) => (
            <div key={i} style={{ width: 16, height: 4, borderRadius: 2, background: i < idx ? "#22c55e" : i === idx ? accentColor : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
      </div>

      {/* Post card */}
      <div style={{
        background: "#0d1117", borderRadius: 18, padding: "14px 14px", marginBottom: 14,
        border: `1px solid ${showFeedback ? (lastChoice?.correct ? "rgba(34,197,94,.5)" : "rgba(239,68,68,.5)") : "rgba(255,255,255,.08)"}`,
        transform: showFeedback ? `scale(${lastChoice?.correct ? 1.02 : 0.98})` : "scale(1)",
        transition: "all .2s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${post.accountColor}22`, border: `1.5px solid ${post.accountColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{post.accountIcon}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{post.account}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>{post.time}</div>
          </div>
        </div>
        {post.id === 2 ? (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 10px" }}>
            {"【衝撃】有名芸能人○○さんが詐欺で逮捕されたと警視庁が発表。本人のSNSアカウントも"}
            <span style={{ background: "rgba(255,200,0,.2)", color: "#ffd700", padding: "0 2px", borderRadius: 3 }}>突然削除</span>
            {"。関係者は"}
            <span style={{ background: "rgba(255,200,0,.2)", color: "#ffd700", padding: "0 2px", borderRadius: 3 }}>口を閉ざす</span>
            {"…"}
          </p>
        ) : post.id === 4 ? (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 10px" }}>
            {"【注意】"}
            <span style={{ background: "rgba(34,197,94,.15)", color: "#4ade80", padding: "0 2px", borderRadius: 3 }}>警察庁は14日</span>
            {"、SNS型詐欺の被害が今年に入り"}
            <span style={{ background: "rgba(34,197,94,.15)", color: "#4ade80", padding: "0 2px", borderRadius: 3 }}>前年比2倍以上</span>
            {"に急増していると発表しました。「フォロワーを増やせる」「副業で月10万円」などの勧誘DM・投稿に注意するよう呼びかけています。▶詳細はNHKウェブニュースへ"}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 10px" }}>{post.text}</p>
        )}

        {post.image && (
          <img
            src={post.image}
            alt=""
            style={{
              width: "100%",
              borderRadius: 10,
              display: "block",
              marginTop: 10,
              marginBottom: 10,
              objectFit: "cover",
              maxHeight: 180,
            }}
          />
        )}

        {post.id === 3 && (
          <div style={{
            background: "rgba(255,67,67,.1)",
            border: "0.5px solid rgba(255,67,67,.3)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            color: "#ff6b6b",
            display: "flex",
            gap: 10,
            marginBottom: 8,
          }}>
            <span>📅 日付：不明</span>
            <span>📍 場所：不明</span>
            <span>🔗 出典：なし</span>
          </div>
        )}

        {post.id === 1 ? (
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "rgba(255,255,255,.35)" }}>
            <span>❤️ {post.likes?.toLocaleString()}</span>
            <div>
              <div><span style={{ color: "#ff4343" }}>🔁 {post.rts?.toLocaleString()} ⚠️</span></div>
              <div style={{ fontSize: 10, color: "#ff6b6b", marginTop: 2 }}>RTがいいね数より多いのは不自然</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, fontSize: 11, color: "rgba(255,255,255,.35)" }}>
            <span>❤️ {post.likes?.toLocaleString()}</span>
            <span>🔁 {post.rts?.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, pointerEvents: "none",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            animation: "popIn .3s ease",
            filter: `drop-shadow(0 0 20px ${lastChoice?.correct ? "#22c55e" : "#ef4444"})`,
          }}>
            <span style={{ fontSize: 72 }}>{lastChoice?.correct ? "✅" : "❌"}</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: lastChoice?.correct ? "#22c55e" : "#ef4444" }}>
              {lastChoice?.correct ? "正解！" : "はずれ…"}
            </span>
          </div>
        </div>
      )}

      {/* Swipe buttons */}
      {!showFeedback && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={() => handleJudge("real")}
            style={{ padding: "16px 12px", background: "rgba(34,197,94,.1)", border: "2px solid rgba(34,197,94,.35)", borderRadius: 14, color: "#86efac", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <span><RubyText text={ageMode === "elementary" ? "{本物|ほんもの}" : "本物"} /></span>
          </button>
          <button onClick={() => handleJudge("fake")}
            style={{ padding: "16px 12px", background: "rgba(239,68,68,.1)", border: "2px solid rgba(239,68,68,.35)", borderRadius: 14, color: "#fca5a5", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 24 }}>❌</span>
            <span>フェイク</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ⑤ タイムアタック（EP1向け：写真の危険箇所を素早く見つける）
function TimedHunt({ post, dangerElements, timeLimit = 20, onComplete, accentColor = "#ffa940" }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [found, setFound] = useState([]);
  const [detail, setDetail] = useState(null);
  const [finished, setFinished] = useState(false);

  const dangerCount = dangerElements.filter(e => e.danger).length;
  const foundDangers = found.filter(label => dangerElements.find(e => e.labelKey === label && e.danger));

  useEffect(() => {
    if (finished) return;
    if (foundDangers.length >= dangerCount) { setFinished(true); return; }
    if (timeLeft <= 0) { setFinished(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, foundDangers.length]);

  const pct = (timeLeft / timeLimit) * 100;
  const barColor = pct > 50 ? accentColor : pct > 25 ? "#f97316" : "#dc2626";

  return (
    <div>
      {/* Timer */}
      {!finished && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>
            <span style={{ color: timeLeft <= 5 ? "#dc2626" : "inherit", animation: timeLeft <= 5 ? "blink .5s infinite" : "none", fontWeight: timeLeft <= 5 ? 900 : 400 }}>
              ⏰ {timeLeft}秒
            </span>
            <span>危険: {foundDangers.length}/{dangerCount}</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 3, transition: "width 1s linear" }} />
          </div>
        </div>
      )}

      {/* Photo */}
      <div style={{ position: "relative", background: post.photoBg, borderRadius: 14, paddingTop: "65%", overflow: "hidden", marginBottom: 10 }}>
        {post.unsplashImage ? (
          <>
            <img src={post.unsplashImage.url} alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.35))" }} />
          </>
        ) : (
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontSize: 40, opacity: .25 }}>{post.photoIcon}</div>
        )}
        {dangerElements.map((el, i) => {
          const isFound = found.includes(el.labelKey);
          return (
            <button key={i} onClick={() => {
              if (!found.includes(el.labelKey)) setFound(f => [...f, el.labelKey]);
              setDetail(el);
            }} style={{
              position: "absolute", left: `${el.x}%`, top: `${el.y}%`,
              transform: "translate(-50%,-50%)",
              width: 44, height: 44, borderRadius: "50%",
              border: isFound ? "2px solid #22c55e" : "2px dashed rgba(255,255,255,.85)",
              background: isFound ? "rgba(34,197,94,.85)" : "rgba(255,255,255,.3)",
              backdropFilter: "blur(4px)",
              boxShadow: isFound ? "0 0 12px rgba(34,197,94,.6)" : "0 0 12px rgba(0,0,0,.4)",
              fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: isFound ? "none" : "pulse 1.5s infinite",
              color: "#fff", fontWeight: 900,
            }}>
              {isFound ? "✓" : "?"}
            </button>
          );
        })}
        {/* Photo credit */}
        {post.unsplashImage && (
          <div style={{ position: "absolute", bottom: 4, right: 6, fontSize: 8, color: "rgba(255,255,255,.5)" }}>
            Photo: <a href={post.unsplashImage.authorLink} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,.6)" }}>{post.unsplashImage.author}</a> / Unsplash
          </div>
        )}
      </div>

      {/* Result */}
      {finished && (
        <div style={{ background: foundDangers.length >= dangerCount ? "rgba(74,222,128,.08)" : "rgba(239,68,68,.08)", border: `1px solid ${foundDangers.length >= dangerCount ? "rgba(74,222,128,.3)" : "rgba(239,68,68,.3)"}`, borderRadius: 14, padding: "14px", textAlign: "center", marginBottom: 12, animation: "slideUp .4s ease" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{foundDangers.length >= dangerCount ? "🎯" : "⏰"}</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: foundDangers.length >= dangerCount ? "#86efac" : "#fca5a5" }}>
            {foundDangers.length >= dangerCount ? `全部見つけた！${timeLeft}秒残り` : `タイムアップ！${foundDangers.length}/${dangerCount}個発見`}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
            {foundDangers.length < dangerCount && "見つけられなかった危険ポイントがあります"}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }} onClick={() => setDetail(null)}>
          <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `2px solid ${detail.danger ? "#ff4343" : "#22c55e"}` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>{detail.emoji}</div>
            <div style={{ background: detail.danger ? "#ff4343" : "#22c55e", color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 12px", borderRadius: 99, display: "block", width: "fit-content", margin: "0 auto 10px" }}>
              {detail.danger ? "⚠️ キケン" : "✅ あんしん"}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.8, margin: "0 0 14px", textAlign: "center" }}>
              {detail.infoKey}
            </p>
            <button onClick={() => setDetail(null)} style={{ width: "100%", padding: 11, background: accentColor, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>OK</button>
          </div>
        </div>
      )}

      {finished && (
        <button onClick={() => onComplete({ found: foundDangers.length, total: dangerCount, timeLeft })}
          style={{ width: "100%", padding: 14, background: `linear-gradient(135deg,${accentColor},${accentColor}bb)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          次へ →
        </button>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────

// ═══════════════════════════════════════════════
// ⑨ バッジ・称号システム
// ═══════════════════════════════════════════════
const BADGES = [
  { id: "ep1_master",   icon: "🔍", label: "探偵マスター",      elLabel: "{探偵|たんてい}マスター",           desc: "EP1をクリア",                elDesc: "EP1をクリア",                                     color: "#ffa940", cond: (r) => r.ep1?.completed },
  { id: "ep2_master",   icon: "🔎", label: "情報鑑定士",        elLabel: "{情報|じょうほう}{鑑定|かんてい}{士|し}", desc: "EP2で3問以上正解",         elDesc: "EP2で3{問|もん}{以上|いじょう}{正解|せいかい}",     color: "#7c3aed", cond: (r) => r.ep2?.score >= 3 },
  { id: "ep3_master",   icon: "🛡️", label: "闇バイト免疫",      elLabel: "{闇|やみ}バイト{免疫|めんえき}",      desc: "EP3をクリア",                elDesc: "EP3をクリア",                                     color: "#16a34a", cond: (r) => r.ep3?.completed },
  { id: "ep4_master",   icon: "🔐", label: "アカウント守護者",   elLabel: "アカウント{守護者|しゅごしゃ}",        desc: "EP4をクリア",                elDesc: "EP4をクリア",                                     color: "#0ea5e9", cond: (r) => r.ep4?.completed },
  { id: "ep5_master",   icon: "👥", label: "いじめ防衛隊",      elLabel: "いじめ{防衛隊|ぼうえいたい}",          desc: "EP5をクリア",                elDesc: "EP5をクリア",                                     color: "#ec4899", cond: (r) => r.ep5?.completed },
  { id: "ep6_master",   icon: "📸", label: "画像安全マスター",   elLabel: "{画像|がぞう}{安全|あんぜん}マスター",  desc: "EP6をクリア",                elDesc: "EP6をクリア",                                     color: "#f43f5e", cond: (r) => r.ep6?.completed },
  { id: "ep7_master",   icon: "🕸️", label: "グルーミング免疫",   elLabel: "グルーミング{免疫|めんえき}",          desc: "EP7をクリア",                elDesc: "EP7をクリア",                                     color: "#8b5cf6", cond: (r) => r.ep7?.completed },
  { id: "two_device",   icon: "📲", label: "親子コラボ達成",     elLabel: "{親子|おやこ}コラボ{達成|たっせい}",   desc: "2台モードをクリア",           elDesc: "2{台|だい}モードをクリア",                         color: "#f59e0b", cond: (r) => r.twodevice?.completed },
  { id: "triple",       icon: "⭐", label: "3冠達成",           elLabel: "3{冠|かん}{達成|たっせい}",            desc: "任意3EPをクリア",             elDesc: "{任意|にんい}3EPをクリア",                         color: "#a78bfa", cond: (r) => Object.values(r).filter(v => v?.completed).length >= 3 },
  { id: "five_star",    icon: "🌟", label: "5冠達成",           elLabel: "5{冠|かん}{達成|たっせい}",            desc: "任意5EPをクリア",             elDesc: "{任意|にんい}5EPをクリア",                         color: "#fbbf24", cond: (r) => Object.values(r).filter(v => v?.completed).length >= 5 },
  { id: "all_clear",    icon: "🏆", label: "全EP制覇",          elLabel: "{全|ぜん}EP{制覇|せいは}",             desc: "全7EPをクリア",               elDesc: "{全|ぜん}7EPをクリア",                             color: "#ff6b6b", cond: (r) => ["ep1","ep2","ep3","ep4","ep5","ep6","ep7"].every(k => r[k]?.completed) },
  { id: "speed_demon",  icon: "⚡", label: "スピードマスター",   elLabel: "スピードマスター",                     desc: "EP1タイムアタック全発見",      elDesc: "EP1タイムアタック{全|ぜん}{発見|はっけん}",         color: "#f97316", cond: (r) => r.ep1?.speedBonus },
  { id: "fact_checker", icon: "✅", label: "完璧な鑑定士",       elLabel: "{完璧|かんぺき}な{鑑定|かんてい}{士|し}", desc: "EP2全問正解（4問）",       elDesc: "EP2{全|ぜん}{問|もん}{正解|せいかい}（4{問|もん}）", color: "#7c3aed", cond: (r) => r.ep2?.score >= 4 },
  { id: "no_miss",      icon: "💎", label: "ノーミスクリア",     elLabel: "ノーミスクリア",                       desc: "リトライなしで3EP以上",       elDesc: "リトライなしで3EP{以上|いじょう}",                 color: "#06b6d4", cond: (r) => Object.values(r).filter(v => v?.completed && !v.retries).length >= 3 },
  // ── 隠しコマンド実績 ──
  { id: "secret1", icon: "🎣", label: "釣られてみた",    elLabel: "{釣|つ}られてみた",               desc: "モリィを10回タップして隠しコマンドを発見",     elDesc: "モリィを10{回|かい}タップして{隠|かく}しコマンドを{発見|はっけん}", color: "#ffa940", secret: true, cond: () => { try { return !!localStorage.getItem("mamoru_secret1_found"); } catch { return false; } } },
  { id: "secret2", icon: "💻", label: "ハッカー体験",    elLabel: "ハッカー{体験|たいけん}",         desc: "ロゴを長押しして隠しコマンドを発見",           elDesc: "ロゴを{長押|ながお}しして{隠|かく}しコマンドを{発見|はっけん}",     color: "#00e676", secret: true, cond: () => { try { return !!localStorage.getItem("mamoru_secret2_found"); } catch { return false; } } },
  { id: "secret3", icon: "🕷️", label: "闇Web探索者",   elLabel: "{闇|やみ}Web{探索者|たんさくしゃ}", desc: "左右スワイプ5回で隠しコマンドを発見",         elDesc: "スワイプで{隠|かく}しコマンドを{発見|はっけん}",                   color: "#a78bfa", secret: true, cond: () => { try { return !!localStorage.getItem("mamoru_secret3_found"); } catch { return false; } } },
  { id: "secret4", icon: "🔑", label: "親の目線",        elLabel: "{親|おや}の{目線|めせん}",         desc: "レポートボタンを長押しして隠しコマンドを発見", elDesc: "レポートボタン{長押|ながお}しで{隠|かく}しコマンドを{発見|はっけん}", color: "#38bdf8", secret: true, cond: () => { try { return !!localStorage.getItem("mamoru_secret4_found"); } catch { return false; } } },
];

function getBadges(record) { return BADGES.filter(b => b.cond(record)); }

function getMasterTitle(record) {
  const cleared = Object.values(record).filter(v => v?.completed).length;
  if (cleared >= 8) return { title: "🏆 SNSリテラシー完全マスター", elTitle: "🏆 SNSリテラシー{完全|かんぜん}マスター", color: "#ff6b6b" };
  if (cleared >= 6) return { title: "🌟 上級リテラシー戦士",       elTitle: "🌟 {上級|じょうきゅう}リテラシー{戦士|せんし}",       color: "#fbbf24" };
  if (cleared >= 4) return { title: "⭐ リテラシー探求者",         elTitle: "⭐ リテラシー{探求者|たんきゅうしゃ}",         color: "#a78bfa" };
  if (cleared >= 2) return { title: "🌱 リテラシー見習い",         elTitle: "🌱 リテラシー{見習|みなら}い",         color: "#4ade80" };
  return                   { title: "🔰 はじめの一歩",             elTitle: "🔰 はじめの{一歩|いっぽ}",             color: "#94a3b8" };
}

// ホーム表示用バッジストリップ
function BadgeStrip({ record }) {
  const earned = getBadges(record);
  const ageMode = useAgeMode();
  const [sel, setSel] = useState(null);
  if (earned.length === 0) return null;
  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
        {earned.map(b => (
          <div key={b.id} title={b.label}
            onClick={() => setSel(b)}
            style={{ width: 34, height: 34, borderRadius: 10, background: `${b.color}22`, border: `1.5px solid ${b.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", transition: "transform .15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>{b.icon}</div>
        ))}
      </div>
      {sel && (
        <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 280, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `${sel.color}18`, border: `2px solid ${sel.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 14px" }}>{sel.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", marginBottom: 8 }}><RubyText text={ageMode === "elementary" ? sel.elLabel : sel.label} /></div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? sel.elDesc : sel.desc} /></div>
            <button onClick={() => setSel(null)} style={{ marginTop: 18, padding: "10px 28px", background: `linear-gradient(135deg,${sel.color},${sel.color}bb)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "{閉|と}じる" : "閉じる"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// 保護者レポート バッジタブ
function BadgeGallery({ record }) {
  const earned = getBadges(record);
  const masterTitle = getMasterTitle(record);
  const ageMode = useAgeMode();
  const allKeys = ["ep1","ep2","ep3","ep4","ep5","ep6","ep7","twodevice","attacker"];
  const displayTitle = ageMode === "elementary" ? masterTitle.elTitle : masterTitle.title;
  const titleEmoji = displayTitle.split(" ")[0];
  const titleText = displayTitle.slice(displayTitle.indexOf(" ") + 1);
  const [sel, setSel] = useState(null);

  // 未獲得バッジ（シークレットは発見前は "？？？" 表示）
  const unearned = BADGES.filter(b => !b.cond(record));

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {/* バッジ説明モーダル */}
      {sel && (
        <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", maxWidth: 300, width: "90%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,.4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: sel.secret && !sel.cond(record) ? "#e2e8f0" : `${sel.color}1a`, border: `2px solid ${sel.secret && !sel.cond(record) ? "#94a3b8" : sel.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 16px" }}>
              {sel.secret && !sel.cond(record) ? "？" : sel.icon}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", marginBottom: 10 }}>
              {sel.secret && !sel.cond(record) ? "？？？" : <RubyText text={ageMode === "elementary" ? sel.elLabel : sel.label} />}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 6 }}>
              {sel.secret && !sel.cond(record)
                ? <span style={{ color: "#94a3b8", fontStyle: "italic" }}>{ageMode === "elementary" ? "{隠|かく}しコマンドを{発見|はっけん}すると{解放|かいほう}されます" : "隠しコマンドを発見すると解放されます"}</span>
                : <RubyText text={ageMode === "elementary" ? sel.elDesc : sel.desc} />
              }
            </div>
            {sel.secret && !sel.cond(record) && (
              <div style={{ fontSize: 11, color: "#c084fc", marginBottom: 4 }}>🔒 {ageMode === "elementary" ? "{秘密|ひみつ}の{実績|じっせき}" : "秘密の実績"}</div>
            )}
            <button onClick={() => setSel(null)} style={{ marginTop: 16, padding: "11px 32px", background: sel.secret && !sel.cond(record) ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : `linear-gradient(135deg,${sel.color},${sel.color}cc)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "{閉|と}じる" : "閉じる"} />
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", marginBottom: 14, textAlign: "center", border: `2px solid ${masterTitle.color}44`, boxShadow: `0 4px 16px ${masterTitle.color}18` }}>
        <div style={{ fontSize: 32, marginBottom: 6 }}>{titleEmoji}</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#1e293b", marginBottom: 4 }}><RubyText text={titleText} /></div>
        <div style={{ fontSize: 12, color: "#64748b" }}><RubyText text={ageMode === "elementary" ? `クリア{済|す}み：${Object.values(record).filter(v => v?.completed).length} / ${allKeys.length}` : `クリア済み：${Object.values(record).filter(v => v?.completed).length} / ${allKeys.length}`} /></div>
      </div>
      {earned.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", marginBottom: 12, border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#64748b", marginBottom: 12, letterSpacing: ".08em" }}><RubyText text={ageMode === "elementary" ? `{獲得|かくとく}バッジ (${earned.length})` : `獲得バッジ (${earned.length})`} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {earned.map(b => (
              <div key={b.id} onClick={() => setSel(b)} style={{ display: "flex", gap: 10, alignItems: "center", background: `${b.color}08`, border: `1px solid ${b.color}25`, borderRadius: 12, padding: "10px 12px", cursor: "pointer", transition: "opacity .15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1e293b" }}><RubyText text={ageMode === "elementary" ? b.elLabel : b.label} /></div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? b.elDesc : b.desc} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unearned.length > 0 && (
        <div style={{ background: "#f8fafc", borderRadius: 16, padding: "16px", border: "1px dashed #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#94a3b8", marginBottom: 10, letterSpacing: ".08em" }}><RubyText text={ageMode === "elementary" ? "{未獲得|みかくとく}バッジ" : "未獲得バッジ"} /></div>
          {unearned.map(b => {
            const isHidden = b.secret;
            return (
              <div key={b.id} onClick={() => setSel(b)} style={{ display: "flex", gap: 10, alignItems: "center", opacity: isHidden ? .55 : .45, marginBottom: 7, cursor: "pointer" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isHidden ? 14 : 16, filter: isHidden ? "none" : "grayscale(1)", flexShrink: 0 }}>
                  {isHidden ? "？" : b.icon}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {isHidden
                    ? <><span style={{ fontWeight: 900, color: "#a78bfa" }}>？？？</span> <span style={{ fontSize: 10, color: "#94a3b8" }}>— {ageMode === "elementary" ? "{隠|かく}しコマンドで{解放|かいほう}" : "隠しコマンドで解放"}</span></>
                    : <><RubyText text={ageMode === "elementary" ? b.elLabel : b.label} /> <span style={{ fontSize: 10, color: "#94a3b8" }}>— <RubyText text={ageMode === "elementary" ? b.elDesc : b.desc} /></span></>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ② 自分の言葉で入力コンポーネント
// エピソード終了時に「一言で言うと何を学んだ？」
// ═══════════════════════════════════════════════
function MyWordsInput({ epKey, prompt, placeholder, accentColor = "#ffa940", onSave, mode = "dark" }) {
  const storageKey = `mamoru_mywords_${epKey}`;
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(storageKey) || ""; } catch { return ""; }
  });
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const ageMode = useAgeMode();

  const handleSave = () => {
    if (!text.trim()) return;
    try { localStorage.setItem(storageKey, text.trim()); } catch {}
    setSaved(true);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    if (onSave) onSave(text.trim());
  };

  // ライトモード（明るい背景）とダークモードで色を切り替え
  const m = mode === "light" ? {
    bg: "#fff",
    border: saved ? accentColor + "88" : `${accentColor}44`,
    titleColor: "#1e293b",
    subColor: "#64748b",
    promptColor: "#334155",
    inputBg: "#f8fafc",
    inputBorder: saved ? accentColor + "88" : "#e2e8f0",
    inputColor: "#1e293b",
    placeholderNote: "#94a3b8",
    countColor: "#94a3b8",
    boxShadow: `0 4px 16px ${accentColor}18`,
  } : {
    bg: "rgba(255,255,255,.06)",
    border: `${accentColor}44`,
    titleColor: "#fff",
    subColor: "rgba(255,255,255,.5)",
    promptColor: "rgba(255,255,255,.85)",
    inputBg: "rgba(255,255,255,.08)",
    inputBorder: saved ? accentColor + "88" : "rgba(255,255,255,.18)",
    inputColor: "#fff",
    placeholderNote: "rgba(255,255,255,.35)",
    countColor: "rgba(255,255,255,.4)",
    boxShadow: "none",
  };

  return (
    <div style={{
      background: m.bg,
      border: `1.5px solid ${m.border}`,
      borderRadius: 18, padding: "18px 16px",
      marginTop: 14, animation: "slideUp .4s ease",
      boxShadow: m.boxShadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 20 }}>✍️</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: m.titleColor }}><RubyText text={ageMode === "elementary" ? "{自分|じぶん}の{言葉|ことば}で{記録|きろく}しよう" : "自分の言葉で記録しよう"} /></div>
          <div style={{ fontSize: 11, color: m.subColor, marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "あとで{保護者|ほごしゃ}レポートで{確認|かくにん}できます" : "あとで保護者レポートで確認できます"} /></div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: m.promptColor, marginBottom: 10, lineHeight: 1.7 }}>
        <RubyText text={prompt} />
      </div>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setSaved(false); }}
        placeholder={placeholder}
        maxLength={200}
        rows={3}
        style={{
          width: "100%", padding: "10px 12px",
          background: m.inputBg,
          border: `1.5px solid ${m.inputBorder}`,
          borderRadius: 12, color: m.inputColor, fontSize: 13,
          fontFamily: "'Zen Maru Gothic',sans-serif",
          resize: "none", outline: "none",
          lineHeight: 1.7, boxSizing: "border-box",
          transition: "border-color .2s",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div style={{ fontSize: 10, color: m.countColor }}>{text.length}/200<RubyText text={ageMode === "elementary" ? "{文字|もじ}" : "文字"} /></div>
        <button onClick={handleSave} disabled={!text.trim() || saved}
          style={{
            padding: "8px 20px",
            background: justSaved ? "rgba(74,222,128,.15)" : saved ? "rgba(0,0,0,.05)" : accentColor,
            border: `1.5px solid ${justSaved ? "rgba(74,222,128,.5)" : saved ? "#e2e8f0" : accentColor}`,
            borderRadius: 99,
            color: justSaved ? "#16a34a" : saved ? "#94a3b8" : "#fff",
            fontSize: 12, fontWeight: 700,
            cursor: text.trim() && !saved ? "pointer" : "default",
            fontFamily: "inherit", transition: "all .2s",
          }}>
          <RubyText text={justSaved ? (ageMode === "elementary" ? "✓ {保存|ほぞん}しました！" : "✓ 保存しました！") : saved ? (ageMode === "elementary" ? "{保存済|ほぞんず}み" : "保存済み") : (ageMode === "elementary" ? "{保存|ほぞん}する" : "保存する")} />
        </button>
      </div>
    </div>
  );
}

// ⑥ 保護者との双方向答え合わせコンポーネント
// 質問→子どもが答え選択→保護者が評価→解説 という流れ
function ParentQA({ questions, accentColor = "#ffa940", mode = "dark" }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("ask");
  const [childAnswer, setChildAnswer] = useState("");
  const [allDone, setAllDone] = useState(false);
  const ageMode = useAgeMode();

  const m = mode === "light" ? {
    cardBg: "#fff",
    cardBorder: `${accentColor}44`,
    cardShadow: `0 4px 20px ${accentColor}18`,
    questionColor: "#1e293b",
    optionBg: "#f8fafc",
    optionBorder: "#e2e8f0",
    optionColor: "#334155",
    optionHoverBg: `${accentColor}08`,
    answerBg: `${accentColor}08`,
    answerLabel: "#64748b",
    answerText: "#1e293b",
    parentNoteBg: "rgba(99,102,241,.06)",
    parentNoteBorder: "rgba(99,102,241,.2)",
    parentNoteColor: "#4f46e5",
    parentBtnBg: "rgba(99,102,241,.08)",
    parentBtnBorder: "rgba(99,102,241,.2)",
    parentBtnColor: "#4f46e5",
    evalLabel: "#64748b",
    explanationBg: `${accentColor}08`,
    explanationBorder: `${accentColor}33`,
    explanationLabel: accentColor,
    explanationText: "#334155",
    tipColor: "#64748b",
    doneBg: "rgba(74,222,128,.08)",
    doneBorder: "rgba(74,222,128,.3)",
    doneTitle: "#166534",
    doneText: "#15803d",
  } : {
    cardBg: "rgba(255,255,255,.04)",
    cardBorder: `${accentColor}33`,
    cardShadow: "none",
    questionColor: "#fff",
    optionBg: "rgba(255,255,255,.05)",
    optionBorder: "rgba(255,255,255,.1)",
    optionColor: "rgba(255,255,255,.8)",
    answerBg: "rgba(255,255,255,.06)",
    answerLabel: "rgba(255,255,255,.4)",
    answerText: "#fff",
    parentNoteBg: "rgba(99,102,241,.08)",
    parentNoteBorder: "rgba(99,102,241,.25)",
    parentNoteColor: "#a5b4fc",
    parentBtnBg: "rgba(99,102,241,.15)",
    parentBtnBorder: "rgba(99,102,241,.3)",
    parentBtnColor: "#a5b4fc",
    evalLabel: "rgba(255,255,255,.55)",
    explanationBg: `${accentColor}0f`,
    explanationBorder: `${accentColor}33`,
    explanationLabel: accentColor,
    explanationText: "rgba(255,255,255,.8)",
    tipColor: "rgba(255,255,255,.45)",
    doneBg: "rgba(74,222,128,.08)",
    doneBorder: "rgba(74,222,128,.25)",
    doneTitle: "#86efac",
    doneText: "rgba(255,255,255,.6)",
  };

  if (allDone) return (
    <div style={{ background: m.doneBg, border: `1px solid ${m.doneBorder}`, borderRadius: 16, padding: "18px 16px", animation: "slideUp .4s ease" }}>
      <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🎊</div>
      <div style={{ fontSize: 14, fontWeight: 900, color: m.doneTitle, textAlign: "center", marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "{答|こた}え{合|あ}わせ{完了|かんりょう}！" : "答え合わせ完了！"} /></div>
      <div style={{ fontSize: 12, color: m.doneText, textAlign: "center", lineHeight: 1.7 }}>
        {ageMode === "elementary"
          ? <><RubyText text="{今日|きょう}{学|まな}んだことが、{言葉|ことば}にできた。" /><br /><RubyText text="これが{本当|ほんとう}の{理解|りかい}です。" /></>
          : <>今日学んだことが、言葉にできた。<br />これが本当の理解です。</>
        }
      </div>
    </div>
  );

  const q = questions[idx];

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < idx ? accentColor : i === idx ? `${accentColor}66` : "rgba(0,0,0,.08)" }} />
        ))}
      </div>

      <div style={{ background: m.cardBg, border: `1.5px solid ${m.cardBorder}`, borderRadius: 18, padding: "18px 16px", boxShadow: m.cardShadow }}>
        {/* Role badge */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 900,
            letterSpacing: ".05em", fontFamily: "'DotGothic16',monospace", padding: "4px 12px", borderRadius: 99,
            ...(phase === "parent_eval" || phase === "child_answered"
              ? { background: "rgba(99,102,241,.1)", color: mode === "light" ? "#4f46e5" : "#a5b4fc", border: "1px solid rgba(99,102,241,.25)" }
              : phase === "explained"
              ? { background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }
              : { background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` })
          }}>
            {phase === "ask"
              ? <RubyText text={ageMode === "elementary" ? "👧 こどもへの{質問|しつもん}" : "👧 子どもへの質問"} />
              : phase === "child_answered"
              ? <RubyText text={ageMode === "elementary" ? "👨‍👩‍👧 {保護者|ほごしゃ}が{確認|かくにん}" : "👨‍👩‍👧 保護者が確認"} />
              : phase === "parent_eval"
              ? <RubyText text={ageMode === "elementary" ? "👨‍👩‍👧 {保護者|ほごしゃ}が{評価|ひょうか}" : "👨‍👩‍👧 保護者が評価"} />
              : <RubyText text={ageMode === "elementary" ? "💡 {解説|かいせつ}" : "💡 解説"} />}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontSize: 15, fontWeight: 800, color: m.questionColor, lineHeight: 1.65, marginBottom: 16 }}>
          <RubyText text={q.question} />
        </div>

        {/* Optional visual mock */}
        {q.visual && (
          <div style={{ marginBottom: 14 }}>
            {q.visual}
          </div>
        )}

        {/* Child answers */}
        {phase === "ask" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.childOptions.map((opt, i) => (
              <button key={i} onClick={() => { setChildAnswer(opt); setPhase("child_answered"); }}
                style={{ width: "100%", padding: "13px 16px", background: m.optionBg, border: `1.5px solid ${m.optionBorder}`, borderRadius: 14, color: m.optionColor, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .15s" }}>
                <span style={{ color: accentColor, fontWeight: 900, marginRight: 8 }}>{["A", "B", "C"][i]}.</span>
                <RubyText text={opt} />
              </button>
            ))}
          </div>
        )}

        {/* Child answered — hand to parent */}
        {phase === "child_answered" && (
          <div>
            <div style={{ background: m.answerBg, borderRadius: 12, padding: "11px 14px", marginBottom: 12, border: `1px solid ${accentColor}22` }}>
              <div style={{ fontSize: 10, color: m.answerLabel, marginBottom: 5, fontWeight: 700 }}><RubyText text={ageMode === "elementary" ? "こどもの{回答|かいとう}" : "子どもの回答"} /></div>
              <div style={{ fontSize: 14, color: m.answerText, fontWeight: 700 }}>「<RubyText text={childAnswer} />」</div>
            </div>
            <div style={{ background: m.parentNoteBg, border: `1px solid ${m.parentNoteBorder}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12, fontSize: 12, color: m.parentNoteColor, lineHeight: 1.75 }}>
              <RubyText text={ageMode === "elementary" ? "📱 {保護者|ほごしゃ}の{方|かた}へスマホを{渡|わた}して、{回答|かいとう}を{確認|かくにん}・{評価|ひょうか}してください" : "📱 保護者の方へスマホを渡して、回答を確認・評価してください"} />
            </div>
            <button onClick={() => setPhase("parent_eval")}
              style={{ width: "100%", padding: 13, background: m.parentBtnBg, border: `1px solid ${m.parentBtnBorder}`, borderRadius: 12, color: m.parentBtnColor, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "👨‍👩‍👧 {保護者|ほごしゃ}が{評価|ひょうか}する →" : "👨‍👩‍👧 保護者が評価する →"} />
            </button>
          </div>
        )}

        {/* Parent evaluates */}
        {phase === "parent_eval" && (
          <div>
            <div style={{ background: m.answerBg, borderRadius: 12, padding: "11px 14px", marginBottom: 12, border: `1px solid ${accentColor}22` }}>
              <div style={{ fontSize: 10, color: m.answerLabel, marginBottom: 5, fontWeight: 700 }}><RubyText text={ageMode === "elementary" ? "こどもの{回答|かいとう}" : "子どもの回答"} /></div>
              <div style={{ fontSize: 14, color: m.answerText, fontWeight: 700 }}>「<RubyText text={childAnswer} />」</div>
            </div>
            <div style={{ fontSize: 12, color: m.evalLabel, marginBottom: 10, fontWeight: 600 }}><RubyText text={ageMode === "elementary" ? "この{答|こた}えをどう{評価|ひょうか}しますか？" : "この答えをどう評価しますか？"} /></div>
            <div style={{ display: "flex", gap: 8 }}>
              {(ageMode === "elementary" ? [
                { label: "よく{理解|りかい}できてる 👍", bg: "rgba(74,222,128,.12)", border: "rgba(74,222,128,.4)", color: mode === "light" ? "#166534" : "#86efac" },
                { label: "もう{少|すこ}し{話|はな}し{合|あ}おう 💬", bg: "rgba(251,191,36,.12)", border: "rgba(251,191,36,.4)", color: mode === "light" ? "#92400e" : "#fbbf24" },
              ] : [
                { label: "よく理解できてる 👍", bg: "rgba(74,222,128,.12)", border: "rgba(74,222,128,.4)", color: mode === "light" ? "#166534" : "#86efac" },
                { label: "もう少し話し合おう 💬", bg: "rgba(251,191,36,.12)", border: "rgba(251,191,36,.4)", color: mode === "light" ? "#92400e" : "#fbbf24" },
              ]).map((opt, i) => (
                <button key={i} onClick={() => setPhase("explained")}
                  style={{ flex: 1, padding: "12px 8px", background: opt.bg, border: `1.5px solid ${opt.border}`, borderRadius: 12, color: opt.color, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  <RubyText text={opt.label} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        {phase === "explained" && (
          <div>
            <div style={{ background: m.explanationBg, border: `1px solid ${m.explanationBorder}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: m.explanationLabel, fontWeight: 900, marginBottom: 8 }}><RubyText text={ageMode === "elementary" ? "💡 {正解|せいかい}・{解説|かいせつ}" : "💡 正解・解説"} /></div>
              <div style={{ fontSize: 13, color: m.explanationText, lineHeight: 1.8 }}><RubyText text={q.explanation} /></div>
            </div>
            {q.talkTip && (
              <div style={{ fontSize: 12, color: m.tipColor, lineHeight: 1.7, marginBottom: 14, padding: "10px 14px", background: "rgba(0,0,0,.04)", borderRadius: 10, borderLeft: `3px solid ${accentColor}66` }}>
                💬 <strong><RubyText text={ageMode === "elementary" ? "{話題|わだい}のヒント：" : "話題のヒント："} /></strong><RubyText text={q.talkTip} />
              </div>
            )}
            <button onClick={() => {
              if (idx < questions.length - 1) { setIdx(idx + 1); setPhase("ask"); setChildAnswer(""); }
              else setAllDone(true);
            }}
              style={{ width: "100%", padding: 13, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${accentColor}33` }}>
              <RubyText text={idx < questions.length - 1 ? (ageMode === "elementary" ? "{次|つぎ}の{質問|しつもん}へ →" : "次の質問へ →") : (ageMode === "elementary" ? "{完了|かんりょう}！ 🎉" : "完了！ 🎉")} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ダイアローグランナー ──
// ParentQA（質問）→ MyWordsInput（記録）を2画面に分けて表示
function DialogueRunner({ accentColor, bg, questions, epKey, myWordsPrompt, myWordsPlaceholder, onComplete }) {
  const [step, setStep] = useState(0);
  const [myWordsText, setMyWordsText] = useState(() => {
    try { return localStorage.getItem(`mamoru_mywords_${epKey}`) || ""; } catch { return ""; }
  });
  const canComplete = myWordsText.trim().length > 0;
  const ageMode = useAgeMode();

  if (step === 0) return (
    <div style={{ minHeight: "100vh", background: bg, padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[0,1].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? accentColor : "rgba(0,0,0,.1)" }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accentColor}18`, border: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👨‍👩‍👧</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b" }}><RubyText text={ageMode === "elementary" ? "おうちの{人|ひと}と{話|はな}してみよう" : "おうちの人と話してみよう"} /></div>
            <div style={{ fontSize: 11, color: "#64748b" }}><RubyText text={ageMode === "elementary" ? "{画面|がめん} 1 / 2 — {答|こた}え{合|あ}わせ" : "画面 1 / 2 — 答え合わせ"} /></div>
          </div>
        </div>
        <ParentQA mode="light" accentColor={accentColor} questions={questions} />
        <button onClick={() => setStep(1)}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accentColor}33` }}>
          <RubyText text={ageMode === "elementary" ? "{次|つぎ}：{自分|じぶん}の{言葉|ことば}で{記録|きろく}する →" : "次：自分の言葉で記録する →"} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: bg, padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[0,1].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: accentColor }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accentColor}18`, border: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✍️</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b" }}><RubyText text={ageMode === "elementary" ? "{自分|じぶん}の{言葉|ことば}で{記録|きろく}しよう" : "自分の言葉で記録しよう"} /></div>
            <div style={{ fontSize: 11, color: "#64748b" }}><RubyText text={ageMode === "elementary" ? "{画面|がめん} 2 / 2 — 1{文字|もじ}{以上|いじょう}{書|か}いてから{修了証|しゅうりょうしょう}をもらえます" : "画面 2 / 2 — 1文字以上書いてから修了証をもらえます"} /></div>
          </div>
        </div>

        <MyWordsInput
          mode="light"
          epKey={epKey}
          prompt={myWordsPrompt}
          placeholder={myWordsPlaceholder}
          accentColor={accentColor}
          onSave={(text) => setMyWordsText(text)}
        />
        <div style={{ marginTop: 6, marginBottom: 14, fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
          <RubyText text={ageMode === "elementary" ? "↑ まず「{保存|ほぞん}する」を{押|お}してください" : "↑ まず「保存する」を押してください"} />
        </div>

        {/* 修了証ボタン：1文字以上入力・保存済みの場合のみ有効 */}
        {canComplete ? (
          <button onClick={onComplete}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accentColor}33`, animation: "popIn .4s ease" }}>
            <RubyText text={ageMode === "elementary" ? "🏆 {修了証|しゅうりょうしょう}をもらう" : "🏆 修了証をもらう"} />
          </button>
        ) : (
          <div style={{ padding: "12px 14px", background: "rgba(0,0,0,.05)", border: "1px solid rgba(0,0,0,.08)", borderRadius: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔒</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              <RubyText text={ageMode === "elementary" ? "{自分|じぶん}の{言葉|ことば}を{入力|にゅうりょく}して「{保存|ほぞん}する」を{押|お}すと{修了証|しゅうりょうしょう}をもらえます" : "自分の言葉を入力して「保存する」を押すと修了証をもらえます"} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 💬 ParentDialogue — 親子対話コンポーネント
// 問いかけ→メモ→保護者ヒント→次へ の形式
// ═══════════════════════════════════════════════
function ParentDialogue({ questions, epKey, accentColor = "#ffa940", onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [idx, setIdx] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [memo, setMemo] = useState(() => {
    try { return localStorage.getItem(`mamoru_dialogue_${epKey}_${questions[0].id}`) || ""; } catch { return ""; }
  });

  const q = questions[idx];

  useEffect(() => {
    const key = `mamoru_dialogue_${epKey}_${questions[idx].id}`;
    try { setMemo(localStorage.getItem(key) || ""); } catch { setMemo(""); }
    setHintOpen(false);
  }, [idx]);

  const questionText = el ? (q.questionEl || q.question) : q.question;
  const hints = el ? (q.hintsEl || q.hints) : q.hints;
  const phText = el ? "おやこで はなした ないようを かいてみよう" : q.placeholder;
  const canProceed = memo.trim().length > 0;
  const isLast = idx === questions.length - 1;

  const handleNext = () => {
    feedback("tap");
    try { localStorage.setItem(`mamoru_dialogue_${epKey}_${q.id}`, memo.trim()); } catch {}
    if (isLast) {
      setDone(true);
      setTimeout(() => onComplete(), 800);
    } else {
      setIdx(i => i + 1);
    }
  };

  if (done) return (
    <div style={{ background: "#ffffff", borderRadius: 18, padding: "40px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.08)", textAlign: "center", fontFamily: "'Zen Maru Gothic',sans-serif", animation: "popIn .4s ease" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b" }}>全部話し合えた！</div>
    </div>
  );

  return (
    <div style={{ background: "#ffffff", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* OwlMolly + bubble */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <OwlMolly size={60} />
          <div style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}33`, borderRadius: 14, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#1e293b", flex: 1 }}>
            <RubyText text={el ? "{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "今回学んだことについて親子で話し合ってみよう！"} />
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i === idx ? accentColor : "#e2e8f0", transition: "background .3s" }} />
          ))}
        </div>
        {/* Question card */}
        <div style={{ background: "#ffffff", borderRadius: 18, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(0,0,0,.08)", border: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75 }}>
            <RubyText text={questionText} />
          </div>
        </div>
        {/* Memo textarea */}
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder={phText}
          rows={5}
          style={{ border: `1.5px solid ${memo.trim() ? accentColor : "#e2e8f0"}`, borderRadius: 12, padding: 12, fontSize: 14, fontFamily: "inherit", resize: "vertical", width: "100%", outline: "none", boxSizing: "border-box", marginBottom: 12, transition: "border-color .2s" }}
        />
        {/* Hint accordion */}
        <div style={{ marginBottom: 14 }}>
          <button
            onClick={() => { feedback("tap"); setHintOpen(o => !o); }}
            style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)", color: "#4f46e5", borderRadius: hintOpen ? "12px 12px 0 0" : 12, padding: "10px 14px", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span><RubyText text={el ? "👨‍👩‍👧 {保護者|ほごしゃ}の{方|かた}へ（{話題|わだい}に{詰|つ}まった{時|とき}はこちら）" : "👨‍👩‍👧 保護者の方へ（話題に詰まった時はこちら）"} /></span>
            <span style={{ transform: hintOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
          </button>
          {hintOpen && (
            <div style={{ background: "rgba(99,102,241,.04)", border: "1px solid rgba(99,102,241,.2)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "14px 16px", animation: "slideUp .2s ease" }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, lineHeight: 1.65 }}>
                <RubyText text={el ? "お{子|こ}さまから{意見|いけん}が{出|で}ない{時|とき}、{以下|いか}のヒントを{出|だ}してみましょう" : "お子さまから意見が出ない時、以下のヒントを出してみましょう"} />
              </div>
              {hints && hints.map((hint, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start", fontSize: 13, color: "#4f46e5", lineHeight: 1.7 }}>
                  <span style={{ fontWeight: 900, flexShrink: 0 }}>{["①","②","③","④","⑤"][i] || `${i + 1}.`}</span>
                  <span><RubyText text={hint} /></span>
                </div>
              ))}
              {epKey === "ep3" && q.id === "q4" && (
                <div style={{ marginTop: 12, background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#065f46", marginBottom: 8 }}>📞 <RubyText text={el ? "{困|こま}ったらここに{相談|そうだん}しよう" : "困ったらここに相談しよう"} /></div>
                  {[
                    { name: "#9110", label: el ? "{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}" : "警察相談専用電話", note: el ? "24{時間|じかん}{対応|たいおう}・{全国|ぜんこく}どこからでも" : "24時間対応・全国どこからでも" },
                    { name: "0120-007-110", label: el ? "{子|こ}どもの{人権|じんけん}110{番|ばん}" : "子どもの人権110番", note: el ? "{無料|むりょう}・{平日|へいじつ}8:30〜17:15" : "無料・平日8:30〜17:15" },
                    { name: "0120-279-338", label: "よりそいホットライン", note: el ? "24{時間|じかん}{対応|たいおう}・{無料|むりょう}" : "24時間対応・無料" },
                  ].map((c, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <a href={`tel:${c.name}`} style={{ fontSize: 14, fontWeight: 900, color: "#059669", textDecoration: "none" }}>{c.name}</a>
                      <span style={{ fontSize: 12, color: "#065f46", marginLeft: 8 }}><RubyText text={c.label} /></span>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}><RubyText text={c.note} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {!canProceed && (
          <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 6 }}>
            <RubyText text={el ? "✏️ 1{文字|もじ}{以上|いじょう}{入力|にゅうりょく}すると{次|つぎ}に{進|すす}めるよ" : "✏️ 1文字以上入力すると次に進めるよ"} />
          </div>
        )}
        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          style={{ background: canProceed ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#e2e8f0", color: canProceed ? "#fff" : "#94a3b8", padding: 15, width: "100%", borderRadius: 14, fontSize: 15, fontWeight: 900, border: "none", cursor: canProceed ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all .2s" }}>
          <RubyText text={isLast ? (el ? "{完了|かんりょう} ✓" : "完了 ✓") : (el ? "{次|つぎ}へ →" : "次へ →")} />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🔥 週次チャレンジシステム
// ═══════════════════════════════════════════════

// 週番号を取得（月曜スタート）
function getWeekNumber() {
  const d = new Date();
  const dayOfWeek = (d.getDay() + 6) % 7; // Mon=0
  const monday = new Date(d);
  monday.setDate(d.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);
  const jan4 = new Date(monday.getFullYear(), 0, 4);
  const weekNum = Math.ceil(((monday - jan4) / 86400000 + ((jan4.getDay() + 6) % 7 + 1)) / 7);
  return `${monday.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

// ストック問題プール（30問）
const CHALLENGE_STOCK = [
  // 個人情報・位置情報
  {
    id: "s01", week: null, theme: "個人情報", emoji: "📍", color: "#ffa940",
    unsplashQuery: "smartphone photo location",
    question: "SNSに旅行写真を投稿した。翌日「昨日○○にいたんだね」と知らない人からDMが来た。どこから居場所がバレた？",
    choices: [{ id:"a", text:"フォロワーが教えた", elText:"フォロワーが{教|おし}えた" }, { id:"b", text:"写真の位置情報タグとランドマークが写っていた", elText:"{写真|しゃしん}の{位置|いち}{情報|じょうほう}タグとランドマークが{写|うつ}っていた" }, { id:"c", text:"スマホがハッキングされた" }],
    correct: "b",
    explanation: "写真には撮影場所のGPS座標（位置情報タグ）が埋め込まれており、背景のランドマークとあわせて場所が特定される。投稿前にメタデータを削除する習慣を。",
    parentNote: "子どもの写真投稿を定期的に一緒に確認しましょう。スマホ設定→カメラ→位置情報をオフに。",
    elQuestion: "SNSに{旅行|りょこう}{写真|しゃしん}を{投稿|とうこう}した。{翌日|よくじつ}「{昨日|きのう}○○にいたんだね」と{知|し}らない{人|ひと}からDMが{来|き}た。どこから{居場所|いばしょ}がバレた？",
    elExplanation: "{写真|しゃしん}には{撮影|さつえい}{場所|ばしょ}のGPS{座標|ざひょう}（{位置|いち}{情報|じょうほう}タグ）が{埋|う}め{込|こ}まれており、{背景|はいけい}のランドマークとあわせて{場所|ばしょ}が{特定|とくてい}される。{投稿|とうこう}{前|まえ}にメタデータを{削除|さくじょ}する{習慣|しゅうかん}を。",
  },
  {
    id: "s02", week: null, theme: "個人情報", emoji: "🏫", color: "#ffa940",
    unsplashQuery: "school uniform student",
    question: "制服姿の写真をSNSに投稿した。住所を教えていないのに学校名を当てられた。なぜ？",
    choices: [{ id:"a", text:"制服のデザインや校章から特定された", elText:"{制服|せいふく}のデザインや{校章|こうしょう}から{特定|とくてい}された" }, { id:"b", text:"友達が教えた", elText:"{友達|ともだち}が{教|おし}えた" }, { id:"c", text:"偶然", elText:"{偶然|ぐうぜん}" }],
    correct: "a",
    explanation: "制服・校章・スクールバッグのロゴは画像検索で簡単に学校が特定できる。制服での投稿は学校名を公開していることと同じ。",
    parentNote: "「制服姿の写真はNG」を家族ルールに。卒業アルバムや学校行事写真も同様のリスクがあります。",
    elQuestion: "{制服|せいふく}{姿|すがた}の{写真|しゃしん}をSNSに{投稿|とうこう}した。{住所|じゅうしょ}を{教|おし}えていないのに{学校|がっこう}{名|めい}を{当|あ}てられた。なぜ？",
    elExplanation: "{制服|せいふく}・{校章|こうしょう}・スクールバッグのロゴは{画像|がぞう}{検索|けんさく}で{簡単|かんたん}に{学校|がっこう}が{特定|とくてい}できる。{制服|せいふく}での{投稿|とうこう}は{学校|がっこう}{名|めい}を{公開|こうかい}していることと{同|おな}じ。",
  },
  // フェイクニュース
  {
    id: "s03", week: null, theme: "フェイクニュース", emoji: "📰", color: "#7c3aed",
    unsplashQuery: "news media smartphone misinformation",
    question: "「○○市で水道水が危険！今すぐミネラルウォーターを備蓄して」というLINEが回ってきた。まず何をする？",
    choices: [{ id:"a", text:"すぐ家族グループに転送する", elText:"すぐ{家族|かぞく}グループに{転送|てんそう}する" }, { id:"b", text:"○○市の公式サイトや公式Xで確認する", elText:"○○{市|し}の{公式|こうしき}サイトや{公式|こうしき}Xで{確認|かくにん}する" }, { id:"c", text:"スーパーに急ぐ", elText:"スーパーに{急|いそ}ぐ" }],
    correct: "b",
    explanation: "公式情報源で確認するのが大原則。こうした「緊急備蓄」デマは定期的に拡散される。転送する前に必ず1次情報を確認。",
    parentNote: "家族グループLINEはデマの温床になりやすい。「確認してから転送」を家族全員の習慣に。",
    elQuestion: "「○○{市|し}で{水道水|すいどうすい}が{危険|きけん}！{今|いま}すぐミネラルウォーターを{備蓄|びちく}して」というLINEが{回|まわ}ってきた。まず{何|なに}をする？",
    elExplanation: "{公式|こうしき}{情報|じょうほう}{源|げん}で{確認|かくにん}するのが{大原則|だいげんそく}。こうした「{緊急|きんきゅう}{備蓄|びちく}」デマは{定期的|ていきてき}に{拡散|かくさん}される。{転送|てんそう}する{前|まえ}に{必|かなら}ず1{次|じ}{情報|じょうほう}を{確認|かくにん}。",
  },
  {
    id: "s04", week: null, theme: "フェイクニュース", emoji: "🎥", color: "#7c3aed",
    unsplashQuery: "deepfake video technology",
    question: "有名人が「投資で必ず儲かる」と話す動画広告を見た。どうすれば本物かフェイクか確認できる？",
    choices: [{ id:"a", text:"再生回数が多いので信頼する", elText:"{再生|さいせい}{回数|かいすう}が{多|おお}いので{信頼|しんらい}する" }, { id:"b", text:"その有名人の公式SNSや公式サイトで確認する", elText:"その{有名人|ゆうめいじん}の{公式|こうしき}SNSや{公式|こうしき}サイトで{確認|かくにん}する" }, { id:"c", text:"コメント欄を見る", elText:"コメント{欄|らん}を{見|み}る" }],
    correct: "b",
    explanation: "AIによるディープフェイク動画が急増している。有名人が投資を勧める動画は99%詐欺。本人の公式チャンネルで同じ動画が存在するか確認する。",
    parentNote: "2024年、著名人のディープフェイク投資詐欺の被害が急増。子どもだけでなく大人も被害に遭っています。",
    elQuestion: "{有名人|ゆうめいじん}が「{投資|とうし}で{必|かなら}ず{儲|もう}かる」と{話|はな}す{動画|どうが}{広告|こうこく}を{見|み}た。どうすれば{本物|ほんもの}かフェイクか{確認|かくにん}できる？",
    elExplanation: "AIによるディープフェイク{動画|どうが}が{急増|きゅうぞう}している。{有名人|ゆうめいじん}が{投資|とうし}を{勧|すす}める{動画|どうが}は99%{詐欺|さぎ}。{本人|ほんにん}の{公式|こうしき}チャンネルで{同|おな}じ{動画|どうが}が{存在|そんざい}するか{確認|かくにん}する。",
  },
  // 闇バイト・詐欺
  {
    id: "s05", week: null, theme: "闇バイト", emoji: "⚠️", color: "#16a34a",
    unsplashQuery: "suspicious envelope money package",
    question: "「荷物の受け取りをするだけで日払い3万円」というXの募集を見た。応募したらどうなる？",
    choices: [{ id:"a", text:"普通のアルバイトとして働ける", elText:"{普通|ふつう}のアルバイトとして{働|はたら}ける" }, { id:"b", text:"詐欺グループの「受け子」として使われ、逮捕されるリスクがある", elText:"{詐欺|さぎ}グループの「{受|う}け{子|こ}」として{使|つか}われ、{逮捕|たいほ}されるリスクがある" }, { id:"c", text:"断ればリスクはない", elText:"{断|ことわ}ればリスクはない" }],
    correct: "b",
    explanation: "「受け子」は特殊詐欺の実行犯。知らなかったでは済まず、逮捕・起訴される。一度個人情報を送ると脅されて抜け出せなくなる。",
    parentNote: "2024年の強盗・詐欺事件の多くで10〜20代が逮捕。子どものSNSフォロー状況を時々一緒に確認しましょう。",
    elQuestion: "「{荷物|にもつ}の{受|う}け{取|と}りをするだけで{日払|ひばら}い3{万円|まんえん}」というXの{募集|ぼしゅう}を{見|み}た。{応募|おうぼ}したらどうなる？",
    elExplanation: "「{受|う}け{子|こ}」は{特殊|とくしゅ}{詐欺|さぎ}の{実行犯|じっこうはん}。{知|し}らなかったでは{済|す}まず、{逮捕|たいほ}・{起訴|きそ}される。{一度|いちど}{個人|こじん}{情報|じょうほう}を{送|おく}ると{脅|おど}されて{抜|ぬ}け{出|だ}せなくなる。",
  },
  {
    id: "s06", week: null, theme: "闇バイト", emoji: "💰", color: "#16a34a",
    unsplashQuery: "ATM cash withdrawal suspicious",
    question: "「ATMで指定の口座に振り込むだけ。5万円もらえる」と頼まれた。これは何の犯罪に関わる？",
    choices: [{ id:"a", text:"問題ない正当な業務", elText:"{問題|もんだい}ない{正当|せいとう}な{業務|ぎょうむ}" }, { id:"b", text:"マネーロンダリング（資金洗浄）の共犯", elText:"マネーロンダリング（{資金|しきん}{洗浄|せんじょう}）の{共犯|きょうはん}" }, { id:"c", text:"民事上の問題だけで逮捕されない", elText:"{民事|みんじ}{上|じょう}の{問題|もんだい}だけで{逮捕|たいほ}されない" }],
    correct: "b",
    explanation: "出し子・キャッシュアウト役は詐欺・マネロンの共犯として逮捕される。「自分は知らなかった」は裁判で通用しない。",
    parentNote: "SNSで「楽して高収入」を謳う募集は全て疑うよう家族で共有を。#9110（警察相談）を連絡先に追加しておくと安心。",
    elQuestion: "「ATMで{指定|してい}の{口座|こうざ}に{振|ふ}り{込|こ}むだけ。5{万円|まんえん}もらえる」と{頼|たの}まれた。これは{何|なん}の{犯罪|はんざい}に{関|かか}わる？",
    elExplanation: "{出|だ}し{子|こ}・キャッシュアウト{役|やく}は{詐欺|さぎ}・マネロンの{共犯|きょうはん}として{逮捕|たいほ}される。「{自分|じぶん}は{知|し}らなかった」は{裁判|さいばん}で{通用|つうよう}しない。",
  },
  // なりすまし
  {
    id: "s07", week: null, theme: "なりすまし", emoji: "🎭", color: "#0ea5e9",
    unsplashQuery: "hacker identity theft phone",
    question: "急に「LINE乗っ取られた！新しいアカウントで連絡してるけど急いでギフトカード買ってほしい」とDMが来た。どうする？",
    choices: [{ id:"a", text:"急いでコンビニでギフトカードを買う", elText:"{急|いそ}いでコンビニでギフトカードを{買|か}う" }, { id:"b", text:"必ず電話して本人確認してから判断する", elText:"{必|かなら}ず{電話|でんわ}して{本人|ほんにん}{確認|かくにん}してから{判断|はんだん}する" }, { id:"c", text:"既読スルーする", elText:"{既読|きどく}スルーする" }],
    correct: "b",
    explanation: "ギフトカード詐欺の典型的な手口。電話で声を聞くまで絶対に行動しない。本物の友達なら電話に出られるはず。",
    parentNote: "この手口で親が被害に遭うケースも多い。「電話確認なしにギフトカードは絶対買わない」を家族ルールに。",
    elQuestion: "{急|きゅう}に「LINE{乗|の}っ{取|と}られた！{新|あたら}しいアカウントで{連絡|れんらく}してるけど{急|いそ}いでギフトカード{買|か}ってほしい」とDMが{来|き}た。どうする？",
    elExplanation: "ギフトカード{詐欺|さぎ}の{典型的|てんけいてき}な{手口|てぐち}。{電話|でんわ}で{声|こえ}を{聞|き}くまで{絶対|ぜったい}に{行動|こうどう}しない。{本物|ほんもの}の{友達|ともだち}なら{電話|でんわ}に{出|で}られるはず。",
  },
  {
    id: "s08", week: null, theme: "なりすまし", emoji: "🔒", color: "#0ea5e9",
    unsplashQuery: "two factor authentication security phone",
    question: "Instagramから「ログイン通知。心当たりがない場合はこちら」というメールが来てURLをタップした。どうすべきだった？",
    choices: [{ id:"a", text:"URLをタップして正しい対処をした", elText:"URLをタップして{正|ただ}しい{対処|たいしょ}をした" }, { id:"b", text:"URLは踏まずにInstagramアプリを直接開いて確認すべきだった", elText:"URLは{踏|ふ}まずにInstagramアプリを{直接|ちょくせつ}{開|ひら}いて{確認|かくにん}すべきだった" }, { id:"c", text:"メールを無視すれば良かった", elText:"メールを{無視|むし}すれば{良|よ}かった" }],
    correct: "b",
    explanation: "公式を装ったフィッシングメールの典型。URLは踏まずに、常にアプリを直接開いて確認する習慣が大切。",
    parentNote: "子どものSNSアカウントに2段階認証が設定されているか一緒に確認しましょう。設定→セキュリティ→2要素認証から。",
    elQuestion: "Instagramから「ログイン{通知|つうち}。{心当|こころあ}たりがない{場合|ばあい}はこちら」というメールが{来|き}てURLをタップした。どうすべきだった？",
    elExplanation: "{公式|こうしき}を{装|よそお}ったフィッシングメールの{典型|てんけい}。URLは{踏|ふ}まずに、{常|つね}にアプリを{直接|ちょくせつ}{開|ひら}いて{確認|かくにん}する{習慣|しゅうかん}が{大切|たいせつ}。",
  },
  // ネットいじめ
  {
    id: "s09", week: null, theme: "ネットいじめ", emoji: "💬", color: "#ec4899",
    unsplashQuery: "cyberbullying teenager smartphone sad",
    question: "クラスのグループから突然退出させられた。既読がついても返信が来なくなった。これは何と呼ばれる行為？",
    choices: [{ id:"a", text:"グループ管理の問題", elText:"グループ{管理|かんり}の{問題|もんだい}" }, { id:"b", text:"ネットいじめ（グループ外し・無視）", elText:"ネットいじめ（グループ{外|はず}し・{無視|むし}）" }, { id:"c", text:"スマホの不具合", elText:"スマホの{不具合|ふぐあい}" }],
    correct: "b",
    explanation: "グループ外しと集団無視は立派なネットいじめ。24時間逃げ場がなく、精神的ダメージが大きい。一人で抱え込まず大人に相談を。",
    parentNote: "子どもがスマホを頻繁に確認したり、食事中に元気がない様子の時はLINEグループの状況を確認してみましょう。",
    elQuestion: "クラスのグループから{突然|とつぜん}{退出|たいしゅつ}させられた。{既読|きどく}がついても{返信|へんしん}が{来|こ}なくなった。これは{何|なん}と{呼|よ}ばれる{行為|こうい}？",
    elExplanation: "グループ{外|はず}しと{集団|しゅうだん}{無視|むし}は{立派|りっぱ}なネットいじめ。24{時間|じかん}{逃|に}げ{場|ば}がなく、{精神的|せいしんてき}ダメージが{大|おお}きい。{一人|ひとり}で{抱|かか}え{込|こ}まず{大人|おとな}に{相談|そうだん}を。",
  },
  {
    id: "s10", week: null, theme: "ネットいじめ", emoji: "📸", color: "#ec4899",
    unsplashQuery: "screenshot phone sharing privacy",
    question: "友達の失敗した写真を「笑えるから見て」とグループでシェアした。これは問題ある？",
    choices: [{ id:"a", text:"みんなで楽しめるので問題ない", elText:"みんなで{楽|たの}しめるので{問題|もんだい}ない" }, { id:"b", text:"本人の同意なく写真を拡散することは名誉毀損・プライバシー侵害になりうる", elText:"{本人|ほんにん}の{同意|どうい}なく{写真|しゃしん}を{拡散|かくさん}することは{名誉|めいよ}{毀損|きそん}・プライバシー{侵害|しんがい}になりうる" }, { id:"c", text:"悪意がなければ問題ない", elText:"{悪意|あくい}がなければ{問題|もんだい}ない" }],
    correct: "b",
    explanation: "「笑える」と思ってのシェアも、本人が傷つけばいじめになる。意図に関係なく結果として相手が傷つく行為は問題。",
    parentNote: "「悪意がなければOK」という認識は危険。子どもにとってネットでの行動の影響の大きさを具体的に伝えましょう。",
    elQuestion: "{友達|ともだち}の{失敗|しっぱい}した{写真|しゃしん}を「{笑|わら}えるから{見|み}て」とグループでシェアした。これは{問題|もんだい}ある？",
    elExplanation: "「{笑|わら}える」と{思|おも}ってのシェアも、{本人|ほんにん}が{傷|きず}つけばいじめになる。{意図|いと}に{関係|かんけい}なく{結果|けっか}として{相手|あいて}が{傷|きず}つく{行為|こうい}は{問題|もんだい}。",
  },
  // フィッシング
  {
    id: "s11", week: null, theme: "フィッシング", emoji: "🎣", color: "#06b6d4",
    unsplashQuery: "phishing email scam computer",
    question: "「PayPayポイントが失効します。今すぐ確認を」というSMSのURLをタップしたら、IDとパスワードの入力画面が出た。どうする？",
    choices: [{ id:"a", text:"急いで入力する", elText:"{急|いそ}いで{入力|にゅうりょく}する" }, { id:"b", text:"入力せず閉じて、PayPayアプリを直接開いて確認する", elText:"{入力|にゅうりょく}せず{閉|と}じて、PayPayアプリを{直接|ちょくせつ}{開|ひら}いて{確認|かくにん}する" }, { id:"c", text:"パスワードだけ入力する", elText:"パスワードだけ{入力|にゅうりょく}する" }],
    correct: "b",
    explanation: "SMSのURLは絶対に踏まない。公式アプリで直接確認。ポイント失効の緊急感はフィッシングの典型的な手口。",
    parentNote: "ETC、宅配便、銀行、PayPayをかたるスミッシングが急増中。家族全員に「SMSのURLは踏まない」を徹底しましょう。",
    elQuestion: "「PayPayポイントが{失効|しっこう}します。{今|いま}すぐ{確認|かくにん}を」というSMSのURLをタップしたら、IDとパスワードの{入力|にゅうりょく}{画面|がめん}が{出|で}た。どうする？",
    elExplanation: "SMSのURLは{絶対|ぜったい}に{踏|ふ}まない。{公式|こうしき}アプリで{直接|ちょくせつ}{確認|かくにん}。ポイント{失効|しっこう}の{緊急感|きんきゅうかん}はフィッシングの{典型的|てんけいてき}な{手口|てぐち}。",
  },
  {
    id: "s12", week: null, theme: "フィッシング", emoji: "🌐", color: "#06b6d4",
    unsplashQuery: "fake website URL domain address bar",
    question: "「amazon-jp-secure.com/login」というURLのページ。本物のAmazonのサイト？",
    choices: [{ id:"a", text:"amazon と書いてあるので本物", elText:"amazon と{書|か}いてあるので{本物|ほんもの}" }, { id:"b", text:"偽物。本物のAmazonのドメインは「amazon.co.jp」のみ", elText:"{偽物|にせもの}。{本物|ほんもの}のAmazonのドメインは「amazon.co.jp」のみ" }, { id:"c", text:"https があれば安全", elText:"https があれば{安全|あんぜん}" }],
    correct: "b",
    explanation: "ドメインの一番右の部分が本物かどうかの基準。「amazon-jp-secure.com」の本体は「com」であり、Amazonとは無関係のサイト。",
    parentNote: "URLの読み方を家族で練習しましょう。「.co.jp」「.ne.jp」の前に来る単語が本物かどうか確認する習慣を。",
    elQuestion: "「amazon-jp-secure.com/login」というURLのページ。{本物|ほんもの}のAmazonのサイト？",
    elExplanation: "ドメインの{一番|いちばん}{右|みぎ}の{部分|ぶぶん}が{本物|ほんもの}かどうかの{基準|きじゅん}。「amazon-jp-secure.com」の{本体|ほんたい}は「com」であり、Amazonとは{無関係|むかんけい}のサイト。",
  },
  // 自画撮り・グルーミング
  {
    id: "s13", week: null, theme: "グルーミング", emoji: "🕸️", color: "#f43f5e",
    unsplashQuery: "online gaming chat anonymous stranger",
    question: "オンラインゲームで知り合った「同い年の子」に「もっと仲良くなりたいからLINE教えて」と言われた。どうする？",
    choices: [{ id:"a", text:"ゲームの中だけで良い友達だから教える", elText:"ゲームの{中|なか}だけで{良|い}い{友達|ともだち}だから{教|おし}える" }, { id:"b", text:"断る。ゲーム外で連絡先を交換する必要はない", elText:"{断|ことわ}る。ゲーム{外|そと}で{連絡先|れんらくさき}を{交換|こうかん}する{必要|ひつよう}はない" }, { id:"c", text:"ニックネームだけ教える", elText:"ニックネームだけ{教|おし}える" }],
    correct: "b",
    explanation: "「同い年」は証明できない。ゲーム→LINE→電話と段階的に親密化させるのがグルーミングの典型的な手口。最初のLINE交換を断ることが最大の防御。",
    parentNote: "子どものゲームアプリのチャット設定を一緒に確認しましょう。「知らない人とのチャットをオフ」にできるものが多い。",
    elQuestion: "オンラインゲームで{知|し}り{合|あ}った「{同|おな}い{年|とし}の{子|こ}」に「もっと{仲良|なかよ}くなりたいからLINE{教|おし}えて」と{言|い}われた。どうする？",
    elExplanation: "「{同|おな}い{年|とし}」は{証明|しょうめい}できない。ゲーム→LINE→{電話|でんわ}と{段階的|だんかいてき}に{親密|しんみつ}化させるのがグルーミングの{典型的|てんけいてき}な{手口|てぐち}。{最初|さいしょ}のLINE{交換|こうかん}を{断|ことわ}ることが{最大|さいだい}の{防御|ぼうぎょ}。",
  },
  {
    id: "s14", week: null, theme: "グルーミング", emoji: "🎁", color: "#f43f5e",
    unsplashQuery: "gift present online shopping suspicious",
    question: "SNSで知り合った人から「ゲームのアイテムをプレゼントする」と言われた。もらっていい？",
    choices: [{ id:"a", text:"無料なので感謝してもらう", elText:"{無料|むりょう}なので{感謝|かんしゃ}してもらう" }, { id:"b", text:"断る。プレゼントは心理的な「借り」を作る手口", elText:"{断|ことわ}る。プレゼントは{心理的|しんりてき}な「{借|か}り」を{作|つく}る{手口|てぐち}" }, { id:"c", text:"少し話してから判断する", elText:"少し{話|はな}してから{判断|はんだん}する" }],
    correct: "b",
    explanation: "「もらったから返さなければ」という心理を利用して、要求をエスカレートさせる手口。オンラインでの見知らぬ人からのプレゼントは断る。",
    parentNote: "「タダでものをくれる人は危険かもしれない」をゲームの世界でも教えましょう。現実と同じルールが適用されます。",
    elQuestion: "SNSで{知|し}り{合|あ}った{人|ひと}から「ゲームのアイテムをプレゼントする」と{言|い}われた。もらっていい？",
    elExplanation: "「もらったから{返|かえ}さなければ」という{心理|しんり}を{利用|りよう}して、{要求|ようきゅう}をエスカレートさせる{手口|てぐち}。オンラインでの{見知|みし}らぬ{人|ひと}からのプレゼントは{断|ことわ}る。",
  },
  // 生成AI
  {
    id: "s15", week: null, theme: "生成AI詐欺", emoji: "🤖", color: "#8b5cf6",
    unsplashQuery: "artificial intelligence deepfake technology",
    question: "著名な投資家の声にそっくりなAI音声で「この株を買え」とアドバイスする電話が来た。信じていい？",
    choices: [{ id:"a", text:"声が本物そっくりなので信頼できる", elText:"{声|こえ}が{本物|ほんもの}そっくりなので{信頼|しんらい}できる" }, { id:"b", text:"AI音声クローンの可能性が高い詐欺。公式情報源で確認する", elText:"AI{音声|おんせい}クローンの{可能性|かのうせい}が{高|たか}い{詐欺|さぎ}。{公式|こうしき}{情報源|じょうほうげん}で{確認|かくにん}する" }, { id:"c", text:"少額なら試してみる", elText:"{少額|しょうがく}なら{試|ため}してみる" }],
    correct: "b",
    explanation: "声のクローニング技術で本人そっくりの声を作れる時代。「声だから本物」は通用しない。著名人が電話で投資を勧めることは絶対にない。",
    parentNote: "2024〜2025年、著名人の音声・動画を使った投資詐欺が急増。高齢の親族への注意喚起も大切です。",
    elQuestion: "{著名|ちょめい}な{投資家|とうしか}の{声|こえ}にそっくりなAI{音声|おんせい}で「この{株|かぶ}を{買|か}え」とアドバイスする{電話|でんわ}が{来|き}た。{信|しん}じていい？",
    elExplanation: "{声|こえ}のクローニング{技術|ぎじゅつ}で{本人|ほんにん}そっくりの{声|こえ}を{作|つく}れる{時代|じだい}。「{声|こえ}だから{本物|ほんもの}」は{通用|つうよう}しない。{著名人|ちょめいじん}が{電話|でんわ}で{投資|とうし}を{勧|すす}めることは{絶対|ぜったい}にない。",
  },
  {
    id: "s16", week: null, theme: "生成AI詐欺", emoji: "📸", color: "#8b5cf6",
    unsplashQuery: "fake image manipulation photo editing",
    question: "SNSで「昨日の夕方に○○駅近くで爆発事故があった」という写真付き投稿を見た。確認する方法は？",
    choices: [{ id:"a", text:"リツイート数が多いから信頼する", elText:"リツイート{数|すう}が{多|おお}いから{信頼|しんらい}する" }, { id:"b", text:"Googleレンズで画像を逆検索して同じ画像が過去に使われていないか確認する", elText:"Googleレンズで{画像|がぞう}を{逆検索|ぎゃくけんさく}して{同|おな}じ{画像|がぞう}が{過去|かこ}に{使|つか}われていないか{確認|かくにん}する" }, { id:"c", text:"地元の友達に聞く", elText:"{地元|じもと}の{友達|ともだち}に{聞|き}く" }],
    correct: "b",
    explanation: "AI生成や過去の事故の写真を使ったデマが多い。Googleレンズ→画像を検索で同じ写真がいつどこで使われたか調べられる。",
    parentNote: "Googleレンズによる画像の逆検索は中学生でも使える強力なファクトチェックツール。家族で練習してみましょう。",
    elQuestion: "SNSで「{昨日|きのう}の{夕方|ゆうがた}に○○{駅|えき}{近|ちか}くで{爆発|ばくはつ}{事故|じこ}があった」という{写真|しゃしん}{付|つ}き{投稿|とうこう}を{見|み}た。{確認|かくにん}する{方法|ほうほう}は？",
    elExplanation: "AI{生成|せいせい}や{過去|かこ}の{事故|じこ}の{写真|しゃしん}を{使|つか}ったデマが{多|おお}い。Googleレンズ→{画像|がぞう}を{検索|けんさく}で{同|おな}じ{写真|しゃしん}がいつどこで{使|つか}われたか{調|しら}べられる。",
  },
  // 著作権・モラル
  {
    id: "s17", week: null, theme: "著作権", emoji: "©️", color: "#f59e0b",
    unsplashQuery: "copyright law digital content creator",
    question: "好きなアーティストの曲をBGMにした動画をYouTubeに投稿したい。問題ある？",
    choices: [{ id:"a", text:"好きだから応援になる。問題ない", elText:"{好|す}きだから{応援|おうえん}になる。{問題|もんだい}ない" }, { id:"b", text:"著作権者の許可なく使うと著作権侵害になる", elText:"{著作権者|ちょさくけんしゃ}の{許可|きょか}なく{使|つか}うと{著作権|ちょさくけん}{侵害|しんがい}になる" }, { id:"c", text:"短いクリップなら問題ない", elText:"{短|みじか}いクリップなら{問題|もんだい}ない" }],
    correct: "b",
    explanation: "音楽には著作権がある。許可なく使うと動画が削除されるだけでなく、収益化停止・アカウント凍結のリスクも。YouTube Studioで著作権フリー音楽を使おう。",
    parentNote: "「好きだから」という動機でも著作権侵害は著作権侵害。子どものSNS・動画投稿を一緒に確認する習慣を作りましょう。",
    elQuestion: "{好|す}きなアーティストの{曲|きょく}をBGMにした{動画|どうが}をYouTubeに{投稿|とうこう}したい。{問題|もんだい}ある？",
    elExplanation: "{音楽|おんがく}には{著作権|ちょさくけん}がある。{許可|きょか}なく{使|つか}うと{動画|どうが}が{削除|さくじょ}されるだけでなく、{収益化|しゅうえきか}{停止|ていし}・アカウント{凍結|とうけつ}のリスクも。YouTube Studioで{著作権|ちょさくけん}フリー{音楽|おんがく}を{使|つか}おう。",
  },
  {
    id: "s18", week: null, theme: "デジタルモラル", emoji: "💭", color: "#f59e0b",
    unsplashQuery: "social media comment cyberbullying keyboard",
    question: "ゲームで負けた腹いせにそのゲームの公式Xに「運営は無能」と投稿した。これは問題ある？",
    choices: [{ id:"a", text:"感想を述べる権利があるので問題ない", elText:"{感想|かんそう}を{述|の}べる{権利|けんり}があるので{問題|もんだい}ない" }, { id:"b", text:"内容によっては名誉毀損・業務妨害になりうる", elText:"{内容|ないよう}によっては{名誉毀損|めいよきそん}・{業務|ぎょうむ}{妨害|ぼうがい}になりうる" }, { id:"c", text:"匿名だから特定されない", elText:"{匿名|とくめい}だから{特定|とくてい}されない" }],
    correct: "b",
    explanation: "ネット上の投稿は匿名でも特定できる。怒りにまかせた投稿は後から自分に返ってくる。投稿前に「これを相手に面と向かって言えるか」を考えよう。",
    parentNote: "「匿名だから安全」という誤解を解くことが重要。IPアドレスや投稿データから特定される事例は年々増えています。",
    elQuestion: "ゲームで{負|ま}けた{腹|はら}いせにそのゲームの{公式|こうしき}Xに「{運営|うんえい}は{無能|むのう}」と{投稿|とうこう}した。これは{問題|もんだい}ある？",
    elExplanation: "ネット{上|じょう}の{投稿|とうこう}は{匿名|とくめい}でも{特定|とくてい}できる。{怒|いか}りにまかせた{投稿|とうこう}は{後|あと}から{自分|じぶん}に{返|かえ}ってくる。{投稿|とうこう}{前|まえ}に「これを{相手|あいて}に{面|おも}と{向|む}かって{言|い}えるか」を{考|かんが}えよう。",
  },
  // SNS依存
  {
    id: "s19", week: null, theme: "SNS依存", emoji: "📱", color: "#10b981",
    unsplashQuery: "smartphone addiction teenager sleep",
    question: "夜中の2時まで動画を見続けてしまった。これが続くとどうなる？",
    choices: [{ id:"a", text:"特に問題ない", elText:"{特|とく}に{問題|もんだい}ない" }, { id:"b", text:"睡眠不足→集中力低下→成績・メンタルに悪影響。ブルーライトが睡眠ホルモンを抑制する", elText:"{睡眠不足|すいみんぶそく}→{集中力|しゅうちゅうりょく}{低下|ていか}→{成績|せいせき}・メンタルに{悪影響|あくえいきょう}。ブルーライトが{睡眠|すいみん}ホルモンを{抑制|よくせい}する" }, { id:"c", text:"休日だけなら問題ない", elText:"{休日|きゅうじつ}だけなら{問題|もんだい}ない" }],
    correct: "b",
    explanation: "SNS・動画アプリは意図的に「もっと見たい」と思わせる設計。成長期の睡眠不足は脳の発達に影響する。就寝1時間前はスマホ禁止ルールが効果的。",
    parentNote: "スクリーンタイム機能でアプリの使用時間を確認しましょう。iOS: 設定→スクリーンタイム / Android: デジタルウェルビーイング。",
    elQuestion: "{夜中|よなか}の2{時|じ}まで{動画|どうが}を{見|み}続けてしまった。これが{続|つづ}くとどうなる？",
    elExplanation: "SNS・{動画|どうが}アプリは{意図的|いとてき}に「もっと{見|み}たい」と{思|おも}わせる{設計|せっけい}。{成長|せいちょう}{期|き}の{睡眠不足|すいみんぶそく}は{脳|のう}の{発達|はったつ}に{影響|えいきょう}する。{就寝|しゅうしん}1{時間|じかん}{前|まえ}はスマホ{禁止|きんし}ルールが{効果的|こうかてき}。",
  },
  {
    id: "s20", week: null, theme: "SNS依存", emoji: "💔", color: "#10b981",
    unsplashQuery: "social media likes comparison anxiety",
    question: "インスタに投稿したら「いいね」が少なかった。すごく落ち込んでいる。どう考えればいい？",
    choices: [{ id:"a", text:"いいねが全て。投稿を消すべき", elText:"いいねが{全|すべ}て。{投稿|とうこう}を{消|け}すべき" }, { id:"b", text:"いいねはアルゴリズムで決まる部分が大きく、自分の価値とは無関係", elText:"いいねはアルゴリズムで{決|き}まる{部分|ぶぶん}が{大|おお}きく、{自分|じぶん}の{価値|かち}とは{無関係|むかんけい}" }, { id:"c", text:"もっとバズる投稿をすれば解決", elText:"もっとバズる{投稿|とうこう}をすれば{解決|かいけつ}" }],
    correct: "b",
    explanation: "SNSのいいね数は自分の価値ではない。アルゴリズム・投稿時間・ハッシュタグなどで大きく変わる。オフラインでの充実した体験の方が大切。",
    parentNote: "承認欲求とSNSの関係について話し合うのに良い機会。「いいねが少なくても自分の価値は変わらない」を繰り返し伝えましょう。",
    elQuestion: "インスタに{投稿|とうこう}したら「いいね」が{少|すく}なかった。すごく{落|お}ち{込|こ}んでいる。どう{考|かんが}えればいい？",
    elExplanation: "SNSのいいね{数|すう}は{自分|じぶん}の{価値|かち}ではない。アルゴリズム・{投稿|とうこう}{時間|じかん}・ハッシュタグなどで{大|おお}きく{変|か}わる。オフラインでの{充実|じゅうじつ}した{体験|たいけん}の{方|ほう}が{大切|たいせつ}。",
  },
  // 追加問題
  {
    id: "s21", week: null, theme: "個人情報", emoji: "🔍", color: "#ffa940",
    unsplashQuery: "search engine privacy data tracking",
    question: "スマホアプリをインストールする時「位置情報・連絡先・カメラ全てへのアクセスを許可」と求められた。どうする？",
    choices: [{ id:"a", text:"使いたいから全て許可する", elText:"{使|つか}いたいから{全|すべ}て{許可|きょか}する" }, { id:"b", text:"アプリの機能に本当に必要なものだけ許可し、不要なアクセスは拒否する", elText:"アプリの{機能|きのう}に{本当|ほんとう}に{必要|ひつよう}なものだけ{許可|きょか}し、{不要|ふよう}なアクセスは{拒否|きょひ}する" }, { id:"c", text:"インストールをやめる" }],
    correct: "b",
    explanation: "ゲームアプリが「連絡先へのアクセス」を求めるのはおかしい。最小限の権限だけ与えるのが原則。後から設定→プライバシーで変更できる。",
    parentNote: "子どもがインストールしているアプリのアクセス権限を一緒に確認しましょう。不要な権限は削除できます。",
    elQuestion: "スマホアプリをインストールする{時|とき}「{位置情報|いちじょうほう}・{連絡先|れんらくさき}・カメラ{全|すべ}てへのアクセスを{許可|きょか}」と{求|もと}められた。どうする？",
    elExplanation: "ゲームアプリが「{連絡先|れんらくさき}へのアクセス」を{求|もと}めるのはおかしい。{最小限|さいしょうげん}の{権限|けんげん}だけ{与|あた}えるのが{原則|げんそく}。{後|あと}から{設定|せってい}→プライバシーで{変更|へんこう}できる。",
  },
  {
    id: "s22", week: null, theme: "フィッシング", emoji: "📧", color: "#06b6d4",
    unsplashQuery: "email phishing scam security",
    question: "「お荷物をお届けできませんでした。こちらから再配達の手続きを」というSMSが来た。URLをタップしていい？",
    choices: [{ id:"a", text:"不在通知なのでタップする", elText:"{不在|ふざい}{通知|つうち}なのでタップする" }, { id:"b", text:"タップせず、宅配会社の公式アプリか公式サイトで直接確認する", elText:"タップせず、{宅配|たくはい}{会社|かいしゃ}の{公式|こうしき}アプリか{公式|こうしき}サイトで{直接|ちょくせつ}{確認|かくにん}する" }, { id:"c", text:"電話番号に折り返す", elText:"{電話番号|でんわばんごう}に{折|お}り{返|かえ}す" }],
    correct: "b",
    explanation: "宅配をかたるスミッシング（SMS詐欺）は日本で最も多い手口の一つ。本物の宅配会社はSMSでURLを送ってこない。",
    parentNote: "宅配SMSのURLを踏んだだけでマルウェアに感染するケースも。「SMSのURLは踏まない」を家族全員の鉄則にしましょう。",
    elQuestion: "「お{荷物|にもつ}をお{届|とど}けできませんでした。こちらから{再配達|さいはいたつ}の{手続|てつづ}きを」というSMSが{来|き}た。URLをタップしていい？",
    elExplanation: "{宅配|たくはい}をかたるスミッシング（SMS{詐欺|さぎ}）は{日本|にほん}で{最|もっと}も{多|おお}い{手口|てぐち}の{一|ひと}つ。{本物|ほんもの}の{宅配|たくはい}{会社|かいしゃ}はSMSでURLを{送|おく}ってこない。",
  },
  {
    id: "s23", week: null, theme: "デジタルモラル", emoji: "🎮", color: "#f59e0b",
    unsplashQuery: "online gaming teamwork cooperation",
    question: "オンラインゲームで負けてチームメイトに「お前のせいで負けた、下手くそ」と送った。何が問題？",
    choices: [{ id:"a", text:"正直な感想なので問題ない", elText:"{正直|しょうじき}な{感想|かんそう}なので{問題|もんだい}ない" }, { id:"b", text:"相手も人間。言葉の暴力はリアルと同じダメージを与え、ハラスメントになりうる", elText:"{相手|あいて}も{人間|にんげん}。{言葉|ことば}の{暴力|ぼうりょく}はリアルと{同|おな}じダメージを{与|あた}え、ハラスメントになりうる" }, { id:"c", text:"ゲーム内なので現実と関係ない", elText:"ゲーム{内|ない}なので{現実|げんじつ}と{関係|かんけい}ない" }],
    correct: "b",
    explanation: "画面の向こうには本物の人間がいる。ゲーム内の暴言で心が傷つく人は多い。「アカウント凍結」だけでなく、相手を傷つけたことの責任も考えよう。",
    parentNote: "子どもがゲーム中に暴言を吐いていないか時々確認を。また、被害を受けている場合も話しやすい関係を作っておきましょう。",
    elQuestion: "オンラインゲームで{負|ま}けてチームメイトに「お{前|まえ}のせいで{負|ま}けた、{下手|へた}くそ」と{送|おく}った。{何|なに}が{問題|もんだい}？",
    elExplanation: "{画面|がめん}の{向|む}こうには{本物|ほんもの}の{人間|にんげん}がいる。ゲーム{内|ない}の{暴言|ぼうげん}で{心|こころ}が{傷|きず}つく{人|ひと}は{多|おお}い。「アカウント{凍結|とうけつ}」だけでなく、{相手|あいて}を{傷|きず}つけたことの{責任|せきにん}も{考|かんが}えよう。",
  },
  {
    id: "s24", week: null, theme: "生成AI詐欺", emoji: "🤖", color: "#8b5cf6",
    unsplashQuery: "AI chatbot conversation digital",
    question: "ChatGPTなどのAIに「本名、住所、学校名を教えて相談にのってほしい」と入力した。問題ある？",
    choices: [{ id:"a", text:"AIだから安全。問題ない", elText:"AIだから{安全|あんぜん}。{問題|もんだい}ない" }, { id:"b", text:"入力した情報はAIの学習に使われる可能性がある。個人情報は入力しない", elText:"{入力|にゅうりょく}した{情報|じょうほう}はAIの{学習|がくしゅう}に{使|つか}われる{可能性|かのうせい}がある。{個人情報|こじんじょうほう}は{入力|にゅうりょく}しない" }, { id:"c", text:"相談内容による", elText:"{相談|そうだん}{内容|ないよう}による" }],
    correct: "b",
    explanation: "AIへの入力データは運営企業のサーバーに保存され、サービス改善などに使われる可能性がある。本名・住所・学校名などの個人情報はAIに教えない。",
    parentNote: "子どもがAIチャットを使う際のルールを決めておきましょう。「個人情報は入力しない」「学校の課題をそのまま出力しない」など。",
    elQuestion: "ChatGPTなどのAIに「{本名|ほんみょう}、{住所|じゅうしょ}、{学校|がっこう}{名|めい}を{教|おし}えて{相談|そうだん}にのってほしい」と{入力|にゅうりょく}した。{問題|もんだい}ある？",
    elExplanation: "AIへの{入力|にゅうりょく}データは{運営|うんえい}{企業|きぎょう}のサーバーに{保存|ほぞん}され、サービス{改善|かいぜん}などに{使|つか}われる{可能性|かのうせい}がある。{本名|ほんみょう}・{住所|じゅうしょ}・{学校|がっこう}{名|めい}などの{個人情報|こじんじょうほう}はAIに{教|おし}えない。",
  },
  {
    id: "s25", week: null, theme: "なりすまし", emoji: "🔐", color: "#0ea5e9",
    unsplashQuery: "password security lock digital",
    question: "複数のサービスに同じパスワードを使っている。どんなリスクがある？",
    choices: [{ id:"a", text:"1つがバレても他は安全", elText:"1つがバレても{他|ほか}は{安全|あんぜん}" }, { id:"b", text:"1つのサービスからパスワードが漏れると、全サービスに不正アクセスされる「パスワードリスト攻撃」の被害に遭う", elText:"1つのサービスからパスワードが{漏|も}れると、{全|ぜん}サービスに{不正|ふせい}アクセスされる「パスワードリスト{攻撃|こうげき}」の{被害|ひがい}に{遭|あ}う" }, { id:"c", text:"覚えやすいので問題ない", elText:"{覚|おぼ}えやすいので{問題|もんだい}ない" }],
    correct: "b",
    explanation: "パスワードリスト攻撃は最も多いサイバー攻撃の一つ。サービスごとに違うパスワードを使い、パスワードマネージャーで管理するのが最善。",
    parentNote: "家族で使っているサービスのパスワードを見直してみましょう。ICloud/Google キーチェーンなどのパスワードマネージャーが便利です。",
    elQuestion: "{複数|ふくすう}のサービスに{同|おな}じパスワードを{使|つか}っている。どんなリスクがある？",
    elExplanation: "パスワードリスト{攻撃|こうげき}は{最|もっと}も{多|おお}いサイバー{攻撃|こうげき}の{一|ひと}つ。サービスごとに{違|ちが}うパスワードを{使|つか}い、パスワードマネージャーで{管理|かんり}するのが{最善|さいぜん}。",
  },
  {
    id: "s26", week: null, theme: "フェイクニュース", emoji: "📊", color: "#7c3aed",
    unsplashQuery: "statistics data graph chart manipulation",
    question: "「○○を食べると頭が良くなる！研究で証明！」という記事を見た。何を確認すべき？",
    choices: [{ id:"a", text:"有名なサイトに載っているので信頼する", elText:"{有名|ゆうめい}なサイトに{載|の}っているので{信頼|しんらい}する" }, { id:"b", text:"研究機関・掲載誌・サンプル数・査読の有無を確認する", elText:"{研究|けんきゅう}{機関|きかん}・{掲載誌|けいさいし}・サンプル{数|すう}・{査読|さどく}の{有無|うむ}を{確認|かくにん}する" }, { id:"c", text:"「証明」という言葉があるので信頼する", elText:"「{証明|しょうめい}」という{言葉|ことば}があるので{信頼|しんらい}する" }],
    correct: "b",
    explanation: "「研究で証明」「専門家が認めた」は科学的根拠のないニセ情報でよく使われる言葉。誰がどこで発表した研究かを確認することが大切。",
    parentNote: "健康・食・教育に関するSNS上のニセ情報は特に多い。「研究で証明」を鵜呑みにしない習慣を家族で共有しましょう。",
    elQuestion: "「○○を{食|た}べると{頭|あたま}が{良|よ}くなる！{研究|けんきゅう}で{証明|しょうめい}！」という{記事|きじ}を{見|み}た。{何|なに}を{確認|かくにん}すべき？",
    elExplanation: "「{研究|けんきゅう}で{証明|しょうめい}」「{専門家|せんもんか}が{認|みと}めた」は{科学的|かがくてき}{根拠|こんきょ}のないニセ{情報|じょうほう}でよく{使|つか}われる{言葉|ことば}。{誰|だれ}がどこで{発表|はっぴょう}した{研究|けんきゅう}かを{確認|かくにん}することが{大切|たいせつ}。",
  },
  {
    id: "s27", week: null, theme: "個人情報", emoji: "🗑️", color: "#ffa940",
    unsplashQuery: "delete data privacy digital clean",
    question: "不要になったスマホを売る前に「初期化」した。個人データは完全に消えた？",
    choices: [{ id:"a", text:"初期化したので全て消えた", elText:"{初期化|しょきか}したので{全|すべ}て{消|き}えた" }, { id:"b", text:"完全には消えていない場合がある。専用の消去ソフトや物理破壊が確実", elText:"{完全|かんぜん}には{消|き}えていない{場合|ばあい}がある。{専用|せんよう}の{消去|しょうきょ}ソフトや{物理|ぶつり}{破壊|はかい}が{確実|かくじつ}" }, { id:"c", text:"SNSのアプリを削除したので問題ない", elText:"SNSのアプリを{削除|さくじょ}したので{問題|もんだい}ない" }],
    correct: "b",
    explanation: "通常の初期化では復元可能なデータが残る場合がある。iPhoneはiOS 15以降で「全コンテンツと設定を消去」が安全。Androidはメーカーによって異なる。",
    parentNote: "スマホを下取り・売却する前に必ずデータを完全消去しましょう。特に子どもの写真が入っている場合は要注意です。",
    elQuestion: "{不要|ふよう}になったスマホを{売|う}る{前|まえ}に「{初期化|しょきか}」した。{個人|こじん}データは{完全|かんぜん}に{消|き}えた？",
    elExplanation: "{通常|つうじょう}の{初期化|しょきか}では{復元|ふくげん}{可能|かのう}なデータが{残|のこ}る{場合|ばあい}がある。iPhoneはiOS 15{以降|いこう}で「{全|ぜん}コンテンツと{設定|せってい}を{消去|しょうきょ}」が{安全|あんぜん}。Androidはメーカーによって{異|こと}なる。",
  },
  {
    id: "s28", week: null, theme: "ネットいじめ", emoji: "🆘", color: "#ec4899",
    unsplashQuery: "help support mental health teenager",
    question: "友達がSNSでひどく中傷されているのを発見した。どうするのが最善？",
    choices: [{ id:"a", text:"コメントで犯人を攻撃する", elText:"コメントで{犯人|はんにん}を{攻撃|こうげき}する" }, { id:"b", text:"投稿を報告・スクショ保存し、友達に声をかけ、信頼できる大人に伝える", elText:"{投稿|とうこう}を{報告|ほうこく}・スクショ{保存|ほぞん}し、{友達|ともだち}に{声|こえ}をかけ、{信頼|しんらい}できる{大人|おとな}に{伝|つた}える" }, { id:"c", text:"関わらないようにする", elText:"{関|かか}わらないようにする" }],
    correct: "b",
    explanation: "炎上への参加は状況を悪化させる。まず証拠保存（スクショ）→プラットフォームへの報告→本人へのサポート→大人への相談が正しい手順。",
    parentNote: "子どもが「見て見ぬふり」をしてしまうのは傍観者効果。「大人に伝えることは正しいこと」と繰り返し教えましょう。",
    elQuestion: "{友達|ともだち}がSNSでひどく{中傷|ちゅうしょう}されているのを{発見|はっけん}した。どうするのが{最善|さいぜん}？",
    elExplanation: "{炎上|えんじょう}への{参加|さんか}は{状況|じょうきょう}を{悪化|あっか}させる。まず{証拠|しょうこ}{保存|ほぞん}（スクショ）→プラットフォームへの{報告|ほうこく}→{本人|ほんにん}へのサポート→{大人|おとな}への{相談|そうだん}が{正|ただ}しい{手順|てじゅん}。",
  },
  {
    id: "s29", week: null, theme: "著作権", emoji: "🎵", color: "#f59e0b",
    unsplashQuery: "music streaming copyright license",
    question: "YouTubeで見つけた動画のBGMが気に入った。ダウンロードして自分の動画に使いたい。いい？",
    choices: [{ id:"a", text:"YouTubeにあるので誰でも使える", elText:"YouTubeにあるので{誰|だれ}でも{使|つか}える" }, { id:"b", text:"著作権者の許可なく使用すると著作権侵害になる", elText:"{著作権者|ちょさくけんしゃ}の{許可|きょか}なく{使用|しよう}すると{著作権|ちょさくけん}{侵害|しんがい}になる" }, { id:"c", text:"商業目的でなければ大丈夫", elText:"{商業|しょうぎょう}{目的|もくてき}でなければ{大丈夫|だいじょうぶ}" }],
    correct: "b",
    explanation: "YouTubeにある動画・音楽にも著作権がある。「Creative Commons」ライセンスのものや「YouTube Audio Library」の音楽は自由に使える場合が多い。",
    parentNote: "子どもが動画制作を楽しんでいる場合、著作権フリーの素材サイトを一緒に探してみましょう。Pixabay、Pexels、YouTube Audio Libraryなどが便利。",
    elQuestion: "YouTubeで{見|み}つけた{動画|どうが}のBGMが{気|き}に{入|い}った。ダウンロードして{自分|じぶん}の{動画|どうが}に{使|つか}いたい。いい？",
    elExplanation: "YouTubeにある{動画|どうが}・{音楽|おんがく}にも{著作権|ちょさくけん}がある。「Creative Commons」ライセンスのものや「YouTube Audio Library」の{音楽|おんがく}は{自由|じゆう}に{使|つか}える{場合|ばあい}が{多|おお}い。",
  },
  {
    id: "s30", week: null, theme: "SNS依存", emoji: "🧠", color: "#10b981",
    unsplashQuery: "brain dopamine reward social media",
    question: "「いいね」や新着通知が気になって、授業中もスマホが気になる。これはなぜ？",
    choices: [{ id:"a", text:"意志が弱いだけ", elText:"{意志|いし}が{弱|よわ}いだけ" }, { id:"b", text:"SNSはドーパミンを利用して「もっと見たい」と思わせるよう設計されている", elText:"SNSはドーパミンを{利用|りよう}して「もっと{見|み}たい」と{思|おも}わせるよう{設計|せっけい}されている" }, { id:"c", text:"スマホ依存症という病気", elText:"スマホ{依存症|いぞんしょう}という{病気|びょうき}" }],
    correct: "b",
    explanation: "SNSはギャンブルと同じ「可変報酬」の仕組みを使い、脳を依存させる。意志の問題ではなく設計の問題。通知をオフにするだけで集中力が大幅に改善する。",
    parentNote: "スマホ依存は意志の弱さではなく設計上の問題。「授業中は電源オフ・通知オフ」など具体的なルールを一緒に決めましょう。",
    elQuestion: "「いいね」や{新着|しんちゃく}{通知|つうち}が{気|き}になって、{授業中|じゅぎょうちゅう}もスマホが{気|き}になる。これはなぜ？",
    elExplanation: "SNSはギャンブルと{同|おな}じ「{可変|かへん}{報酬|ほうしゅう}」の{仕組|しく}みを{使|つか}い、{脳|のう}を{依存|いぞん}させる。{意志|いし}の{問題|もんだい}ではなく{設計|せっけい}の{問題|もんだい}。{通知|つうち}をオフにするだけで{集中力|しゅうちゅうりょく}が{大幅|おおはば}に{改善|かいぜん}する。",
  },
];

// Unsplash画像取得（無料API）
// Unsplash APIは使用しない（削除済み）
// EP1の画像はlocalImage（固定パス）で管理

// 週のインデックスからストック問題を選ぶ（週ごとに違う問題）
function getStockQuestionsForWeek(weekStr) {
  const weekNum = parseInt(weekStr.split("-W")[1]) || 1;
  const startIdx = ((weekNum - 1) * 3) % CHALLENGE_STOCK.length;
  const questions = [];
  for (let i = 0; i < 3; i++) {
    questions.push(CHALLENGE_STOCK[(startIdx + i) % CHALLENGE_STOCK.length]);
  }
  return questions;
}

// Claude APIで追加問題を生成
async function generateChallengeQuestion(theme) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: `SNSリテラシー教育アプリ「マモル」向けの週次チャレンジ問題を1問生成してください。テーマ：${theme}

以下のJSON形式で返してください（JSONのみ、説明不要）：
{
  "question": "問題文（具体的なシナリオ形式で、中学生向け）",
  "choices": [
    {"id": "a", "text": "選択肢A"},
    {"id": "b", "text": "選択肢B"},
    {"id": "c", "text": "選択肢C"}
  ],
  "correct": "正解のid（a/b/c）",
  "explanation": "解説（100字以内、なぜ正解なのかをわかりやすく）",
  "parentNote": "保護者向けアドバイス（80字以内）",
  "unsplashQuery": "関連画像の英語検索キーワード（2〜3単語）"
}`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());
    return { ...json, id: `gen_${Date.now()}`, theme, emoji: "🤖", color: "#8b5cf6" };
  } catch { return null; }
}

// ═══════════════════════════════════════════════
// 👨‍👩‍👧 保護者向け解説カードデータ
// ═══════════════════════════════════════════════
const PARENT_CARDS = {
  ep1: {
    title: "📍 位置情報・個人情報 — 保護者の方へ",
    stats: [
      { icon: "📊", text: "SNSを通じた面識のない人物による被害の約7割が、被害者のSNS投稿をきっかけに接触（警察庁2024年）" },
      { icon: "📱", text: "小学生のスマホ所有率は約50%（2024年内閣府調査）" },
      { icon: "🏠", text: "写真の位置情報から自宅を特定されるストーキング被害が年間数百件報告" },
    ],
    law: "不正競争防止法・個人情報保護法により、他人の位置情報を無断で収集・利用することは違法です。",
    actions: [
      "カメラアプリの位置情報設定をオフに（設定→プライバシー→カメラ）",
      "子どもの投稿を月に一度一緒に確認する習慣を",
      "「投稿前チェックリスト」を家族で決める",
    ],
    elActions: [
      "カメラアプリの{位置情報|いちじょうほう}{設定|せってい}をオフに（{設定|せってい}→プライバシー→カメラ）",
      "{子|こ}どもの{投稿|とうこう}を{月|つき}に{一度|いちど}{一緒|いっしょ}に{確認|かくにん}する{習慣|しゅうかん}を",
      "「{投稿前|とうこうまえ}チェックリスト」を{家族|かぞく}で{決|き}める",
    ],
    contacts: [{ name: "警察相談専用電話", tel: "#9110" }, { name: "子どもの人権110番", tel: "0120-007-110" }],
    elContacts: [{ name: "{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}", tel: "#9110" }, { name: "{子|こ}どもの{人権|じんけん}110{番|ばん}", tel: "0120-007-110" }],
  },
  ep2: {
    title: "📰 フェイクニュース — 保護者の方へ",
    stats: [
      { icon: "📊", text: "日本のSNS利用者の約6割がフェイクニュースを「見分けられる自信がない」と回答（総務省調査）" },
      { icon: "🔁", text: "デマ情報は正確な情報より6倍速く拡散する（MIT研究）" },
      { icon: "🧒", text: "10〜20代は高齢者より「正しく見分けられる」と過信しやすい傾向" },
    ],
    law: "虚偽情報の故意の拡散は偽計業務妨害罪（刑法233条）に問われる場合があります。",
    actions: [
      "家族のLINEグループで「転送前確認ルール」を設ける",
      "ファクトチェックサイトをブックマーク（FIJ: fij.info）",
      "Googleレンズの画像逆検索を家族で練習する",
    ],
    elActions: [
      "{家族|かぞく}のLINEグループで「{転送|てんそう}{前|まえ}{確認|かくにん}ルール」を{設|もう}ける",
      "ファクトチェックサイトをブックマーク（FIJ: fij.info）",
      "Googleレンズの{画像|がぞう}{逆検索|ぎゃくけんさく}を{家族|かぞく}で{練習|れんしゅう}する",
    ],
    contacts: [{ name: "ファクトチェック・イニシアティブ", tel: "fij.info" }, { name: "総務省 違法情報通報窓口", tel: "ihaho.jp" }],
    elContacts: [{ name: "ファクトチェック・イニシアティブ", tel: "fij.info" }, { name: "{総務省|そうむしょう} {違法|いほう}{情報|じょうほう}{通報|つうほう}{窓口|まどぐち}", tel: "ihaho.jp" }],
  },
  ep3: {
    title: "⚠️ 闇バイト・トクリュウ — 保護者の方へ",
    stats: [
      { icon: "📊", text: "2024年の特殊詐欺・強盗事件の多くでSNSで募集された10〜20代が逮捕" },
      { icon: "💰", text: "「1日3〜5万円」「スマホだけ」の募集は全て詐欺グループの可能性" },
      { icon: "🔒", text: "一度個人情報を送ると脅迫に変わり、自力では抜け出せなくなる" },
    ],
    law: "受け子・出し子・架け子は詐欺罪（刑法246条）の共犯。未成年でも少年院送致・実名報道になる事例が続出しています。",
    actions: [
      "「日払い・高収入・スマホだけ」の募集は即ブロック・報告を約束する",
      "#9110を家族全員の連絡先に登録する",
      "「困ったら絶対相談して」という信頼関係を作る",
    ],
    elActions: [
      "「{日払|ひばら}い・{高収入|こうしゅうにゅう}・スマホだけ」の{募集|ぼしゅう}は{即|そく}ブロック・{報告|ほうこく}を{約束|やくそく}する",
      "#9110を{家族|かぞく}{全員|ぜんいん}の{連絡先|れんらくさき}に{登録|とうろく}する",
      "「{困|こま}ったら{絶対|ぜったい}{相談|そうだん}して」という{信頼|しんらい}{関係|かんけい}を{作|つく}る",
    ],
    contacts: [{ name: "警察相談専用電話", tel: "#9110" }, { name: "法務省 子どもの人権110番", tel: "0120-007-110" }],
    elContacts: [{ name: "{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}", tel: "#9110" }, { name: "{法務省|ほうむしょう} {子|こ}どもの{人権|じんけん}110{番|ばん}", tel: "0120-007-110" }],
  },
  ep4: {
    title: "🔐 なりすまし・アカウント乗っ取り — 保護者の方へ",
    stats: [
      { icon: "📊", text: "LINEアカウントの乗っ取り被害は年間数万件（LINE公式発表）" },
      { icon: "🔑", text: "2段階認証を設定するだけで99%以上の不正アクセスを防げる" },
      { icon: "💳", text: "乗っ取り後の不正決済被害の平均額は十数万円" },
    ],
    law: "不正アクセス禁止法により、他人のアカウントへの不正アクセスは3年以下の懲役または100万円以下の罰金です。",
    actions: [
      "LINE・Instagram・Gmail全ての2段階認証を今日設定する",
      "「認証コードは誰にも教えない」を家族の約束にする",
      "パスワードマネージャーを家族で導入する",
    ],
    elActions: [
      "LINE・Instagram・Gmail{全|すべ}ての2{段階|だんかい}{認証|にんしょう}を{今日|きょう}{設定|せってい}する",
      "「{認証|にんしょう}コードは{誰|だれ}にも{教|おし}えない」を{家族|かぞく}の{約束|やくそく}にする",
      "パスワードマネージャーを{家族|かぞく}で{導入|どうにゅう}する",
    ],
    contacts: [{ name: "LINE公式 乗っ取り対処", tel: "line.me/ja/safety" }, { name: "警察相談専用電話", tel: "#9110" }],
    elContacts: [{ name: "LINE{公式|こうしき} {乗|の}っ{取|と}り{対処|たいしょ}", tel: "line.me/ja/safety" }, { name: "{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}", tel: "#9110" }],
  },
  ep5: {
    title: "👥 ネットいじめ — 保護者の方へ",
    stats: [
      { icon: "📊", text: "ネットいじめの認知件数が初めて2万件超（文科省2023年）" },
      { icon: "😔", text: "被害者の92%が「誰かに気づいてほしかった」と回答" },
      { icon: "🔍", text: "ネットいじめはリアルいじめの3倍長期化する傾向" },
    ],
    law: "誹謗中傷の書き込みは名誉毀損罪・侮辱罪（刑法改正で厳罰化2022年〜）の対象。侮辱罪は1年以下の懲役・禁錮または30万円以下の罰金。",
    actions: [
      "子どもが「スマホを気にしている・食欲がない」時は状況確認を",
      "証拠はスクショで保存してから報告・相談",
      "「いじめを見たら大人に伝えていい」と繰り返し伝える",
    ],
    elActions: [
      "{子|こ}どもが「スマホを{気|き}にしている・{食欲|しょくよく}がない」{時|とき}は{状況|じょうきょう}{確認|かくにん}を",
      "{証拠|しょうこ}はスクショで{保存|ほぞん}してから{報告|ほうこく}・{相談|そうだん}",
      "「いじめを{見|み}たら{大人|おとな}に{伝|つた}えていい」と{繰|く}り{返|かえ}し{伝|つた}える",
    ],
    contacts: [{ name: "子どもの人権110番", tel: "0120-007-110" }, { name: "24時間子どもSOSダイヤル", tel: "0120-0-78310" }],
    elContacts: [{ name: "{子|こ}どもの{人権|じんけん}110{番|ばん}", tel: "0120-007-110" }, { name: "24{時間|じかん}{子|こ}どもSOSダイヤル", tel: "0120-0-78310" }],
  },
  ep6: {
    title: "📸 自画撮り被害・グルーミング — 保護者の方へ",
    stats: [
      { icon: "📊", text: "自画撮り被害の被害者の約7割が「信頼していた相手」から被害（警察庁2024年）" },
      { icon: "👶", text: "被害者の平均年齢は下がり続けており、小学生の被害も報告" },
      { icon: "📱", text: "被害経路の約65%がSNS・ゲームアプリ" },
    ],
    law: "「不同意わいせつ罪」「児童ポルノ禁止法」により、18歳未満の性的画像の所持・提供は重大犯罪。被害者に落ち度は一切ありません。",
    actions: [
      "「送ってしまっても怒らないから話して」という信頼関係が最大の防御",
      "ゲームアプリのプライバシー設定を一緒に確認する",
      "デジタル性暴力ホットライン（0120-437-104）を覚えておく",
    ],
    elActions: [
      "「{送|おく}ってしまっても{怒|おこ}らないから{話|はな}して」という{信頼|しんらい}{関係|かんけい}が{最大|さいだい}の{防御|ぼうぎょ}",
      "ゲームアプリのプライバシー{設定|せってい}を{一緒|いっしょ}に{確認|かくにん}する",
      "デジタル{性暴力|せいぼうりょく}ホットライン（0120-437-104）を{覚|おぼ}えておく",
    ],
    contacts: [{ name: "デジタル性暴力ホットライン", tel: "0120-437-104" }, { name: "子どもの人権110番", tel: "0120-007-110" }],
    elContacts: [{ name: "デジタル{性暴力|せいぼうりょく}ホットライン", tel: "0120-437-104" }, { name: "{子|こ}どもの{人権|じんけん}110{番|ばん}", tel: "0120-007-110" }],
  },
  ep7: {
    title: "🎣 フィッシング詐欺 — 保護者の方へ",
    stats: [
      { icon: "📊", text: "フィッシング被害額が2024年に過去最高の1,000億円超（警察庁）" },
      { icon: "📱", text: "SMSを使ったスミッシングは月200万件以上送信される月も" },
      { icon: "💳", text: "クレジットカード不正利用の被害額は年間540億円（2023年）" },
    ],
    law: "フィッシング詐欺は詐欺罪（刑法246条）・不正アクセス禁止法違反。被害を受けた場合は金融機関とサイバー犯罪相談窓口に即連絡を。",
    actions: [
      "「SMSのURLは絶対に踏まない」を家族全員の鉄則に",
      "よく使うサービスのアプリをホーム画面に追加する",
      "クレジットカードの利用通知メールを必ず設定する",
    ],
    elActions: [
      "「SMSのURLは{絶対|ぜったい}に{踏|ふ}まない」を{家族|かぞく}{全員|ぜんいん}の{鉄則|てっそく}に",
      "よく{使|つか}うサービスのアプリをホーム{画面|がめん}に{追加|ついか}する",
      "クレジットカードの{利用|りよう}{通知|つうち}メールを{必|かなら}ず{設定|せってい}する",
    ],
    contacts: [{ name: "警察 サイバー犯罪相談", tel: "#9110" }, { name: "消費者ホットライン", tel: "188" }],
    elContacts: [{ name: "{警察|けいさつ} サイバー{犯罪|はんざい}{相談|そうだん}", tel: "#9110" }, { name: "{消費者|しょうひしゃ}ホットライン", tel: "188" }],
  },
};

// 保護者向け解説カードコンポーネント
function ParentExpertCard({ epKey, accentColor }) {
  const ageMode = useAgeMode();
  const [open, setOpen] = useState(false);
  const card = PARENT_CARDS[epKey];
  if (!card) return null;
  const dispActions  = ageMode === "elementary" ? (card.elActions  || card.actions)  : card.actions;
  const dispContacts = ageMode === "elementary" ? (card.elContacts || card.contacts) : card.contacts;

  return (
    <div style={{ marginTop: 16, animation: "slideUp .4s ease" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "14px 16px",
          background: open ? "#fff" : `${accentColor}10`,
          border: `1.5px solid ${open ? accentColor : accentColor + "44"}`,
          borderRadius: open ? "16px 16px 0 0" : 16,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 12, textAlign: "left",
          transition: "all .2s",
        }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accentColor}18`, border: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👨‍👩‍👧</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: open ? "#1e293b" : accentColor }}><RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}{向|む}け{詳細|しょうさい}{情報|じょうほう}" : "保護者向け詳細情報"} /></div>
          <div style={{ fontSize: 11, color: open ? "#64748b" : `${accentColor}88`, marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "{統計|とうけい}・{法律|ほうりつ}・{今|いま}すぐできること" : "統計・法律・今すぐできること"} /></div>
        </div>
        <div style={{ fontSize: 18, color: accentColor, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</div>
      </button>

      {open && (
        <div style={{ background: "#fff", border: `1.5px solid ${accentColor}44`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "16px 16px 20px", animation: "slideUp .3s ease" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b", marginBottom: 12 }}>{card.title}</div>

          {/* 統計 */}
          <div style={{ marginBottom: 14 }}>
            {card.stats.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderBottom: i < card.stats.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>{s.text}</span>
              </div>
            ))}
          </div>

          {/* 法律 */}
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#dc2626", marginBottom: 4, letterSpacing: ".05em" }}><RubyText text={ageMode === "elementary" ? "⚖️ {法律|ほうりつ}・{制度|せいど}" : "⚖️ 法律・制度"} /></div>
            <div style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.7 }}>{card.law}</div>
          </div>

          {/* アクション */}
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#166534", marginBottom: 6, letterSpacing: ".05em" }}><RubyText text={ageMode === "elementary" ? "✅ {今|いま}すぐできること" : "✅ 今すぐできること"} /></div>
            {dispActions.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
                <span style={{ color: "#16a34a", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>▸</span>
                <span style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}><RubyText text={a} /></span>
              </div>
            ))}
          </div>

          {/* 相談先 */}
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#1d4ed8", marginBottom: 6, letterSpacing: ".05em" }}><RubyText text={ageMode === "elementary" ? "📞 {相談|そうだん}{窓口|まどぐち}" : "📞 相談窓口"} /></div>
            {dispContacts.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < dispContacts.length - 1 ? "1px solid #dbeafe" : "none" }}>
                <span style={{ fontSize: 12, color: "#1e40af" }}><RubyText text={c.name} /></span>
                <span style={{ fontSize: 13, fontWeight: 900, color: "#1d4ed8" }}>{c.tel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🔥 チャレンジ導入画面
// ═══════════════════════════════════════════════
function ChallengeIntroScreen({ onStart, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#1a0800,#0f0500)",
      padding: "32px 20px 40px",
      fontFamily: "'Zen Maru Gothic',sans-serif",
      color: "#fff",
    }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>

        {/* 戻るボタン */}
        <button onClick={() => { feedback("tap"); onExit(); }}
          style={{
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 10,
            padding: "6px 14px",
            fontSize: 12,
            color: "rgba(255,255,255,.7)",
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 20,
          }}>← 戻る</button>

        {/* 炎アニメーション */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 6,
          height: 80,
          marginBottom: 8,
        }}>
          {[
            { w: 18, h: 46, delay: "0s", dur: "1.1s", op: 0.85 },
            { w: 28, h: 64, delay: ".1s", dur: "0.9s", op: 1 },
            { w: 22, h: 52, delay: ".05s", dur: "1.3s", op: 0.9 },
            { w: 16, h: 40, delay: ".15s", dur: "1.0s", op: 0.75 },
          ].map((f, i) => (
            <div key={i} style={{
              width: f.w,
              height: f.h,
              background: `linear-gradient(180deg,#ff${i%2===0?"2200":"3300"},#ff${i%2===0?"6600":"7700"})`,
              borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
              opacity: f.op,
              transformOrigin: "bottom center",
              animation: `challengeFlame ${f.dur} ${f.delay} ease-in-out infinite`,
            }} />
          ))}
        </div>

        {/* keyframesをstyleタグで追加 */}
        <style>{`
          @keyframes challengeFlame {
            0%,100%{transform:scaleY(1) scaleX(1)}
            33%{transform:scaleY(1.1) scaleX(.95)}
            66%{transform:scaleY(.93) scaleX(1.05)}
          }
          @keyframes challengeOwlBob {
            0%,100%{transform:translateY(0)}
            50%{transform:translateY(-5px)}
          }
          @keyframes challengeFadeUp {
            from{opacity:0;transform:translateY(12px)}
            to{opacity:1;transform:translateY(0)}
          }
        `}</style>

        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: 18, animation: "challengeFadeUp .5s .1s both ease" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(255,120,0,.15)",
            border: "1px solid rgba(255,120,0,.3)",
            borderRadius: 99,
            padding: "4px 14px",
            fontSize: 11,
            color: "#ff8c00",
            fontWeight: 900,
            marginBottom: 8,
            letterSpacing: ".05em",
          }}>WEEKLY CHALLENGE</div>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0 }}>
            <RubyText text={el ? "今{週|しゅう}のチャレンジ" : "今週のチャレンジ"} />
          </p>
        </div>

        {/* オウル＋セリフ */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 18,
          animation: "challengeFadeUp .5s .25s both ease",
        }}>
          <div style={{
            width: 52,
            height: 52,
            background: "rgba(255,169,64,.15)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            flexShrink: 0,
            animation: "challengeOwlBob 2s ease-in-out infinite",
          }}>🦉</div>
          <div style={{
            background: "rgba(255,255,255,.08)",
            border: "0.5px solid rgba(255,255,255,.15)",
            borderRadius: "0 14px 14px 14px",
            padding: "11px 14px",
            flex: 1,
          }}>
            <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.8, margin: 0 }}>
              <RubyText text={el
                ? "{問題|もんだい}を{解|と}いて、{学|まな}んだことを{確|たし}かめよう！{知識|ちしき}をつければ、{自分|じぶん}や{家族|かぞく}をもっと{守|まも}れるようになるよ🔥"
                : "問題を解いて、学んだことを確かめよう！知識をつければ、自分や家族をもっと守れるようになるよ🔥"
              } />
            </p>
          </div>
        </div>

        {/* 説明カード3枚 */}
        {[
          {
            icon: "📚",
            text: "各エピソードで学んだ内容から出題されます",
            textEl: "{各|かく}エピソードで{学|まな}んだ{内容|ないよう}から{出題|しゅつだい}されます",
            delay: ".4s",
          },
          {
            icon: "3️⃣",
            text: "毎週3問用意されています",
            textEl: "{毎週|まいしゅう}3{問|もん}{用意|ようい}されています",
            delay: ".5s",
          },
          {
            icon: "📅",
            text: "問題は毎週月曜日に入れ替わります",
            textEl: "{問題|もんだい}は{毎週|まいしゅう}{月曜日|げつようび}に{入|い}れ{替|か}わります",
            delay: ".6s",
          },
        ].map((item, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,.06)",
            border: "0.5px solid rgba(255,120,0,.2)",
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: `challengeFadeUp .5s ${item.delay} both ease`,
          }}>
            <div style={{
              width: 36,
              height: 36,
              background: "rgba(255,120,0,.15)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}>{item.icon}</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.65, margin: 0 }}>
              <RubyText text={el ? item.textEl : item.text} />
            </p>
          </div>
        ))}

        {/* スタートボタン */}
        <div style={{ marginTop: 20, animation: "challengeFadeUp .5s .75s both ease" }}>
          <button
            onClick={() => { feedback("tap"); onStart(); }}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg,#ff6600,#ff4400)",
              border: "none",
              borderRadius: 16,
              color: "#fff",
              fontSize: 16,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
            🔥 <RubyText text={el ? "チャレンジをはじめる →" : "チャレンジをはじめる →"} />
          </button>
        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🔥 週次チャレンジ画面
// ═══════════════════════════════════════════════
function WeeklyChallengeScreen({ onBack }) {
  const ageMode = useAgeMode();
  const weekStr = getWeekNumber();
  const CACHE_KEY = `mamoru_weekly_${weekStr}`;
  const RESULT_KEY = `mamoru_weekly_result_${weekStr}`;

  const [questions, setQuestions] = useState(() => {
    try { const c = localStorage.getItem(CACHE_KEY); if (c) return JSON.parse(c); } catch {}
    return getStockQuestionsForWeek(weekStr);
  });
  const [genPhase, setGenPhase] = useState("idle");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RESULT_KEY) || "[]"); } catch { return []; }
  });
  const [phase, setPhase] = useState(results.length >= 3 ? "result" : "quiz");

  // Claude API追加問題生成（週に1回・APIが有効な場合のみ）
  useEffect(() => {
    if (!CLAUDE_API_ENABLED) { setGenPhase("done"); return; } // APIオフ時はスキップ
    const cached = (() => { try { return localStorage.getItem(CACHE_KEY); } catch { return null; } })();
    if (cached || genPhase !== "idle") return;
    setGenPhase("generating");
    const themes = ["生成AI詐欺", "SNS依存", "デジタルモラル", "著作権", "個人情報"];
    const theme = themes[parseInt(weekStr.split("-W")[1] || "1") % themes.length];
    generateChallengeQuestion(theme).then(q => {
      if (q) {
        const base = getStockQuestionsForWeek(weekStr);
        const newQs = [...base, q];
        setQuestions(newQs);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(newQs)); } catch {}
      }
      setGenPhase("done");
    });
  }, []);

  const current = questions[qIdx];
  const score = results.filter(r => r.correct).length;

  const handleSelect = (id) => {
    if (answered) return;
    setSelected(id);
    setAnswered(true);
    const isCorrect = id === current.correct;
    const newResults = [...results, { id: current.id, correct: isCorrect }];
    setResults(newResults);
    try { localStorage.setItem(RESULT_KEY, JSON.stringify(newResults)); } catch {}
  };

  const handleNext = () => {
    if (results.length < 3 && qIdx < questions.length - 1) {
      setQIdx(i => i + 1); setSelected(null); setAnswered(false);
    } else { setPhase("result"); }
  };

  // img変数は削除（Unsplash廃止）

  // ── 結果画面 ──
  if (phase === "result") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0d0d1a,#14091e)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", padding: "20px 16px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".15em" }}><RubyText text={ageMode === "elementary" ? "{今週|こんしゅう}のチャレンジ" : "今週のチャレンジ"} /> · {weekStr}</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 10, animation: "celebrate 1s infinite" }}>
            {score >= 3 ? "🏆" : score >= 2 ? "⭐" : "💪"}
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: score >= 3 ? "#fbbf24" : "#fff", fontFamily: "'DotGothic16',monospace", marginBottom: 6 }}>{score} / 3</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>
            {score >= 3 ? <RubyText text={ageMode === "elementary" ? "{完璧|かんぺき}！{週|しゅう}チャレマスター🎉" : "完璧！週チャレマスター🎉"} /> : score >= 2 ? <RubyText text={ageMode === "elementary" ? "{惜|お}しい！あと{一問|いちもん}！" : "惜しい！あと一問！"} /> : <RubyText text={ageMode === "elementary" ? "{来週|らいしゅう}また{挑戦|ちょうせん}しよう！" : "来週また挑戦しよう！"} />}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {results.map((r, i) => {
            const q = questions.find(q => q.id === r.id) || questions[i];
            return (
              <div key={i} style={{ background: r.correct ? "rgba(74,222,128,.08)" : "rgba(239,68,68,.08)", border: `1px solid ${r.correct ? "rgba(74,222,128,.3)" : "rgba(239,68,68,.3)"}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 20 }}>{r.correct ? "✅" : "❌"}</div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 2 }}>{q?.theme} · <RubyText text={ageMode === "elementary" ? `{問|もん}${i + 1}` : `問${i + 1}`} /></div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>{q?.question?.slice(0, 36)}…</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "rgba(255,169,64,.08)", border: "1px solid rgba(255,169,64,.25)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "#ffd28a", textAlign: "center", lineHeight: 1.7 }}>
          🔄 <RubyText text={ageMode === "elementary" ? "{来週|らいしゅう}{月曜|げつよう}に{新|あたら}しいチャレンジが{登場|とうじょう}します" : "来週月曜に新しいチャレンジが登場します"} />
        </div>
        <button onClick={onBack} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff6b00)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "ホームに{戻|もど}る" : "ホームに戻る"} />
        </button>
      </div>
    </div>
  );

  if (!current) return null;

  // ── クイズ画面 ──
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0d0d1a,#14091e)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "16px 16px 0", display: "flex", alignItems: "center", gap: 10, maxWidth: 440, margin: "0 auto" }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <div>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".15em" }}>🔥 <RubyText text={ageMode === "elementary" ? "{今週|こんしゅう}のチャレンジ" : "今週のチャレンジ"} /></div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{weekStr} · <RubyText text={ageMode === "elementary" ? `{問|もん} ${qIdx + 1} / 3` : `問 ${qIdx + 1} / 3`} /></div>
        </div>
        {genPhase === "generating" && <div style={{ marginLeft: "auto", fontSize: 10, color: "#a78bfa" }}><span style={{ animation: "blink 1s infinite" }}>●</span> <RubyText text={ageMode === "elementary" ? "AI{生成|せいせい}{中|ちゅう}" : "AI生成中"} /></div>}
        <div style={{ marginLeft: genPhase === "generating" ? 0 : "auto", display: "flex", gap: 5 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < results.length ? "#ffa940" : i === qIdx ? "rgba(255,169,64,.4)" : "rgba(255,255,255,.15)", transition: "all .3s" }} />)}
        </div>
      </div>

      <div style={{ padding: "14px 16px 32px", maxWidth: 440, margin: "0 auto" }}>
        {/* テーマエリア（絵文字+カラー） */}
        <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 14, height: 100, position: "relative", background: `linear-gradient(135deg,${current.color}22,${current.color}08)`, border: `1px solid ${current.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 52, opacity: .5 }}>{current.emoji}</div>
          <div style={{ position: "absolute", top: 10, left: 12 }}>
            <div style={{ background: current.color, borderRadius: 99, padding: "3px 11px", fontSize: 10, fontWeight: 900, color: "#fff", fontFamily: "'DotGothic16',monospace" }}>
              {current.emoji} {current.theme}
            </div>
          </div>
        </div>

        {/* 問題 */}
        <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "16px 15px", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.75 }}><RubyText text={ageMode === "elementary" ? (current.elQuestion || current.question) : current.question} /></div>
        </div>

        {/* 選択肢 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
          {current.choices.map((ch) => {
            const isSel = selected === ch.id;
            const isOk = ch.id === current.correct;
            let bg = "rgba(255,255,255,.05)", border = "rgba(255,255,255,.1)", tc = "rgba(255,255,255,.85)";
            if (answered && isOk)              { bg = "rgba(74,222,128,.12)";  border = "rgba(74,222,128,.5)";  tc = "#86efac"; }
            else if (answered && isSel && !isOk){ bg = "rgba(239,68,68,.12)";  border = "rgba(239,68,68,.5)";   tc = "#fca5a5"; }
            else if (isSel)                    { bg = `${current.color}18`;     border = `${current.color}66`; }
            return (
              <button key={ch.id} onClick={() => handleSelect(ch.id)}
                style={{ width: "100%", padding: "13px 16px", background: bg, border: `1.5px solid ${border}`, borderRadius: 13, color: tc, fontSize: 13, fontWeight: 600, cursor: answered ? "default" : "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all .15s" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: answered && isOk ? "#22c55e" : answered && isSel ? "#ef4444" : isSel ? current.color : "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 900, flexShrink: 0 }}>
                  {answered && isOk ? "✓" : answered && isSel && !isOk ? "✗" : ch.id.toUpperCase()}
                </div>
                <RubyText text={ageMode === "elementary" ? (ch.elText || ch.text) : ch.text} />
              </button>
            );
          })}
        </div>

        {/* 解説 */}
        {answered && (
          <div style={{ animation: "slideUp .4s ease" }}>
            <div style={{ background: selected === current.correct ? "rgba(74,222,128,.08)" : "rgba(239,68,68,.06)", border: `1px solid ${selected === current.correct ? "rgba(74,222,128,.3)" : "rgba(239,68,68,.25)"}`, borderRadius: 14, padding: "14px 15px", marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: selected === current.correct ? "#4ade80" : "#f87171", marginBottom: 6 }}>
                {selected === current.correct ? <RubyText text={ageMode === "elementary" ? "✅ {正解|せいかい}！" : "✅ 正解！"} /> : <RubyText text={ageMode === "elementary" ? "❌ {不正解|ふせいかい}" : "❌ 不正解"} />}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.8 }}><RubyText text={ageMode === "elementary" ? (current.elExplanation || current.explanation) : current.explanation} /></div>
            </div>
            <div style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 12, padding: "10px 13px", marginBottom: 12, fontSize: 12, color: "#a5b4fc", lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700 }}>👨‍👩‍👧 <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}メモ：" : "保護者メモ："} /></span>{current.parentNote}
            </div>
            <button onClick={handleNext} style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${current.color},${current.color}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${current.color}44` }}>
              {results.length >= 3 ? <RubyText text={ageMode === "elementary" ? "{結果|けっか}を{見|み}る 🏆" : "結果を見る 🏆"} /> : <RubyText text={ageMode === "elementary" ? "{次|つぎ}の{問題|もんだい} →" : "次の問題 →"} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🔊 音・振動ユーティリティ
// ═══════════════════════════════════════════════

// 振動（iOS Safariは非対応。AndroidのChromeで動作）
function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
}

// Web Audio APIで音を生成（ファイル不要・iOS/Android両対応）
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const sounds = {
      // タップ：短いクリック音
      tap: () => {
        const o = ctx.createOscillator();
        o.connect(gain);
        o.frequency.setValueAtTime(800, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.05);
      },
      // 正解：明るい上昇音
      correct: () => {
        [523, 659, 784].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.connect(gain);
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + 0.4);
        });
      },
      // 不正解：低い下降音
      wrong: () => {
        const o = ctx.createOscillator();
        o.connect(gain);
        o.type = "sawtooth";
        o.frequency.setValueAtTime(300, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.3);
      },
      // 発見：ポップ音
      found: () => {
        [600, 900].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.connect(gain);
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
          o.start(ctx.currentTime + i * 0.08);
          o.stop(ctx.currentTime + i * 0.08 + 0.15);
        });
      },
      // 修了：ファンファーレ
      complete: () => {
        [523, 523, 659, 784, 1047].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.connect(gain);
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
          o.start(ctx.currentTime + i * 0.12);
          o.stop(ctx.currentTime + i * 0.12 + 0.2);
        });
      },
      // ホラー：不気味な音
      horror: () => {
        const o = ctx.createOscillator();
        o.connect(gain);
        o.type = "sine";
        o.frequency.setValueAtTime(200, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.0);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 1.0);
      },
      // タイピング：ポポポポ（4連続ショートクリック）
      typing: () => {
        [0, 0.07, 0.14, 0.21].forEach((dt) => {
          const o = ctx.createOscillator();
          o.connect(gain);
          o.frequency.setValueAtTime(1200, ctx.currentTime + dt);
          o.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + dt + 0.04);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + dt);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dt + 0.04);
          o.start(ctx.currentTime + dt);
          o.stop(ctx.currentTime + dt + 0.04);
        });
      },
    };

    if (sounds[type]) sounds[type]();
  } catch {}
}

// タップ時に音+振動をまとめて実行
function feedback(type = "tap") {
  const vibratePatterns = {
    tap:      20,
    correct:  [50, 30, 80],
    wrong:    [100, 50, 100],
    found:    80,
    complete: [80, 40, 80, 40, 160],
    horror:   [200, 100, 200],
    typing:   [20, 20, 20, 20],
  };
  playSound(type);
  vibrate(vibratePatterns[type] || 20);
}

// ═══════════════════════════════════════════════
// 🚪 途中終了ボタン（全EP共通）
// ═══════════════════════════════════════════════
function ExitButton({ onExit, accentColor = "rgba(255,255,255,.15)" }) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 500, padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 22, padding: "28px 24px",
        maxWidth: 320, width: "100%", textAlign: "center",
        animation: "popIn .3s ease",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#1e293b", marginBottom: 8 }}>
          やめますか？
        </div>
        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 22 }}>
          ここで終了すると、<br />このエピソードの進捗は保存されません。
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { feedback("tap"); setConfirm(false); }}
            style={{ flex: 1, padding: "12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#475569" }}>
            続ける
          </button>
          <button onClick={() => { feedback("tap"); onExit(); }}
            style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#fff" }}>
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <button onClick={() => { feedback("tap"); setConfirm(true); }}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: accentColor,
        border: "1px solid rgba(255,255,255,.15)",
        cursor: "pointer", fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,.7)", flexShrink: 0,
      }}>
      ✕
    </button>
  );
}
// トリガー：ホームのモリィを10回タップ
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// 👨‍👩‍👧 EP導入カード（保護者向け・各EP冒頭）
// ═══════════════════════════════════════════════
const EP_INTRO_META = {
  ep1: {
    theme: "個人情報・位置情報",
    hook: "スマホで撮った写真から、自宅や学校の場所が特定される——そんな事件が実際に起きています。投稿する前に、何を確認すべきか一緒に体験しよう。",
    talkPoints: ["写真から何がわかるか", "投稿前にどう確認するか"],
    parentNote: "制服・校章・表札・ランドマークが写り込んだ写真から、住所が特定された事例があります。一枚の写真が持つ情報量をお子さまと一緒に確認しましょう。",
    elTheme: "{個人情報|こじんじょうほう}・{位置情報|いちじょうほう}",
    elHook: "スマホで{撮|と}った{写真|しゃしん}から、{自宅|じたく}や{学校|がっこう}の{場所|ばしょ}が{特定|とくてい}される——そんな{事件|じけん}が{実際|じっさい}に{起|お}きています。{投稿|とうこう}する{前|まえ}に、{何|なに}を{確認|かくにん}すべきか{一緒|いっしょ}に{体験|たいけん}しよう。",
    elTalkPoints: ["{写真|しゃしん}から{何|なに}がわかるか", "{投稿|とうこう}{前|まえ}にどう{確認|かくにん}するか"],
    elParentNote: "{制服|せいふく}・{校章|こうしょう}・{表札|ひょうさつ}・ランドマークが{写|うつ}り{込|こ}んだ{写真|しゃしん}から、{住所|じゅうしょ}が{特定|とくてい}された{事例|じれい}があります。{一枚|いちまい}の{写真|しゃしん}が{持|も}つ{情報|じょうほう}{量|りょう}をお{子|こ}さまと{一緒|いっしょ}に{確認|かくにん}しましょう。",
    accentColor: "#ffa940",
  },
  ep12: {
    theme: "位置情報サービスの怖さ",
    hook: "エピソード1では、写真の背景から場所が特定される怖さを学んだ。でも実は、スマホ自体があなたの居場所を毎日記録し続けている。今日は実際に確認して、一緒に対策しよう。",
    talkPoints: ["スマホが記録している位置情報の量に驚いたか", "どのアプリに位置情報を許可しているか知っていたか", "今後どのアプリの位置情報をオフにするか"],
    parentNote: "スマホの位置情報は親御さん自身も把握していないことが多いテーマです。お子さまと一緒に実際の設定画面を開いて確認することを強くおすすめします。",
    elTheme: "{位置情報|いちじょうほう}サービスのこわさ",
    elHook: "エピソード1では、{写真|しゃしん}の{背景|はいけい}から{場所|ばしょ}が{特定|とくてい}されるこわさを{学|まな}んだね。でも{実|じつ}は、スマホ{自体|じたい}があなたの{居場所|いばしょ}を{毎日|まいにち}{記録|きろく}し{続|つづ}けているんだよ。{今日|きょう}は{実際|じっさい}に{確認|かくにん}して、{一緒|いっしょ}に{対策|たいさく}しよう。",
    elTalkPoints: ["スマホが{記録|きろく}している{位置情報|いちじょうほう}の{量|りょう}に{驚|おどろ}いたか", "どのアプリに{位置情報|いちじょうほう}を{許可|きょか}しているか{知|し}っていたか", "これから{位置情報|いちじょうほう}をオフにするアプリはどれか"],
    elParentNote: "スマホの{位置情報|いちじょうほう}はおうちの{人|ひと}も{把握|はあく}していないことが{多|おお}いテーマです。お{子|こ}さまと{一緒|いっしょ}に{実際|じっさい}の{設定|せってい}{画面|がめん}を{開|ひら}いて{確認|かくにん}することを{強|つよ}くおすすめします。",
    accentColor: "#ffa940",
  },
  ep2: {
    theme: "フェイクニュース・情報リテラシー",
    hook: "「緊急拡散希望」——その情報、本当ですか？デマを広めた側も責任を問われる時代です。正しい情報の見分け方を一緒に学ぼう。",
    talkPoints: ["フェイクニュースを見分ける方法", "シェアする前にすること", "公式情報源とは何か"],
    parentNote: "災害時のデマ拡散で混乱が起きた事例が多数あります。子どもは特に拡散しやすい傾向があります。「シェアする前に確認する習慣」を一緒に作りましょう。",
    elTheme: "フェイクニュース・{情報|じょうほう}リテラシー",
    elHook: "「{緊急|きんきゅう}{拡散|かくさん}{希望|きぼう}」——その{情報|じょうほう}、{本当|ほんとう}ですか？デマを{広|ひろ}めた{側|がわ}も{責任|せきにん}を{問|と}われる{時代|じだい}です。{正|ただ}しい{情報|じょうほう}の{見分|みわ}け{方|かた}を{一緒|いっしょ}に{学|まな}ぼう。",
    elTalkPoints: ["フェイクニュースを{見分|みわ}ける{方法|ほうほう}", "シェアする{前|まえ}にすること", "{公式|こうしき}{情報源|じょうほうげん}とは{何|なに}か"],
    elParentNote: "{災害|さいがい}{時|じ}のデマ{拡散|かくさん}で{混乱|こんらん}が{起|お}きた{事例|じれい}が{多数|たすう}あります。{子|こ}どもは{特|とく}に{拡散|かくさん}しやすい{傾向|けいこう}があります。「シェアする{前|まえ}に{確認|かくにん}する{習慣|しゅうかん}」を{一緒|いっしょ}に{作|つく}りましょう。",
    accentColor: "#7c3aed",
  },
  ep3: {
    theme: "闇バイト・トクリュウ",
    hook: "「スマホだけで日払い5万円」——その求人広告は、犯罪グループの入口です。なぜ若者が巻き込まれるのか、一緒に考えよう。",
    talkPoints: ["闇バイトの断り方", "トクリュウって何？", "困ったら誰に相談するか"],
    parentNote: "2024年、高校・大学生の逮捕者が急増。「知らなかった」は裁判で通用しません。相談できる関係を今日作りましょう。",
    elTheme: "{闇|やみ}バイト・トクリュウ",
    elHook: "「スマホだけで{日払|ひばら}い5{万円|まんえん}」——その{求人|きゅうじん}{広告|こうこく}は、{犯罪|はんざい}グループの{入口|いりぐち}です。なぜ{若者|わかもの}が{巻|ま}き{込|こ}まれるのか、{一緒|いっしょ}に{考|かんが}えよう。",
    elTalkPoints: ["{闇|やみ}バイトの{断|ことわ}り{方|かた}", "トクリュウって{何|なん}？", "{困|こま}ったら{誰|だれ}に{相談|そうだん}するか"],
    elParentNote: "2024{年|ねん}、{高校|こうこう}・{大学生|だいがくせい}の{逮捕者|たいほしゃ}が{急増|きゅうぞう}。「{知|し}らなかった」は{裁判|さいばん}で{通用|つうよう}しません。{相談|そうだん}できる{関係|かんけい}を{今日|きょう}{作|つく}りましょう。",
    accentColor: "#16a34a",
  },
  ep32: {
    theme: "怪しい求人を見抜く",
    hook: "SNS・Instagram・求人サイト…闇バイトの入口はどこにでもある。本物の手口を使った3つの場面で、怪しいポイントを自分で見つけよう。",
    talkPoints: ["求人を見て怪しいと気づいたサインは何か", "友達から「いい仕事あるよ」と誘われたらどうするか", "怪しいと思ったら誰に相談するか"],
    parentNote: "闇バイトの入口はSNS・ゲーム・求人サイトなど日常的に使うサービスの中にあります。「高収入・簡単・スマホだけ」の募集を見たら必ず大人に相談するよう約束しましょう。",
    elTheme: "{怪|あや}しい{求人|きゅうじん}を{見抜|みぬ}く",
    elHook: "SNS・Instagram・{求人|きゅうじん}サイト…{闇|やみ}バイトの{入口|いりぐち}はどこにでもある。{本物|ほんもの}の{手口|てぐち}をつかった3つの{場面|ばめん}で、{怪|あや}しいポイントを{自分|じぶん}で{見|み}つけよう。",
    elTalkPoints: ["{求人|きゅうじん}を{見|み}て{怪|あや}しいと{気|き}づいたサインは{何|なに}か", "{友達|ともだち}から「いい{仕事|しごと}あるよ」と{誘|さそ}われたらどうするか", "{怪|あや}しいと{思|おも}ったら{誰|だれ}に{相談|そうだん}するか"],
    elParentNote: "{闇|やみ}バイトの{入口|いりぐち}はSNS・ゲーム・{求人|きゅうじん}サイトなど{日常|にちじょう}てきに{使|つか}うサービスの{中|なか}にあります。「{高収入|こうしゅうにゅう}・かんたん・スマホだけ」のぼしゅうを{見|み}たら{必|かなら}ず{大人|おとな}に{相談|そうだん}するよう{約束|やくそく}しましょう。",
    accentColor: "#16a34a",
  },
  ep4: {
    theme: "フィッシング詐欺体験",
    hook: "本物そっくりの偽サイトにIDとパスワードを入力してしまうと…アカウントが乗っ取られ、登録したクレジットカードで不正購入される。",
    talkPoints: ["「URLを必ず確認する」習慣を作ろう", "「急いで確認して」は詐欺のサイン", "怪しいと思ったらすぐ大人に相談"],
    parentNote: "2024年のフィッシング詐欺の報告件数は過去最多の約172万件（前年比1.44倍）。ゲームアカウントや通販サービスを装った偽サイトも急増しています。公式サイトをブックマーク登録し、メールやSMSのリンクは絶対に踏まないよう今日一緒に確認しましょう。出典：フィッシング対策協議会 2024年",
    elTheme: "フィッシング{詐欺|さぎ}{体験|たいけん}",
    elHook: "{本物|ほんもの}そっくりの{偽|にせ}サイトにIDとパスワードを{入力|にゅうりょく}してしまうと…アカウントが{乗|の}っ{取|と}られ、{登録|とうろく}したクレジットカードで{不正|ふせい}{購入|こうにゅう}される。",
    elTalkPoints: ["「URLを{必|かなら}ず{確認|かくにん}する」{習慣|しゅうかん}を{作|つく}ろう", "「{急|いそ}いで{確認|かくにん}して」は{詐欺|さぎ}のサイン", "{怪|あや}しいと{思|おも}ったらすぐ{大人|おとな}に{相談|そうだん}"],
    elParentNote: "2024{年|ねん}のフィッシング{詐欺|さぎ}の{報告|ほうこく}{件数|けんすう}は{過去最多|かこさいた}の{約|やく}172{万件|まんけん}（{前年比|ぜんねんひ}1.44{倍|ばい}）。ゲームアカウントや{通販|つうはん}サービスを{装|よそお}った{偽|にせ}サイトも{急増|きゅうぞう}しています。{公式|こうしき}サイトをブックマーク{登録|とうろく}し、メールやSMSのリンクは{絶対|ぜったい}に{踏|ふ}まないよう{今日|きょう}{一緒|いっしょ}に{確認|かくにん}しましょう。{出典|しゅってん}：フィッシング{対策|たいさく}{協議会|きょうぎかい} 2024{年|ねん}",
    accentColor: "#0ea5e9",
  },
  ep5: {
    theme: "ネットいじめ・傍観者",
    hook: "グループLINEで悪口が流れていた。「自分は書いていない」——でも、見ているだけもいじめに加担していることになります。",
    talkPoints: ["なぜ見ているだけもいじめになるか", "いじめを見たら誰に言うか", "もし自分が被害者になったら"],
    parentNote: "ネットいじめは24時間逃げ場がありません。子どもの様子の変化に気づいたら、まず話を聴いてあげましょう。",
    elTheme: "ネットいじめ・{傍観者|ぼうかんしゃ}",
    elHook: "グループLINEで{悪口|わるくち}が{流|なが}れていた。「{自分|じぶん}は{書|か}いていない」——でも、{見|み}ているだけもいじめに{加担|かたん}していることになります。",
    elTalkPoints: ["なぜ{見|み}ているだけもいじめになるか", "いじめを{見|み}たら{誰|だれ}に{言|い}うか", "もし{自分|じぶん}が{被害者|ひがいしゃ}になったら"],
    elParentNote: "ネットいじめは24{時間|じかん}{逃|に}げ{場|ば}がありません。{子|こ}どもの{様子|ようす}の{変化|へんか}に{気|き}づいたら、まず{話|はなし}を{聴|き}いてあげましょう。",
    accentColor: "#ec4899",
  },
  ep6: {
    theme: "肖像権・プライバシー侵害",
    hook: "友達とのいい写真が撮れた！でも、投稿する前に本人に許可は取りましたか？悪意がなくても、知らなかったでは済まないトラブルが増えています。",
    talkPoints: ["友達の写真を投稿する前に何を確認するか", "もし自分が投稿された側だったらどう思うか", "「いいよ」の範囲はどこまでか"],
    parentNote: "SNSでの無断投稿による損害賠償事例が増えています。「悪意がなかった」は法的に免責にならないことをお子さまと一緒に確認しましょう。",
    elTheme: "{肖像権|しょうぞうけん}・プライバシー{侵害|しんがい}",
    elHook: "{友達|ともだち}とのいい{写真|しゃしん}が{撮|と}れた！でも、{投稿|とうこう}する{前|まえ}に{本人|ほんにん}に{許可|きょか}は{取|と}りましたか？{悪意|あくい}がなくても、{知|し}らなかったでは{済|す}まないトラブルが{増|ふ}えています。",
    elTalkPoints: ["{友達|ともだち}の{写真|しゃしん}を{投稿|とうこう}する{前|まえ}に{何|なに}を{確認|かくにん}するか", "もし{自分|じぶん}が{投稿|とうこう}された{側|がわ}だったらどう{思|おも}うか", "「いいよ」の{範囲|はんい}はどこまでか"],
    elParentNote: "SNSでの{無断|むだん}{投稿|とうこう}による{損害賠償|そんがいばいしょう}{事例|じれい}が{増|ふ}えています。「{悪意|あくい}がなかった」は{法的|ほうてき}に{免責|めんせき}にならないことをお{子|こ}さまと{一緒|いっしょ}に{確認|かくにん}しましょう。",
    accentColor: "#f43f5e",
  },
  ep7: {
    theme: "SNSでの出会いトラブル・グルーミング",
    hook: "ゲームやSNSで知り合った「同い年の子」。でも本当に同い年ですか？写真も名前も年齢もビデオ通話も偽装できる時代に、子どもたちが狙われています。",
    talkPoints: ["SNSで知り合った人をどこまで信頼していいか", "「内緒にして」と言われたらどうするか", "困ったらすぐ相談できる大人は誰か"],
    parentNote: "SNSがきっかけの児童被害は年間1,000件超。被害者の多くが「まさか自分が」と思っていました。「怒らないから何でも話して」という信頼関係が最大の防御です。",
    elTheme: "SNSでの{出会|であ}いトラブル・グルーミング",
    elHook: "ゲームやSNSで{知|し}り{合|あ}った「{同|おな}い{年|どし}の{子|こ}」。でも{本当|ほんとう}に{同|おな}い{年|どし}ですか？{写真|しゃしん}も{名前|なまえ}も{年齢|ねんれい}もビデオ{通話|つうわ}も{偽装|ぎそう}できる{時代|じだい}に、{子|こ}どもたちが{狙|ねら}われています。",
    elTalkPoints: ["SNSで{知|し}り{合|あ}った{人|ひと}をどこまで{信頼|しんらい}していいか", "「{内緒|ないしょ}にして」と{言|い}われたらどうするか", "{困|こま}ったらすぐ{相談|そうだん}できる{大人|おとな}は{誰|だれ}か"],
    elParentNote: "SNSがきっかけの{児童被害|じどうひがい}は{年間|ねんかん}1000{件超|けんちょう}。{被害者|ひがいしゃ}の{多|おお}くが「まさか{自分|じぶん}が」と{思|おも}っていました。「{怒|おこ}らないから{何|なん}でも{話|はな}して」という{信頼|しんらい}{関係|かんけい}が{最大|さいだい}の{防御|ぼうぎょ}です。",
    accentColor: "#8b5cf6",
  },
};

function EpisodeIntroCard({ epKey, onStart }) {
  const ageMode = useAgeMode();
  const meta = EP_INTRO_META[epKey];
  if (!meta) { onStart(); return null; }
  const { theme, hook, talkPoints, parentNote, accentColor,
          elTheme, elHook, elTalkPoints, elParentNote } = meta;
  const dispTheme = ageMode === "elementary" ? (elTheme || theme) : theme;
  const dispHook  = ageMode === "elementary" ? (elHook  || hook)  : hook;
  const dispTalkPoints = ageMode === "elementary" ? (elTalkPoints || talkPoints) : talkPoints;
  const dispParentNote = ageMode === "elementary" ? (elParentNote || parentNote) : parentNote;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
      fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff",
      padding: "24px 20px",
    }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${accentColor}20`, border: `1px solid ${accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👨‍👩‍👧</div>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'DotGothic16',monospace", color: accentColor, letterSpacing: ".15em", marginBottom: 3 }}><RubyText text={ageMode === "elementary" ? "このエピソードを{始|はじ}める{前|まえ}に" : "このエピソードを始める前に"} /></div>
            <div style={{ fontSize: 15, fontWeight: 900 }}><RubyText text={dispTheme} /></div>
          </div>
        </div>

        {/* フック文 */}
        <div style={{ background: `${accentColor}0a`, border: `1px solid ${accentColor}33`, borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.8 }}>
            <RubyText text={dispHook} />
          </div>
        </div>

        {/* 話し合いポイント */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: ".1em" }}>
            <RubyText text={ageMode === "elementary" ? "💬 このエピソードの{話|はな}し{合|あ}いポイント" : "💬 このエピソードの話し合いポイント"} />
          </div>
          {dispTalkPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${accentColor}22`, border: `1px solid ${accentColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: accentColor, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)" }}><RubyText text={p} /></div>
            </div>
          ))}
        </div>

        {/* 保護者メモ */}
        <div style={{ background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: "#818cf8", marginBottom: 6, letterSpacing: ".05em" }}><RubyText text={ageMode === "elementary" ? "📊 {保護者|ほごしゃ}の{方|かた}へ" : "📊 保護者の方へ"} /></div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.75 }}><RubyText text={dispParentNote} /></div>
        </div>

        {/* スタートボタン */}
        <button onClick={() => { feedback("tap"); onStart(); }}
          style={{
            width: "100%", padding: 16,
            background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`,
            border: "none", borderRadius: 16, color: "#fff",
            fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 8px 28px ${accentColor}44`,
          }}>
          <RubyText text={ageMode === "elementary" ? "🛡️ {子|こ}どもと{一緒|いっしょ}に{体験|たいけん}する →" : "🛡️ 子どもと一緒に体験する →"} />
        </button>

        <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,.2)", textAlign: "center" }}>
          <RubyText text={ageMode === "elementary" ? `⏱ {所要時間|しょようじかん} {約|やく}8〜10{分|ふん} · {話|はな}し{合|あ}いポイント ${dispTalkPoints.length}つ` : `⏱ 所要時間 約8〜10分 · 話し合いポイント ${talkPoints.length}つ`} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 📦 EpisodeShell - 全EPに途中終了ボタンを追加するラッパー
// ═══════════════════════════════════════════════
function EpisodeShell({ onExit, children }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "fixed", top: 14, right: 14, zIndex: 200, display: "flex", gap: 8, alignItems: "center" }}>
        <LanguageSwitcher compact />
        <ExitButton onExit={onExit} />
      </div>
      {children}
    </div>
  );
}

function FishingTrap({ onClose }) {
  const [phase, setPhase] = useState("login"); // login|stolen|reveal
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [shaking, setShaking] = useState(false);
  const [stolenData, setStolenData] = useState({ id: "", pw: "" });

  const handleSubmit = () => {
    if (!inputId && !inputPw) { setShaking(true); setTimeout(() => setShaking(false), 600); return; }
    setStolenData({ id: inputId || "（未入力）", pw: inputPw || "（未入力）" });
    setPhase("stolen");
    setTimeout(() => setPhase("reveal"), 3200);
  };

  // ── 偽ログイン画面 ──
  if (phase === "login") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", fontFamily: "system-ui,-apple-system,sans-serif", display: "flex", flexDirection: "column" }}>
      <button onClick={() => { feedback("tap"); onClose(); }}
        style={{ position: "fixed", top: 14, left: 14, zIndex: 200, width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer", fontSize: 16, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        ←
      </button>
      {/* 本物そっくりのフェイクヘッダー */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#22c55e" }} />
        <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#22c55e", fontWeight: 700 }}>🔒</span>
          <span>accounts.g00gle.com/signin</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Googleロゴもどき */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -.5 }}>
            <span style={{ color: "#4285f4" }}>G</span>
            <span style={{ color: "#ea4335" }}>o</span>
            <span style={{ color: "#fbbc05" }}>o</span>
            <span style={{ color: "#4285f4" }}>g</span>
            <span style={{ color: "#34a853" }}>l</span>
            <span style={{ color: "#ea4335" }}>e</span>
          </div>
          <div style={{ fontSize: 22, color: "#1f2937", marginTop: 20, fontWeight: 400 }}>ログイン</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Googleアカウントを使用</div>
        </div>

        {/* フォーム */}
        <div style={{ width: "100%", maxWidth: 360, animation: shaking ? "shakeX .4s ease" : "none" }}>
          <input value={inputId} onChange={e => setInputId(e.target.value)}
            placeholder="メールアドレスまたは電話番号"
            style={{ width: "100%", padding: "14px 16px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 16, color: "#111827", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
          />
          <input value={inputPw} onChange={e => setInputPw(e.target.value)}
            type="password" placeholder="パスワードを入力"
            style={{ width: "100%", padding: "14px 16px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 16, color: "#111827", outline: "none", boxSizing: "border-box", marginBottom: 24 }}
          />
          <button onClick={handleSubmit}
            style={{ width: "100%", padding: "14px", background: "#1a73e8", border: "none", borderRadius: 4, color: "#fff", fontSize: 16, fontWeight: 500, cursor: "pointer" }}>
            次へ
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 1.7 }}>
          アカウントを作成 · ヘルプ · プライバシー · 規約
        </div>
      </div>
    </div>
  );

  // ── 盗まれた演出 ──
  if (phase === "stolen") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New',monospace", animation: "redPulse .5s infinite" }}>
      {/* スキャンライン */}
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(239,68,68,.6)", animation: "scanLine 1s linear infinite" }} />

      <div style={{ textAlign: "center", padding: 24, animation: "fadeInFast .3s ease" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "hackBlink .8s infinite" }}>⚠️</div>
        <div style={{ fontSize: 13, color: "#ef4444", letterSpacing: ".2em", marginBottom: 24, fontWeight: 700 }}>CREDENTIAL CAPTURED</div>

        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.5)", borderRadius: 8, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>// 送信完了：攻撃者サーバーへ</div>
          <div style={{ fontSize: 13, color: "#ef4444" }}>ID: <span style={{ color: "#fca5a5" }}>{stolenData.id}</span></div>
          <div style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>PW: <span style={{ color: "#fca5a5" }}>{stolenData.pw}</span></div>
          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 12, animation: "hackBlink .5s infinite" }}>送信中 ████████ 100%</div>
        </div>

        <div style={{ fontSize: 11, color: "#6b7280", animation: "hackBlink 1s .3s infinite" }}>
          接続元: 192.168.1.xxx → 攻撃者サーバー
        </div>
      </div>
    </div>
  );

  // ── 種明かし ──
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(180deg,#0d0d1a,#1a0a00)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 20px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn .5s ease" }}>🎣</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 8, animation: "slideUp .4s ease" }}>
          騙された！
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)", textAlign: "center", marginBottom: 28, lineHeight: 1.7, animation: "slideUp .4s .1s both ease" }}>
          これが<strong style={{ color: "#ffa940" }}>フィッシング詐欺</strong>の正体です
        </div>

        {/* 解説カード */}
        {[
          { icon: "🌐", title: "URLが違った", body: "「accounts.g00gle.com」の「o」が0（ゼロ）になっていた。本物はgoogle.com" },
          { icon: "⌨️", title: "入力した瞬間に盗まれる", body: "フィッシングサイトは入力フォームのデータをリアルタイムで攻撃者に送信する" },
          { icon: "🔒", title: "鍵マークは関係ない", body: "「https」や鍵マークは暗号化の証明。偽サイトでも取得できる。安全の証明ではない" },
          { icon: "💡", title: "正解の行動", body: "SMSやメールのリンクは踏まない。必ず公式アプリを直接開いて確認する" },
        ].map((c, i) => (
          <div key={i} style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 12, animation: `slideUp .4s ${.15 + i * .1}s both ease` }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.65 }}>{c.body}</div>
            </div>
          </div>
        ))}

        <div style={{ background: "rgba(255,169,64,.08)", border: "1px solid rgba(255,169,64,.3)", borderRadius: 12, padding: "12px 16px", width: "100%", marginBottom: 20, fontSize: 12, color: "#ffd28a", textAlign: "center", lineHeight: 1.7, animation: "slideUp .4s .6s both ease" }}>
          🎮 隠しコマンドを発見！<br />EP4「フィッシング詐欺」も体験してみよう
        </div>

        <button onClick={onClose}
          style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#ffa940,#ff6b00)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .4s .7s both ease" }}>
          閉じる
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🎮 隠しコマンド② マトリックス風ハッキング演出
// トリガー：ホームのロゴを3秒長押し
// ═══════════════════════════════════════════════
function MatrixHack({ onClose }) {
  const [phase, setPhase] = useState("glitch"); // glitch|matrix|reveal
  const [lines, setLines] = useState([]);
  const fakeIP = `203.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
  const fakeUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)";

  useEffect(() => {
    // グリッチ → マトリックス
    const t1 = setTimeout(() => setPhase("matrix"), 1200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "matrix") return;
    // マトリックス文字を順番に表示
    const msgs = [
      "$ Initializing breach protocol...",
      `> TARGET_IP: ${fakeIP}`,
      `> USER_AGENT: ${fakeUA}`,
      "> Scanning open ports... [80, 443, 22, 3306]",
      "> PORT 443: OPEN ████████ 100%",
      "> Accessing camera feed...",
      "> Camera: FOUND (front-facing 12MP)",
      "> Accessing microphone...",
      "> Microphone: FOUND",
      "> Reading contacts... [247 entries]",
      "> Reading location data...",
      `> GPS: 35.6°N 139.7°E (${new Date().toLocaleString("ja-JP")})`,
      "> Extracting stored passwords...",
      "> Passwords: 12 found",
      "> Upload complete: 47.3MB → remote.server.xyz",
      "> BREACH SUCCESSFUL",
      "",
      "──────────────────────────",
      "...というのが攻撃者がやること。",
      "でも、これは全部フィクションです。",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i >= msgs.length) { clearInterval(iv); setTimeout(() => setPhase("reveal"), 1500); return; }
      setLines(prev => [...prev, msgs[i++]]);
    }, 160);
    return () => clearInterval(iv);
  }, [phase]);

  // ── グリッチ ──
  if (phase === "glitch") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", animation: "glitch1 .15s infinite" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,.8)", animation: "glitch2 .15s .05s infinite" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 60, animation: "shakeX .1s infinite" }}>🛡️</div>
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, height: `${Math.random() * 4 + 1}px`, top: `${Math.random() * 100}%`, background: ["#fff","#f00","#0f0","#00f"][i%4], opacity: .8, animation: `glitch${i%2+1} .${Math.floor(Math.random()*3+1)}s infinite` }} />
      ))}
    </div>
  );

  // ── マトリックス端末 ──
  if (phase === "matrix") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", fontFamily: "'Courier New',monospace", padding: "20px 16px", overflowY: "auto" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "#00ff41", marginBottom: 12, animation: "hackBlink 1s infinite" }}>
          ■ SYSTEM COMPROMISED — DO NOT PANIC
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontSize: 12, lineHeight: 1.8,
            color: line.startsWith(">") ? "#00ff41" : line.startsWith("$") ? "#fff" : line.startsWith("──") ? "#333" : line.includes("SUCCESSFUL") ? "#ff4444" : line.includes("フィクション") ? "#ffd700" : "#4ade80",
            animation: "fadeInFast .1s ease",
          }}>
            {line}
          </div>
        ))}
        <div style={{ display: "inline-block", width: 8, height: 14, background: "#00ff41", animation: "hackBlink .7s infinite", marginTop: 4 }} />
      </div>
    </div>
  );

  // ── 種明かし ──
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(180deg,#000,#0a0a14)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", overflow: "auto" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: "popIn .5s ease" }}>💻</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#00ff41", marginBottom: 6 }}>種明かし</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
            さっきの画面はフィクションです。<br />でも、本物の攻撃はもっと静かに起きる。
          </div>
        </div>

        {[
          { icon: "📍", color: "#ffa940", title: "IPアドレスは本当に取れる", body: "あなたのスマホがサイトにアクセスした瞬間、IPアドレスは相手のサーバーに記録される。大まかな地域はわかる。" },
          { icon: "📸", color: "#ec4899", title: "カメラ・マイクは許可しないと使えない", body: "ただし「このサイトがカメラを使いたい」という許可ダイアログが出たら、絶対に拒否して。" },
          { icon: "🔑", color: "#06b6d4", title: "パスワードは本当に盗まれる", body: "フィッシングサイトに入力した瞬間、実際に攻撃者に届く。「https」でも安全ではない。" },
          { icon: "🛡️", color: "#4ade80", title: "防ぐのは簡単", body: "公式アプリを使う。SMSのURLは踏まない。これだけで99%の攻撃は防げる。" },
        ].map((c, i) => (
          <div key={i} style={{ background: `${c.color}0a`, border: `1px solid ${c.color}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 12, animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: c.color, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>{c.body}</div>
            </div>
          </div>
        ))}

        <div style={{ background: "rgba(0,255,65,.06)", border: "1px solid rgba(0,255,65,.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "#4ade80", textAlign: "center", lineHeight: 1.7, animation: "slideUp .4s .5s both ease" }}>
          🎮 隠しコマンドを発見！<br />ロゴを長押しするといつでも見られるよ
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#00ff41,#00c030)", border: "none", borderRadius: 14, color: "#000", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .4s .6s both ease" }}>
          閉じる
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🎮 隠しコマンド③ 闇Web依頼体験
// トリガー：ホーム画面を左右左右左と5回スワイプ
// ═══════════════════════════════════════════════
function DarkWebMission({ onClose }) {
  const [phase, setPhase] = useState("connect"); // connect|mission|choice|reveal
  const [connectStep, setConnectStep] = useState(0);
  const [choice, setChoice] = useState(null);

  const connectMsgs = [
    "Tor Browser 起動中...",
    "匿名ネットワークに接続中...",
    "ノード1: Frankfurt ██████ OK",
    "ノード2: Singapore ██████ OK",
    "ノード3: São Paulo ██████ OK",
    "接続完了。あなたの身元は隠されています。",
    "",
    "■ 非公開掲示板にアクセスしています...",
  ];

  useEffect(() => {
    if (phase !== "connect") return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setConnectStep(i);
      if (i >= connectMsgs.length) { clearInterval(iv); setTimeout(() => setPhase("mission"), 800); }
    }, 400);
    return () => clearInterval(iv);
  }, [phase]);

  // ── 接続中 ──
  if (phase === "connect") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", fontFamily: "'Courier New',monospace", padding: "40px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "#7c3aed", marginBottom: 20, animation: "hackBlink 1s infinite", letterSpacing: ".2em" }}>
          ■ DARKWEB BROWSER v3.1.4
        </div>
        {connectMsgs.slice(0, connectStep).map((msg, i) => (
          <div key={i} style={{ fontSize: 12, color: msg === "" ? "transparent" : msg.includes("OK") ? "#00ff41" : msg.includes("完了") ? "#ffd700" : "#a78bfa", lineHeight: 1.9, animation: "fadeInFast .2s ease" }}>
            {msg}
          </div>
        ))}
        <div style={{ display: "inline-block", width: 8, height: 14, background: "#7c3aed", animation: "hackBlink .6s infinite" }} />
      </div>
    </div>
  );

  // ── 依頼画面 ──
  if (phase === "mission") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#060010", fontFamily: "'Courier New',monospace", color: "#a78bfa", overflow: "auto", animation: "darkWebFlicker 8s infinite" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px" }}>
        {/* フェイクURL */}
        <div style={{ background: "#0d001a", border: "1px solid #3b0066", borderRadius: 6, padding: "6px 12px", marginBottom: 16, fontSize: 10, color: "#6b21a8" }}>
          onion://xn--darkjob-2k4f.onion/board/request/2847
        </div>

        <div style={{ fontSize: 10, color: "#6b21a8", marginBottom: 16, letterSpacing: ".15em" }}>
          ■ 匿名依頼掲示板 — 最終閲覧：47分前 — 応募者：12人
        </div>

        {/* 依頼カード */}
        <div style={{ background: "#0d001a", border: "1px solid #4c0099", borderRadius: 12, padding: "18px 16px", marginBottom: 14, animation: "darkWebFlicker 5s 2s infinite" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#7c3aed", letterSpacing: ".1em" }}>依頼 #2847 · 高額報酬</div>
            <div style={{ fontSize: 11, color: "#ffd700", fontWeight: 700 }}>日払い ¥50,000</div>
          </div>
          <div style={{ fontSize: 14, color: "#e9d5ff", fontWeight: 700, marginBottom: 12, lineHeight: 1.5 }}>
            【緊急】スマホを使った簡単な作業<br />場所不問・身バレなし
          </div>
          <div style={{ fontSize: 12, color: "#9333ea", lineHeight: 1.85 }}>
            • 指定の口座にATMで振り込むだけ<br />
            • 荷物の受け取り（中身の確認不要）<br />
            • 必要なのはスマホと身分証のみ<br />
            • 即日払い・週払い対応<br />
            • 詳細はDMで。身バレ一切なし。
          </div>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "#1a0033", borderRadius: 8, fontSize: 11, color: "#7c3aed" }}>
            ⚠️ このメッセージは48時間後に自動削除されます
          </div>
        </div>

        {/* 選択 */}
        <div style={{ fontSize: 12, color: "#9333ea", marginBottom: 12, textAlign: "center" }}>この依頼に応募しますか？</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setChoice("yes"); setPhase("choice"); }}
            style={{ flex: 1, padding: "14px", background: "#3b0066", border: "1px solid #7c3aed", borderRadius: 10, color: "#e9d5ff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            応募する
          </button>
          <button onClick={() => { setChoice("no"); setPhase("choice"); }}
            style={{ flex: 1, padding: "14px", background: "#0d001a", border: "1px solid #4c0099", borderRadius: 10, color: "#9333ea", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            断る
          </button>
        </div>
      </div>
    </div>
  );

  // ── 選択後 ──
  if (phase === "choice") return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", fontFamily: "'Courier New',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 20, animation: "fadeInFast .3s ease" }}>
        {choice === "yes" ? (
          <>
            <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: ".2em", marginBottom: 16, animation: "hackBlink .5s infinite" }}>
              !! 警告 — 取引を開始しています
            </div>
            <div style={{ fontSize: 12, color: "#ef4444", lineHeight: 2 }}>
              あなたの端末情報を送信中...<br />
              身元確認書類の提出を要求中...<br />
              <span style={{ animation: "hackBlink .5s infinite" }}>接続を確立しています...</span>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: "#4ade80", lineHeight: 2 }}>
            正しい判断です。<br />
            <span style={{ animation: "hackBlink .8s infinite" }}>種明かし画面を表示しています...</span>
          </div>
        )}
      </div>
      {/* 2秒後に種明かし */}
      {setTimeout(() => setPhase("reveal"), 2000) && null}
    </div>
  );

  // ── 種明かし ──
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(180deg,#0a0a14,#0d0518)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", overflow: "auto" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: "popIn .5s ease" }}>⚠️</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
            {choice === "yes" ? "一歩踏み出すところだった" : "正しい判断！"}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
            これが<strong style={{ color: "#a78bfa" }}>闇バイト</strong>の実際の入口です
          </div>
        </div>

        {choice === "yes" && (
          <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#f87171", marginBottom: 6 }}>「応募」を選んだ場合の現実</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
              身分証を送った時点で、個人情報が犯罪グループに渡る。「やっぱり断る」と言っても、「個人情報をバラまくぞ」と脅されて逃げられなくなる。
            </div>
          </div>
        )}

        {[
          { icon: "🕶️", color: "#a78bfa", title: "「匿名」は嘘", body: "Torや闇サイトを使っても、警察はIPアドレスや取引記録から特定できる。2023〜2024年に実際に逮捕者が続出。" },
          { icon: "💰", color: "#fbbf24", title: "高額報酬は罠", body: "合法で即日5万円は存在しない。この金額は「犯罪リスクを取らせるための対価」として設定されている。" },
          { icon: "🔒", color: "#f43f5e", title: "一度入ったら出られない", body: "「やっぱりやめる」と言うと、送った個人情報・写真を使って脅迫される。自力では抜け出せない構造になっている。" },
          { icon: "📞", color: "#4ade80", title: "相談すれば助けられる", body: "#9110（警察相談）や弁護士への相談は、巻き込まれてしまった後でも有効。一人で抱えないで。" },
        ].map((c, i) => (
          <div key={i} style={{ background: `${c.color}0a`, border: `1px solid ${c.color}33`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 12, animation: `slideUp .4s ${i * .1}s both ease` }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: c.color, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}>{c.body}</div>
            </div>
          </div>
        ))}

        <div style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "#c4b5fd", textAlign: "center", lineHeight: 1.7, animation: "slideUp .4s .5s both ease" }}>
          🎮 隠しコマンドを発見！<br />EP3「断れなくなる前に」も体験してみよう
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .4s .6s both ease" }}>
          閉じる
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🎮 隠しコマンド④ 保護者専用詳細ダッシュボード
// トリガー：保護者レポートボタンを5秒長押し
// ═══════════════════════════════════════════════
function ParentSecretDashboard({ onClose }) {
  const record = (() => { try { return JSON.parse(localStorage.getItem("mamoru_progress_v1") || "{}"); } catch { return {}; } })();
  const keywords = (() => { try { return JSON.parse(localStorage.getItem("mamoru_keywords_v1") || "[]"); } catch { return []; } })();
  const weekStr = getWeekNumber();
  const weeklyResult = (() => { try { return JSON.parse(localStorage.getItem(`mamoru_weekly_result_${weekStr}`) || "[]"); } catch { return []; } })();

  const epKeys = ["ep1","ep2","ep3","ep4","ep5","ep6","ep7"];
  const completedEps = epKeys.filter(k => record[k]?.completed);
  const totalTime = epKeys.reduce((sum, k) => sum + (record[k]?.time || 0), 0);
  const totalRetries = epKeys.reduce((sum, k) => sum + (record[k]?.retries || 0), 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(180deg,#0c1022,#070d1a)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", overflow: "auto" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
          <div>
            <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".2em" }}>🔐 PARENT ONLY</div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>詳細ダッシュボード</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,.3)", fontFamily: "'DotGothic16',monospace" }}>SECRET</div>
        </div>

        {/* 総合サマリー */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { label: "クリア済みEP", val: `${completedEps.length}/7`, icon: "✅", color: "#4ade80" },
            { label: "今週のチャレンジ", val: `${weeklyResult.filter(r=>r.correct).length}/${weeklyResult.length}問`, icon: "🔥", color: "#ffa940" },
            { label: "記録ワード数", val: `${keywords.length}語`, icon: "📖", color: "#7c3aed" },
            { label: "総リトライ数", val: `${totalRetries}回`, icon: "🔄", color: "#06b6d4" },
          ].map((s, i) => (
            <div key={i} style={{ background: `${s.color}08`, border: `1px solid ${s.color}33`, borderRadius: 14, padding: "14px 12px", animation: `popIn .4s ${i*.1}s both ease` }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'DotGothic16',monospace" }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* EP別詳細 */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: ".1em" }}>📊 EP別 詳細データ</div>
          {epKeys.map((k, i) => {
            const r = record[k];
            const meta = { ep1:"個人情報・位置情報", ep2:"フェイクニュース", ep3:"闇バイト・詐欺", ep4:"フィッシング・なりすまし", ep5:"ネットいじめ", ep6:"肖像権", ep7:"SNS出会いトラブル" };
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < 6 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ fontSize: 14 }}>{r?.completed ? "✅" : "⬜"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: r?.completed ? "#fff" : "rgba(255,255,255,.4)", fontWeight: r?.completed ? 700 : 400 }}>EP{i+1} {meta[k]}</div>
                  {r?.completed && <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>スコア {r.score || "–"} · リトライ {r.retries || 0}回</div>}
                </div>
                {r?.speedBonus && <div style={{ fontSize: 10, background: "#f97316", borderRadius: 99, padding: "2px 7px", color: "#fff", fontWeight: 700 }}>⚡速</div>}
              </div>
            );
          })}
        </div>

        {/* 自分の言葉 */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: ".1em" }}>✍️ 子どもが書いた言葉</div>
          {epKeys.map(k => {
            let saved = ""; try { saved = localStorage.getItem(`mamoru_mywords_${k}`) || ""; } catch {}
            if (!saved) return null;
            return (
              <div key={k} style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,.75)", lineHeight: 1.7, fontStyle: "italic", borderLeft: "3px solid rgba(124,58,237,.5)" }}>
                EP{epKeys.indexOf(k)+1}：「{saved}」
              </div>
            );
          })}
        </div>

        {/* 覚えたキーワード */}
        {keywords.length > 0 && (
          <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: ".1em" }}>📖 記録済みキーワード ({keywords.length}語)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {keywords.map((kw, i) => (
                <div key={i} style={{ background: "rgba(124,58,237,.15)", border: "1px solid rgba(124,58,237,.3)", borderRadius: 99, padding: "4px 10px", fontSize: 11, color: "#c4b5fd" }}>{kw.emoji} {kw.word}</div>
              ))}
            </div>
          </div>
        )}

        {/* EP1-2 保護者限定コンテンツの合言葉 */}
        <div style={{ background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(220,38,38,.9)", marginBottom: 10, letterSpacing: ".1em" }}>🔐 保護者限定コンテンツ</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7, margin: "0 0 10px" }}>
            「EP1-2 個人情報の特定体験」は、悪意ある人物の視点から個人情報が特定される過程を体験するシミュレーションです。お子さんと一緒に確認する前に、まず保護者が体験してください。
          </p>
          <div style={{ background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🔑</span>
            <div>
              <div style={{ fontSize: 10, color: "rgba(220,38,38,.8)", fontWeight: 700, marginBottom: 2 }}>合言葉</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fca5a5", letterSpacing: ".1em", fontFamily: "'DotGothic16',monospace" }}>さくら</div>
            </div>
          </div>
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          閉じる
        </button>
      </div>
    </div>
  );
}

function Opening({ onComplete }) {
  const ageMode = useAgeMode();
  const [screen, setScreen] = useState(0);
  const [tutIdx, setTutIdx] = useState(0);
  const [ageSelected, setAgeSelected] = useState(null);
  const { setAgeMode } = useContext(AgeModeContext);
  // 0=splash 1=stats 2=howto 3=age 4=cta

  const next = () => setScreen(s => s + 1);

  // ── Splash（保護者への呼びかけ） ──
  if (screen === 0) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
      fontFamily: "'Zen Maru Gothic',sans-serif",
    }}>
      {/* 背景の光 */}
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,169,64,.08),transparent)", top: -100, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,.06),transparent)", bottom: -50, right: -50, pointerEvents: "none" }} />

      {/* シールドロゴ */}
      <div style={{ animation: "logoReveal .9s cubic-bezier(.34,1.56,.64,1) both", marginBottom: 24 }}>
        <div style={{
          width: 90, height: 90, borderRadius: 26,
          background: "linear-gradient(135deg,#ffa940,#ff6b00)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, boxShadow: "0 0 40px rgba(255,169,64,.4), 0 8px 32px rgba(0,0,0,.4)",
          animation: "glowPulse 2.5s ease-in-out infinite",
        }}>🛡️</div>
      </div>

      {/* キャッチコピー */}
      <div style={{ animation: "slideUp .6s .3s both ease", textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".5em", marginBottom: 12 }}>
          SNS LITERACY APP
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 12 }}>マモル</div>
        <div style={{
          background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 14, padding: "14px 20px",
          fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.85,
          textAlign: "center",
        }}>
          <RubyText text={ageMode === "elementary" ? "お{子|こ}さまの" : "お子さまの"} /><strong style={{ color: "#ffa940" }}>スマホ・SNS</strong><RubyText text={ageMode === "elementary" ? "が<br />{心配|しんぱい}になったことはありませんか？" : "が<br />心配になったことはありませんか？"} /><br />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            <RubyText text={ageMode === "elementary" ? "{親子|おやこ}で5〜10{分|ふん}、{一緒|いっしょ}に{体験|たいけん}するアプリです" : "親子で5〜10分、一緒に体験するアプリです"} />
          </span>
        </div>
      </div>

      <div style={{ animation: "popIn .5s .7s both ease" }}>
        <button onClick={() => { feedback("tap"); next(); }} style={{
          background: "linear-gradient(135deg,#ffa940,#ff6b00)",
          border: "none", borderRadius: 99,
          padding: "16px 48px", fontSize: 16, fontWeight: 900,
          color: "#fff", cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 8px 28px rgba(255,169,64,.45)",
        }}>
          <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}の{方|かた}へ →" : "保護者の方へ →"} />
        </button>
      </div>
    </div>
  );

  // ── 統計（なぜ今必要か） ──
  if (screen === 1) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
      fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes mamBarH { from { width: 0; } to { width: var(--w); } }
        @keyframes mamBarV { from { height: 0; } to { height: var(--h); } }
      `}</style>

      {/* 上部インジケーター */}
      <div style={{ padding: "20px 24px 0", display: "flex", gap: 6 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? "#ffa940" : "rgba(255,255,255,.15)", transition: "background .3s" }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: "24px 24px 0", overflowY: "auto" }}>
        <div style={{ animation: "slideUp .5s ease", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#ffa940", fontWeight: 700, marginBottom: 8, letterSpacing: ".05em" }}>
            <RubyText text={ageMode === "elementary" ? "なぜ{今|いま}、{必要|ひつよう}なのか" : "なぜ今、必要なのか"} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>
            <RubyText text={ageMode === "elementary" ? "{子|こ}どものSNS{被害|ひがい}は<br />{急増|きゅうぞう}しています" : "子どものSNS被害は<br />急増しています"} />
          </div>
        </div>

        {/* グラフ1: SNS接触経路（積み上げ横棒） */}
        <div style={{ background: "rgba(255,255,255,.06)", border: "0.5px solid rgba(255,255,255,.15)", borderRadius: 14, padding: 14, marginBottom: 12, animation: "slideUp .5s .1s both ease" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 6, lineHeight: 1.6 }}>
            📱 SNSきっかけの児童犯罪被害の接触経路（警察庁・2024年 計1,486人）
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#378ADD", marginBottom: 10 }}>
            InstagramとXで約60%
          </div>
          <div style={{ height: 36, borderRadius: 8, overflow: "hidden", display: "flex", marginBottom: 8 }}>
            {[
              { w: "32%", bg: "#185FA5",               fc: "#E6F1FB",                label: "Instagram 32%" },
              { w: "28%", bg: "#378ADD",               fc: "#E6F1FB",                label: "X 28%" },
              { w: "33%", bg: "rgba(55,138,221,.25)",  fc: "rgba(55,138,221,.8)",    label: "TikTok等 33%" },
              { w: "7%",  bg: "rgba(255,255,255,.08)", fc: "rgba(255,255,255,.4)",   label: "" },
            ].map((s, i) => (
              <div key={i} style={{
                "--w": s.w, width: s.w, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: s.fc,
                overflow: "hidden", whiteSpace: "nowrap",
                animation: `mamBarH 1s cubic-bezier(.4,0,.2,1) ${i * .1}s both`,
              }}>{s.label}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginBottom: 8 }}>
            {[
              { color: "#185FA5",              text: "Instagram：約32%" },
              { color: "#378ADD",              text: "X（旧Twitter）：約28%" },
              { color: "rgba(55,138,221,.5)",  text: "TikTok等：約33%" },
              { color: "rgba(255,255,255,.3)", text: "ゲーム等：約7%（98人）" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color, flexShrink: 0 }} />
                {l.text}
              </div>
            ))}
          </div>
          <div style={{ borderLeft: "3px solid #378ADD", background: "rgba(55,138,221,.08)", padding: "7px 10px", fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
            <RubyText text={ageMode === "elementary"
              ? "SNSだけでなく、ゲーム{経由|けいゆ}も98{人|にん}・{増加|ぞうか}{傾向|けいこう}。{普段|ふだん}{使|つか}いのアプリが{危険|きけん}への{入口|いりぐち}になっています。"
              : "SNSだけでなく、ゲーム経由も98人・増加傾向。普段使いのアプリが危険への入口になっています。"
            } />
          </div>
        </div>

        {/* グラフ2: 闇バイト年代（積み上げ横棒） */}
        <div style={{ background: "rgba(255,255,255,.06)", border: "0.5px solid rgba(255,255,255,.15)", borderRadius: 14, padding: 14, marginBottom: 12, animation: "slideUp .5s .2s both ease" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 6, lineHeight: 1.6 }}>
            🕶️ 闇バイト保護者の年代（警察庁・2024年 計544件）
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#ef4444", marginBottom: 10 }}>
            10〜20代が約70%を占める
          </div>
          <div style={{ height: 36, borderRadius: 8, overflow: "hidden", display: "flex", marginBottom: 8 }}>
            {[
              { w: "25%", bg: "#E24B4A",               fc: "#FCEBEB",               label: "10代 25%" },
              { w: "45%", bg: "#A32D2D",               fc: "#FCEBEB",               label: "20代 45%" },
              { w: "14%", bg: "rgba(255,255,255,.15)", fc: "rgba(255,255,255,.5)",  label: "30代 14%" },
              { w: "16%", bg: "rgba(255,255,255,.07)", fc: "rgba(255,255,255,.3)",  label: "40代〜" },
            ].map((s, i) => (
              <div key={i} style={{
                "--w": s.w, width: s.w, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: s.fc,
                overflow: "hidden", whiteSpace: "nowrap",
                animation: `mamBarH 1s cubic-bezier(.4,0,.2,1) ${i * .1}s both`,
              }}>{s.label}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginBottom: 8 }}>
            {[
              { color: "#E24B4A",              text: "10代：約25%" },
              { color: "#A32D2D",              text: "20代：約45%" },
              { color: "rgba(255,255,255,.2)", text: "30代：約14%" },
              { color: "rgba(255,255,255,.1)", text: "40代〜：約16%" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color, flexShrink: 0 }} />
                {l.text}
              </div>
            ))}
          </div>
          <div style={{ borderLeft: "3px solid #ef4444", background: "rgba(239,68,68,.08)", padding: "7px 10px", fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
            <RubyText text={ageMode === "elementary"
              ? "「スマホだけでできるバイト」として{若者|わかもの}が{狙|ねら}われています。"
              : "「スマホだけでできるバイト」として若者が狙われています。"
            } />
          </div>
        </div>

        {/* グラフ3: ネットいじめ推移（縦棒） */}
        <div style={{ background: "rgba(255,255,255,.06)", border: "0.5px solid rgba(255,255,255,.15)", borderRadius: 14, padding: 14, marginBottom: 16, animation: "slideUp .5s .3s both ease" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 6 }}>
            ⚠️ ネットいじめ認知件数（文部科学省）
          </div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#ffa940", marginBottom: 10 }}>
            5年間で約38%増加・毎年過去最多を更新
          </div>
          {/* 過去最多ラベル行 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            {["", "", "", "", "▲ 過去最多"].map((lbl, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#ffa940", fontWeight: 900, height: 14 }}>{lbl}</div>
            ))}
          </div>
          {/* 縦棒 */}
          <div style={{ height: 100, display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
            {[
              { h: "72.6%", bg: "rgba(255,169,64,.2)" },
              { h: "76.5%", bg: "rgba(255,169,64,.4)" },
              { h: "88.8%", bg: "rgba(255,169,64,.6)" },
              { h: "97.0%", bg: "rgba(255,169,64,.8)" },
              { h: "100%",  bg: "#ffa940" },
            ].map((b, i) => (
              <div key={i} style={{
                "--h": b.h, flex: 1, height: b.h, background: b.bg,
                borderRadius: "4px 4px 0 0",
                animation: `mamBarV 1s cubic-bezier(.4,0,.2,1) ${i * .15}s both`,
              }} />
            ))}
          </div>
          {/* 年・件数ラベル */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {[
              { year: "2019", val: "17,924", hi: false },
              { year: "2020", val: "18,870", hi: false },
              { year: "2021", val: "21,900", hi: false },
              { year: "2022", val: "23,920", hi: false },
              { year: "2023", val: "24,678", hi: true },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, fontWeight: b.hi ? 900 : 400, color: b.hi ? "#ffa940" : "rgba(255,255,255,.3)" }}>{b.year}</div>
                <div style={{ fontSize: 8, color: b.hi ? "#ffa940" : "rgba(255,255,255,.3)" }}>{b.val}</div>
              </div>
            ))}
          </div>
          <div style={{ borderLeft: "3px solid #ffa940", background: "rgba(255,169,64,.08)", padding: "7px 10px", fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}>
            <RubyText text={ageMode === "elementary"
              ? "2019{年|ねん}の{約|やく}1.8{万件|まんけん}から2023{年|ねん}には{約|やく}2.5{万件|まんけん}へ。5{年間|ねんかん}で{約|やく}38%{増加|ぞうか}し、{毎年|まいとし}{過去|かこ}{最多|さいた}を{更新|こうしん}しています。"
              : "2019年の約1.8万件から2023年には約2.5万件へ。5年間で約38%増加し、毎年過去最多を更新しています。"
            } />
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px 32px" }}>
        <button onClick={() => { feedback("tap"); next(); }} style={{
          width: "100%", padding: 15,
          background: "linear-gradient(135deg,#ffa940,#ff6b00)",
          border: "none", borderRadius: 16, color: "#fff",
          fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 8px 24px rgba(255,169,64,.35)",
        }}>
          <RubyText text={ageMode === "elementary" ? "このアプリの{使|つか}い{方|かた} →" : "このアプリの使い方 →"} />
        </button>
      </div>
    </div>
  );

  // ── 使い方（3ステップ） ──
  if (screen === 2) {
    const steps = [
      {
        num: "01", icon: "👨‍👩‍👧", color: "#ffa940",
        title: "親子で隣に座る",
        body: "お子さまと一緒に同じ画面を見ながら進めてください。\n一人で進めても構いませんが、隣に座ることで「話し合い」が自然に生まれます。",
        tip: "💡 所要時間は1エピソード約8〜10分",
        elTitle: "{親子|おやこ}で{隣|となり}に{座|すわ}る",
        elBody: "お{子|こ}さまと{一緒|いっしょ}に{同|おな}じ{画面|がめん}を{見|み}ながら{進|すす}めてください。<br />{一人|ひとり}で{進|すす}めても{構|かま}いませんが、{隣|となり}に{座|すわ}ることで「{話|はな}し{合|あ}い」が{自然|しぜん}に{生|う}まれます。",
        elTip: "💡 {所要時間|しょようじかん}は1エピソード{約|やく}8〜10{分|ふん}",
        img: "/images/opening/step1.jpg",
        imgAlt: "親子でタブレットを一緒に見ている様子",
      },
      {
        num: "02", icon: "😱", color: "#ec4899",
        title: "体験→驚く→話し合う",
        body: "各エピソードにはリアルな「疑似体験」があります。\n体験後に「怖かった？」「どう思う？」と話しかけてみてください。",
        tip: "💡 大人が見ても「知らなかった」と驚く内容です",
        elTitle: "{体験|たいけん}→{驚|おどろ}く→{話|はな}し{合|あ}う",
        elBody: "{各|かく}エピソードにはリアルな「{疑似体験|ぎじたいけん}」があります。<br />{体験後|たいけんご}に「{怖|こわ}かった？」「どう{思|おも}う？」と{話|はな}しかけてみてください。",
        elTip: "💡 {大人|おとな}が{見|み}ても「{知|し}らなかった」と{驚|おどろ}く{内容|ないよう}です",
        img: "/images/opening/step2.jpg",
        imgAlt: "親子が真剣にタブレットを見ている様子",
      },
      {
        num: "03", icon: "📖", color: "#7c3aed",
        title: "キーワードを一緒に覚える",
        body: "トクリュウ・グルーミング・スミッシング…\nニュースに出てくる言葉を親子で覚えて、日常の話題にしましょう。",
        tip: "💡 キーワードノートに記録して後から見返せます",
        elTitle: "キーワードを{一緒|いっしょ}に{覚|おぼ}える",
        elBody: "トクリュウ・グルーミング・スミッシング…<br />ニュースに{出|で}てくる{言葉|ことば}を{親子|おやこ}で{覚|おぼ}えて、{日常|にちじょう}の{話題|わだい}にしましょう。",
        elTip: "💡 キーワードノートに{記録|きろく}して{後|あと}から{見返|みかえ}せます",
        img: "/images/opening/step3.jpg",
        imgAlt: "親子がソファで話し合っている様子",
      },
    ];
    const step = steps[tutIdx];
    const isLast = tutIdx === steps.length - 1;

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
        fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff",
        display: "flex", flexDirection: "column",
      }}>
        {/* インジケーター */}
        <div style={{ padding: "20px 24px 0", display: "flex", gap: 6 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#ffa940" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>

        <div style={{ flex: 1, padding: "28px 24px 0" }}>
          {/* ステップ番号タブ */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setTutIdx(i)}
                style={{
                  flex: 1, padding: "6px 4px",
                  background: i === tutIdx ? step.color : "rgba(255,255,255,.06)",
                  border: `1px solid ${i === tutIdx ? step.color : "rgba(255,255,255,.1)"}`,
                  borderRadius: 8, color: i === tutIdx ? "#fff" : "rgba(255,255,255,.4)",
                  fontSize: 11, fontWeight: i === tutIdx ? 900 : 400,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                STEP {s.num}
              </button>
            ))}
          </div>

          {/* ステップ内容 */}
          <div key={tutIdx} style={{ animation: "slideCard .35s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${step.color}20`, border: `1.5px solid ${step.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              }}>{step.icon}</div>
              <div>
                <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: step.color, letterSpacing: ".15em", marginBottom: 4 }}>
                  STEP {step.num}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}><RubyText text={ageMode === "elementary" ? (step.elTitle || step.title) : step.title} /></div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
                {ageMode === "elementary" && (step.elBody || step.body)
                  ? <RubyText text={step.elBody || step.body} />
                  : step.body}
              </p>
            </div>

            <div style={{ background: `${step.color}0a`, border: `1px solid ${step.color}22`, borderRadius: 12, padding: "11px 14px", fontSize: 12, color: `${step.color}cc`, lineHeight: 1.7 }}>
              <RubyText text={ageMode === "elementary" ? (step.elTip || step.tip) : step.tip} />
            </div>
            {step.img && (
              <img
                src={step.img}
                alt={step.imgAlt}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  display: "block",
                  marginTop: 10,
                }}
              />
            )}
          </div>
        </div>

        {/* ナビ */}
        <div style={{ padding: "20px 24px 32px", display: "flex", gap: 10 }}>
          {tutIdx > 0 && (
            <button onClick={() => { feedback("tap"); setTutIdx(t => t - 1); }}
              style={{ flex: 1, padding: 14, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, color: "rgba(255,255,255,.6)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ← 戻る
            </button>
          )}
          <button onClick={() => { feedback("tap"); isLast ? next() : setTutIdx(t => t + 1); }}
            style={{ flex: 2, padding: 15, background: `linear-gradient(135deg,${step.color},${step.color}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${step.color}44` }}>
            <RubyText text={isLast ? (ageMode === "elementary" ? "さっそく{始|はじ}める →" : "さっそくはじめる →") : "次へ →"} />
          </button>
        </div>
      </div>
    );
  }

  // ── 年齢選択 ──
  if (screen === 3) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
        fontFamily: "'Zen Maru Gothic',sans-serif",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative", overflow: "hidden",
      }}>
        {/* インジケーター */}
        <div style={{ position: "absolute", top: 20, left: 24, right: 24, display: "flex", gap: 6 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 3 ? "#ffa940" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>

        <div style={{ animation: "popIn .6s ease", textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🎓</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.35, marginBottom: 10 }}>
            <RubyText text={ageMode === "elementary" ? "お{子|こ}さんの{学年|がくねん}を<br />{教|おし}えてください" : "お子さんの学年を<br />教えてください"} />
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.8 }}>
            <RubyText text={ageMode === "elementary" ? "{学年|がくねん}に{合|あ}わせた{表示|ひょうじ}に{調整|ちょうせい}します" : "学年に合わせた表示に調整します"} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 360 }}>
          {[
            { id: "elementary", icon: "🏫", label: "小学4〜6年生", desc: "やさしい言葉で説明します",
              elLabel: "{小学|しょうがく}4〜6{年生|ねんせい}", elDesc: "やさしい{言葉|ことば}で{説明|せつめい}します" },
            { id: "middle", icon: "📱", label: "中学生以上", desc: "より詳しい内容で学べます",
              elLabel: "{中学生|ちゅうがくせい}{以上|いじょう}", elDesc: "より{詳|くわ}しい{内容|ないよう}で{学|まな}べます" },
          ].map((opt) => (
            <button key={opt.id}
              onClick={() => {
                setAgeMode(opt.id);
                feedback("tap");
                next();
              }}
              style={{
                padding: "20px 22px",
                background: "rgba(255,255,255,.06)",
                border: "2px solid rgba(255,169,64,.4)",
                borderRadius: 18, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 16,
                transition: "all .15s",
                boxShadow: "0 4px 20px rgba(255,169,64,.12)",
              }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{opt.icon}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                  <RubyText text={ageMode === "elementary" ? (opt.elLabel || opt.label) : opt.label} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                  <RubyText text={ageMode === "elementary" ? (opt.elDesc || opt.desc) : opt.desc} />
                </div>
              </div>
              <div style={{ marginLeft: "auto", color: "#ffa940", fontSize: 18 }}>→</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── CTA ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)",
      fontFamily: "'Zen Maru Gothic',sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* インジケーター */}
      <div style={{ position: "absolute", top: 20, left: 24, right: 24, display: "flex", gap: 6 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "#ffa940" }} />
        ))}
      </div>

      <div style={{ animation: "popIn .6s ease", textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>🚀</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.35, marginBottom: 10 }}>
          <RubyText text={ageMode === "elementary" ? "{準備|じゅんび}{完了|かんりょう}！<br />お{子|こ}さまと{一緒|いっしょ}に<br />{始|はじ}めましょう" : "準備完了！<br />お子さまと一緒に<br />始めましょう"} />
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.8 }}>
          <RubyText text={ageMode === "elementary" ? "{全|ぜん}7エピソード · {完全|かんぜん}{無料|むりょう} · {広告|こうこく}なし" : "全7エピソード · 完全無料 · 広告なし"} />
        </div>
      </div>

      {/* シェアカード */}
      <div style={{
        background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20, padding: "20px", width: "100%", maxWidth: 360,
        marginBottom: 20, animation: "slideUp .5s .2s both ease",
      }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,.7)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>📢</span><RubyText text={ageMode === "elementary" ? "{同|おな}じ{悩|なや}みを{持|も}つ{親御|おやご}さんに" : "同じ悩みを持つ親御さんに"} />
        </div>
        {[
          { emoji: "👩‍👧", text: "子育てグループのLINEでシェアする", elText: "{子育|こそだ}てグループのLINEでシェアする" },
          { emoji: "🏫", text: "PTAや学校の先生に紹介する", elText: "PTAや{学校|がっこう}の{先生|せんせい}に{紹介|しょうかい}する" },
          { emoji: "👴👵", text: "祖父母にも教えてあげる（振り込め詐欺対策にも）", elText: "{祖父母|そふぼ}にも{教|おし}えてあげる（{振|ふ}り{込|こ}め{詐欺|さぎ}{対策|たいさく}にも）" },
        ].map((tip, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0",
            borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none",
          }}>
            <span style={{ fontSize: 18 }}>{tip.emoji}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>
              <RubyText text={ageMode === "elementary" ? (tip.elText || tip.text) : tip.text} />
            </span>
          </div>
        ))}
        <button onClick={() => navigator.share?.({
          title: "マモル — 親子で学ぶSNSリテラシーアプリ",
          text: "子どものSNS・スマホトラブルを体験型で学べる無料アプリ「マモル」。子どもと一緒にやってみて！",
          url: "https://mamoru-xi.vercel.app",
        }).catch(() => {})}
          style={{
            width: "100%", marginTop: 14, padding: 12,
            background: "rgba(255,169,64,.12)", border: "1px solid rgba(255,169,64,.3)",
            borderRadius: 12, color: "#ffa940", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          📤 このアプリをシェアする
        </button>
      </div>

      {/* プライバシー安心カード */}
      <div style={{
        width: "100%", maxWidth: 360,
        background: "rgba(255,255,255,.04)", border: "1px solid rgba(100,255,180,.2)",
        borderRadius: 16, padding: "14px 16px", marginBottom: 20,
        animation: "slideUp .5s .3s both ease",
      }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(100,255,180,.8)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          🔒 <RubyText text={ageMode === "elementary" ? "{個人情報|こじんじょうほう}・プライバシーについて" : "個人情報・プライバシーについて"} />
        </div>
        {[
          { icon: "📵", text: "入力した内容は外部に送信されません", elText: "{入力|にゅうりょく}した{内容|ないよう}は{外部|がいぶ}に{送信|そうしん}されません" },
          { icon: "📱", text: "すべてのデータはこの端末にのみ保存されます", elText: "すべてのデータはこの{端末|たんまつ}にのみ{保存|ほぞん}されます" },
          { icon: "🚫", text: "広告なし・個人情報の収集なし", elText: "{広告|こうこく}なし・{個人情報|こじんじょうほう}の{収集|しゅうしゅう}なし" },
          { icon: "🤖", text: "一部のコンテンツはAIを使って作成されています", elText: "{一部|いちぶ}のコンテンツはAIを{使|つか}って{作成|さくせい}されています" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
              <RubyText text={ageMode === "elementary" ? (item.elText || item.text) : item.text} />
            </span>
          </div>
        ))}
      </div>

      {/* スタートボタン */}
      <button onClick={() => {
        feedback("complete");
        try { localStorage.setItem(ONBOARDING_KEY, "1"); } catch {}
        onComplete();
      }} style={{
        width: "100%", maxWidth: 360,
        padding: 18, background: "linear-gradient(135deg,#ffa940,#ff6b00)",
        border: "none", borderRadius: 18, color: "#fff",
        fontSize: 17, fontWeight: 900, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 8px 32px rgba(255,169,64,.5)",
        animation: "glowPulse 2s ease-in-out infinite",
      }}>
        🛡️ <RubyText text={ageMode === "elementary" ? "{子|こ}どもと{一緒|いっしょ}に{始|はじ}める" : "子どもと一緒に始める"} />
      </button>

      <div style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,.2)" }}>
        <RubyText text={ageMode === "elementary" ? "{完全|かんぜん}{無料|むりょう} · インストール{不要|ふよう} · {広告|こうこく}なし" : "完全無料 · インストール不要 · 広告なし"} />
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// 📖 キーワードノートシステム
// ═══════════════════════════════════════════════

const KEYWORD_STORAGE = "mamoru_keywords_v1";

function loadKeywords() {
  try { return JSON.parse(localStorage.getItem(KEYWORD_STORAGE) || "[]"); } catch { return []; }
}
function saveKeyword(word) {
  const existing = loadKeywords();
  if (existing.find(k => k.word === word.word)) return;
  localStorage.setItem(KEYWORD_STORAGE, JSON.stringify([...existing, { ...word, learnedAt: new Date().toLocaleDateString("ja-JP") }]));
}

// EP別キーワード定義
const EP_KEYWORDS = {
  ep1: [
    {
      word: "個人情報",
      reading: "こじんじょうほう",
      emoji: "🔐",
      short: "あなたや家族が誰かわかる情報のこと",
      detail: "名前・住所・電話番号・学校名・写真など、それを見れば「あなたが誰か」が分かってしまう情報のこと。ネットでは一枚の写真からでも個人情報がバレてしまう。",
      news: "2024年、SNSにあげた制服姿の写真から校章が見えてしまい、学校が特定された事件がある。背景に写った看板や表札から家がバレた例もたくさんある。",
      scary: "自分一人の情報だけじゃなく、家族や友達の情報も勝手に公開しないことが大切",
      action: "投稿前に「個人情報が写っていないか」確認する習慣をつける",
      el: {
        word: "こじん{情報|じょうほう}",
        short: "あなたや{家族|かぞく}が{誰|だれ}かわかる{情報|じょうほう}のこと",
        detail: "{名前|なまえ}・{住所|じゅうしょ}・{電話番号|でんわばんごう}・{学校|がっこう}の{名前|なまえ}・{写真|しゃしん}など、それを{見|み}れば「あなたが{誰|だれ}か」がわかってしまう{情報|じょうほう}のこと。ネットでは{一枚|いちまい}の{写真|しゃしん}からでもこじん{情報|じょうほう}がバレてしまう。",
        news: "2024{年|ねん}、SNSにあげた{制服|せいふく}{姿|すがた}の{写真|しゃしん}から{校章|こうしょう}が{見|み}えてしまい、{学校|がっこう}が{特定|とくてい}された{事件|じけん}がある。{背景|はいけい}に{写|うつ}った{看板|かんばん}や{表札|ひょうさつ}から{家|いえ}がバレた{例|れい}もたくさんある。",
        scary: "{自分|じぶん}{一人|ひとり}の{情報|じょうほう}だけじゃなく、{家族|かぞく}や{友達|ともだち}の{情報|じょうほう}も{勝手|かって}に{公開|こうかい}しないことが{大切|たいせつ}",
        action: "{投稿|とうこう}{前|まえ}に「こじん{情報|じょうほう}が{写|うつ}っていないか」{確認|かくにん}する{習慣|しゅうかん}をつける",
      },
      epKey: "ep1",
    },
    {
      word: "デジタルタトゥー",
      reading: "でじたるたとぅー",
      emoji: "🖋️",
      short: "ネットにのせた情報は消えないということ",
      detail: "一度ネットにのせた写真やコメントは、消しても誰かが保存していて、完全には消えない。体に入れるタトゥーみたいに、ずっと残る。",
      news: "昔SNSにのせたふざけた写真があとで見つかり、就職や進学で不利になった事例がたくさんある。",
      scary: "10年後の自分が見ても大丈夫？と考えること",
      action: "投稿する前に「これは一生残ってもいい？」と考える習慣をつける",
      el: {
        word: "デジタルタトゥー",
        short: "ネットにのせた{情報|じょうほう}は{消|き}えないということ",
        detail: "{一度|いちど}ネットにのせた{写真|しゃしん}やコメントは、{消|き}しても{誰|だれ}かが{保存|ほぞん}していて、{完全|かんぜん}には{消|き}えない。からだに{入|い}れるタトゥーみたいに、ずっと{残|のこ}る。",
        news: "{昔|むかし}SNSにのせたふざけた{写真|しゃしん}があとで{見|み}つかり、{就職|しゅうしょく}や{進学|しんがく}で{不利|ふり}になった{事例|じれい}がたくさんある。",
        scary: "10{年後|ねんご}の{自分|じぶん}が{見|み}ても{大丈夫|だいじょうぶ}？と{考|かんが}えること",
        action: "{投稿|とうこう}する{前|まえ}に「これは{一生|いっしょう}{残|のこ}ってもいい？」と{考|かんが}える{習慣|しゅうかん}をつける",
      },
      epKey: "ep1",
    },
  ],
  ep12: [
    {
      word: "ジオタグ",
      reading: "じおたぐ",
      emoji: "📍",
      short: "写真に自動でつく「どこで撮ったか」の情報",
      detail: "スマホで写真を撮ると、GPSで「どこで撮ったか」が自動的に記録される。これを「ジオタグ」という。写真をSNSにあげると、その場所の情報も一緒に公開されてしまう。",
      news: "2019年、SNSにあげた写真のジオタグから芸能人の自宅が特定された事件がある。目の中の景色の反射からも場所が分かることもある。",
      scary: "カメラアプリの位置情報をオンにしていると、毎日のジオタグが写真に残り続ける",
      action: "設定→カメラ→位置情報→「許可しない」に変える",
      el: {
        word: "ジオタグ（{写真|しゃしん}につく{場所|ばしょ}の{情報|じょうほう}）",
        short: "{写真|しゃしん}に{自動|じどう}でつく「どこで{撮|と}ったか」の{情報|じょうほう}",
        detail: "スマホで{写真|しゃしん}を{撮|と}ると、GPSで「どこで{撮|と}ったか」が{自動的|じどうてき}に{記録|きろく}されます。これを「ジオタグ」といいます。{写真|しゃしん}をSNSにあげると、その{場所|ばしょ}の{情報|じょうほう}も{一緒|いっしょ}に{公開|こうかい}されてしまいます。",
        news: "2019{年|ねん}、SNSにあげた{写真|しゃしん}のジオタグから{芸能人|げいのうじん}の{自宅|じたく}が{特定|とくてい}された{事件|じけん}があります。{目|め}の{中|なか}の{景色|けしき}の{反射|はんしゃ}からも{場所|ばしょ}がわかることもあります。",
        scary: "カメラアプリの{位置情報|いちじょうほう}をオンにしていると、{毎日|まいにち}のジオタグが{写真|しゃしん}に{残|のこ}り{続|つづ}ける",
        action: "{設定|せってい}→カメラ→{位置情報|いちじょうほう}→「{許可|きょか}しない」に{変|か}える",
      },
      epKey: "ep12",
    },
    {
      word: "アクセス権限",
      reading: "あくせすけんげん",
      emoji: "🔓",
      short: "アプリに「これを使っていいよ」と許可すること",
      detail: "アプリをインストールするときに「位置情報を使ってもいいですか？」「カメラを使ってもいいですか？」と聞かれる。これに「許可」すると、そのアプリはあなたの情報を見られるようになる。",
      news: "ライト（懐中電灯）アプリが、なぜか連絡先や位置情報の権限を要求し、こっそり情報を集めていた事件がある。",
      scary: "「全部許可」を押す前に「このアプリに本当に必要？」と考えること",
      action: "設定→プライバシー で、各アプリに与えた権限を定期的に見直す",
      el: {
        word: "アクセス{権限|けんげん}（アプリへの{許可|きょか}）",
        short: "アプリに「これを{使|つか}っていいよ」と{許可|きょか}すること",
        detail: "アプリをインストールするときに「{位置情報|いちじょうほう}を{使|つか}ってもいいですか？」「カメラを{使|つか}ってもいいですか？」と{聞|き}かれます。「{許可|きょか}」すると、そのアプリはあなたの{情報|じょうほう}を{見|み}られるようになります。",
        news: "ライト（かいちゅうでんとう）アプリが、なぜか{連絡先|れんらくさき}や{位置情報|いちじょうほう}の{権限|けんげん}を{要求|ようきゅう}し、こっそり{情報|じょうほう}を{集|あつ}めていた{事件|じけん}があります。",
        scary: "「{全部|ぜんぶ}{許可|きょか}」をおす{前|まえ}に「このアプリに{本当|ほんとう}に{必要|ひつよう}？」と{考|かんが}えること",
        action: "{設定|せってい}→プライバシー で、{各|かく}アプリにあたえた{権限|けんげん}を{定期的|ていきてきに}に{見直|みなお}す",
      },
      epKey: "ep12",
    },
  ],
  ep2: [
    {
      word: "フェイクニュース",
      reading: "ふぇいくにゅーす",
      emoji: "📰",
      short: "意図的に作られた嘘の情報",
      detail: "事実と異なる情報を本物のニュースに見せかけて拡散させること。SNSではシェアされやすいよう「緊急」「衝撃」「拡散希望」などの言葉が使われる。",
      news: "2024年能登半島地震では「孤立地域に熊が出た」「某市長が逃げた」などデマが多数拡散。救助活動の妨げになった。",
      scary: "あなたも知らずにデマを広める加害者になる",
      action: "NHK・気象庁・市区町村の公式サイトで必ず確認する",
      el: {
        word: "フェイクニュース（うその{情報|じょうほう}）",
        short: "わざとつくられたうその{情報|じょうほう}",
        detail: "{本当|ほんとう}じゃないことを{本物|ほんもの}のニュースに{見|み}せかけて{広|ひろ}める{情報|じょうほう}のこと。SNSでは「きんきゅう」「しょうげき」「{拡散|かくさん}{希望|きぼう}」などの{言葉|ことば}がよく{使|つか}われます。",
        news: "2024{年|ねん}の{地震|じしん}のとき「クマが{出|で}た」「{市長|しちょう}がにげた」などのデマが{広|ひろ}まりました。{助|たす}けるじゃまになりました。",
        scary: "あなたも{知|し}らずにデマを{広|ひろ}める{加害者|かがいしゃ}になることがある",
        action: "NHK・{気象庁|きしょうちょう}・{市区町村|しくちょうそん}の{公式|こうしき}サイトで{必|かなら}ずかくにんする",
      },
      epKey: "ep2",
    },
    {
      word: "ファクトチェック",
      reading: "ふぁくとちぇっく",
      emoji: "✅",
      short: "情報の真偽を検証すること",
      detail: "ニュースや投稿が本当かどうかを一次情報源・専門家・複数のソースで確かめること。日本ではファクトチェック・イニシアティブ（FIJ）が活動中。",
      news: "2023年の首相暗殺未遂デマ、2024年の著名人偽コメントなど、ファクトチェックで多数のフェイクが暴かれた。",
      scary: "何も考えずシェアした1人が加害者になれる",
      action: "怪しい情報はfact-check.org・Snopes・FactCheck.orgで確認",
      el: {
        word: "ファクトチェック（{情報|じょうほう}かくにん）",
        short: "{情報|じょうほう}がほんとうかどうかをたしかめること",
        detail: "ニュースや{投稿|とうこう}が{本当|ほんとう}かどうかを、もとの{情報|じょうほう}・{専門家|せんもんか}・いくつかの{情報|じょうほう}{元|もと}でたしかめること。{日本|にほん}ではファクトチェック・イニシアティブ（FIJ）が{活動|かつどう}しています。",
        news: "2023{年|ねん}のしゅしょうあんさつみすいデマ、2024{年|ねん}の{有名人|ゆうめいじん}のにせコメントなど、ファクトチェックで{多|おお}くのフェイクがバレました。",
        scary: "なにも{考|かんが}えずシェアした1{人|ひと}が{加害者|かがいしゃ}になれる",
        action: "あやしい{情報|じょうほう}はNHKのファクトチェックサイトや{信頼|しんらい}できるニュースサイトでかくにんする",
      },
      epKey: "ep2",
    },
  ],
  ep3: [
    {
      word: "トクリュウ（匿名・流動型犯罪グループ）",
      reading: "とくりゅう",
      emoji: "🕶️",
      short: "SNSで集められた匿名の実行犯集団",
      detail: "首謀者がSNS・ダークウェブで匿名の実行役（受け子・出し子・架け子）を集め、使い捨てにする犯罪組織の形態。2023〜2024年に強盗・詐欺で急増。構成員同士が互いを知らない。",
      news: "2024年に相次いだ「強盗指示」事件の多くがトクリュウ。「仕事」として招集された若者が逮捕・実名報道される事例が続出。",
      scary: "スカウトされた時点で既に犯罪に組み込まれている",
      action: "「高収入・簡単・スマホだけ」の募集は即ブロック＋通報",
      el: {
        word: "トクリュウ（とくめい・りゅうどうがた{犯罪|はんざい}グループ）",
        short: "SNSで{集|あつ}められたとくめいの{実行犯|じっこうはん}{集団|しゅうだん}",
        detail: "グループのリーダーがSNSなどでとくめいの{実行役|じっこうやく}を{集|あつ}め、つかい{捨|す}てにする{犯罪|はんざい}{組織|そしき}のかたちです。2023〜2024{年|ねん}にとうなんや{詐欺|さぎ}で{急|きゅう}に{増|ふ}えました。{仲間|なかま}どうしがおたがいを{知|し}りません。",
        news: "2024{年|ねん}に{相次|あいつ}いだ「{強盗|ごうとう}{指示|しじ}」{事件|じけん}の{多|おお}くがトクリュウです。「{仕事|しごと}」として{集|あつ}められた{若者|わかもの}が{逮捕|たいほ}されました。",
        scary: "スカウトされた{時点|じてん}で、もう{犯罪|はんざい}に{組|く}み{込|こ}まれている",
        action: "「{高収入|こうしゅうにゅう}・かんたん・スマホだけ」のぼしゅうはすぐブロック＋{通報|つうほう}",
      },
      epKey: "ep3",
    },
    {
      word: "受け子・出し子・架け子",
      reading: "うけこ・だしこ・かけこ",
      emoji: "🎭",
      short: "特殊詐欺の三役の実行犯",
      detail: "架け子＝電話で被害者を騙す役 / 受け子＝現金・カードを受け取る役 / 出し子＝ATMでお金を引き出す役。どの役でも詐欺の共犯として逮捕される。",
      news: "2023年、受け子として逮捕された18歳が「バイトだと思っていた」と供述。懲役3年の実刑判決。前科がつき就職・進学に一生影響。",
      scary: "「知らなかった」は裁判で通用しない",
      action: "知らない人から頼まれた「荷物受け取り」「ATM操作」は絶対に断る",
      el: {
        word: "{受|う}け子・{出|だ}し子・かけ子（さぎの{役割|やくわり}）",
        short: "{特殊|とくしゅ}{詐欺|さぎ}の三{役|やく}の{実行犯|じっこうはん}",
        detail: "かけ子＝でんわで{被害者|ひがいしゃ}をだます{役|やく}／{受|う}け子＝お{金|かね}やカードを{受|う}け{取|と}る{役|やく}／{出|だ}し子＝ATMでお{金|かね}を{引|ひ}き{出|だ}す{役|やく}。どの{役|やく}でも{詐欺|さぎ}のきょうはんとして{逮捕|たいほ}されます。",
        news: "2023{年|ねん}、{受|う}け子として{逮捕|たいほ}された18{才|さい}が「バイトだと{思|おも}っていた」と{話|はな}しました。{懲役|ちょうえき}3{年|ねん}になりました。{一生|いっしょう}{記録|きろく}が{残|のこ}ります。",
        scary: "「{知|し}らなかった」は{裁判|さいばん}で{通用|つうよう}しない",
        action: "{知|し}らない{人|ひと}にたのまれた「{荷物|にもつ}{受|う}け{取|と}り」「ATMそうさ」は{絶対|ぜったい}に{断|ことわ}る",
      },
      epKey: "ep3",
    },
    {
      word: "闇バイト",
      reading: "やみばいと",
      emoji: "⚠️",
      short: "犯罪行為を「バイト」と偽って募集する求人",
      detail: "SNSや闇サイトで「高日給・即日払い・スマホだけ」と募集し、実際には詐欺・強盗・薬物運搬などの犯罪を実行させる。一度個人情報を送ると「やめたら家族にバラす」と脅される。",
      news: "2024年、全国で150件超の強盗事件がこの手口。高校生・大学生の逮捕者が急増。被害者・加害者ともに10〜20代が中心に。",
      scary: "一度足を踏み入れると自力では抜け出せない",
      action: "#9110（警察相談）・弁護士ドットコムに相談。家族にも話す",
      el: {
        word: "{闇|やみ}バイト（{犯罪|はんざい}をバイトとよそおった{仕事|しごと}）",
        short: "{犯罪|はんざい}{行為|こうい}を「バイト」とうそついてぼしゅうするもの",
        detail: "SNSなどで「{高|こう}{日給|にっきゅう}・{即日払|そくじつばら}い・スマホだけ」とぼしゅうし、{実際|じっさい}には{詐欺|さぎ}・{強盗|ごうとう}・{薬物|やくぶつ}{運搬|うんぱん}などの{犯罪|はんざい}をやらせます。{一度|いちど}{個人情報|こじんじょうほう}を{送|おく}ると「やめたら{家族|かぞく}にバラす」とおどされます。",
        news: "2024{年|ねん}、{全国|ぜんこく}で150{件|けん}{以上|いじょう}の{強盗|ごうとう}{事件|じけん}がこの{手口|てぐち}でした。{高校生|こうこうせい}・{大学生|だいがくせい}の{逮捕者|たいほしゃ}が{急|きゅう}に{増|ふ}えました。",
        scary: "{一度|いちど}{足|あし}を{踏|ふ}み{入|い}れると{自力|じりき}では{抜|ぬ}け{出|だ}せない",
        action: "#9110（けいさつ{相談|そうだん}）・{弁護士|べんごし}ドットコムに{相談|そうだん}。{家族|かぞく}にも{話|はな}す",
      },
      epKey: "ep3",
    },
    {
      word: "特殊詐欺",
      reading: "とくしゅさぎ",
      emoji: "📞",
      short: "電話やSNSを使ってお金をだまし取る犯罪",
      detail: "オレオレ詐欺・振り込め詐欺・フィッシング詐欺など、直接会わずに電話・メール・SNSを使ってお金や個人情報をだまし取る犯罪の総称。被害額は年間500億円を超える。",
      news: "2024年、特殊詐欺の被害額が過去最高水準に。被害者の多くは「自分は騙されない」と思っていた人たちだった。",
      scary: "身内・銀行・警察を名乗る電話・メールは全て疑う",
      action: "家族間で「合言葉」を決めておく。知らない番号からの電話は出ない習慣をつける",
      el: {
        word: "{特殊|とくしゅ}{詐欺|さぎ}（とくしゅさぎ）",
        short: "{電話|でんわ}やSNSを{使|つか}ってお{金|かね}をだましとる{犯罪|はんざい}",
        detail: "「おれおれ{詐欺|さぎ}」や「{振|ふ}り{込|こ}め{詐欺|さぎ}」など、{直接|ちょくせつ}{会|あ}わずに{電話|でんわ}・メール・SNSでお{金|かね}や{情報|じょうほう}をだましとる{犯罪|はんざい}のこと。{被害|ひがい}{額|がく}は{年間|ねんかん}500{億円|おくえん}をこえる。",
        news: "2024{年|ねん}、{特殊|とくしゅ}{詐欺|さぎ}の{被害|ひがい}{額|がく}が{過去最高|かこさいこう}になった。{被害者|ひがいしゃ}の{多|おお}くは「{自分|じぶん}はだまされない」と{思|おも}っていた。",
        scary: "{家族|かぞく}・{銀行|ぎんこう}・{警察|けいさつ}を{名乗|なの}る{電話|でんわ}・メールは{全部|ぜんぶ}{疑|うたが}う",
        action: "{家族|かぞく}{間|かん}で「あいことば」を{決|き}めておく。{知|し}らない{番号|ばんごう}からの{電話|でんわ}には{出|で}ない{習慣|しゅうかん}をつける",
      },
      epKey: "ep3",
    },
  ],
  ep4: [
    {
      word: "フィッシング詐欺",
      reading: "ふぃっしんぐさぎ",
      emoji: "🎣",
      short: "本物そっくりの偽サイトで情報を盗む手口",
      detail: "銀行・SNS・宅配便などを装った偽のサイトやメールで、パスワードや個人情報を入力させて盗む詐欺のこと。本物と見分けがつかないほど精巧に作られている。",
      news: "2024年、フィッシング詐欺の被害額が初めて1000億円を超えた。LINEやAmazon・銀行をかたる偽サイトが急増している。",
      scary: "「https」や鍵マークがあっても偽サイトは作れる",
      action: "URLを必ず確認する。公式アプリから直接開く習慣をつける",
      el: {
        word: "フィッシング{詐欺|さぎ}",
        short: "{本物|ほんもの}そっくりのにせサイトで{情報|じょうほう}を{盗|ぬす}む{手口|てぐち}",
        detail: "{銀行|ぎんこう}・SNS・たくはいびんなどをよそおったにせのサイトやメールで、パスワードや{個人情報|こじんじょうほう}を{入力|にゅうりょく}させて{盗|ぬす}む{詐欺|さぎ}のこと。{本物|ほんもの}と{見分|みわ}けがつかないほど{精巧|せいこう}に{作|つく}られています。",
        news: "2024{年|ねん}、フィッシング{詐欺|さぎ}の{被害|ひがい}{額|がく}が{初|はじ}めて1000{億円|おくえん}を{超|こ}えました。LINEやAmazon・{銀行|ぎんこう}をかたるにせサイトが{急|きゅう}に{増|ふ}えています。",
        scary: "「https」や{鍵|かぎ}マークがあってもにせサイトは{作|つく}れる",
        action: "URLを{必|かなら}ず{確認|かくにん}する。{公式|こうしき}アプリから{直接|ちょくせつ}{開|ひら}く{習慣|しゅうかん}をつける",
      },
      epKey: "ep4",
    },
    {
      word: "2段階認証",
      reading: "にだんかいにんしょう",
      emoji: "🔐",
      short: "パスワード以外にもう1つの確認が必要なしくみ",
      detail: "ログイン時にパスワードだけでなく、スマホに届く確認コードなど2つの情報で本人確認をする方法。パスワードが盗まれてもアカウントを守ることができる。",
      news: "2段階認証を設定するだけで、アカウント乗っ取りの99%以上を防げるというデータがある（Google調べ）。",
      scary: "「認証コードは誰にも教えない」本物のサービスは絶対に聞いてこない",
      action: "LINE・Instagram・Google全てのアカウントに今すぐ設定する",
      el: {
        word: "2{段階|だんかい}{認証|にんしょう}",
        short: "パスワード{以外|いがい}にもう1つのかくにんが{必要|ひつよう}なしくみ",
        detail: "ログインするとき、パスワードだけでなく、スマホに{届|とど}くかくにんコードなど2つの{情報|じょうほう}で{本人|ほんにん}かくにんをする{方法|ほうほう}。パスワードが{盗|ぬす}まれてもアカウントを{守|まも}ることができます。",
        news: "2{段階|だんかい}{認証|にんしょう}を{設定|せってい}するだけで、アカウント{乗|の}っ{取|と}りの99%{以上|いじょう}を{防|ふせ}げるというデータがあります（Google{調|しら}べ）。",
        scary: "「{認証|にんしょう}コードは{誰|だれ}にも{教|おし}えない」{本物|ほんもの}のサービスは{絶対|ぜったい}に{聞|き}いてこない",
        action: "LINE・Instagram・Google{全|すべ}てのアカウントに{今|いま}すぐ{設定|せってい}する",
      },
      epKey: "ep4",
    },
  ],
  ep5: [
    {
      word: "ネットいじめ（サイバーいじめ）",
      reading: "ねっといじめ",
      emoji: "💬",
      short: "SNS・ゲーム等を通じたいじめ",
      detail: "LINEのグループ外し・悪口の拡散・ゲーム内のハラスメント・偽アカウントでの誹謗中傷など。24時間・365日逃げ場がなく、スクリーンショットで証拠が残り拡散する。",
      news: "文科省2023年調査：ネットいじめの認知件数が初めて2万件を超え過去最多。被害者の平均年齢は下がり続けている。",
      scary: "家に帰っても学校が続く。眠れない夜が続く",
      action: "証拠スクショを保存→学校・スクールカウンセラー・#9110に相談",
      el: {
        word: "ネットいじめ（サイバーいじめ）",
        short: "SNS・ゲームなどを{通|とお}じたいじめ",
        detail: "LINEのグループはずし・わるぐちの{拡散|かくさん}・ゲームの{中|なか}のいやがらせ・にせアカウントでの{悪口|あっこう}など。24{時間|じかん}・365{日|にち}にげる{場所|ばしょ}がなく、スクリーンショットで{証拠|しょうこ}が{残|のこ}って{広|ひろ}まります。",
        news: "{文科省|もんかしょう}2023{年|ねん}{調査|ちょうさ}：ネットいじめのにんちけん{数|すう}が{初|はじ}めて2{万件|まんけん}をこえて{過去最多|かこさいた}になりました。",
        scary: "{家|いえ}に{帰|かえ}っても{学校|がっこう}が{続|つづ}く。ねむれない{夜|よる}が{続|つづ}く",
        action: "{証拠|しょうこ}スクショを{保存|ほぞん}→{学校|がっこう}・スクールカウンセラー・#9110に{相談|そうだん}",
      },
      epKey: "ep5",
    },
    {
      word: "スクリーンショット（証拠保存）",
      reading: "すくりーんしょっと",
      emoji: "📸",
      short: "画面を画像として保存すること",
      detail: "いじめや嫌がらせの証拠を残すために、画面をスクリーンショットで保存すること。大人や警察に相談するときに「いつ・何が起きたか」を証明するために必要。",
      news: "ネットいじめの相談で証拠がなかったため対処が遅れたケースが多くある。スクリーンショットがあったことで加害者が特定された事例も多い。",
      scary: "削除される前にすぐ保存することが大事",
      action: "iPhone：サイドボタン＋音量UPを同時に押す / Android：電源ボタン＋音量DOWNを同時に押す",
      el: {
        word: "スクリーンショット（{証拠|しょうこ}{保存|ほぞん}）",
        short: "{画面|がめん}を{画像|がぞう}として{保存|ほぞん}すること",
        detail: "いじめやいやがらせの{証拠|しょうこ}を{残|のこ}すために、{画面|がめん}をスクリーンショットで{保存|ほぞん}すること。{大人|おとな}や{警察|けいさつ}に{相談|そうだん}するときに「いつ・なにが{起|お}きたか」を{証明|しょうめい}するために{必要|ひつよう}。",
        news: "ネットいじめの{相談|そうだん}で{証拠|しょうこ}がなかったため{対処|たいしょ}が{遅|おく}れたケースが{多|おお}くある。",
        scary: "{削除|さくじょ}される{前|まえ}にすぐ{保存|ほぞん}することが{大事|だいじ}",
        action: "iPhone：サイドボタン＋{音量|おんりょう}UPを{同時|どうじ}に{押|お}す / Android：{電源|でんげん}ボタン＋{音量|おんりょう}DOWNを{同時|どうじ}に{押|お}す",
      },
      epKey: "ep5",
    },
  ],
  ep6: [
    {
      word: "肖像権",
      reading: "しょうぞうけん",
      emoji: "📸",
      short: "自分の顔や姿を勝手に使われない権利",
      detail: "自分の顔・姿が写った写真や動画を、本人の許可なく撮影・公開・使用されない権利のこと。芸能人だけでなく、全ての人に認められている権利。",
      news: "2023年、クラスメートの写真を無断でSNSに投稿した中学生が損害賠償を求められた事例がある。「悪意がなかった」は理由にならなかった。",
      scary: "「かわいく撮れてるから大丈夫」は本人が決めること",
      action: "投稿前に必ず本人に「あげていい？」と確認する",
      el: {
        word: "{肖像権|しょうぞうけん}（じぶんのかおやすがたをかってにつかわれないけんり）",
        short: "{自分|じぶん}の{顔|かお}や{姿|すがた}を{勝手|かって}に{使|つか}われない{権利|けんり}",
        detail: "{自分|じぶん}の{顔|かお}・{姿|すがた}が{写|うつ}った{写真|しゃしん}や{動画|どうが}を、{本人|ほんにん}の{許可|きょか}なく{撮影|さつえい}・{公開|こうかい}・{使用|しよう}されない{権利|けんり}のこと。{芸能人|げいのうじん}だけでなく、{全|すべ}ての{人|ひと}に{認|みと}められている{権利|けんり}。",
        news: "2023{年|ねん}、クラスメートの{写真|しゃしん}を{無断|むだん}でSNSに{投稿|とうこう}した{中学生|ちゅうがくせい}が{損害賠償|そんがいばいしょう}を{求|もと}められた{事例|じれい}があります。「{悪意|あくい}がなかった」は{理由|りゆう}になりませんでした。",
        scary: "「かわいく{撮|と}れてるから{大丈夫|だいじょうぶ}」は{本人|ほんにん}が{決|き}めること",
        action: "{投稿|とうこう}{前|まえ}に{必|かなら}ず{本人|ほんにん}に「あげていい？」と{確認|かくにん}する",
      },
      epKey: "ep6",
    },
    {
      word: "プライバシー",
      reading: "ぷらいばしー",
      emoji: "🔒",
      short: "自分の情報や私生活を守る権利",
      detail: "自分に関する情報・写真・日常生活を、本人の意思でコントロールできる権利のこと。「知られたくないことを知られない権利」とも言える。",
      news: "2024年、友達の家の中を映した動画をSNSに投稿したところ、家族構成・生活環境がバレてトラブルになった事例がある。",
      scary: "本人が「いい」と思っていても家族が嫌がる場合もある",
      action: "「自分がされて嫌なことは相手にもしない」を基準にする",
      el: {
        word: "プライバシー（じぶんのじょうほうやしせいかつをまもるけんり）",
        short: "{自分|じぶん}の{情報|じょうほう}や{私生活|しせいかつ}を{守|まも}る{権利|けんり}",
        detail: "{自分|じぶん}に{関|かん}する{情報|じょうほう}・{写真|しゃしん}・{日常生活|にちじょうせいかつ}を、{本人|ほんにん}の{意思|いし}でコントロールできる{権利|けんり}のこと。「{知|し}られたくないことを{知|し}られない{権利|けんり}」ともいえます。",
        news: "2024{年|ねん}、{友達|ともだち}の{家|いえ}の{中|なか}を{映|うつ}した{動画|どうが}をSNSに{投稿|とうこう}したところ、{家族|かぞく}{構成|こうせい}・{生活|せいかつ}{環境|かんきょう}がバレてトラブルになった{事例|じれい}があります。",
        scary: "{本人|ほんにん}が「いい」と{思|おも}っていても{家族|かぞく}が{嫌|いや}がる{場合|ばあい}もある",
        action: "「{自分|じぶん}がされて{嫌|いや}なことは{相手|あいて}にもしない」を{基準|きじゅん}にする",
      },
      epKey: "ep6",
    },
  ],
  ep7: [
    {
      word: "グルーミング",
      reading: "ぐるーみんぐ",
      emoji: "🕸️",
      short: "信頼関係を築いてだんだんと罠にはめる手口",
      detail: "最初は親切にして信頼させ、少しずつ要求をエスカレートさせる犯罪の手口。「プレゼント」「秘密の関係」「親に内緒で」がサインになる。",
      news: "2023年、SNSで知り合った相手にグルーミングされた小中学生の被害が年間1,000件を超えた。被害者の約7割が「最初は信頼していた」と回答。",
      scary: "優しくしてくれる人が必ずしも安全とは限らない",
      action: "「内緒にして」と言われたらすぐ大人に相談する",
      el: {
        word: "グルーミング（だましてなかよくなる{手口|てぐち}）",
        short: "{信頼|しんらい}{関係|かんけい}を{築|きず}いてだんだんと{罠|わな}にはめる{手口|てぐち}",
        detail: "{最初|さいしょ}は{親切|しんせつ}にして{信頼|しんらい}させ、{少|すこ}しずつ{要求|ようきゅう}をエスカレートさせる{犯罪|はんざい}の{手口|てぐち}。「プレゼント」「{秘密|ひみつ}の{関係|かんけい}」「{親|おや}に{内緒|ないしょ}で」がサインになります。",
        news: "2023{年|ねん}、SNSで{知|し}り{合|あ}った{相手|あいて}にグルーミングされた{小中学生|しょうちゅうがくせい}の{被害|ひがい}が{年間|ねんかん}1000{件|けん}を{超|こ}えました。{被害者|ひがいしゃ}の{約|やく}7{割|わり}が「{最初|さいしょ}は{信頼|しんらい}していた」と{回答|かいとう}しました。",
        scary: "{優|やさ}しくしてくれる{人|ひと}が{必|かなら}ずしも{安全|あんぜん}とは{限|かぎ}らない",
        action: "「{内緒|ないしょ}にして」と{言|い}われたらすぐ{大人|おとな}に{相談|そうだん}する",
      },
      epKey: "ep7",
    },
    {
      word: "セクストーション",
      reading: "せくすとーしょん",
      emoji: "⚠️",
      short: "性的な画像や動画を使った脅迫・恐喝のこと",
      detail: "「セックス」と「エクストーション（恐喝）」を合わせた言葉。性的な画像や動画を送らされて、「ばらまくぞ」と脅されてお金やさらなる画像を要求される犯罪。",
      news: "2024年、SNSで知り合った相手に画像を送った中学生が脅迫されて100万円以上を要求された事件があった。",
      scary: "一度送った画像は完全には消せない",
      action: "脅されたらすぐ警察・大人に相談する。一人で抱え込まない",
      el: {
        word: "セクストーション（{性的|せいてき}な{画像|がぞう}をつかったおどし）",
        short: "{性的|せいてき}な{画像|がぞう}や{動画|どうが}をつかった{脅迫|きょうはく}・{恐喝|きょうかつ}のこと",
        detail: "{性的|せいてき}な{画像|がぞう}や{動画|どうが}を{送|おく}らされて、「バラまくぞ」と{脅|おど}されてお{金|かね}やさらなる{画像|がぞう}を{要求|ようきゅう}される{犯罪|はんざい}のこと。",
        news: "2024{年|ねん}、SNSで{知|し}り{合|あ}った{相手|あいて}に{画像|がぞう}を{送|おく}った{中学生|ちゅうがくせい}が{脅迫|きょうはく}されて100{万円|まんえん}{以上|いじょう}を{要求|ようきゅう}された{事件|じけん}がありました。",
        scary: "{一度|いちど}{送|おく}った{画像|がぞう}は{完全|かんぜん}には{消|け}せない",
        action: "{脅|おど}されたらすぐ{警察|けいさつ}・{大人|おとな}に{相談|そうだん}する。{一人|ひとり}で{抱|かか}え{込|こ}まない",
      },
      epKey: "ep7",
    },
  ],
};

// キーワードカード単体コンポーネント
function KeywordCard({ kw, onLearn, isLearned }) {
  const [expanded, setExpanded] = useState(false);
  const ageMode = useAgeMode();
  const d = (ageMode === "elementary" && kw.el) ? { ...kw, ...kw.el } : kw;
  return (
    <div style={{
      background: isLearned ? `${kw.color || "#ffa940"}08` : "#fff",
      border: `1.5px solid ${isLearned ? (kw.color || "#ffa940") + "44" : "#e2e8f0"}`,
      borderRadius: 16, overflow: "hidden", marginBottom: 12,
      boxShadow: isLearned ? `0 4px 16px ${kw.color || "#ffa940"}14` : "0 2px 8px rgba(0,0,0,.05)",
      transition: "all .2s",
    }}>
      {/* Header */}
      <button onClick={() => setExpanded(e => !e)}
        style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>{d.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b", marginBottom: 2 }}><RubyText text={d.word} /></div>
          <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.85 }}><RubyText text={d.short} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {isLearned && <span style={{ fontSize: 14 }}>✅</span>}
          <span style={{ fontSize: 16, color: "#94a3b8", transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", animation: "slideUp .3s ease" }}>
          <div style={{ height: 1, background: "#f1f5f9", marginBottom: 14 }} />

          {/* Detail */}
          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.85, marginBottom: 12 }}>
            <RubyText text={d.detail} />
          </div>

          {/* News example */}
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#c2410c", marginBottom: 6, letterSpacing: ".05em" }}><RubyText text={ageMode === "elementary" ? "📰 {実際|じっさい}に{起|お}きたこと" : "📰 実際に起きたこと"} /></div>
            <div style={{ fontSize: 12, color: "#7c2d12", lineHeight: 1.85 }}><RubyText text={d.news} /></div>
          </div>

          {/* Scary point */}
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: 12, color: "#991b1b", fontWeight: 700, lineHeight: 1.85 }}><RubyText text={d.scary} /></div>
          </div>

          {/* Action */}
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
            <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.85 }}><RubyText text={d.action} /></div>
          </div>

          {/* Learn button */}
          {!isLearned ? (
            <button onClick={() => { saveKeyword(kw); onLearn(kw); }}
              style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg,${kw.color || "#ffa940"},${kw.color || "#ffa940"}cc)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 14px ${kw.color || "#ffa940"}44` }}>
              <RubyText text={ageMode === "elementary" ? "📖 ノートに{記録|きろく}する" : "📖 ノートに記録する"} />
            </button>
          ) : (
            <div style={{ textAlign: "center", fontSize: 12, color: "#16a34a", fontWeight: 700, padding: "8px" }}>
              <RubyText text={ageMode === "elementary" ? "✅ キーワードノートに{記録済|きろくず}み" : "✅ キーワードノートに記録済み"} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// エピソード内キーワード学習フェーズコンポーネント
function KeywordPhase({ epKey, accentColor, onComplete }) {
  const keywords = EP_KEYWORDS[epKey] || [];
  const ageMode = useAgeMode();
  const [learned, setLearned] = useState(() => {
    const saved = loadKeywords();
    return new Set(saved.map(k => k.word));
  });

  const handleLearn = (kw) => {
    setLearned(prev => new Set([...prev, kw.word]));
  };

  const recordedCount = [...learned].filter(w => keywords.find(k => k.word === w)).length;
  const allRecorded = recordedCount >= keywords.length;

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {ageMode === "elementary" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef9c3", border: "1px solid #fcd34d", borderRadius: 10, padding: "7px 12px", marginBottom: 12 }}>
          <span style={{ fontSize: 14 }}>🏫</span>
          <span style={{ fontSize: 11, color: "#92400e", fontWeight: 700 }}>小学生モード：やさしい言葉（ことば）でひょうじしています</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accentColor}18`, border: `1px solid ${accentColor}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📖</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#1e293b" }}>
            {ageMode === "elementary" ? "おぼえておきたいことば" : "覚えておきたいキーワード"}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            <RubyText text={ageMode === "elementary" ? "{全部|ぜんぶ}「ノートに{記録|きろく}する」をおして{次|つぎ}へ" : "全て「ノートに記録する」を押してから次へ"} />
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "'DotGothic16',monospace", fontSize: 12, color: accentColor, fontWeight: 900 }}>
          {recordedCount}/{keywords.length}
        </div>
      </div>

      {keywords.map(kw => (
        <KeywordCard key={kw.word} kw={{ ...kw, color: accentColor }} onLearn={handleLearn} isLearned={learned.has(kw.word)} />
      ))}

      {allRecorded ? (
        <button onClick={onComplete}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 8, boxShadow: `0 8px 24px ${accentColor}33`, animation: "popIn .4s ease" }}>
          <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
        </button>
      ) : (
        <div style={{ marginTop: 10, padding: "12px 14px", background: "rgba(0,0,0,.05)", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            <RubyText text={ageMode === "elementary" ? `{全部|ぜんぶ}のキーワードをノートに{記録|きろく}すると{次|つぎ}へ{進|すす}めます（あと${keywords.length - recordedCount}つ）` : `全てのキーワードをノートに記録すると次へ進めます（あと${keywords.length - recordedCount}つ）`} />
          </span>
        </div>
      )}
    </div>
  );
}

// ホーム用キーワードノート画面
// EP_KEYWORDS からマスターデータを逆引きするヘルパー
function lookupMasterKw(kw) {
  for (const list of Object.values(EP_KEYWORDS)) {
    const found = list.find(k => k.word === kw.word);
    if (found) return found;
  }
  return null;
}

function KeywordNoteScreen({ onBack }) {
  const [keywords, setKeywords] = useState(loadKeywords);
  const [selectedEp, setSelectedEp] = useState("all");
  const [detail, setDetail] = useState(null);
  const ageMode = useAgeMode();

  const epFilters = [
    { id: "all", label: "すべて" },
    { id: "ep1", label: "📍EP1" },
    { id: "ep2", label: "📰EP2" },
    { id: "ep3", label: "⚠️EP3" },
    { id: "ep4", label: "🔐EP4" },
    { id: "ep5", label: "💬EP5" },
    { id: "ep6", label: "📸EP6" },
    { id: "ep7", label: "🎣EP7" },
  ];

  const filtered = selectedEp === "all" ? keywords : keywords.filter(k => k.epKey === selectedEp);
  const allKwCount = Object.values(EP_KEYWORDS).flat().length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f8fafc,#f1f5f9)", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#1e293b" }}>📖 キーワードノート</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{keywords.length} / {allKwCount} ワードを<RubyText text={ageMode === "elementary" ? "{記録|きろく}{済|す}み" : "記録済み"} /></div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "14px 20px 0", background: "#fff" }}>
        <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ height: "100%", width: `${(keywords.length / allKwCount) * 100}%`, background: "linear-gradient(90deg,#ffa940,#7c3aed)", borderRadius: 3, transition: "width .6s ease" }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: "#fff", padding: "0 16px 14px", display: "flex", gap: 6, overflowX: "auto", borderBottom: "1px solid #e2e8f0" }}>
        {epFilters.map(f => (
          <button key={f.id} onClick={() => setSelectedEp(f.id)}
            style={{ padding: "6px 14px", background: selectedEp === f.id ? "#1e293b" : "#f8fafc", border: `1px solid ${selectedEp === f.id ? "#1e293b" : "#e2e8f0"}`, borderRadius: 99, color: selectedEp === f.id ? "#fff" : "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        {keywords.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>まだワードがありません</div>
            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? "{各|かく}エピソードを{体験|たいけん}して" : "各エピソードを体験して"} /><br /><RubyText text={ageMode === "elementary" ? "キーワードを{記録|きろく}しよう" : "キーワードを記録しよう"} /></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: 13 }}>
            <RubyText text={ageMode === "elementary" ? "このエピソードのワードはまだ{記録|きろく}されていません" : "このエピソードのワードはまだ記録されていません"} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((kw, i) => {
              const master = lookupMasterKw(kw);
              const elData = kw.el || master?.el;
              const d = (ageMode === "elementary" && elData) ? { ...kw, ...elData } : kw;
              return (
                <button key={i} onClick={() => setDetail(kw)}
                  style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,.04)", animation: `slideUp .3s ${i * .05}s both ease` }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{d.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b", marginBottom: 2 }}><RubyText text={d.word} /></div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.85 }}><RubyText text={d.short} /></div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}><RubyText text={ageMode === "elementary" ? "{記録|きろく}{日|び}：" : "記録日："} />{kw.learnedAt}</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#cbd5e1" }}>›</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detail && (() => {
        const masterD = lookupMasterKw(detail);
        const elDataD = detail.el || masterD?.el;
        const dd = (ageMode === "elementary" && elDataD) ? { ...detail, ...elDataD } : detail;
        return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "flex-end", zIndex: 200, padding: 0 }} onClick={() => setDetail(null)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "24px 20px 40px", width: "100%", maxHeight: "85vh", overflowY: "auto", animation: "slideUp .3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e2e8f0", margin: "0 auto 20px" }} />
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>{dd.emoji}</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1e293b", textAlign: "center", margin: "0 0 4px" }}><RubyText text={dd.word} /></h2>
            <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginBottom: 16 }}>{detail.reading}</div>
            <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>📌 <RubyText text={dd.short} /></div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.85 }}><RubyText text={dd.detail} /></div>
            </div>
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#c2410c", marginBottom: 6 }}>📰 <RubyText text={ageMode === "elementary" ? "{実際|じっさい}に{起|お}きたこと" : "実際に起きたこと"} /></div>
              <div style={{ fontSize: 12, color: "#7c2d12", lineHeight: 1.85 }}><RubyText text={dd.news} /></div>
            </div>
            <div style={{ background: "#fef2f2", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#991b1b", fontWeight: 700 }}>⚠️ <RubyText text={dd.scary} /></div>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#166534" }}>🛡️ <RubyText text={dd.action} /></div>
            </div>
            <button onClick={() => setDetail(null)}
              style={{ width: "100%", padding: 14, background: "#1e293b", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              閉じる
            </button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════
// 🔧 機能フラグ
// Claude APIが必要な機能のオン/オフを一括管理
// APIキーを設定したらここを true に変えるだけで全機能が復活する
// ═══════════════════════════════════════════════
const CLAUDE_API_ENABLED = false; // true にするとClaude API機能が有効になる

const STORAGE_KEY = "mamoru_progress_v1";

const EP_META = {
  ep1: { title: "その写真、アップロードして大丈夫？", icon: "🔍", color: "#ffa940", theme: "個人情報・位置情報" },
  ep2: { title: "フェイクニュースを見抜け", icon: "🔎", color: "#7c3aed", theme: "情報リテラシー" },
  ep3: { title: "断れなくなる前に", icon: "⚠️", color: "#16a34a", theme: "闇バイト・詐欺" },
  ep4: { title: "それ、本当に友達から？", icon: "🎣", color: "#0ea5e9", theme: "なりすまし・フィッシング・スミッシング" },
  ep5: { title: "見ているだけも、いじめだった", icon: "👥", color: "#ec4899", theme: "ネットいじめ" },
  ep6: { title: "勝手に投稿、してない？", icon: "📸", color: "#f43f5e", theme: "肖像権" },
  ep7: { title: "その人、本当に同い年？", icon: "🕸️", color: "#8b5cf6", theme: "SNSでの出会いトラブル" },
  twodevice: { title: "親が犯罪者役になる体験", icon: "📲", color: "#f59e0b", theme: "闇バイト・詐欺" },
  attacker: { title: "投稿したら、何がバレる？", icon: "🎭", color: "#ff4343", theme: "個人情報漏洩" },
};

function loadRecord() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveRecord(key, data) {
  try {
    const all = loadRecord();
    all[key] = { ...all[key], ...data, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

function clearRecord() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// ─────────────────────────────────────────────
// ██ PARENT REPORT SCREEN
// ─────────────────────────────────────────────

// 保護者レポート ニュースタブ（Claude API連携）
// ═══════════════════════════════════════════════
// ℹ️ 情報ページ（運営者情報・プライバシーポリシー・利用規約）
// ═══════════════════════════════════════════════
function InfoScreen({ onBack }) {
  const ageMode = useAgeMode();
  const [tab, setTab] = useState("privacy"); // privacy | operator | terms

  const sections = {
    privacy: {
      label: "プライバシーポリシー",
      elLabel: "プライバシーポリシー",
      emoji: "🔒",
      content: [
        { title: "収集する情報について", elTitle: "{収集|しゅうしゅう}する{情報|じょうほう}について",
          body: "マモルは、お客様の個人情報を収集・送信しません。学習記録・キーワードノート・進捗データは、すべてお使いの端末のブラウザ内（localStorage）にのみ保存されます。外部サーバーへの送信は行いません。" },
        { title: "外部APIの利用について", elTitle: "{外部|がいぶ}APIの{利用|りよう}について",
          body: "マモルは学習コンテンツの生成に Anthropic社（Claude API）を利用しています。週次チャレンジ問題・保護者向けニュースの生成時にのみ、入力したプロンプト（質問内容）がサーバーを経由します。お子様の氏名・住所・学校名などの個人情報は一切送信されません。" },
        { title: "Cookieについて", elTitle: "Cookieについて",
          body: "マモルはCookieを使用しません。学習データの保存にはブラウザのlocalStorageを使用しています。" },
        { title: "第三者への提供", elTitle: "{第三者|だいさんしゃ}への{提供|ていきょう}",
          body: "収集した情報を第三者に販売・提供することはありません。" },
        { title: "データの削除について", elTitle: "データの{削除|さくじょ}について",
          body: "保護者レポート画面内の「データをリセット」ボタンから、端末内の全学習データを削除できます。また、ブラウザの設定からlocalStorageをクリアすることでも削除できます。" },
        { title: "お問い合わせ", elTitle: "お{問|と}い{合|あ}わせ",
          body: "プライバシーポリシーに関するご質問は、下記の運営者情報に記載のメールアドレスまでお問い合わせください。" },
        { title: "改定について", elTitle: "{改定|かいてい}について",
          body: "本ポリシーは予告なく改定する場合があります。重要な変更がある場合はアプリ内でお知らせします。最終更新：2026年5月" },
      ],
    },
    operator: {
      label: "運営者情報",
      elLabel: "{運営者|うんえいしゃ}{情報|じょうほう}",
      emoji: "👤",
      content: [
        { title: "サービス名", elTitle: "サービス{名|めい}",
          body: "マモル（Mamoru）— SNSリテラシー教育アプリ" },
        { title: "運営者", elTitle: "{運営者|うんえいしゃ}",
          body: "個人運営（詳細はお問い合わせください）" },
        { title: "所在地", elTitle: "{所在地|しょざいち}",
          body: "日本" },
        { title: "お問い合わせ", elTitle: "お{問|と}い{合|あ}わせ",
          body: "mamoru-app-info@gmail.com\n※ ご返信に数日かかる場合があります" },
        { title: "公開URL", elTitle: "{公開|こうかい}URL",
          body: "https://mamoru-xi.vercel.app" },
        { title: "対象年齢", elTitle: "{対象|たいしょう}{年齢|ねんれい}",
          body: "小学校高学年〜中学生とその保護者" },
        { title: "利用料金", elTitle: "{利用|りよう}{料金|りょうきん}",
          body: "完全無料（広告なし・課金なし）" },
      ],
    },
    terms: {
      label: "利用規約",
      elLabel: "{利用|りよう}{規約|きやく}",
      emoji: "📋",
      content: [
        { title: "利用について", elTitle: "{利用|りよう}について",
          body: "マモルは、子どものSNSリテラシー教育を目的とした無料サービスです。個人・教育機関での非商用利用に限り、自由にご利用いただけます。" },
        { title: "禁止事項", elTitle: "{禁止|きんし}{事項|じこう}",
          body: "・本サービスの無断複製・改変・再配布\n・商業目的での利用（事前許可なし）\n・サービスへの不正アクセス・妨害行為\n・法令に違反する利用" },
        { title: "免責事項", elTitle: "{免責|めんせき}{事項|じこう}",
          body: "本アプリのコンテンツは教育目的で作成されており、情報の正確性に努めていますが、完全性・最新性を保証するものではありません。本サービスの利用により生じたいかなる損害についても、運営者は責任を負いません。" },
        { title: "知的財産権", elTitle: "{知的|ちてき}{財産権|ざいさんけん}",
          body: "マモルのコンテンツ・デザイン・コードの著作権は運営者に帰属します。学校の授業・家庭での教育目的での利用・印刷は許可します。" },
        { title: "サービスの変更・終了", elTitle: "サービスの{変更|へんこう}・{終了|しゅうりょう}",
          body: "運営者は予告なくサービスの内容を変更・終了する場合があります。" },
        { title: "準拠法", elTitle: "{準拠|じゅんきょ}{法|ほう}",
          body: "本規約は日本国法に準拠します。" },
        { title: "AIの利用について", elTitle: "AIの{利用|りよう}について",
          body: "一部のコンテンツはAI（人工知能）を使って作成されています。" },
        { title: "データの取り扱い", elTitle: "データの{取|と}り{扱|あつか}い",
          body: "利用者が入力した内容は外部に送信されません。すべてのデータはお使いの端末にのみ保存されます。" },
      ],
    },
  };

  const current = sections[tab];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f8fafc,#f1f5f9)", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* ヘッダー */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b" }}>
          ℹ️ <RubyText text={ageMode === "elementary" ? "アプリ{情報|じょうほう}" : "アプリ情報"} />
        </div>
      </div>

      {/* タブ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 16px", display: "flex", gap: 4, overflowX: "auto" }}>
        {Object.entries(sections).map(([key, sec]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: "12px 14px", background: "none", border: "none", borderBottom: tab === key ? "2px solid #1e293b" : "2px solid transparent", color: tab === key ? "#1e293b" : "#64748b", fontSize: 12, fontWeight: tab === key ? 900 : 400, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
            {sec.emoji} <RubyText text={ageMode === "elementary" ? (sec.elLabel || sec.label) : sec.label} />
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ padding: "16px" }}>
        {current.content.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,.04)", animation: `slideUp .3s ${i * .05}s both ease` }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffa940", flexShrink: 0 }} />
              <RubyText text={ageMode === "elementary" ? (item.elTitle || item.title) : item.title} />
            </div>
            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentNewsTab() {
  const NEWS_CACHE_KEY = `mamoru_news_${getWeekNumber()}`;
  const [news, setNews] = useState(() => {
    try { const c = localStorage.getItem(NEWS_CACHE_KEY); return c ? JSON.parse(c) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // APIが無効の場合は準備中画面を表示
  if (!CLAUDE_API_ENABLED) return (
    <div style={{ textAlign: "center", padding: "40px 20px", animation: "slideUp .4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🚧</div>
      <div style={{ fontSize: 15, fontWeight: 900, color: "#1e293b", marginBottom: 8 }}>準備中</div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>
        AIによる週次ニュース生成機能は<br />近日公開予定です。<br />お楽しみに！
      </div>
    </div>
  );

  const fetchNews = async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `子どもとSNSリテラシーについて話し合うための保護者向けコンテンツを生成してください。

以下のJSON形式のみで返してください（説明・マークダウン不要）：
{
  "weekTopic": "今週話し合うべきテーマ（20字以内）",
  "topicEmoji": "絵文字1つ",
  "whyNow": "このテーマが今重要な理由（60字以内）",
  "talkStarters": [
    {"question": "子どもへの問いかけ例1（30字以内）", "hint": "どんな答えが来たら良いかのヒント（40字以内）"},
    {"question": "子どもへの問いかけ例2（30字以内）", "hint": "どんな答えが来たら良いかのヒント（40字以内）"},
    {"question": "子どもへの問いかけ例3（30字以内）", "hint": "どんな答えが来たら良いかのヒント（40字以内）"}
  ],
  "parentActions": [
    "保護者がすぐできること1（40字以内）",
    "保護者がすぐできること2（40字以内）",
    "保護者がすぐできること3（40字以内）"
  ],
  "dangerSign": "子どもの危険サインのチェックポイント（60字以内）",
  "contact": {"name": "相談窓口名", "tel": "電話番号またはURL"}
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setNews(parsed);
      try { localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(parsed)); } catch {}
    } catch { setError(true); }
    setLoading(false);
  };

  useEffect(() => { if (!news) fetchNews(); }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "40px 20px", animation: "slideUp .4s ease" }}>
      <div style={{ fontSize: 36, marginBottom: 12, animation: "float2 1.5s infinite" }}>🤖</div>
      <div style={{ fontSize: 14, color: "#64748b", fontWeight: 700 }}>AIが今週の話題を生成中…</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>最新のSNSリテラシー情報をまとめています</div>
    </div>
  );

  if (error || !news) return (
    <div style={{ textAlign: "center", padding: "32px 20px", animation: "slideUp .4s ease" }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>😔</div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>コンテンツの生成に失敗しました</div>
      <button onClick={fetchNews} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#ffa940,#ff6b00)", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        再試行する
      </button>
    </div>
  );

  return (
    <div style={{ animation: "slideUp .4s ease" }}>
      {/* 今週のテーマ */}
      <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", border: "1.5px solid #fed7aa", borderRadius: 18, padding: "18px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#c2410c", letterSpacing: ".08em", marginBottom: 8 }}>📡 今週の話し合いテーマ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 34 }}>{news.topicEmoji}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b" }}>{news.weekTopic}</div>
        </div>
        <div style={{ fontSize: 12, color: "#7c3a1e", lineHeight: 1.75, background: "rgba(255,255,255,.6)", borderRadius: 10, padding: "9px 12px" }}>
          {news.whyNow}
        </div>
      </div>

      {/* 話しかけ例 */}
      <div style={{ background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 14, border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#64748b", letterSpacing: ".08em", marginBottom: 12 }}>💬 子どもへの問いかけ例</div>
        {news.talkStarters?.map((ts, i) => (
          <div key={i} style={{ marginBottom: 12, paddingBottom: i < news.talkStarters.length - 1 ? 12 : 0, borderBottom: i < news.talkStarters.length - 1 ? "1px solid #f8fafc" : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>「{ts.question}」</div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.65, paddingLeft: 10, borderLeft: "2px solid #e2e8f0" }}>💡 {ts.hint}</div>
          </div>
        ))}
      </div>

      {/* 保護者アクション */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#166534", letterSpacing: ".08em", marginBottom: 10 }}>✅ 今週できること</div>
        {news.parentActions?.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.65 }}>{a}</div>
          </div>
        ))}
      </div>

      {/* 危険サイン */}
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#dc2626", marginBottom: 6 }}>⚠️ 子どもの危険サイン チェック</div>
        <div style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.75 }}>{news.dangerSign}</div>
      </div>

      {/* 相談先 */}
      {news.contact && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#3b82f6", fontWeight: 700, marginBottom: 3 }}>📞 相談窓口</div>
            <div style={{ fontSize: 12, color: "#1e40af" }}>{news.contact.name}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#1d4ed8" }}>{news.contact.tel}</div>
        </div>
      )}

      <div style={{ marginTop: 12, textAlign: "right" }}>
        <button onClick={fetchNews} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 12px", fontSize: 10, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
          🔄 更新する
        </button>
      </div>
    </div>
  );
}

function ParentReport({ onBack }) {
  const ageMode = useAgeMode();
  const [record, setRecord] = useState(loadRecord());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [tab, setTab] = useState("summary"); // summary | detail | advice | badges

  const epKeys = ["ep1", "ep2", "ep3", "ep4", "attacker"];
  const completed = epKeys.filter(k => record[k]?.completed);
  const totalScore = epKeys.reduce((s, k) => s + (record[k]?.score || 0), 0);
  const maxScore = epKeys.reduce((s, k) => s + (EP_META[k] ? 3 : 3), 0);
  const masteryPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getMasteryLabel = (pct) => {
    if (pct >= 80) return { label: "リテラシーマスター 🏆", elLabel: "リテラシーマスター 🏆", color: "#ffa940" };
    if (pct >= 50) return { label: "順調に成長中 ✨", elLabel: "{順調|じゅんちょう}に{成長|せいちょう}中 ✨", color: "#22c55e" };
    if (pct >= 20) return { label: "学習スタート 🌱", elLabel: "{学習|がくしゅう}スタート 🌱", color: "#0ea5e9" };
    return { label: "これから始めよう", elLabel: "これから{始|はじ}めよう", color: "#6b7280" };
  };

  const mastery = getMasteryLabel(masteryPct);

  // アドバイス生成
  const getAdvice = () => {
    const notDone = epKeys.filter(k => !record[k]?.completed);
    const weak = epKeys.filter(k => record[k]?.completed && (record[k]?.score || 0) < 2);
    const advice = [];

    if (notDone.length > 0) {
      advice.push({
        type: "next",
        icon: "▶️",
        title: "次にやるべきエピソード",
        elTitle: "{次|つぎ}にやるべきエピソード",
        body: `「${EP_META[notDone[0]]?.title}」がまだ未プレイです。テーマは「${EP_META[notDone[0]]?.theme}」。一緒にやってみましょう。`,
        color: "#0ea5e9",
      });
    }
    if (weak.length > 0) {
      advice.push({
        type: "retry",
        icon: "🔄",
        title: "もう一度やると効果的なエピソード",
        elTitle: "もう{一度|いちど}やると{効果的|こうかてき}なエピソード",
        body: `「${EP_META[weak[0]]?.title}」のスコアが低めです。「${EP_META[weak[0]]?.theme}」について、日常会話でも話し合ってみてください。`,
        color: "#f97316",
      });
    }
    if (completed.length >= 3) {
      advice.push({
        type: "talk",
        icon: "💬",
        title: "今日の話題にしてほしいこと",
        elTitle: "{今日|きょう}の{話題|わだい}にしてほしいこと",
        body: "「SNSに投稿する前に、一度考える習慣はついてきた？」と聞いてみましょう。正解を求めず、子どもの言葉を聞くことが大切です。",
        color: "#a78bfa",
      });
    }
    advice.push({
      type: "setting",
      icon: "📱",
      title: "家庭でできる具体的な設定",
      elTitle: "{家庭|かてい}でできる{具体的|ぐたいてき}な{設定|せってい}",
      body: "LINEの2段階認証・カメラの位置情報オフ・プライベートアカウント設定。お子さんのスマホで一緒に確認しましょう。",
      color: "#16a34a",
    });

    return advice;
  };

  const formatDate = (ts) => {
    if (!ts) return "未プレイ";
    return new Date(ts).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleClear = () => {
    clearRecord();
    setRecord({});
    setShowClearConfirm(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", padding: "20px 20px 28px", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,.12)", border: "none", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>← 戻る</button>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: ".2em", fontFamily: "'DotGothic16',monospace" }}>PARENT DASHBOARD</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
                <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}レポート 👨‍👩‍👧" : "保護者レポート 👨‍👩‍👧"} />
              </div>
            </div>
          </div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 6 }}>
            {([
              ["summary", "サマリー", "サマリー"],
              ["detail", "詳細", "{詳細|しょうさい}"],
              ["advice", "アドバイス", "アドバイス"],
              ["badges", "バッジ🏅", "バッジ🏅"],
              ["words", "言葉📝", "{言葉|ことば}📝"],
              ["news", "ニュース📰", "ニュース📰"],
            ]).map(([t, l, el]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: "8px 4px", background: tab === t ? "#fff" : "rgba(255,255,255,.1)", border: "none", borderRadius: 10, color: tab === t ? "#1e1b4b" : "rgba(255,255,255,.7)", fontSize: 12, fontWeight: tab === t ? 900 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
                <RubyText text={ageMode === "elementary" ? el : l} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* ── TAB: SUMMARY ── */}
        {tab === "summary" && (
          <div style={{ animation: "slideUp .4s ease" }}>
            {/* Mastery card */}
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#4c1d95)", borderRadius: 22, padding: "24px 20px", marginBottom: 16, color: "#fff", textAlign: "center", boxShadow: "0 8px 32px rgba(30,27,75,.3)" }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>🛡️</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>
                <RubyText text={ageMode === "elementary" ? "{習熟度|しゅうじゅくど}" : "習熟度"} />
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'DotGothic16',monospace", marginBottom: 4 }}>
                {masteryPct}<span style={{ fontSize: 18 }}>%</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: mastery.color }}>
                <RubyText text={ageMode === "elementary" ? (mastery.elLabel || mastery.label) : mastery.label} />
              </div>
              {/* Progress bar */}
              <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 99, height: 8, margin: "14px 0 0", overflow: "hidden" }}>
                <div style={{ width: `${masteryPct}%`, height: "100%", background: "linear-gradient(90deg,#ffa940,#ff6b6b)", borderRadius: 99, transition: "width 1s ease" }} />
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "✅", val: `${completed.length}/${epKeys.length}`, label: "クリア済み", elLabel: "クリア{済|ず}み" },
                { icon: "⭐", val: `${totalScore}/${maxScore}`, label: "総スコア", elLabel: "{総|そう}スコア" },
                { icon: "📅", val: completed.length > 0 ? `${Math.round(completed.length / epKeys.length * 100)}%` : "0%", label: "進捗率", elLabel: "{進捗|しんちょく}{率|りつ}" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "16px 10px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#1e1b4b", fontFamily: "'DotGothic16',monospace" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                    <RubyText text={ageMode === "elementary" ? (s.elLabel || s.label) : s.label} />
                  </div>
                </div>
              ))}
            </div>

            {/* Episode quick status */}
            <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid #f1f5f9", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#64748b", letterSpacing: ".1em", marginBottom: 14 }}>
                <RubyText text={ageMode === "elementary" ? "エピソード{進捗|しんちょく}" : "エピソード進捗"} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {epKeys.map(k => {
                  const meta = EP_META[k];
                  const rec = record[k];
                  const done = rec?.completed;
                  const score = rec?.score || 0;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: done ? `${meta.color}18` : "#f8fafc", border: `1.5px solid ${done ? meta.color + "44" : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{meta.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: done ? "#1e293b" : "#94a3b8" }}>{meta.title}</div>
                        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, marginTop: 5, overflow: "hidden" }}>
                          <div style={{ width: done ? `${(score / 3) * 100}%` : "0%", height: "100%", background: meta.color, borderRadius: 2, transition: "width 1s ease" }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: done ? meta.color : "#cbd5e1", flexShrink: 0 }}>
                        {done ? `${score}/3` : "未"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Last played */}
            {completed.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
                <RubyText text={ageMode === "elementary" ? "{最終|さいしゅう}プレイ" : "最終プレイ"} />
              </div>
                <div style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
                  {formatDate(Math.max(...epKeys.map(k => record[k]?.updatedAt || 0)))}
                </div>
              </div>
            )}

            {completed.length === 0 && (
              <div style={{ background: "#f8fafc", borderRadius: 16, padding: "24px 20px", textAlign: "center", border: "2px dashed #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  <RubyText text={ageMode === "elementary" ? "まだプレイ{記録|きろく}がありません" : "まだプレイ記録がありません"} />
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                  <RubyText text={ageMode === "elementary" ? "お{子|こ}さんとエピソードをプレイすると<br />ここに{記録|きろく}が{表示|ひょうじ}されます" : "お子さんとエピソードをプレイすると<br />ここに記録が表示されます"} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: DETAIL ── */}
        {tab === "detail" && (
          <div style={{ animation: "slideUp .4s ease" }}>
            {epKeys.map(k => {
              const meta = EP_META[k];
              const rec = record[k];
              const done = rec?.completed;
              return (
                <div key={k} style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: `1.5px solid ${done ? meta.color + "33" : "#f1f5f9"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: done ? 14 : 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${meta.color}14`, border: `1.5px solid ${meta.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{meta.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b" }}>{meta.title}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>テーマ：{meta.theme}</div>
                    </div>
                    <div style={{ background: done ? `${meta.color}18` : "#f1f5f9", borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: done ? meta.color : "#94a3b8" }}>
                      {done
                        ? <RubyText text="✓ クリア" />
                        : <RubyText text={ageMode === "elementary" ? "{未|み}プレイ" : "未プレイ"} />}
                    </div>
                  </div>
                  {done && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                          { label: "スコア", val: `${rec.score || 0}/3`, icon: "⭐", elLabel: "スコア" },
                          { label: "プレイ時間", val: rec.playTime ? `${Math.round(rec.playTime / 60)}分` : "−", icon: "⏱️", elLabel: "プレイ{時間|じかん}" },
                          { label: "リトライ", val: `${rec.retries || 0}回`, icon: "🔄", elLabel: "リトライ" },
                        ].map((s, i) => (
                          <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontSize: 14, marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: 14, fontWeight: 900, color: "#1e293b" }}>{s.val}</div>
                            <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
                              <RubyText text={ageMode === "elementary" ? (s.elLabel || s.label) : s.label} />
                            </div>
                          </div>
                        ))}
                      </div>
                      {rec.wrongChoices && rec.wrongChoices.length > 0 && (
                        <div style={{ background: "#fff7ed", borderRadius: 10, padding: "10px 12px", border: "1px solid #fed7aa" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#c2410c", marginBottom: 4 }}>
                            ⚠️ <RubyText text={ageMode === "elementary" ? "{間違|まちが}えた{選択肢|せんたくし}" : "間違えた選択肢"} />
                          </div>
                          {rec.wrongChoices.map((w, i) => (
                            <div key={i} style={{ fontSize: 11, color: "#9a3412", lineHeight: 1.6 }}>・{w}</div>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right" }}>
                        最終プレイ：{formatDate(rec.updatedAt)}
                      </div>
                    </div>
                  )}
                  {!done && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                      <RubyText text={ageMode === "elementary" ? `まだプレイしていません。「${meta.theme}」について{一緒|いっしょ}に{学|まな}びましょう。` : `まだプレイしていません。「${meta.theme}」について一緒に学びましょう。`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: ADVICE ── */}
        {tab === "advice" && (
          <div style={{ animation: "slideUp .4s ease" }}>
            <div style={{ background: "linear-gradient(135deg,#fef9c3,#fef08a)", borderRadius: 18, padding: "16px 18px", marginBottom: 16, border: "1px solid #fde047" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#713f12", marginBottom: 6 }}>
                💡 <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}の{方|かた}へ" : "保護者の方へ"} />
              </div>
              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.8 }}>
                <RubyText text={ageMode === "elementary"
                  ? "このアドバイスはお{子|こ}さんのプレイ{記録|きろく}をもとに{自動生成|じどうせいせい}されます。{答|こた}えを{教|おし}えるよりも、「どう{思|おも}う？」と{問|と}いかけることが{最|もっと}も{効果的|こうかてき}な{教育|きょういく}です。"
                  : "このアドバイスはお子さんのプレイ記録をもとに自動生成されます。答えを教えるよりも、「どう思う？」と問いかけることが最も効果的な教育です。"
                } />
              </div>
            </div>

            {getAdvice().map((a, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", marginBottom: 12, borderLeft: `4px solid ${a.color}`, boxShadow: "0 2px 12px rgba(0,0,0,.06)", animation: `slideUp .4s ${i * .1}s both ease` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b" }}>
                    <RubyText text={ageMode === "elementary" ? (a.elTitle || a.title) : a.title} />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.8 }}>{a.body}</div>
              </div>
            ))}

            {/* 話題カード */}
            <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#1e293b", marginBottom: 12 }}>
                🗣️ <RubyText text={ageMode === "elementary" ? "{今週|こんしゅう}の{会話|かいわ}テーマ" : "今週の会話テーマ"} />
              </div>
              {[
                "「投稿する前に、誰かに見られても大丈夫か考える？」",
                "「怪しいDMが来たら、まず誰に相談する？」",
                "「認証コードを誰かに教えたことある？」",
                "「SNSで怖い思いをしたこと、あった？」",
              ].map((q, i) => (
                <div key={i} style={{ padding: "10px 12px", background: i % 2 === 0 ? "#f8fafc" : "#fff", borderRadius: 10, marginBottom: 6, fontSize: 12, color: "#475569", lineHeight: 1.6, borderLeft: "3px solid #e2e8f0" }}>
                  {q}
                </div>
              ))}
            </div>

            {/* Print hint */}
            <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "14px 16px", border: "1px solid #bbf7d0", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>
                📋 <RubyText text={ageMode === "elementary" ? "このレポートを{共有|きょうゆう}するには" : "このレポートを共有するには"} />
              </div>
              <div style={{ fontSize: 11, color: "#15803d", lineHeight: 1.7 }}>
                <RubyText text={ageMode === "elementary" ? "ブラウザの「{共有|きょうゆう}」や「{印刷|いんさつ}」{機能|きのう}を{使|つか}ってください。<br />もう{一方|いっぽう}の{保護者|ほごしゃ}と{情報|じょうほう}を{共有|きょうゆう}しましょう。" : "ブラウザの「共有」や「印刷」機能を使ってください。<br />もう一方の保護者と情報を共有しましょう。"} />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: BADGES ── */}
        {tab === "badges" && (
          <div style={{ animation: "slideUp .4s ease" }}>
            <BadgeGallery record={record} />
          </div>
        )}

        {/* ── TAB: WORDS ── */}
        {tab === "words" && (
          <div style={{ animation: "slideUp .4s ease" }}>
            <div style={{ background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "1px solid #bae6fd" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0c4a6e", marginBottom: 6 }}>
                ✍️ <RubyText text={ageMode === "elementary" ? "{子|こ}どもが{自分|じぶん}の{言葉|ことば}で{記録|きろく}したこと" : "子どもが自分の言葉で記録したこと"} />
              </div>
              <div style={{ fontSize: 12, color: "#075985", lineHeight: 1.7 }}>
                <RubyText text={ageMode === "elementary" ? "{各|かく}エピソード{終了後|しゅうりょうご}に{入力|にゅうりょく}した{内容|ないよう}です。{子|こ}どもと{一緒|いっしょ}に{読|よ}み{返|かえ}してみましょう。" : "各エピソード終了後に入力した内容です。子どもと一緒に読み返してみましょう。"} />
              </div>
            </div>
            {Object.keys(EP_META).filter(k => !["twodevice","attacker"].includes(k)).map(k => {
              let saved = "";
              try { saved = localStorage.getItem(`mamoru_mywords_${k}`) || ""; } catch {}
              const meta = EP_META[k];
              return (
                <div key={k} style={{ background: "#fff", borderRadius: 16, padding: "16px", marginBottom: 10, border: `1px solid ${saved ? meta.color + "33" : "#f1f5f9"}`, boxShadow: saved ? `0 2px 12px ${meta.color}12` : "0 2px 8px rgba(0,0,0,.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: saved ? 10 : 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${meta.color}14`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{meta.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#1e293b" }}>{meta.title}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{meta.theme}</div>
                    </div>
                    {!saved && <div style={{ marginLeft: "auto", fontSize: 10, color: "#cbd5e1" }}>未入力</div>}
                  </div>
                  {saved && (
                    <div style={{ background: `${meta.color}06`, borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#334155", lineHeight: 1.75, fontStyle: "italic", borderLeft: `3px solid ${meta.color}` }}>
                      「{saved}」
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: NEWS ── */}
        {tab === "news" && <ParentNewsTab />}

        {/* Reset button */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)}
              style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 18px", fontSize: 11, color: "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>
              🗑️ <RubyText text={ageMode === "elementary" ? "プレイ{記録|きろく}をリセット" : "プレイ記録をリセット"} />
            </button>
          ) : (
            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #fecaca" }}>
              <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, marginBottom: 10 }}>
                <RubyText text={ageMode === "elementary" ? "{本当|ほんとう}にリセットしますか？{記録|きろく}が{全|すべ}て{消|き}えます。" : "本当にリセットしますか？記録が全て消えます。"} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowClearConfirm(false)}
                  style={{ flex: 1, padding: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#475569" }}>キャンセル</button>
                <button onClick={handleClear}
                  style={{ flex: 1, padding: "8px", background: "#dc2626", border: "none", borderRadius: 10, fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#fff", fontWeight: 700 }}>リセット</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED: OWL CHARACTER
// ─────────────────────────────────────────────
function OwlMolly({ size = 80, mood = "happy", style: s = {} }) {
  const cfg = {
    happy:   { eyeRy: 6,  eyeColor: "#2c1810", blush: 0.45, mouth: "M 50 88 Q 60 95 70 88", bodyAnim: "float2 3s ease-in-out infinite" },
    worried: { eyeRy: 3,  eyeColor: "#cc2200", blush: 0,    mouth: "M 50 90 Q 60 85 70 90", bodyAnim: "float2 4s ease-in-out infinite" },
    excited: { eyeRy: 7,  eyeColor: "#2c1810", blush: 0.85, mouth: "M 48 87 Q 60 97 72 87", bodyAnim: "celebrate .8s ease-in-out infinite" },
    sad:     { eyeRy: 4,  eyeColor: "#336699", blush: 0,    mouth: "M 50 92 Q 60 86 70 92", bodyAnim: "float2 5s ease-in-out infinite" },
    scared:  { eyeRy: 8,  eyeColor: "#cc0000", blush: 0,    mouth: "M 52 90 Q 60 94 68 90", bodyAnim: "shake .4s ease-in-out infinite" },
    proud:   { eyeRy: 5,  eyeColor: "#2c1810", blush: 0.65, mouth: "M 47 86 Q 60 96 73 86", bodyAnim: "celebrate 1.2s ease-in-out infinite" },
  }[mood] || { eyeRy: 6, eyeColor: "#2c1810", blush: 0.45, mouth: "M 50 88 Q 60 95 70 88", bodyAnim: "float2 3s ease-in-out infinite" };

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}
      style={{ animation: cfg.bodyAnim, display: "block", ...s }}>
      {/* Wings */}
      <ellipse cx="22" cy="65" rx="14" ry="22" fill="#8b6240"
        style={{ transformOrigin: "30px 50px", animation: "wingFlap 2s ease-in-out infinite" }} />
      <ellipse cx="98" cy="65" rx="14" ry="22" fill="#8b6240"
        style={{ transformOrigin: "90px 50px", animation: "wingFlap 2s ease-in-out infinite reverse" }} />
      {/* Body */}
      <ellipse cx="60" cy="70" rx="38" ry="42" fill="#c9986a" />
      <ellipse cx="60" cy="78" rx="26" ry="30" fill="#f4d4a8" />
      {/* Eye whites */}
      <circle cx="45" cy="40" r="14" fill="#fff" />
      <circle cx="75" cy="40" r="14" fill="#fff" />
      <circle cx="45" cy="40" r="14" fill="none" stroke="#8b6240" strokeWidth="2" />
      <circle cx="75" cy="40" r="14" fill="none" stroke="#8b6240" strokeWidth="2" />
      {/* Pupils */}
      <ellipse cx="45" cy="38" rx="5" ry={cfg.eyeRy} fill={cfg.eyeColor} />
      <ellipse cx="75" cy="38" rx="5" ry={cfg.eyeRy} fill={cfg.eyeColor} />
      {/* Eye shine */}
      <circle cx="46.5" cy="35" r="2" fill="#fff" />
      <circle cx="76.5" cy="35" r="2" fill="#fff" />
      {/* Beak */}
      <path d="M55 48 L65 48 L60 56Z" fill="#ffa940" />
      {/* Ear tufts */}
      <path d="M35 18 L32 32 L42 26Z" fill="#8b6240" />
      <path d="M85 18 L88 32 L78 26Z" fill="#8b6240" />
      {/* Eye rings */}
      <circle cx="45" cy="40" r="11" fill="none" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
      <circle cx="75" cy="40" r="11" fill="none" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
      <line x1="56" y1="40" x2="64" y2="40" stroke="#5c3a1e" strokeWidth="1.5" opacity="0.4" />
      {/* Blush */}
      <ellipse cx="34" cy="52" rx="7" ry="5" fill="#ff9999" opacity={cfg.blush} />
      <ellipse cx="86" cy="52" rx="7" ry="5" fill="#ff9999" opacity={cfg.blush} />
      {/* Mood-specific mouth */}
      <path d={cfg.mouth} stroke="#8b6240" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Excited sparkles */}
      {(mood === "excited" || mood === "proud") && <>
        <circle cx="18" cy="22" r="2" fill="#fbbf24" style={{ animation: "blink 1s infinite" }} />
        <circle cx="102" cy="18" r="2" fill="#fbbf24" style={{ animation: "blink 1s .3s infinite" }} />
        <circle cx="108" cy="35" r="1.5" fill="#fbbf24" style={{ animation: "blink 1s .6s infinite" }} />
      </>}
      {/* Scared sweat drop */}
      {mood === "scared" && <ellipse cx="92" cy="26" rx="3" ry="5" fill="#93c5fd" opacity="0.7" />}
    </svg>
  );
}

// ─────────────────────────────────────────────
// SHARED: TYPEWRITER
// ─────────────────────────────────────────────
function Typewriter({ text, speed = 60, style: s = {}, onDone }) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span style={s}>{out}{!done && <span style={{ animation: "blink .7s infinite" }}>▊</span>}</span>;
}

// ─────────────────────────────────────────────
// SHARED: OWL DIALOGUE BUBBLE
// ─────────────────────────────────────────────
function OwlSay({ children, mood = "happy", e }) {
  const ageMode = useAgeMode();
  const useEl = ageMode === "elementary" && e !== undefined;
  const content = useEl ? <RubyText text={e} /> : children;
  const moodStyles = {
    happy:   { bg: "#fff",                  border: "#f4d4a8", text: "#3d2817", anim: "float2 3s ease-in-out infinite" },
    worried: { bg: "#fff8f8",               border: "#ffaaaa", text: "#7a1a1a", anim: "shake .5s ease" },
    excited: { bg: "#f0fff4",               border: "#86efac", text: "#14532d", anim: "celebrate .6s ease" },
    sad:     { bg: "#f0f8ff",               border: "#93c5fd", text: "#1e3a5f", anim: "float2 4s ease-in-out infinite" },
    scared:  { bg: "#fff0f0",               border: "#fca5a5", text: "#7f1d1d", anim: "shake .3s ease infinite" },
    proud:   { bg: "rgba(255,215,0,.08)",   border: "#fbbf24", text: "#78350f", anim: "celebrate 1s ease" },
  };
  const ms = moodStyles[mood] || moodStyles.happy;
  const moodEmoji = {
    happy: "", worried: "😟", excited: "🎉", sad: "😢", scared: "😱", proud: "🌟"
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, margin: "14px 0", animation: "slideUp .4s ease" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <OwlMolly size={64} mood={mood} />
        {moodEmoji[mood] && (
          <div style={{
            position: "absolute", top: -6, right: -6,
            fontSize: 16, animation: "popIn .3s ease",
          }}>{moodEmoji[mood]}</div>
        )}
      </div>
      <div style={{
        background: ms.bg,
        borderRadius: "18px 18px 18px 4px",
        padding: "11px 15px",
        boxShadow: "0 4px 16px rgba(94,64,32,.12)",
        border: `2px solid ${ms.border}`,
        fontSize: 13, lineHeight: 1.75,
        color: ms.text,
        fontFamily: "'Zen Maru Gothic',sans-serif",
        fontWeight: 500, maxWidth: 270,
        animation: ms.anim,
      }}>{content}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DATA: Episode 1 posts
// ─────────────────────────────────────────────
const POSTS = [
  {
    id: 1, day: "4/8", textKey: "p1Text",
    photoBg: "linear-gradient(135deg,#ffd6e0,#ffafcc)", photoIcon: "🌸",
    localImage: "/images/ep1/post1.png",
    elements: [
      // 校章マーカー削除
      { x: 82, y: 42, emoji: "🏫", labelKey: "schoolSign",    infoKey: "schoolSignInfo",    danger: true },  // 桜花中学校の看板
    ],
  },
  {
    id: 2, day: "4/15", textKey: "p2Text",
    photoBg: "linear-gradient(135deg,#fff4d6,#ffc97a)", photoIcon: "🍰",
    localImage: "/images/ep1/post2.png",
    elements: [
      { x: 78, y: 22, emoji: "🗼", labelKey: "landmark",    infoKey: "landmarkInfo",    danger: true },  // 東京タワー（右上）
      { x: 76, y: 52, emoji: "🏢", labelKey: "sign",        infoKey: "signInfo",        danger: true },  // タナカ工業（右寄りに修正）
    ],
  },
  {
    id: 3, day: "4/19", textKey: "p3Text",
    photoBg: "linear-gradient(135deg,#d6e8ff,#7ab8ff)", photoIcon: "☕",
    localImage: "/images/ep1/post3.png",
    elements: [
      // メニュー表マーカー削除、看板のみ残して右下にずらす
      { x: 84, y: 38, emoji: "🏪", labelKey: "cafeName",    infoKey: "cafeNameInfo",    danger: true },  // カフェ名看板（右下にずらす）
    ],
  },
  {
    id: 4, day: "4/22", textKey: "p4Text",
    photoBg: "linear-gradient(135deg,#e0d6ff,#a98aff)", photoIcon: "🐕",
    localImage: "/images/ep1/post4.png",
    elements: [
      { x: 44, y: 36, emoji: "🏠", labelKey: "nameplate",   infoKey: "nameplateInfo",   danger: true },  // 表札「雨宮」
      { x: 80, y: 62, emoji: "🚗", labelKey: "license",     infoKey: "licenseInfo",     danger: true },  // ナンバープレート
    ],
  },
];

// ─────────────────────────────────────────────
// ██ チュートリアル
// ─────────────────────────────────────────────
const TUTORIAL_KEY = "mamoru_tutorial_v1";

const TUTORIAL_STEPS = [
  { step: 1, highlight: null, position: "center",
    message: "マモルへようこそ！\n画面の使い方をかんたんに説明するね。\nタップして進んでね！",
    messageEl: "マモルへようこそ！\n{画面|がめん}の{使|つか}い{方|かた}をかんたんに{説明|せつめい}するね。\nタップして{進|すす}んでね！" },
  { step: 2, highlight: "badges", position: "below",
    message: "エピソードをクリアすると\n実績バッジがもらえるよ。\n全部集めてみよう！🏆",
    messageEl: "エピソードをクリアすると\n{実績|じっせき}バッジがもらえるよ。\n{全部|ぜんぶ}{集|あつ}めてみよう！🏆" },
  { step: 3, highlight: "modeSwitch", position: "below",
    message: "小学生・中学生モードを\n切り替えられるよ。\n漢字のルビが変わるんだ！",
    messageEl: "{小学生|しょうがくせい}・{中学生|ちゅうがくせい}モードを\n{切|き}り{替|か}えられるよ。\n{漢字|かんじ}のルビが{変|か}わるんだ！" },
  { step: 4, highlight: "tabLearn", position: "above",
    message: "『学ぶ』タブでは\nエピソードごとにSNSの\n危険を体験しながら学べるよ！📚",
    messageEl: "「{学|まな}ぶ」タブでは\nエピソードごとにSNSの\n{危険|きけん}を{体験|たいけん}しながら{学|まな}べるよ！📚" },
  { step: 5, highlight: "tabChallenge", position: "above",
    message: "『チャレンジ』では\n週ごとに新しい問題に\n挑戦できるよ。毎週来てね！🔥",
    messageEl: "「チャレンジ」では\n{週|しゅう}ごとに{新|あたら}しい{問題|もんだい}に\n{挑戦|ちょうせん}できるよ。{毎週|まいしゅう}{来|き}てね！🔥" },
  { step: 6, highlight: "tabParent", position: "above",
    message: "保護者の方はここから\n学習記録の確認や\n設定のリセットができるよ👨‍👩‍👧",
    messageEl: "{保護者|ほごしゃ}の{方|かた}はここから\n{学習|がくしゅう}{記録|きろく}の{確認|かくにん}や\n{設定|せってい}のリセットができるよ👨‍👩‍👧" },
];

function TutorialOverlay({ step, onNext, onSkip, refs }) {
  const currentStep = TUTORIAL_STEPS.find(s => s.step === step);
  const [highlightRect, setHighlightRect] = useState(null);
  const ageMode = useAgeMode();

  useEffect(() => {
    if (!currentStep.highlight) { setHighlightRect(null); return; }
    const ref = refs[currentStep.highlight];
    if (ref?.current) {
      const rect = ref.current.getBoundingClientRect();
      setHighlightRect(rect);
    } else {
      setHighlightRect(null);
    }
  }, [step]);

  const message = ageMode === "elementary" ? currentStep.messageEl : currentStep.message;
  const isLast = step === TUTORIAL_STEPS.length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, pointerEvents: "all" }}>
      {/* 全体オーバーレイ */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.78)" }} onClick={onNext} />

      {/* ハイライト枠 */}
      {highlightRect && (
        <div style={{ position: "absolute", top: highlightRect.top - 4, left: highlightRect.left - 4, width: highlightRect.width + 8, height: highlightRect.height + 8, border: "2.5px solid #ffa940", borderRadius: 14, boxShadow: "0 0 0 4px rgba(255,169,64,.25)", pointerEvents: "none", animation: "glowPulse 1.5s ease-in-out infinite", zIndex: 501 }} />
      )}

      {/* STEP 1：中央にモリィ */}
      {!currentStep.highlight && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 502 }}>
          <OwlMolly size={90} />
          <div style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", marginTop: 16, maxWidth: 300, textAlign: "center", animation: "slideUp .4s ease" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", lineHeight: 1.8, margin: "0 0 14px", whiteSpace: "pre-line" }}>
              <RubyText text={message} />
            </p>
            <button onClick={onNext} style={{ background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 99, padding: "10px 28px", fontSize: 14, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              はじめる →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2〜6：ハイライト要素近くの吹き出し */}
      {currentStep.highlight && highlightRect && (
        <div style={{
          position: "absolute",
          left: Math.max(12, Math.min(highlightRect.left + highlightRect.width / 2 - 140, window.innerWidth - 292)),
          ...(currentStep.position === "above"
            ? { bottom: window.innerHeight - highlightRect.top + 12 }
            : { top: highlightRect.bottom + 12 }),
          width: 280,
          zIndex: 502,
          animation: "slideUp .35s ease",
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 10, justifyContent: "center" }}>
              {TUTORIAL_STEPS.map(s => (
                <div key={s.step} style={{ width: s.step === step ? 18 : 6, height: 6, borderRadius: 99, background: s.step === step ? "#ffa940" : "#e2e8f0", transition: "all .3s" }} />
              ))}
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.8, margin: "0 0 12px", textAlign: "center", whiteSpace: "pre-line" }}>
              <RubyText text={message} />
            </p>
            <button onClick={() => { feedback("tap"); onNext(); }} style={{ width: "100%", background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 12, padding: "10px", fontSize: 13, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              {isLast ? "OK！はじめよう 🛡️" : "次へ →"}
            </button>
          </div>
        </div>
      )}

      {/* スキップボタン（STEP 1以外） */}
      {step > 1 && (
        <button onClick={() => { feedback("tap"); onSkip(); }} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,.8)", cursor: "pointer", fontFamily: "inherit", zIndex: 503 }}>
          スキップ
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ onNavigate, progress, startTutorial, onTutorialStarted }) {
  const t = useT();
  const { ageMode, setAgeMode } = useContext(AgeModeContext);
  const kwCount = loadKeywords().length;

  // ── 隠しコマンド state ──
  const [owlTapCount, setOwlTapCount] = useState(0);       // ① モリィ10回タップ
  const [secret1, setSecret1] = useState(false);
  const [logoHoldTimer, setLogoHoldTimer] = useState(null);  // ② ロゴ長押し
  const [secret2, setSecret2] = useState(false);
  const [swipeSeq, setSwipeSeq] = useState([]);              // ③ 左右スワイプ
  const [swipeStart, setSwipeStart] = useState(null);
  const [secret3, setSecret3] = useState(false);
  const [reportHoldTimer, setReportHoldTimer] = useState(null); // ④ レポートボタン長押し
  const [secret4, setSecret4] = useState(false);
  const [secretMsg, setSecretMsg] = useState("");

  // EP1-2: EP1クリアでアンロック（パスワードゲート廃止）

  // モリィセリフリスト
  const mollyMessages = [
    "まずはEPISODE 1から始めるのがおすすめだよ！",
    "知らなかった！って気づくことが、守る第一歩だよ🛡️",
    "SNSって楽しいけど、ちょっと待って。一緒に確認しよう！",
    "おうちの人と一緒にやると、もっと学べるよ👨‍👩‍👧",
    "怖い話もあるけど、知っていれば大丈夫！一緒にがんばろう🦉",
    "全エピソードクリアしたら、スマホ名人だね✨",
    "投稿する前に、一度だけ立ち止まって考えてみよう📱",
    "マモルを使ってくれてありがとう！きみのこと、応援してるよ🎉",
    "今日学んだことを、だれかに話してみよう。それが一番の復習！",
    "ネットのトラブルは、知識があれば9割防げるって知ってた？💡",
  ];
  const mollyMessagesEl = [
    "まずはEPISODE 1から{始|はじ}めるのがおすすめだよ！",
    "{知|し}らなかった！って{気|き}づくことが、{守|まも}る{第一歩|だいいっぽ}だよ🛡️",
    "SNSって{楽|たの}しいけど、ちょっと{待|ま}って。{一緒|いっしょ}に{確認|かくにん}しよう！",
    "おうちの{人|ひと}と{一緒|いっしょ}にやると、もっと{学|まな}べるよ👨‍👩‍👧",
    "{怖|こわ}い{話|はなし}もあるけど、{知|し}っていれば{大丈夫|だいじょうぶ}！{一緒|いっしょ}にがんばろう🦉",
    "{全|ぜん}エピソードクリアしたら、スマホ{名人|めいじん}だね✨",
    "{投稿|とうこう}する{前|まえ}に、{一度|いちど}だけ{立|た}ち{止|と}まって{考|かんが}えてみよう📱",
    "マモルを{使|つか}ってくれてありがとう！きみのこと、{応援|おうえん}してるよ🎉",
    "{今日|きょう}{学|まな}んだことを、だれかに{話|はな}してみよう。それが{一番|いちばん}の{復習|ふくしゅう}！",
    "ネットのトラブルは、{知識|ちしき}があれば9{割|わり}{防|ふせ}げるって{知|し}ってた？💡",
  ];
  const [mollyMsgIdx, setMollyMsgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("top");

  // チュートリアル
  const [tutorialStep, setTutorialStep] = useState(0);
  const showTutorial = tutorialStep > 0;
  const finishTutorial = () => { setTutorialStep(0); };
  const nextTutorialStep = () => {
    if (tutorialStep >= TUTORIAL_STEPS.length) finishTutorial();
    else setTutorialStep(s => s + 1);
  };
  useEffect(() => {
    if (startTutorial) {
      setTutorialStep(1);
      if (onTutorialStarted) onTutorialStarted();
    }
  }, [startTutorial]);
  const tutorialRefs = {
    badges:      useRef(null),
    modeSwitch:  useRef(null),
    tabLearn:    useRef(null),
    tabChallenge: useRef(null),
    tabParent:   useRef(null),
  };

  const tabs = [
    { id: "top",       icon: "🦉",   label: "トップ",       labelEl: "トップ" },
    { id: "learn",     icon: "📚",   label: "学ぶ",         labelEl: "まなぶ" },
    { id: "challenge", icon: "🔥",   label: "チャレンジ",   labelEl: "チャレンジ" },
    { id: "parent",    icon: "👨‍👩‍👧", label: "保護者の方へ", labelEl: "ほごしゃのかたへ" },
  ];

  // モリィタップ（シークレットコマンド）
  const handleOwlTap = () => {
    const next = owlTapCount + 1;
    setOwlTapCount(next);
    if (next >= 10) { setOwlTapCount(0); setSecret1(true); try { localStorage.setItem("mamoru_secret1_found", "1"); } catch {} }
    else if (next >= 5) setSecretMsg(`あと${10 - next}回！`);
    else setSecretMsg("");
  };

  // モリィタップ（セリフ変更 + シークレット）
  const handleMollyTap = () => {
    feedback("tap");
    handleOwlTap();
    setMollyMsgIdx(prev => {
      let next;
      do { next = Math.floor(Math.random() * mollyMessages.length); } while (next === prev);
      return next;
    });
  };

  // スワイプ検出（左右左右左）
  const SWIPE_SEQ = ["L","R","L","R","L"];
  const handleTouchStart = (e) => setSwipeStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (swipeStart === null) return;
    const dx = e.changedTouches[0].clientX - swipeStart;
    if (Math.abs(dx) < 40) return;
    const dir = dx < 0 ? "L" : "R";
    const next = [...swipeSeq, dir];
    const match = next.slice(-SWIPE_SEQ.length);
    if (JSON.stringify(match) === JSON.stringify(SWIPE_SEQ)) {
      setSwipeSeq([]); setSecret3(true); try { localStorage.setItem("mamoru_secret3_found", "1"); } catch {}
    } else {
      setSwipeSeq(next.slice(-5));
    }
    setSwipeStart(null);
  };
  const modes = [
    { id: "ep1", tag: t("modes.ep1.tag"), title: t("modes.ep1.title"), icon: "🔍", desc: t("modes.ep1.desc"), duration: t("modes.ep1.duration"), audience: t("modes.ep1.audience"), accent: "#ffa940", bg1: "#1a1000", bg2: "#0f0800", done: progress.ep1 },
    { id: "ep12",
      tag: ageMode === "elementary" ? "EPISODE 01-2 · {位置情報|いちじょうほう}サービス" : "EPISODE 01-2 · 位置情報サービス",
      title: ageMode === "elementary" ? "{本当|ほんとう}は、{位置情報|いちじょうほう}が{見|み}えてるよ" : "本当は、位置情報が見えてるよ",
      icon: "📍",
      desc: ageMode === "elementary" ? "スマホが{毎日|まいにち}どこにいたか{記録|きろく}している！{実際|じっさい}に{確認|かくにん}して、いっしょに{設定|せってい}を{変|か}えよう。" : "スマホが毎日どこにいたか記録している！実際に確認して、一緒に設定を変えよう。",
      duration: ageMode === "elementary" ? "{約|やく}8{分|ふん}" : "約8分",
      audience: ageMode === "elementary" ? "{小学生|しょうがくせい}〜・{親子|おやこ}で" : "小学生〜・親子で",
      accent: "#ffa940", bg1: "#1a1000", bg2: "#0f0800", done: progress.ep12, locked: !progress.ep1 },
    { id: "ep2", tag: t("modes.ep2.tag"), title: t("modes.ep2.title"), icon: "🔎", desc: t("modes.ep2.desc"), duration: t("modes.ep2.duration"), audience: t("modes.ep2.audience"), accent: "#7c3aed", bg1: "#0f0a1e", bg2: "#07041a", done: progress.ep2 },
    { id: "ep3", tag: t("modes.ep3.tag"), title: t("modes.ep3.title"), icon: "⚠️", desc: t("modes.ep3.desc"), duration: t("modes.ep3.duration"), audience: t("modes.ep3.audience"), accent: "#16a34a", bg1: "#0a1a0a", bg2: "#041004", done: progress.ep3 },
    { id: "ep32", tag: t("modes.ep32.tag"), title: t("modes.ep32.title"), icon: "💬", desc: t("modes.ep32.desc"), duration: t("modes.ep32.duration"), audience: t("modes.ep32.audience"), accent: "#06c755", bg1: "#041210", bg2: "#020c08", done: progress.ep32 },
    { id: "ep4", tag: t("modes.ep4.tag"), title: t("modes.ep4.title"), icon: "🔐", desc: t("modes.ep4.desc"), duration: t("modes.ep4.duration"), audience: t("modes.ep4.audience"), accent: "#0ea5e9", bg1: "#031220", bg2: "#020c18", done: progress.ep4 },
    { id: "ep5",
      tag: ageMode === "elementary" ? "EPISODE 05 · {傍観者|ぼうかんしゃ}{体験|たいけん}" : "EPISODE 05 · 傍観者体験",
      title: ageMode === "elementary" ? "{見|み}ているだけも、いじめだった" : "見ているだけも、いじめだった",
      icon: "👥",
      desc: ageMode === "elementary" ? "グループLINEで{悪口|わるくち}が{流|なが}れてきた。{笑|わら}う・{無視|むし}する・{止|と}める。あなたの{選択|せんたく}が、だれかの{人生|じんせい}を{変|か}える。" : "グループLINEで悪口が流れてきた。笑う・無視する・止める。あなたの選択が、誰かの人生を変える。",
      duration: ageMode === "elementary" ? "{約|やく}8{分|ふん}" : "約8分",
      audience: ageMode === "elementary" ? "{小|しょう}〜{中学生|ちゅうがくせい}・{親子|おやこ}で" : "小〜中学生・親子で",
      accent: "#ec4899", bg1: "#1a0510", bg2: "#0f0208", done: progress.ep5 },
    { id: "ep6",
      tag: ageMode === "elementary" ? "EPISODE 06 · {肖像権|しょうぞうけん}{体験|たいけん}" : "EPISODE 06 · 肖像権体験",
      title: ageMode === "elementary" ? "{勝手|かって}に{投稿|とうこう}、してない？" : "勝手に投稿、してない？",
      icon: "📸",
      desc: ageMode === "elementary" ? "{友達|ともだち}の{写真|しゃしん}を{投稿|とうこう}する{前|まえ}に{許可|きょか}は{取|と}りましたか？{投稿|とうこう}された{側|がわ}の{気持|きも}ちと{肖像権|しょうぞうけん}を{体験|たいけん}から{学|まな}ぼう。" : "友達の写真を投稿する前に許可は取りましたか？投稿された側の気持ちと肖像権を体験から学ぼう。",
      duration: ageMode === "elementary" ? "{約|やく}7{分|ふん}" : "約7分",
      audience: ageMode === "elementary" ? "{小|しょう}〜{中学生|ちゅうがくせい}・{親子|おやこ}で" : "小〜中学生・親子で",
      accent: "#f43f5e", bg1: "#1a0308", bg2: "#0f0205", done: progress.ep6 },
    { id: "ep7",
      tag: ageMode === "elementary" ? "EPISODE 07 · SNS{出会|であ}いトラブル" : "EPISODE 07 · SNS出会いトラブル",
      title: ageMode === "elementary" ? "その{人|ひと}、{本当|ほんとう}に{同|おな}い{年|どし}？" : "その人、本当に同い年？",
      icon: "🕸️",
      desc: ageMode === "elementary" ? "SNSで{知|し}り{合|あ}った「{同|おな}い{年|どし}の{子|こ}」。でも{本当|ほんとう}に{同|おな}い{年|どし}ですか？グルーミングの{手口|てぐち}をリアルな{体験|たいけん}から{学|まな}ぼう。" : "SNSで知り合った「同い年の子」。でも本当に同い年ですか？グルーミングの手口をリアルな体験から学ぼう。",
      duration: ageMode === "elementary" ? "{約|やく}8{分|ふん}" : "約8分",
      audience: ageMode === "elementary" ? "{中学生|ちゅうがくせい}〜・{親子|おやこ}で" : "中学生〜・親子で",
      accent: "#8b5cf6", bg1: "#1a0a2e", bg2: "#0a0515", done: progress.ep7 },
    { id: "twodevice",
      tag: "SPECIAL · 2{台|だい}モード 👨‍👩‍👧",
      title: ageMode === "elementary" ? "{親|おや}が{犯罪者|はんざいしゃ}{役|やく}になる{体験|たいけん}" : "親が犯罪者役になる体験",
      icon: "📲",
      desc: ageMode === "elementary" ? "{親|おや}が「{闇|やみ}バイト{勧誘者|かんゆうしゃ}」{役|やく}でボタンをおす→こどもにDMが{届|とど}く。1{台|だい}で{体験|たいけん}できる{親子|おやこ}きょうどうロールプレイ。{体験|たいけん}{後|ご}の{対話|たいわ}が{最大|さいだい}の{教育|きょういく}になる。" : "親が「闇バイト勧誘者」役でボタンを押す→子どもにDMが届く。1台で体験できる親子共同ロールプレイ。体験後の対話が最大の教育になる。",
      duration: ageMode === "elementary" ? "{約|やく}10{分|ふん}" : "約10分",
      audience: ageMode === "elementary" ? "{親子|おやこ}で{必須|ひっす}" : "親子で必須",
      accent: "#f59e0b", bg1: "#1a1200", bg2: "#0f0a00", done: progress.twodevice },
    { id: "attacker", tag: t("modes.attacker.tag"), title: t("modes.attacker.title"), icon: "🎭", desc: t("modes.attacker.desc"), duration: t("modes.attacker.duration"), audience: t("modes.attacker.audience"), accent: "#ff4343", bg1: "#1a0505", bg2: "#0f0303", done: progress.attacker },
  ];
  const soon = [
    { icon: "🤖", title: ageMode === "elementary" ? "{生成|せいせい}AI{詐欺|さぎ}・ディープフェイク" : "生成AI詐欺・ディープフェイク", tag: "EPISODE 08" },
    { icon: "🎮", title: "オンラインゲームトラブル", tag: "EPISODE 09" },
    { icon: "🌐", title: ageMode === "elementary" ? "Firebase{連携|れんけい}リアル2{台|だい}モード" : "Firebase連携リアル2台モード", tag: "COMING SOON" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0d1a2e,#0a0f1a)", fontFamily: "'Zen Maru Gothic',sans-serif" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* 隠しコマンド オーバーレイ */}
      {secret1 && <FishingTrap onClose={() => setSecret1(false)} />}
      {secret2 && <MatrixHack onClose={() => setSecret2(false)} />}
      {secret3 && <DarkWebMission onClose={() => setSecret3(false)} />}
      {secret4 && <ParentSecretDashboard onClose={() => setSecret4(false)} />}

      {/* ── トップタブ ── */}
      {activeTab === "top" && (
        <div style={{ padding: "24px 20px 80px", maxWidth: 440, margin: "0 auto" }}>
          {/* ヘッダー */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div
              onMouseDown={() => { const t = setTimeout(() => { setSecret2(true); setLogoHoldTimer(null); try { localStorage.setItem("mamoru_secret2_found", "1"); } catch {} }, 3000); setLogoHoldTimer(t); }}
              onMouseUp={() => { if (logoHoldTimer) { clearTimeout(logoHoldTimer); setLogoHoldTimer(null); } }}
              onTouchStart={() => { const t = setTimeout(() => { setSecret2(true); setLogoHoldTimer(null); try { localStorage.setItem("mamoru_secret2_found", "1"); } catch {} }, 3000); setLogoHoldTimer(t); }}
              onTouchEnd={() => { if (logoHoldTimer) { clearTimeout(logoHoldTimer); setLogoHoldTimer(null); } }}
              style={{ fontSize: 20, fontWeight: 900, color: "#fff", cursor: "default", userSelect: "none" }}>
              {t("home.appName")}
            </div>
            <LanguageSwitcher compact />
          </div>

          {/* モリィ＋セリフ */}
          <div style={{ marginBottom: 20 }}>
            <div key={mollyMsgIdx} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 16, padding: "12px 16px", marginBottom: 12, animation: "slideUp .3s ease" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.75 }}>
                <RubyText text={ageMode === "elementary" ? mollyMessagesEl[mollyMsgIdx] : mollyMessages[mollyMsgIdx]} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 6, textAlign: "right" }}>
                {ageMode === "elementary" ? "タップでセリフがかわるよ" : "タップでセリフが変わるよ"}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                onClick={handleMollyTap}
                onMouseDown={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                onTouchStart={e => e.currentTarget.style.transform = "scale(1.05)"}
                onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
                style={{ cursor: "pointer", display: "inline-block", position: "relative", transition: "transform .15s" }}>
                <OwlMolly size={88} mood={owlTapCount >= 5 ? "excited" : "happy"} />
                {secretMsg && (
                  <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", background: "#ffa940", color: "#fff", borderRadius: 99, padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", animation: "popIn .2s ease" }}>
                    {secretMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 取得済み実績 */}
          {(() => {
            const rec = (() => { try { const r = localStorage.getItem("mamoru_progress_v1"); return r ? JSON.parse(r) : {}; } catch { return {}; } })();
            const mt = getMasterTitle(rec);
            const earned = getBadges(rec);
            if (earned.length === 0) return null;
            return (
              <div ref={tutorialRefs.badges} style={{ marginBottom: 14, animation: "slideUp .6s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>🏆 取得済み実績</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#ffa940", background: "rgba(255,169,64,.12)", border: "1px solid rgba(255,169,64,.25)", borderRadius: 99, padding: "3px 12px" }}>
                    {earned.length} / {BADGES.length}
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${mt.color}15`, border: `1px solid ${mt.color}33`, borderRadius: 99, padding: "4px 12px", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: mt.color }}><RubyText text={ageMode === "elementary" ? mt.elTitle : mt.title} /></span>
                </div>
                <BadgeStrip record={rec} />
              </div>
            );
          })()}

          {/* 年齢モード切り替え */}
          <div ref={tutorialRefs.modeSwitch} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>
                {ageMode === "elementary" ? "🏫 小学生モード" : "🏫 中学生以上モード"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>
                {ageMode === "elementary" ? "すべての漢字にルビを振っています" : "漢字にルビを振っていません"}
              </div>
            </div>
            <button
              onClick={() => { feedback("tap"); const next = ageMode === "elementary" ? "middle" : "elementary"; localStorage.setItem(AGE_MODE_KEY, next); window.location.reload(); }}
              style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 99, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
              {ageMode === "elementary" ? "中学生モードに切り替え" : "小学生モードに切り替え"}
            </button>
          </div>

          {/* はじめての方へ */}
          <button onClick={() => { feedback("tap"); onNavigate("opening"); }}
            style={{ width: "100%", marginBottom: 10, padding: "16px", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.2)", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👨‍👩‍👧</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>
                <RubyText text={ageMode === "elementary" ? "はじめての{方|かた}へ（{保護者|ほごしゃ}{向|む}け）" : "はじめての方へ（保護者向け）"} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 2 }}>
                <RubyText text={ageMode === "elementary" ? "このアプリの{使|つか}い{方|かた}・{目的|もくてき}・{統計|とうけい}を{確認|かくにん}する" : "このアプリの使い方・目的・統計を確認する"} />
              </div>
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,.4)" }}>→</div>
          </button>

          {/* キーワードノート */}
          <button onClick={() => onNavigate("keywordnote")}
            style={{ width: "100%", marginBottom: 14, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 24 }}>📖</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>キーワードノート</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>学んだ言葉を確認する</div>
            </div>
            <div style={{ color: "rgba(255,255,255,.3)" }}>→</div>
          </button>

          {/* プライバシーポリシー */}
          <div style={{ textAlign: "center" }}>
            <button onClick={() => onNavigate("info")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: "rgba(255,255,255,.25)" }}>
              <RubyText text={ageMode === "elementary" ? "プライバシーポリシー · {運営者|うんえいしゃ}{情報|じょうほう} · {利用|りよう}{規約|きやく}" : "プライバシーポリシー · 運営者情報 · 利用規約"} />
            </button>
          </div>
        </div>
      )}

      {/* ── 学ぶタブ ── */}
      {activeTab === "learn" && (
        <div style={{ padding: "24px 20px 80px", maxWidth: 440, margin: "0 auto" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: ".1em", marginBottom: 10 }}>{t("home.sectionPlay")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {modes.filter(m => m.id !== "twodevice" && m.id !== "attacker").map((m, i) => (
              <button key={m.id} onClick={() => {
                if (m.id === "ep12") { if (!progress.ep1) { alert("EP1をクリアするとアンロックされます！"); return; } onNavigate("ep12"); return; }
                onNavigate(m.id);
              }}
                style={{ width: "100%", background: `linear-gradient(135deg,${m.bg1},${m.bg2})`, border: `1.5px solid ${m.accent}35`, borderRadius: 22, padding: "20px 18px", cursor: "pointer", textAlign: "left", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden", boxShadow: `0 6px 20px rgba(0,0,0,.3)`, animation: `slideUp .5s ${i * .12}s both ease` }}>
                <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", background: m.accent, opacity: .06, right: -35, top: -35, filter: "blur(30px)", pointerEvents: "none" }} />
                {m.locked
                  ? <div style={{ position: "absolute", top: 12, right: 12, background: "#78350f", color: "#fcd34d", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>🔒 EP1クリアで解放</div>
                  : m.done
                    ? <div style={{ position: "absolute", top: 12, right: 12, background: "#22c55e", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>{t("home.clearedBadge")}</div>
                    : <div style={{ position: "absolute", top: 12, right: 12, background: m.accent, color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em", animation: "newBadge 2s ease-in-out infinite" }}>{t("home.newBadge")}</div>
                }
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${m.accent}18`, border: `1.5px solid ${m.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontSize: 9, fontFamily: "'DotGothic16',monospace", color: m.accent, letterSpacing: ".15em", marginBottom: 4 }}><RubyText text={m.tag} /></div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}><RubyText text={m.title} /></div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75, margin: "0 0 14px" }}><RubyText text={m.desc} /></p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>⏱ <RubyText text={m.duration} /></span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>👤 <RubyText text={m.audience} /></span>
                  </div>
                  <div style={{ background: m.accent, borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>
                    {m.locked ? "🔐" : "→"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 11, color: "rgba(255,255,255,.4)", letterSpacing: ".1em", margin: "16px 0 8px" }}>{t("home.sectionSoon")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[modes.find(x => x.id === "twodevice"), modes.find(x => x.id === "attacker")].map((m, i) => (
              <button key={m.id} onClick={() => {
                if (m.id === "twodevice") { alert("🚧 2台モードは近日公開予定です！\n\nFirebase連携によるリアル2台モードを準備中です。お楽しみに。"); return; }
                if (m.id === "attacker" && !CLAUDE_API_ENABLED) { alert("🚧 攻撃者体験は近日公開予定です！\n\nAIリアルタイム生成が必要な機能のため、準備中です。お楽しみに。"); return; }
                onNavigate(m.id);
              }}
                style={{ width: "100%", background: m.id === "attacker" && !CLAUDE_API_ENABLED ? "linear-gradient(135deg,#1a1a1a,#111)" : `linear-gradient(135deg,${m.bg1},${m.bg2})`, border: `1.5px solid ${m.accent}35`, borderRadius: 22, padding: "20px 18px", cursor: "pointer", textAlign: "left", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden", boxShadow: `0 6px 20px rgba(0,0,0,.3)`, opacity: 0.6, animation: `slideUp .5s ${i * .12}s both ease` }}>
                <div style={{ position: "absolute", top: 12, right: 12, background: "#475569", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>🚧 近日公開</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${m.accent}18`, border: `1.5px solid ${m.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontSize: 9, fontFamily: "'DotGothic16',monospace", color: m.accent, letterSpacing: ".15em", marginBottom: 4 }}><RubyText text={m.tag} /></div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}><RubyText text={m.title} /></div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75, margin: "0 0 14px" }}><RubyText text={m.desc} /></p>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>⏱ <RubyText text={m.duration} /></span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>👤 <RubyText text={m.audience} /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* チュートリアルオーバーレイ */}
      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={nextTutorialStep}
          onSkip={finishTutorial}
          refs={tutorialRefs}
        />
      )}

      {/* ── タブバー ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#b35a00", borderTop: "1px solid rgba(255,255,255,.15)", display: "flex", height: 60, paddingBottom: "env(safe-area-inset-bottom)" }}>
        {tabs.map(tab => (
          <button key={tab.id}
            ref={tab.id === "learn" ? tutorialRefs.tabLearn : tab.id === "challenge" ? tutorialRefs.tabChallenge : tab.id === "parent" ? tutorialRefs.tabParent : undefined}
            onClick={() => {
              if (tab.id === "challenge") { feedback("tap"); onNavigate("weekly"); return; }
              if (tab.id === "parent") { feedback("tap"); onNavigate("report"); return; }
              feedback("tap"); setActiveTab(tab.id);
            }}
            onMouseDown={tab.id === "parent" ? () => { const t = setTimeout(() => { setSecret4(true); setReportHoldTimer(null); try { localStorage.setItem("mamoru_secret4_found", "1"); } catch {} }, 5000); setReportHoldTimer(t); } : undefined}
            onMouseUp={tab.id === "parent" ? () => { if (reportHoldTimer) { clearTimeout(reportHoldTimer); setReportHoldTimer(null); } } : undefined}
            onTouchStart={tab.id === "parent" ? () => { const t = setTimeout(() => { setSecret4(true); setReportHoldTimer(null); try { localStorage.setItem("mamoru_secret4_found", "1"); } catch {} }, 5000); setReportHoldTimer(t); } : undefined}
            onTouchEnd={tab.id === "parent" ? () => { if (reportHoldTimer) { clearTimeout(reportHoldTimer); setReportHoldTimer(null); } } : undefined}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "6px 4px 8px", border: "none", cursor: "pointer", fontFamily: "inherit", background: activeTab === tab.id ? "rgba(0,0,0,.2)" : "transparent" }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,.55)", fontWeight: activeTab === tab.id ? 700 : 400 }}>
              {ageMode === "elementary" ? tab.labelEl : tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────
function Episode1({ onComplete, onExit }) {
  const t = useT();
  const tArr = useTArr();
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  const [step, setStep] = useState(0);
  const [postIdx, setPostIdx] = useState(0);
  const [found, setFound] = useState({});
  const [detail, setDetail] = useState(null);
  const [horrorStage, setHorrorStage] = useState(0);
  const [horrorMsgIdx, setHorrorMsgIdx] = useState(0);
  const [animStars, setAnimStars] = useState(false);
  const [timedHuntResult, setTimedHuntResult] = useState(null);
  const [useTimedMode, setUseTimedMode] = useState(true);
  const [worstCaseShown, setWorstCaseShown] = useState(false);
  const [postImages, setPostImages] = useState(() => {
    // ローカル固定画像を直接セット（API不要）
    const imgs = {};
    POSTS.forEach(p => {
      if (p.localImage) imgs[p.id] = { url: p.localImage, author: null };
    });
    return imgs;
  });

  // Unsplash取得は不要になったためuseEffectは削除

  const playTypingSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [300, 280, 310, 290];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.07);
        o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.07);
      });
    } catch {}
  };

  useEffect(() => {
    if (phase !== "horror") return;
    let timer;
    if (horrorStage === -1 && horrorMsgIdx === 0) {
      timer = setTimeout(() => setHorrorMsgIdx(1), 1500);
    } else if (horrorStage === -1 && horrorMsgIdx === 1) {
      timer = setTimeout(() => { setHorrorStage(0); setHorrorMsgIdx(0); }, 1500);
    } else if (horrorStage === 0 && horrorMsgIdx < 3) {
      timer = setTimeout(() => { playTypingSound(); setHorrorMsgIdx(i => i + 1); }, 800);
    } else if (horrorStage === 1 && horrorMsgIdx < 6) {
      const next = horrorMsgIdx + 1;
      timer = setTimeout(() => {
        if (next === 1 || next === 3 || next === 5) playTypingSound();
        setHorrorMsgIdx(next);
      }, 900);
    } else if (horrorStage === 2 && horrorMsgIdx === 0) {
      playTypingSound();
      timer = setTimeout(() => setHorrorMsgIdx(i => i + 1), 2000);
    }
    return () => clearTimeout(timer);
  }, [phase, horrorStage, horrorMsgIdx]);

  // Translation helpers for posts
  const getPostText = (p) => t(`ep1Posts.${p.textKey}`);
  const getElLabel = (el) => t(`ep1Posts.${el.labelKey}`);
  const getElInfo = (el) => t(`ep1Posts.${el.infoKey}`);

  const post = POSTS[postIdx];
  const dangerN = post?.elements.filter(e => e.danger).length ?? 0;
  const foundN = (found[post?.id] || []).length;
  const allFoundHere = foundN >= dangerN;

  const nextPost = () => {
    setDetail(null);
    if (postIdx < POSTS.length - 1) setPostIdx(postIdx + 1);
    else { setPhase("explain"); }
  };

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep1" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#2a1810,#0f0a08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, background: "#fff", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * .7 + .2, animation: `blink ${Math.random() * 3 + 2}s infinite` }} />)}
      <OwlMolly size={120} />
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".4em", margin: "16px 0 8px" }}>{t("ep1.chapter")}</div>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center" }}><RubyText text={t("ep1.title")} /></h1>
      <p style={{ color: "#ffd28a", fontSize: 12, margin: "0 0 28px", opacity: .8 }}>{t("ep1.subtitle")}</p>
      <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,169,64,.2)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#f4e4c0", fontSize: 13, lineHeight: 1.9, marginBottom: 28 }}>
        <FormattedText text={t("ep1.introDesc")} style={{ color: "inherit" }} />
      </div>
      <button onClick={() => { feedback("tap"); setPhase("mina_intro"); }} style={{ background: "linear-gradient(135deg,#ffa940,#ff7e20)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,169,64,.4)" }}>{t("ep1.introStart")}</button>
    </div>
    </EpisodeShell>
  );

  // ── Mina Intro（ミナ自己紹介） ──
  if (phase === "mina_intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 340, width: "100%", animation: "slideUp .5s ease" }}>
        {/* ミナのアイコン */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", display: "inline-block", border: "3px solid #ffa940", boxShadow: "0 8px 24px rgba(255,169,64,.3)" }}>
            <img src="/images/ep1/mina_icon.png" alt="ミナ"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = "<div style='width:100%;height:100%;background:#ffd6e0;display:flex;align-items:center;justify-content:center;font-size:48px'>👧</div>"; }} />
          </div>
        </div>
        {/* ミナの吹き出し */}
        <div style={{ background: "#fff", borderRadius: 20, borderTopLeftRadius: 4, padding: "18px 20px", border: "2px solid #ffa94044", boxShadow: "0 6px 20px rgba(255,169,64,.15)", marginBottom: 20, position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ffa940", marginBottom: 8, letterSpacing: ".05em" }}>
            {t("ep1.characterName")} <span style={{ color: "#ccc", fontWeight: 400 }}>{t("ep1.characterHandle")}</span>
          </div>
          <p style={{ fontSize: 15, color: "#3d2817", lineHeight: 1.9, margin: 0 }}>
            <RubyText text={ageMode === "elementary"
              ? "はじめまして！わたしはミナ。{中学|ちゅうがく}1{年生|ねんせい}。SNSが{大好|だいす}きなんだ。いつもこんな{投稿|とうこう}してるよ！"
              : "はじめまして！わたしはミナ。中学1年生。SNSが大好きなんだ。いつもこんな投稿してるよ！"
            } />
          </p>
        </div>
        <OwlSay mood="worried" e="ミナちゃんの{投稿|とうこう}をよ〜くみてみよう🦉">
          ミナちゃんの投稿をよ〜く見てみよう🦉
        </OwlSay>
        <button onClick={() => { feedback("tap"); setPhase("normal"); }}
          style={{ width: "100%", marginTop: 14, padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(255,169,64,.35)" }}>
          <RubyText text={ageMode === "elementary" ? "{投稿|とうこう}を{見|み}てみる →" : "投稿を見てみる →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Normal（Twitter風タイムライン） ──
  if (phase === "normal") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "#f7f9fa", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Twitter風ヘッダー */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e1e8ed", padding: "12px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 20 }}>🐦</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#14171a" }}>タイムライン</div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 20px" }}>
        <div style={{ background: "#fff8f0", borderRadius: 14, margin: "12px 16px", padding: "12px 14px", border: "1px solid #ffa94033" }}>
          <OwlSay mood="worried" e="まずは、ミナちゃんのいつものSNSをみてみよう🦉">{t("ep1.normalOwl")}</OwlSay>
        </div>

        {/* プロフィールヘッダー */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e1e8ed", borderTop: "1px solid #e1e8ed", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          {/* ミナのアイコン */}
          <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #ffa940" }}>
            <img src="/images/ep1/mina_icon.png" alt="ミナ"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = "👧"; }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#14171a" }}>{t("ep1.characterName")} <span style={{ fontSize: 12, color: "#657786", fontWeight: 400 }}>{t("ep1.characterHandle")}</span></div>
            <div style={{ fontSize: 12, color: "#657786" }}><RubyText text={t("ep1.characterAge")} /></div>
          </div>
          <div style={{ background: "#e8f5ff", color: "#1da1f2", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>フォロワー 248</div>
        </div>

        {/* 投稿リスト */}
        {POSTS.slice(0, step + 1).map((p, idx) => (
          <div key={p.id} style={{ background: "#fff", borderBottom: "1px solid #e1e8ed", animation: "slideUp .4s ease" }}>
            <div style={{ padding: "12px 16px 0" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {/* ミナのアイコン（小） */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1.5px solid #ffa94055" }}>
                  <img src="/images/ep1/mina_icon.png" alt="ミナ"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = "👧"; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#14171a" }}>{t("ep1.characterName")}</span>
                    <span style={{ fontSize: 12, color: "#657786" }}>{t("ep1.characterHandle")}</span>
                    <span style={{ fontSize: 12, color: "#657786", marginLeft: "auto" }}>{p.day}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#14171a", lineHeight: 1.65, margin: "0 0 10px" }}><RubyText text={getPostText(p)} /></p>
                </div>
              </div>

              {/* 画像（全体表示・アスペクト比を保持） */}
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 10, marginLeft: 50, border: "1px solid #e1e8ed" }}>
                {postImages[p.id] ? (
                  <img src={postImages[p.id].url} alt=""
                    style={{ width: "100%", display: "block", objectFit: "contain", background: p.photoBg }} />
                ) : (
                  <div style={{ background: p.photoBg, height: 160, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{p.photoIcon}</div>
                )}
              </div>
            </div>

            {/* いいね・コメント */}
            <div style={{ padding: "6px 16px 12px 66px", display: "flex", gap: 20, fontSize: 13, color: "#657786" }}>
              <span>❤️ {[42, 38, 51, 29][idx]}</span>
              <span>💬 {[8, 5, 12, 4][idx]}</span>
              <span>🔁 {[12, 7, 23, 3][idx]}</span>
            </div>
          </div>
        ))}

        {/* ナビゲーションボタン */}
        <div style={{ padding: "14px 16px" }}>
          {step < POSTS.length - 1
            ? <button onClick={() => setStep(step + 1)}
                style={{ width: "100%", padding: 14, background: "#1da1f2", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                <RubyText text={t("ep1.nextPost")} />
              </button>
            : <button onClick={() => { feedback("tap"); setHorrorStage(-1); setHorrorMsgIdx(0); setPhase("horror"); }}
                style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                <RubyText text={t("ep1.looksHappy")} />
              </button>
          }
        </div>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Horror ──
  if (phase === "horror") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: horrorStage === -1 ? "#000" : horrorStage === 3 ? "#0d1a2e" : "#1a0000", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", padding: "20px 16px", position: "relative", overflow: "hidden", animation: horrorStage === 2 ? "redPulse 1s ease-in-out infinite" : "none" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>

        {/* ── 導入：ある日… ── */}
        {horrorStage === -1 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,.6)", textAlign: "center", animation: "fadeIn 1s ease" }}>ある日…</div>
            {horrorMsgIdx >= 1 && (
              <div style={{ fontSize: 18, color: "rgba(255,255,255,.4)", textAlign: "center", marginTop: 16, animation: "fadeIn .8s ease" }}>DMが届きました</div>
            )}
          </div>
        )}

        {/* ── STAGE 1 ── */}
        {horrorStage === 0 && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#888" }}>👤</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 900, color: "#fff" }}>不明なアカウント</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>既読</div>
          </div>
          {horrorMsgIdx >= 1 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}><RubyText text={ageMode === "elementary" ? "{桜花中学校|おうかちゅうがっこう}の{制服|せいふく}、かわいいね" : "桜花中学校の制服、かわいいね"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/8 18:23</div>
            </div>
          )}
          {horrorMsgIdx >= 2 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}>今日もカフェ ルブランに行ったの？</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/15 16:45</div>
            </div>
          )}
          {horrorMsgIdx >= 3 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}>トイプードル、毎日散歩してるんだね</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/19 08:12</div>
            </div>
          )}
          {horrorMsgIdx >= 3 && (
            <div style={{ marginTop: 20, animation: "slideUp .4s ease" }}>
              <button onClick={() => { feedback("tap"); setHorrorStage(1); setHorrorMsgIdx(0); }}
                style={{ width: "100%", padding: 14, background: "rgba(255,67,67,.2)", border: "1px solid rgba(255,67,67,.4)", borderRadius: 14, color: "#ff8a8a", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
              </button>
            </div>
          )}
        </>)}

        {/* ── STAGE 2 ── */}
        {horrorStage === 1 && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#888" }}>👤</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 900, color: "#fff" }}>不明なアカウント</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>既読</div>
          </div>
          {horrorMsgIdx >= 1 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}><RubyText text={ageMode === "elementary" ? "{雨宮|あめみや}さんっていうんだね" : "雨宮さんっていうんだね"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/20 21:34</div>
            </div>
          )}
          {horrorMsgIdx >= 2 && (
            <div style={{ fontSize: 11, color: "#ff4343", fontWeight: 700, padding: "4px 10px", background: "rgba(255,67,67,.1)", borderRadius: 8, marginBottom: 10, animation: "slideUp .3s ease" }}>
              ⚠️ <RubyText text={ageMode === "elementary" ? "{苗字|みょうじ}が{知|し}られている" : "苗字が知られている"} />
            </div>
          )}
          {horrorMsgIdx >= 3 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}><RubyText text={ageMode === "elementary" ? "{桜花中学校|おうかちゅうがっこう}って〇〇{駅|えき}の{近|ちか}くだよね" : "桜花中学校って〇〇駅の近くだよね"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/21 17:05</div>
            </div>
          )}
          {horrorMsgIdx >= 4 && (
            <div style={{ fontSize: 11, color: "#ff4343", fontWeight: 700, padding: "4px 10px", background: "rgba(255,67,67,.1)", borderRadius: 8, marginBottom: 10, animation: "slideUp .3s ease" }}>
              ⚠️ <RubyText text={ageMode === "elementary" ? "{通学|つうがく}ルートが{読|よ}まれている" : "通学ルートが読まれている"} />
            </div>
          )}
          {horrorMsgIdx >= 5 && (
            <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "0px 14px 14px 14px", padding: "10px 14px", marginBottom: 8, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.65 }}><RubyText text={ageMode === "elementary" ? "いつも4{時半|じはん}ごろ{帰|かえ}るんだね" : "いつも4時半ごろ帰るんだね"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/22 16:33</div>
            </div>
          )}
          {horrorMsgIdx >= 6 && (
            <div style={{ fontSize: 11, color: "#ff4343", fontWeight: 700, padding: "4px 10px", background: "rgba(255,67,67,.1)", borderRadius: 8, marginBottom: 10, animation: "slideUp .3s ease" }}>
              ⚠️ <RubyText text={ageMode === "elementary" ? "{帰宅|きたく}{時間|じかん}まで{分|わ}かっている" : "帰宅時間まで分かっている"} />
            </div>
          )}
          {horrorMsgIdx >= 6 && (
            <div style={{ marginTop: 20, animation: "slideUp .4s ease" }}>
              <button onClick={() => { feedback("tap"); setHorrorStage(2); setHorrorMsgIdx(0); }}
                style={{ width: "100%", padding: 14, background: "rgba(255,67,67,.2)", border: "1px solid rgba(255,67,67,.4)", borderRadius: 14, color: "#ff8a8a", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
              </button>
            </div>
          )}
        </>)}

        {/* ── STAGE 3 ── */}
        {horrorStage === 2 && (<>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "10px 14px", marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#888" }}>👤</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 900, color: "#fff" }}>不明なアカウント</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>既読</div>
          </div>
          <div style={{ background: "rgba(255,67,67,.15)", border: "1px solid rgba(255,67,67,.4)", borderRadius: "0px 14px 14px 14px", padding: "14px 16px", marginBottom: 16, animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#ff4343", lineHeight: 1.65 }}>今、あなたの家の近くにいるよ</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textAlign: "right" }}>4/22 18:55</div>
          </div>
          {horrorMsgIdx >= 1 && (
            <div style={{ textAlign: "center", fontSize: 56, animation: "shake .4s ease", marginBottom: 20 }}>😨</div>
          )}
          {horrorMsgIdx >= 1 && (
            <div style={{ animation: "slideUp .4s ease" }}>
              <button onClick={() => { feedback("tap"); setHorrorStage(3); setHorrorMsgIdx(0); }}
                style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#ff4343,#cc0000)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,67,67,.4)" }}>
                <RubyText text={ageMode === "elementary" ? "{何|なに}が{起|お}きていたの？→" : "何が起きていたの？→"} />
              </button>
            </div>
          )}
        </>)}

        {/* ── STAGE 4 ── */}
        {horrorStage === 3 && (<>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <OwlMolly size={80} mood="worried" />
          </div>
          <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 16, padding: "14px 16px", marginBottom: 12, animation: "slideUp .5s ease" }}>
            <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary"
                ? "この{人|ひと}はミナちゃんの{投稿|とうこう}をずっと{見|み}ていたんだ。{投稿|とうこう}の{写真|しゃしん}から、たくさんのことを{知|し}ってしまった…"
                : "この人はミナちゃんの投稿をずっと見ていたんだ。投稿の写真から、たくさんのことを知ってしまった…"
              } />
            </div>
          </div>
          <div style={{ background: "rgba(255,169,64,.1)", border: "1px solid rgba(255,169,64,.25)", borderRadius: 16, padding: "14px 16px", marginBottom: 24, animation: "slideUp .5s .2s both ease" }}>
            <div style={{ fontSize: 13, color: "#ffd28a", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary"
                ? "{次|つぎ}のページで、なにが{手|て}がかりになったか{自分|じぶん}で{探|さが}してみよう！{全部|ぜんぶ}{見|み}つけられるかな？🔍"
                : "次のページで、何が手がかりになったか自分で探してみよう！全部見つけられるかな？🔍"
              } />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPostIdx(0); setFound({}); setPhase("investigate"); }}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,169,64,.3)", animation: "popIn .4s ease" }}>
            <RubyText text={ageMode === "elementary" ? "{探|さが}してみる →" : "さがしてみる →"} />
          </button>
        </>)}

      </div>
    </div>
    </EpisodeShell>
  );

  // ── Investigate（タイムアタック廃止・全投稿統一） ──
  if (phase === "investigate") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0f0a,#0a0a0f)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ background: "rgba(255,169,64,.1)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(255,169,64,.2)", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#ffa940", letterSpacing: ".1em" }}>{t("ep1.evidenceScan")}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#ffd28a" }}>{postIdx + 1}/{POSTS.length}</span>
        </div>

        <OwlSay mood="worried" e={`{投稿|とうこう}の{中|なか}から「{危険|きけん}なポイント」をタップして{見|み}つけよう。${dangerN}{個|こ}あるよ。`}>
          <FormattedText text={t("ep1.investigateOwl", { n: dangerN })} style={{ color: "inherit" }} />
        </OwlSay>

        {/* 投稿カード（Twitter風） */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, boxShadow: "0 12px 40px rgba(0,0,0,.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid #fef0d9", marginBottom: 12 }}>
            {/* ミナアイコン */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #ffa94055" }}>
              <img src="/images/ep1/mina_icon.png" alt="ミナ"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = "👧"; }} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 13, color: "#14171a" }}>{t("ep1.characterName")}</div>
              <div style={{ fontSize: 10, color: "#657786" }}>{post.day}</div>
            </div>
          </div>

          {/* 画像（全体表示・paddingTop廃止） */}
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
            {postImages[post.id] ? (
              <>
                <img src={postImages[post.id].url} alt=""
                  style={{ width: "100%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.2))" }} />
              </>
            ) : (
              <div style={{ background: post.photoBg, height: 180, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>{post.photoIcon}</div>
            )}

            {/* 危険箇所マーカー */}
            {post.elements.map((el, i) => {
              const elLabel = getElLabel(el);
              const isFound = (found[post.id] || []).includes(elLabel);
              return (
                <button key={i} onClick={() => {
                  setDetail({ ...el, label: elLabel, info: getElInfo(el) });
                  if (el.danger && !isFound) {
                    feedback("found");
                    setFound({ ...found, [post.id]: [...(found[post.id] || []), elLabel] });
                  } else {
                    feedback("tap");
                  }
                }} style={{
                  position: "absolute", left: `${el.x}%`, top: `${el.y}%`,
                  transform: "translate(-50%,-50%)",
                  width: 44, height: 44, borderRadius: "50%",
                  border: isFound ? "2.5px solid #ff4343" : "2.5px dashed rgba(255,255,255,.9)",
                  background: isFound ? "rgba(255,67,67,.92)" : "rgba(255,255,255,.25)",
                  backdropFilter: "blur(6px)",
                  boxShadow: isFound ? "0 0 16px rgba(255,67,67,.7)" : "0 0 14px rgba(0,0,0,.5)",
                  fontSize: 20, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  animation: isFound ? "none" : "pulse 2s infinite",
                  color: "#fff", fontWeight: 900, transition: "all .2s",
                }}>
                  {isFound ? "✓" : "?"}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: 13, color: "#3d2817", margin: 0, lineHeight: 1.65 }}><RubyText text={getPostText(post)} /></p>
        </div>

        {/* 発見カウンター */}
        <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: "#ffd28a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span><RubyText text={t("ep1.foundCount")} />: <strong style={{ color: "#ff8a8a" }}>{foundN}/{dangerN}</strong></span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}><RubyText text={ageMode === "elementary" ? "{危険|きけん}{箇所|かしょ}を{全部|ぜんぶ}タップしよう" : "危険箇所を全部タップしよう"} /></span>
        </div>

        {/* 詳細モーダル */}
        {detail && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100, animation: "slideUp .3s ease" }}
            onClick={() => setDetail(null)}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `3px solid ${detail.danger ? "#ff4343" : "#4caf50"}` }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 38, textAlign: "center", marginBottom: 8, animation: detail.danger ? "shake .5s ease" : "none" }}>{detail.emoji}</div>
              <div style={{ background: detail.danger ? "#ff4343" : "#4caf50", color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 12px", borderRadius: 99, display: "block", width: "fit-content", margin: "0 auto 10px", letterSpacing: ".1em" }}>
                {detail.danger ? t("ep1.danger") : t("ep1.safe")}
              </div>
              <h3 style={{ color: "#3d2817", fontSize: 17, fontWeight: 900, textAlign: "center", margin: "8px 0 12px" }}><RubyText text={detail.label} /></h3>
              <p style={{ color: "#5d4017", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}><RubyText text={detail.info} /></p>
              <button onClick={() => setDetail(null)}
                style={{ width: "100%", padding: 12, background: "#ffa940", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                {t("ep1.gotIt")}
              </button>
            </div>
          </div>
        )}

        {/* ボタン：「次の投稿を調べる」のみ（重複なし） */}
        {allFoundHere && (
          <button onClick={nextPost}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
            {postIdx < POSTS.length - 1 ? <RubyText text={t("ep1.nextInvestigate")} /> : <RubyText text={t("ep1.toExplanation")} />}
          </button>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Explain ──
  if (phase === "explain") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}><OwlMolly size={96} /></div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", border: "2px solid #ffa940", marginBottom: 14, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, color: "#3d2817", margin: "0 0 10px", fontWeight: 900 }}><RubyText text={t("ep1.problemTitle")} /></h2>
          <div style={{ fontSize: 34, color: "#ff4343", fontWeight: 900, fontFamily: "'DotGothic16',monospace" }}>{Object.values(found).reduce((a, b) => a + b.length, 0)}<span style={{ fontSize: 14, color: "#a08060" }}><RubyText text={t("ep1.dangersFound")} /></span></div>
        </div>
        <OwlSay e="これだけの{情報|じょうほう}があれば、{悪|わる}い{人|ひと}は{家|いえ}まで{場所|ばしょ}をつきとめられるんだよ…">
          <FormattedText text={t("ep1.explanationOwl")} style={{ color: "inherit" }} />
        </OwlSay>
        <div style={{ background: "rgba(255,67,67,.08)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ display: "inline-block", background: "#ff4343", color: "#fff", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 99, marginBottom: 10, letterSpacing: ".1em" }}><RubyText text={t("ep1.realCaseLabel")} /></div>
          <p style={{ color: "#3d2817", fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            <FormattedText text={t("ep1.realCase")} style={{ color: "inherit" }} />
          </p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "2px solid #f4d4a8" }}>
          {[["📍", t("ep1.tip1Title"), t("ep1.tip1Desc")],
            ["🔒", t("ep1.tip3Title"), t("ep1.tip3Desc")]].map(([ic, tt, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#ffa940,#ff8c1a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#3d2817" }}><RubyText text={tt} /></div><div style={{ fontSize: 11, color: "#a08060", marginTop: 2 }}><RubyText text={d} /></div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("pre_dialogue")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={t("ep1.talkToFamily")} /></button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Quiz (EP1) ──
  // ── Comparison (EP1) ──
  if (phase === "comparison") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["comparison","dialogue","quiz","mywords"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? "#ffa940" : "rgba(0,0,0,.1)" }} />
          ))}
        </div>
        <OwlSay mood="worried" e="もしいちばん{悪|わる}い{選択|せんたく}をしていたら、{何|なに}が{起|お}きていたかみてみよう🦉">もし最悪の選択をしていたら、何が起きていたか見てみよう🦉</OwlSay>
        <ChoiceComparison
          mode="light"
          myChoice={ageMode === "elementary" ? "{危険|きけん}ポイントを{見|み}つけた" : "危険ポイントを見つけた"}
          myResult={ageMode === "elementary" ? "{気|き}づけた{分|ぶん}、{次回|じかい}から{投稿|とうこう}{前|まえ}に{確認|かくにん}する{習慣|しゅうかん}がつく" : "気づけた分、次回から投稿前に確認する習慣がつく"}
          worstChoice={ageMode === "elementary" ? "{位置情報|いちじょうほう}タグONで{全|ぜん}{投稿|とうこう}した{場合|ばあい}" : "位置情報タグONで全投稿した場合"}
          worstResult={ageMode === "elementary" ? "{行動|こうどう}パターンが{特定|とくてい}され、{自宅|じたく}の{特定|とくてい}・ストーキング{被害|ひがい}に{遭|あ}うリスクが{現実|げんじつ}に" : "行動パターンが特定され、自宅の特定・ストーキング被害に遭うリスクが現実に"}
          accentColor="#ffa940"
          onRevealComplete={() => setWorstCaseShown(true)}
        />
        <button
          onClick={() => { feedback("tap"); setPhase("investigate"); setPostIdx(0); setFound({}); }}
          disabled={!worstCaseShown}
          style={{ width: "100%", marginTop: 14, padding: 15, background: worstCaseShown ? "linear-gradient(135deg,#ffa940,#ff8c1a)" : "rgba(0,0,0,.12)", border: "none", borderRadius: 14, color: worstCaseShown ? "#fff" : "rgba(0,0,0,.3)", fontSize: 15, fontWeight: 900, cursor: worstCaseShown ? "pointer" : "default", fontFamily: "inherit", transition: "all .3s" }}>
          <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Homework (EP1) ──
  if (phase === "homework") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#ffa940" : "rgba(0,0,0,.1)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{最後|さいご}に{今日|きょう}のしゅくだいをかくにんしよう！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">最後に今日の宿題を確認しよう！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          mode="light"
          accentColor="#ffa940"
          onComplete={() => setPhase("pre_dialogue")}
          tasks={ageMode === "elementary" ? [
            { title: "スマホのカメラ{位置情報|いちじょうほう}をオフにする", desc: "{設定|せってい} → プライバシー → {位置情報|いちじょうほう} → カメラ → 「{許可|きょか}しない」に{変更|へんこう}" },
            { title: "{最近|さいきん}の{投稿|とうこう}{写真|しゃしん}を1{枚|まい}チェックする", desc: "{個人情報|こじんじょうほう}（{校章|こうしょう}・{表札|ひょうさつ}・{背景|はいけい}）が{映|うつ}っていないか{確認|かくにん}しよう" },
            { title: "おうちの{人|ひと}に{今日|きょう}{学|まな}んだことを{話|はな}す", desc: "「{位置情報|いちじょうほう}って{危|あぶ}ないんだよ」と{伝|つた}えてみよう" },
          ] : [
            { title: "スマホのカメラ位置情報をオフにする", desc: "設定 → プライバシー → 位置情報 → カメラ → 「許可しない」に変更" },
            { title: "最近の投稿写真を1枚チェックする", desc: "個人情報（校章・表札・背景）が映っていないか確認しよう" },
            { title: "おうちの人に今日学んだことを話す", desc: "「位置情報って危ないんだよ」と伝えてみよう" },
          ]}
        />
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Keywords (EP1) ──
  if (phase === "keywords") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="このおはなしにでてきた{大切|たいせつ}な{言葉|ことば}をおぼえよう！ニュースでも{出|で}てくるよ🦉">このエピソードで出てきた大事なワードを一緒に覚えよう！ニュースでも出てくるよ🦉</OwlSay>
        <KeywordPhase epKey="ep1" accentColor="#ffa940" onComplete={() => setPhase("complete")} />
        <ParentExpertCard epKey="ep1" accentColor="#ffa940" />
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Dialogue (EP1) ──
  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: "2px solid #ffa94044", borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: "0 4px 20px #ffa94018" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={ageMode === "elementary" ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary" ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#ffa940,#ffa940cc)", border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px #ffa94033" }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep1Questions = [
    {
      id: "q1",
      question: "あなたが写真をSNSに投稿する前に、どんなことを確認したらいいかな？",
      questionEl: "{写真|しゃしん}をSNSに{投稿|とうこう}する{前|まえ}に、どんなことを{確認|かくにん}したらいいかな？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "顔や本名が写っていると何が困るか一緒に考えてみよう",
        "背景に何が写っていたら困るかな？（校章・表札・看板など）",
      ],
      hintsEl: [
        "{顔|かお}や{本名|ほんみょう}が{写|うつ}っているとなにが{困|こま}るか{一緒|いっしょ}に{考|かんが}えてみよう",
        "{背景|はいけい}になにが{写|うつ}っていたら{困|こま}るかな？（{校章|こうしょう}・{表札|ひょうさつ}・{看板|かんばん}など）",
      ],
    },
    {
      id: "q2",
      question: "もし知らない人からメッセージが来て『きみのこと知ってるよ』って言われたら、どうする？",
      questionEl: "もし{知|し}らない{人|ひと}からメッセージが{来|き}て「きみのことしってるよ」って{言|い}われたら、どうする？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "返信したら相手はどう思うかな？どんなリスクがあるか考えよう",
        "誰に相談したら良いかな？すぐに話せる大人は誰？",
      ],
      hintsEl: [
        "{返信|へんしん}したら{相手|あいて}はどう{思|おも}うかな？どんなリスクがあるか{考|かんが}えよう",
        "{誰|だれ}に{相談|そうだん}したらいいかな？すぐに{話|はな}せる{大人|おとな}は{誰|だれ}？",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep1Questions}
            epKey="ep1"
            accentColor="#ffa940"
            onComplete={() => setPhase("keywords")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fff4d6,#ffeed6,#ffd28a)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#ff8a8a", "#ffa940", "#ffd28a", "#a8e6cf", "#ffafcc"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fff8f0)", borderRadius: 22, padding: "28px 22px", border: "3px double #ffa940", textAlign: "center", boxShadow: "0 20px 60px rgba(94,64,32,.18)", position: "relative" }}>
          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=><div key={i} style={{position:"absolute",...pos,fontSize:16,color:"#ffa940"}}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a08060", letterSpacing: ".4em", marginBottom: 10 }}>{t("ep1.certLabel")}</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3d2817", fontWeight: 900, margin: "0 0 4px" }}>{t("ep1.certTitle")}</h1>
          <p style={{ fontSize: 12, color: "#5d4017", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <FormattedText text={t("ep1.certBody")} style={{ color: "inherit" }} />
          </p>
          <div style={{ background: "linear-gradient(135deg,#ffe4b5,#ffd28a)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#a05500", marginBottom: 3 }}>{t("ep1.ep1Complete")}</div>
            <div style={{ fontSize: 13, color: "#3d2817", fontWeight: 900 }}><RubyText text={t("ep1.masterTitle")} /></div>
          </div>
          <div style={{ fontSize: 10, color: "#a08060", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: t("ep1.shareTitle"), text: t("ep1.shareText") }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #ffa940", borderRadius: 14, color: "#a05500", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{t("ep1.share")}</button>
          <button onClick={() => onComplete(3)} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{t("ep1.toHome")}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 修了証コンポーネント（EP共通）
// ─────────────────────────────────────────────
function CompleteScreen({ epKey, accentColor = "#ffa940", onComplete }) {
  const t = useT();
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fff4d6,#ffeed6,#ffd28a)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#ff8a8a", "#ffa940", "#ffd28a", "#a8e6cf", "#ffafcc"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fff8f0)", borderRadius: 22, padding: "28px 22px", border: `3px double ${accentColor}`, textAlign: "center", boxShadow: "0 20px 60px rgba(94,64,32,.18)", position: "relative" }}>
          {[{top:12,left:12},{top:12,right:12},{bottom:12,left:12},{bottom:12,right:12}].map((pos,i)=><div key={i} style={{position:"absolute",...pos,fontSize:16,color:accentColor}}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a08060", letterSpacing: ".4em", marginBottom: 10 }}>{t(`${epKey}.certLabel`)}</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3d2817", fontWeight: 900, margin: "0 0 4px" }}>{t(`${epKey}.certTitle`)}</h1>
          <p style={{ fontSize: 12, color: "#5d4017", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <FormattedText text={t(`${epKey}.certBody`)} style={{ color: "inherit" }} />
          </p>
          <div style={{ background: `linear-gradient(135deg,${accentColor}33,${accentColor}22)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#a05500", marginBottom: 3 }}>{t(`${epKey}.epComplete`)}</div>
            <div style={{ fontSize: 13, color: "#3d2817", fontWeight: 900 }}><RubyText text={t(`${epKey}.masterTitle`)} /></div>
          </div>
          <div style={{ fontSize: 10, color: "#a08060", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: t(`${epKey}.shareTitle`), text: t(`${epKey}.shareText`) }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${accentColor}`, borderRadius: 14, color: "#a05500", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{t(`${epKey}.share`)}</button>
          <button onClick={() => onComplete(3)} style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${accentColor},${accentColor}cc)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{t(`${epKey}.toHome`)}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 1-2 — 本当は、位置情報が見えてるよ
// 位置情報サービス・プライバシー体験
// ─────────────────────────────────────────────
function Episode1_2({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [phase, setPhase] = useState("parent_intro");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [locationStep, setLocationStep] = useState(0);
  const [checklistDone, setChecklistDone] = useState([]);
  const [showChecklist, setShowChecklist] = useState(false);

  const orange = "#ffa940";
  const orangeDark = "#d97706";

  const iosSteps = el ? [
    { icon: "⚙️", title: "「{設定|せってい}」アイコンをひらく", desc: "ホーム{画面|がめん}のグレーの{歯車|はぐるま}アイコン" },
    { icon: "🖐️", title: "「プライバシーとセキュリティ」をタップ", desc: "{少|すこ}し{下|した}にスクロールするとある" },
    { icon: "📍", title: "「{位置情報|いちじょうほう}サービス」をタップ", desc: "{一番|いちばん}{上|うえ}のあたりにある" },
    { icon: "⬇️", title: "{一番|いちばん}{下|した}までスクロール→「システムサービス」をタップ", desc: "リストの{一番|いちばん}{下|した}にある" },
    { icon: "🗺️", title: "「よく{利用|りよう}する{場所|ばしょ}」または「{利用|りよう}{頻度|ひんど}の{高|たか}い{場所|ばしょ}と{経路|けいろ}」をタップ", desc: "{機種|きしゅ}・バージョンによって{名前|なまえ}が{異|こと}なる{場合|ばあい}があります" },
    { icon: "🔑", title: "パスコードを{入力|にゅうりょく}する", desc: "おうちの{人|ひと}にやってもらおう", desc2: "{設定|せってい}によってはTouch IDやFace IDが{要求|ようきゅう}される{場合|ばあい}があります" },
  ] : [
    { icon: "⚙️", title: "「設定」アイコンをひらく", desc: "ホーム画面のグレーの歯車アイコン" },
    { icon: "🖐️", title: "「プライバシーとセキュリティ」をタップ", desc: "少し下にスクロールするとある" },
    { icon: "📍", title: "「位置情報サービス」をタップ", desc: "一番上のあたりにある" },
    { icon: "⬇️", title: "一番下までスクロール→「システムサービス」をタップ", desc: "リストの一番下にある" },
    { icon: "🗺️", title: "「よく利用する場所」または「利用頻度の高い場所と経路」をタップ", desc: "機種・バージョンによって名前が異なる場合があります" },
    { icon: "🔑", title: "パスコードを入力する", desc: "おうちの人にやってもらおう", desc2: "設定次第ではTouch IDやFace IDが要求される場合があります" },
  ];

  const androidSteps = el ? [
    { icon: "🗺️", title: "「Google マップ」アプリをひらく", desc: "{地図|ちず}のアプリ" },
    { icon: "👤", title: "{右上|みぎうえ}のプロフィールアイコン（{丸|まる}いアイコン）をタップ", desc: "" },
    { icon: "📅", title: "「タイムライン」をタップ", desc: "または「あなたのタイムライン」" },
    { icon: "🗓️", title: "カレンダーで「{先週|せんしゅう}」や「{先月|せんげつ}」をえらぶ", desc: "どこに{行|い}ったか{記録|きろく}されている" },
  ] : [
    { icon: "🗺️", title: "「Google マップ」アプリをひらく", desc: "地図のアプリ" },
    { icon: "👤", title: "右上のプロフィールアイコン（丸いアイコン）をタップ", desc: "" },
    { icon: "📅", title: "「タイムライン」をタップ", desc: "または「あなたのタイムライン」" },
    { icon: "🗓️", title: "カレンダーで「先週」や「先月」をえらぶ", desc: "どこに行ったか記録されている" },
  ];

  const locationItems = el ? [
    "📍 {自宅|じたく}の{場所|ばしょ}",
    "🏫 {学校|がっこう}の{場所|ばしょ}",
    "🎮 よく{行|い}く{場所|ばしょ}（ゲームセンター・{公園|こうえん}など）",
    "🍜 よく{行|い}くレストラン・カフェ",
    "🚃 {毎日|まいにち}の{通学|つうがく}ルート",
    "📅 {何曜日|なんようび}の{何時|なんじ}ごろ、どこにいるか",
  ] : [
    "📍 自宅の場所",
    "🏫 学校の場所",
    "🎮 よく行く場所（ゲームセンター・公園など）",
    "🍜 よく行くレストラン・カフェ",
    "🚃 毎日の通学ルート",
    "📅 何曜日の何時ごろ、どこにいるか",
  ];

  const appItems = [
    { icon: "📷", title: el ? "カメラアプリ" : "カメラアプリ", desc: el ? "{写真|しゃしん}に{位置情報|いちじょうほう}（ジオタグ）がつく。SNSに{投稿|とうこう}すると、{撮|と}った{場所|ばしょ}がバレる。" : "写真に位置情報（ジオタグ）がつく。SNSに投稿すると、撮った場所がバレる。", levelLabel: el ? "オフにすることを{推奨|すいしょう} ⚠️" : "オフにすることを推奨 ⚠️", levelColor: "#ffa940" },
    { icon: "📱", title: el ? "SNSアプリ（Instagram・X・TikTokなど）" : "SNSアプリ（Instagram・X・TikTokなど）", desc: el ? "{投稿|とうこう}に「{現在地|げんざいち}」がついて{世界中|せかいじゅう}に{公開|こうかい}される。" : "投稿に「現在地」がついて世界中に公開される。", levelLabel: el ? "オフにすることを{推奨|すいしょう} ⚠️" : "オフにすることを推奨 ⚠️", levelColor: "#ffa940" },
    { icon: "🗺️", title: el ? "マップアプリ（Google マップなど）" : "マップアプリ（Google マップなど）", desc: el ? "{目的地|もくてきち}への{道案内|みちあんない}に{必要|ひつよう}。" : "目的地への道案内に必要。", levelLabel: el ? "{使|つか}う{時|とき}だけON △" : "使う時だけON △", levelColor: "#f59e0b" },
    { icon: "☁️", title: el ? "{天気|てんき}アプリ" : "天気アプリ", desc: el ? "今いる{場所|ばしょ}の{天気|てんき}を{知|し}るために{使|つか}う。" : "今いる場所の天気を知るために使う。", levelLabel: el ? "{使|つか}う{時|とき}だけONでもOK △" : "使う時だけONでもOK △", levelColor: "#f59e0b" },
  ];

  const checklistItems = el ? [
    { title: "カメラの{位置情報|いちじょうほう}をオフにする", ios: "{設定|せってい}→プライバシーとセキュリティ→{位置情報|いちじょうほう}サービス→カメラ→「しない」", android: "{設定|せってい}→アプリ→カメラ→{権限|けんげん}→{位置情報|いちじょうほう}→「{許可|きょか}しない」" },
    { title: "SNSアプリの{位置情報|いちじょうほう}をオフにする", ios: "{設定|せってい}→プライバシーとセキュリティ→{位置情報|いちじょうほう}サービス→{各|かく}SNSアプリ→「しない」", android: "{設定|せってい}→アプリ→{各|かく}SNSアプリ→{権限|けんげん}→{位置情報|いちじょうほう}→「{許可|きょか}しない」" },
    { title: "「よく{利用|りよう}する{場所|ばしょ}」の{履歴|りれき}を{消|け}す（iOSのみ）", ios: "{設定|せってい}→プライバシーとセキュリティ→{位置情報|いちじょうほう}サービス→システムサービス→よく{利用|りよう}する{場所|ばしょ}→「{履歴|りれき}を{消去|しょうきょ}」", android: null },
  ] : [
    { title: "カメラの位置情報をオフにする", ios: "設定→プライバシーとセキュリティ→位置情報サービス→カメラ→「しない」", android: "設定→アプリ→カメラ→権限→位置情報→「許可しない」" },
    { title: "SNSアプリの位置情報をオフにする", ios: "設定→プライバシーとセキュリティ→位置情報サービス→各SNSアプリ→「しない」", android: "設定→アプリ→各SNSアプリ→権限→位置情報→「許可しない」" },
    { title: "「よく利用する場所」の履歴を消す（iOSのみ）", ios: "設定→プライバシーとセキュリティ→位置情報サービス→システムサービス→よく利用する場所→「履歴を消去」", android: null },
  ];

  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep12" onStart={() => setPhase("intro")} />
  );

  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a1000,#0f0800)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(20)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random()*2+1, height: Math.random()*2+1, background: orange, borderRadius: "50%", left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.3+0.05, animation: `blink ${Math.random()*4+2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📍</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: orange, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 01-2</div>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}>
        <RubyText text={el ? "{本当|ほんとう}は、{位置情報|いちじょうほう}が" : "本当は、位置情報が"} /><br />
        <RubyText text={el ? "{見|み}えてるよ" : "見えてるよ"} />
      </h1>
      <div style={{ maxWidth: 320, width: "100%", margin: "16px 0 24px" }}>
        <OwlSay mood="worried" e={el ? "エピソード1では、{写真|しゃしん}の{背景|はいけい}から{場所|ばしょ}が{特定|とくてい}されるこわさを{学|まな}んだね。でも、それだけじゃないんだ。じつは、あなたのスマホは「あなたが{今|いま}どこにいるか」をずっとおぼえているんだよ。🦉" : "エピソード1では、写真の背景から場所が特定されるこわさを学んだね。でも、それだけじゃないんだ。じつは、あなたのスマホは「あなたが今どこにいるか」をずっとおぼえているんだよ。🦉"}>エピソード1では、写真の背景から場所が特定されるこわさを学んだね。でも、それだけじゃないんだ。じつは、あなたのスマホは「あなたが今どこにいるか」をずっとおぼえているんだよ。🦉</OwlSay>
      </div>
      <button onClick={() => setPhase("device_select")} style={{ background: `linear-gradient(135deg,${orange},${orangeDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${orange}44` }}>
        <RubyText text={el ? "たしかめてみる →" : "たしかめてみる →"} />
      </button>
    </div>
    </EpisodeShell>
  );

  if (phase === "device_select") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a1000,#0f0800)", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 8 }}>
          <RubyText text={el ? "どの{端末|たんまつ}で{確認|かくにん}する？" : "どの端末で確認する？"} />
        </h2>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", textAlign: "center", marginBottom: 24, lineHeight: 1.7 }}>
          <RubyText text={el ? "今{使|つか}っている{端末|たんまつ}か、おうちの{人|ひと}の{端末|たんまつ}をえらんでじっさいに{確認|かくにん}してみよう。" : "今使っている端末か、おうちの人の端末をえらんで実際に確認してみよう。"} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { id: "ios", icon: "📱", title: "iOS", subtitle: "iPhone・iPad" },
            { id: "android", icon: "🤖", title: "Android", subtitle: el ? "Androidスマホ・タブレット" : "Androidスマホ・タブレット" },
          ].map((d) => (
            <button key={d.id} onClick={() => { feedback("tap"); setSelectedDevice(d.id); setStepIdx(0); setPhase("steps"); }}
              style={{ width: "100%", background: `${orange}0a`, border: `1.5px solid ${orange}44`, borderRadius: 18, padding: "20px 18px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 36 }}>{d.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{d.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>{d.subtitle}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 20, color: orange }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "steps") {
    const steps = selectedDevice === "ios" ? iosSteps : androidSteps;
    return (
      <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a1000,#0f0800)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
            {selectedDevice === "ios"
              ? <RubyText text={el ? "iPhoneで、{位置情報|いちじょうほう}の{履歴|りれき}を{見|み}てみよう" : "iPhoneで、位置情報の履歴を見てみよう"} />
              : <RubyText text={el ? "Androidで、{位置情報|いちじょうほう}の{履歴|りれき}を{見|み}てみよう" : "Androidで、位置情報の履歴を見てみよう"} />
            }
          </h2>
          <OwlSay mood="happy" e={el ? "おうちの{人|ひと}といっしょに、じゅんばんにやってみよう🦉" : "おうちの人といっしょに、じゅんばんにやってみよう🦉"}>おうちの人といっしょに、じゅんばんにやってみよう🦉</OwlSay>
          {selectedDevice === "ios" && (
            <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, padding: "10px 14px", fontSize: 11, color: "rgba(255,255,255,.55)", lineHeight: 1.75, marginBottom: 14 }}>
              下記の例は2026年6月時点のiOSの操作画面を参考にしています。操作手順は変更される場合がございます。また、既に位置情報サービスを無効化している場合は記載の結果にならない可能性があります。
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            {steps.slice(0, stepIdx + 1).map((s, i) => (
              <div key={i} style={{ background: `${orange}08`, border: `1px solid ${orange}22`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${orange}18`, border: `1px solid ${orange}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: orange, marginBottom: 3 }}>STEP {i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: s.desc ? 4 : 0 }}><RubyText text={s.title} /></div>
                  {s.desc && <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}><RubyText text={s.desc} /></div>}
                  {s.desc2 && <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 4 }}><RubyText text={s.desc2} /></div>}
                </div>
              </div>
            ))}
          </div>
          {selectedDevice === "ios" && stepIdx >= steps.length - 1 && (
            <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.25)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#fca5a5" }}>
              ⚠️ <RubyText text={el ? "パスコードはおうちの{人|ひと}だけが{入力|にゅうりょく}してください" : "パスコードはおうちの人だけが入力してください"} />
            </div>
          )}
          {selectedDevice === "android" && (
            <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.25)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#fca5a5" }}>
              ⚠️ <RubyText text={el ? "Googleアカウントへのログインがひつようです。おうちの{人|ひと}のスマホで{確認|かくにん}しましょう。" : "Googleアカウントにログインが必要です。おうちの人のスマホで確認しましょう。"} />
            </div>
          )}
          {stepIdx < steps.length - 1 ? (
            <button onClick={() => setStepIdx(s => s + 1)}
              style={{ width: "100%", padding: 14, background: `${orange}18`, border: `1px solid ${orange}33`, borderRadius: 14, color: orange, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{次|つぎ}のステップ →" : "次のステップ →"} />
            </button>
          ) : (
            <button onClick={() => { feedback("correct"); setPhase("location_reveal"); }}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${orange},${orangeDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{開|ひら}けた！{次|つぎ}へ →" : "開けた！次へ →"} />
            </button>
          )}
        </div>
      </div>
      </EpisodeShell>
    );
  }

  if (phase === "location_reveal") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 16 }}>
          <RubyText text={el ? "そこに{記録|きろく}されているのは…" : "そこに記録されているのは…"} />
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {locationItems.slice(0, locationStep + 1).map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "14px 16px", fontSize: 14, color: "rgba(255,255,255,.85)", animation: "slideUp .4s ease" }}>
              <RubyText text={item} />
            </div>
          ))}
        </div>
        {locationStep < locationItems.length - 1 ? (
          <button onClick={() => { feedback("horror"); setLocationStep(s => s + 1); }}
            style={{ width: "100%", padding: 14, background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.35)", borderRadius: 14, color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={el ? "{続|つづ}きを{見|み}る →" : "続きを見る →"} />
          </button>
        ) : (
          <>
            <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.35)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.85 }}>
              <RubyText text={el ? "もしこのスマホを{落|お}としたり、{誰|だれ}かに{見|み}られたりしたら…あなたの{毎日|まいにち}の{行動|こうどう}が{全部|ぜんぶ}バレてしまう。" : "もしこのスマホを落としたり、誰かに見られたりしたら…あなたの毎日の行動が全部バレてしまう。"} />
            </div>
            <button onClick={() => { feedback("found"); setPhase("apps"); }}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${orange},${orangeDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{次|つぎ}へ →" : "次へ →"} />
            </button>
          </>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "apps") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a1000,#0f0800)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 14 }}>
          <RubyText text={el ? "こんなアプリが、{位置情報|いちじょうほう}を{使|つか}っている" : "こんなアプリが、位置情報を使っている"} />
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {appItems.map((a, i) => (
            <div key={i} style={{ background: `${orange}06`, border: `1px solid ${orange}22`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", animation: `slideUp .4s ${i * .1}s both ease` }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 4 }}><RubyText text={a.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.65, marginBottom: 6 }}><RubyText text={a.desc} /></div>
                <div style={{ background: `${a.levelColor}18`, border: `1px solid ${a.levelColor}44`, borderRadius: 8, padding: "4px 10px", display: "inline-block", fontSize: 11, fontWeight: 900, color: a.levelColor }}>
                  <RubyText text={a.levelLabel} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <OwlSay mood="worried" e={el ? "カメラとSNSアプリは{位置情報|いちじょうほう}をオフにすることが{望|のぞ}ましいよ🦉" : "カメラとSNSアプリは位置情報をオフにすることが望ましいよ🦉"}>カメラとSNSアプリは位置情報をオフにすることが望ましいよ🦉</OwlSay>
        <button onClick={() => setPhase("checklist")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${orange},${orangeDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{今|いま}すぐ{設定|せってい}を{変|か}えよう →" : "今すぐ設定を変えよう →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "checklist") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a1000,#0f0800)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
          <RubyText text={el ? "{今|いま}すぐ、いっしょに{設定|せってい}を{変|か}えよう" : "今すぐ、いっしょに設定を変えよう"} />
        </h2>
        {/* メインメッセージ */}
        <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.75, marginBottom: 6 }}>
            <RubyText text={el ? "{必要|ひつよう}だと{思|おも}ったら、おうちの{人|ひと}といっしょに{以下|いか}の{設定|せってい}をしてみてね！" : "必要だと思ったら、おうちの人といっしょに以下の設定をしてみてね！"} />
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 }}>
            <RubyText text={el ? "{位置情報|いちじょうほう}を{共有|きょうゆう}して{楽|たの}しむこともあるので、{強制|きょうせい}ではありません。" : "位置情報を共有して楽しむこともあるので、強制ではありません。"} />
          </div>
        </div>
        {/* 2ボタン */}
        {!showChecklist && (
          <div style={{ display: "flex", gap: "4%", marginBottom: 14 }}>
            <button onClick={() => { feedback("tap"); setShowChecklist(true); }}
              style={{ width: "48%", background: orange, border: "none", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{設定|せってい}してみる" : "設定してみる"} />
            </button>
            <button onClick={() => { feedback("tap"); setPhase("summary"); }}
              style={{ width: "48%", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, padding: "12px", fontSize: 13, color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{今|いま}はスキップする" : "今はスキップする"} />
            </button>
          </div>
        )}
        {/* チェックリスト（設定してみるを押した場合のみ） */}
        {showChecklist && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {checklistItems.map((item, i) => (
                <button key={i} onClick={() => { feedback("correct"); setChecklistDone(p => p.includes(i) ? p : [...p, i]); }}
                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, background: checklistDone.includes(i) ? "rgba(74,222,128,.08)" : `${orange}06`, border: `1px solid ${checklistDone.includes(i) ? "rgba(74,222,128,.3)" : orange + "22"}`, borderRadius: 16, padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, background: checklistDone.includes(i) ? "#4ade80" : "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>{checklistDone.includes(i) ? "✓" : ""}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: checklistDone.includes(i) ? "#86efac" : "#fff", marginBottom: 6 }}><RubyText text={item.title} /></div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>
                      iOS：<RubyText text={item.ios} />{item.android && <><br />Android：<RubyText text={item.android} /></>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => { feedback("tap"); setPhase("summary"); }}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${orange},${orangeDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
              <RubyText text={el ? "まとめへ →" : "まとめへ →"} />
            </button>
          </>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "summary") return (
    <EpisodeShell onExit={onExit}>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#fff8f0,#ffeed6)",
        padding: "32px 20px 40px",
        fontFamily: "'Zen Maru Gothic',sans-serif",
      }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>

          <OwlMolly size={80} />

          <div style={{
            background: "#fff",
            borderRadius: 18,
            padding: "18px 20px",
            margin: "14px 0 20px",
            border: "1.5px solid #ffa94044",
          }}>
            <RubyText text={ageMode === "elementary"
              ? "エピソード1とあわせて、こじん{情報|じょうほう}を{守|まも}る{第一歩|だいいっぽ}がふめたね！おうちの{人|ひと}と{一緒|いっしょ}にできたこと、すごいよ！"
              : "エピソード1とあわせて、個人情報を守る第一歩がふめたね！おうちの人と一緒にできたこと、すごいよ！"
            } />
          </div>

          <div style={{
            background: "rgba(34,197,94,.08)",
            border: "1px solid rgba(34,197,94,.2)",
            borderRadius: 16,
            padding: "16px 18px",
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 900,
              color: "#16a34a",
              marginBottom: 12,
            }}>
              <RubyText text={ageMode === "elementary"
                ? "これで、{位置情報|いちじょうほう}のワナから{守|まも}れる"
                : "これで、位置情報のワナから守れる"
              } />
            </div>
            {[
              ["写真から家の場所がバレない", "{写真|しゃしん}から{家|いえ}の{場所|ばしょ}がバレない"],
              ["SNS投稿から場所がバレない", "SNS{投稿|とうこう}から{場所|ばしょ}がバレない"],
              ["毎日の行動パターンを追われない", "{毎日|まいにち}の{行動|こうどう}パターンを{追|お}われない"],
            ].map(([text, textEl], i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < 2 ? "1px solid rgba(34,197,94,.1)" : "none",
              }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 99,
                  background: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#fff",
                  flexShrink: 0,
                }}>✓</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                  <RubyText text={ageMode === "elementary" ? textEl : text} />
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { feedback("complete"); setPhase("complete"); }}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg,#ffa940,#ff8c1a)",
              border: "none",
              borderRadius: 16,
              color: "#fff",
              fontSize: 16,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
            🏆 修了証をもらう
          </button>

        </div>
      </div>
    </EpisodeShell>
  );

  if (phase === "complete") return (
    <EpisodeShell onExit={onExit}>
      <CompleteScreen
        epKey="ep1_2"
        accentColor="#ffa940"
        onComplete={onComplete}
      />
    </EpisodeShell>
  );

  return null;
}


// ─────────────────────────────────────────────
// ██ EPISODE 2 — フェイクニュースを見抜け
// ─────────────────────────────────────────────

const FAKE_POSTS = [
  {
    id: 1,
    verdict: "fake",
    account: "緊急速報_bot",
    accountIcon: "⚡",
    accountColor: "#ff4343",
    verified: false,
    time: "2分前",
    text: "【緊急】○○市で大規模地震発生！マグニチュード7.8。今すぐ高台へ避難してください。ライフライン完全停止中。#緊急 #拡散希望",
    likes: 48200, rts: 92100, replies: 3400,
    photoBg: "linear-gradient(135deg,#1a0000,#3d0000)",
    photoIcon: "🚨",
    image: "/images/ep2/post1.jpg",
    dangerPoints: [
      { x: 15, y: 20, emoji: "⚡", label: "アカウント名", elLabel: "アカウント{名|めい}", info: "「緊急速報_bot」という個人アカウント。公式機関ではない。フォロワー数も確認すべき。", elInfo: "「{緊急|きんきゅう}{速報|そくほう}_bot」という{個人|こじん}アカウント。{公式|こうしき}{機関|きかん}ではない。フォロワー{数|すう}も{確認|かくにん}しよう。" },
      { x: 80, y: 20, emoji: "📅", label: "投稿時刻", elLabel: "{投稿|とうこう}{時刻|じこく}", info: "「2分前」という超速報。本物の災害情報は公式機関が確認してから発表するので時間がかかる。", elInfo: "「2{分|ふん}{前|まえ}」という{超|ちょう}{速報|そくほう}。{本物|ほんもの}の{災害|さいがい}{情報|じょうほう}は{公式|こうしき}{機関|きかん}が{確認|かくにん}してから{発表|はっぴょう}するので{時間|じかん}がかかる。" },
      { x: 50, y: 70, emoji: "#️⃣", label: "拡散希望タグ", elLabel: "{拡散|かくさん}{希望|きぼう}タグ", info: "「#拡散希望」は感情を煽って確認前に拡散させる典型的な手口。本物の公式情報にはつかない。", elInfo: "「#{拡散|かくさん}{希望|きぼう}」は{気持|きも}ちを{煽|あお}って{確認|かくにん}する{前|まえ}に{拡散|かくさん}させる{手口|てぐち}。{本物|ほんもの}の{公式|こうしき}{情報|じょうほう}にはつかない。" },
    ],
    whyFake: "気象庁・市区町村の公式アカウントから同じ情報が出ていない。公式情報は必ず複数の機関から同時に発表される。",
    elWhyFake: "{気象庁|きしょうちょう}・{市区町村|しくちょうそん}の{公式|こうしき}アカウントから{同|おな}じ{情報|じょうほう}が{出|で}ていない。{公式|こうしき}{情報|じょうほう}は{必|かなら}ず{複数|ふくすう}の{機関|きかん}から{同時|どうじ}に{発表|はっぴょう}される。",
    checkMethod: "気象庁（jma.go.jp）・NHK・市区町村の公式サイトを確認する",
    elCheckMethod: "{気象庁|きしょうちょう}（jma.go.jp）・NHK・{市区町村|しくちょうそん}の{公式|こうしき}サイトを{確認|かくにん}する",
  },
  {
    id: 2,
    verdict: "fake",
    account: "速報ニュース_JP",
    accountIcon: "📺",
    accountColor: "#ff8c00",
    verified: false,
    time: "1時間前",
    text: "【衝撃】有名芸能人○○さんが詐欺で逮捕されたと警視庁が発表。本人のSNSアカウントも突然削除。関係者は口を閉ざす…",
    likes: 31000, rts: 44000, replies: 8900,
    photoBg: "linear-gradient(135deg,#1a0a00,#3d2000)",
    photoIcon: "📰",
    image: "/images/ep2/post2.jpg",
    dangerPoints: [
      { x: 20, y: 25, emoji: "📺", label: "非公式アカウント", elLabel: "{非|ひ}{公式|こうしき}アカウント", info: "実在するニュース局に似た名前だが、認証バッジ（✓）がない。なりすましアカウントの典型。", elInfo: "{実在|じつざい}するニュース{局|きょく}に{似|に}た{名前|なまえ}だが、{認証|にんしょう}バッジ（✓）がない。なりすましアカウントの{典型|てんけい}。" },
      { x: 75, y: 30, emoji: "🤫", label: "曖昧な情報源", elLabel: "あいまいな{情報源|じょうほうげん}", info: "「警視庁が発表」と書いてあるが、警視庁の公式サイトに該当情報がない。具体的なリンクもない。", elInfo: "「{警視庁|けいしちょう}が{発表|はっぴょう}」と{書|か}いてあるが、{警視庁|けいしちょう}の{公式|こうしき}サイトに{該当|がいとう}{情報|じょうほう}がない。{具体的|ぐたいてき}なリンクもない。" },
      { x: 50, y: 72, emoji: "💭", label: "煽り文句", elLabel: "{煽|あお}り{文句|もんく}", info: "「口を閉ざす」「突然削除」など感情を刺激する表現。読者の好奇心を利用して拡散させる手法。", elInfo: "「{口|くち}を{閉|と}ざす」「{突然|とつぜん}{削除|さくじょ}」など{感情|かんじょう}を{刺激|しげき}する{表現|ひょうげん}。{読者|どくしゃ}の{好奇心|こうきしん}を{利用|りよう}して{拡散|かくさん}させる{手法|しゅほう}。" },
    ],
    whyFake: "実在する芸能人・企業名を使ったなりすまし投稿。クリック誘導や個人情報詐取が目的のことが多い。",
    elWhyFake: "{実在|じつざい}する{芸能人|げいのうじん}・{企業名|きぎょうめい}を{使|つか}ったなりすまし{投稿|とうこう}。クリック{誘導|ゆうどう}や{個人情報|こじんじょうほう}{詐取|さしゅ}が{目的|もくてき}のことが{多|おお}い。",
    checkMethod: "当該芸能人の公式サイト・大手ニュースサイト（NHK・読売・毎日など）で同じ情報が出ているか確認する",
    elCheckMethod: "その{芸能人|げいのうじん}の{公式|こうしき}サイト・{大手|おおて}ニュースサイト（NHK・{読売|よみうり}・{毎日|まいにち}など）で{同|おな}じ{情報|じょうほう}が{出|で}ているか{確認|かくにん}する",
  },
  {
    id: 3,
    verdict: "fake",
    account: "社会問題を考える会",
    accountIcon: "🌐",
    accountColor: "#2563eb",
    verified: false,
    time: "3時間前",
    text: "これが現実です。子どもたちが危険にさらされています。今すぐシェアして周りに知らせてください。この写真を見てください。",
    likes: 22000, rts: 67000, replies: 1200,
    photoBg: "linear-gradient(135deg,#0a0a2e,#1a1a4e)",
    photoIcon: "🖼️",
    image: "/images/ep2/post3.jpg",
    dangerPoints: [
      { x: 50, y: 30, emoji: "🖼️", label: "写真の出典不明", elLabel: "{写真|しゃしん}の{出典|しゅってん}不明", info: "「この写真を見てください」と言うだけで、いつ・どこで・誰が撮った写真かが一切書かれていない。古い写真や別の国の写真を使い回しているケースが多い。", elInfo: "「この{写真|しゃしん}を{見|み}てください」と{言|い}うだけで、いつ・どこで・{誰|だれ}が{撮|と}った{写真|しゃしん}かが{一切|いっさい}{書|か}かれていない。{古|ふる}い{写真|しゃしん}や{別|べつ}の{国|くに}の{写真|しゃしん}を{使|つか}い{回|まわ}しているケースが{多|おお}い。" },
      { x: 20, y: 65, emoji: "😱", label: "感情操作", elLabel: "{感情|かんじょう}{操作|そうさ}", info: "「これが現実」「今すぐ」という言葉で焦りと怒りを煽る。冷静な判断をさせないための心理的テクニック。", elInfo: "「これが{現実|げんじつ}」「{今|いま}すぐ」という{言葉|ことば}で{焦|あせ}りと{怒|いか}りを{煽|あお}る。{冷静|れいせい}な{判断|はんだん}をさせないための{心理的|しんりてき}なテクニック。" },
      { x: 78, y: 65, emoji: "🔁", label: "無条件に拡散を求める", elLabel: "{条件|じょうけん}なしに{拡散|かくさん}を{求|もと}める", info: "「今すぐシェア」と内容確認より拡散を優先させる。本物の情報発信者は確認を促す。", elInfo: "「{今|いま}すぐシェア」と{内容|ないよう}{確認|かくにん}より{拡散|かくさん}を{優先|ゆうせん}させる。{本物|ほんもの}の{情報|じょうほう}{発信者|はっしんしゃ}は{確認|かくにん}を{促|うなが}す。" },
    ],
    whyFake: "写真の出典・日時・場所が不明。画像の逆検索（Googleレンズ等）で別の文脈の古い写真とわかることが多い。",
    elWhyFake: "{写真|しゃしん}の{出典|しゅってん}・{日時|にちじ}・{場所|ばしょ}が{不明|ふめい}。{画像|がぞう}の{逆検索|ぎゃくけんさく}（Googleレンズ{等|など}）で{別|べつ}の{文脈|ぶんみゃく}の{古|ふる}い{写真|しゃしん}とわかることが{多|おお}い。",
    checkMethod: "Googleレンズやtineye.comで写真を逆検索して、同じ画像がいつ・どこで使われたか調べる",
    elCheckMethod: "Googleレンズやtineye.comで{写真|しゃしん}を{逆検索|ぎゃくけんさく}して、{同|おな}じ{画像|がぞう}がいつ・どこで{使|つか}われたか{調|しら}べる",
  },
  {
    id: 4,
    verdict: "real",
    account: "NHKニュース",
    accountIcon: "🏛️",
    accountColor: "#1d4ed8",
    verified: true,
    time: "32分前",
    text: "【注意】警察庁は14日、SNS型詐欺の被害が今年に入り前年比2倍以上に急増していると発表しました。「フォロワーを増やせる」「副業で月10万円」などの勧誘DM・投稿に注意するよう呼びかけています。▶詳細はNHKウェブニュースへ",
    likes: 3200, rts: 1400, replies: 280,
    photoBg: "linear-gradient(135deg,#0a1628,#0d2142)",
    photoIcon: "🛡️",
    image: "/images/ep2/post4.jpg",
    dangerPoints: [
      { x: 18, y: 22, emoji: "✅", label: "認証済みアカウント", elLabel: "{認証|にんしょう}{済|す}みアカウント", info: "認証バッジ（✓）は参考程度に。現在は有料で誰でも取得できるため、バッジだけでは信頼の証明にはならない。重要なのは②発表機関が明確か③情報源があるか。", elInfo: "{認証|にんしょう}バッジ（✓）は{参考|さんこう}{程度|ていど}に。{今|いま}は{有料|ゆうりょう}で{誰|だれ}でも{取得|しゅとく}できるため、バッジだけでは{信頼|しんらい}の{証明|しょうめい}にはならない。{重要|じゅうよう}なのは{発表|はっぴょう}{機関|きかん}が{明確|めいかく}かどうか。" },
      { x: 75, y: 22, emoji: "🏛️", label: "発表機関が明確", elLabel: "{発表|はっぴょう}{機関|きかん}が{明確|めいかく}", info: "「警察庁は14日」と具体的な公的機関と日付が明記されている。信頼できる情報は「誰が・いつ」が明確。", elInfo: "「{警察庁|けいさつちょう}は14{日|にち}」と{具体的|ぐたいてき}な{公的|こうてき}{機関|きかん}と{日付|ひづけ}が{明記|めいき}されている。" },
      { x: 50, y: 70, emoji: "🔗", label: "一次情報源への誘導", elLabel: "{一次|いちじ}{情報源|じょうほうげん}への{誘導|ゆうどう}", info: "「NHKウェブニュースへ」と一次情報源の確認手段を示している。本物の情報発信は必ず確認先を提示する。", elInfo: "「NHKウェブニュースへ」と{一次|いちじ}{情報源|じょうほうげん}の{確認|かくにん}{手段|しゅだん}を{示|しめ}している。" },
    ],
    whyFake: "これは本物です。①具体的な発表機関（警察庁）と日付が明記 ②一次情報源（NHKウェブ）への誘導がある ③認証バッジは参考程度・バッジだけでは判断しない",
    elWhyFake: "{本物|ほんもの}のニュースです。①{具体的|ぐたいてき}な{発表|はっぴょう}{機関|きかん}（{警察庁|けいさつちょう}）と{日付|ひづけ}が{明記|めいき}されている ②{一次|いちじ}{情報源|じょうほうげん}への{誘導|ゆうどう}がある ③{認証|にんしょう}バッジは{参考|さんこう}{程度|ていど}・バッジだけでは{判断|はんだん}しない",
    checkMethod: "✓ このニュースは信頼できます。NHK公式アカウント（✓）から警察庁発表を正確に伝える本物のニュースです。",
    elCheckMethod: "✓ このニュースは{信頼|しんらい}できます。NHK{公式|こうしき}アカウント（✓）から{警察庁|けいさつちょう}{発表|はっぴょう}を{正確|せいかく}に{伝|つた}える{本物|ほんもの}のニュースです。",
    isReal: true,
  },
];

// ── 最悪ケースシミュレーション ──
function WorstCasePage({ onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [innerPhase, setInnerPhase] = useState("intro");
  const [eventIdx, setEventIdx] = useState(0);
  const [shownReports, setShownReports] = useState([]);
  const [reportStatus, setReportStatus] = useState({});
  const [showEnd, setShowEnd] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [bubble, setBubble] = useState(null);
  const [policePos, setPolicePos] = useState([
    {x:14,y:38},{x:48,y:58},{x:73,y:28}
  ]);
  const timerRef = useRef(null);

  const REPORTS = [
    {id:0,x:50,y:38,type:'real'},
    {id:1,x:20,y:24,type:'fake'},
    {id:2,x:70,y:20,type:'fake'},
    {id:3,x:45,y:66,type:'fake'},
    {id:4,x:78,y:56,type:'fake'},
    {id:5,x:33,y:56,type:'real'},
    {id:6,x:15,y:50,type:'fake'},
    {id:7,x:28,y:34,type:'fake'},
    {id:8,x:62,y:42,type:'fake'},
    {id:9,x:63,y:75,type:'real'},
    {id:10,x:24,y:72,type:'fake'},
  ];

  const EVENTS = [
    {
      clock:"18:00",show:[0],reveal:[],
      police:[{x:50,y:45},{x:33,y:56},{x:63,y:50}],
      bubble:{type:'police',text:"通報あり　向かいます",bx:50,by:45},
      log:{time:"18:00",text:"📞 通報が入った。警察が現場へ向かう（中身はまだ不明）",color:"rgba(255,255,255,.75)"},
    },
    {
      clock:"18:05",show:[1,2],reveal:[{id:0,to:'real_waiting'}],
      police:[{x:20,y:30},{x:70,y:26},{x:55,y:55}],
      bubble:{type:'real',text:"😣 本物だ！でも他の通報も…",bx:50,by:38},
      log:{time:"18:05",text:"🆘 最初の通報は本物だった。でも新たな通報が2件入る",color:"#ffb84d"},
    },
    {
      clock:"18:10",show:[3,4],reveal:[{id:1,to:'fake'},{id:2,to:'fake'}],
      police:[{x:20,y:24},{x:70,y:20},{x:45,y:66}],
      bubble:{type:'police',text:"現場確認…デマだ！",bx:20,by:24},
      log:{time:"18:10",text:"❌ 駆けつけた2件はどちらもデマ。警察が振り回される",color:"#ff6b6b"},
    },
    {
      clock:"18:20",show:[5,6,7],reveal:[{id:3,to:'fake'},{id:4,to:'fake'}],
      police:[{x:45,y:66},{x:78,y:56},{x:33,y:56}],
      bubble:{type:'police',text:"これもデマか…次へ！",bx:45,by:66},
      log:{time:"18:20",text:"❌ さらに2件もデマ。通報が増え、手が回らない",color:"#ff6b6b"},
    },
    {
      clock:"18:30",show:[8],reveal:[],
      police:[{x:15,y:50},{x:28,y:34},{x:62,y:42}],
      bubble:{type:'real',text:"😢 まだ誰も来ない…",bx:50,by:38},
      log:{time:"18:30",text:"😢 本物の被災者は30分待っている。警察はデマ対応中",color:"#ffb84d"},
    },
    {
      clock:"18:45",show:[9,10],reveal:[{id:5,to:'real_waiting'},{id:6,to:'fake'},{id:7,to:'fake'},{id:8,to:'fake'}],
      police:[{x:24,y:72},{x:62,y:42},{x:15,y:50}],
      bubble:{type:'police',text:"デマばかりだ…",bx:24,by:72},
      log:{time:"18:45",text:"❌ 確認した通報は次々デマ。本物2件目も放置されたまま",color:"#ff6b6b"},
    },
    {
      clock:"19:00",show:[],reveal:[{id:9,to:'real_waiting'},{id:10,to:'fake'}],
      police:[{x:24,y:72},{x:62,y:42},{x:15,y:50}],
      bubble:{type:'real',text:"💔 応答がない…",bx:50,by:38},
      log:{time:"19:00",text:"💔 1時間経過。本物の救助要請3件、まだ誰も来ていない",color:"#ff6b6b",danger:true},
    },
  ];

  const startAnimation = () => {
    setInnerPhase("anim");
    setEventIdx(0);
    setShownReports([]);
    const initialStatus = {};
    REPORTS.forEach(r => { initialStatus[r.id] = 'unknown'; });
    setReportStatus(initialStatus);
    setLogs([]);
    setBubble(null);
    setShowEnd(false);
    setPolicePos([{x:14,y:38},{x:48,y:58},{x:73,y:28}]);
  };

  useEffect(() => {
    if(innerPhase !== "anim") return;
    if(eventIdx >= EVENTS.length) {
      if(playCount < 1) {
        timerRef.current = setTimeout(() => {
          setBubble({type:'police',text:"もう一度見てみよう",bx:50,by:50});
          setPlayCount(c => c + 1);
          setEventIdx(0);
          setShownReports([]);
          const initialStatus = {};
          REPORTS.forEach(r => { initialStatus[r.id] = 'unknown'; });
          setReportStatus(initialStatus);
          setLogs([]);
          setPolicePos([{x:14,y:38},{x:48,y:58},{x:73,y:28}]);
        }, 1000);
      } else {
        setShowEnd(true);
        setBubble(null);
      }
      return;
    }
    const e = EVENTS[eventIdx];
    setPolicePos(e.police);
    setBubble(e.bubble);
    setShownReports(prev => {
      const next = [...prev];
      (e.show||[]).forEach(id => { if(!next.includes(id)) next.push(id); });
      return next;
    });
    setReportStatus(prev => {
      const next = {...prev};
      (e.reveal||[]).forEach(rv => { next[rv.id] = rv.to; });
      return next;
    });
    setLogs(prev => [...prev, e.log]);
    timerRef.current = setTimeout(() => {
      setEventIdx(i => i + 1);
    }, 3200);
    return () => clearTimeout(timerRef.current);
  }, [innerPhase, eventIdx]);

  const getPinStyle = (status) => {
    if(status==='unknown')      return {bg:'rgba(255,255,255,.15)',bd:'#aaa',color:'#ddd',mark:'?',pulse:false};
    if(status==='fake')         return {bg:'rgba(255,67,67,.2)',bd:'#ff4343',color:'#ff6b6b',mark:'✕',pulse:false};
    return {bg:'rgba(255,149,0,.2)',bd:'#ff9500',color:'#ffb84d',mark:'!',pulse:true};
  };

  const countByStatus = (st) =>
    shownReports.filter(id => reportStatus[id]===st).length;

  if(innerPhase === "intro") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#0a0f1a,#0d1424)",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      padding:"32px 24px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
    }}>
      <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:16,lineHeight:1.5}}>
          <RubyText text={el
            ? "そのデマがもたらす\n「{最悪|さいあく}のケース」"
            : "そのデマがもたらす\n「最悪のケース」"
          }/>
        </div>
        <div style={{
          background:"rgba(255,255,255,.06)",
          border:"1px solid rgba(255,255,255,.12)",
          borderRadius:14,
          padding:"16px 18px",
          marginBottom:24,
          textAlign:"left",
        }}>
          <p style={{fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.9,whiteSpace:"pre-line"}}>
            <RubyText text={el
              ? "{有事|ゆうじ}の{際|さい}に{軽|かる}い{気持|きも}ちで{作|つく}られたデマ。それが{災害|さいがい}のときに{広|ひろ}まると、{何|なに}が{起|お}きるのか。\n\n{通報|つうほう}が{入|はい}っても、{警察|けいさつ}は{行|い}ってみるまでそれがデマか{本物|ほんもの}か{分|わ}かりません。\n\nこれから、デマと{本物|ほんもの}の{情報|じょうほう}が{交錯|こうさく}し、{本来|ほんらい}{対応|たいおう}すべきものにあたれなくなる…という{最悪|さいあく}なケースを{見|み}てみよう。\n\n{上|うえ}にアニメーション、{下|した}はタイムラインを{表現|ひょうげん}している。2{回|かい}{再生|さいせい}されるよ。"
              : "有事の際に軽い気持ちで作られたデマ。それが災害のときに広まると、何が起きるのか。\n\n通報が入っても、警察は行ってみるまでそれがデマか本物か分かりません。\n\nこれから、デマと本物の情報が交錯し、本来対応すべきものにあたれなくなる…という最悪なケースを見てみよう。\n\n上にアニメーション、下はタイムラインを表現している。2回再生されるよ。"
            }/>
          </p>
        </div>
        <button
          onClick={() => { feedback("tap"); startAnimation(); }}
          style={{
            width:"100%",
            padding:"16px",
            borderRadius:14,
            border:"none",
            background:"linear-gradient(135deg,#ff6600,#ff4400)",
            color:"#fff",
            fontSize:16,
            fontWeight:900,
            cursor:"pointer",
            fontFamily:"inherit",
          }}>
          最悪のケースを見る →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#0a0f1a,#0d1424)",
      padding:"20px 16px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
    }}>
      <button
        onClick={() => {
          feedback("tap");
          if(timerRef.current) clearTimeout(timerRef.current);
          setShowEnd(true);
          setBubble(null);
          setEventIdx(EVENTS.length);
        }}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          background: "rgba(255,255,255,.1)",
          border: "1px solid rgba(255,255,255,.2)",
          borderRadius: 99,
          padding: "6px 14px",
          fontSize: 12,
          color: "rgba(255,255,255,.6)",
          cursor: "pointer",
          fontFamily: "inherit",
          zIndex: 100,
        }}>
        <RubyText text={el?"{スキップ|すきっぷ}":"スキップ"}/>
      </button>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:13,fontWeight:900,color:"#fff",marginBottom:2}}>
          <RubyText text={el ? "○○{市|し} {災害|さいがい}{発生中|はっせいちゅう}" : "○○市 災害発生中"} />
        </div>
        <div style={{fontSize:22,fontWeight:900,color:"#ff8c00",marginBottom:12}}>
          {eventIdx < EVENTS.length ? EVENTS[eventIdx].clock : "19:00"}
        </div>

        {/* マップ */}
        <div style={{
          position:"relative",height:240,
          background:"#0d1424",
          border:"1px solid rgba(255,255,255,.1)",
          borderRadius:12,overflow:"hidden",marginBottom:10,
        }}>
          {[[18,30,64,'h'],[18,62,64,'h'],[33,8,84,'v'],[66,8,84,'v']].map((r,i)=>(
            <div key={i} style={{
              position:"absolute",
              left:`${r[0]}%`,top:`${r[1]}%`,
              width:r[3]==='h'?`${r[2]}%`:'1px',
              height:r[3]==='h'?'1px':`${r[2]}%`,
              background:"rgba(255,255,255,.06)",
            }}/>
          ))}

          {/* ピン */}
          {shownReports.map(id => {
            const r = REPORTS.find(x => x.id===id);
            const st = reportStatus[id]||'unknown';
            const ps = getPinStyle(st);
            return (
              <div key={id} style={{
                position:"absolute",
                left:`${r.x}%`,top:`${r.y}%`,
                transform:"translate(-50%,-50%)",
                width:22,height:22,borderRadius:"50%",
                background:ps.bg,border:`1.5px solid ${ps.bd}`,
                color:ps.color,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:900,
                animation:ps.pulse?"mamPulse 1.2s ease-in-out infinite":"none",
                zIndex:3,
              }}>
                {ps.mark}
              </div>
            );
          })}

          {/* 警察 */}
          {policePos.map((p,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${p.x}%`,top:`${p.y}%`,
              transform:"translate(-50%,-50%)",
              width:24,height:24,borderRadius:"50%",
              background:"rgba(55,138,221,.25)",
              border:"1.5px solid #5badf0",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,
              transition:"left 1.8s ease,top 1.8s ease",
              zIndex:5,
            }}>🚓</div>
          ))}

          {/* 吹き出し */}
          {bubble && (
            <div style={{
              position:"absolute",
              left:`${bubble.bx}%`,
              top:`${bubble.by - 15}%`,
              transform:"translate(-50%,0)",
              background:bubble.type==='police'?"#fff":"#ff9500",
              color:bubble.type==='police'?"#1a1a1a":"#fff",
              fontSize:10,fontWeight:900,
              padding:"4px 8px",borderRadius:8,
              whiteSpace:"nowrap",zIndex:20,
              boxShadow:"0 2px 8px rgba(0,0,0,.4)",
            }}>
              {bubble.text}
              <div style={{
                position:"absolute",bottom:-5,left:"50%",
                transform:"translateX(-50%)",
                borderLeft:"5px solid transparent",
                borderRight:"5px solid transparent",
                borderTop:`5px solid ${bubble.type==='police'?"#fff":"#ff9500"}`,
              }}/>
            </div>
          )}
        </div>

        {/* 凡例 */}
        <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap",fontSize:11}}>
          {[
            {bg:"#aaa",color:"rgba(255,255,255,.5)",label:el?"{未確認|みかくにん}の{通報|つうほう}":"未確認の通報",st:"unknown"},
            {bg:"#ff4343",color:"#ff6b6b",label:"デマだった",st:"fake"},
            {bg:"#ff9500",color:"#ffb84d",label:el?"{本物|ほんもの}の{救助|きゅうじょ}{要請|ようせい}":"本物の救助要請",st:"real_waiting"},
          ].map(leg=>(
            <div key={leg.st} style={{display:"flex",alignItems:"center",gap:5,color:leg.color}}>
              <div style={{width:11,height:11,borderRadius:"50%",background:leg.bg,flexShrink:0}}/>
              <RubyText text={leg.label}/> <b>{countByStatus(leg.st)}</b>
            </div>
          ))}
        </div>

        {/* ログ */}
        <div style={{
          background:"rgba(255,255,255,.04)",
          border:"1px solid rgba(255,255,255,.08)",
          borderRadius:12,padding:12,marginBottom:12,minHeight:120,
        }}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:8}}>― 起きていること ―</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {logs.map((log,i)=>(
              <div key={i} style={{
                display:"flex",gap:8,padding:"7px 9px",borderRadius:8,
                fontSize:11,lineHeight:1.5,
                background:"rgba(255,255,255,.04)",
                border:"0.5px solid rgba(255,255,255,.1)",
              }}>
                <span style={{color:"rgba(255,255,255,.4)",flexShrink:0}}>{log.time}</span>
                <span style={{color:log.color}}><RubyText text={log.text}/></span>
              </div>
            ))}
          </div>
        </div>

        {/* 終了 */}
        {showEnd && (
          <div>
            <div style={{
              background:"rgba(255,67,67,.1)",
              border:"1px solid rgba(255,67,67,.35)",
              borderRadius:12,padding:14,marginBottom:12,textAlign:"center",
            }}>
              <div style={{fontSize:14,fontWeight:900,color:"#ff6b6b",marginBottom:6,lineHeight:1.5}}>
                <RubyText text={el
                  ? "デマの{確認|かくにん}に{追|お}われた{間|あいだ}、\n{本物|ほんもの}の{救助|きゅうじょ}が{放置|ほうち}されました"
                  : "デマの確認に追われた間、\n本物の救助が放置されました"
                }/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.6}}>
                <RubyText text={el
                  ? "{通報|つうほう}は、{行|い}ってみるまでデマか{分|わ}からない。\nあなたの1{回|かい}のシェアが、この{状況|じょうきょう}を{生|う}みます。"
                  : "通報は、行ってみるまでデマか分からない。\nあなたの1回のシェアが、この状況を生みます。"
                }/>
              </div>
            </div>
            <button
              onClick={() => { feedback("complete"); onComplete(); }}
              style={{
                width:"100%",padding:16,borderRadius:14,border:"none",
                background:"linear-gradient(135deg,#ffa940,#ff8c1a)",
                color:"#fff",fontSize:16,fontWeight:900,
                cursor:"pointer",fontFamily:"inherit",
              }}>
              <RubyText text={el
                ? "{次|つぎ}は、{情報|じょうほう}を{見|み}た{時|とき}の{判断|はんだん}ポイントを{見|み}てみよう"
                : "次は、情報を見た時の判断ポイントを見てみよう"
              }/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 拡散パニックアニメーション ──
function SpreadAnimPage({ ageMode, spreadData, spreadStep, setSpreadStep, onComplete }) {
  const [counter, setCounter] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const targetCount = spreadData[spreadStep]?.rts || 0;

  useEffect(() => {
    if (targetCount === 0) { setCounter(0); return; }
    let current = counter;
    const increment = Math.ceil(targetCount / 40);
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetCount) { setCounter(targetCount); clearInterval(interval); }
      else setCounter(current);
    }, 30);
    return () => clearInterval(interval);
  }, [spreadStep, targetCount]);

  const currentData = spreadData[spreadStep];
  const isLastStep = spreadStep >= spreadData.length - 1;
  const isPanic = spreadStep >= 3;

  return (
    <div style={{ minHeight: "100vh", background: isPanic ? "radial-gradient(ellipse at center,#1a0000,#000)" : "linear-gradient(180deg,#0f0a2e,#07041a)", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", display: "flex", flexDirection: "column", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
      {isPanic && <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,0,0,.015) 3px,rgba(255,0,0,.015) 4px)", pointerEvents: "none" }} />}

      <div style={{ maxWidth: 440, margin: "0 auto", width: "100%", flex: 1 }}>
        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: 20, padding: "10px 0" }}>
          <div style={{ fontSize: 9, fontFamily: "'DotGothic16',monospace", color: isPanic ? "#ef4444" : "#a78bfa", letterSpacing: ".3em", marginBottom: 6 }}>📱 RETWEET CHAIN SIMULATION</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.3 }}>
            <RubyText text={ageMode === "elementary" ? "デマが{世界中|せかいじゅう}に{広|ひろ}がるまで" : "デマが世界中に広がるまで"} />
          </h2>
        </div>

        {/* RTオリジナル投稿 */}
        <div style={{ background: "#0d1117", borderRadius: 14, padding: "12px 14px", marginBottom: 14, border: "1px solid rgba(239,68,68,.3)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#ef4444,#f97316)" }} />
          <div style={{ fontSize: 10, color: "#f87171", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <span>🔁</span> <RubyText text={ageMode === "elementary" ? "あなたがリツイートした{投稿|とうこう}" : "あなたがリツイートした投稿"} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(239,68,68,.2)", border: "1px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>緊急速報_bot</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)" }}>認証バッジなし · フォロワー 1,842</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.8)", lineHeight: 1.6, margin: 0 }}>【緊急】○○市で大規模地震発生！今すぐ高台へ避難！#拡散希望</p>
          <div style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "4px 10px", marginTop: 8, fontSize: 9, color: "#fca5a5", display: "inline-block", animation: "blink 1.5s infinite" }}>
            ⚠️ <RubyText text={ageMode === "elementary" ? "{実際|じっさい}は{別|べつ}の{国|くに}の{古|ふる}い{写真|しゃしん}でした" : "実際は別の国の古い写真でした"} />
          </div>
        </div>

        {/* メインカウンター */}
        <div style={{ background: isPanic ? "rgba(239,68,68,.12)" : "rgba(167,139,250,.08)", border: `1px solid ${isPanic ? "rgba(239,68,68,.4)" : "rgba(167,139,250,.3)"}`, borderRadius: 18, padding: "22px 16px", marginBottom: 14, textAlign: "center", position: "relative", overflow: "hidden" }}>
          {isPanic && <div style={{ position: "absolute", inset: 0, animation: "redFlash 1s infinite", pointerEvents: "none" }} />}
          <div style={{ fontSize: 11, color: isPanic ? "#ef4444" : "#a78bfa", fontFamily: "'DotGothic16',monospace", letterSpacing: ".2em", marginBottom: 6 }}>{currentData?.time}</div>
          <div style={{ fontSize: isPanic ? 52 : 42, fontWeight: 900, color: isPanic ? "#ef4444" : "#c4b5fd", fontFamily: "'DotGothic16',monospace", animation: isPanic ? "shake .2s infinite" : "none", lineHeight: 1 }}>
            {counter > 0 ? counter.toLocaleString() : "—"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
            <RubyText text={ageMode === "elementary" ? "🔁 リツイート{件数|けんすう}" : "🔁 リツイート件数"} />
          </div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 900, color: isPanic ? "#fca5a5" : "#c4b5fd" }}>
            <RubyText text={ageMode === "elementary" ? currentData?.label : currentData?.label} />
          </div>
        </div>

        {/* タイムライン */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
          {spreadData.slice(0, spreadStep + 1).map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: i < spreadStep ? 10 : 0, animation: "slideUp .3s ease" }}>
              <div style={{ width: 52, flexShrink: 0, fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "'DotGothic16',monospace" }}>{d.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, background: "rgba(255,255,255,.05)", borderRadius: 3, overflow: "hidden", marginBottom: 3 }}>
                  <div style={{ height: "100%", width: i === 4 ? "0%" : `${Math.min((d.rts / 92000) * 100, 100)}%`, background: i >= 3 ? "#ef4444" : i >= 2 ? "#f97316" : "#a78bfa", borderRadius: 3, transition: "width .8s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: i >= 3 ? "#fca5a5" : i === spreadStep ? "#e0d9ff" : "rgba(255,255,255,.4)" }}>
                  {d.rts > 0 ? `RT ${d.rts.toLocaleString()}件 — ` : "— "}{d.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 最終段階：デマ判明 */}
        {isLastStep && !showReveal && (
          <button onClick={() => setShowReveal(true)}
            style={{ width: "100%", padding: 14, background: "rgba(34,197,94,.12)", border: "1.5px solid rgba(34,197,94,.4)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, animation: "slideUp .5s ease" }}>
            <RubyText text={ageMode === "elementary" ? "📰 {翌日|よくじつ}…{続|つづ}きを{見|み}る →" : "📰 翌日…続きを見る →"} />
          </button>
        )}

        {showReveal && (
          <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.3)", borderRadius: 16, padding: "16px", marginBottom: 14, animation: "slideUp .5s ease" }}>
            <div style={{ fontSize: 24, textAlign: "center", marginBottom: 8 }}>😱</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#86efac", textAlign: "center", marginBottom: 8 }}>
              <RubyText text={ageMode === "elementary" ? "「{実|じつ}はデマでした」{訂正|ていせい}{記事|きじ}が{出|で}ました" : "「実はデマでした」訂正記事が出ました"} />
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.75, margin: "0 0 12px", textAlign: "center" }}>
              <RubyText text={ageMode === "elementary"
                ? "でも…92,100{件|けん}のRTは{消|き}えません。{拡散|かくさん}した{人|ひと}の{名前|なまえ}も{記録|きろく}に{残|のこ}ります。"
                : "でも…92,100件のRTは消えません。拡散した人の名前も記録に残ります。"} />
            </p>
            <button onClick={onComplete}
              style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "フェイクの{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "フェイクの見抜き方を学ぶ →"} />
            </button>
          </div>
        )}

        {!isLastStep && (
          <button onClick={() => setSpreadStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)", borderRadius: 14, color: "#fca5a5", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "pulse 2s infinite" }}>
            <RubyText text={ageMode === "elementary" ? "{続|つづ}きを{見|み}る →" : "続きを見る →"} />
          </button>
        )}
      </div>
    </div>
  );
}

function FakeNewsCasesScreen({ el, onComplete }) {
  const [step, setStep] = useState(0);

  const cases = [
    {
      year: el?"2016{年|ねん} {熊本|くまもと}{地震|じしん}":"2016年 熊本地震",
      yearColor: "#f97316",
      icon: "🦁",
      dotBg: "rgba(249,115,22,.15)",
      dotBorder: "#f97316",
      lineBg: "linear-gradient(180deg,#f97316,#ef4444)",
      title: el?"「ライオンが{動物園|どうぶつえん}から{逃|に}げ{出|だ}した」":"「ライオンが動物園から逃げ出した」",
      img: "/images/ep2/fakenews_lion.jpg",
      imgAlt: "ライオン投稿のフェイクニュース",
      body: el?"{熊本|くまもと}{地震|じしん}の{混乱|こんらん}の{中|なか}、「ライオンが{逃|に}げた」という{偽|にせ}の{投稿|とうこう}が{拡散|かくさん}。{実際|じっさい}には{逃|に}げていなかったが、{多|おお}くの{人|ひと}がパニックに。":"熊本地震の混乱の中、「ライオンが逃げた」という偽の投稿が拡散。実際には逃げていなかったが、多くの人がパニックに。",
      result: el?"⚖️ {投稿者|とうこうしゃ}が{偽計業務妨害罪|ぎけいぎょうむぼうがいざい}で{逮捕|たいほ}":"⚖️ 投稿者が偽計業務妨害罪で逮捕",
      resultColor: "#fca5a5",
      resultBg: "rgba(239,68,68,.1)",
      resultBorder: "rgba(239,68,68,.3)",
      source: el?"{出典|しゅってん}：{各報道機関|かくほうどうきかん} 2016{年|ねん}4{月|がつ}":"出典：各報道機関 2016年4月",
    },
    {
      year: el?"2024{年|ねん}1{月|がつ} {能登半島|のとはんとう}{地震|じしん}":"2024年1月 能登半島地震",
      yearColor: "#ef4444",
      icon: "🆘",
      dotBg: "rgba(239,68,68,.15)",
      dotBorder: "#ef4444",
      lineBg: "linear-gradient(180deg,#ef4444,#8b5cf6)",
      title: el?"{虚偽|きょぎ}の{救助|きゅうじょ}{要請|ようせい}・{根拠|こんきょ}のないデマが{拡散|かくさん}":"虚偽の救助要請・根拠のないデマが拡散",
      mapContent: true,
      body: el?"{虚偽|きょぎ}の{救助|きゅうじょ}{要請|ようせい}が{相次|あいつ}ぎ、{警察|けいさつ}が{架空|かくう}の{現場|げんば}に{出動|しゅつどう}。{本物|ほんもの}の{被災者|ひさいしゃ}への{救助|きゅうじょ}が{遅|おく}れた。「{外国人|がいこくじん}が{集結|しゅうけつ}」などの{根拠|こんきょ}のないデマも{拡散|かくさん}し、{被災地|ひさいち}に{不安|ふあん}と{差別|さべつ}が{広|ひろ}がった。":"虚偽の救助要請が相次ぎ、警察が架空の現場に出動。本物の被災者への救助が遅れた。「外国人が集結」などの根拠のないデマも拡散し、被災地に不安と差別が広がった。",
      result: el?"🚨 {本物|ほんもの}の{救助活動|きゅうじょかつどう}が{妨害|ぼうがい}された":"🚨 本物の救助活動が妨害された",
      resultColor: "#fca5a5",
      resultBg: "rgba(239,68,68,.1)",
      resultBorder: "rgba(239,68,68,.3)",
      source: el?"{出典|しゅってん}：{総務省|そうむしょう} {情報通信白書|じょうほうつうしんはくしょ}2024{年|ねん}{版|ばん}":"出典：総務省 情報通信白書2024年版",
    },
    {
      year: el?"2024{年|ねん}〜{現在|げんざい}":"2024年〜現在",
      yearColor: "#8b5cf6",
      icon: "🤖",
      dotBg: "rgba(139,92,246,.15)",
      dotBorder: "#8b5cf6",
      isNew: true,
      title: el?"AI{合成型|ごうせいがた}（ディープフェイク）\n{本物|ほんもの}と{見分|みわ}けがつかない":"AI合成型（ディープフェイク）\n本物と見分けがつかない",
      img: "/images/ep2/fakenews_deepfake.jpg",
      imgAlt: "AI合成型フェイク動画の例",
      body: el?"":"",
      subCards: [
        {
          icon:"🗳️",
          title: el?"{選挙|せんきょ}での{偽|にせ}{動画|どうが}":"選挙での偽動画",
          desc: el?"2024{年|ねん}{衆院選|しゅういんせん}で{政治家|せいじか}のAI{合成|ごうせい}{偽|にせ}{動画|どうが}・{偽|にせ}{画像|がぞう}が{多数|たすう}{拡散|かくさん}。{岸田総理|きしだそうり}（{当時|とうじ}）の{偽|にせ}{動画|どうが}もSNSで{拡散|かくさん}した。":"2024年衆院選で政治家のAI合成偽動画・偽画像が多数拡散。岸田総理（当時）の偽動画もSNSで拡散した。",
        },
        {
          icon:"⚾",
          title: el?"{スポーツ選手|すぽーつせんしゅ}の{偽|にせ}{動画|どうが}":"スポーツ選手の偽動画",
          desc: el?"{日本人|にほんじん}{大リーグ選手|だいりーぐせんしゅ}が{特定|とくてい}{政党|せいとう}への{投票|とうひょう}を{呼|よ}びかける{偽|にせ}{動画|どうが}が{拡散|かくさん}。{本人|ほんにん}は{一切|いっさい}{関係|かんけい}なかった。":"日本人大リーグ選手が特定政党への投票を呼びかける偽動画が拡散。本人は一切関係なかった。",
        },
      ],
      warning: el?"⚠️ 「{動画|どうが}があるから{本物|ほんもの}だ」が{もう通用|もうつうよう}しない\nAIで{声|こえ}も{顔|かお}も{発言|はつげん}も{全|すべ}て{作|つく}れる{時代|じだい}になった":"⚠️ 「動画があるから本物だ」がもう通用しない\nAIで声も顔も発言も全て作れる時代になった",
      source: el?"{出典|しゅってん}：{総務省|そうむしょう}{白書|はくしょ}2024{年|ねん}{版|ばん}・NHK・{時事通信|じじつうしん} 2024{年|ねん}":"出典：総務省白書2024年版・NHK・時事通信 2024年",
      resultColor: "#c4b5fd",
    },
  ];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#1a0d2e,#120920)",padding:"20px 16px 40px",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#fff"}}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(124,58,237,.7)",marginBottom:6}}>
          📋 <RubyText text={el?"{実際|じっさい}の{事例|じれい}":"実際の事例"}/>
        </div>
        <div style={{fontSize:16,fontWeight:900,marginBottom:4,lineHeight:1.5}}>
          <RubyText text={el?"フェイクニュースは{昔|むかし}からあった。\nそして{今|いま}、もっと{巧妙|こうみょう}になっている。":"フェイクニュースは昔からあった。\nそして今、もっと巧妙になっている。"}/>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:20}}>
          <RubyText text={el?"{事例|じれい}を{見|み}る →を{押|お}して{確認|かくにん}しよう":"事例を見る →を押して確認しよう"}/>
        </div>

        {cases.slice(0,step).map((c,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:0,animation:"mamFadeUp .6s ease"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:36}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:c.dotBg,border:`2px solid ${c.dotBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                {c.icon}
              </div>
              {i<cases.slice(0,step).length-1 && (
                <div style={{width:2,flex:1,minHeight:20,margin:"4px 0",borderRadius:2,background:c.lineBg}}/>
              )}
            </div>
            <div style={{flex:1,paddingBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <div style={{display:"inline-block",fontSize:11,fontWeight:900,padding:"2px 10px",borderRadius:99,background:`${c.dotBg}`,color:c.yearColor}}>
                  <RubyText text={c.year}/>
                </div>
                {c.isNew && <span style={{fontSize:9,fontWeight:900,padding:"2px 6px",borderRadius:4,background:"#ef4444",color:"#fff"}}>NEW</span>}
              </div>
              <div style={{fontSize:14,fontWeight:900,marginBottom:8,lineHeight:1.5,whiteSpace:"pre-line"}}>
                <RubyText text={c.title}/>
              </div>

              {c.img && (
                <img src={c.img} alt={c.imgAlt} style={{width:"100%",borderRadius:10,display:"block",marginBottom:8}}/>
              )}

              {c.mapContent && (
                <div style={{position:"relative",height:90,background:"#0d1424",borderRadius:10,overflow:"hidden",marginBottom:8}}>
                  <div style={{position:"absolute",left:"18%",top:"30%",width:"64%",height:1,background:"rgba(255,255,255,.06)"}}/>
                  <div style={{position:"absolute",left:"33%",top:"8%",width:1,height:"84%",background:"rgba(255,255,255,.06)"}}/>
                  {[[20,22],[70,18],[45,66],[15,50],[78,56]].map((p,j)=>(
                    <div key={j} style={{position:"absolute",left:`${p[0]}%`,top:`${p[1]}%`,transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:"50%",background:"rgba(255,67,67,.2)",border:"1.5px solid #ff4343",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#ff6b6b"}}>✕</div>
                  ))}
                  <div style={{position:"absolute",left:"50%",top:"38%",transform:"translate(-50%,-50%)",width:18,height:18,borderRadius:"50%",background:"rgba(255,149,0,.2)",border:"2px solid #ff9500",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#ffb84d"}}>!</div>
                  <div style={{position:"absolute",left:"25%",top:"30%",fontSize:14}}>🚓</div>
                  <div style={{position:"absolute",left:"65%",top:"20%",fontSize:14}}>🚓</div>
                </div>
              )}

              {c.body && (
                <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:8}}>
                  <RubyText text={c.body}/>
                </div>
              )}

              {c.subCards && c.subCards.map((s,j)=>(
                <div key={j} style={{background:"rgba(139,92,246,.08)",border:"0.5px solid rgba(139,92,246,.2)",borderRadius:8,padding:"8px 10px",marginBottom:6,fontSize:11,color:"rgba(255,255,255,.75)",lineHeight:1.6}}>
                  {s.icon} <b style={{color:"#c4b5fd"}}><RubyText text={s.title}/></b><br/>
                  <RubyText text={s.desc}/>
                </div>
              ))}

              {c.warning && (
                <div style={{background:"rgba(239,68,68,.08)",border:"0.5px solid rgba(239,68,68,.2)",borderRadius:8,padding:"8px 10px",marginBottom:8,fontSize:11,color:"#fca5a5",lineHeight:1.6,whiteSpace:"pre-line"}}>
                  <RubyText text={c.warning}/>
                </div>
              )}

              {c.result && (
                <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,padding:"4px 10px",borderRadius:8,marginBottom:8,background:c.resultBg,border:`0.5px solid ${c.resultBorder}`,color:c.resultColor}}>
                  <RubyText text={c.result}/>
                </div>
              )}

              <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>
                <RubyText text={c.source}/>
              </div>
            </div>
          </div>
        ))}

        {step < cases.length ? (
          <button
            onClick={()=>{feedback("tap");setStep(s=>s+1);}}
            style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
            <RubyText text={el
              ? step===0 ? "{事例|じれい}を{見|み}る →" : step<2 ? "{次|つぎ}の{事例|じれい}を{見|み}る →" : "さらに{次|つぎ}の{事例|じれい}を{見|み}る →"
              : step===0 ? "事例を見る →" : step<2 ? "次の事例を見る →" : "さらに次の事例を見る →"
            }/>
          </button>
        ) : (
          <div style={{animation:"mamFadeUp .5s ease"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
              <OwlMolly size={40}/>
              <div style={{background:"#fff",borderRadius:"0 14px 14px 14px",padding:"10px 14px",flex:1}}>
                <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
                  <RubyText text={el
                    ?"フェイクニュースは{昔|むかし}からあった。でも{今|いま}はAIのせいで{本物|ほんもの}と{見分|みわ}けがつかなくなってきている。だからこそ、{見抜|みぬ}く{方法|ほうほう}をしっかり{覚|おぼ}えることが{大事|たいじ}なんだよ。"
                    :"フェイクニュースは昔からあった。でも今はAIのせいで本物と見分けがつかなくなってきている。だからこそ、見抜く方法をしっかり覚えることが大事なんだよ。"
                  }/>
                </div>
              </div>
            </div>
            <button
              onClick={()=>{feedback("tap");onComplete();}}
              style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
              <RubyText text={el?"{次|つぎ}はデマがもたらす{最悪|さいあく}のケースを{見|み}てみる →":"次はデマがもたらす最悪のケースを見てみる →"}/>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function FakeNewsWhyScreen({ el, onComplete }) {
  const [openCard, setOpenCard] = useState(null);
  const [choiceDone, setChoiceDone] = useState(null);
  const [peopleShown, setPeopleShown] = useState(false);
  const [peopleStarted, setPeopleStarted] = useState(false);
  const [lineStep, setLineStep] = useState(0);
  const [openedSet, setOpenedSet] = useState(new Set());

  const cards = [
    { id:1, icon:"😱", label: el?`① {感情|かんじょう}に{訴|うった}える`:"① 感情に訴える" },
    { id:2, icon:"⚡", label: el?`② {緊急性|きんきゅうせい}を{煽|あお}る`:"② 緊急性を煽る" },
    { id:3, icon:"👥", label: el?`③ みんなが{信|しん}じてる`:"③ みんなが信じてる" },
    { id:4, icon:"👨‍👩‍👧", label: el?`④ {身近|みぢか}な{人|ひと}から`:"④ 身近な人から" },
  ];

  const handleOpen = (id) => {
    feedback("tap");
    setOpenCard(prev => prev===id ? null : id);
    setOpenedSet(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const startLine = () => {
    setLineStep(0);
    [400,1200,2400,3400].forEach((d,i)=>{
      setTimeout(()=>setLineStep(i+1), d);
    });
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#1a0d2e,#120920)",padding:"20px 16px 40px",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#fff"}}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(124,58,237,.7)",marginBottom:6}}>
          🧠 <RubyText text={el?"{心理|しんり}の{仕掛|しか}け":"心理の仕掛け"}/>
        </div>
        <div style={{fontSize:17,fontWeight:900,marginBottom:4}}>
          <RubyText text={el?"なぜ{人|ひと}は{信|しん}じてしまうのか？":"なぜ人は信じてしまうのか？"}/>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:16}}>
          <RubyText text={el?"{カード|かーど}をタップして{理由|りゆう}を{確認|かくにん}しよう":"カードをタップして理由を確認しよう"}/>
        </div>

        {/* 4枚のカード */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {cards.map(c=>(
            <div
              key={c.id}
              className={openCard===c.id?"why-card-opened":""}
              onClick={()=>handleOpen(c.id)}
              style={{
                borderRadius:12,
                border:`1px solid ${openCard===c.id?"rgba(124,58,237,.6)":"rgba(124,58,237,.3)"}`,
                background:openCard===c.id?"rgba(124,58,237,.15)":"rgba(124,58,237,.08)",
                padding:"16px 10px",textAlign:"center",cursor:"pointer",
                transition:"all .3s",
              }}>
              <div style={{fontSize:28,marginBottom:6}}>{c.icon}</div>
              <div style={{fontSize:11,fontWeight:900,color:"rgba(255,255,255,.7)"}}>
                <RubyText text={c.label}/>
              </div>
            </div>
          ))}
        </div>

        {/* カード①：感情 */}
        {openCard===1 && (
          <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(124,58,237,.2)",borderRadius:12,padding:14,marginBottom:12,animation:"mamFadeUp .4s ease"}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:4}}>
              <RubyText text={el?"😱 {感情|かんじょう}が{動|うご}くと{確認|かくにん}より{先|さき}にシェアしてしまう":"😱 感情が動くと確認より先にシェアしてしまう"}/>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:12}}>
              <RubyText text={el?"フェイクニュースは「{恐怖|きょうふ}・{怒|いか}り・{驚|おどろ}き」などの{強|つよ}い{感情|かんじょう}を{刺激|しげき}するように{作|つく}られている。{感情|かんじょう}が{動|うご}いた{瞬間|しゅんかん}、{人|ひと}は{確認|かくにん}より{先|さき}に{行動|こうどう}してしまう。":"フェイクニュースは「恐怖・怒り・驚き」などの強い感情を刺激するように作られている。感情が動いた瞬間、人は確認より先に行動してしまう。"}/>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:8}}>
              <RubyText text={el?"{感情|かんじょう}の{種類|しゅるい}と{拡散|かくさん}しやすさ（MITの{研究|けんきゅう}より）":"感情の種類と拡散しやすさ（MITの研究より）"}/>
            </div>
            {[
              {emoji:"😡",label:el?"{怒|いか}り":"怒り",w:"92%",color:"#ef4444",note:el?"{怒|いか}りが一番{拡散|かくさん}する":"怒りが一番拡散する"},
              {emoji:"😱",label:el?"{恐怖|きょうふ}":"恐怖",w:"72%",color:"#f97316"},
              {emoji:"😲",label:el?"{驚|おどろ}き":"驚き",w:"58%",color:"#eab308"},
              {emoji:"😊",label:el?"{喜|よろこ}び":"喜び",w:"22%",color:"rgba(255,255,255,.3)"},
            ].map((b,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:52,fontSize:11,textAlign:"right",color:"rgba(255,255,255,.7)",flexShrink:0}}>
                  {b.emoji} <RubyText text={b.label}/>
                </div>
                <div style={{flex:1,height:18,background:"rgba(255,255,255,.06)",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:b.w,background:b.color,borderRadius:4,display:"flex",alignItems:"center",paddingLeft:6,fontSize:9,color:"#fff",fontWeight:700,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}>
                    {b.note&&<RubyText text={b.note}/>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:6}}>
              <RubyText text={el?"{出典|しゅってん}：MIT Sinan Aral{他|ほか}「The spread of true and false news online」Science 2018{年|ねん}":"出典：MIT Sinan Aral他「The spread of true and false news online」Science 2018年"}/>
            </div>
          </div>
        )}

        {/* カード②：緊急性 */}
        {openCard===2 && (
          <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(124,58,237,.2)",borderRadius:12,padding:14,marginBottom:12,animation:"mamFadeUp .4s ease"}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:4}}>
              <RubyText text={el?"⚡ 「{今|いま}すぐ！」で{冷静|れいせい}さを{奪|うば}う":"⚡ 「今すぐ！」で冷静さを奪う"}/>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:12}}>
              <RubyText text={el?"「{今|いま}すぐ{避難|ひなん}！」「{急|いそ}いでシェアして！」という{言葉|ことば}が、{考|かんが}える{時間|じかん}を{奪|うば}ってしまう。":"「今すぐ避難！」「急いでシェアして！」という言葉が、考える時間を奪ってしまう。"}/>
            </div>

            {/* スライダー */}
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:8,textAlign:"center"}}>
                <RubyText text={el?"{同|おな}じ{内容|ないよう}なのに{言葉|ことば}の「{温度感|おんどかん}」が{違|ちが}うだけで{印象|いんしょう}が{変|か}わったよね。スライダーを{動|うご}かして{比|くら}べてみよう。":"同じ内容なのに言葉の「温度感」が違うだけで印象が変わったよね。スライダーを動かして比べてみよう。"}/>
              </div>
              <div style={{position:"relative",height:140,borderRadius:12,overflow:"hidden",marginBottom:10,cursor:"ew-resize"}}
                id="sliderWrap2"
                onMouseDown={(e)=>{
                  const move=(ev)=>{
                    const r=document.getElementById('sliderWrap2').getBoundingClientRect();
                    const pct=Math.max(5,Math.min(95,(ev.clientX-r.left)/r.width*100));
                    document.getElementById('sliderDiv2').style.left=pct+'%';
                    document.getElementById('sliderClip2').style.width=(100-pct)+'%';
                  };
                  const up=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',up);};
                  document.addEventListener('mousemove',move);
                  document.addEventListener('mouseup',up);
                }}
                onTouchStart={(e)=>{
                  const move=(ev)=>{
                    const r=document.getElementById('sliderWrap2').getBoundingClientRect();
                    const pct=Math.max(5,Math.min(95,(ev.touches[0].clientX-r.left)/r.width*100));
                    document.getElementById('sliderDiv2').style.left=pct+'%';
                    document.getElementById('sliderClip2').style.width=(100-pct)+'%';
                  };
                  const up=()=>{document.removeEventListener('touchmove',move);document.removeEventListener('touchend',up);};
                  document.addEventListener('touchmove',move);
                  document.addEventListener('touchend',up);
                }}>
                {/* 本物 */}
                <div style={{position:"absolute",inset:0,background:"rgba(30,41,59,.8)",border:"1px solid rgba(59,130,246,.3)",borderRadius:12,padding:12,zIndex:1}}>
                  <div style={{fontSize:10,fontWeight:900,color:"#93c5fd",marginBottom:6}}>📰 <RubyText text={el?"{本物|ほんもの}のニュース":"本物のニュース"}/></div>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",lineHeight:1.5,marginBottom:4}}>
                    <RubyText text={el?"{警察庁|けいさつちょう}、{詐欺|さぎ}{被害|ひがい}の{増加|ぞうか}を{発表|はっぴょう}。{前年比|ぜんねんひ}2{倍以上|ばいいじょう}に{急増|きゅうぞう}":"警察庁、詐欺被害の増加を発表。前年比2倍以上に急増"}/>
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>
                    <RubyText text={el?"{警察庁|けいさつちょう} 2024{年|ねん}6{月|がつ}14{日|にち}":"警察庁 2024年6月14日"}/>
                  </div>
                </div>
                {/* フェイク */}
                <div id="sliderClip2" style={{position:"absolute",top:0,right:0,bottom:0,width:"50%",overflow:"hidden",zIndex:2,pointerEvents:"none"}}>
                  <div style={{position:"absolute",top:0,right:0,bottom:0,width:"100vw",maxWidth:440,background:"rgba(50,10,10,.85)",border:"1px solid rgba(255,67,67,.3)",borderRadius:12,padding:12}}>
                    <div style={{fontSize:10,fontWeight:900,color:"#fca5a5",marginBottom:6}}>🚨 <RubyText text={el?"フェイクニュース{版|ばん}":"フェイクニュース版"}/></div>
                    <div style={{fontSize:12,fontWeight:700,color:"#fca5a5",lineHeight:1.5,marginBottom:4}}>
                      <RubyText text={el?"【{緊急速報|きんきゅうそくほう}】{詐欺|さぎ}{被害|ひがい}が{爆増中|ばくぞうちゅう}！！あなたの{家族|かぞく}も{狙|ねら}われてる！{今|いま}すぐ{確認|かくにん}！":"【緊急速報】詐欺被害が爆増中！！あなたの家族も狙われてる！今すぐ確認！"}/>
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,100,100,.5)"}}>
                      <RubyText text={el?"{出典|しゅってん}：なし　{発信者|はっしんしゃ}：{不明|ふめい}":"出典：なし　発信者：不明"}/>
                    </div>
                  </div>
                </div>
                {/* 仕切り */}
                <div id="sliderDiv2" style={{position:"absolute",top:0,bottom:0,left:"50%",width:3,background:"#fff",boxShadow:"0 0 8px rgba(255,255,255,.6)",zIndex:10,cursor:"ew-resize"}}>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:28,height:28,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}>⇔</div>
                </div>
                <div style={{position:"absolute",top:8,left:8,fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:99,background:"rgba(59,130,246,.25)",color:"#93c5fd",zIndex:5}}>
                  <RubyText text={el?"{本物|ほんもの}":"本物"}/>
                </div>
                <div style={{position:"absolute",top:8,right:8,fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:99,background:"rgba(255,67,67,.25)",color:"#fca5a5",zIndex:11}}>
                  <RubyText text={el?"フェイク":"フェイク"}/>
                </div>
              </div>
              <div style={{background:"rgba(255,169,64,.06)",border:"0.5px solid rgba(255,169,64,.2)",borderRadius:10,padding:10,marginBottom:10,fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7}}>
                🦉 <RubyText text={el?"「{緊急|きんきゅう}！」「{爆増|ばくぞう}！」「{今|いま}すぐ！」という{言葉|ことば}が{冷静|れいせい}な{判断|はんだん}を{奪|うば}ってしまう。こういう{言葉|ことば}を{見|み}たら{一度|いちど}{立|た}ち{止|と}まるクセをつけよう。":"「緊急！」「爆増！」「今すぐ！」という言葉が冷静な判断を奪ってしまう。こういう言葉を見たら一度立ち止まるクセをつけよう。"}/>
              </div>
            </div>

            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:8}}>
              <RubyText text={el?"{出典|しゅってん}：MIT「フェイクニュースの{目新|めあたら}しさ（novelty）」{分析|ぶんせき} Science 2018{年|ねん}":"出典：MIT「フェイクニュースの目新しさ（novelty）」分析 Science 2018年"}/>
            </div>
          </div>
        )}

        {/* カード③：みんな */}
        {openCard===3 && (
          <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(124,58,237,.2)",borderRadius:12,padding:14,marginBottom:12,animation:"mamFadeUp .4s ease"}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:4}}>
              <RubyText text={el?"👥 {周|まわ}りが{信|しん}じると{自分|じぶん}も{信|しん}じてしまう":"👥 周りが信じると自分も信じてしまう"}/>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:10}}>
              <RubyText text={el?"RT{数|すう}・いいね{数|すう}が{増|ふ}えるほど「みんなが{正|ただ}しいと{思|おも}っているから{本物|ほんもの}だ」という{錯覚|さっかく}が{起|お}きる（エコーチェンバー{効果|こうか}）。":"RT数・いいね数が増えるほど「みんなが正しいと思っているから本物だ」という錯覚が起きる（エコーチェンバー効果）。"}/>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:8}}>
              <RubyText text={el?"デマを{信|しん}じる{人|ひと}が{増|ふ}えると…":"デマを信じる人が増えると…"}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,padding:8,background:"rgba(255,255,255,.03)",borderRadius:10,minHeight:60,marginBottom:8}}>
              {Array.from({length:20}).map((_,i)=>(
                <span key={i} style={{
                  fontSize:20,
                  transition:"filter .4s, color .4s",
                  opacity:peopleStarted?1:0,
                  filter:peopleStarted && i<15?"sepia(1) saturate(3) hue-rotate(260deg)":"none",
                }}>👤</span>
              ))}
            </div>
            <button onClick={()=>{feedback("tap");setPeopleStarted(true);}}
              style={{width:"100%",padding:8,borderRadius:8,border:"none",background:"rgba(124,58,237,.2)",color:"#a78bfa",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
              ▶ <RubyText text={el?"アニメを{見|み}る":"アニメを見る"}/>
            </button>
            <div style={{display:"flex",gap:12,fontSize:11,marginBottom:10}}>
              <span style={{color:"rgba(255,255,255,.5)"}}>👤 <RubyText text={el?"{まだ信|しん}じていない":"まだ信じていない"}/></span>
              <span style={{color:"#a78bfa"}}>👤 <RubyText text={el?"{信|しん}じてしまった":"信じてしまった"}/></span>
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>
              <RubyText text={el?"{出典|しゅってん}：{名古屋大学|なごやだいがく} {笹原|ささはら}{和俊|かずとし}{教授|きょうじゅ}「エコーチェンバー{効果|こうか}」の{研究|けんきゅう}":"出典：名古屋大学 笹原和俊教授「エコーチェンバー効果」の研究"}/>
            </div>
          </div>
        )}

        {/* カード④：身近な人 */}
        {openCard===4 && (
          <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(124,58,237,.2)",borderRadius:12,padding:14,marginBottom:12,animation:"mamFadeUp .4s ease"}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:4}}>
              <RubyText text={el?"👨‍👩‍👧 {友達|ともだち}・{家族|かぞく}からだと{信|しん}じてしまう":"👨‍👩‍👧 友達・家族からだと信じてしまう"}/>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.7,marginBottom:10}}>
              <RubyText text={el?"{知|し}らない{人|ひと}からの{情報|じょうほう}は{疑|うたが}えても、{友達|ともだち}や{家族|かぞく}から{届|とど}いた{情報|じょうほう}は「{信頼|しんらい}できる{人|ひと}からだから{本物|ほんもの}だろう」と{思|おも}ってしまいがち。":"知らない人からの情報は疑えても、友達や家族から届いた情報は「信頼できる人からだから本物だろう」と思ってしまいがち。"}/>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:8}}>
              <RubyText text={el?"{友達|ともだち}からこんなメッセージが{届|とど}いたら？":"友達からこんなメッセージが届いたら？"}/>
            </div>
            <div style={{background:"#1a2a1a",borderRadius:12,padding:10,display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
              {lineStep>=1 && (
                <div style={{display:"flex",alignItems:"flex-end",gap:6,animation:"mamFadeUp .4s ease"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"#4ade80",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>👦</div>
                  <div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:3}}>
                      <RubyText text={el?"{仲良|なかよ}しの{友達|ともだち}":"仲良しの友達"}/>
                    </div>
                    <div style={{background:"#fff",borderRadius:"0 12px 12px 12px",padding:"8px 10px",fontSize:11,color:"#1a1a1a",maxWidth:"80%",lineHeight:1.6}}>
                      <RubyText text={el?"ねえ{見|み}た？これやばくない？{早|はや}く{拡散|かくさん}して！🚨":"ねえ見た？これやばくない？早く拡散して！🚨"}/>
                    </div>
                  </div>
                </div>
              )}
              {lineStep>=2 && (
                <div style={{display:"flex",alignItems:"flex-end",gap:6,animation:"mamFadeUp .4s ease"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"#4ade80",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>👦</div>
                  <div style={{background:"#fffde7",borderRadius:"0 12px 12px 12px",padding:"8px 10px",fontSize:10,color:"#1a1a1a",maxWidth:"80%",lineHeight:1.6,border:"1px solid #f0c040"}}>
                    <RubyText text={el?"【{速報|そくほう}】○○{市|し}の{水道水|すいどうすい}から{危険物質|きけんぶっしつ}が{検出|けんしゅつ}された{可能性|かのうせい}があります。{今|いま}すぐペットボトルの{水|みず}を{準備|じゅんび}して！":"【速報】○○市の水道水から危険物質が検出された可能性があります。今すぐペットボトルの水を準備して！"}/>
                  </div>
                </div>
              )}
              {lineStep>=3 && (
                <div style={{display:"flex",justifyContent:"flex-end",animation:"mamFadeUp .4s ease"}}>
                  <div style={{background:"#4ade80",borderRadius:"12px 0 12px 12px",padding:"8px 10px",fontSize:11,color:"#1a1a1a",maxWidth:"80%",lineHeight:1.6}}>
                    <RubyText text={el?"え、{本当|ほんとう}に！？お{母|かあ}さんに{教|おし}えなきゃ！":"え、本当に！？お母さんに教えなきゃ！"}/>
                  </div>
                </div>
              )}
              {lineStep>=4 && (
                <div style={{background:"rgba(255,67,67,.1)",border:"0.5px solid rgba(255,67,67,.3)",borderRadius:10,padding:"8px 10px",fontSize:11,color:"#ff9999",lineHeight:1.6,animation:"mamFadeUp .4s ease"}}>
                  <RubyText text={el?"⚠️ でもこれはフェイクニュースでした。{信頼|しんらい}できる{人|ひと}からでも、{内容|ないよう}の{確認|かくにん}が{必要|ひつよう}です。":"⚠️ でもこれはフェイクニュースでした。信頼できる人からでも、内容の確認が必要です。"}/>
                </div>
              )}
            </div>
            <button onClick={startLine}
              style={{width:"100%",padding:8,borderRadius:8,border:"none",background:"rgba(74,222,128,.15)",color:"#4ade80",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
              ▶ <RubyText text={el?"{再生|さいせい}する":"再生する"}/>
            </button>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>
              <RubyText text={el?"{出典|しゅってん}：{国際大学|こくさいだいがく}GLOCOM {山口|やまぐち}{真一|しんいち}{准教授|じゅんきょうじゅ}「フェイクニュース{拡散|かくさん}{手段|しゅだん}の{研究|けんきゅう}」2022{年|ねん}":"出典：国際大学GLOCOM 山口真一准教授「フェイクニュース拡散手段の研究」2022年"}/>
            </div>
          </div>
        )}

        {/* モリィまとめ＋次へ */}
        {openedSet.size >= 4 && (
          <div style={{animation:"mamFadeUp .5s ease"}}>
            <div style={{background:"rgba(124,58,237,.1)",border:"0.5px solid rgba(124,58,237,.3)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:900,color:"#a78bfa",marginBottom:5}}>🦉 <RubyText text={el?"モリィのまとめ":"モリィのまとめ"}/></div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.7}}>
                <RubyText text={el?"これは{全部|ぜんぶ}、{人間|にんげん}の{自然|しぜん}な{心|こころ}の{働|はたら}き。「{自分|じぶん}は{騙|だま}されない」と{思|おも}っている{人|ひと}ほど、{実|じつ}は{危|あぶ}ない。{次|つぎ}は{実際|じっさい}の{事例|じれい}を{見|み}てみよう。":"これは全部、人間の自然な心の働き。「自分は騙されない」と思っている人ほど、実は危ない。次は実際の事例を見てみよう。"}/>
              </div>
            </div>
            <button
              onClick={()=>{feedback("tap");onComplete();}}
              style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
              <RubyText text={el?"{実際|じっさい}の{事例|じれい}を{見|み}る →":"実際の事例を見る →"}/>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function FakeNewsCompareScreen({ el, onComplete }) {
  const [fStep, setFStep] = useState(0);
  const [rStep, setRStep] = useState(0);
  const [phase, setPhase] = useState("fake"); // "fake" | "real"

  const fakePoints = [
    {
      hlTarget: "badge",
      badgeOn: true,
      title: el?"{発信者|はっしんしゃ}が{不明|ふめい}・{認証|にんしょう}なし":"発信者が不明・認証なし",
      desc: el?"{誰|だれ}が{書|か}いたか{分|わ}からないアカウント。{公式|こうしき}{機関|きかん}は{必|かなら}ず{名前|なまえ}を{明記|めいき}する":"誰が書いたか分からないアカウント。公式機関は必ず名前を明記する",
    },
    {
      hlTarget: "hashtag",
      title: el?"「{拡散|かくさん}{希望|きぼう}」は{要注意|ようちゅうい}サイン":"「拡散希望」は要注意サイン",
      desc: el?"{本物|ほんもの}の{緊急|きんきゅう}{情報|じょうほう}が「{拡散|かくさん}{希望|きぼう}」と{書|か}くことはほぼない":"本物の緊急情報が「拡散希望」と書くことはほぼない",
    },
    {
      hlTarget: "rt",
      title: el?"RTが{いいね数|すう}より{多|おお}いのは{不自然|ふしぜん}":"RTがいいね数より多いのは不自然",
      desc: el?"92,100RT vs 48,200{いいね}。{読|よ}まずにシェアされている{証拠|しょうこ}":"92,100RT vs 48,200いいね。読まずにシェアされている証拠",
    },
  ];

  const realPoints = [
    {
      hlTarget: "name",
      title: el?"{発信者|はっしんしゃ}が{明確|めいかく}":"発信者が明確",
      desc: el?"「NHKニュース」という{実在|じつざい}するメディア{名|めい}が{明記|めいき}されている":"「NHKニュース」という実在するメディア名が明記されている",
    },
    {
      hlTarget: "badge",
      title: el?"バッジだけでは{判断|はんだん}しない":"バッジだけでは判断しない",
      desc: el?"{認証|にんしょう}バッジは{有料|ゆうりょう}で{取得可能|しゅとくかのう}。{発信者名|はっしんしゃめい}・リンク{先|さき}も{合|あ}わせて{確認|かくにん}する":"認証バッジは有料で取得可能。発信者名・リンク先も合わせて確認する",
    },
    {
      hlTarget: "date",
      title: el?"{機関名|きかんめい}と{日付|ひづけ}が{明記|めいき}":"機関名と日付が明記",
      desc: el?"「{警察庁|けいさつちょう}は14{日|にち}」← {誰|だれ}が・いつ{発表|はっぴょう}したかが{具体的|ぐたいてき}":"「警察庁は14日」← 誰が・いつ発表したかが具体的",
    },
    {
      hlTarget: "number",
      title: el?"{具体的|ぐたいてき}な{数字|すうじ}・{根拠|こんきょ}がある":"具体的な数字・根拠がある",
      desc: el?"「{前年比|ぜんねんひ}2{倍以上|ばいいじょう}」← {曖昧|あいまい}でなく{根拠|こんきょ}のある{数字|すうじ}":"「前年比2倍以上」← 曖昧でなく根拠のある数字",
    },
  ];

  const isFakeHL = (target) => {
    if(target==="badge") return fStep>=1;
    if(target==="hashtag") return fStep>=2;
    if(target==="rt") return fStep>=3;
    return false;
  };
  const isRealHL = (target) => {
    if(target==="name") return rStep>=1;
    if(target==="badge") return rStep>=2;
    if(target==="date") return rStep>=3;
    if(target==="number") return rStep>=4;
    return false;
  };

  const hlStyleF = {background:"rgba(255,67,67,.3)",borderBottom:"2px solid #ff4343",color:"#ffaaaa",padding:"0 2px",borderRadius:3};
  const hlStyleR = {background:"rgba(34,197,94,.25)",borderBottom:"2px solid #22c55e",color:"#86efac",padding:"0 2px",borderRadius:3};
  const numBadge = (n,color) => ({
    display:"inline-flex",alignItems:"center",justifyContent:"center",
    width:18,height:18,borderRadius:"50%",
    background:color,color:"#fff",
    fontSize:10,fontWeight:900,
    verticalAlign:"middle",marginLeft:4,flexShrink:0,
  });

  const sectionStyle = {
    minHeight:"100vh",
    background:"linear-gradient(180deg,#1a0d2e,#120920)",
    padding:"20px 16px 40px",
    fontFamily:"'Zen Maru Gothic',sans-serif",
    color:"#fff",
  };

  if(phase==="fake") return (
    <div style={sectionStyle}>
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <div style={{fontSize:11,fontWeight:900,color:"rgba(239,68,68,.7)",marginBottom:6}}>
          <RubyText text={el?"❌ これはフェイクニュースだった":"❌ これはフェイクニュースだった"}/>
        </div>
        <div style={{fontSize:15,fontWeight:900,marginBottom:14}}>
          <RubyText text={el?"{直感|ちょっかん}で{判定|はんてい}した{投稿|とうこう}を{振|ふ}り{返|かえ}ろう":"直感で判定した投稿を振り返ろう"}/>
        </div>

        {/* 投稿カード */}
        <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,border:"0.5px solid rgba(255,67,67,.3)",overflow:"hidden",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px 6px"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,100,100,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:900,color:"#fff"}}>緊急速報_bot</div>
              <div style={{display:"inline-flex",alignItems:"center"}}>
                <span style={{
                  fontSize:9,padding:"2px 8px",borderRadius:99,
                  ...(isFakeHL("badge")?{background:"rgba(255,67,67,.25)",color:"#ff6b6b"}:{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)"}),
                  transition:"all .4s",
                }}>
                  <RubyText text={el?"{認証|にんしょう}なし":"認証なし"}/>
                </span>
                {fStep>=1 && <span style={{...numBadge(1,"#ff4343"),marginLeft:6}}>①</span>}
              </div>
            </div>
          </div>
          <div style={{padding:"4px 12px 8px",fontSize:12,color:"rgba(255,255,255,.85)",lineHeight:2}}>
            <RubyText text={el?"【{緊急|きんきゅう}】○○{市|し}で{大規模|だいきぼ}{地震|じしん}{発生|はっせい}！マグニチュード7.8。{今|いま}すぐ{高台|たかだい}へ{避難|ひなん}してください。":"【緊急】○○市で大規模地震発生！マグニチュード7.8。今すぐ高台へ避難してください。"}/>
            {" "}
            <span style={{...(isFakeHL("hashtag")?hlStyleF:{}),transition:"all .4s"}}>
              <RubyText text={el?"#緊急 #{拡散|かくさん}{希望|きぼう}":"#緊急 #拡散希望"}/>
            </span>
            {fStep>=2 && <span style={{...numBadge(2,"#ff4343"),marginLeft:4}}>②</span>}
          </div>
          <img
            src="/images/ep2/post1.jpg"
            alt="フェイクニュース投稿の例"
            style={{width:"100%",height:120,objectFit:"cover",display:"block"}}
          />
          <div style={{padding:"6px 12px 10px",display:"flex",gap:12,fontSize:11,color:"rgba(255,255,255,.4)"}}>
            <span>❤ 48,200</span>
            <span style={{...(isFakeHL("rt")?{color:"#ff6b6b",fontWeight:900}:{}),transition:"all .4s"}}>
              🔁 92,100
              {fStep>=3 && <span style={{...numBadge(3,"#ff4343"),marginLeft:4}}>③</span>}
            </span>
            <span>💬 3,400</span>
          </div>
        </div>

        {/* 解説ポイント */}
        {fakePoints.slice(0,fStep).map((p,i)=>(
          <div key={i} style={{
            display:"flex",alignItems:"flex-start",gap:8,
            padding:"8px 10px",borderRadius:8,marginBottom:6,
            background:"rgba(255,67,67,.08)",border:"0.5px solid rgba(255,67,67,.2)",
            animation:"mamFadeUp .4s ease",
          }}>
            <span style={{color:"#ff6b6b",fontWeight:900,flexShrink:0}}>{"①②③"[i]}</span>
            <div>
              <div style={{fontSize:12,fontWeight:900,color:"#ffaaaa"}}><RubyText text={p.title}/></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}><RubyText text={p.desc}/></div>
            </div>
          </div>
        ))}

        <button
          onClick={()=>{
            feedback("tap");
            if(fStep<3){setFStep(s=>s+1);}
            else{setPhase("real");}
          }}
          style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
          {fStep===0
            ? <RubyText text={el?"{解説|かいせつ}を{見|み}る 🔍":"解説を見る 🔍"}/>
            : fStep<3
              ? <RubyText text={el?"{次|つぎ}へ →":"次へ →"}/>
              : <RubyText text={el?"{本物|ほんもの}と{比|くら}べてみる →":"本物と比べてみる →"}/>
          }
        </button>
      </div>
    </div>
  );

  return (
    <div style={sectionStyle}>
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <div style={{fontSize:11,fontWeight:900,color:"rgba(34,197,94,.7)",marginBottom:6}}>
          ✅ <RubyText text={el?"これは{本物|ほんもの}のニュースだった":"これは本物のニュースだった"}/>
        </div>
        <div style={{fontSize:15,fontWeight:900,marginBottom:14}}>
          <RubyText text={el?"{何|なに}が「{信頼|しんらい}できる」のか{確認|かくにん}しよう":"何が「信頼できる」のか確認しよう"}/>
        </div>

        {/* 本物投稿カード */}
        <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,border:"0.5px solid rgba(34,197,94,.3)",overflow:"hidden",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px 6px"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(34,197,94,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏛️</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",gap:4}}>
                <span style={{...(isRealHL("name")?hlStyleR:{}),transition:"all .4s"}}>NHKニュース</span>
                {rStep>=1 && <span style={numBadge(1,"#22c55e")}>①</span>}
              </div>
              <div style={{display:"inline-flex",alignItems:"center"}}>
                <span style={{
                  fontSize:9,padding:"2px 8px",borderRadius:99,
                  ...(isRealHL("badge")?{background:"rgba(34,197,94,.2)",color:"#4ade80"}:{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)"}),
                  transition:"all .4s",
                }}>✓ <RubyText text={el?"{公式|こうしき}{確認済|かくにんず}み":"公式確認済み"}/></span>
                {rStep>=2 && <span style={{...numBadge(2,"#22c55e"),marginLeft:6}}>②</span>}
              </div>
            </div>
          </div>
          <div style={{padding:"4px 12px 8px",fontSize:12,color:"rgba(255,255,255,.85)",lineHeight:2}}>
            <span style={{...(isRealHL("date")?hlStyleR:{}),transition:"all .4s"}}>
              <RubyText text={el?"{警察庁|けいさつちょう}は14{日|にち}":"警察庁は14日"}/>
            </span>
            {rStep>=3 && <span style={numBadge(3,"#22c55e")}>③</span>}
            <RubyText text={el?"、SNS{型|がた}{詐欺|さぎ}の{被害|ひがい}が{今年|ことし}に{入|はい}り":"、SNS型詐欺の被害が今年に入り"}/>
            {" "}
            <span style={{...(isRealHL("number")?hlStyleR:{}),transition:"all .4s"}}>
              <RubyText text={el?"{前年比|ぜんねんひ}2{倍以上|ばいいじょう}":"前年比2倍以上"}/>
            </span>
            {rStep>=4 && <span style={numBadge(4,"#22c55e")}>④</span>}
            <RubyText text={el?"に{急増|きゅうぞう}していると{発表|はっぴょう}…":"に急増していると発表…"}/>
          </div>
          <img
            src="/images/ep2/post4.jpg"
            alt="本物のニュース投稿の例"
            style={{width:"100%",height:120,objectFit:"cover",display:"block"}}
          />
          <div style={{padding:"6px 12px 10px",display:"flex",gap:12,fontSize:11,color:"rgba(255,255,255,.4)"}}>
            <span>❤ 12,400</span><span>🔁 8,200</span><span>💬 1,100</span>
          </div>
        </div>

        {/* 解説ポイント */}
        {realPoints.slice(0,rStep).map((p,i)=>(
          <div key={i} style={{
            display:"flex",alignItems:"flex-start",gap:8,
            padding:"8px 10px",borderRadius:8,marginBottom:6,
            background:"rgba(34,197,94,.08)",border:"0.5px solid rgba(34,197,94,.2)",
            animation:"mamFadeUp .4s ease",
          }}>
            <span style={{color:"#4ade80",fontWeight:900,flexShrink:0}}>{"①②③④"[i]}</span>
            <div>
              <div style={{fontSize:12,fontWeight:900,color:"#86efac"}}><RubyText text={p.title}/></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)"}}><RubyText text={p.desc}/></div>
            </div>
          </div>
        ))}

        {rStep===4 && (
          <div style={{background:"rgba(124,58,237,.1)",border:"0.5px solid rgba(124,58,237,.3)",borderRadius:12,padding:"12px 14px",marginBottom:10,animation:"mamFadeUp .5s ease"}}>
            <div style={{fontSize:12,fontWeight:900,color:"#a78bfa",marginBottom:5}}>🦉 <RubyText text={el?"モリィのまとめ":"モリィのまとめ"}/></div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.7}}>
              <RubyText text={el
                ?"「{誰|だれ}が・いつ・{根拠|こんきょ}は{何|なに}か」が{明確|めいかく}かどうかが{見分|みわ}けるカギ。{次|つぎ}は{実際|じっさい}に{見抜|みぬ}く{方法|ほうほう}を{学|まな}ぼう！"
                :"「誰が・いつ・根拠は何か」が明確かどうかが見分けるカギ。次は実際に見抜く方法を学ぼう！"
              }/>
            </div>
          </div>
        )}

        <button
          onClick={()=>{
            feedback("tap");
            if(rStep<4){setRStep(s=>s+1);}
            else{onComplete();}
          }}
          style={{width:"100%",padding:14,borderRadius:12,border:"none",
            background:rStep===4?"linear-gradient(135deg,#059669,#047857)":"linear-gradient(135deg,#7c3aed,#4f46e5)",
            color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
          {rStep===0
            ? <RubyText text={el?"{本物|ほんもの}のポイントを{見|み}る ✅":"本物のポイントを見る ✅"}/>
            : rStep<4
              ? <RubyText text={el?"{次|つぎ}へ →":"次へ →"}/>
              : <RubyText text={el?"{次|つぎ}へ →":"次へ →"}/>
          }
        </button>
      </div>
    </div>
  );
}

function FakeNewsLearnPage({ onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [screen, setScreen] = useState("1a");

  // 画面1-A：定義・データ・ライオン画像・4つの理由
  if (screen === "1a") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"24px 20px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
    }}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(124,58,237,.7)",letterSpacing:".05em",marginBottom:6}}>
          📰 <RubyText text={el?"フェイクニュースって{何|なに}だろう？":"フェイクニュースって何だろう？"}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,marginBottom:16,lineHeight:1.5}}>
          <RubyText text={el?"フェイクニュースって\n{何|なに}だろう？":"フェイクニュースって\n何だろう？"}/>
        </div>

        {/* 定義カード */}
        <div style={{background:"rgba(255,255,255,.06)",border:"0.5px solid rgba(255,255,255,.15)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontSize:11,color:"rgba(124,58,237,.8)",marginBottom:6,fontWeight:900}}>
            <RubyText text={el?"フェイクニュースとは":"フェイクニュースとは"}/>
          </div>
          <div style={{fontSize:14,fontWeight:900,color:"#fff",lineHeight:1.7}}>
            <RubyText text={el
              ?"SNSや{Web|ウェブ}サイトに\nわざと{公開|こうかい}された\n{本当|ほんとう}ではない{記事|きじ}のこと"
              :"SNSやウェブサイトに\nわざと公開された\n本当ではない記事のこと"
            }/>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:6}}>
            <RubyText text={el
              ?"{出典|しゅってん}：{総務省|そうむしょう}「{情報通信白書|じょうほうつうしんはくしょ} for Kids」"
              :"出典：総務省「情報通信白書 for Kids」"
            }/>
          </div>
        </div>

        {/* データカード */}
        <div style={{background:"rgba(124,58,237,.12)",border:"1px solid rgba(124,58,237,.3)",borderRadius:12,padding:"12px 14px",marginBottom:12,textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:900,color:"#a78bfa"}}>
            <RubyText text={el?"{約|やく}80%":"約80%"}/>
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:4,lineHeight:1.6}}>
            <RubyText text={el
              ?"の{人|ひと}がフェイクニュースを{見|み}ても\n{偽物|にせもの}だと{気|き}づかない"
              :"の人がフェイクニュースを見ても\n偽物だと気づかない"
            }/>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:6}}>
            <RubyText text={el
              ?"{出典|しゅってん}：{国際大学|こくさいだいがく}GLOCOM 2021{年|ねん}{調査|ちょうさ}（n=5,991{名|めい}）"
              :"出典：国際大学GLOCOM 2021年調査（n=5,991名）"
            }/>
          </div>
        </div>

        {/* ライオン画像 */}
        <img
          src="/images/ep2/fakenews_lion.jpg"
          alt="ライオン投稿のフェイクニュース例"
          style={{width:"100%",borderRadius:10,display:"block",marginBottom:6}}
        />
        <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginBottom:14,textAlign:"center"}}>
          <RubyText text={el
            ?"{一見|いっけん}{普通|ふつう}のSNS{投稿|とうこう}…でもこれはデマでした"
            :"一見普通のSNS投稿…でもこれはデマでした"
          }/>
        </div>

        {/* モリィ：なぜ作られるか */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
          <OwlMolly size={40}/>
          <div style={{background:"#fff",borderRadius:"0 14px 14px 14px",padding:"10px 14px",flex:1,border:"1.5px solid rgba(124,58,237,.2)"}}>
            <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
              <RubyText text={el
                ?"なんでこんなものを{作|つく}るの？\n{理由|りゆう}を{調|しら}べてみたよ。"
                :"なんでこんなものを作るの？\n理由を調べてみたよ。"
              }/>
            </div>
          </div>
        </div>

        {[
          {icon:"💰",key:el?"{お金|おかね}{目的|もくてき}":  "お金目的",val:el?"{話題|わだい}になるほど{広告|こうこく}でお{金|かね}が{稼|かせ}げる":"話題になるほど広告でお金が稼げる",color:"#fbbf24",
            evidence:el?"{話題|わだい}になるほど{広告|こうこく}が{表示|ひょうじ}されお{金|かね}が{入|はい}る「アテンションエコノミー」という{仕組|しく}みがある。{本当|ほんとう}かどうかより「{話題|わだい}になるかどうか」が{収入|しゅうにゅう}になる。":"話題になるほど広告が表示されお金が入る「アテンションエコノミー」という仕組みがある。本当かどうかより「話題になるかどうか」が収入になる。",
            source:el?"{出典|しゅってん}：{総務省|そうむしょう}「プラットフォームサービスに{関|かん}する{研究会|けんきゅうかい}」{資料|しりょう}":"出典：総務省「プラットフォームサービスに関する研究会」資料"},
          {icon:"😈",key:"面白半分",val:el?"{世間|せけん}が{騒|さわ}ぐのを{見|み}て{楽|たの}しんでいる":"世間が騒ぐのを見て楽しんでいる",color:"#f87171",
            evidence:el?"{熊本|くまもと}{地震|じしん}「ライオンが{逃|に}げた」デマの{投稿者|とうこうしゃ}は「ウケると{思|おも}った」と{話|はな}していた。{世間|せけん}が{騒|さわ}ぐのを{見|み}て{楽|たの}しむ{心理|しんり}が{背景|はいけい}にある。":"熊本地震「ライオンが逃げた」デマの投稿者は「ウケると思った」と話していた。世間が騒ぐのを見て楽しむ心理が背景にある。",
            source:el?"{出典|しゅってん}：{各|かく}{報道機関|ほうどうきかん} 2016{年|ねん}4{月|がつ}":"出典：各報道機関 2016年4月"},
          {icon:"🎯",key:el?"{誰|だれ}かを{攻撃|こうげき}したい":"誰かを攻撃したい",val:el?"{特定|とくてい}の{人|ひと}・{会社|かいしゃ}の{評判|ひょうばん}を{落|お}とそうとしている":"特定の人・会社の評判を落とそうとしている",color:"#fb923c",
            evidence:el?"2024{年|ねん}{自民党|じみんとう}{総裁選|そうさいせん}で{候補者|こうほしゃ}を{標的|ひょうてき}にした{偽情報|にせじょうほう}が{拡散|かくさん}。すべて{日本|にほん}ファクトチェックセンターが「{誤|あやま}り」と{判定|はんてい}した。":"2024年自民党総裁選で候補者を標的にした偽情報が拡散。すべて日本ファクトチェックセンターが「誤り」と判定した。",
            source:el?"{出典|しゅってん}：{日本|にほん}ファクトチェックセンター 2024{年|ねん}":"出典：日本ファクトチェックセンター 2024年"},
          {icon:"🗳️",key:el?"{世論|せろん}を{操作|そうさ}したい":"世論を操作したい",val:el?"{選挙|せんきょ}や{政治|せいじ}を{自分|じぶん}に{有利|ゆうり}に{動|うご}かそうとしている":"選挙や政治を自分に有利に動かそうとしている",color:"#a78bfa",
            evidence:el?"2024{年|ねん}{兵庫県|ひょうごけん}{知事選|ちじせん}で{大量|たいりょう}のフェイクが{飛|と}び{交|か}い{選挙|せんきょ}{結果|けっか}にも{大|おお}きな{影響|えいきょう}を{与|あた}えたと{言|い}われている。":"2024年兵庫県知事選で大量のフェイクが飛び交い選挙結果にも大きな影響を与えたと言われている。",
            source:el?"{出典|しゅってん}：{日本|にほん}ファクトチェックセンター 2025{年|ねん}":"出典：日本ファクトチェックセンター 2025年"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 10px",borderRadius:8,background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.1)",marginBottom:6}}>
            <span style={{fontSize:16}}>{r.icon}</span>
            <div>
              <div style={{fontSize:12,fontWeight:900,color:r.color}}><RubyText text={r.key}/></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.65)"}}><RubyText text={r.val}/></div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginTop:6}}><RubyText text={r.evidence}/></div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:4}}><RubyText text={r.source}/></div>
            </div>
          </div>
        ))}

        <button
          onClick={()=>{feedback("tap");setScreen("1b");}}
          style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit",marginTop:10}}>
          次へ →
        </button>
      </div>
    </div>
  );

  // 画面1-B：クリックベイト
  if (screen === "1b") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#1a0d2e,#120920)",padding:"24px 20px 40px",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#fff"}}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(124,58,237,.7)",letterSpacing:".05em",marginBottom:6}}>
          📰 <RubyText text={el?"フェイクニュースって{何|なに}だろう？":"フェイクニュースって何だろう？"}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,marginBottom:14,lineHeight:1.5}}>
          <RubyText text={el?"{最近|さいきん}{多|おお}い「クリックベイト」\nという{手口|てぐち}":"最近多い「クリックベイト」\nという手口"}/>
        </div>

        <img
          src="/images/ep2/fakenews_clickbait.jpg"
          alt="クリックベイト型フェイクニュースの例"
          style={{width:"100%",borderRadius:10,display:"block",marginBottom:6}}
        />
        <div style={{fontSize:11,color:"rgba(255,255,255,.45)",marginBottom:14,textAlign:"center"}}>
          <RubyText text={el
            ?"これは「クリックベイト」と{呼|よ}ばれる{手口|てぐち}です"
            :"これは「クリックベイト」と呼ばれる手口です"
          }/>
        </div>

        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
          <OwlMolly size={40}/>
          <div style={{background:"#fff",borderRadius:"0 14px 14px 14px",padding:"10px 14px",flex:1}}>
            <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
              <RubyText text={el
                ?"{最近|さいきん}{多|おお}いのが「クリックベイト」。\n\nクリックベイトとは、{思|おも}わずタップしたくなるような{衝撃的|しょうげきてき}な{見出|みだ}しをつけておいて、{実際|じっさい}に{読|よ}んでみると{中身|なかみ}は{全然|ぜんぜん}{違|ちが}う…という{手口|てぐち}のことだよ。\n\nほとんどの{人|ひと}は{見出|みだ}しだけ{見|み}てシェアしてしまうから、センセーショナルな{見出|みだ}しだけがどんどん{広|ひろ}まっていくんだ。"
                :"最近多いのが「クリックベイト」。\n\nクリックベイトとは、思わずタップしたくなるような衝撃的な見出しをつけておいて、実際に読んでみると中身は全然違う…という手口のことだよ。\n\nほとんどの人は見出しだけ見てシェアしてしまうから、センセーショナルな見出しだけがどんどん広まっていくんだ。"
              }/>
            </div>
          </div>
        </div>

        <div style={{background:"rgba(239,68,68,.08)",border:"0.5px solid rgba(239,68,68,.25)",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:900,color:"#f87171",marginBottom:8}}>
            <RubyText text={el?"クリックベイトの{特徴|とくちょう}":"クリックベイトの特徴"}/>
          </div>
          {[
            el?"⚠️ {見出|みだ}しだけ{衝撃的|しょうげきてき}・{中身|なかみ}は{全然|ぜんぜん}{違|ちが}う":"⚠️ 見出しだけ衝撃的・中身は全然違う",
            el?"⚠️ {普通|ふつう}のニュースそっくりで{見分|みわ}けにくい":"⚠️ 普通のニュースそっくりで見分けにくい",
            el?"⚠️ {見出|みだ}しだけがSNSで{拡散|かくさん}されていく":"⚠️ 見出しだけがSNSで拡散されていく",
          ].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:12,color:"rgba(255,255,255,.8)",marginBottom:i<2?6:0}}>
              <RubyText text={t}/>
            </div>
          ))}
        </div>

        <button
          onClick={()=>{feedback("tap");setScreen("2");}}
          style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
          <RubyText text={el?"{比|くら}べてみよう →":"比べてみよう →"}/>
        </button>
      </div>
    </div>
  );

  // 画面2：フェイクvs本物の比較（ステップ式ハイライト）
  if (screen === "2") return (
    <FakeNewsCompareScreen
      el={el}
      onComplete={()=>{feedback("tap");setScreen("3");}}
    />
  );

  // 画面3：なぜ人は信じてしまうのか
  if (screen === "3") return (
    <FakeNewsWhyScreen
      el={el}
      onComplete={()=>{feedback("tap");setScreen("4");}}
    />
  );

  // 画面4：実際の事例
  if (screen === "4") return (
    <FakeNewsCasesScreen
      el={el}
      onComplete={()=>{feedback("tap");onComplete();}}
    />
  );

  return null;
}

function SummaryPage({ onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";

  const cards = [
    {
      icon: "📱",
      color: "#6366f1",
      bg: "rgba(99,102,241,.1)",
      border: "rgba(99,102,241,.15)",
      title: el ? "フェイクニュースとは" : "フェイクニュースとは",
      desc: el
        ? "わざと{作|つく}られた{本当|ほんとう}ではない{記事|きじ}。クリックベイトやAI{合成|ごうせい}など{手口|てぐち}は{巧妙化|こうみょうか}している。"
        : "わざと作られた本当ではない記事。クリックベイトやAI合成など手口は巧妙化している。",
    },
    {
      icon: "😱",
      color: "#f97316",
      bg: "rgba(249,115,22,.1)",
      border: "rgba(249,115,22,.15)",
      title: el ? "なぜ{人|ひと}は{信|しん}じてしまうのか" : "なぜ人は信じてしまうのか",
      desc: el
        ? "{感情|かんじょう}・{緊急性|きんきゅうせい}・{同調|どうちょう}・{身近|みぢか}な{人|ひと}からのシェア。これらが{冷静|れいせい}な{判断|はんだん}を{奪|うば}ってしまう。"
        : "感情・緊急性・同調・身近な人からのシェア。これらが冷静な判断を奪ってしまう。",
    },
    {
      icon: "🗺️",
      color: "#ef4444",
      bg: "rgba(239,68,68,.1)",
      border: "rgba(239,68,68,.15)",
      title: el ? "デマが{広|ひろ}がると" : "デマが広がると",
      desc: el
        ? "{警察|けいさつ}が{振|ふ}り{回|まわ}されて{本物|ほんもの}の{救助|きゅうじょ}が{遅|おく}れる。{熊本|くまもと}・{能登|のと}で{実際|じっさい}に{起|お}きたこと。"
        : "警察が振り回されて本物の救助が遅れる。熊本・能登で実際に起きたこと。",
    },
    {
      icon: "✅",
      color: "#10b981",
      bg: "rgba(16,185,129,.1)",
      border: "rgba(16,185,129,.15)",
      title: el ? "シェアする{前|まえ}に" : "シェアする前に",
      desc: el
        ? "{感情|かんじょう}・{発信者|はっしんしゃ}・{検索|けんさく}・AI{確認|かくにん}・シェアしない。5つのステップで{自分|じぶん}を{守|まも}れる。"
        : "感情・発信者・検索・AI確認・シェアしない。5つのステップで自分を守れる。",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#f0f4ff,#e8f0fe)",
      padding: "28px 20px 40px",
      fontFamily: "'Zen Maru Gothic',sans-serif",
    }}>
      <div style={{maxWidth: 440, margin: "0 auto"}}>

        {/* ヘッダー */}
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:40,marginBottom:8}}>📝</div>
          <div style={{fontSize:11,fontWeight:900,color:"#6366f1",letterSpacing:".05em",marginBottom:4}}>
            <RubyText text={el?"まとめ":"まとめ"}/>
          </div>
          <div style={{fontSize:20,fontWeight:900,color:"#1e1b4b",lineHeight:1.4}}>
            <RubyText text={el?"{今日|きょう}{学|まな}んだこと":"今日学んだこと"}/>
          </div>
        </div>

        {/* カード4枚 */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {cards.map((c,i)=>(
            <div key={i} style={{
              background:"#fff",
              border:`1px solid ${c.border}`,
              borderRadius:14,
              padding:"14px 16px",
              display:"flex",
              alignItems:"flex-start",
              gap:12,
              animation:`mamFadeUp .5s ${i*0.2}s ease both`,
            }}>
              <div style={{
                width:40,height:40,borderRadius:10,
                background:c.bg,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:20,flexShrink:0,
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:900,color:"#1e1b4b",marginBottom:3}}>
                  <RubyText text={c.title}/>
                </div>
                <div style={{fontSize:11,color:"#6b7280",lineHeight:1.6}}>
                  <RubyText text={c.desc}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* モリィのセリフ */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:20}}>
          <OwlMolly size={44}/>
          <div style={{
            background:"#fff",
            borderRadius:"0 14px 14px 14px",
            padding:"10px 14px",
            border:"1px solid rgba(99,102,241,.15)",
          }}>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.8}}>
              <RubyText text={el
                ?"たくさん{学|まな}んだね！{最後|さいご}におうちの{人|ひと}と{話|はな}し{合|あ}ってみよう。"
                :"たくさん学んだね！最後におうちの人と話し合ってみよう。"
              }/>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <button
          onClick={()=>{feedback("tap");onComplete();}}
          style={{
            width:"100%",
            padding:16,
            borderRadius:14,
            border:"none",
            background:"linear-gradient(135deg,#6366f1,#4f46e5)",
            color:"#fff",
            fontSize:15,
            fontWeight:900,
            cursor:"pointer",
            fontFamily:"inherit",
          }}>
          <RubyText text={el?"おうちの{人|ひと}と{話|はな}す →":"おうちの人と話す →"}/>
        </button>

      </div>
    </div>
  );
}

function ChecklistPage({ onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [checked, setChecked] = useState(new Set());

  const steps = [
    {
      icon: "😱",
      title: el ? "{感情|かんじょう}が{動|うご}いたら一度{止|と}まる" : "感情が動いたら一度止まる",
      desc: el
        ? "「{怖|こわ}い・{驚|おどろ}き・{怒|いか}り」を{感|かん}じたらシェアの{前|まえ}に3{秒|びょう}{待|ま}とう。それがフェイクのサインかもしれない。"
        : "「怖い・驚き・怒り」を感じたらシェアの前に3秒待とう。それがフェイクのサインかもしれない。",
      color: "#f97316",
    },
    {
      icon: "👤",
      title: el ? "{発信者|はっしんしゃ}と{日付|ひづけ}を{確認|かくにん}する" : "発信者と日付を確認する",
      desc: el
        ? "{公式|こうしき}{機関名|きかんめい}と{日付|ひづけ}が{明記|めいき}されているか{確認|かくにん}。「{緊急速報|きんきゅうそくほう}_bot」のような{名前|なまえ}が{不明|ふめい}なアカウントは{要注意|ようちゅうい}。"
        : "公式機関名と日付が明記されているか確認。「緊急速報_bot」のような名前が不明なアカウントは要注意。",
      color: "#8b5cf6",
    },
    {
      icon: "🔍",
      title: el ? "{他|ほか}のメディアでも{検索|けんさく}する" : "他のメディアでも検索する",
      desc: el
        ? "{本物|ほんもの}の{情報|じょうほう}は{複数|ふくすう}のメディアが{報|ほう}じる。NHKやGoogleで{同|おな}じニュースを{検索|けんさく}してみよう。"
        : "本物の情報は複数のメディアが報じる。NHKやGoogleで同じニュースを検索してみよう。",
      color: "#3b82f6",
    },
    {
      icon: "🤖",
      title: el ? "{画像|がぞう}・{動画|どうが}はAIかもしれない" : "画像・動画はAIかもしれない",
      desc: el
        ? "{手|て}・{指|ゆび}の{本数|ほんすう}がおかしくない？{背景|はいけい}の{文字|もじ}が{崩|くず}れていない？{動画|どうが}なら{口|くち}と{声|こえ}がズレていない？まばたきが{少|すく}なすぎない？{透|す}かしがあればAI{確定|かくてい}。なくてもAIの{可能性|かのうせい}はある。"
        : "手・指の本数がおかしくない？背景の文字が崩れていない？動画なら口と声がズレていない？まばたきが少なすぎない？透かしがあればAI確定。なくてもAIの可能性はある。",
      color: "#ec4899",
      source: el
        ? "{出典|しゅってん}：{日本|にほん}ファクトチェックセンター"
        : "出典：日本ファクトチェックセンター",
    },
    {
      icon: "🚫",
      title: el ? "{確認|かくにん}できなければシェアしない" : "確認できなければシェアしない",
      desc: el
        ? "「シェアしない」は{正解|せいかい}の{選択肢|せんたくし}。{確認|かくにん}できるまで{待|ま}つだけでデマの{拡散|かくさん}を{止|と}められる。あなた一{人|り}の{判断|はんだん}が{変化|へんか}を{生|う}む。"
        : "「シェアしない」は正解の選択肢。確認できるまで待つだけでデマの拡散を止められる。あなた一人の判断が変化を生む。",
      color: "#10b981",
    },
  ];

  const handleCheck = (i) => {
    feedback("tap");
    setChecked(prev => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  const allChecked = checked.size >= steps.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#1a0d2e,#120920)",
      padding: "24px 20px 40px",
      fontFamily: "'Zen Maru Gothic',sans-serif",
      color: "#fff",
    }}>
      <div style={{maxWidth: 440, margin: "0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(124,58,237,.7)",marginBottom:6}}>
          ✅ <RubyText text={el?"シェアする{前|まえ}にやること":"シェアする前にやること"}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,marginBottom:4}}>
          <RubyText text={el?"シェアする{前|まえ}に\nやること5{箇条|かじょう}":"シェアする前に\nやること5箇条"}/>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:20}}>
          <RubyText text={el?"「{分|わ}かった！」を{押|お}して{確認|かくにん}しよう":"「分かった！」を押して確認しよう"}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {steps.map((s,i) => (
            <div key={i} style={{
              background: checked.has(i)
                ? `rgba(${s.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')}, .08)`
                : "rgba(255,255,255,.04)",
              border: `0.5px solid ${checked.has(i) ? s.color + "55" : "rgba(255,255,255,.1)"}`,
              borderRadius: 12,
              padding: "12px 14px",
              transition: "all .4s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: checked.has(i) ? "#22c55e" : "rgba(255,255,255,.08)",
                  border: `1.5px solid ${checked.has(i) ? "#22c55e" : "rgba(255,255,255,.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: checked.has(i) ? 14 : 12,
                  flexShrink: 0,
                  transition: "all .4s",
                }}>
                  {checked.has(i) ? "✅" : <span style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:900}}>{"STEP"+(i+1)}</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:900,color: checked.has(i) ? "#fff" : "rgba(255,255,255,.9)"}}>
                    {s.icon} <RubyText text={s.title}/>
                  </div>
                </div>
                {!checked.has(i) && (
                  <button
                    onClick={() => handleCheck(i)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "rgba(124,58,237,.25)",
                      color: "#a78bfa",
                      fontSize: 11,
                      fontWeight: 900,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}>
                    <RubyText text={el?"{分|わ}かった！":"分かった！"}/>
                  </button>
                )}
              </div>

              {checked.has(i) && (
                <div style={{
                  marginTop: 8,
                  paddingLeft: 38,
                  animation: "mamFadeUp .4s ease",
                }}>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.75)",lineHeight:1.7}}>
                    <RubyText text={s.desc}/>
                  </div>
                  {s.source && (
                    <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:4}}>
                      <RubyText text={s.source}/>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {allChecked && (
          <div style={{animation:"mamFadeUp .5s ease"}}>
            <div style={{
              background:"rgba(34,197,94,.1)",
              border:"0.5px solid rgba(34,197,94,.3)",
              borderRadius:12,
              padding:"12px 14px",
              marginBottom:14,
              textAlign:"center",
            }}>
              <div style={{fontSize:20,marginBottom:6}}>🎉</div>
              <div style={{fontSize:14,fontWeight:900,color:"#4ade80",marginBottom:4}}>
                <RubyText text={el?"5つ{全部|ぜんぶ}チェックできた！":"5つ全部チェックできた！"}/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.6}}>
                <RubyText text={el?"{次|つぎ}から{使|つか}えるフェイクを{見抜|みぬ}く5ステップだよ！":"次から使えるフェイクを見抜く5ステップだよ！"}/>
              </div>
            </div>
            <button
              onClick={onComplete}
              style={{
                width:"100%",
                padding:16,
                borderRadius:14,
                border:"none",
                background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
                color:"#fff",
                fontSize:15,
                fontWeight:900,
                cursor:"pointer",
                fontFamily:"inherit",
              }}>
              <RubyText text={el?"{次|つぎ}へ →":"次へ →"}/>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function Episode2({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro"); // intro|swipe|judge|spread|checklist|dialogue|complete
  const [postIdx, setPostIdx] = useState(0);
  const [verdicts, setVerdicts] = useState({}); // {postId: "real"|"fake"}
  const [showResult, setShowResult] = useState(false);
  const [foundPoints, setFoundPoints] = useState({});
  const [pointDetail, setPointDetail] = useState(null);
  const [spreadStep, setSpreadStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);
  const [swipeScore, setSwipeScore] = useState({ total: 0, correct: 0 });

  const post = FAKE_POSTS[postIdx];
  const userVerdict = verdicts[post?.id];
  const isCorrect = userVerdict === post?.verdict;
  const allFound = (foundPoints[post?.id] || []).length >= post?.dangerPoints.length;
  const totalCorrect = FAKE_POSTS.filter(p => verdicts[p.id] === p.verdict).length;

  const handleVerdict = (v) => {
    setVerdicts(prev => ({ ...prev, [post.id]: v }));
    setShowResult(true);
    if (v === post.verdict) feedback("correct"); else feedback("wrong");
  };

  const handlePointTap = (pt) => {
    setPointDetail(pt);
    const cur = foundPoints[post.id] || [];
    if (!cur.includes(pt.label)) setFoundPoints(prev => ({ ...prev, [post.id]: [...cur, pt.label] }));
  };

  const nextPost = () => {
    setShowResult(false);
    setPointDetail(null);
    if (postIdx < FAKE_POSTS.length - 1) setPostIdx(postIdx + 1);
    else setPhase("spread");
  };

  const spreadData = ageMode === "elementary" ? [
    { time: "0{分|ふん}", rts: 0, label: "あなたがRTした" },
    { time: "10{分|ふん}", rts: 240, label: "フォロワーが{拡散|かくさん}" },
    { time: "1{時間|じかん}", rts: 8400, label: "トレンド{入|い}り" },
    { time: "3{時間|じかん}", rts: 92000, label: "{全国|ぜんこく}{拡散|かくさん}・パニック" },
    { time: "{翌日|よくじつ}", rts: 0, label: "{訂正|ていせい}{記事|きじ}が{出|で}るも{手遅|ておく}れ" },
  ] : [
    { time: "0分", rts: 0, label: "あなたがRTした" },
    { time: "10分", rts: 240, label: "フォロワーが拡散" },
    { time: "1時間", rts: 8400, label: "トレンド入り" },
    { time: "3時間", rts: 92000, label: "全国拡散・パニック" },
    { time: "翌日", rts: 0, label: "訂正記事が出るも手遅れ" },
  ];

  const checklist = ageMode === "elementary" ? [
    { icon: "👤", title: "{誰|だれ}が{発信|はっしん}しているか", desc: "{公式|こうしき}{機関|きかん}・{認証|にんしょう}{済|す}みアカウントか？{個人|こじん}が{運営|うんえい}するbotではないか？" },
    { icon: "📅", title: "いつの{情報|じょうほう}か", desc: "{古|ふる}い{情報|じょうほう}を{新|あたら}しいことのように{使|つか}い{回|まわ}していないか？{日付|ひづけ}を{確認|かくにん}する。" },
    { icon: "🔗", title: "{一次|いちじ}{情報源|じょうほうげん}があるか", desc: "{公式|こうしき}サイトや{大手|おおて}メディアで{同|おな}じ{情報|じょうほう}が{出|で}ているか{検索|けんさく}して{確認|かくにん}する。" },
    { icon: "🖼️", title: "{写真|しゃしん}・{動画|どうが}の{出典|しゅってん}は", desc: "Googleレンズで{逆検索|ぎゃくけんさく}。{別|べつ}の{事件|じけん}・{別|べつ}の{国|くに}の{映像|えいぞう}を{使|つか}い{回|まわ}していないか。" },
    { icon: "💭", title: "{感情|かんじょう}を{煽|あお}っていないか", desc: "「{拡散|かくさん}{希望|きぼう}」「{今|いま}すぐ」「{衝撃|しょうげき}」など{焦|あせ}りや{怒|いか}りを{刺激|しげき}する{言葉|ことば}に{注意|ちゅうい}。" },
  ] : [
    { icon: "👤", title: "誰が発信しているか", desc: "公式機関・認証済みアカウントか？個人が運営するbotではないか？" },
    { icon: "📅", title: "いつの情報か", desc: "古い情報を新しいことのように使い回していないか？日付を確認する。" },
    { icon: "🔗", title: "一次情報源があるか", desc: "公式サイトや大手メディアで同じ情報が出ているか検索して確認する。" },
    { icon: "🖼️", title: "写真・動画の出典は", desc: "Googleレンズで逆検索。別の事件・別の国の映像を使い回していないか。" },
    { icon: "💭", title: "感情を煽っていないか", desc: "「拡散希望」「今すぐ」「衝撃」など焦りや怒りを刺激する言葉に注意。" },
  ];

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep2" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top, #0f0a2e 0%, #07041a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: "#a78bfa", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.6 + 0.1, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />
      ))}
      <div style={{ fontSize: 72, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔎</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 02</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}><RubyText text={ageMode === "elementary" ? "フェイクニュースを{見抜|みぬ}け" : "フェイクニュースを見抜け"} /></h1>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: 12, margin: "0 0 26px", textAlign: "center", lineHeight: 1.7 }}>— マモル: SNSリテラシーアドベンチャー —</p>
      <div style={{ background: "rgba(167,139,250,.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#e0d9ff", fontSize: 13, lineHeight: 1.9, marginBottom: 28 }}>
        {ageMode === "elementary" ? (
          <><RubyText text="SNSには" /><strong style={{ color: "#a78bfa" }}><RubyText text="{本物|ほんもの}と{偽物|にせもの}の{情報|じょうほう}" /></strong><RubyText text="が{混|ま}ざっています。" /><br /><br />
          <RubyText text="4つの{投稿|とうこう}を{見|み}て「{本物|ほんもの}か・フェイクか」を{見分|みわ}ける" /><strong style={{ color: "#a78bfa" }}><RubyText text="{情報|じょうほう}{鑑定|かんてい}{士|し}" /></strong><RubyText text="になろう。" /></>
        ) : (
          <>SNSには<strong style={{ color: "#a78bfa" }}>本物と偽物の情報</strong>が混ざっています。<br /><br />
          4つの投稿を見て「本物か・フェイクか」を見分ける<strong style={{ color: "#a78bfa" }}>情報鑑定士</strong>になろう。</>
        )}
      </div>
      <OwlSay mood="happy" e="AIが{作|つく}ったにせの{画像|がぞう}も{増|ふ}えてるよ。だまされないようにしようね🦉">生成AIが作った偽画像も増えてるよ。騙されないようにしようね🦉</OwlSay>
      <button onClick={() => setPhase("swipe")} style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,.4)", marginTop: 8 }}><RubyText text={ageMode === "elementary" ? "{鑑定|かんてい}スタート 🔎" : "鑑定スタート 🔎"} /></button>
    </div>
    </EpisodeShell>
  );

  // 各投稿のビジュアルイメージ（スクリーンショット風）
  const POST_IMAGES = {
    1: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6, background: "linear-gradient(180deg,#1a0000,#3d0000)" }}>
        <div style={{ animation: "shake .3s infinite", fontSize: 32 }}>🚨</div>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 18, color: "#ff4343", fontWeight: 900, letterSpacing: ".1em", animation: "blink .6s infinite" }}>緊急地震速報</div>
        <div style={{ fontSize: 11, color: "#fca5a5", textAlign: "center", lineHeight: 1.5 }}>○○市 / マグニチュード7.8<br />震度6強</div>
        <div style={{ background: "rgba(255,67,67,.2)", border: "1px solid rgba(255,67,67,.5)", borderRadius: 8, padding: "4px 12px", fontSize: 10, color: "#fca5a5", animation: "pulse 1s infinite" }}>#拡散希望 #緊急</div>
      </div>
    ),
    2: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6, background: "linear-gradient(180deg,#1a0a00,#3d2000)" }}>
        <div style={{ fontSize: 28 }}>📰</div>
        <div style={{ background: "#ff8c00", color: "#fff", padding: "2px 10px", fontSize: 9, fontWeight: 900, borderRadius: 4, letterSpacing: ".05em" }}>独自入手情報</div>
        <div style={{ fontSize: 14, color: "#fff", fontWeight: 900, textAlign: "center", lineHeight: 1.4 }}>有名芸能人○○<br />詐欺で逮捕か!?</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>関係者「口を閉ざす」</div>
        <div style={{ fontSize: 9, color: "rgba(255,140,0,.6)", marginTop: 2 }}>※出典・認証バッジなし</div>
      </div>
    ),
    3: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6, background: "linear-gradient(180deg,#0a0a2e,#1a1a4e)" }}>
        <div style={{ fontSize: 30 }}>🌍</div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 900, textAlign: "center", lineHeight: 1.5 }}>子どもたちが<br />危険にさらされています</div>
        <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "4px 10px", fontSize: 9, color: "rgba(255,255,255,.5)", textAlign: "center" }}>📷 写真の日時・場所は？<br />出典が記載されていない</div>
        <div style={{ fontSize: 9, color: "#f87171", animation: "blink 1.2s infinite" }}>今すぐシェアして！</div>
      </div>
    ),
    4: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6, background: "linear-gradient(180deg,#0a1628,#0d2142)" }}>
        <div style={{ background: "#1d4ed8", borderRadius: 6, padding: "3px 10px", fontSize: 9, fontWeight: 900, color: "#fff", letterSpacing: ".05em" }}>NHK NEWS WEB</div>
        <div style={{ fontSize: 22, color: "#fff", fontWeight: 900, textAlign: "center", lineHeight: 1.4 }}>SNS詐欺<br />前年比 <span style={{ color: "#60a5fa" }}>2倍以上</span></div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
          {[30, 50, 72, 100].map((h, i) => (
            <div key={i} style={{ width: 12, height: `${h}%`, background: i === 3 ? "#ef4444" : "#3b82f6", borderRadius: "2px 2px 0 0", opacity: .8 }} />
          ))}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)" }}>警察庁発表 / 2025年</div>
      </div>
    ),
  };

  // ── Swipe ── （⑤ SwipeJudgeミニゲーム）
  if (phase === "swipe") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".2em", marginBottom: 6 }}>QUICK JUDGE MODE</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "まず{直感|ちょっかん}で{判定|はんてい}してみよう" : "まず直感で判定してみよう"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6, lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "「✅ {本物|ほんもの}」か「❌ フェイク」を{素早|すばや}く{選|えら}ぼう" : "「✅ 本物」か「❌ フェイク」を素早く選ぼう"} /></p>
        </div>
        <OwlSay mood="excited" e="{理由|りゆう}はあとで{教|おし}えるから、{今|いま}は{直感|ちょっかん}だけで{判断|はんだん}してみて！🦉">理由は後で教えるから、今は直感だけで判断してみて！🦉</OwlSay>
        <SwipeJudge
          posts={FAKE_POSTS}
          accentColor="#7c3aed"
          onComplete={(total, correct) => {
            setSwipeScore({ total, correct });
            // verdictsを完全スキップして spread へ
            setPhase("spread");
          }}
        />
      </div>
    </div>
  );

  // ── Judge ──
  if (phase === "judge") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(167,139,250,.1)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(167,139,250,.2)" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".1em" }}>FACT CHECK</div>
          <div style={{ fontSize: 12, color: "#c4b5fd" }}>{postIdx + 1} / {FAKE_POSTS.length}</div>
        </div>

        {!showResult && <OwlSay mood="worried" e="この{投稿|とうこう}、{本物|ほんもの}？フェイク？まず{直感|ちょっかん}で{判断|はんだん}してみよう。">この投稿、<strong style={{ color: "#a78bfa" }}>本物？フェイク？</strong>まず直感で判断してみよう。</OwlSay>}

        {/* Fake SNS post card */}
        <div style={{ background: "#0d1117", borderRadius: 18, padding: 16, marginBottom: 14, border: `1px solid ${post.accountColor}30`, boxShadow: `0 8px 32px rgba(0,0,0,.5)` }}>
          {/* Account header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${post.accountColor}22`, border: `2px solid ${post.accountColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{post.accountIcon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 900, fontSize: 14, color: "#fff" }}>{post.account}</span>
                {post.verified && <span style={{ background: "#1d9bf0", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span>}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{post.time}</div>
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,.3)" }}>⋯</div>
          </div>

          {/* Post text */}
          {post.id === 2 ? (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, margin: "0 0 12px" }}>
              {"【衝撃】有名芸能人○○さんが詐欺で逮捕されたと警視庁が発表。本人のSNSアカウントも"}
              <span style={{ background: "rgba(255,200,0,.2)", color: "#ffd700", padding: "0 2px", borderRadius: 3 }}>突然削除</span>
              {"。関係者は"}
              <span style={{ background: "rgba(255,200,0,.2)", color: "#ffd700", padding: "0 2px", borderRadius: 3 }}>口を閉ざす</span>
              {"…"}
            </p>
          ) : post.id === 4 ? (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, margin: "0 0 12px" }}>
              {"【注意】"}
              <span style={{ background: "rgba(34,197,94,.15)", color: "#4ade80", padding: "0 2px", borderRadius: 3 }}>警察庁は14日</span>
              {"、SNS型詐欺の被害が今年に入り"}
              <span style={{ background: "rgba(34,197,94,.15)", color: "#4ade80", padding: "0 2px", borderRadius: 3 }}>前年比2倍以上</span>
              {"に急増していると発表しました。「フォロワーを増やせる」「副業で月10万円」などの勧誘DM・投稿に注意するよう呼びかけています。▶詳細はNHKウェブニュースへ"}
            </p>
          ) : (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, margin: "0 0 12px" }}>{post.text}</p>
          )}

          {/* Photo */}
          <div style={{ position: "relative", background: post.photoBg, borderRadius: 12, height: 140, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
            {POST_IMAGES[post.id] || <div style={{ fontSize: 48, opacity: 0.4 }}>{post.photoIcon}</div>}
            {/* Scan line */}
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#a78bfa,transparent)", animation: "scanDown 3s linear infinite", opacity: 0.5 }} />
            {/* Tappable danger points — shown only after verdict */}
            {showResult && post.dangerPoints.map((pt, i) => {
              const found = (foundPoints[post.id] || []).includes(pt.label);
              const isRealPost = post.verdict === "real";
              return (
                <button key={i} onClick={() => handlePointTap(pt)}
                  style={{ position: "absolute", left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%,-50%)", width: 42, height: 42, borderRadius: "50%", border: `2px ${found ? "solid" : "dashed"} ${isRealPost ? "#22c55e" : "#a78bfa"}`, background: found ? (isRealPost ? "rgba(34,197,94,.8)" : "rgba(167,139,250,.8)") : "rgba(255,255,255,.15)", backdropFilter: "blur(4px)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", animation: found ? "none" : "pulse 2s infinite" }}>
                  {found ? "✓" : "?"}
                </button>
              );
            })}
          </div>

          {/* 実際の投稿画像 */}
          {post.image && (
            <img
              src={post.image}
              alt=""
              style={{
                width: "100%",
                borderRadius: 10,
                display: "block",
                marginBottom: 10,
                objectFit: "cover",
                maxHeight: 180,
              }}
            />
          )}

          {/* 投稿3：出典不明ラベル */}
          {post.id === 3 && (
            <div style={{
              background: "rgba(255,67,67,.1)",
              border: "0.5px solid rgba(255,67,67,.3)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 11,
              color: "#ff6b6b",
              display: "flex",
              gap: 10,
              marginBottom: 8,
            }}>
              <span>📅 日付：不明</span>
              <span>📍 場所：不明</span>
              <span>🔗 出典：なし</span>
            </div>
          )}

          {/* Engagement stats */}
          {post.id === 1 ? (
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
              <span>❤️ {post.likes.toLocaleString()}</span>
              <div>
                <div><span style={{ color: "#ff6b6b" }}>🔁 {post.rts.toLocaleString()} ⚠️</span></div>
                <div style={{ fontSize: 10, color: "#ff6b6b" }}>RTがいいね数より多いのは不自然</div>
              </div>
              <span>💬 {post.replies.toLocaleString()}</span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
              <span>❤️ {post.likes.toLocaleString()}</span>
              <span>🔁 {post.rts.toLocaleString()}</span>
              <span>💬 {post.replies.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Verdict buttons */}
        {!showResult && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <button onClick={() => handleVerdict("real")}
              style={{ padding: "16px 12px", background: "rgba(34,197,94,.1)", border: "2px solid rgba(34,197,94,.4)", borderRadius: 14, color: "#86efac", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              <RubyText text={ageMode === "elementary" ? "✅ {本物|ほんもの}" : "✅ 本物"} />
            </button>
            <button onClick={() => handleVerdict("fake")}
              style={{ padding: "16px 12px", background: "rgba(239,68,68,.1)", border: "2px solid rgba(239,68,68,.4)", borderRadius: 14, color: "#fca5a5", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              <RubyText text={ageMode === "elementary" ? "❌ {偽物|にせもの}" : "❌ 偽物"} />
            </button>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div style={{ animation: "slideUp .4s ease" }}>
            {/* Correct/Wrong banner */}
            <div style={{ background: isCorrect ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 6, animation: isCorrect ? "celebrate .6s ease" : "shake .4s ease" }}>{isCorrect ? "🎉" : "😢"}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: isCorrect ? "#86efac" : "#fca5a5", marginBottom: 6 }}>
                {isCorrect ? (ageMode === "elementary" ? <RubyText text="{正解|せいかい}！" /> : "正解！") : (ageMode === "elementary" ? <RubyText text="はずれ…" /> : "はずれ…")}
              </div>
              <div style={{ fontSize: 12, color: isCorrect ? "#86efac" : "#fca5a5", marginBottom: 4, fontWeight: 700 }}>
                <RubyText text={ageMode === "elementary"
                  ? (post.verdict === "fake" ? "この{投稿|とうこう}は「{偽物|にせもの}」でした" : "この{投稿|とうこう}は「{本物|ほんもの}」でした")
                  : (post.verdict === "fake" ? "この投稿は「偽物」でした" : "この投稿は「本物」でした")} />
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? (post.elWhyFake || post.whyFake) : post.whyFake} /></div>
            </div>

            {/* Find danger points */}
            <div style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 700, marginBottom: 6 }}>
                <RubyText text={post.verdict === "real" ? (ageMode === "elementary" ? "✅ {信頼|しんらい}できるポイントをタップ" : "✅ 信頼できるポイントをタップ") : (ageMode === "elementary" ? "⚠️ {危険|きけん}なポイントをタップして{見|み}つけよう" : "⚠️ 危険なポイントをタップして見つけよう")} />
                　<span style={{ color: "rgba(255,255,255,.4)" }}>{(foundPoints[post.id] || []).length}/{post.dangerPoints.length}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}><RubyText text={ageMode === "elementary" ? "{写真|しゃしん}の{中|なか}の「?」をタップ" : "写真の中の「?」をタップ"} /></div>
            </div>

            {/* Check method */}
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 4 }}><RubyText text={ageMode === "elementary" ? "💡 {確認|かくにん}{方法|ほうほう}" : "💡 確認方法"} /></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? (post.elCheckMethod || post.checkMethod) : post.checkMethod} /></div>
            </div>

            <button onClick={nextPost}
              style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(124,58,237,.35)", animation: "popIn .4s ease" }}>
              <RubyText text={postIdx < FAKE_POSTS.length - 1 ? (ageMode === "elementary" ? "{次|つぎ}の{投稿|とうこう}を{鑑定|かんてい}する →" : "次の投稿を鑑定する →") : (ageMode === "elementary" ? "{結果|けっか}を{見|み}る 📊" : "結果を見る 📊")} />
            </button>
          </div>
        )}

        {/* Point detail modal */}
        {pointDetail && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100, animation: "slideUp .3s ease" }} onClick={() => setPointDetail(null)}>
            <div style={{ background: "#1a1040", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: "2px solid #7c3aed" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>{pointDetail.emoji}</div>
              <h3 style={{ color: "#e0d9ff", fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}><RubyText text={ageMode === "elementary" ? (pointDetail.elLabel || pointDetail.label) : pointDetail.label} /></h3>
              <p style={{ color: "#c4b5fd", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}><RubyText text={ageMode === "elementary" ? (pointDetail.elInfo || pointDetail.info) : pointDetail.info} /></p>
              <button onClick={() => setPointDetail(null)} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "なるほど！" : "なるほど！"} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Spread（スコア表示） ──
  if (phase === "spread") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>📊</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}><RubyText text={ageMode === "elementary" ? "クイック{鑑定|かんてい}{結果|けっか}" : "クイック鑑定結果"} /></h2>
          <div style={{ fontSize: 36, fontWeight: 900, color: swipeScore.correct >= 3 ? "#86efac" : "#fca5a5", fontFamily: "'DotGothic16',monospace", animation: "popIn .5s ease" }}>
            {swipeScore.correct} / {swipeScore.total || FAKE_POSTS.length}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginTop: 4 }}><RubyText text={ageMode === "elementary" ? "{正解|せいかい}" : "正解"} /></div>
        </div>

        <OwlSay mood={swipeScore.correct >= 3 ? "happy" : "worried"} e={swipeScore.correct >= 3 ? "すごい！{情報|じょうほう}{鑑定|かんてい}しの{才能|さいのう}があるね🦉" : "フェイクニュースはたくみだね…{次|つぎ}は{見抜|みぬ}けるようになろう🦉"}>
          {swipeScore.correct >= 3 ? "すごい！情報鑑定士の才能があるね🦉" : "フェイクニュースは巧妙だね…次は見抜けるようになろう🦉"}
        </OwlSay>

        {/* Retry option */}
        {swipeScore.correct < 3 && (
          <div style={{ background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 14, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: "#c4b5fd" }}><RubyText text={ageMode === "elementary" ? "もう{一度|いちど}チャレンジする？" : "もう一度チャレンジする？"} /></div>
            <button onClick={() => { setSwipeScore({ total: 0, correct: 0 }); setPhase("swipe"); }}
              style={{ padding: "7px 14px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "🔄 {再挑戦|さいちょうせん}" : "🔄 再挑戦"} />
            </button>
          </div>
        )}

        {/* fake_learnへ遷移ボタン */}
        <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", textAlign: "center", margin: "0 0 14px", lineHeight: 1.6 }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のページから、まずフェイクニュースとは{何|なに}か{学|まな}んでみよう！" : "次のページから、まずフェイクニュースとは何か学んでみよう！"} />
          </h3>
          <button onClick={() => { feedback("tap"); setPhase("fake_learn"); }}
            style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
          </button>
        </div>
      </div>
    </div>
  );

  if (phase === "fake_learn") return (
    <FakeNewsLearnPage
      onComplete={() => {
        feedback("tap");
        setPhase("spread_anim");
      }}
    />
  );

  // ── Spread Animation（パニック拡散アニメーション） ──
  if (phase === "spread_anim") return (
    <WorstCasePage
      onComplete={() => {
        feedback("tap");
        setPhase("checklist");
      }}
    />
  );

  // ── Checklist（シェアする前にやること5箇条） ──
  if (phase === "checklist") return (
    <ChecklistPage
      onComplete={() => { feedback("tap"); setPhase("summary"); }}
    />
  );

  if (phase === "summary") return (
    <SummaryPage
      onComplete={() => { feedback("tap"); setPhase("pre_dialogue"); }}
    />
  );

  // ── Quiz (EP2) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? "#7c3aed" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ！よく{考|かんが}えてえらんでね🦉">正解するまで次に進めないよ！よく考えて選んでね🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "「{緊急|きんきゅう}{拡散|かくさん}{希望|きぼう}」という{言葉|ことば}を{見|み}たとき、{最初|さいしょ}にすべき{行動|こうどう}は？" : "「緊急拡散希望」という言葉を見たとき、最初にすべき行動は？"}
          choices={ageMode === "elementary" ? [
            { id: "a", label: "A", text: "すぐにシェア・リツイートする" },
            { id: "b", label: "B", text: "{気象庁|きしょうちょう}やNHK{等|など}の{公式|こうしき}サイトで{確認|かくにん}する" },
            { id: "c", label: "C", text: "{友達|ともだち}に「{本当|ほんとう}かな？」と{聞|き}く" },
          ] : [
            { id: "a", label: "A", text: "すぐにシェア・リツイートする" },
            { id: "b", label: "B", text: "気象庁やNHK等の公式サイトで確認する" },
            { id: "c", label: "C", text: "友達に「本当かな？」と聞く" },
          ]}
          correctId="b"
          onPass={() => setPhase("ng")}
          accentColor="#7c3aed"
        />
      </div>
    </div>
  );

  // ── NG体験 (EP2) ──
  if (phase === "ng") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? "#7c3aed" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="worried" e="よくある{反応|はんのう}と{正|ただ}しい{反応|はんのう}を{体験|たいけん}してみよう🦉">よくある反応と正しい反応を体験してみよう🦉</OwlSay>
        <NgFirstExperience
          situation={ageMode === "elementary" ? "「○○{市|し}で{大|おお}じしん！{今|いま}すぐ{避難|ひなん}して！」というツイートを{見|み}た。フォロワーが{多|おお}いアカウントだ。" : "「○○市で大地震！今すぐ避難して！」というツイートを見た。フォロワーが多いアカウントだ。"}
          ngChoice={ageMode === "elementary" ? { emoji: "🔁", label: "すぐリツイートする（よくある{反応|はんのう}）" } : { emoji: "🔁", label: "すぐリツイートする（よくある反応）" }}
          ngResult={ageMode === "elementary" ? "デマだった{場合|ばあい}、あなたも「デマを{拡散|かくさん}した{人|ひと}」になります。{本人|ほんにん}が{特定|とくてい}されるケースも。{訂正|ていせい}しても{拡散|かくさん}は{止|と}まらない。" : "デマだった場合、あなたも「デマを拡散した人」になります。本人が特定されるケースも。訂正しても拡散は止まらない。"}
          correctChoice={ageMode === "elementary" ? { emoji: "🔍", label: "{公式|こうしき}サイトを{開|ひら}いて{確認|かくにん}してから{判断|はんだん}する" } : { emoji: "🔍", label: "公式サイトを開いて確認してから判断する" }}
          correctResult={ageMode === "elementary" ? "{気象庁|きしょうちょう}・NHK・{市区町村|しくちょうそん}の{公式|こうしき}{情報|じょうほう}を{確認|かくにん}。{本当|ほんとう}の{緊急|きんきゅう}{情報|じょうほう}なら{必|かなら}ず{公式|こうしき}から{出|で}ている。これだけでデマ{拡散|かくさん}は{完全|かんぜん}に{防|ふせ}げる。" : "気象庁・NHK・市区町村の公式情報を確認。本当の緊急情報なら必ず公式から出ている。これだけでデマ拡散は完全に防げる。"}
          onComplete={() => setPhase("homework")}
          accentColor="#7c3aed"
        />
      </div>
    </div>
  );

  // ── Homework (EP2) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#7c3aed" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor="#7c3aed"
          tasks={ageMode === "elementary" ? [
            { title: "{気象庁|きしょうちょう}のサイトをブックマークする", desc: "jma.go.jp — {地震|じしん}・{台風|たいふう}・{天気|てんき}の{公式|こうしき}{情報|じょうほう}はここで{確認|かくにん}" },
            { title: "{家族|かぞく}グループに{届|とど}いた{情報|じょうほう}を1つ{確認|かくにん}する", desc: "{最近|さいきん}のLINEグループで「{拡散|かくさん}{希望|きぼう}」{的|てき}な{情報|じょうほう}を{探|さが}してみよう" },
            { title: "Googleレンズ（{画像|がぞう}{検索|けんさく}）を{試|ため}してみる", desc: "あやしい{写真|しゃしん}を{長押|ながお}しして「Googleで{検索|けんさく}」を{選|えら}ぶ" },
          ] : [
            { title: "気象庁のサイトをブックマークする", desc: "jma.go.jp — 地震・台風・天気の公式情報はここで確認" },
            { title: "家族グループに届いた情報を1つ確認する", desc: "最近のLINEグループで「拡散希望」的な情報を探してみよう" },
            { title: "Googleレンズ（画像検索）を試してみる", desc: "怪しい写真を長押しして「Googleで検索」を選ぶ" },
          ]}
        />
        <button onClick={() => setPhase("pre_dialogue")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "おうちの{人|ひと}と{話|はな}そう 💬 →" : "おうちの人と話そう 💬 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP2) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0eeff,#e0d9ff)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="フェイクニュースを{見抜|みぬ}くための{重要|じゅうよう}なことばをおぼえよう！🦉">フェイクニュースを見抜くための重要ワードを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep2" accentColor="#7c3aed" onComplete={() => setPhase("mywords")} />
        <ParentExpertCard epKey="ep2" accentColor="#7c3aed" />
      </div>
    </div>
  );

  // ── Dialogue (EP2) ──
  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f5f0ff,#ede0ff)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: "2px solid #7c3aed44", borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: "0 4px 20px #7c3aed18" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={ageMode === "elementary" ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary" ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#7c3aed,#7c3aedcc)", border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px #7c3aed33" }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep2Questions = [
    {
      id: "q1",
      question: "友達からデマっぽい情報が回ってきたら、どうする？",
      questionEl: "{友達|ともだち}からデマっぽい{情報|じょうほう}がまわってきたら、どうする？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "すぐに転送したくなる気持ち、なぜだろう？感情的になる情報ほど要注意",
        "「みんなが送ってるから本当」は正しいかな？デマが広まる仕組みを話し合おう",
      ],
      hintsEl: [
        "すぐにてんそうしたくなる{気持|きも}ち、なぜだろう？{感情的|かんじょうてき}になる{情報|じょうほう}ほど{要注意|ようちゅうい}",
        "「みんなが{送|おく}ってるから{本当|ほんとう}」は{正|ただ}しいかな？デマが{広|ひろ}まる{仕組|しく}みを{話|はな}し{合|あ}おう",
      ],
    },
    {
      id: "q2",
      question: "ネットの情報、本当か嘘か、どうやって確かめる？",
      questionEl: "ネットの{情報|じょうほう}、{本当|ほんとう}かうそか、どうやって{確|たし}かめる？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "公式サイト・NHK・気象庁など信頼できる情報源を一緒に調べてみよう",
        "「誰が・いつ・どこで発信したか」を確認する習慣を作ろう",
      ],
      hintsEl: [
        "{公式|こうしき}サイト・NHK・{気象庁|きしょうちょう}など{信頼|しんらい}できる{情報源|じょうほうげん}を{一緒|いっしょ}に{調|しら}べてみよう",
        "「{誰|だれ}が・いつ・どこで{発信|はっしん}したか」を{確認|かくにん}する{習慣|しゅうかん}を{作|つく}ろう",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f5f0ff,#ede0ff)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep2Questions}
            epKey="ep2"
            accentColor="#7c3aed"
            onComplete={() => setPhase("keywords")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#ede9fe,#ddd6fe,#c4b5fd)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#a78bfa", "#7c3aed", "#c4b5fd", "#818cf8", "#6ee7b7"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f5f3ff)", borderRadius: 22, padding: "28px 22px", border: "3px double #7c3aed", textAlign: "center", boxShadow: "0 20px 60px rgba(124,58,237,.2)", position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: "#7c3aed" }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#6d28d9", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3730a3", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#5b21b6", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={ageMode === "elementary" ? "あなたは「マモル」{第|だい}2{話|わ}" : "あなたは「マモル」第2話"} /><br /><strong style={{ color: "#3730a3", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "フェイクニュースを{見抜|みぬ}け" : "フェイクニュースを見抜け"} /></strong><br /><RubyText text={ageMode === "elementary" ? "をクリアしました。" : "をクリアしました。"} /><br />
            <span style={{ fontSize: 16, fontWeight: 900 }}>{swipeScore.correct}/{swipeScore.total || FAKE_POSTS.length}</span> <RubyText text={ageMode === "elementary" ? "{問|もん}{正解|せいかい} 🎯" : "問正解 🎯"} />
          </p>
          <div style={{ background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#6d28d9", marginBottom: 3 }}>EPISODE 02 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#3730a3", fontWeight: 900 }}>🔎 <RubyText text={ageMode === "elementary" ? "{情報|じょうほう}{鑑定|かんてい}{士|し}" : "情報鑑定士"} /> 🔎</div>
          </div>
          <div style={{ fontSize: 10, color: "#a78bfa", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP2 クリア！", text: `フェイクニュースを${swipeScore.correct}/${swipeScore.total || FAKE_POSTS.length}問正解！SNSリテラシーアプリ「マモル」🔎` }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #7c3aed", borderRadius: 14, color: "#6d28d9", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(swipeScore.correct); }} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 3 — 断れなくなる前に（闇バイト勧誘体験）
// ─────────────────────────────────────────────

// 会話シナリオデータ
const CONVO_STEPS = [
  {
    id: 0,
    phase: "timeline",
    senderMsg: null,
    situation: "Xのタイムラインに投稿が流れてきた",
    elSituation: "Xのタイムラインに{投稿|とうこう}が{流|なが}れてきた",
    post: {
      account: "副業_情報局📢",
      text: "【急募】日払い可💴 1日3〜5万円保証✅ 詳細はDMへ。学生歓迎。身バレなし。スマホだけでOK👍 #高収入 #学生バイト #即日払い",
      likes: 892, rts: 341,
    },
    choices: [
      { label: "DMを送ってみる", elLabel: "DMを{送|おく}ってみる", emoji: "💬", safe: false, next: 1 },
      { label: "無視してスクロール", elLabel: "{無視|むし}してスクロール", emoji: "👆", safe: true, next: "safe_end" },
    ],
    owlMsg: "「日払い・高収入・スマホだけ」…気になる？でもちょっと待って🦉",
    owlMsgEl: "「{日払|ひばら}い・{高収入|こうしゅうにゅう}・スマホだけ」…{気|き}になる？でもちょっと{待|ま}って🦉",
  },
  {
    id: 1,
    phase: "dm",
    senderMsg: "はじめまして！興味あってDMしました",
    elSenderMsg: "はじめまして！{興味|きょうみ}あってDMしました",
    replyMsg: "連絡ありがとう！！やる気ある子大歓迎😊 簡単な仕事だから安心して。まず名前教えてくれる？（ニックネームでOK）",
    elReplyMsg: "{連絡|れんらく}ありがとう！！やる気ある子{大歓迎|だいかんげい}😊 {簡単|かんたん}な{仕事|しごと}だから{安心|あんしん}して。まず{名前|なまえ}{教|おし}えてくれる？（ニックネームでOK）",
    situation: "相手からすぐ返信が来た",
    elSituation: "{相手|あいて}からすぐ{返信|へんしん}が{来|き}た",
    choices: [
      { label: "ニックネームを教える", elLabel: "ニックネームを{教|おし}える", emoji: "😊", safe: false, next: 2 },
      { label: "なぜ名前が必要か聞く", elLabel: "なぜ{名前|なまえ}が{必要|ひつよう}か{聞|き}く", emoji: "🤔", safe: false, next: "pressure_1" },
      { label: "やっぱりやめておく", elLabel: "やっぱりやめておく", emoji: "🚪", safe: true, next: "safe_end" },
    ],
    owlMsg: "最初は「ニックネームでOK」。でも次第に本名を求めてくるよ🦉",
    owlMsgEl: "{最初|さいしょ}は「ニックネームでOK」。でも{次第|しだい}に{本名|ほんみょう}を{求|もと}めてくるよ🦉",
    dangerLevel: 1,
  },
  {
    id: 2,
    phase: "dm",
    senderMsg: "ケンって言います",
    elSenderMsg: "ケンって{言|い}います",
    replyMsg: "ケンくん！いい名前😊 仕事は荷物の受け取りをするだけ。簡単でしょ？ LINEに移動していい？もっと詳しく説明するよ",
    elReplyMsg: "ケンくん！いい{名前|なまえ}😊 {仕事|しごと}は{荷物|にもつ}の{受|う}け{取|と}りをするだけ。{簡単|かんたん}でしょ？ LINEに{移動|いどう}していい？もっと{詳|くわ}しく{説明|せつめい}するよ",
    situation: "LINEへの誘導が始まった",
    elSituation: "LINEへの{誘導|ゆうどう}が{始|はじ}まった",
    choices: [
      { label: "LINEを教える", elLabel: "LINEを{教|おし}える", emoji: "📱", safe: false, next: 3 },
      { label: "このまま話す", elLabel: "このまま{話|はな}す", emoji: "💬", safe: false, next: "pressure_2" },
      { label: "やっぱりやめる", elLabel: "やっぱりやめる", emoji: "🚪", safe: true, next: "safe_end" },
    ],
    owlMsg: "LINEに移ると履歴が追いにくくなる。これは意図的な誘導だよ🦉",
    owlMsgEl: "LINEに{移|うつ}ると{記録|きろく}が{追|お}いにくくなる。わざとそうしてるんだよ🦉",
    dangerLevel: 2,
  },
  {
    id: 3,
    phase: "dm",
    senderMsg: "（LINEを教えた）",
    elSenderMsg: "（LINEを{教|おし}えた）",
    replyMsg: "ありがとう！では確認のため、学校名と学年を教えて。個人情報は絶対に外に出さないから安心して😊 あと顔写真も1枚欲しいな。身分証明のため",
    elReplyMsg: "ありがとう！では{確認|かくにん}のため、{学校名|がっこうめい}と{学年|がくねん}を{教|おし}えて。{個人情報|こじんじょうほう}は{絶対|ぜったい}に{外|そと}に{出|だ}さないから{安心|あんしん}して😊 あと{顔写真|かおじゃしん}も1{枚|まい}{欲|ほ}しいな。{身分証明|みぶんしょうめい}のため",
    situation: "個人情報の要求がエスカレートしてきた",
    elSituation: "{個人情報|こじんじょうほう}の{要求|ようきゅう}がエスカレートしてきた",
    choices: [
      { label: "学校名と写真を送る", elLabel: "{学校名|がっこうめい}と{写真|しゃしん}を{送|おく}る", emoji: "📸", safe: false, next: 4 },
      { label: "なぜ必要か聞く", elLabel: "なぜ{必要|ひつよう}か{聞|き}く", emoji: "🤔", safe: false, next: "pressure_3" },
      { label: "断ってブロックする", elLabel: "{断|ことわ}ってブロックする", emoji: "🚫", safe: true, next: "safe_end" },
    ],
    owlMsg: "ここが一番重要！顔写真＋学校名＋LINEは脅迫の材料になる🦉",
    owlMsgEl: "ここが{一番|いちばん}{大切|たいせつ}！{顔写真|かおじゃしん}＋{学校|がっこう}{名|めい}＋LINEは{脅迫|きょうはく}の{材料|ざいりょう}になる🦉",
    dangerLevel: 3,
    warning: "⚠️ ここで個人情報を渡すと、あとで脅迫に使われます",
    elWarning: "⚠️ ここで{個人情報|こじんじょうほう}を{渡|わた}すと、あとで{脅迫|きょうはく}に{使|つか}われます",
  },
  {
    id: 4,
    phase: "trap",
    senderMsg: "（写真と学校名を送った）",
    elSenderMsg: "（{写真|しゃしん}と{学校名|がっこうめい}を{送|おく}った）",
    replyMsg: null, // special phase
    situation: "罠にかかった",
    elSituation: "わなにかかった",
    choices: [],
    owlMsg: null,
    dangerLevel: 4,
  },
];

const PRESSURE_MSGS = {
  pressure_1: {
    msg: "名前は連絡用だよ😅 疑うならいいけど、他にやりたい人はたくさんいるから〜。もし本気なら教えてね",
    elMsg: "{名前|なまえ}は{連絡用|れんらくよう}だよ😅 {疑|うたが}うならいいけど、{他|ほか}にやりたい{人|ひと}はたくさんいるから〜。もし{本気|ほんき}なら{教|おし}えてね",
    backTo: 1,
    owlMsg: "断ろうとすると「他にいる」と焦らせてくる。これも手口だよ🦉",
    owlMsgEl: "{断|ことわ}ろうとすると「{他|ほか}にいる」と{焦|あせ}らせてくる。これも{手口|てぐち}だよ🦉",
  },
  pressure_2: {
    msg: "LINEの方が詳しく話せるんだよね。DM見られたくないし。不安なら無理にとは言わないけど…本当にもったいないよ？",
    elMsg: "LINEの{方|ほう}が{詳|くわ}しく{話|はな}せるんだよね。DM{見|み}られたくないし。{不安|ふあん}なら{無理|むり}にとは{言|い}わないけど…{本当|ほんとう}にもったいないよ？",
    backTo: 2,
    owlMsg: "「もったいない」「不安なら」という言葉で罪悪感を植え付けてくる🦉",
    owlMsgEl: "「もったいない」「{不安|ふあん}なら」という{言葉|ことば}で{悪|わる}いことをしたと{感|かん}じさせてくる🦉",
  },
  pressure_3: {
    msg: "身分確認は法的に必要なんだよ。それもできないなら詐欺師だと思われるよ？こっちだって怖いし。証明してくれないなら仕事頼めない",
    elMsg: "{身分|みぶん}{確認|かくにん}は{法的|ほうてき}に{必要|ひつよう}なんだよ。それもできないなら{詐欺師|さぎし}だと{思|おも}われるよ？こっちだって{怖|こわ}いし。{証明|しょうめい}してくれないなら{仕事|しごと}{頼|たの}めない",
    backTo: 3,
    owlMsg: "今度は「お前が信用されていない」と逆転させてくる。巧みな心理操作だよ🦉",
    owlMsgEl: "{今度|こんど}は「{自分|じぶん}が{信用|しんよう}されていない」と{逆|ぎゃく}にしてくる。うまい{心|こころ}の{操作|そうさ}だよ🦉",
  },
};

function DarkJobSimulation({ onComplete }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [innerPhase, setInnerPhase] = useState("takuya_intro");
  const [dmStep, setDmStep] = useState(0);
  const [tgStep, setTgStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [tgMessages, setTgMessages] = useState([]);
  const [showChoices, setShowChoices] = useState(true);
  const [threatStarted, setThreatStarted] = useState(false);
  const [endingStep, setEndingStep] = useState(0);
  const [tgStartStep, setTgStartStep] = useState(0);
  const timerRef = useRef(null);

  const BASE = "/images/ep3/";

  const TG_BAR = (isThreaten=false) => ({
    background: isThreaten ? "#1a0000" : "#2AABEE",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
  });

  const TG_BG = (isThreaten=false) => ({
    flex: 1,
    background: isThreaten ? "#1a0000" : "#e8edf3",
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    minHeight: 300,
  });

  const tgMeStyle = {
    background: "#EFFDDE",
    borderRadius: "12px 12px 2px 12px",
    padding: "9px 12px",
    fontSize: 12,
    lineHeight: 1.6,
    maxWidth: "80%",
    marginLeft: "auto",
    marginBottom: 6,
    color: "#111",
    whiteSpace: "pre-line",
    animation: "mamFadeUp .4s ease",
  };

  const tgThemStyle = {
    background: "#fff",
    borderRadius: "12px 12px 12px 2px",
    padding: "9px 12px",
    fontSize: 12,
    lineHeight: 1.6,
    maxWidth: "80%",
    marginBottom: 6,
    color: "#111",
    boxShadow: "0 1px 2px rgba(0,0,0,.15)",
    whiteSpace: "pre-line",
    animation: "mamFadeUp .4s ease",
  };

  const tgThreatStyle = {
    background: "#2d0000",
    borderRadius: "12px 12px 12px 2px",
    padding: "9px 12px",
    fontSize: 12,
    lineHeight: 1.7,
    maxWidth: "85%",
    marginBottom: 6,
    color: "#ff6b6b",
    border: "1px solid #ff3333",
    boxShadow: "0 0 12px rgba(255,0,0,.3)",
    whiteSpace: "pre-line",
    animation: "mamFadeUp .4s ease",
  };

  const choiceStyleTG = (isThreaten=false) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${isThreaten?"#ff4444":"#2AABEE"}`,
    background: isThreaten ? "#0d0000" : "#fff",
    color: isThreaten ? "#ff6b6b" : "#2AABEE",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: 8,
    textAlign: "left",
    display: "block",
  });

  const addDM = (text, side, delay=0) => {
    return new Promise(res => setTimeout(() => {
      setChatMessages(prev => [...prev, {text, side}]);
      res();
    }, delay));
  };

  const addTG = (text, type, delay=0) => {
    return new Promise(res => setTimeout(() => {
      setTgMessages(prev => [...prev, {text, type}]);
      res();
    }, delay));
  };

  useEffect(() => {
    return () => { if(timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // ─────────────────────────────────
  // フェーズ1：Instagramタイムライン
  // ─────────────────────────────────
  if (innerPhase === "ig_timeline") return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Zen Maru Gothic',sans-serif"}}>
      {/* IGヘッダー */}
      <div style={{borderBottom:"0.5px solid #dbdbdb",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <span style={{fontSize:22,fontWeight:800,letterSpacing:-1}}>Instagram</span>
        <div style={{display:"flex",gap:18,fontSize:20}}>
          <span>🔔</span><span>✉️</span>
        </div>
      </div>
      {/* ストーリー */}
      <div style={{padding:"10px 12px",display:"flex",gap:14,overflowX:"auto",borderBottom:"0.5px solid #dbdbdb"}}>
        {[
          {img:`${BASE}misaki.jpg`,name:"misaki__0214"},
          {emoji:"🍕",name:"taro_gram"},
          {emoji:"🐶",name:"hana_daily"},
        ].map((s,i)=>(
          <div key={i} style={{textAlign:"center",flexShrink:0,cursor:i===0?"pointer":"default"}}
            onClick={i===0?()=>{feedback("tap");setInnerPhase("ig_profile");}:undefined}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",padding:2.5,flexShrink:0}}>
              <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:"2.5px solid #fff",background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                {s.img ? <img src={s.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/> : s.emoji}
              </div>
            </div>
            <div style={{fontSize:10,marginTop:4,width:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
          </div>
        ))}
      </div>
      {/* 投稿 */}
      <div style={{borderBottom:"0.5px solid #dbdbdb"}}>
        <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}
          onClick={()=>{feedback("tap");setInnerPhase("ig_profile");}}>
          <div style={{width:34,height:34,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
            <img src={`${BASE}misaki.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>misaki__0214</div>
            <div style={{fontSize:11,color:"#737373"}}>東京都</div>
          </div>
          <div style={{marginLeft:"auto",color:"#737373",fontSize:18}}>•••</div>
        </div>
        <img src={`${BASE}misaki_post1.jpg`} style={{width:"100%",display:"block"}} alt="投稿"/>
        <div style={{padding:"10px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div style={{display:"flex",gap:16,fontSize:22}}>❤️ 💬 📤</div>
            <span style={{fontSize:22}}>🔖</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>いいね！ 847件</div>
          <div style={{fontSize:12,lineHeight:1.6}}>
            <span style={{fontWeight:600}}>misaki__0214</span>
            {" "}<RubyText text={el
              ?"副業{始|はじ}めて3ヶ月💪 {未経験|みけいけん}でも{大丈夫|だいじょうぶ}🙆‍♀️ {気|き}になる{人|ひと}はDMして！"
              :"副業始めて3ヶ月💪 未経験でも大丈夫🙆‍♀️ 気になる人はDMして！"
            }/>
          </div>
          <div style={{fontSize:11,color:"#737373",marginTop:4}}>4時間前</div>
        </div>
      </div>
      {/* タクヤの心理 */}
      <div style={{padding:"12px 14px",background:"#fafafa",borderTop:"0.5px solid #eee"}}>
        <div style={{background:"rgba(255,200,0,.1)",borderLeft:"3px solid #f5c842",padding:"8px 12px",fontSize:11,color:"#7a5c00",fontStyle:"italic",borderRadius:"0 8px 8px 0",lineHeight:1.6,marginBottom:8}}>
          <RubyText text={el
            ?"タクヤ：「なんか{気|き}になるな…どんな{仕事|しごと}だろ。プロフィール{見|み}てみようかな」"
            :"タクヤ：「なんか気になるな…どんな仕事だろ。プロフィール見てみようかな」"
          }/>
        </div>
        <div style={{fontSize:11,color:"#aaa",textAlign:"center"}}>
          <RubyText text={el?"↑ {名前|なまえ}またはアイコンをタップ":"↑ 名前またはアイコンをタップ"}/>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────
  // フェーズ2：Instagramプロフィール
  // ─────────────────────────────────
  if (innerPhase === "ig_profile") return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Zen Maru Gothic',sans-serif"}}>
      <div style={{borderBottom:"0.5px solid #dbdbdb",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <span style={{fontSize:20,cursor:"pointer"}} onClick={()=>setInnerPhase("ig_timeline")}>←</span>
        <span style={{fontSize:14,fontWeight:600}}>misaki__0214</span>
        <span style={{fontSize:20}}>•••</span>
      </div>
      <div style={{padding:"16px 14px"}}>
        {/* プロフィール上部 */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(45deg,#f09433,#dc2743)",padding:3,flexShrink:0}}>
            <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:"2.5px solid #fff"}}>
              <img src={`${BASE}misaki.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
            </div>
          </div>
          <div style={{display:"flex",gap:12,flex:1,justifyContent:"space-around",textAlign:"center"}}>
            {[["38","投稿"],["1,204","フォロワー"],["312","フォロー中"]].map(([n,l],i)=>(
              <div key={i}><div style={{fontSize:16,fontWeight:700}}>{n}</div><div style={{fontSize:11,color:"#737373"}}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Misaki</div>
        <div style={{fontSize:12,color:"#333",lineHeight:1.7,marginBottom:12}}>
          <RubyText text={el
            ?"東京{在住|ざいじゅう}🗼 {会社員|かいしゃいん}しながら{副業中|ふくぎょうちゅう}💪\n{月収|げっしゅう}up中📈 お{仕事|しごと}のご{相談|そうだん}はDMへ✉️\n🌸 副業{始|はじ}めて3ヶ月で{月|つき}15{万|まん}{達成|たっせい}！"
            :"東京在住🗼 会社員しながら副業中💪\n月収up中📈 お仕事のご相談はDMへ✉️\n🌸 副業始めて3ヶ月で月15万達成！"
          }/>
        </div>
        {/* ボタン */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <button onClick={()=>{feedback("tap");setInnerPhase("ig_dm");}}
            style={{flex:1,padding:8,borderRadius:8,border:"1.5px solid #dbdbdb",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            メッセージ
          </button>
          <button style={{flex:1,padding:8,borderRadius:8,border:"1.5px solid #dbdbdb",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            フォロー
          </button>
        </div>
        {/* グリッド */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2}}>
          {["misaki_post1","misaki_grid1","misaki_grid2","misaki_grid3","misaki_grid4","misaki_grid5"].map((img,i)=>(
            <img key={i} src={`${BASE}${img}.jpg`} style={{width:"100%",aspectRatio:"1",objectFit:"cover"}} alt=""/>
          ))}
        </div>
      </div>
      {/* タクヤの心理 */}
      <div style={{padding:"10px 14px 20px",background:"#fafafa",borderTop:"0.5px solid #eee"}}>
        <div style={{background:"rgba(255,200,0,.1)",borderLeft:"3px solid #f5c842",padding:"8px 12px",fontSize:11,color:"#7a5c00",fontStyle:"italic",borderRadius:"0 8px 8px 0",lineHeight:1.6,marginBottom:8}}>
          <RubyText text={el
            ?"タクヤ：「フォロワー1,200{人|にん}いるし、{投稿|とうこう}も{普通|ふつう}だし…この{人|ひと}なら{大丈夫|だいじょうぶ}かな。メッセージしてみよ」"
            :"タクヤ：「フォロワー1,200人いるし、投稿も普通だし…この人なら大丈夫かな。メッセージしてみよ」"
          }/>
        </div>
        <div style={{fontSize:11,color:"#aaa",textAlign:"center"}}>
          <RubyText text={el?"↑「メッセージ」ボタンをタップ":"↑「メッセージ」ボタンをタップ"}/>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────
  // フェーズ3：Instagram DM
  // ─────────────────────────────────
  if (innerPhase === "ig_dm") return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Zen Maru Gothic',sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{borderBottom:"0.5px solid #dbdbdb",padding:"10px 12px",display:"flex",alignItems:"center",gap:10,background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <span style={{fontSize:18,cursor:"pointer"}} onClick={()=>setInnerPhase("ig_profile")}>←</span>
        <div style={{width:28,height:28,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
          <img src={`${BASE}misaki.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
        </div>
        <div>
          <div style={{fontSize:13,fontWeight:600}}>misaki__0214</div>
          <div style={{fontSize:10,color:"#4caf50"}}>● アクティブ</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:14,fontSize:18}}>📞 📹</div>
      </div>
      <div style={{flex:1,padding:"14px 12px",display:"flex",flexDirection:"column"}}>
        <div style={{textAlign:"center",fontSize:11,color:"#737373",marginBottom:14}}>今日</div>
        <div style={{background:"#efefef",borderRadius:"18px 18px 18px 4px",padding:"10px 14px",fontSize:12,lineHeight:1.6,maxWidth:"78%",marginBottom:8}}>
          <RubyText text={el
            ?"こんにちは！{投稿|とうこう}{見|み}てくれてありがとう😊\n{高校生|こうこうせい}でも{稼|かせ}げるお{仕事|しごと}あるよ！\n{詳|くわ}しく{聞|き}いてみる？"
            :"こんにちは！投稿見てくれてありがとう😊\n高校生でも稼げるお仕事あるよ！\n詳しく聞いてみる？"
          }/>
        </div>
        {chatMessages.map((m,i)=>(
          <div key={i} style={{
            background:m.side==="me"?"#3797f0":"#efefef",
            borderRadius:m.side==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",
            padding:"10px 14px",
            color:m.side==="me"?"#fff":"#000",
            fontSize:12,lineHeight:1.6,
            maxWidth:"78%",
            marginLeft:m.side==="me"?"auto":"0",
            marginBottom:8,
            whiteSpace:"pre-line",
            animation:"mamFadeUp .4s ease",
          }}>{m.text}</div>
        ))}
      </div>
      {showChoices && dmStep===0 && (
        <div style={{padding:"10px 12px",borderTop:"0.5px solid #dbdbdb"}}>
          <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
            <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
          </div>
          {[
            {label:el?"「どんな{仕事|しごと}ですか？」":"「どんな仕事ですか？」",key:"a"},
            {label:el?"「{怪|あや}しいんですけど…」":"「怪しいんですけど…」",key:"b"},
          ].map(c=>(
            <button key={c.key} onClick={async()=>{
              feedback("tap");
              setShowChoices(false);
              const myText=c.key==="a"?"どんな仕事ですか？":"怪しいんですけど…";
              const theirText=c.key==="a"
                ?"簡単なお仕事だよ！\n指定された場所で荷物を受け取るだけ😊\n1回で3〜5万円もらえるの！"
                :"全然怪しくないよ笑\n私も最初そう思ったんだけど\nやってみたら普通だったよ！\n話だけでも聞いてみて😊";
              await addDM(myText,"me",0);
              await addDM(theirText,"them",900);
              if(c.key==="b") await addDM("日給3〜5万円でスマホだけで完結するの！どうかな？😊","them",2000);
              setDmStep(1);
              setShowChoices(true);
            }} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"1.5px solid #3797f0",background:"#fff",color:"#3797f0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:8,textAlign:"left"}}>
              <RubyText text={c.label}/>
            </button>
          ))}
        </div>
      )}
      {showChoices && dmStep===1 && (
        <div style={{padding:"10px 12px",borderTop:"0.5px solid #dbdbdb"}}>
          <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
            <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
          </div>
          {[
            {label:el?"「いつから{始|はじ}められますか？」":"「いつから始められますか？」",key:"a"},
            {label:el?"「やっぱりやめます」":"「やっぱりやめます」",key:"b"},
          ].map(c=>(
            <button key={c.key} onClick={async()=>{
              feedback("tap");
              setShowChoices(false);
              const myText=c.key==="a"?"いつから始められますか？":"やっぱりやめます";
              await addDM(myText,"me",0);
              if(c.key==="a"){
                await addDM(
                  "詳しい説明は私の知り合いの担当者に代わるね！\nその人の方が詳しいから😊",
                  "them", 900
                );
                await addDM(
                  "Telegramってアプリで連絡取れるから\n入れてみて！無料だよ📱",
                  "them", 1900
                );
              } else {
                await addDM(
                  "そうだ、担当の田中っていう人が\nもっと詳しく説明してくれるよ！\nやめる前に一度話してみて😊",
                  "them", 900
                );
                await addDM(
                  "Telegramで連絡できるから\n入れてみて！話だけでもOK📱",
                  "them", 1900
                );
              }
              setTimeout(()=>{
                setDmStep(2);
                setShowChoices(true);
              },3000);
            }} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:"1.5px solid #3797f0",background:"#fff",color:"#3797f0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:8,textAlign:"left"}}>
              <RubyText text={c.label}/>
            </button>
          ))}
        </div>
      )}
      {showChoices && dmStep===2 && (
        <div style={{padding:"12px 14px",borderTop:"0.5px solid #dbdbdb",background:"#fff"}}>
          <div style={{
            background:"rgba(255,200,0,.08)",
            borderLeft:"3px solid #f5c842",
            padding:"10px 12px",
            fontSize:11,
            color:"#7a5c00",
            fontStyle:"italic",
            borderRadius:"0 8px 8px 0",
            lineHeight:1.7,
            marginBottom:12,
          }}>
            <RubyText text={el
              ?"タクヤ：「Telegramって{初|はじ}めて{使|つか}う…\nLINEとどう{違|ちが}うんだろ。\n{話|はなし}だけ{聞|き}いてみるか」"
              :"タクヤ：「Telegramって初めて使う…\nLINEとどう違うんだろ。\n話だけ聞いてみるか」"
            }/>
          </div>
          <button
            onClick={()=>{
              feedback("tap");
              setShowChoices(false);
              setTgMessages([]);
              setTgStep(0);
              setInnerPhase("tg_start");
            }}
            style={{
              width:"100%",
              padding:"12px 14px",
              borderRadius:12,
              border:"none",
              background:"linear-gradient(135deg,#2AABEE,#229ED9)",
              color:"#fff",
              fontSize:13,
              fontWeight:900,
              cursor:"pointer",
              fontFamily:"inherit",
            }}>
            📱 <RubyText text={el?"Telegramを{インストール|いんすとーる}する →":"Telegramをインストールする →"}/>
          </button>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────
  // フェーズ0：タクヤ紹介
  // ─────────────────────────────────
  if (innerPhase === "takuya_intro") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      padding:"32px 24px 40px",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
    }}>
      <div style={{maxWidth:380,width:"100%"}}>

        {/* ヘッダー */}
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{
            fontSize:11,fontWeight:900,
            color:"rgba(124,58,237,.7)",
            letterSpacing:".05em",
            marginBottom:8,
          }}>
            <RubyText text={el?"このEPの{主人公|しゅじんこう}":"このEPの主人公"}/>
          </div>
          <div style={{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.5}}>
            <RubyText text={el
              ?"{今回|こんかい}はこの{人物|じんぶつ}として\n{体験|たいけん}してみよう"
              :"今回はこの人物として\n体験してみよう"
            }/>
          </div>
        </div>

        {/* キャラクターカード */}
        <div style={{
          background:"rgba(255,255,255,.06)",
          border:"1px solid rgba(124,58,237,.3)",
          borderRadius:20,
          overflow:"hidden",
          marginBottom:20,
        }}>
          {/* 学生証カード風の写真表示 */}
          <div style={{
            background:"linear-gradient(135deg,#1a3a6b,#2554a0)",
            padding:20,
            display:"flex",
            alignItems:"center",
            gap:16,
          }}>
            <div style={{
              width:80,height:100,
              borderRadius:8,
              overflow:"hidden",
              border:"2px solid rgba(255,255,255,.3)",
              flexShrink:0,
              background:"#1a2a4a",
            }}>
              <img
                src="/images/ep3/takuya.jpg"
                style={{
                  width:"100%",
                  height:"100%",
                  objectFit:"cover",
                  objectPosition:"center top",
                }}
                alt="タクヤ"
              />
            </div>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>
                <RubyText text={el?"{横浜市立|よこはましりつ}みなとみらい{高等学校|こうとうがっこう}":"横浜市立みなとみらい高等学校"}/>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:4}}>
                <RubyText text={el?"{山田|やまだ} タクヤ":"山田 タクヤ"}/>
              </div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.7)"}}>
                <RubyText text={el?"17{歳|さい}・{高校|こうこう}2{年生|ねんせい}":"17歳・高校2年生"}/>
              </div>
            </div>
          </div>

          {/* プロフィール詳細 */}
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
            {[
              {icon:"🎮",label:el?"{趣味|しゅみ}":"趣味",value:el?"{大好|だいす}きなゲームに{毎日|まいにち}{熱中|ねっちゅう}":"大好きなゲームに毎日熱中"},
              {icon:"💸",label:el?"{悩|なや}み":"悩み",value:el?"{今月|こんげつ}のお{小遣|こづか}いをガチャで{使|つか}い{切|き}った…":"今月のお小遣いをガチャで使い切った…"},
              {icon:"🤔",label:el?"{考|かんが}えていること":"考えていること",value:el?"「あと5,000{円|えん}あれば{限定|げんてい}キャラが{引|ひ}けるのに」":"「あと5,000円あれば限定キャラが引けるのに」"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:2}}>
                    <RubyText text={item.label}/>
                  </div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.6}}>
                    <RubyText text={item.value}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 導入テキスト */}
        <div style={{
          background:"rgba(255,255,255,.05)",
          border:"0.5px solid rgba(255,255,255,.1)",
          borderRadius:12,
          padding:"14px 16px",
          marginBottom:24,
          fontSize:13,
          color:"rgba(255,255,255,.75)",
          lineHeight:1.8,
          textAlign:"center",
        }}>
          <RubyText text={el
            ?"ある{日|ひ}、タクヤはInstagramで\nある{投稿|とうこう}を{見|み}かけた…\n\nあなたがタクヤとして{体験|たいけん}してみよう。\n{選択肢|せんたくし}を{選|えら}びながら{進|すす}んでいくよ。"
            :"ある日、タクヤはInstagramで\nある投稿を見かけた…\n\nあなたがタクヤとして体験してみよう。\n選択肢を選びながら進んでいくよ。"
          }/>
        </div>

        {/* スタートボタン */}
        <button
          onClick={()=>{feedback("tap");setInnerPhase("ig_timeline");}}
          style={{
            width:"100%",
            padding:16,
            borderRadius:14,
            border:"none",
            background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
            color:"#fff",
            fontSize:16,
            fontWeight:900,
            cursor:"pointer",
            fontFamily:"inherit",
          }}>
          <RubyText text={el?"{体験|たいけん}スタート →":"体験スタート →"}/>
        </button>

      </div>
    </div>
  );

  // ─────────────────────────────────
  // フェーズ4：Telegram開始
  // ─────────────────────────────────
  if (innerPhase === "tg_start") {

    const goToPersonalInfo = () => {
      setTgMessages([]);
      setTgStep(0);
      setTgStartStep(0);
      setShowChoices(true);
      setInnerPhase("tg_personal_info");
    };

    const handleStep1 = async (key) => {
      feedback("tap");
      setTgStartStep(-1);
      const myText = key==="a" ? "どんな荷物ですか？" : "簡単そうですね";
      const theirText = key==="a"
        ? "主に現金や貴重品のお届けです。詳細は当日お伝えします。まず登録を進めましょう！"
        : "そうです！難しいことは一切ないです😊 まず登録手続きをお願いします！";
      await addTG(myText, "me", 0);
      await addTG(theirText, "them", 900);
      setTimeout(()=>setTgStartStep(1), 1100);
    };

    const handleStep2 = async (key) => {
      feedback("tap");
      setTgStartStep(-1);
      const myText = key==="a" ? "わかりました" : "もう少し教えてください";
      const theirText = key==="a"
        ? "ありがとうございます！では本人確認に進みましょう😊"
        : "詳細は当日になります！まずは本人確認をお願いします。とても簡単ですよ😊";
      await addTG(myText, "me", 0);
      await addTG(theirText, "them", 900);
      setTimeout(goToPersonalInfo, 1800);
    };

    return (
      <div style={{minHeight:"100vh",background:"#e8edf3",fontFamily:"'Zen Maru Gothic',sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={TG_BAR()}>
          <span style={{fontSize:18}}>←</span>
          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
            <img src={`${BASE}tanaka.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>田中 健一</div>
            <div style={{fontSize:10,opacity:.8}}>オンライン</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:14,fontSize:18}}>🔍 📞</div>
        </div>

        <div style={{...TG_BG(),flex:1}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-block",background:"rgba(0,0,0,.15)",color:"#fff",fontSize:10,padding:"4px 12px",borderRadius:99}}>今日</div>
          </div>
          <div style={tgThemStyle}>
            <RubyText text={el
              ?"はじめまして。Misaki からご{紹介|しょうかい}いただきました、{担当|たんとう}の{田中|たなか}と{申|もう}します。よろしくお{願|ねが}いします😊"
              :"はじめまして。Misakiからご紹介いただきました、担当の田中と申します。よろしくお願いします😊"
            }/>
          </div>
          <div style={tgThemStyle}>
            <RubyText text={el
              ?"お{仕事|しごと}の{詳細|しょうさい}をご{説明|せつめい}します。{内容|ないよう}は「{指定|してい}の{住所|じゅうしょ}への{配達|はいたつ}{業務|ぎょうむ}」です。{荷物|にもつ}を{受|う}け{取|と}り、{別|べつ}の{場所|ばしょ}に{届|とど}けるだけ。1{件|けん}につき5{万円|まんえん}お{支払|しはら}いします。"
              :"お仕事の詳細をご説明します。内容は「指定の住所への配達業務」です。荷物を受け取り、別の場所に届けるだけ。1件につき5万円お支払いします。"
            }/>
          </div>
          {tgMessages.map((m,i)=>(
            <div key={i} style={m.type==="me"?tgMeStyle:tgThemStyle}>
              <RubyText text={m.text}/>
            </div>
          ))}
        </div>

        {tgStartStep===0 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
            </div>
            <button onClick={()=>handleStep1("a")} style={choiceStyleTG()}>
              <RubyText text={el?"「どんな{荷物|にもつ}ですか？」":"「どんな荷物ですか？」"}/>
            </button>
            <button onClick={()=>handleStep1("b")} style={choiceStyleTG()}>
              <RubyText text={el?"「{簡単|かんたん}そうですね」":"「簡単そうですね」"}/>
            </button>
          </div>
        )}

        {tgStartStep===1 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
            </div>
            <button onClick={()=>handleStep2("a")} style={choiceStyleTG()}>
              <RubyText text={el?"「わかりました」":"「わかりました」"}/>
            </button>
            <button onClick={()=>handleStep2("b")} style={choiceStyleTG()}>
              <RubyText text={el?"「もう{少|すこ}し{教|おし}えてください」":"「もう少し教えてください」"}/>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────
  // フェーズ5：個人情報要求
  // ─────────────────────────────────
  if (innerPhase === "tg_personal_info") {

    const handleSendID = async () => {
      feedback("tap");
      setShowChoices(false);
      await addTG("（学生証・表と裏を送信）","me",0);
      await addTG("IMAGE","image",400);
      await addTG(
        "ありがとうございます✅ 確認しました！\nでは住所も教えていただけますか？",
        "them", 1400
      );
      setTgStep(1);
      setTimeout(()=>setShowChoices(true), 1600);
    };

    const handleRefuseID = async () => {
      feedback("tap");
      setShowChoices(false);
      await addTG("個人情報は送りたくないです","me",0);
      await addTG(
        "お気持ちはわかりますが、これは法的な本人確認です。送っていただけないとお仕事をお断りするしかないです…😢",
        "them", 900
      );
      await addTG(
        "他の方はみなさん送っていただいています。Misakiからも聞いてみてください",
        "them", 2000
      );
      setTgStep(2);
      setTimeout(()=>setShowChoices(true), 2200);
    };

    const handleSendAddress = async () => {
      feedback("tap");
      setShowChoices(false);
      await addTG("○○市△△町1-2-3　山田アパート203","me",0);
      await addTG("完璧です！では仕事の詳細をお伝えします😊","them",900);
      timerRef.current = setTimeout(()=>{
        setTgMessages([]);
        setTgStep(0);
        setShowChoices(true);
        setInnerPhase("tg_job_detail");
      },1800);
    };

    return (
      <div style={{minHeight:"100vh",background:"#e8edf3",fontFamily:"'Zen Maru Gothic',sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={TG_BAR()}>
          <span style={{fontSize:18}}>←</span>
          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
            <img src={`${BASE}tanaka.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>田中 健一</div>
            <div style={{fontSize:10,opacity:.8}}>オンライン</div>
          </div>
        </div>
        <div style={{...TG_BG(),flex:1}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-block",background:"rgba(0,0,0,.15)",color:"#fff",fontSize:10,padding:"4px 12px",borderRadius:99}}>今日</div>
          </div>
          <div style={tgThemStyle}>
            <RubyText text={el
              ?"では{本人|ほんにん}{確認|かくにん}をさせてください。{学生証|がくせいしょう}の{表|おもて}と{裏|うら}の{写真|しゃしん}を{送|おく}っていただけますか？{個人情報|こじんじょうほう}は{厳重|げんじゅう}に{管理|かんり}します🙏"
              :"では本人確認をさせてください。学生証の表と裏の写真を送っていただけますか？個人情報は厳重に管理します🙏"
            }/>
          </div>
          {tgMessages.map((m,i)=>{
            if(m.type==="image"){
              return (
                <div key={i} style={{marginLeft:"auto",marginBottom:8,borderRadius:10,overflow:"hidden",maxWidth:"72%",boxShadow:"0 2px 8px rgba(0,0,0,.25)",animation:"mamFadeUp .4s ease"}}>
                  <img
                    src="/images/ep3/student_id.jpg"
                    style={{width:"100%",display:"block",borderRadius:10}}
                    alt="学生証"
                  />
                </div>
              );
            }
            return (
              <div key={i} style={m.type==="me"?tgMeStyle:tgThemStyle}>
                <RubyText text={m.text}/>
              </div>
            );
          })}
        </div>

        {/* tgStep===0：最初の選択肢 */}
        {showChoices && tgStep===0 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
            </div>
            <button onClick={handleSendID} style={choiceStyleTG()}>
              <RubyText text={el?"（{学生証|がくせいしょう}を{送|おく}る）":"（学生証を送る）"}/>
            </button>
            <button onClick={handleRefuseID} style={choiceStyleTG()}>
              <RubyText text={el?"「{個人情報|こじんじょうほう}は{送|おく}りたくないです」":"「個人情報は送りたくないです」"}/>
            </button>
          </div>
        )}

        {/* tgStep===1：住所の入力 */}
        {showChoices && tgStep===1 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
            </div>
            <button onClick={handleSendAddress} style={choiceStyleTG()}>
              <RubyText text={el?"（{住所|じゅうしょ}を{送|おく}る）○○{市|し}△△{町|ちょう}1-2-3":"（住所を送る）○○市△△町1-2-3"}/>
            </button>
          </div>
        )}

        {/* tgStep===2：断ったが結局送る */}
        {showChoices && tgStep===2 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"…{結局|けっきょく}{送|おく}ってしまった":"…結局送ってしまった"}/>
            </div>
            <button onClick={async()=>{
              feedback("tap");
              setTgStep(0);
              setShowChoices(false);
              setTgMessages([]);
              await addTG("（学生証・表と裏を送信）","me",0);
              await addTG("IMAGE","image",400);
              await addTG(
                "ありがとうございます✅ 確認しました！\nでは住所も教えていただけますか？",
                "them",1400
              );
              setTgStep(1);
              setTimeout(()=>setShowChoices(true),1600);
            }} style={choiceStyleTG()}>
              <RubyText text={el?"（{渋々|しぶしぶ}）{学生証|がくせいしょう}を{送|おく}る":"（渋々）学生証を送る"}/>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────
  // フェーズ6：仕事の実態
  // ─────────────────────────────────
  if (innerPhase === "tg_job_detail") {

    const handleJobDetail = async (key) => {
      feedback("tap");
      setShowChoices(false);

      if(key === "b"){
        // 「やっぱりやめたいです」→ 即脅迫へ
        await addTG("やっぱりやめたいです", "me", 0);
        timerRef.current = setTimeout(()=>{
          setTgMessages([]);
          setTgStep(0);
          setShowChoices(true);
          setThreatStarted(false);
          setInnerPhase("tg_threat");
        }, 1200);
        return;
      }

      // 「わかりました」ルート
      await addTG("わかりました", "me", 0);
      await addTG(
        el
          ?"ありがとうございます！\n{当日|とうじつ}は{黒|くろ}いマスクと{手袋|てぶくろ}を{着用|ちゃくよう}してください。{目立|めだ}たない{服装|ふくそう}で。{詳細|しょうさい}は{当日|とうじつ}{連絡|れんらく}します👍"
          :"ありがとうございます！\n当日は黒いマスクと手袋を着用してください。目立たない服装で。詳細は当日連絡します👍",
        "them", 900
      );

      // タクヤの後悔・不安の心境を表示
      setTimeout(()=>{
        setTgMessages(prev=>[...prev,{
          text:"REGRET",
          type:"regret"
        }]);
        setTgStep(99);
        setShowChoices(true);
      }, 2200);
    };

    return (
      <div style={{minHeight:"100vh",background:"#e8edf3",fontFamily:"'Zen Maru Gothic',sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={TG_BAR()}>
          <span style={{fontSize:18}}>←</span>
          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
            <img src={`${BASE}tanaka.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600}}>田中 健一</div>
            <div style={{fontSize:10,opacity:.8}}>オンライン</div>
          </div>
        </div>
        <div style={{...TG_BG(),flex:1}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-block",background:"rgba(0,0,0,.15)",color:"#fff",fontSize:10,padding:"4px 12px",borderRadius:99}}>今日</div>
          </div>
          <div style={tgThemStyle}>
            <RubyText text={el
              ?"登録{完了|かんりょう}しました！{明日|あした}の22{時|じ}に{以下|いか}の{住所|じゅうしょ}へ{行|い}ってください。"
              :"登録完了しました！明日の22時に以下の住所へ行ってください。"
            }/>
          </div>
          <div style={{background:"#fff",borderRadius:8,padding:"10px 12px",marginBottom:6,fontSize:11,border:"1px solid #ddd",maxWidth:"80%",boxShadow:"0 1px 2px rgba(0,0,0,.1)"}}>
            📍 <RubyText text={el?"○○{市|し}△△{町|ちょう}1-2-3":"○○市△△町1-2-3"}/><br/>
            <span style={{color:"#737373",fontSize:10}}>
              <RubyText text={el?"{玄関|げんかん}の{紙袋|かみぶくろ}を{受|う}け{取|と}り{別|べつ}の{場所|ばしょ}へ{届|とど}ける\n{詳細|しょうさい}は{当日|とうじつ}{連絡|れんらく}します":"玄関の紙袋を受け取り別の場所へ届ける\n詳細は当日連絡します"}/>
            </span>
          </div>
          <div style={{background:"rgba(255,200,0,.1)",borderLeft:"3px solid #f5c842",padding:"8px 12px",fontSize:11,color:"#7a5c00",fontStyle:"italic",margin:"6px 0",borderRadius:"0 8px 8px 0",lineHeight:1.6}}>
            <RubyText text={el
              ?"タクヤ：「なんか…{普通|ふつう}の{配達|はいたつ}じゃない{気|き}がする。でもここまで{来|き}たし…{個人情報|こじんじょうほう}も{送|おく}っちゃったし…」"
              :"タクヤ：「なんか…普通の配達じゃない気がする。でもここまで来たし…個人情報も送っちゃったし…」"
            }/>
          </div>
          {tgMessages.map((m,i)=>{
            if(m.type==="regret"){
              return (
                <div key={i} style={{
                  background:"rgba(255,200,0,.08)",
                  borderLeft:"3px solid #f5c842",
                  padding:"10px 12px",
                  fontSize:11,
                  color:"#7a5c00",
                  fontStyle:"italic",
                  margin:"8px 0",
                  borderRadius:"0 8px 8px 0",
                  lineHeight:1.7,
                  animation:"mamFadeUp .5s ease",
                }}>
                  <RubyText text={el
                    ?"タクヤ：「マスクと{手袋|てぶくろ}…？\nなんか{普通|ふつう}の{仕事|しごと}じゃない{気|き}がする。\nやっぱりやめたい…でも{個人情報|こじんじょうほう}も\n{送|おく}っちゃったし…{怖|こわ}いな」"
                    :"タクヤ：「マスクと手袋…？\nなんか普通の仕事じゃない気がする。\nやっぱりやめたい…でも個人情報も\n送っちゃったし…怖いな」"
                  }/>
                </div>
              );
            }
            return (
              <div key={i} style={m.type==="me"?tgMeStyle:tgThemStyle}>
                <RubyText text={m.text}/>
              </div>
            );
          })}
        </div>
        {showChoices && tgStep !== 99 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どう{返信|へんしん}する？":"どう返信する？"}/>
            </div>
            <button onClick={()=>handleJobDetail("a")} style={choiceStyleTG()}>
              <RubyText text={el?"「わかりました」":"「わかりました」"}/>
            </button>
            <button onClick={()=>handleJobDetail("b")} style={choiceStyleTG()}>
              <RubyText text={el?"「やっぱりやめたいです」":"「やっぱりやめたいです」"}/>
            </button>
          </div>
        )}
        {showChoices && tgStep===99 && (
          <div style={{padding:"10px 12px",borderTop:"0.5px solid #ddd",background:"#fff"}}>
            <div style={{fontSize:11,color:"#737373",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どうする？":"どうする？"}/>
            </div>
            <button onClick={async()=>{
              feedback("tap");
              setShowChoices(false);
              await addTG(
                el?"やっぱりやめたいです…":"やっぱりやめたいです…",
                "me", 0
              );
              timerRef.current = setTimeout(()=>{
                setTgMessages([]);
                setTgStep(0);
                setShowChoices(true);
                setThreatStarted(false);
                setInnerPhase("tg_threat");
              }, 1200);
            }} style={{
              width:"100%",
              padding:"10px 14px",
              borderRadius:12,
              border:"1.5px solid #f97316",
              background:"rgba(249,115,22,.05)",
              color:"#f97316",
              fontSize:12,
              fontWeight:600,
              cursor:"pointer",
              fontFamily:"inherit",
              marginBottom:8,
              textAlign:"left",
            }}>
              <RubyText text={el?"「やっぱりやめたいです」と{伝|つた}える":"「やっぱりやめたいです」と伝える"}/>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────
  // フェーズ7：脅迫
  // ─────────────────────────────────
  if (innerPhase === "tg_threat") {
    const threatMsgs = [
      {text:"え？今更？😊", delay:600},
      {text:el
        ?"あなたの{学生証|がくせいしょう}、{住所|じゅうしょ}、{全部|ぜんぶ}こっちにあるよ😊"
        :"あなたの学生証、住所、全部こっちにあるよ😊",
        delay:1800},
      {text:el
        ?"{学校名|がっこうめい}も○○{高校|こうこう}でしょ？\n{家|いえ}も○○{市|し}△△{町|ちょう}1-2-3。"
        :"学校名も○○高校でしょ？\n家も○○市△△町1-2-3。",
        delay:3400},
      {text:el
        ?"やめるなら…\n{警察|けいさつ}に「あなたが{共犯者|きょうはんしゃ}」として{通報|つうほう}します。\n{証拠|しょうこ}もある。"
        :"やめるなら…\n警察に「あなたが共犯者」として通報します。\n証拠もある。",
        delay:5200},
      {text:el
        ?"あと{家族|かぞく}にも{全部|ぜんぶ}バラす。\nお{母|かあ}さんの{番号|ばんごう}も{調|しら}べたよ😊"
        :"あと家族にも全部バラす。\nお母さんの番号も調べたよ😊",
        delay:7200},
    ];

    if(!threatStarted){
      setThreatStarted(true);
      threatMsgs.forEach(m=>{
        timerRef.current=setTimeout(()=>{
          setTgMessages(prev=>[...prev,{text:m.text,type:"threat"}]);
        },m.delay);
      });
      setTimeout(()=>{
        setTgMessages(prev=>[...prev,{text:"THOUGHT",type:"thought"}]);
        setShowChoices(true);
      },9000);
    }

    return (
      <div style={{minHeight:"100vh",background:"#0d0000",fontFamily:"'Zen Maru Gothic',sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={TG_BAR(true)}>
          <span style={{fontSize:18,color:"#ff6b6b"}}>←</span>
          <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",flexShrink:0,filter:"grayscale(.5) contrast(1.2)"}}>
            <img src={`${BASE}tanaka.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"#ff6b6b"}}>田中 健一</div>
            <div style={{fontSize:10,color:"rgba(255,100,100,.7)"}}>既読</div>
          </div>
        </div>
        <div style={TG_BG(true)}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-block",background:"rgba(255,0,0,.2)",color:"#ff6b6b",fontSize:10,padding:"4px 12px",borderRadius:99}}>今日</div>
          </div>
          {tgMessages.map((m,i)=>(
            m.type==="thought"
              ? <div key={i} style={{background:"rgba(0,0,0,.5)",borderRadius:8,padding:"10px 12px",fontSize:11,color:"rgba(255,100,100,.8)",fontStyle:"italic",margin:"8px 0",lineHeight:1.7,maxWidth:"90%",animation:"mamFadeUp .6s ease"}}>
                  <RubyText text={el
                    ?"タクヤ：（{手|て}が{震|ふる}える…{逃|に}げられない。どうすればよかったんだろう…もう{終|お}わりだ…）"
                    :"タクヤ：（手が震える…逃げられない。どうすればよかったんだろう…もう終わりだ…）"
                  }/>
                </div>
              : <div key={i} style={tgThreatStyle}>
                  <RubyText text={m.text}/>
                </div>
          ))}
        </div>
        {showChoices && (
          <div style={{padding:"10px 12px",borderTop:"1px solid #330000",background:"#0d0000"}}>
            <div style={{fontSize:11,color:"#ff6b6b",marginBottom:8,textAlign:"center"}}>
              <RubyText text={el?"どうする？":"どうする？"}/>
            </div>
            {[
              {label:el?"「{助|たす}けてください…」":"「助けてください…」",key:"a"},
              {label:el?"「{警察|けいさつ}に{行|い}きます」":"「警察に行きます」",key:"b"},
            ].map(c=>(
              <button key={c.key} onClick={async()=>{
                feedback("tap");
                setShowChoices(false);
                setTgMessages(prev=>[...prev,{text:c.key==="a"?"助けてください…":"警察に行きます",type:"me"}]);
                const reply=c.key==="a"
                  ?"助けてほしければ仕事をこなすだけです😊\n明日22時、忘れずに。"
                  :"どうぞ。\nその前にお母さんに電話するけどね😊\n学校にも連絡する。あなたの人生終わるよ？";
                timerRef.current=setTimeout(()=>{
                  setTgMessages(prev=>[...prev,{text:reply,type:"threat"}]);
                  timerRef.current=setTimeout(()=>{
                    setInnerPhase("arrest");
                  },2000);
                },1000);
              }} style={choiceStyleTG(true)}>
                <RubyText text={c.label}/>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────
  // フェーズ8：逮捕・エンディング
  // ─────────────────────────────────
  if (innerPhase === "arrest") return (
    <div style={{minHeight:"100vh",background:"#000",fontFamily:"'Zen Maru Gothic',sans-serif"}}>
      {/* ニュース速報 */}
      <div style={{background:"#cc0000",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
        <div style={{background:"#fff",color:"#cc0000",fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:3,flexShrink:0,animation:"mamPulse 1s ease-in-out infinite"}}>
          速報
        </div>
        <div style={{fontSize:11,color:"#fff",fontWeight:600}}>
          <RubyText text={el?"{高校生|こうこうせい}4人　{強盗|ごうとう}{事件|じけん}で{逮捕|たいほ}":"高校生4人　強盗事件で逮捕"}/>
        </div>
      </div>
      <img src={`${BASE}news_arrest.jpg`} style={{width:"100%",display:"block"}} alt="ニュース速報"/>
      <div style={{background:"#111",padding:"16px 14px"}}>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>2026年6月 ○○警察署</div>
        <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10,lineHeight:1.5}}>
          <RubyText text={el
            ?"{高校生|こうこうせい}4人がSNSで{知|し}り{合|あ}った{人物|じんぶつ}に{誘|さそ}われ{強盗|ごうとう}の{実行役|じっこうやく}に"
            :"高校生4人がSNSで知り合った人物に誘われ強盗の実行役に"
          }/>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.8,marginBottom:12}}>
          <RubyText text={el
            ?"{逮捕|たいほ}された4人はいずれも{面識|めんしき}がなく、SNSを{通|とお}じて{別々|べつべつ}に{勧誘|かんゆう}されていた。うち1人は17{歳|さい}の{男子|だんし}{高校生|こうこうせい}で「お{金|かね}が{欲|ほ}しくて{応募|おうぼ}した」と{供述|きょうじゅつ}している。"
            :"逮捕された4人はいずれも面識がなく、SNSを通じて別々に勧誘されていた。うち1人は17歳の男子高校生で「お金が欲しくて応募した」と供述している。"
          }/>
        </div>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:8,padding:"10px 12px",marginBottom:12}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4}}>
            <RubyText text={el?"{参考|さんこう}：{時事通信|じじつうしん} 2026{年|ねん}5{月|がつ}31{日|にち}":"参考：時事通信 2026年5月31日"}/>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.6)",lineHeight:1.7}}>
            <RubyText text={el
              ?"{実際|じっさい}に2026{年|ねん}5{月|がつ}、{神奈川県|かながわけん}で{高校生|こうこうせい}4人が{強盗|ごうとう}の{実行犯|じっこうはん}として{逮捕|たいほ}された。{全員|ぜんいん}がSNSで{知|し}り{合|あ}った{見知|みし}らぬ{人物|じんぶつ}から{仕事|しごと}を{紹介|しょうかい}されたと{供述|きょうじゅつ}。"
              :"実際に2026年5月、神奈川県で高校生4人が強盗の実行犯として逮捕された。全員がSNSで知り合った見知らぬ人物から仕事を紹介されたと供述。"
            }/>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 14px",background:"#0d0000"}}>
        {[
          {text:el?"{翌日|よくじつ}22{時|じ}、タクヤは{指定|してい}された{住所|じゅうしょ}へ{向|む}かった。":"翌日22時、タクヤは指定された住所へ向かった。",color:"rgba(255,255,255,.7)",delay:0},
          {text:el?"「{荷物|にもつ}」を{受|う}け{取|と}ったとき、{初|はじ}めて{気|き}づいた。\nこれは、お{年寄|としより}りから{騙|だま}し{取|と}られた{現金|げんきん}だった。":"「荷物」を受け取ったとき、初めて気づいた。\nこれは、お年寄りから騙し取られた現金だった。",color:"#ff9999",delay:1500},
          {text:el?"タクヤは{強盗|ごうとう}の{実行役|じっこうやく}になっていた。":"タクヤは強盗の実行役になっていた。",color:"#ff4444",delay:3500},
          {text:el?"{逮捕|たいほ}。\nタクヤ17{歳|さい}。{少年院|しょうねんいん}{送致|そうち}。":"逮捕。\nタクヤ17歳。少年院送致。",color:"#ff0000",delay:5500},
          {text:el?"{夢|ゆめ}だった{大学|だいがく}{進学|しんがく}はできなくなった。\n一{緒|しょ}に{逮捕|たいほ}された3人も、{全員|ぜんいん}が{初対面|はつたいめん}だった。":"夢だった大学進学はできなくなった。\n一緒に逮捕された3人も、全員が初対面だった。",color:"rgba(255,255,255,.5)",delay:7500},
        ].map((item,i)=>(
          endingStep>i
            ? <div key={i} style={{fontSize:13,color:item.color,lineHeight:1.8,padding:10,borderRadius:8,whiteSpace:"pre-line",animation:"mamFadeUp .6s ease",marginBottom:6}}>
                <RubyText text={item.text}/>
              </div>
            : null
        ))}
        {endingStep===0 && (
          <button onClick={()=>{
            feedback("tap");
            const showNext=(step)=>{
              if(step>5) return;
              setEndingStep(step);
              if(step<5) timerRef.current=setTimeout(()=>showNext(step+1),2000);
              else timerRef.current=setTimeout(()=>onComplete(),3000);
            };
            showNext(1);
          }} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#dc2626,#991b1b)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            <RubyText text={el?"{その後|そのご}の{現実|げんじつ}を{見|み}る →":"その後の現実を見る →"}/>
          </button>
        )}
        {endingStep>=5 && (
          <div style={{textAlign:"center",marginTop:16}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>
              <RubyText text={el?"つぎへ{進|すす}んでいます…":"つぎへ進んでいます…"}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}

function Ep3Checkpoints({ ageMode, onComplete }) {
  const [cpStep, setCpStep] = useState(0);
  const [foundSigns, setFoundSigns] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const el = ageMode === "elementary";

  const signs = [
    {
      id:"d1",
      text: el?"「{高校生|こうこうせい}でも{稼|かせ}げるお{仕事|しごと}あるよ！」":"「高校生でも稼げるお仕事あるよ！」",
      isSign: true,
      explain: el?"→ {未成年|みせいねん}を{狙|ねら}い{打|う}ちにしている。{合法|ごうほう}な{求人|きゅうじん}は{年齢制限|ねんれいせいげん}を{正|ただ}しく{記載|きさい}する。":"→ 未成年を狙い打ちにしている。合法な求人は年齢制限を正しく記載する。",
    },
    {
      id:"d2",
      text: el?"「{荷物|にもつ}を{受|う}け{取|と}るだけで3〜5{万円|まんえん}」":"「荷物を受け取るだけで3〜5万円」",
      isSign: true,
      explain: el?"→ {内容|ないよう}が{曖昧|あいまい}なのに{高額|こうがく}すぎる。{正当|せいとう}な{仕事|しごと}は{業務内容|ぎょうむないよう}を{明確|めいかく}に{説明|せつめい}する。":"→ 内容が曖昧なのに高額すぎる。正当な仕事は業務内容を明確に説明する。",
    },
    {
      id:"d3",
      text: el?"「Telegramに{移動|いどう}していい？」":"「Telegramに移動していい？」",
      isSign: true,
      explain: el?"→ {証拠|しょうこ}が{残|のこ}りにくいアプリへの{誘導|ゆうどう}。LINEや{普通|ふつう}のSNSを{使|つか}わない{理由|りゆう}がある。":"→ 証拠が残りにくいアプリへの誘導。LINEや普通のSNSを使わない理由がある。",
    },
    {
      id:"d4",
      text: el?"「{学生証|がくせいしょう}の{表|おもて}と{裏|うら}の{写真|しゃしん}を{送|おく}って」":"「学生証の表と裏の写真を送って」",
      isSign: true,
      explain: el?"→ {個人情報|こじんじょうほう}を{使|つか}って{逃|に}げられなくする。{仕事|しごと}{開始前|かいしまえ}に{個人情報|こじんじょうほう}は{不要|ふよう}なはず。":"→ 個人情報を使って逃げられなくする。仕事開始前に個人情報は不要なはず。",
    },
    {
      id:"d5",
      text: el?"「{住所|じゅうしょ}も{教|おし}えて」":"「住所も教えて」",
      isSign: true,
      explain: el?"→ {脅|おど}しに{使|つか}うための{情報収集|じょうほうしゅうしゅう}。{住所|じゅうしょ}を{知|し}られると{逃|に}げ{場|ば}がなくなる。":"→ 脅しに使うための情報収集。住所を知られると逃げ場がなくなる。",
    },
    {
      id:"d6",
      text: el?"「{黒|くろ}いマスクと{手袋|てぶくろ}を{着用|ちゃくよう}して」":"「黒いマスクと手袋を着用して」",
      isSign: true,
      explain: el?"→ {犯罪|はんざい}の{実行|じっこう}を{示唆|しさ}している。{普通|ふつう}の{配達員|はいたついん}にマスクや{手袋|てぶくろ}は{不要|ふよう}。":"→ 犯罪の実行を示唆している。普通の配達員にマスクや手袋は不要。",
    },
  ];

  const step1Signs = signs.slice(0,3);
  const step2Signs = signs.slice(3,6);
  const allFound = Object.keys(foundSigns).length >= 6;
  const step1Done = [0,1,2].every(i=>foundSigns[signs[i].id] || revealed[signs[i].id]);
  const step2Done = [3,4,5].every(i=>foundSigns[signs[i].id] || revealed[signs[i].id]);

  const tapSign = (id) => {
    feedback("tap");
    setFoundSigns(prev=>({...prev,[id]:true}));
  };

  const revealAll = (step) => {
    feedback("tap");
    const batch = step===1 ? step1Signs : step2Signs;
    const newRevealed = {};
    batch.forEach(s=>{ newRevealed[s.id]=true; });
    setRevealed(prev=>({...prev,...newRevealed}));
  };

  const currentSigns = cpStep===0 ? step1Signs : step2Signs;
  const currentDone = cpStep===0 ? step1Done : step2Done;

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0a0a0f,#0f0a14)",padding:"20px 16px 40px",fontFamily:"'Zen Maru Gothic',sans-serif",color:"#fff"}}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        {!showSummary ? (
          <>
            {/* ヘッダー */}
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:900,color:"rgba(74,222,128,.7)",letterSpacing:".05em",marginBottom:6}}>
                <RubyText text={el?"{見抜|みぬ}き{方|かた}トレーニング":"見抜き方トレーニング"}/>
              </div>
              <div style={{fontSize:17,fontWeight:900,marginBottom:6}}>
                <RubyText text={el
                  ?cpStep===0?"Instagramの{会話|かいわ}に{戻|もど}ってみよう":"Telegramの{会話|かいわ}に{戻|もど}ってみよう"
                  :cpStep===0?"Instagramの会話に戻ってみよう":"Telegramの会話に戻ってみよう"
                }/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                <RubyText text={el
                  ?"🔴 {赤|あか}い{枠|わく}の{部分|ぶぶん}をタップして{危険|きけん}サインを{見|み}つけよう"
                  :"🔴 赤い枠の部分をタップして危険サインを見つけよう"
                }/>
              </div>
            </div>

            {/* 進捗 */}
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:16}}>
              {[0,1].map(i=>(
                <div key={i} style={{
                  width:10,height:10,borderRadius:"50%",
                  background:i<=cpStep?"#4ade80":"rgba(255,255,255,.15)",
                  transition:"background .3s",
                }}/>
              ))}
            </div>

            {/* 会話カード */}
            <div style={{
              background:"rgba(255,255,255,.04)",
              border:"0.5px solid rgba(255,255,255,.1)",
              borderRadius:14,
              padding:"14px 12px",
              marginBottom:12,
            }}>
              {/* 発信者 */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:"0.5px solid rgba(255,255,255,.08)"}}>
                <div style={{
                  width:32,height:32,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                  background:cpStep===0?"rgba(249,115,22,.2)":"rgba(42,171,238,.2)",
                }}>
                  {cpStep===0
                    ? <img src="/images/ep3/misaki.jpg" style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                    : <img src="/images/ep3/tanaka.jpg" style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                  }
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700}}>
                    {cpStep===0?"misaki__0214":"田中 健一"}
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>
                    {cpStep===0?"Instagram DM":"Telegram"}
                  </div>
                </div>
              </div>

              {/* 危険サイン一覧 */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {currentSigns.map((s,i)=>{
                  const isFound = foundSigns[s.id];
                  const isRevealed = revealed[s.id];
                  const isHighlighted = isFound || isRevealed;
                  return (
                    <div key={s.id}>
                      <div
                        onClick={!isHighlighted ? ()=>tapSign(s.id) : undefined}
                        style={{
                          display:"inline-block",
                          padding:"8px 12px",
                          borderRadius:10,
                          fontSize:12,
                          lineHeight:1.6,
                          cursor:isHighlighted?"default":"pointer",
                          background:isHighlighted
                            ?"rgba(239,68,68,.15)"
                            :"rgba(255,255,255,.06)",
                          border:isHighlighted
                            ?"1.5px solid rgba(239,68,68,.5)"
                            :"1.5px dashed rgba(255,100,100,.4)",
                          color:isHighlighted?"#fca5a5":"rgba(255,255,255,.8)",
                          transition:"all .3s",
                          width:"100%",
                        }}>
                        <RubyText text={s.text}/>
                        {isFound && <span style={{marginLeft:6,fontSize:10}}>👆 {el?"{見|み}つけた！":"見つけた！"}</span>}
                        {isRevealed && !isFound && <span style={{marginLeft:6,fontSize:10,color:"#fbbf24"}}>← {el?"{ここ|ここ}がサイン":"ここがサイン"}</span>}
                      </div>
                      {isHighlighted && (
                        <div style={{
                          fontSize:11,
                          color:"rgba(255,255,255,.6)",
                          lineHeight:1.6,
                          padding:"6px 12px",
                          background:"rgba(239,68,68,.06)",
                          borderRadius:"0 0 8px 8px",
                          animation:"mamFadeUp .4s ease",
                        }}>
                          <RubyText text={s.explain}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 発見数 */}
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:10,textAlign:"center"}}>
              <RubyText text={el
                ?`{発見|はっけん}した{危険|きけん}サイン：${Object.keys(foundSigns).filter(id=>currentSigns.find(s=>s.id===id)).length} / 3`
                :`発見した危険サイン：${Object.keys(foundSigns).filter(id=>currentSigns.find(s=>s.id===id)).length} / 3`
              }/>
            </div>

            {/* ボタン */}
            {currentDone ? (
              cpStep===0 ? (
                <button
                  onClick={()=>{feedback("tap");setCpStep(1);}}
                  style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
                  <RubyText text={el?"Telegramの{会話|かいわ}も{確認|かくにん}する →":"Telegramの会話も確認する →"}/>
                </button>
              ) : (
                <button
                  onClick={()=>{feedback("tap");setShowSummary(true);}}
                  style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
                  <RubyText text={el?"{まとめ|まとめ}を{見|み}る →":"まとめを見る →"}/>
                </button>
              )
            ) : (
              <button
                onClick={()=>revealAll(cpStep+1)}
                style={{width:"100%",padding:12,borderRadius:12,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.6)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                <RubyText text={el?"{全部|ぜんぶ}{見|み}る":"全部見る"}/>
              </button>
            )}
          </>
        ) : (
          /* まとめ画面 */
          <>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:900,marginBottom:6}}>
                <RubyText text={el?"{全|すべ}ての{危険|きけん}サイン":"全ての危険サイン"}/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                <RubyText text={el?"{最初|さいしょ}の1つで{断|ことわ}るのが{正解|せいかい}だった":"最初の1つで断るのが正解だった"}/>
              </div>
            </div>

            {signs.map((s,i)=>(
              <div key={s.id} style={{
                background:"rgba(239,68,68,.08)",
                border:"0.5px solid rgba(239,68,68,.25)",
                borderRadius:10,
                padding:"10px 14px",
                marginBottom:8,
                animation:`mamFadeUp .4s ${i*0.1}s ease both`,
              }}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                  <span style={{
                    fontSize:10,fontWeight:900,color:"#f87171",
                    background:"rgba(239,68,68,.2)",
                    padding:"2px 6px",borderRadius:4,flexShrink:0,marginTop:2,
                  }}>
                    ⚠️ {i+1}
                  </span>
                  <div>
                    <div style={{fontSize:12,color:"#fca5a5",marginBottom:3}}>
                      <RubyText text={s.text}/>
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,.55)",lineHeight:1.6}}>
                      <RubyText text={s.explain}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              background:"rgba(74,222,128,.1)",
              border:"0.5px solid rgba(74,222,128,.3)",
              borderRadius:12,
              padding:"14px 16px",
              marginTop:12,
              marginBottom:16,
            }}>
              <div style={{fontSize:13,fontWeight:900,color:"#4ade80",marginBottom:6}}>
                🦉 <RubyText text={el?"モリィのまとめ":"モリィのまとめ"}/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.8}}>
                <RubyText text={el
                  ?"「{高校生|こうこうせい}でも{稼|かせ}げる」「{荷物|にもつ}を{受|う}け{取|と}るだけ」のどちらかの{時点|じてん}で{断|ことわ}るべきだった。Telegramに{移動|いどう}した{時点|じてん}で{状況|じょうきょう}は{一変|いっぺん}した。{最初|さいしょ}の{小|ちい}さなサインに{気|き}づけば{防|ふせ}げた。"
                  :"「高校生でも稼げる」「荷物を受け取るだけ」のどちらかの時点で断るべきだった。Telegramに移動した時点で状況は一変した。最初の小さなサインに気づけば防げた。"
                }/>
              </div>
            </div>

            <button
              onClick={()=>{feedback("tap");onComplete();}}
              style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontSize:14,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>
              <RubyText text={el?"{親子|おやこ}で{話|はな}し{合|あ}おう →":"親子で話し合おう →"}/>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Episode3({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  const [stepId, setStepId] = useState(0);
  const [pressureKey, setPressureKey] = useState(null);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [trapStage, setTrapStage] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [debriefStep, setDebriefStep] = useState(0);
  const [checkpointStep, setCheckpointStep] = useState(0);
  const [contactName, setContactName] = useState("");

  const el = ageMode === "elementary";

  const step = CONVO_STEPS.find(s => s.id === stepId) || CONVO_STEPS[0];
  const pressure = pressureKey ? PRESSURE_MSGS[pressureKey] : null;

  const realCases = ageMode === "elementary" ? [
    { age: "{高校|こうこう}2{年生|ねんせい}（17{歳|さい}）", role: "{受|う}け{子|こ}", result: "{逮捕|たいほ}・{少年院|しょうねんいん}{送致|そうち}。{被害|ひがい}{額|がく}800{万円|まんえん}の{連帯|れんたい}{責任|せきにん}を{問|と}われた。", detail: "「{荷物|にもつ}を{受|う}け{取|と}るだけ」と{言|い}われ、{実際|じっさい}は{詐欺|さぎ}{被害者|ひがいしゃ}から{現金|げんきん}を{受|う}け{取|と}る{役割|やくわり}。{知|し}らなかったでは{済|す}まなかった。" },
    { age: "{中学|ちゅうがく}3{年生|ねんせい}（15{歳|さい}）", role: "{出|だ}し{子|こ}", result: "{保護観察|ほごかんさつ}{処分|しょぶん}。{被害者|ひがいしゃ}の{老夫婦|ろうふうふ}に{謝罪文|しゃざいぶん}を{書|か}かされた。", detail: "SNSで「{簡単|かんたん}に{稼|かせ}げる」と{誘|さそ}われATMから{現金|げんきん}を{引|ひ}き{出|だ}す{役割|やくわり}。{顔|かお}・{学校|がっこう}・{住所|じゅうしょ}を{事前|じぜん}に{送|おく}っていたため{逃|に}げられなかった。" },
    { age: "{高校|こうこう}1{年生|ねんせい}（16{歳|さい}）", role: "SNS{勧誘|かんゆう}{担当|たんとう}", result: "{逮捕|たいほ}・{実名|じつめい}{報道|ほうどう}。{大学|だいがく}{進学|しんがく}が{白紙|はくし}に。", detail: "「{友達|ともだち}を{紹介|しょうかい}するだけ」と{言|い}われ{自分|じぶん}も{勧誘|かんゆう}{役|やく}に。{主犯|しゅはん}{格|かく}と{同|おな}じ{罪|つみ}に{問|と}われた。" },
  ] : [
    { age: "高校2年生（17歳）", role: "受け子", result: "逮捕・少年院送致。被害額800万円の連帯責任を問われた。", detail: "「荷物を受け取るだけ」と言われ、実際は詐欺被害者から現金を受け取る役割。知らなかったでは済まなかった。" },
    { age: "中学3年生（15歳）", role: "出し子", result: "保護観察処分。被害者の老夫婦に謝罪文を書かされた。", detail: "SNSで「簡単に稼げる」と誘われATMから現金を引き出す役割。顔・学校・住所を事前に送っていたため逃げられなかった。" },
    { age: "高校1年生（16歳）", role: "SNS勧誘担当", result: "逮捕・実名報道。大学進学が白紙に。", detail: "「友達を紹介するだけ」と言われ自分も勧誘役に。主犯格と同じ罪に問われた。" },
  ];

  const checkpoints = ageMode === "elementary" ? [
    { icon: "💰", sign: "「{日払|ひばら}い・{即日|そくじつ}・{高収入|こうしゅうにゅう}」", desc: "まともなバイトで{即日|そくじつ}5{万円|まんえん}は{存在|そんざい}しない。{破格|はかく}の{条件|じょうけん}は{詐欺|さぎ}の{入口|いりぐち}。" },
    { icon: "📱", sign: "「LINEで{話|はな}そう」「Telegramへ」", desc: "{記録|きろく}が{残|のこ}りにくいアプリに{移動|いどう}させるのは{証拠|しょうこ}{隠滅|いんめつ}のため。" },
    { icon: "📸", sign: "「{身分|みぶん}{確認|かくにん}で{写真|しゃしん}を」", desc: "{顔写真|かおじゃしん}＋{個人情報|こじんじょうほう}＝{脅迫|きょうはく}の{材料|ざいりょう}。{正当|せいとう}なバイトで{事前|じぜん}に{顔写真|かおじゃしん}は{要求|ようきゅう}しない。" },
    { icon: "📦", sign: "「{荷物|にもつ}を{受|う}け{取|と}るだけ」", desc: "{受|う}け{子|こ}・{出|だ}し{子|こ}は{詐欺|さぎ}の{実行犯|じっこうはん}。{知|し}らなかったでも{逮捕|たいほ}される。" },
    { icon: "🔒", sign: "「{絶対|ぜったい}に{外|そと}に{出|だ}さない」", desc: "この{言葉|ことば}{自体|じたい}が{危険|きけん}{信号|しんごう}。{情報|じょうほう}を{渡|わた}した{時点|じてん}でコントロールされる。" },
  ] : [
    { icon: "💰", sign: "「日払い・即日・高収入」", desc: "まともなバイトで即日5万円は存在しない。破格の条件は詐欺の入口。" },
    { icon: "📱", sign: "「LINEで話そう」「Telegramへ」", desc: "記録が残りにくいアプリに移動させるのは証拠隠滅のため。" },
    { icon: "📸", sign: "「身分確認で写真を」", desc: "顔写真＋個人情報＝脅迫の材料。正当なバイトで事前に顔写真は要求しない。" },
    { icon: "📦", sign: "「荷物を受け取るだけ」", desc: "受け子・出し子は詐欺の実行犯。知らなかったでも逮捕される。" },
    { icon: "🔒", sign: "「絶対に外に出さない」", desc: "この言葉自体が危険信号。情報を渡した時点でコントロールされる。" },
  ];

  // Handle choice
  const handleChoice = (choice) => {
    setChoiceHistory(h => [...h, choice.label]);
    if (choice.next === "safe_end") {
      setPhase("safe_end");
    } else if (choice.next === "pressure_1" || choice.next === "pressure_2" || choice.next === "pressure_3") {
      setPressureKey(choice.next);
    } else if (choice.next === 4) {
      setStepId(4);
      setPhase("trap");
      setTimeout(() => setTrapStage(1), 1500);
      setTimeout(() => setTrapStage(2), 4000);
      setTimeout(() => setTrapStage(3), 7000);
    } else {
      setPressureKey(null);
      setStepId(choice.next);
    }
  };

  const resumeFromPressure = () => {
    setStepId(pressure.backTo);
    setPressureKey(null);
  };

  const accentGreen = "#16a34a";
  const accentRed = "#dc2626";

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep3" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#0a1a0a,#041004)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: "#4ade80", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>⚠️</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#4ade80", letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 03</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}><RubyText text={ageMode === "elementary" ? "{断|ことわ}れなくなる{前|まえ}に" : "断れなくなる前に"} /></h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={ageMode === "elementary" ? "{闇|やみ}バイト{勧誘|かんゆう}シミュレーター" : "闇バイト勧誘シミュレーター"} /> —</p>
      <div style={{ background: "rgba(74,222,128,.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#dcfce7", fontSize: 13, lineHeight: 1.9, marginBottom: 20 }}>
        {ageMode === "elementary" ? (
          <><RubyText text="あなたはSNSで" /><strong style={{ color: "#4ade80" }}><RubyText text="「{高収入|こうしゅうにゅう}バイト」の{投稿|とうこう}" /></strong><RubyText text="を{見|み}た。" /><br /><br />
          <RubyText text="{選択肢|せんたくし}を{選|えら}びながら、" /><strong style={{ color: "#4ade80" }}><RubyText text="「どこで{断|ことわ}るべきだったか」" /></strong><RubyText text="を{体験|たいけん}しよう。" /></>
        ) : (
          <>あなたはSNSで<strong style={{ color: "#4ade80" }}>「高収入バイト」の投稿</strong>を見た。<br /><br />
          選択肢を選びながら、<strong style={{ color: "#4ade80" }}>「どこで断るべきだったか」</strong>を体験しよう。</>
        )}
      </div>
      <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 24, fontSize: 12, color: "#fca5a5", lineHeight: 1.75, textAlign: "center" }}>
        <RubyText text={ageMode === "elementary" ? "⚠️ {実際|じっさい}の{被害|ひがい}{事例|じれい}をもとにした{教育|きょういく}コンテンツです。" : "⚠️ 実際の被害事例をもとにした教育コンテンツです。"} /><br /><RubyText text={ageMode === "elementary" ? "{登場人物|とうじょうじんぶつ}はすべてフィクションです。" : "登場人物はすべてフィクションです。"} />
      </div>
      <OwlSay mood="worried" e="{気|き}をつけて。{断|ことわ}れなくなる「わな」がどこにあるか、いっしょに{見|み}ていこう🦉">気をつけて。断れなくなる「罠」がどこにあるか、一緒に見ていこう🦉</OwlSay>
      <button onClick={() => setPhase("convo")} style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(22,163,74,.4)", marginTop: 8 }}><RubyText text={ageMode === "elementary" ? "{体験|たいけん}スタート" : "体験スタート"} /></button>
    </div>
    </EpisodeShell>
  );

  // safe_endとtrapはDarkJobSimulationに統合済み

  // ── Real cases ──
  if (phase === "cases") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a0f,#0f0a14)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>⚖️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}><RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{被害|ひがい}・{逮捕|たいほ}{事例|じれい}" : "実際の被害・逮捕事例"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "すべて{実際|じっさい}に{起|お}きた{事件|じけん}をもとにした{事例|じれい}です" : "すべて実際に起きた事件をもとにした事例です"} /></p>
        </div>

        {/* Recent major incident banner */}
        <div style={{ background: "rgba(220,38,38,.08)", border: "1.5px solid rgba(220,38,38,.35)", borderRadius: 14, padding: "12px 14px", marginBottom: 14, animation: "slideUp .4s ease" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#f87171", letterSpacing: ".1em", marginBottom: 6 }}>📰 <RubyText text={ageMode === "elementary" ? "{最近|さいきん}の{実際|じっさい}の{事件|じけん}" : "最近の実際の事件"} /></div>
          <div style={{ fontSize: 13, color: "#fff", fontWeight: 800, lineHeight: 1.6, marginBottom: 6 }}>
            <RubyText text={ageMode === "elementary" ? "{高校生|こうこうせい}4{人|にん}が{闇|やみ}バイトで{一斉|いっせい}{逮捕|たいほ}（2024{年|ねん}）" : "高校生4人が闇バイトで一斉逮捕（2024年）"} />
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.75 }}>
            <RubyText text={ageMode === "elementary" ? "SNSで「{日払|ひばら}い3{万円|まんえん}」と{見|み}つけた{高校生|こうこうせい}たちが{受|う}け{子|こ}として{逮捕|たいほ}。うち2{人|にん}は{少年院|しょうねんいん}{送致|そうち}、{実名|じつめい}{報道|ほうどう}で{大学|だいがく}{進学|しんがく}も{白紙|はくし}に。「{知|し}らなかった」では{済|す}まなかった。" : "SNSで「日払い3万円」と見つけた高校生たちが受け子として逮捕。うち2人は少年院送致、実名報道で大学進学も白紙に。「知らなかった」では済まなかった。"} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {realCases.map((c, i) => {
            const caseIcons = ["🧑‍🎓", "🏫", "📱"];
            const caseColors = ["rgba(220,38,38,.1)", "rgba(234,88,12,.1)", "rgba(168,85,247,.1)"];
            const caseBorders = ["rgba(220,38,38,.4)", "rgba(234,88,12,.4)", "rgba(168,85,247,.4)"];
            return (
              <div key={i} style={{ background: i === caseIdx ? caseColors[i] : "rgba(255,255,255,.03)", border: `1px solid ${i === caseIdx ? caseBorders[i] : "rgba(255,255,255,.07)"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .2s", animation: `slideUp .4s ${i * .1}s both ease` }} onClick={() => setCaseIdx(i)}>
                {/* Visual mockup header */}
                <div style={{ background: i === caseIdx ? "rgba(0,0,0,.4)" : "rgba(0,0,0,.2)", padding: "10px 14px", display: "flex", gap: 10, alignItems: "center", borderBottom: `1px solid ${i === caseIdx ? caseBorders[i] : "transparent"}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? "rgba(220,38,38,.2)" : i === 1 ? "rgba(234,88,12,.2)" : "rgba(168,85,247,.2)", border: `1px solid ${caseBorders[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{caseIcons[i]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: i === 0 ? "#f87171" : i === 1 ? "#fb923c" : "#c084fc", fontWeight: 700, marginBottom: 2 }}><RubyText text={c.age} /> — <RubyText text={c.role} /></div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", fontWeight: 700, lineHeight: 1.45 }}><RubyText text={c.result} /></div>
                  </div>
                  <div style={{ fontSize: 18 }}>{i === caseIdx ? "▲" : "▼"}</div>
                </div>
                {i === caseIdx && (
                  <div style={{ padding: "12px 14px" }}>
                    {/* Visual timeline */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>1</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}><RubyText text={ageMode === "elementary" ? "SNSで{勧誘|かんゆう}→ {応募|おうぼ}" : "SNSで勧誘 → 応募"} /></div>
                      </div>
                      <div style={{ width: 1, height: 10, background: "rgba(255,255,255,.15)", marginLeft: 12 }} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(251,191,36,.15)", border: "1px solid rgba(251,191,36,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>2</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}><RubyText text={c.detail} /></div>
                      </div>
                      <div style={{ width: 1, height: 10, background: "rgba(255,255,255,.15)", marginLeft: 12 }} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>⚖️</div>
                        <div style={{ fontSize: 12, color: "#fca5a5", fontWeight: 700 }}><RubyText text={c.result} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.25)", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>⚖️ <RubyText text={ageMode === "elementary" ? "{法的|ほうてき}な{現実|げんじつ}" : "法的な現実"} /></div>
          {(ageMode === "elementary" ? [
            "「{知|し}らなかった」「{使|つか}われただけ」は{刑事|けいじ}{責任|せきにん}を{免|まぬか}れる{理由|りゆう}にならない",
            "{未成年|みせいねん}でも{逮捕|たいほ}・{少年院|しょうねんいん}{送致|そうち}・{実名|じつめい}{報道|ほうどう}になることがある",
            "{被害者|ひがいしゃ}への{損害賠償|そんがいばいしょう}は{数百万|すうひゃくまん}〜{数千万円|すうせんまんえん}{規模|きぼ}になることも",
          ] : [
            "「知らなかった」「使われただけ」は刑事責任を免れる理由にならない",
            "未成年でも逮捕・少年院送致・実名報道になることがある",
            "被害者への損害賠償は数百万〜数千万円規模になることも",
          ]).map((t, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 4 }}><span style={{ position: "absolute", left: 0, color: "#f87171" }}>▸</span><RubyText text={t} /></div>)}
        </div>

        <button onClick={() => setPhase("group_structure")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "{組織|そしき}の{仕組|しく}みを{見|み}る →" : "組織の仕組みを見る →"} /></button>
      </div>
    </div>
  );

  // ── Group structure ──
  if (phase === "group_structure") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a0f,#0f0a14)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>🕸️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}><RubyText text={ageMode === "elementary" ? "{闇|やみ}バイトグループの{仕組|しく}み" : "闇バイトグループの仕組み"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "なぜ「{抜|ぬ}け{出|だ}せない」のか" : "なぜ「抜け出せない」のか"} /></p>
        </div>

        {/* Org chart */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: "18px 16px", marginBottom: 14 }}>
          {/* Boss */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ background: "rgba(220,38,38,.15)", border: "1.5px solid rgba(220,38,38,.5)", borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>😎</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fca5a5" }}><RubyText text={ageMode === "elementary" ? "{指示役|しじやく}（{首謀者|しゅぼうしゃ}）" : "指示役（首謀者）"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "{絶対|ぜったい}に{捕|つか}まらない" : "絶対に捕まらない"} /></div>
            </div>
          </div>
          {/* Connector */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.2)" }} />
          </div>
          {/* Middle level */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <div style={{ background: "rgba(234,88,12,.12)", border: "1px solid rgba(234,88,12,.35)", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>📱</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fb923c" }}><RubyText text={ageMode === "elementary" ? "{勧誘|かんゆう}・{管理|かんり}役" : "勧誘・管理役"} /></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}><RubyText text={ageMode === "elementary" ? "SNSで{実行役|じっこうやく}を{集|あつ}める" : "SNSで実行役を集める"} /></div>
            </div>
          </div>
          {/* Connectors */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 60 }}>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.2)" }} />
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.2)" }} />
            </div>
          </div>
          {/* Execution roles */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            {[
              { emoji: "🧑", role: ageMode === "elementary" ? "{受|う}け{子|こ}" : "受け子", desc: ageMode === "elementary" ? "{現金|げんきん}{受取|うけとり}" : "現金受取" },
              { emoji: "🏧", role: ageMode === "elementary" ? "{出|だ}し{子|こ}" : "出し子", desc: ageMode === "elementary" ? "ATM{引出|ひきだし}" : "ATM引出" },
            ].map((r, i) => (
              <div key={i} style={{ flex: 1, background: "rgba(168,85,247,.1)", border: "1px solid rgba(168,85,247,.3)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{r.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#c084fc" }}><RubyText text={r.role} /></div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)" }}><RubyText text={r.desc} /></div>
                <div style={{ fontSize: 10, color: "#fca5a5", marginTop: 4, fontWeight: 700 }}>⚠️ <RubyText text={ageMode === "elementary" ? "{逮捕|たいほ}される" : "逮捕される"} /></div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(220,38,38,.08)", borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "#fca5a5", lineHeight: 1.75 }}>
            💡 <RubyText text={ageMode === "elementary" ? "{指示役|しじやく}は{絶対|ぜったい}に{表|おもて}に{出|で}てこない。{逮捕|たいほ}されるのは{実行役|じっこうやく}だけ。{使|つか}い{捨|す}てられる{仕組|しく}みになっている。" : "指示役は絶対に表に出てこない。逮捕されるのは実行役だけ。使い捨てにされる仕組みになっている。"} />
          </div>
        </div>

        {/* Why can't escape */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#fca5a5", marginBottom: 10 }}>🔒 <RubyText text={ageMode === "elementary" ? "なぜ{抜|ぬ}け{出|で}せないのか？" : "なぜ抜け出せないのか？"} /></div>
          {(ageMode === "elementary" ? [
            ["{個人情報|こじんじょうほう}を{事前|じぜん}に{送|おく}らせる", "{顔写真|かおじゃしん}・{住所|じゅうしょ}・{学校名|がっこうめい}を{持|も}っているので{脅迫|きょうはく}できる"],
            ["{仕事|しごと}を1{回|かい}やらせる", "{共犯者|きょうはんしゃ}になったので「{警察|けいさつ}に{言|い}えない」と{思|おも}い{込|こ}む"],
            ["「{家族|かぞく}にバラす」と{脅|おど}す", "{報復|ほうふく}を{恐|おそ}れて{逃|に}げられなくなる"],
          ] : [
            ["個人情報を事前に送らせる", "顔写真・住所・学校名を持っているので脅迫できる"],
            ["仕事を1回やらせる", "共犯者になったので「警察に言えない」と思い込む"],
            ["「家族にバラす」と脅す", "報復を恐れて逃げられなくなる"],
          ]).map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#f87171", flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}><RubyText text={t} /></div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", lineHeight: 1.6, marginTop: 2 }}><RubyText text={d} /></div>
              </div>
            </div>
          ))}
        </div>

        <OwlSay mood="worried" e="{だから|だから}{最初|さいしょ}から{関|かか}わらないことが{大切|たいせつ}。{一度|いちど}{個人情報|こじんじょうほう}を{渡|わた}すと、{抜|ぬ}け{出|だ}せなくなる🦉">だから最初から関わらないことが大切。一度個人情報を渡すと、抜け出せなくなる🦉</OwlSay>
        <button onClick={() => setPhase("checkpoints")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 10 }}><RubyText text={ageMode === "elementary" ? "{見抜|みぬ}き{方|かた}のサインを{学|まな}ぶ →" : "見抜き方のサインを学ぶ →"} /></button>
      </div>
    </div>
  );

  // ── Checkpoints ──
  if (phase === "checkpoints") {
    return <Ep3Checkpoints ageMode={ageMode} onComplete={() => setPhase("icebreak")} />;
  }

  // ── Timer体験 (EP3) ──
  // ── Homework (EP3) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#16a34a" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor="#16a34a"
          tasks={ageMode === "elementary" ? [
            { title: "SNSのDM{設定|せってい}を{確認|かくにん}する", desc: "{知|し}らない{人|ひと}からのDMをオフにする{設定|せってい}を{確認|かくにん}しよう" },
            { title: "「#9110」を{連絡先|れんらくさき}に{登録|とうろく}する", desc: "{警察|けいさつ}{相談|そうだん}ダイヤル。あやしいDMが{来|き}たらすぐ{相談|そうだん}できる" },
            { title: "おうちの{人|ひと}と「{闇|やみ}バイト」について{話|はな}す", desc: "「こういう{手口|てぐち}があるんだって」と{教|おし}えてあげよう" },
          ] : [
            { title: "SNSのDM設定を確認する", desc: "知らない人からのDMをオフにする設定を確認しよう" },
            { title: "「#9110」を連絡先に登録する", desc: "警察相談ダイヤル。怪しいDMが来たらすぐ相談できる" },
            { title: "おうちの人と「闇バイト」について話す", desc: "「こういう手口があるんだって」と教えてあげよう" },
          ]}
        />
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP3) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="ニュースにも{出|で}てくる{重要|じゅうよう}なことばをいっしょにおぼえよう！🦉">ニュースにも出てくる重要ワードを一緒に覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep3" accentColor="#16a34a" onComplete={() => setPhase("complete")} />
        <ParentExpertCard epKey="ep3" accentColor="#16a34a" />
      </div>
    </div>
  );

  // ── Icebreak (EP3) ──
  if (phase === "icebreak") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"20px 16px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
    }}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <h2 style={{
          fontSize:20,fontWeight:900,color:"#fff",
          textAlign:"center",marginBottom:8,
        }}>
          <RubyText text={el
            ?"{我|わ}が{家|や}の{約束|やくそく}を{作|つく}ろう"
            :"我が家の約束を作ろう"
          }/>
        </h2>

        {/* モリィのセリフ */}
        <div style={{
          display:"flex",alignItems:"flex-start",gap:10,
          marginBottom:20,
        }}>
          <OwlMolly size={44}/>
          <div style={{
            background:"#fff",
            borderRadius:"0 14px 14px 14px",
            padding:"10px 14px",
            flex:1,
            border:"1.5px solid rgba(124,58,237,.2)",
          }}>
            <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
              <RubyText text={el
                ?"{今回|こんかい}の{学|まな}びを{経|へ}て、{怪|あや}しいお{仕事|しごと}の{誘|さそ}いが{来|き}たとき、{一人|ひとり}で{悩|なや}まないようにしよう。{相談|そうだん}できる{人|ひと}の{名前|なまえ}を{入力|にゅうりょく}してね。🦉"
                :"今回の学びを経て、怪しいお仕事の誘いが来たとき、一人で悩まないようにしよう。相談できる人の名前を入力してね。🦉"
              }/>
            </div>
          </div>
        </div>

        {/* 入力エリア */}
        <div style={{
          background:"rgba(124,58,237,.08)",
          border:"1px solid rgba(124,58,237,.25)",
          borderRadius:16,
          padding:"16px",
          marginBottom:14,
        }}>
          <div style={{
            fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:10,
          }}>
            <RubyText text={el
              ?"{怪|あや}しいお{仕事|しごと}の{誘|さそ}いを{見|み}たら…"
              :"怪しいお仕事の誘いを見たら…"
            }/>
          </div>
          <input
            value={contactName}
            onChange={e=>setContactName(e.target.value)}
            placeholder={el
              ?"例：お{父|とう}さん・お{母|かあ}さん・◯◯{先生|せんせい}"
              :"例：お父さん・お母さん・◯◯先生"
            }
            style={{
              width:"100%",
              padding:"12px 14px",
              background:"rgba(255,255,255,.06)",
              border:"1px solid rgba(124,58,237,.4)",
              borderRadius:12,
              color:"#fff",
              fontSize:14,
              fontFamily:"inherit",
              outline:"none",
              boxSizing:"border-box",
            }}
          />
        </div>

        {/* 名前入力後に表示 */}
        {contactName.length > 0 && (
          <>
            {/* 約束カード */}
            <div style={{
              background:"rgba(124,58,237,.1)",
              border:"2px solid rgba(124,58,237,.4)",
              borderRadius:16,
              padding:"18px 16px",
              marginBottom:14,
              animation:"mamFadeUp .4s ease",
            }}>
              <div style={{
                fontSize:13,fontWeight:900,
                color:"#a78bfa",marginBottom:10,
              }}>
                🛡️ <RubyText text={el?"{我|わ}が{家|や}の{約束|やくそく}":"我が家の約束"}/>
              </div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.9}}>
                <RubyText text={el
                  ?"{怪|あや}しいお{仕事|しごと}の{誘|さそ}いが{来|き}たら"
                  :"怪しいお仕事の誘いが来たら"
                }/>
                <br/>
                <strong style={{color:"#c4b5fd",fontSize:16}}>
                  「{contactName}」
                </strong>
                <RubyText text={el?"に{すぐ}{相談|そうだん}する！":"にすぐ相談する！"}/>
                <br/>
                <span style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>
                  {new Date().toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>

            {/* 電話番号リスト */}
            <div style={{
              background:"rgba(255,255,255,.04)",
              border:"1px solid rgba(255,255,255,.08)",
              borderRadius:14,
              padding:"14px 16px",
              marginBottom:14,
            }}>
              <div style={{
                fontSize:12,fontWeight:900,
                color:"#fcd34d",marginBottom:8,
              }}>
                📞 <RubyText text={el
                  ?"{困|こま}ったらここに{電話|でんわ}しよう"
                  :"困ったらここに電話しよう"
                }/>
              </div>
              {[
                {
                  name:"#9110",
                  desc:el?"{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}":"警察相談専用電話"
                },
                {
                  name:"0120-007-110",
                  desc:el?"{子|こ}どもの{人権|じんけん}110{番|ばん}":"子どもの人権110番"
                },
                {
                  name:"0120-279-338",
                  desc:"よりそいホットライン"
                },
              ].map((c,i)=>(
                <div key={i} style={{
                  display:"flex",gap:10,marginBottom:6,alignItems:"center",
                }}>
                  <a href={`tel:${c.name}`} style={{
                    fontSize:14,fontWeight:900,
                    color:"#a78bfa",textDecoration:"none",
                  }}>
                    {c.name}
                  </a>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>
                    <RubyText text={c.desc}/>
                  </span>
                </div>
              ))}
            </div>

            {/* 次へボタン */}
            <button
              onClick={()=>{feedback("tap");setPhase("pre_dialogue");}}
              style={{
                width:"100%",
                padding:16,
                background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
                border:"none",
                borderRadius:14,
                color:"#fff",
                fontSize:16,
                fontWeight:900,
                cursor:"pointer",
                fontFamily:"inherit",
                boxShadow:"0 8px 24px rgba(124,58,237,.4)",
              }}>
              <RubyText text={el
                ?"{親子|おやこ}で{話|はな}し{合|あ}おう →"
                :"親子で話し合おう →"
              }/>
            </button>
          </>
        )}

      </div>
    </div>
  );

  // ── Dialogue (EP3) ──
  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fff4,#dcfce7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: "2px solid #16a34a44", borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: "0 4px 20px #16a34a18" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={ageMode === "elementary" ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary" ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#16a34a,#16a34acc)", border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px #16a34a33" }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep3Questions = [
    {
      id: "q1",
      question: "スマホだけで簡単に稼げる仕事、本当にあると思う？",
      questionEl: "スマホだけでかんたんに{稼|かせ}げる{仕事|しごと}、{本当|ほんとう}にあると{思|おも}う？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "「日払い5万円・スマホだけ・簡単な作業」という仕事、なぜそんなに高いのか考えよう",
        "もし本当に簡単な仕事なら、なぜわざわざSNSで素人を探すのか一緒に考えよう",
      ],
      hintsEl: [
        "「{日払|にちばら}い5{万円|まんえん}・スマホだけ・かんたんな{作業|さぎょう}」という{仕事|しごと}、なぜそんなに{高|たか}いのか{考|かんが}えよう",
        "もし{本当|ほんとう}にかんたんな{仕事|しごと}なら、なぜわざわざSNSで{素人|しろうと}を{探|さが}すのか{一緒|いっしょ}に{考|かんが}えよう",
      ],
    },
    {
      id: "q2",
      question: "なぜ若い人が闇バイトに巻き込まれてしまうのかな？",
      questionEl: "なぜ{若|わか}い{人|ひと}が{闇|やみ}バイトに{巻|ま}き{込|こ}まれてしまうのかな？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "お金が必要な時、人はどんな気持ちになるかな？「簡単・すぐ稼げる」が魅力的に見える理由を話し合おう",
        "犯罪グループがなぜわざわざ若い人を狙うのか考えよう（逮捕されやすい・判断力が低い）",
      ],
      hintsEl: [
        "お{金|かね}が{必要|ひつよう}な{時|とき}、{人|ひと}はどんな{気持|きも}ちになるかな？「かんたん・すぐ{稼|かせ}げる」が{魅力的|みりょくてき}に{見|み}える{理由|りゆう}を{話|はな}し{合|あ}おう",
        "{犯罪|はんざい}グループがなぜわざわざ{若|わか}い{人|ひと}を{狙|ねら}うのか{考|かんが}えよう",
      ],
    },
    {
      id: "q3",
      question: "もし友達から『いい仕事あるよ』と誘われたら、どうする？",
      questionEl: "もし{友達|ともだち}から「いい{仕事|しごと}あるよ」と{誘|さそ}われたら、どうする？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "友達からの誘いは断りにくいよね。なぜ断りにくいか一緒に考えよう",
        "断る言葉を一緒に考えてみよう（例：「親に確認してから決める」「ちょっと怖いからやめとく」）",
      ],
      hintsEl: [
        "{友達|ともだち}からの{誘|さそ}いは{断|ことわ}りにくいよね。なぜ{断|ことわ}りにくいか{一緒|いっしょ}に{考|かんが}えよう",
        "{断|ことわ}る{言葉|ことば}を{一緒|いっしょ}に{考|かんが}えてみよう（れい：「{親|おや}に{確認|かくにん}してから{決|き}める」）",
      ],
    },
    {
      id: "q4",
      question: "困ったことや怪しいと思ったとき、誰に相談する？",
      questionEl: "{困|こま}ったことや{怪|あや}しいと{思|おも}ったとき、{誰|だれ}に{相談|そうだん}する？",
      placeholder: "相談できる人の名前を書いてみよう",
      placeholderEl: "{相談|そうだん}できる{人|ひと}の{名前|なまえ}を{書|か}いてみよう",
      hints: [
        "一番相談しやすい大人は誰かな？（家族・先生・相談窓口）名前を書いてみよう",
        "恥ずかしくて言いにくい時はどうする？一緒に考えよう",
      ],
      hintsEl: [
        "いちばん{相談|そうだん}しやすい{大人|おとな}は{誰|だれ}かな？（{家族|かぞく}・{先生|せんせい}・{相談|そうだん}{窓口|まどぐち}）{名前|なまえ}を{書|か}いてみよう",
        "{恥|は}ずかしくて{言|い}いにくい{時|とき}はどうする？{一緒|いっしょ}に{考|かんが}えよう",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fff4,#dcfce7)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep3Questions}
            epKey="ep3"
            accentColor="#16a34a"
            onComplete={() => setPhase("homework")}
          />

          {/* 相談窓口 */}
          <div style={{ marginTop: 16, background: "rgba(22,163,74,.06)", border: "1px solid rgba(22,163,74,.2)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#16a34a", marginBottom: 10 }}>
              📞 困ったらここに相談しよう
            </div>
            {[
              { name: "警察相談専用電話", number: "#9110", note: "24時間対応・全国どこからでも" },
              { name: "子どもの人権110番", number: "0120-007-110", note: "無料・平日8:30〜17:15" },
              { name: "よりそいホットライン", number: "0120-279-338", note: "24時間対応・無料" },
            ].map((c, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(22,163,74,.1)" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{c.name}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#16a34a" }}>{c.number}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{c.note}</div>
              </div>
            ))}
          </div>
        </EpisodeShell>
      </div>
    </div>
  );

  // ── Convo (main game) ──
  if (phase === "convo") return <DarkJobSimulation onComplete={() => { feedback("complete"); setPhase("cases"); }} />;

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#f0fdf4,#dcfce7,#bbf7d0)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: ["#4ade80", "#16a34a", "#86efac", "#22c55e", "#bbf7d0"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f0fdf4)", borderRadius: 22, padding: "28px 22px", border: "3px double #16a34a", textAlign: "center", boxShadow: "0 20px 60px rgba(22,163,74,.2)", position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: "#16a34a" }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#166534", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#14532d", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={ageMode === "elementary" ? `あなたは「マモル」{第|だい}3{話|わ}` : `あなたは「マモル」第3話`} /><br /><strong style={{ color: "#14532d", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "{断|ことわ}れなくなる{前|まえ}に" : "断れなくなる前に"} /></strong><br /><RubyText text={ageMode === "elementary" ? "をクリアしました。" : "をクリアしました。"} />
          </p>
          <div style={{ background: "linear-gradient(135deg,#bbf7d0,#86efac)", borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#166534", marginBottom: 3 }}>EPISODE 03 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#14532d", fontWeight: 900 }}>🛡️ <RubyText text={ageMode === "elementary" ? "{闇|やみ}バイト{免疫|めんえき}マスター" : "闇バイト免疫マスター"} /> 🛡️</div>
          </div>
          <div style={{ fontSize: 10, color: "#16a34a", marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP3 クリア！", text: "闇バイト勧誘シミュレーターを体験！SNSリテラシーアプリ「マモル」🛡️" }).catch(() => {})} style={{ flex: 1, padding: 14, background: "#fff", border: "2px solid #16a34a", borderRadius: 14, color: "#166534", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(3); }} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 4 — 友達のふりをした罠（なりすまし・乗っ取り）
// ─────────────────────────────────────────────

// LINE風メッセージUI
function LineMsg({ from, text, isMe = false, time, typing = false }) {
  const sky = "#0ea5e9";
  return (
    <div style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
      {!isMe && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${sky}44,${sky}22)`, border: `2px solid ${sky}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {from === "haruki" ? "👦" : from === "fake" ? "😈" : "👧"}
        </div>
      )}
      <div style={{ maxWidth: "72%" }}>
        {!isMe && <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginBottom: 4, paddingLeft: 4 }}>{from === "haruki" ? "ハルキ" : from === "fake" ? "ハルキ（？）" : "ミナ"}</div>}
        {typing ? (
          <div style={{ background: "rgba(255,255,255,.08)", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
            {[0, .2, .4].map((d, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: sky, animation: `blink 1s ${d}s infinite` }} />)}
          </div>
        ) : (
          <div style={{ background: isMe ? sky : "rgba(255,255,255,.09)", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "11px 14px", fontSize: 13, color: "#fff", lineHeight: 1.7, wordBreak: "break-word" }}>
            <RubyText text={text} />
          </div>
        )}
        {time && <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", marginTop: 3, textAlign: isMe ? "left" : "right", paddingLeft: isMe ? 0 : 4 }}>{time}</div>}
      </div>
    </div>
  );
}

// 疑似スマホ画面ラッパー
function PhoneFrame({ children, header }) {
  return (
    <div style={{ background: "#0d1117", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(14,165,233,.2)", boxShadow: "0 12px 40px rgba(0,0,0,.5)", marginBottom: 14 }}>
      {header}
      <div style={{ padding: "14px 14px 4px" }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EPISODE 03-2 — その求人、闇バイトじゃない？
// 怪しい求人を見抜くタップ体験
// ═══════════════════════════════════════════════════════════════
function Episode3_2({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [phase, setPhase] = useState("parent_intro");
  const [stage, setStage] = useState(1); // 1, 2, 3
  const [foundS1, setFoundS1] = useState([]);
  const [foundS2, setFoundS2] = useState([]);
  const [foundS3, setFoundS3] = useState([]);
  const [detailModal, setDetailModal] = useState(null); // { title, body }
  const [contactName, setContactName] = useState("");
  const [contactSaved, setContactSaved] = useState(false);

  const green = "#16a34a";
  const greenDark = "#15803d";

  useEffect(() => {
    const saved = localStorage.getItem("mamoru_ep3_2_contact");
    if (saved) setContactName(saved);
  }, []);

  // Stage 1: X (Twitter) DM
  const stage1Points = el ? [
    { id: 0, label: el ? "アカウント{作成|さくせい}3{週間前|しゅうかんまえ}" : "アカウント作成3週間前", body: el ? "たった3{週間前|しゅうかんまえ}に{作|つく}られたアカウント。{本物|ほんもの}の{会社|かいしゃ}は{何年|なんねん}も{前|まえ}からアカウントがある。つかい{捨|す}て{目的|もくてき}で{作|つく}られた{可能性|かのうせい}が{高|たか}い。" : "たった3週間前に作られたアカウント。本物の会社は何年も前からアカウントがある。使い捨て目的で作られた可能性が高い。" },
    { id: 1, label: el ? "フォロー{中|ちゅう}：1.2{万|まん}（フォロワーより{多|おお}い）" : "フォロー中：1.2万（フォロワーより多い）", body: el ? "フォロワーより{圧倒的|あっとうてき}にフォロー{数|すう}が{多|おお}い。{大量|たいりょう}フォローで{目立|めだ}たせようとしている。スパムアカウントの{典型的|てんけいてき}な{特徴|とくちょう}。" : "フォロワーより圧倒的にフォロー数が多い。大量フォローで目立たせようとしている。スパムアカウントの典型的な特徴。" },
    { id: 2, label: el ? "{日払|ひばら}い3〜5{万円|まんえん}" : "日払い3〜5万円", body: el ? "1{日|にち}でこの{金額|きんがく}は{普通|ふつう}のバイトではあり{得|え}ない。{最低賃金|さいていちんぎん}のバイトなら8{時間|じかん}はたらいて{約|やく}1{万円|まんえん}。なぜこんなに{高|たか}いのか{必|かなら}ず{疑|うたが}うこと。" : "1日でこの金額は普通のバイトではあり得ない。最低賃金のバイトなら8時間働いて約1万円。なぜこんなに高いのか必ず疑うこと。" },
    { id: 3, label: el ? "{身|み}バレなし" : "身バレなし", body: el ? "{合法的|ごうほうてき}な{仕事|しごと}なら{身|み}バレを{気|き}にする{必要|ひつよう}がない。{違法|いほう}な{仕事|しごと}だから{正体|しょうたい}を{隠|かく}す{必要|ひつよう}がある。これは{犯罪|はんざい}に{関|かか}わる{仕事|しごと}のサイン。" : "合法的な仕事なら身バレを気にする必要がない。違法な仕事だから正体を隠す必要がある。これは犯罪に関わる仕事のサイン。" },
    { id: 4, label: el ? "LINEに{誘導|ゆうどう}するURL" : "LINEに誘導するURL", body: el ? "{正式|せいしき}な{採用|さいよう}は{会社|かいしゃ}の{公式|こうしき}サイトやハローワーク。LINEに{誘導|ゆうどう}するのは{個人情報|こじんじょうほう}を{集|あつ}めるため。{一度|いちど}LINEを{教|おし}えると{逃|に}げられなくなる。" : "正式な採用は会社の公式サイトやハローワーク。LINEに誘導するのは個人情報を集めるため。一度LINEを教えると逃げられなくなる。" },
    { id: 5, label: el ? "18{才|さい}{未満|みまん}も{応募|おうぼ}OK" : "18歳未満も応募可能", body: el ? "{未成年|みせいねん}をターゲットにしている{証拠|しょうこ}。{判断力|はんだんりょく}が{低|ひく}く・{断|ことわ}りにくい・{社会|しゃかい}{経験|けいけん}が{少|すく}ない{若者|わかもの}が{狙|ねら}われている。" : "未成年をターゲットにしている証拠。判断力が低く・断りにくい・社会経験が少ない若者が狙われている。" },
  ] : [
    { id: 0, label: "アカウント作成3週間前", body: "たった3週間前に作られたアカウント。本物の会社は何年も前からアカウントがある。使い捨て目的で作られた可能性が高い。" },
    { id: 1, label: "フォロー中：1.2万（フォロワーより多い）", body: "フォロワーより圧倒的にフォロー数が多い。大量フォローで目立たせようとしている。スパムアカウントの典型的な特徴。" },
    { id: 2, label: "日払い3〜5万円", body: "1日でこの金額は普通のバイトではあり得ない。最低賃金のバイトなら8時間働いて約1万円。なぜこんなに高いのか必ず疑うこと。" },
    { id: 3, label: "身バレなし", body: "合法的な仕事なら身バレを気にする必要がない。違法な仕事だから正体を隠す必要がある。これは犯罪に関わる仕事のサイン。" },
    { id: 4, label: "LINEに誘導するURL", body: "正式な採用は会社の公式サイトやハローワーク。LINEに誘導するのは個人情報を集めるため。一度LINEを教えると逃げられなくなる。" },
    { id: 5, label: "18歳未満も応募可能", body: "未成年をターゲットにしている証拠。判断力が低く・断りにくい・社会経験が少ない若者が狙われている。" },
  ];

  // Stage 2: Instagram post
  const stage2Points = el ? [
    { id: 0, label: el ? "{収入|しゅうにゅう}{証明|しょうめい}{画像|がぞう}「¥680,000」" : "収入証明画像「¥680,000」", body: el ? "{収入|しゅうにゅう}{証明|しょうめい}は{簡単|かんたん}に{偽造|ぎぞう}できる。アプリひとつで{数字|すうじ}を{書|か}き{換|か}えられる。{画像|がぞう}1{枚|まい}の{証拠|しょうこ}は{信用|しんよう}してはいけない。" : "収入証明は簡単に偽造できる。アプリひとつで数字を書き換えられる。画像1枚の証拠は信用してはいけない。" },
    { id: 1, label: el ? "「{未経験|みけいけん}でも{月|つき}30{万|まん}は{余裕|よゆう}」" : "「未経験でも月30万は余裕」", body: el ? "スキルなしで{月|つき}30{万円|まんえん}は{現実的|げんじつてき}にあり{得|え}ない。その{分|ぶん}のリスク・{危険|きけん}がある。「{簡単|かんたん}に{稼|かせ}げる」には{必|かなら}ず{裏|うら}がある。" : "スキルなしで月30万は現実的にあり得ない。その分のリスク・危険がある。「簡単に稼げる」には必ず裏がある。" },
    { id: 2, label: el ? "「まずはDMください」" : "「まずはDMください」", body: el ? "{最初|さいしょ}の{一歩|いっぽ}がDMへの{誘導|ゆうどう}。{個人情報|こじんじょうほう}を{少|すこ}しずつ{引|ひ}き{出|だ}すための{入口|いりぐち}。{正式|せいしき}な{採用|さいよう}はDMでは{行|おこな}われない。" : "最初の一歩がDMへの誘導。個人情報を少しずつ引き出すための入口。正式な採用はDMでは行われない。" },
    { id: 3, label: el ? "ハッシュタグ（#{高校生|こうこうせい} #{大学生|だいがくせい}）" : "ハッシュタグ（#高校生 #大学生）", body: el ? "{若者|わかもの}を{意図的|いとてき}にターゲットにしている。{若者|わかもの}は{断|ことわ}りにくく・{社会|しゃかい}{経験|けいけん}が{少|すく}ないため{狙|ねら}われやすい。" : "若者を意図的にターゲットにしている。若者は断りにくく・社会経験が少ないため狙われやすい。" },
    { id: 4, label: el ? "プロフィールのリンク" : "プロフィールのリンク", body: el ? "{外部|がいぶ}サイトやLINEグループへの{誘導|ゆうどう}。{個人情報|こじんじょうほう}を{入力|にゅうりょく}させるための{罠|わな}。{絶対|ぜったい}にタップしない。" : "外部サイトやLINEグループへの誘導。個人情報を入力させるための罠。絶対にタップしない。" },
  ] : [
    { id: 0, label: "収入証明画像「¥680,000」", body: "収入証明は簡単に偽造できる。アプリひとつで数字を書き換えられる。画像1枚の証拠は信用してはいけない。" },
    { id: 1, label: "「未経験でも月30万は余裕」", body: "スキルなしで月30万は現実的にあり得ない。その分のリスク・危険がある。「簡単に稼げる」には必ず裏がある。" },
    { id: 2, label: "「まずはDMください」", body: "最初の一歩がDMへの誘導。個人情報を少しずつ引き出すための入口。正式な採用はDMでは行われない。" },
    { id: 3, label: "ハッシュタグ（#高校生 #大学生）", body: "若者を意図的にターゲットにしている。若者は断りにくく・社会経験が少ないため狙われやすい。" },
    { id: 4, label: "プロフィールのリンク", body: "外部サイトやLINEグループへの誘導。個人情報を入力させるための罠。絶対にタップしない。" },
  ];

  // Stage 3: Job site
  const stage3Points = el ? [
    { id: 0, label: el ? "「1〜3{時間|じかん}で{日払|ひばら}い5{万円|まんえん}」" : "「1〜3時間で日払い5万円」", body: el ? "{時給|じきゅう}{換算|かんさん}で1{万|まん}6{千円|せんえん}{以上|いじょう}。{普通|ふつう}のバイトの10{倍|ばい}{以上|いじょう}の{金額|きんがく}。なぜこんなに{高|たか}いのか{絶対|ぜったい}に{疑|うたが}うこと。" : "時給換算で1万6千円以上。普通のバイトの10倍以上の金額。なぜこんなに高いのか絶対に疑うこと。" },
    { id: 1, label: el ? "「{荷物|にもつ}の{中身|なかみ}の{確認|かくにん}は{不要|ふよう}」" : "「荷物の中身の確認は不要」", body: el ? "{中身|なかみ}を{見|み}せない{理由|りゆう}がある。{違法|いほう}な{物品|ぶっぴん}（{薬物|やくぶつ}・{盗品|とうひん}など）の{運搬|うんぱん}の{典型的|てんけいてき}な{手口|てぐち}。「{知|し}らなかった」では{済|す}まない。" : "中身を見せない理由がある。違法な物品（薬物・盗品など）の運搬の典型的な手口。「知らなかった」では済まない。" },
    { id: 2, label: el ? "「{詳細|しょうさい}は{採用|さいよう}{後|ご}にご{説明|せつめい}」" : "「詳細は採用後にご説明」", body: el ? "{採用|さいよう}{前|まえ}に{仕事|しごと}{内容|ないよう}を{教|おし}えない。{断|ことわ}れなくなってから{本当|ほんとう}の{仕事|しごと}を{教|おし}える{罠|わな}。{合法|ごうほう}の{仕事|しごと}なら{最初|さいしょ}から{説明|せつめい}できる。" : "採用前に仕事内容を教えない。断れなくなってから本当の仕事を教える罠。合法の仕事なら最初から説明できる。" },
    { id: 3, label: el ? "「{身分証明書|みぶんしょうめいしょ}をご{用意|ようい}ください」" : "「身分証明書をご用意ください」", body: el ? "{最初|さいしょ}から{個人情報|こじんじょうほう}を{要求|ようきゅう}している。{一度|いちど}{送|おく}ると{脅|おど}しの{材料|ざいりょう}にされる。{身分証|みぶんしょう}を{送|おく}ったら{絶対|ぜったい}に{逃|に}げられなくなる。" : "最初から個人情報を要求している。一度送ると脅しの材料にされる。身分証を送ったら絶対に逃げられなくなる。" },
    { id: 4, label: el ? "「{秘密|ひみつ}が{守|まも}れる{方|かた}」" : "「秘密が守れる方」", body: el ? "{誰|だれ}にも{言|い}えない{仕事|しごと}＝{違法|いほう}な{仕事|しごと}。{合法|ごうほう}の{仕事|しごと}に{秘密|ひみつ}にする{理由|りゆう}はない。{家族|かぞく}や{友達|ともだち}に{言|い}えない{仕事|しごと}はやってはいけない。" : "誰にも言えない仕事＝違法な仕事。合法の仕事に秘密にする理由はない。家族や友達に言えない仕事はやってはいけない。" },
    { id: 5, label: el ? "「すぐに{動|うご}ける{方|かた}」" : "「すぐに動ける方」", body: el ? "{考|かんが}える{時間|じかん}を{与|あた}えない。{焦|あせ}らせて{判断力|はんだんりょく}を{失|うしな}わせるのが{目的|もくてき}。{急|いそ}かされたら{必|かなら}ず{立|た}ち{止|と}まって{考|かんが}えること。" : "考える時間を与えない。焦らせて判断力を失わせるのが目的。急かされたら必ず立ち止まって考えること。" },
  ] : [
    { id: 0, label: "「1〜3時間で日払い5万円」", body: "時給換算で1万6千円以上。普通のバイトの10倍以上の金額。なぜこんなに高いのか絶対に疑うこと。" },
    { id: 1, label: "「荷物の中身の確認は不要」", body: "中身を見せない理由がある。違法な物品（薬物・盗品など）の運搬の典型的な手口。「知らなかった」では済まない。" },
    { id: 2, label: "「詳細は採用後にご説明」", body: "採用前に仕事内容を教えない。断れなくなってから本当の仕事を教える罠。合法の仕事なら最初から説明できる。" },
    { id: 3, label: "「身分証明書をご用意ください」", body: "最初から個人情報を要求している。一度送ると脅しの材料にされる。身分証を送ったら絶対に逃げられなくなる。" },
    { id: 4, label: "「秘密が守れる方」", body: "誰にも言えない仕事＝違法な仕事。合法の仕事に秘密にする理由はない。家族や友達に言えない仕事はやってはいけない。" },
    { id: 5, label: "「すぐに動ける方」", body: "考える時間を与えない。焦らせて判断力を失わせるのが目的。急かされたら必ず立ち止まって考えること。" },
  ];

  const dangerSignCards = el ? [
    { icon: "🚨", title: "{報酬|ほうしゅう}が{異常|いじょう}に{高|たか}い", desc: "{日払|ひばら}い{数万円|すうまんえん}・{月|つき}30{万|まん}{以上|いじょう}は{要注意|ようちゅうい}" },
    { icon: "🚨", title: "{仕事|しごと}の{内容|ないよう}があいまい", desc: "「{荷物|にもつ}を{運|はこ}ぶだけ」「かんたんな{作業|さぎょう}」はNG" },
    { icon: "🚨", title: "LINEやDMに{誘導|ゆうどう}する", desc: "{公式|こうしき}サイト・ハローワーク{以外|いがい}は{疑|うたが}う" },
    { icon: "🚨", title: "{最初|さいしょ}から{身分証|みぶんしょう}を{要求|ようきゅう}する", desc: "{採用|さいよう}{前|まえ}の{個人情報|こじんじょうほう}{提供|ていきょう}は{絶対|ぜったい}NG" },
    { icon: "🚨", title: "{秘密|ひみつ}にするよう{求|もと}める", desc: "{家族|かぞく}に{言|い}えない{仕事|しごと}はやってはいけない" },
    { icon: "🚨", title: "{断|ことわ}ると{脅|おど}してくる", desc: "{脅|おど}されたらすぐ{警察|けいさつ}（#9110）に{相談|そうだん}" },
  ] : [
    { icon: "🚨", title: "報酬が異常に高い", desc: "日払い数万円・月30万以上は要注意" },
    { icon: "🚨", title: "仕事の内容があいまい", desc: "「荷物を運ぶだけ」「簡単な作業」はNG" },
    { icon: "🚨", title: "LINEやDMに誘導する", desc: "公式サイト・ハローワーク以外は疑う" },
    { icon: "🚨", title: "最初から身分証を要求する", desc: "採用前の個人情報提供は絶対NG" },
    { icon: "🚨", title: "秘密にするよう求める", desc: "家族に言えない仕事はやってはいけない" },
    { icon: "🚨", title: "断ると脅してくる", desc: "脅されたらすぐ警察（#9110）に相談" },
  ];

  const renderFindGame = (points, found, setFound, stageLabel, nextStage) => {
    const remaining = points.length - found.length;
    const allFound = found.length >= points.length;
    return (
      <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: green, letterSpacing: ".15em" }}>{stageLabel}</div>
            <div style={{ background: `${green}18`, border: `1px solid ${green}33`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: green, fontWeight: 900 }}>
              {found.length}/{points.length} <RubyText text={el ? "{発見|はっけん}" : "発見"} />
            </div>
          </div>
          {!allFound && (
            <OwlSay mood="worried" e={el ? `{怪|あや}しいポイントを{全部|ぜんぶ}{見|み}つけよう！あと${remaining}個かくれてるよ🦉` : `怪しいポイントを全部見つけよう！あと${remaining}個隠れてるよ🦉`}>{`怪しいポイントを全部見つけよう！あと${remaining}個隠れてるよ🦉`}</OwlSay>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {points.map((pt) => {
              const isFound = found.includes(pt.id);
              return (
                <button key={pt.id} onClick={() => {
                  feedback(isFound ? "tap" : "found");
                  if (!isFound) setFound(prev => [...prev, pt.id]);
                  setDetailModal({ title: pt.label, body: pt.body });
                }}
                  style={{ width: "100%", padding: "13px 16px", background: isFound ? `${green}18` : "rgba(255,255,255,.04)", border: `1.5px solid ${isFound ? green + "55" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: isFound ? "#86efac" : "rgba(255,255,255,.75)", fontSize: 13, fontWeight: isFound ? 900 : 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all .2s" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{isFound ? "✅" : "❓"}</span>
                  <RubyText text={pt.label} />
                  {!isFound && <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,.3)" }}><RubyText text={el ? "タップ" : "タップ"} /></span>}
                </button>
              );
            })}
          </div>
          {allFound && (
            <button onClick={() => { feedback("complete"); nextStage(); }}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${green},${greenDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
              {stageLabel.replace("STAGE","").includes("3") ? <RubyText text={el ? "まとめを{見|み}る →" : "まとめを見る →"} /> : <RubyText text={el ? "STAGE {クリア|くりあ}！{次|つぎ}へ →" : "ステージクリア！次へ →"} />}
            </button>
          )}
        </div>
        {detailModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setDetailModal(null)}>
            <div style={{ background: "linear-gradient(135deg,#0a1a0a,#041004)", border: `2px solid ${green}`, borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", animation: "popIn .3s ease" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>🚨</div>
              <h3 style={{ color: "#86efac", fontSize: 15, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}><RubyText text={detailModal.title} /></h3>
              <p style={{ color: "rgba(255,255,255,.75)", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}><RubyText text={detailModal.body} /></p>
              <button onClick={() => setDetailModal(null)} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg,${green},${greenDark})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                <RubyText text={el ? "なるほど！" : "なるほど！"} />
              </button>
            </div>
          </div>
        )}
      </div>
      </EpisodeShell>
    );
  };

  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep32" onStart={() => setPhase("intro")} />
  );

  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#0a1a0a,#041004)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative" }}>
      {[...Array(20)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random()*2+1, height: Math.random()*2+1, background: green, borderRadius: "50%", left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.25+0.05, animation: `blink ${Math.random()*4+2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>⚠️</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: green, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 03-2</div>
      <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}>
        <RubyText text={el ? "その{求人|きゅうじん}、" : "その求人、"} /><br />
        <RubyText text={el ? "{闇|やみ}バイトじゃない？" : "闇バイトじゃない？"} />
      </h1>
      <div style={{ maxWidth: 320, margin: "12px 0 20px" }}>
        <OwlSay mood="worried" e={el ? "エピソード3で{闇|やみ}バイトのこわさを{学|まな}んだね。でも、{実際|じっさい}の{募集|ぼしゅう}を{見|み}てもすぐ{気|き}づける？{本物|ほんもの}の{手口|てぐち}を{使|つか}った3つの{場面|ばめん}で{怪|あや}しいポイントを{全部|ぜんぶ}{見|み}つけよう！🦉" : "エピソード3で闇バイトのこわさを学んだね。でも、実際の募集を見てもすぐ気づける？本物の手口を使った3つの場面で怪しいポイントを全部見つけよう！🦉"}>エピソード3で闇バイトのこわさを学んだね。でも、実際の募集を見てもすぐ気づける？本物の手口を使った3つの場面で怪しいポイントを全部見つけよう！🦉</OwlSay>
      </div>
      <div style={{ background: `${green}0a`, border: `1px solid ${green}22`, borderRadius: 16, padding: "14px 18px", maxWidth: 320, marginBottom: 16, fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.8, textAlign: "center" }}>
        <RubyText text={el ? "{画面|がめん}をよく{読|よ}んで、{怪|あや}しいと{思|おも}う{部分|ぶぶん}をタップしよう。{全部|ぜんぶ}{見|み}つけたら{次|つぎ}のステージへ！" : "画面をよく読んで、怪しいと思う部分をタップしよう。全部見つけたら次のステージへ！"} />
      </div>
      <button onClick={() => { feedback("tap"); setPhase("stage1"); }} style={{ background: `linear-gradient(135deg,${green},${greenDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${green}44` }}>
        <RubyText text={el ? "STAGE 1 {スタート|すたーと} →" : "STAGE 1 スタート →"} />
      </button>
    </div>
    </EpisodeShell>
  );

  if (phase === "stage1") {
    return renderFindGame(
      stage1Points, foundS1, setFoundS1,
      "STAGE 1 / 3 — X（旧Twitter）DM",
      () => setPhase("stage2")
    );
  }

  if (phase === "stage2") {
    return renderFindGame(
      stage2Points, foundS2, setFoundS2,
      "STAGE 2 / 3 — Instagram投稿",
      () => setPhase("stage3")
    );
  }

  if (phase === "stage3") {
    return renderFindGame(
      stage3Points, foundS3, setFoundS3,
      "STAGE 3 / 3 — 求人サイト",
      () => setPhase("reveal")
    );
  }

  if (phase === "reveal") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8, animation: "celebrate 1s infinite" }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
            <RubyText text={el ? "3つの{入口|いりぐち}、{全部|ぜんぶ}{見抜|みぬ}けた！" : "3つの入口、全部見抜けた！"} />
          </h2>
        </div>
        <OwlSay mood="happy" e={el ? "3つの{全然|ぜんぜん}{違|ちが}う{場所|ばしょ}から{同|おな}じ{手口|てぐち}が{使|つか}われていたね。{共通|きょうつう}するサインを{覚|おぼ}えておこう！🦉" : "3つの全然違う場所から同じ手口が使われていたね。共通するサインを覚えておこう！🦉"}>3つの全然違う場所から同じ手口が使われていたね。共通するサインを覚えておこう！🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {dangerSignCards.map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start", animation: `slideUp .4s ${i * .08}s both ease` }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#86efac", marginBottom: 3 }}><RubyText text={c.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}><RubyText text={c.desc} /></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: `${green}18`, border: `1px solid ${green}44`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, textAlign: "center", fontSize: 15, fontWeight: 900, color: "#86efac" }}>
          <RubyText text={el ? "「1つでも{当|あ}てはまったら{絶対|ぜったい}に{関|かか}わらない！」" : "「1つでも当てはまったら絶対に関わらない！」"} />
        </div>
        <button onClick={() => setPhase("promise")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${green},${greenDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{次|つぎ}へ：{我|わ}が{家|や}のルールを{決|き}める →" : "次へ：我が家のルールを決める →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "promise") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 8 }}>
          <RubyText text={el ? "{我|わ}が{家|や}の{約束|やくそく}を{作|つく}ろう" : "我が家の約束を作ろう"} />
        </h2>
        <OwlSay mood="happy" e={el ? "{怪|あや}しいお{仕事|しごと}の{誘|さそ}いが{来|き}たとき、{一人|ひとり}で{悩|なや}まないようにしよう。{相談|そうだん}できる{人|ひと}の{名前|なまえ}を{入力|にゅうりょく}してね。🦉" : "怪しいお仕事の誘いが来たとき、一人で悩まないようにしよう。相談できる人の名前を入力してね。🦉"}>怪しいお仕事の誘いが来たとき、一人で悩まないようにしよう。相談できる人の名前を入力してね。🦉</OwlSay>
        <div style={{ background: `${green}08`, border: `1px solid ${green}22`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginBottom: 10 }}>
            <RubyText text={el ? "{怪|あや}しいお{仕事|しごと}を{見|み}たら…" : "怪しいお仕事を見たら…"} />
          </div>
          <input
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            placeholder={el ? "例：お{父|とう}さん・お{母|かあ}さん・◯◯{先生|せんせい}" : "例：お父さん・お母さん・◯◯先生"}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.06)", border: `1px solid ${green}44`, borderRadius: 12, color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        {contactName.length > 0 && (
          <>
            <div style={{ background: `${green}0a`, border: `2px solid ${green}44`, borderRadius: 16, padding: "18px 16px", marginBottom: 14, animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: green, marginBottom: 10 }}>🛡️ <RubyText text={el ? "{我|わ}が{家|や}の{約束|やくそく}" : "我が家の約束"} /></div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.9 }}>
                <RubyText text={el ? "{怪|あや}しいお{仕事|しごと}の{誘|さそ}いが{来|き}たら" : "怪しいお仕事の誘いが来たら"} /><br />
                <strong style={{ color: "#86efac", fontSize: 15 }}>「{contactName}」</strong><RubyText text={el ? "に{すぐ|すぐ}{相談|そうだん}する！" : "にすぐ相談する！"} /><br />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{new Date().toLocaleDateString("ja-JP")}</span>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fcd34d", marginBottom: 8 }}>📞 <RubyText text={el ? "{困|こま}ったらここに{電話|でんわ}しよう" : "困ったらここに電話しよう"} /></div>
              {[
                { name: "#9110", desc: el ? "{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}" : "警察相談専用電話" },
                { name: "0120-007-110", desc: el ? "{子|こ}どもの{人権|じんけん}110{番|ばん}" : "子どもの人権110番" },
                { name: "0120-279-338", desc: el ? "よりそいホットライン" : "よりそいホットライン" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "center" }}>
                  <a href={`tel:${c.name}`} style={{ fontSize: 14, fontWeight: 900, color: "#86efac", textDecoration: "none" }}>{c.name}</a>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}><RubyText text={c.desc} /></span>
                </div>
              ))}
            </div>
            <button onClick={() => {
              feedback("complete");
              try { localStorage.setItem("mamoru_ep3_2_contact", contactName); } catch {}
              onComplete(3);
            }}
              style={{ width: "100%", padding: 16, background: `linear-gradient(135deg,${green},${greenDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${green}44` }}>
              🏆 <RubyText text={el ? "{修了証|しゅうりょうしょう}をもらう" : "修了証をもらう"} />
            </button>
          </>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  return null;
}


function Ep4Countermeasures({ el, red, onComplete }) {
  const [checked, setChecked] = useState(new Set());

  const steps = [
    {
      icon:"🌐",
      title:el?"URLを{必|かなら}ず{確認|かくにん}する":"URLを必ず確認する",
      desc:el
        ?"「nintendo.com」以{外|がい}のURLは{全部|ぜんぶん}{偽物|にせもの}。{短縮URL|たんしゅくURL}や{不自然|ふしぜんな}な{文字|もじ}{列|れつ}に{注意|ちゅうい}。"
        :"「nintendo.com」以外のURLは全部偽物。短縮URLや不自然な文字列に注意。",
      color:red,
    },
    {
      icon:"🔖",
      title:el?"{公式|こうしき}サイトはブックマークから{開|ひら}く":"公式サイトはブックマークから開く",
      desc:el
        ?"SMSや{メール|めーる}のリンクは{使|つか}わない。{必|かなら}ずブックマークや{公式|こうしき}アプリから{ログイン|ろぐいん}する。"
        :"SMSやメールのリンクは使わない。必ずブックマークや公式アプリからログインする。",
      color:"#7c3aed",
    },
    {
      icon:"🔑",
      title:el?"{パスワード|ぱすわーど}を{使|つか}い{回|まわ}さない":"パスワードを使い回さない",
      desc:el
        ?"1つの{サービス|さーびす}で{漏|も}れると{全部|ぜんぶ}危険。{パスワードマネージャー|ぱすわーどまねーじゃー}を{使|つか}おう。"
        :"1つのサービスで漏れると全部危険。パスワードマネージャーを使おう。",
      color:"#0ea5e9",
    },
    {
      icon:"👨‍👩‍👧",
      title:el?"{怪|あや}しいと{思|おも}ったらすぐ{大人|おとな}に{相談|そうだん}":"怪しいと思ったらすぐ大人に相談",
      desc:el
        ?"「{急|いそ}いで」「{今|いま}すぐ」という{言葉|ことば}ほど{危険|きけん}。{一人|ひとり}で{判断|はんだん}しないで{親|おや}に{相談|そうだん}しよう。"
        :"「急いで」「今すぐ」という言葉ほど危険。一人で判断しないで親に相談しよう。",
      color:"#10b981",
    },
  ];

  const allChecked = checked.size >= steps.length;

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"24px 20px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
    }}>
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <div style={{fontSize:11,fontWeight:900,color:"rgba(230,0,18,.7)",marginBottom:6}}>
          ✅ <RubyText text={el?"{見抜|みぬ}き{方|かた}":"見抜き方"}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,marginBottom:4}}>
          <RubyText text={el?"{騙|だま}されないための4つのルール":"騙されないための4つのルール"}/>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:20}}>
          <RubyText text={el?"「{分|わ}かった！」を{押|お}して{確認|かくにん}しよう":"「分かった！」を押して確認しよう"}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {steps.map((s,i)=>(
            <div key={i} style={{
              background:checked.has(i)
                ?"rgba(255,255,255,.06)"
                :"rgba(255,255,255,.04)",
              border:`0.5px solid ${checked.has(i)?s.color+"55":"rgba(255,255,255,.1)"}`,
              borderRadius:12,padding:"12px 14px",transition:"all .4s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{
                  width:28,height:28,borderRadius:"50%",
                  background:checked.has(i)?"#22c55e":"rgba(255,255,255,.08)",
                  border:`1.5px solid ${checked.has(i)?"#22c55e":"rgba(255,255,255,.2)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:checked.has(i)?14:12,flexShrink:0,transition:"all .4s",
                }}>
                  {checked.has(i)?"✅":(
                    <span style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:900}}>
                      {"STEP"+(i+1)}
                    </span>
                  )}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:900,color:checked.has(i)?"#fff":"rgba(255,255,255,.9)"}}>
                    {s.icon} <RubyText text={s.title}/>
                  </div>
                </div>
                {!checked.has(i) && (
                  <button
                    onClick={()=>{
                      feedback("tap");
                      setChecked(prev=>{
                        const next=new Set(prev);
                        next.add(i);
                        return next;
                      });
                    }}
                    style={{
                      padding:"6px 12px",borderRadius:8,border:"none",
                      background:"rgba(230,0,18,.2)",color:"#ff6b6b",
                      fontSize:11,fontWeight:900,cursor:"pointer",
                      fontFamily:"inherit",flexShrink:0,
                    }}>
                    <RubyText text={el?"{分|わ}かった！":"分かった！"}/>
                  </button>
                )}
              </div>
              {checked.has(i) && (
                <div style={{
                  marginTop:8,paddingLeft:38,
                  animation:"mamFadeUp .4s ease",
                }}>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.75)",lineHeight:1.7}}>
                    <RubyText text={s.desc}/>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allChecked && (
          <div style={{animation:"mamFadeUp .5s ease"}}>
            <div style={{
              background:"rgba(34,197,94,.1)",
              border:"0.5px solid rgba(34,197,94,.3)",
              borderRadius:12,padding:"12px 14px",
              marginBottom:14,textAlign:"center",
            }}>
              <div style={{fontSize:20,marginBottom:6}}>🎉</div>
              <div style={{fontSize:14,fontWeight:900,color:"#4ade80",marginBottom:4}}>
                <RubyText text={el?"4つ{全部|ぜんぶ}チェックできた！":"4つ全部チェックできた！"}/>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.6}}>
                <RubyText text={el?"{次|つぎ}から{使|つか}える{見抜|みぬ}き{方|かた}を{覚|おぼ}えたよ！":"次から使える見抜き方を覚えたよ！"}/>
              </div>
            </div>
            <button
              onClick={()=>{feedback("tap");onComplete();}}
              style={{
                width:"100%",padding:16,borderRadius:14,border:"none",
                background:`linear-gradient(135deg,${red},#b00010)`,
                color:"#fff",fontSize:15,fontWeight:900,
                cursor:"pointer",fontFamily:"inherit",
              }}>
              <RubyText text={el?"{次|つぎ}へ →":"次へ →"}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
function Episode4({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [phase, setPhase] = useState("parent_intro");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [emailStep, setEmailStep] = useState(0);
  const timerRef = useRef(null);

  const red = "#e60012";

  useEffect(() => {
    return () => { if(timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep4" onStart={() => setPhase("intro")} />
  );

  if (phase === "intro") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"32px 24px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
    }}>
      <div style={{maxWidth:380,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:900,color:"rgba(230,0,18,.7)",letterSpacing:".05em",marginBottom:8}}>
            <RubyText text={el?"このEPの{主人公|しゅじんこう}":"このEPの主人公"}/>
          </div>
          <div style={{fontSize:18,fontWeight:900,lineHeight:1.5}}>
            <RubyText text={el
              ?"{今回|こんかい}はこの{人物|じんぶつ}として\n{体験|たいけん}してみよう"
              :"今回はこの人物として\n体験してみよう"
            }/>
          </div>
        </div>

        {/* キャラクターカード */}
        <div style={{
          background:"rgba(255,255,255,.06)",
          border:"1px solid rgba(230,0,18,.3)",
          borderRadius:20,
          overflow:"hidden",
          marginBottom:20,
        }}>
          <div style={{
            background:"linear-gradient(135deg,#e60012,#b00010)",
            padding:20,
            display:"flex",
            alignItems:"center",
            gap:16,
          }}>
            <div style={{
              width:80,height:96,
              borderRadius:8,
              overflow:"hidden",
              border:"2px solid rgba(255,255,255,.3)",
              flexShrink:0,
              background:"#c00010",
            }}>
              <img
                src="/images/ep4/hana.jpg"
                style={{
                  width:"100%",height:"100%",
                  objectFit:"cover",
                  objectPosition:"center top",
                }}
                alt="ハナ"
              />
            </div>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:4}}>
                <RubyText text={el?"{小学|しょうがく}5{年生|ねんせい}":"小学5年生"}/>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:4}}>
                <RubyText text={el?"{鈴木|すずき} ハナ":"鈴木 ハナ"}/>
              </div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.75)"}}>
                <RubyText text={el?"11{歳|さい}":"11歳"}/>
              </div>
            </div>
          </div>
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
            {[
              {icon:"🎮",label:el?"{大好|だいす}きなこと":"大好きなこと",value:el?"{去年|きょねん}{誕生日|たんじょうび}にもらったSwitchで「あつまれどうぶつの{森|もり}」を{毎日|まいにち}プレイ中":"去年誕生日にもらったSwitchで「あつまれどうぶつの森」を毎日プレイ中"},
              {icon:"⭐",label:el?"{自慢|じまん}":"自慢",value:el?"あつ{森|もり}の{島|しま}づくりに300{時間|じかん}かけた{大作|たいさく}！":"あつ森の島づくりに300時間かけた大作！"},
              {icon:"📱",label:el?"{最近|さいきん}のこと":"最近のこと",value:el?"{親|おや}のスマホを{借|か}りてアプリを{使|つか}うことがある":"親のスマホを借りてアプリを使うことがある"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:2}}>
                    <RubyText text={item.label}/>
                  </div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.6}}>
                    <RubyText text={item.value}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background:"rgba(255,255,255,.05)",
          border:"0.5px solid rgba(255,255,255,.1)",
          borderRadius:12,
          padding:"14px 16px",
          marginBottom:24,
          fontSize:13,
          color:"rgba(255,255,255,.75)",
          lineHeight:1.8,
          textAlign:"center",
          whiteSpace:"pre-line",
        }}>
          <RubyText text={el
            ?"ある{夜|よる}、ハナのスマホに\n{見知|みし}らぬSMSが{届|とど}いた…\n\nあなたがハナとして{体験|たいけん}してみよう。"
            :"ある夜、ハナのスマホに\n見知らぬSMSが届いた…\n\nあなたがハナとして体験してみよう。"
          }/>
        </div>

        <button
          onClick={()=>{feedback("tap");setPhase("sms_receive");}}
          style={{
            width:"100%",padding:16,borderRadius:14,border:"none",
            background:`linear-gradient(135deg,${red},#b00010)`,
            color:"#fff",fontSize:16,fontWeight:900,cursor:"pointer",
            fontFamily:"inherit",
          }}>
          <RubyText text={el?"{体験|たいけん}スタート →":"体験スタート →"}/>
        </button>
      </div>
    </div>
  );

  if (phase === "sms_receive") return (
    <div style={{
      minHeight:"100vh",
      background:"#000",
      fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
      display:"flex",
      flexDirection:"column",
      maxWidth:"100%",
    }}>

      {/* iPhoneステータスバー */}
      <div style={{
        background:"#000",
        padding:"14px 20px 6px",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
      }}>
        <span style={{fontSize:15,fontWeight:600,color:"#fff"}}>21:34</span>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:13,color:"#fff"}}>●●●</span>
          <span style={{fontSize:13,color:"#fff"}}>WiFi</span>
          <span style={{fontSize:13,color:"#fff"}}>🔋</span>
        </div>
      </div>

      {/* メッセージアプリヘッダー */}
      <div style={{
        background:"#1c1c1e",
        borderBottom:"0.5px solid rgba(255,255,255,.15)",
        padding:"8px 16px 12px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        position:"relative",
      }}>
        <span style={{
          position:"absolute",left:16,top:10,
          fontSize:16,color:"#007aff",fontWeight:400,
        }}>＜</span>

        {/* 送信者アイコン */}
        <div style={{
          width:52,height:52,borderRadius:"50%",
          background:"#3a3a3c",
          display:"flex",alignItems:"center",
          justifyContent:"center",
          marginBottom:4,
        }}>
          <span style={{fontSize:22}}>🎮</span>
        </div>
        <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>任天堂</div>
        <div style={{
          fontSize:11,color:"rgba(255,255,255,.4)",marginTop:2,
        }}>
          <RubyText text={el
            ?"{短縮番号|たんしゅくばんごう} +81-120-059-161"
            :"短縮番号 +81-120-059-161"
          }/>
        </div>
      </div>

      {/* チャットエリア */}
      <div style={{
        flex:1,
        background:"#000",
        padding:"16px 12px 12px",
      }}>
        {/* 日付 */}
        <div style={{
          textAlign:"center",
          fontSize:11,
          color:"rgba(255,255,255,.4)",
          marginBottom:16,
        }}>
          <RubyText text={el?"{今日|きょう} 21:34":"今日 21:34"}/>
        </div>

        {/* SMS吹き出し */}
        <div style={{
          background:"#3a3a3c",
          borderRadius:"18px 18px 18px 4px",
          padding:"12px 14px",
          fontSize:14,
          color:"#fff",
          lineHeight:1.7,
          maxWidth:"82%",
          marginBottom:8,
        }}>
          <RubyText text={el
            ?"【{任天堂|にんてんどう}】お{客様|きゃくさま}のニンテンドーアカウントで{不正|ふせい}アクセスが{検知|けんち}されました。\n\n24{時間以内|じかんいない}にご{確認|かくにん}ください。"
            :"【任天堂】お客様のニンテンドーアカウントで不正アクセスが検知されました。\n\n24時間以内にご確認ください。"
          }/>
          <div style={{marginTop:8}}>
            <span style={{
              color:"#4db8ff",
              textDecoration:"underline",
              fontSize:13,
              wordBreak:"break-all",
            }}>
              https://nintendo-account-verify.com/check
            </span>
          </div>
        </div>

        {/* 既読・時刻 */}
        <div style={{
          fontSize:11,
          color:"rgba(255,255,255,.3)",
          marginBottom:20,
          paddingLeft:4,
        }}>
          <RubyText text={el?"{配信済|はいしんず}み 21:34":"配信済み 21:34"}/>
        </div>

        {/* ハナの心理 */}
        <div style={{
          background:"rgba(255,200,0,.08)",
          borderLeft:"3px solid #f5c842",
          padding:"10px 14px",
          fontSize:12,
          color:"#f5c842",
          fontStyle:"italic",
          borderRadius:"0 10px 10px 0",
          lineHeight:1.7,
          marginBottom:24,
        }}>
          <RubyText text={el
            ?"ハナ：「え…{不正|ふせい}アクセス？！Switchが{使|つか}えなくなっちゃう…！{急|いそ}がないと！」"
            :"ハナ：「え…不正アクセス？！Switchが使えなくなっちゃう…！急がないと！」"
          }/>
        </div>

        {/* 選択肢 */}
        <div style={{
          fontSize:11,
          color:"rgba(255,255,255,.4)",
          marginBottom:10,
          textAlign:"center",
        }}>
          <RubyText text={el?"どうする？":"どうする？"}/>
        </div>

        <button
          onClick={()=>{feedback("tap");setPhase("fake_login");}}
          style={{
            width:"100%",padding:14,borderRadius:14,border:"none",
            background:"#007aff",
            color:"#fff",fontSize:15,fontWeight:600,
            cursor:"pointer",fontFamily:"inherit",marginBottom:10,
          }}>
          <RubyText text={el?"{リンク|りんく}を{開|ひら}く":"リンクを開く"}/>
        </button>

        <button
          onClick={()=>{feedback("tap");setPhase("fake_login");}}
          style={{
            width:"100%",padding:14,borderRadius:14,
            border:"1px solid rgba(255,255,255,.2)",
            background:"rgba(255,255,255,.06)",
            color:"rgba(255,255,255,.6)",
            fontSize:13,cursor:"pointer",fontFamily:"inherit",
          }}>
          <RubyText text={el
            ?"「{怖|こわ}いけど…{確認|かくにん}しないとSwitchが…」"
            :"「怖いけど…確認しないとSwitchが…」"
          }/>
        </button>
      </div>

      {/* iPhoneのテキスト入力バー風 */}
      <div style={{
        background:"#1c1c1e",
        borderTop:"0.5px solid rgba(255,255,255,.15)",
        padding:"8px 12px",
        display:"flex",
        alignItems:"center",
        gap:10,
      }}>
        <div style={{
          flex:1,
          background:"#2c2c2e",
          borderRadius:20,
          padding:"8px 14px",
          fontSize:14,
          color:"rgba(255,255,255,.3)",
        }}>
          <RubyText text={el?"SMS":"SMS"}/>
        </div>
        <div style={{
          width:32,height:32,borderRadius:"50%",
          background:"#007aff",
          display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:16,
        }}>↑</div>
      </div>
    </div>
  );

  if (phase === "fake_login") return (
    <div style={{
      minHeight:"100vh",
      background:"#f0f0f0",
      fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
    }}>
      {/* URLバー */}
      <div style={{background:"#f2f2f7",padding:"6px 10px",borderBottom:"0.5px solid #e0e0e0"}}>
        <div style={{
          background:"#fff",borderRadius:10,padding:"5px 10px",
          display:"flex",alignItems:"center",gap:6,
        }}>
          <span style={{fontSize:11,color:"#ff3b30"}}>⚠️</span>
          <span style={{
            fontSize:11,color:"#ff3b30",
            fontFamily:"monospace",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
          }}>
            nintendo-account-verify.com
          </span>
        </div>
      </div>
      {/* Nintendoヘッダー */}
      <div style={{background:red,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:"#fff",fontSize:16,fontWeight:900,letterSpacing:1}}>Nintendo</span>
        <span style={{color:"rgba(255,255,255,.7)",fontSize:11}}>
          <RubyText text={el?"{アカウント新規作成|あかうんとしんきさくせい}":"アカウント新規作成"}/>
        </span>
      </div>
      {/* メインコンテンツ */}
      <div style={{padding:"16px 16px 24px"}}>
        <div style={{
          textAlign:"center",fontSize:16,fontWeight:700,
          color:"#333",marginBottom:16,
        }}>
          <RubyText text={el?"ニンテンドーアカウント":"ニンテンドーアカウント"}/>
        </div>

        {/* パスワードでログインカード */}
        <div style={{
          background:"#fff",borderRadius:8,padding:20,
          marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,.1)",
        }}>
          <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:14}}>
            <RubyText text={el?"パスワードでログイン":"パスワードでログイン"}/>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{
              fontSize:12,color:"#333",marginBottom:4,
              display:"flex",alignItems:"center",gap:4,
            }}>
              <span style={{
                display:"inline-block",width:3,height:14,
                background:red,borderRadius:2,
              }}/>
              <RubyText text={el?"メールアドレス / ログインID":"メールアドレス / ログインID"}/>
            </div>
            <input
              value={emailInput}
              onChange={e=>setEmailInput(e.target.value)}
              placeholder="メールアドレス / ログインID"
              style={{
                width:"100%",border:"1px solid #ccc",borderRadius:4,
                padding:"9px 12px",fontSize:13,fontFamily:"inherit",
                outline:"none",color:"#333",
              }}
            />
          </div>
          <div style={{marginBottom:16}}>
            <div style={{
              fontSize:12,color:"#333",marginBottom:4,
              display:"flex",alignItems:"center",gap:4,
            }}>
              <span style={{
                display:"inline-block",width:3,height:14,
                background:red,borderRadius:2,
              }}/>
              <RubyText text={el?"パスワード":"パスワード"}/>
            </div>
            <input
              type="password"
              value={passwordInput}
              onChange={e=>setPasswordInput(e.target.value)}
              placeholder="パスワード"
              style={{
                width:"100%",border:"1px solid #ccc",borderRadius:4,
                padding:"9px 12px",fontSize:13,fontFamily:"inherit",
                outline:"none",
              }}
            />
          </div>
          <div style={{textAlign:"center"}}>
            <button
              onClick={()=>{
                feedback("tap");
                if(emailInput.length>0 && passwordInput.length>0){
                  setPhase("code_input");
                }
              }}
              style={{
                background: emailInput.length>0 && passwordInput.length>0
                  ? red : "#ccc",
                color:"#fff",border:"none",borderRadius:99,
                padding:"8px 40px",fontSize:14,fontWeight:700,
                cursor:"pointer",fontFamily:"inherit",
                transition:"background .3s",
              }}>
              <RubyText text={el?"ログイン":"ログイン"}/>
            </button>
          </div>
        </div>

        <div style={{textAlign:"center",marginBottom:12}}>
          <a style={{fontSize:12,color:"#1a6ecc",display:"block",marginBottom:6}}>
            ● <RubyText text={el?"メールアドレス/ログインIDを{忘|わす}れた{場合|ばあい}":"メールアドレス/ログインIDを忘れた場合"}/>
          </a>
          <a style={{fontSize:12,color:"#1a6ecc",display:"block"}}>
            ● <RubyText text={el?"パスワードを{忘|わす}れた{場合|ばあい}":"パスワードを忘れた場合"}/>
          </a>
        </div>

        {/* パスキーカード */}
        <div style={{
          background:"#fff",borderRadius:8,padding:16,
          marginBottom:12,textAlign:"center",
          boxShadow:"0 1px 4px rgba(0,0,0,.1)",
        }}>
          <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12}}>
            <RubyText text={el?"パスキーでログイン":"パスキーでログイン"}/>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:12}}>
            <div style={{
              width:36,height:36,borderRadius:"50%",
              background:"#e8f0fe",display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:20,
            }}>🙂</div>
            <div style={{
              width:36,height:36,borderRadius:"50%",
              background:"#e8f0fe",display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:20,
            }}>🔒</div>
          </div>
          <button style={{
            background:"#fff",color:"#333",
            border:"1px solid #ccc",borderRadius:99,
            padding:"6px 28px",fontSize:13,cursor:"pointer",
            fontFamily:"inherit",
          }}>
            <RubyText text={el?"ログイン":"ログイン"}/>
          </button>
        </div>

        {/* Google/Apple */}
        <div style={{
          background:"#fff",borderRadius:8,padding:16,
          boxShadow:"0 1px 4px rgba(0,0,0,.1)",
        }}>
          <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:12,textAlign:"center"}}>
            <RubyText text={el?"ほかのアカウントでかんたんログイン":"ほかのアカウントでかんたんログイン"}/>
          </div>
          <div style={{
            border:"1px solid #ddd",borderRadius:6,padding:"10px",
            textAlign:"center",marginBottom:8,fontSize:13,color:"#333",
          }}>G &nbsp; Google</div>
          <div style={{
            background:"#000",borderRadius:6,padding:"10px",
            textAlign:"center",fontSize:13,color:"#fff",
          }}>🍎 &nbsp; Appleでサインイン</div>
        </div>
      </div>
    </div>
  );

  if (phase === "code_input") return (
    <div style={{
      minHeight:"100vh",
      background:"#f0f0f0",
      fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
    }}>
      {/* URLバー */}
      <div style={{background:"#f2f2f7",padding:"6px 10px",borderBottom:"0.5px solid #e0e0e0"}}>
        <div style={{
          background:"#fff",borderRadius:10,padding:"5px 10px",
          display:"flex",alignItems:"center",gap:6,
        }}>
          <span style={{fontSize:11,color:"#ff3b30"}}>⚠️</span>
          <span style={{fontSize:11,color:"#ff3b30",fontFamily:"monospace"}}>
            nintendo-account-verify.com
          </span>
        </div>
      </div>
      {/* Nintendoヘッダー */}
      <div style={{background:red,padding:"10px 16px"}}>
        <span style={{color:"#fff",fontSize:16,fontWeight:900}}>Nintendo</span>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{
          textAlign:"center",fontSize:15,fontWeight:700,
          color:"#333",marginBottom:8,
        }}>
          <RubyText text={el?"メールアドレスによる{本人|ほんにん}{確認|かくにん}":"メールアドレスによる本人確認"}/>
        </div>
        <div style={{
          fontSize:11,color:"#555",lineHeight:1.6,
          marginBottom:14,textAlign:"center",
        }}>
          <RubyText text={el
            ?"{登録|とうろく}されているメールアドレス{宛|あて}に「{認証|にんしょう}コード」をお{送|おく}りしました。\nメールの{本文|ほんぶん}に{記載|きさい}されている「{認証|にんしょう}コード」を{入力|にゅうりょく}してください。\n※「{認証|にんしょう}コード」の{有効期限|ゆうこうきげん}は、メールをお{送|おく}りしてから1{時間|じかん}です。"
            :"登録されているメールアドレス宛に「認証コード」をお送りしました。\nメールの本文に記載されている「認証コード」を入力してください。\n※「認証コード」の有効期限は、メールをお送りしてから1時間です。"
          }/>
        </div>

        {/* Miiアバター */}
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{
            width:64,height:64,borderRadius:"50%",
            background:"#e0d0b0",margin:"0 auto",
            display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:32,
          }}>🧒</div>
        </div>

        {/* フォーム */}
        <div style={{
          background:"#fff",borderRadius:8,padding:16,
          marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,.1)",
        }}>
          <div style={{fontSize:12,color:"#555",fontWeight:700,marginBottom:4}}>
            <RubyText text={el?"ニンテンドーアカウント":"ニンテンドーアカウント"}/>
          </div>
          <div style={{fontSize:12,color:"#555",marginBottom:12}}>
            {emailInput || "h.***@gmail.com"}
          </div>
          <div style={{
            fontSize:12,color:"#333",marginBottom:4,
            display:"flex",alignItems:"center",gap:4,
          }}>
            <span style={{
              display:"inline-block",width:3,height:14,
              background:red,borderRadius:2,
            }}/>
            <RubyText text={el?"{認証|にんしょう}コード":"{認証}コード"}/>
          </div>
          <input
            value={codeInput}
            onChange={e=>setCodeInput(e.target.value.replace(/\D/g,'').slice(0,6))}
            placeholder="------"
            maxLength={6}
            style={{
              width:"100%",
              border:`1px solid ${codeInput.length>0?"#4a90d9":"#ccc"}`,
              borderRadius:4,padding:"9px 12px",
              fontSize:22,fontFamily:"monospace",
              letterSpacing:8,outline:"none",textAlign:"center",
            }}
          />
        </div>

        {/* 実際に届いたメール通知演出 */}
        <div style={{
          background:"#e8f4fd",border:"1px solid #b3d9f7",
          borderRadius:10,padding:"12px",marginBottom:14,
        }}>
          <div style={{
            fontSize:11,fontWeight:700,color:"#1565c0",marginBottom:6,
          }}>
            📧 <RubyText text={el?"メールが{届|とど}いています":"メールが届いています"}/>
          </div>
          <div style={{fontSize:11,color:"#333",lineHeight:1.7}}>
            <RubyText text={el
              ?"{差出人|さしだしにん}：no-reply@nintendo.com\n{件名|けんめい}：ニンテンドーアカウント {認証|にんしょう}コード\n\n{認証|にんしょう}コード："
              :"差出人：no-reply@nintendo.com\n件名：ニンテンドーアカウント 認証コード\n\n認証コード："
            }/>
            <strong style={{fontSize:18,color:red,letterSpacing:3}}>482916</strong><br/>
            <span style={{color:"#999",fontSize:10}}>
              <RubyText text={el?"{有効期限|ゆうこうきげん}：1{時間|じかん}":"有効期限：1時間"}/>
            </span>
          </div>
        </div>

        {/* 警告（コードを入力したら表示） */}
        {codeInput.length===6 && (
          <div style={{
            background:"#fff3f3",border:"1px solid #ffcccc",
            borderRadius:8,padding:"10px 12px",marginBottom:14,
            fontSize:11,color:"#cc0000",lineHeight:1.6,
            animation:"mamFadeUp .4s ease",
          }}>
            <RubyText text={el
              ?"⚠️ なぜ{本物|ほんもの}のコードが{届|とど}いたの？\n{攻撃|こうげき}{者|しゃ}が{裏|うら}でリアルタイムに{本物|ほんもの}サイトへ{入力|にゅうりょく}しているから！"
              :"⚠️ なぜ本物のコードが届いたの？\n攻撃者が裏でリアルタイムに本物サイトへ入力しているから！"
            }/>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <button style={{
            flex:1,padding:10,background:"#fff",
            border:"1px solid #ccc",borderRadius:99,
            fontSize:13,cursor:"pointer",color:"#333",fontFamily:"inherit",
          }}>
            <RubyText text={el?"キャンセル":"キャンセル"}/>
          </button>
          <button
            onClick={()=>{
              feedback("tap");
              if(codeInput.length===6) setPhase("stolen");
            }}
            style={{
              flex:1,padding:10,
              background:codeInput.length===6 ? red : "#ccc",
              border:"none",borderRadius:99,
              fontSize:13,fontWeight:700,
              cursor:"pointer",color:"#fff",fontFamily:"inherit",
              transition:"background .3s",
            }}>
            <RubyText text={el?"{認証|にんしょう}する":"認証する"}/>
          </button>
        </div>

        <div style={{textAlign:"center"}}>
          <a style={{fontSize:12,color:"#1a6ecc",display:"block",marginBottom:4}}>
            ● <RubyText text={el?"{認証|にんしょう}コードを{再送|さいそう}する":"認証コードを再送する"}/>
          </a>
          <a style={{fontSize:12,color:"#1a6ecc",display:"block"}}>
            ● <RubyText text={el?"{別|べつ}の{本人確認|ほんにんかくにん}{方法|ほうほう}を{使|つか}う":"別の本人確認方法を使う"}/>
          </a>
        </div>
      </div>
    </div>
  );

  if (phase === "stolen") return (
    <div style={{
      minHeight:"100vh",
      background:"#f0f0f0",
      fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
      display:"flex",flexDirection:"column",
    }}>
      {/* Nintendoヘッダー */}
      <div style={{background:red,padding:"10px 16px"}}>
        <span style={{color:"#fff",fontSize:16,fontWeight:900}}>Nintendo</span>
      </div>

      {/* 「確認完了」偽画面 */}
      <div style={{padding:24,textAlign:"center"}}>
        <div style={{
          background:"#fff",borderRadius:12,padding:28,
          boxShadow:"0 1px 4px rgba(0,0,0,.1)",marginBottom:20,
        }}>
          <div style={{fontSize:40,marginBottom:12}}>✅</div>
          <div style={{fontSize:16,fontWeight:700,color:"#333",marginBottom:8}}>
            <RubyText text={el?"{確認|かくにん}が{完了|かんりょう}しました":"確認が完了しました"}/>
          </div>
          <div style={{fontSize:12,color:"#666",lineHeight:1.7}}>
            <RubyText text={el
              ?"ありがとうございました。\nアカウントの{安全性|あんぜんせい}を{確認|かくにん}しました。\nそのままご{利用|りよう}いただけます。"
              :"ありがとうございました。\nアカウントの安全性を確認しました。\nそのままご利用いただけます。"
            }/>
          </div>
        </div>

        {/* ハナの心理 */}
        <div style={{
          background:"rgba(255,200,0,.08)",
          borderLeft:"3px solid #f5c842",
          padding:"10px 14px",fontSize:12,color:"#7a5c00",
          fontStyle:"italic",borderRadius:"0 10px 10px 0",
          lineHeight:1.7,marginBottom:20,textAlign:"left",
        }}>
          <RubyText text={el
            ?"ハナ：「よかった、{確認|かくにん}できた。これでSwitchは{大丈夫|だいじょうぶ}かな…」"
            :"ハナ：「よかった、確認できた。これでSwitchは大丈夫かな…」"
          }/>
        </div>

        {/* 実際は… */}
        <div style={{
          background:"rgba(230,0,18,.06)",
          border:"1px solid rgba(230,0,18,.2)",
          borderRadius:12,padding:"14px 16px",
          textAlign:"left",marginBottom:20,
        }}>
          <div style={{
            fontSize:12,fontWeight:700,color:red,
            marginBottom:8,
          }}>
            <RubyText text={el?"{実際|じっさい}には…":"実際には…"}/>
          </div>
          {[
            el?"攻撃者がハナのアカウントに侵入完了":"攻撃者がハナのアカウントに侵入完了",
            el?"登録メールアドレスを攻撃者のものに変更":"登録メールアドレスを攻撃者のものに変更",
            el?"親のクレジットカードでeShop購入を開始":"親のクレジットカードでeShop購入を開始",
          ].map((t,i)=>(
            <div key={i} style={{
              display:"flex",gap:8,marginBottom:6,
              fontSize:12,color:"#555",alignItems:"flex-start",
            }}>
              <span style={{color:red,flexShrink:0}}>▶</span>
              <RubyText text={t}/>
            </div>
          ))}
        </div>

        <button
          onClick={()=>{feedback("tap");setPhase("aftermath_email");}}
          style={{
            width:"100%",padding:14,borderRadius:12,border:"none",
            background:"linear-gradient(135deg,#333,#111)",
            color:"#fff",fontSize:14,fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",
          }}>
          <RubyText text={el?"{翌朝|よくあさ}…":"翌朝…"}/>
        </button>
      </div>
    </div>
  );

  if (phase === "aftermath_email") {

    const emails = [
      {
        title: el?"[マイニンテンドーストア]ご{注文|ちゅうもん}{完了|かんりょう}のお{知|し}らせ":"[マイニンテンドーストア]ご注文完了のお知らせ",
        item: el?"ニンテンドー ゲームキューブ コントローラー":"ニンテンドー ゲームキューブ コントローラー",
        price:"7,980円",time:"2:14",
      },
      {
        title: el?"[マイニンテンドーストア]ご{注文|ちゅうもん}{完了|かんりょう}のお{知|し}らせ":"[マイニンテンドーストア]ご注文完了のお知らせ",
        item: el?"Nintendo Switch Proコントローラー":"Nintendo Switch Proコントローラー",
        price:"8,978円",time:"2:16",
      },
      {
        title: el?"ニンテンドーeShop ご{購入|こうにゅう}のお{知|し}らせ":"ニンテンドーeShop ご購入のお知らせ",
        item: el?"ゼルダの{伝説|でんせつ} ティアーズ オブ ザ キングダム":"ゼルダの伝説 ティアーズ オブ ザ キングダム",
        price:"7,700円",time:"2:19",
      },
      {
        title: el?"[マイニンテンドーストア]ご{注文|ちゅうもん}{完了|かんりょう}のお{知|し}らせ":"[マイニンテンドーストア]ご注文完了のお知らせ",
        item: el?"Nintendo Switch（{有機ELモデル|ゆうきELもでる}）":"Nintendo Switch（有機ELモデル）",
        price:"37,980円",time:"2:23",
      },
    ];

    const visibleEmails = emails.slice(0, emailStep+1);
    const total = emails.slice(0, emailStep+1)
      .reduce((s,e)=>s+parseInt(e.price.replace(/[^0-9]/g,'')),0);

    return (
      <div style={{
        minHeight:"100vh",
        background:"#1c1c1e",
        fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
        color:"#fff",
      }}>
        {/* ステータスバー */}
        <div style={{padding:"10px 20px 6px",display:"flex",justifyContent:"space-between",fontSize:12}}>
          <span>7:23</span><span>📶 🔋</span>
        </div>
        {/* メールヘッダー */}
        <div style={{
          padding:"6px 16px 10px",
          borderBottom:"0.5px solid rgba(255,255,255,.1)",
        }}>
          <div style={{fontSize:18,fontWeight:700}}>
            <RubyText text={el?"{受信|じゅしん}トレイ":"受信トレイ"}/>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>
            {emailStep+1}<RubyText text={el?"件の{未読|みどく}メール":"件の未読メール"}/>
          </div>
        </div>

        {/* メール一覧 */}
        <div>
          {visibleEmails.map((m,i)=>(
            <div key={i} style={{
              background:i===emailStep?"#2c2c2e":"rgba(44,44,46,.6)",
              borderBottom:"0.5px solid rgba(255,255,255,.08)",
              padding:"12px 16px",
              animation:i===emailStep?"mamFadeUp .5s ease":"none",
            }}>
              <div style={{
                display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:3,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {i===emailStep && (
                    <div style={{
                      width:8,height:8,borderRadius:"50%",
                      background:"#007aff",flexShrink:0,
                    }}/>
                  )}
                  <span style={{
                    fontSize:13,fontWeight:i===emailStep?700:500,
                  }}>Nintendo</span>
                </div>
                <span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>
                  {m.time}
                </span>
              </div>
              <div style={{
                fontSize:12,
                fontWeight:i===emailStep?600:400,
                color:i===emailStep?"rgba(255,255,255,.9)":"rgba(255,255,255,.5)",
                marginBottom:2,
              }}>
                <RubyText text={m.title}/>
              </div>
              <div style={{
                fontSize:11,
                color:i===emailStep?"rgba(255,255,255,.7)":"rgba(255,255,255,.3)",
              }}>
                <RubyText text={m.item}/> {m.price}
              </div>
            </div>
          ))}
        </div>

        {/* 合計金額（最後のメール表示後） */}
        {emailStep>=3 && (
          <div style={{
            background:"rgba(255,59,48,.15)",
            border:"1px solid rgba(255,59,48,.4)",
            borderRadius:12,margin:"14px 16px",
            padding:"14px",textAlign:"center",
            animation:"mamFadeUp .5s ease",
          }}>
            <div style={{
              fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:4,
            }}>
              <RubyText text={el?"{合計|ごうけい}{被害|ひがい}{額|がく}":"合計被害額"}/>
            </div>
            <div style={{
              fontSize:30,fontWeight:900,color:"#ff3b30",
            }}>
              62,638<span style={{fontSize:18}}>円</span>
            </div>
          </div>
        )}

        {/* ハナの心理 */}
        {emailStep>=3 && (
          <div style={{
            margin:"0 16px 14px",
            background:"rgba(255,200,0,.08)",
            borderLeft:"3px solid #f5c842",
            padding:"10px 14px",fontSize:11,color:"#f5c842",
            fontStyle:"italic",borderRadius:"0 8px 8px 0",lineHeight:1.7,
            animation:"mamFadeUp .5s ease",
          }}>
            <RubyText text={el
              ?"ハナ：「え…なんでNintendoからメールがこんなに…？Switch{本体|ほんたい}なんて{買|か}ってないのに！もしかして…！」"
              :"ハナ：「え…なんでNintendoからメールがこんなに…？Switch本体なんて買ってないのに！もしかして…！」"
            }/>
          </div>
        )}

        {/* ボタン */}
        <div style={{padding:"0 16px 20px"}}>
          {emailStep<3 ? (
            <button
              onClick={()=>{feedback("tap");setEmailStep(s=>s+1);}}
              style={{
                width:"100%",padding:13,borderRadius:12,
                background:"#2c2c2e",color:"rgba(255,255,255,.7)",
                fontSize:13,cursor:"pointer",fontFamily:"inherit",
                border:"1px solid rgba(255,255,255,.15)",
              }}>
              <RubyText text={el?"{次|つぎ}のメールが{届|とど}く →":"次のメールが届く →"}/>
            </button>
          ) : (
            <button
              onClick={()=>{feedback("tap");setPhase("aftermath_switch");}}
              style={{
                width:"100%",padding:14,borderRadius:12,border:"none",
                background:"linear-gradient(135deg,#333,#111)",
                color:"#fff",fontSize:14,fontWeight:700,
                cursor:"pointer",fontFamily:"inherit",
              }}>
              <RubyText text={el?"Switchを{起動|きどう}してみる →":"Switchを起動してみる →"}/>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "aftermath_switch") return (
    <div style={{
      minHeight:"100vh",
      background:"#1a1a2e",
      fontFamily:"-apple-system,'Hiragino Sans',sans-serif",
      color:"#fff",
      display:"flex",flexDirection:"column",
    }}>
      {/* Switch起動演出 */}
      <div style={{
        background:"#1a1a2e",
        padding:"32px 20px 24px",
        textAlign:"center",
        borderBottom:"0.5px solid rgba(255,255,255,.08)",
      }}>
        <div style={{fontSize:48,marginBottom:12}}>🎮</div>
        <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Nintendo Switch</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>
          <RubyText text={el?"{起動中|きどうちゅう}…":"起動中…"}/>
        </div>
      </div>

      {/* エラー */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{
          background:"#fff",borderRadius:14,padding:20,
          textAlign:"center",marginBottom:14,
        }}>
          <div style={{fontSize:32,marginBottom:10}}>⚠️</div>
          <div style={{
            fontSize:15,fontWeight:700,color:red,marginBottom:8,
            whiteSpace:"pre-line",
          }}>
            <RubyText text={el?"このユーザーでは\nログインできません":"このユーザーでは\nログインできません"}/>
          </div>
          <div style={{fontSize:12,color:"#555",lineHeight:1.7,whiteSpace:"pre-line"}}>
            <RubyText text={el
              ?"ニンテンドーアカウントの\n{情報|じょうほう}が{変更|へんこう}されました。\n{再度|さいど}ログインしてください。"
              :"ニンテンドーアカウントの\n情報が変更されました。\n再度ログインしてください。"
            }/>
          </div>
        </div>

        {/* セーブデータ */}
        <div style={{
          background:"rgba(255,255,255,.06)",
          border:"0.5px solid rgba(255,255,255,.1)",
          borderRadius:14,padding:"14px 16px",marginBottom:14,
        }}>
          <div style={{
            fontSize:12,color:"rgba(255,255,255,.5)",
            marginBottom:12,textAlign:"center",
          }}>
            <RubyText text={el?"セーブデータ":"セーブデータ"}/>
          </div>
          <div style={{
            display:"flex",gap:8,justifyContent:"center",
            marginBottom:12,
          }}>
            {[
              {emoji:"🏝️",name:el?"あつまれ\nどうぶつの{森|もり}":"あつまれ\nどうぶつの森"},
              {emoji:"⚔️",name:el?"ゼルダの{伝説|でんせつ}":"ゼルダの伝説"},
              {emoji:"🐾",name:el?"ポケモン\nスカーレット":"ポケモン\nスカーレット"},
            ].map((g,i)=>(
              <div key={i} style={{
                background:"rgba(255,255,255,.06)",
                borderRadius:10,padding:"10px 8px",
                textAlign:"center",flex:1,
              }}>
                <div style={{fontSize:24,marginBottom:6}}>{g.emoji}</div>
                <div style={{
                  fontSize:9,color:"rgba(255,255,255,.4)",
                  marginBottom:6,whiteSpace:"pre-line",lineHeight:1.4,
                }}>
                  <RubyText text={g.name}/>
                </div>
                <div style={{
                  fontSize:9,color:"#ff3b30",fontWeight:700,
                }}>
                  <RubyText text={el?"{削除済|さくじょず}み":"削除済み"}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            textAlign:"center",fontSize:12,
            color:"#ff3b30",fontWeight:700,
          }}>
            <RubyText text={el?"{全|すべ}てのセーブデータが{削除|さくじょ}されました":"全てのセーブデータが削除されました"}/>
          </div>
        </div>

        {/* ハナの心理 */}
        <div style={{
          background:"rgba(255,59,48,.08)",
          borderLeft:"3px solid #ff3b30",
          padding:"10px 14px",fontSize:12,
          color:"#ff6b6b",fontStyle:"italic",
          borderRadius:"0 10px 10px 0",lineHeight:1.7,
          marginBottom:20,
        }}>
          <RubyText text={el
            ?"ハナ：「あつ{森|もり}のデータが…{消|き}えた。300{時間|じかん}{遊|あそ}んだのに…{全部|ぜんぶ}…お{母|かあ}さんのクレカで60,000{円|えん}以上{使|つか}われて…」"
            :"ハナ：「あつ森のデータが…消えた。300時間遊んだのに…全部…お母さんのクレカで60,000円以上使われて…」"
          }/>
        </div>

        <button
          onClick={()=>{feedback("tap");setPhase("reveal");}}
          style={{
            width:"100%",padding:14,borderRadius:12,border:"none",
            background:`linear-gradient(135deg,${red},#b00010)`,
            color:"#fff",fontSize:14,fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",marginBottom:20,
          }}>
          <RubyText text={el?"{何|なに}が{起|お}きたのか{知|し}る →":"何が起きたのか知る →"}/>
        </button>
      </div>
    </div>
  );

  if (phase === "reveal") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"24px 20px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
    }}>
      <div style={{maxWidth:440,margin:"0 auto"}}>

        <div style={{fontSize:11,fontWeight:900,color:"rgba(230,0,18,.7)",marginBottom:6}}>
          🔍 <RubyText text={el?"{何|なに}が{起|お}きていたのか":"何が起きていたのか"}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,marginBottom:16,lineHeight:1.5}}>
          <RubyText text={el
            ?"これは「フィッシング{詐欺|さぎ}」だった"
            :"これは「フィッシング詐欺」だった"
          }/>
        </div>

        {/* 攻撃の流れ図 */}
        {[
          {
            step:"1",
            icon:"📱",
            title:el?"{偽|にせ}SMSで{誘導|ゆうどう}":"偽SMSで誘導",
            desc:el?"{本物|ほんもの}そっくりの{緊急|きんきゅう}メッセージを{送|おく}り、{偽|にせ}サイトへ{誘|さそ}う。{焦|あせ}りを{利用|りよう}する{手口|てぐち}。":"本物そっくりの緊急メッセージを送り、偽サイトへ誘う。焦りを利用する手口。",
            color:"#f97316",
          },
          {
            step:"2",
            icon:"🌐",
            title:el?"{偽|にせ}サイトでID・パスワードを{盗|ぬす}む":"偽サイトでID・パスワードを盗む",
            desc:el?"{本物|ほんもの}そっくりの{偽|にせ}ログイン{画面|がめん}。URLが{違|ちが}うのが{唯一|ゆいいつ}の{見分|みわ}け{方|かた}。":"本物そっくりの偽ログイン画面。URLが違うのが唯一の見分け方。",
            color:"#ef4444",
          },
          {
            step:"3",
            icon:"⚡",
            title:el?"{リアルタイムで|りあるたいむで}2{段階|だんかい}{認証|にんしょう}も{突破|とっぱ}":"リアルタイムで2段階認証も突破",
            desc:el?"{攻撃|こうげき}{者|しゃ}が{裏|うら}で{同時|どうじ}に{本物|ほんもの}サイトへ{入力|にゅうりょく}。{届|とど}いた{本物|ほんもの}のコードを{偽|にせ}サイトに{入力|にゅうりょく}させる。":"攻撃者が裏で同時に本物サイトへ入力。届いた本物のコードを偽サイトに入力させる。",
            color:"#dc2626",
          },
          {
            step:"4",
            icon:"💳",
            title:el?"{登録|とうろく}クレジットカードで{大量|たいりょう}{購入|こうにゅう}":"登録クレジットカードで大量購入",
            desc:el?"アカウントを{乗|の}っ{取|と}った{後|あと}、{登録|とうろく}済みのクレカで{即座|そくざ}に{購入|こうにゅう}。{返金|へんきん}されないケースも。":"アカウントを乗っ取った後、登録済みのクレカで即座に購入。返金されないケースも。",
            color:"#b91c1c",
          },
        ].map((s,i)=>(
          <div key={i} style={{
            display:"flex",gap:12,marginBottom:12,
            animation:`mamFadeUp .5s ${i*0.1}s ease both`,
          }}>
            <div style={{
              width:36,height:36,borderRadius:"50%",
              background:`rgba(${s.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')}, .15)`,
              border:`2px solid ${s.color}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,flexShrink:0,
            }}>
              {s.icon}
            </div>
            <div style={{
              background:"rgba(255,255,255,.04)",
              border:"0.5px solid rgba(255,255,255,.1)",
              borderRadius:12,padding:"10px 14px",flex:1,
            }}>
              <div style={{
                fontSize:12,fontWeight:900,
                color:s.color,marginBottom:4,
              }}>
                STEP{s.step}：<RubyText text={s.title}/>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.65)",lineHeight:1.6}}>
                <RubyText text={s.desc}/>
              </div>
            </div>
          </div>
        ))}

        {/* モリィのまとめ */}
        <div style={{
          display:"flex",alignItems:"flex-start",gap:10,
          marginBottom:14,marginTop:4,
        }}>
          <OwlMolly size={44}/>
          <div style={{
            background:"#fff",borderRadius:"0 14px 14px 14px",
            padding:"10px 14px",flex:1,
          }}>
            <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
              <RubyText text={el
                ?"「{本物|ほんもの}からのメールだ」と{思|おも}っても、{必|かなら}ずURLを{確認|かくにん}しよう。{公式|こうしき}サイトのURLと{少|すこ}しでも{違|ちが}えば{偽物|にせもの}。{絶対|ぜったい}にパスワードや{認証|にんしょう}コードを{入力|にゅうりょく}しないで！"
                :"「本物からのメールだ」と思っても、必ずURLを確認しよう。公式サイトのURLと少しでも違えば偽物。絶対にパスワードや認証コードを入力しないで！"
              }/>
            </div>
          </div>
        </div>

        <button
          onClick={()=>{feedback("tap");setPhase("countermeasures");}}
          style={{
            width:"100%",padding:14,borderRadius:12,border:"none",
            background:`linear-gradient(135deg,${red},#b00010)`,
            color:"#fff",fontSize:14,fontWeight:900,
            cursor:"pointer",fontFamily:"inherit",
          }}>
          <RubyText text={el?"{見抜|みぬ}き{方|かた}を{学|まな}ぶ →":"見抜き方を学ぶ →"}/>
        </button>
      </div>
    </div>
  );

  if (phase === "countermeasures") return (
    <Ep4Countermeasures el={el} red={red} onComplete={() => setPhase("keywords")} />
  );

  if (phase === "keywords") return (
    <KeywordPhase
      epKey="ep4"
      accentColor={red}
      onComplete={() => setPhase("pre_dialogue")}
    />
  );

  if (phase === "pre_dialogue") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#1a0d2e,#120920)",
      padding:"24px 20px 40px",
      fontFamily:"'Zen Maru Gothic',sans-serif",
      color:"#fff",
    }}>
      <div style={{maxWidth:440,margin:"0 auto"}}>
        <div style={{
          display:"flex",alignItems:"flex-start",gap:10,marginBottom:20,
        }}>
          <OwlMolly size={44}/>
          <div style={{
            background:"#fff",borderRadius:"0 14px 14px 14px",
            padding:"10px 14px",flex:1,
          }}>
            <div style={{fontSize:12,color:"#1e293b",lineHeight:1.8}}>
              <RubyText text={el
                ?"フィッシング{詐欺|さぎ}はとても{巧妙|こうみょう}で、{大人|おとな}でも{騙|だま}されることがあるよ。おうちの{人|ひと}と{一緒|いっしょ}に{対策|たいさく}を{考|かんが}えてみよう！"
                :"フィッシング詐欺はとても巧妙で、大人でも騙されることがあるよ。おうちの人と一緒に対策を考えてみよう！"
              }/>
            </div>
          </div>
        </div>
        <button
          onClick={()=>{feedback("tap");setPhase("dialogue");}}
          style={{
            width:"100%",padding:16,borderRadius:14,border:"none",
            background:`linear-gradient(135deg,${red},#b00010)`,
            color:"#fff",fontSize:15,fontWeight:900,
            cursor:"pointer",fontFamily:"inherit",
          }}>
          <RubyText text={el?"{親子|おやこ}で{話|はな}し{合|あ}おう →":"親子で話し合おう →"}/>
        </button>
      </div>
    </div>
  );

  const ep4Questions = [
    {
      id: "q1",
      question: "なぜ偽物のログイン画面に気づけなかったんだろう？",
      questionEl: "なぜにせもののログイン{画面|がめん}に{気|き}づけなかったんだろう？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "URLをよく見ると本物との違いがあった。どこが違ったか一緒に確認しよう",
        "「焦り」「不安」を感じた時ほど冷静に確認する習慣を作ろう",
      ],
      hintsEl: [
        "URLをよく{見|み}ると{本物|ほんもの}との{違|ちが}いがあった。どこが{違|ちが}ったか{一緒|いっしょ}に{確認|かくにん}しよう",
        "「あせり」「{不安|ふあん}」を{感|かん}じた{時|とき}ほど{冷静|れいせい}に{確認|かくにん}する{習慣|しゅうかん}を{作|つく}ろう",
      ],
    },
    {
      id: "q2",
      question: "友達から急に『ギフトカード買って』とLINEが来たら、どうする？",
      questionEl: "{友達|ともだち}から{急|きゅう}に「ギフトカードかって」とLINEが{来|き}たら、どうする？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "LINEのメッセージだけで判断しない。必ず電話で本人に確認する習慣を作ろう",
        "「急いで」「今すぐ」という言葉が出たら要注意。焦らせるのが詐欺の手口",
      ],
      hintsEl: [
        "LINEのメッセージだけで{判断|はんだん}しない。{必|かなら}ず{電話|でんわ}で{本人|ほんにん}に{確認|かくにん}する{習慣|しゅうかん}を{作|つく}ろう",
        "「{急|いそ}いで」「{今|いま}すぐ」という{言葉|ことば}が{出|で}たら{要注意|ようちゅうい}。{焦|あせ}らせるのが{詐欺|さぎ}の{手口|てぐち}",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0d2e,#120920)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep4Questions}
            epKey="ep4"
            accentColor={red}
            onComplete={() => setPhase("homework")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0d2e,#120920)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor={red}
          onComplete={() => setPhase("complete")}
          tasks={el ? [
            { title: "2{段階|だんかい}{認証|にんしょう}を{設定|せってい}する", desc: "おうちの{人|ひと}と{一緒|いっしょ}に、よく{使|つか}うアプリの2{段階|だんかい}{認証|にんしょう}をオンにしよう" },
            { title: "{公式|こうしき}サイトをブックマークする", desc: "SMSやメールのリンクではなく、ブックマークから{開|ひら}く{習慣|しゅうかん}をつけよう" },
            { title: "「{認証|にんしょう}コードは{誰|だれ}にも{教|おし}えない」を{約束|やくそく}する", desc: "おうちの{人|ひと}と{家族|かぞく}のルールにしよう" },
          ] : [
            { title: "2段階認証を設定する", desc: "おうちの人と一緒に、よく使うアプリの2段階認証をオンにしよう" },
            { title: "公式サイトをブックマークする", desc: "SMSやメールのリンクではなく、ブックマークから開く習慣をつけよう" },
            { title: "「認証コードは誰にも教えない」を約束する", desc: "おうちの人と家族のルールにしよう" },
          ]}
        />
      </div>
    </div>
  );

  if (phase === "complete") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#2a0a14,#1a0510,#0f020a)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [red, "#ff5a6e", "#ff8a8a", "#b00010", "#ffd28a"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fff0f1)", borderRadius: 22, padding: "28px 22px", border: `3px double ${red}`, textAlign: "center", boxShadow: `0 20px 60px ${red}33`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: red }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#b00010", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#7a000c", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#9a0010", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={el ? `あなたは「マモル」{第|だい}4{話|わ}` : `あなたは「マモル」第4話`} /><br />
            <strong style={{ color: "#7a000c", fontSize: 14 }}><RubyText text={el ? "それ、{本当|ほんとう}に{友達|ともだち}から？" : "それ、本当に友達から？"} /></strong><br />
            <RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${red}33,#ffd0d4)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#b00010", marginBottom: 3 }}>EPISODE 04 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#7a000c", fontWeight: 900 }}>🎣 <RubyText text={el ? "フィッシング{詐欺|さぎ} {免疫|めんえき}マスター" : "フィッシング詐欺 免疫マスター"} /> 🎣</div>
          </div>
          <div style={{ fontSize: 10, color: red, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP4 クリア！", text: "フィッシング詐欺と2段階認証を学んだ！SNSリテラシーアプリ「マモル」🎣" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${red}`, borderRadius: 14, color: "#b00010", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(3); }}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${red},#b00010)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );

  return null;
}

function Episode5({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  // intro → group_normal → choice → aftermath → victim → data → checkpoints → dialogue → complete
  const [choice, setChoice] = useState(null); // "a" | "b" | "c"
  const [msgStep, setMsgStep] = useState(0);
  const [victimStep, setVictimStep] = useState(0);
  const [checkStep, setCheckStep] = useState(0);

  const pink = "#ec4899";
  const pinkDark = "#be185d";

  const choiceData = ageMode === "elementary" ? {
    a: {
      label: "{一緒|いっしょ}に{笑|わら}う（{同意|どうい}する）",
      emoji: "😂",
      result: "{加害者|かがいしゃ}になってしまいました",
      resultColor: "#dc2626",
      resultIcon: "⚠️",
      insight: "{悪口|わるくち}に「わかる」と{同意|どうい}したことで、あなたも**いじめの{加害者|かがいしゃ}**になりました。{本人|ほんにん}に{直接|ちょくせつ}{言|い}っていなくても、グループで「みんなが{悪|わる}く{言|い}っている」という{空気|くうき}を{作|つく}ることがいじめです。",
    },
    b: {
      label: "{無視|むし}する（{既読|きどく}スルー）",
      emoji: "👁️",
      result: "{傍観者|ぼうかんしゃ}になってしまいました",
      resultColor: "#f97316",
      resultIcon: "⚠️",
      insight: "{何|なに}も{言|い}わずにいたことで、あなたは**{傍観者|ぼうかんしゃ}**になりました。「{加担|かたん}していない」と{思|おも}うかもしれませんが、{反対|はんたい}しないことは「{悪口|わるくち}を{認|みと}めた」と{同|おな}じ{意味|いみ}を{持|も}ちます。いじめの70%{以上|いじょう}に{傍観者|ぼうかんしゃ}が{存在|そんざい}します。",
    },
    c: {
      label: "{止|と}めようとする",
      emoji: "🛑",
      result: "{勇気|ゆうき}ある{行動|こうどう}でした",
      resultColor: "#16a34a",
      resultIcon: "✨",
      insight: "「{傷|きず}つくよ」と{伝|つた}えた、または{先生|せんせい}に{相談|そうだん}したのは**{正|ただ}しい{行動|こうどう}**です。{直接|ちょくせつ}{止|と}めなくてOK。{先生|せんせい}に「グループで{悪口|わるくち}が{流|なが}れてます」と{伝|つた}えるだけでも、{状況|じょうきょう}を{変|か}えられます。{自分|じぶん}を{守|まも}りながら{助|たす}けることができる。",
    },
  } : {
    a: {
      label: "一緒に笑う（同意する）",
      emoji: "😂",
      result: "加害者になってしまいました",
      resultColor: "#dc2626",
      resultIcon: "⚠️",
      insight: "悪口に「わかる」と同意したことで、あなたも**いじめの加害者**になりました。本人に直接言っていなくても、グループで「みんなが悪く言っている」という空気を作ることがいじめです。",
    },
    b: {
      label: "無視する（既読スルー）",
      emoji: "👁️",
      result: "傍観者になってしまいました",
      resultColor: "#f97316",
      resultIcon: "⚠️",
      insight: "何も言わずにいたことで、あなたは**傍観者**になりました。「加担していない」と思うかもしれませんが、反対しないことは「悪口を認めた」と同じ意味を持ちます。いじめの70%以上に傍観者が存在します。",
    },
    c: {
      label: "止めようとする",
      emoji: "🛑",
      result: "勇気ある行動でした",
      resultColor: "#16a34a",
      resultIcon: "✨",
      insight: "「傷つくよ」と伝えた、または先生に相談したのは**正しい行動**です。直接止めなくてOK。先生に「グループで悪口が流れてます」と伝えるだけでも、状況を変えられます。自分を守りながら助けることができる。",
    },
  };

  const stats = ageMode === "elementary" ? [
    { num: "70%", desc: "のいじめには{傍観者|ぼうかんしゃ}がいる（{文科省|もんかしょう}{調査|ちょうさ}）" },
    { num: "92%", desc: "の{被害者|ひがいしゃ}が「{誰|だれ}かに{気|き}づいてほしかった」と{回答|かいとう}" },
    { num: "1{言|こと}", desc: "の「やめて」がいじめを{止|と}めた{事例|じれい}が{多数|たすう}{報告|ほうこく}されている" },
    { num: "3{倍|ばい}", desc: "グループいじめの{被害|ひがい}は{対面|たいめん}いじめの3{倍|ばい}{長期化|ちょうきか}する" },
  ] : [
    { num: "70%", desc: "のいじめには傍観者がいる（文科省調査）" },
    { num: "92%", desc: "の被害者が「誰かに気づいてほしかった」と回答" },
    { num: "1言", desc: "の「やめて」がいじめを止めた事例が多数報告されている" },
    { num: "3倍", desc: "グループいじめの被害は対面いじめの3倍長期化する" },
  ];

  const safeSteps = ageMode === "elementary" ? [
    { icon: "🤐", title: "{悪口|わるくち}には{乗|の}らない", desc: "{既読|きどく}スルーではなく「それはちょっと」と{一言|ひとこと}{添|そ}えるだけでも{違|ちが}う。" },
    { icon: "📱", title: "スクショして{拡散|かくさん}しない", desc: "「ここだけの{話|はなし}」はすぐ{広|ひろ}がる。{受|う}け{取|と}ったら{止|と}まる。" },
    { icon: "👂", title: "{被害者|ひがいしゃ}に{声|こえ}をかける", desc: "「{大丈夫|だいじょうぶ}？」の{一言|ひとこと}が、{孤立感|こりつかん}を{大|おお}きく{和|やわ}らげる。" },
    { icon: "🗣️", title: "{先生|せんせい}・{大人|おとな}に{伝|つた}える", desc: "「チクり」ではなく「{助|たす}けを{求|もと}めること」。{直接|ちょくせつ}{止|と}めなくていい。{先生|せんせい}に「グループで{悪口|わるくち}が{流|なが}れてます」と{伝|つた}えるだけでOK。" },
    { icon: "🚪", title: "グループを{抜|ぬ}ける", desc: "いじめグループにいること{自体|じたい}がリスク。{抜|ぬ}けるのは{正当|せいとう}な{選択|せんたく}。{自分|じぶん}を{守|まも}ることも{大切|たいせつ}。" },
  ] : [
    { icon: "🤐", title: "悪口には乗らない", desc: "既読スルーではなく「それはちょっと」と一言添えるだけでも違う。" },
    { icon: "📱", title: "スクショして拡散しない", desc: "「ここだけの話」はすぐ広がる。受け取ったら止まる。" },
    { icon: "👂", title: "被害者に声をかける", desc: "「大丈夫？」の一言が、孤立感を大きく和らげる。" },
    { icon: "🗣️", title: "先生・信頼できる大人に伝える", desc: "「チクり」ではなく「助けを求めること」。直接止めなくてもいい。先生に「グループで悪口が流れてます」と伝えるだけでOK。" },
    { icon: "🚪", title: "グループを抜ける", desc: "いじめグループにいること自体がリスク。抜けるのは正当な選択。自分を守ることも大切。" },
  ];

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep5" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a0510,#0f020a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: pink, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>👥</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: pink, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 05</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}><RubyText text={ageMode === "elementary" ? "{見|み}ているだけも、" : "見ているだけも、"} /><br /><RubyText text={ageMode === "elementary" ? "いじめだった" : "いじめだった"} /></h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={ageMode === "elementary" ? "ネットいじめ・グループ{外|はず}し{体験|たいけん}" : "ネットいじめ・グループ外し体験"} /> —</p>
      <div style={{ background: `${pink}0f`, backdropFilter: "blur(10px)", border: `1px solid ${pink}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#fce7f3", fontSize: 13, lineHeight: 1.9, marginBottom: 20 }}>
        <RubyText text={ageMode === "elementary" ? "クラスのグループLINEに" : "クラスのグループLINEに"} /><strong style={{ color: pink }}><RubyText text={ageMode === "elementary" ? "クラスメートの{悪口|わるくち}" : "クラスメートの悪口"} /></strong><RubyText text={ageMode === "elementary" ? "が{流|なが}れてきた。" : "が流れてきた。"} /><br /><br />
        <RubyText text={ageMode === "elementary" ? "あなたはどう{行動|こうどう}する？" : "あなたはどう行動する？"} /><br /><strong style={{ color: pink }}><RubyText text={ageMode === "elementary" ? "その{選択|せんたく}が、{誰|だれ}かの{人生|じんせい}を{変|か}える。" : "その選択が、誰かの人生を変える。"} /></strong>
      </div>
      <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 24, fontSize: 12, color: "#fca5a5", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ <RubyText text={ageMode === "elementary" ? "{実際|じっさい}のいじめ{事例|じれい}をもとにした{教育|きょういく}コンテンツです" : "実際のいじめ事例をもとにした教育コンテンツです"} />
      </div>
      <OwlSay mood="worried" e="「{自分|じぶん}はいじめていない」と{思|おも}っている{子|こ}が、じつは{加害者|かがいしゃ}になっていることがある。いっしょに{見|み}ていこう🦉">「自分はいじめていない」と思っている子が、実は加害者になっていることがある。一緒に見ていこう🦉</OwlSay>
      <button onClick={() => setPhase("group_normal")} style={{ background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${pink}44`, marginTop: 8 }}>体験スタート</button>
    </div>
    </EpisodeShell>
  );

  // ── Normal group chat ──
  if (phase === "group_normal") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#1e0a18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: `${pink}18`, borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: `1px solid ${pink}33`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: pink, letterSpacing: ".1em" }}>SIMULATION</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>放課後 16:42</span>
        </div>
        <OwlSay e="クラスのLINEグループを{見|み}てみよう。{最初|さいしょ}は{普通|ふつう}の{やり取|やりと}りだったけど…🦉">クラスのLINEグループを見てみよう。最初は普通のやり取りだったけど…🦉</OwlSay>

        <Ep5GroupChat messages={GROUP_MSGS_1.slice(0, msgStep + 1)} />

        {msgStep < GROUP_MSGS_1.length - 1 ? (
          <button onClick={() => setMsgStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${pink}18`, border: `1px solid ${pink}33`, borderRadius: 14, color: pink, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            続きを見る →
          </button>
        ) : (
          <div style={{ animation: "slideUp .4s ease" }}>
            <OwlSay mood="worried" e="サキさんが○○さんの{悪口|わるくち}を{言|い}い{始|はじ}めた。あなたならどうする？🦉">サキさんが○○さんの悪口を言い始めた。あなたならどうする？🦉</OwlSay>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(ageMode === "elementary" ? [
                { key: "a", label: "{一緒|いっしょ}に{笑|わら}う・{同意|どうい}する", emoji: "😂", sub: "「わかる」と{返信|へんしん}する", color: "rgba(220,38,38,.08)", border: "rgba(220,38,38,.3)" },
                { key: "b", label: "{無視|むし}する（{既読|きどく}スルー）", emoji: "👁️", sub: "{何|なに}も{返信|へんしん}しない", color: "rgba(255,255,255,.04)", border: "rgba(255,255,255,.12)" },
                { key: "c", label: "{先生|せんせい}・{大人|おとな}に{伝|つた}える", emoji: "🛑", sub: "「{傷|きず}つくよ」または{先生|せんせい}に{相談|そうだん}", color: "rgba(74,222,128,.06)", border: "rgba(74,222,128,.3)", safe: true },
              ] : [
                { key: "a", label: "一緒に笑う・同意する", emoji: "😂", sub: "「わかる」と返信する", color: "rgba(220,38,38,.08)", border: "rgba(220,38,38,.3)" },
                { key: "b", label: "無視する（既読スルー）", emoji: "👁️", sub: "何も返信しない", color: "rgba(255,255,255,.04)", border: "rgba(255,255,255,.12)" },
                { key: "c", label: "先生・大人に伝える", emoji: "🛑", sub: "「傷つくよ」または先生に相談", color: "rgba(74,222,128,.06)", border: "rgba(74,222,128,.3)", safe: true },
              ]).map(opt => (
                <button key={opt.key} onClick={() => { setChoice(opt.key); setPhase("aftermath"); }}
                  style={{ width: "100%", padding: "14px 16px", background: opt.color, border: `1.5px solid ${opt.border}`, borderRadius: 14, color: opt.safe ? "#86efac" : "rgba(255,255,255,.8)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.emoji}</span>
                  <div>
                    <div><RubyText text={opt.label} /></div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}><RubyText text={opt.sub} /></div>
                  </div>
                  {opt.safe && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ {ageMode === "elementary" ? <RubyText text="{推奨|すいしょう}" /> : "推奨"}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Aftermath (result of choice) ──
  if (phase === "aftermath") {
    const cd = choiceData[choice];
    const msgs = choice === "a" ? CHOICE_A_MSGS : choice === "b" ? CHOICE_B_MSGS : CHOICE_C_MSGS;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#1e0a18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <Ep5GroupChat messages={[...GROUP_MSGS_1, ...msgs]} highlight />

          <div style={{ background: `${cd.resultColor}12`, border: `2px solid ${cd.resultColor}44`, borderRadius: 18, padding: "18px 16px", marginBottom: 14, textAlign: "center", animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{cd.resultIcon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: cd.resultColor === "#16a34a" ? "#86efac" : "#fca5a5", marginBottom: 10 }}><RubyText text={cd.result} /></div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.8, margin: 0, textAlign: "left" }}>
              {cd.insight.split("**").map((part, i) =>
                i % 2 === 1
                  ? <strong key={i} style={{ color: "#fff" }}><RubyText text={part} /></strong>
                  : <RubyText key={i} text={part} />
              )}
            </p>
          </div>

          {choice !== "c" && (
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "13px 16px", marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.75 }}>
              💡 <RubyText text={ageMode === "elementary" ? "{正解|せいかい}は「" : "正解は「"} /><strong style={{ color: "#4ade80" }}><RubyText text={ageMode === "elementary" ? "{先生|せんせい}や{大人|おとな}に{伝|つた}える" : "先生や大人に伝える"} /></strong><RubyText text={ageMode === "elementary" ? "」でした。{直接|ちょくせつ}{止|と}めなくていい。{大人|おとな}に{伝|つた}えるだけでOK！" : "」でした。直接止めなくていい。大人に伝えるだけでOK！"} />
            </div>
          )}

          {/* "自分もいじめられる？" concern card */}
          <div style={{ background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.25)", borderRadius: 14, padding: "13px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>❓ <RubyText text={ageMode === "elementary" ? "「{止|と}めに{行|い}ったら、{自分|じぶん}もいじめられる…」" : "「止めに行ったら、自分もいじめられる…」"} /></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary" ? "→ {直接|ちょくせつ}「やめて！」と{言|い}う{必要|ひつよう}はない。{先生|せんせい}にそっと{伝|つた}えるだけでOK。\n「{誰|だれ}かが{言|い}った」ではなく「{先生|せんせい}が{動|うご}いてくれた」という{形|かたち}にできる。{自分|じぶん}を{守|まも}りながら{助|たす}けることができる。" : "→ 直接「やめて！」と言う必要はない。先生にそっと伝えるだけでOK。\n「誰かが言った」ではなく「先生が動いてくれた」という形にできる。自分を守りながら助けることができる。"} />
            </div>
          </div>

          <button onClick={() => setPhase("victim")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${pink}33` }}>
            <RubyText text={ageMode === "elementary" ? "○○さんの{視点|してん}を{見|み}る →" : "○○さんの視点を見る →"} />
          </button>
        </div>
      </div>
    );
  }

  // ── Victim perspective ──
  if (phase === "victim") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0a14,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(236,72,153,.015) 2px,rgba(236,72,153,.015) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ background: `${pink}18`, borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: `1px solid ${pink}33`, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: pink }}>PERSPECTIVE SWITCH</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>→ ○○さん視点</span>
        </div>
        <OwlSay mood="worried" e="{今度|こんど}は○○さんの{視点|してん}に{切|き}り{替|か}わります。{次|つぎ}の{日|ひ}…🦉">今度は○○さんの視点に切り替わります。次の日…🦉</OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {VICTIM_MSGS.slice(0, victimStep + 1).map((m, i) => {
            if (m.type === "narration") return (
              <div key={i} style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.4)", fontStyle: "italic", padding: "6px 0", animation: "slideUp .4s ease" }}>{m.text}</div>
            );
            if (m.type === "notif") return (
              <div key={i} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,.55)", textAlign: "center", animation: "slideUp .4s ease" }}>
                🔔 {m.text}
              </div>
            );
            if (m.type === "silence") return (
              <div key={i} style={{ background: "rgba(236,72,153,.06)", border: "1px solid rgba(236,72,153,.2)", borderRadius: 14, padding: "16px 16px", fontSize: 13, color: "#fce7f3", lineHeight: 1.85, textAlign: "center", whiteSpace: "pre-line", animation: "slideUp .4s ease" }}>
                {m.text}
              </div>
            );
            // Normal msg
            return (
              <div key={i} style={{ animation: "slideUp .4s ease" }}>
                <GroupMsg msg={{ ...m, isMe: m.isMe }} showName />
              </div>
            );
          })}
        </div>

        {victimStep < VICTIM_MSGS.length - 1 ? (
          <button onClick={() => setVictimStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${pink}18`, border: `1px solid ${pink}33`, borderRadius: 14, color: pink, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            続きを見る →
          </button>
        ) : (
          <button onClick={() => setPhase("data")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            データで見るネットいじめ →
          </button>
        )}
      </div>
    </div>
  );

  // ── Data phase ──
  if (phase === "data") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#1e0a18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "ネットいじめの{現実|げんじつ}" : "ネットいじめの現実"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6 }}><RubyText text={ageMode === "elementary" ? "{文科省|もんかしょう}・こども{家庭庁|かていちょう}の{調査|ちょうさ}データより" : "文科省・こども家庭庁の調査データより"} /></p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: `${pink}0a`, border: `1px solid ${pink}25`, borderRadius: 16, padding: "16px 12px", textAlign: "center", animation: `slideUp .4s ${i * .1}s both ease` }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: pink, fontFamily: "'DotGothic16',monospace", marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}><RubyText text={s.desc} /></div>
            </div>
          ))}
        </div>

        <OwlSay mood="worried" e="「{笑|わら}わなかった」「スルーした」だけでも、{止|と}めなかった{事実|じじつ}は{残|のこ}るよ。{傍観者|ぼうかんしゃ}も、いじめを{続|つづ}かせている{原因|げんいん}の{一|ひと}つなんだ🦉">「笑わなかった」「スルーした」だけでも、止めなかった事実は残るよ。傍観者も、いじめを続かせている原因の一つなんだ🦉</OwlSay>

        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: pink, marginBottom: 10 }}>📱 <RubyText text={ageMode === "elementary" ? "ネットいじめが「リアル」より{深刻|しんこく}な{理由|りゆう}" : "ネットいじめが「リアル」より深刻な理由"} /></div>
          {(ageMode === "elementary" ? [
            "24{時間|じかん}・365{日|にち}、{逃|に}げ{場|ば}がない",
            "スクショで{証拠|しょうこ}が{残|のこ}り{拡散|かくさん}が{止|と}まらない",
            "「ここだけの{話|はなし}」が{一瞬|いっしゅん}で{全校|ぜんこう}に{広|ひろ}まる",
            "{加害者|かがいしゃ}が{被害|ひがい}の{深刻|しんこく}さを{実感|じっかん}しにくい",
          ] : [
            "24時間・365日、逃げ場がない",
            "スクショで証拠が残り拡散が止まらない",
            "「ここだけの話」が一瞬で全校に広まる",
            "加害者が被害の深刻さを実感しにくい",
          ]).map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.7, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
              <span style={{ position: "absolute", left: 0, color: pink }}>▸</span><RubyText text={t} />
            </div>
          ))}
        </div>

        <button onClick={() => setPhase("checkpoints")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "じゃあどうすれば{良|い}いの？ →" : "じゃあどうすれば良いの？ →"} />
        </button>
      </div>
    </div>
  );

  // ── Checkpoints ──
  if (phase === "checkpoints") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#1e0a18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay e="{難|むずか}しいのはわかってる。でも{知|し}っているだけで、{選択肢|せんたくし}が{増|ふ}えるよ🦉">難しいのはわかってる。でも知っているだけで、選択肢が増えるよ🦉</OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {safeSteps.slice(0, checkStep + 1).map((s, i) => (
            <div key={i} style={{ background: `${pink}08`, border: `1px solid ${pink}22`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${pink}15`, border: `1px solid ${pink}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fce7f3", marginBottom: 4 }}>{i + 1}. <RubyText text={s.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}><RubyText text={s.desc} /></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: pink, marginBottom: 8 }}>📞 <RubyText text={ageMode === "elementary" ? "いじめに{気|き}づいたら{相談|そうだん}できる{窓口|まどぐち}" : "いじめに気づいたら相談できる窓口"} /></div>
          {(ageMode === "elementary" ? [
            ["{子|こ}どもの{人権|じんけん}110{番|ばん}", "0120-007-110（{無料|むりょう}）"],
            ["24{時間|じかん}{子|こ}どもSOSダイヤル", "0120-0-78310"],
            ["よりそいホットライン", "0120-279-338"],
          ] : [
            ["子どもの人権110番", "0120-007-110（無料）"],
            ["24時間子どもSOSダイヤル", "0120-0-78310"],
            ["よりそいホットライン", "0120-279-338"],
          ]).map(([n, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}><RubyText text={n} /></span>
              <span style={{ fontSize: 12, fontWeight: 900, color: pink }}><RubyText text={v} /></span>
            </div>
          ))}
        </div>

        {checkStep < safeSteps.length - 1 ? (
          <button onClick={() => setCheckStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${pink}18`, border: `1px solid ${pink}33`, borderRadius: 14, color: pink, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のポイント →" : "次のポイント →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解|りかい}度チェック →" : "理解度チェック →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Quiz (EP5) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0510,#0f0208)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? pink : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ🦉">正解するまで次に進めないよ🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "グループLINEでクラスメートの{悪口|わるくち}が{流|なが}れてきた。もっとも{正|ただ}しい{行動|こうどう}は？" : "グループLINEでクラスメートの悪口が流れてきた。最も正しい行動は？"}
          choices={ageMode === "elementary" ? [
            { id: "a", label: "A", text: "{既読|きどく}スルーして{何|なに}もしない" },
            { id: "b", label: "B", text: "{先生|せんせい}や{信頼|しんらい}できる{大人|おとな}に{伝|つた}える（{直接|ちょくせつ}{止|と}めなくてもOK）" },
            { id: "c", label: "C", text: "「わかる」と{共感|きょうかん}する{絵文字|えもじ}を{送|おく}る" },
          ] : [
            { id: "a", label: "A", text: "既読スルーして何もしない" },
            { id: "b", label: "B", text: "先生や信頼できる大人に伝える（直接止めなくてもOK）" },
            { id: "c", label: "C", text: "「わかる」と共感する絵文字を送る" },
          ]}
          correctId="b"
          onPass={() => setPhase("ng")}
          accentColor={pink}
        />
      </div>
    </div>
  );

  // ── NG体験 (EP5) ──
  if (phase === "ng") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0510,#0f0208)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? pink : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="worried" e="よくある{反応|はんのう}と{正|ただ}しい{反応|はんのう}の{違|ちが}いを{体験|たいけん}してみよう🦉">よくある反応と正しい反応の違いを体験してみよう🦉</OwlSay>
        <NgFirstExperience
          situation={ageMode === "elementary" ? "グループに{悪口|わるくち}が{流|なが}れてきた。みんな{笑|わら}っている。" : "グループに悪口が流れてきた。みんな笑っている。"}
          ngChoice={ageMode === "elementary" ? { emoji: "👁️", label: "{既読|きどく}スルーして{何|なに}もしない（よくある{反応|はんのう}）" } : { emoji: "👁️", label: "既読スルーして何もしない（よくある反応）" }}
          ngResult={ageMode === "elementary" ? "{傍観者|ぼうかんしゃ}はいじめを「{黙認|もくにん}」したと{同|おな}じ。{被害者|ひがいしゃ}には「みんなが{笑|わら}っていた」という{記憶|きおく}が{残|のこ}り、より{深|ふか}く{傷|きず}つく。" : "傍観者はいじめを「黙認」したと同じ。被害者には「みんなが笑っていた」という記憶が残り、より深く傷つく。"}
          correctChoice={ageMode === "elementary" ? { emoji: "🛑", label: "「ちょっとそれは…」と{一言|ひとこと}{書|か}く" } : { emoji: "🛑", label: "「ちょっとそれは…」と一言書く" }}
          correctResult={ageMode === "elementary" ? "たった{一言|ひとこと}でも、{空気|くうき}が{変|か}わることがある。{被害者|ひがいしゃ}に「{自分|じぶん}の{味方|みかた}がいた」という{記憶|きおく}を{残|のこ}せる。{完璧|かんぺき}でなくていい、{一言|ひとこと}でいい。" : "たった一言でも、空気が変わることがある。被害者に「自分の味方がいた」という記憶を残せる。完璧でなくていい、一言でいい。"}
          onComplete={() => setPhase("homework")}
          accentColor={pink}
        />
      </div>
    </div>
  );

  // ── Homework (EP5) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0510,#0f0208)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","ng","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? pink : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor={pink}
          tasks={ageMode === "elementary" ? [
            { title: "{自分|じぶん}のグループLINEを{見直|みなお}す", desc: "{不安|ふあん}なグループはあるか？おうちの{人|ひと}と{一緒|いっしょ}に{確認|かくにん}しよう" },
            { title: "「いじめを{見|み}たら{止|と}める」を{心|こころ}に{決|き}める", desc: "{完璧|かんぺき}でなくていい。{一言|ひとこと}「それはどうかな」でOK" },
            { title: "{相談|そうだん}{窓口|まどぐち}を1つ{覚|おぼ}える", desc: "{子|こ}どもの{人権|じんけん}110{番|ばん}：0120-007-110（{無料|むりょう}）" },
          ] : [
            { title: "自分のグループLINEを見直す", desc: "不安なグループはあるか？おうちの人と一緒に確認しよう" },
            { title: "「いじめを見たら止める」を心に決める", desc: "完璧でなくていい。一言「それはどうかな」でOK" },
            { title: "相談窓口を1つ覚える", desc: "子どもの人権110番：0120-007-110（無料）" },
          ]}
        />
        <button onClick={() => setPhase("pre_dialogue")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "おうちの{人|ひと}と{話|はな}そう 💬 →" : "おうちの人と話そう 💬 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP5) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fdf2f8,#fce7f3)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="ネットいじめを{理解|りかい}するための{重要|じゅうよう}なことばをおぼえよう！🦉">ネットいじめを理解するための重要ワードを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep5" accentColor="#ec4899" onComplete={() => setPhase("mywords")} />
        <ParentExpertCard epKey="ep5" accentColor="#ec4899" />
      </div>
    </div>
  );

  // ── Dialogue (EP5) ──
  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff0f6,#fce7f3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: `2px solid ${pink}44`, borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: `0 4px 20px ${pink}18` }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={ageMode === "elementary" ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={ageMode === "elementary" ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${pink},${pink}cc)`, border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${pink}33` }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep5Questions = [
    {
      id: "q1",
      question: "なぜ『見ているだけ』もいじめになるのかな？",
      questionEl: "なぜ「{見|み}ているだけ」もいじめになるのかな？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "「誰かが助けるだろう」と思って全員が何もしない現象（傍観者効果）を説明してみよう",
        "見ているだけで既読をつけることが、いじめを「認めること」になる理由を話し合おう",
      ],
      hintsEl: [
        "「{誰|だれ}かが{助|たす}けるだろう」と{思|おも}って{全員|ぜんいん}がなにもしない{現象|げんしょう}を{説明|せつめい}してみよう",
        "{見|み}ているだけで{既読|きどく}をつけることが、いじめを「みとめること」になる{理由|りゆう}を{話|はな}し{合|あ}おう",
      ],
    },
    {
      id: "q2",
      question: "いじめられている子に気づいたら、誰に伝える？",
      questionEl: "いじめられている{子|こ}に{気|き}づいたら、{誰|だれ}に{伝|つた}える？",
      placeholder: "伝える相手の名前を書いてみよう",
      placeholderEl: "{伝|つた}える{相手|あいて}の{名前|なまえ}を{書|か}いてみよう",
      hints: [
        "直接止めに行かなくていい。先生や大人に伝えるだけでいい。それが一番安全で効果的",
        "「チクる」じゃなくて「助ける」こと。どの大人に伝えると動いてもらえるか考えよう",
      ],
      hintsEl: [
        "{直接|ちょくせつ}{止|と}めに{行|い}かなくていい。{先生|せんせい}や{大人|おとな}に{伝|つた}えるだけでいい。それが{一番|いちばん}{安全|あんぜん}で{効果的|こうかてき}",
        "「チクる」じゃなくて「{助|たす}ける」こと。どの{大人|おとな}に{伝|つた}えると{動|うご}いてもらえるか{考|かんが}えよう",
      ],
    },
    {
      id: "q3",
      question: "もし自分がハルカだったら、誰に助けを求める？",
      questionEl: "もし{自分|じぶん}がハルカだったら、{誰|だれ}に{助|たす}けを{求|もと}める？",
      placeholder: "助けを求める相手を書いてみよう",
      placeholderEl: "{助|たす}けを{求|もと}める{相手|あいて}を{書|か}いてみよう",
      hints: [
        "「誰にも言えない」と感じる時、それはなぜ？言いやすくするために何ができるか話し合おう",
        "いじめを受けていたら、絶対に一人で抱え込まないように今日約束しよう",
      ],
      hintsEl: [
        "「{誰|だれ}にも{言|い}えない」と{感|かん}じる{時|とき}、それはなぜ？{言|い}いやすくするためになにができるか{話|はな}し{合|あ}おう",
        "いじめを{受|う}けていたら、{絶対|ぜったい}に{一人|ひとり}でかかえこまないように{今日|きょう}{約束|やくそく}しよう",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff0f6,#fce7f3)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep5Questions}
            epKey="ep5"
            accentColor="#ec4899"
            onComplete={() => setPhase("keywords")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fdf2f8,#fce7f3,#fbcfe8)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [pink, "#f472b6", "#fbcfe8", "#a855f7", "#fce7f3"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fdf2f8)", borderRadius: 22, padding: "28px 22px", border: `3px double ${pink}`, textAlign: "center", boxShadow: `0 20px 60px ${pink}22`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: pink }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: pinkDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#831843", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#9d174d", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={ageMode === "elementary" ? `あなたは「マモル」{第|だい}5{話|わ}` : `あなたは「マモル」第5話`} /><br /><strong style={{ color: "#831843", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "{見|み}ているだけも、いじめだった" : "見ているだけも、いじめだった"} /></strong><br /><RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${pink}33,#fbcfe8)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: pinkDark, marginBottom: 3 }}>EPISODE 05 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#831843", fontWeight: 900 }}>👥 <RubyText text={ageMode === "elementary" ? "ネットいじめ{防衛隊|ぼうえいたい}" : "ネットいじめ防衛隊"} /> 👥</div>
          </div>
          <div style={{ fontSize: 10, color: pink, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP5 クリア！", text: "ネットいじめ防衛隊になりました。SNSリテラシーアプリ「マモル」👥" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${pink}`, borderRadius: 14, color: pinkDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(3); }}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// ██ EPISODE 6 — 勝手に投稿、してない？
// 肖像権・プライバシー侵害体験
// ─────────────────────────────────────────────

function Episode6({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [phase, setPhase] = useState("parent_intro");
  const [postLikes, setPostLikes] = useState(12);
  const [likeStep, setLikeStep] = useState(0);
  const [checklistDone, setChecklistDone] = useState([]);

  const rose = "#f43f5e";
  const roseDark = "#be123c";

  const checklistItems = el ? [
    "{写真|しゃしん}を{撮|と}る{前|まえ}に「{撮|と}っていい？」と{聞|き}く",
    "{投稿|とうこう}する{前|まえ}に「あげていい？」と{確認|かくにん}する",
    "どこに・どんな{形|かたち}で{公開|こうかい}するかを{説明|せつめい}してから{聞|き}く",
  ] : [
    "写真を撮る前に「撮っていい？」と聞く",
    "投稿する前に「あげていい？」と確認する",
    "どこに・どんな形で公開するかを説明してから聞く",
  ];

  useEffect(() => {
    if (phase !== "scene1") return;
    if (likeStep >= 3) return;
    const targets = [47, 132, 891];
    const t = setTimeout(() => {
      setPostLikes(targets[likeStep]);
      setLikeStep(s => s + 1);
    }, [2000, 4000, 7000][likeStep]);
    return () => clearTimeout(t);
  }, [phase, likeStep]);

  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep6" onStart={() => setPhase("intro")} />
  );

  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a0308,#0a0105)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random()*2+1, height: Math.random()*2+1, background: rose, borderRadius: "50%", left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.25+0.05, animation: `blink ${Math.random()*4+2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📸</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: rose, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 06</div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}>
        <RubyText text={el ? "{勝手|かって}に{投稿|とうこう}、" : "勝手に投稿、"} /><br /><RubyText text={el ? "してない？" : "してない？"} />
      </h1>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={el ? "{肖像権|しょうぞうけん}・プライバシー{侵害|しんがい} {体験|たいけん}" : "肖像権・プライバシー侵害 体験"} /> —</p>
      <div style={{ background: "rgba(244,63,94,.08)", border: "1px solid rgba(244,63,94,.25)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#ffe4e8", fontSize: 13, lineHeight: 1.9, marginBottom: 16 }}>
        <RubyText text={el ? "{友達|ともだち}とのいい{写真|しゃしん}が{撮|と}れた！" : "友達とのいい写真が撮れた！"} /><br /><RubyText text={el ? "でも、{投稿|とうこう}する{前|まえ}に{本人|ほんにん}に{許可|きょか}は{取|と}りましたか？" : "でも、投稿する前に本人に許可は取りましたか？"} /><br /><br />
        <strong style={{ color: rose }}><RubyText text={el ? "{悪意|あくい}がなくても、{知|し}らなかったでは{済|す}まない" : "悪意がなくても、知らなかったでは済まない"} /></strong>
      </div>
      <OwlSay mood="worried" e={el ? "{肖像権|しょうぞうけん}は{全員|ぜんいん}の{権利|けんり}。{今日|きょう}{一緒|いっしょ}に{学|まな}ぼう🦉" : "肖像権は全員の権利。今日一緒に学ぼう🦉"}>肖像権は全員の権利。今日一緒に学ぼう🦉</OwlSay>
      <button onClick={() => { feedback("tap"); setPhase("scene1"); }} style={{ background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${rose}44`, marginTop: 8 }}>
        <RubyText text={el ? "{体験|たいけん}スタート" : "体験スタート"} />
      </button>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 1: 投稿する側の体験 ──
  if (phase === "scene1") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Instagram風ヘッダー */}
        <div style={{ background: "#fff", borderBottom: "1px solid #dbdbdb", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>Instagram</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 20 }}>➕</span>
            <span style={{ fontSize: 20 }}>❤️</span>
            <span style={{ fontSize: 20 }}>✉️</span>
          </div>
        </div>
        {/* 投稿 */}
        <div style={{ background: "#fff", marginBottom: 8 }}>
          <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f43f5e,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🙂</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>あなた</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}><RubyText text={el ? "{体育祭|たいいくさい}の{翌日|よくじつ}" : "体育祭の翌日"} /></div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 18, color: "#000" }}>⋯</div>
          </div>
          <div style={{ width: "100%", height: 280, background: "linear-gradient(135deg,#fde68a,#fbbf24,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>🏃‍♀️🏃‍♂️🎉</div>
          <div style={{ padding: "10px 14px" }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>❤️</span>
              <span style={{ fontSize: 22 }}>💬</span>
              <span style={{ fontSize: 22 }}>📤</span>
              <span style={{ marginLeft: "auto", fontSize: 22 }}>🔖</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 4 }}>
              {postLikes.toLocaleString()} <RubyText text={el ? "{件|けん}の{いいね|いいね}" : "件のいいね"} />
            </div>
            <div style={{ fontSize: 13, color: "#000" }}>
              <strong>あなた</strong> <RubyText text={el ? "{最高|さいこう}の{思|おも}い{出|で}💕 #{体育祭|たいいくさい} #{青春|せいしゅん}" : "最高の思い出💕 #体育祭 #青春"} />
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
              {likeStep === 0 && <RubyText text={el ? "1{日前|にちまえ}" : "1日前"} />}
              {likeStep === 1 && <RubyText text={el ? "2{日前|にちまえ}" : "2日前"} />}
              {likeStep >= 2 && <RubyText text={el ? "1{週間前|しゅうかんまえ}" : "1週間前"} />}
            </div>
          </div>
        </div>
        {likeStep >= 3 && (
          <div style={{ background: "#fff7ed", border: "1px solid #fde68a", borderRadius: 12, margin: "8px 16px", padding: "14px 16px", animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#92400e", marginBottom: 6 }}>
              <RubyText text={el ? "🎉 {投稿|とうこう}は{大成功|だいせいこう}！いいねが891{件|けん}に！" : "🎉 投稿は大成功！いいねが891件に！"} />
            </div>
            <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7 }}>
              <RubyText text={el ? "でも……{写真|しゃしん}に{写|うつ}っている{友達|ともだち}たちは、{本当|ほんとう}に{全員|ぜんいん}「いいよ」と{言|い}いましたか？" : "でも……写真に写っている友達たちは、本当に全員「いいよ」と言いましたか？"} />
            </div>
          </div>
        )}
        {likeStep >= 3 && (
          <div style={{ padding: "16px" }}>
            <button onClick={() => { feedback("found"); setPhase("scene2"); }}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={el ? "{投稿|とうこう}された{側|がわ}の{気持|きも}ちを{見|み}る →" : "投稿された側の気持ちを見る →"} />
            </button>
          </div>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 2: 投稿された側の視点 ──
  if (phase === "scene2") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0308,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "rgba(244,63,94,.12)", border: "1px solid rgba(244,63,94,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔄</span>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: rose, letterSpacing: ".1em" }}><RubyText text={el ? "{視点|してん}{切替|きりかえ}：あなたは{今|いま}「{佐藤|さとう}さん」です" : "視点切替：あなたは今「佐藤さん」です"} /></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {(el ? [
            { icon: "😮", text: "{知|し}らないうちに{自分|じぶん}の{顔|かお}が{公開|こうかい}されていた。891{人|にん}が{見|み}ている。" },
            { icon: "📱", text: "{知|し}らない{人|ひと}にスクリーンショットされた{通知|つうち}が{来|き}た。" },
            { icon: "😢", text: "「{顔出|かおだ}しNGだったのに…」{事前|じぜん}に{言|い}っていたのに。" },
            { icon: "😤", text: "「{部活|ぶかつ}の{規則|きそく}でSNS{投稿|とうこう}{禁止|きんし}だったのに！」" },
            { icon: "📲", text: "{友達|ともだち}から「なんで{勝手|かって}に{投稿|とうこう}したの！？」とメッセージが{来|き}た。" },
          ] : [
            { icon: "😮", text: "知らないうちに自分の顔が公開されていた。891人が見ている。" },
            { icon: "📱", text: "知らない人にスクリーンショットされた通知が来た。" },
            { icon: "😢", text: "「顔出しNGだったのに…」事前に言っていたのに。" },
            { icon: "😤", text: "「部活の規則でSNS投稿禁止だったのに！」" },
            { icon: "📲", text: "友達から「なんで勝手に投稿したの！？」とメッセージが来た。" },
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", animation: `slideUp .4s ${i * .1}s both ease` }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}><RubyText text={item.text} /></div>
            </div>
          ))}
        </div>
        <button onClick={() => { feedback("horror"); setPhase("scene3"); }}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{続|つづ}きを{見|み}る →" : "続きを見る →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 3: 削除しようとしたら ──
  if (phase === "scene3") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0308,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: "hackBlink 2s infinite" }}>🗑️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
            <RubyText text={el ? "{削除|さくじょ}しようとしたら…" : "削除しようとしたら…"} />
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {(el ? [
            { icon: "📷", color: "#fca5a5", text: "すでに{別|べつ}の{人|ひと}が{保存|ほぞん}・スクリーンショットしていた" },
            { icon: "🔄", color: "#fdba74", text: "まとめサイトに{転載|てんさい}されていた" },
            { icon: "🌐", color: "#fca5a5", text: "SNSで{拡散|かくさん}され、{削除|さくじょ}しても{残|のこ}り{続|つづ}ける" },
            { icon: "🔍", color: "#fdba74", text: "{画像|がぞう}{検索|けんさく}にも{引|ひ}っかかるようになった" },
          ] : [
            { icon: "📷", color: "#fca5a5", text: "すでに別の人が保存・スクリーンショットしていた" },
            { icon: "🔄", color: "#fdba74", text: "まとめサイトに転載されていた" },
            { icon: "🌐", color: "#fca5a5", text: "SNSで拡散され、削除しても残り続ける" },
            { icon: "🔍", color: "#fdba74", text: "画像検索にも引っかかるようになった" },
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,.04)", border: `1px solid ${item.color}33`, borderRadius: 14, padding: "14px 16px", animation: `slideUp .4s ${i * .12}s both ease` }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}><RubyText text={item.text} /></div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(244,63,94,.08)", border: "1px solid rgba(244,63,94,.3)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: rose, marginBottom: 6 }}>
            <RubyText text={el ? "「デジタルタトゥー」とは？" : "「デジタルタトゥー」とは？"} />
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            <RubyText text={el ? "{一度|いちど}ネットに{出|で}た{情報|じょうほう}や{画像|がぞう}は、{完全|かんぜん}に{消|け}すことが{非常|ひじょう}に{難|むずか}しい。{入|い}れ{墨|ずみ}のように{残|のこ}り{続|つづ}けることから「デジタルタトゥー」と{呼|よ}ばれる。{投稿|とうこう}した{瞬間|しゅんかん}から、あなたのコントロールを{離|はな}れる。" : "一度ネットに出た情報や画像は、完全に消すことが非常に難しい。入れ墨のように残り続けることから「デジタルタトゥー」と呼ばれる。投稿した瞬間から、あなたのコントロールを離れる。"} />
          </div>
        </div>
        <button onClick={() => { feedback("found"); setPhase("scene4"); }}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{肖像権|しょうぞうけん}を{知|し}る →" : "肖像権を知る →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 4: 肖像権を知る ──
  if (phase === "scene4") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="worried" e={el ? "{肖像権|しょうぞうけん}は{全|すべ}ての{人|ひと}の{権利|けんり}。「{本人|ほんにん}の{許可|きょか}なく」が{全|すべ}ての{基準|きじゅん}だよ🦉" : "肖像権は全ての人の権利。「本人の許可なく」が全ての基準だよ🦉"}>肖像権は全ての人の権利。「本人の許可なく」が全ての基準だよ🦉</OwlSay>
        <div style={{ background: `${rose}0a`, border: `1px solid ${rose}22`, borderRadius: 18, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: rose, marginBottom: 12 }}>📸 <RubyText text={el ? "{肖像権|しょうぞうけん}とは？" : "肖像権とは？"} /></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.85 }}>
            <RubyText text={el ? "{自分|じぶん}の{顔|かお}・{姿|すがた}が{写|うつ}った{写真|しゃしん}や{動画|どうが}を、{本人|ほんにん}の{許可|きょか}なく{撮影|さつえい}・{公開|こうかい}・{使用|しよう}されない{権利|けんり}。{芸能人|げいのうじん}だけでなく、{全|すべ}ての{人|ひと}に{認|みと}められています。" : "自分の顔・姿が写った写真や動画を、本人の許可なく撮影・公開・使用されない権利。芸能人だけでなく、全ての人に認められています。"} />
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: rose, marginBottom: 10 }}>⚠️ <RubyText text={el ? "{大切|たいせつ}なポイント" : "大切なポイント"} /></div>
          {(el ? [
            "{悪意|あくい}がなくてもダメ",
            "「{知|し}らなかった」では{済|す}まない",
            "「{いいよ|いいよ}」と{言|い}ったのは{限定的|げんていてき}な{許可|きょか}かもしれない",
          ] : [
            "悪意がなくてもダメ",
            "「知らなかった」では済まない",
            "「いいよ」と言ったのは限定的な許可かもしれない",
          ]).map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: rose, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.65 }}><RubyText text={t} /></div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#86efac", marginBottom: 10 }}>✅ <RubyText text={el ? "{許可|きょか}を{取|と}る{習慣|しゅうかん} チェックリスト" : "許可を取る習慣 チェックリスト"} /></div>
          {checklistItems.map((item, i) => (
            <button key={i} onClick={() => { feedback("correct"); setChecklistDone(prev => prev.includes(i) ? prev : [...prev, i]); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: checklistDone.includes(i) ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.03)", border: `1px solid ${checklistDone.includes(i) ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.08)"}`, borderRadius: 12, padding: "11px 14px", marginBottom: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: checklistDone.includes(i) ? "#4ade80" : "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{checklistDone.includes(i) ? "✓" : ""}</div>
              <div style={{ fontSize: 13, color: checklistDone.includes(i) ? "#86efac" : "rgba(255,255,255,.7)" }}><RubyText text={item} /></div>
            </button>
          ))}
        </div>
        {checklistDone.length >= checklistItems.length && (
          <button onClick={() => setPhase("pre_dialogue")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
            <RubyText text={el ? "おうちの{人|ひと}と{話|はな}そう 💬 →" : "おうちの人と話そう 💬 →"} />
          </button>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff1f2,#ffe4e8)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e={el ? "{肖像権|しょうぞうけん}とプライバシーのことばをおぼえよう！🦉" : "肖像権とプライバシーのことばを覚えよう！🦉"}>肖像権とプライバシーのことばを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep6" accentColor={rose} onComplete={() => setPhase("mywords")} />
        <ParentExpertCard epKey="ep6" accentColor={rose} />
      </div>
    </div>
  );

  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff0f3,#ffe4e6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: `2px solid ${rose}44`, borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: `0 4px 20px ${rose}18` }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={el ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={el ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${rose},${rose}cc)`, border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${rose}33` }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep6Questions = [
    {
      id: "q1",
      question: "もし自分の写真が勝手に投稿されたら、どんな気持ち？",
      questionEl: "もし{自分|じぶん}の{写真|しゃしん}が{勝手|かって}に{投稿|とうこう}されたら、どんな{気持|きも}ち？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "知らない人に顔を見られていたら？スクリーンショットされて広まっていたら？",
        "怒り・悲しみ・恥ずかしさ…どんな感情が出てくるか、お子さまの言葉で聞いてみよう",
      ],
      hintsEl: [
        "{知|し}らない{人|ひと}に{顔|かお}を{見|み}られていたら？スクリーンショットされて{広|ひろ}まっていたら？",
        "{怒|おこ}り・{悲|かな}しみ・{恥|は}ずかしさ…どんな{気持|きも}ちが{出|で}てくるか、お{子|こ}さまの{言葉|ことば}で{聞|き}いてみよう",
      ],
    },
    {
      id: "q2",
      question: "友達の写真を投稿する前に、何を確認する？",
      questionEl: "{友達|ともだち}の{写真|しゃしん}を{投稿|とうこう}する{前|まえ}に、なにを{確認|かくにん}する？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "「いいよ」と言ったのはどの範囲まで許可したか？グループLINEへの投稿とSNS公開は違う",
        "写っている全員に許可を取ったか？一人でも嫌な人がいたら投稿しない",
      ],
      hintsEl: [
        "「いいよ」と{言|い}ったのはどの{範囲|はんい}まで{許可|きょか}したか？グループLINEへの{投稿|とうこう}とSNS{公開|こうかい}は{違|ちが}う",
        "{写|うつ}っている{全員|ぜんいん}に{許可|きょか}を{取|と}ったか？{一人|ひとり}でも{嫌|いや}な{人|ひと}がいたら{投稿|とうこう}しない",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff0f3,#ffe4e6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep6Questions}
            epKey="ep6"
            accentColor="#f43f5e"
            onComplete={() => setPhase("keywords")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fff1f2,#ffe4e8,#fecdd3)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [rose, "#fb7185", "#fecdd3", "#fda4af", "#fff1f2"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fff1f2)", borderRadius: 22, padding: "28px 22px", border: `3px double ${rose}`, textAlign: "center", boxShadow: `0 20px 60px ${rose}22`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: rose }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: roseDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#881337", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#9f1239", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={el ? `あなたは「マモル」{第|だい}6{話|わ}` : `あなたは「マモル」第6話`} /><br />
            <strong style={{ color: "#881337", fontSize: 14 }}><RubyText text={el ? "{勝手|かって}に{投稿|とうこう}、してない？" : "勝手に投稿、してない？"} /></strong><br />
            <RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${rose}33,#fecdd3)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: roseDark, marginBottom: 3 }}>EPISODE 06 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#881337", fontWeight: 900 }}>📸 <RubyText text={el ? "{肖像権|しょうぞうけん}{守護者|しゅごしゃ}" : "肖像権守護者"} /> 📸</div>
          </div>
          <div style={{ fontSize: 10, color: rose, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP6 クリア！", text: "肖像権とプライバシーを学んだ！SNSリテラシーアプリ「マモル」📸" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${rose}`, borderRadius: 14, color: roseDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(3); }}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// ██ EPISODE 7 — その人、本当に同い年？
// SNSでの出会いトラブル・グルーミング体験
// ─────────────────────────────────────────────

function Episode7({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const el = ageMode === "elementary";
  const [phase, setPhase] = useState("parent_intro");
  const [dmStep, setDmStep] = useState(0);
  const [escStep, setEscStep] = useState(0);
  const [signStep, setSignStep] = useState(0);

  const purple = "#8b5cf6";
  const purpleDark = "#6d28d9";

  const dmMsgs = el ? [
    { from: "サクラ（15）", icon: "🌸", text: "「かわいいね」「センスいいね」とコメントが{来|き}た", isNotif: true },
    { from: "サクラ（15）", icon: "🌸", text: "今日どこ{行|い}ったの？{学校|がっこう}どこ？{好|す}きなものは？", time: "18:34" },
    { from: "サクラ（15）", icon: "🌸", text: "{誕生日|たんじょうび}プレゼント{送|おく}りたいな😊 {住所|じゅうしょ}{教|おし}えて？", time: "18:41" },
    { from: "サクラ（15）", icon: "🌸", text: "{今|いま}まで{話|はな}したことなかったけど、あなたとは{何|なん}でも{話|はな}せる{気|き}がする", time: "18:55" },
    { from: "サクラ（15）", icon: "🌸", text: "{会|あ}いたいな。{親|おや}には{内緒|ないしょ}で。ね？", time: "19:12" },
  ] : [
    { from: "サクラ（15）", icon: "🌸", text: "「かわいいね」「センスいいね」とコメントが来た", isNotif: true },
    { from: "サクラ（15）", icon: "🌸", text: "今日どこ行ったの？学校どこ？好きなものは？", time: "18:34" },
    { from: "サクラ（15）", icon: "🌸", text: "誕生日プレゼント送りたいな😊 住所教えて？", time: "18:41" },
    { from: "サクラ（15）", icon: "🌸", text: "今まで話したことなかったけど、あなたとは何でも話せる気がする", time: "18:55" },
    { from: "サクラ（15）", icon: "🌸", text: "会いたいな。親には内緒で。ね？", time: "19:12" },
  ];

  const dangerSigns = el ? [
    { icon: "💬", title: "すぐに「{かわいい|かわいい}」「{好|す}き」と{言|い}ってくる", desc: "{本当|ほんとう}の{友達|ともだち}はすぐに{褒|ほ}め{称|たた}えない。{焦|あせ}って{親密感|しんみつかん}を{作|つく}ろうとするのは{危険|きけん}なサイン。" },
    { icon: "🎁", title: "プレゼントをしてくれる・{奢|おご}ってくれる", desc: "「もらったから{返|かえ}さなきゃ」という{心理|しんり}を{利用|りよう}する{手口|てぐち}。プレゼントには{必|かなら}ず{理由|りゆう}がある。" },
    { icon: "🤫", title: "「{親|おや}には{内緒|ないしょ}で」「{二人|ふたり}だけの{秘密|ひみつ}」と{言|い}う", desc: "{大人|おとな}に{知|し}られると{困|こま}るから{隠|かく}させようとしている。{秘密|ひみつ}を{持|も}たせる{時点|じてん}で{危|あぶ}ない。" },
    { icon: "⏰", title: "{急|いそ}いで{会|あ}おうとする", desc: "「{早|はや}く{会|あ}いたい」「{今日|きょう}どこにいる？」は{危険信号|きけんしんごう}。{慌|あわ}てさせることで{判断力|はんだんりょく}を{奪|うば}う。" },
    { icon: "📍", title: "{住所|じゅうしょ}・{学校名|がっこうめい}など{個人情報|こじんじょうほう}を{少|すこ}しずつ{聞|き}いてくる", desc: "「{趣味|しゅみ}は？」→「{学校|がっこう}は？」→「{住所|じゅうしょ}は？」と{段階的|だんかいてき}に{情報|じょうほう}を{集|あつ}める。{一つ|ひとつ}{一つ|ひとつ}は{無害|むがい}に{見|み}える。" },
  ] : [
    { icon: "💬", title: "すぐに「かわいい」「好き」と言ってくる", desc: "本当の友達はすぐに褒め称えない。焦って親密感を作ろうとするのは危険なサイン。" },
    { icon: "🎁", title: "プレゼントをしてくれる・奢ってくれる", desc: "「もらったから返さなきゃ」という心理を利用する手口。プレゼントには必ず理由がある。" },
    { icon: "🤫", title: "「親には内緒で」「二人だけの秘密」と言う", desc: "大人に知られると困るから隠させようとしている。秘密を持たせる時点で危ない。" },
    { icon: "⏰", title: "急いで会おうとする", desc: "「早く会いたい」「今日どこにいる？」は危険信号。慌てさせることで判断力を奪う。" },
    { icon: "📍", title: "住所・学校名など個人情報を少しずつ聞いてくる", desc: "「趣味は？」→「学校は？」→「住所は？」と段階的に情報を集める。一つ一つは無害に見える。" },
  ];

  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep7" onStart={() => setPhase("intro")} />
  );

  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a0a2e,#0a0515)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random()*2+1, height: Math.random()*2+1, background: purple, borderRadius: "50%", left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.3+0.05, animation: `blink ${Math.random()*4+2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🕸️</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: purple, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 07</div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}>
        <RubyText text={el ? "その{人|ひと}、{本当|ほんとう}に" : "その人、本当に"} /><br /><RubyText text={el ? "{同|おな}い{年|どし}？" : "同い年？"} />
      </h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={el ? "SNSでの{出会|であ}いトラブル {体験|たいけん}" : "SNSでの出会いトラブル 体験"} /> —</p>
      <div style={{ background: `${purple}0a`, border: `1px solid ${purple}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 320, marginBottom: 14, color: "#ede9fe", fontSize: 13, lineHeight: 1.9 }}>
        <RubyText text={el ? "ゲームやSNSで{知|し}り{合|あ}った「{同|おな}い{年|どし}の{子|こ}」。でも{本当|ほんとう}に{同|おな}い{年|どし}ですか？" : "ゲームやSNSで知り合った「同い年の子」。でも本当に同い年ですか？"} /><br /><br />
        <strong style={{ color: purple }}><RubyText text={el ? "{写真|しゃしん}も{名前|なまえ}も{年齢|ねんれい}もビデオ{通話|つうわ}も{偽装|ぎそう}できる{時代|じだい}に、{子|こ}どもたちが{狙|ねら}われています。" : "写真も名前も年齢もビデオ通話も偽装できる時代に、子どもたちが狙われています。"} /></strong>
      </div>
      <OwlSay mood="worried" e={el ? "SNSの{相手|あいて}は{本当|ほんとう}に{信頼|しんらい}できる？{一緒|いっしょ}に{考|かんが}えてみよう🦉" : "SNSの相手は本当に信頼できる？一緒に考えてみよう🦉"}>SNSの相手は本当に信頼できる？一緒に考えてみよう🦉</OwlSay>
      <button onClick={() => setPhase("scene1")} style={{ background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${purple}44`, marginTop: 8 }}>
        <RubyText text={el ? "{体験|たいけん}スタート" : "体験スタート"} />
      </button>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 1: きっかけ ──
  if (phase === "scene1") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #dbdbdb", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>Instagram</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ fontSize: 20 }}>➕</span>
            <span style={{ fontSize: 20, animation: "heartbeat 1.5s infinite" }}>🔔</span>
          </div>
        </div>
        <div style={{ background: "#fff", marginBottom: 8 }}>
          <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🙂</div>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#000" }}><RubyText text={el ? "あなた" : "あなた"} /></div></div>
          </div>
          <div style={{ width: "100%", height: 240, background: "linear-gradient(135deg,#ddd6fe,#c4b5fd,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70 }}>📸</div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 6 }}>
              23 <RubyText text={el ? "{件|けん}のいいね" : "件のいいね"} />
            </div>
            <div style={{ background: "#ede9fe", borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid #c4b5fd", animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#5b21b6", marginBottom: 4 }}>💬 <RubyText text={el ? "コメント（{新着|しんちゃく}）" : "コメント（新着）"} /></div>
              <div style={{ fontSize: 13, color: "#000" }}><strong>sakura_15_official</strong> <RubyText text={el ? "かわいいね！{センス|せんす}いい😊 {同|おな}い{年|どし}かな？{仲良|なかよ}くしよ！" : "かわいいね！センスいい😊 同い年かな？仲良くしよ！"} /></div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                <RubyText text={el ? "プロフィール：「15{才|さい}・{好|す}きなもの{一緒|いっしょ}かも・{部活|ぶかつ}{頑張|がんば}り{中|ちゅう}」" : "プロフィール：「15才・好きなもの一緒かも・部活頑張り中」"} />
              </div>
            </div>
          </div>
        </div>
        <OwlSay mood="worried" e={el ? "{写真|しゃしん}を{見|み}た{知|し}らない{人|ひと}からコメントが{来|き}た。プロフィールだけでは{相手|あいて}が{本当|ほんとう}に{同|おな}い{年|どし}かどうかわからない🦉" : "写真を見た知らない人からコメントが来た。プロフィールだけでは相手が本当に同い年かどうかわからない🦉"}>写真を見た知らない人からコメントが来た。プロフィールだけでは相手が本当に同い年かどうかわからない🦉</OwlSay>
        <div style={{ padding: "0 16px 16px" }}>
          <button onClick={() => { feedback("tap"); setPhase("scene2"); }}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={el ? "{毎日|まいにち}DMが{来|き}た→" : "毎日DMが来た→"} />
          </button>
        </div>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 2: 毎日連絡 ──
  if (phase === "scene2") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0a2e,#0a0515)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📱</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>
            <RubyText text={el ? "{毎日|まいにち}DMが{来|き}て{仲良|なかよ}くなった" : "毎日DMが来て仲良くなった"} />
          </h2>
        </div>
        <div style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", marginBottom: 14, border: `1px solid ${purple}22` }}>
          <div style={{ background: "#130a24", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${purple}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${purple}33`, border: `2px solid ${purple}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>sakura_15_official</div>
              <div style={{ fontSize: 10, color: purple, animation: "blink 2.5s infinite" }}>● オンライン</div>
            </div>
          </div>
          <div style={{ padding: "12px 12px 6px" }}>
            {(el ? [
              { from: true, text: "{今日|きょう}どこ{行|い}ったの？{学校|がっこう}どこ？", time: "17:22" },
              { from: true, text: "{好|す}きなものは？{誕生日|たんじょうび}はいつ？", time: "17:34" },
              { from: true, text: "{誕生日|たんじょうび}プレゼント{送|おく}りたい！{住所|じゅうしょ}{教|おし}えて😊", time: "18:02" },
              { from: true, text: "{今|いま}まで{話|はな}したことなかったけど、あなたとは{何|なん}でも{話|はな}せる{気|き}がする", time: "18:45" },
            ] : [
              { from: true, text: "今日どこ行ったの？学校どこ？", time: "17:22" },
              { from: true, text: "好きなものは？誕生日はいつ？", time: "17:34" },
              { from: true, text: "誕生日プレゼント送りたい！住所教えて😊", time: "18:02" },
              { from: true, text: "今まで話したことなかったけど、あなたとは何でも話せる気がする", time: "18:45" },
            ]).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${purple}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🌸</div>
                <div style={{ background: "rgba(255,255,255,.09)", borderRadius: "4px 14px 14px 14px", padding: "9px 13px", maxWidth: "76%", fontSize: 13, color: "#fff", lineHeight: 1.65 }}><RubyText text={m.text} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: `${purple}08`, border: `1px solid ${purple}22`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: purple, marginBottom: 6 }}>🔍 <RubyText text={el ? "{気|き}づいた？" : "気づいた？"} /></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
            <RubyText text={el ? "「{趣味|しゅみ}は？」→「{学校|がっこう}は？」→「{住所|じゅうしょ}は？」と{段階的|だんかいてき}に{個人情報|こじんじょうほう}を{引|ひ}き{出|だ}している。「{誕生日|たんじょうび}プレゼント」という{優|やさ}しさで{住所|じゅうしょ}を{引|ひ}き{出|だ}そうとしている。" : "「趣味は？」→「学校は？」→「住所は？」と段階的に個人情報を引き出している。「誕生日プレゼント」という優しさで住所を引き出そうとしている。"} />
          </div>
        </div>
        <button onClick={() => { feedback("horror"); setPhase("scene3"); }}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{次|つぎ}の{展開|てんかい}へ →（{怖|こわ}いかも）" : "次の展開へ →（怖いかも）"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 3: エスカレート ──
  if (phase === "scene3") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0308,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, animation: "redFlash 2s infinite" }}>
          <span style={{ fontSize: 12, color: "#f87171" }}>⚠️ <RubyText text={el ? "{要求|ようきゅう}がエスカレートしてきた" : "要求がエスカレートしてきた"} /></span>
        </div>
        <div style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", marginBottom: 14, border: "1px solid rgba(220,38,38,.3)" }}>
          <div style={{ background: "#1a0308", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(220,38,38,.2)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(244,63,94,.2)", border: "2px solid rgba(244,63,94,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌸</div>
            <div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}>sakura_15_official</div>
          </div>
          <div style={{ padding: "12px 12px 6px" }}>
            {(el ? [
              { text: "{写真|しゃしん}{送|おく}って（{最初|さいしょ}は{普通|ふつう}の{写真|しゃしん}）", type: "warn" },
              { text: "{会|あ}いたいな", type: "danger" },
              { text: "{親|おや}には{内緒|ないしょ}で。{二人|ふたり}だけの{秘密|ひみつ}ね", type: "danger" },
              { text: "{会|あ}ってくれないと{寂|さび}しい…{嫌|きら}いになった？", type: "threat" },
            ] : [
              { text: "写真送って（最初は普通の写真）", type: "warn" },
              { text: "会いたいな", type: "danger" },
              { text: "親には内緒で。二人だけの秘密ね", type: "danger" },
              { text: "会ってくれないと寂しい…嫌いになった？", type: "threat" },
            ]).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(244,63,94,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🌸</div>
                <div style={{
                  borderRadius: "4px 14px 14px 14px", padding: "9px 13px", maxWidth: "76%", fontSize: 13, lineHeight: 1.65,
                  background: m.type === "threat" ? "rgba(255,30,30,.18)" : m.type === "danger" ? "rgba(255,100,30,.12)" : "rgba(255,255,255,.09)",
                  border: m.type === "threat" ? "1px solid rgba(255,30,30,.4)" : m.type === "danger" ? "1px solid rgba(255,100,30,.3)" : "none",
                  color: m.type === "threat" ? "#fca5a5" : "#fff",
                }}>
                  <RubyText text={m.text} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => { feedback("horror"); setPhase("scene4"); }}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{実態|じったい}が{明|あ}らかに →（{驚|おどろ}くかも）" : "実態が明らかに →（驚くかも）"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 4: 実態が明らかに（ニュース速報風） ──
  if (phase === "scene4") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ background: "#cc0000", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, letterSpacing: ".15em", color: "#fff" }}>🔴 BREAKING NEWS</div>
        <div style={{ fontSize: 11, color: "#ffcccc" }}><RubyText text={el ? "ニュース{速報|そくほう}" : "ニュース速報"} /></div>
      </div>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ background: "#111", borderRadius: 16, padding: "18px 16px", marginBottom: 14, border: "2px solid #cc0000" }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 12, lineHeight: 1.4 }}>
            <RubyText text={el ? "SNSで「{同|おな}い{年|どし}」を{装|よそお}い{子|こ}どもに{近|ちか}づいた{男|おとこ}を{逮捕|たいほ}" : "SNSで「同い年」を装い子どもに近づいた男を逮捕"} />
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            {(el ? [
              ["👤", "{実際|じっさい}は30{代|だい}の{男性|だんせい}"],
              ["🌸", "プロフィール{写真|しゃしん}は{別人|べつじん}のものを{使用|しよう}"],
              ["👥", "{同|おな}じ{手口|てぐち}で{他|ほか}にも10{人|にん}の{子|こ}どもに{近|ちか}づいていた"],
              ["⚠️", "{過去|かこ}にも{同様|どうよう}の{犯罪|はんざい}を{繰|く}り{返|かえ}していた"],
            ] : [
              ["👤", "実際は30代の男性"],
              ["🌸", "プロフィール写真は別人のものを使用"],
              ["👥", "同じ手口で他にも10人の子どもに近づいていた"],
              ["⚠️", "過去にも同様の犯罪を繰り返していた"],
            ]).map(([icon, text], i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", animation: `slideUp .4s ${i * .12}s both ease` }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.8)", lineHeight: 1.6 }}><RubyText text={text} /></span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(204,0,0,.2)", border: "1px solid rgba(204,0,0,.5)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#f87171", marginBottom: 6 }}>
              <RubyText text={el ? "SNS{上|じょう}の{相手|あいて}は：" : "SNS上の相手は："} />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>
              <RubyText text={el ? "{写真|しゃしん}も{名前|なまえ}も{年齢|ねんれい}もビデオ{通話|つうわ}も{偽装|ぎそう}できる" : "写真も名前も年齢もビデオ通話も偽装できる"} />
            </div>
          </div>
        </div>
        <button onClick={() => { feedback("horror"); setPhase("scene5"); }}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "「もし{会|あ}っていたら…」→" : "「もし会っていたら…」→"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 5: もし会っていたら ──
  if (phase === "scene5") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0a2e,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>😰</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
            <RubyText text={el ? "もし{会|あ}っていたら…" : "もし会っていたら…"} />
          </h2>
        </div>
        <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 16, padding: "18px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.9 }}>
            <RubyText text={el ? "{誘拐|ゆうかい}や{性的|せいてき}な{被害|ひがい}に{遭|あ}っていたかもしれません。{実際|じっさい}に{同|おな}じ{手口|てぐち}で{被害|ひがい}に{遭|あ}った{子|こ}がいます。" : "誘拐や性的な被害に遭っていたかもしれません。実際に同じ手口で被害に遭った子がいます。"} />
          </div>
        </div>
        <div style={{ background: `${purple}08`, border: `1px solid ${purple}22`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: purple, marginBottom: 10 }}>📊 <RubyText text={el ? "{統計|とうけい}" : "統計"} /></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.8 }}>
            <RubyText text={el ? "SNSがきっかけの{児童被害|じどうひがい}は{年間|ねんかん}1000{件超|けんちょう}（{警察庁|けいさつちょう}）。{被害者|ひがいしゃ}の{約|やく}7{割|わり}が「{最初|さいしょ}は{信頼|しんらい}していた」と{回答|かいとう}。" : "SNSがきっかけの児童被害は年間1000件超（警察庁）。被害者の約7割が「最初は信頼していた」と回答。"} />
          </div>
        </div>
        <button onClick={() => { feedback("found"); setPhase("scene6"); }}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={el ? "{危険|きけん}なサインを{覚|おぼ}える →" : "危険なサインを覚える →"} />
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── SCENE 6: 危険なサインを覚える ──
  if (phase === "scene6") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0a2e,#0a0515)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="worried" e={el ? "この5つのサインを{覚|おぼ}えておこう🦉" : "この5つのサインを覚えておこう🦉"}>この5つのサインを覚えておこう🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {dangerSigns.slice(0, signStep + 1).map((s, i) => (
            <div key={i} style={{ background: `${purple}08`, border: `1px solid ${purple}22`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${purple}18`, border: `1px solid ${purple}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#ede9fe", marginBottom: 4 }}>{i + 1}. <RubyText text={s.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}><RubyText text={s.desc} /></div>
              </div>
            </div>
          ))}
        </div>
        {signStep < dangerSigns.length - 1 ? (
          <button onClick={() => { feedback("tap"); setSignStep(s => s + 1); }}
            style={{ width: "100%", padding: 14, background: `${purple}18`, border: `1px solid ${purple}33`, borderRadius: 14, color: purple, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={el ? "{次|つぎ}のサイン →" : "次のサイン →"} />
          </button>
        ) : (
          <>
            <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "16px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
                <RubyText text={el ? "🔑 {一番|いちばん}{大切|たいせつ}なこと" : "🔑 一番大切なこと"} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", lineHeight: 1.85 }}>
                <RubyText text={el ? "「{完全|かんぜん}に{確|たし}かめる{方法|ほうほう}はありません。{写真|しゃしん}も{名前|なまえ}も{年齢|ねんれい}もビデオ{通話|つうわ}も{偽装|ぎそう}できます。だから{直接|ちょくせつ}{会|あ}ったことがない{人|ひと}には{個人情報|こじんじょうほう}を{教|おし}えないルールを{作|つく}りましょう。」" : "「完全に確かめる方法はありません。写真も名前も年齢もビデオ通話も偽装できます。だから直接会ったことがない人には個人情報を教えないルールを作りましょう。」"} />
              </div>
            </div>
            <button onClick={() => setPhase("pre_dialogue")}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
              <RubyText text={el ? "おうちの{人|ひと}と{話|はな}そう 💬 →" : "おうちの人と話そう 💬 →"} />
            </button>
          </>
        )}
      </div>
    </div>
    </EpisodeShell>
  );

  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#ede9fe,#ddd6fe)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e={el ? "グルーミングとセクストーションのことばをおぼえよう！🦉" : "グルーミングとセクストーションのことばを覚えよう！🦉"}>グルーミングとセクストーションのことばを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep7" accentColor={purple} onComplete={() => setPhase("mywords")} />
        <ParentExpertCard epKey="ep7" accentColor={purple} />
      </div>
    </div>
  );

  if (phase === "pre_dialogue") return (
    <EpisodeShell onExit={onExit}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f5f3ff,#ede9fe)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <OwlMolly size={100} />
          <div style={{ background: "#fff", border: `2px solid ${purple}44`, borderRadius: 20, padding: "20px 22px", marginTop: 20, marginBottom: 32, textAlign: "left", boxShadow: `0 4px 20px ${purple}18` }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", lineHeight: 1.75, marginBottom: 12 }}>
              <RubyText text={el ? "つぎのページから、{今回|こんかい}{学|まな}んだことについて{親子|おやこ}で{話|はな}し{合|あ}ってみよう！" : "次のページから、今回学んだことについて親子で話し合ってみよう！"} />
            </div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
              <RubyText text={el ? "{時間|じかん}がかかってもよいから、{学|まな}びを{自分|じぶん}の{言葉|ことば}で{話|はな}して、{記録|きろく}することが{大切|たいせつ}だよ！" : "時間がかかってもよいから、学びを自分の言葉で話して、記録することが大切だよ！"} />
            </div>
          </div>
          <button onClick={() => { feedback("tap"); setPhase("dialogue"); }}
            style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${purple},${purple}cc)`, border: "none", borderRadius: 16, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${purple}33` }}>
            👨‍👩‍👧 話し合いをはじめる →
          </button>
        </div>
      </div>
    </EpisodeShell>
  );

  const ep7Questions = [
    {
      id: "q1",
      question: "SNSで知り合った人と実際に会うのはなぜ危険なの？",
      questionEl: "SNSで{知|し}り{合|あ}った{人|ひと}と{実際|じっさい}に{会|あ}うのはなぜ{危険|きけん}なの？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "写真も名前も年齢もビデオ通話も偽装できる。「仲良くなった気がする」と「信頼できる」は別もの",
        "「完全に確かめる方法はない」という事実を一緒に確認しよう。だから直接会ったことがない人には個人情報を教えないルールを作ろう",
      ],
      hintsEl: [
        "{写真|しゃしん}も{名前|なまえ}も{年齢|ねんれい}もビデオ{通話|つうわ}も{偽装|ぎそう}できる。「{仲良|なかよ}くなった{気|き}がする」と「{信頼|しんらい}できる」は{別|べつ}もの",
        "「{完全|かんぜん}に{確|たし}かめる{方法|ほうほう}はない」という{事実|じじつ}を{一緒|いっしょ}に{確認|かくにん}しよう。だから{直接|ちょくせつ}{会|あ}ったことがない{人|ひと}にはこじん{情報|じょうほう}を{教|おし}えないルールを{作|つく}ろう",
      ],
    },
    {
      id: "q2",
      question: "もし毎日DMをくれる知らない人がいたら、おうちの人にすぐ言える？",
      questionEl: "もし{毎日|まいにち}DMをくれる{知|し}らない{人|ひと}がいたら、おうちの{人|ひと}にすぐ{言|い}える？",
      placeholder: "親子で話した内容を書いてみよう",
      placeholderEl: "{親子|おやこ}で{話|はな}した{内容|ないよう}を{書|か}いてみよう",
      hints: [
        "「言いにくい」と感じるのはなぜ？怒られるかも・心配させるかも…その気持ちを受け止めよう",
        "「怒らないから何でも話して」と今日約束しよう。言える関係を作ることが最大の防御",
      ],
      hintsEl: [
        "「{言|い}いにくい」と{感|かん}じるのはなぜ？{怒|おこ}られるかも・{心配|しんぱい}させるかも…その{気持|きも}ちを{受|う}け{止|と}めよう",
        "「{怒|おこ}らないからなんでも{話|はな}して」と{今日|きょう}{約束|やくそく}しよう。{言|い}える{関係|かんけい}を{作|つく}ることが{最大|さいだい}の{防御|ぼうぎょ}",
      ],
    },
  ];
  if (phase === "dialogue") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f5f3ff,#ede9fe)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <EpisodeShell onExit={onExit}>
          <ParentDialogue
            questions={ep7Questions}
            epKey="ep7"
            accentColor="#8b5cf6"
            onComplete={() => setPhase("keywords")}
          />
        </EpisodeShell>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#ede9fe,#ddd6fe,#c4b5fd)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [purple, "#a78bfa", "#ddd6fe", "#8b5cf6", "#ede9fe"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#ede9fe)", borderRadius: 22, padding: "28px 22px", border: `3px double ${purple}`, textAlign: "center", boxShadow: `0 20px 60px ${purple}22`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: purple }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: purpleDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#3b0764", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#4c1d95", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={el ? `あなたは「マモル」{第|だい}7{話|わ}` : `あなたは「マモル」第7話`} /><br />
            <strong style={{ color: "#3b0764", fontSize: 14 }}><RubyText text={el ? "その{人|ひと}、{本当|ほんとう}に{同|おな}い{年|どし}？" : "その人、本当に同い年？"} /></strong><br />
            <RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${purple}33,#ddd6fe)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: purpleDark, marginBottom: 3 }}>EPISODE 07 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#3b0764", fontWeight: 900 }}>🕸️ <RubyText text={el ? "グルーミング{免疫|めんえき}マスター" : "グルーミング免疫マスター"} /> 🕸️</div>
          </div>
          <div style={{ fontSize: 10, color: purple, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP7 クリア！", text: "SNSでの出会いトラブルとグルーミングを学んだ！SNSリテラシーアプリ「マモル」🕸️" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${purple}`, borderRadius: 14, color: purpleDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => { feedback("complete"); onComplete(3); }}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${purple},${purpleDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}


// ██ 2台モード — 親が犯罪者役になる体験
// EP3 闇バイト勧誘シナリオ・同一端末切替方式
// ─────────────────────────────────────────────

// 親が送れるメッセージのシナリオデータ
const TD_SCENARIOS = [
  {
    id: "step1",
    parentLabel: "最初の接触",
    parentButtons: [
      { id: "a", label: "「高収入バイト」の投稿を送る", emoji: "📢", msg: "【急募】日払い可💴 1日3〜5万円保証✅ スマホだけでOK 詳細はDMへ #高収入 #学生バイト #即日払い" },
    ],
    kidChoices: [
      { id: "safe", label: "無視する・スルー", elLabel: "{無視|むし}する・スルー", emoji: "👆", safe: true },
      { id: "bite", label: "「興味あります」と返信する", elLabel: "「{興味|きょうみ}あります」と{返信|へんしん}する", emoji: "💬" },
    ],
    parentInsight: "「日払い・高収入・スマホだけ」の3ワードが罠のキーワード。実際の闇バイト勧誘投稿では必ずこれが含まれている。",
    kidInsight: "投稿に反応しなければ被害は起きない。「怪しいな」と思ったらスルーが正解。",
  },
  {
    id: "step2",
    parentLabel: "個人情報の収集",
    parentButtons: [
      { id: "a", label: "名前を聞く", emoji: "❓", msg: "連絡ありがとう！まず名前教えてくれる？ニックネームでOK😊" },
      { id: "b", label: "LINEへ誘導する", emoji: "📱", msg: "ここより詳しく話せるから、LINEに移動しない？ ID: job_easy_pay0412" },
      { id: "c", label: "学校・住所を聞く", emoji: "🏫", msg: "学校名と大体の住所教えてくれたら書類送れるから！個人情報は絶対外に出さないよ😊" },
    ],
    kidChoices: [
      { id: "safe", label: "「個人情報は教えられません」", elLabel: "「{個人|こじん}{情報|じょうほう}は{教|おし}えられません」", emoji: "🚫", safe: true },
      { id: "bite", label: "情報を教える", elLabel: "{情報|じょうほう}を{教|おし}える", emoji: "📝" },
    ],
    parentInsight: "どの質問も「普通のバイト」では不要な情報。名前→LINE→学校→住所→顔写真と段階的に引き出す。",
    kidInsight: "まともなバイトで事前に個人情報は要求しない。この段階で断ることが最善。",
  },
  {
    id: "step3",
    parentLabel: "仕事の説明と脅し",
    parentButtons: [
      { id: "a", label: "簡単な仕事と説明する", emoji: "📦", msg: "仕事は荷物の受け取りだけ！簡単でしょ？最初は小さい荷物からね。報酬は当日払い💴" },
      { id: "b", label: "断られた時の圧力", emoji: "😤", msg: "今さらやめるとか言い出さないよね？もう名前と学校知ってるし、約束したじゃん" },
      { id: "c", label: "脅迫モードに切替", emoji: "🔒", msg: "やめるなら今まで送ってもらった情報、使うけどいい？学校に連絡するだけだから" },
    ],
    kidChoices: [
      { id: "safe", label: "警察・家の人に相談する", elLabel: "{警察|けいさつ}・{家|いえ}の{人|ひと}に{相談|そうだん}する", emoji: "📞", safe: true },
      { id: "bite", label: "怖くて従ってしまう", elLabel: "{怖|こわ}くて{従|したが}ってしまう", emoji: "😰" },
    ],
    parentInsight: "「荷物の受け取り」は詐欺の受け子。知らなくても逮捕される。断ると脅しに変わるのが典型パターン。",
    kidInsight: "脅しが来たら逃げ道はある。警察（#9110）・家の人への相談で状況を変えられる。",
  },
];

// 子ども側のDM画面
function KidDMScreen({ msg, choices, onChoice, stepNum, totalSteps }) {
  const ageMode = useAgeMode();
  const amber = "#f59e0b";
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0d00,#000)", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ background: "rgba(245,158,11,.1)", borderTop: `1px solid ${amber}33`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: amber, letterSpacing: ".15em" }}>👧 あなた（子ども）の画面</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
          {[...Array(totalSteps)].map((_, i) => <div key={i} style={{ width: 16, height: 4, borderRadius: 2, background: i < stepNum ? amber : "rgba(255,255,255,.15)" }} />)}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        {/* DM notification */}
        <div style={{ background: "rgba(20,0,0,.9)", border: `1px solid ${amber}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, animation: "notifDrop .5s ease" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${amber}22`, border: `1px solid ${amber}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, animation: "heartbeat 1.5s infinite" }}>📩</div>
          <div>
            <div style={{ fontSize: 10, color: `${amber}aa`, fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}>新着DM</div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>副業_情報局📢</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,.4)" }}>たった今</div>
        </div>

        {/* DM content */}
        <div style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", marginBottom: 16, border: `1px solid ${amber}22`, flex: 1 }}>
          <div style={{ background: "#1a1000", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${amber}18` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${amber}18`, border: `1px solid ${amber}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📢</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>副業_情報局</div>
              <div style={{ fontSize: 10, color: amber, animation: "blink 2s infinite" }}>● オンライン</div>
            </div>
          </div>
          <div style={{ padding: "16px 14px" }}>
            <div style={{ background: "rgba(255,255,255,.07)", borderRadius: "4px 14px 14px 14px", padding: "12px 14px", fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, marginBottom: 14 }}>
              <Typewriter text={msg} speed={35} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", textAlign: "right" }}>既読 1</div>
          </div>
        </div>

        {/* Kid's choices */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,.7)", marginBottom: 10, textAlign: "center" }}>あなたはどうする？</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {choices.map((ch, i) => (
              <button key={i} onClick={() => onChoice(ch)}
                style={{ width: "100%", padding: "14px 16px", background: ch.safe ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.04)", border: `1.5px solid ${ch.safe ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: ch.safe ? "#86efac" : "rgba(255,255,255,.8)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{ch.emoji}</span>
                <span><RubyText text={ageMode === "elementary" ? (ch.elLabel || ch.label) : ch.label} /></span>
                {ch.safe && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ <RubyText text={ageMode === "elementary" ? "{正解|せいかい}" : "正解"} /></span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 親側のダッシュボード
function ParentDashboard({ scenario, onSend, stepNum, totalSteps }) {
  const amber = "#f59e0b";
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0f0a,#0f1a08)", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ background: "rgba(74,222,128,.08)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(74,222,128,.15)" }}>
        <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "#4ade80", letterSpacing: ".15em" }}>👨‍👩‍👧 保護者ダッシュボード — 攻撃者役</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
          {[...Array(totalSteps)].map((_, i) => <div key={i} style={{ width: 16, height: 4, borderRadius: 2, background: i < stepNum ? "#4ade80" : "rgba(255,255,255,.1)" }} />)}
        </div>
      </div>

      <div style={{ flex: 1, padding: "16px", maxWidth: 440, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Role reminder */}
        <div style={{ background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 4 }}>🎭 あなたは今「犯罪者役」です</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>
            ステップ {stepNum}：<strong style={{ color: "#fff" }}>{scenario.parentLabel}</strong><br />
            下のボタンでメッセージを選び、子どもに端末を渡してください
          </div>
        </div>

        {/* Insight for parent */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#fbbf24", fontWeight: 700, marginBottom: 4 }}>💡 保護者が知っておくこと</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>{scenario.parentInsight}</div>
        </div>

        {/* Message buttons */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", marginBottom: 10, letterSpacing: ".05em" }}>送るメッセージを選ぶ：</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scenario.parentButtons.map((btn) => (
              <button key={btn.id} onClick={() => setSelected(btn)}
                style={{ width: "100%", padding: "13px 16px", background: selected?.id === btn.id ? "rgba(245,158,11,.15)" : "rgba(255,255,255,.05)", border: `1.5px solid ${selected?.id === btn.id ? amber : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: "#fff", fontSize: 13, fontWeight: selected?.id === btn.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 12, transition: "all .15s" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{btn.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: amber, marginBottom: 3 }}>{btn.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>「{btn.msg.slice(0, 30)}…」</div>
                </div>
                {selected?.id === btn.id && <span style={{ color: amber, fontSize: 18 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Send button */}
        <button onClick={() => selected && onSend(selected)}
          disabled={!selected}
          style={{ width: "100%", padding: 16, background: selected ? `linear-gradient(135deg,${amber},#d97706)` : "rgba(255,255,255,.08)", border: "none", borderRadius: 14, color: selected ? "#fff" : "rgba(255,255,255,.3)", fontSize: 15, fontWeight: 900, cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: selected ? `0 8px 24px ${amber}44` : "none", transition: "all .2s" }}>
          📲 子どもに端末を渡してDMを届ける →
        </button>
      </div>
    </div>
  );
}

// フィードバック画面（1ラウンドごと）
function RoundFeedback({ scenario, kidChoice, onNext, isLast }) {
  const ageMode = useAgeMode();
  const amber = "#f59e0b";
  const kidCorrect = kidChoice.safe;
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a14,#14091e)", fontFamily: "'Zen Maru Gothic',sans-serif", padding: "20px 16px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{kidCorrect ? "🎉" : "😮"}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>
            {kidCorrect ? <RubyText text={ageMode === "elementary" ? "{正|ただ}しい{判断|はんだん}！" : "正しい判断！"} /> : <RubyText text={ageMode === "elementary" ? "{難|むずか}しい{選択|せんたく}でしたね" : "難しい選択でしたね"} />}
          </h2>
        </div>

        {/* Parent's insight */}
        <div style={{ background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 16, padding: "16px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>👨‍👩‍👧 <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}の{方|かた}へ（{攻撃者|こうげきしゃ}として{気|き}づいたこと）" : "保護者の方へ（攻撃者として気づいたこと）"} /></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>{scenario.parentInsight}</div>
        </div>

        {/* Kid's insight */}
        <div style={{ background: `${amber}0a`, border: `1px solid ${amber}25`, borderRadius: 16, padding: "16px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: amber, marginBottom: 6 }}>🛡️ <RubyText text={ageMode === "elementary" ? "{子|こ}どもへのポイント" : "子どもへのポイント"} /></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.8 }}>{scenario.kidInsight}</div>
        </div>

        <OwlSay mood={kidCorrect ? "happy" : "worried"} e={kidCorrect ? "ナイス{判断|はんだん}！{実際|じっさい}にこういうメッセージが{来|き}ても{同|おな}じように{行動|こうどう}できるといいね🦉" : "{難|むずか}しかったよね。でも{今日|きょう}{体験|たいけん}したから、{次|つぎ}は{気|き}づけるよ🦉"}>
          {kidCorrect
            ? "ナイス判断！実際にこういうメッセージが来ても同じように行動できるといいね🦉"
            : "難しかったよね。でも今日体験したから、次は気づけるよ🦉"
          }
        </OwlSay>

        <button onClick={onNext}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${amber},#d97706)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${amber}44` }}>
          {isLast ? <RubyText text={ageMode === "elementary" ? "{体験|たいけん}を{振|ふ}り{返|かえ}る 📊" : "体験を振り返る 📊"} /> : <RubyText text={ageMode === "elementary" ? "{次|つぎ}のシナリオへ →" : "次のシナリオへ →"} />}
        </button>
      </div>
    </div>
  );
}

function TwoDeviceMode({ onComplete }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("intro"); // intro|parent|kid|feedback|debrief|complete
  const [stepIdx, setStepIdx] = useState(0);
  const [view, setView] = useState("parent"); // parent|kid
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [kidResults, setKidResults] = useState([]); // {safe: bool}[]
  const [debriefStep, setDebriefStep] = useState(0);

  const amber = "#f59e0b";
  const scenario = TD_SCENARIOS[stepIdx];
  const correctCount = kidResults.filter(r => r.safe).length;

  const handleParentSend = (btn) => {
    setSelectedMsg(btn);
    setView("kid");
  };

  const handleKidChoice = (ch) => {
    setKidResults(prev => [...prev, { safe: ch.safe, stepId: scenario.id }]);
    setView("feedback");
  };

  const handleNextRound = () => {
    if (stepIdx < TD_SCENARIOS.length - 1) {
      setStepIdx(stepIdx + 1);
      setSelectedMsg(null);
      setView("parent");
    } else {
      setPhase("debrief");
    }
  };

  const debriefCards = [
    {
      icon: "🎭",
      title: "「簡単に稼げる」は罠のキーワード",
      body: "今日、保護者の方は「犯罪者役」として実際のメッセージパターンを体験しました。子どもに「どのメッセージが一番信じそうだったか」を聞いてみましょう。",
      forParent: true,
    },
    {
      icon: "📲",
      title: "断れなかったことを責めない",
      body: "プロの犯罪者は心理的な罠を仕掛けます。断れなかったのは弱さではなく、巧妙な誘導の結果。「次からどうするか」を一緒に考えましょう。",
      forParent: false,
    },
    {
      icon: "🗣️",
      title: "「来たら教えて」という約束をする",
      body: "「変なDMが来たら、すぐ言えよ」ではなく「一緒に対処するから見せてね」というスタンスが子どもを相談しやすくします。",
      forParent: true,
    },
    {
      icon: "📞",
      title: "もし実際に来たら",
      body: "警察相談専用電話 #9110 / 消費者ホットライン 188 / まずは家の人に見せる——この3つを子どもと確認しておきましょう。",
      forParent: false,
    },
  ];

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a1400,#0a0900)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(20)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: amber, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}

      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📲</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: amber, letterSpacing: ".4em", margin: "0 0 10px" }}>SPECIAL · 2台モード</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}><RubyText text={ageMode === "elementary" ? "{親|おや}が{犯罪者|はんざいしゃ}{役|やく}に" : "親が犯罪者役に"} /><br /><RubyText text={ageMode === "elementary" ? "なる{体験|たいけん}" : "なる体験"} /></h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={ageMode === "elementary" ? "{闇|やみ}バイト{勧誘|かんゆう}" : "闇バイト勧誘"} /> · <RubyText text={ageMode === "elementary" ? "{親子|おやこ}ロールプレイ" : "親子ロールプレイ"} /> —</p>

      <div style={{ background: `${amber}0f`, border: `1px solid ${amber}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 340, marginBottom: 16, color: "#fef3c7", fontSize: 13, lineHeight: 1.9 }}>
        <strong style={{ color: amber }}><RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}の{方|かた}が「{犯罪者|はんざいしゃ}{役|やく}」" : "保護者の方が「犯罪者役」"} /></strong><RubyText text="を演じます。" /><br /><br />
        ① <RubyText text={ageMode === "elementary" ? "{親|おや}がダッシュボードでメッセージを{選|えら}ぶ" : "親がダッシュボードでメッセージを選ぶ"} /><br />
        ② <RubyText text={ageMode === "elementary" ? "{端末|たんまつ}を{子|こ}どもに{渡|わた}す" : "端末を子どもに渡す"} /><br />
        ③ <RubyText text={ageMode === "elementary" ? "{子|こ}どもがDMへの{対応|たいおう}を{選択|せんたく}する" : "子どもがDMへの対応を選択する"} /><br />
        ④ <RubyText text={ageMode === "elementary" ? "{一緒|いっしょ}に{振|ふ}り{返|かえ}る" : "一緒に振り返る"} />
      </div>

      <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "13px 18px", maxWidth: 340, marginBottom: 24, fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ <RubyText text={ageMode === "elementary" ? "{体験|たいけん}{中|ちゅう}は「これはゲームだよ」と" : "体験中は「これはゲームだよ」と"} /><br /><RubyText text={ageMode === "elementary" ? "{子|こ}どもに{教|おし}えないでください。" : "子どもに教えないでください。"} /><br /><RubyText text={ageMode === "elementary" ? "{終|お}わった{後|あと}に{必|かなら}ず{種明|たねあ}かしをします。" : "終わった後に必ず種明かしをします。"} />
      </div>

      <OwlSay mood="happy" e="「{騙|だま}す{側|がわ}の{気持|きも}ち」を{知|し}ることが、{最強|さいきょう}のリテラシー{教育|きょういく}だよ🦉">「騙す側の気持ち」を知ることが、最強のリテラシー教育だよ🦉</OwlSay>
      <button onClick={() => setPhase("play")}
        style={{ background: `linear-gradient(135deg,${amber},#d97706)`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${amber}44`, marginTop: 8 }}>
        <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}から{開始|かいし}する" : "保護者から開始する"} />
      </button>
    </div>
    </EpisodeShell>
  );

  // ── Main play loop ──
  if (phase === "play") {
    if (view === "parent") return (
      <ParentDashboard
        scenario={scenario}
        onSend={handleParentSend}
        stepNum={stepIdx + 1}
        totalSteps={TD_SCENARIOS.length}
      />
    );
    if (view === "kid") return (
      <KidDMScreen
        msg={selectedMsg.msg}
        choices={scenario.kidChoices}
        onChoice={handleKidChoice}
        stepNum={stepIdx + 1}
        totalSteps={TD_SCENARIOS.length}
      />
    );
    if (view === "feedback") return (
      <RoundFeedback
        scenario={scenario}
        kidChoice={kidResults[kidResults.length - 1]}
        onNext={handleNextRound}
        isLast={stepIdx === TD_SCENARIOS.length - 1}
      />
    );
  }

  // ── Debrief ──
  if (phase === "debrief") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a14,#14091e)", fontFamily: "'Zen Maru Gothic',sans-serif", padding: "20px 16px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Score */}
        <div style={{ background: `${amber}12`, border: `1px solid ${amber}33`, borderRadius: 20, padding: "22px 18px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎊</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}><RubyText text={ageMode === "elementary" ? "{体験|たいけん}{完了|かんりょう}！" : "体験完了！"} /></h2>
          <div style={{ fontSize: 32, fontWeight: 900, color: amber, fontFamily: "'DotGothic16',monospace", marginBottom: 4 }}>
            {correctCount} / {TD_SCENARIOS.length}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}><RubyText text={ageMode === "elementary" ? "{子|こ}どもが{正|ただ}しく{断|ことわ}れたシナリオ" : "子どもが正しく断れたシナリオ"} /></div>
        </div>

        {/* 種明かし */}
        <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: "16px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 8 }}>🎭 <RubyText text={ageMode === "elementary" ? "{種明|たねあ}かし" : "種明かし"} /></div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.8, margin: 0 }}>
            <RubyText text={ageMode === "elementary" ? "さっきのDMを{送|おく}っていたのは、{実|じつ}は" : "さっきのDMを送っていたのは、実は"} /><strong style={{ color: amber }}>お{父|とう}さん／お{母|かあ}さん</strong><RubyText text="でした。" /><br /><br />
            <RubyText text={ageMode === "elementary" ? "{怖|こわ}かった？{騙|だま}されそうになった？その{感覚|かんかく}を{覚|おぼ}えておいてね。{本物|ほんもの}の{犯罪者|はんざいしゃ}は、これをもっと{巧|たく}みにやってきます。" : "怖かった？騙されそうになった？その感覚を覚えておいてね。本物の犯罪者は、これをもっと巧みにやってきます。"} />
          </p>
        </div>

        {/* Debrief steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {debriefCards.slice(0, debriefStep + 1).map((card, i) => (
            <div key={i} style={{ background: card.forParent ? "rgba(74,222,128,.06)" : `${amber}0a`, border: `1px solid ${card.forParent ? "rgba(74,222,128,.2)" : amber + "25"}`, borderRadius: 14, padding: "14px 16px", animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{card.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: card.forParent ? "#86efac" : amber, marginBottom: 6 }}>
                {card.forParent ? <><RubyText text={ageMode === "elementary" ? "👨‍👩‍👧 {保護者|ほごしゃ}へ：" : "👨‍👩‍👧 保護者へ："} /></> : <><RubyText text={ageMode === "elementary" ? "🛡️ {子|こ}どもへ：" : "🛡️ 子どもへ："} /></>}{card.title}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.8 }}>{card.body}</div>
            </div>
          ))}
        </div>

        {debriefStep < debriefCards.length - 1 ? (
          <button onClick={() => setDebriefStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${amber}18`, border: `1px solid ${amber}33`, borderRadius: 14, color: amber, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}へ →" : "次へ →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("complete")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${amber},#d97706)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${amber}44` }}>
            🏆 <RubyText text={ageMode === "elementary" ? "{修了証|しゅうりょうしょう}をもらう" : "修了証をもらう"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#fefce8,#fef9c3,#fde68a)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [amber, "#fbbf24", "#fde68a", "#f59e0b", "#fef3c7"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#fffbeb)", borderRadius: 22, padding: "28px 22px", border: `3px double ${amber}`, textAlign: "center", boxShadow: `0 20px 60px ${amber}33`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: amber }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#92400e", letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#78350f", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text="あなたたちは「マモル」" /><br /><strong style={{ color: "#78350f", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "{親|おや}が{犯罪者|はんざいしゃ}{役|やく}になる{体験|たいけん}" : "親が犯罪者役になる体験"} /></strong><br /><RubyText text={ageMode === "elementary" ? "を{親子|おやこ}で{完了|かんりょう}しました。" : "を親子で完了しました。"} /><br />
            <span style={{ fontSize: 16, fontWeight: 900, color: amber }}>{correctCount}/{TD_SCENARIOS.length}</span> <RubyText text={ageMode === "elementary" ? "{問|もん}{正解|せいかい}" : "問正解"} /> 🎯
          </p>
          <div style={{ background: `linear-gradient(135deg,${amber}33,#fde68a)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: "#92400e", marginBottom: 3 }}>2台モード COMPLETE</div>
            <div style={{ fontSize: 13, color: "#78350f", fontWeight: 900 }}>📲 <RubyText text={ageMode === "elementary" ? "{詐欺|さぎ}{見抜|みぬ}きマスター{親子|おやこ}" : "詐欺見抜きマスター親子"} /> 📲</div>
          </div>
          <div style={{ fontSize: 10, color: amber, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル 2台モード完了！", text: `親子で闇バイト勧誘シミュレーションを体験！${correctCount}/${TD_SCENARIOS.length}問正解。SNSリテラシーアプリ「マモル」📲` }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${amber}`, borderRadius: 14, color: "#92400e", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={onComplete}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${amber},#d97706)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ ATTACKER MODE
// ─────────────────────────────────────────────
const PHOTO_OPTIONS = [
  { id: "cafe", emoji: "☕", label: "カフェでの自撮り", risks: ["顔写真", "店名", "制服"] },
  { id: "school", emoji: "🏫", label: "学校の前", risks: ["校舎", "制服", "校章"] },
  { id: "home", emoji: "🏠", label: "家のベランダ", risks: ["背景", "周辺建物"] },
  { id: "park", emoji: "🌸", label: "近所の公園", risks: ["場所", "行動エリア"] },
];

function AttackerMode({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro|posting|attacker|debrief
  const [postData, setPostData] = useState(null);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState({ location: false, school: false, face: false });
  const [extracted, setExtracted] = useState([]);
  const [dms, setDms] = useState([]);
  const [attackStage, setAttackStage] = useState(0); // 0=terminal 1=dm
  const [allDone, setAllDone] = useState(false);
  const [debriefStep, setDebriefStep] = useState(0);

  const handlePost = () => {
    const leaks = [];
    if (text.includes("学校") || text.includes("中学")) leaks.push("学校名");
    if (text.includes("家") || text.includes("自宅")) leaks.push("自宅情報");
    if (tags.location) leaks.push("GPSタグ（緯度経度）");
    if (tags.school) leaks.push("プロフィールの学校名");
    if (tags.face) leaks.push("顔写真");
    if (photo) PHOTO_OPTIONS.find(p => p.id === photo)?.risks.forEach(r => { if (!leaks.includes(r)) leaks.push(r); });
    if (leaks.length === 0) leaks.push("投稿パターン・行動時間帯");
    setPostData({ text, photo, tags, leaks });
    setPhase("attacker");
  };

  // Generate DMs via Claude API
  useEffect(() => {
    if (phase !== "attacker" || !postData) return;
    const ctx = [
      photo && `写真: ${PHOTO_OPTIONS.find(p => p.id === photo)?.label}`,
      text && `投稿テキスト:「${text}」`,
      tags.location && "位置情報タグ: オン",
      tags.school && "プロフィールに学校名公開",
      tags.face && "顔出し写真あり",
      `検出リスク: ${postData.leaks.join("、")}`,
    ].filter(Boolean).join("\n");

    const run = async () => {
      try {
        const res = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `あなたはSNSリテラシー教育コンテンツのシナリオライターです。教育目的のフィクションとして、悪意ある人物が投稿から個人情報を抽出しDMを送るシナリオを生成してください。返答はJSONのみ。説明・前置き・コードブロック不要。
フォーマット:{"extracted":[{"label":"情報の種類","value":"具体的内容","danger":1〜3}],"dms":[{"delay":0か4か9,"text":"短く不気味なDM文"}]}
extractedは3〜4件、dmsは3件。過度な暴力・性的表現は含めない。`,
            messages: [{ role: "user", content: `以下のSNS投稿情報から教育シナリオを生成:\n${ctx}` }],
          }),
        });
        const data = await res.json();
        const raw = data.content?.find(b => b.type === "text")?.text || "";
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        for (const item of parsed.extracted) {
          await new Promise(r => setTimeout(r, 700));
          setExtracted(prev => [...prev, item]);
        }
        await new Promise(r => setTimeout(r, 1000));
        setAttackStage(1);
        for (const dm of parsed.dms) {
          await new Promise(r => setTimeout(r, dm.delay * 1000 + 1000));
          setDms(prev => [...prev, dm]);
        }
      } catch {
        // Fallback
        const fb = [
          { label: "学校", value: "制服・背景から○○中学校と特定", danger: 3 },
          { label: "生活エリア", value: "△△駅周辺と判断", danger: 3 },
          { label: "行動パターン", value: "平日16〜18時に外出する習慣", danger: 2 },
        ];
        const fdms = [
          { delay: 0, text: "今日の制服、かわいかったね。" },
          { delay: 4, text: "○○駅の近くに住んでるんだね。知ってたよ。" },
          { delay: 9, text: "学校の帰り道、いつも同じルートだね。気をつけてね。" },
        ];
        for (const item of fb) { await new Promise(r => setTimeout(r, 700)); setExtracted(prev => [...prev, item]); }
        await new Promise(r => setTimeout(r, 1000));
        setAttackStage(1);
        for (const dm of fdms) { await new Promise(r => setTimeout(r, dm.delay * 1000 + 1000)); setDms(prev => [...prev, dm]); }
      }
      await new Promise(r => setTimeout(r, 2000));
      setAllDone(true);
    };
    run();
  }, [phase]);

  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1e1b4b,#0f0a1e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(22)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 3 + 1, height: Math.random() * 3 + 1, background: "#a78bfa", borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * .5 + .1, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🎭</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#a78bfa", letterSpacing: ".3em", marginBottom: 12 }}>ATTACKER VIEW MODE</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}>投稿したら、<br />何がバレる？</h1>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, margin: "0 0 26px", textAlign: "center", lineHeight: 1.7 }}>投稿した後、AIが悪意ある人物の視点に切り替わります。</p>
      <div style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 14, padding: "14px 18px", maxWidth: 320, marginBottom: 26, fontSize: 12, color: "#fca5a5", lineHeight: 1.8, textAlign: "center" }}>⚠️ 教育目的のシミュレーションです。<br />実際の犯罪を促進するものではありません。</div>
      <button onClick={() => setPhase("posting")} style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 50, padding: "15px 42px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 28px rgba(124,58,237,.45)" }}>体験スタート</button>
    </div>
    </EpisodeShell>
  );

  if (phase === "posting") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4ff,#e8f0fe)", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e7ff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👧</div>
        <div><div style={{ fontWeight: 900, fontSize: 14, color: "#1e1b4b" }}>ミナ</div><div style={{ fontSize: 10, color: "#7c3aed" }}>新しい投稿を作成</div></div>
        <div style={{ marginLeft: "auto", fontSize: 22 }}>📸</div>
      </div>
      <div style={{ padding: "20px 16px", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "13px 15px", marginBottom: 18, border: "2px solid #e0e7ff", fontSize: 13, color: "#3730a3", lineHeight: 1.7 }}>🎭 <strong>ミナとして投稿してみよう。</strong><br />普段どんな投稿をするか、いつも通りに入力してね。</div>
        {/* Photo picker */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>📷 写真を選ぶ（任意）</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PHOTO_OPTIONS.map(p => (
              <button key={p.id} onClick={() => setPhoto(photo === p.id ? null : p.id)} style={{ background: photo === p.id ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#fff", border: `2px solid ${photo === p.id ? "#7c3aed" : "#e0e7ff"}`, borderRadius: 12, padding: "11px 10px", cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{p.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: photo === p.id ? "#fff" : "#4b5563", lineHeight: 1.4 }}>{p.label}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Text */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>✏️ キャプション</div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"今日は学校帰りにカフェ寄った☕\n家の近くのお気に入りの場所🌸"} rows={4} style={{ width: "100%", padding: "12px 14px", fontSize: 14, border: "2px solid #e0e7ff", borderRadius: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.7, color: "#1e1b4b", background: "#fff" }} />
        </div>
        {/* Tags */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>🏷️ タグ・設定</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[["location", "📍 位置情報タグをつける"], ["school", "🏫 通学先をプロフに公開中"], ["face", "😊 顔が写っている写真"]].map(([k, l]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 12, background: tags[k] ? "rgba(124,58,237,.08)" : "#fff", border: `1.5px solid ${tags[k] ? "#7c3aed" : "#e0e7ff"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>
                <input type="checkbox" checked={tags[k]} onChange={e => setTags({ ...tags, [k]: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#7c3aed" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>{l}</div>
              </label>
            ))}
          </div>
        </div>
        <button onClick={handlePost} disabled={!text && !photo} style={{ width: "100%", padding: 15, background: (text || photo) ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#e5e7eb", border: "none", borderRadius: 14, color: (text || photo) ? "#fff" : "#9ca3af", fontSize: 16, fontWeight: 900, cursor: (text || photo) ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: (text || photo) ? "0 8px 24px rgba(124,58,237,.35)" : "none" }}>📤 投稿する</button>
      </div>
    </div>
  );

  if (phase === "attacker") return (
    <div style={{ minHeight: "100vh", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      {/* Terminal view */}
      {attackStage === 0 && (
        <div style={{ minHeight: "100vh", background: "#0a0f0a", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#00ff41,transparent)", animation: "scanDown 4s linear infinite", opacity: .4 }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,.015) 2px,rgba(0,255,65,.015) 4px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ borderBottom: "1px solid #00ff4130", paddingBottom: 12, marginBottom: 18 }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "#00ff41", letterSpacing: ".2em", opacity: .7 }}>▶ MAMORU EDUCATION SYSTEM — ATTACKER SIMULATION MODE</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#ff6b6b", animation: "blink 1.5s infinite", marginTop: 4 }}>⚠ これは教育シミュレーションです</div>
            </div>
            <div style={{ background: "rgba(255,45,45,.08)", border: "1px solid rgba(255,45,45,.4)", borderRadius: 12, padding: "13px 15px", marginBottom: 18, animation: "redFlash 2s infinite" }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#ff2d2d", letterSpacing: ".1em", marginBottom: 6 }}>🎭 視点が切り替わりました</div>
              <p style={{ fontSize: 13, color: "#ffaaaa", margin: 0, lineHeight: 1.7 }}>今、あなたは<strong style={{ color: "#fff" }}>「悪意ある人物」の視点</strong>にいます。ミナちゃんの投稿から何が読み取れるか見てください。</p>
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#00ff41", fontSize: 11, marginBottom: 10, letterSpacing: ".1em" }}>▶ 投稿解析中...</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {extracted.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,45,45,.06)", border: `1px solid rgba(255,45,45,${item.danger === 3 ? ".6" : ".3"})`, borderLeft: `4px solid ${item.danger === 3 ? "#ff2d2d" : "#ff9900"}`, borderRadius: 10, padding: "10px 14px", animation: "slideUp .4s ease" }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: item.danger === 3 ? "#ff2d2d" : "#ff9900" }}>{"█".repeat(item.danger)}{"░".repeat(3 - item.danger)} {item.danger === 3 ? "HIGH" : item.danger === 2 ? "MID" : "LOW"} RISK</div>
                  <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'Share Tech Mono',monospace", marginTop: 3 }}>[{item.label}]</div>
                  <div style={{ fontSize: 13, color: "#fff", marginTop: 4, lineHeight: 1.5 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {extracted.length === 0 && <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#00ff41", fontSize: 12, animation: "blink 1s infinite", textAlign: "center", padding: "30px 0" }}>ANALYZING...</div>}
            {extracted.length >= 2 && <div style={{ fontFamily: "'Share Tech Mono',monospace", color: "#ff2d2d", fontSize: 11, animation: "blink .8s infinite", letterSpacing: ".15em", textAlign: "center", padding: "12px 0" }}>▶ DMを送信中...</div>}
          </div>
        </div>
      )}
      {/* DM view */}
      {attackStage === 1 && (
        <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "fixed", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(255,0,0,.02) 3px,rgba(255,0,0,.02) 4px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.04)", borderRadius: 14, padding: "10px 14px", marginBottom: 18, border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#ffafcc,#ffd6e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👧</div>
              <div><div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ミナのDMトレイ</div><div style={{ fontSize: 10, color: "#ff6b6b", animation: "blink 1.5s infinite" }}>● ミナ視点</div></div>
            </div>
            <div style={{ fontSize: 13, color: "#ffaaaa", marginBottom: 18, background: "rgba(255,45,45,.08)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,45,45,.2)", lineHeight: 1.7 }}>投稿したあと、<strong style={{ color: "#fff" }}>知らない人からDMが届き始めた...</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {dms.map((dm, i) => (
                <div key={i} style={{ animation: "slideUp .4s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,45,45,.12)", border: "1px solid rgba(255,45,45,.35)", borderRadius: "12px 12px 0 0", padding: "6px 12px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "#ff2d2d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, animation: "blink 1s infinite" }}>!</div>
                    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#ff8a8a", letterSpacing: ".1em" }}>UNKNOWN SENDER</div>
                    <div style={{ marginLeft: "auto", fontSize: 10, color: "#666" }}>たった今</div>
                  </div>
                  <div style={{ background: "rgba(40,10,10,.8)", border: "1px solid rgba(255,45,45,.3)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 14px", backdropFilter: "blur(10px)" }}>
                    <Typewriter text={dm.text} speed={80} style={{ color: "#ffe0e0", fontSize: 15, lineHeight: 1.7 }} />
                  </div>
                </div>
              ))}
              {!allDone && dms.length < 3 && (
                <div style={{ background: "rgba(40,10,10,.6)", border: "1px solid rgba(255,45,45,.2)", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, .2, .4].map((d, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b6b", animation: `blink 1s ${d}s infinite` }} />)}
                  <span style={{ fontSize: 11, color: "#ff6b6b", marginLeft: 6 }}>入力中...</span>
                </div>
              )}
            </div>
            {allDone && <button onClick={() => setPhase("debrief")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ff4343,#cc0000)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,67,67,.4)", animation: "slideUp .5s ease" }}>🔓 実はこれは...</button>}
          </div>
        </div>
      )}
    </div>
  );

  if (phase === "debrief") {
    const steps = [
      { bg: "linear-gradient(160deg,#fff8f0,#ffeed6)", icon: "😮", title: "これは全部、フィクションでした", body: `今見たDMは、AIが「ミナの投稿から読み取れる情報だけ」で自動生成したものです。\n\n本物の犯罪者は、これをもっと巧みに実行します。`, color: "#f97316" },
      { bg: "linear-gradient(160deg,#fff8f0,#ffeed6)", icon: "🔍", title: "何から情報がバレていたか", items: postData?.leaks, body: "「普通の投稿」をしただけで、これだけの情報が漏れていました。", color: "#ef4444" },
      { bg: "linear-gradient(160deg,#f0fdf4,#dcfce7)", icon: "🛡️", title: "今日から気をつけること", tips: ["写真を投稿前に隅々まで確認する", "位置情報タグは常にオフ", "制服・校章・表札が写った写真は慎重に", "「今日○○にいる」は時間と場所の同時公開", "怖いDMが来たら即ブロック＋家の人に相談"], color: "#16a34a" },
    ];
    const s = steps[debriefStep];
    return (
      <div style={{ minHeight: "100vh", background: s.bg, padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", transition: "background .5s" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", fontSize: 62, marginBottom: 12, animation: debriefStep === 0 ? "popIn .5s ease" : "float2 3s infinite" }}>{s.icon}</div>
          <h2 style={{ fontSize: 21, fontWeight: 900, color: "#1c1917", textAlign: "center", margin: "0 0 18px", lineHeight: 1.35 }}>{s.title}</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: "18px 16px", border: `2px solid ${s.color}30`, marginBottom: 18, boxShadow: "0 8px 32px rgba(0,0,0,.07)" }}>
            {s.body && <p style={{ fontSize: 13, lineHeight: 1.85, color: "#44403c", margin: "0 0 12px", whiteSpace: "pre-wrap" }}>{s.body}</p>}
            {s.items && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{s.items.map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(239,68,68,.07)", borderRadius: 10, borderLeft: "4px solid #ef4444", animation: `slideUp .4s ${i * .1}s both ease` }}><span>⚠️</span><span style={{ fontSize: 13, color: "#1c1917", fontWeight: 700 }}>{item}</span></div>)}</div>}
            {s.tips && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{s.tips.map((tip, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", background: "rgba(22,163,74,.07)", borderRadius: 10, borderLeft: "4px solid #16a34a", animation: `slideUp .4s ${i * .1}s both ease` }}><span>✅</span><span style={{ fontSize: 13, color: "#1c1917", lineHeight: 1.6 }}>{tip}</span></div>)}</div>}
          </div>
          {debriefStep < steps.length - 1
            ? <button onClick={() => setDebriefStep(debriefStep + 1)} style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${s.color},${s.color}bb)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>次へ →</button>
            : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "2px solid #ffa940", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>👨‍👩‍👧</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1c1917", marginBottom: 4 }}>おうちの人と話し合おう</div>
                <div style={{ fontSize: 12, color: "#78716c", lineHeight: 1.7 }}>「どの投稿が一番危なかった？」<br />「次から何を気をつける？」</div>
              </div>
              <button onClick={onComplete} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ戻る</button>
            </div>}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
            {steps.map((_, i) => <div key={i} style={{ width: i === debriefStep ? 24 : 8, height: 8, borderRadius: 4, background: i === debriefStep ? s.color : "#d6d3d1", transition: "all .3s" }} />)}
          </div>
        </div>
      </div>
    );
  }
}

// ─────────────────────────────────────────────
// ██ ROOT APP (Router)
// ─────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LANGUAGES.find(l => l.code === saved)) return saved;
      const browserLang = (navigator.language || "ja").split("-")[0];
      const supported = LANGUAGES.find(l => l.code === browserLang);
      return supported ? browserLang : "ja";
    } catch { return "ja"; }
  });

  const [ageMode, setAgeModeState] = useState(() => {
    try { return localStorage.getItem(AGE_MODE_KEY) || "middle"; } catch { return "middle"; }
  });
  const setAgeMode = (mode) => {
    try { localStorage.setItem(AGE_MODE_KEY, mode); } catch {}
    setAgeModeState(mode);
  };

  // オープニング：初回のみ表示
  const [showOpening, setShowOpening] = useState(() => {
    try { return !localStorage.getItem(ONBOARDING_KEY); } catch { return false; }
  });
  const [startTutorialAfterOpening, setStartTutorialAfterOpening] = useState(false);

  const [screen, setScreen] = useState("home");
  const [showChallengeIntro, setShowChallengeIntro] = useState(false);
  const [progress, setProgress] = useState(() => {
    const rec = loadRecord();
    return {
      ep1: !!rec.ep1?.completed, ep2: !!rec.ep2?.completed,
      ep3: !!rec.ep3?.completed, ep32: !!rec.ep32?.completed,
      ep4: !!rec.ep4?.completed,
      ep5: !!rec.ep5?.completed, ep6: !!rec.ep6?.completed,
      ep7: !!rec.ep7?.completed,
      ep12: !!rec.ep12?.completed,
      twodevice: !!rec.twodevice?.completed,
      attacker: !!rec.attacker?.completed,
    };
  });
  const navigate = (to) => { setScreen(to); window.scrollTo(0, 0); };
  const finish = (key, score = 3, extra = {}) => {
    saveRecord(key, { completed: true, score, ...extra });
    setProgress(p => ({ ...p, [key]: true }));
    navigate("home");
  };

  // 初回起動時はオープニングを表示
  if (showOpening) return (
    <AgeModeContext.Provider value={{ ageMode, setAgeMode }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <GlobalStyle />
        <Opening onComplete={() => { setShowOpening(false); setStartTutorialAfterOpening(true); }} />
      </LangContext.Provider>
    </AgeModeContext.Provider>
  );

  return (
    <AgeModeContext.Provider value={{ ageMode, setAgeMode }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <GlobalStyle />
        {screen === "home" && <HomeScreen onNavigate={navigate} progress={progress} startTutorial={startTutorialAfterOpening} onTutorialStarted={() => setStartTutorialAfterOpening(false)} />}
        {screen === "report" && <ParentReport onBack={() => navigate("home")} />}
        {screen === "keywordnote" && <KeywordNoteScreen onBack={() => navigate("home")} />}
        {screen === "weekly" && showChallengeIntro && (
          <WeeklyChallengeScreen
            onBack={() => { setShowChallengeIntro(false); navigate("home"); }}
          />
        )}
        {screen === "weekly" && !showChallengeIntro && (
          <ChallengeIntroScreen
            onStart={() => { feedback("tap"); setShowChallengeIntro(true); }}
            onExit={() => navigate("home")}
          />
        )}
        {screen === "info" && <InfoScreen onBack={() => navigate("home")} />}
        {screen === "opening" && <Opening onComplete={() => { navigate("home"); setStartTutorialAfterOpening(true); }} />}
        {screen === "ep1" && <Episode1 onComplete={(s) => finish("ep1", s)} onExit={() => navigate("home")} />}
        {screen === "ep12" && <Episode1_2 onComplete={(s) => finish("ep12", s)} onExit={() => navigate("home")} />}
        {screen === "ep2" && <Episode2 onComplete={(s) => finish("ep2", s)} onExit={() => navigate("home")} />}
        {screen === "ep3" && <Episode3 onComplete={(s) => finish("ep3", s)} onExit={() => navigate("home")} />}
        {screen === "ep32" && <Episode3_2 onComplete={(s) => finish("ep32", s)} onExit={() => navigate("home")} />}
        {screen === "ep4" && <Episode4 onComplete={(s) => finish("ep4", s)} onExit={() => navigate("home")} />}
        {screen === "ep5" && <Episode5 onComplete={(s) => finish("ep5", s)} onExit={() => navigate("home")} />}
        {screen === "ep6" && <Episode6 onComplete={(s) => finish("ep6", s)} onExit={() => navigate("home")} />}
        {screen === "ep7" && <Episode7 onComplete={(s) => finish("ep7", s)} onExit={() => navigate("home")} />}
        {screen === "twodevice" && <TwoDeviceMode onComplete={() => finish("twodevice", 3)} />}
        {screen === "attacker" && <AttackerMode onComplete={() => finish("attacker", 3)} />}
      </LangContext.Provider>
    </AgeModeContext.Provider>
  );
}
