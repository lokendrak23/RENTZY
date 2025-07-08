const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["tenant", "homeowner"], 
        required: true 
    },
    
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    
    passwordResetAttempts: {
        type: Number,
        default: 0
    },
    lastPasswordResetAttempt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true 
});


userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ email: 1 });


userSchema.methods.clearPasswordResetToken = function() {
    this.resetPasswordToken = null;
    this.resetPasswordExpires = null;
    this.passwordResetAttempts = 0;
    this.lastPasswordResetAttempt = null;
};


userSchema.methods.isPasswordResetTokenValid = function() {
    return this.resetPasswordToken && 
           this.resetPasswordExpires && 
           this.resetPasswordExpires > Date.now();
};


userSchema.statics.findByValidResetToken = function(token) {
    return this.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
};

module.exports = mongoose.model("User", userSchema);
