import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Home, BookOpen, Volume2, VolumeX } from "lucide-react";
import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import bearFace from "@/assets/icons/bear-face.png";
import bgClouds from "@/assets/bg-clouds.jpg";

export const Route = createFileRoute("/animal-kingdom")({
  head: () => ({
    meta: [
      { title: "Animal Kingdom — Melly Kids TV" },
      { name: "description", content: "Explore the Animal Kingdom — Land, Birds, Water, Reptiles, Dinosaurs, Amphibians and Insects with fun facts." },
    ],
  }),
  component: AnimalKingdom,
});

/* ---------- Helpers ---------- */
// Fluent Emoji 3D CDN. Falls back to native emoji on error.
const fluent3d = (folder: string, slug?: string) =>
  `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${encodeURIComponent(folder)}/3D/${slug ?? folder.toLowerCase().replace(/[\s-]+/g, "_")}_3d.png`;

type Animal = {
  name: string;
  emoji: string;
  img: string;
  facts: string[];
};

type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string; // tile color class
  animals: Animal[];
};

/* ---------- Animal Data ---------- */
const LAND: Animal[] = [
  { name: "Lion",        emoji: "🦁", img: fluent3d("Lion"),                          facts: ["Lions live in groups called prides.", "A lion's roar can be heard up to 8 km away!"] },
  { name: "Elephant",    emoji: "🐘", img: fluent3d("Elephant"),                      facts: ["Elephants are the largest land animals on Earth.", "They use their long trunks to drink, eat and hug!"] },
  { name: "Giraffe",     emoji: "🦒", img: fluent3d("Giraffe"),                       facts: ["Giraffes are the tallest animals in the world.", "Their tongues are blue-purple and 50 cm long!"] },
  { name: "Tiger",       emoji: "🐯", img: fluent3d("Tiger"),                         facts: ["Every tiger has a unique stripe pattern.", "Tigers love water and are great swimmers!"] },
  { name: "Panda",       emoji: "🐼", img: fluent3d("Panda"),                         facts: ["Pandas eat bamboo for up to 12 hours a day!", "Baby pandas are born pink and tiny."] },
  { name: "Zebra",       emoji: "🦓", img: fluent3d("Zebra"),                         facts: ["No two zebras have the same stripe pattern.", "Zebras live in herds for safety."] },
  { name: "Fox",         emoji: "🦊", img: fluent3d("Fox"),                           facts: ["Foxes have excellent hearing.", "They can hear small animals digging underground!"] },
  { name: "Wolf",        emoji: "🐺", img: fluent3d("Wolf"),                          facts: ["Wolves live and hunt in packs.", "They howl to talk to each other."] },
  { name: "Koala",       emoji: "🐨", img: fluent3d("Koala"),                         facts: ["Koalas sleep up to 20 hours a day!", "They only eat eucalyptus leaves."] },
  { name: "Kangaroo",    emoji: "🦘", img: fluent3d("Kangaroo"),                      facts: ["Kangaroos can't walk backwards.", "Babies are called joeys and live in a pouch."] },
  { name: "Rhinoceros",  emoji: "🦏", img: fluent3d("Rhinoceros"),                    facts: ["Rhinos have thick, armor-like skin.", "Their horns are made of keratin like our hair!"] },
  { name: "Hippo",       emoji: "🦛", img: fluent3d("Hippopotamus"),                  facts: ["Hippos can hold their breath for 5 minutes underwater.", "They are surprisingly fast runners."] },
  { name: "Leopard",     emoji: "🐆", img: fluent3d("Leopard"),                       facts: ["Leopards are strong climbers.", "They often carry their food up into trees."] },
  { name: "Llama",       emoji: "🦙", img: fluent3d("Llama"),                         facts: ["Llamas are very social animals.", "They hum to communicate with each other."] },
  { name: "Hedgehog",    emoji: "🦔", img: fluent3d("Hedgehog"),                      facts: ["Hedgehogs roll into a spiky ball when scared.", "They have around 5,000 spines!"] },
  { name: "Polar Bear",  emoji: "🐻‍❄️", img: fluent3d("Polar bear", "polar_bear"),    facts: ["Polar bears have black skin under white fur.", "They are excellent swimmers in icy water."] },
  { name: "Deer",        emoji: "🦌", img: fluent3d("Deer"),                          facts: ["Male deer grow new antlers every year.", "Deer can leap as high as 3 meters!"] },
  { name: "Cheetah",     emoji: "🐆", img: fluent3d("Leopard"),                       facts: ["Cheetahs are the fastest land animals.", "They can run up to 110 km/h!"] },
  { name: "Monkey",      emoji: "🐵", img: fluent3d("Monkey face", "monkey_face"),    facts: ["Monkeys use their tails to balance.", "They love bananas and fresh fruit!"] },
  { name: "Bear",        emoji: "🐻", img: fluent3d("Bear"),                          facts: ["Bears sleep through winter — it's called hibernation.", "Cubs stay with their mother for up to 3 years."] },
  { name: "Camel",       emoji: "🐫", img: fluent3d("Two-hump camel", "two-hump_camel"), facts: ["Camels store fat (not water!) in their humps.", "They can go a week without drinking."] },
  { name: "Horse",       emoji: "🐴", img: fluent3d("Horse"),                         facts: ["Horses can sleep standing up.", "They've been friends with humans for 5,000 years!"] },
  { name: "Cow",         emoji: "🐮", img: fluent3d("Cow face", "cow_face"),          facts: ["Cows have best friends and get sad apart.", "They give us yummy milk every day."] },
  { name: "Pig",         emoji: "🐷", img: fluent3d("Pig face", "pig_face"),          facts: ["Pigs are very smart — smarter than dogs!", "They love to roll in mud to stay cool."] },
  { name: "Sheep",       emoji: "🐑", img: fluent3d("Ewe"),                            facts: ["Sheep give us soft wool for sweaters.", "They love to graze in green fields."] },
  { name: "Rabbit",      emoji: "🐰", img: fluent3d("Rabbit face", "rabbit_face"),    facts: ["Rabbits' teeth never stop growing.", "They can jump as high as 1 meter!"] },
  { name: "Squirrel",    emoji: "🐿️", img: fluent3d("Chipmunk"),                      facts: ["Squirrels bury nuts and forget where!", "Forgotten nuts grow into new trees."] },
  { name: "Mouse",       emoji: "🐭", img: fluent3d("Mouse face", "mouse_face"),      facts: ["Mice love cheese in cartoons, but really love seeds.", "Their tails help them balance."] },
  { name: "Skunk",       emoji: "🦨", img: fluent3d("Skunk"),                          facts: ["Skunks spray a stinky smell when scared.", "Their spray can reach up to 3 meters!"] },
  { name: "Sloth",       emoji: "🦥", img: fluent3d("Sloth"),                          facts: ["Sloths are the slowest mammals in the world.", "They sleep up to 18 hours a day!"] },
];

const BIRDS: Animal[] = [
  { name: "Eagle",      emoji: "🦅", img: fluent3d("Eagle"),                          facts: ["Eagles have super sharp eyesight.", "They can spot food from 3 km up in the sky!"] },
  { name: "Parrot",     emoji: "🦜", img: fluent3d("Parrot"),                         facts: ["Parrots can copy human words!", "Some parrots live for 80 years."] },
  { name: "Flamingo",   emoji: "🦩", img: fluent3d("Flamingo"),                       facts: ["Flamingos turn pink from the food they eat.", "They love to stand on one leg!"] },
  { name: "Penguin",    emoji: "🐧", img: fluent3d("Penguin"),                        facts: ["Penguins can't fly but are amazing swimmers.", "They huddle together to stay warm."] },
  { name: "Peacock",    emoji: "🦚", img: fluent3d("Peacock"),                        facts: ["Peacocks open their feathers like a giant fan.", "Only male peacocks have the colorful tail!"] },
  { name: "Duck",       emoji: "🦆", img: fluent3d("Duck"),                           facts: ["Ducks have waterproof feathers.", "Baby ducks follow their mom in a line."] },
  { name: "Owl",        emoji: "🦉", img: fluent3d("Owl"),                            facts: ["Owls can turn their heads almost all the way around!", "They hunt silently at night."] },
  { name: "Sparrow",    emoji: "🐦", img: fluent3d("Bird"),                           facts: ["Sparrows live almost everywhere in the world.", "They love to chirp early in the morning."] },
  { name: "Woodpecker", emoji: "🐦", img: fluent3d("Bird"),                           facts: ["Woodpeckers peck wood to find tasty insects.", "They can peck 20 times per second!"] },
  { name: "Rooster",    emoji: "🐓", img: fluent3d("Rooster"),                        facts: ["Roosters crow to wake up the farm!", "They have bright red combs on their heads."] },
  { name: "Stork",      emoji: "🪿", img: fluent3d("Goose"),                          facts: ["Storks have long legs for wading in water.", "They build huge nests on rooftops!"] },
  { name: "Swan",       emoji: "🦢", img: fluent3d("Swan"),                           facts: ["Swans mate for life with one partner.", "They glide gracefully on lakes."] },
  { name: "Turkey",     emoji: "🦃", img: fluent3d("Turkey"),                         facts: ["Turkeys can run fast — up to 40 km/h!", "They make a funny gobble sound."] },
  { name: "Dodo",       emoji: "🦤", img: fluent3d("Dodo"),                           facts: ["The dodo bird couldn't fly.", "Sadly, dodos went extinct long ago."] },
  { name: "Hen",        emoji: "🐔", img: fluent3d("Chicken"),                        facts: ["Hens lay yummy eggs every day.", "Baby chickens are called chicks!"] },
  { name: "Hatching Chick", emoji: "🐣", img: fluent3d("Hatching chick", "hatching_chick"), facts: ["Chicks hatch out of eggs.", "They peep softly to call their mom."] },
  { name: "Baby Chick", emoji: "🐤", img: fluent3d("Baby chick", "baby_chick"),       facts: ["Baby chicks are bright yellow and fluffy.", "They follow their mother everywhere."] },
];

const WATER: Animal[] = [
  { name: "Dolphin",    emoji: "🐬", img: fluent3d("Dolphin"),                        facts: ["Dolphins are very smart and playful.", "They talk to each other using clicks and whistles!"] },
  { name: "Shark",      emoji: "🦈", img: fluent3d("Shark"),                          facts: ["Sharks have rows and rows of sharp teeth.", "They've lived in the ocean for 400 million years!"] },
  { name: "Turtle",     emoji: "🐢", img: fluent3d("Turtle"),                         facts: ["Sea turtles can live over 100 years.", "They carry their home — a shell — on their back."] },
  { name: "Seal",       emoji: "🦭", img: fluent3d("Seal"),                           facts: ["Seals can hold their breath underwater for 30 minutes.", "They clap their flippers when happy!"] },
  { name: "Otter",      emoji: "🦦", img: fluent3d("Otter"),                          facts: ["Otters hold hands while sleeping so they don't drift apart.", "They love to crack open shells with rocks."] },
  { name: "Octopus",    emoji: "🐙", img: fluent3d("Octopus"),                        facts: ["Octopuses have 3 hearts and 8 arms!", "They can change color to hide."] },
  { name: "Clownfish",  emoji: "🐠", img: fluent3d("Tropical fish", "tropical_fish"), facts: ["Clownfish live safely inside stingy anemones.", "Nemo from the movie is a clownfish!"] },
  { name: "Blue Whale", emoji: "🐳", img: fluent3d("Spouting whale", "spouting_whale"), facts: ["Blue whales are the biggest animals ever!", "Their hearts are as big as a small car."] },
  { name: "Seahorse",   emoji: "🐡", img: fluent3d("Pufferfish"),                     facts: ["Daddy seahorses carry the babies!", "They swim standing up."] },
  { name: "Goldfish",   emoji: "🐟", img: fluent3d("Fish"),                           facts: ["Goldfish can recognize their owners.", "They make great first pets!"] },
  { name: "Pufferfish", emoji: "🐡", img: fluent3d("Pufferfish"),                     facts: ["Pufferfish puff up like a spiky balloon!", "They do this to scare away enemies."] },
  { name: "Crab",       emoji: "🦀", img: fluent3d("Crab"),                           facts: ["Crabs walk sideways across the sand.", "They have tough shells to protect them."] },
  { name: "Lobster",    emoji: "🦞", img: fluent3d("Lobster"),                        facts: ["Lobsters have two big claws.", "They can live for over 50 years!"] },
  { name: "Shrimp",     emoji: "🦐", img: fluent3d("Shrimp"),                         facts: ["Shrimp can swim backwards super fast.", "They live in oceans all over the world."] },
  { name: "Squid",      emoji: "🦑", img: fluent3d("Squid"),                          facts: ["Squids have ten arms!", "They squirt black ink to escape predators."] },
  { name: "Jellyfish",  emoji: "🪼", img: fluent3d("Jellyfish"),                      facts: ["Jellyfish have no brain or bones!", "Some glow softly in the dark sea."] },
  { name: "Whale",      emoji: "🐋", img: fluent3d("Whale"),                          facts: ["Whales sing long, beautiful underwater songs.", "Baby whales drink lots of milk to grow big."] },
  { name: "Tropical Fish", emoji: "🐠", img: fluent3d("Tropical fish", "tropical_fish"), facts: ["Coral reefs are full of bright tropical fish.", "Each one has amazing colors and patterns."] },
  { name: "Blowfish",   emoji: "🐡", img: fluent3d("Pufferfish"),                     facts: ["Blowfish blow up like a balloon when scared.", "They are also called pufferfish."] },
  { name: "Fish",       emoji: "🐟", img: fluent3d("Fish"),                           facts: ["Fish breathe underwater using gills.", "There are over 30,000 kinds of fish!"] },
];

const REPTILES: Animal[] = [
  { name: "Crocodile",  emoji: "🐊", img: fluent3d("Crocodile"),                      facts: ["Crocodiles have been around since dinosaur times!", "They have the strongest bite of any animal."] },
  { name: "Lizard",     emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Lizards can sometimes drop their tails to escape!", "Geckos can even walk upside down."] },
  { name: "Snake",      emoji: "🐍", img: fluent3d("Snake"),                          facts: ["Snakes smell with their flicking tongues.", "They shed their skin as they grow."] },
  { name: "Alligator",  emoji: "🐊", img: fluent3d("Crocodile"),                      facts: ["Alligators have wide, U-shaped snouts.", "Babies make tiny squeaks to call their mom."] },
  { name: "Turtle",     emoji: "🐢", img: fluent3d("Turtle"),                         facts: ["Turtles hide inside their shells when scared.", "Some live over 150 years!"] },
  { name: "Chameleon",  emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Chameleons change color to show feelings.", "Their eyes can look in two directions at once!"] },
  { name: "Iguana",     emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Iguanas love to bask in the sun.", "They are excellent swimmers and climbers."] },
  { name: "Gecko",      emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Geckos can stick to walls and ceilings.", "They chirp like little birds!"] },
  { name: "Komodo Dragon", emoji: "🐉", img: fluent3d("Lizard"),                      facts: ["Komodo dragons are the largest lizards on Earth.", "They can grow up to 3 meters long!"] },
  { name: "Tortoise",   emoji: "🐢", img: fluent3d("Turtle"),                         facts: ["Tortoises live entirely on land.", "They are the longest-living land animals."] },
  { name: "Cobra",      emoji: "🐍", img: fluent3d("Snake"),                          facts: ["Cobras puff out their hoods to look big.", "They sway to the music of snake charmers."] },
  { name: "Python",     emoji: "🐍", img: fluent3d("Snake"),                          facts: ["Pythons squeeze their prey to catch it.", "They can be 6 meters long!"] },
];

const DINOSAURS: Animal[] = [
  { name: "T-Rex",          emoji: "🦖", img: fluent3d("T-Rex", "t-rex"),             facts: ["T-Rex was a huge meat-eating dinosaur.", "It had tiny arms but giant sharp teeth!"] },
  { name: "Brachiosaurus",  emoji: "🦕", img: fluent3d("Sauropod"),                   facts: ["Brachiosaurus had a super long neck.", "It ate leaves from the tops of tall trees."] },
  { name: "Pterodactyl",    emoji: "🦅", img: fluent3d("Eagle"),                      facts: ["Pterodactyls were flying reptiles!", "They had wide wings and sharp beaks."] },
  { name: "Triceratops",    emoji: "🦏", img: fluent3d("Rhinoceros"),                 facts: ["Triceratops had 3 horns on its head!", "It used a bony frill like a shield."] },
  { name: "Stegosaurus",    emoji: "🦕", img: fluent3d("Sauropod"),                   facts: ["Stegosaurus had bony plates along its back.", "Its spiky tail kept it safe from enemies."] },
  { name: "Velociraptor",   emoji: "🦖", img: fluent3d("T-Rex", "t-rex"),             facts: ["Velociraptors were fast and smart hunters.", "They had a big curved claw on each foot."] },
  { name: "Spinosaurus",    emoji: "🦖", img: fluent3d("T-Rex", "t-rex"),             facts: ["Spinosaurus had a giant sail on its back.", "It loved to catch fish in rivers!"] },
  { name: "Diplodocus",     emoji: "🦕", img: fluent3d("Sauropod"),                   facts: ["Diplodocus had a very long whip-like tail.", "It could be 27 meters long!"] },
  { name: "Ankylosaurus",   emoji: "🦕", img: fluent3d("Sauropod"),                   facts: ["Ankylosaurus had a heavy club on its tail.", "Its back was covered in bony armor."] },
  { name: "Parasaurolophus", emoji: "🦕", img: fluent3d("Sauropod"),                  facts: ["This dinosaur had a long crest on its head.", "It used the crest to make trumpet sounds!"] },
];

const AMPHIBIANS: Animal[] = [
  { name: "Frog",       emoji: "🐸", img: fluent3d("Frog"),                           facts: ["Frogs catch bugs with their sticky tongues.", "Baby frogs are called tadpoles!"] },
  { name: "Toad",       emoji: "🐸", img: fluent3d("Frog"),                           facts: ["Toads have bumpy, dry skin.", "They hop on land more than they swim."] },
  { name: "Salamander", emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Salamanders can regrow lost tails and even legs!", "They love damp, cool places."] },
  { name: "Newt",       emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Newts live both in water and on land.", "They wiggle like little dragons!"] },
  { name: "Axolotl",    emoji: "🦎", img: fluent3d("Lizard"),                         facts: ["Axolotls have feathery gills on their heads.", "They keep their baby looks their whole life!"] },
  { name: "Tree Frog",  emoji: "🐸", img: fluent3d("Frog"),                           facts: ["Tree frogs have sticky toes for climbing.", "Many are bright green to hide in leaves."] },
];

const INSECTS: Animal[] = [
  { name: "Butterfly",  emoji: "🦋", img: fluent3d("Butterfly"),                      facts: ["Butterflies taste with their feet!", "They start life as caterpillars."] },
  { name: "Honey Bee",  emoji: "🐝", img: fluent3d("Honeybee"),                       facts: ["Bees make sweet honey from flowers.", "They dance to tell friends where flowers are!"] },
  { name: "Ladybug",    emoji: "🐞", img: fluent3d("Lady beetle", "lady_beetle"),     facts: ["Ladybugs eat tiny garden pests.", "Their spots help scare away birds."] },
  { name: "Ant",        emoji: "🐜", img: fluent3d("Ant"),                            facts: ["Ants can carry 50 times their own weight!", "They live in big underground cities."] },
  { name: "Spider",     emoji: "🕷️", img: fluent3d("Spider"),                         facts: ["Spiders spin beautiful silky webs.", "They have 8 legs and 8 eyes!"] },
  { name: "Caterpillar", emoji: "🐛", img: fluent3d("Bug"),                           facts: ["Caterpillars turn into butterflies!", "They love munching on leaves."] },
  { name: "Cricket",    emoji: "🦗", img: fluent3d("Cricket"),                        facts: ["Crickets chirp by rubbing their wings.", "They sing loudest on warm nights."] },
  { name: "Mosquito",   emoji: "🦟", img: fluent3d("Mosquito"),                       facts: ["Only female mosquitoes bite.", "They buzz with their tiny fast wings."] },
  { name: "Beetle",     emoji: "🪲", img: fluent3d("Beetle"),                         facts: ["Beetles have hard, shiny shells.", "There are over 400,000 kinds of beetles!"] },
  { name: "Worm",       emoji: "🪱", img: fluent3d("Worm"),                           facts: ["Worms help plants grow by mixing up soil.", "They have no eyes but can feel light!"] },
  { name: "Fly",        emoji: "🪰", img: fluent3d("Fly"),                            facts: ["Flies can taste with their feet.", "They have super-fast eyes!"] },
  { name: "Snail",      emoji: "🐌", img: fluent3d("Snail"),                          facts: ["Snails carry their cozy house on their back.", "They are the slowest creatures around!"] },
];

const CATEGORIES: Category[] = [
  { id: "land",      label: "Land",      emoji: "🌍", color: "tile-green",   animals: LAND },
  { id: "birds",     label: "Birds",     emoji: "🦅", color: "tile-blue",    animals: BIRDS },
  { id: "water",     label: "Water",     emoji: "🌊", color: "tile-teal",    animals: WATER },
  { id: "reptiles",  label: "Reptiles",  emoji: "🦎", color: "tile-mustard", animals: REPTILES },
  { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕", color: "tile-orange",  animals: DINOSAURS },
  { id: "amphibians",label: "Amphibians",emoji: "🐸", color: "tile-coral",   animals: AMPHIBIANS },
  { id: "insects",   label: "Insects",   emoji: "🦋", color: "tile-magenta", animals: INSECTS },
];

/* ---------- Component ---------- */
function AnimalKingdom() {
  const navigate = useNavigate();
  const [catId, setCatId] = useState<string>("land");
  const [selected, setSelected] = useState<Animal | null>(null);
  const [showFacts, setShowFacts] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const current = useMemo(() => CATEGORIES.find((c) => c.id === catId)!, [catId]);

  const stopSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  const speakFacts = (a: Animal) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = `${a.name}. ${a.facts.join(" ")}`;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.15;
    u.lang = "en-US";
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const openAnimal = (a: Animal) => {
    stopSpeak();
    setSelected(a);
    setShowFacts(false);
  };

  const handleToggleFacts = () => {
    if (!selected) return;
    if (showFacts) {
      stopSpeak();
      setShowFacts(false);
    } else {
      setShowFacts(true);
      speakFacts(selected);
    }
  };


  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgClouds})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/40" />

      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <button
          aria-label="Back"
          onClick={() => navigate({ to: "/" })}
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <img src={bearFace} alt="" width={72} height={72} className="size-18 drop-shadow-lg bear-bounce" />
        <Link
          to="/"
          aria-label="Home"
          className="flex size-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md ring-2 ring-white"
        >
          <Home className="size-6" />
        </Link>
      </header>

      <h1 className="melly-title px-5 pb-3 text-center leading-tight" style={{ fontSize: "2rem" }}>
        <span style={{ color: "#ff6b6b" }}>A</span>
        <span style={{ color: "#ffb347" }}>n</span>
        <span style={{ color: "#ffd23f" }}>i</span>
        <span style={{ color: "#6dd47e" }}>m</span>
        <span style={{ color: "#4ac6e8" }}>a</span>
        <span style={{ color: "#b78ce8" }}>l </span>
        <span style={{ color: "#ff6b6b" }}>K</span>
        <span style={{ color: "#ffb347" }}>i</span>
        <span style={{ color: "#ffd23f" }}>n</span>
        <span style={{ color: "#6dd47e" }}>g</span>
        <span style={{ color: "#4ac6e8" }}>d</span>
        <span style={{ color: "#b78ce8" }}>o</span>
        <span style={{ color: "#ff6b6b" }}>m</span>
      </h1>

      {/* Category Tabs */}
      <div className="px-3 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((c) => {
            const active = c.id === catId;
            return (
              <button
                key={c.id}
                onClick={() => setCatId(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold uppercase tracking-wide shadow-md ring-2 transition-all ${
                  active
                    ? "scale-105 bg-white text-slate-800 ring-white"
                    : "bg-white/70 text-slate-600 ring-white/60 hover:bg-white/90"
                }`}
              >
                <span className="text-base">{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animal Grid */}
      <main className="grid flex-1 grid-cols-3 gap-3 px-3 pb-10">
        {current.animals.map((a, i) => (
          <button
            key={a.name + i}
            onClick={() => openAnimal(a)}
            className={`tile ${current.color} flex-col items-center justify-center gap-1 p-2 text-center`}
            style={{ minHeight: 120 }}
          >
            <AnimalImage animal={a} size={64} />
            <span
              className="melly-title leading-tight"
              style={{ fontSize: "0.85rem", color: "#fff", textShadow: "0 2px 2px rgba(0,0,0,0.3)" }}
            >
              {a.name}
            </span>
          </button>
        ))}
      </main>

      {/* Popup */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            stopSpeak();
            setSelected(null);
          }
        }}
      >
        <DialogContent className="max-w-xs rounded-3xl border-4 border-white bg-gradient-to-b from-white to-sky-50 p-5">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="melly-title text-center" style={{ fontSize: "1.75rem", color: "#ff6b6b" }}>
                {selected?.name}
              </h2>
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-44 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 via-pink-100 to-sky-100 ring-4 ring-white shadow-inner">
                <AnimalImage animal={selected} size={140} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFacts}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff6b6b] via-[#ff8e53] to-[#ffb347] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-md ring-2 ring-white transition-all hover:scale-105 active:scale-95"
                >
                  <BookOpen className="size-4" />
                  {showFacts ? "Hide the Facts" : "Read the Facts"}
                </button>

                {showFacts && (
                  <button
                    aria-label={speaking ? "Stop speaking" : "Listen to facts"}
                    onClick={() => (speaking ? stopSpeak() : speakFacts(selected))}
                    className={`flex size-11 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition-all hover:scale-105 active:scale-95 ${
                      speaking
                        ? "bg-gradient-to-br from-rose-500 to-red-500 animate-pulse"
                        : "bg-gradient-to-br from-sky-400 to-blue-500"
                    }`}
                  >
                    {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                  </button>
                )}
              </div>

              {showFacts && (
                <div className="w-full rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-slate-700 shadow-inner">
                  <ul className="list-inside list-disc space-y-1.5">
                    {selected.facts.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ---------- Animal image with emoji fallback ---------- */
function AnimalImage({ animal, size }: { animal: Animal; size: number }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <span
        aria-hidden
        style={{ fontSize: size * 0.85, lineHeight: 1, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}
      >
        {animal.emoji}
      </span>
    );
  }
  return (
    <img
      src={animal.img}
      alt={animal.name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      style={{ width: size, height: size, objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}
    />
  );
}
