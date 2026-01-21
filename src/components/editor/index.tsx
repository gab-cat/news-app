import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode, registerCodeHighlighting } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect, useRef } from "react";
import { editorTheme } from "./theme";
import { ToolbarPlugin } from "./toolbar-plugin";
import { cn } from "@/lib/utils";

import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";

if (typeof window !== "undefined") {
  window.Prism = Prism;
}

function Placeholder() {
  return (
    <div className="absolute top-[52px] left-[18px] text-muted-foreground pointer-events-none select-none">
      Start writing...
    </div>
  );
}

const editorConfig = {
  namespace: "NewsEditor",
  theme: editorTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
  ],
};

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}

function InitialHtmlPlugin({ html }: { html?: string }) {
  const [editor] = useLexicalComposerContext();
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!html || isLoaded.current) return;
    
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $getRoot().select();
      $insertNodes(nodes);
    });
    
    isLoaded.current = true;
  }, [editor, html]);

  return null;
}

interface EditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  className?: string;
}

export function Editor({ initialValue, onChange, className }: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={cn("relative border border-border rounded-lg overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all", className)}>
        <ToolbarPlugin />
        <div className="relative min-h-[400px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[400px] outline-none p-4 prose prose-sm sm:prose max-w-none dark:prose-invert" />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={({ children }) => <div>{children}</div>}
          />
          <InitialHtmlPlugin html={initialValue} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <CodeHighlightPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {onChange && (
            <OnChangePlugin
              onChange={(editorState, editor) => {
                editorState.read(() => {
                  const html = $generateHtmlFromNodes(editor, null);
                  onChange(html);
                });
              }}
              ignoreSelectionChange
            />
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
