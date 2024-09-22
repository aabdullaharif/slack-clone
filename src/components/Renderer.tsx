import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
    value: string;
}

const Renderer = ({ value }: RendererProps) => {
    const [isEmpty, setIsEmpty] = useState(false);
    const renderedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!renderedRef.current) return;

        const container = renderedRef.current;

        const quill = new Quill(document.createElement("div"), {
            theme: "snow",
        });
        quill.enable(false);

        const contents = JSON.parse(value);
        quill.setContents(contents);

        const isEmpty = quill.getText().replace(/<(.|\n)*?>/g, '').trim().length === 0;
        setIsEmpty(isEmpty);

        container.innerHTML = quill.root.innerHTML;

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        }
    }, [value]);

    if (isEmpty) {
        return null;
    }

    return (
        <div ref={renderedRef} className="ql-editor ql-renderer" />
    );
}

export default Renderer;