"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orders_1 = require("../orders");
var manager = new orders_1.Order_Manager;
describe("Products testing", function () {
    it("Expect create to be defined", function () {
        expect(manager.create).toBeDefined();
    });
    it('Expect index to be defined', function () {
        expect(manager.index).toBeDefined();
    });
    it('Exepect show to be defined', function () {
        expect(manager.show).toBeDefined();
    });
    it('Exepect delete to be defined', function () {
        expect(manager.delete).toBeFalsy();
    });
});
