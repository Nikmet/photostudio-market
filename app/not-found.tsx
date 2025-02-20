import { ThemeImage } from "@/components/theme-image";

export default function NotFound() {
    return (
        <div className="p-3 flex items-center justify-center h-full">
            <ThemeImage darkSrc="/not-found-dark.svg" lightSrc="/not-found-light.svg" alt="404" />
        </div>
    );
}
