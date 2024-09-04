import 'quill/dist/quill.snow.css';

import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import { ImageIcon, Smile } from 'lucide-react';

import Hint from './Hint';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    variant?: "create" | "update";
    onSubmit?: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
}

const Editor = ({
    variant = "create",
    onSubmit,
    onCancel,
    placeholder = "Type a message",
    defaultValue = [],
    disabled = false,
    innerRef,
}: EditorProps) => {
    const [text, setText] = useState<string>('');
    const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disableRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disableRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div')
        )

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                // TODO:
                                return
                            }
                        }
                    }
                },
                toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ]
            }
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on('text-change', () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = '';
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef?.current) {
                innerRef.current = null;
            }
        }

    }, [innerRef]);

    const toggleToolbar = () => {
        setIsToolbarVisible((prev) => !prev);
        const toolbarEle = containerRef?.current?.querySelector('.ql-toolbar');
        if (toolbarEle) {
            toolbarEle.classList.toggle('hidden');
        }
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref={containerRef} className='h-full ql-custom' />
                <div className='flex px-2 pb-2 z-5'>
                    <Hint label={isToolbarVisible ? "Show formatting" : "Hide formatting"}>
                        <Button
                            disabled={disabled}
                            size="sm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </Hint>
                    <Hint label='Emoji'>
                        <Button
                            disabled={disabled}
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                        >
                            <Smile className='size-4' />
                        </Button>
                    </Hint>
                    {
                        variant === "create" && (
                            <Hint label='Image'>
                                <Button
                                    disabled={disabled}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => { }}
                                >
                                    <ImageIcon className='size-4' />
                                </Button>
                            </Hint>
                        )
                    }
                    {
                        variant === "update" && (
                            <div className='ml-auto flex justify-end gap-x-2'>
                                <Button
                                    disabled={disabled}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => { }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={disabled}
                                    size="sm"
                                    className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                                    onClick={() => { }}
                                >
                                    Save
                                </Button>
                            </div>
                        )
                    }
                    {
                        variant === "create" && (
                            <Hint label='Submit'>
                                <Button
                                    disabled={disabled || isEmpty}
                                    size="iconSm"
                                    className={cn
                                        ('ml-auto',
                                            isEmpty ?
                                                'bg-white hover:bg-white text-muted-foreground'
                                                : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                                        )}
                                    onClick={() => { }}
                                >
                                    <MdSend className='size-4' />
                                </Button>
                            </Hint>
                        )
                    }
                </div>
            </div>
            <div className='p-2 text-[10px] text-muted-foreground flex justify-end'>
                <p>
                    <strong>Shift + Return</strong> to add a new line
                </p>
            </div>
        </div>
    )
}

export default Editor