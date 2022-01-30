//import styles from "./MasterMissionCard.module.css";
import WeeklyMissionCard from "./WeeklyMissionCard";
import LimitedMissionCard from "./LimitedMissionCard";

export default function MasterMissionCard({ data }) {
  const [weekly, ...limiteds] = data;

  return (
    <>
      <WeeklyMissionCard data={weekly} />
      {limiteds.map(data => (
        <LimitedMissionCard key={data.id} data={data} />
      ))}
    </>
  );
}
