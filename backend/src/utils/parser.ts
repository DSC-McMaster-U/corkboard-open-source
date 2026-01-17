function genericParse<T>(
    val: string | undefined,
    def: T,
    parse: (v: string) => T
): T {
    if (val == undefined) {
        return def;
    }

    let result = parse(val);

    if (isNaN(result as number)) {
        return def;
    }

    return result;
}

const parseIntOr = (val: string | undefined, def: number): number =>
    genericParse(val, def, (v) => parseInt(v, 10));

const parseFloatOr = (val: string | undefined, def: number): number =>
    genericParse(val, def, parseFloat);

const parseDateOr = (val: string | undefined, def: Date): Date =>
    genericParse(val, def, (v) => new Date(v));

const titleCaseStr = (str: string): string =>
    str
        .split(" ")
        .map((subStr: string) => {
            return (
                subStr.charAt(0).toUpperCase() + subStr.slice(1).toLowerCase()
            );
        })
        .join(" ");

export { parseIntOr, parseFloatOr, parseDateOr, titleCaseStr };
