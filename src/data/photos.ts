import type { Photo } from '../types';

export const photos: Photo[] = [
  {
    id: '1',
    title: 'Happt St.Patrick\'s Day',
    description: '祝大家St.Patrick\'s Day快乐！',
    images: [
      '/photos/IMG_4042.jpeg',
      '/photos/IMG_3884.jpeg',
      '/photos/IMG_3899.jpeg',
    ],
    date: '2026-03-15',
  },
  {
    id: '2',
    title: '海边日落',
    description: '夏天的傍晚，坐在海边看日落。天空被染成了橙红色，海浪轻轻拍打着沙滩，这一刻，时间仿佛静止了。',
    images: [
      'https://picsum.photos/seed/photo2a/800/600',
      'https://picsum.photos/seed/photo2b/800/600',
    ],
    date: '2024-03-10',
  },
  {
    id: '3',
    title: '城市街角',
    description: '雨后的城市，空气格外清新。路边的咖啡店飘出阵阵香气，玻璃窗上还挂着水珠，映射出斑斓的光影。',
    images: [
      'https://picsum.photos/seed/photo3a/800/600',
      'https://picsum.photos/seed/photo3b/800/600',
      'https://picsum.photos/seed/photo3c/800/600',
      'https://picsum.photos/seed/photo3d/800/600',
    ],
    date: '2024-03-05',
  },
  {
    id: '4',
    title: '山间小路',
    description: '周末去爬山，走在林间小路上，阳光透过树叶洒下来，形成一道道光斑。深呼吸，满是泥土和青草的气息。',
    images: [
      'https://picsum.photos/seed/photo4a/800/600',
      'https://picsum.photos/seed/photo4b/800/600',
    ],
    date: '2024-02-28',
  },
  {
    id: '5',
    title: '午后阅读',
    description: '难得的休息日，窝在沙发上看书。阳光透过窗帘洒进来，猫咪在脚边打盹，这就是我理想中的生活。',
    images: [
      'https://picsum.photos/seed/photo5a/800/600',
    ],
    date: '2024-02-20',
  },
  {
    id: '6',
    title: '夜市美食',
    description: '逛夜市是我最喜欢的活动之一。各种小吃的香气扑鼻而来，热闹的人群，闪烁的灯光，充满了烟火气。',
    images: [
      'https://picsum.photos/seed/photo6a/800/600',
      'https://picsum.photos/seed/photo6b/800/600',
      'https://picsum.photos/seed/photo6c/800/600',
    ],
    date: '2024-02-15',
  },
];
