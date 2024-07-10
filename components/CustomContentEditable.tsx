import React, { useRef, useEffect } from 'react';

interface CustomContentEditableProps {
  html: string;
  onChange: (html: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const CustomContentEditable: React.FC<CustomContentEditableProps> = ({ html, onChange, onKeyDown }) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (contentEditableRef.current) {
      onChange(contentEditableRef.current.innerHTML);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(contentEditableRef.current!);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  return (
    <div
      ref={contentEditableRef}
      contentEditable
      onInput={handleInput}
      onKeyDown={onKeyDown}
      onFocus={handleFocus}
      className="custom-textarea border border-green-300 p-2 min-h-[100px] max-w-full break-words text-lightPurple font-semibold text-medium bg-darkPurple rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
    />
  );
};

export default CustomContentEditable;
