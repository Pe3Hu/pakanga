//
class markup{
  constructor( size ){
    this.const = {
      offset: createVector( cellSize * 0.5, cellSize * 1 ),
      n: size * 2 + 1,
      m: size * 2 + 1,
      size: size,
      a: cellSize * 0.15
    };
    this.var = {
      pattern: null
    }
    this.array = {
      windRose: [ 'NNE', 'E', 'SSE', 'SSW', 'W', 'NNW' ],
      acupuncture: [],
      hue: []
    }

    this.init();
  }

  initNeighbors(){
    this.array.neighbor = [
      [
        createVector( 0, -1 ),
        createVector( 1, 0 ),
        createVector( 0, 1 ),
        createVector( -1, 1 ),
        createVector( -1, 0 ),
        createVector( -1, -1 ),
      ],
      [
        createVector( 1, -1 ),
        createVector( 1, 0 ),
        createVector( 1, 1 ),
        createVector( 0, 1 ),
        createVector( -1, 0 ),
        createVector( 0, -1 ),
      ]
    ];
  }

  initAcupunctures(){
    for( let i = 0; i < this.const.m; i++ ){
      this.array.acupuncture.push( [] );
      for( let j = 0; j < this.const.n; j++ ){
          let index = i * this.const.n + j;
          let vec = createVector( this.const.offset.x, this.const.offset.y );
          let grid = createVector( j, i );
          vec.x += this.const.r * 2 * j;
          vec.y += this.const.a * 1.5 * i;
          if( i % 2 == 1 )
            vec.x += this.const.r;
          this.array.acupuncture[i].push( new acupuncture( index, vec, grid, this.const.a *0.9 ) );
      }
    }

    this.acupuncturesAroundCenter();
    //this.array.acupuncture[this.const.size][this.const.size].setStatus( 1 );
  }

  initMark(){
    let round = 4;
    this.var.pattern = new pattern( {
      round: round,
      markup: this
    } );
  }

  init(){
    this.const.r = this.const.a / ( Math.tan( Math.PI / 6 ) * 2 );

    this.initNeighbors();
    this.initAcupunctures();
    this.initMark();
  }

  acupuncturesAroundCenter(){
    let indexs = [];
    indexs.push( this.array.acupuncture[this.const.size][this.const.size].const.index );

    for( let i = 0; i < this.const.size; i++ )
      for( let j = indexs.length - 1; j >= 0; j-- ){
        let vec = this.convertIndex( indexs[j] );
        let parity = ( vec.y % 2 );

        for( let l = 0; l < this.array.neighbor[parity].length; l++ ){
          vec = this.convertIndex( indexs[j] );
          vec.add( this.array.neighbor[parity][l] );
          let addIndex = this.convertGrid( vec );
            if( !indexs.includes( addIndex ) )
                indexs.push( addIndex );
        }
      }

      for( let i = 0; i < indexs.length; i++ ){
        let vec = this.convertIndex( indexs[i] );
        this.array.acupuncture[vec.y][vec.x].var.visiable = true;
      }
  }

  //find the grid coordinates by index
  convertIndex( index ){
    if( index == undefined )
      return null;

    let i = Math.floor( index / this.const.n );
    let j = index % this.const.n;
    return createVector( j, i );
  }

  //find the index coordinates by grid coordinates
  convertGrid( vec ){
    if( vec == undefined )
      return null;

    return vec.y * this.const.n + vec.x;
  }

  //is the acupuncture within the field
  checkBorder( grid ){
    let flag = true;

    if( grid.x < 0 || grid.y < 0 || grid.x > this.const.m - 1 || grid.y > this.const.n - 1 )
      flag = false;

    return flag;
  }

  checkAcupuncture( grid ){
    let flag = this.checkBorder( grid );

    if( flag )
      flag = this.array.acupuncture[grid.y][grid.x].var.visiable;

    return flag;
  }

  draw(){
    stroke( 0 );
    fill( 0 );
    let txt = 'aim';
    text( txt, this.const.offset.x + this.const.a * ( this.const.size + 1.5 ),
       this.const.offset.y - this.const.a * this.const.size );

    for( let i = 0; i < this.array.acupuncture.length; i++ )
      for( let j = 0; j < this.array.acupuncture[i].length; j++ )
        this.array.acupuncture[i][j].draw( this.array.toConstruct );
  }
}
