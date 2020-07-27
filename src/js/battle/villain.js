//
class villain{
  constructor( data ){
    this.const = {
      a: cellSize,
      rightHander: data.rightHander
    };
    this.var = {
      pose: null
    }
    this.array = {
      offset: data.offsets
    };

    this.init();
  }

  init(){
    this.initPose();
  }


  initPose(){
    let grip = 1;
    let data = {
      a: this.const.a,
      offset: this.array.offset[0],
      owner: 'villain',
      rightHander: this.const.rightHander,
      grip: grip
    }

    this.var.pose = new pose( data );
  }

  draw(){
    this.var.pose.draw();
  }
}
