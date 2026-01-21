import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  TextFormatType,
} from "lexical";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  Heading02Icon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  QuoteDownIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      // Basic block type detection could be added here if needed for more complex UI
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/20 items-center">
      <Button
        variant={isBold ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatText("bold")}
        title="Bold"
      >
        <HugeiconsIcon icon={TextBoldIcon} size={16} />
      </Button>
      <Button
        variant={isItalic ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatText("italic")}
        title="Italic"
      >
        <HugeiconsIcon icon={TextItalicIcon} size={16} />
      </Button>
      <Button
        variant={isUnderline ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatText("underline")}
        title="Underline"
      >
        <HugeiconsIcon icon={TextUnderlineIcon} size={16} />
      </Button>
      <Button
        variant={isStrikethrough ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatText("strikethrough")}
        title="Strikethrough"
      >
        <HugeiconsIcon icon={TextStrikethroughIcon} size={16} />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatHeading("h2")}
        title="Heading 2"
      >
        <HugeiconsIcon icon={Heading02Icon} size={16} />
      </Button>
       <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => formatQuote()}
        title="Quote"
      >
        <HugeiconsIcon icon={QuoteDownIcon} size={16} />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        title="Align Left"
      >
        <HugeiconsIcon icon={TextAlignLeftIcon} size={16} />
      </Button>
       <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        title="Align Center"
      >
        <HugeiconsIcon icon={TextAlignCenterIcon} size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        title="Align Right"
      >
        <HugeiconsIcon icon={TextAlignRightIcon} size={16} />
      </Button>
    </div>
  );
}
