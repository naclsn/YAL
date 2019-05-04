module.exports = class Helper {

    constructor(sender=null, c="", sep=' ') {
        this.messg = [];
        this.clean = [];

        this.dude = null;

        this.iter = [1, 2, 3, "soleil"];
        this.indx = 0;

        this.isKeep = false;

        if (sender !== null)
            this.push(sender, c, sep);
    }

    push(sender, c, sep=' ') {
        this.dude = sender;
        this.isKeep = false;

        return this.init(c, sep);
    }

    clear() {
        delete this.old
        this.isKeep = false;

        return this;
    }

    keep(is=null) {
        if (is !== null) {
            this.isKeep = is;
            return this;
        } else return this.isKeep;
    }

    match(id=null) {
        return this.dude !== null && (id === null ? true : this.dude.id === id);
    }

    init(c, sep=' ') {
        this.messg = [];
        this.clean = [];

        c.toLowerCase().trim().split(sep).forEach(e => {
            this.messg.push(e);
            this.clean.push(e.trim().replace(/[\,\;\:\!\?\.]/g, ""));
        });

        return this;
    }

    count() {
        return this.messg.length;
    }

    raw(i, j=null) {
        if (j === null)
            return this.messg[i];
        else return this.messg.slice(i, j < 0 ? this.messg.length + 1 : j).join(" ")
    }

    get(i, j=null) {
        if (j === null)
            return this.clean[i];
        else return this.clean.slice(i, j < 0 ? this.messg.length + 1 : j).join(" ")
    }

    has(c=null, i=0, j=null) {
        if (c === null)
            return this.clean.length;

        if (j === null)
            j = this.clean.length;

        for (let k = i; k < j; k++)
            if (this.get(k) == c)
                return k;
        return -1;
    }

    insert(i=0, c="") {
        this.clean.splice(i, 0, c);
        return this;
    }

    followup(c, sep=' ') {
        this.old = new Helper();
        Object.assign(this.old, this);
        delete this.old.old;
        delete this.old.iter;

        return this.init(c, sep);
    }

    iterSet(iterable, index=null) {
        this.iter = iterable;
        this.indx = 0;

        return this.iterGo(index);
    }

    iterGet(i=null) {
        if (i === null)
            return this.iter[this.indx];
        else return this.iter[i];
    }

    iterGo(i=null) {
        this.indx = i === null ? 0 : i;

        return this;
    }

    iterNext(s=1) {
        if (s == 1)
            return this.iter[++s];
        if (s === -1)
            return this.iter;

        let prev = this.indx;
        this.indx+= s;
        return this.iter.slice(prev, this.indx);
    }

    iterPrev(s=1) {
        if (s == 1)
            return this.iter[--s];
        if (s === -1)
            return this.iter;

        let prev = this.indx;
        this.indx-= s;
        return this.iter.slice(this.indx, prev);
    }

    iterCurr() {
        return this.iter[this.indx];
    }

    static find(src, a, b=null) {
        if (b === null)
            return -1 < src.search(a);
        else return false;
    }

    find(i, a, b=null) {
        return Helper.find(this.raw(i), a, b);
    }

    static isNegative(src) {
        return Helper.find(src, /n(o?[npt]?|ah?)|pas/g);
    }

    isNegative(i) {
        return Helper.isNegative(this.raw(i));
    }

    static isPositive(src) {
        return Helper.find(src, /y[sea][pay]?|o?[uw]i/g);
    }

    isPositive(i) {
        return Helper.isPositive(this.raw(i));
    }

};
