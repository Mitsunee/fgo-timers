//import styles from "./MasterMissionCard.module.css";
import LimitedMissionCard from "./LimitedMissionCard";
import WeeklyMissionCard from "./WeeklyMissionCard";

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
