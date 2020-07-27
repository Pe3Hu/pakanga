class weapon {
  constructor ( data ){
    this.const = {
      index: data.index
    };
    this.var = {
      archetype: data.archetype,
      subtype: data.subtype,
      material: data.material,
      quality: data.quality,
      durability: data.durability,
      grip: {
        id: null,
        name: null
      }
    }
    this.array = {
      technique: []
    }

    this.setGrip( data );
    this.setTechnique();
  }

  setGrip( data ){
    this.var.grip.id = data.grip;
    switch ( data.grip ) {
      case 0:
        this.var.grip.name = 'with one hand';
        break;
      case 1:
        this.var.grip.name  = 'with two hands';
        break;
    }
  }

  setTechnique(){
    switch ( this.var.archetype ) {
      case 'sword':
        //cut pierce
        break;
    }
  }

  draw(){
  }
}
