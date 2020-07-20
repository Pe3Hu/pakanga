//
class battleField{
  constructor(){
    this.const = {
      a: cellSize,
    };
    this.var = {
      cardIndex: {
        cascade: 0,
        flow: 0,
        channel: 0
      },
      deckSize:{
        cascade: 12
      },
      current:{
        cascade: null,
        flow: null,
        channel: null
      },
      flowSum: 0
    }
    this.array = {
      offset: [],
      vertex: [],
      hand: [ 2, 4, 2 ],
      card: [],
      index: []
    };

    this.init();
  }

  init(){
    this.initOffsets();
    this.initCards();
    /*console.log( 'index', this.array.index )
    console.log( 'card', this.array.card )
    console.log( 'vertex', this.array.vertex )*/
  }

  initOffsets(){
    //indent for the grid
    let x = Math.floor( canvasGrid.x / 2 );
    let y = Math.floor( canvasGrid.y / 2 );
    let offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );

    x = Math.floor( canvasGrid.x / 4 );
    y = Math.floor( canvasGrid.y / 4 );
    offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );


    x = Math.floor( canvasGrid.x * 3 / 4 );
    y = Math.floor( canvasGrid.y / 4 );
    offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );
  }

  initCards(){
    this.array.card = [];
    this.array.index = [];

    this.initCascades();
  }

  initCascades(){
    let type = 0;
    this.array.card.push( [] );
    //card indices depending on the state
    //0 - card in the deck
    //1 - card awaiting player selection
    //2 - card played on the table
    //3 - card went off
    this.array.index.push( [ [], [], [], [] ] );

    for( let i = 0; i < this.var.deckSize.cascade; i++ ){
      let data = {
        index: this.var.cardIndex.cascade,
        a: this.const.a,
        type: type,
        flowAmount: 6,
        channelAmount: 3
      };

      this.array.card[type].push( new card( data ) );
      this.array.index[type][0].push( this.var.cardIndex.cascade );
      this.var.cardIndex.cascade++;
    }

    this.array.index[type][0] = this.shuffle( this.array.index[type][0] );

    this.fillHand( type );
  }

  initFlows(){
    let type = 1;
    let capacity;
    let progression = 1;
    let n = 1;
    this.array.card.push( [] );
    //card indices depending on the state
    //0 - card in the deck
    //1 - card awaiting player selection
    //2 - card played on the table
    //3 - card went off
    this.array.index.push( [ [], [], [], [] ]  );

    for( let capacity = 4; capacity > 0; capacity-- ){

      for( let i = 0; i < n; i++ ){
        let data = {
          index: this.var.cardIndex.flow,
          a: this.const.a,
          type: type,
          capacity: capacity
        };

        this.array.card[type].push( new card( data ) );
        this.array.index[type][0].push( this.var.cardIndex.flow );
        this.var.cardIndex.flow++;
      }

      progression++;
      n += progression;
    }

    this.array.index[type][0] = this.shuffle( this.array.index[type][0] );
    this.fillHand( type );
  }

  initChannels(){
    let type = 2;
    let objective;
    let n = 4;
    this.array.card.push( [] );
    //card indices depending on the state
    //0 - card in the deck
    //1 - card awaiting player selection
    //2 - card played on the table
    //3 - card went off
    this.array.index.push( [ [], [], [], [] ] );

    for( let objective = 0; objective < 3; objective++ ){

      for( let i = 0; i < n; i++ ){
        let data = {
          index: this.var.cardIndex.channel,
          a: this.const.a,
          type: type,
          objective: objective
        };

        this.array.card[type].push( new card( data ) );
        this.array.index[type][0].push( this.var.cardIndex.channel );
        this.var.cardIndex.channel++;
      }
    }

    this.array.index[type][0] = this.shuffle( this.array.index[type][0] );
    this.fillHand( type );
  }

  fillHand( type ){
    let l = this.array.hand[type];
    if( this.array.index[type][0].length < this.array.hand[type] ){
      l = this.array.index[type][0].length;

      //up to play the remainder
      for( let i = 0; i < l; i++ ){
        let index = this.array.index[type][0].pop();
        this.array.index[type][1].push( index );
      }

      for( let i = this.array.index[type][3].length - 1; i >= 0 ; i-- )
        this.array.index[type][0].push( this.array.index[type][3].pop() );

      //take the missing number of cards
      l = this.array.hand[type] - l;
    }

    for( let i = 0; i < l; i++ ){
      let index = this.array.index[type][0].pop();
      this.array.index[type][1].push( index );
    }

    this.updateVertexs( type );
    let sum = this.array.index[type][0].length + this.array.index[type][1].length +
      this.array.index[type][2].length + this.array.index[type][3].length;
    console.log( type, this.array.index[type][0].length, this.array.index[type][1].length,
      this.array.index[type][2].length, this.array.index[type][3].length )
  }

  updateCards(){

  }

  updateVertexs( type ){
    //0 - Cascade vertexs
    //1 - Flow vertexs
    //2 - Channel vertexs
    this.array.vertex[type] = [ [], [] ];
    //vertex[type][0] - in processing
    //vertex[type][1] - selected
    let x;
    let y;

    switch ( type ) {
      case 0:
        x = this.const.a * 2;
        y = this.const.a * 0.75;
        break;
      case 1:
      case 2:
        x = this.const.a * 1.25;
        y = this.const.a;
        break;
    }

    let vec = this.array.offset[type].copy();
    vec.y += y;
    vec.x -= ( this.array.index[type][1].length + 1 ) / 2 * x;

    for( let i = 0; i < this.array.index[type][1].length; i++ ){
      vec.x += x;
      this.array.vertex[type][0].push( vec.copy() );
    }

    vec = this.array.offset[type].copy();
    vec.y -= y;
    vec.x -= ( this.array.index[type][2].length + 1 ) / 2 * x;

    for( let i = 0; i < this.array.index[type][2].length; i++ ){
      vec.x += x;
      this.array.vertex[type][1].push( vec.copy() );
    }
  }

  nextRound(){
    if( this.var.current.cascade != null ){
      for( let type = 0; type < 3; type++ )
        for( let k = 1; k < 3; k++ )
          for( let i = this.array.index[type][k].length - 1; i >= 0 ; i-- )
            this.array.index[type][3].push( this.array.index[type][k].pop() );

      this.fillHand( 0 );
      this.var.current.cascade = null;
    }
  }

  click(){
    for( let type = 0; type < 3; type++ ){
      let flag = false;

      if( this.var.current.cascade != null && type == 0 )
        flag = true;

      if( this.var.current.cascade == null && type != 0 )
        flag = true;

      if( !flag ){
        let x = mouseX;
        let y = mouseY;
        let mouse = createVector( x, y );
        let size;

        switch ( type ) {
          case 0:
            size = createVector( 0.75 * this.const.a, 0.5 * this.const.a );
            break;
          case 1:
          case 2:
            size = createVector( 0.5 * this.const.a, 0.75 * this.const.a );
            break;
        }

        //k_small == 1 - card awaiting player selection; k_big == 2 - card played on the table;
        //k_small == 2 - card played on the table; k_big == 1 - card awaiting player selection;
        for( let k_small = 1; k_small < 3; k_small++ ){
          let k_big;
          switch ( k_small ) {
            case 1:
              k_big = 2;
              break;
            case 2:
              k_big = 1;
              break;
          }
          for( let i = 0; i < this.array.index[type][k_small].length; i++ ){
            let index = this.array.index[type][k_small][i];
            let vertex = this.array.vertex[type][k_small - 1][i];
            let vec = mouse.copy();
            vec.sub( vertex );

            if( vec.x > -size.x && vec.x < size.x &&
                vec.y > -size.y && vec.y < size.y ){
              this.array.index[type][k_small].splice( i, 1 );
              this.array.index[type][k_big].push( index );
              this.updateVertexs( type );

              switch ( type ) {
                case 0:
                  this.var.current.cascade = this.array.card[type][index];
                  if( this.array.index.length == 1 ){
                    this.initFlows();
                    this.initChannels();
                  }
                  else{
                    this.fillHand( 1 );
                    this.fillHand( 2 );
                  }
                  break;
                case 1:
                  this.var.current.flow = this.array.card[type][index];
                  switch ( k_small ) {
                    case 1:
                      this.var.flowSum += this.array.card[type][index].var.capacity;
                      break;
                    case 2:
                      this.var.flowSum -= this.array.card[type][index].var.capacity;
                      break;
                  }
                  break;
                case 2:
                  this.var.current.channel = this.array.card[type][index];
                  break;
              }
              return;
            }
          }
        }
      }


    }
  }

  shuffle( array ) {
    let m = array.length, t, i;

    while ( m ) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
}

  drawSum(){
    if( this.var.current.cascade != null )
      if( this.array.index[1][2].length > 0 ){
        let txt = this.var.flowSum;
        fill( 'green' );
        text( txt,
          this.array.offset[1].x - this.const.a,
          this.array.offset[1].y - this.const.a * 2.25 + fontSize / 3 );
        txt = Math.floor( Math.sqrt( this.var.flowSum ) );//integer
        fill( 'yellow' );
        text( txt,
          this.array.offset[1].x,
          this.array.offset[1].y - this.const.a * 2.25 + fontSize / 3 );
        txt = this.var.flowSum - Math.pow( txt, 2 );//remainder
        fill( 'red' );
        text( txt,
          this.array.offset[1].x + this.const.a,
          this.array.offset[1].y - this.const.a * 2.25 + fontSize / 3 );
      }
  }

  draw(){
    this.updateCards();
    this.drawSum();

    //i == 0 - Cascade; i == 1 - Flow;  i == 2 - Channel;
    //j == 1 - awaiting; j == 2 - played;
    for( let i = 0; i < this.array.index.length; i++ )
      for( let j = 1; j < 3; j++ )
        for( let l = 0; l < this.array.index[i][j].length; l++ ){
          let index = this.array.index[i][j][l];
          let vertex = this.array.vertex[i][j-1][l];
          let flag = this.var.current.cascade == null;

          if( !flag )
            flag = i != 0 || this.var.current.cascade.const.index == index;

          if( flag )
            this.array.card[i][index].draw( vertex );
        }

    fill( 0 );
    rect(
      this.array.offset[0].x - this.const.a / 2,
      this.array.offset[0].y - this.const.a / 2,
      this.const.a, this.const.a
    );

    rect(
      this.array.offset[1].x - this.const.a / 2,
      this.array.offset[1].y - this.const.a / 2,
      this.const.a, this.const.a
    );

    rect(
      this.array.offset[2].x - this.const.a / 2,
      this.array.offset[2].y - this.const.a / 2,
      this.const.a, this.const.a
    );

  }
}
