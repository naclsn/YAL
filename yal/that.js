const fs = require('fs');

const Jikan = require('jikan-node');
const mal = new Jikan();

const Rcrap = require('./rcrap.js');

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

    getHelp(sendMessage) {
        let infos = "";
        for (var what in this.refs) {
            let da = JSON.stringify(this.refs[what])
                    .replace(/[\{\}\"]/g, "")
                    .replace(/\,/g, "\", ")
                    .replace(/\:/g, " = \"");
            if (da.trim())
                infos+= "\t- " + what + ": " + da + "\"\n";
        }

        sendMessage(
            "Bonjour ! Moi c'est YAL !\n" +
            "\n" +
            "Pour l'instant : \n" +
            "\t- `yal, c-kwa` pour traduir du _weeb_ en _humain_ (si y a qqch que je connait pas, hésitez pas à me l'apprendre)\n" +
            "\t- `yal, change` pour changer la définition d'un mot _weeb_ que je connait (ou pas)\n" +
            "\t- `yal, c-ou` pour rechercher sur MyAnimeList (par défaut un anime, pour un autre supports préciser entre parenthèses avant le nom : anime/manga/people/etc..)\n" +
            "\n" +
            "Ce que je connait :\n" + infos
        );

        return this;
    }

    mainSwitch(args, sendMessage, message) {
        if (Rcrap.processCom(message, args.get(0), this.refs)) return; // useless hardcoded random crap²

        switch (args.get(0)) {
            // same as `yal?`
            case "ptdr":
            case "t-ki":
            case "t-kwa":
                    this.getHelp();
                break;

            // serious bizz
            case "c-kwa":
                    if (1 < args.count()) {
                        let what = null;
                        let search = args.raw(1, -1);

                        if (args.get(1).startsWith("(")) {
                            if (args.get(1).endsWith(")")) {
                                what = args.get(1).substring(1, args.get(1).length - 1).trim();
                                search = args.raw(1, -1);
                            } else {
                                let k = args.get(1).search(/\)/g);
                                what = args.get(1).substring(1, k).trim();
                                search = args.get(1).substring(k + 1) + args.raw(1, -1);
                            }
                        }

                        if (what == null)
                            what = this.findCategory(search) || "other";

                        if (!this.refs.hasOwnProperty(what) || !this.refs[what].hasOwnProperty(search)) {
                            sendMessage("Oups jsp x/, c'est quoi ? (avec le type entre parenthèses avant le nom stp : anime/manga/people/etc.. - par défaut : 'other')");

                            args.insert(1, what)
                            args.insert(2, search)
                            args.keep(true);
                        } else sendMessage(this.refs[what][search]);
                    } else this.getHelp();
                break;

            case "change":
                    if (1 < args.count()) {
                        let what = null;
                        let search = args.raw(1, -1);

                        if (args.get(1).startsWith("(")) {
                            if (args.get(1).endsWith(")")) {
                                what = args.get(1).substring(1, args.get(1).length - 1).trim();
                                search = args.raw(2, -1);
                            } else {
                                let k = args.get(1).search(/\)/g);
                                what = args.get(1).substring(1, k).trim();
                                search = args.get(1).substring(k + 1) + args.raw(2, -1);
                            }
                        }

                        if (what == null)
                            what = this.findCategory(search) || "other";

                        if (this.refs.hasOwnProperty(what) && this.refs[what].hasOwnProperty(search))
                            sendMessage("Ok, et je remplace avec quoi ?");
                        else sendMessage("Ok, et donc c'est quoi ?");

                        args.insert(1, what)
                        args.insert(2, search)
                        args.keep(true);
                    } else sendMessage("Mais.. change quoi ? (Moi ?! J'suis très bien comme ça !)");
                break;

            case "oublie":
                    let what = null;
                    let search = args.raw(1, -1);

                    if (args.get(1).startsWith("(")) {
                        if (args.get(1).endsWith(")")) {
                            what = args.get(1).substring(1, args.get(1).length - 1).trim();
                            search = args.raw(2, -1);
                        } else {
                            let k = args.get(1).search(/\)/g);
                            what = args.get(1).substring(1, k).trim();
                            search = args.get(1).substring(k + 1) + args.raw(2, -1);
                        }
                    }

                    if (what == null)
                        what = this.findCategory(search) || "other";

                    if (this.refs.hasOwnProperty(what)) {
                        this.refs[what][search] = undefined;
                        sendMessage("C'est fait !");
                    } else sendMessage("Rien a oublier...");

                    args.keep(false);
                break;

            case "c-ou":
                    let what = null;
                    let search = args.raw(1, -1);

                    if (args.get(1).startsWith("(")) {
                        if (args.get(1).endsWith(")")) {
                            what = args.get(1).substring(1, args.get(1).length - 1).trim();
                            search = args.raw(2, -1);
                        } else {
                            let k = args.get(1).search(/\)/g);
                            what = args.get(1).substring(1, k).trim();
                            search = args.get(1).substring(k + 1) + args.raw(2, -1);
                        }
                    }

                    if (what == null)
                        what = this.findCategory(search) || "anime";

                    if (this.refs.hasOwnProperty(what) && this.refs[what].hasOwnProperty(search))
                        search = this.refs[what][search];

                    console.log("seaching for " + search + " as a(n) " + what);
                    sendMessage("Att, je cherche...");
                    mal.search(what, search)
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

            default:
                sendMessage("<3             fait `yal?` si t'est perdu(e) ;-)");
                args.keep(false)
        }

        return this;
    }

    followSwitch(args, sendMessage, message) {
        switch (args.old.get(0)) {
            case "c-kwa":
                    if (!this.refs.hasOwnProperty(args.old.get(1)))
                        this.refs[args.old.get(1)] = {};

            case "change":
                    /*if (args.isNegative(0)) {
                        sendMessage("Aborting update due to negatively interpreted answer '" + args.raw(0) + "'");
                        args.keep(false);
                        break;
                    }*/
                    let what = args.old.get(1);
                    let search = args.old.get(2);

                    if (what == "other") {
                        if (args.get(0).startsWith("(")) {
                            if (args.get(0).endsWith(")")) {
                                what = args.get(0).substring(1, args.get(0).length - 1).trim();
                                search = args.raw(1, -1);
                            } else {
                                let k = args.get(0).search(/\)/g);
                                what = args.get(0).substring(1, k).trim();
                                search = args.get(0).substring(k + 1) + args.raw(1, -1);
                            }
                        }
                    }

                    this.refs[what][search] = args.raw(0, -1);

                    fs.writeFile('./yal/refs.json', JSON.stringify(this.refs), (err) => {  
                        if (err) throw err;
                        console.log('Data written to file');
                        sendMessage("C'est noté ;)");
                    });

                    args.keep(false);
                break;

            case "c-ou":
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
                        if (-1 < k)
                            sendMessage(args.iterGet(Number(hint[k]) + args.indx - 6).url)
                        else args.keep(false);
                    }
                break;

            default: switch (args.get(0)) {
                case "montre":
                        args.keep(false).iterNext(-1).forEach(e => sendMessage(e));
                    break;

                default:
                    args.keep(false);
                    sendMessage("\"this message should not appear\" ;-)\n\n\t\tgg...");
            }
        }

        return this;
    }

};
