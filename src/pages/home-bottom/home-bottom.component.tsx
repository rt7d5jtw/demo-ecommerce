import * as React from 'react';
import './home-bottom.css';

const Homebottom = (): JSX.Element => {
  const image =
    'https://images.unsplash.com/photo-1608726025971-d7e9df684498?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1';
  return (
    <div className='homebottom'>
      <div className='homebottom__wrapper'>
        <div
          className='homebottom__wrapper__image'
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className='homebottom__wrapper__text'>
          <p>
            {' '}
            Vivamus feugiat ipsum lorem, id malesuada urna egestas vel. Suspendisse pulvinar laoreet
            lorem a venenatis. Sed dolor nisi, condimentum at venenatis in, rutrum sed libero. Donec
            mattis augue quis iaculis tincidunt. Aenean dignissim, dolor nec mattis fermentum, felis
            mi elementum enim, nec ullamcorper ante neque ut velit. In sit amet eleifend neque, eu
            tempus magna. Sed felis sem, auctor eu nisl eget, vehicula tempor neque. Etiam et dui
            egestas, ullamcorper risus ac, hendrerit purus. Mauris efficitur porttitor tellus at
            tempus. Curabitur tincidunt vestibulum volutpat. Integer at ligula laoreet, efficitur
            nibh sit amet, pharetra augue. Donec eget tellus euismod, vulputate orci et, iaculis mi.
            Duis sed mattis nunc. Sed odio odio, sagittis at lorem sed, fermentum posuere massa.
            Donec sed orci eu felis vehicula blandit. Sed quis urna est.{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homebottom;
