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
    };
    this.var = {
      type:{
        id: null,
        name: null
      }
    };

    this.init( data );
  }

  init( data ){
    this.setType( data );
  }

  setType( data ){
    this.var.type.id = data.type;
    switch ( data.type ) {
      case 0:
        this.var.type.name = 'Cascade';
        this.var.amount = {
          flow: data.flow,
          channel: data.channel
        };
        this.const.size = {
          x: 1.5 * this.const.a,
          y: this.const.a,
        };
        break;
      case 1:
        this.var.type.name = 'Flow';
        this.var.capacity = data.capacity;
        this.const.size = {
          x: this.const.a,
          y: 1.5 * this.const.a,
        };
        break;
      case 2:
        this.var.type.name = 'Channel';
        this.var.objective = {
          id: data.objective,
          name: null
        };
        switch ( data.objective ) {
          case 0:
            this.var.objective.name = 'Shift';
            break;
          case 1:
            this.var.objective.name = 'Impact';
            break;
          case 2:
            this.var.objective.name = 'View';
            break;
        }
        //shift
        this.const.size = {
          x: this.const.a,
          y: 1.5 * this.const.a,
        };
        break;
    }
  }

  //replenishment effort
  //cascade flow channel
  //ocean

  draw( vec ){
    stroke( 0 );
    fill( colorMax );
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
        fill( 0 );
        txt = this.const.index;//this.var.amount.flow;
        text( txt, vec.x - this.const.size.x / 4, vec.y + fontSize / 3 );
        //txt = this.var.amount.channel;
        text( txt, vec.x + this.const.size.x / 4, vec.y + fontSize / 3 );
        break;
      case 1:
        fill( 0 );
        txt = this.const.index;
        text( txt, vec.x, vec.y - this.const.size.x / 4 + fontSize / 3 );
        txt = this.var.capacity;
        text( txt, vec.x, vec.y + this.const.size.x / 4 + fontSize / 3 );
        break;
      case 2:
        fill( 0 );
        txt = this.const.index;
        text( txt, vec.x, vec.y - this.const.size.x / 4 + fontSize / 3 );
        txt = this.var.objective.name.charAt(0);
        text( txt, vec.x, vec.y + this.const.size.x / 4 + fontSize / 3 );
        break;
        break;
    }
  }
}
