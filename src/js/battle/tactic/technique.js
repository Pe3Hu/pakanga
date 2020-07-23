class technique {
  constructor ( data ){
    this.const = {
      index: data.index
    };
    this.var = {
      demand: {
        growth: data.growth, // > min
        weapon: data.weapon, // list
        mastery: data.mastery, // > min
        distance: data.distance // min - max
      },
      effect: {
        pattern: data.pattern, //узор
        threat: data.threat, //угроза
        pace: data.pace //темп
      }
    }
    this.array = {
      acupuncture: []
    }
  }

  draw(){
  }
}
