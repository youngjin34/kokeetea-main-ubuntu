import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import style from "./Carousel.module.css";

const Carousel = ({ items, initialActive = 0, onItemChange }) => {
  const [active, setActive] = useState(initialActive);

  const generateItems = () => {
    const elements = [];
    for (let i = active - 2; i <= active + 2; i++) {
      const index = (i + items.length) % items.length;
      const level = active - i;
      elements.push(
        <CSSTransition
          key={index}
          timeout={500}
          classNames={{
            enter: style.item_enter,
            enterActive: style.item_enter_active,
            exit: style.item_exit,
            exitActive: style.item_exit_active,
          }}
        >
          <Item
            src={items[index].image}
            name={items[index].name}
            level={level}
            onClick={() => handleItemClick(items[index])}
          />
        </CSSTransition>
      );
    }
    return elements;
  };

  const handleItemClick = (item) => {
    setActive(items.indexOf(item));
    if (onItemChange) {
      onItemChange(item); // Propagate the selected item to the parent
    }
  };

  const handleDotClick = (index) => {
    setActive(index);
  };

  return (
    <div id="carousel" className={style.carousel}>
      <TransitionGroup className={style.carousel_items}>
        {generateItems()}
      </TransitionGroup>
      <div className={style.dots}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${style.dot} ${
              active === index ? style.dot_active : ""
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Item = ({ src, name, level, onClick }) => {
  const levelClass =
    level === 0
      ? "level_0"
      : level === 1 || level === -1
      ? "level_1"
      : level === 2 || level === -2
      ? "level_2"
      : "level_0";

  return (
    <div onClick={onClick} className={style.carousel_item}>
      <img
        src={src}
        alt={name}
        className={`${style.carousel_image} ${style[levelClass]}`}
      />
      {level === 0 && <div className={style.item_name}>{name}</div>}
    </div>
  );
};

export default Carousel;
