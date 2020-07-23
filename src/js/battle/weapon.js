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
      durability: data.durability
    }
    this.array = {
      technique: []
    }

    this.setTechnique();
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
