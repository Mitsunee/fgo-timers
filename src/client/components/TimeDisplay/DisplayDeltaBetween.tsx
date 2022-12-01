import spacetime from "spacetime";

interface DisplayDeltaBetweenProps {
  time: number;
  from: number;
}

export function DisplayDeltaBetween({ time, from }: DisplayDeltaBetweenProps) {
  const { days, hours, minutes, seconds } = spacetime(from).diff(
    spacetime(time)
  );

  return seconds <= 0 ? (
    <>---</>
  ) : (
    <>
      {days == 0 ? "" : `${days}d `}
      {hours == 0 ? "" : `${hours % 24}h `}
      {`${minutes % 60}m ${seconds % 60}s`}
    </>
  );
}
