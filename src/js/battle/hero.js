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
      },
      deedIndex: {
        absorb: 0,
        splash: 0
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
      vertex: [ [], [], [] ],
      hand: [ 2, 0, 0 ],
      reserve: [],
      absorb: [],
      index: [],
      weapon: []
    };

    this.init();
  }

  init(){
    this.initWeapons();
    this.initReserves();
    this.initPose();
  }


  initWeapons(){
    this.array.weapon = [];
    let type = 0;
    let card = 0;
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

    this.array.index.push( [] );
    this.array.index[card].push( [ [], [], [], [] ] )
    //0 - weapons in stock
    //1 - weapon in hand
    //2 - unarmed
    //3 - lost weapon

    for( let i = 0; i < 5; i++ )
      this.array.index[card][type][2].push( this.array.weapon[i] );

    for( let i = 5; i < this.array.weapon.length - 1; i++ )
      this.array.index[card][type][0].push( this.array.weapon[i] );

    this.array.index[card][type][1].push( this.array.weapon[this.array.weapon.length - 1] );
  }

  initReserves(){
    this.array.reserve = [ [], [], [] ];
    //index string matches the type
    //0 - deep
    //1 - flow
    //2 - channel
    this.array.index.push( [
      [ [], [], [], [] ],
      [ [], [], [], [] ],
      [ [], [], [], [] ]
    ] );
    //reserve indices depending on the state
    //0 - in the deck
    //1 - awaiting player selection
    //2 - played on the table
    //3 - went off

    this.initDeeps();
  }

  initDeeps(){
    let card = 1;
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
      this.array.index[card][type][0].push( this.var.reserveIndex.deep );
      this.var.reserveIndex.deep++;
      if( i == 1 ){
        this.array.reserve[type].push( new reserve( data ) );
        this.array.index[card][type][0].push( this.var.reserveIndex.deep );
        this.var.reserveIndex.deep++;
      }
    }

    this.array.index[card][type][0] = this.shuffle( this.array.index[card][type][0] );

    this.fillHand( type );
  }

  initFlows(){
    let card = 1;
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
        this.array.index[card][type][0].push( this.var.reserveIndex.flow );
        this.var.reserveIndex.flow++;
      }

      progression++;
      n += progression;
    }

    this.array.index[card][type][0] = this.shuffle( this.array.index[card][type][0] );
    this.fillHand( type );
  }

  initChannels(){
    let card = 1;
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
        this.array.index[card][type][0].push( this.var.reserveIndex.channel );
        this.var.reserveIndex.channel++;
      }
    }

    //this.array.index[card][type][0] = this.shuffle( this.array.index[card][type][0] );
    this.fillHand( type );
  }

  initPose(){
    let card = 0;
    let type = 0;
    let offset = 0;
    let data = {
      a: this.const.a,
      offset: this.array.offset[offset],
      owner: 'hero',
      rightHander: this.const.rightHander,
      grip: this.array.index[card][type][1][0].var.grip.id
    };

    this.var.pose = new pose( data );
  }

  initDeeds(){
    this.initRackChanges();
  }

  initRackChanges(){
    let card = 2;
    this.array.absorb = [];
    this.array.absorb.push( [] );
    let type = 0;

    //0 - basic absorb
    //1 - basic splash
    this.array.index.push( [
      [ [], [], [] ],
      [ [], [], [] ]
    ] );
    //0 - inaccessible basic actions
    //1 - available basic actions
    //2 - selected basic actions

    //horizon vertical stance shift
    for( let h = -1; h <= 1; h++ )
      for( let v = -1; v <= 1; v++ )
        if( Math.abs( h ) + Math.abs( v ) == 1 ){
          let data = {
            index: this.var.deedIndex.absorb,
            a: this.const.a,
            type: type,
            horizon: h,
            vertical: v
          };

          this.array.absorb[type].push( new absorb( data ) );
          this.array.index[card][type][0].push( this.var.deedIndex.absorb );
          this.var.deedIndex.absorb++;
        }

    let dist = 1;
    this.provideChoiceOfRackChange( dist );
  }

  provideChoiceOfRackChange( dist ){
    let type = 0;
    let card = 2;
    let pose = this.var.pose;
    let options =  pose.array.protected;
    let choice = [];
    let defense = pose.array.position[pose.var.currentPosition].protected;
    //console.log( options, defense )

    for( let i = 0; i < defense.length; i++ )
      for( let h = 0; h < options.length; h++ )
        for( let v = 0; v < options[h].length; v++ ){
          let x = v - defense[i].vertical;
          let y = h - defense[i].horizon;
          let d = Math.abs( x ) + Math.abs( y );
          if( d == dist && !options[h][v] )
            choice.push({
              vertical: x,
              horizon: y
            });
        }

    for( let i = 0; i < choice.length; i++ ){

    }
    //    console.log( choice )
    for( let i = 0; i < 4; i++ ){
      let index = this.array.index[card][type][0].pop();
      this.array.index[card][type][1].push( index );
    }
    console.log( this.array.index[card][type] )

   this.updateVertexs( card, type );
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
    let card = 1;
    let l = this.array.hand[type];
    if( this.array.index[card][type][0].length < this.array.hand[type] ){
      l = this.array.index[card][type][0].length;

      //up to play the remainder
      for( let i = 0; i < l; i++ ){
        let index = this.array.index[card][type][0].pop();
        this.array.index[card][type][1].push( index );
      }

      for( let i = this.array.index[card][type][3].length - 1; i >= 0 ; i-- )
        this.array.index[card][type][0].push( this.array.index[card][type][3].pop() );

      //take the missing number of reserves
      l = this.array.hand[type] - l;
    }

    for( let i = 0; i < l; i++ ){
      let index = this.array.index[card][type][0].pop();
      this.array.index[card][type][1].push( index );
    }

    this.updateVertexs( card, type );
  }

  updateVertexs( card, type ){
    let x, y, offset;
    //card == 0 - weapon
    //type == 0 - equipped vertexs

    //card == 1 - reserve
    //type == 0 - deep vertexs
    //type == 1 - Flow vertexs
    //type == 2 - Channel vertexs

    //card == 2 - deed
    //type == 0 - basic absorb vertexs
    //type == 1 - basic splash vertexs
    this.array.vertex[card][type] = [ [], [] ];
    //vertex[type][0] - in processing
    //vertex[type][1] - selected

    switch ( card ) {
      case 1:
        offset = type + 1;
        break;
      case 2:
        offset = type + 4;
        break;
    }

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

      let vec = this.array.offset[offset].copy();
      vec.y += koef * y;
      vec.x -= ( this.array.index[card][type][n].length + 1 ) / 2 * x;

      for( let i = 0; i < this.array.index[card][type][n].length; i++ ){
        vec.x += x;
        this.array.vertex[card][type][n - 1].push( vec.copy() );
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

  drawReserve(){
    let card = 1;
    //i == 0 - Deep; i == 1 - Flow;  i == 2 - Channel;
    //j == 1 - awaiting; j == 2 - played;
    for( let i = 0; i < 3; i++ )
      for( let j = 1; j < 3; j++ )
        for( let l = 0; l < this.array.index[card][i][j].length; l++ ){
          let index = this.array.index[card][i][j][l];
          //console.log( this.array.vertex[card] )
          let vertex = this.array.vertex[card][i][j - 1][l];
          let flag = this.var.current.deep == null;

          if( !flag )
            flag = i != 0 || this.var.current.deep.const.index == index;

          if( flag )
            this.array.reserve[i][index].draw( vertex );
        }
  }

  drawAbsorb(){
    if( this.var.current.deep == null )
      return;

    let card = 2;
    for( let i = 0; i < 1; i++ )
      for( let j = 1; j < 3; j++ )
        for( let l = 0; l < this.array.index[card][i][j].length; l++ ){
          let index = this.array.index[card][i][j][l];
          let vertex = this.array.vertex[card][i][j - 1][l];

          this.array.absorb[i][index].draw( vertex );
        }
  }

  draw(){
    this.drawReserve();
    this.drawAbsorb();
    this.var.pose.draw();
  }
}
