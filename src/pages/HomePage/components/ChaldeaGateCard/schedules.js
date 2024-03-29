export const servantClasses = new Map([
  [
    "saber",
    {
      class: "Saber",
      icon: "/assets/classes/saber_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7001.png",
      monument: "https://static.atlasacademy.io/NA/Items/7101.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97014000_bordered.png"
    }
  ],
  [
    "archer",
    {
      class: "Archer",
      icon: "/assets/classes/archer_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7002.png",
      monument: "https://static.atlasacademy.io/NA/Items/7102.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97034000_bordered.png"
    }
  ],
  [
    "lancer",
    {
      class: "Lancer",
      icon: "/assets/classes/lancer_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7003.png",
      monument: "https://static.atlasacademy.io/NA/Items/7103.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97024000_bordered.png"
    }
  ],
  [
    "rider",
    {
      class: "Rider",
      icon: "/assets/classes/rider_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7004.png",
      monument: "https://static.atlasacademy.io/NA/Items/7104.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97044000_bordered.png"
    }
  ],
  [
    "caster",
    {
      class: "Caster",
      icon: "/assets/classes/caster_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7005.png",
      monument: "https://static.atlasacademy.io/NA/Items/7105.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97054000_bordered.png"
    }
  ],
  [
    "assassin",
    {
      class: "Assassin",
      icon: "/assets/classes/assassin_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7006.png",
      monument: "https://static.atlasacademy.io/NA/Items/7106.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97064000_bordered.png"
    }
  ],
  [
    "berserker",
    {
      class: "Berserker",
      icon: "/assets/classes/berserker_g.png",
      piece: "https://static.atlasacademy.io/NA/Items/7007.png",
      monument: "https://static.atlasacademy.io/NA/Items/7107.png",
      ember: "https://static.atlasacademy.io/NA/Faces/f_97074000_bordered.png"
    }
  ],
  [
    "random",
    {
      class: "Random",
      icon: "/assets/classes/question_g.png",
      piece: null,
      monument: null,
      ember: "/assets/randomEmber.png"
    }
  ]
]);

export const schedules = [
  {
    name: "Mon",
    training: servantClasses.get("archer"),
    embers: [
      servantClasses.get("assassin"),
      servantClasses.get("lancer"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Tue",
    training: servantClasses.get("lancer"),
    embers: [
      servantClasses.get("rider"),
      servantClasses.get("saber"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Wed",
    training: servantClasses.get("berserker"),
    embers: [
      servantClasses.get("caster"),
      servantClasses.get("archer"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Thu",
    training: servantClasses.get("rider"),
    embers: [
      servantClasses.get("lancer"),
      servantClasses.get("assassin"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Fri",
    training: servantClasses.get("caster"),
    embers: [
      servantClasses.get("saber"),
      servantClasses.get("rider"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Sat",
    training: servantClasses.get("assassin"),
    embers: [
      servantClasses.get("archer"),
      servantClasses.get("caster"),
      servantClasses.get("berserker")
    ]
  },
  {
    name: "Sun",
    training: servantClasses.get("saber"),
    embers: Array(3).fill(servantClasses.get("random"))
  }
];

export function findScheduleByDay(weekday) {
  return schedules.find(({ name }) => name === weekday);
}
