import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import InstagramAccount from '../models/InstagramAccount';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all Instagram accounts for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await InstagramAccount.find({ userId: req.userId });
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching Instagram accounts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new Instagram account (demo mode)
router.post(
  '/',
  authenticate,
  [
    body('username').notEmpty().trim(),
    body('displayName').notEmpty().trim()
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, displayName } = req.body;

      const account = await InstagramAccount.create({
        userId: req.userId,
        username,
        displayName,
        isActive: true
      });

      res.status(201).json(account);
    } catch (error) {
      console.error('Error creating Instagram account:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete Instagram account
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const account = await InstagramAccount.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await InstagramAccount.deleteOne({ _id: req.params.id });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting Instagram account:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
