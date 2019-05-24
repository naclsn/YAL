const fs = require('fs');

const Jikan = require('jikan-node');
const mal = new Jikan();

const Rcrap = require('./rcrap.js');
const Jap = require('./jap.js');

module.exports = class YAL {

    constructor() {
        this.refs = {};

        fs.readFile('./yal/refs.json', (err, data) => {
            if (err) throw err;
            this.refs = JSON.parse(data);
        });
    }

    findCategory(search) {
        for (var what in this.refs) {
            if (this.refs[what].hasOwnProperty(search))
                return what;
        } return null;
    }

    extractWhatSearch(args, at=1, or=null) {
        let da = { what: or, search: args.raw(at, -1) };

        if (args.get(at) == undefined)
            return da;

        if (args.get(at).startsWith("(")) {
            if (args.get(at).endsWith(")")) {
                da.what = args.get(at).substring(1, args.get(at).length - 1).trim();
                da.search = args.raw(at + 1, -1);
            } else {
                let k = args.get(at).search(/\)/g);
                da.what = args.get(at).substring(1, k).trim();
                da.search = args.get(at).substring(k + 1) + args.raw(at + 1, -1);
            }
        }

        if (da.what == or)
            da.what = this.findCategory(da.search) || or;

        return { what: da.what, search: da.search };
    }

    getHelp(sendMessage) {
        sendMessage(
            "Bonjour ! Moi c'est YAL !\n" +
            "\n" +
            "Pour l'instant : \n" +
            "\t- `yal, c-kwa xyz` pour traduir du _weeb_ en _humain_ (si y a qqch que je connait pas, hésitez pas à me l'apprendre)\n" +
            "\t- `yal, change xyz` pour changer la définition d'un mot _weeb_ que je connait (ou pas)\n" +
            "\t- `yal, oublie xyz` pour supprimer la définition d'un mot _weeb_ que je connait\n" +
            "\t- `yal, c-ou xyz` pour rechercher sur MyAnimeList (par défaut un anime, pour un autre supports préciser entre parenthèses avant le nom : anime/manga/people/etc..)\n" +
            "\n" +
            "Pour une liste de ce que je connait : `yal, c-kwa` (sans arguments)\n"
        );

        return this;
    }

    mainSwitch(args, sendMessage, message) {
        if (Rcrap.processCom(message, args.get(0), this.refs)) return; // useless hardcoded random crap²

        let da = null;

        switch (args.get(0)) {
            // same as `yal?`
            case "ptdr":
            case "t-ki":
            case "tki":
            case "t-kwa":
            case "tkwa":
                    this.getHelp(sendMessage);
                break;

            // serious bizz
            case "c-kwa":
            case "ckwa":
                    if (1 < args.count()) {
                        da = this.extractWhatSearch(args, 1, "other");

                        if (!this.refs.hasOwnProperty(da.what) || !this.refs[da.what].hasOwnProperty(da.search)) {
                            sendMessage("Hum, je n'sais pas... c'est quoi '(" + da.what + ") " + da.search + "' ?");
                            if (da.what == "other")
                                sendMessage("(avec le type entre parenthèses avant le nom stp : anime/manga/people/etc.. - par défaut : 'other')");
                            sendMessage("si tu sais pas non plus répond 'rien' (mais pas rien stp)")

                            args.insert(1, da.what)
                            args.insert(2, da.search)
                            args.keep(true);
                        } else sendMessage("(" + da.what + ") " + this.refs[da.what][da.search]);
                    } else {
                        let infos = "";
                        for (var what in this.refs) {
                            let da = JSON.stringify(this.refs[what])
                                    .replace(/[\{\}\"]/g, "")
                                    .replace(/\,/g, "\", ")
                                    .replace(/\:/g, " = \"");
                            if (da.trim())
                                infos+= "\t- " + what + ": " + da + "\"\n";
                        }
                        sendMessage("Ce que je connait :\n" + infos)
                    }
                break;

            case "change":
                    if (1 < args.count()) {
                        da = this.extractWhatSearch(args, 1, "other");

                        if (this.refs.hasOwnProperty(da.what) && this.refs[da.what].hasOwnProperty(da.search))
                            sendMessage("Ok, et je remplace avec quoi ?");
                        else sendMessage("Ok, et donc c'est quoi ?");

                        args.insert(1, da.what)
                        args.insert(2, da.search)
                        args.keep(true);
                    } else sendMessage("Mais.. change quoi ? (Moi ?! J'suis très bien comme ça !)");
                break;

            case "oublie":
            case "c-nul":
            case "cnul":
                    if (1 < args.count()) {
                        da = this.extractWhatSearch(args, 1, "other");

                        if (this.refs.hasOwnProperty(da.what)) {
                            delete this.refs[da.what][da.search];
                            sendMessage("C'est oublié ! (( (" + da.what + ") " + da.search + " ))");
                        } else sendMessage("Rien a oublier...");

                    } else sendMessage("JAMAIS !");

                    args.keep(false);
                break;

            case "c-ou":
            case "cou":
                    da = this.extractWhatSearch(args, 1, "anime");

                    if (this.refs.hasOwnProperty(da.what) && this.refs[da.what].hasOwnProperty(da.search))
                        da.search = this.refs[da.what][da.search];

                    if (da.what == "other") {
                        sendMessage("hum.. je pense pas que ça se trouve sur MAL...");
                        args.keep(false);
                    } else {
                        console.log("seaching for " + da.search + " as a(n) " + da.what);
                        sendMessage("Att, je cherche...");
                        mal.search(da.what, da.search)
                            .then(info => {
                                if (info.results[0] !== undefined) {
                                    sendMessage("<@" + args.dude.id + "> " + info.results[0].url + " ici ?");
                                    args.iterSet(info.results);
                                } else sendMessage("Oh?! j'ai rien trouvé...");
                            })
                            .catch(err => {
                                console.log(err);
                                sendMessage("Oups, erreur interne... ><");
                                if (err.message.contains("Response:"))
                                    sendMessage("'" + err + "' en fait.. c pas ma faute on dirrait, lol");
                                args.iterSet([err]);
                            });

                        args.keep(true);
                    }
                break;

            case "c-ki":
            case "cki":
                    let search = args.get(1);

                    if (this.refs.hasOwnProperty("people") && this.refs["people"].hasOwnProperty(search))
                        search = this.refs["people"][search];

                    console.log("seaching for " + search + " as a(n) " + "people");
                    sendMessage("Att, je cherche...");
                    mal.search("people", search)
                        .then(info => {
                            if (info.results[0] !== undefined) {
                                sendMessage("<@" + args.dude.id + "> " + info.results[0].url + " ici ?");
                                args.iterSet(info.results);
                            } else sendMessage("Oh?! j'ai rien trouvé...");
                        })
                        .catch(err => {
                            console.log(err);
                            sendMessage("Oups, erreur interne... ><");
                            if (err.message.contains("Response:"))
                                sendMessage("'" + err + "' en fait.. c pas ma faute on dirrait, lol");
                            args.iterSet([err]);
                        });

                    args.keep(true);
                break;

            case "hiragana":
                    sendMessage(Jap.toHiragana(args.raw(1, -1)));
                break;

            case "katakana":
                    sendMessage(Jap.toKatakana(args.raw(1, -1)));
                break;

            case "romaji":
                    sendMessage(Jap.toRomaji(args.raw(1, -1)));
                break;

            default:
                sendMessage("wut?             fait `yal?` si t'est perdu(e)");
                args.keep(false)
        }

        return this;
    }

    followSwitch(args, sendMessage, message) {
        let da = null;

        switch (args.old.get(0)) {
            case "c-kwa":
            case "ckwa":
                    if (args.get(0) == "rien" && args.args() == 1) {
                        sendMessage("dommage...");
                        args.keep(false);
                        break;
                    }
                    if (!this.refs.hasOwnProperty(args.old.get(1)))
                        this.refs[args.old.get(1)] = {};

            case "change":
                    /*if (args.isNegative(0)) {
                        sendMessage("Aborting update due to negatively interpreted answer '" + args.raw(0) + "'");
                        args.keep(false);
                        break;
                    }*/
                    da = { what: args.old.get(1), search: args.old.get(2) };

                    if (da.what == "other")
                        da.what = this.extractWhatSearch(args, 0, "other").what;

                    this.refs[da.what][da.search] = args.raw(0, -1);

                    sendMessage("Ok..");
                    fs.writeFile('./yal/refs.json', JSON.stringify(this.refs), (err) => {  
                        if (err) throw err;
                        console.log('Data written to file');
                        sendMessage("C'est noté ;)");
                    });

                    args.keep(false);
                break;

            case "c-ou":
            case "cou":
                    if (args.isNegative(0) || (args.has() > 1 && args.isNegative(1))) {
                        let c = "<@" + args.dude.id + "> Alors peut-être :", k = 0;
                        args.iterNext(5).forEach(e => c+= "\n\t" + ++k + ". " + e.title);
                        sendMessage(c);
                        args.insert(0, "c-ou");
                        args.keep(true);
                    } else if (args.isPositive(0) || (args.has() > 1 && args.isPositive(1))) {
                        sendMessage("Nice, dr!");
                        args.keep(false);
                    } else {
                        let hint = args.raw(0, -1);
                        let k = hint.search(/[1-5]/g);
                        if (-1 < k) {
                            sendMessage(args.iterGet(Number(hint[k]) + args.indx - 6).url)
                            args.keep(false);
                        } else {
                            args.insert(0, "c-ou");
                            args.keep(true);
                        }
                    }
                break;

            default: switch (args.get(0)) {
                case "montre":
                        args.keep(false).iterNext(-1).forEach(e => sendMessage(e));
                    break;

                default:
                    args.keep(false);
                    console.log("dropped into default with '" + args.old.get(0) + "'");
                    sendMessage("\"this message should not appear\" ;-)\n\n\t\tgg...");
            }
        }

        return this;
    }

};
