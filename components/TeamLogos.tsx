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

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="flex flex-col items-center bg-deepPink text-white font-semibold text-medium p-2 rounded-lg h-full overflow-y-auto">
                <table>
                    <tbody>
                        {rows.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((_, colIndex) => {
                                    const teamIndex = rowIndex * 4 + colIndex;
                                    const team = teamArray[teamIndex];
                                    console.log(teamArray[teamIndex], team);
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

{/*
   "ars": "ars.png",
    "avl": "avl.png",
    "bha": "bha.png",
    "bou": "bou.png",
    "bre": "bre.png",
    "bur": "bur.png",
    "che": "che.png",
    "cry": "cry.png",   
    "eve": "eve.png",
    "ful": "ful.png",
    "liv": "liv.png",
    "lut": "lut.png",
    "mci": "mci.png",
    "mun": "mun.png",
    "new": "new.png",
    "nfo": "nfo.png",
    "sfu": "sfu.png",
    "tot": "tot.png",
    "whu": "whu.png",
    "wol": "wol.png",
    "fcb": "fcb.png",
    "rma": "rma.png",
    "sev": "sev.png",
    "bvb": "bvb.png",
    "bay": "bay.png",
    "int": "int.png",
    "acm": "acm.png",
    "juv": "juv.png",
    "nap": "nap.png",
    "gal": "gal.png",
    "fen": "fen.png",
    "psg": "psg.png",
    "ajx": "ajx.png"
  */}
