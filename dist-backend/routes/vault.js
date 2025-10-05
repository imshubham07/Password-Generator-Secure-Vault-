"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VaultItem_1 = __importDefault(require("../models/VaultItem"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all vault items for a user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { search } = req.query;
        let query = { userId };
        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { url: { $regex: search, $options: 'i' } }
            ];
        }
        const vaultItems = await VaultItem_1.default.find(query)
            .sort({ updatedAt: -1 })
            .select('_id title url encryptedData createdAt updatedAt');
        res.json({ vaultItems });
    }
    catch (error) {
        console.error('Error fetching vault items:', error);
        res.status(500).json({ message: 'Error fetching vault items', error: error.message });
    }
});
// Get a specific vault item
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const vaultItem = await VaultItem_1.default.findOne({ _id: id, userId });
        if (!vaultItem) {
            return res.status(404).json({ message: 'Vault item not found' });
        }
        res.json({ vaultItem });
    }
    catch (error) {
        console.error('Error fetching vault item:', error);
        res.status(500).json({ message: 'Error fetching vault item', error: error.message });
    }
});
// Create a new vault item
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, url, encryptedData } = req.body;
        if (!title || !encryptedData) {
            return res.status(400).json({ message: 'Title and encrypted data are required' });
        }
        const vaultItem = new VaultItem_1.default({
            userId,
            title,
            url: url || '',
            encryptedData,
        });
        await vaultItem.save();
        res.status(201).json({
            message: 'Vault item created successfully',
            vaultItem: {
                _id: vaultItem._id,
                title: vaultItem.title,
                url: vaultItem.url,
                encryptedData: vaultItem.encryptedData,
                createdAt: vaultItem.createdAt,
                updatedAt: vaultItem.updatedAt,
            },
        });
    }
    catch (error) {
        console.error('Error creating vault item:', error);
        res.status(500).json({ message: 'Error creating vault item', error: error.message });
    }
});
// Update a vault item
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, url, encryptedData } = req.body;
        const vaultItem = await VaultItem_1.default.findOne({ _id: id, userId });
        if (!vaultItem) {
            return res.status(404).json({ message: 'Vault item not found' });
        }
        // Update fields
        if (title)
            vaultItem.title = title;
        if (url !== undefined)
            vaultItem.url = url;
        if (encryptedData)
            vaultItem.encryptedData = encryptedData;
        await vaultItem.save();
        res.json({
            message: 'Vault item updated successfully',
            vaultItem: {
                _id: vaultItem._id,
                title: vaultItem.title,
                url: vaultItem.url,
                encryptedData: vaultItem.encryptedData,
                createdAt: vaultItem.createdAt,
                updatedAt: vaultItem.updatedAt,
            },
        });
    }
    catch (error) {
        console.error('Error updating vault item:', error);
        res.status(500).json({ message: 'Error updating vault item', error: error.message });
    }
});
// Delete a vault item
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const vaultItem = await VaultItem_1.default.findOneAndDelete({ _id: id, userId });
        if (!vaultItem) {
            return res.status(404).json({ message: 'Vault item not found' });
        }
        res.json({ message: 'Vault item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting vault item:', error);
        res.status(500).json({ message: 'Error deleting vault item', error: error.message });
    }
});
exports.default = router;
