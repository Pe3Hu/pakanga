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
        this.var.essence = {
          name: data.essence,
          object: data.object
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
        this.array.color.push( {
          hue: 0,
          saturation: 0,
          lightness: colorMax
        } );
        switch ( data.purpose ) {
          case 0:
            this.var.purpose.name = 'View';
            break;
          case 1:
            this.var.purpose.name = 'Focus';
            break;
          case 2:
            this.var.purpose.name = 'Shift';
            break;
          case 3:
            this.var.purpose.name = 'Impact';
            break;
        }

        break;
    }
  }

  //replenishment effort
  //Deep flow channel
  //ocean

  drawIcon( type, subtype, vec, d, coefficient ){
    let pointA, pointB, pointC, coefA, coefB;
    let n, angle, x, y;
    let style = false;

    switch ( type ) {
      //purpose icons
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
      //object icons
      case 1:
        stroke(colorMax);
        strokeWeight( 2 );
        switch ( subtype ) {
          case 'Track':
            noFill();
            arc(vec.x, vec.y, d * 4.2, d * 4.2, PI, PI * 2 );
            pointA = vec.copy();
            pointA.y -= d * 0.6;
            pointB = vec.copy();
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              n = 8;
              for( let i = 1; i < n; i++) {
                angle = -PI * 2 / n * ( n - i );
                y = ( angle / PI + 1 ) * d * 4;
                x = Math.sin( angle )  * d * 2;
                point( vec.x + x, vec.y + y );
              }
            }
            break;
          case 'Monitor':
            noFill();
            arc(vec.x, vec.y, d * 4.2, d * 4.2, 0, PI / 3);
            arc(vec.x, vec.y, d * 4.2, d * 4.2, PI / 3 * 2, PI);
            arc(vec.x, vec.y, d * 4.2, d * 4.2, PI / 3 * 4, PI / 3 * 5);
            if( style ){
              arc(vec.x, vec.y, d * 3, d * 3, PI / 3, PI / 3 * 2);
              arc(vec.x, vec.y, d * 3, d * 3, PI, PI / 3 * 4);
              arc(vec.x, vec.y, d * 3, d * 3, PI / 3 * 5, 0);
              point( vec.x, vec.y );
            }
            break;
          case 'Notice':
            pointA = vec.copy();
            pointA.y += d * 1.8;
            pointA.x -= d * 0.9
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              pointA = vec.copy();
              pointA.x += d * 1.75;
              pointA.y += d * 1.25;
              pointB = vec.copy();
              pointB.y -= d * 1.6;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
            }
            break;
          case 'Foresee':
            for( let i = -1; i <= 1; i++)
              for( let j = -1; j <= 1; j++)
                if( Math.abs( j + i ) == 1 ){
                  if( i == 0 ){
                    coefB = createVector( 1, -j );
                    coefA = createVector( -1, -j )
                  }
                  if( j == 0 ){
                    coefB = createVector( -i, 1 );
                    coefA = createVector( -i, -1 )
                  }
                  coefB.mult( 1 / Math.sqrt( 2 ) );
                  coefA.mult( 1 / Math.sqrt( 2 ) );

                  pointA = vec.copy();
                  pointA.x += i * 2.4 * d;
                  pointA.y += j * 2.4 * d;
                  pointB = vec.copy();
                  pointB.x += ( coefB.x + i * 2.4 ) * d;
                  pointB.y += ( coefB.y + j * 2.4 ) * d;
                  pointC = vec.copy();
                  pointC.x += ( coefA.x + i * 2.4 ) * d;
                  pointC.y += ( coefA.y + j * 2.4 ) * d;
                  line( pointA.x, pointA.y, pointB.x, pointB.y );
                  line( pointA.x, pointA.y, pointC.x, pointC.y );
                }
              if( style )
                for( let i = -1; i <= 1; i++)
                  for( let j = -1; j <= 1; j++)
                    if( Math.abs( j + i ) == 1 ){
                    if( i == 0 ){
                      coefB = createVector( 1, -j );
                      coefA = createVector( -1, -j )
                    }
                    if( j == 0 ){
                      coefB = createVector( -i, 1 );
                      coefA = createVector( -i, -1 )
                    }
                    coefB.mult( 1 / Math.sqrt( 2 ) );
                    coefA.mult( 1 / Math.sqrt( 2 ) );

                    pointA = vec.copy();
                    pointA.x += i * d;
                    pointA.y += j * d;
                    pointB = vec.copy();
                    pointB.x += ( coefB.x + i ) * d;
                    pointB.y += ( coefB.y + j ) * d;
                    pointC = vec.copy();
                    pointC.x += ( coefA.x + i ) * d;
                    pointC.y += ( coefA.y + j ) * d;
                    line( pointA.x, pointA.y, pointB.x, pointB.y );
                    line( pointA.x, pointA.y, pointC.x, pointC.y );
                  }
            break;
          case 'Inspire':
            pointA = vec.copy();
            pointA.y -= d * 1.5;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y += d * 1.2;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y += d * 1.2;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              pointA = vec.copy();
              pointA.x += d * 1.25;
              pointA.y -= d * 1.75;
              pointB = vec.copy();
              pointB.x += d * 1.25;
              pointB.y += d * 1.75;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
              pointA = vec.copy();
              pointA.x -= d * 1.25;
              pointA.y -= d * 1.75;
              pointB = vec.copy();
              pointB.x -= d * 1.25;
              pointB.y += d * 1.75;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
            }
            break;
          case 'Boost':
            pointA = vec.copy();
            pointA.x += d * 1.5;
            pointB = vec.copy();
            pointB.x -= d * 1.2;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x -= d * 1.2;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              pointA = vec.copy();
              pointA.y += d * 1.25;
              pointB = vec.copy();
              pointB.x += d * 1.75;
              pointB.y += d * 2.25;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
              pointA = vec.copy();
              pointA.y -= d * 1.25;
              pointB = vec.copy();
              pointB.x += d * 1.75;
              pointB.y -= d * 2.25;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
            }
            break;
          case 'Recovery':
            pointA = vec.copy();
            pointA.x += d * 1.8;
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Overheat':
            pointA = vec.copy();
            pointA.y -= d * 1.8;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y -= d * 0.3;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y -= d * 0.3;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.y += d * 0.3;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Dash':
            pointA = vec.copy();
            pointA.x -= d * 1.8;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x -= d * 1.8;
            pointA.y -= d * 0.8;
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y += d * 0.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d * 1.8;
            pointA.y -= d * 0.8;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y += d * 0.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Stance':
            pointA = vec.copy();
            pointA.x += d * 1.5;
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.x -= d * 1.5;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              pointA = vec.copy();
              pointA.y -= d * 0.8;
              pointB = vec.copy();
              pointB.x -= d * 1.2;
              pointB.y += d * 0.4;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
              pointB = vec.copy();
              pointB.x += d * 1.2;
              pointB.y += d * 0.4;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
            }
            break;
          case 'Meet':
            pointA = vec.copy();
            pointA.y -= d * 2.4;
            pointB = vec.copy();
            pointB.y -= d * 1.2;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d * 1.2;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.y += d * 1.2;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.y += d * 2.4;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            if( style ){
              pointA = vec.copy();
              pointA.y -= d * 0.8;
              pointB = vec.copy();
              pointB.x += d * 1.2;
              pointB.y -= d * 2;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
              pointB = vec.copy();
              pointB.x -= d * 1.2;
              pointB.y -= d * 2;
              line( pointA.x, pointA.y, pointB.x, pointB.y );
            }
            break;
          case 'Bias':
            pointA = vec.copy();
            pointA.x -= d * 0.6;
            pointA.y -= d * 1.5;
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x += d * 0.6;
            pointB.y += d * 1.5;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Harass':
            pointA = vec.copy();
            pointA.x -= d * 1.8;
            pointA.y -= d * 0.9;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y -= d * 0.9;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x -= d * 0.9;
            pointA.y -= d * 0.9;
            pointB = vec.copy();
            pointB.x -= d * 0.9;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x -= d * 1.8;
            pointA.y += d * 0.9;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y += d * 0.9;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d * 0.9;
            pointA.y += d * 0.9;
            pointB = vec.copy();
            pointB.x += d * 0.9;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Liquidation':
            pointA = vec.copy();
            pointA.x += d * 1.8;
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x -= d * 1.8;
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.x += d * 1.8;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Feint':
            pointA = vec.copy();
            pointA.x += d * 1.5;
            pointA.y -= d * 1.5;
            pointB = vec.copy();
            pointB.x += d * 1.5;
            pointB.y += d * 1.5;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.x += d * 1.5;
            pointB = vec.copy();
            pointB.x -= d * 0.5;
            pointB.y += d * 1.5;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.x -= d * 1.8;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
          case 'Ricochet':
            pointA = vec.copy();
            pointA.y -= d * 1.8;
            pointB = vec.copy();
            pointB.x -= d * 1.2;
            pointB.y -= d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.y -= d * 0.6;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointA = vec.copy();
            pointA.y += d * 1.8;
            pointB = vec.copy();
            pointB.x += d * 1.2;
            pointB.y += d * 1.8;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            pointB = vec.copy();
            pointB.y += d * 0.6;
            line( pointA.x, pointA.y, pointB.x, pointB.y );
            break;
        }
        strokeWeight( 1 );
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
    this.drawIcon( 1, this.var.essence.name, center, d, coefficient );
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
