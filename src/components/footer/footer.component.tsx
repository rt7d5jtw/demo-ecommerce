import * as React from 'react';
import './footer.css';
import { SiFacebook } from 'react-icons/si';
import { SiInstagram } from 'react-icons/si';
import { SiYoutube } from 'react-icons/si';
import { SiTwitter } from 'react-icons/si';

export const Footer = (): JSX.Element => {
  return (
    <footer>
      <div className='row'>
        <a href='#'>
          <i className='fa fa-twitter'>
            <SiTwitter />
          </i>
        </a>
        <a href='#'>
          <i className='fa fa-youtube'>
            <SiYoutube />
          </i>
        </a>
        <a href='#'>
          <i className='fa fa-instagram'>
            <SiInstagram />
          </i>
        </a>
        <a href='#'>
          <i className='fa fa-facebook'>
            <SiFacebook />
          </i>
        </a>
      </div>
      <div className='row'>All rights reserved</div>
      <div className='row'>
        <ul>
          <li>
            <a href='#'>Contact us</a>
          </li>
          <li>
            <a href='#'>About us</a>
          </li>
          <li>
            <a href='#'>Privacy Policy</a>
          </li>
          <li>
            <a href='#'>Terms & Conditions</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
