var gameOfLife = {
  width: 20,
  height: 20,
  stepInterval: null,

  createAndShowBoard: function () {
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }

    var goltable = document.createElement("tbody");
    goltable.innerHTML = tablehtml;
    $('#board').append(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (func) {

    for(y=0;y<this.height;y++){
      for(x=0;x<this.width;x++){
        var target = "#"+x+"-"+y;
        func($(target),x,y );
      }
    }

  },

  toggleCell: function(cell) {
    var $c = $(cell);
    if ($c.attr('data-status') == 'dead') {
      $c.attr({ 'data-status': 'alive', 'class': 'alive' });
    } else {
      $c.attr({ 'data-status': 'dead', 'class': 'dead' });
    }
  },

  setupBoardEvents: function() {
    var onBoardClick = function (event) {
      var cell = event.toElement;
      this.toggleCell(cell);
    };
    $('#board').click(onBoardClick.bind(this));

    // setup control panel button events
    $('#step_btn').click(this.step.bind(this));
    $('#reset_btn').click(this.resetRandom.bind(this));
    $('#clear_btn').click(this.clearBoard.bind(this));
    $('#play_btn').click(this.enableAutoPlay.bind(this));
  },

  resetRandom: function () {
    var setRandomState = function(cell) {
      if (Math.random() < .5) {
        gameOfLife.toggleCell(cell);
      }
    };
    this.forEachCell(setRandomState);
  },

  clearBoard: function () {
    var clearCell = function(cell) {
      $(cell).attr({ 'data-status': 'dead','class': 'dead' });
    };
    this.forEachCell(clearCell);
  },

  countAliveNeighbors: function() {
    this.forEachCell(function (cell, x, y) {
        var aliveNeighbors = 0;
        //top is y -1
        //top left is x-1 y-1
        //top right  x+1 y -1
        // left x-1
        // right  x+1
        //bottom y+1
        //bottom left x-1 y+1
        //bottom right x+1 y+1
        var status = $(cell).attr('data-status');
          for (a =-1;a<2;a++){
            for(b = -1;b<2;b++){
              var x_nbr = a+x;
              var y_nbr = b+y;
              // console.log(x,y,"dead",":",x_nbr, y_nbr,"neighbor");
              var neighbor_id = "#"+x_nbr+"-"+y_nbr;
              var neighbor_st = $(neighbor_id).attr('data-status');
                // debugger;

                if(!(x_nbr==x && y_nbr==y) && neighbor_st ==="alive"){
                  aliveNeighbors++;


                }
            }
          }


        /*
            COLLEGE.JS: Given the cell object, find the neighbors and figure out
                        how many alive neighbors there are.
        */
        // debugger;
        $(cell).attr('data-neighbors', aliveNeighbors);
    });
  },

  determineAndSetNextState: function (argument) {
    var getNextState = function (currentState, numAliveNeighbors) {
      if (currentState === "alive"){
        if(numAliveNeighbors === 2 || numAliveNeighbors ===3){
          // console.log(currentState,numAliveNeighbors,":","alive");
          return currentState;
        }else if(numAliveNeighbors < 2){
          // console.log(currentState,numAliveNeighbors,":","dead");
          return "dead" ;
        }else if(numAliveNeighbors > 3){
          // console.log(currentState,numAliveNeighbors,":","dead");
          return "dead" ;
        }else{
          return currentState;
        }

      }else{
        if(numAliveNeighbors === 3){
          // console.log(currentState,numAliveNeighbors,":","alive");
          return "alive" ;
        }else{
          return currentState;
        }

      }
      // Any live cell with two or three live neighbors lives on to the next generation.
      // Any live cell with fewer than two live neighbors dies, as if caused by under-population.
      // Any live cell with more than three live neighbors dies, as if by overcrowdi
      //Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction


    };

    this.forEachCell(function (cell, x, y) {
      var currentState = $(cell).attr('data-status');
      var numNeighbors = parseInt($(cell).attr('data-neighbors'));

      var newCellStatus = getNextState(currentState, numNeighbors);

      if (newCellStatus) {
        $(cell).attr({ 'data-status': newCellStatus, 'class': newCellStatus });
      }
    });
  },

  step: function () {
    this.countAliveNeighbors();
    this.determineAndSetNextState();
  },

  togglePlayPause: function () {
    if (!this.stepInterval) {
      $('#play_btn').text("Play").attr('class', 'btn btn-primary');
    } else {
      $('#play_btn').text("Pause").attr('class', 'btn btn-danger');
    }
  },

  enableAutoPlay: function () {
    /*
      COLLEGE.JS: Write code here to call the step function repeatedly every 200ms
                  Look up the "setInterval" and "clearInterval" functions to learn
                  how to do this. You can also use the above "togglePlayPause" function
                  to toggle the button between "Play" and "Pause".

    */
  }
};

gameOfLife.createAndShowBoard();
