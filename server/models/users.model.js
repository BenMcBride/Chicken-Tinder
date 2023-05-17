const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [40, "Name cannot be longer than 40 characters."],
      validate: {
        validator: function (name) {
          const re = /^[a-zA-Z-,.]+(\s{0,1}[a-zA-Z-,. ])*$/;
          return re.test(name);
        },
        message: props => `${props.value} is not a valid name.`
      }
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      validate: {
        validator: function (email) {
          const re = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        },
        message: props => `${props.value} is not a valid email address.`
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Password confirmation is required"],
      validate: {
        validator: function (confirmPassword) {
          return confirmPassword === this.password;
        },
        message: "Passwords do not match."
      }
    }
  },
  { timestamps: true }
);


module.exports.User = mongoose.model('User', UserSchema);
