export const useLocalStorage = <T>() => {
    const getLocalstorageValue = (key: string): T => {
        console.log(localStorage.getItem(key));

        return JSON.parse(localStorage.getItem(key) ?? "{}") as T;
    };

    const setLocalstorageValue = (key: string, initialValue: T) => {
        localStorage.setItem(key, JSON.stringify(initialValue));
    };

    return { getLocalstorageValue, setLocalstorageValue };
};
