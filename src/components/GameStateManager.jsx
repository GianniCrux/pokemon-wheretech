import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types'

const GameStateManager = ({ gameState, onLoadState }) => {
  // Function to export game state
  const exportGameState = () => {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pokemon-game-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Game state exported successfully!');
  };

  // Function to handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result);
          // Validate the imported state has required properties
          if (!importedState.map || !importedState.characterPosition || 
              !importedState.caughtPokemon || !importedState.gameLog) {
            throw new Error('Invalid save file format');
          }
          onLoadState(importedState);
          toast.success('Game state imported successfully!');
        } catch (error) {
          toast.error('Error importing game state: Invalid file format', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Game State Management</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={exportGameState}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Export Game State
        </button>
        <label className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer">
          Import Game State
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

GameStateManager.propTypes = {
    gameState: PropTypes.shape({
      map: PropTypes.arrayOf(PropTypes.object),
      characterPosition: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      }),
      caughtPokemon: PropTypes.arrayOf(PropTypes.string),
      gameLog: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onLoadState: PropTypes.func.isRequired,
  };

export default GameStateManager;