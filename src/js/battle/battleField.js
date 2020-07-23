class battleField {
  constructor (){
    this.const = {
      a: cellSize
    };
    this.var = {
      //participants
      hero: null,
      villain: null,
      currentParticipant: 0,
      flowSum: 0
    }
    this.array = {
      offset: [],
      flow: [],
      channel: [],
      deed: []
    }

    this.init();
  }

  init(){
    this.initOffsets();
    this.initParticipants();
    this.click();
    this.initMark();
  }

  initMark(){
    this.var.mark = new markup( 2 );
  }

  initOffsets(){
    //indent for the grid
    let x = Math.floor( canvasGrid.x / 2 );
    let y = Math.floor( canvasGrid.y / 8 );
    let offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );

    x = Math.floor( canvasGrid.x / 2 );
    y = Math.floor( canvasGrid.y / 2 );
    offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );


    x = Math.floor( canvasGrid.x / 2 );//3/4
    y = Math.floor( canvasGrid.y * 3 / 4 );/// 4
    offset = createVector( this.const.a * x, this.const.a * y );
    this.array.offset.push( offset );
  }

  initParticipants(){
    let data = {
      deepOffset: this.array.offset[0],
      flowOffset: this.array.offset[1],
      channelOffset: this.array.offset[2]
    }
    this.var.hero = new hero( data );
  }

  setParticipant(){
    let participant;
    switch ( this.var.currentParticipant ) {
      case 0:
        participant = this.var.hero;
        break;
    }
    return participant;
  }

  updateDeeds(){
    let participant = this.setParticipant();
    this.array.flow = [];
    this.array.channels = [];

    for( let i = 0; i < participant.array.index[1][2].length; i++ ){
      let index = participant.array.index[1][2][i];
      this.array.flow.push( participant.array.reserve[1][index] );
    }

    for( let i = 0; i < participant.array.index[2][2].length; i++ ){
      let index = participant.array.index[2][2][i];
      this.array.channels.push( participant.array.reserve[2][index] );
    }

    console.log( this.array.flow, this.array.channels );

    let weapon = participant.array.index[3][1];

    console.log( weapon );
    //for( let i = 0; i < channels.length; i++ )
  }

  click(){
    this.heroClick();
  }

  heroClick(){
    let participant = this.var.hero;

    for( let type = 0; type < 3; type++ ){
      let flag = false;

      if( participant.var.current.deep != null && type == 0 )
        flag = true;

      if( participant.var.current.deep == null && type != 0 )
        flag = true;

      if( !flag ){
        let x = mouseX;
        let y = mouseY;
        let mouse = createVector( x, y );
        if( participant.var.current.deep == null )
          mouse = createVector( 488, 96 );

        let size;

        switch ( type ) {
          case 0:
            size = createVector( 0.75 * participant.const.a, 0.5 * participant.const.a );
            break;
          case 1:
          case 2:
            size = createVector( 0.5 * participant.const.a, 0.75 * participant.const.a );
            break;
        }

        //k_small == 1 - reserve awaiting player selection; k_big == 2 - reserve played on the table;
        //k_small == 2 - reserve played on the table; k_big == 1 - reserve awaiting player selection;
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
          for( let i = 0; i < participant.array.index[type][k_small].length; i++ ){
            let index = participant.array.index[type][k_small][i];
            let vertex = participant.array.vertex[type][k_small - 1][i];
            let vec = mouse.copy();
            vec.sub( vertex );

            if( vec.x > -size.x && vec.x < size.x &&
                vec.y > -size.y && vec.y < size.y ){
              participant.array.index[type][k_small].splice( i, 1 );
              participant.array.index[type][k_big].push( index );
              participant.updateVertexs( type );

              switch ( type ) {
                case 0:
                  participant.var.current.deep = participant.array.reserve[type][index];
                  participant.array.hand[1] = participant.var.current.deep.var.amount.flow;
                  participant.array.hand[2] = participant.var.current.deep.var.amount.channel;
                  if( participant.array.index[0][1].length == 1 ){
                    participant.initFlows();
                    participant.initChannels();
                    this.updateDeeds();
                  }
                  else{
                    participant.fillHand( 1 );
                    participant.fillHand( 2 );
                    this.updateDeeds();
                  }
                  break;
                case 1:
                  participant.var.current.flow = participant.array.reserve[type][index];
                  this.updateDeeds();
                  switch ( k_small ) {
                    case 1:
                      this.var.flowSum += participant.array.reserve[type][index].var.capacity;
                      break;
                    case 2:
                      this.var.flowSum -= participant.array.reserve[type][index].var.capacity;
                      break;
                  }
                  break;
                case 2:
                  participant.var.current.channel = participant.array.reserve[type][index];
                  this.updateDeeds();
                  break;
              }
              return;
            }
          }
        }
      }
    }
  }

  nextRound(){
    let participant = this.var.hero;

    if( participant.var.current.deep != null ){
      for( let type = 0; type < 3; type++ )
        for( let k = 1; k < 3; k++ )
          for( let i = participant.array.index[type][k].length - 1; i >= 0 ; i-- )
            participant.array.index[type][3].push( participant.array.index[type][k].pop() );

      participant.fillHand( 0 );
      participant.var.current.deep = null;
    }
  }

  drawSum(){
    let participant = this.setParticipant();

    if( participant.var.current.deep != null && this.var.currentParticipant == 0 )
      if( this.array.flow.length > 0 ){
        let txt = this.var.flowSum;
        fill( 'green' );
        text( txt,
          this.array.offset[1].x - this.const.a,
          this.array.offset[1].y - this.const.a * 2.25 + fontOffset );
        txt = Math.floor( Math.sqrt( this.var.flowSum ) );//integer
        fill( 'yellow' );
        text( txt,
          this.array.offset[1].x,
          this.array.offset[1].y - this.const.a * 2.25 + fontOffset );
        txt = this.var.flowSum - Math.pow( txt, 2 );//remainder
        fill( 'red' );
        text( txt,
          this.array.offset[1].x + this.const.a,
          this.array.offset[1].y - this.const.a * 2.25 + fontOffset );
      }
  }

  draw(){
    this.drawSum();
    this.var.hero.draw();
    this.var.mark.draw();
  }
}
