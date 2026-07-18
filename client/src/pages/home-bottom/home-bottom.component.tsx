import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './home-bottom.css';
import background from '../../assets/homebottom.jpg';

const Homebottom = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState<boolean>(false);

  const callback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setVisible(entry.isIntersecting);
    }
  };

  const options = {
    root: null,
    rootMargin: '0px 0px -300px 0px',
    threshold: 0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return (
    <div
      className='homebottom'
      ref={ref}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className='homebottom__wrapper'>
        <div
          className={
            isVisible
              ? 'homebottom__wrapper__image--slidein'
              : 'homebottom__wrapper__image'
          }
        >
          <p>
            Cras ut malesuada mi. Suspendisse in eros sagittis lacus dignissim
            commodo. Cras quis purus ac metus rutrum eleifend sit amet vel
            metus. Ut hendrerit risus nec urna pellentesque, dictum cursus elit
            volutpat. Donec felis ante, ornare vitae mollis vel, accumsan vel
            libero. Maecenas dictum enim non pretium tincidunt. Quisque
            imperdiet euismod elit, quis vulputate massa congue a. Fusce
            eleifend finibus lorem eu ornare. Nulla facilisi. Quisque ornare
            quam quis nunc euismod pulvinar. Sed auctor odio nec pharetra
            molestie. Aenean non metus vel lacus maximus placerat eget eget
            nisl. Vivamus semper facilisis iaculis. Praesent orci metus,
            tincidunt id dapibus sit amet, euismod vel est. Suspendisse non
            ipsum lorem. Nulla varius, ipsum rhoncus facilisis pellentesque,
            velit lacus pellentesque leo, vitae molestie lectus metus ac ex.
          </p>
          <br />
          <p>
            Vestibulum auctor nulla eu dolor cursus dignissim. Curabitur viverra
            interdum nibh sed dapibus. Duis pretium lectus ultricies nulla
            dignissim varius. Phasellus id iaculis quam. Sed pharetra nisi mi,
            ut molestie nulla volutpat ultrices. Fusce sagittis et tortor quis
            dapibus. Vestibulum vitae dui a mi ornare viverra vel ac tellus. Ut
            eleifend sit amet leo non luctus. Phasellus id pretium augue.{' '}
          </p>
          <br />
          <p>
            In ac purus erat. Nulla suscipit euismod leo, eu fringilla sem
            placerat eu. Aliquam erat risus, eleifend ac maximus eu, lobortis
            nec sapien. Donec eu porttitor felis. Nunc at fringilla ipsum.
            Quisque posuere hendrerit vehicula. Donec gravida magna vitae mi
            convallis gravida. Morbi cursus nunc et eros sodales, non malesuada
            velit tempus. In tempor est vel sem tristique, sed imperdiet metus
            faucibus.
          </p>
        </div>
        <div
          ref={ref}
          className={
            isVisible
              ? 'homebottom__wrapper__text--slidein'
              : 'homebottom__wrapper__text'
          }
        >
          <p>
            Vivamus imperdiet, purus vitae ultricies gravida, lectus massa
            rhoncus orci, eu fringilla odio mi porttitor enim. Integer aliquam
            odio tortor, eleifend consequat sem mollis et. Nullam neque lectus,
            sollicitudin pulvinar ligula eget, finibus sagittis quam. Cras
            turpis augue, varius ac nibh placerat, dictum ultrices lectus.
            Quisque auctor vitae nulla eget placerat. Nunc imperdiet elit eget
            ornare sagittis. Nam consequat mi aliquet augue mattis efficitur.
            Fusce erat metus, dapibus sed tellus quis, posuere fermentum felis.
          </p>
          <p>
            Phasellus lobortis, mauris vitae finibus sollicitudin, metus tellus
            gravida sapien, ut eleifend felis augue bibendum justo. Mauris
            auctor varius finibus. Aenean vitae interdum diam, vitae porta nunc.
            Donec porta lacus vel tincidunt elementum. Nunc at libero eget
            sapien sagittis eleifend. Ut molestie placerat consequat. Nulla
            facilisi. Vivamus nec blandit eros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homebottom;
