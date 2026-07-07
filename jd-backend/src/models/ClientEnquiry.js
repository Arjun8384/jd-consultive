const mongoose = require('mongoose');

const clientEnquirySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    company:     { type: String, required: true, trim: true, maxlength: 150 },
    designation: { type: String, trim: true, maxlength: 100, default: '' },
    email:       { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone:       { type: String, required: true, trim: true, maxlength: 20 },
    service:     { type: String, required: true, enum: ['Permanent Hiring', 'Contract Staffing', 'Bulk Hiring', 'Executive Search'] },
    industry:    { type: String, trim: true, maxlength: 100, default: '' },
    positions:   { type: String, trim: true, maxlength: 50, default: '' },
    locations:   { type: String, trim: true, maxlength: 200, default: '' },
    experience:  { type: String, trim: true, maxlength: 50, default: '' },
    message:     { type: String, trim: true, maxlength: 2000, default: '' },
    ip:          { type: String, default: '' },
    status:      { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
    versionKey: false,
  }
);

// Index for fast admin queries
clientEnquirySchema.index({ createdAt: -1 });
clientEnquirySchema.index({ status: 1 });
clientEnquirySchema.index({ email: 1 });

module.exports = mongoose.model('ClientEnquiry', clientEnquirySchema);
