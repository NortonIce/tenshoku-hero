import mongoose from "mongoose";

const applicationInPlanningSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const activeDaySchema = new mongoose.Schema(
	{
		intensity: {
			type: Number,
			required: true,
		},
		datetime: {
			type: Date,
			required: true,
		},
	},
	{ _id: false }
);

const userScheduleSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	applicationsInPlanning: {
		type: [applicationInPlanningSchema],
		default: [],
	},
	activeDays: {
		type: [activeDaySchema],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

userScheduleSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

export default mongoose.models.UserSchedule ||
	mongoose.model("UserSchedule", userScheduleSchema);

