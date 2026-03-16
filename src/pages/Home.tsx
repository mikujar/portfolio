import { useState, useEffect } from 'react';
import { quotesApi } from '../api';
import type { Page, Quote } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

  useEffect(() => {
    quotesApi.getAll().then(data => {
      setQuotes(data);
      if (data.length > 0) {
        const index = Math.floor(Math.random() * data.length);
        setRandomQuote(data[index]);
      }
    });
  }, []);

  const refreshQuote = () => {
    if (quotes.length > 0) {
      const index = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[index]);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">你好，我是陈禾佳</h1>
          <p className="hero-subtitle">
            用镜头记录生活，用影像讲述故事
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

      <section className="about">
        <h2 className="section-title">关于我</h2>
        <div className="about-content">
          <p>
            热爱摄影和视频创作，喜欢用镜头捕捉生活中的美好瞬间。<br />
            无论是旅途中的风景，还是日常生活的小确幸，我都想把它们记录下来。
          </p>
          <p>
            这个网站是我的数字花园，收藏着我的作品和回忆。<br />
            感谢你的来访，希望你能在这里找到一些触动心灵的内容。
          </p>
        </div>
      </section>
    </div>
  );
}
