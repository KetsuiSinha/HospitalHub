const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff", "doctor"], default: "staff" },
  hospital: { type: String, required: true, enum: ["City General Hospital", "Memorial Medical Center", "St. Mary's Hospital", "Regional Health Center", "Community Medical Center", "University Hospital"] },
  city: { type: String, enum: [
    "New Delhi","Mumbai","Kolkata","Chennai","Bengaluru","Hyderabad","Jaipur","Lucknow","Bhopal","Patna","Ranchi","Bhubaneswar","Chandigarh","Dehradun","Shimla","Srinagar","Jammu","Gandhinagar","Raipur","Dispur","Imphal","Aizawl","Agartala","Itanagar","Kohima","Gangtok","Shillong","Panaji","Thiruvananthapuram"
  ] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
