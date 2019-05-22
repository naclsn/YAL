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
            case "t-ou":
                    message.channel.send("Mon code est ici https://github.com/PictElm/YAL,");
                    message.channel.send("et moi je suis là https://pictelm-yal.glitch.me/ !");
                return true;

            case "jtm":
            case "tg":
            case "roast":
            case "hug":
            case "<3":
                    message.channel.send("<@" + message.author.id + "> <3");
                return true;

            case "thx":
            case "ty":
            case "merci":
            case "mrc":
                    message.channel.send("<@" + message.author.id + "> dr");
                return true;

            case "stp":
                    message.channel.send("<@" + message.author.id + "> non");
                return true;

            case "pierre":
            case "feuille":
            case "ciseaux":
                    let o =  ["pierre", "feuille", "ciseaux"][Math.floor(Math.random() * 3)];
                    message.channel.send("<@" + message.author.id + "> " + o + " !");
                return true;
        } return false;
    }

};
