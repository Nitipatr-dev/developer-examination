const { connectDB } = require('../configs/conndb');
const { ObjectId } = require('mongodb');
const Item = require('../models/item');

async function get_items(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('item_data');
        const cursor = collection.find();
        const items = await cursor.toArray();
        res.status(200).json({
            status: 'success',
            message: 'Items retrieved successfully',
            data: items
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: []
        });
    }
}

async function get_item_by_id(req, res) {
    try {
        const itemId = req.params.id;
        const db = await connectDB();
        const collection = db.collection('item_data');
        const itemById = await collection.findOne({ _id: new ObjectId(itemId) });

        if (itemById) {
            res.status(200).json({
                status: 'success',
                message: 'Item retrieved successfully',
                data: itemById
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Item not found',
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
}

async function insert_item(req, res) {
    try {
        const newItemData = req.body;
        const newItem = Item.create(newItemData);
        const db = await connectDB();
        const collection = db.collection('item_data');
        const result = await collection.insertOne(newItem);
        res.status(201).json({
            status: 'success',
            message: 'Item created successfully',
            data: newItemData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
}

async function update_item(req, res) {
    try {
        const itemId = req.params.id;
        const updateItemdata = req.body;
        const db = await connectDB();
        const collection = db.collection('item_data');
        const filter = { _id: new ObjectId(itemId) };
        const updateOperation = { $set: updateItemdata };
        const update = await collection.updateOne(filter, updateOperation);

        if (update.modifiedCount > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Item updated successfully',
                data: update
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Item not found',
                data: null
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            data: null
        });
    }
}

module.exports = {
    get_items,
    get_item_by_id,
    insert_item,
    update_item
};
