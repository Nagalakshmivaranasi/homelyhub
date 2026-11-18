// get all properties
// get property based on id

import { Property } from '../Models/propertymodel.js';
import { APIFeatures } from '../utils/APIFeatures.js';

const normalizeProperty = (property) => {
  if (!property || typeof property !== 'object') return property;

  const normalized = { ...property.toObject ? property.toObject() : { ...property } };

  if (normalized.RoomType && !normalized.roomType) normalized.roomType = normalized.RoomType;
  if (normalized.roomType && !normalized.RoomType) normalized.RoomType = normalized.roomType;

  if (normalized.MaximumGuest && !normalized.maximumGuest) normalized.maximumGuest = normalized.MaximumGuest;
  if (normalized.maximumGuest && !normalized.MaximumGuest) normalized.MaximumGuest = normalized.maximumGuest;

  if (normalized.chekInTime && !normalized.checkInTime) normalized.checkInTime = normalized.chekInTime;
  if (normalized.chekOutTime && !normalized.checkOutTime) normalized.checkOutTime = normalized.chekOutTime;

  if (normalized.RoomType && normalized.roomType && normalized.RoomType !== normalized.roomType) {
    delete normalized.RoomType;
  }

  if (normalized.MaximumGuest && normalized.maximumGuest && normalized.MaximumGuest !== normalized.maximumGuest) {
    delete normalized.MaximumGuest;
  }

  if (normalized.chekInTime && normalized.checkInTime && normalized.chekInTime !== normalized.checkInTime) {
    delete normalized.chekInTime;
  }

  if (normalized.chekOutTime && normalized.checkOutTime && normalized.chekOutTime !== normalized.checkOutTime) {
    delete normalized.chekOutTime;
  }

  return normalized;
};

const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search()
      .paginate();

    const doc = await features.query;
    const normalizedDoc = doc.map(normalizeProperty);

    res.status(200).json({
      status: 'success',
      no_of_responses: normalizedDoc.length,
      data: normalizedDoc,
    });
  } catch (error) {
    console.error('error in searching properties: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get property id
//http://localhost:5000/api/v1/rent/listing:id
//req.params.id


const getProperty = async(req, res)=>{
    try {
        const property = await Property.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: normalizeProperty(property)
        })
    } catch(error) {
        res.status(404).json({
            status: "fail",
            message : error.message
        })
    }
}

export { getProperties , getProperty};