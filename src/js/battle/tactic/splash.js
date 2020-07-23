class splash {
  constructor ( data ){
    this.const = {
      index: data.index
    };
    this.var = {
      who: data.who, //кто 
      whom: data.whom, //кого
      wherewith: data.wherewith, //чем
      whither: data.whither, //откуда
      whence: data.whence, //куда
      threat: data.threat, //угроза
      pace: data.pace //темп
    }
    this.array = {
      feature: [],
      blindSpot: []
    }

    this.init( data );

  }

  init( data ){
    for( let i = 0; i <  data.blindSpot.length; i++ )
       this.array.blindSpot.push( data.blindSpot[i] );
  }

  draw(){
  }
}
