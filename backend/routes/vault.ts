import express from 'express';
import VaultItem, { IVaultItem } from '../models/VaultItem';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get all vault items for a user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { search } = req.query;

    let query: any = { userId };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    const vaultItems = await VaultItem.find(query)
      .sort({ updatedAt: -1 })
      .select('_id title url encryptedData createdAt updatedAt');

    res.json({ vaultItems });
  } catch (error: any) {
    console.error('Error fetching vault items:', error);
    res.status(500).json({ message: 'Error fetching vault items', error: error.message });
  }
});

// Get a specific vault item
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const vaultItem = await VaultItem.findOne({ _id: id, userId });

    if (!vaultItem) {
      return res.status(404).json({ message: 'Vault item not found' });
    }

    res.json({ vaultItem });
  } catch (error: any) {
    console.error('Error fetching vault item:', error);
    res.status(500).json({ message: 'Error fetching vault item', error: error.message });
  }
});

// Create a new vault item
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { title, url, encryptedData } = req.body;

    if (!title || !encryptedData) {
      return res.status(400).json({ message: 'Title and encrypted data are required' });
    }

    const vaultItem = new VaultItem({
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
  } catch (error: any) {
    console.error('Error creating vault item:', error);
    res.status(500).json({ message: 'Error creating vault item', error: error.message });
  }
});

// Update a vault item
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, url, encryptedData } = req.body;

    const vaultItem = await VaultItem.findOne({ _id: id, userId });

    if (!vaultItem) {
      return res.status(404).json({ message: 'Vault item not found' });
    }

    // Update fields
    if (title) vaultItem.title = title;
    if (url !== undefined) vaultItem.url = url;
    if (encryptedData) vaultItem.encryptedData = encryptedData;

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
  } catch (error: any) {
    console.error('Error updating vault item:', error);
    res.status(500).json({ message: 'Error updating vault item', error: error.message });
  }
});

// Delete a vault item
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const vaultItem = await VaultItem.findOneAndDelete({ _id: id, userId });

    if (!vaultItem) {
      return res.status(404).json({ message: 'Vault item not found' });
    }

    res.json({ message: 'Vault item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting vault item:', error);
    res.status(500).json({ message: 'Error deleting vault item', error: error.message });
  }
});

export default router;
