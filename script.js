/**
 * @author Daniel Miao
 * @param {} event 
 */
function allowDrop(event) {
    event.preventDefault();
}

function clearSentence() {
    var wordSpan = document.querySelector('.drop-zone .word-span');
    if (wordSpan) {
      wordSpan.innerHTML = ''; // Clear the content of the word span
    }
  }
  
  function drop(event) {
    event.preventDefault();
    // Retrieve the text content from the drag event
    var data = event.dataTransfer.getData("text/plain");
    // Append the text content to the existing span or create a new one if it doesn't exist
    var wordSpan = event.target.querySelector('.word-span');
    if (!wordSpan) {
      wordSpan = document.createElement("span");
      wordSpan.className = 'word-span';
      event.target.appendChild(wordSpan);
    }
    wordSpan.textContent += data.trim() + " ";
  }

  function displaySentence() {
    var wordSpan = document.querySelector('.drop-zone .word-span');
    if (wordSpan) {
      var sentence = wordSpan.textContent.trim();
      
      // Remove punctuation and convert to lowercase
      var cleanedSentence = sentence.replace(/[^\w\s]/g, '').toLowerCase();
      
      // Split the sentence into words
      var words = cleanedSentence.split(/\s+/);
      
      // Create Howl instances for each word
      var sounds = words.map(word => new Howl({
        src: [`audio/${word}.mp3`]
      }));
      
      // Function to play sounds sequentially
      function playSoundsSequentially(sounds, index) {
        if (index < sounds.length) {
          sounds[index].play();
          sounds[index].on('end', function() {
            playSoundsSequentially(sounds, index + 1);
          });
        }
      }
      
      // Play sounds sequentially starting from index 0
      playSoundsSequentially(sounds, 0);
    } else {
      alert("No sentence to display.");
    }
  }

  // Function to fetch the list of MP3 files
  function fetchMP3Files() {
    return fetch('audio/')
      .then(response => response.text())
      .then(data => {
        // Parse the HTML response to extract filenames
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        const filenames = Array.from(htmlDocument.querySelectorAll('a'))
          .map(a => a.textContent.trim())
          .filter(filename => filename.endsWith('.mp3'))
          .map(filename => filename.replace('.mp3', ''));
        return filenames;
      });
  }
  
  function addWordsToWordBox(names) {
    const wordBox = document.getElementById('word-box');
    names.forEach(name => {
      const wordElement = document.createElement('div');
      if (Math.random() <= 0.2) {
        wordElement.className = 'word2';
      } else {
        wordElement.className = 'word';
      }
      wordElement.draggable = true;
      wordElement.textContent = name;
      wordBox.appendChild(wordElement);
    });
    
  }

  // Function to add words to the word box
function addWordsToWordBox(names) {
    const wordBox = document.getElementById('word-box');
    names.forEach(name => {
      const wordElement = document.createElement('div');
      if (Math.random() <= 0.2) {
        wordElement.className = 'word2';
      } else {
        wordElement.className = 'word';
      }
      wordElement.draggable = true; // Ensure draggable attribute is set to true
      wordElement.textContent = name;
      wordBox.appendChild(wordElement);
    });
  
    // Select all word elements after adding the new word boxes
    var wordElements = document.querySelectorAll('.word, .word2');
  
    // Add drag event listeners to the word elements
    wordElements.forEach(function(wordElement) {
      wordElement.ondragstart = function(e) {
        // Retrieve the text content of the dragged word
        var data = e.target.innerText;
        // Set the text content in the 'text/plain' format
        e.dataTransfer.setData('text/plain', data);
      };
    });
  }

function initializeWordBox() {
  // Fetch MP3 files and add words to the word box
  fetchMP3Files()
    .then(names => addWordsToWordBox(names))
    .catch(error => console.error('Error fetching MP3 files:', error));
}

function createBouncingDVDLogo() {

    const dvdLogo = document.createElement('img');
    dvdLogo.src = 'sophthehia.png';
    dvdLogo.alt = 'DVD Logo';
    dvdLogo.style.position = 'absolute';
    dvdLogo.style.width = '22vh';
    dvdLogo.style.height = 'auto';
    dvdLogo.style.left = '0';
    dvdLogo.style.top = '0';
  
    document.getElementById('thing').appendChild(dvdLogo);
  
    // Initial position and velocity of the logo
    let x = 0;
    let y = 0;
    let dx = 2;
    let dy = 2;
  
    // Function to move the logo
    function moveLogo() {
      // Move the logo
      x += dx;
      y += dy;
  
      // Get the size of the viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
  
      // Get the size of the logo
      const logoWidth = dvdLogo.clientWidth;
      const logoHeight = dvdLogo.clientHeight;
  
      // Check for collisions with the edges of the viewport
      if (x + logoWidth >= vw || x <= 0) {
        dx = -dx; // Reverse direction in x-axis
      }
      if (y + logoHeight >= vh || y <= 0) {
        dy = -dy; // Reverse direction in y-axis
      }
  
      // Update the position of the logo
      dvdLogo.style.left = x + 'px';
      dvdLogo.style.top = y + 'px';
  
      // Request the next frame
      requestAnimationFrame(moveLogo);
    }
  
    // Start the animation
    moveLogo();
  }
  
window.addEventListener('load', initializeWordBox);

createBouncingDVDLogo()