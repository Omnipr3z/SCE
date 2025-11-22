TextManager.title_battle    = "Skirmish";
TextManager.title_lore      = "Codex";
TextManager.title_credit    = "Credits";
TextManager.getTextPhrase  = function() {
    var phrases = [
        "In the grim darkness of the far future, there is only war.",
        "For the Emperor!",
        "Knowledge is power, guard it well.",
        "The Emperor protects.",
        "Hope is the first step on the road to disappointment.",
        "The blood of martyrs is the seed of the holy empire.",
        "Without pain, how could we know joy?",
        "The dead tell no tales, but the living do.",
        "In war, truth is the first casualty.",
        "The more things change, the more they stay the same.",
        "What is forbidden to one is forbidden to all.",
        "The ends justify the means.",
        "Trust in the Emperor, and He shall guide your path.",
        "Discipline is the soul of an army.",
        "A single death is a tragedy; a million deaths is a statistic.",
        "To know the enemy, you must become the enemy.",
        "Courage is found in unlikely places.",
        "The greatest victory is that which requires no battle.",
        "In the face of overwhelming odds, true courage shines brightest.",
        "The future belongs to those who prepare for it today.",
        "All that is necessary for the triumph of evil is that good men do nothing.",
        "The wise man learns more from his enemies than the fool from his friends.",
        "A journey of a thousand miles begins with a single step.",
        "The only thing necessary for the triumph of evil is for good men to do nothing.",
        "Even the smallest person can change the course of the future.",
        "The darkest hour is just before the dawn."
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
}