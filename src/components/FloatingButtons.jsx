import { useState, useRef, useEffect } from 'react';
import style from './FloatingButtons.module.css';

const FloatingButtons = ({ setCurrentPage }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '안녕하세요! KOKEE TEA 챗봇입니다. 무엇을 도와드릴까요?',
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // 홈으로 이동하는 함수
  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      // 현재 홈페이지에 있을 경우 첫 번째 섹션으로 스크롤
      const homeComponent = document.getElementById('section-0');
      if (homeComponent) {
        homeComponent.scrollIntoView({ behavior: 'smooth' });
        setCurrentPage(0);
      }
    } else {
      // 다른 페이지에서는 홈으로 이동하면서 state 전달
      window.location.href = '/';
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);

    // 챗봇 응답 로직
    const botResponse = generateBotResponse(inputMessage);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);

    setInputMessage('');
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('메뉴') || lowerMessage.includes('음료')) {
      return '코키티의 대표 메뉴는 Cold Cloud, Ice Blended, Fresh Fruit Tea 등이 있습니다. 자세한 메뉴는 메뉴 페이지에서 확인하실 수 있습니다.';
    } else if (lowerMessage.includes('위치') || lowerMessage.includes('매장')) {
      return '매장 위치는 스토어 페이지에서 확인하실 수 있습니다. 가까운 매장을 찾아보세요!';
    } else if (lowerMessage.includes('가맹') || lowerMessage.includes('창업')) {
      return '가맹 문의는 Affiliated 페이지에서 상담 신청이 가능합니다.';
    } else {
      return '죄송합니다. 문의하신 내용에 대해 자세한 상담이 필요한 경우 1:1 문의하기를 이용해 주세요.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChatClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        handleChatClose();
      }
    };

    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={style.floatingContainer}>
      <button
        className={`${style.floatingButton} ${style.chatbotButton}`}
        onClick={() => setIsChatOpen(true)}
      >
        <img src="https://cdn-icons-png.flaticon.com/512/1698/1698535.png" alt="챗봇" />
      </button>
      
      <button 
        className={`${style.floatingButton} ${style.topButton}`}
        onClick={handleLogoClick}
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3272/3272638.png" 
          alt="위로 가기" 
        />
      </button>

      {(isChatOpen || isClosing) && (
        <div 
          ref={chatRef}
          className={`${style.chatContainer} ${isClosing ? style.closing : ''}`}
        >
          <div className={style.chatHeader}>
            <h3>KOKEE TEA 챗봇</h3>
            <button className={style.closeButton} onClick={handleChatClose}>×</button>
          </div>
          <div className={style.chatMessages}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${style.message} ${style[message.type]}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={style.chatInput}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSendMessage}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons; 