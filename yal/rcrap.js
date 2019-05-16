module.exports = class Rcrap {

    static processMsg(message) {
        if (message.content.startsWith("p!roast ")) {
            message.channel.send("p!hug " + message.content.substring(8));
            message.channel.send("<@" + message.author.id + "> <3");
            return true;
        } else if (message.content == "pls fight yal") {
            message.channel.send("Mais... si, j'peut m'battre tout seul :'(");
            message.channel.send("(J'suis grand !)");
            message.channel.send("((stupid bot))");
            message.channel.send("(((en vrai j'écoute pas les bots)))");
            message.channel.send("p!roast Dank Memer");
            return true;
        } return false
    }

    static processCom(message, com, refs) {
        switch (com) {
            case "coucou":
                    message.channel.send(JSON.stringify(refs));
                return true;

            case "t-ou":
                    message.channel.send("Mon code est ici https://github.com/PictElm/YAL,");
                    message.channel.send("et moi je suis là https://pictelm-yal.glitch.me/ !");
                return true;

            case "c-ki":
                    message.channel.send("Error: NotImplementedException at [..]");
                    message.channel.send("(bref, tu vois l'idée quoi)");
                return true;

            case "jtm":
            case "tg":
            case "thx":
            case "ty":
            case "roast":
            case "hug":
                    message.channel.send("<@" + message.author.id + "> <3");
                return true;
        } return false;
    }

};
