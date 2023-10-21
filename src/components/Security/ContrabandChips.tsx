import { Chip } from '@nextui-org/react';

export default function ContrabandChips({
  contraband,
  displayText,
}: {
  contraband: any;
  displayText: boolean;
}) {
  return (
    <>
      {contraband.electronic_device ? (
        <Chip variant="dot" classNames={{ dot: 'bg-[#f38ba8]' }}>
          {displayText ? 'Electronic Device × ' : null}
          {contraband?.electronic_device}
        </Chip>
      ) : null}
      {contraband.laptop ? (
        <Chip variant="dot" classNames={{ dot: 'bg-[#f9e2af]' }}>
          {displayText ? 'Laptop × ' : null}
          {contraband?.laptop}
        </Chip>
      ) : null}
      {contraband.scissors ? (
        <Chip variant="dot" classNames={{ dot: 'bg-[#94e2d5]' }}>
          {displayText ? 'Scissors × ' : null}
          {contraband?.scissors}
        </Chip>
      ) : null}
      {contraband.knife ? (
        <Chip variant="dot" classNames={{ dot: 'bg-[#74c7ec]' }}>
          {displayText ? 'Knife × ' : null}
          {contraband?.knife}
        </Chip>
      ) : null}
      {contraband.gun ? (
        <Chip variant="dot" classNames={{ dot: 'bg-[#b4befe]' }}>
          {displayText ? 'Gun × ' : null}
          {contraband?.gun}
        </Chip>
      ) : null}
    </>
  );
}
