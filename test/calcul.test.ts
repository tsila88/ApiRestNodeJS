import Calcul from "../src/calcul";

describe("Calcul",()=>{
    it("should return 13", function () {
        let a:number=3;
        let b:number = 10;
        let expected:number =13;
        expect(Calcul.somme(a,b)).toBe(expected);

    });
});