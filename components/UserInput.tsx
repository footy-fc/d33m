// CustomTextArea.tsx
import React, { FC } from 'react';

interface CustomTextAreaProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  newPost: string;
  showDropdown: boolean;
  setNewPost: React.Dispatch<React.SetStateAction<string>>;
  handlePostChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const CustomTextArea: FC<CustomTextAreaProps> = ({
  textareaRef,
  newPost,
  showDropdown,
  setNewPost,
  handlePostChange,
  onKeyDown
}) => {
  return (
    <textarea
      ref={textareaRef}
      className={`w-full text-white text-sm px-2 py-1 focus:outline-none border bg-darkPurple border-limeGreenOpacity resize-none overflow-hidden ${showDropdown ? 'rounded-b-lg' : 'rounded-lg'}`}
      placeholder="Cast or / for 🤖 commands"
      value={newPost}
      onChange={handlePostChange}
      onKeyDown={onKeyDown}
      style={{ minHeight: '1rem', lineHeight: 'normal' }}
    />
  );
};

export default CustomTextArea;
