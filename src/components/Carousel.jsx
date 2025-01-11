import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import style from './Carousel.module.css';

const Carousel = ({ items, initialActive = 0 }) => {
  const [active, setActive] = useState(initialActive);

  const generateItems = () => {
    const elements = [];
    for (let i = active - 2; i <= active + 2; i++) {
      const index = (i + items.length) % items.length;
      const level = active - i;
      elements.push(
        <CSSTransition key={index} timeout={500} classNames="item">
          <Item src={items[index]} level={level} />
        </CSSTransition>
      );
    }
    return elements;
  };

  const handleDotClick = (index) => {
    setActive(index);
  };

  return (
    <div id="carousel" className={`${style.noselect}`}>
      <TransitionGroup className={`${style.carousel_items}`}>
        {generateItems()}
      </TransitionGroup>
      <div className={`${style.dots}`}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`dot ${active === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

const Item = ({ src, level }) => {
  const className = `item level${level}`;
  return (
    <div className={className}>
      <img src={src} alt={`Slide`} className={`${style.carousel_image}`} />
    </div>
  );
};

export default Carousel;
