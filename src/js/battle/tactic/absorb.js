class absorb {
  constructor ( data ){
    this.const = {
      index: data.index,
      a: data.a
    };
    this.var = {
      type:{
        id: null,
        name: null
      }
    }
    this.array = {
      color: []
    }

    this.setType( data );
  }

  setType( data ){
    this.var.type.id = data.type;
    switch ( this.var.type.id ) {
      case 0:
        this.var.type.name = 'rackChange';
        this.const.size = {
          x: this.const.a,
          y: 1.5 * this.const.a,
        };
        /*
        this.var.subtype = {
          id: data.subtype.id,
          name:  data.subtype.name
        };*/
        this.var.shift = {
          horizon: data.horizon,
          vertical: data.vertical
        };
        //background color
        this.array.color.push( {
          hue: 330,
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
    }
  }


  drawIcon( center ){
    let pointA, pointB;
    let subtype = this.var.subtype;
    let d = this.const.a / 8;
    switch ( this.var.type.id ) {
      case 0:
        //n = 0 - shift down
        //n = 1 - shift to the left
        //n = 3 - shift to the right
        //n = 4 - shift up
        let n = this.var.shift.horizon * 2 + this.var.shift.vertical + 2;
        let vec = center.copy();
        let points = [];
        vec.x += this.var.shift.vertical * d;
        vec.y += this.var.shift.horizon * d;
        pointA = vec.copy();
        pointA.x -= d;
        pointA.y += d;
        points.push( pointA );
        pointA = vec.copy();
        pointA.x += d;
        pointA.y += d;
        points.push( pointA );
        pointA = vec.copy();
        pointA.x += d;
        pointA.y -= d;
        points.push( pointA );
        pointA = vec.copy();
        pointA.x -= d;
        pointA.y -= d;
        points.push( pointA );


        vec = center.copy();
        vec.x -= this.var.shift.vertical * d;
        vec.y -= this.var.shift.horizon * d;
        //previous position
        fill(0);
        //stroke(0);
        strokeWeight( 2 );
        ellipse( vec.x , vec.y, d * 2, d * 2 );

        //next position
        for( let i = 0; i < points.length; i++ )
          if( i != n && !( i == 2 && n == 4 )){
            let ii = ( i + 1 ) % points.length;
            line( points[i].x, points[i].y, points[ii].x, points[ii].y );
          }
        strokeWeight( 1 );
        break;
    }
  }

  draw( center ){
    stroke( 0 );
    fill( this.array.color[0].hue, this.array.color[0].saturation, this.array.color[0].lightness  );
    rect(
      center.x - this.const.size.x / 2,
      center.y - this.const.size.y / 2,
      this.const.size.x, this.const.size.y
    );

    this.drawIcon( center );
  }
}
