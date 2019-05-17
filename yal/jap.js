const hiragana = require("./jap/hiragana.json");
const katakana = require("./jap/katakana.json");
const romaji = require("./jap/romaji.json");

module.exports = class Jap {

    static to(dict, c, _tsu=null) {
        for (let k in dict)
            c = c.replace(new RegExp(k, "gi"), dict[k]);

        return _tsu ? c.replace(/[STCKGBP]/gi, _tsu) : c.replace(/[っッ](.)/g, "$1$1");
    }

    static toHiragana(c) {
        return Jap.to(hiragana, c, "っ").replace(/\./g, "。").replace(/\,/g, "、");
    }

    static toKatakana(c) {
        return Jap.to(katakana, c, "ッ").replace(/\./g, "。").replace(/\,/g, "、");
    }

    static toRomaji(c) {
        return Jap.to(romaji, c).replace(/。/g, ".").replace(/、/g, ",");
    }

}
