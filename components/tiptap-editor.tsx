"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Heading, { Level } from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link"; // Импорт расширения для ссылок
import { useEffect, useState } from "react";

export const TiptapEditor = ({
    value,
    onChange,
    error
}: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) => {
    const [linkUrl, setLinkUrl] = useState("");
    const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "mx-auto my-4 rounded-lg shadow-sm max-w-full"
                }
            }),
            Heading.configure({
                levels: [1, 2, 3],
                HTMLAttributes: {
                    class: "font-bold mt-6 mb-3"
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right", "justify"]
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 hover:underline"
                }
            })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4 border border-t-0 rounded-b-md bg-white"
            }
        }
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            const base64 = event.target?.result as string;
            editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
    };

    const setLink = () => {
        if (linkUrl === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();

        setLinkUrl("");
        setIsLinkMenuOpen(false);
    };

    if (!editor) {
        return <div className="min-h-[200px] border rounded-md bg-gray-50 animate-pulse"></div>;
    }

    return (
        <div className="relative flex flex-col gap-2">
            <label className="text-xl font-medium">Контент страницы</label>

            {/* Панель инструментов */}
            <div className="sticky top-1 z-10 flex flex-wrap items-center gap-1 p-2 border rounded-t-md bg-gray-50">
                {/* Скрытый input для загрузки файлов */}
                <input
                    type="file"
                    id="editor-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />

                {/* Выбор заголовка */}
                <select
                    onChange={e => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: level as Level })
                                .run();
                        }
                    }}
                    className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={editor.isActive("heading") ? editor.getAttributes("heading").level : 0}
                >
                    <option value={0}>Обычный текст</option>
                    <option value={1}>Заголовок 1</option>
                    <option value={2}>Заголовок 2</option>
                    <option value={3}>Заголовок 3</option>
                </select>

                {/* Кнопки форматирования */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
                    title="Жирный"
                >
                    <b>B</b>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
                    title="Курсив"
                >
                    <i>I</i>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
                    title="Подчеркивание"
                >
                    <u>U</u>
                </button>

                {/* Кнопка ссылки */}
                <button
                    type="button"
                    onClick={() => {
                        if (editor.isActive("link")) {
                            editor.chain().focus().unsetLink().run();
                        } else {
                            setIsLinkMenuOpen(!isLinkMenuOpen);
                            setLinkUrl(editor.getAttributes("link").href || "");
                        }
                    }}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
                    title="Добавить ссылку"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </button>

                {/* Меню для ввода ссылки */}
                {isLinkMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded shadow-md z-20">
                        <input
                            type="text"
                            value={linkUrl}
                            onChange={e => setLinkUrl(e.target.value)}
                            placeholder="Введите URL"
                            className="p-1 border rounded mr-2"
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    setLink();
                                }
                            }}
                        />
                        <button onClick={setLink} className="p-1 bg-blue-500 text-white rounded">
                            Применить
                        </button>
                    </div>
                )}

                {/* Кнопки списков */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
                    title="Маркированный список"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
                    title="Нумерованный список"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="10" y1="6" x2="21" y2="6"></line>
                        <line x1="10" y1="12" x2="21" y2="12"></line>
                        <line x1="10" y1="18" x2="21" y2="18"></line>
                        <path d="M4 6h1v4"></path>
                        <path d="M4 10h2"></path>
                        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                    </svg>
                </button>

                {/* Кнопки выравнивания */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                        editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
                    }`}
                    title="По левому краю"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 3h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                        editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
                    }`}
                    title="По центру"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 3h18v2H3zm4 4h10v2H7zm-4 4h18v2H3zm4 4h10v2H7z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    className={`p-2 rounded hover:bg-gray-200 ${
                        editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
                    }`}
                    title="По правому краю"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 3h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z" />
                    </svg>
                </button>

                {/* Кнопка загрузки изображения */}
                <button
                    type="button"
                    onClick={() => document.getElementById("editor-image-upload")?.click()}
                    className="p-2 rounded hover:bg-gray-200"
                    title="Загрузить изображение"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                </button>
            </div>

            {/* Bubble меню для быстрого форматирования */}
            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex gap-1 p-1 bg-white border rounded shadow-md">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
                        >
                            <b>B</b>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
                        >
                            <i>I</i>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1 rounded ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
                        >
                            <u>U</u>
                        </button>
                        <button
                            onClick={() => {
                                const url = window.prompt("Введите URL ссылки");
                                if (url) {
                                    editor.chain().focus().toggleLink({ href: url }).run();
                                }
                            }}
                            className={`p-1 rounded ${editor.isActive("link") ? "bg-gray-200" : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </button>
                    </div>
                </BubbleMenu>
            )}

            {/* Редактор */}
            <EditorContent editor={editor} />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
