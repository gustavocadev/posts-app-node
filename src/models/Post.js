const { model, Schema } = require("mongoose");

const PostSchema = new Schema(
    {
        description: {
            type: String,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("Post", PostSchema);
