export const getImage = async (url: string) => {
    return new File([await fetch(`${process.env.NEXT_PUBLIC_URL}/${url}`).then(res => res.blob())], url);
};
