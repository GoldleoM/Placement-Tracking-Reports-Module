const mongoose = require('mongoose');
const Student = require('./server/models/Student');
const Company = require('./server/models/Company');

const dbUrl = 'mongodb://127.0.0.1:27017/placement_demo';

const sampleStudents = [
  {
    name: 'Ayesha Khan',
    roll: 'CSE001',
    department: 'CSE',
    cgpa: 8.6,
    placed: true,
    company: 'TCS',
    package: 4.5
  },
  {
    name: 'Rahul Mehta',
    roll: 'CSE002',
    department: 'CSE',
    cgpa: 7.9,
    placed: false
  },
  {
    name: 'Priya Sharma',
    roll: 'ECE003',
    department: 'ECE',
    cgpa: 8.1,
    placed: true,
    company: 'Infosys',
    package: 5.2
  },
  {
    name: 'Sanjay Patil',
    roll: 'ME004',
    department: 'ME',
    cgpa: 7.2,
    placed: false
  },
  {
    name: 'Neha Verma',
    roll: 'EEE005',
    department: 'EEE',
    cgpa: 8.0,
    placed: true,
    company: 'Wipro',
    package: 4.0
  },
  {
    name: 'Arjun Rao',
    roll: 'CIV006',
    department: 'CIVIL',
    cgpa: 6.9,
    placed: false
  },
  {
    name: 'Meera Joshi',
    roll: 'ECE007',
    department: 'ECE',
    cgpa: 9.1,
    placed: true,
    company: 'Accenture',
    package: 6.1
  },
  {
    name: 'Karthik Iyer',
    roll: 'ME008',
    department: 'ME',
    cgpa: 7.5,
    placed: true,
    company: 'L&T',
    package: 5.0
  },
  {
    name: 'Pooja Nair',
    roll: 'CSE009',
    department: 'CSE',
    cgpa: 8.3,
    placed: true,
    company: 'IBM',
    package: 7.0
  },
  {
    name: 'Vikram Singh',
    roll: 'EEE010',
    department: 'EEE',
    cgpa: 6.8,
    placed: false
  }
];

async function seedData() {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected for seeding');

    await Student.deleteMany({});
    await Student.insertMany(sampleStudents);

    const report = await Student.aggregate([
      { $match: { placed: true, company: { $ne: null } } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const companies = report.map((row) => ({
      name: row._id,
      placedCount: row.count,
      avgPackage: row.avgPackage ? Number(row.avgPackage.toFixed(2)) : 0
    }));

    await Company.deleteMany({});
    if (companies.length > 0) {
      await Company.insertMany(companies);
    }

    console.log('Sample students inserted');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();
