const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');

const {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense // ✅ ADD THIS
} = require('../controllers/expenseController');

// ✅ Routes
router.post('/', auth, addExpense);
router.get('/', auth, getExpenses);
router.delete('/:id', auth, deleteExpense);
router.put('/:id', auth, updateExpense); // ✅ FIXED: used correct 'auth' and added import

module.exports = router;
