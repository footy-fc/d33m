import React from 'react';
import Modal from 'react-modal';
import validTeamLogos from '../public/validTeams.json';


const teamArray = Object.entries(validTeamLogos).map(([key, value]) => ({
    name: key.toLowerCase(),
    logo: value
}));
    

type TeamsModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    onTeamSelect: (teamName: string) => void;
};

const TeamsModal: React.FC<TeamsModalProps> = ({ isOpen, onRequestClose, onTeamSelect }) => {
    const handleTeamClick = (teamName: string) => {
        onTeamSelect(teamName);
        onRequestClose();
    };


    const rows = Array.from({ length: 6 }); 
    const columns = Array.from({ length: 4 }); 
    // removed overflow-y-auto to test
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="flex flex-col items-center bg-deepPink text-white font-semibold text-medium p-2 rounded-lg h-full">
            <button className="absolute top-0 right-0 text-lightPurple" onClick={onRequestClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
                <table>
                    <tbody>
                        {rows.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((_, colIndex) => {
                                    const teamIndex = rowIndex * 4 + colIndex;
                                    const team = teamArray[teamIndex];
                                    return (
                                        <td key={colIndex} className="cursor-pointer p-2" onClick={() => handleTeamClick(team.name)}>
                                            <img src={"assets/eur/" + team.logo} alt={team.name}  />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};


export default TeamsModal;