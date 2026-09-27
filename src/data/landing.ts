export interface Item {
  id: string;
  name: string;
  status: 'lost' | 'found';
  category: string;
  location: string;
  date: string;
  image?: string;
}

export const mockItems: Item[] = [
  {
    id: '1',
    name: 'Black Wallet',
    status: 'lost',
    category: 'Personal Items',
    location: 'Library',
    date: '2026-09-25',
  },
  {
    id: '2',
    name: 'Blue Water Bottle',
    status: 'found',
    category: 'Accessories',
    location: 'Cafeteria',
    date: '2026-09-24',
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    status: 'lost',
    category: 'Electronics',
    location: 'Academic Block',
    date: '2026-09-23',
  },
  {
    id: '4',
    name: 'Student ID Card',
    status: 'found',
    category: 'Personal Items',
    location: 'Sports Complex',
    date: '2026-09-22',
  },
];

export const capabilities = [
  'Report Lost Items',
  'Report Found Items',
  'Search Everything',
  'Filter by Location',
  'Track Your Reports',
  'Connect Safely',
];

export const valueSections = [
  {
    number: '01',
    eyebrow: 'REPORT',
    heading: 'Turn a lost item into a searchable report.',
    copy: 'Add the details that matter and make your lost or found item visible to the campus community.',
    reverse: false,
  },
  {
    number: '02',
    eyebrow: 'SEARCH',
    heading: 'Search instead of asking everywhere.',
    copy: 'Browse reports by category, location, status, and date from one organized place.',
    reverse: true,
  },
  {
    number: '03',
    eyebrow: 'RECONNECT',
    heading: 'Help belongings find their way home.',
    copy: 'Connect with the right person and make returning an item simpler.',
    reverse: false,
  },
];