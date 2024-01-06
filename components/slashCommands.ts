// commands.js or commands.ts
import { useState } from 'react';

// Define the initial state for commands
const initialCommands = [
  { command: 'ai', description: 'ask ChatGPT a question, requires your API Key' },
  { command: 'football', description: 'join channel formerly known as soccer' },
  { command: 'join', description: 'a room by entering ID or create using any 6 characters' },
  { command: 'mint', description: 'predict match outcomes, collect points (coming soon)' },
  { command: 'start', description: 'deploy a prediction game (coming soon)' },
  { command: 'team', description: 'add EPL team logo using `d33m:liv` in FC bio <- change to your team' },
];

export const useCommands = () => {
  const [commands, setCommands] = useState(initialCommands);
  const [filteredCommands, setFilteredCommands] = useState<{ command: string; description: string; }[]>([]);

  // Add any logic or functions related to these states if needed

  return { commands, setCommands, filteredCommands, setFilteredCommands };
};
