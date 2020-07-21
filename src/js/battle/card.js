//
class card {
  constructor ( data ){
    this.const = {
      index: data.index,
      a: data.a,
      size:{
        x: null,
        y: null
      }
    };
    this.array = {
      vertex: [],
      color: []
    };
    this.var = {
      type:{
        id: null,
        name: null
      }
    };

    //this.init();
    this.setType( data );
  }

  setType( data ){
    this.array.color = [];
    this.var.type.id = data.type;

    switch ( data.type ) {
      case 0:
        this.var.type.name = 'Deep';
        this.var.amount = {
          flow: data.flowAmount,
          channel: data.channelAmount
        };
        this.const.size = {
          x: 1.5 * this.const.a,
          y: this.const.a,
        };
        //background color
        this.array.color.push( {
          hue: 210,
          saturation: colorMax,
          lightness: colorMax * 0.5
        } );
        //pattern color
        this.array.color.push( {
          hue: 50,
          saturation: colorMax,
          lightness: colorMax * 0.5
        } );
        break;
      case 1:
        this.var.type.name = 'Flow';
        this.var.capacity = data.capacity;
        this.const.size = {
          x: this.const.a,
          y: 1.5 * this.const.a,
        };
        //background color
        this.array.color.push( {
          hue: 210,
          saturation: colorMax,
          lightness: colorMax * 0.5
        } );
        //pattern color
        this.array.color.push( {
          hue: 0,
          saturation: 0,
          lightness: colorMax
        } );
        break;
      case 2:
        this.var.type.name = 'Channel';
        this.var.purpose = {
          id: data.purpose,
          name: null
        };
        this.const.size = {
          x: this.const.a,
          y: 1.5 * this.const.a,
        };
        //background color
        this.array.color.push( {
          hue: 50,
          saturation: colorMax,
          lightness: colorMax * 0.5
        } );
        //pattern color
        switch ( data.purpose ) {
          case 0:
            this.var.purpose.name = 'View';
            this.array.color.push( {
              hue: 0,
              saturation: 0,
              lightness: colorMax
            } );
            break;
          case 1:
            this.var.purpose.name = 'Focus';
            this.array.color.push( {
              hue: 0,
              saturation: 0,
              lightness: colorMax
            } );
            break;
          case 2:
            this.var.purpose.name = 'Shift';
            this.array.color.push( {
              hue: 0,
              saturation: 0,
              lightness: colorMax
            } );
            break;
          case 3:
            this.var.purpose.name = 'Impact';
            this.array.color.push( {
              hue: 0,
              saturation: 0,
              lightness: colorMax
            } );
            break;
        }

        break;
    }
  }

  //replenishment effort
  //Deep flow channel
  //ocean

  drawIcon( type, subtype, vec, d, coefficient ){
    let pointA, pointB, pointC;

    switch ( type ) {
      case 0:
        switch ( subtype ) {
          case 0:
            ellipse( vec.x, vec.y, d * 2, d * 2 );
            break;
          case 1:
            strokeWeight( 2 );
            stroke( hue, saturation, lightness );
            pointA = vec.copy();
            pointA.x -= d;
            pointA.y -= d;
            pointB = vec.copy();
            pointB.x += d;
            pointB.y += d;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d;
            pointA.y -= d;
            pointB = vec.copy();
            pointB.x -= d;
            pointB.y += d;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            strokeWeight( 1 );
          break;
        case 2:
          pointA = vec.copy();
          pointA.y -= d * coefficient;
          pointB = vec.copy();
          pointB.x += d * coefficient;
          pointB.y += d * coefficient;
          pointC = vec.copy();
          pointC.x -= d * coefficient;
          pointC.y += d * coefficient;
          triangle( pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y );
          break;
        case 3:
          pointA = vec.copy();
          pointA.x -= d;
          pointA.y -= d;
          rect( pointA.x, pointA.y, d * 2, d * 2 );
          break;
        }
        break;
    }
  }

  drawPurpose( id, center ){
    let vertex = [];
    let d = this.const.a / 10;
    let a = this.const.a / 5;
    let vec = center.copy();
    let offset = createVector( -this.const.size.x / 2 + a, -this.const.size.y / 2 + a );
    vec.add( offset );
    vertex.push( vec.copy() );

    vec = center.copy();
    offset = createVector( this.const.size.x / 2 - a, this.const.size.y / 2 - a );
    vec.add( offset );
    vertex.push( vec.copy() );

    let pointA, pointB, pointC, coefficient, hue;
    let saturation = colorMax;
    let lightness = colorMax * 0.5;

    switch ( id ) {
      case 0:
        hue = 280;
        break;
      case 1:
        hue = 240;
        break;
      case 2:
        hue = 120;
        break;
      case 3:
        hue = 0;
        break;
    }
    fill( hue, saturation, lightness );
    stroke( hue, saturation, lightness );

    for( let i = 0; i < vertex.length; i++ ){
      coefficient = 1;
      if( i == 1 )
        coefficient = -1;
      this.drawIcon( 0, id, vertex[i], d, coefficient );
    }
  }

  draw( vec ){
    stroke( 0 );
    fill( this.array.color[0].hue, this.array.color[0].saturation, this.array.color[0].lightness  );
    rect(
      vec.x -
      this.const.size.x / 2,
      vec.y -
      this.const.size.y / 2,
      this.const.size.x, this.const.size.y
    );
    let txt;

    switch ( this.var.type.id ) {
      case 0:
        fill( this.array.color[1].hue, this.array.color[1].saturation, this.array.color[1].lightness  );
        rect(
          vec.x, vec.y - this.const.size.y / 2,
          this.const.size.x / 2, this.const.size.y
        );
        fill( 0 );
        txt = this.var.amount.flow;
        text( txt, vec.x - this.const.size.x / 4, vec.y + fontOffset );
        txt = this.var.amount.channel;
        text( txt, vec.x + this.const.size.x / 4, vec.y + fontOffset  );
        break;
      case 1:
        fill( 0 );
        //txt = this.const.index;
        //text( txt, vec.x, vec.y - this.const.size.x / 4 + fontSize / 3 );
        txt = this.var.capacity;
        text( txt, vec.x, vec.y + this.const.size.x / 4 + fontOffset );
        break;
      case 2:
        fill( 0 );
        //txt = this.const.index;
        //text( txt, vec.x, vec.y - this.const.size.x / 4 + fontSize / 3 );
        this.drawPurpose( this.var.purpose.id, vec );
        break;
    }
  }
}
