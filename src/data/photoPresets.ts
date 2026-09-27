import imgLibrary from '../assets/images/school_library_modern_1790479783471.jpg';
import imgBookshelf from '../assets/images/school_bookshelf_corner_1790480242754.jpg';
import imgMakerspace from '../assets/images/school_makerspace_lab_1790479796547.jpg';
import imgArtRoom from '../assets/images/school_art_craft_room_1790480257548.jpg';
import imgScience from '../assets/images/school_science_lab_1790479810446.jpg';
import imgGym from '../assets/images/school_gymnasium_hall_1790479825022.jpg';

export interface PhotoPreset {
  id: string;
  name: string;
  floor: 1 | 2 | 3 | 4;
  url: string;
  tag: string;
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: 'preset-library-1',
    name: '1층 도서관 (전체 책장과 소파)',
    floor: 1,
    url: imgLibrary,
    tag: '도서관',
  },
  {
    id: 'preset-library-2',
    name: '1층 도서관 (그림책 코너와 노란 방석)',
    floor: 1,
    url: imgBookshelf,
    tag: '독서 코너',
  },
  {
    id: 'preset-makerspace',
    name: '2층 메이커스페이스 & 컴퓨터실',
    floor: 2,
    url: imgMakerspace,
    tag: '컴퓨터실',
  },
  {
    id: 'preset-art-room',
    name: '3층 알록달록 미술실 & 만들기 교실',
    floor: 3,
    url: imgArtRoom,
    tag: '미술실',
  },
  {
    id: 'preset-science',
    name: '3층 신기한 과학실험실 (현미경)',
    floor: 3,
    url: imgScience,
    tag: '과학실',
  },
  {
    id: 'preset-gym',
    name: '4층 넓은 강당 & 실내 체육관',
    floor: 4,
    url: imgGym,
    tag: '체육관',
  },
];
