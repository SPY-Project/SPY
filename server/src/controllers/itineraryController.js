import Itinerary from '../models/Itinerary.js';

// Create
export const createItinerary = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.title) return res.status(400).json({ message: 'title is required' });

    const it = new Itinerary(payload);
    await it.save();
    res.status(201).json(it);
  } catch (err) { next(err); }
};

// List with paging, search and tag filter
export const listItineraries = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '20', 10));
    const skip = (page - 1) * limit;

    const q = req.query.q;
    const tag = req.query.tag;
    const filter = {};
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
    if (tag) filter.tags = tag;
    if (req.query.public === 'true') filter.public = true;

    const [total, items] = await Promise.all([
      Itinerary.countDocuments(filter),
      Itinerary.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);

    res.json({ page, limit, totalPages: Math.ceil(total / limit), total, items });
  } catch (err) { next(err); }
};

// Get by id
export const getItinerary = async (req, res, next) => {
  try {
    const it = await Itinerary.findById(req.params.id);
    console.log(it , 'itinerary found');
    
    if (!it) return res.status(404).json({ message: 'Not found' });
    res.json(it);
  } catch (err) { next(err); }
};

// Update
export const updateItinerary = async (req, res, next) => {
  try {
    const it = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!it) return res.status(404).json({ message: 'Not found' });
    res.json(it);
  } catch (err) { next(err); }
};

// Delete
export const deleteItinerary = async (req, res, next) => {
  try {
    const it = await Itinerary.findByIdAndDelete(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', id: it._id });
  } catch (err) { next(err); }
};
