/* eslint-disable max-len */

const fuckingCorpus = [
  "Realising you've got shit on your fingers is the first step to washing your hands.",
  'Space is too fucking big.',
  'Always good to have a penis in uniform in the room.',
  'God save us all from good looking men.',
  "You want a little ass-play, that's your business.",
  'As long as we keep comparing dicks, no-one will shoot.',
  'No-one likes a smart-ass.',
  "My life has become a single, ongoing revelation that I haven't been cynical enough.",
  "Stop busting my balls. I'm out of tea.",
  "Of course I want you to call me on my bullshit. That's what I pay you for.",
  "I don't give a fuck whose birthday it is, you make this happen before my meeting is over or I'll have you nuts for paperweights.",
  'You do good work. Someday you might get a real job.',
  'I know everything. This is a fucking test.',
  "Try not to put your dick in it. It's fucked enough already.",
  "Meow meow, cry, meow meow. That's all I heard you say.",
  'I have crates of anti-herpes drugs that are more legitimate than you are.',
  'Would you all please shut the fuck up?',
  "I have violated your privacy in ways you couldn't imagine.",
  'Shut the fuck up now, dear, the grown-up is talking.',
  'This is just an excuse to wave their cocks at each other.',
  'I do everything, and every second I talk to you costs ten thousand dollars.',
  "I'm sorry, did I seem to give a fuck? If I did, really, I was just being polite.",
  "We're off the clock now. You can stop blowing smoke up my ass.",
  'Sleep? Yes, I remember that vaguely.',
  'This was a cock-up from the start.',
  "You're an asshole and nobody loves you.",
  "He's a fucking busybody and he should stop putting his fingers in my shit.",
  'This sucks donkey balls.',
  "That man's asshole must be tight enough right now to bend space.",
  "He can't find his cock with both hands unless there's someone there to point him at it.",
  "I swear to god I'll have you turning tricks out of a prefab shed on the side of the highway.",
  "Sounds like piss. I'll take it.",
  'Life is too short for this shit.',
  'Screw it, I need a drink.',
  "I'm not someone you want to fuck with.",
  'No-one starts a war unless I say they can.',
  'Whoever the fuck you are, stand down and let her speak.',
  "A whisper will do, if that's all you can manage.",
  'WHEREVER I GODDAMN LIKE!',
  "Call me that again and I'll have an officer beat you gently with a cattle prod.",
  "Call me that again and I'll have an officer beat you gently with a cattle prod.",
  "Call me that again and I'll have an officer beat you gently with a cattle prod.", // This deserves extra weight
];

const bloodyRandomiser = () => {
  const goddamnIndex = Math.floor(fuckingCorpus.length * Math.random());
  return fuckingCorpus[goddamnIndex];
};

module.exports = bloodyRandomiser;
