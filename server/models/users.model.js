const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required."],
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [20, "Name cannot be longer than 20 characters."],
      validate: {
        validator: function (name) {
          const re = /^[a-zA-Z-,.]+(\s{0,1}[a-zA-Z-,. ])*$/;
          return re.test(name);
        },
        message: (props) => `${props.value} is not a valid name.`,
      },
    },
    lastName: {
      type: String,
      required: [true, "Name is required."],
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [20, "Name cannot be longer than 20 characters."],
      validate: {
        validator: function (name) {
          const re = /^[a-zA-Z-,.]+(\s{0,1}[a-zA-Z-,. ])*$/;
          return re.test(name);
        },
        message: (props) => `${props.value} is not a valid name.`,
      },
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true, // Make the email field unique
      validate: {
        validator: async function (email) {
          const user = await mongoose.model("User").findOne({ email });
          return !user; // Return true if the user with the email doesn't exist
        },
        message: (props) => `${props.value} is already registered.`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });
UserSchema.pre("validate", function () {
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Passwords do not match.");
  }
});

module.exports.User = mongoose.model("User", UserSchema);
