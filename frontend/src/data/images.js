export const AppImages = {
  steppe:
    'https://images.unsplash.com/photo-1592303166784-4b7ceb49c5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  hills:
    'https://images.unsplash.com/photo-1751255593200-87d5abfe1bc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  gerYellow:
    'https://images.unsplash.com/photo-1695554477492-303aacd40561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  gerWood:
    'https://images.unsplash.com/photo-1695554548143-7c3d0e6510cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  lakeReflect:
    'https://images.unsplash.com/photo-1742205024877-cc32e30dafcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  snowLake:
    'https://images.unsplash.com/photo-1742205024400-f61276a39c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  lakeVillage:
    'https://images.unsplash.com/photo-1773658949441-76d4fb11412f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  camelDesert:
    'https://images.unsplash.com/photo-1649357028504-ffc3c1976fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  foodBowls:
    'https://images.unsplash.com/photo-1746716447103-e1618bbd0669?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  guide1:
    'https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  guide2:
    'https://images.unsplash.com/photo-1723423694242-4bdb9f39a266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  guide3:
    'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  guide4:
    'https://images.unsplash.com/photo-1597518953137-6526cdf61ac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  guide5:
    'https://images.unsplash.com/photo-1676445708961-adf92f887170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
};

export const categoryTabs = [
  'Trending',
  'Hotel & Camp',
  'Foods',
  'Guides',
  'Nature',
  'City',
  'History',
];

export const categoryKeyMap = {
  Trending: 'trending',
  'Hotel & Camp': 'hotel',
  Foods: 'foods',
  Guides: 'guides',
  Nature: 'nature',
  City: 'city',
  History: 'history',
};

export const categoryBlocks = [
  {
    key: 'trending',
    title: 'Trending',
    subtitle: 'Most-loved stays this season',
    count: '128 places',
    image: AppImages.hills,
    side: 'right',
    chips: ['Ger camps', 'Horse riding'],
  },
  {
    key: 'hotel',
    title: 'Hotel & Camp',
    subtitle: 'Lodges, camps & boutique stays',
    count: '212 places',
    image: AppImages.lakeReflect,
    side: 'left',
    chips: ['Lake view', 'Sauna'],
  },
  {
    key: 'foods',
    title: 'Foods',
    subtitle: 'Taste real Mongolian flavours',
    count: '64 experiences',
    image: AppImages.foodBowls,
    side: 'right',
    chips: ['Cooking', 'Food tours'],
  },
  {
    key: 'guides',
    title: 'Guides',
    subtitle: 'Explore Mongolia with local experts',
    count: 'Verified local guides',
    image: AppImages.guide1,
    side: 'left',
    chips: ['Local experts', 'Verified'],
  },
];
