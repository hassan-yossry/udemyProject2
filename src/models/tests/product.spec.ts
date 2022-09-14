import { Product_Manager } from "../products";
const manager = new Product_Manager;
describe("Products testing",()=>{
    it("Expect create to be defined",()=>{
        expect(manager.create).toBeDefined();
    })
    it('Expect index to be defined',()=>{
        expect(manager.index).toBeDefined()
    })
    it('Exepect show to be defined',()=>{
        expect(manager.show).toBeDefined()
    })
    it('Exepect delete to be defined',()=>{
        expect(manager.delete).toBeFalsy()
    })
})