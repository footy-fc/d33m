import React from 'react';

interface CommandDropdownProps {
  filteredCommands: { command: string; description: string; botSource: string }[];
  setShowDropdown: (show: boolean) => void;
  setNewPost: (post: string) => void;
  handlePostChange: (event: any) => void; // TODO fix this type?
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const CommandDropdown: React.FC<CommandDropdownProps> = ({ filteredCommands, setShowDropdown, setNewPost, handlePostChange, textareaRef }) => {
  return (
    <div className="absolute bottom-full left-0 right-0 mt-1 border border-limeGreenOpacity bg-purplePanel shadow-lg z-10" style={{ width: '100%' }}>
      {filteredCommands.map(({ command, description, botSource }, index) => (
        <div
          key={command}
          className={`grid grid-cols-[auto,1fr,auto] gap-2 px-4 py-2 hover:bg-darkPurple cursor-pointer ${index === filteredCommands.length - 1 ? '' : ''}`}
          onClick={() => {
              if (command === "football") {
                setNewPost(`/${command}`);
                setShowDropdown(false);
                handlePostChange({ target: { value: "/football" } }); // change rooms immediately
              } else {
                setNewPost(`/${command}`);
                setShowDropdown(false);
                textareaRef.current?.focus(); // Set focus back to the textarea
              }
            }}
          > 
            <span className="text-sm text-lightPurple font-bold whitespace-nowrap">🤖 /{command}</span>
            <span className="text-sm text-lightPurple font-normal text-left">{description}</span>
            <span className="text-sm text-lightPurple font-normal justify-self-end">{botSource}</span>
          </div>
        ))}
    </div>
   )}

export default CommandDropdown;