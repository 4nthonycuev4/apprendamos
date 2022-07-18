import dynamic from "next/dynamic";
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';
import "katex/dist/katex.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

const MDPreview = dynamic(
    () => import("@uiw/react-markdown-preview"),
    { ssr: false }
);

const CodeComponent = ({ inline, children = [], className, ...props }) => {
    const txt = children[0] || '';
    if (inline) {
        if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
            const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                throwOnError: false,
            });
            return <code dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <code>{txt}</code>;
    }
    const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
    if (
        typeof code === 'string' &&
        typeof className === 'string' &&
        /^language-katex/.test(className.toLocaleLowerCase())
    ) {
        const html = katex.renderToString(code, {
            throwOnError: false,
        });
        return <code style={{ fontSize: '125%', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <code className={String(className)}>{props.node && props.node.children ? children : 'print("hello world")'}</code>;
};

export const PublicationForm = ({ content, setContent, setSaved }) => <MDEditor
    value={content}
    onChange={(v, e) => {
        setContent(v);
        setSaved(false);
    }}
    previewOptions={{
        components: {
            code: CodeComponent,
        },
    }}
/>

export const MDParsed = ({ body }) => <MDPreview style={{ "backgroundColor": "transparent", "margin": "0rem 0.5rem 0.5rem 1.2rem", "padding-left": "1.8rem", "border-left": "2px solid #d1d5db" }} source={body} components={{
    code: CodeComponent,
}} />