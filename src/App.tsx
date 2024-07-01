import { FC } from 'react';
import ShakeComponent from './Shake';

const ShakeGame: FC = () => {

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Shake Game</h1>
      <ShakeComponent/>
      <h3>25 round 4</h3>
    </div>
  );
};

export default ShakeGame;



