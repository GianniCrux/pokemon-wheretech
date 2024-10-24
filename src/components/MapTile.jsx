import PropTypes from 'prop-types';

const MapTile = ({ type }) => {
  const getTileClass = () => {
    switch (type) {
      case 'water':
        return 'tile water';
      case 'grass':
        return 'tile grass';
      case 'land':
        return 'tile land';
      default:
        return 'tile';
    }
  };

  return <div className={getTileClass()}></div>;
};


MapTile.propTypes = {
    type: PropTypes.string.isRequired,
}

export default MapTile;
