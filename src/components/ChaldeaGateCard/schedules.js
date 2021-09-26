import spacetime from "spacetime";

export const servantClasses = new Map([
  [
    "saber",
    {
      class: "Saber",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_1.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7001.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7101.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97014000_bordered.png"
    }
  ],
  [
    "archer",
    {
      class: "Archer",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_2.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7002.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7102.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97034000_bordered.png"
    }
  ],
  [
    "lancer",
    {
      class: "Lancer",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_3.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7003.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7103.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97024000_bordered.png"
    }
  ],
  [
    "rider",
    {
      class: "Rider",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_4.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7004.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7104.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97044000_bordered.png"
    }
  ],
  [
    "caster",
    {
      class: "Caster",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_5.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7005.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7105.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97054000_bordered.png"
    }
  ],
  [
    "assassin",
    {
      class: "Assassin",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_6.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7006.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7106.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97064000_bordered.png"
    }
  ],
  [
    "berserker",
    {
      class: "Berserker",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_7.png",
      piece: "https://assets.atlasacademy.io/GameData/JP/Items/7007.png",
      monument: "https://assets.atlasacademy.io/GameData/JP/Items/7107.png",
      ember:
        "https://assets.atlasacademy.io/GameData/JP/Faces/f_97074000_bordered.png"
    }
  ],
  [
    "random",
    {
      class: "Random",
      icon: "https://assets.atlasacademy.io/GameData/JP/ClassIcons/class3_97.png",
      piece: null,
      monument: null,
      ember: "/assets/randomEmber.png"
    }
  ]
]);

export const schedules = [
  {
    name: "Mon",
    training: "archer",
    embers: ["lancer", "assassin", "berserker"]
  },
  {
    name: "Tue",
    training: "lancer",
    embers: ["saber", "rider", "berserker"]
  },
  {
    name: "Wed",
    training: "berserker",
    embers: ["archer", "caster", "berserker"]
  },
  {
    name: "Thu",
    training: "rider",
    embers: ["lancer", "assassin", "berserker"]
  },
  {
    name: "Fri",
    training: "caster",
    embers: ["saber", "rider", "berserker"]
  },
  {
    name: "Sat",
    training: "assassin",
    embers: ["archer", "caster", "berserker"]
  },
  {
    name: "Sun",
    training: "saber",
    embers: Array(3).fill("random")
  }
];

export function getWeekday(interval) {
  return spacetime(interval, "utc").format("day-short");
}

export function findAndMapDay(weekday) {
  const { name, training, embers } = schedules.find(
    ({ name }) => name === weekday
  );

  return {
    name,
    training: servantClasses.get(training),
    embers: embers.map(className => servantClasses.get(className))
  };
}
