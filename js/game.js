$(function () {

  const debug = true;

  let started = false;
  let hardMode = false;
  //prevent player interaction when any animation is playing
  let animating = false;

  let lastSelectedCardIndex = -1;
  let attempts = 0;
  const cardsFound = [];

  /**
   * //cards
   *  | 0 | 1 | 2 |
   *  | 0 | 2 | 1 |
   *
   * //index
   *  | 0 | 1 | 2 |
   *  | 3 | 4 | 5 |
   */
  const cards = [];
  const cardsPositionIndex = [];
  let texturesPath = [];
  const bannedPositions = [];



  loadGameSettings();

  $(".card").click(function () {
    if (animating) return;

    if(!started) {
      chronoStart();
      started = true;
    }

    const index = $(this).attr("id");

    if (debug) {
      console.log("id selected " + index);
      console.log("last selected " + lastSelectedCardIndex);
    }

    // first click
    if (lastSelectedCardIndex <= -1) {
      rotate(this, lastSelectedCardIndex);
      lastSelectedCardIndex = index;
    } else {

      addAttempt();

      //same card ?
      if (index != lastSelectedCardIndex) {

        //pairing
        if (cards[index] === cards[lastSelectedCardIndex]) {
          rotate(this, -1);
          addFoundCard(index, lastSelectedCardIndex);
          cardsFound.push(cards[index]);
          if (cardsFound.length === (cards.length / 2)) {
            win();
          }

          lastSelectedCardIndex = -1;
        } else {
          //wrong card
          if(hardMode) {
            //wait for rotation animation
            setTimeout(() => {
              shuffleHardMode()
            }, 1500);
          }


          rotate(this, -1);
          rotate(this, lastSelectedCardIndex);
          lastSelectedCardIndex = -1;
          return;
        }
      }
    }

  });

  function shuffleHardMode() {

    //bannedPositions 0 ,1
    //cards 0 , 0 , 1, 1, 2 , 2
    //found cards 0
    const cardsLeft = [];
    const allowedPositions = [];
    for(let pos in cardsPositionIndex) {
      if(!bannedPositions.includes(pos)) {
        allowedPositions.push(pos);
        cardsLeft.push(cards[pos]);
      }
    }


    let index = 0;
    while(cardsLeft.length != 0) {
      const randomCard = Math.floor(Math.random() * cardsLeft.length)
      const item = cardsLeft[randomCard];
      const pos = allowedPositions[index]
      cards[pos] = item;
      cardsLeft.splice(randomCard,1);
      index++;
    }

    if(debug) {
      console.log("cards " + cards);
      console.log("allowed poses " + allowedPositions);
    }

    //refresh textures
    //get all realCards element and update texture
   $('.realLine').children('.realCard').each(function() {
      const cardID = cards[this.id];
      const texture = texturesPath[cardID];
      this.src = texture;
    });
  }


  /**
   * Load game with options selected previously from index.html
   */
  function loadGameSettings() {

    //get options selected from @see menu.js
    const textureID = localStorage.getItem("texture");
    const difficultyValue = localStorage.getItem("difficulty");
    hardMode = localStorage.getItem("hardmode");
    let data = difficultyValue.split("/");

    // lines
    const line = data[0];
    //column number
    const amountPerLine = data[1];
    //number of unique card
    const singleCardAmount = line * amountPerLine / 2;

    if (debug)
      console.log("texture " + textureID + " mode " + line + "/" + amountPerLine + " single card amount " + singleCardAmount);


    texturesPath = generateTexture(textureID, singleCardAmount);
    if (debug) {
      console.log("selected textures: " + texturesPath);
    }


    // positions (index)
    //  0 | 1 | 2 |
    //  3 | 4 | 5 |
    let index = 0;
    for (let l = 0; l < line; l++) {
      for (let c = 0; c < amountPerLine; c++) {
        cardsPositionIndex[index] = index;
        index++;

      }
    }


    // textures, 3 => 0 , 1 , 2
    //  0 | 1 | 2 |
    //  2 | 1 | 0 |
    placeCardsToRandomPos(line, amountPerLine);
    if (debug) {
      console.log("cards randomized " + cards);
    }


    // textures
    //  H | X | C |
    //  C | X | H |
    generateGrid(textureID, line, amountPerLine);


  }

  function placeCardsToRandomPos() {
    // pickup random cards
    for (let time = 0; time < 2; time++) {


      for (let i = 0; i < (cardsPositionIndex.length / 2); i++) {
        cards.push(i);
      }
    }
    //then randomize the list cards
    shuffle(cards);

  }


  /**
   * Generate texture without duplicated data
   * @param textureID (0 = uno, 1 = battle)
   * @param number
   * @returns {[]}
   */
  function generateTexture(textureID, number) {
    const listClone = deepCopyFunction(images[textureID]);

    const texturesPath = [];
    for (let i = 0; i < number; i++) {
      let randomIndex = Math.floor(Math.random() * listClone.length);
      texturesPath.push(listClone[randomIndex]);
      listClone.splice(randomIndex, 1);
    }
    return texturesPath;
  }


  /**
   *
   * @param textureID
   * @param line
   * @param column
   */
  function generateGrid(textureID, line, column) {
    const divContent = document.getElementById("content");

    let index = 0;
    for (let l = 0; l < line; l++) {
      //for each line, we create a div line
      const divLine = document.createElement("div");
      divLine.className = "line";

      divContent.appendChild(divLine);

      const realLine = document.createElement("div");
      realLine.className = "realLine";
      divContent.appendChild(realLine);

      for (let c = 0; c < column; c++) {

        //for each column we create a card
        const img = document.createElement("img");
        img.id = index.toString();
        img.className = "card ui-widget-content";
        img.src = backs[textureID];
        divLine.appendChild(img);

        //get the card id with the index
        let textureIndex = cards[index];
        const realImg = document.createElement("img");
        realImg.id = index.toString();
        realImg.className = "realCard";
        realImg.src = texturesPath[textureIndex];
        realLine.appendChild(realImg);


        index++;

      }

      const breakDiv = document.createElement("div");
      breakDiv.className = "break";
      divContent.appendChild(breakDiv);
    }


  }


  /**
   *
   * @param element
   * @param lastSelected
   */
  function rotate(element, lastSelected) {
    if (lastSelected > -1) {
      animating = true;
      lastElement = document.getElementById(lastSelectedCardIndex);
      setTimeout(() => {
        animating = false;
        lastElement.classList.remove('flip');
        element.classList.remove('flip');
      }, 1500);

    } else {
      element.classList.add("flip");
    }


  }


  /**
   *
   * @param posCard
   * @param posLastCard
   */
  function addFoundCard(posCard, posLastCard) {
    if(hardMode) {
      bannedPositions.push(posCard);
      bannedPositions.push(posLastCard);
    }

    let elementClone = null;
    $(".realCard").each(function () {
      const pos = $(this).attr('id');
      if (posCard == pos) {
        elementClone = this.cloneNode(true);
        this.style.visibility = 'hidden';
      } else if (posLastCard == pos) {
        this.style.visibility = 'hidden';
      }
    });

    if (elementClone === null) {
      return;
    }


    /* elementClone.style.width = "64px";
     elementClone.style.height = "107px";*/
    //found-card
    foundCards = document.getElementById("foundCards");
    elementClone.className = "card-found";
    foundCards.appendChild(elementClone);
  }


  function addAttempt() {
    attempts++;
    const element = $("#attempt");
    element.text("Tentatives: " + attempts);
  }


  function win() {
    chronoStop()
    startAnimation();
    playAgain();

  }

  function playAgain() {
    setTimeout(() => {
      const button = document.createElement("button");
      button.innerHTML = "Rejouer ? ";
      button.id = "playAgain";
      document.body.appendChild(button);

      $("#playAgain").click(function () {
        document.location.reload();
      });

    }, 1500);
  }



});


