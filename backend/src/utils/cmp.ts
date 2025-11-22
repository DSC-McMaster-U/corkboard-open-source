const strictMatchFields = (objA: any, objB: any, fields: string[]): boolean => {
    for (const field in fields) {
        if (objA[field] !== objB[field]) {
            return false;
        }
    }

    return true;
};

export { strictMatchFields };
