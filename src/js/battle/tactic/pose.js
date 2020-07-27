class pose {
  constructor ( data ){
    this.const = {
      a: data.a,
      offset: data.offset,
      owner: data.owner,
      rightHander: data.rightHander,
      grip: data.grip
    };
    this.var = {
      currentPosition: null
    }
    this.array = {
      vertex: [],
      color: [],
      position: [],
      protected: []
    }

    this.init( data );
  }

  init( data ){
    let n;
    switch ( this.const.grip ) {
      case 0:
        n = 5;
        break;
      case 1:
        n = 4;
        break;
    }

    this.initVertexs( n );
    this.initColors();

    for (var i = 0; i < n; i++) {
      let position = {
        name: null,
        id: i,
        protected: []
      };

      switch ( i ) {
        case 0:
          position.name = 'Quarta';
          position.protected.push( {
            horizon: 1,
            vertical: 1
          } );
          break;
        case 1:
          position.name = 'Prima';
          position.protected.push( {
            horizon: 2,
            vertical: 1
          } );
          break;
        case 2:
          position.name = 'Secunda';
          position.protected.push( {
            horizon: 2,
            vertical: 0
          } );
          break;
        case 3:
          position.name = 'Tertia';
          position.protected.push( {
            horizon: 1,
            vertical: 0
          } );
          break;
        case 4:
          position.name = 'Quinta';
          position.protected.push( {
            horizon: 0,
            vertical: 0
          } );
          position.protected.push( {
            horizon: 0,
            vertical: 1
          } );
          break;
      }

      this.array.position.push( position );
    }

    if( this.const.rightHander )
      this.var.currentPosition = 3;
    else
      this.var.currentPosition = 0;

    this.updateVulnerability();
  }

  initVertexs( n ){
    let angle = -PI * 2 / n;
    let shift = n - 2;
    let scale = 4;

    for( let k = 0; k < 2; k++ ){
      this.array.vertex.push( [] );

      for( let i = 0; i < n; i++ ){
        let vertex = this.const.offset.copy();
        let l = this.const.a * ( scale - k ) / scale;
        let x = Math.sin( angle * ( i + shift ) ) * l;
        let y = Math.cos( angle * ( i + shift ) ) * l;
        let addVec = createVector( x, y );
        vertex.add( addVec );
        this.array.vertex[k].push( vertex );
      }
    }
  }

  initColors(){
    this.array.color.push( {
      hue: 60,
      saturation: colorMax,
      lightness: colorMax * 0.5
    } );
    this.array.color.push( {
      hue: 0,
      saturation: colorMax,
      lightness: colorMax * 0.5
    } );
    this.array.color.push( {
      hue: 120,
      saturation: colorMax,
      lightness: colorMax * 0.5
    } );
    this.array.color.push( {
      hue: 280,
      saturation: colorMax,
      lightness: colorMax * 0.5
    } );
    this.array.color.push( {
      hue: 220,
      saturation: colorMax,
      lightness: colorMax * 0.5
    } );
  }

  updateVulnerability(){
    this.array.protected = [];
    let n = 3;//horizons
    let m = 2;//verticals

    for( let i = 0; i < n; i++ ){
      this.array.protected.push( [] );
      for( let j = 0; j < m; j++ )
        this.array.protected[i].push( false );
    }

    let position = this.array.position[this.var.currentPosition].protected;

    for( let i = 0; i < position.length; i++ ){
      let h = position[i].horizon;
      let v = position[i].vertical;
      this.array.protected[h][v] = true;
    }
  }

  draw(){
    let k = 0;
    let txt;

    for( let i = 0; i < this.array.vertex[k].length; i++ ){
      let ii = ( i + 1 ) % this.array.vertex[k].length;
      let c;
      switch ( this.const.owner ) {
        case 'hero':
          c = 1;
          break;
        case 'villain':
          c = 3;
          break;
      }
      noStroke();

      if( i == this.var.currentPosition )
        switch ( this.const.owner ) {
          case 'hero':
            c = 2;
            break;
          case 'villain':
            c = 4;
            break;
        }

      fill( this.array.color[c].hue, this.array.color[c].saturation, this.array.color[c].lightness );
      triangle(
        this.array.vertex[k][i].x, this.array.vertex[k][i].y,
        this.array.vertex[k][ii].x, this.array.vertex[k][ii].y,
        this.const.offset.x, this.const.offset.y,
      );

      k = 1;
      c = 0;

      stroke( this.array.color[c].hue, this.array.color[c].saturation, this.array.color[c].lightness );
      fill( this.array.color[c].hue, this.array.color[c].saturation, this.array.color[c].lightness );
      triangle(
        this.array.vertex[k][i].x, this.array.vertex[k][i].y,
        this.array.vertex[k][ii].x, this.array.vertex[k][ii].y,
        this.const.offset.x, this.const.offset.y,
      );

      k = 0;
    }

    switch ( this.const.owner ) {
      case 'hero':
        txt = 'ur pose';
        break;
      case 'villain':
        txt = 'his pose';
        break;
    }

    stroke( 0 );
    fill( 0 );
    text( txt, this.const.offset.x,  this.const.offset.y - this.const.a );
  }
}
