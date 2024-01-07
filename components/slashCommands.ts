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
    botSource: 'Built-in' 
  },
  { 
    command: 'join', 
    description: 'a room by entering ID or create using any 6 characters', 
    botSource: 'Built-in'
  },
  { 
    command: 'mint', 
    description: 'predict match outcomes, collect points (coming soon)', 
    botSource: 'Defifa' 
  },
  { 
    command: 'start', 
    description: 'deploy a prediction game (coming soon)', 
    botSource: 'Defifa' 
  },
];


export const useCommands = () => {
  const [commands, setCommands] = useState(initialCommands);
  const [filteredCommands, setFilteredCommands] = useState<{ command: string; description: string; botSource:string }[]>([]);
  return { commands, setCommands, filteredCommands, setFilteredCommands };
};
