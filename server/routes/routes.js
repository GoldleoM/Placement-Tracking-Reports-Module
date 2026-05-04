const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// get all placed students
router.get('/placed', async (req, res) => {
  try {
    const studentList = await Student.find({ placed: true }).select('name roll company package');
    res.json({ ok: true, data: studentList });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch placed students' });
  }
});

// get all unplaced students
router.get('/unplaced', async (req, res) => {
  try {
    const studentList = await Student.find({ placed: false }).select('name roll department cgpa');
    res.json({ ok: true, data: studentList });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch unplaced students' });
  }
});

// placement stats
router.get('/stats', async (req, res) => {
  try {
    const totalCount = await Student.countDocuments();
    const placedCount = await Student.countDocuments({ placed: true });
    const percentage = totalCount === 0 ? 0 : Math.round((placedCount / totalCount) * 100);

    res.json({
      ok: true,
      data: {
        totalStudents: totalCount,
        totalPlaced: placedCount,
        placementPercentage: percentage
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch stats' });
  }
});

// company-wise report
router.get('/company-report', async (req, res) => {
  try {
    const report = await Student.aggregate([
      { $match: { placed: true, company: { $ne: null } } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const resultList = report.map((row) => ({
      company: row._id,
      placedCount: row.count
    }));

    res.json({ ok: true, data: resultList });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch company report' });
  }
});

// department-wise report
router.get('/department-report', async (req, res) => {
  try {
    const report = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          placed: {
            $sum: {
              $cond: [{ $eq: ['$placed', true] }, 1, 0]
            }
          },
          unplaced: {
            $sum: {
              $cond: [{ $eq: ['$placed', false] }, 1, 0]
            }
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const resultList = report.map((row) => ({
      department: row._id,
      total: row.total,
      placed: row.placed,
      unplaced: row.unplaced
    }));

    res.json({ ok: true, data: resultList });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch department report' });
  }
});

module.exports = router;
