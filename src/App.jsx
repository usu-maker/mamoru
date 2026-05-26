import { useState, useEffect, createContext, useContext } from "react";

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
    ep4: {
      tag: { ja: "EPISODE 04 · なりすまし体験", el: "EPISODE 04 · なりすまし{体験|たいけん}", en: "EPISODE 04 · Impersonation", ko: "EPISODE 04 · 사칭 체험", zh: "第04话 · 假冒身份" },
      title: { ja: "友達のふりをした罠", el: "{友達|ともだち}のふりをした{罠|わな}", en: "The Friend Who Wasn't", ko: "친구를 가장한 함정", zh: "假装是朋友的陷阱" },
      desc: {
        ja: "「友達から」のメッセージで認証コードを要求される。信じてしまうと…アカウントが乗っ取られる手口を体験。",
        el: "「{友達|ともだち}から」のメッセージで{認証|にんしょう}コードを{要求|ようきゅう}される。{信|しん}じてしまうと…アカウントが{乗|の}っ{取|と}られる{手口|てぐち}を{体験|たいけん}。",
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
      ja: "女子中学生がSNSに投稿した写真の**校章・背景・位置情報タグ**から、知らない男性が自宅を突き止め待ち伏せした事件が実際に報告されています。",
      el: "{女子中学生|じょしちゅうがくせい}がSNSに{投稿|とうこう}した{写真|しゃしん}の**{校章|こうしょう}・{背景|はいけい}・{位置情報|いちじょうほう}タグ**から、{知|し}らない{男性|だんせい}が{自宅|じたく}を{突|つ}き{止|と}め{待|ま}ち{伏|ふ}せした{事件|じけん}が{実際|じっさい}に{報告|ほうこく}されています。",
      en: "A real case: A middle school girl's photos with **school crest, background, and location tags** allowed a stranger to find her home and wait for her there.",
      ko: "여중생이 SNS에 올린 사진의 **교표·배경·위치 태그**로 모르는 남성이 집을 알아내 매복한 실제 사건이 보고됨.",
      zh: "实际报告:一名初中女生发的照片中**校徽·背景·位置标签**让陌生男性找到她家并蹲守。",
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
    tip2Title: {
      ja: "位置情報タグは常にオフ",
      el: "{位置情報|いちじょうほう}タグは{常|つね}にオフ",
      en: "Keep location tags always off",
      ko: "위치 태그는 항상 끄기",
      zh: "始终关闭位置标签",
    },
    tip2Desc: {
      ja: "スマホ設定→プライバシー→位置情報",
      el: "スマホ{設定|せってい}→プライバシー→{位置情報|いちじょうほう}",
      en: "Phone settings → Privacy → Location",
      ko: "스마트폰 설정 → 개인정보 → 위치",
      zh: "手机设置→隐私→位置",
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
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 10px" }}>{post.text}</p>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "rgba(255,255,255,.35)" }}>
          <span>❤️ {post.likes?.toLocaleString()}</span>
          <span>🔁 {post.rts?.toLocaleString()}</span>
        </div>
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, pointerEvents: "none",
        }}>
          <div style={{
            fontSize: 72, animation: "popIn .3s ease",
            filter: `drop-shadow(0 0 20px ${lastChoice?.correct ? "#22c55e" : "#ef4444"})`,
          }}>
            {lastChoice?.correct ? "✅" : "❌"}
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
  { id: "ep7_master",   icon: "🎣", label: "フィッシング免疫",   elLabel: "フィッシング{免疫|めんえき}",          desc: "EP7をクリア",                elDesc: "EP7をクリア",                                     color: "#06b6d4", cond: (r) => r.ep7?.completed },
  { id: "two_device",   icon: "📲", label: "親子コラボ達成",     elLabel: "{親子|おやこ}コラボ{達成|たっせい}",   desc: "2台モードをクリア",           elDesc: "2{台|だい}モードをクリア",                         color: "#f59e0b", cond: (r) => r.twodevice?.completed },
  { id: "triple",       icon: "⭐", label: "3冠達成",           elLabel: "3{冠|かん}{達成|たっせい}",            desc: "任意3EPをクリア",             elDesc: "{任意|にんい}3EPをクリア",                         color: "#a78bfa", cond: (r) => Object.values(r).filter(v => v?.completed).length >= 3 },
  { id: "five_star",    icon: "🌟", label: "5冠達成",           elLabel: "5{冠|かん}{達成|たっせい}",            desc: "任意5EPをクリア",             elDesc: "{任意|にんい}5EPをクリア",                         color: "#fbbf24", cond: (r) => Object.values(r).filter(v => v?.completed).length >= 5 },
  { id: "all_clear",    icon: "🏆", label: "全EP制覇",          elLabel: "{全|ぜん}EP{制覇|せいは}",             desc: "全7EPをクリア",               elDesc: "{全|ぜん}7EPをクリア",                             color: "#ff6b6b", cond: (r) => ["ep1","ep2","ep3","ep4","ep5","ep6","ep7"].every(k => r[k]?.completed) },
  { id: "speed_demon",  icon: "⚡", label: "スピードマスター",   elLabel: "スピードマスター",                     desc: "EP1タイムアタック全発見",      elDesc: "EP1タイムアタック{全|ぜん}{発見|はっけん}",         color: "#f97316", cond: (r) => r.ep1?.speedBonus },
  { id: "fact_checker", icon: "✅", label: "完璧な鑑定士",       elLabel: "{完璧|かんぺき}な{鑑定|かんてい}{士|し}", desc: "EP2全問正解（4問）",       elDesc: "EP2{全|ぜん}{問|もん}{正解|せいかい}（4{問|もん}）", color: "#7c3aed", cond: (r) => r.ep2?.score >= 4 },
  { id: "no_miss",      icon: "💎", label: "ノーミスクリア",     elLabel: "ノーミスクリア",                       desc: "リトライなしで3EP以上",       elDesc: "リトライなしで3EP{以上|いじょう}",                 color: "#06b6d4", cond: (r) => Object.values(r).filter(v => v?.completed && !v.retries).length >= 3 },
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
  if (earned.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
      {earned.map(b => (
        <div key={b.id} title={b.label}
          style={{ width: 34, height: 34, borderRadius: 10, background: `${b.color}22`, border: `1.5px solid ${b.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "default", transition: "transform .15s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>{b.icon}</div>
      ))}
    </div>
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
  return (
    <div style={{ animation: "slideUp .4s ease" }}>
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
              <div key={b.id} style={{ display: "flex", gap: 10, alignItems: "center", background: `${b.color}08`, border: `1px solid ${b.color}25`, borderRadius: 12, padding: "10px 12px" }}>
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
      <div style={{ background: "#f8fafc", borderRadius: 16, padding: "16px", border: "1px dashed #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: "#94a3b8", marginBottom: 10, letterSpacing: ".08em" }}><RubyText text={ageMode === "elementary" ? "{未獲得|みかくとく}バッジ" : "未獲得バッジ"} /></div>
        {BADGES.filter(b => !b.cond(record)).map(b => (
          <div key={b.id} style={{ display: "flex", gap: 10, alignItems: "center", opacity: .45, marginBottom: 7 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, filter: "grayscale(1)", flexShrink: 0 }}>{b.icon}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}><RubyText text={ageMode === "elementary" ? b.elLabel : b.label} /> <span style={{ fontSize: 10, color: "#94a3b8" }}>— <RubyText text={ageMode === "elementary" ? b.elDesc : b.desc} /></span></div>
          </div>
        ))}
      </div>
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
    hook: "スマホで撮った写真から、自宅や学校の場所が特定される——そんな事件が実際に起きています。",
    talkPoints: ["写真から何がわかるか", "位置情報タグって何？", "投稿前にどう確認するか"],
    parentNote: "制服・校章・表札・ランドマークが写り込んだ写真から、住所が特定された事例があります。",
    elTheme: "{個人情報|こじんじょうほう}・{位置情報|いちじょうほう}",
    elHook: "スマホで{撮|と}った{写真|しゃしん}から、{自宅|じたく}や{学校|がっこう}の{場所|ばしょ}が{特定|とくてい}される——そんな{事件|じけん}が{実際|じっさい}に{起|お}きています。",
    elTalkPoints: ["{写真|しゃしん}から{何|なに}がわかるか", "{位置情報|いちじょうほう}タグって{何|なん}？", "{投稿|とうこう}{前|まえ}にどう{確認|かくにん}するか"],
    elParentNote: "{制服|せいふく}・{校章|こうしょう}・{表札|ひょうさつ}・ランドマークが{写|うつ}り{込|こ}んだ{写真|しゃしん}から、{住所|じゅうしょ}が{特定|とくてい}された{事例|じれい}があります。",
    accentColor: "#ffa940",
  },
  ep2: {
    theme: "フェイクニュース・情報リテラシー",
    hook: "「緊急拡散希望」——その情報、本当ですか？デマを広めた側も責任を問われる時代です。",
    talkPoints: ["フェイクニュースを見分ける方法", "シェアする前にすること", "公式情報源とは？"],
    parentNote: "災害時のデマ拡散で混乱が起きた事例が多数あります。子どもは特に拡散しやすい傾向があります。",
    elTheme: "フェイクニュース・{情報|じょうほう}リテラシー",
    elHook: "「{緊急|きんきゅう}{拡散|かくさん}{希望|きぼう}」——その{情報|じょうほう}、{本当|ほんとう}ですか？デマを{広|ひろ}めた{側|がわ}も{責任|せきにん}を{問|と}われる{時代|じだい}です。",
    elTalkPoints: ["フェイクニュースを{見分|みわ}ける{方法|ほうほう}", "シェアする{前|まえ}にすること", "{公式|こうしき}{情報源|じょうほうげん}とは？"],
    elParentNote: "{災害|さいがい}{時|じ}のデマ{拡散|かくさん}で{混乱|こんらん}が{起|お}きた{事例|じれい}が{多数|たすう}あります。{子|こ}どもは{特|とく}に{拡散|かくさん}しやすい{傾向|けいこう}があります。",
    accentColor: "#7c3aed",
  },
  ep3: {
    theme: "闇バイト・トクリュウ",
    hook: "「スマホだけで日払い5万円」——その求人広告は、犯罪グループの入口です。",
    talkPoints: ["闇バイトの断り方", "トクリュウって何？", "困ったら誰に相談するか"],
    parentNote: "2024年、高校・大学生の逮捕者が急増。「知らなかった」は裁判で通用しません。",
    elTheme: "{闇|やみ}バイト・トクリュウ",
    elHook: "「スマホだけで{日払|ひばら}い5{万円|まんえん}」——その{求人|きゅうじん}{広告|こうこく}は、{犯罪|はんざい}グループの{入口|いりぐち}です。",
    elTalkPoints: ["{闇|やみ}バイトの{断|ことわ}り{方|かた}", "トクリュウって{何|なん}？", "{困|こま}ったら{誰|だれ}に{相談|そうだん}するか"],
    elParentNote: "2024{年|ねん}、{高校|こうこう}・{大学生|だいがくせい}の{逮捕者|たいほしゃ}が{急増|きゅうぞう}。「{知|し}らなかった」は{裁判|さいばん}で{通用|つうよう}しません。",
    accentColor: "#16a34a",
  },
  ep4: {
    theme: "なりすまし・アカウント乗っ取り",
    hook: "「友達からLINEが来た。でも本当に友達だった？」——乗っ取られたアカウントが次の被害者を生みます。",
    talkPoints: ["2段階認証の設定", "ワンタイムパスワードは誰にも教えない", "怪しいLINEが来たら電話確認"],
    parentNote: "LINE乗っ取りは年間数万件。設定→アカウント→2段階認証を今日一緒に確認しましょう。",
    elTheme: "なりすまし・アカウント{乗|の}っ{取|と}り",
    elHook: "「{友達|ともだち}からLINEが{来|き}た。でも{本当|ほんとう}に{友達|ともだち}だった？」——{乗|の}っ{取|と}られたアカウントが{次|つぎ}の{被害者|ひがいしゃ}を{生|う}みます。",
    elTalkPoints: ["2{段階|だんかい}{認証|にんしょう}の{設定|せってい}", "ワンタイムパスワードは{誰|だれ}にも{教|おし}えない", "{怪|あや}しいLINEが{来|き}たら{電話|でんわ}{確認|かくにん}"],
    elParentNote: "LINE{乗|の}っ{取|と}りは{年間|ねんかん}{数万|すうまん}{件|けん}。{設定|せってい}→アカウント→2{段階|だんかい}{認証|にんしょう}を{今日|きょう}{一緒|いっしょ}に{確認|かくにん}しましょう。",
    accentColor: "#0ea5e9",
  },
  ep5: {
    theme: "ネットいじめ・傍観者",
    hook: "グループLINEで悪口が流れていた。「自分は書いていない」——でも、それはいじめに加担していることになります。",
    talkPoints: ["傍観者効果とは何か", "一言どう声をかけるか", "いじめを見たら誰に言うか"],
    parentNote: "ネットいじめは24時間逃げ場がありません。子どもの様子の変化に気づいたら、まず聴いてあげましょう。",
    elTheme: "ネットいじめ・{傍観者|ぼうかんしゃ}",
    elHook: "グループLINEで{悪口|わるくち}が{流|なが}れていた。「{自分|じぶん}は{書|か}いていない」——でも、それはいじめに{加担|かたん}していることになります。",
    elTalkPoints: ["{傍観者|ぼうかんしゃ}{効果|こうか}とは{何|なに}か", "{一言|ひとこと}どう{声|こえ}をかけるか", "いじめを{見|み}たら{誰|だれ}に{言|い}うか"],
    elParentNote: "ネットいじめは24{時間|じかん}{逃|に}げ{場|ば}がありません。{子|こ}どもの{様子|ようす}の{変化|へんか}に{気|き}づいたら、まず{聴|き}いてあげましょう。",
    accentColor: "#ec4899",
  },
  ep6: {
    theme: "自画撮り被害・グルーミング",
    hook: "ゲームで知り合った「同い年の子」。でも本当に同い年ですか？",
    talkPoints: ["グルーミングの手口", "写真を送ってしまったら", "信頼できる大人に話す大切さ"],
    parentNote: "「怒らないから話して」という信頼関係が最大の防御です。被害は子どもの責任ではありません。",
    elTheme: "{自画撮|じがど}り{被害|ひがい}・グルーミング",
    elHook: "ゲームで{知|し}り{合|あ}った「{同|おな}い{年|とし}の{子|こ}」。でも{本当|ほんとう}に{同|おな}い{年|とし}ですか？",
    elTalkPoints: ["グルーミングの{手口|てぐち}", "{写真|しゃしん}を{送|おく}ってしまったら", "{信頼|しんらい}できる{大人|おとな}に{話|はな}す{大切|たいせつ}さ"],
    elParentNote: "「{怒|おこ}らないから{話|はな}して」という{信頼|しんらい}{関係|かんけい}が{最大|さいだい}の{防御|ぼうぎょ}です。{被害|ひがい}は{子|こ}どもの{責任|せきにん}ではありません。",
    accentColor: "#f43f5e",
  },
  ep7: {
    theme: "フィッシング詐欺・スミッシング",
    hook: "「Amazonから重要なお知らせ」——そのSMSのURLを、タップしていませんか？",
    talkPoints: ["SMSのURLは踏まない", "本物のURLの見分け方", "公式アプリを直接開く習慣"],
    parentNote: "2024年、フィッシング被害額が初めて1000億円を超えました。家族全員で「SMSのURLは踏まない」を徹底しましょう。",
    elTheme: "フィッシング{詐欺|さぎ}・スミッシング",
    elHook: "「Amazonから{重要|じゅうよう}なお{知|し}らせ」——そのSMSのURLを、タップしていませんか？",
    elTalkPoints: ["SMSのURLは{踏|ふ}まない", "{本物|ほんもの}のURLの{見分|みわ}け{方|かた}", "{公式|こうしき}アプリを{直接|ちょくせつ}{開|ひら}く{習慣|しゅうかん}"],
    elParentNote: "2024{年|ねん}、フィッシング{被害|ひがい}{額|がく}が{初|はじ}めて1000{億円|おくえん}を{超|こ}えました。{家族|かぞく}{全員|ぜんいん}で「SMSのURLは{踏|ふ}まない」を{徹底|てってい}しましょう。",
    accentColor: "#06b6d4",
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
          🎮 隠しコマンドを発見！<br />EP7「フィッシング詐欺」も体験してみよう
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
            const meta = { ep1:"消えた写真", ep2:"フェイクニュース", ep3:"闇バイト", ep4:"なりすまし", ep5:"ネットいじめ", ep6:"自画撮り", ep7:"フィッシング" };
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
      {/* 上部インジケーター */}
      <div style={{ padding: "20px 24px 0", display: "flex", gap: 6 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? "#ffa940" : "rgba(255,255,255,.15)", transition: "background .3s" }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: "24px 24px 0" }}>
        <div style={{ animation: "slideUp .5s ease", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#ffa940", fontWeight: 700, marginBottom: 8, letterSpacing: ".05em" }}>
            <RubyText text={ageMode === "elementary" ? "なぜ{今|いま}、{必要|ひつよう}なのか" : "なぜ今、必要なのか"} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>
            <RubyText text={ageMode === "elementary" ? "{子|こ}どものSNS{被害|ひがい}は<br />{急増|きゅうぞう}しています" : "子どものSNS被害は<br />急増しています"} />
          </div>
        </div>

        {/* 統計カード */}
        {[
          {
            emoji: "⚠️", color: "#f97316",
            stat: "年間2万件超",
            label: "ネットいじめの認知件数（文科省2023年）",
            body: "過去最多を更新し続けています。被害者の平均年齢は下がっています。",
          },
          {
            emoji: "🕶️", color: "#ef4444",
            stat: "10〜20代が約70%",
            label: "闇バイト逮捕者の年代（警察庁2024年）",
            body: "「スマホだけでできるバイト」として招集された若者が後を絶ちません。",
          },
          {
            emoji: "📱", color: "#8b5cf6",
            stat: "約65%がSNS経由",
            label: "児童への性的被害の接触経路（警察庁2024年）",
            body: "ゲーム・SNSで知り合った相手からの被害が最多です。",
          },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}0a`, border: `1px solid ${s.color}33`,
            borderRadius: 16, padding: "16px 15px", marginBottom: 10,
            display: "flex", gap: 14, alignItems: "flex-start",
            animation: `slideUp .5s ${.1 + i * .1}s both ease`,
          }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>{s.emoji}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, marginBottom: 2 }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.7 }}>{s.body}</div>
            </div>
          </div>
        ))}
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
      },
      {
        num: "02", icon: "😱", color: "#ec4899",
        title: "体験→驚く→話し合う",
        body: "各エピソードにはリアルな「疑似体験」があります。\n体験後に「怖かった？」「どう思う？」と話しかけてみてください。",
        tip: "💡 大人が見ても「知らなかった」と驚く内容です",
        elTitle: "{体験|たいけん}→{驚|おどろ}く→{話|はな}し{合|あ}う",
        elBody: "{各|かく}エピソードにはリアルな「{疑似体験|ぎじたいけん}」があります。<br />{体験後|たいけんご}に「{怖|こわ}かった？」「どう{思|おも}う？」と{話|はな}しかけてみてください。",
        elTip: "💡 {大人|おとな}が{見|み}ても「{知|し}らなかった」と{驚|おどろ}く{内容|ないよう}です",
      },
      {
        num: "03", icon: "📖", color: "#7c3aed",
        title: "キーワードを一緒に覚える",
        body: "トクリュウ・グルーミング・スミッシング…\nニュースに出てくる言葉を親子で覚えて、日常の話題にしましょう。",
        tip: "💡 キーワードノートに記録して後から見返せます",
        elTitle: "キーワードを{一緒|いっしょ}に{覚|おぼ}える",
        elBody: "トクリュウ・グルーミング・スミッシング…<br />ニュースに{出|で}てくる{言葉|ことば}を{親子|おやこ}で{覚|おぼ}えて、{日常|にちじょう}の{話題|わだい}にしましょう。",
        elTip: "💡 キーワードノートに{記録|きろく}して{後|あと}から{見返|みかえ}せます",
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
      word: "位置情報タグ（ジオタグ）",
      reading: "いちじょうほうたぐ",
      emoji: "📍",
      short: "写真に自動で記録されるGPS情報",
      detail: "スマホで撮った写真には「どこで撮ったか」のGPS座標が自動で埋め込まれる。SNSにアップするとその座標も一緒に公開され、自宅・学校が特定される。",
      news: "2019年、写真の位置情報から歌手のファンが自宅を特定した事件が発生。瞳への反射から場所を特定したケースも。",
      scary: "毎日の登下校ルートが丸裸になる",
      action: "設定→プライバシー→カメラ→位置情報：「許可しない」に変更",
      el: {
        word: "{位置|いち}{情報|じょうほう}タグ（ジオタグ）",
        short: "{写真|しゃしん}に{自動|じどう}で{記録|きろく}されるGPS{情報|じょうほう}",
        detail: "スマホでとった{写真|しゃしん}には「どこでとったか」のGPS{座標|ざひょう}が{自動|じどう}で{記録|きろく}されます。SNSにのせると、その{情報|じょうほう}も{一緒|いっしょ}に{公開|こうかい}されます。{自宅|じたく}や{学校|がっこう}の{場所|ばしょ}がわかってしまいます。",
        news: "2019{年|ねん}、{写真|しゃしん}の{位置|いち}{情報|じょうほう}から{歌手|かしゅ}のファンが{家|いえ}の{場所|ばしょ}を{特定|とくてい}した{事件|じけん}がありました。{目|め}のひとみへの{反射|はんしゃ}から{場所|ばしょ}を{特定|とくてい}したれいもあります。",
        scary: "{毎日|まいにち}の{通学|つうがく}ルートが{全部|ぜんぶ}バレてしまう",
        action: "{設定|せってい}→プライバシー→カメラ→{位置|いち}{情報|じょうほう}：「きょかしない」にかえる",
      },
      epKey: "ep1",
    },
    {
      word: "メタデータ",
      reading: "めたでーた",
      emoji: "🗂️",
      short: "ファイルに埋め込まれた「見えない情報」",
      detail: "写真・動画・文書ファイルには「いつ・どこで・どのカメラで」といった情報が自動で記録される。中身には見えないが、確認する方法を知っている人には全部読める。",
      news: "メタデータから作成者・会社名・PCのファイルパスが漏洩した機密文書事件が国内外で複数発生。",
      scary: "削除したつもりでも情報が残り続ける",
      action: "重要ファイルを送る前にメタデータ削除ツールで確認する",
      el: {
        word: "メタデータ（かくれた{情報|じょうほう}）",
        short: "ファイルにかくれている「{見|み}えない{情報|じょうほう}」",
        detail: "{写真|しゃしん}・{動画|どうが}・{文書|ぶんしょ}ファイルには「いつ・どこで・どのカメラで」という{情報|じょうほう}が{自動|じどう}で{記録|きろく}されます。{中身|なかみ}は{見|み}えないけど、{知|し}っている{人|ひと}には{全部|ぜんぶ}{読|よ}めます。",
        news: "メタデータから{作|つく}った{人|ひと}の{名前|なまえ}や{会社|かいしゃ}の{名前|なまえ}がバレた{事件|じけん}が{国内外|こくないがい}で{起|お}きました。",
        scary: "{消|け}したつもりでも{情報|じょうほう}が{残|のこ}り{続|つづ}ける",
        action: "{大切|たいせつ}なファイルをおくる{前|まえ}にメタデータを{消|け}すツールで{確認|かくにん}する",
      },
      epKey: "ep1",
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
    {
      word: "エコーチェンバー",
      reading: "えこーちぇんばー",
      emoji: "🔊",
      short: "同じ意見だけが反響する閉じた情報空間",
      detail: "SNSのアルゴリズムが「自分が見たいもの」だけを見せ続けることで、同じ意見しか目に入らなくなる現象。偏った世界観が強化されていく。",
      news: "陰謀論・反ワクチン・特定政治思想の過激化がエコーチェンバーで促進されると研究が示す。",
      scary: "気づかないうちに極端な考えに染まっていく",
      action: "あえて反対意見や別の立場のニュースも読んでみる",
      el: {
        word: "エコーチェンバー（おなじ{意見|いけん}だけが{広|ひろ}がる{場所|ばしょ}）",
        short: "おなじ{意見|いけん}だけがひびく、とじた{情報|じょうほう}{空間|くうかん}",
        detail: "SNSのしくみが「{自分|じぶん}が{見|み}たいもの」だけを{見|み}せ{続|つづ}けることで、おなじ{意見|いけん}しか{目|め}に{入|はい}らなくなる{現象|げんしょう}。かたよった{考|かんが}え{方|かた}がどんどん{強|つよ}まっていきます。",
        news: "いんぼうろんや{特定|とくてい}の{政治|せいじ}{思想|しそう}が{過激|かげき}{化|か}するのにエコーチェンバーが{関係|かんけい}していることがわかっています。",
        scary: "{気|き}づかないうちにかたよった{考|かんが}えになっていく",
        action: "あえてちがう{意見|いけん}やべつの{立場|たちば}のニュースも{読|よ}んでみる",
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
  ],
  ep4: [
    {
      word: "なりすまし",
      reading: "なりすまし",
      emoji: "🎭",
      short: "他人のふりをして詐欺を行うこと",
      detail: "乗っ取ったSNSアカウントや偽のアカウントで、本人の家族・友人・公式機関になりすまして金銭や個人情報を騙し取ること。",
      news: "2024年、著名人のSNSアカウントをなりすました偽広告詐欺が急増。Meta（Instagram/Facebook）で月数百件の被害報告。",
      scary: "友達のLINEから来たメッセージも疑わなければならない",
      action: "お金や個人情報を求めるLINEは必ず電話で本人確認",
      el: {
        word: "なりすまし（{他人|たにん}のふりをすること）",
        short: "ほかの{人|ひと}のふりをして{詐欺|さぎ}をすること",
        detail: "{乗|の}っ{取|と}ったSNSアカウントやにせアカウントで、{本人|ほんにん}の{家族|かぞく}・{友人|ゆうじん}・{公式|こうしき}きかんになりすまして、お{金|かね}や{個人情報|こじんじょうほう}をだまし{取|と}ること。",
        news: "2024{年|ねん}、{有名人|ゆうめいじん}のSNSアカウントになりすましたにせ{広告|こうこく}{詐欺|さぎ}が{急|きゅう}に{増|ふ}えました。",
        scary: "{友達|ともだち}のLINEから{来|き}たメッセージも{疑|うたが}わなければならない",
        action: "お{金|かね}や{個人情報|こじんじょうほう}を{求|もと}めるLINEは{必|かなら}ずでんわで{本人|ほんにん}かくにん",
      },
      epKey: "ep4",
    },
    {
      word: "二段階認証（2FA）",
      reading: "にだんかいにんしょう",
      emoji: "🔒",
      short: "パスワード＋もう一つの認証で守る仕組み",
      detail: "ログイン時にパスワードに加えて、スマホに届くSMSコードや認証アプリの番号を入力する方法。パスワードが盗まれても、コードがないとログインできない。",
      news: "二段階認証を設定していなかったために乗っ取られたケースが国内で年間数万件報告。設定するだけで99%以上の自動攻撃を防げると言われる。",
      scary: "設定していないと5秒でアカウントが奪われる",
      action: "LINE・Instagram・Gmail全てで今日中に設定する",
      el: {
        word: "{二段階|にだんかい}にんしょう（2FA）",
        short: "パスワード＋もう{一|ひと}つのかくにんで{守|まも}るしくみ",
        detail: "ログインするとき、パスワードのほかに、スマホに{届|とど}くSMSコードや{認証|にんしょう}アプリの{番号|ばんごう}を{入力|にゅうりょく}します。パスワードがぬすまれても、コードがないとログインできません。",
        news: "{二段階|にだんかい}にんしょうを{設定|せってい}していなかったために{乗|の}っ{取|と}られたケースが{国内|こくない}で{年|ねん}に{何万|なんまん}{件|けん}も{報告|ほうこく}されています。",
        scary: "{設定|せってい}していないと5{秒|びょう}でアカウントがうばわれる",
        action: "LINE・Instagram・Gmail{全|すべ}てで{今日|きょう}{中|じゅう}に{設定|せってい}する",
      },
      epKey: "ep4",
    },
    {
      word: "ワンタイムパスワード（OTP）",
      reading: "わんたいむぱすわーど",
      emoji: "🔢",
      short: "一度しか使えない使い捨て認証コード",
      detail: "SMS・メール・認証アプリで届く6桁程度の数字。30秒〜数分で失効し、一度使ったら無効になる。これを他人に教えると即座にアカウントを奪われる。",
      news: "「友達に頼まれてSMSコードを教えた」という口実でアカウントを乗っ取る手口が急増。友達のアカウントが既に乗っ取られているケースが多い。",
      scary: "「友達」が犯人であることに気づく前に全てが終わる",
      action: "ワンタイムパスワードは「誰にも・何があっても」教えない",
      el: {
        word: "ワンタイムパスワード（{一度|いちど}だけつかえるかくにん{番号|ばんごう}）",
        short: "{一度|いちど}しかつかえないつかい{捨|す}てのかくにんコード",
        detail: "SMS・メール・{認証|にんしょう}アプリで{届|とど}く6けたくらいの{数字|すうじ}です。30{秒|びょう}〜{数分|すうふん}でつかえなくなり、{一度|いちど}つかったらもうつかえません。これをほかの{人|ひと}に{教|おし}えると、すぐにアカウントをうばわれます。",
        news: "「{友達|ともだち}にたのまれてSMSコードを{教|おし}えた」という{口実|こうじつ}でアカウントを{乗|の}っ{取|と}る{手口|てぐち}が{急|きゅう}に{増|ふ}えています。",
        scary: "「{友達|ともだち}」が{犯人|はんにん}だと{気|き}づく{前|まえ}に{全部|ぜんぶ}{終|お}わる",
        action: "ワンタイムパスワードは「だれにも・どんな{時|とき}でも」{教|おし}えない",
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
      word: "傍観者効果（バイスタンダー効果）",
      reading: "ぼうかんしゃこうか",
      emoji: "👁️",
      short: "人が多いほど助けない心理",
      detail: "「誰かが助けるだろう」という心理が働き、周りに人が多いほど誰も行動しなくなる現象。ネットでは更に強く働き、「自分一人が言っても」という思考で全員が沈黙する。",
      news: "いじめ被害者の92%が「誰かに気づいてほしかった」と回答。傍観者の一言で状況が変わったケースが多数報告されている。",
      scary: "あなたの沈黙が、誰かの最後の希望を消すかもしれない",
      action: "「それはどうかな」の一言、それだけでいい。完璧でなくていい",
      el: {
        word: "{傍観者|ぼうかんしゃ}こうか（バイスタンダーこうか）",
        short: "{人|ひと}が{多|おお}いほど{助|たす}けない{心理|しんり}",
        detail: "「だれかが{助|たす}けるだろう」という{気持|きも}ちが{働|はたら}き、まわりに{人|ひと}が{多|おお}いほどだれも{行動|こうどう}しなくなる{現象|げんしょう}。ネットではさらに{強|つよ}く{働|はたら}き、「{自分|じぶん}{一人|ひとり}が{言|い}っても」という{考|かんが}えで{全員|ぜんいん}がだまってしまいます。",
        news: "いじめ{被害者|ひがいしゃ}の92%が「だれかに{気|き}づいてほしかった」と{答|こた}えました。{傍観者|ぼうかんしゃ}の{一言|ひとこと}で{状況|じょうきょう}が{変|か}わったれいが{多|おお}く{報告|ほうこく}されています。",
        scary: "あなたのちんもくが、だれかの{最後|さいご}の{希望|きぼう}を{消|け}すかもしれない",
        action: "「それはどうかな」の{一言|ひとこと}、それだけでいい。かんぺきでなくていい",
      },
      epKey: "ep5",
    },
  ],
  ep6: [
    {
      word: "グルーミング",
      reading: "ぐるーみんぐ",
      emoji: "🕸️",
      short: "時間をかけて信頼関係を築き、被害へ誘導する手口",
      detail: "加害者がターゲットに対し、時間をかけて「友達」「理解者」として信頼を獲得し、少しずつ要求をエスカレートさせて性的被害に誘導する手口。ゲーム・SNSがよく使われる。",
      news: "2024年警察庁：児童の性的被害のうち約65%がSNS経由。最初の接触からプレゼント提供→写真要求までの平均期間は約3週間。",
      scary: "「信頼できる」と感じた瞬間が一番危ない",
      action: "ゲーム・SNSで知り合った人とのLINE交換は断る。プレゼントは受け取らない",
      el: {
        word: "グルーミング（だましてなかよくなる{手口|てぐち}）",
        short: "{時間|じかん}をかけて{信頼|しんらい}{関係|かんけい}を{作|つく}り、{被害|ひがい}に{誘|さそ}う{手口|てぐち}",
        detail: "{加害者|かがいしゃ}が{相手|あいて}に「{友達|ともだち}」「わかってくれる{人|ひと}」として{時間|じかん}をかけて{信頼|しんらい}を{作|つく}り、{少|すこ}しずつ{要求|ようきゅう}をエスカレートさせて{性的被害|せいてきひがい}に{誘|さそ}う{手口|てぐち}。ゲーム・SNSがよく{使|つか}われます。",
        news: "2024{年|ねん}けいさつちょう：{子|こ}どもの{性的被害|せいてきひがい}のうち{約|やく}65%がSNS{経由|けいゆ}。{最初|さいしょ}の{接触|せっしょく}からしゃしんを{求|もと}められるまでの{平均|へいきん}は{約|やく}3{週間|しゅうかん}。",
        scary: "「{信頼|しんらい}できる」と{感|かん}じた{瞬間|しゅんかん}が{一番|いちばん}あぶない",
        action: "ゲーム・SNSで{知|し}り{合|あ}った{人|ひと}とのLINE{交換|こうかん}は{断|ことわ}る。プレゼントは{受|う}け{取|と}らない",
      },
      epKey: "ep6",
    },
    {
      word: "デジタル性暴力",
      reading: "でじたるせいぼうりょく",
      emoji: "🚫",
      short: "画像・動画を使った性的な暴力・脅迫",
      detail: "同意なく性的な画像・動画を撮影・保存・拡散すること。「送らないと元の画像をバラまく」という脅迫（セクストーション）も含む。被害者の責任は一切ない。",
      news: "2023年、日本でセクストーション被害が急増。10〜20代の被害者が全体の70%。相談窓口への連絡で画像削除を支援できる場合がある。",
      scary: "ネット上の画像は完全削除が不可能に近い",
      action: "デジタル性暴力ホットライン：0120-437-104。送ってしまっても必ず相談を",
      el: {
        word: "デジタル{性暴力|せいぼうりょく}（{画像|がぞう}などをつかった{性的|せいてき}な{暴力|ぼうりょく}）",
        short: "{画像|がぞう}・{動画|どうが}をつかった{性的|せいてき}な{暴力|ぼうりょく}・おどし",
        detail: "{同意|どうい}なく{性的|せいてき}な{画像|がぞう}・{動画|どうが}をとる・{保存|ほぞん}する・{広|ひろ}めること。「{送|おく}らないともとの{画像|がぞう}をバラまく」というおどし（セクストーション）もふくみます。{被害者|ひがいしゃ}にはぜんぜん{責任|せきにん}がありません。",
        news: "2023{年|ねん}、{日本|にほん}でセクストーション{被害|ひがい}が{急|きゅう}に{増|ふ}えました。10〜20{才|さい}の{被害者|ひがいしゃ}が{全体|ぜんたい}の70%をしめます。",
        scary: "ネット{上|じょう}の{画像|がぞう}は{完全|かんぜん}にけすことがほぼできない",
        action: "デジタル{性暴力|せいぼうりょく}ホットライン：0120-437-104。{送|おく}ってしまっても{必|かなら}ず{相談|そうだん}を",
      },
      epKey: "ep6",
    },
  ],
  ep7: [
    {
      word: "フィッシング詐欺",
      reading: "ふぃっしんぐさぎ",
      emoji: "🎣",
      short: "本物そっくりの偽サイトでIDを騙し取る詐欺",
      detail: "銀行・Amazon・LINE・クレジットカード会社などを装った偽メール・SMSを送り、本物そっくりの偽ログインページに誘導してIDとパスワードを盗む手口。",
      news: "2024年、フィッシング被害の被害額が過去最高の1,000億円超（警察庁）。三菱UFJ・楽天・Amazon・ゆうちょをかたる偽SMSが急増。",
      scary: "入力した0.1秒後にはもう犯罪者の手元に届いている",
      action: "SMSのURLは踏まない。公式アプリを直接開く。URLのドメインを必ず確認",
      el: {
        word: "フィッシング{詐欺|さぎ}",
        short: "{本物|ほんもの}そっくりのにせサイトでIDをだまし{取|と}る{詐欺|さぎ}",
        detail: "{銀行|ぎんこう}・Amazon・LINE・クレジットカード{会社|かいしゃ}などになりすましたにせメール・SMSを{送|おく}り、{本物|ほんもの}そっくりのにせログインページに{誘導|ゆうどう}してIDとパスワードをぬすむ{手口|てぐち}。",
        news: "2024{年|ねん}、フィッシング{被害|ひがい}のひがいがくが{過去最高|かこさいこう}の1000{億円|おくえん}{以上|いじょう}になりました（けいさつちょう）。{銀行|ぎんこう}・Amazon・ゆうちょをかたるにせSMSが{急|きゅう}に{増|ふ}えています。",
        scary: "{入力|にゅうりょく}した0.1{秒後|びょうご}にはもう{犯罪者|はんざいしゃ}の{手元|てもと}に{届|とど}いている",
        action: "SMSのURLはふまない。{公式|こうしき}アプリを{直接|ちょくせつ}{開|ひら}く。URLのドメインを{必|かなら}ずかくにんする",
      },
      epKey: "ep7",
    },
    {
      word: "スミッシング",
      reading: "すみっしんぐ",
      emoji: "📱",
      short: "SMSを使ったフィッシング詐欺",
      detail: "SMS（ショートメッセージ）で偽のリンクを送りつけ、個人情報を盗む手口。「宅配便の再配達」「銀行口座の異常」「ETC未払い」などの内容が多い。",
      news: "2024年、宅配業者をかたるスミッシングが国内で月200万件以上送信された月も。スマホ利用者の約30%が受信経験あり（調査）。",
      scary: "携帯番号さえあれば誰にでも届く。番号の流出は防げない",
      action: "宅配・銀行からのSMSにあるURLは絶対に踏まない。公式アプリで確認",
      el: {
        word: "スミッシング（SMSをつかったフィッシング{詐欺|さぎ}）",
        short: "SMS（ショートメッセージ）をつかったフィッシング{詐欺|さぎ}",
        detail: "SMS（ショートメッセージ）でにせのリンクを{送|おく}りつけ、{個人情報|こじんじょうほう}をぬすむ{手口|てぐち}。「たくはいびんの{再配達|さいはいたつ}」「{銀行|ぎんこう}こうざの{異常|いじょう}」「ETCみばらい」などの{内容|ないよう}が{多|おお}い。",
        news: "2024{年|ねん}、たくはいぎょうしゃをかたるスミッシングが{国内|こくない}で{月|つき}200{万件|まんけん}{以上|いじょう}{送信|そうしん}された{月|つき}もありました。",
        scary: "けいたい{番号|ばんごう}さえあればだれにでも{届|とど}く。{番号|ばんごう}のろうしゅつはふせげない",
        action: "たくはい・{銀行|ぎんこう}からのSMSにあるURLは{絶対|ぜったい}にふまない。{公式|こうしき}アプリでかくにん",
      },
      epKey: "ep7",
    },
    {
      word: "ドメイン詐称",
      reading: "どめいんさしょう",
      emoji: "🌐",
      short: "本物に似せた偽URLで騙す手口",
      detail: "amaz0n（oをゼロに）・amazon-secure.jp・amazon.co.jp.login.com など、本物のドメインに似せた偽URLを使ってフィッシングサイトに誘導する。",
      news: "「.com」より後ろに有名企業名がある場合（例：jp-amazon.com）は全て詐欺。本物のAmazonは必ず「amazon.co.jp」で終わる。",
      scary: "パッと見ただけでは本物と区別がつかない",
      action: "URLは最後の「.co.jp」「.ne.jp」など一番右のドメインだけを確認する",
      el: {
        word: "ドメイン{詐称|さしょう}（にせURLで{人|ひと}をだます{手口|てぐち}）",
        short: "{本物|ほんもの}に{似|に}せたにせURLで{人|ひと}をだます{手口|てぐち}",
        detail: "amaz0n（oをゼロに）・amazon-secure.jp など、{本物|ほんもの}のドメインに{似|に}せたにせURLをつかってフィッシングサイトに{誘導|ゆうどう}します。",
        news: "「.com」より{右|みぎ}に{有名|ゆうめい}な{会社|かいしゃ}の{名前|なまえ}がある{場合|ばあい}（{例|れい}：jp-amazon.com）は{全部|ぜんぶ}{詐欺|さぎ}。{本物|ほんもの}のAmazonは{必|かなら}ず「amazon.co.jp」で{終|お}わります。",
        scary: "パッと{見|み}ただけでは{本物|ほんもの}と{区別|くべつ}がつかない",
        action: "URLは{一番|いちばん}{右|みぎ}の「.co.jp」「.ne.jp」など、{一番|いちばん}みぎのドメインだけかくにんする",
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
  ep1: { title: "消えた写真の秘密", icon: "🔍", color: "#ffa940", theme: "個人情報・位置情報" },
  ep2: { title: "フェイクニュースを見抜け", icon: "🔎", color: "#7c3aed", theme: "情報リテラシー" },
  ep3: { title: "断れなくなる前に", icon: "⚠️", color: "#16a34a", theme: "闇バイト・詐欺" },
  ep4: { title: "友達のふりをした罠", icon: "🔐", color: "#0ea5e9", theme: "なりすまし・乗っ取り" },
  ep5: { title: "見ているだけも、いじめだった", icon: "👥", color: "#ec4899", theme: "ネットいじめ" },
  ep6: { title: "一度送ったら、消せない", icon: "📸", color: "#f43f5e", theme: "自画撮り被害" },
  ep7: { title: "あなたの情報が今、盗まれた", icon: "🎣", color: "#06b6d4", theme: "フィッシング詐欺" },
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
                <RubyText text={ageMode === "elementary" ? "このアドバイスはお{子|こ}さんのプレイ{記録|きろく}をもとに{自動生成|じどうせいせい}されます。{答|こた}えを{教|おし}えるよりも、" : "このアドバイスはお子さんのプレイ記録をもとに自動生成されます。答えを教えるよりも、"} /><strong>「どう{思|おも}う？」と{問|と}いかけること</strong><RubyText text={ageMode === "elementary" ? "が{最|もっと}も{効果的|こうかてき}な{教育|きょういく}です。" : "が最も効果的な教育です。"} />
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
    id: 1, day: "3/12", textKey: "p1Text",
    photoBg: "linear-gradient(135deg,#ffd6e0,#ffafcc)", photoIcon: "🌸",
    localImage: "/images/ep1/post1.png",
    elements: [
      // 校章マーカー削除
      { x: 82, y: 42, emoji: "🏫", labelKey: "schoolSign",    infoKey: "schoolSignInfo",    danger: true },  // 桜花中学校の看板
      { x: 18, y: 18, emoji: "📍", labelKey: "locationTag",   infoKey: "locationTagInfo",   danger: true },  // GPS位置情報タグ
    ],
  },
  {
    id: 2, day: "3/20", textKey: "p2Text",
    photoBg: "linear-gradient(135deg,#fff4d6,#ffc97a)", photoIcon: "🍰",
    localImage: "/images/ep1/post2.png",
    elements: [
      { x: 78, y: 22, emoji: "🗼", labelKey: "landmark",    infoKey: "landmarkInfo",    danger: true },  // 東京タワー（右上）
      { x: 76, y: 52, emoji: "🏢", labelKey: "sign",        infoKey: "signInfo",        danger: true },  // タナカ工業（右寄りに修正）
    ],
  },
  {
    id: 3, day: "4/2", textKey: "p3Text",
    photoBg: "linear-gradient(135deg,#d6e8ff,#7ab8ff)", photoIcon: "☕",
    localImage: "/images/ep1/post3.png",
    elements: [
      // メニュー表マーカー削除、看板のみ残して右下にずらす
      { x: 84, y: 38, emoji: "🏪", labelKey: "cafeName",    infoKey: "cafeNameInfo",    danger: true },  // カフェ名看板（右下にずらす）
    ],
  },
  {
    id: 4, day: "4/8", textKey: "p4Text",
    photoBg: "linear-gradient(135deg,#e0d6ff,#a98aff)", photoIcon: "🐕",
    localImage: "/images/ep1/post4.png",
    elements: [
      { x: 44, y: 36, emoji: "🏠", labelKey: "nameplate",   infoKey: "nameplateInfo",   danger: true },  // 表札「雨宮」
      { x: 80, y: 62, emoji: "🚗", labelKey: "license",     infoKey: "licenseInfo",     danger: true },  // ナンバープレート
    ],
  },
];

// ─────────────────────────────────────────────
// ██ HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ onNavigate, progress }) {
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

  // EP1-2 パスワードゲート
  const EP12_PW = "さくら";
  const [ep12Unlocked, setEp12Unlocked] = useState(() => {
    try { return !!localStorage.getItem("mamoru_ep12_unlocked"); } catch { return false; }
  });
  const [showEp12PwModal, setShowEp12PwModal] = useState(false);
  const [ep12PwInput, setEp12PwInput] = useState("");
  const [ep12PwError, setEp12PwError] = useState(false);
  const handleEp12Pw = () => {
    if (ep12PwInput.trim() === EP12_PW) {
      try { localStorage.setItem("mamoru_ep12_unlocked", "1"); } catch {}
      setEp12Unlocked(true);
      setShowEp12PwModal(false);
      setEp12PwInput("");
      setEp12PwError(false);
      onNavigate("ep12");
    } else {
      setEp12PwError(true);
      setEp12PwInput("");
    }
  };

  // モリィタップ
  const handleOwlTap = () => {
    const next = owlTapCount + 1;
    setOwlTapCount(next);
    if (next >= 10) { setOwlTapCount(0); setSecret1(true); }
    else if (next >= 5) setSecretMsg(`あと${10 - next}回！`);
    else setSecretMsg("");
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
      setSwipeSeq([]); setSecret3(true);
    } else {
      setSwipeSeq(next.slice(-5));
    }
    setSwipeStart(null);
  };
  const modes = [
    { id: "ep1", tag: t("modes.ep1.tag"), title: t("modes.ep1.title"), icon: "🔍", desc: t("modes.ep1.desc"), duration: t("modes.ep1.duration"), audience: t("modes.ep1.audience"), accent: "#ffa940", bg1: "#1a1000", bg2: "#0f0800", done: progress.ep1 },
    { id: "ep12",
      tag: ageMode === "elementary" ? "EPISODE 01-2 · {保護者|ほごしゃ}{限定|げんてい}" : "EPISODE 01-2 · 保護者限定",
      title: ageMode === "elementary" ? "{個人情報|こじんじょうほう}の{特定|とくてい}{体験|たいけん}" : "個人情報の特定体験",
      icon: "🕵️",
      desc: ageMode === "elementary" ? "「{悪|わる}い{人|ひと}」の{視点|してん}で、{校章|こうしょう}→{学校名|がっこうめい}→{住所|じゅうしょ}→{通学路|つうがくろ}が{特定|とくてい}されるシミュレーション。{保護者|ほごしゃ}{向|む}け。" : "「悪い人」の視点で、校章→学校名→住所→通学路が特定されるシミュレーション。保護者向け。",
      duration: ageMode === "elementary" ? "{約|やく}5{分|ふん}" : "約5分",
      audience: ageMode === "elementary" ? "{保護者|ほごしゃ}{専用|せんよう}" : "保護者専用",
      accent: "#dc2626", bg1: "#1a0505", bg2: "#0f0303", done: progress.ep12, locked: !ep12Unlocked },
    { id: "ep2", tag: t("modes.ep2.tag"), title: t("modes.ep2.title"), icon: "🔎", desc: t("modes.ep2.desc"), duration: t("modes.ep2.duration"), audience: t("modes.ep2.audience"), accent: "#7c3aed", bg1: "#0f0a1e", bg2: "#07041a", done: progress.ep2 },
    { id: "ep3", tag: t("modes.ep3.tag"), title: t("modes.ep3.title"), icon: "⚠️", desc: t("modes.ep3.desc"), duration: t("modes.ep3.duration"), audience: t("modes.ep3.audience"), accent: "#16a34a", bg1: "#0a1a0a", bg2: "#041004", done: progress.ep3 },
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
      tag: ageMode === "elementary" ? "EPISODE 06 · {被害|ひがい}{経路|けいろ}{体験|たいけん}" : "EPISODE 06 · 被害経路体験",
      title: ageMode === "elementary" ? "{一度|いちど}{送|おく}ったら、{消|け}せない" : "一度送ったら、消せない",
      icon: "📸",
      desc: ageMode === "elementary" ? "ゲームで{知|し}り{合|あ}った「{友達|ともだち}」に、{少|すこ}しずつ{信頼|しんらい}を{積|つ}み{重|かさ}ねられた{先|さき}に{待|ま}っていたものとは。{自画撮|じがど}り{被害|ひがい}の{経路|けいろ}を{追体験|ついたいけん}する。" : "ゲームで知り合った「友達」に、少しずつ信頼を積み重ねられた先に待っていたものとは。自画撮り被害の経路を追体験する。",
      duration: ageMode === "elementary" ? "{約|やく}8{分|ふん}" : "約8分",
      audience: ageMode === "elementary" ? "{中学生|ちゅうがくせい}〜・{保護者|ほごしゃ}{必見|ひっけん}" : "中学生〜・保護者必見",
      accent: "#f43f5e", bg1: "#1a0308", bg2: "#0f0205", done: progress.ep6 },
    { id: "ep7",
      tag: ageMode === "elementary" ? "EPISODE 07 · フィッシング{体験|たいけん}" : "EPISODE 07 · フィッシング体験",
      title: ageMode === "elementary" ? "あなたの{情報|じょうほう}が{今|いま}、{盗|ぬす}まれた" : "あなたの情報が今、盗まれた",
      icon: "🎣",
      desc: ageMode === "elementary" ? "{本物|ほんもの}そっくりのにせログイン{画面|がめん}に{実際|じっさい}に{入力|にゅうりょく}する{体験|たいけん}。SMSが{届|とど}いてから{情報|じょうほう}が{盗|ぬす}まれるまでをリアルタイムで{追体験|ついたいけん}。" : "本物そっくりの偽ログイン画面に実際に入力する体験。SMSが届いてから情報が盗まれるまでをリアルタイムで追体験。",
      duration: ageMode === "elementary" ? "{約|やく}8{分|ふん}" : "約8分",
      audience: ageMode === "elementary" ? "{中学生|ちゅうがくせい}〜・{全年齢|ぜんねんれい}{推奨|すいしょう}" : "中学生〜・全年齢推奨",
      accent: "#06b6d4", bg1: "#021218", bg2: "#010a10", done: progress.ep7 },
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#e8f4fd 0%,#f0f8ff 40%,#fff8f5 100%)", fontFamily: "'Zen Maru Gothic',sans-serif" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* 隠しコマンド オーバーレイ */}
      {secret1 && <FishingTrap onClose={() => setSecret1(false)} />}
      {secret2 && <MatrixHack onClose={() => setSecret2(false)} />}
      {secret3 && <DarkWebMission onClose={() => setSecret3(false)} />}
      {secret4 && <ParentSecretDashboard onClose={() => setSecret4(false)} />}

      {/* EP1-2 パスワードモーダル */}
      {showEp12PwModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "linear-gradient(135deg,#1a0505,#0f0303)", border: "2px solid rgba(220,38,38,.5)", borderRadius: 22, padding: "28px 22px", maxWidth: 360, width: "100%", fontFamily: "'Zen Maru Gothic',sans-serif", animation: "popIn .3s ease" }}>
            <div style={{ textAlign: "center", fontSize: 42, marginBottom: 10 }}>🔐</div>
            <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 900, textAlign: "center", margin: "0 0 6px" }}>保護者限定コンテンツ</h2>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 12, textAlign: "center", lineHeight: 1.7, margin: "0 0 18px" }}>
              このエピソードは保護者向けです。<br />合言葉を入力してください。
            </p>
            {ep12PwError && (
              <div style={{ background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#fca5a5", textAlign: "center" }}>
                合言葉が違います 😔
              </div>
            )}
            <input
              type="text" value={ep12PwInput}
              onChange={e => { setEp12PwInput(e.target.value); setEp12PwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleEp12Pw()}
              placeholder="合言葉を入力..."
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 12, color: "#fff", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowEp12PwModal(false); setEp12PwInput(""); setEp12PwError(false); }}
                style={{ flex: 1, padding: 12, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "rgba(255,255,255,.7)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                キャンセル
              </button>
              <button onClick={handleEp12Pw}
                style={{ flex: 1, padding: 12, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
                解除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ position: "relative", padding: "44px 20px 28px", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(100,180,255,.18) 0%,transparent 70%)", top: -80, left: -60, animation: "orb 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,169,64,.12) 0%,transparent 70%)", top: 40, right: -40, animation: "orb2 15s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Title row + Language switcher */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "rgba(30,58,95,.4)", letterSpacing: ".3em", marginBottom: 4 }}>{t("home.badge")}</div>
              {/* ② ロゴ長押し3秒でシークレット2 */}
              <div
                onMouseDown={() => { const t = setTimeout(() => { setSecret2(true); setLogoHoldTimer(null); }, 3000); setLogoHoldTimer(t); }}
                onMouseUp={() => { if (logoHoldTimer) { clearTimeout(logoHoldTimer); setLogoHoldTimer(null); } }}
                onTouchStart={() => { const t = setTimeout(() => { setSecret2(true); setLogoHoldTimer(null); }, 3000); setLogoHoldTimer(t); }}
                onTouchEnd={() => { if (logoHoldTimer) { clearTimeout(logoHoldTimer); setLogoHoldTimer(null); } }}
                style={{ fontSize: 30, fontWeight: 900, color: "#1e3a5f", letterSpacing: "-.02em", cursor: "default", userSelect: "none" }}>
                {t("home.appName")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <LanguageSwitcher compact />
              <div style={{ background: "rgba(255,169,64,.12)", border: "1px solid rgba(255,169,64,.3)", borderRadius: 8, padding: "4px 10px", fontSize: 10, color: "#ffa940", fontWeight: 700 }}><RubyText text={t("home.beta")} /></div>
            </div>
          </div>
          {/* Owl greeting */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 28 }}>
            {/* ① モリィ10回タップでシークレット1 */}
            <div onClick={handleOwlTap} style={{ cursor: "pointer", display: "inline-block", position: "relative" }}>
              <OwlMolly size={88} mood={owlTapCount >= 5 ? "excited" : "happy"} />
              {secretMsg && (
                <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", background: "#ffa940", color: "#fff", borderRadius: 99, padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", animation: "popIn .2s ease" }}>
                  {secretMsg}
                </div>
              )}
            </div>
            <div style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(10px)", border: "1px solid rgba(100,180,255,.25)", borderRadius: "18px 18px 18px 6px", padding: "13px 16px", flex: 1, animation: "slideUp .5s .2s both ease", boxShadow: "0 4px 16px rgba(100,180,255,.1)" }}>
              <div style={{ fontSize: 14, color: "#1e3a5f", fontWeight: 700, marginBottom: 4 }}>{t("home.greeting")}</div>
              <div style={{ fontSize: 12, color: "rgba(30,58,95,.6)", lineHeight: 1.7 }}>
                <FormattedText text={t("home.greetingDesc").replace(/\*\*([^*]+)\*\*/g, '<<<$1>>>')} />
              </div>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 4 }}>
            {[
              { icon: "🎮", val: "10", label: t("home.statsMode") },
              { icon: "⭐", val: Object.values(progress).filter(Boolean).length * 3, label: t("home.statsStar") },
              { icon: "✅", val: `${Object.values(progress).filter(Boolean).length}/10`, label: t("home.statsClear") },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.8)", border: "1px solid rgba(100,180,255,.2)", borderRadius: 14, padding: "12px 10px", textAlign: "center", animation: `popIn .4s ${i * .1}s both ease`, boxShadow: "0 2px 12px rgba(100,180,255,.1)" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#1e3a5f", fontFamily: "'DotGothic16',monospace" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(30,58,95,.5)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Master title + badge strip */}
          {(() => {
            const rec = (() => { try { const r = localStorage.getItem("mamoru_progress_v1"); return r ? JSON.parse(r) : {}; } catch { return {}; } })();
            const mt = getMasterTitle(rec);
            const earned = getBadges(rec);
            if (earned.length === 0) return null;
            return (
              <div style={{ marginTop: 12, animation: "slideUp .6s ease" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${mt.color}15`, border: `1px solid ${mt.color}33`, borderRadius: 99, padding: "4px 12px", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: mt.color }}><RubyText text={ageMode === "elementary" ? mt.elTitle : mt.title} /></span>
                </div>
                <BadgeStrip record={rec} />
              </div>
            );
          })()}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 20px 48px", maxWidth: 440, margin: "0 auto" }}>

        {/* 小学生モードバナー */}
        {ageMode === "elementary" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#fef9c3,#fde68a)", border: "1.5px solid #fcd34d", borderRadius: 14, padding: "10px 14px", marginBottom: 12, animation: "slideUp .4s ease" }}>
            <span style={{ fontSize: 20 }}>🏫</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#92400e" }}><RubyText text="{小学生|しょうがくせい}モードでひょうじ{中|ちゅう}" /></div>
              <div style={{ fontSize: 11, color: "#b45309" }}><RubyText text="むずかしい{言葉|ことば}はやさしくしています" /></div>
            </div>
            <button onClick={() => { if (window.confirm("中学生以上モードに変更しますか？")) setAgeMode("middle"); }}
              style={{ fontSize: 10, color: "#92400e", background: "rgba(0,0,0,.08)", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
              <RubyText text="{変更|へんこう}" />
            </button>
          </div>
        )}

        {/* はじめての方へ（保護者向け）バナー */}
        <button onClick={() => onNavigate("opening")}
          style={{
            width: "100%", marginTop: 0, marginBottom: 14, padding: "16px 16px",
            background: "linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08))",
            border: "1.5px solid rgba(139,92,246,.4)",
            borderRadius: 16, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 12,
          }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,.2)", border: "1px solid rgba(139,92,246,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
            👨‍👩‍👧
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9" }}>
              <RubyText text={ageMode === "elementary" ? "はじめての{方|かた}へ（{保護者|ほごしゃ}{向|む}け）" : "はじめての方へ（保護者向け）"} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(109,40,217,.5)", marginTop: 2 }}>
              <RubyText text={ageMode === "elementary" ? "このアプリの{使|つか}い{方|かた}・{目的|もくてき}・{統計|とうけい}を{確認|かくにん}する" : "このアプリの使い方・目的・統計を確認する"} />
            </div>
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,.3)" }}>→</div>
        </button>

        {/* PLAY section */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 12px" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "rgba(30,58,95,.5)", letterSpacing: ".2em" }}>{t("home.sectionPlay")}</div>
          <div style={{ flex: 1, height: 1, background: "rgba(30,58,95,.1)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {modes.map((m, i) => (
            <button key={m.id} onClick={() => {
              // 2台モードは近日公開
              if (m.id === "twodevice") {
                alert("🚧 2台モードは近日公開予定です！\n\nFirebase連携によるリアル2台モードを準備中です。お楽しみに。");
                return;
              }
              // 攻撃者体験はAPIが必要なため無効時はお知らせ
              if (m.id === "attacker" && !CLAUDE_API_ENABLED) {
                alert("🚧 攻撃者体験は近日公開予定です！\n\nAIリアルタイム生成が必要な機能のため、準備中です。お楽しみに。");
                return;
              }
              // EP1-2はパスワードゲート
              if (m.id === "ep12") {
                if (!ep12Unlocked) { setShowEp12PwModal(true); return; }
                onNavigate("ep12"); return;
              }
              onNavigate(m.id);
            }}
              style={{ width: "100%", background: m.id === "attacker" && !CLAUDE_API_ENABLED ? `linear-gradient(135deg,#1a1a1a,#111)` : `linear-gradient(135deg,${m.bg1},${m.bg2})`, border: `1.5px solid ${m.accent}35`, borderRadius: 22, padding: "20px 18px", cursor: "pointer", textAlign: "left", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden", boxShadow: `0 6px 20px rgba(0,0,0,.3)`, animation: `slideUp .5s ${i * .12}s both ease`, opacity: m.id === "attacker" && !CLAUDE_API_ENABLED ? 0.6 : 1 }}>
              <div style={{ position: "absolute", width: 130, height: 130, borderRadius: "50%", background: m.accent, opacity: .06, right: -35, top: -35, filter: "blur(30px)", pointerEvents: "none" }} />
              {m.id === "attacker" && <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${m.accent}60,transparent)`, animation: "scanDown 4s linear infinite", pointerEvents: "none" }} />}
              {/* バッジ */}
              {m.id === "attacker" && !CLAUDE_API_ENABLED
                ? <div style={{ position: "absolute", top: 12, right: 12, background: "#475569", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>🚧 近日公開</div>
                : m.locked
                  ? <div style={{ position: "absolute", top: 12, right: 12, background: "#7f1d1d", color: "#fca5a5", fontSize: 9, fontWeight: 900, padding: "3px 9px", borderRadius: 99, letterSpacing: ".1em" }}>🔐 保護者限定</div>
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
                <div style={{ background: m.id === "attacker" && !CLAUDE_API_ENABLED ? "#475569" : m.accent, borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>
                  {(m.id === "attacker" && !CLAUDE_API_ENABLED) ? "🔒" : m.locked ? "🔐" : "→"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* COMING SOON */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "rgba(30,58,95,.35)", letterSpacing: ".2em" }}>{t("home.sectionSoon")}</div>
          <div style={{ flex: 1, height: 1, background: "rgba(30,58,95,.08)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {soon.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.5)", border: "1px dashed rgba(30,58,95,.15)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, animation: `slideUp .5s ${i * .08}s both ease` }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(30,58,95,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, opacity: .5, filter: "grayscale(1)", flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,58,95,.4)" }}><RubyText text={item.title} /></div>
                <div style={{ fontSize: 10, color: "rgba(30,58,95,.25)", marginTop: 2 }}>{item.tag}</div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(30,58,95,.25)", fontFamily: "'DotGothic16',monospace" }}><RubyText text={t("home.soonLabel")} /></div>
            </div>
          ))}
        </div>

        {/* 週次チャレンジバナー */}
        {(() => {
          const weekStr = getWeekNumber();
          const resultKey = `mamoru_weekly_result_${weekStr}`;
          let done = 0;
          try { done = JSON.parse(localStorage.getItem(resultKey) || "[]").length; } catch {}
          const completed = done >= 3;
          const daysLeft = 7 - ((new Date().getDay() + 6) % 7);
          return (
            <button onClick={() => onNavigate("weekly")}
              style={{ width: "100%", marginTop: 16, padding: "14px 16px", background: completed ? "rgba(74,222,128,.06)" : "rgba(255,169,64,.08)", border: `1.5px solid ${completed ? "rgba(74,222,128,.3)" : "rgba(255,169,64,.35)"}`, borderRadius: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, animation: "glowPulse 3s ease-in-out infinite" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: completed ? "rgba(74,222,128,.15)" : "rgba(255,169,64,.15)", border: `1px solid ${completed ? "rgba(74,222,128,.4)" : "rgba(255,169,64,.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {completed ? "🏆" : "🔥"}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: completed ? "#86efac" : "#ffd28a", display: "flex", alignItems: "center", gap: 6 }}>
                  <RubyText text={ageMode === "elementary" ? "{今週|こんしゅう}のチャレンジ" : "今週のチャレンジ"} />
                  {!completed && <span style={{ fontSize: 10, background: "#ffa940", color: "#fff", borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}>NEW</span>}
                  {completed && <span style={{ fontSize: 10, background: "#22c55e", color: "#fff", borderRadius: 99, padding: "1px 7px", fontWeight: 700 }}><RubyText text={ageMode === "elementary" ? "{完了|かんりょう}✓" : "完了✓"} /></span>}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>
                  {completed
                    ? (ageMode === "elementary"
                      ? <RubyText text={`{今週|こんしゅう} ${done}/3{問|もん}{正解|せいかい} · {来週|らいしゅう}{月曜|げつよう}に{更新|こうしん}`} />
                      : `今週 ${done}/3問正解 · 来週月曜に更新`)
                    : (ageMode === "elementary"
                      ? <RubyText text={`${done}/3{問|もん}{完了|かんりょう} · {残|のこ}り${daysLeft}{日|にち}`} />
                      : `${done}/3問完了 · 残り${daysLeft}日`)}
                </div>
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,.3)" }}>→</div>
            </button>
          );
        })()}

        {/* Bottom buttons: Keyword note + Parent report */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Keyword note button */}
          <button onClick={() => onNavigate("keywordnote")}
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.8)", border: "1.5px solid rgba(100,180,255,.2)", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(100,180,255,.1)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(255,169,64,.15)", border: "1px solid rgba(255,169,64,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📖</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 8 }}>
                キーワードノート
                {Boolean(kwCount) && <span style={{ fontSize: 11, background: "#ffa940", color: "#fff", borderRadius: 99, padding: "1px 8px", fontWeight: 700 }}>{kwCount}ワード</span>}
              </div>
              <div style={{ fontSize: 11, color: "rgba(30,58,95,.45)", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "{各|かく}エピソードで{学|まな}んだ{重要|じゅうよう}ワードを{確認|かくにん}" : "各エピソードで学んだ重要ワードを確認"} /></div>
            </div>
            <div style={{ fontSize: 16, color: "rgba(30,58,95,.3)" }}>→</div>
          </button>

          {/* Parent report button — ④ 5秒長押しでシークレットダッシュボード */}
          <button onClick={() => onNavigate("report")}
            onMouseDown={() => { const t = setTimeout(() => { setSecret4(true); setReportHoldTimer(null); }, 5000); setReportHoldTimer(t); }}
            onMouseUp={() => { if (reportHoldTimer) { clearTimeout(reportHoldTimer); setReportHoldTimer(null); } }}
            onTouchStart={() => { const t = setTimeout(() => { setSecret4(true); setReportHoldTimer(null); }, 5000); setReportHoldTimer(t); }}
            onTouchEnd={() => { if (reportHoldTimer) { clearTimeout(reportHoldTimer); setReportHoldTimer(null); } }}
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.8)", border: "1.5px solid rgba(100,180,255,.2)", borderRadius: 16, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(100,180,255,.1)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👨‍👩‍👧</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#1e3a5f" }}><RubyText text={t("home.parentReport")} /></div>
              <div style={{ fontSize: 11, color: "rgba(30,58,95,.45)", marginTop: 2 }}><RubyText text={t("home.parentReportDesc")} /></div>
            </div>
            <div style={{ fontSize: 16, color: "rgba(30,58,95,.3)" }}>→</div>
          </button>

          {/* 年齢設定変更ボタン */}
          <button onClick={() => {
            const next = ageMode === "elementary" ? "middle" : "elementary";
            const label = next === "elementary" ? "小学4〜6年生" : "中学生以上";
            if (window.confirm(`対象年齢を「${label}」に変更しますか？`)) {
              setAgeMode(next);
            }
          }}
            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,.6)", border: "1px solid rgba(30,58,95,.12)", borderRadius: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 18 }}>🎓</div>
            <div style={{ flex: 1, textAlign: "left", fontSize: 12, color: "rgba(30,58,95,.6)" }}>
              <RubyText text={ageMode === "elementary" ? `{対象|たいしょう}{年齢|ねんれい}の{設定|せってい}を{変更|へんこう}する（{現在|げんざい}：{小学生|しょうがくせい}モード）` : `対象年齢の設定を変更する（現在：中学生以上）`} />
            </div>
            <div style={{ fontSize: 14, color: "rgba(30,58,95,.3)" }}>→</div>
          </button>
        </div>

        {/* アプリ情報リンク */}
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <button onClick={() => onNavigate("info")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: "rgba(30,58,95,.3)" }}>
            <RubyText text={ageMode === "elementary" ? "プライバシーポリシー · {運営者|うんえいしゃ}{情報|じょうほう} · {利用|りよう}{規約|きやく}" : "プライバシーポリシー · 運営者情報 · 利用規約"} />
          </button>
        </div>

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

  useEffect(() => {
    if (phase !== "horror") return;
    const timers = [
      setTimeout(() => { setHorrorStage(1); feedback("horror"); }, 1200),
      setTimeout(() => { setHorrorStage(2); feedback("typing"); }, 3000),
      setTimeout(() => setHorrorStage(3), 6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

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
    else { setHorrorStage(0); setPhase("horror"); }
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
                  <p style={{ fontSize: 14, color: "#14171a", lineHeight: 1.65, margin: "0 0 10px" }}>{getPostText(p)}</p>
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
            : <button onClick={() => { feedback("tap"); setPhase("investigate"); setPostIdx(0); setFound({}); }}
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
    <div style={{ minHeight: "100vh", background: horrorStage >= 1 ? "radial-gradient(ellipse at center,#1a0a0a,#000)" : "linear-gradient(180deg,#fff8f0,#ffeed6)", transition: "background 1.2s ease", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {horrorStage >= 1 && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(255,0,0,.025) 2px,rgba(255,0,0,.025) 4px)", pointerEvents: "none" }} />}
      {horrorStage === 0 && <div style={{ textAlign: "center", color: "#3d2817", fontSize: 14, opacity: .6 }}><RubyText text={t("ep1.daysLater")} /></div>}
      {horrorStage >= 1 && (
        <div style={{ position: "fixed", top: 16, left: 16, right: 16, background: "rgba(20,0,0,.95)", border: "1px solid rgba(255,67,67,.5)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, animation: "notifDrop .6s ease, pulse 1.5s infinite", backdropFilter: "blur(10px)", maxWidth: 400, margin: "0 auto", zIndex: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ff4343", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, animation: "heartbeat 1s infinite" }}>📩</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "#ff8a8a", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}>{t("ep1.unknownSender")}</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginTop: 2 }}><RubyText text={t("ep1.newDM")} /></div>
          </div>
          <div style={{ fontSize: 10, color: "#ff8a8a" }}><RubyText text={t("ep1.justNow")} /></div>
        </div>
      )}
      {horrorStage >= 2 && (
        <div style={{ background: "rgba(30,10,10,.6)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 20, padding: "18px 16px", maxWidth: 340, width: "100%", marginTop: 80, animation: "slideUp .5s ease", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid rgba(255,67,67,.2)", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2a0a0a", border: "2px solid #ff4343", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff4343", fontSize: 20, fontFamily: "'DotGothic16',monospace" }}>?</div>
            <div><div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}><RubyText text={t("ep1.unknownUser")} /></div><div style={{ fontSize: 10, color: "#ff6b6b", animation: "blink 2s infinite" }}>{t("ep1.online")}</div></div>
          </div>
          <div style={{ background: "rgba(255,67,67,.1)", border: "1px solid rgba(255,67,67,.3)", borderRadius: 14, borderTopLeftRadius: 4, padding: "12px 14px", color: "#ffe0e0", fontSize: 14, lineHeight: 1.7 }}>
            {ageMode === "elementary" ? <RubyText text={t("ep1.dm1")} /> : <Typewriter text={t("ep1.dm1")} speed={70} />}
          </div>
          {horrorStage >= 3 && (
            <div style={{ background: "rgba(255,67,67,.15)", border: "1px solid rgba(255,67,67,.4)", borderRadius: 14, borderTopLeftRadius: 4, padding: "12px 14px", marginTop: 8, color: "#fff", fontSize: 16, fontWeight: 900, animation: "shake .4s ease" }}>
              {ageMode === "elementary" ? <RubyText text={t("ep1.dm2")} /> : <Typewriter text={t("ep1.dm2")} speed={120} />}
            </div>
          )}
        </div>
      )}
      {horrorStage >= 3 && (
        <div style={{ marginTop: 28, width: "100%", maxWidth: 340, animation: "slideUp .6s 1.5s both ease" }}>
          <button onClick={() => { feedback("tap"); setWorstCaseShown(false); setPhase("comparison"); }} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ff4343,#cc0000)", border: "1px solid #ff8a8a", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(255,67,67,.4)", animation: "pulse 2s infinite" }}><RubyText text={t("ep1.investigate")} /></button>
        </div>
      )}
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
            ["📱", t("ep1.tip2Title"), t("ep1.tip2Desc")],
            ["🔒", t("ep1.tip3Title"), t("ep1.tip3Desc")]].map(([ic, tt, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#ffa940,#ff8c1a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#3d2817" }}><RubyText text={tt} /></div><div style={{ fontSize: 11, color: "#a08060", marginTop: 2 }}><RubyText text={d} /></div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("quiz")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={t("ep1.talkToFamily")} /></button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Quiz (EP1) ──
  if (phase === "quiz") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["comparison","dialogue","quiz","mywords"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 2 ? "#ffa940" : "rgba(0,0,0,.1)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="ちゃんとりかいできたかかくにんしよう！{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ🦉">理解できたか確認しよう！正解するまで次に進めないよ🦉</OwlSay>
        <MandatoryQuiz
          mode="light"
          question={ageMode === "elementary"
            ? "{投稿|とうこう}{写真|しゃしん}から{個人情報|こじんじょうほう}が{漏|も}れるのを{防|ふせ}ぐために、もっとも{効果的|こうかてき}な{方法|ほうほう}はどれ？"
            : "投稿写真から個人情報が漏れるのを防ぐために、最も効果的な方法はどれ？"}
          choices={[
            { id: "a", label: "A", text: ageMode === "elementary" ? "{顔|かお}を{映|うつ}さないようにする" : "顔を映さないようにする" },
            { id: "b", label: "B", text: ageMode === "elementary" ? "{投稿|とうこう}{前|まえ}に{写真|しゃしん}の{隅々|すみずみ}を{確認|かくにん}し、{位置情報|いちじょうほう}タグをオフにする" : "投稿前に写真の隅々を確認し、位置情報タグをオフにする" },
            { id: "c", label: "C", text: ageMode === "elementary" ? "フォロワーを{友達|ともだち}だけに{限定|げんてい}する" : "フォロワーを友達だけに限定する" },
          ]}
          correctId="b"
          onPass={() => setPhase("mywords")}
          accentColor="#ffa940"
        />
      </div>
    </div>
    </EpisodeShell>
  );

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
          onClick={() => { feedback("tap"); setPhase("dialogue"); }}
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
          onComplete={() => setPhase("keywords")}
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
        <KeywordPhase epKey="ep1" accentColor="#ffa940" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep1" accentColor="#ffa940" />
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Dialogue (EP1) ──
  if (phase === "dialogue") return (
    <EpisodeShell onExit={onExit}>
    <DialogueRunner
      accentColor="#ffa940"
      bg="linear-gradient(180deg,#fff8f0,#ffeed6)"
      epKey="ep1"
      questions={ageMode === "elementary" ? [
        {
          question: "SNSに{写真|しゃしん}を{投稿|とうこう}する{前|まえ}に、{確認|かくにん}すべき{一番|いちばん}{大切|たいせつ}なことは{何|なに}？",
          childOptions: ["きれいに{写|うつ}っているか", "{個人情報|こじんじょうほう}（{校章|こうしょう}・{表札|ひょうさつ}・{場所|ばしょ}）が{写|うつ}っていないか", "フォロワーが{見|み}てくれるか"],
          explanation: "「{個人情報|こじんじょうほう}が{写|うつ}っていないか」が{正解|せいかい}。{校章|こうしょう}・{表札|ひょうさつ}・{看板|かんばん}・{背景|はいけい}の{建物|たてもの}などから、{住所|じゅうしょ}・{学校|がっこう}が{特定|とくてい}される{事例|じれい}が{実際|じっさい}に{起|お}きています。",
          talkTip: "「{最近|さいきん}の{投稿|とうこう}、{一緒|いっしょ}に{見直|みなお}してみよう」と{誘|さそ}ってみましょう。",
        },
        {
          question: "カメラの{位置情報|いちじょうほう}タグをオフにするのはなぜ？",
          childOptions: ["{電池|でんち}の{節約|せつやく}のため", "{写真|しゃしん}のGPS{情報|じょうほう}から{自宅|じたく}が{特定|とくてい}されるのを{防|ふせ}ぐため", "{画質|がしつ}が{悪|わる}くなるから"],
          explanation: "{写真|しゃしん}には{撮影|さつえい}{場所|ばしょ}のGPS{座標|ざひょう}が{自動|じどう}で{記録|きろく}される{場合|ばあい}があります。SNSにアップすると、{自宅|じたく}・{学校|がっこう}の{場所|ばしょ}が{知|し}らない{人|ひと}に{知|し}られるリスクがあります。",
          talkTip: "「{一緒|いっしょ}にスマホの{設定|せってい}を{確認|かくにん}してみよう」と{設定|せってい}を{開|ひら}いてみましょう。",
        },
      ] : [
        {
          question: "SNSに写真を投稿する前に、確認すべき一番大切なことは何？",
          childOptions: ["きれいに写っているか", "個人情報（校章・表札・場所）が写っていないか", "フォロワーが見てくれるか"],
          explanation: "「個人情報が写っていないか」が正解。校章・表札・看板・背景の建物などから、住所・学校が特定される事例が実際に起きています。",
          talkTip: "「最近の投稿、一緒に見直してみよう」と誘ってみましょう。",
        },
        {
          question: "カメラの位置情報タグをオフにするのはなぜ？",
          childOptions: ["電池の節約のため", "写真のGPS情報から自宅が特定されるのを防ぐため", "画質が悪くなるから"],
          explanation: "写真には撮影場所のGPS座標が自動で記録される場合があります。SNSにアップすると、自宅・学校の場所が知らない人に知られるリスクがあります。",
          talkTip: "「一緒にスマホの設定を確認してみよう」と設定を開いてみましょう。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "{今日|きょう}のエピソードで{一番|いちばん}「{怖|こわ}い」と{思|おも}ったことを{書|か}いてみよう" : "今日のエピソードで一番「怖い」と思ったことを書いてみよう"}
      myWordsPlaceholder={ageMode === "elementary" ? "{例|れい}：{写真|しゃしん}の{背景|はいけい}から{家|いえ}がわかってしまうのが{怖|こわ}かった" : "例：写真の背景から家がわかってしまうのが怖かった"}
      onComplete={() => { feedback("tap"); setPhase("quiz"); }}
    />
    {/* 親へのスマホ渡しタイミング — 専門家カード */}
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ background: "rgba(255,169,64,.08)", border: "1px solid rgba(255,169,64,.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: "#a05500", fontWeight: 700 }}>
        <RubyText text={ageMode === "elementary" ? "📱 {親|おや}にスマホを{渡|わた}すタイミング" : "📱 親にスマホを渡すタイミング"} />
      </div>
      <ParentExpertCard epKey="ep1" accentColor="#ffa940" />
    </div>
    </EpisodeShell>
  );

  // ── MyWords（キーワードノート） ──
  if (phase === "mywords") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["comparison","dialogue","quiz","mywords"].map((s, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 3 ? "#ffa940" : "rgba(0,0,0,.1)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="このおはなしにでてきた{大切|たいせつ}な{言葉|ことば}をおぼえよう！ニュースでも{出|で}てくるよ🦉">このエピソードで出てきた大事なワードを一緒に覚えよう！ニュースでも出てくるよ🦉</OwlSay>
        <KeywordPhase epKey="ep1" accentColor="#ffa940" onComplete={() => { feedback("complete"); setAnimStars(true); setPhase("complete"); }} />
      </div>
    </div>
    </EpisodeShell>
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
// ██ EPISODE 1-2 — 個人情報の特定体験（保護者限定）
// ─────────────────────────────────────────────
function Episode1_2({ onComplete, onExit }) {
  const [phase, setPhase] = useState("intro");
  const [step, setStep] = useState(0);

  const STEPS = [
    {
      phase: "校章",
      icon: "🏫",
      clue: "制服の胸に小さな紋章がある",
      extract: "「桜花中学校」— 特定完了",
      detail: "制服の校章は学校名の手がかり。SNSに制服写真を投稿すると、校章から学校名が特定される。",
      found: "学校名",
      risk: 1,
      nextLabel: "学校を調べる →",
    },
    {
      phase: "学校名",
      icon: "📍",
      clue: "「桜花中学校」で検索…",
      extract: "住所：東京都練馬区○○町3-12 — 特定完了",
      detail: "学校名がわかれば住所は即座に判明。学校の公式サイト・地図アプリで1分以内に特定できる。",
      found: "学校の住所",
      risk: 2,
      nextLabel: "通学路を割り出す →",
    },
    {
      phase: "通学路",
      icon: "🗺️",
      clue: "投稿時間：7:50〜8:10 AM（毎日）",
      extract: "通学路・時刻パターン — 特定完了",
      detail: "毎朝の投稿時間＋学校の住所で、「どこを通って何時に歩くか」がわかる。待ち伏せが可能になる。",
      found: "通学路・行動パターン",
      risk: 3,
      nextLabel: "結果を見る →",
    },
  ];

  const currentStep = STEPS[step];

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(255,0,0,.015) 3px,rgba(255,0,0,.015) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 360, width: "100%", position: "relative", zIndex: 2, animation: "slideUp .6s ease" }}>
        <div style={{ background: "rgba(220,38,38,.1)", border: "1.5px solid rgba(220,38,38,.5)", borderRadius: 12, padding: "10px 14px", marginBottom: 20, textAlign: "center" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "#dc2626", letterSpacing: ".3em" }}>⚠ PARENT ONLY — 教育目的シミュレーション</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 56, marginBottom: 12 }}>🕵️</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", textAlign: "center", margin: "0 0 8px", lineHeight: 1.3 }}>個人情報の<br />特定体験</h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: 12, textAlign: "center", margin: "0 0 22px", lineHeight: 1.7 }}>
          EPISODE 01-2
        </p>
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: "16px 18px", marginBottom: 22, color: "rgba(255,255,255,.75)", fontSize: 13, lineHeight: 1.85 }}>
          このシミュレーションでは、<strong style={{ color: "#fca5a5" }}>「悪意ある人物」の視点</strong>で、SNSの投稿から子どもの個人情報が特定される過程を体験します。<br /><br />
          校章 → 学校名 → 住所 → 通学路…<br />
          <strong style={{ color: "#fca5a5" }}>普通の1枚の写真から、どこまでわかるか</strong>を確認してください。
        </div>
        <div style={{ background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 22, fontSize: 11, color: "#fca5a5", lineHeight: 1.7 }}>
          ⚠ これは教育目的のシミュレーションです。実際の犯罪行為ではありません。お子さんの安全のためにご活用ください。
        </div>
        <button onClick={() => { feedback("tap"); setPhase("simulation"); }}
          style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(220,38,38,.4)" }}>
          体験を開始する →
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Simulation steps ──
  if (phase === "simulation") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "#0a0f0a", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#ff2d2d,transparent)", animation: "scanDown 3s linear infinite", opacity: .5 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,0,.012) 2px,rgba(255,0,0,.012) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* ヘッダー */}
        <div style={{ borderBottom: "1px solid rgba(255,45,45,.2)", paddingBottom: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "#ff2d2d", letterSpacing: ".2em", marginBottom: 3 }}>▶ PERSONAL INFO EXTRACTION SIMULATION</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? "#dc2626" : "rgba(255,255,255,.1)", transition: "background .3s" }} />
            ))}
          </div>
        </div>

        {/* ステップカード */}
        <div style={{ background: "rgba(255,45,45,.05)", border: "1px solid rgba(255,45,45,.25)", borderRadius: 16, padding: "18px 16px", marginBottom: 14, animation: "slideUp .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{currentStep.icon}</div>
            <div>
              <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 9, color: "#ff4343", letterSpacing: ".15em", marginBottom: 3 }}>STEP {step + 1} / {STEPS.length}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{currentStep.phase}を分析中…</div>
            </div>
          </div>

          {/* ログライン */}
          <div style={{ background: "#000", borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontFamily: "'DotGothic16',monospace", fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: "#888", marginBottom: 4 }}>$ analyzing post data...</div>
            <div style={{ color: "#ff6b6b" }}>INPUT: {currentStep.clue}</div>
            <div style={{ color: "#4ade80", marginTop: 6, fontWeight: 700 }}>✓ OUTPUT: {currentStep.extract}</div>
          </div>

          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 13, lineHeight: 1.75, margin: 0 }}>{currentStep.detail}</p>
        </div>

        {/* 危険度バー */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 8, fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em" }}>特定済み情報</div>
          {STEPS.slice(0, step + 1).map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.risk === 3 ? "#ef4444" : s.risk === 2 ? "#f97316" : "#fbbf24", flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{s.found}</div>
              <div style={{ marginLeft: "auto", fontSize: 10, color: s.risk === 3 ? "#ef4444" : s.risk === 2 ? "#f97316" : "#fbbf24", fontFamily: "'DotGothic16',monospace" }}>{"█".repeat(s.risk)}{"░".repeat(3 - s.risk)} RISK</div>
            </div>
          ))}
        </div>

        <button onClick={() => {
          feedback("horror");
          if (step < STEPS.length - 1) setStep(step + 1);
          else { setStep(0); setPhase("conclusion"); }
        }}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(220,38,38,.4)", animation: "pulse 2s infinite" }}>
          {currentStep.nextLabel}
        </button>
      </div>
    </div>
    </EpisodeShell>
  );

  // ── Conclusion ──
  if (phase === "conclusion") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff8f0,#ffeed6)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}><OwlMolly size={100} mood="worried" /></div>

        <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #fca5a5", padding: "20px 18px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>😱</div>
          <h2 style={{ fontSize: 18, color: "#7f1d1d", fontWeight: 900, margin: "0 0 10px" }}>これが現実に起きること</h2>
          <p style={{ fontSize: 13, color: "#5d4017", lineHeight: 1.85, margin: 0 }}>
            たった1枚の制服写真から、<strong>学校・住所・通学路・行動パターン</strong>が特定されました。
            <br /><br />
            悪意ある人物には、これだけで十分な情報があります。
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #f4d4a8", padding: "16px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#a05500", marginBottom: 12 }}>🛡️ 保護者にできること</div>
          {[
            ["📸", "投稿前に確認", "校章・制服・表札が写っていないかチェック"],
            ["📍", "位置情報タグをオフ", "スマホのカメラ設定 → 位置情報を許可しない"],
            ["⏰", "投稿のタイミング", "「今から学校」「今帰宅」は時刻と場所を同時公開"],
            ["💬", "子どもと話し合う", "「この写真から何がわかる？」と一緒に確認する習慣"],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#ffa940,#ff8c1a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#3d2817" }}>{title}</div><div style={{ fontSize: 11, color: "#a08060", marginTop: 2, lineHeight: 1.5 }}>{desc}</div></div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,169,64,.08)", border: "1px solid rgba(255,169,64,.3)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, fontSize: 12, color: "#5d4017", lineHeight: 1.75 }}>
          <strong>💡 お子さんとの話し合いのヒント：</strong><br />
          「今見た体験を一緒にやってみよう。この写真から何がわかるか教えてくれる？」
          と聞いてみましょう。子どもが自分で気づくことが最大の学習効果を生みます。
        </div>

        <button onClick={() => onComplete(3)}
          style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#ffa940,#ff8c1a)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(255,169,64,.4)" }}>
          🏠 ホームへ戻る
        </button>
      </div>
    </div>
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
    time: "45分前",
    text: "【速報】内閣府は15日、2025年度の実質GDP成長率が前年比プラス1.2%になったと発表しました。輸出の回復が主な要因としています。詳細はNHKニュースウェブでご覧ください。",
    likes: 4200, rts: 1800, replies: 890,
    photoBg: "linear-gradient(135deg,#0a1628,#0d2142)",
    photoIcon: "📊",
    dangerPoints: [
      { x: 18, y: 22, emoji: "✅", label: "認証済みアカウント", elLabel: "{認証|にんしょう}{済|す}みアカウント", info: "青い認証バッジ（✓）がついている。これはプラットフォームが本物であることを確認したアカウント。", elInfo: "{青|あお}い{認証|にんしょう}バッジ（✓）がついている。これはプラットフォームが{本物|ほんもの}であることを{確認|かくにん}したアカウント。" },
      { x: 75, y: 22, emoji: "📅", label: "具体的な日付", elLabel: "{具体的|ぐたいてき}な{日付|ひづけ}", info: "「15日」と具体的な日付が明記されている。信頼できる情報は「いつ」が明確。", elInfo: "「15{日|にち}」と{具体的|ぐたいてき}な{日付|ひづけ}が{明記|めいき}されている。{信頼|しんらい}できる{情報|じょうほう}は「いつ」が{明確|めいかく}。" },
      { x: 50, y: 72, emoji: "🔗", label: "公式サイトへのリンク", elLabel: "{公式|こうしき}サイトへのリンク", info: "「NHKニュースウェブで詳細を」と一次情報源への誘導がある。信頼できる情報源は詳細確認手段を提示する。", elInfo: "「NHKニュースウェブで{詳細|しょうさい}を」と{一次情報源|いちじじょうほうげん}への{誘導|ゆうどう}がある。{信頼|しんらい}できる{情報源|じょうほうげん}は{詳細|しょうさい}{確認|かくにん}{手段|しゅだん}を{提示|ていじ}する。" },
    ],
    whyFake: "これは本物です。認証バッジ・具体的な発表機関・一次情報源へのリンクが揃っている。",
    elWhyFake: "これは{本物|ほんもの}です。{認証|にんしょう}バッジ・{具体的|ぐたいてき}な{発表|はっぴょう}{機関|きかん}・{一次|いちじ}{情報源|じょうほうげん}へのリンクが{揃|そろ}っている。",
    checkMethod: "✓ このニュースは信頼できます。NHKニュースの公式アカウントからの正確な情報です。",
    elCheckMethod: "✓ このニュースは{信頼|しんらい}できます。NHKニュースの{公式|こうしき}アカウントからの{正確|せいかく}な{情報|じょうほう}です。",
    isReal: true,
  },
];

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
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.9)", lineHeight: 1.75, margin: "0 0 12px" }}>{post.text}</p>

          {/* Photo */}
          <div style={{ position: "relative", background: post.photoBg, borderRadius: 12, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, overflow: "hidden" }}>
            <div style={{ fontSize: 48, opacity: 0.4 }}>{post.photoIcon}</div>
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

          {/* Engagement stats */}
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,.4)" }}>
            <span>❤️ {post.likes.toLocaleString()}</span>
            <span>🔁 {post.rts.toLocaleString()}</span>
            <span>💬 {post.replies.toLocaleString()}</span>
          </div>
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
              ❌ フェイク
            </button>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div style={{ animation: "slideUp .4s ease" }}>
            {/* Correct/Wrong banner */}
            <div style={{ background: isCorrect ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", border: `2px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{isCorrect ? "🎯" : "😅"}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: isCorrect ? "#86efac" : "#fca5a5", marginBottom: 6 }}>
                <RubyText text={isCorrect ? (ageMode === "elementary" ? "{正解|せいかい}！その{通|とお}り！" : "正解！その通り！") : (ageMode === "elementary" ? `{不正解|ふせいかい}。これは${post.verdict === "fake" ? "フェイク" : "{本物|ほんもの}"}でした` : `不正解。これは${post.verdict === "fake" ? "フェイク" : "本物"}でした`)} />
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

  // ── Spread simulation ──
  if (phase === "spread") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}><RubyText text={ageMode === "elementary" ? "クイック{鑑定|かんてい}{結果|けっか}" : "クイック鑑定結果"} /></h2>
          <div style={{ fontSize: 28, fontWeight: 900, color: swipeScore.correct >= 3 ? "#86efac" : "#fca5a5", fontFamily: "'DotGothic16',monospace" }}>
            {swipeScore.correct} / {swipeScore.total || FAKE_POSTS.length} <RubyText text={ageMode === "elementary" ? "{正解|せいかい}" : "正解"} />
          </div>
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

        {/* ── ビジュアル：もしRTしていたら（SNS投稿モック） ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", marginBottom: 10, letterSpacing: ".05em" }}>
            <RubyText text={ageMode === "elementary" ? "📱 もしこの{投稿|とうこう}をRTしていたら…" : "📱 もしこの投稿をRTしていたら…"} />
          </div>

          {/* あなたのRT */}
          <div style={{ background: "#0d1117", borderRadius: 16, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(239,68,68,.3)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#ef4444,#f97316)" }} />
            {/* RT badge */}
            <div style={{ fontSize: 10, color: "#f87171", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <span>🔁</span> <RubyText text={ageMode === "elementary" ? "あなたがリツイートしました" : "あなたがリツイートしました"} />
            </div>
            {/* Original post */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(239,68,68,.2)", border: "1px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>緊急速報_bot</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>フォロワー 1,842 · 2分前</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, margin: "0 0 10px" }}>
              【緊急】○○市で大規模地震発生！今すぐ高台へ避難！ライフライン完全停止中 #拡散希望 #緊急
            </p>
            {/* Fake photo */}
            <div style={{ background: "linear-gradient(135deg,#1a0a00,#2a1400)", borderRadius: 10, height: 90, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative", overflow: "hidden", border: "1px solid rgba(239,68,68,.2)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>🏚️</div>
                <div style={{ fontSize: 10, color: "#f87171", fontWeight: 700 }}><RubyText text={ageMode === "elementary" ? "※ {実際|じっさい}は{別|べつ}の{国|くに}の{古|ふる}い{写真|しゃしん}でした" : "※ 実際は別の国の古い写真でした"} /></div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.35)", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "Googleレンズで{逆検索|ぎゃくけんさく}すると{判明|はんめい}" : "Googleレンズで逆検索すると判明"} /></div>
              </div>
              {/* Overlay warning */}
              <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(239,68,68,.9)", borderRadius: 6, padding: "2px 8px", fontSize: 9, color: "#fff", fontWeight: 700 }}><RubyText text={ageMode === "elementary" ? "⚠️ デマ{画像|がぞう}" : "⚠️ デマ画像"} /></div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,.4)" }}>
              <span>❤️ 48,200</span><span style={{ color: "#f87171", fontWeight: 700 }}>🔁 92,100</span><span>💬 3,400</span>
            </div>
          </div>

          {/* Retweet chain */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0 0 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: 1, height: 16, background: "rgba(239,68,68,.3)" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
            </div>
            <div style={{ fontSize: 11, color: "#f87171" }}>
              <RubyText text={ageMode === "elementary" ? "あなたのフォロワー240{人|にん}{全員|ぜんいん}に{届|とど}きました" : "あなたのフォロワー240人全員に届きました"} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0 0 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: 1, height: 16, background: "rgba(239,68,68,.2)" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(239,68,68,.5)" }} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>
              <RubyText text={ageMode === "elementary" ? "さらにそのフォロワーへ…デマは{止|と}まらない" : "さらにそのフォロワーへ…デマは止まらない"} />
            </div>
          </div>
        </div>

        {/* Spread simulation */}
        <div style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#fca5a5", marginBottom: 14 }}>
            <RubyText text={ageMode === "elementary" ? "⚠️ 1{件|けん}のRTが{引|ひ}き{起|お}こす{連鎖|れんさ}" : "⚠️ 1件のRTが引き起こす連鎖"} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {spreadData.slice(0, spreadStep + 1).map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", animation: "slideUp .3s ease" }}>
                <div style={{ width: 60, flexShrink: 0, fontSize: 11, color: "rgba(255,255,255,.4)", fontFamily: "'DotGothic16',monospace" }}>{d.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: i === 4 ? "0%" : `${Math.min((d.rts / 92000) * 100, 100)}%`, background: i >= 3 ? "#ef4444" : i >= 2 ? "#f97316" : "#a78bfa", borderRadius: 4, transition: "width .8s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: i >= 3 ? "#fca5a5" : "rgba(255,255,255,.55)", marginTop: 3 }}>
                    {d.rts > 0 ? `RT ${d.rts.toLocaleString()}件` : "−"} {d.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {spreadStep < spreadData.length - 1 && (
            <button onClick={() => setSpreadStep(s => s + 1)}
              style={{ width: "100%", marginTop: 14, padding: "10px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              <RubyText text={ageMode === "elementary" ? "{続|つづ}きを{見|み}る →" : "続きを見る →"} />
            </button>
          )}
        </div>

        {spreadStep >= spreadData.length - 1 && (
          <button onClick={() => setPhase("checklist")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            <RubyText text={ageMode === "elementary" ? "フェイクの{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "フェイクの見抜き方を学ぶ →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Checklist ──
  if (phase === "checklist") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a2e,#07041a)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay e="{情報|じょうほう}を{見|み}たときに、この5つを{確認|かくにん}する{習慣|しゅうかん}をつけよう🦉">情報を見たときに、この5つを確認する習慣をつけよう🦉</OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {checklist.slice(0, checkStep + 1).map((item, i) => (
            <div key={i} style={{ background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#e0d9ff", marginBottom: 4 }}>{i + 1}. <RubyText text={item.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}><RubyText text={item.desc} /></div>
              </div>
            </div>
          ))}
        </div>

        {checkStep < checklist.length - 1
          ? <button onClick={() => setCheckStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(167,139,250,.15)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 14, color: "#c4b5fd", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のポイント →" : "次のポイント →"} />
          </button>
          : <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解度|りかいど}チェック →" : "理解度チェック →"} />
          </button>
        }
      </div>
    </div>
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
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP2) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0eeff,#e0d9ff)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="フェイクニュースを{見抜|みぬ}くための{重要|じゅうよう}なことばをおぼえよう！🦉">フェイクニュースを見抜くための重要ワードを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep2" accentColor="#7c3aed" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep2" accentColor="#7c3aed" />
      </div>
    </div>
  );

  // ── Dialogue (EP2) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor="#7c3aed"
      bg="linear-gradient(180deg,#f0eeff,#e0d9ff)"
      epKey="ep2"
      questions={ageMode === "elementary" ? [
        {
          question: "「{拡散|かくさん}{希望|きぼう}！{緊急|きんきゅう}！」という{投稿|とうこう}を{見|み}た。まず{何|なに}をする？",
          childOptions: ["すぐシェアする", "{公式|こうしき}サイト（NHK・{気象庁|きしょうちょう}など）で{確認|かくにん}してから{判断|はんだん}する", "フォロワー{数|すう}を{確認|かくにん}する"],
          explanation: "まず{公式|こうしき}{情報源|じょうほうげん}で{確認|かくにん}するのが{正解|せいかい}。「{緊急|きんきゅう}」「{拡散|かくさん}{希望|きぼう}」は{焦|あせ}りを{誘|さそ}う{言葉|ことば}で、{実|じつ}はフェイクが{多|おお}い。{確認|かくにん}してから、でも{遅|おそ}くはない。",
          talkTip: "「{最近|さいきん}、{信|しん}じそうになった{情報|じょうほう}あった？」と{聞|き}いてみよう。",
        },
        {
          question: "{写真|しゃしん}の{真偽|しんぎ}を{確認|かくにん}する{方法|ほうほう}として{最|もっと}も{効果的|こうかてき}なのは？",
          childOptions: ["フォロワーが{多|おお}いアカウントだから{信頼|しんらい}する", "Googleレンズで{画像|がぞう}を{逆検索|ぎゃくけんさく}する", "コメント{欄|らん}を{見|み}る"],
          explanation: "Googleレンズ（{画像|がぞう}の{逆検索|ぎゃくけんさく}）で{同|おな}じ{写真|しゃしん}がいつ・どこで{使|つか}われたか{確認|かくにん}できる。{古|ふる}い{写真|しゃしん}の{使|つか}い{回|まわ}しや、{別|べつ}の{国|くに}の{出来事|できごと}を{今|いま}{起|お}きたように{見|み}せるフェイクが{多|おお}い。",
          talkTip: "「{一緒|いっしょ}にGoogleレンズを{試|ため}してみよう」と{実際|じっさい}にやってみるのが{効果的|こうかてき}。",
        },
      ] : [
        {
          question: "「拡散希望！緊急！」という投稿を見た。まず何をする？",
          childOptions: ["すぐシェアする", "公式サイト（NHK・気象庁など）で確認してから判断する", "フォロワー数を確認する"],
          explanation: "まず公式情報源で確認するのが正解。「緊急」「拡散希望」は焦りを誘う言葉で、実はフェイクが多い。確認してから、でも遅くはない。",
          talkTip: "「最近、信じそうになった情報あった？」と聞いてみよう。",
        },
        {
          question: "写真の真偽を確認する方法として最も効果的なのは？",
          childOptions: ["フォロワーが多いアカウントだから信頼する", "Googleレンズで画像を逆検索する", "コメント欄を見る"],
          explanation: "Googleレンズ（画像の逆検索）で同じ写真がいつ・どこで使われたか確認できる。古い写真の使い回しや、別の国の出来事を今起きたように見せるフェイクが多い。",
          talkTip: "「一緒にGoogleレンズを試してみよう」と実際にやってみるのが効果的。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "フェイクニュースを{見抜|みぬ}くために、これから{意識|いしき}することを{書|か}いてみよう" : "フェイクニュースを見抜くために、これから意識することを書いてみよう"}
      myWordsPlaceholder="例：投稿する前に公式サイトで確認するようにする"
      onComplete={() => setPhase("complete")}
    />
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
          <button onClick={() => onComplete(swipeScore.correct)} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
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

  // ── Safe End (断った！) ──
  if (phase === "safe_end") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 8, animation: "celebrate 1s infinite" }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#166534", margin: "0 0 6px" }}><RubyText text={ageMode === "elementary" ? "{正|ただ}しく{断|ことわ}れました！" : "正しく断れました！"} /></h2>
          <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.7 }}>
            {choiceHistory.length <= 1
              ? <RubyText text={ageMode === "elementary" ? "{最初|さいしょ}から{疑|うたが}ってかかれた。{完璧|かんぺき}な{判断|はんだん}です。" : "最初から疑ってかかれた。完璧な判断です。"} />
              : <RubyText text={ageMode === "elementary" ? "{途中|とちゅう}で{気|き}づいて{断|ことわ}れた。{勇気|ゆうき}ある{行動|こうどう}です。" : "途中で気づいて断れた。勇気ある行動です。"} />}
          </p>
        </div>
        <OwlSay mood="happy" e="「{断|ことわ}る」のが{一番|いちばん}{正|ただ}しい{選択|せんたく}。{断|ことわ}ることは{全然|ぜんぜん}{悪|わる}くないよ🦉">「断る」のが一番正しい選択。断ることは全然悪くないよ🦉</OwlSay>
        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", border: "2px solid #86efac", marginBottom: 14, boxShadow: "0 6px 20px rgba(22,163,74,.12)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}><RubyText text={ageMode === "elementary" ? "🛑 {断|ことわ}るための3つの{言葉|ことば}" : "🛑 断るための3つの言葉"} /></h3>
          {(ageMode === "elementary" ? [
            ["「やっぱり{興味|きょうみ}ありません」", "{理由|りゆう}を{説明|せつめい}する{必要|ひつよう}はない。{一言|ひとこと}で{十分|じゅうぶん}。"],
            ["「{個人情報|こじんじょうほう}は{教|おし}えられません」", "どんな{理由|りゆう}があっても、{見知|みし}らぬ{人|ひと}に{渡|わた}さない。"],
            ["「ブロックします」", "しつこく{来|き}たらブロック。それは{正当|せいとう}な{自衛|じえい}{手段|しゅだん}。"],
          ] : [
            ["「やっぱり興味ありません」", "理由を説明する必要はない。一言で十分。"],
            ["「個人情報は教えられません」", "どんな理由があっても、見知らぬ人に渡さない。"],
            ["「ブロックします」", "しつこく来たらブロック。それは正当な自衛手段。"],
          ]).map(([t, d], i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontSize: 13, fontWeight: 900, color: "#166534" }}><RubyText text={t} /></div><div style={{ fontSize: 11, marginTop: 2, color: "#15803d" }}><RubyText text={d} /></div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("cases")} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{被害|ひがい}{事例|じれい}を{見|み}る →" : "実際の被害事例を見る →"} /></button>
      </div>
    </div>
  );

  // ── Trap phase ──
  if (phase === "trap") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0000,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(220,38,38,.02) 2px,rgba(220,38,38,.02) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 400, width: "100%", position: "relative", zIndex: 2 }}>

        {trapStage >= 0 && (
          <div style={{ background: "rgba(30,10,10,.7)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, backdropFilter: "blur(20px)", animation: "slideUp .5s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em", marginBottom: 8 }}><RubyText text={ageMode === "elementary" ? "{相手|あいて}からのメッセージ" : "相手からのメッセージ"} /></div>
            <Typewriter text="ありがとう！確認できたよ😊 じゃあ仕事の説明するね——" speed={60} style={{ color: "#fff", fontSize: 14, lineHeight: 1.7 }} />
          </div>
        )}

        {trapStage >= 1 && (
          <div style={{ background: "rgba(40,0,0,.8)", border: "1px solid rgba(220,38,38,.5)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, backdropFilter: "blur(20px)", animation: "slideUp .4s ease, shake .3s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em", marginBottom: 8, animation: "blink 1s infinite" }}>⚠️ <RubyText text={ageMode === "elementary" ? "{突然|とつぜん}、トーンが{変|か}わった" : "突然、トーンが変わった"} /></div>
            <Typewriter text="あ、そうそう。送ってもらった写真と学校名、もう記録してあるから。もし今更やめたいとか言い出したら…わかるよね？" speed={75} style={{ color: "#ffaaaa", fontSize: 14, lineHeight: 1.75, fontWeight: 700 }} />
          </div>
        )}

        {trapStage >= 2 && (
          <div style={{ background: "rgba(60,0,0,.9)", border: "2px solid #dc2626", borderRadius: 20, padding: "18px 16px", marginBottom: 14, animation: "slideUp .4s ease, pulse 2s infinite" }}>
            <div style={{ fontSize: 11, color: "#fca5a5", fontFamily: "'DotGothic16',monospace", marginBottom: 8 }}>📍 <RubyText text={ageMode === "elementary" ? "{脅迫|きょうはく}に{変|か}わった" : "脅迫に変わった"} /></div>
            <Typewriter text="学校に連絡するのも、SNSに顔写真バラまくのも簡単だよ。大人しくやってくれれば何もしない。最初の仕事は明日ね。" speed={80} style={{ color: "#fff", fontSize: 14, lineHeight: 1.8, fontWeight: 700 }} />
          </div>
        )}

        {trapStage >= 3 && (
          <div style={{ animation: "slideUp .5s ease" }}>
            <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fca5a5", marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "わなにかかってしまいました" : "罠にかかってしまいました"} /></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
                <RubyText text={ageMode === "elementary" ? "{個人情報|こじんじょうほう}を{渡|わた}した{時点|じてん}で、{相手|あいて}にコントロールされます。" : "個人情報を渡した時点で、相手にコントロールされます。"} /><br /><RubyText text={ageMode === "elementary" ? "「{知|し}らなかった」では{済|す}まない{状況|じょうきょう}になります。" : "「知らなかった」では済まない状況になります。"} />
              </div>
            </div>
            <button onClick={() => setPhase("cases")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(220,38,38,.4)" }}><RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{逮捕|たいほ}{事例|じれい}を{見|み}る →" : "実際の逮捕事例を見る →"} /></button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Real cases ──
  if (phase === "cases") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a0a0f,#0f0a14)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>⚖️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}><RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{被害|ひがい}・{逮捕|たいほ}{事例|じれい}" : "実際の被害・逮捕事例"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "すべて{実際|じっさい}に{起|お}きた{事件|じけん}をもとにした{事例|じれい}です" : "すべて実際に起きた事件をもとにした事例です"} /></p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {realCases.map((c, i) => (
            <div key={i} style={{ background: i === caseIdx ? "rgba(220,38,38,.1)" : "rgba(255,255,255,.03)", border: `1px solid ${i === caseIdx ? "rgba(220,38,38,.4)" : "rgba(255,255,255,.07)"}`, borderRadius: 16, padding: "16px", cursor: "pointer", transition: "all .2s", animation: `slideUp .4s ${i * .1}s both ease` }} onClick={() => setCaseIdx(i)}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(220,38,38,.15)", border: "1px solid rgba(220,38,38,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚖️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#f87171", fontWeight: 700, marginBottom: 3 }}><RubyText text={c.age} /> / <RubyText text={ageMode === "elementary" ? "{役割|やくわり}：" : "役割："} /><RubyText text={c.role} /></div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 700, lineHeight: 1.5, marginBottom: i === caseIdx ? 8 : 0 }}><RubyText text={c.result} /></div>
                  {i === caseIdx && <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.75, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 8, marginTop: 4 }}><RubyText text={c.detail} /></div>}
                </div>
              </div>
            </div>
          ))}
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

        <button onClick={() => setPhase("checkpoints")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "見抜き方を学ぶ →"} /></button>
      </div>
    </div>
  );

  // ── Checkpoints ──
  if (phase === "checkpoints") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay mood="happy" e="この5つのサインが{出|で}たら、すぐに{離|はな}れよう🦉">この5つのサインが出たら、即座に離れよう🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {checkpoints.map((cp, i) => (
            <div key={i} style={{ background: "rgba(74,222,128,.05)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: `slideUp .4s ${i * .08}s both ease` }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cp.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#4ade80", marginBottom: 3 }}>🚨 <RubyText text={cp.sign} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.7 }}><RubyText text={cp.desc} /></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#4ade80", marginBottom: 8 }}>📞 <RubyText text={ageMode === "elementary" ? "もし{誘|さそ}われたら、どこに{相談|そうだん}する？" : "もし誘われたら、どこに相談する？"} /></div>
          {(ageMode === "elementary" ? [
            ["{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}", "#9110"],
            ["{法務省|ほうむしょう} {子|こ}どもの{人権|じんけん}110{番|ばん}", "0120-007-110"],
            ["おうちの{人|ひと}・{学校|がっこう}の{先生|せんせい}", "まず{一番|いちばん}{近|ちか}くの{大人|おとな}に"],
          ] : [
            ["警察相談専用電話", "#9110"],
            ["法務省 子どもの人権110番", "0120-007-110"],
            ["おうちの人・学校の先生", "まず一番近くの大人に"],
          ]).map(([n, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}><RubyText text={n} /></span>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#4ade80" }}>{v}</span>
            </div>
          ))}
        </div>

        <button onClick={() => setPhase("quiz")} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", marginTop: 14 }}><RubyText text={ageMode === "elementary" ? "{理解度|りかいど}チェック →" : "理解度チェック →"} /></button>
      </div>
    </div>
  );

  // ── Quiz (EP3) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? "#16a34a" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ！よく{考|かんが}えてね🦉">正解するまで次に進めないよ！よく考えてね🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "「{荷物|にもつ}の{受|う}け{取|と}りだけ」という{仕事|しごと}を{頼|たの}まれた。これは{何|なに}？" : "「荷物の受け取りだけ」という仕事を頼まれた。これは何？"}
          choices={ageMode === "elementary" ? [
            { id: "a", label: "A", text: "{普通|ふつう}の{配送|はいそう}バイト" },
            { id: "b", label: "B", text: "{詐欺|さぎ}の「{受|う}け{子|こ}」で、{知|し}らなくても{逮捕|たいほ}される" },
            { id: "c", label: "C", text: "{違法|いほう}だが{未成年|みせいねん}は{罰|ばっ}せられない" },
          ] : [
            { id: "a", label: "A", text: "普通の配送バイト" },
            { id: "b", label: "B", text: "詐欺の「受け子」で、知らなくても逮捕される" },
            { id: "c", label: "C", text: "違法だが未成年は罰せられない" },
          ]}
          correctId="b"
          onPass={() => setPhase("timer")}
          accentColor="#16a34a"
        />
      </div>
    </div>
  );

  // ── Timer体験 (EP3) ──
  if (phase === "timer") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? "#16a34a" : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="scared" e="{実際|じっさい}にこんなメッセージが{来|き}たら…どうする？{体験|たいけん}してみよう🦉">実際にこんなメッセージが来たら…どうする？体験してみよう🦉</OwlSay>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 10, fontStyle: "italic", textAlign: "center" }}>
          — <RubyText text={ageMode === "elementary" ? "{焦|あせ}らせる{圧力|あつりょく}に{負|ま}けない{練習|れんしゅう}" : "焦らせる圧力に負けない練習"} /> —
        </div>
        <TimerChoice
          prompt={ageMode === "elementary" ? "「{今|いま}{決|き}めないと{別|べつ}の{人|ひと}にお{願|ねが}いするよ。5{秒|びょう}で{答|こた}えて」と{来|き}た。どうする？" : "「今決めないと別の人にお願いするよ。5秒で答えて」と来た。どうする？"}
          seconds={8}
          choices={ageMode === "elementary" ? [
            { id: "safe", label: "{無視|むし}してブロックする", emoji: "🚫", safe: true },
            { id: "wait", label: "「{少|すこ}し{考|かんが}えさせて」と{返|かえ}す", emoji: "🤔", safe: true },
          ] : [
            { id: "safe", label: "無視してブロックする", emoji: "🚫", safe: true },
            { id: "wait", label: "「少し考えさせて」と返す", emoji: "🤔", safe: true },
          ]}
          onChoice={() => setPhase("homework")}
          onTimeout={() => setPhase("homework")}
          accentColor="#16a34a"
        />
      </div>
    </div>
  );

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
          <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP3) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="ニュースにも{出|で}てくる{重要|じゅうよう}なことばをいっしょにおぼえよう！🦉">ニュースにも出てくる重要ワードを一緒に覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep3" accentColor="#16a34a" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep3" accentColor="#16a34a" />
      </div>
    </div>
  );

  // ── Dialogue (EP3) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor="#16a34a"
      bg="linear-gradient(180deg,#f0fdf4,#dcfce7)"
      epKey="ep3"
      questions={ageMode === "elementary" ? [
        {
          question: "「{日払|ひばら}い5{万円|まんえん}・スマホだけ」という{求人|きゅうじん}を{見|み}たら、まず{何|なに}を{考|かんが}える？",
          childOptions: ["お{得|とく}だからとりあえず{応募|おうぼ}する", "まともなバイトでこの{条件|じょうけん}はあり{得|え}ない、と{疑|うたが}う", "{友達|ともだち}に{聞|き}いてみる"],
          explanation: "{正解|せいかい}は「{疑|うたが}う」。{合法的|ごうほうてき}なアルバイトで{即日|そくじつ}5{万円|まんえん}は{存在|そんざい}しない。{破格|はかく}の{条件|じょうけん}は{詐欺|さぎ}・{犯罪|はんざい}の{入口|いりぐち}。{応募|おうぼ}した{時点|じてん}でリスクが{始|はじ}まる。",
          talkTip: "「もし{本当|ほんとう}にこういうDMが{来|き}たら、すぐ{見|み}せて」と{約束|やくそく}しましょう。",
        },
        {
          question: "「{荷物|にもつ}を{受|う}け{取|と}るだけのバイト」は{法的|ほうてき}にどうなる？",
          childOptions: ["{知|し}らなかったなら{問題|もんだい}ない", "{受|う}け{取|と}るだけでも{詐欺|さぎ}の{実行犯|じっこうはん}になり{逮捕|たいほ}される", "{未成年|みせいねん}は{逮捕|たいほ}されない"],
          explanation: "{知|し}らなかったでは{済|す}まない。「{受|う}け{子|こ}」は{詐欺|さぎ}の{重要|じゅうよう}な{実行役|じっこうやく}で、{未成年|みせいねん}でも{逮捕|たいほ}・{少年院|しょうねんいん}{送致|そうち}・{実名|じつめい}{報道|ほうどう}になる{事例|じれい}が{多数|たすう}ある。",
          talkTip: "「もし{困|こま}ったら{必|かなら}ず{言|い}って」という{信頼|しんらい}{関係|かんけい}を{作|つく}ることが{最大|さいだい}の{防御|ぼうぎょ}です。",
        },
      ] : [
        {
          question: "「日払い5万円・スマホだけ」という求人を見たら、まず何を考える？",
          childOptions: ["お得だからとりあえず応募する", "まともなバイトでこの条件はあり得ない、と疑う", "友達に聞いてみる"],
          explanation: "正解は「疑う」。合法的なアルバイトで即日5万円は存在しない。破格の条件は詐欺・犯罪の入口。応募した時点でリスクが始まる。",
          talkTip: "「もし本当にこういうDMが来たら、すぐ見せて」と約束しましょう。",
        },
        {
          question: "「荷物を受け取るだけのバイト」は法的にどうなる？",
          childOptions: ["知らなかったなら問題ない", "受け取るだけでも詐欺の実行犯になり逮捕される", "未成年は逮捕されない"],
          explanation: "知らなかったでは済まない。「受け子」は詐欺の重要な実行役で、未成年でも逮捕・少年院送致・実名報道になる事例が多数ある。",
          talkTip: "「もし困ったら必ず言って」という信頼関係を作ることが最大の防御です。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "「{断|ことわ}る」ために{今日|きょう}から{使|つか}える{一言|ひとこと}を{書|か}いてみよう" : "「断る」ために今日から使える一言を書いてみよう"}
      myWordsPlaceholder="例：「興味ありません」とだけ返してブロックする"
      onComplete={() => setPhase("complete")}
    />
  );

  // ── Convo (main game) ──
  if (phase === "convo") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0a1a0a,#041004)", padding: "16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(74,222,128,.08)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: "1px solid rgba(74,222,128,.15)" }}>
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#4ade80", letterSpacing: ".1em" }}>SIMULATION</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map(lv => (
              <div key={lv} style={{ width: 20, height: 6, borderRadius: 3, background: step.dangerLevel >= lv ? "#dc2626" : "rgba(255,255,255,.1)" }} />
            ))}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginLeft: 6 }}><RubyText text={ageMode === "elementary" ? "{危険|きけん}度" : "危険度"} /></span>
          </div>
        </div>

        {/* Situation */}
        <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "rgba(255,255,255,.5)", fontStyle: "italic", textAlign: "center" }}>
          📍 <RubyText text={ageMode === "elementary" ? step.elSituation : step.situation} />
        </div>

        {/* Warning banner */}
        {step.warning && (
          <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#fca5a5", fontWeight: 700, textAlign: "center", animation: "blink 1.5s infinite" }}>
            <RubyText text={ageMode === "elementary" ? step.elWarning : step.warning} />
          </div>
        )}

        {/* Timeline post (step 0 only) */}
        {step.phase === "timeline" && step.post && (
          <div style={{ background: "#0d1117", borderRadius: 18, padding: 16, marginBottom: 14, border: "1px solid rgba(74,222,128,.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📢</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{step.post.account}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>フォロワー 1,842</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.85)", lineHeight: 1.75, margin: "0 0 10px" }}>{step.post.text}</p>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "rgba(255,255,255,.35)" }}>
              <span>❤️ {step.post.likes}</span><span>🔁 {step.post.rts}</span>
            </div>
          </div>
        )}

        {/* DM conversation */}
        {step.phase === "dm" && (
          <div style={{ background: "#0d1117", borderRadius: 18, padding: 14, marginBottom: 14, border: "1px solid rgba(255,255,255,.08)" }}>
            {/* DM header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.06)", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(74,222,128,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📢</div>
              <div><div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>副業_情報局📢</div><div style={{ fontSize: 10, color: "#4ade80", animation: "blink 2s infinite" }}>● オンライン</div></div>
            </div>
            {/* My message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <div style={{ background: "#1d9bf0", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: "75%", fontSize: 13, color: "#fff", lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? step.elSenderMsg : step.senderMsg} /></div>
            </div>
            {/* Their reply */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(74,222,128,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📢</div>
              <div style={{ background: "rgba(255,255,255,.07)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "80%", fontSize: 13, color: "rgba(255,255,255,.9)", lineHeight: 1.7 }}>
                {ageMode === "elementary" ? <RubyText text={step.elReplyMsg} /> : <Typewriter text={step.replyMsg} speed={40} />}
              </div>
            </div>
          </div>
        )}

        {/* Pressure message (intermediate) */}
        {pressure && (
          <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 18, padding: 14, marginBottom: 14, animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 11, color: "#f87171", marginBottom: 8, fontWeight: 700 }}>⚠️ <RubyText text={ageMode === "elementary" ? "{圧力|あつりょく}をかけてきた" : "圧力をかけてきた"} /></div>
            <div style={{ background: "rgba(255,255,255,.05)", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,.85)", lineHeight: 1.7, marginBottom: 10 }}>
              {ageMode === "elementary" ? <RubyText text={pressure.elMsg} /> : <Typewriter text={pressure.msg} speed={50} />}
            </div>
            <OwlSay mood="worried" e={pressure.owlMsgEl}>{pressure.owlMsg}</OwlSay>
            <button onClick={resumeFromPressure} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, color: "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "もう{一度|いちど}{選択|せんたく}する" : "もう一度選択する"} /></button>
          </div>
        )}

        {/* Owl advice */}
        {!pressure && step.owlMsg && <OwlSay mood={step.dangerLevel >= 3 ? "worried" : "happy"} e={step.owlMsgEl}>{step.owlMsg}</OwlSay>}

        {/* Choices */}
        {!pressure && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {step.choices.map((choice, i) => (
              <button key={i} onClick={() => handleChoice(choice)}
                style={{
                  width: "100%", padding: "14px 16px",
                  background: choice.safe ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${choice.safe ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`,
                  borderRadius: 14, color: choice.safe ? "#86efac" : "rgba(255,255,255,.8)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  transition: "all .15s",
                }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{choice.emoji}</span>
                <RubyText text={ageMode === "elementary" ? choice.elLabel : choice.label} />
                {choice.safe && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ {ageMode === "elementary" ? <RubyText text="{安全|あんぜん}" /> : "安全"}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
          <button onClick={() => onComplete(3)} style={{ flex: 1, padding: 14, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
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

function Episode4({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  // intro → story1 → choice1 → [safe_call | gave_code] → aftermath → spotdiff → settings → dialogue → complete
  const [storyStep, setStoryStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [afterStep, setAfterStep] = useState(0);
  const [spotIdx, setSpotIdx] = useState(null);
  const [foundSpots, setFoundSpots] = useState([]);
  const [settingStep, setSettingStep] = useState(0);
  const [choseCode, setChoseCode] = useState(false);

  const sky = "#0ea5e9";
  const skyDark = "#0369a1";

  // Story messages that appear one by one
  const storyMsgs = ageMode === "elementary" ? [
    { from: "haruki", text: "ねー{急|いそ}いで{聞|き}きたいんだけど", time: "14:22" },
    { from: "haruki", text: "LINEの{認証|にんしょう}コードが{間違|まちが}えてお{前|まえ}の{番号|ばんごう}に{届|とど}いちゃったんだけど…", time: "14:22" },
    { from: "haruki", text: "{届|とど}いてる？6{桁|けた}のやつ。{教|おし}えてくれたら{助|たす}かる🙏", time: "14:23" },
  ] : [
    { from: "haruki", text: "ねー急いで聞きたいんだけど", time: "14:22" },
    { from: "haruki", text: "LINEの認証コードが間違えてお前の番号に届いちゃったんだけど…", time: "14:22" },
    { from: "haruki", text: "届いてる？6桁のやつ。教えてくれたら助かる🙏", time: "14:23" },
  ];

  // Aftermath messages — show after giving code
  const afterMsgs = ageMode === "elementary" ? [
    { text: "アカウントが{乗|の}っ{取|と}られました", isAlert: true },
    { from: "fake", text: "ハルキくんのお{母|かあ}さんですか？ハルキが{急|きゅう}に{入院|にゅういん}して{手術|しゅじゅつ}{代|だい}が{必要|ひつよう}になって…{今|いま}すぐ3{万円|まんえん}PayPayで{送|おく}ってもらえますか？", isFamily: true, label: "{家族|かぞく}グループに{送|おく}られたメッセージ" },
    { from: "fake", text: "【{至急|しきゅう}】{俺|おれ}やばいことになった…{今|いま}すぐ5{万円|まんえん}{貸|か}してほしい。{後|あと}で{絶対|ぜったい}{返|かえ}す。PayPayでお{願|ねが}い🙏", isFriend: true, label: "{友達|ともだち}{全員|ぜんいん}に{送|おく}られたメッセージ" },
    { from: "fake", text: "さらに…あなたの{過去|かこ}の{会話|かいわ}・{写真|しゃしん}・{連絡先|れんらくさき}がすべて{盗|ぬす}まれました", isAlert: true },
  ] : [
    { text: "アカウントが乗っ取られました", isAlert: true },
    { from: "fake", text: "ハルキくんのお母さんですか？ハルキが急に入院して手術代が必要になって…今すぐ3万円PayPayで送ってもらえますか？", isFamily: true, label: "家族グループに送られたメッセージ" },
    { from: "fake", text: "【至急】俺やばいことになった…今すぐ5万円貸してほしい。後で絶対返す。PayPayでお願い🙏", isFriend: true, label: "友達全員に送られたメッセージ" },
    { from: "fake", text: "さらに…あなたの過去の会話・写真・連絡先がすべて盗まれました", isAlert: true },
  ];

  // Spot the difference clues (おかしい点を見つけるゲーム)
  const suspiciousPoints = ageMode === "elementary" ? [
    { id: 0, icon: "⚡", label: "「{急|いそ}いで」という{焦|あせ}らせ{方|かた}", desc: "{本物|ほんもの}の{友達|ともだち}でもこんなに{急|せ}かす？{落|お}ち{着|つ}いて{確認|かくにん}する{時間|じかん}は{必|かなら}ずある。" },
    { id: 1, icon: "🔢", label: "{認証|にんしょう}コードの{要求|ようきゅう}", desc: "{認証|にんしょう}コードは{絶対|ぜったい}に{他人|たにん}に{教|おし}えてはいけない。LINEもGoogleも{公式|こうしき}サービスは「コードを{誰|だれ}かに{教|おし}えないでください」と{明記|めいき}している。" },
    { id: 2, icon: "📱", label: "{別|べつ}のアプリで{確認|かくにん}していない", desc: "{本当|ほんとう}にハルキ{本人|ほんにん}？{電話|でんわ}で{確認|かくにん}すれば{一瞬|いっしゅん}でわかる。テキストだけで{信|しん}じてはいけない。" },
    { id: 3, icon: "🤔", label: "「{自分|じぶん}のコードが{他人|たにん}に{届|とど}く」はありえない", desc: "LINEの{認証|にんしょう}コードは{登録|とうろく}した{番号|ばんごう}にしか{届|とど}かない。「{間違|まちが}えて{届|とど}いた」という{話|はなし}{自体|じたい}がおかしい。" },
  ] : [
    { id: 0, icon: "⚡", label: "「急いで」という焦らせ方", desc: "本物の友達でもこんなに急かす？落ち着いて確認する時間は必ずある。" },
    { id: 1, icon: "🔢", label: "認証コードの要求", desc: "認証コードは絶対に他人に教えてはいけない。LINEもGoogleも公式サービスは「コードを誰かに教えないでください」と明記している。" },
    { id: 2, icon: "📱", label: "別のアプリで確認していない", desc: "本当にハルキ本人？電話で確認すれば一瞬でわかる。テキストだけで信じてはいけない。" },
    { id: 3, icon: "🤔", label: "「自分のコードが他人に届く」はありえない", desc: "LINEの認証コードは登録した番号にしか届かない。「間違えて届いた」という話自体がおかしい。" },
  ];

  // 2段階認証の設定手順
  const securitySteps = ageMode === "elementary" ? [
    { icon: "⚙️", title: "LINE{設定|せってい}を{開|ひら}く", desc: "ホーム{画面|がめん}{右上|みぎうえ}の{歯車|はぐるま}アイコン → 「{設定|せってい}」" },
    { icon: "🔐", title: "「アカウント」を{選|えら}ぶ", desc: "{設定|せってい}{一覧|いちらん}の{中|なか}から「アカウント」をタップ" },
    { icon: "📱", title: "「2{段階|だんかい}{認証|にんしょう}」をオンにする", desc: "PINコード（4{桁|けた}）を{設定|せってい}する。{誕生日|たんじょうび}や1234はNG" },
    { icon: "📧", title: "メールアドレスを{登録|とうろく}する", desc: "{乗|の}っ{取|と}られた{時|とき}の{復旧|ふっきゅう}{手段|しゅだん}になる。{必|かなら}ず{設定|せってい}しよう" },
    { icon: "✅", title: "{完了|かんりょう}！これで{守|まも}られる", desc: "コードだけでなくPINも{必要|ひつよう}になり、{乗|の}っ{取|と}りが{格段|かくだん}に{難|むずか}しくなる" },
  ] : [
    { icon: "⚙️", title: "LINE設定を開く", desc: "ホーム画面右上の歯車アイコン → 「設定」" },
    { icon: "🔐", title: "「アカウント」を選ぶ", desc: "設定一覧の中から「アカウント」をタップ" },
    { icon: "📱", title: "「2段階認証」をオンにする", desc: "PINコード（4桁）を設定する。誕生日や1234はNG" },
    { icon: "📧", title: "メールアドレスを登録する", desc: "乗っ取られた時の復旧手段になる。必ず設定しよう" },
    { icon: "✅", title: "完了！これで守られる", desc: "コードだけでなくPINも必要になり、乗っ取りが格段に難しくなる" },
  ];

  useEffect(() => {
    if (phase === "story1") {
      setShowTyping(true);
      const t = setTimeout(() => setShowTyping(false), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, storyStep]);

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep4" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#031220,#020c18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: sky, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔐</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: sky, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 04</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.2 }}><RubyText text={ageMode === "elementary" ? "{友達|ともだち}のふりをした{罠|わな}" : "友達のふりをした罠"} /></h1>
      <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={ageMode === "elementary" ? "なりすまし・アカウント{乗|の}っ{取|と}り{体験|たいけん}" : "なりすまし・アカウント乗っ取り体験"} /> —</p>
      <div style={{ background: `${sky}11`, backdropFilter: "blur(10px)", border: `1px solid ${sky}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#e0f2fe", fontSize: 13, lineHeight: 1.9, marginBottom: 20 }}>
        <RubyText text={ageMode === "elementary" ? `{突然|とつぜん}、` : `突然、`} /><strong style={{ color: sky }}><RubyText text={ageMode === "elementary" ? "{仲|なか}の{良|い}い{友達|ともだち}「ハルキ」" : "仲の良い友達「ハルキ」"} /></strong><RubyText text={ageMode === "elementary" ? "からメッセージが{届|とど}いた。" : "からメッセージが届いた。"} /><br /><br />
        「<RubyText text={ageMode === "elementary" ? "{認証|にんしょう}コードを{教|おし}えて" : "認証コードを教えて"} />」——<strong style={{ color: sky }}><RubyText text={ageMode === "elementary" ? "{信|しん}じてしまったら{何|なに}が{起|お}きる？" : "信じてしまったら何が起きる？"} /></strong>
      </div>
      <div style={{ background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 22, fontSize: 12, color: "#fca5a5", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ <RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{被害|ひがい}{事例|じれい}をもとにした{教育|きょういく}コンテンツです" : "実際の被害事例をもとにした教育コンテンツです"} />
      </div>
      <OwlSay mood="worried" e="「{友達|ともだち}から」というだけで{信|しん}じてしまうのが、この{手口|てぐち}のこわさだよ🦉">「友達から」というだけで信じてしまうのが、この手口の怖さだよ🦉</OwlSay>
      <button onClick={() => setPhase("story1")} style={{ background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}44`, marginTop: 8 }}>体験スタート</button>
    </div>
    </EpisodeShell>
  );

  // ── Story (see the DM) ──
  if (phase === "story1") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ background: `${sky}11`, borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: `1px solid ${sky}22`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: sky, letterSpacing: ".1em" }}>LINE · DM</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}><RubyText text={ageMode === "elementary" ? "{今日|きょう} 14:22" : "今日 14:22"} /></span>
        </div>

        <OwlSay e="ハルキくんからLINEが{来|き}たよ。どんな{内容|ないよう}？">ハルキくんからLINEが来たよ。どんな内容？</OwlSay>

        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${sky}22`, border: `2px solid ${sky}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👦</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ハルキ</div>
              <div style={{ fontSize: 10, color: "#4ade80", animation: "blink 2s infinite" }}>● オンライン</div>
            </div>
          </div>
        }>
          {storyMsgs.slice(0, storyStep + 1).map((m, i) => (
            <LineMsg key={i} from={m.from} text={m.text} time={m.time} />
          ))}
          {showTyping && <LineMsg from="haruki" typing />}
        </PhoneFrame>

        {storyStep < storyMsgs.length - 1 ? (
          <button onClick={() => { setStoryStep(s => s + 1); setShowTyping(true); setTimeout(() => setShowTyping(false), 900); }}
            style={{ width: "100%", padding: 14, background: `${sky}18`, border: `1px solid ${sky}35`, borderRadius: 14, color: sky, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            次のメッセージを見る →
          </button>
        ) : (
          <div style={{ animation: "slideUp .4s ease" }}>
            <OwlSay mood="worried" e="「{認証|にんしょう}コードを{教|おし}えて」…あなたはどうする？🦉">「認証コードを教えて」…あなたはどうする？🦉</OwlSay>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => { setChoseCode(false); setPhase("safe_call"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(74,222,128,.08)", border: "1.5px solid rgba(74,222,128,.3)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>📞</span>
                <div><div><RubyText text={ageMode === "elementary" ? "{電話|でんわ}してハルキ{本人|ほんにん}か{確認|かくにん}する" : "電話してハルキ本人か確認する"} /></div><div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>ちょっと{待|ま}って、{確認|かくにん}してみよう</div></div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ {ageMode === "elementary" ? <RubyText text="{安全|あんぜん}" /> : "安全"}</span>
              </button>
              <button onClick={() => { setChoseCode(true); setPhase("gave_code"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 14, color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>💬</span>
                <div><div><RubyText text={ageMode === "elementary" ? "コードを{教|おし}えてあげる（{友達|ともだち}だし…）" : "コードを教えてあげる（友達だし…）"} /></div><div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "{困|こま}ってるなら{助|たす}けてあげたい" : "困ってるなら助けてあげたい"} /></div></div>
              </button>
              <button onClick={() => { setChoseCode(false); setPhase("safe_call"); }}
                style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 14, color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>🚫</span>
                <div><div><RubyText text={ageMode === "elementary" ? "{無視|むし}する・{返信|へんしん}しない" : "無視する・返信しない"} /></div><div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2 }}><RubyText text={ageMode === "elementary" ? "なんか{怪|あや}しい{気|き}がする" : "なんか怪しい気がする"} /></div></div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ {ageMode === "elementary" ? <RubyText text="{安全|あんぜん}" /> : "安全"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Safe: Called Haruki ──
  if (phase === "safe_call") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        {/* Phone call animation */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(74,222,128,.1)", border: "3px solid #4ade80", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, animation: "float2 1.5s infinite", boxShadow: "0 0 0 12px rgba(74,222,128,.05), 0 0 0 24px rgba(74,222,128,.025)" }}>📞</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#4ade80", marginBottom: 4 }}><RubyText text={ageMode === "elementary" ? "ハルキに{電話|でんわ}した" : "ハルキに電話した"} /></div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? "{本人|ほんにん}かどうか、{声|こえ}で{確認|かくにん}できる" : "本人かどうか、声で確認できる"} /></div>
        </div>

        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ fontSize: 18 }}>👦</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>ハルキ</div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>通話中 0:12</div>
          </div>
        }>
          <LineMsg from="haruki" text="あ、もしもし？え、認証コード？俺そんなLINEしてないよ？？" time="14:24" />
          <LineMsg isMe text="え！じゃあさっきのLINEは偽物だった？？" time="14:24" />
          <LineMsg from="haruki" text="やばい！俺のアカウント乗っ取られてたかも…！！ありがとう教えなくて本当によかった" time="14:25" />
        </PhoneFrame>

        <div style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 16, padding: "16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#4ade80", marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "{完璧|かんぺき}な{対応|たいおう}でした！" : "完璧な対応でした！"} /></div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
            <RubyText text={ageMode === "elementary" ? "{電話|でんわ}で{本人|ほんにん}{確認|かくにん}するのが" : "電話で本人確認するのが"} /><strong style={{ color: "#4ade80" }}><RubyText text={ageMode === "elementary" ? "{最速|さいそく}・{最強|さいきょう}の{防御|ぼうぎょ}" : "最速・最強の防御"} /></strong><RubyText text="です。" /><br /><RubyText text={ageMode === "elementary" ? "テキストは{誰|だれ}でも{偽造|ぎぞう}できるけど、{声|こえ}は{偽造|ぎぞう}しにくい。" : "テキストは誰でも偽造できるけど、声は偽造しにくい。"} />
          </div>
        </div>

        <OwlSay mood="happy" e="「コードは{絶対|ぜったい}に{教|おし}えない」と「{別|べつ}の{方法|ほうほう}で{本人|ほんにん}{確認|かくにん}」の2つをおぼえておこう🦉">「コードは絶対に教えない」と「別の方法で本人確認」の2つを覚えておこう🦉</OwlSay>

        <button onClick={() => setPhase("spotdiff")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}33` }}>
          <RubyText text={ageMode === "elementary" ? "なりすましの{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "なりすましの見抜き方を学ぶ →"} />
        </button>
      </div>
    </div>
  );

  // ── Bad: Gave the code ──
  if (phase === "gave_code") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0505,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(255,0,0,.02) 2px,rgba(255,0,0,.02) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ background: "rgba(220,38,38,.1)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, animation: "redFlash 1.5s infinite" }}>
          <span style={{ fontSize: 16, animation: "heartbeat 1s infinite" }}>🚨</span>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: "#f87171", letterSpacing: ".1em" }}><RubyText text={ageMode === "elementary" ? "コードを{送|おく}ってしまった…" : "コードを送ってしまった…"} /></span>
        </div>

        <PhoneFrame header={
          <div style={{ background: "#1a0505", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(220,38,38,.2)" }}>
            <div style={{ fontSize: 18 }}>👦</div>
            <div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}>ハルキ（？）</div>
            <div style={{ marginLeft: "auto", fontSize: 10, color: "#f87171", animation: "blink 1.5s infinite" }}>● 不審な動き</div>
          </div>
        }>
          <LineMsg isMe text="届いてるよ！847291 だよ" time="14:23" />
          <LineMsg from="fake" text="ありがとう！助かった〜😊" time="14:23" />
          <LineMsg from="fake" typing />
        </PhoneFrame>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {afterMsgs.slice(0, afterStep + 1).map((m, i) => (
            <div key={i} style={{ animation: "slideUp .4s ease" }}>
              {m.isAlert ? (
                <div style={{ background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.5)", borderRadius: 14, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#f87171", letterSpacing: ".05em" }}>⚠️ <RubyText text={m.text} /></div>
                </div>
              ) : (
                <div style={{ background: "#0d1117", borderRadius: 16, padding: 12, border: "1px solid rgba(220,38,38,.25)" }}>
                  <div style={{ fontSize: 10, color: "#f87171", fontFamily: "'DotGothic16',monospace", marginBottom: 8, letterSpacing: ".08em" }}>
                    <RubyText text={m.label} />
                  </div>
                  <LineMsg from="fake" text={m.text} />
                </div>
              )}
            </div>
          ))}
        </div>

        {afterStep < afterMsgs.length - 1 ? (
          <button onClick={() => setAfterStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(220,38,38,.12)", border: "1px solid rgba(220,38,38,.35)", borderRadius: 14, color: "#f87171", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{続|つづ}きを{見|み}る →（{怖|こわ}いかも）" : "続きを見る → （怖いかも）"} />
          </button>
        ) : (
          <button onClick={() => setPhase("spotdiff")}
            style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            <RubyText text={ageMode === "elementary" ? "なりすましの{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "なりすましの見抜き方を学ぶ →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Spot the suspicious points ──
  if (phase === "spotdiff") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🕵️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "おかしい{点|てん}を{見|み}つけよう" : "おかしい点を見つけよう"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6, lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "なりすましメッセージには{必|かなら}ずヒントがある" : "なりすましメッセージには必ずヒントがある"} /></p>
        </div>

        {/* Re-show the suspicious message */}
        <PhoneFrame header={
          <div style={{ background: "#0a1628", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${sky}22` }}>
            <div style={{ fontSize: 16 }}>👦</div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>ハルキ（？）</div>
            <div style={{ marginLeft: "auto", fontSize: 10, color: "#f87171" }}>⚠️ なりすまし</div>
          </div>
        }>
          <LineMsg from="fake" text="ねー急いで聞きたいんだけど" time="14:22" />
          <LineMsg from="fake" text="LINEの認証コードが間違えてお前の番号に届いちゃったんだけど…" time="14:22" />
          <LineMsg from="fake" text="届いてる？6桁のやつ。教えてくれたら助かる🙏" time="14:23" />
        </PhoneFrame>

        <OwlSay mood="worried" e={`このメッセージ、どこかおかしい。タップして{見|み}つけよう🦉（${foundSpots.length}/${suspiciousPoints.length}{個|こ}）`}>このメッセージ、どこかおかしい。タップして見つけよう🦉 <strong style={{ color: sky }}>（{foundSpots.length}/{suspiciousPoints.length}個）</strong></OwlSay>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {suspiciousPoints.map((pt) => {
            const found = foundSpots.includes(pt.id);
            return (
              <button key={pt.id} onClick={() => { if (!found) setFoundSpots(s => [...s, pt.id]); setSpotIdx(pt.id); }}
                style={{ width: "100%", padding: "13px 16px", background: found ? `${sky}18` : "rgba(255,255,255,.04)", border: `1.5px solid ${found ? sky + "55" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: found ? sky : "rgba(255,255,255,.65)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all .2s" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{pt.icon}</span>
                <span style={{ flex: 1 }}>{pt.label}</span>
                {found ? <span style={{ color: sky, fontSize: 16 }}>✓</span> : <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12 }}>{ageMode === "elementary" ? "タップ" : "タップ"}</span>}
              </button>
            );
          })}
        </div>

        {/* Detail popup */}
        {spotIdx !== null && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }} onClick={() => setSpotIdx(null)}>
            <div style={{ background: "#0a1628", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `2px solid ${sky}` }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 34, textAlign: "center", marginBottom: 8 }}>{suspiciousPoints[spotIdx]?.icon}</div>
              <h3 style={{ color: "#e0f2fe", fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}><RubyText text={suspiciousPoints[spotIdx]?.label} /></h3>
              <p style={{ color: "#93c5fd", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}><RubyText text={suspiciousPoints[spotIdx]?.desc} /></p>
              <button onClick={() => setSpotIdx(null)} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}><RubyText text={ageMode === "elementary" ? "なるほど！" : "なるほど！"} /></button>
            </div>
          </div>
        )}

        {foundSpots.length >= suspiciousPoints.length && (
          <button onClick={() => setPhase("settings")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${sky}33`, animation: "popIn .4s ease" }}>
            <RubyText text={ageMode === "elementary" ? "アカウントを{守|まも}る{設定|せってい}を{学|まな}ぶ →" : "アカウントを守る設定を学ぶ →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Security settings ──
  if (phase === "settings") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay e="2{段階|だんかい}{認証|にんしょう}を{設定|せってい}すると、コードを{盗|ぬす}まれても{乗|の}っ{取|と}られにくくなるよ🦉">2段階認証を設定すると、コードを盗まれても乗っ取られにくくなるよ🦉</OwlSay>

        <div style={{ background: `${sky}0a`, border: `1px solid ${sky}22`, borderRadius: 18, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: sky, marginBottom: 14 }}>📱 <RubyText text={ageMode === "elementary" ? "LINEの2{段階|だんかい}{認証|にんしょう}{設定|せってい}{方法|ほうほう}" : "LINEの2段階認証設定方法"} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {securitySteps.slice(0, settingStep + 1).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${sky}18`, border: `1px solid ${sky}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#e0f2fe", marginBottom: 3 }}>STEP {i + 1}：<RubyText text={s.title} /></div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.65 }}><RubyText text={s.desc} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3原則 */}
        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: sky, marginBottom: 10 }}>🛡️ <RubyText text={ageMode === "elementary" ? "{認証|にんしょう}コードの3{原則|げんそく}" : "認証コードの3原則"} /></div>
          {(ageMode === "elementary" ? [
            "{絶対|ぜったい}に{誰|だれ}にも{教|おし}えない（{友達|ともだち}でも・{家族|かぞく}でも）",
            "コードを{求|もと}められたら「なりすまし」を{疑|うたが}う",
            "{不審|ふしん}なら{電話|でんわ}で{本人|ほんにん}{確認|かくにん}を{取|と}る",
          ] : [
            "絶対に誰にも教えない（友達でも・家族でも）",
            "コードを求められたら「なりすまし」を疑う",
            "不審なら電話で本人確認を取る",
          ]).map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: sky, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}><RubyText text={t} /></div>
            </div>
          ))}
        </div>

        {settingStep < securitySteps.length - 1 ? (
          <button onClick={() => setSettingStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${sky}18`, border: `1px solid ${sky}33`, borderRadius: 14, color: sky, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のステップ →" : "次のステップ →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解|りかい}度チェック →" : "理解度チェック →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Quiz (EP4) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? sky : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ🦉">正解するまで次に進めないよ🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "{友達|ともだち}から「LINEの{認証|にんしょう}コードを{教|おし}えて」と{来|き}た。{正|ただ}しい{対応|たいおう}は？" : "友達から「LINEの認証コードを教えて」と来た。正しい対応は？"}
          choices={ageMode === "elementary" ? [
            { id: "a", label: "A", text: "{信頼|しんらい}できる{友達|ともだち}だから{教|おし}える" },
            { id: "b", label: "B", text: "{電話|でんわ}して{本人|ほんにん}かどうか{確認|かくにん}してから{判断|はんだん}する" },
            { id: "c", label: "C", text: "コードの{一部|いちぶ}だけ{教|おし}える" },
          ] : [
            { id: "a", label: "A", text: "信頼できる友達だから教える" },
            { id: "b", label: "B", text: "電話して本人かどうか確認してから判断する" },
            { id: "c", label: "C", text: "コードの一部だけ教える" },
          ]}
          correctId="b"
          onPass={() => setPhase("comparison")}
          accentColor={sky}
        />
      </div>
    </div>
  );

  // ── Comparison (EP4) ──
  if (phase === "comparison") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? sky : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="worried" e="もし{最悪|さいあく}の{選択|せんたく}をしていたら{何|なに}が{起|お}きていたかみてみよう🦉">もし最悪の選択をしていたら何が起きていたか見てみよう🦉</OwlSay>
        <ChoiceComparison
          myChoice={ageMode === "elementary" ? "{電話|でんわ}で{本人|ほんにん}{確認|かくにん}した" : "電話で本人確認した"}
          myResult={ageMode === "elementary" ? "1{本|ほん}の{電話|でんわ}で{乗|の}っ{取|と}りを{完全|かんぜん}に{防|ふせ}いだ。{被害|ひがい}ゼロ" : "1本の電話で乗っ取りを完全に防いだ。被害ゼロ"}
          worstChoice={ageMode === "elementary" ? "コードをそのまま{送|おく}った{場合|ばあい}" : "コードをそのまま送った場合"}
          worstResult={ageMode === "elementary" ? "{全|ぜん}{連絡先|れんらくさき}に{詐欺|さぎ}メッセージが{届|とど}き、{家族|かぞく}・{友達|ともだち}が{被害|ひがい}を{受|う}ける。アカウント{復旧|ふっきゅう}に{数日|すうじつ}かかる{場合|ばあい}も" : "全連絡先に詐欺メッセージが届き、家族・友達が被害を受ける。アカウント復旧に数日かかる場合も"}
          accentColor={sky}
        />
        <button onClick={() => setPhase("homework")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          次へ →
        </button>
      </div>
    </div>
  );

  // ── Homework (EP4) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#031220,#020c18)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? sky : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor={sky}
          tasks={ageMode === "elementary" ? [
            { title: "LINEの2{段階|だんかい}{認証|にんしょう}を{設定|せってい}する", desc: "{設定|せってい} → アカウント → 2{段階|だんかい}{認証|にんしょう} → PINコードを{設定|せってい}" },
            { title: "メールアドレスをLINEに{登録|とうろく}する", desc: "{乗|の}っ{取|と}られた{時|とき}の{復旧|ふっきゅう}{手段|しゅだん}になる" },
            { title: "{家族|かぞく}と「コードは{絶対|ぜったい}に{教|おし}えない」を{約束|やくそく}する", desc: "たとえ{家族|かぞく}から{頼|たの}まれても、{確認|かくにん}の{電話|でんわ}をする" },
          ] : [
            { title: "LINEの2段階認証を設定する", desc: "設定 → アカウント → 2段階認証 → PINコードを設定" },
            { title: "メールアドレスをLINEに登録する", desc: "乗っ取られた時の復旧手段になる" },
            { title: "家族と「コードは絶対に教えない」を約束する", desc: "たとえ家族から頼まれても、確認の電話をする" },
          ]}
        />
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP4) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#e0f2fe,#bae6fd)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="アカウントを{守|まも}るための{重要|じゅうよう}なことばをおぼえよう！🦉">アカウントを守るための重要ワードを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep4" accentColor="#0ea5e9" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep4" accentColor="#0ea5e9" />
      </div>
    </div>
  );

  // ── Dialogue (EP4) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor={sky}
      bg="linear-gradient(180deg,#e0f2fe,#bae6fd)"
      epKey="ep4"
      questions={ageMode === "elementary" ? [
        {
          question: "「{友達|ともだち}から{認証|にんしょう}コードを{教|おし}えて」というLINEが{来|き}た。なぜ{危険|きけん}？",
          childOptions: ["{友達|ともだち}だから{全然|ぜんぜん}{危険|きけん}じゃない", "LINEが{乗|の}っ{取|と}られた{友達|ともだち}になりすました{犯人|はんにん}からかもしれないから", "コードを{教|おし}えても{漏|も}れない"],
          explanation: "{乗|の}っ{取|と}られたアカウントから{送|おく}られてくることが{多|おお}い。テキストは{誰|だれ}でも{偽|いつわ}れる。「{友達|ともだち}から」という{安心感|あんしんかん}こそが{罠|わな}。{必|かなら}ず{電話|でんわ}で{声|こえ}を{確認|かくにん}しよう。",
          talkTip: "「コードは{誰|だれ}に{頼|たの}まれても{絶対|ぜったい}{教|おし}えない」を{家族|かぞく}の{約束|やくそく}にしましょう。",
        },
        {
          question: "LINEの2{段階|だんかい}{認証|にんしょう}を{設定|せってい}するとどんな{効果|こうか}がある？",
          childOptions: ["スパムメールが{減|へ}る", "コードを{盗|ぬす}まれてもPINがないと{乗|の}っ{取|と}れなくなる", "フォロワーが{増|ふ}える"],
          explanation: "2{段階|だんかい}{認証|にんしょう}はPINコードを{設定|せってい}すること。{認証|にんしょう}コードが{盗|ぬす}まれても、PINがないとログインできなくなる。{今日|きょう}{一緒|いっしょ}に{設定|せってい}しよう。",
          talkTip: "「{一緒|いっしょ}にスマホの{設定|せってい}を{開|ひら}いてみよう」と{誘|さそ}いましょう。5{分|ふん}で{完了|かんりょう}します。",
        },
      ] : [
        {
          question: "「友達から認証コードを教えて」というLINEが来た。なぜ危険？",
          childOptions: ["友達だから全然危険じゃない", "LINEが乗っ取られた友達になりすました犯人からかもしれないから", "コードを教えても漏れない"],
          explanation: "乗っ取られたアカウントから送られてくることが多い。テキストは誰でも偽れる。「友達から」という安心感こそが罠。必ず電話で声を確認しよう。",
          talkTip: "「コードは誰に頼まれても絶対教えない」を家族の約束にしましょう。",
        },
        {
          question: "LINEの2段階認証を設定するとどんな効果がある？",
          childOptions: ["スパムメールが減る", "コードを盗まれてもPINがないと乗っ取れなくなる", "フォロワーが増える"],
          explanation: "2段階認証はPINコードを設定すること。認証コードが盗まれても、PINがないとログインできなくなる。今日一緒に設定しよう。",
          talkTip: "「一緒にスマホの設定を開いてみよう」と誘いましょう。5分で完了します。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "「なりすまし」から{身|み}を{守|まも}るために{決|き}めたことを{書|か}こう" : "「なりすまし」から身を守るために決めたことを書こう"}
      myWordsPlaceholder="例：怪しいLINEが来たら、まず電話して本人か確認する"
      onComplete={() => setPhase("complete")}
    />
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#e0f2fe,#bae6fd,#7dd3fc)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [sky, "#38bdf8", "#7dd3fc", "#0ea5e9", "#bae6fd"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#f0f9ff)", borderRadius: 22, padding: "28px 22px", border: `3px double ${sky}`, textAlign: "center", boxShadow: `0 20px 60px ${sky}33`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: sky }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: skyDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#0c4a6e", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#075985", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={ageMode === "elementary" ? `あなたは「マモル」{第|だい}4{話|わ}` : `あなたは「マモル」第4話`} /><br /><strong style={{ color: "#0c4a6e", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "{友達|ともだち}のふりをした{罠|わな}" : "友達のふりをした罠"} /></strong><br /><RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${sky}33,#bae6fd)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: skyDark, marginBottom: 3 }}>EPISODE 04 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#0c4a6e", fontWeight: 900 }}>🔐 <RubyText text={ageMode === "elementary" ? "アカウント{守護者|しゅごしゃ}" : "アカウント守護者"} /> 🔐</div>
          </div>
          <div style={{ fontSize: 10, color: sky, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP4 クリア！", text: "なりすまし・アカウント乗っ取り対策を学んだ！SNSリテラシーアプリ「マモル」🔐" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${sky}`, borderRadius: 14, color: skyDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => onComplete(3)}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${sky},${skyDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 5 — 見ているだけも、いじめだった
// ネットいじめ・グループ外し体験
// ─────────────────────────────────────────────

// グループLINEのメッセージデータ
const GROUP_MSGS_1 = [
  { id: 1, from: "ユイ", icon: "👧", color: "#ff85c2", text: "今日の体育きつかった〜😅", time: "16:42" },
  { id: 2, from: "ケン", icon: "👦", color: "#60a5fa", text: "わかる笑 リレー最悪やった", time: "16:43" },
  { id: 3, from: "サキ", icon: "👩", color: "#a78bfa", text: "あ〜でも○○さん、また走るの遅くてチームの足引っ張ってたよね", time: "16:44" },
  { id: 4, from: "ケン", icon: "👦", color: "#60a5fa", text: "ほんとそれ笑 毎回じゃん", time: "16:44" },
  { id: 5, from: "ユイ", icon: "👧", color: "#ff85c2", text: "草🌿🌿🌿", time: "16:45" },
  { id: 6, from: "サキ", icon: "👩", color: "#a78bfa", text: "てかいつも空気読めないしさー", time: "16:45" },
  { id: 7, from: "サキ", icon: "👩", color: "#a78bfa", text: "ここだけの話ね👆", time: "16:45" },
];

const CHOICE_A_MSGS = [
  { from: "あなた", icon: "🫵", color: "#ffa940", text: "わかる笑 ちょっとズレてるよね", isMe: true, time: "16:46" },
  { from: "サキ", icon: "👩", color: "#a78bfa", text: "でしょ！！😂 やっとわかってくれた人いた", time: "16:46" },
  { from: "ケン", icon: "👦", color: "#60a5fa", text: "仲間仲間笑", time: "16:46" },
];

const CHOICE_B_MSGS = [
  { from: "あなた", icon: "🫵", color: "#ffa940", text: "（既読スルー）", isMe: true, isGhost: true, time: "16:46" },
  { from: "サキ", icon: "👩", color: "#a78bfa", text: "あれ、無視？", time: "16:47" },
  { from: "ケン", icon: "👦", color: "#60a5fa", text: "まあいいじゃん笑", time: "16:47" },
];

const CHOICE_C_MSGS = [
  { from: "あなた", icon: "🫵", color: "#ffa940", text: "ちょっと待って。それ○○さんが見たら傷つくよ", isMe: true, time: "16:46" },
  { from: "サキ", icon: "👩", color: "#a78bfa", text: "え、別に見ないじゃん🙄", time: "16:46" },
  { from: "ケン", icon: "👦", color: "#60a5fa", text: "まあまあ", time: "16:47" },
  { from: "サキ", icon: "👩", color: "#a78bfa", text: "気にしすぎじゃない？", time: "16:47" },
];

// ○○さん（被害者）視点のメッセージ
const VICTIM_MSGS = [
  { type: "narration", text: "翌日、○○さんのスマホには…" },
  { type: "notif", from: "クラスLINE", text: "サキさんがあなたをグループから削除しました", isSystem: true },
  { type: "msg", from: "友達のリナ", icon: "👧", color: "#fb923c", text: "ねえ…昨日のLINE、スクショ回ってるんだけど" },
  { type: "msg", from: "○○さん（あなた）", icon: "😟", color: "#94a3b8", text: "え？何のこと？", isMe: true },
  { type: "msg", from: "友達のリナ", icon: "👧", color: "#fb923c", text: "「足遅い」「空気読めない」って書かれてる…みんな知ってるよ" },
  { type: "silence", text: "その後、既読がついても誰も返信しなかった。\n廊下ですれ違っても、目を合わせてもらえなかった。" },
];

// LINE風メッセージ（Episode 5用）
function GroupMsg({ msg, showName = true }) {
  if (msg.isGhost) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <div style={{ background: "rgba(255,169,64,.15)", border: "1px dashed rgba(255,169,64,.4)", borderRadius: "14px 4px 14px 14px", padding: "8px 12px", maxWidth: "70%", fontSize: 12, color: "rgba(255,169,64,.6)", fontStyle: "italic" }}>
          {msg.text}
        </div>
      </div>
    );
  }
  if (msg.isMe) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ background: "#4ade80", borderRadius: "14px 4px 14px 14px", padding: "9px 13px", maxWidth: "70%", fontSize: 13, color: "#14532d", lineHeight: 1.6, wordBreak: "break-word" }}><RubyText text={msg.text} /></div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", textAlign: "right", marginTop: 3 }}>{msg.time}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${msg.color}22`, border: `2px solid ${msg.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{msg.icon}</div>
      <div style={{ maxWidth: "75%" }}>
        {showName && <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 3 }}>{msg.from}</div>}
        <div style={{ background: "rgba(255,255,255,.09)", borderRadius: "4px 14px 14px 14px", padding: "9px 13px", fontSize: 13, color: "rgba(255,255,255,.88)", lineHeight: 1.65 }}><RubyText text={msg.text} /></div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginTop: 3 }}>{msg.time}</div>
      </div>
    </div>
  );
}

function Ep5GroupChat({ messages, highlight = false }) {
  return (
    <div style={{ background: highlight ? "rgba(236,72,153,.06)" : "#0f172a", borderRadius: 18, overflow: "hidden", marginBottom: 14, border: `1px solid ${highlight ? "rgba(236,72,153,.25)" : "rgba(255,255,255,.08)"}`, boxShadow: "0 8px 32px rgba(0,0,0,.4)" }}>
      <div style={{ background: "#1e293b", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#ec4899,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👥</div>
        <div>
          <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>クラスLINEグループ</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>メンバー 32人</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 20 }}>⋯</div>
      </div>
      <div style={{ padding: "12px 12px 6px" }}>
        {messages.map((msg, i) => <GroupMsg key={i} msg={msg} showName={i === 0 || messages[i - 1]?.from !== msg.from} />)}
      </div>
    </div>
  );
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
      insight: "「{傷|きず}つくよ」と{伝|つた}えたのは**{正|ただ}しい{行動|こうどう}**です。すぐには{状況|じょうきょう}が{変|か}わらないかもしれないけれど、この{一言|ひとこと}が○○さんを{救|すく}うきっかけになります。「{止|と}めようとした{人|ひと}がいた」という{事実|じじつ}は、{被害者|ひがいしゃ}の{心|こころ}の{支|ささ}えになります。",
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
      insight: "「傷つくよ」と伝えたのは**正しい行動**です。すぐには状況が変わらないかもしれないけれど、この一言が○○さんを救うきっかけになります。「止めようとした人がいた」という事実は、被害者の心の支えになります。",
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
    { icon: "🗣️", title: "{大人|おとな}に{相談|そうだん}する", desc: "「チクり」ではなく「{助|たす}けを{求|もと}めること」。{先生|せんせい}・{保護者|ほごしゃ}・スクールカウンセラー。" },
    { icon: "🚪", title: "グループを{抜|ぬ}ける", desc: "いじめグループにいること{自体|じたい}がリスク。{抜|ぬ}けるのは{正当|せいとう}な{選択|せんたく}。" },
  ] : [
    { icon: "🤐", title: "悪口には乗らない", desc: "既読スルーではなく「それはちょっと」と一言添えるだけでも違う。" },
    { icon: "📱", title: "スクショして拡散しない", desc: "「ここだけの話」はすぐ広がる。受け取ったら止まる。" },
    { icon: "👂", title: "被害者に声をかける", desc: "「大丈夫？」の一言が、孤立感を大きく和らげる。" },
    { icon: "🗣️", title: "大人に相談する", desc: "「チクり」ではなく「助けを求めること」。先生・保護者・スクールカウンセラー。" },
    { icon: "🚪", title: "グループを抜ける", desc: "いじめグループにいること自体がリスク。抜けるのは正当な選択。" },
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
                { key: "c", label: "{止|と}めようとする", emoji: "🛑", sub: "「{傷|きず}つくよ」と{伝|つた}える", color: "rgba(74,222,128,.06)", border: "rgba(74,222,128,.3)", safe: true },
              ] : [
                { key: "a", label: "一緒に笑う・同意する", emoji: "😂", sub: "「わかる」と返信する", color: "rgba(220,38,38,.08)", border: "rgba(220,38,38,.3)" },
                { key: "b", label: "無視する（既読スルー）", emoji: "👁️", sub: "何も返信しない", color: "rgba(255,255,255,.04)", border: "rgba(255,255,255,.12)" },
                { key: "c", label: "止めようとする", emoji: "🛑", sub: "「傷つくよ」と伝える", color: "rgba(74,222,128,.06)", border: "rgba(74,222,128,.3)", safe: true },
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
              💡 <RubyText text={ageMode === "elementary" ? "{正解|せいかい}は「" : "正解は「"} /><strong style={{ color: "#4ade80" }}><RubyText text={ageMode === "elementary" ? "{止|と}めようとする" : "止めようとする"} /></strong><RubyText text={ageMode === "elementary" ? "」でした。{難|むずか}しくても、{一言|ひとこと}あるだけで{状況|じょうきょう}は{変|か}わります。" : "」でした。難しくても、一言あるだけで状況は変わります。"} />
            </div>
          )}

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
            { id: "a", label: "A", text: "{既読|きどく}スルーして{無視|むし}する" },
            { id: "b", label: "B", text: "「それ{傷|きず}つくよ」と{一言|ひとこと}{伝|つた}える、または{先生|せんせい}・{大人|おとな}に{相談|そうだん}する" },
            { id: "c", label: "C", text: "「わかる」と{共感|きょうかん}する{絵文字|えもじ}を{送|おく}る" },
          ] : [
            { id: "a", label: "A", text: "既読スルーして無視する" },
            { id: "b", label: "B", text: "「それ傷つくよ」と一言伝える、または先生・大人に相談する" },
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
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP5) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fdf2f8,#fce7f3)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="ネットいじめを{理解|りかい}するための{重要|じゅうよう}なことばをおぼえよう！🦉">ネットいじめを理解するための重要ワードを覚えよう！🦉</OwlSay>
        <KeywordPhase epKey="ep5" accentColor="#ec4899" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep5" accentColor="#ec4899" />
      </div>
    </div>
  );

  // ── Dialogue (EP5) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor={pink}
      bg="linear-gradient(180deg,#fdf2f8,#fce7f3)"
      epKey="ep5"
      questions={ageMode === "elementary" ? [
        {
          question: "グループLINEで{友達|ともだち}の{悪口|わるくち}が{流|なが}れてきた。「{既読|きどく}スルー」はいじめに{加担|かたん}していることになる？",
          childOptions: ["いじめていないから{問題|もんだい}ない", "{止|と}めなかったことで「{黙認|もくにん}した」と{同|おな}じになる", "{関係|かんけい}ない"],
          explanation: "{傍観者|ぼうかんしゃ}は「いじめを{止|と}めない」ことで、いじめを{続|つづ}けさせる{力|ちから}になってしまう。{統計|とうけい}でもいじめの70%{以上|いじょう}に{傍観者|ぼうかんしゃ}がいる。{一言|ひとこと}「それはどうかな」が{状況|じょうきょう}を{変|か}えられる。",
          talkTip: "「グループで{嫌|いや}な{思|おも}いをしたことはある？」と{聞|き}いてみましょう。",
        },
        {
          question: "もし{自分|じぶん}がグループから{外|はず}されたら、{誰|だれ}に{相談|そうだん}する？",
          childOptions: ["{誰|だれ}にも{言|い}わず{一人|ひとり}で{抱|かか}える", "まず{信頼|しんらい}できる{大人|おとな}（{家族|かぞく}・{先生|せんせい}）に{話|はな}す", "{仕返|しかえ}しをする"],
          explanation: "{一人|ひとり}で{抱|かか}えると{状況|じょうきょう}が{悪化|あっか}することが{多|おお}い。{信頼|しんらい}できる{大人|おとな}に{話|はな}すことで、{適切|てきせつ}なサポートが{受|う}けられる。「{言|い}っていい」「{助|たす}けを{求|もと}めていい」というメッセージが{大切|たいせつ}。",
          talkTip: "「もし{何|なに}かあったら{絶対|ぜったい}に{言|い}ってね」と{伝|つた}えましょう。",
        },
      ] : [
        {
          question: "グループLINEで友達の悪口が流れてきた。「既読スルー」はいじめに加担していることになる？",
          childOptions: ["いじめていないから問題ない", "止めなかったことで「黙認した」と同じになる", "関係ない"],
          explanation: "傍観者は「いじめを止めない」ことで、いじめを続けさせる力になってしまう。統計でもいじめの70%以上に傍観者がいる。一言「それはどうかな」が状況を変えられる。",
          talkTip: "「グループで嫌な思いをしたことはある？」と聞いてみましょう。",
        },
        {
          question: "もし自分がグループから外されたら、誰に相談する？",
          childOptions: ["誰にも言わず一人で抱える", "まず信頼できる大人（家族・先生）に話す", "仕返しをする"],
          explanation: "一人で抱えると状況が悪化することが多い。信頼できる大人に話すことで、適切なサポートが受けられる。「言っていい」「助けを求めていい」というメッセージが大切。",
          talkTip: "「もし何かあったら絶対に言ってね」と伝えましょう。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "「{傍観者|ぼうかんしゃ}にならない」ために{自分|じぶん}が{決|き}めたことを{書|か}こう" : "「傍観者にならない」ために自分が決めたことを書こう"}
      myWordsPlaceholder="例：グループで悪口が流れたら、一言「それはどうかな」と書く"
      onComplete={() => setPhase("complete")}
    />
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
          <button onClick={() => onComplete(3)}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${pink},${pinkDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 6 — 一度送ったら、消せない
// 自画撮り被害・画像拡散体験（グルーミング→被害経路）
// ─────────────────────────────────────────────

// グルーミング会話データ（段階的な信頼構築）
const GROOMING_STAGES = [
  {
    id: 0,
    label: "出会い",
    msgs: [
      { from: "kai", text: "はじめまして！さっきのバトルで対戦したカイです。めちゃくちゃうまかったです！", time: "20:14" },
      { from: "kai", text: "中1？同い年だ！どのくらいやってる？", time: "20:15" },
    ],
    owlMsg: "ゲームで知り合った相手。年齢・名前はわからない。「同い年」と言っているけど、本当かな？",
    owlMsgEl: "ゲームで{知|し}り{合|あ}った{相手|あいて}。{年齢|ねんれい}・{名前|なまえ}はわからない。「{同|おな}い{年|どし}」と{言|い}っているけど、{本当|ほんとう}かな？",
    choices: [
      { label: "普通に返信する", elLabel: "{普通|ふつう}に{返信|へんしん}する", emoji: "💬", next: 1 },
      { label: "無視する", elLabel: "{無視|むし}する", emoji: "🚫", safe: true, nextSafe: true },
    ],
  },
  {
    id: 1,
    label: "仲良くなる",
    elLabel: "{仲良|なかよ}くなる",
    msgs: [
      { from: "kai", text: "毎日やってる？一緒にプレイしよ！LINE教えてくれたら連絡できるし", time: "20:32" },
      { from: "kai", text: "俺のID：kai_game_0412 ね😊", time: "20:32" },
    ],
    owlMsg: "LINEへの誘導。「ゲームの中だけ」から「外のSNS」に移る瞬間。",
    owlMsgEl: "LINEへの{誘導|ゆうどう}。「ゲームの{中|なか}だけ」から「{外|そと}のSNS」に{移|うつ}るとき。",
    choices: [
      { label: "LINEを教える", elLabel: "LINEを{教|おし}える", emoji: "📱", next: 2 },
      { label: "ゲーム内でだけ話す", elLabel: "ゲーム{内|ない}でだけ{話|はな}す", emoji: "🎮", safe: true, nextSafe: true },
    ],
  },
  {
    id: 2,
    label: "信頼を積み上げる",
    elLabel: "{信頼|しんらい}を{積|つ}み{上|あ}げる",
    msgs: [
      { from: "kai", text: "毎日LINE嬉しい🙏 最近どんな感じ？学校とか", time: "21:05" },
      { from: "kai", text: "俺は部活きついけどゲームで発散してる笑", time: "21:06" },
      { from: "kai", text: "レアアイテム余ってるから送るよ！課金したやつ", time: "21:10" },
    ],
    owlMsg: "「プレゼント」で心理的な借りを作らせる手口。「もらったから」断りにくくなる。",
    owlMsgEl: "「プレゼント」で「もらったから{断|ことわ}れない」という{気持|きも}ちにさせる{手口|てぐち}。",
    choices: [
      { label: "ありがとうと受け取る", elLabel: "ありがとうと{受|う}け{取|と}る", emoji: "🎁", next: 3 },
      { label: "断る", elLabel: "{断|ことわ}る", emoji: "🚫", safe: true, nextSafe: true },
    ],
  },
  {
    id: 3,
    label: "要求のエスカレート",
    elLabel: "{要求|ようきゅう}のエスカレート",
    msgs: [
      { from: "kai", text: "ねえ、顔見てみたいな。どんな子かなって思って😊", time: "22:18" },
      { from: "kai", text: "俺も送るから！信用できる仲じゃん", time: "22:18" },
    ],
    owlMsg: "⚠️ ここが分岐点。「信用できる仲」という言葉で正当化している。",
    owlMsgEl: "⚠️ ここが{大切|たいせつ}な{場面|ばめん}。「{信用|しんよう}できる{仲|なか}」という{言葉|ことば}でいいわけしている。",
    dangerWarn: true,
    choices: [
      { label: "写真を送る", elLabel: "{写真|しゃしん}を{送|おく}る", emoji: "📸", next: "trap" },
      { label: "断る・ブロックする", elLabel: "{断|ことわ}る・ブロックする", emoji: "🛑", safe: true, nextSafe: true },
    ],
  },
];

// 送信後の展開
const AFTERMATH_MSGS = [
  { delay: 0, type: "normal", text: "ありがとう😊 やっぱりかわいい", elText: "ありがとう😊 やっぱりかわいい" },
  { delay: 3, type: "shift", text: "ねえ、もう1枚送って。今度は…", elText: "ねえ、もう1{枚|まい}{送|おく}って。{今度|こんど}は…" },
  { delay: 6, type: "threat", text: "送らないなら、さっきの写真をみんなに見せるけど", elText: "{送|おく}らないなら、さっきの{写真|しゃしん}をみんなに{見|み}せるけど" },
  { delay: 10, type: "threat", text: "学校名わかるし、クラスのグループに送れるよ。わかる？", elText: "{学校|がっこう}{名|めい}わかるし、クラスのグループに{送|おく}れるよ。わかる？" },
];

// 拡散シミュレーションデータ
const SPREAD_DATA = [
  { time: "0{分|ふん}{後|ご}", count: 1, label: "あなたが1{人|ひと}に{送|おく}った", plainTime: "0分後", plainLabel: "あなたが1人に送った" },
  { time: "10{分|ふん}{後|ご}", count: 8, label: "{相手|あいて}が{友人|ゆうじん}グループに{拡散|かくさん}", plainTime: "10分後", plainLabel: "相手が友人グループに拡散" },
  { time: "1{時間|じかん}{後|ご}", count: 47, label: "スクショが{別|べつ}のグループへ", plainTime: "1時間後", plainLabel: "スクショが別のグループへ" },
  { time: "{翌朝|よくあさ}", count: 312, label: "まとめサイトに{転載|てんさい}", plainTime: "翌朝", plainLabel: "まとめサイトに転載" },
  { time: "1{週間|しゅうかん}{後|ご}", count: "∞", label: "{削除|さくじょ}{不可能|ふかのう}。{検索|けんさく}にも{出|で}る", plainTime: "1週間後", plainLabel: "削除不可能。検索にも出る" },
];

// メッセージコンポーネント（EP6用）
function Ep6Msg({ msg, isMe = false }) {
  const rose = "#f43f5e";
  if (isMe) return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
      <div style={{ background: rose, borderRadius: "14px 4px 14px 14px", padding: "9px 13px", maxWidth: "72%", fontSize: 13, color: "#fff", lineHeight: 1.65 }}><RubyText text={msg.text} /></div>
    </div>
  );
  const bubbleStyle = msg.type === "threat"
    ? { background: "rgba(255,30,30,.18)", border: "1px solid rgba(255,30,30,.4)", color: "#fff", fontWeight: 700 }
    : msg.type === "shift"
    ? { background: "rgba(255,120,50,.12)", border: "1px solid rgba(255,120,50,.3)", color: "#ffcba4" }
    : { background: "rgba(255,255,255,.09)", color: "rgba(255,255,255,.88)" };
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(244,63,94,.2)", border: "1px solid rgba(244,63,94,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎮</div>
      <div style={{ background: "rgba(255,255,255,.09)", borderRadius: "4px 14px 14px 14px", padding: "9px 13px", maxWidth: "76%", fontSize: 13, lineHeight: 1.65, ...bubbleStyle }}><RubyText text={msg.text} /></div>
    </div>
  );
}

function Episode6({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  // intro→story→safe_end→trap→spread→debrief→stats→safety→dialogue→complete
  const [stageIdx, setStageIdx] = useState(0);
  const [msgStep, setMsgStep] = useState(0);
  const [afterIdx, setAfterIdx] = useState(0);
  const [spreadIdx, setSpreadIdx] = useState(0);
  const [safetyStep, setSafetyStep] = useState(0);
  const [showingAfter, setShowingAfter] = useState(false);
  const [allAfterDone, setAllAfterDone] = useState(false);

  const rose = "#f43f5e";
  const roseDark = "#be123c";

  const stage = GROOMING_STAGES[stageIdx];

  // Advance through aftermath messages with delays
  useEffect(() => {
    if (phase !== "trap" || allAfterDone) return;
    if (afterIdx >= AFTERMATH_MSGS.length) { setAllAfterDone(true); return; }
    const dm = AFTERMATH_MSGS[afterIdx];
    const t = setTimeout(() => setAfterIdx(i => i + 1), dm.delay * 1000 + (afterIdx === 0 ? 1500 : 0));
    return () => clearTimeout(t);
  }, [phase, afterIdx, allAfterDone]);

  const safetyCPs = ageMode === "elementary" ? [
    { icon: "🚫", title: "{最初|さいしょ}の1{枚|まい}を{絶対|ぜったい}に{送|おく}らない", desc: "「{信頼|しんらい}できる」と{感|かん}じても、{一度|いちど}{送|おく}った{画像|がぞう}は{完全|かんぜん}に{消|け}せない。{送|おく}る{前|まえ}の{一瞬|いっしゅん}の{判断|はんだん}が{全|すべ}てを{決|き}める。" },
    { icon: "📱", title: "ゲーム{内|ない}の{出会|であ}いはLINEに{移|うつ}さない", desc: "ゲーム→LINE→{電話|でんわ}と{段階的|だんかいてき}に{親密化|しんみつか}させるのが{典型的|てんけいてき}な{手口|てぐち}。{最初|さいしょ}のLINE{交換|こうかん}を{断|ことわ}る。" },
    { icon: "🎁", title: "プレゼントには{必|かなら}ず{理由|りゆう}がある", desc: "{課金|かきん}アイテムなどの「プレゼント」は{心理的|しんりてき}な{借|か}りを{作|つく}るため。もらったから{返|かえ}さないといけない、はない。" },
    { icon: "🗣️", title: "{送|おく}ってしまっても{相談|そうだん}できる", desc: "{送|おく}ってしまった{後|あと}でも「あなたのせいではない」。すぐに{相談|そうだん}することで{被害|ひがい}を{止|と}められる。" },
    { icon: "🔒", title: "ブロック・{通報|つうほう}は{正当|せいとう}な{権利|けんり}", desc: "{怪|あや}しいと{感|かん}じたら{迷|まよ}わずブロック・{通報|つうほう}。{相手|あいて}に{遠慮|えんりょ}する{必要|ひつよう}はゼロ。" },
  ] : [
    { icon: "🚫", title: "最初の1枚を絶対に送らない", desc: "「信頼できる」と感じても、一度送った画像は完全に消せない。送る前の一瞬の判断が全てを決める。" },
    { icon: "📱", title: "ゲーム内の出会いはLINEに移さない", desc: "ゲーム→LINE→電話と段階的に親密化させるのが典型的な手口。最初のLINE交換を断る。" },
    { icon: "🎁", title: "プレゼントには必ず理由がある", desc: "課金アイテムなどの「プレゼント」は心理的な借りを作るため。もらったから返さないといけない、はない。" },
    { icon: "🗣️", title: "送ってしまっても相談できる", desc: "送ってしまった後でも「あなたのせいではない」。すぐに相談することで被害を止められる。" },
    { icon: "🔒", title: "ブロック・通報は正当な権利", desc: "怪しいと感じたら迷わずブロック・通報。相手に遠慮する必要はゼロ。" },
  ];

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep6" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#1a0308,#0a0105)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(24)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: rose, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.25 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>📸</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: rose, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 06</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}><RubyText text={ageMode === "elementary" ? "{一度|いちど}{送|おく}ったら、" : "一度送ったら、"} /><br /><RubyText text={ageMode === "elementary" ? "{消|け}せない" : "消せない"} /></h1>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— <RubyText text={ageMode === "elementary" ? "{自画撮|じがど}り{被害|ひがい}・{画像|がぞう}{拡散|かくさん} {体験|たいけん}" : "自画撮り被害・画像拡散 体験"} /> —</p>

      <div style={{ background: "rgba(244,63,94,.08)", border: "1px solid rgba(244,63,94,.25)", borderRadius: 18, padding: "18px 20px", maxWidth: 320, color: "#ffe4e8", fontSize: 13, lineHeight: 1.9, marginBottom: 16 }}>
        <RubyText text={ageMode === "elementary" ? "ゲームで{知|し}り{合|あ}った「{同|おな}い{年|どし}の{友達|ともだち}」。" : "ゲームで知り合った「同い年の友達」。"} /><br /><RubyText text={ageMode === "elementary" ? "{最初|さいしょ}は{普通|ふつう}のやり{取|と}りだったのに——" : "最初は普通のやり取りだったのに——"} /><br /><br />
        <strong style={{ color: rose }}><RubyText text={ageMode === "elementary" ? "{写真|しゃしん}を{一度|いちど}でも{送|おく}ってしまったら、{何|なに}が{起|お}きる？" : "写真を一度でも送ってしまったら、何が起きる？"} /></strong>
      </div>

      <div style={{ background: "rgba(255,180,0,.08)", border: "1px solid rgba(255,180,0,.25)", borderRadius: 14, padding: "13px 18px", maxWidth: 320, marginBottom: 16, fontSize: 12, color: "#fef3c7", lineHeight: 1.75, textAlign: "center" }}>
        ⚠️ <RubyText text={ageMode === "elementary" ? "{保護者|ほごしゃ}の{方|かた}へ：このエピソードは{性的|せいてき}{画像|がぞう}{要求|ようきゅう}の{被害|ひがい}{経路|けいろ}を{教育|きょういく}{目的|もくてき}で{描写|びょうしゃ}します。" : "保護者の方へ：このエピソードは性的画像要求の被害経路を教育目的で描写します。"} /><br /><RubyText text={ageMode === "elementary" ? "お{子|こ}さんと{一緒|いっしょ}に{体験|たいけん}することをお{勧|すす}めします。" : "お子さんと一緒に体験することをお勧めします。"} />
      </div>

      <OwlSay mood="worried" e="{実際|じっさい}の{被害|ひがい}の70%は「{信頼|しんらい}できると{思|おも}った{相手|あいて}」から{始|はじ}まっているんだよ🦉">実際の被害の70%は「信頼できると思った相手」から始まっているんだよ🦉</OwlSay>
      <button onClick={() => setPhase("story")} style={{ background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${rose}44`, marginTop: 8 }}>体験スタート</button>
    </div>
    </EpisodeShell>
  );

  // ── Story (grooming stages) ──
  if (phase === "story") {
    const currentMsgs = stage.msgs.slice(0, msgStep + 1);
    const allMsgsShown = msgStep >= stage.msgs.length - 1;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a14,#1a0308)", padding: "16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          {/* Stage header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${rose}18`, borderRadius: 12, padding: "9px 14px", marginBottom: 14, border: `1px solid ${rose}33` }}>
            <div style={{ display: "flex", gap: 4 }}>
              {GROOMING_STAGES.map((_, i) => (
                <div key={i} style={{ width: 20, height: 4, borderRadius: 2, background: i <= stageIdx ? rose : "rgba(255,255,255,.1)" }} />
              ))}
            </div>
            <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: rose, letterSpacing: ".08em", marginLeft: 4 }}>STAGE {stageIdx + 1}：<RubyText text={ageMode === "elementary" ? (stage.elLabel || stage.label) : stage.label} /></span>
          </div>

          <OwlSay mood={stage.dangerWarn ? "worried" : "happy"} e={stage.owlMsgEl}>
            {stage.owlMsg}
          </OwlSay>

          {/* Chat window */}
          <div style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", marginBottom: 14, border: `1px solid ${rose}22`, boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
            <div style={{ background: "#1e0a14", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${rose}18` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${rose}22`, border: `2px solid ${rose}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎮</div>
              <div><div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>カイ</div><div style={{ fontSize: 10, color: rose, animation: "blink 2.5s infinite" }}>● オンライン</div></div>
            </div>
            <div style={{ padding: "12px 12px 6px" }}>
              {currentMsgs.map((m, i) => <Ep6Msg key={i} msg={m} />)}
            </div>
          </div>

          {/* Warning banner at danger stage */}
          {stage.dangerWarn && (
            <div style={{ background: "rgba(255,30,30,.1)", border: "1px solid rgba(255,30,30,.4)", borderRadius: 12, padding: "12px 14px", marginBottom: 12, fontSize: 12, color: "#fca5a5", fontWeight: 700, textAlign: "center", animation: "redFlash 2s infinite" }}>
              🚨 <RubyText text={ageMode === "elementary" ? "ここから{先|さき}は{非常|ひじょう}に{危険|きけん}な{領域|りょういき}です" : "ここから先は非常に危険な領域です"} />
            </div>
          )}

          {/* Show next message or choices */}
          {!allMsgsShown ? (
            <button onClick={() => setMsgStep(s => s + 1)}
              style={{ width: "100%", padding: 13, background: `${rose}18`, border: `1px solid ${rose}33`, borderRadius: 14, color: rose, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              続きを見る →
            </button>
          ) : (
            <div style={{ animation: "slideUp .4s ease" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 12 }}><RubyText text={ageMode === "elementary" ? "あなたはどうする？" : "あなたはどうする？"} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stage.choices.map((ch, i) => (
                  <button key={i} onClick={() => {
                    if (ch.nextSafe) { setPhase("safe_end"); return; }
                    if (ch.next === "trap") { setPhase("trap"); return; }
                    setStageIdx(ch.next);
                    setMsgStep(0);
                  }}
                    style={{ width: "100%", padding: "14px 16px", background: ch.safe ? "rgba(74,222,128,.08)" : "rgba(255,255,255,.04)", border: `1.5px solid ${ch.safe ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: ch.safe ? "#86efac" : "rgba(255,255,255,.8)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{ch.emoji}</span>
                    <span><RubyText text={ageMode === "elementary" ? (ch.elLabel || ch.label) : ch.label} /></span>
                    {ch.safe && <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ade80" }}>✓ <RubyText text={ageMode === "elementary" ? "{正|ただ}しい{判断|はんだん}" : "正しい判断"} /></span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Safe End ──
  if (phase === "safe_end") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 60, marginBottom: 10, animation: "celebrate 1s infinite" }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#166534", margin: "0 0 6px" }}><RubyText text={ageMode === "elementary" ? "{正|ただ}しく{断|ことわ}れました！" : "正しく断れました！"} /></h2>
          <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? "その「{断|ことわ}る」という{判断|はんだん}が、あなたを{守|まも}った。" : "その「断る」という判断が、あなたを守った。"} /></p>
        </div>
        <OwlSay mood="happy" e="「なんか{変|へん}だな」という{感覚|かんかく}を{信|しん}じて{正解|せいかい}！その{直感|ちょっかん}はとても{大切|たいせつ}だよ🦉">「なんか変だな」という感覚を信じて正解！その直感はとても大切だよ🦉</OwlSay>

        <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", border: "2px solid #86efac", marginBottom: 14, boxShadow: "0 6px 20px rgba(22,163,74,.12)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: "#166534", margin: "0 0 12px" }}>✅ <RubyText text={ageMode === "elementary" ? "あなたが{正|ただ}しかった{理由|りゆう}" : "あなたが正しかった理由"} /></h3>
          {stageIdx === 0
            ? (ageMode === "elementary" ? [
               ["🎮", "{知|し}らない{相手|あいて}はゲームの{中|なか}だけにとどめる", "{最初|さいしょ}に{友達|ともだち}{認定|にんてい}する{必要|ひつよう}はない"],
               ["👤", "「{同|おな}い{年|どし}」は{証明|しょうめい}できない", "ネットの{相手|あいて}は{実際|じっさい}に{会|あ}うまで{身元|みもと}{不明|ふめい}"],
              ] : [
               ["🎮", "知らない相手はゲームの中だけにとどめる", "最初に友達認定する必要はない"],
               ["👤", "「同い年」は証明できない", "ネットの相手は実際に会うまで身元不明"],
              ]).map(([ic, t, d], i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}><RubyText text={t} /></div><div style={{ fontSize: 11, marginTop: 2, color: "#15803d" }}><RubyText text={d} /></div></div>
                </div>
              ))
            : (ageMode === "elementary" ? [
               ["🛡️", "「{信頼|しんらい}できる」と{感|かん}じても{写真|しゃしん}は{送|おく}らない", "{一度|いちど}{送|おく}ったら{取|と}り{消|け}せない"],
               ["🚫", "{断|ことわ}ることは{失礼|しつれい}じゃない", "むしろ{自分|じぶん}を{守|まも}る{正当|せいとう}な{権利|けんり}"],
               ["👨‍👩‍👧", "{不安|ふあん}なら{家|いえ}の{人|ひと}に{相談|そうだん}する", "「おかしいな」は{大事|だいじ}なサイン"],
              ] : [
               ["🛡️", "「信頼できる」と感じても写真は送らない", "一度送ったら取り消せない"],
               ["🚫", "断ることは失礼じゃない", "むしろ自分を守る正当な権利"],
               ["👨‍👩‍👧", "不安なら家の人に相談する", "「おかしいな」は大事なサイン"],
              ]).map(([ic, t, d], i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{ic}</div>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}><RubyText text={t} /></div><div style={{ fontSize: 11, marginTop: 2, color: "#15803d" }}><RubyText text={d} /></div></div>
                </div>
              ))
          }
        </div>
        <button onClick={() => setPhase("stats")}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "{実際|じっさい}の{被害|ひがい}データを{見|み}る →" : "実際の被害データを見る →"} />
        </button>
      </div>
    </div>
  );

  // ── Trap ──
  if (phase === "trap") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0308,#000)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(244,63,94,.02) 2px,rgba(244,63,94,.02) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ background: "rgba(244,63,94,.1)", border: "1px solid rgba(244,63,94,.4)", borderRadius: 12, padding: "9px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, animation: "redFlash 2s infinite" }}>
          <span style={{ animation: "heartbeat 1s infinite", fontSize: 16 }}>🚨</span>
          <span style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: rose }}>送信してしまった後の世界</span>
        </div>

        <div style={{ background: "#0d1117", borderRadius: 18, overflow: "hidden", marginBottom: 14, border: "1px solid rgba(244,63,94,.25)" }}>
          <div style={{ background: "#1e0a14", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(244,63,94,.15)" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${rose}22`, border: `2px solid ${rose}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎮</div>
            <div><div style={{ fontSize: 13, color: "#ffaaaa", fontWeight: 700 }}>カイ（？）</div><div style={{ fontSize: 10, color: rose, animation: "blink 1.5s infinite" }}>トーンが変わった</div></div>
          </div>
          <div style={{ padding: "12px 12px 8px" }}>
            {/* My message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
              <div style={{ background: rose, borderRadius: "14px 4px 14px 14px", padding: "9px 13px", fontSize: 13, color: "#fff" }}>（写真を送った）</div>
            </div>
            {/* Aftermath messages */}
            {AFTERMATH_MSGS.slice(0, afterIdx).map((m, i) => (
              <div key={i} style={{ animation: "slideUp .4s ease" }}>
                <Ep6Msg msg={ageMode === "elementary" ? { ...m, text: m.elText } : m} />
              </div>
            ))}
            {afterIdx < AFTERMATH_MSGS.length && (
              <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "6px 0" }}>
                {[0, .2, .4].map((d, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: rose, animation: `blink 1s ${d}s infinite` }} />)}
              </div>
            )}
          </div>
        </div>

        {allAfterDone && (
          <div style={{ animation: "slideUp .5s ease" }}>
            <div style={{ background: "rgba(244,63,94,.1)", border: "1px solid rgba(244,63,94,.4)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fca5a5", marginBottom: 6 }}><RubyText text={ageMode === "elementary" ? "{罠|わな}にかかってしまいました" : "罠にかかってしまいました"} /></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.75 }}>
                <RubyText text={ageMode === "elementary" ? "{送|おく}った{瞬間|しゅんかん}から、{相手|あいて}に{主導権|しゅどうけん}が{移|うつ}りました。" : "送った瞬間から、相手に主導権が移りました。"} /><br />
                <RubyText text={ageMode === "elementary" ? "「{消|け}して」と{頼|たの}んでも、{消|け}えません。" : "「消して」と頼んでも、消えません。"} />
              </div>
            </div>
            <button onClick={() => setPhase("spread")}
              style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
              <RubyText text={ageMode === "elementary" ? "{画像|がぞう}はどこまで{広|ひろ}がる？ →" : "画像はどこまで広がる？ →"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Spread simulation ──
  if (phase === "spread") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0308,#0a0105)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📡</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "{画像|がぞう}の{拡散|かくさん}シミュレーション" : "画像の拡散シミュレーション"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 6, lineHeight: 1.6 }}><RubyText text={ageMode === "elementary" ? "1{枚|まい}の{写真|しゃしん}が、どこまで{広|ひろ}がるか" : "1枚の写真が、どこまで広がるか"} /></p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {SPREAD_DATA.slice(0, spreadIdx + 1).map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", animation: "slideUp .3s ease" }}>
              <div style={{ width: 70, flexShrink: 0, fontSize: 11, color: "rgba(255,255,255,.4)", fontFamily: "'DotGothic16',monospace" }}><RubyText text={ageMode === "elementary" ? d.time : d.plainTime} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: i === 4 ? "100%" : `${Math.min((typeof d.count === "number" ? d.count : 312) / 312 * 100, 100)}%`, background: i >= 3 ? rose : i >= 2 ? "#f97316" : `${rose}80`, borderRadius: 4, transition: "width .8s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: i >= 3 ? "#fca5a5" : "rgba(255,255,255,.55)" }}>
                  {typeof d.count === "number" ? <><RubyText text={ageMode === "elementary" ? `${d.count}{人|にん}` : `${d.count}人`} /></> : d.count} — <RubyText text={ageMode === "elementary" ? d.label : d.plainLabel} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {spreadIdx < SPREAD_DATA.length - 1 ? (
          <button onClick={() => setSpreadIdx(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(244,63,94,.12)", border: "1px solid rgba(244,63,94,.3)", borderRadius: 14, color: rose, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            続きを見る →
          </button>
        ) : (
          <button onClick={() => setPhase("stats")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
            実際の被害データを見る →
          </button>
        )}
      </div>
    </div>
  );

  // ── Stats / Real data ──
  if (phase === "stats") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a14,#1a0308)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "{自画撮|じがど}り{被害|ひがい}の{現実|げんじつ}" : "自画撮り被害の現実"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}><RubyText text={ageMode === "elementary" ? "{警察庁|けいさつちょう}・{内閣府|ないかくふ}{調査|ちょうさ}データ（2024{年|ねん}）" : "警察庁・内閣府調査データ（2024年）"} /></p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {(ageMode === "elementary" ? [
            { num: "70%", desc: "の{被害者|ひがいしゃ}が「{信頼|しんらい}できると{思|おも}った{相手|あいて}」から{被害|ひがい}を{受|う}けた" },
            { num: "{中学生|ちゅうがくせい}", desc: "が{最多|さいた}{被害層|ひがいそう}。{被害者|ひがいしゃ}の{平均|へいきん}{年齢|ねんれい}は{下|さ}がり{続|つづ}けている" },
            { num: "1/3", desc: "は「ゲームで{知|し}り{合|あ}った{相手|あいて}」が{加害者|かがいしゃ}" },
            { num: "9{割|わり}", desc: "が「{送|おく}らなければよかった」と{後悔|こうかい}" },
          ] : [
            { num: "70%", desc: "の被害者が「信頼できると思った相手」から被害を受けた" },
            { num: "中学生", desc: "が最多被害層。被害者の平均年齢は下がり続けている" },
            { num: "1/3", desc: "は「ゲームで知り合った相手」が加害者" },
            { num: "9割", desc: "が「送らなければよかった」と後悔" },
          ]).map((s, i) => (
            <div key={i} style={{ background: `${rose}0a`, border: `1px solid ${rose}22`, borderRadius: 14, padding: "14px 12px", textAlign: "center", animation: `slideUp .4s ${i * .1}s both ease` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: rose, fontFamily: "'DotGothic16',monospace", marginBottom: 6 }}><RubyText text={s.num} /></div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", lineHeight: 1.6 }}><RubyText text={s.desc} /></div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: rose, marginBottom: 8 }}>⚠️ <RubyText text={ageMode === "elementary" ? "{被害者|ひがいしゃ}を{責|せ}めないで" : "被害者を責めないで"} /></div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.65)", lineHeight: 1.8, margin: 0 }}>
            <RubyText text={ageMode === "elementary" ? "{断|ことわ}れなかったのは" : "断れなかったのは"} /><strong style={{ color: "#fff" }}><RubyText text={ageMode === "elementary" ? "{心理的|しんりてき}な{罠|わな}" : "心理的な罠"} /></strong><RubyText text={ageMode === "elementary" ? "にはまったから。{加害者|かがいしゃ}は{時間|じかん}をかけて{信頼|しんらい}{関係|かんけい}を{作|つく}り、{断|ことわ}りにくい{状況|じょうきょう}を{意図的|いとてき}に{作|つく}り{出|だ}す。{被害者|ひがいしゃ}に{落|お}ち{度|ど}はありません。" : "にはまったから。加害者は時間をかけて信頼関係を作り、断りにくい状況を意図的に作り出す。被害者に落ち度はありません。"} />
          </p>
        </div>

        <div style={{ background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", marginBottom: 8 }}>📞 <RubyText text={ageMode === "elementary" ? "{送|おく}ってしまったら、すぐ{相談|そうだん}を" : "送ってしまったら、すぐ相談を"} /></div>
          {(ageMode === "elementary" ? [
            ["{子|こ}どもの{人権|じんけん}110{番|ばん}", "0120-007-110（{無料|むりょう}）"],
            ["{警察|けいさつ}{相談|そうだん}{専用|せんよう}{電話|でんわ}", "#9110"],
            ["デジタル{性|せい}{暴力|ぼうりょく}ホットライン", "0120-437-104"],
          ] : [
            ["子どもの人権110番", "0120-007-110（無料）"],
            ["警察相談専用電話", "#9110"],
            ["デジタル性暴力ホットライン", "0120-437-104"],
          ]).map(([n, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}><RubyText text={n} /></span>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#4ade80" }}><RubyText text={v} /></span>
            </div>
          ))}
        </div>

        <button onClick={() => setPhase("safety")}
          style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          身を守る方法を学ぶ →
        </button>
      </div>
    </div>
  );

  // ── Safety checkpoints ──
  if (phase === "safety") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0a14,#1a0308)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay e="{難|むずか}しい{状況|じょうきょう}だからこそ、あらかじめ{知|し}っておくことが{大切|たいせつ}だよ🦉">難しい状況だからこそ、あらかじめ知っておくことが大切だよ🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {safetyCPs.slice(0, safetyStep + 1).map((s, i) => (
            <div key={i} style={{ background: `${rose}08`, border: `1px solid ${rose}20`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${rose}15`, border: `1px solid ${rose}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#ffe4e8", marginBottom: 4 }}>{i + 1}. <RubyText text={s.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}><RubyText text={s.desc} /></div>
              </div>
            </div>
          ))}
        </div>
        {safetyStep < safetyCPs.length - 1 ? (
          <button onClick={() => setSafetyStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${rose}18`, border: `1px solid ${rose}33`, borderRadius: 14, color: rose, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のポイント →" : "次のポイント →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解|りかい}度チェック →" : "理解度チェック →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Quiz (EP6) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0308,#0f0205)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? rose : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ🦉">正解するまで次に進めないよ🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "ゲームで{知|し}り{合|あ}った{相手|あいて}から「{顔|かお}{写真|しゃしん}を{送|おく}って」と{言|い}われた。{正|ただ}しい{対応|たいおう}は？" : "ゲームで知り合った相手から「顔写真を送って」と言われた。正しい対応は？"}
          choices={ageMode === "elementary" ? [
            { id: "a", label: "A", text: "{信頼|しんらい}できそうだから1{枚|まい}だけ{送|おく}る" },
            { id: "b", label: "B", text: "{断|ことわ}る。{理由|りゆう}を{説明|せつめい}する{必要|ひつよう}はない" },
            { id: "c", label: "C", text: "{顔|かお}が{写|うつ}らない{写真|しゃしん}なら{大丈夫|だいじょうぶ}" },
          ] : [
            { id: "a", label: "A", text: "信頼できそうだから1枚だけ送る" },
            { id: "b", label: "B", text: "断る。理由を説明する必要はない" },
            { id: "c", label: "C", text: "顔が写らない写真なら大丈夫" },
          ]}
          correctId="b"
          onPass={() => setPhase("comparison")}
          accentColor={rose}
        />
      </div>
    </div>
  );

  // ── Comparison (EP6) ──
  if (phase === "comparison") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0308,#0f0205)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? rose : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="scared" e="もし{最悪|さいあく}の{選択|せんたく}をしていたら{何|なに}が{起|お}きていたかみてみよう🦉">もし最悪の選択をしていたら何が起きていたか見てみよう🦉</OwlSay>
        <ChoiceComparison
          myChoice={ageMode === "elementary" ? "{断|ことわ}った・{送|おく}らなかった" : "断った・送らなかった"}
          myResult={ageMode === "elementary" ? "{被害|ひがい}ゼロ。{勇気|ゆうき}ある{判断|はんだん}。{怪|あや}しいと{感|かん}じた{直感|ちょっかん}は{正|ただ}しかった" : "被害ゼロ。勇気ある判断。怪しいと感じた直感は正しかった"}
          worstChoice={ageMode === "elementary" ? "1{枚|まい}だけのつもりで{送|おく}った{場合|ばあい}" : "1枚だけのつもりで送った場合"}
          worstResult={ageMode === "elementary" ? "{脅迫|きょうはく}に{変|か}わり「もっと{送|おく}れ」「{拡散|かくさん}するぞ」と{言|い}われる。{送|おく}った{瞬間|しゅんかん}からコントロールを{失|うしな}う" : "脅迫に変わり「もっと送れ」「拡散するぞ」と言われる。送った瞬間からコントロールを失う"}
          accentColor={rose}
        />
        <button onClick={() => setPhase("homework")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          次へ →
        </button>
      </div>
    </div>
  );

  // ── Homework (EP6) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1a0308,#0f0205)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? rose : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor={rose}
          tasks={ageMode === "elementary" ? [
            { title: "ゲームアプリのDM{設定|せってい}を{確認|かくにん}する", desc: "{知|し}らない{人|ひと}からのメッセージを{受|う}け{取|と}らない{設定|せってい}に" },
            { title: "「デジタル{性|せい}{暴力|ぼうりょく}ホットライン」を{覚|おぼ}える", desc: "0120-437-104（{無料|むりょう}）{送|おく}ってしまっても{相談|そうだん}できる" },
            { title: "おうちの{人|ひと}と「{送|おく}ってしまっても{言|い}える」と{約束|やくそく}する", desc: "{責|せ}めない・{一緒|いっしょ}に{対処|たいしょ}する、という{信頼|しんらい}{関係|かんけい}を{作|つく}ろう" },
          ] : [
            { title: "ゲームアプリのDM設定を確認する", desc: "知らない人からのメッセージを受け取らない設定に" },
            { title: "「デジタル性暴力ホットライン」を覚える", desc: "0120-437-104（無料）送ってしまっても相談できる" },
            { title: "おうちの人と「送ってしまっても言える」と約束する", desc: "責めない・一緒に対処する、という信頼関係を作ろう" },
          ]}
        />
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "キーワードを{覚|おぼ}える 📖 →" : "キーワードを覚える 📖 →"} />
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP6) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#fff1f2,#ffe4e8)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="worried" e="このおはなしの{言葉|ことば}はとくに{大切|たいせつ}。ニュースでもよく{出|で}てくるよ🦉">このエピソードの言葉は特に大切。ニュースでも頻繁に出てくるよ🦉</OwlSay>
        <KeywordPhase epKey="ep6" accentColor="#f43f5e" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep6" accentColor="#f43f5e" />
      </div>
    </div>
  );

  // ── Dialogue (EP6) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor={rose}
      bg="linear-gradient(180deg,#fff1f2,#ffe4e8)"
      epKey="ep6"
      questions={ageMode === "elementary" ? [
        {
          question: "ゲームで{知|し}り{合|あ}った{相手|あいて}に「{顔|かお}{写真|しゃしん}を{送|おく}って」と{言|い}われた。なぜ{危険|きけん}？",
          childOptions: ["{仲|なか}の{良|い}い{友達|ともだち}だから{問題|もんだい}ない", "{一度|いちど}{送|おく}った{写真|しゃしん}は{取|と}り{消|け}せず、{脅迫|きょうはく}の{材料|ざいりょう}にされる{可能性|かのうせい}がある", "{写真|しゃしん}1{枚|まい}なら{大丈夫|だいじょうぶ}"],
          explanation: "{送|おく}った{瞬間|しゅんかん}からコントロールを{失|うしな}う。「もっと{送|おく}らないとバラまく」という{脅迫|きょうはく}に{変|か}わる{典型的|てんけいてき}な{手口|てぐち}。どんな{理由|りゆう}があっても{断|ことわ}っていい。",
          talkTip: "「もし{困|こま}ったら{絶対|ぜったい}に{怒|おこ}らないから{話|はな}してね」と{伝|つた}えることが一番{大切|たいせつ}です。",
        },
        {
          question: "（{保護者|ほごしゃ}の{方|かた}へ）もし{子|こ}どもが「{送|おく}ってしまった」と{告白|こくはく}してきたら、{最初|さいしょ}にすることは？",
          childOptions: ["なぜそんなことをしたか{問|と}い{詰|つ}める", "{責|せ}めずに「{話|はな}してくれてありがとう」と{受|う}け{止|と}め、{一緒|いっしょ}に{対処法|たいしょほう}を{考|かんが}える", "すぐ{学校|がっこう}に{連絡|れんらく}する"],
          explanation: "{責|せ}めると「{次|つぎ}から{言|い}えない」{関係|かんけい}になってしまう。まず{受|う}け{止|と}めて、その{後|あと}デジタル{性|せい}{暴力|ぼうりょく}ホットライン（0120-437-104）に{相談|そうだん}。{被害者|ひがいしゃ}に{落|お}ち{度|ど}はない。",
          talkTip: "「{送|おく}ってしまっても{相談|そうだん}できる」という{信頼|しんらい}{関係|かんけい}が{最大|さいだい}の{防御|ぼうぎょ}です。",
        },
      ] : [
        {
          question: "ゲームで知り合った相手に「顔写真を送って」と言われた。なぜ危険？",
          childOptions: ["仲の良い友達だから問題ない", "一度送った写真は取り消せず、脅迫の材料にされる可能性がある", "写真一枚なら大丈夫"],
          explanation: "送った瞬間からコントロールを失う。「もっと送らないとバラまく」という脅迫に変わる典型的な手口。どんな理由があっても断っていい。",
          talkTip: "「もし困ったら絶対に怒らないから話してね」と伝えることが一番大切です。",
        },
        {
          question: "（保護者の方へ）もし子どもが「送ってしまった」と告白してきたら、最初にすることは？",
          childOptions: ["なぜそんなことをしたか問い詰める", "責めずに「話してくれてありがとう」と受け止め、一緒に対処法を考える", "すぐ学校に連絡する"],
          explanation: "責めると「次から言えない」関係になってしまう。まず受け止めて、その後デジタル性暴力ホットライン（0120-437-104）に相談。被害者に落ち度はない。",
          talkTip: "「送ってしまっても相談できる」という信頼関係が最大の防御です。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "{今日|きょう}一番「{怖|こわ}い」と{感|かん}じたことを{自分|じぶん}の{言葉|ことば}で{書|か}いてみよう" : "今日一番「怖い」と感じたことを自分の言葉で書いてみよう"}
      myWordsPlaceholder="例：写真を送った瞬間から取り戻せないということ"
      onComplete={() => setPhase("complete")}
    />
  );

  // ── Complete ──
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
            <RubyText text={ageMode === "elementary" ? `あなたは「マモル」{第|だい}6{話|わ}` : `あなたは「マモル」第6話`} /><br /><strong style={{ color: "#881337", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "{一度|いちど}{送|おく}ったら、{消|け}せない" : "一度送ったら、消せない"} /></strong><br /><RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${rose}33,#fecdd3)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: roseDark, marginBottom: 3 }}>EPISODE 06 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#881337", fontWeight: 900 }}>📸 <RubyText text={ageMode === "elementary" ? "{画像|がぞう}{安全|あんぜん}マスター" : "画像安全マスター"} /> 📸</div>
          </div>
          <div style={{ fontSize: 10, color: rose, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP6 クリア！", text: "自画撮り被害の経路と対策を学んだ！SNSリテラシーアプリ「マモル」📸" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${rose}`, borderRadius: 14, color: roseDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => onComplete(3)}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${rose},${roseDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ██ EPISODE 7 — あなたの情報が今、盗まれた
// フィッシング詐欺リアルタイム体験
// SMS着信→偽サイト→入力→被害の流れを完全再現
// ─────────────────────────────────────────────

// 偽サイトのシナリオパターン（複数から1つランダム選択）
const PHISHING_SCENARIOS = [
  {
    id: "amazon",
    smsSender: "Amazon",
    smsText: "【Amazon】お客様のアカウントに不審なアクセスがありました。24時間以内にご確認いただけない場合、アカウントを停止いたします。→ https://amaz0n-secure.account-verify.jp",
    siteName: "Amazon",
    siteIcon: "📦",
    siteBg: "#131921",
    siteAccent: "#ff9900",
    siteHeaderBg: "#131921",
    fakeDomain: "amaz0n-secure.account-verify.jp",
    realDomain: "amazon.co.jp",
    emailLabel: "メールアドレスまたは携帯電話番号",
    passLabel: "パスワード",
    submitLabel: "サインイン",
    siteLogoText: "amazon",
    dangerPoints: [
      { x: "50%", emoji: "🔴", label: "偽ドメイン", elLabel: "{偽|にせ}ドメイン", desc: "「amaz0n」はゼロ（0）。本物は「amazon.co.jp」のみ。", elDesc: "「amaz0n」はゼロ（0）。{本物|ほんもの}は「amazon.co.jp」のみ。" },
      { x: "50%", emoji: "🔒", label: "鍵マークなし", elLabel: "{鍵|かぎ}マークなし", desc: "本物のAmazonは常にHTTPS（鍵マーク）。アドレスバーを必ず確認。", elDesc: "{本物|ほんもの}のAmazonは{常|つね}にHTTPS（{鍵|かぎ}マーク）。アドレスバーを{必|かなら}ず{確認|かくにん}。" },
    ],
  },
  {
    id: "paypay",
    smsSender: "PayPay",
    smsText: "【PayPay】残高に不審な利用が確認されました。アカウントが一時停止されています。下記URLより本人確認を完了してください。https://paypay-support.user-verify.net",
    siteName: "PayPay",
    siteIcon: "💳",
    siteBg: "#ff0033",
    siteAccent: "#fff",
    siteHeaderBg: "#ff0033",
    fakeDomain: "paypay-support.user-verify.net",
    realDomain: "paypay.ne.jp",
    emailLabel: "メールアドレス / 電話番号",
    passLabel: "パスワード",
    submitLabel: "ログイン",
    siteLogoText: "PayPay",
    dangerPoints: [
      { x: "50%", emoji: "🔴", label: "偽ドメイン", elLabel: "{偽|にせ}ドメイン", desc: "「paypay-support.user-verify.net」は無関係のドメイン。本物は「paypay.ne.jp」のみ。", elDesc: "「paypay-support.user-verify.net」は{無関係|むかんけい}のドメイン。{本物|ほんもの}は「paypay.ne.jp」のみ。" },
      { x: "50%", emoji: "⚠️", label: "「一時停止」で焦らせる", elLabel: "「{一時停止|いちじていし}」で{焦|あせ}らせる", desc: "「停止」「24時間以内」は焦りを誘う常套句。公式アプリで直接確認を。", elDesc: "「{停止|ていし}」「24{時間|じかん}{以内|いない}」は{焦|あせ}りを{誘|さそ}う{常套句|じょうとうく}。{公式|こうしき}アプリで{直接|ちょくせつ}{確認|かくにん}を。" },
    ],
  },
  {
    id: "line",
    smsSender: "LINE",
    smsText: "【LINE】お使いのアカウントが別のデバイスからログインされました。心当たりのない場合は今すぐパスワードを変更してください。https://line-account-jp.security-check.com",
    siteName: "LINE",
    siteIcon: "💬",
    siteBg: "#00b900",
    siteAccent: "#fff",
    siteHeaderBg: "#00b900",
    fakeDomain: "line-account-jp.security-check.com",
    realDomain: "line.me",
    emailLabel: "メールアドレス / 電話番号",
    passLabel: "パスワード",
    submitLabel: "ログイン",
    siteLogoText: "LINE",
    dangerPoints: [
      { x: "50%", emoji: "🔴", label: "偽ドメイン", elLabel: "{偽|にせ}ドメイン", desc: "「security-check.com」は無関係のドメイン。本物のLINEは「line.me」のみ。", elDesc: "「security-check.com」は{無関係|むかんけい}のドメイン。{本物|ほんもの}のLINEは「line.me」のみ。" },
      { x: "50%", emoji: "⚠️", label: "SMSからのリンクは要注意", elLabel: "SMSからのリンクは{要注意|ようちゅうい}", desc: "LINEの公式通知はアプリ内通知で来る。SMSのURLは踏まない。", elDesc: "LINEの{公式|こうしき}{通知|つうち}はアプリ{内|ない}{通知|つうち}で{来|く}る。SMSのURLは{踏|ふ}まない。" },
    ],
  },
];

// URLバー（偽サイト用）
function FakeUrlBar({ domain, isReal = false }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 14 }}>{isReal ? "🔒" : "⚠️"}</span>
      <div style={{ flex: 1, background: "#2a2a2a", borderRadius: 6, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 10, color: isReal ? "#4ade80" : "#fca5a5", fontFamily: "'Share Tech Mono',monospace", letterSpacing: ".02em" }}>
          {isReal ? "https://" : "http://"}
        </span>
        <span style={{ fontSize: 11, color: isReal ? "#fff" : "#fca5a5", fontFamily: "'Share Tech Mono',monospace", fontWeight: isReal ? 400 : 700 }}>
          {domain}
        </span>
      </div>
      <span style={{ fontSize: 16 }}>⋯</span>
    </div>
  );
}

// 偽サイト UI — Amazon風
function FakeSiteAmazon({ sc, email, setEmail, password, setPassword, onSubmit }) {
  return (
    <div style={{ background: sc.siteBg, minHeight: "100%", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: sc.siteHeaderBg, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #3d3d3d" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: sc.siteAccent, fontFamily: "Arial Black, sans-serif", letterSpacing: "-1px" }}>
          amazon
        </div>
        <div style={{ fontSize: 11, color: "#ccc" }}>🇯🇵 日本語</div>
      </div>
      {/* Login box */}
      <div style={{ padding: "24px 20px", maxWidth: 350, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 6, padding: "20px 20px", border: "1px solid #888" }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 18px", color: "#0f1111" }}>サインイン</h1>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#0f1111", display: "block", marginBottom: 4 }}>{sc.emailLabel}</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="例：yamada@example.com"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #888", borderRadius: 4, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#0f1111", display: "block", marginBottom: 4 }}>{sc.passLabel}</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="パスワードを入力"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #888", borderRadius: 4, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          <button onClick={onSubmit}
            style={{ width: "100%", padding: "9px", background: `linear-gradient(to bottom, #f7dfa5, #f0c14b)`, border: "1px solid #a88734", borderRadius: 4, fontSize: 14, fontWeight: 400, cursor: "pointer", color: "#111", fontFamily: "inherit" }}>
            {sc.submitLabel}
          </button>
          <div style={{ fontSize: 11, color: "#666", marginTop: 14, lineHeight: 1.6, textAlign: "center" }}>
            続行することで、Amazonの<span style={{ color: "#0066c0" }}>利用規約</span>および<span style={{ color: "#0066c0" }}>プライバシー規約</span>に同意します。
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <span style={{ fontSize: 13, color: "#0066c0" }}>アカウントを作成</span>
        </div>
      </div>
    </div>
  );
}

// 偽サイト UI — PayPay/LINE風（共通カード型）
function FakeSiteGeneric({ sc, email, setEmail, password, setPassword, onSubmit }) {
  return (
    <div style={{ background: sc.siteBg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 24, letterSpacing: "-.5px" }}>{sc.siteLogoText}</div>
      <div style={{ background: "#fff", borderRadius: 12, padding: "24px 22px", width: "100%", maxWidth: 340 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 18px", color: "#111", textAlign: "center" }}>ログイン</h2>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 5 }}>{sc.emailLabel}</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="例：yamada@example.com"
            style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border .2s" }}
            onFocus={e => e.target.style.borderColor = sc.siteBg}
            onBlur={e => e.target.style.borderColor = "#ddd"} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 5 }}>{sc.passLabel}</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="パスワードを入力"
            style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        </div>
        <button onClick={onSubmit}
          style={{ width: "100%", padding: "12px", background: sc.siteBg, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#fff", fontFamily: "inherit" }}>
          {sc.submitLabel}
        </button>
        <div style={{ fontSize: 11, color: "#999", marginTop: 12, textAlign: "center", lineHeight: 1.6 }}>
          ログインすることで利用規約・プライバシーポリシーに同意します
        </div>
      </div>
    </div>
  );
}

function Episode7({ onComplete, onExit }) {
  const ageMode = useAgeMode();
  const [phase, setPhase] = useState("parent_intro");
  // intro → sms → warning → fakesite → submitted → damage → spotcheck → safety → dialogue → complete
  const [sc] = useState(() => PHISHING_SCENARIOS[Math.floor(Math.random() * PHISHING_SCENARIOS.length)]);
  const [smsStep, setSmsStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [damageStep, setDamageStep] = useState(0);
  const [foundPoints, setFoundPoints] = useState([]);
  const [spotDetail, setSpotDetail] = useState(null);
  const [safetyStep, setSafetyStep] = useState(0);

  const cyan = "#06b6d4";
  const cyanDark = "#0e7490";

  // Damage simulation timeline
  const damageTimeline = ageMode === "elementary" ? [
    { time: "0{秒|びょう}{後|ご}", icon: "📤", color: "#fca5a5", text: `あなたが{入力|にゅうりょく}した「${email || "メールアドレス"}」と「パスワード」が{犯罪者|はんざいしゃ}のサーバーに{届|とど}いた` },
    { time: "3{秒|びょう}{後|ご}", icon: "🔓", color: "#fdba74", text: `${sc.siteName}アカウントへの{不正|ふせい}ログインを{試|こころ}みる。パスワードが{使|つか}い{回|まわ}しの{場合|ばあい}、{他|ほか}のサービスも{同時|どうじ}に{試|ため}される` },
    { time: "1{分|ぷん}{後|ご}", icon: "💳", color: "#fca5a5", text: `{登録|とうろく}クレジットカードで{不正|ふせい}{購入|こうにゅう}{開始|かいし}。{高額|こうがく}ギフトカードや{電子|でんし}マネーが{購入|こうにゅう}される` },
    { time: "10{分|ぷん}{後|ご}", icon: "📧", color: "#fdba74", text: `{登録|とうろく}メールアドレスも{乗|の}っ{取|と}られ、パスワードリセットを{妨害|ぼうがい}。{取|と}り{戻|もど}せなくなる` },
    { time: "1{時間|じかん}{後|ご}", icon: "🌐", color: "#fca5a5", text: `{盗|ぬす}んだ{情報|じょうほう}はダークウェブで{売買|ばいばい}される。1{件|けん}{数百|すうひゃく}{円|えん}〜{数千|すうせん}{円|えん}で{取引|とりひき}される` },
    { time: "{数日|すうじつ}{後|ご}", icon: "😱", color: "#f472b6", text: `{身|み}に{覚|おぼ}えのない{請求|せいきゅう}が{届|とど}いてはじめて{気|き}づく。{被害|ひがい}{額|がく}の{平均|へいきん}は30〜50{万円|まんえん}` },
  ] : [
    { time: "0秒後", icon: "📤", color: "#fca5a5", text: `あなたが入力した「${email || "メールアドレス"}」と「パスワード」が犯罪者のサーバーに届いた` },
    { time: "3秒後", icon: "🔓", color: "#fdba74", text: `${sc.siteName}アカウントへの不正ログインを試みる。パスワードが使い回しの場合、他のサービスも同時に試される` },
    { time: "1分後", icon: "💳", color: "#fca5a5", text: `登録クレジットカードで不正購入開始。高額ギフトカードや電子マネーが購入される` },
    { time: "10分後", icon: "📧", color: "#fdba74", text: `登録メールアドレスも乗っ取られ、パスワードリセットを妨害。取り戻せなくなる` },
    { time: "1時間後", icon: "🌐", color: "#fca5a5", text: `盗んだ情報はダークウェブで売買される。1件数百円〜数千円で取引される` },
    { time: "数日後", icon: "😱", color: "#f472b6", text: `身に覚えのない請求が届いてはじめて気づく。被害額の平均は30〜50万円` },
  ];

  const safetyChecks = ageMode === "elementary" ? [
    { icon: "🔍", title: "URLを{必|かなら}ず{確認|かくにん}する", desc: `{本物|ほんもの}の${sc.siteName}は「${sc.realDomain}」のみ。{少|すこ}しでも{違|ちが}うドメインはすべて{偽物|にせもの}。URLを{指|ゆび}で{長押|ながお}しして{確認|かくにん}する{習慣|しゅうかん}を。` },
    { icon: "📱", title: "{公式|こうしき}アプリで{直接|ちょくせつ}{確認|かくにん}", desc: "SMSやメールのリンクを{踏|ふ}まずに、{公式|こうしき}アプリを{直接|ちょくせつ}{起動|きどう}して{確認|かくにん}する。これだけで95%のフィッシングは{防|ふせ}げる。" },
    { icon: "🔒", title: "パスワードを{使|つか}い{回|まわ}さない", desc: "1つのサービスで{漏|も}れると{全部|ぜんぶ}{漏|も}れる。サービスごとに{違|ちが}うパスワードを{設定|せってい}し、パスワードマネージャーを{使|つか}う。" },
    { icon: "📵", title: "SMSのURLは{踏|ふ}まない", desc: "{銀行|ぎんこう}・PayPay・Amazon・LINEの{公式|こうしき}{通知|つうち}はアプリ{内|ない}で{来|く}る。SMSでURLを{送|おく}ってくることは{基本|きほん}{的|てき}にない。" },
    { icon: "🚨", title: "「{緊急|きんきゅう}」「{停止|ていし}」「24{時間|じかん}」に{注意|ちゅうい}", desc: "{焦|あせ}らせる{言葉|ことば}は{詐欺|さぎ}の{合図|あいず}。{慌|あわ}てず{公式|こうしき}アプリを{開|ひら}く。{焦|あせ}りが{判断力|はんだんりょく}を{奪|うば}う。" },
  ] : [
    { icon: "🔍", title: "URLを必ず確認する", desc: `本物の${sc.siteName}は「${sc.realDomain}」のみ。少しでも違うドメインはすべて偽物。URLを指で長押しして確認する習慣を。` },
    { icon: "📱", title: "公式アプリで直接確認", desc: "SMSやメールのリンクを踏まずに、公式アプリを直接起動して確認する。これだけで95%のフィッシングは防げる。" },
    { icon: "🔒", title: "パスワードを使い回さない", desc: "1つのサービスで漏れると全部漏れる。サービスごとに違うパスワードを設定し、パスワードマネージャーを使う。" },
    { icon: "📵", title: "SMSのURLは踏まない", desc: "銀行・PayPay・Amazon・LINEの公式通知はアプリ内で来る。SMSでURLを送ってくることは基本的にない。" },
    { icon: "🚨", title: "「緊急」「停止」「24時間」に注意", desc: "焦らせる言葉は詐欺の合図。慌てず公式アプリを開く。焦りが判断力を奪う。" },
  ];

  // ── Parent Intro ──
  if (phase === "parent_intro") return (
    <EpisodeIntroCard epKey="ep7" onStart={() => setPhase("intro")} />
  );

  // ── Intro ──
  if (phase === "intro") return (
    <EpisodeShell onExit={onExit}>
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#021218,#010a10)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(28)].map((_, i) => <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: cyan, borderRadius: "50%", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.3 + 0.05, animation: `blink ${Math.random() * 4 + 2}s infinite` }} />)}
      <div style={{ fontSize: 70, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🎣</div>
      <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: cyan, letterSpacing: ".4em", margin: "0 0 10px" }}>EPISODE 07</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 8px", textAlign: "center", lineHeight: 1.3 }}><RubyText text={ageMode === "elementary" ? "あなたの{情報|じょうほう}が{今|いま}、" : "あなたの情報が今、"} /><br /><RubyText text={ageMode === "elementary" ? "{盗|ぬす}まれた" : "盗まれた"} /></h1>
      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, margin: "0 0 22px", textAlign: "center", lineHeight: 1.7 }}>— リアルタイム フィッシング{ageMode === "elementary" ? <RubyText text="{詐欺|さぎ}" /> : "詐欺"} {ageMode === "elementary" ? <RubyText text="{体験|たいけん}" /> : "体験"} —</p>
      <div style={{ background: `${cyan}0f`, border: `1px solid ${cyan}33`, borderRadius: 18, padding: "18px 20px", maxWidth: 320, marginBottom: 14, color: "#e0f7fa", fontSize: 13, lineHeight: 1.9 }}>
        <strong style={{ color: cyan }}><RubyText text={ageMode === "elementary" ? "{本物|ほんもの}そっくりの{偽|にせ}ログイン{画面|がめん}" : "本物そっくりの偽ログイン画面"} /></strong>に、<RubyText text={ageMode === "elementary" ? "{実際|じっさい}にIDとパスワードを{入力|にゅうりょく}してみよう。" : "実際にIDとパスワードを入力してみよう。"} /><br /><br />
        <RubyText text={ageMode === "elementary" ? "{入力|にゅうりょく}した{情報|じょうほう}は" : "入力した情報は"} /><strong style={{ color: cyan }}><RubyText text={ageMode === "elementary" ? "{画面|がめん}の{中|なか}だけ" : "画面の中だけ"} /></strong><RubyText text={ageMode === "elementary" ? "で{使|つか}われます。{実際|じっさい}には{送信|そうしん}されません。" : "で使われます。実際には送信されません。"} />
      </div>
      <div style={{ background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 14, padding: "12px 18px", maxWidth: 320, marginBottom: 22, fontSize: 12, color: "#86efac", lineHeight: 1.75, textAlign: "center" }}>
        ✅ <RubyText text={ageMode === "elementary" ? "{架空|かくう}のメールアドレスとパスワードを{入力|にゅうりょく}してください" : "架空のメールアドレスとパスワードを入力してください"} /><br />（例：test@test.com / password123）
      </div>
      <OwlSay mood="worried" e="{世界中|せかいじゅう}で{毎日|まいにち}{何百万|なんびゃくまん}{通|つう}も{送|おく}られているフィッシングメール。あなたは{見抜|みぬ}けるかな？🦉">世界中で毎日何百万通も送られているフィッシングメール。あなたは見抜けるかな？🦉</OwlSay>
      <button onClick={() => setPhase("sms")} style={{ background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 50, padding: "15px 44px", fontSize: 16, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${cyan}44`, marginTop: 8 }}><RubyText text={ageMode === "elementary" ? "{体験|たいけん}スタート" : "体験スタート"} /></button>
    </div>
    </EpisodeShell>
  );

  // ── SMS ──
  if (phase === "sms") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1c1c1e,#000)", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* iPhone-style status bar */}
      <div style={{ background: "#000", padding: "12px 20px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 12 }}>●●●</span>
          <span style={{ color: "#fff", fontSize: 12 }}>WiFi</span>
          <span style={{ color: "#fff", fontSize: 12 }}>🔋</span>
        </div>
      </div>
      {/* Messages header */}
      <div style={{ background: "#1c1c1e", padding: "10px 20px 14px", borderBottom: "0.5px solid rgba(255,255,255,.15)" }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", textAlign: "center" }}>メッセージ</div>
        <div style={{ fontSize: 12, color: "#3b82f6", textAlign: "center", marginTop: 2 }}>{sc.smsSender}</div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column" }}>
        {/* Date label */}
        <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 16 }}>今日 9:41</div>

        {/* SMS bubble */}
        {smsStep >= 0 && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12, animation: "slideUp .4s ease" }}>
            <div style={{ background: "#3a3a3c", borderRadius: "18px 18px 18px 4px", padding: "11px 14px", maxWidth: "82%", fontSize: 14, color: "#fff", lineHeight: 1.7 }}>
              <Typewriter text={sc.smsText} speed={25} />
            </div>
          </div>
        )}

        {/* URL highlight */}
        {smsStep >= 1 && (
          <div style={{ background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.3)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, animation: "slideUp .4s ease" }}>
            <div style={{ fontSize: 11, color: cyan, fontWeight: 700, marginBottom: 4 }}>🔗 URLが含まれています</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: "#fca5a5", wordBreak: "break-all" }}>{sc.fakeDomain}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginTop: 4 }}>タップするとリンク先に移動します</div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {smsStep === 0 && (
          <button onClick={() => setSmsStep(1)}
            style={{ width: "100%", padding: 14, background: `${cyan}18`, border: `1px solid ${cyan}33`, borderRadius: 14, color: cyan, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            メッセージを確認する →
          </button>
        )}
        {smsStep >= 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setPhase("fakesite")}
              style={{ width: "100%", padding: 13, background: "rgba(255,59,48,.1)", border: "1px solid rgba(255,59,48,.3)", borderRadius: 14, color: "#ff8a7a", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔗</span> URLをタップする（体験）
            </button>
            <button onClick={() => setPhase("warning")}
              style={{ width: "100%", padding: 13, background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 14, color: "#86efac", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🚫</span> 無視・削除する <span style={{ marginLeft: "auto", fontSize: 11 }}>✓ 正解</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Safe: Ignored ──
  if (phase === "warning") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4,#dcfce7)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 60, marginBottom: 10, animation: "celebrate 1s infinite" }}>🛡️</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#166534", margin: "0 0 6px" }}><RubyText text={ageMode === "elementary" ? "{完璧|かんぺき}な{判断|はんだん}！" : "完璧な判断！"} /></h2>
          <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.7 }}><RubyText text={ageMode === "elementary" ? "URLを{踏|ふ}まなかった、それだけで{被害|ひがい}ゼロです。" : "URLを踏まなかった、それだけで被害ゼロです。"} /></p>
        </div>
        <OwlSay mood="happy" e="「{公式|こうしき}アプリで{確認|かくにん}する」{習慣|しゅうかん}があれば、フィッシングは100%{防|ふせ}げるよ🦉">「公式アプリで確認する」習慣があれば、フィッシングは100%防げるよ🦉</OwlSay>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "2px solid #86efac", marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: "#166534", margin: "0 0 10px" }}>✅ <RubyText text={ageMode === "elementary" ? "なぜ{踏|ふ}まなかった？{理由|りゆう}を{確認|かくにん}しよう" : "なぜ踏まなかった？理由を確認しよう"} /></h3>
          {(ageMode === "elementary" ? [
            `「${sc.fakeDomain}」は「${sc.realDomain}」と{違|ちが}う`,
            "{公式|こうしき}のSMSにURLは{通常|つうじょう}{含|ふく}まれない",
            "「24{時間|じかん}{以内|いない}」という{焦|あせ}らせ{方|かた}が{怪|あや}しい",
          ] : [
            `「${sc.fakeDomain}」は「${sc.realDomain}」と違う`,
            "公式のSMSにURLは通常含まれない",
            "「24時間以内」という焦らせ方が怪しい",
          ]).map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "#16a34a", fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: "#166534" }}><RubyText text={t} /></span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase("spotcheck")}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          <RubyText text={ageMode === "elementary" ? "{見抜|みぬ}き{方|かた}をもっと{学|まな}ぶ →" : "見抜き方をもっと学ぶ →"} />
        </button>
      </div>
    </div>
  );

  // ── Fake site ──
  if (phase === "fakesite") return (
    <div style={{ minHeight: "100vh", background: "#111", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Browser chrome */}
      <div style={{ background: "#2a2a2a", padding: "10px 14px 8px" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", fontFamily: "'DotGothic16',monospace", letterSpacing: ".15em", marginBottom: 6 }}>
          ⚠️ これはフィッシング詐欺の疑似体験です。本物の情報は入力しないでください。
        </div>
        <FakeUrlBar domain={sc.fakeDomain} />
      </div>

      {/* Fake site content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {sc.id === "amazon"
          ? <FakeSiteAmazon sc={sc} email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={() => { if (email || password) setPhase("submitted"); }} />
          : <FakeSiteGeneric sc={sc} email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={() => { if (email || password) setPhase("submitted"); }} />
        }
      </div>

      {/* Bottom hint */}
      <div style={{ background: "#1a1a1a", padding: "10px 14px", borderTop: "0.5px solid rgba(255,255,255,.1)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textAlign: "center", lineHeight: 1.6 }}>
          架空のメール（test@test.com）などを入力して「{sc.submitLabel}」を押してください
        </div>
      </div>
    </div>
  );

  // ── Submitted — the horror moment ──
  if (phase === "submitted") return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at center,#1a0000,#000)", fontFamily: "'Zen Maru Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,0,.025) 2px,rgba(255,0,0,.025) 4px)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 440, width: "100%", position: "relative", zIndex: 2 }}>
        {/* Glitch title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 52, animation: "heartbeat .8s infinite" }}>🚨</div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: "#ff4343", letterSpacing: ".15em", marginTop: 10, animation: "blink .8s infinite" }}>
            DATA TRANSMITTED
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "8px 0" }}><RubyText text={ageMode === "elementary" ? "{情報|じょうほう}が{盗|ぬす}まれました" : "情報が盗まれました"} /></h2>
        </div>

        {/* What was stolen */}
        <div style={{ background: "rgba(255,40,40,.1)", border: "1px solid rgba(255,40,40,.4)", borderRadius: 16, padding: "18px 16px", marginBottom: 16, animation: "redFlash 2s infinite" }}>
          <div style={{ fontSize: 12, color: "#f87171", fontFamily: "'DotGothic16',monospace", letterSpacing: ".1em", marginBottom: 10 }}><RubyText text={ageMode === "elementary" ? "{盗|ぬす}まれた{情報|じょうほう}" : "盗まれた情報"} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>📧</span>
              <div>
                <div style={{ fontSize: 10, color: "#f87171", fontFamily: "'DotGothic16',monospace" }}>メールアドレス</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>
                  {email || "(未入力)"}
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 18 }}>✓</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>🔑</span>
              <div>
                <div style={{ fontSize: 10, color: "#f87171", fontFamily: "'DotGothic16',monospace" }}>パスワード</div>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "'Share Tech Mono',monospace" }}>
                  {"●".repeat(Math.min(password.length, 12)) || "(未入力)"}
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 18 }}>✓</span>
            </div>
          </div>
        </div>

        <button onClick={() => setPhase("damage")}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg,#dc2626,#991b1b)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "slideUp .5s ease" }}>
          <RubyText text={ageMode === "elementary" ? "この{後|あと}、{何|なに}が{起|お}きる？ →" : "この後、何が起きる？ →"} />
        </button>
      </div>
    </div>
  );

  // ── Damage timeline ──
  if (phase === "damage") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>⏱️</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "{情報|じょうほう}が{盗|ぬす}まれた{後|あと}の{世界|せかい}" : "情報が盗まれた後の世界"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}><RubyText text={ageMode === "elementary" ? "{送信|そうしん}ボタンを{押|お}した0{秒|びょう}{後|ご}から{始|はじ}まる" : "送信ボタンを押した0秒後から始まる"} /></p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {damageTimeline.slice(0, damageStep + 1).map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,.04)", border: `1px solid ${d.color}33`, borderLeft: `4px solid ${d.color}`, borderRadius: 12, padding: "12px 14px", animation: "slideUp .3s ease" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{d.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: d.color, marginBottom: 4 }}><RubyText text={d.time} /></div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}><RubyText text={d.text} /></div>
              </div>
            </div>
          ))}
        </div>

        {damageStep < damageTimeline.length - 1 ? (
          <button onClick={() => setDamageStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: "rgba(6,182,212,.12)", border: `1px solid ${cyan}33`, borderRadius: 14, color: cyan, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{続|つづ}きを{見|み}る →" : "続きを見る →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("spotcheck")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${cyan}44` }}>
            <RubyText text={ageMode === "elementary" ? "{偽|にせ}サイトの{見抜|みぬ}き{方|かた}を{学|まな}ぶ →" : "偽サイトの見抜き方を学ぶ →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Spot the fake ──
  if (phase === "spotcheck") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 }}><RubyText text={ageMode === "elementary" ? "{偽|にせ}サイトのどこが{怪|あや}しかった？" : "偽サイトのどこが怪しかった？"} /></h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}><RubyText text={ageMode === "elementary" ? "タップして{確認|かくにん}しよう" : "タップして確認しよう"} /></p>
        </div>

        {/* Replay the fake URL bar */}
        <div style={{ marginBottom: 14 }}>
          <FakeUrlBar domain={sc.fakeDomain} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.1)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>VS 本物</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.1)" }} />
          </div>
          <FakeUrlBar domain={sc.realDomain} isReal />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {sc.dangerPoints.map((pt, i) => {
            const found = foundPoints.includes(i);
            return (
              <button key={i} onClick={() => { if (!found) setFoundPoints(prev => [...prev, i]); setSpotDetail(pt); }}
                style={{ width: "100%", padding: "13px 16px", background: found ? `${cyan}18` : "rgba(255,255,255,.04)", border: `1.5px solid ${found ? cyan + "55" : "rgba(255,255,255,.1)"}`, borderRadius: 14, color: found ? cyan : "rgba(255,255,255,.7)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 12, textAlign: "left", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{pt.emoji}</span>
                <span style={{ flex: 1 }}><RubyText text={ageMode === "elementary" ? (pt.elLabel || pt.label) : pt.label} /></span>
                {found ? <span style={{ color: cyan }}>✓</span> : <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>タップ</span>}
              </button>
            );
          })}
        </div>

        {/* Detail modal */}
        {spotDetail && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }} onClick={() => setSpotDetail(null)}>
            <div style={{ background: "#0d2842", borderRadius: 20, padding: "22px 20px", maxWidth: 340, width: "100%", border: `2px solid ${cyan}` }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 34, textAlign: "center", marginBottom: 8 }}>{spotDetail.emoji}</div>
              <h3 style={{ color: "#e0f7fa", fontSize: 16, fontWeight: 900, textAlign: "center", margin: "0 0 12px" }}><RubyText text={ageMode === "elementary" ? (spotDetail.elLabel || spotDetail.label) : spotDetail.label} /></h3>
              <p style={{ color: "#93c5fd", fontSize: 13, lineHeight: 1.8, margin: "0 0 14px" }}><RubyText text={ageMode === "elementary" ? (spotDetail.elDesc || spotDetail.desc) : spotDetail.desc} /></p>
              <button onClick={() => setSpotDetail(null)} style={{ width: "100%", padding: 12, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>わかった！</button>
            </div>
          </div>
        )}

        {foundPoints.length >= sc.dangerPoints.length && (
          <button onClick={() => setPhase("safety")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", animation: "popIn .4s ease" }}>
            <RubyText text={ageMode === "elementary" ? "{防|ふせ}ぐ{方法|ほうほう}を{学|まな}ぶ →" : "防ぐ方法を学ぶ →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Safety ──
  if (phase === "safety") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <OwlMolly size={90} mood="happy" style={{ margin: "0 auto" }} />
        </div>
        <OwlSay e="この5つを{知|し}っているだけで、フィッシング{詐欺|さぎ}はほぼ{完全|かんぜん}に{防|ふせ}げるよ🦉">この5つを知っているだけで、フィッシング詐欺はほぼ完全に防げるよ🦉</OwlSay>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {safetyChecks.slice(0, safetyStep + 1).map((s, i) => (
            <div key={i} style={{ background: `${cyan}08`, border: `1px solid ${cyan}22`, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", animation: "slideUp .4s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${cyan}15`, border: `1px solid ${cyan}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#e0f7fa", marginBottom: 4 }}>{i + 1}. <RubyText text={s.title} /></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}><RubyText text={s.desc} /></div>
              </div>
            </div>
          ))}
        </div>
        {safetyStep < safetyChecks.length - 1 ? (
          <button onClick={() => setSafetyStep(s => s + 1)}
            style={{ width: "100%", padding: 14, background: `${cyan}18`, border: `1px solid ${cyan}33`, borderRadius: 14, color: cyan, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{次|つぎ}のポイント →" : "次のポイント →"} />
          </button>
        ) : (
          <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: 15, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
            <RubyText text={ageMode === "elementary" ? "{理解|りかい}{度|ど}チェック →" : "理解度チェック →"} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Quiz (EP7) ──
  if (phase === "quiz") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i === 0 ? cyan : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="excited" e="{正解|せいかい}するまで{次|つぎ}に{進|すす}めないよ🦉">正解するまで次に進めないよ🦉</OwlSay>
        <MandatoryQuiz
          question={ageMode === "elementary" ? "「Amazonからアカウント{停止|ていし}の{通知|つうち}。{今|いま}すぐURLから{確認|かくにん}を」というSMSが{届|とど}いた。{正|ただ}しい{行動|こうどう}は？" : "「Amazonからアカウント停止の通知。今すぐURLから確認を」というSMSが届いた。正しい行動は？"}
          choices={[
            { id: "a", label: "A", text: ageMode === "elementary" ? "SMSのURLをタップして{確認|かくにん}する" : "SMSのURLをタップして確認する" },
            { id: "b", label: "B", text: ageMode === "elementary" ? "AmazonアプリかブラウザでAmazon.co.jpを{直接|ちょくせつ}{開|ひら}いて{確認|かくにん}する" : "AmazonアプリかブラウザでAmazon.co.jpを直接開いて確認する" },
            { id: "c", label: "C", text: ageMode === "elementary" ? "Amazonに{電話|でんわ}して{確認|かくにん}する" : "Amazonに電話して確認する" },
          ]}
          correctId="b"
          onPass={() => setPhase("timer")}
          accentColor={cyan}
        />
      </div>
    </div>
  );

  // ── Timer体験 (EP7) ──
  if (phase === "timer") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 1 ? cyan : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="scared" e="{焦|あせ}らせる{演出|えんしゅつ}に{負|ま}けない{練習|れんしゅう}をしよう！🦉">焦らせる演出に負けない練習をしよう！🦉</OwlSay>
        <TimerChoice
          prompt={ageMode === "elementary" ? "「24{時間|じかん}{以内|いない}に{確認|かくにん}しないとアカウント{永久|えいきゅう}{停止|ていし}」のSMSが{来|き}た。どうする？" : "「24時間以内に確認しないとアカウント永久停止」のSMSが来た。どうする？"}
          seconds={10}
          choices={[
            { id: "safe", label: ageMode === "elementary" ? "{公式|こうしき}アプリで{直接|ちょくせつ}{確認|かくにん}する" : "公式アプリで直接確認する", emoji: "📱", safe: true },
            { id: "safe2", label: ageMode === "elementary" ? "URLは{踏|ふ}まずに{削除|さくじょ}する" : "URLは踏まずに削除する", emoji: "🗑️", safe: true },
          ]}
          onChoice={() => setPhase("comparison")}
          onTimeout={() => setPhase("comparison")}
          accentColor={cyan}
        />
      </div>
    </div>
  );

  // ── Comparison (EP7) ──
  if (phase === "comparison") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? cyan : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="worried" e="もし{最悪|さいあく}の{選択|せんたく}をしていたら{何|なに}が{起|お}きていたかみてみよう🦉">もし最悪の選択をしていたら何が起きていたか見てみよう🦉</OwlSay>
        <ChoiceComparison
          myChoice={ageMode === "elementary" ? "URLを{踏|ふ}まず{公式|こうしき}アプリで{確認|かくにん}した" : "URLを踏まず公式アプリで確認した"}
          myResult={ageMode === "elementary" ? "{被害|ひがい}ゼロ。{偽|にせ}サイトへのアクセスなし。この{習慣|しゅうかん}1つで{生涯|しょうがい}フィッシング{被害|ひがい}を{防|ふせ}げる" : "被害ゼロ。偽サイトへのアクセスなし。この習慣1つで生涯フィッシング被害を防げる"}
          worstChoice={ageMode === "elementary" ? "{焦|あせ}ってURLをタップした{場合|ばあい}" : "焦ってURLをタップした場合"}
          worstResult={ageMode === "elementary" ? "{入力|にゅうりょく}した{瞬間|しゅんかん}に{情報|じょうほう}が{盗|ぬす}まれ、{平均|へいきん}30〜50{万円|まんえん}の{不正|ふせい}{利用|りよう}{被害|ひがい}。{取|と}り{戻|もど}すのに{数週間|すうしゅうかん}かかることも" : "入力した瞬間に情報が盗まれ、平均30〜50万円の不正利用被害。取り戻すのに数週間かかることも"}
          accentColor={cyan}
        />
        <button onClick={() => setPhase("homework")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          次へ →
        </button>
      </div>
    </div>
  );

  // ── Homework (EP7) ──
  if (phase === "homework") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#021218,#010a10)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          {["quiz","timer","comparison","homework","keywords","dialogue"].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 3 ? cyan : "rgba(255,255,255,.15)" }} />
          ))}
        </div>
        <OwlSay mood="proud" e="{今日|きょう}のしゅくだい！{全部|ぜんぶ}チェックしてから{次|つぎ}へ{進|すす}もう🦉">今日の宿題！全部チェックしてから次へ進もう🦉</OwlSay>
        <TodaysHomework
          accentColor={cyan}
          tasks={ageMode === "elementary" ? [
            { title: "よく{使|つか}うサービスの{公式|こうしき}アプリをブックマーク", desc: "Amazon・PayPay・LINE・{銀行|ぎんこう}アプリを{直接|ちょくせつ}{開|ひら}く{習慣|しゅうかん}を{作|つく}る" },
            { title: "パスワードの{使|つか}い{回|まわ}しを1つ{解消|かいしょう}する", desc: "1つのサービスのパスワードを{変|か}えて、{他|ほか}と{違|ちが}うものにする" },
            { title: "{家族|かぞく}と「SMSのURLは{踏|ふ}まない」を{約束|やくそく}する", desc: "{家族|かぞく}{全員|ぜんいん}で{知|し}っておくと、グループ{全体|ぜんたい}を{守|まも}れる" },
          ] : [
            { title: "よく使うサービスの公式アプリをブックマーク", desc: "Amazon・PayPay・LINE・銀行アプリを直接開く習慣を作る" },
            { title: "パスワードの使い回しを1つ解消する", desc: "1つのサービスのパスワードを変えて、他と違うものにする" },
            { title: "家族と「SMSのURLは踏まない」を約束する", desc: "家族全員で知っておくと、グループ全体を守れる" },
          ]}
        />
        <button onClick={() => setPhase("keywords")}
          style={{ width: "100%", marginTop: 14, padding: 15, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>
          キーワードを覚える 📖 →
        </button>
      </div>
    </div>
  );

  // ── Keywords (EP7) ──
  if (phase === "keywords") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#ecfeff,#cffafe)", padding: "20px 16px", fontFamily: "'Zen Maru Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <OwlSay mood="excited" e="フィッシング{詐欺|さぎ}の{専門|せんもん}{用語|ようご}をおぼえて、{詐欺師|さぎし}の{手口|てぐち}を{見抜|みぬ}こう！🦉">フィッシング詐欺の専門用語を覚えて、詐欺師の手口を見抜こう！🦉</OwlSay>
        <KeywordPhase epKey="ep7" accentColor="#06b6d4" onComplete={() => setPhase("dialogue")} />
        <ParentExpertCard epKey="ep7" accentColor="#06b6d4" />
      </div>
    </div>
  );

  // ── Dialogue (EP7) ──
  if (phase === "dialogue") return (
    <DialogueRunner
      accentColor={cyan}
      bg="linear-gradient(180deg,#ecfeff,#cffafe)"
      epKey="ep7"
      questions={[
        {
          question: ageMode === "elementary" ? "「Amazonから{警告|けいこく}！{今|いま}すぐURLを{確認|かくにん}して」というSMSが{来|き}た。まず{何|なに}をする？" : "「Amazonから警告！今すぐURLを確認して」というSMSが来た。まず何をする？",
          childOptions: ageMode === "elementary"
            ? ["{急|いそ}いでURLをタップする", "SMSのURLは{踏|ふ}まず、Amazonアプリを{直接|ちょくせつ}{開|ひら}いて{確認|かくにん}する", "{無視|むし}する"]
            : ["急いでURLをタップする", "SMSのURLは踏まず、Amazonアプリを直接開いて確認する", "無視する"],
          explanation: ageMode === "elementary" ? "{公式|こうしき}アプリを{直接|ちょくせつ}{開|ひら}くのが{正解|せいかい}。「{直接|ちょくせつ}{開|ひら}く」{習慣|しゅうかん}だけでフィッシングはほぼ{防|ふせ}げる。" : "公式アプリを直接開くのが正解。「直接開く」習慣だけでフィッシングはほぼ防げる。",
          talkTip: ageMode === "elementary" ? "「よく{使|つか}うサービスのアプリから{直接|ちょくせつ}{開|ひら}く{習慣|しゅうかん}をつけよう」と{一緒|いっしょ}に{練習|れんしゅう}しましょう。" : "「よく使うサービスのアプリから直接開く習慣をつけよう」と一緒に練習しましょう。",
        },
        {
          question: ageMode === "elementary" ? "URLで{偽物|にせもの}を{見分|みわ}けるには、どこを{確認|かくにん}すればいい？" : "URLで偽物を見分けるには、どこを確認すればいい？",
          childOptions: ageMode === "elementary"
            ? ["ページのデザインが{似|に}ているか", "URLのドメイン{部分|ぶぶん}が{本物|ほんもの}かどうか", "{文字|もじ}のフォントが{同|おな}じか"]
            : ["ページのデザインが似ているか", "URLのドメイン部分が本物かどうか", "文字のフォントが同じか"],
          explanation: ageMode === "elementary" ? "ドメインが{全て|すべて}。amaz0n（0がゼロ）・amazon-secure.jp は{全部|ぜんぶ}{偽物|にせもの}。{本物|ほんもの}はamazon.co.jpのみ。" : "ドメインが全て。amaz0n（0がゼロ）・amazon-secure.jp は全部偽物。本物はamazon.co.jpのみ。",
          talkTip: ageMode === "elementary" ? "「{今|いま}{開|ひら}いているサイトのURLを{一緒|いっしょ}に{確認|かくにん}してみよう」と{実際|じっさい}に{練習|れんしゅう}してみましょう。" : "「今開いているサイトのURLを一緒に確認してみよう」と実際に練習してみましょう。",
        },
      ]}
      myWordsPrompt={ageMode === "elementary" ? "フィッシング{詐欺|さぎ}から{身|み}を{守|まも}るために、{今日|きょう}から{実行|じっこう}することを{書|か}こう" : "フィッシング詐欺から身を守るために、今日から実行することを書こう"}
      myWordsPlaceholder={ageMode === "elementary" ? "例：メールやSMSのリンクは{絶対|ぜったい}に{踏|ふ}まず、{直接|ちょくせつ}アプリを{開|ひら}く" : "例：メールやSMSのリンクは絶対に踏まず、直接アプリを開く"}
      onComplete={() => setPhase("complete")}
    />
  );

  // ── Complete ──
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at top,#ecfeff,#cffafe,#a5f3fc)", padding: "30px 16px", fontFamily: "'Zen Maru Gothic',sans-serif", position: "relative", overflow: "hidden" }}>
      {[...Array(36)].map((_, i) => <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: "-20px", width: 8, height: 12, background: [cyan, "#22d3ee", "#a5f3fc", "#06b6d4", "#cffafe"][i % 5], animation: `confettiFall ${Math.random() * 2 + 2}s ${Math.random()}s linear infinite` }} />)}
      <div style={{ maxWidth: 380, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 18, animation: "celebrate 1s infinite" }}><OwlMolly size={110} mood="happy" /></div>
        <div style={{ background: "linear-gradient(135deg,#fff,#ecfeff)", borderRadius: 22, padding: "28px 22px", border: `3px double ${cyan}`, textAlign: "center", boxShadow: `0 20px 60px ${cyan}22`, position: "relative" }}>
          {[{ top: 12, left: 12 }, { top: 12, right: 12 }, { bottom: 12, left: 12 }, { bottom: 12, right: 12 }].map((pos, i) => <div key={i} style={{ position: "absolute", ...pos, fontSize: 16, color: cyan }}>✦</div>)}
          <div style={{ fontFamily: "'DotGothic16',monospace", fontSize: 10, color: cyanDark, letterSpacing: ".4em", marginBottom: 10 }}>CERTIFICATE</div>
          <div style={{ fontSize: 46, marginBottom: 4 }}>🏆</div>
          <h1 style={{ fontSize: 20, color: "#164e63", fontWeight: 900, margin: "0 0 4px" }}>しゅうりょうしょう</h1>
          <p style={{ fontSize: 12, color: "#155e75", lineHeight: 1.9, margin: "12px 0 16px", padding: "0 8px" }}>
            <RubyText text={ageMode === "elementary" ? "あなたは「マモル」{第|だい}7{話|わ}" : "あなたは「マモル」第7話"} /><br /><strong style={{ color: "#164e63", fontSize: 14 }}><RubyText text={ageMode === "elementary" ? "あなたの{情報|じょうほう}が{今|いま}、{盗|ぬす}まれた" : "あなたの情報が今、盗まれた"} /></strong><br /><RubyText text="をクリアしました。" />
          </p>
          <div style={{ background: `linear-gradient(135deg,${cyan}33,#a5f3fc)`, borderRadius: 12, padding: "10px 14px", margin: "10px 0" }}>
            <div style={{ fontSize: 10, color: cyanDark, marginBottom: 3 }}>EPISODE 07 COMPLETE</div>
            <div style={{ fontSize: 13, color: "#164e63", fontWeight: 900 }}>🎣 <RubyText text={ageMode === "elementary" ? "フィッシング{詐欺|さぎ} {免疫|めんえき}マスター" : "フィッシング詐欺 免疫マスター"} /> 🎣</div>
          </div>
          <div style={{ fontSize: 10, color: cyan, marginTop: 14, fontFamily: "'DotGothic16',monospace" }}>{new Date().toLocaleDateString("ja-JP")}</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => navigator.share?.({ title: "マモル EP7 クリア！", text: "フィッシング詐欺の手口を体験して免疫マスターになった！SNSリテラシーアプリ「マモル」🎣" }).catch(() => {})}
            style={{ flex: 1, padding: 14, background: "#fff", border: `2px solid ${cyan}`, borderRadius: 14, color: cyanDark, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📤 シェア</button>
          <button onClick={() => onComplete(3)}
            style={{ flex: 1, padding: 14, background: `linear-gradient(135deg,${cyan},${cyanDark})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏠 ホームへ</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
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

  const [screen, setScreen] = useState("home");
  const [progress, setProgress] = useState(() => {
    const rec = loadRecord();
    return {
      ep1: !!rec.ep1?.completed, ep2: !!rec.ep2?.completed,
      ep3: !!rec.ep3?.completed, ep4: !!rec.ep4?.completed,
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
        <Opening onComplete={() => setShowOpening(false)} />
      </LangContext.Provider>
    </AgeModeContext.Provider>
  );

  return (
    <AgeModeContext.Provider value={{ ageMode, setAgeMode }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <GlobalStyle />
        {screen === "home" && <HomeScreen onNavigate={navigate} progress={progress} />}
        {screen === "report" && <ParentReport onBack={() => navigate("home")} />}
        {screen === "keywordnote" && <KeywordNoteScreen onBack={() => navigate("home")} />}
        {screen === "weekly" && <WeeklyChallengeScreen onBack={() => navigate("home")} />}
        {screen === "info" && <InfoScreen onBack={() => navigate("home")} />}
        {screen === "opening" && <Opening onComplete={() => navigate("home")} />}
        {screen === "ep1" && <Episode1 onComplete={(s) => finish("ep1", s)} onExit={() => navigate("home")} />}
        {screen === "ep12" && <Episode1_2 onComplete={(s) => finish("ep12", s)} onExit={() => navigate("home")} />}
        {screen === "ep2" && <Episode2 onComplete={(s) => finish("ep2", s)} onExit={() => navigate("home")} />}
        {screen === "ep3" && <Episode3 onComplete={(s) => finish("ep3", s)} onExit={() => navigate("home")} />}
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
