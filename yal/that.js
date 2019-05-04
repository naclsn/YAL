const Jikan = require('jikan-node');
const mal = new Jikan();

const Rcrap = require('./rcrap.js');

module.exports = class YAL {

    constructor(fileName) {
        this.refs = {
            names: {
                "tpn": "the promised neverland",
                "opm": "one punch man",
                "yal": "your anime list <3"
            }
        }
    }

    getHelp(sendMessage) {
        sendMessage("Pour l'instant : \n" +
            "- `yal, c-kwa` pour traduir du _weeb_ en _humain_ (" + this.refs.names.length + " entrées as of RN.. x/ )\n" +
            "- `yal, c-ou` pour rechercher sur MAL (par défaut un anime, pour un autre supports préciser entre parenthèses avant le nom : anime/manga/people/etc..)\n")

        return this;
    }

    mainSwitch(args, sendMessage, message) {
        if (Rcrap.processCom(message, args.get(0))) return; // useless hardcoded random crap²

        args.keep(true);

        switch (args.get(0)) {
            // same as `yal?`
            case "ptdr":
            case "t-ki":
            case "t-kwa":
                    sendMessage(this.getHelp());
                break;

            // serious bizz
            case "c-kwa":
                    if (args.count() < 2) 
                        sendMessage(this.getHelp());
                    else if (this.refs.names.hasOwnProperty(args.get(1)))
                        sendMessage(this.refs.names[args.get(1)]);
                    else
                        sendMessage("Oups jsp x/, c quoi ?");
                break;

            case "c-ou":
                    let what = "anime";
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

                    if (this.refs.names.hasOwnProperty(args.get(1)))
                        search = this.refs.names[args.get(1)];
                    else if (this.refs.names.hasOwnProperty(search))
                        search = this.refs.names[search];

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
                break;

            default:
                sendMessage("<3             `yal?` si t'est perdu(e) ;-)");
                args.keep(false)
        }

        return this;
    }

    followSwitch(args, sendMessage, message) {
        args.keep(true);

        switch (args.old.get(0)) {
            case "c-ou":
                    if (args.isNegative(0) || (args.has() > 1 && args.isNegative(1))) {
                        let c = "<@" + args.dude.id + "> Alors peut-être :", k = 0;
                        args.iterNext(5).forEach(e => c+= "\n\t" + ++k + ". " + e.title);
                        sendMessage(c);
                        args.insert(0, "c-ou");
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

            case "c-kwa":
                    if (args.isNegative(0) || (args.has() > 1 && args.isNegative(1)))
                        sendMessage("<@" + args.dude.id + "> Alors jsp x/, c quoi ?");
                    else if (args.isPositive(0) || (args.has() > 1 && args.isPositive(1))) {
                        sendMessage("Nice, dr!");
                        args.keep(false);
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
