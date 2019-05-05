# YAL

YAL (YourAnimeList) is a [Discord](https://discordapp.com/) bot designed to provide quick access to [MyAnimeList](https://myanimelist.net/) ("MAL"). It relies on the JS (node) version of the [Jikan](https://jikan.moe/) API.

## Commands

To get YAL to respond, you want to start your message with `"yal,"` (case insensitive) then follow with the desired command.

<img src="https://github.com/PictElm/YAL/raw/master/img/c-kwa.png" width="250">

YAL only supports so many commands:

1. `"c-kwa"`: if YAL know this term he will return its translation (from _weeb_ to _human_) else he will ask in its turn what this is so it can learn (**actually, not implemented as of RN &mdash; this command is quite useless&hellip;**).
0. `"c-ou"`: YAL goes through the pain of looking-up MAL for an anime name you provided, then it sends a link. If this is not what you where looking for, you can answer negatively to get 5 other names.

## Follow-up

If YAL answered with a question, you should reply omitting the `"yal,"`.

<img src="https://github.com/PictElm/YAL/raw/master/img/c-ou.png" width="250">

YAL can see when a response is _negative_ (e.g.: "no", "nop", "non", "nah", "nn"...) or _positive_ ("yes", "yep", "ye", "oui", "ui"...) or if it contains a number:

<img src="https://github.com/PictElm/YAL/raw/master/img/follow-up.png" width="250">

> Side note: YAL only listen for an answer from whoever he asked anything. If the next message of that user doesn't look like a valid answer, YAL should not take it into account and will consider the exchange as terminated (will stop waiting for an answer to its question).
