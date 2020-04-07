
const weightLimits = (weightClass) => {
  weightClasses = {
    'Flyweight': { kg: '57.5 and under'},
    'Featherweight': { kg: 64 },
    'Lightweight': { kg: 70 },
    'Welterweight': { kg: 76 },
    'Middleweight': { kg: 82.3 },
    'Cruiserweight': { kg: 88.3 },
    'Light-Heavyweight': { kg: 94.3 },
    'Heavyweight': { kg: 100.4 },
    'Super-Heavyweight': { kg: '100.5 and over' },
    "Absolute": { kg: 'Open Weight'}
  }
const kilos = weightClasses[weightClass].kg
const pounds = Math.round(kilos * 2.2)
return kilos
}

module.exports = {
  weightLimits
}
