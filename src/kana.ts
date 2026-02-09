import type { KanaEntry, Settings } from "./types.ts";

function h(kana: string, readings: readonly string[], row: "a" | "ka" | "sa" | "ta" | "na" | "ha" | "ma" | "ya" | "ra" | "wa" | "dakuten" | "combo"): KanaEntry {
  return { kana, readings, row, set: "hiragana" };
}

function k(kana: string, readings: readonly string[], row: "a" | "ka" | "sa" | "ta" | "na" | "ha" | "ma" | "ya" | "ra" | "wa" | "dakuten" | "combo"): KanaEntry {
  return { kana, readings, row, set: "katakana" };
}

const hiragana: readonly KanaEntry[] = [
  // Vowels (a row)
  h("あ", ["a"], "a"),
  h("い", ["i"], "a"),
  h("う", ["u"], "a"),
  h("え", ["e"], "a"),
  h("お", ["o"], "a"),
  // K row
  h("か", ["ka"], "ka"),
  h("き", ["ki"], "ka"),
  h("く", ["ku"], "ka"),
  h("け", ["ke"], "ka"),
  h("こ", ["ko"], "ka"),
  // S row
  h("さ", ["sa"], "sa"),
  h("し", ["shi", "si"], "sa"),
  h("す", ["su"], "sa"),
  h("せ", ["se"], "sa"),
  h("そ", ["so"], "sa"),
  // T row
  h("た", ["ta"], "ta"),
  h("ち", ["chi", "ti"], "ta"),
  h("つ", ["tsu", "tu"], "ta"),
  h("て", ["te"], "ta"),
  h("と", ["to"], "ta"),
  // N row
  h("な", ["na"], "na"),
  h("に", ["ni"], "na"),
  h("ぬ", ["nu"], "na"),
  h("ね", ["ne"], "na"),
  h("の", ["no"], "na"),
  // H row
  h("は", ["ha"], "ha"),
  h("ひ", ["hi"], "ha"),
  h("ふ", ["fu", "hu"], "ha"),
  h("へ", ["he"], "ha"),
  h("ほ", ["ho"], "ha"),
  // M row
  h("ま", ["ma"], "ma"),
  h("み", ["mi"], "ma"),
  h("む", ["mu"], "ma"),
  h("め", ["me"], "ma"),
  h("も", ["mo"], "ma"),
  // Y row
  h("や", ["ya"], "ya"),
  h("ゆ", ["yu"], "ya"),
  h("よ", ["yo"], "ya"),
  // R row
  h("ら", ["ra"], "ra"),
  h("り", ["ri"], "ra"),
  h("る", ["ru"], "ra"),
  h("れ", ["re"], "ra"),
  h("ろ", ["ro"], "ra"),
  // W row
  h("わ", ["wa"], "wa"),
  h("を", ["wo", "o"], "wa"),
  h("ん", ["n"], "wa"),

  // Dakuten
  h("が", ["ga"], "dakuten"),
  h("ぎ", ["gi"], "dakuten"),
  h("ぐ", ["gu"], "dakuten"),
  h("げ", ["ge"], "dakuten"),
  h("ご", ["go"], "dakuten"),
  h("ざ", ["za"], "dakuten"),
  h("じ", ["ji", "zi"], "dakuten"),
  h("ず", ["zu"], "dakuten"),
  h("ぜ", ["ze"], "dakuten"),
  h("ぞ", ["zo"], "dakuten"),
  h("だ", ["da"], "dakuten"),
  h("ぢ", ["di", "ji", "dzi"], "dakuten"),
  h("づ", ["du", "zu", "dzu"], "dakuten"),
  h("で", ["de"], "dakuten"),
  h("ど", ["do"], "dakuten"),
  h("ば", ["ba"], "dakuten"),
  h("び", ["bi"], "dakuten"),
  h("ぶ", ["bu"], "dakuten"),
  h("べ", ["be"], "dakuten"),
  h("ぼ", ["bo"], "dakuten"),
  h("ぱ", ["pa"], "dakuten"),
  h("ぴ", ["pi"], "dakuten"),
  h("ぷ", ["pu"], "dakuten"),
  h("ぺ", ["pe"], "dakuten"),
  h("ぽ", ["po"], "dakuten"),

  // Combo/yoon
  h("きゃ", ["kya"], "combo"),
  h("きゅ", ["kyu"], "combo"),
  h("きょ", ["kyo"], "combo"),
  h("しゃ", ["sha", "sya"], "combo"),
  h("しゅ", ["shu", "syu"], "combo"),
  h("しょ", ["sho", "syo"], "combo"),
  h("ちゃ", ["cha", "tya"], "combo"),
  h("ちゅ", ["chu", "tyu"], "combo"),
  h("ちょ", ["cho", "tyo"], "combo"),
  h("にゃ", ["nya"], "combo"),
  h("にゅ", ["nyu"], "combo"),
  h("にょ", ["nyo"], "combo"),
  h("ひゃ", ["hya"], "combo"),
  h("ひゅ", ["hyu"], "combo"),
  h("ひょ", ["hyo"], "combo"),
  h("みゃ", ["mya"], "combo"),
  h("みゅ", ["myu"], "combo"),
  h("みょ", ["myo"], "combo"),
  h("りゃ", ["rya"], "combo"),
  h("りゅ", ["ryu"], "combo"),
  h("りょ", ["ryo"], "combo"),
  h("ぎゃ", ["gya"], "combo"),
  h("ぎゅ", ["gyu"], "combo"),
  h("ぎょ", ["gyo"], "combo"),
  h("じゃ", ["ja", "jya", "zya"], "combo"),
  h("じゅ", ["ju", "jyu", "zyu"], "combo"),
  h("じょ", ["jo", "jyo", "zyo"], "combo"),
  h("びゃ", ["bya"], "combo"),
  h("びゅ", ["byu"], "combo"),
  h("びょ", ["byo"], "combo"),
  h("ぴゃ", ["pya"], "combo"),
  h("ぴゅ", ["pyu"], "combo"),
  h("ぴょ", ["pyo"], "combo"),
];

const katakana: readonly KanaEntry[] = [
  // Vowels (a row)
  k("ア", ["a"], "a"),
  k("イ", ["i"], "a"),
  k("ウ", ["u"], "a"),
  k("エ", ["e"], "a"),
  k("オ", ["o"], "a"),
  // K row
  k("カ", ["ka"], "ka"),
  k("キ", ["ki"], "ka"),
  k("ク", ["ku"], "ka"),
  k("ケ", ["ke"], "ka"),
  k("コ", ["ko"], "ka"),
  // S row
  k("サ", ["sa"], "sa"),
  k("シ", ["shi", "si"], "sa"),
  k("ス", ["su"], "sa"),
  k("セ", ["se"], "sa"),
  k("ソ", ["so"], "sa"),
  // T row
  k("タ", ["ta"], "ta"),
  k("チ", ["chi", "ti"], "ta"),
  k("ツ", ["tsu", "tu"], "ta"),
  k("テ", ["te"], "ta"),
  k("ト", ["to"], "ta"),
  // N row
  k("ナ", ["na"], "na"),
  k("ニ", ["ni"], "na"),
  k("ヌ", ["nu"], "na"),
  k("ネ", ["ne"], "na"),
  k("ノ", ["no"], "na"),
  // H row
  k("ハ", ["ha"], "ha"),
  k("ヒ", ["hi"], "ha"),
  k("フ", ["fu", "hu"], "ha"),
  k("ヘ", ["he"], "ha"),
  k("ホ", ["ho"], "ha"),
  // M row
  k("マ", ["ma"], "ma"),
  k("ミ", ["mi"], "ma"),
  k("ム", ["mu"], "ma"),
  k("メ", ["me"], "ma"),
  k("モ", ["mo"], "ma"),
  // Y row
  k("ヤ", ["ya"], "ya"),
  k("ユ", ["yu"], "ya"),
  k("ヨ", ["yo"], "ya"),
  // R row
  k("ラ", ["ra"], "ra"),
  k("リ", ["ri"], "ra"),
  k("ル", ["ru"], "ra"),
  k("レ", ["re"], "ra"),
  k("ロ", ["ro"], "ra"),
  // W row
  k("ワ", ["wa"], "wa"),
  k("ヲ", ["wo", "o"], "wa"),
  k("ン", ["n"], "wa"),

  // Dakuten
  k("ガ", ["ga"], "dakuten"),
  k("ギ", ["gi"], "dakuten"),
  k("グ", ["gu"], "dakuten"),
  k("ゲ", ["ge"], "dakuten"),
  k("ゴ", ["go"], "dakuten"),
  k("ザ", ["za"], "dakuten"),
  k("ジ", ["ji", "zi"], "dakuten"),
  k("ズ", ["zu"], "dakuten"),
  k("ゼ", ["ze"], "dakuten"),
  k("ゾ", ["zo"], "dakuten"),
  k("ダ", ["da"], "dakuten"),
  k("ヂ", ["di", "ji", "dzi"], "dakuten"),
  k("ヅ", ["du", "zu", "dzu"], "dakuten"),
  k("デ", ["de"], "dakuten"),
  k("ド", ["do"], "dakuten"),
  k("バ", ["ba"], "dakuten"),
  k("ビ", ["bi"], "dakuten"),
  k("ブ", ["bu"], "dakuten"),
  k("ベ", ["be"], "dakuten"),
  k("ボ", ["bo"], "dakuten"),
  k("パ", ["pa"], "dakuten"),
  k("ピ", ["pi"], "dakuten"),
  k("プ", ["pu"], "dakuten"),
  k("ペ", ["pe"], "dakuten"),
  k("ポ", ["po"], "dakuten"),

  // Combo/yoon
  k("キャ", ["kya"], "combo"),
  k("キュ", ["kyu"], "combo"),
  k("キョ", ["kyo"], "combo"),
  k("シャ", ["sha", "sya"], "combo"),
  k("シュ", ["shu", "syu"], "combo"),
  k("ショ", ["sho", "syo"], "combo"),
  k("チャ", ["cha", "tya"], "combo"),
  k("チュ", ["chu", "tyu"], "combo"),
  k("チョ", ["cho", "tyo"], "combo"),
  k("ニャ", ["nya"], "combo"),
  k("ニュ", ["nyu"], "combo"),
  k("ニョ", ["nyo"], "combo"),
  k("ヒャ", ["hya"], "combo"),
  k("ヒュ", ["hyu"], "combo"),
  k("ヒョ", ["hyo"], "combo"),
  k("ミャ", ["mya"], "combo"),
  k("ミュ", ["myu"], "combo"),
  k("ミョ", ["myo"], "combo"),
  k("リャ", ["rya"], "combo"),
  k("リュ", ["ryu"], "combo"),
  k("リョ", ["ryo"], "combo"),
  k("ギャ", ["gya"], "combo"),
  k("ギュ", ["gyu"], "combo"),
  k("ギョ", ["gyo"], "combo"),
  k("ジャ", ["ja", "jya", "zya"], "combo"),
  k("ジュ", ["ju", "jyu", "zyu"], "combo"),
  k("ジョ", ["jo", "jyo", "zyo"], "combo"),
  k("ビャ", ["bya"], "combo"),
  k("ビュ", ["byu"], "combo"),
  k("ビョ", ["byo"], "combo"),
  k("ピャ", ["pya"], "combo"),
  k("ピュ", ["pyu"], "combo"),
  k("ピョ", ["pyo"], "combo"),
];

export const KANA: readonly KanaEntry[] = [...hiragana, ...katakana];

export function getActiveKana(settings: Settings): readonly KanaEntry[] {
  return KANA.filter(entry => {
    const setMatch = (entry.set === "hiragana" && settings.hiragana)
      || (entry.set === "katakana" && settings.katakana);
    const rowMatch = settings.rows.includes(entry.row);
    return setMatch && rowMatch;
  });
}
