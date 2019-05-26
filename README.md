# YAL

YAL (YourAnimeList) is a [Discord](https://discordapp.com/) bot designed to provide quick access to [MyAnimeList](https://myanimelist.net/) ("MAL"). It relies on the JS (node) version of the [Jikan](https://jikan.moe/) API.

> The in-discord help command is `"yal?"`.
> 
> (Please note that YAL was made for a small, French community.)

---

## Commands

To get YAL to respond, you want to start your message with `"yal, "` (case insensitive) then follow with the desired command.

![c-kwa example](https://github.com/PictElm/YAL/raw/master/img/c-kwa.png)

YAL only supports so many commands:

1. `"c-kwa"`: If YAL know this term he will return its translation (from _weeb_ to _human_) else he will ask in its turn what this is so it can learn.
0. `"change"`: This command can be used to change the translation of a word. If YAL doesn't know the world your changing, a new entry will be created.
0. `"oublie"`: To remove a word YAL knows, use this command. YAL can't forget a word he don't know.
0. `"c-ou"`: YAL goes through the pain of looking-up MAL for an anime name you provided, then it sends a link. If this is not what you where looking for, you can answer negatively to get 5 other names.

Example:

![c-ou example](https://github.com/PictElm/YAL/raw/master/img/c-ou.png)

## Follow-up

If YAL answered with a question, you should reply omitting the `"yal,"`. YAL can see when a response is _negative_ (e.g.: "no", "nop", "non", "nah", "nn"...) or _positive_ ("yes", "yep", "ye", "oui", "ui"...) or if it contains a number:

![follow-up example](https://github.com/PictElm/YAL/raw/master/img/follow-up.png)

> Side note: YAL only listen for an answer from whoever he asked anything. If the next message of that user doesn't look like a valid answer, YAL should not take it into account and will consider the exchange as terminated (will stop waiting for an answer to its question).

## Categories

With any of the commands, you can precise what kind of object, as a category, you are referring to with parenthesis:

![change example](https://github.com/PictElm/YAL/raw/master/img/change.png)

> Categories are made for words that may have multiples translation depending on the media (anime/manga/...). Custom categories can be defined when entering a word with `"c-kwa"` (or `"change"`), but they should be wary of the fact that YAL will use the name of the category when researching MAL (using `"c-ou"`).
