export function is(spec) {
    function conforms(spec, p) {
        if (Array.isArray(spec))
            return spec.includes(p);
        if (spec === undefined)
            return true;
        return spec === p;
    }
    return (c) => {
        if (c === undefined)
            return false;
        switch (c.type) {
            case 'NUMBERED':
                return conforms(spec.type, 'NUMBERED') && conforms(spec.color, c.color) && conforms(spec.number, c.number);
            case 'SKIP':
            case 'REVERSE':
            case 'DRAW':
                return conforms(spec.type, c.type) && conforms(spec.color, c.color) && spec.number === undefined;
            default:
                return conforms(spec.type, c.type) && spec.color === undefined && spec.number === undefined;
        }
    };
}
export function not(pred) {
    return c => !pred(c);
}
//# sourceMappingURL=predicates.js.map