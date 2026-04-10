// Generate warna random dengan tone gelap agar tidak terlalu mencolok
export const getFilmColor = (_title: string): string => {
  const colors = [
    "from-blue-950 to-blue-900",
    "from-purple-950 to-purple-900",
    "from-green-950 to-green-900",
    "from-red-950 to-red-900",
    "from-yellow-950 to-yellow-900",
    "from-pink-950 to-pink-900",
    "from-indigo-950 to-indigo-900",
    "from-teal-950 to-teal-900",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};