const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const expense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.user
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Expense.findByIdAndDelete(req.params.id); // ✅ fixed deletion
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error (backend):', err);
    res.status(500).json({ message: 'Error deleting expense', error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Update fields
    expense.title = req.body.title || expense.title;
    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.date = req.body.date || expense.date;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('❌ Update error (backend):', err);
    res.status(500).json({ message: 'Error updating expense', error: err.message });
    const { updateExpense } = require('../controllers/expenseController');

  }
};
