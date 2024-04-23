// commands.js or commands.ts
import { useState } from 'react';

// Define the initial state for commands. TODO Move to a separate file
const initialCommands = [
  { 
    command: 'ai', 
    description: 'ask ChatGPT a question, requires your API Key', 
    botSource: 'OpenAI'
  },
  { 
    command: 'football', 
    description: 'join channel formerly known as soccer', 
    botSource: 'd33m' 
  },
  { 
    command: 'join', 
    description: 'enter a room ID or create with any 6 characters', 
    botSource: 'd33m'
  },
  { 
    command: 'play', 
    description: 'predict match outcomes, earn tokens (coming soon)', 
    botSource: 'Defifa' 
  },
  { 
    command: 'start', 
    description: 'a prediction game (coming soon)', 
    botSource: 'Defifa' 
  },
  { 
    command: 'tip', 
    description: '30 DEGEN to d33m team', 
    botSource: 'd33m' 
  },
];


export const useCommands = () => {
  const [commands, setCommands] = useState(initialCommands);
  const [filteredCommands, setFilteredCommands] = useState<{ command: string; description: string; botSource:string }[]>([]);
  return { commands, setCommands, filteredCommands, setFilteredCommands };
};
