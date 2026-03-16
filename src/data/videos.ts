import type { Video } from '../types';

export const videoCategories = ['全部', '动漫', '生活', '影视', '其他'];

export const videos: Video[] = [
  {
    id: '1',
    title: '那年初夏，已经越来越远',
    description: '曾许下的心愿，全部都没有实现',
    thumbnail: '/thumbnails/1.jpg',
    videoUrl: '/videos/1.mp4',
    category: '动漫',
    date: '2024-03-01',
  },
  {
    id: '2',
    title: '因为你存在的时光',
    description: ' Because of you',
    thumbnail: '/thumbnails/2.jpg',
    videoUrl: '/videos/2.mp4',
    category: '动漫',
    date: '2024-02-15',
  },
  {
    id: '3',
    title: '花瓣的游行',
    description: '可花朵 恋情 甚至声音全都被带走一空',
    thumbnail: '/thumbnails/3.jpg',
    videoUrl: '/videos/3.mp4',
    category: '动漫',
    date: '2024-02-01',
  },
  {
    id: '4',
    title: '爱的附属品',
    description: '一面努力爱着，一面怀疑明天',
    thumbnail: '/thumbnails/4.jpg',
    videoUrl: '/videos/4.mp4',
    category: '动漫',
    date: '2024-01-20',
  },
  {
    id: '5',
    title: '在这梦醒来前',
    description: '平家物语',
    thumbnail: '/thumbnails/5.jpg',
    videoUrl: '/videos/5.mp4',
    category: '动漫',
    date: '2024-01-10',
  },
  {
    id: '6',
    title: '2025年度回顾',
    description: '澳大利亚留学生活',
    thumbnail: '/thumbnails/6.jpeg',
    videoUrl: '/videos/6.mov',
    category: '生活',
    date: '2023-12-25',
  },
];
