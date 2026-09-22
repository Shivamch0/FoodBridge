import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim : true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase : true,
      trim : true
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim : true
    },
    role: {
      type: String,
      enum: ["donor", "organization", "volunteer", "admin"],
      required : true
    },

    organizationType: {
      type: String,
      enum: [
        "ngo",
        "gurudwara",
        "temple",
        "mosque",
        "church",
        "community_kitchen",
        "shelter",
        "orphanage",
        "old_age_home",
        "other",
      ],
    },
    organizationName: {
      type: String,
      trim : true
    },
    hasTransport: {
      type: Boolean,
      default: false,
    },
    transportDetails: {
      vehicleType: {
        type : String
      },
      capacity: {
        type : Number
      },
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coordinates) => coordinates.length === 2,
          message: "Location coordinates must contain longitude and latitude",
        },
      },
    },

    isVerified: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true },
);

// Geospatial index
userSchema.index({ location: "2dsphere" });

userSchema.pre('save' , async function(){
    if(!this.isModified('password') || !this.password) return ;

    this.password = await bcrypt.hash(this.password , 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password
    )
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_LIFE}
    )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    },
  );
};

export const User = mongoose.model("User", userSchema);
