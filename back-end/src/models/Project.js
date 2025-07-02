const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  
  numberOfApartments: {
    type: Number,
    required: [true, 'Number of apartments is required'],
    min: [1, 'Must have at least 1 apartment'],
    validate: {
      validator: Number.isInteger,
      message: 'Number of apartments must be an integer'
    }
  },
  
  totalSurface: {
    type: Number,
    required: [true, 'Total surface is required'],
    min: [1, 'Total surface must be positive']
  },
  
  // Location (Enhanced)
  latitude: {
    type: Number,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90'],
    default: null
  },
  
  longitude: {
    type: Number,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180'],
    default: null
  },
  
  // Financial Information (Enhanced)
  folderFees: {
    type: Number,
    min: [0, 'Folder fees must be positive'],
    default: null
  },
  
  commissionPerM2: {
    type: Number,
    min: [0, 'Commission per m² must be positive'],
    default: null
  },
  
  totalSales: {
    type: Number,
    min: [0, 'Total sales must be positive'],
    default: null
  },
  
  // Project Status and Progress (Enhanced)
  status: {
    type: String,
    enum: ['PLANIFICATION', 'CONSTRUCTION', 'DONE'],
    default: 'PLANIFICATION'
  },
  
  progress: {
    type: Number,
    min: [0, 'Progress must be between 0 and 100'],
    max: [100, 'Progress must be between 0 and 100'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Progress must be an integer'
    }
  },
  
  // Media (Enhanced)
  image: {
    type: String,
    default: null
  },
  
  constructionPhotos: {
    type: [String],
    default: [],
    validate: {
      validator: function(photos) {
        return photos.length <= 50;
      },
      message: 'Cannot have more than 50 construction photos'
    }
  },
  
  // Additional Information
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Virtual for properties
ProjectSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'projectId'
});

// Indexes for performance
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ progress: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ name: 'text', address: 'text' });
ProjectSchema.index({ latitude: 1, longitude: 1 });

// Pre-save validation
ProjectSchema.pre('save', function(next) {
  // Validate coordinates together
  if ((this.latitude && !this.longitude) || (!this.latitude && this.longitude)) {
    return next(new Error('Both latitude and longitude must be provided together'));
  }
  next();
});

// Static methods
ProjectSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

ProjectSchema.statics.findWithProperties = function() {
  return this.find().populate('properties').sort({ createdAt: -1 });
};

// Instance methods
ProjectSchema.methods.updateProgress = function(newProgress) {
  if (newProgress < 0 || newProgress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }
  
  this.progress = newProgress;
  
  // Auto-update status based on progress
  if (newProgress === 0) {
    this.status = 'PLANIFICATION';
  } else if (newProgress === 100) {
    this.status = 'DONE';
  } else {
    this.status = 'CONSTRUCTION';
  }
  
  return this.save();
};

module.exports = mongoose.model('Project', ProjectSchema);
