// Not currently used - for emoji viewing during authoring casts
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
    <div >
      <textarea
        ref={textareaRef}
        className={`w-full caret-limeGreenOpacity text-white text-sm px-2 py-1 focus:outline-none border bg-darkPurple border-limeGreenOpacity resize-none overflow-hidden ${showDropdown ? 'rounded-b-lg' : 'rounded-lg'}`}
        placeholder="Cast or / for 🤖 commands"
        value={newPost}
        onChange={handlePostChange}
        onKeyDown={onKeyDown}
        style={{ minHeight: '1rem', lineHeight: 'normal' }}
      />

      {newPost && (
        <button
          onClick={() => setNewPost('')}
          className="absolute top-0 right-0 -mt-4 -mr-4 text-xs bg-purplePanel hover:bg-darkPurple rounded-full px-2 py-1 transition duration-300 ease-in-out shadow-md hover:shadow-lg text-lightPurple"
          title="Clear text"
        >
          x
        </button>
      )}
    </div>
  );
};

export default CustomTextArea;
