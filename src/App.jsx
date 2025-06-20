import './App.css';
import Card from './comonents/card/card';
import { getData } from './constants/db';
import Cart from './comonents/cart/cart';
import { useState, useEffect } from 'react';
import { useCallback } from 'react';


 const courses = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = item => {
    const existItem = cartItems.find(c => c.id == item.id);
    console.log('EXIST_ITEM',existItem);
    
    if(existItem) {
      const newData = cartItems.map(c => 
        c.id == item.id
         ? {...existItem, quantity: existItem.quantity + 1}
         : c
      );
      console.log("ADD_QUANTITY_EXIST_ITEM", newData);
      setCartItems(newData);
    } else {
      const newData = [...cartItems, {...item, quantity: 1 }];
      console.log("ADD_ITEM", newData);
      setCartItems(newData);
    }
  };

  const onRemoveItem = item => {
    const existItem = cartItems.find(c => c.id == item.id);
    
    console.log('existItem', existItem);

    if (existItem.quantity === 1) {
      const newData = cartItems.filter(c => c.id !== existItem.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map(c => 
        c.id == item.id
         ? {...existItem, quantity: existItem.quantity - 1}
         : c
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = "Sotib olish :)";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    telegram.sendData(JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent('mainButtonClicked', onSendData);

    return () => {
      telegram.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData])

  return (
    <>
    <h1 className='heading'>menugo_bot</h1>
    <Cart cartItems={cartItems} onCheckout={onCheckout} />
    <div className='cards_container'>
      {courses.map(course => (
        <Card 
        key={course.id}
        course={course} 
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem} 
        />
      ))}
    </div>
    </>
  );
};

export default App;
