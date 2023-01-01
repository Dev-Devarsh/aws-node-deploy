import hotel from "../models/hotelSchema.js";
import rooms from "../models/roomSchema.js";
import { createError } from "../utils/error.js";

//never give a variable name to imported schema name it will give you late initilization error

export const createHotel = async (req, res, next) => {
  try {
    const newHotel = new hotel(req.body)
    const saveHotel = await newHotel.save()
    res.status(200).json(saveHotel)
  } catch (error) {
    /// Custom error
    next(createError(401, 'You are not authenicated'))

    /// we are gonna handle error by using Next and this error will be handle by error handler in Index.js
    next(error);
  }
}
export const updateHotel = async (req, res, next) => {
  try {
    const updateHotel = await hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    const saveHotel = await updateHotel.save()
    res.status(200).json(saveHotel)
  } catch (error) {
    next(error);
  }
}
export const deleteHotel = async (req, res, next) => {
  /// How to set custom errors
  // const failed = true;
  // const err = new Error(); // make new Error class instance
  // err.status = 404;
  // err.message = "Sorry hotel can not found!"
  try {
    await hotel.findByIdAndDelete(req.params.id)
    res.status(200).json('Hotel deleted')
  } catch (error) {
    next(error);
  }
}
export const getHotelById = async (req, res, next) => {
    console.log(`getHotelById ${req.params.id}`);
  try {
   const getHotel =  await hotel.findById(req.params.id)
    res.status(200).json(getHotel)
  } catch (error) {
    next(error);
  }
}
export const getAllHotels = async (req, res, next) => {
  const { min, max,city } = req.query;
  // console.log(`others ${others}`);
  // console.log(`others ${min}`);
  // console.log(`others ${max}`);
  try {
    if (min != undefined || max != undefined && city != undefined) {
      console.log(`min max ${city}`);
      const hotels = await hotel.find({
        city, cheapestPrice: {
          $gt: min, $lt: max
        },
      }).limit(req.query.limit);
      res.status(200).json(hotels);
    } else if (city != undefined) {
      console.log(`city ${city}`);
      const hotels = await hotel.find({
        city});
      res.status(200).json(hotels);
    } else {
      console.log('alllll');
      const hotels = await hotel.find();
      res.status(200).json(hotels);
    }
  } catch (error) {
    next(error);
  }
}

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  console.log(req.query.cities);
  try {
    const list = await Promise.all(
      cities.map((cities) => {
        return hotel.countDocuments({ city: cities });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await hotel.countDocuments({ type: "apartment" });
    const resortCount = await hotel.countDocuments({ type: "resort" });
    const villaCount = await hotel.countDocuments({ type: "villa" });
    const cabinCount = await hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return rooms.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};