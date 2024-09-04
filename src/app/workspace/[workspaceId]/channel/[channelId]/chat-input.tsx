import { useRef } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface ChatInputProps {
    placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null)

    return (
        <div className="px-5 w-full">
            <Editor
                placeholder={placeholder}
                variant="create"
                defaultValue={[]}
                onSubmit={() => { }}
                onCancel={() => { }}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    )
}
