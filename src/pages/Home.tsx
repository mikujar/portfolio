import { useState, useEffect } from 'react';
import { quotesApi, messagesApi } from '../api';
import type { Page, Quote, Message } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [randomMessage, setRandomMessage] = useState<Message | null>(null);

  useEffect(() => {
    quotesApi.getAll().then(data => {
      setQuotes(data);
      if (data.length > 0) {
        const index = Math.floor(Math.random() * data.length);
        setRandomQuote(data[index]);
      }
    });
    messagesApi.getAll().then(data => {
      const arr = Array.isArray(data) ? data : [];
      setMessages(arr);
      if (arr.length > 0) {
        const index = Math.floor(Math.random() * arr.length);
        setRandomMessage(arr[index]);
      }
    });
  }, []);

  const refreshQuote = () => {
    if (quotes.length > 0) {
      const index = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[index]);
    }
  };

  const refreshMessage = () => {
    if (messages.length > 0) {
      const index = Math.floor(Math.random() * messages.length);
      setRandomMessage(messages[index]);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">你好，我是陈禾佳</h1>
          <p className="hero-subtitle">
            做一个认真而有趣的人
          </p>
          <p className="hero-description">
            这里是我的个人空间，分享我的视频创作和生活点滴。
            <br />
            希望这些画面能给你带来一些温暖和灵感。
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => onNavigate('videos')}>
              浏览视频作品
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('photos')}>
              查看生活相册
            </button>
          </div>
        </div>
      </section>

      {randomQuote && (
        <section className="random-quote">
          <div className="random-quote-card">
            <p className="random-quote-text">{randomQuote.content}</p>
            <div className="random-quote-footer">
              <div className="random-quote-info">
                {randomQuote.author && (
                  <span className="random-quote-author">—— {randomQuote.author}</span>
                )}
                {randomQuote.source && (
                  <span className="random-quote-source">{randomQuote.source}</span>
                )}
              </div>
              <div className="random-quote-actions">
                <button className="refresh-quote" onClick={refreshQuote} title="换一句">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4V9H9M20 20V15H15M4.5 15.5C5.5 18.5 8.5 21 12 21C16.4 21 20 17.4 20 13M19.5 8.5C18.5 5.5 15.5 3 12 3C7.6 3 4 6.6 4 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="more-quotes" onClick={() => onNavigate('quotes')}>
                  更多 →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {randomMessage && (
        <section className="random-message">
          <h2 className="section-title">访客留言</h2>
          <div className="random-message-card">
            <p className="random-message-text">{randomMessage.content}</p>
            <div className="random-message-footer">
              <span className="random-message-nickname">—— {randomMessage.nickname}</span>
              <div className="random-message-actions">
                <button className="refresh-message" onClick={refreshMessage} title="换一条">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4V9H9M20 20V15H15M4.5 15.5C5.5 18.5 8.5 21 12 21C16.4 21 20 17.4 20 13M19.5 8.5C18.5 5.5 15.5 3 12 3C7.6 3 4 6.6 4 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="more-messages" onClick={() => onNavigate('messages')}>
                  更多 →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="about">
        <h2 className="section-title">关于我</h2>
        <div className="about-content about-content-left">
          <p>
            我叫禾佳，目前在 University of Sydney 攻读计算机科学硕士。虽然本科是心理学专业，但我在研究生阶段逐渐转向软件开发与技术领域，希望未来成为一名全栈工程师，同时也对产品经理和产品设计充满兴趣。
          </p>
          <p>
            我喜欢把技术与创意结合在一起，经常尝试开发自己的应用和项目。例如，我正在设计一个任务管理工具，以及一套基于 DIKW 模型的知识管理系统，希望用技术整理思考、记录灵感，并构建属于自己的信息体系。除了编程，我也很关注界面设计和用户体验，希望做出既好用又有美感的软件产品。
          </p>
          <p>
            在学习和项目之外，我也喜欢探索生活中的各种可能性，比如做饭、旅行、滑雪、观看纪录片或剧情优秀的影视作品。我习惯独立完成任务，同时也乐于不断尝试新的想法和项目，希望一步步把自己的创意变成真实的产品。
          </p>
        </div>
      </section>
    </div>
  );
}
