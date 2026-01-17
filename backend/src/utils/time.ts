const tomorrow = (): Date => {
    let result = new Date();
    result.setDate(result.getDate() + 1);
    return result;
};

export { tomorrow };
