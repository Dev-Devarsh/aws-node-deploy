import express from "express";
import { countByCity, countByType, createHotel, deleteHotel, getAllHotels, getHotelById, getHotelRooms, updateHotel } from "../controllers/hotel_controller.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/find/:id", verifyAdmin, deleteHotel);

//GET
router.get("/getHotelById/:id", getHotelById);

//GET ALL
router.get("/", getAllHotels);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router;

// NOTE:

// is every thing is okay and suddenlr app thows an error for initialization then simplt add new route after old route

// OR

// suffle route method 

/* in this case "can not access 'hotel' before initialization at getHotelById " cuse yo resolve this i simply added new route [/getHotelById] 
 to get hotel bu id */

// OR 

// suffle [countByCity] and [countByType] to up