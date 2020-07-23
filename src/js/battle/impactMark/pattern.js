//
class pattern {
  constructor( data ){
    this.const = {
      round: data.round
    };
    this.var = {
      markup: data.markup,
      currentRound: 0
    }
    this.array = {
      adjacency: [],
      mask: [],
      acupuncture: []
    }

    this.init();
  }

  init(){
    this.initAdjacency();
  }

  initAdjacency(){
    let markup = this.var.markup;
    let mid = markup.const.size;
    let midIndex = mid * markup.const.n + mid;
    let parity = mid % 2;
    markup.array.acupuncture[mid][mid].setStatus( 1 );
    this.array.mask.push( midIndex );

    if( this.nextAcupuncture() )
      return;

    for( let i = 0; i < markup.array.neighbor[parity].length; i++ ){
      let grid = markup.convertIndex( midIndex );
      grid.add( markup.array.neighbor[parity][i] );
      let index = markup.convertGrid( grid );
      this.array.adjacency.push( index );
    }

    console.log( this.array.adjacency )

    this.generate();
  }

  generate(){
    let markup = this.var.markup;
    let parity;

    for( let r = 1; r < this.const.round; r++ ){
      let rand = Math.floor( Math.random() * this.array.adjacency.length );
      let addIndex = this.array.adjacency[rand];
      this.array.mask.push( addIndex );
      let add = markup.convertIndex( addIndex );
      markup.array.acupuncture[add.y][add.x].setStatus( 1 );
      this.array.adjacency.splice( rand, 1 )
      parity = add.y % 2;

      for( let i = 0; i < markup.array.neighbor[parity].length; i++ ){
        let adj = markup.convertIndex( addIndex );
        adj.add( markup.array.neighbor[parity][i] );
        let adjIndex = markup.convertGrid( adj );
        //console.log( adj )
        if( markup.checkAcupuncture( adj ) )
          if( !this.array.adjacency.includes( adjIndex ) )
            if( !this.array.mask.includes( adjIndex ) )
              this.array.adjacency.push( adjIndex );
      }
    }
  }

  nextAcupuncture(){
    this.currentRound++;
    return this.currentRound < this.const.round;
  }
}
