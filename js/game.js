
const pathList = [
  "img/uno/blue/0_blue.png",
  "img/uno/blue/1_blue.png",
  "img/uno/blue/2_blue.png",
  "img/uno/blue/3_blue.png",
  "img/uno/blue/4_blue.png",
  "img/uno/blue/5_blue.png",
  "img/uno/blue/6_blue.png",
  "img/uno/blue/7_blue.png",
  "img/uno/blue/9_blue.png",
  "img/uno/bonus/+2_blue.png",
  "img/uno/bonus/+2_green.png",
  "img/uno/bonus/+2_red.png",
  "img/uno/bonus/+2_yellow.png",
  "img/uno/bonus/+4.png",
  "img/uno/bonus/block_blue.png",
  "img/uno/bonus/block_green.png",
  "img/uno/bonus/block_red.png",
  "img/uno/bonus/block_yellow.png",
  "img/uno/bonus/inverse_blue.png",
  "img/uno/bonus/inverse_green.png",
  "img/uno/bonus/inverse_red.png",
  "img/uno/bonus/inverse_yellow.png",
  "img/uno/bonus/pick_color.png"
];

function generate(number) {
  listClone = pathList;
  let cards = [];
  for(let i = 0; i < number; i++) {
    let randomIndex = Math.floor(Math.random() * listClone.length);
    cards.push(listClone[randomIndex]);
   // listClone.splice(randomIndex);
  }
  return cards;
}
