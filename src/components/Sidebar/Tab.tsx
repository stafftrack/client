import Link from 'next/link';

interface Props {
  isSelected: boolean;
  link: string;
  children: React.ReactNode;
}

export default function Tab({ isSelected, link, children }: Props) {
  return (
    <Link
      href={link}
      className={`flex w-60 items-center gap-5 rounded-lg px-5 py-3 text-lg font-medium ${
        isSelected ? 'bg-[#FFFFFF1A]' : ''
      }`}
    >
      {children}
    </Link>
  );
}
