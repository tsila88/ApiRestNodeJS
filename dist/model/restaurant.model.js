"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
let restaurantSchema = new mongoose_1.default.Schema({
    address: {
        type: Object,
        structure: {
            building: {
                type: String,
                required: true
            },
            coord: {
                type: Object,
                structure: {
                    type: {
                        type: String,
                        required: true
                    },
                    coordinates: {
                        type: Array,
                        required: true
                    }
                },
                required: true
            },
            street: {
                type: String,
                required: true
            },
            zipcode: {
                type: String,
                required: true
            }
        },
        required: true
    },
    borough: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    grades: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    restaurant_id: {
        type: String,
        required: true
    }
});
restaurantSchema.plugin(mongoose_paginate_1.default); //Pour la pagination 
const Restaurant = mongoose_1.default.model("Restaurant", restaurantSchema);
exports.default = Restaurant;
