const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
  valueString: {
    type: String,
  },
  valueNumber: {
    type: Number,
  },
  avgValueString: {
    type: String
  },
  avgValueNumber: {
    type: Number
  },
  date: {
    type: Date
  },
  remark: {
    type: String
  },
  patient_id: {
    type: String,
    required: true
  },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  testType: { type: mongoose.Schema.Types.ObjectId, ref: 'TestType' },
}, { toObject: { virtuals: true }, toJson: { virtuals: true } });

TestSchema.virtual('patient', {
  ref: 'Patient',
  localField: 'Patient_id',
  foreignField: 'nationalID',
  justOne: true
});
module.exports = mongoose.model('Test', TestSchema);