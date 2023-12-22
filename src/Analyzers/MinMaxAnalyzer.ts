import { Analyzer, Flight } from "../types";


export class MinMaxAnalyzer implements Analyzer {
    static description : string = "Min - Max"


    constructor(public connexion : string, public flightList : Flight[]){}

    private min(array: Flight[], col: 2 | 3 | 4) : number {
      return  Math.min(...array
            .filter(flight => flight[1] === this.connexion)
            .map(flight => flight[col]))
    }

    private max(array: Flight[], col: 2 | 3 | 4) : number {
        return  Math.max(...array
              .filter(flight => flight[1] === this.connexion)
              .map(flight => flight[col]))
      }


    run() : string[] {
        return [
            `Le plus petit nombre de passagers sur ${this.connexion} : ${this.min(this.flightList, 2)}`,
            `Le plus grand nombre de passagers sur ${this.connexion} : ${this.max(this.flightList, 2)}`,
            `La plus petite durée de vol sur ${this.connexion} : ${this.min(this.flightList, 3)} min`,
            `La plus grande durée de vol sur ${this.connexion} : ${this.max(this.flightList, 3)} min`,
            `La plus petite altitude sur ${this.connexion} : ${this.min(this.flightList, 4)} m`,
            `La plus haute altitude sur  ${this.connexion} : ${this.max(this.flightList, 4)} m`,
        ]
    }
}