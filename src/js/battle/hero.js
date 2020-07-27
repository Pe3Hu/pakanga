//
class hero{
  constructor( data ){
    this.const = {
      a: cellSize,
      rightHander: data.rightHander
    };
    this.var = {
      reserveIndex: {
        deep: 0,
        flow: 0,
        channel: 0,
        deed: 0
      },
      current:{
        deep: null,
        flow: null,
        channel: null
      },
      flowSum: 0,
      pose: null
    }
    this.array = {
      offset: data.offsets,
      vertex: [],
      hand: [ 2, 0, 0 ],
      reserve: [],
      index: [],
      weapon: []
    };

    this.init();
  }

  init(){
    this.initReserves();
    this.initWeapons();
    this.initPose();
  }

  initReserves(){
    this.array.reserve = [ [], [], [], [] ];
    //index string matches the type
    //0 - deep
    //1 - flow
    //2 - channel
    //3 - weapon
    this.array.index = [
      [ [], [], [], [] ],
      [ [], [], [], [] ],
      [ [], [], [], [] ]
    ];
    //reserve indices depending on the state
    //0 - in the deck
    //1 - awaiting player selection
    //2 - played on the table
    //3 - went off

    this.array.index.push( [ [], [], [] ] )
    //0 - basic actions
    //1 - available actions
    //2 - selected actions

    this.initDeeps();
  }

  initWeapons(){
    this.array.weapon = [];
    let type = 4;
    let archetype = 'limb';
    let material = 'flesh';
    let quality = 0;
    let durability = {
      current: 100,
      min: 0,
      max: 100
    };
    let grip = 0;
    let subtypes = [
      'right  hand',
      'left  hand',
      'right leg',
      'left leg',
      'head'
    ];

    for (var i = 0; i < subtypes.length; i++)
      this.array.weapon.push( new weapon( {
          index: i,
          archetype: archetype,
          subtype: subtypes[i],
          material: material,
          quality: quality,
          durability: durability,
          grip: grip
        } ) );

    let index = subtypes.length;
    archetype = 'sword';
    let subtype = 'single-edged'
    material = 'steel';
    quality = 1;

    this.array.weapon.push( new weapon( {
        index: index,
        archetype: archetype,
        subtype: subtype,
        material: material,
        quality: quality,
        durability: durability,
        grip: grip
      } ) );

    this.array.index.push( [ [], [], [], [] ] )
    //0 - weapons in stock
    //1 - weapon in hand
    //2 - unarmed
    //3 - lost weapon

    for( let i = 0; i < 5; i++ )
      this.array.index[type][2].push( this.array.weapon[i] );

    for( let i = 5; i < this.array.weapon.length - 1; i++ )
      this.array.index[type][0].push( this.array.weapon[i] );

    this.array.index[type][1].push( this.array.weapon[this.array.weapon.length - 1] );
  }

  initPose(){
    let type = 4;
    let data = {
      a: this.const.a,
      offset: this.array.offset[type],
      owner: 'hero',
      rightHander: this.const.rightHander,
      grip: this.array.index[type][1][0].var.grip.id
    }

    this.var.pose = new pose( data );
  }

  initDeeps(){
    let type = 0;
    let n = 3;

    for( let i = 0; i < n; i++ ){
      let data = {
        index: this.var.reserveIndex.deep,
        a: this.const.a,
        type: type,
        flowAmount: 8,//8 - i * 2,
        channelAmount: 16//2 + i
      };

      this.array.reserve[type].push( new reserve( data ) );
      this.array.index[type][0].push( this.var.reserveIndex.deep );
      this.var.reserveIndex.deep++;
      if( i == 1 ){
        this.array.reserve[type].push( new reserve( data ) );
        this.array.index[type][0].push( this.var.reserveIndex.deep );
        this.var.reserveIndex.deep++;
      }
    }

    this.array.index[type][0] = this.shuffle( this.array.index[type][0] );

    this.fillHand( type );
  }

  initFlows(){
    let type = 1;
    let capacity;
    let progression = 1;
    let n = 1;

    for( let capacity = 4; capacity > 0; capacity-- ){

      for( let i = 0; i < n; i++ ){
        let data = {
          index: this.var.reserveIndex.flow,
          a: this.const.a,
          type: type,
          capacity: capacity
        };

        this.array.reserve[type].push( new reserve( data ) );
        this.array.index[type][0].push( this.var.reserveIndex.flow );
        this.var.reserveIndex.flow++;
      }

      progression++;
      n += progression;
    }

    this.array.index[type][0] = this.shuffle( this.array.index[type][0] );
    this.fillHand( type );
  }

  initChannels(){
    let type = 2;
    let purpose;
    let n = 4;//3

    for( let purpose = 0; purpose < 4; purpose++ ){

      for( let i = 0; i < n; i++ ){
        let number, obj;

        switch ( purpose ) {
          case 0:
          case 1:
            number = 0;
            //obj only for case 0
            obj = i;
            break;
          case 2:
          case 3:
            number = i;
            if( i == 2 )
              number = 0;
            break;
        }

        let result = this.setEssence( purpose, i, obj );
        let data = {
          index: this.var.reserveIndex.channel,
          a: this.const.a,
          type: type,
          purpose: purpose,
          essence: result.essence,
          object: result.object
        };

        this.array.reserve[type].push( new reserve( data ) );
        this.array.index[type][0].push( this.var.reserveIndex.channel );
        this.var.reserveIndex.channel++;
      }
    }

    //this.array.index[type][0] = this.shuffle( this.array.index[type][0] );
    this.fillHand( type );
  }

  initDeeds(){
    let type = 3;

    //horizon vertical stance shift
    for( let h = -1; h <= 1; h++ )
      for( let v = -1; v <= 1; v++ )
        if( Math.abs( h ) + Math.abs( v ) == 1 ){
          let data = {
            index: this.var.reserveIndex.deed,
            a: this.const.a,
            type: type,
            horizon: h,
            vertical: v
          };

          this.array.reserve[type].push( new reserve( data ) );
          this.array.index[type][0].push( this.var.reserveIndex.deed );
          this.var.reserveIndex.deed++;
        }


      for( let i = 0; i < 4; i++ ){
        let index = this.array.index[type][0].pop();
        this.array.index[type][1].push( index );
      }

     this.updateVertexs( type );
  }

  setEssence( purpose, number, obj ){
    let essence, object = null;

    switch ( purpose ) {
      case 0:
        switch ( number ) {
          case 0:
            essence = 'Track';
            break;
          case 1:
            essence = 'Monitor';
            break;
          case 2:
            essence = 'Notice';
            break;
          case 3:
            essence = 'Foresee';
            break;
        }
        break;
      case 1:
        switch ( number ) {
          case 0:
            essence = 'Inspire';
            break;
          case 1:
            essence = 'Boost';
            break;
          case 2:
            essence = 'Recovery';
            break;
          case 3:
            essence = 'Overheat';
            break;
        }
        break;
      case 2:
        switch ( number ) {
          case 0:
            essence = 'Dash';
            break;
          case 1:
            essence = 'Stance';
            break;
          case 2:
            essence = 'Meet';
            break;
          case 3:
            essence = 'Bias';
            break;
        }
        break;
      case 3:
        switch ( number ) {
          case 0:
            essence = 'Harass';
            break;
          case 1:
            essence = 'Liquidation';
            break;
          case 2:
            essence = 'Feint';
            break;
          case 3:
            essence = 'Ricochet';
            break;
        }
        break;
    }

    if( purpose == 1 ){
      object = {
        id: obj,
        name: null
      }
      switch ( number ) {
        case 0:
        case 1:
          switch ( obj ) {
            case 0:
              object.name = 'View';
              break;
            case 1:
              object.name = 'Shift';
              break;
            case 2:
              object.name = 'Impact';
              break;
          }
          break;
        case 2:
        case 3:
          switch ( obj ) {
            case 0:
              object.name = 'Flow';
              break;
            case 1:
              object.name = 'Channel';
              break;
          }
          break;
      }
    }

    return {
      essence: essence,
      object: object
    }
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

      //take the missing number of reserves
      l = this.array.hand[type] - l;
    }

    for( let i = 0; i < l; i++ ){
      let index = this.array.index[type][0].pop();
      this.array.index[type][1].push( index );
    }

    this.updateVertexs( type );
  }

  updateVertexs( type ){
    //0 - deep vertexs
    //1 - Flow vertexs
    //2 - Channel vertexs
    //3 - Deed vertexs
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
      case 3:
        x = this.const.a * 1.25;
        y = this.const.a;
        break;
    }

    for( let n = 1; n < 3; n++ ){
      let koef;
      switch ( n ) {
        case 1:
          koef = 1;
          break;
        case 2:
          koef = -1;
          break;
      }

      let vec = this.array.offset[type].copy();
      console.log( type, n, vec )
      vec.y += koef * y;
      vec.x -= ( this.array.index[type][n].length + 1 ) / 2 * x;
      console.log( type, n, vec )


      for( let i = 0; i < this.array.index[type][n].length; i++ ){
        vec.x += x;
        this.array.vertex[type][n - 1].push( vec.copy() );
        console.log( type, n, vec )
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

  draw(){
    //i == 0 - Deep; i == 1 - Flow;  i == 2 - Channel;
    //j == 1 - awaiting; j == 2 - played;
    for( let i = 0; i < 4; i++ )
      for( let j = 1; j < 3; j++ )
        for( let l = 0; l < this.array.index[i][j].length; l++ ){
          let index = this.array.index[i][j][l];
          let vertex = this.array.vertex[i][j - 1][l];
          let flag = this.var.current.deep == null;

          if( !flag )
            flag = i != 0 || this.var.current.deep.const.index == index;

          if( flag )
            this.array.reserve[i][index].draw( vertex );
        }


    this.var.pose.draw();
  }
}
