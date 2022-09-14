"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../users");
var manager = new users_1.User_Manager;
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
        expect(manager.delete).toBeDefined();
    });
});
