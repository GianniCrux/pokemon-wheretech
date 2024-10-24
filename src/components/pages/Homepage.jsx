import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">Pokemon Wheretech</h1>
      <p className="text-xl mb-8 text-gray-700">Embark on a journey to catch &apos;em all!</p>
      <button 
        onClick={handlePlayClick}
        className="px-8 py-3 text-lg font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Start Your Adventure
      </button>
    </div>
  );
};

export default HomePage;