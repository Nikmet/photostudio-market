export const createUid = (prefix: string, id: string) => {
    const paddedId = id.padStart(5, "0");
    return `${prefix}-${paddedId}`;
};

export const getId = (uid: string) => {
    const [, id] = uid.split("-");
    return id;
};
