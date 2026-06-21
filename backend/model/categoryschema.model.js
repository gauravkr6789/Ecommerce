import mongoose from 'mongoose'


const categoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

categoryschema.pre("save", async function () {
    if (!this.slug) {
        this.slug =
            this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    }
});

export default mongoose.model("Category", categoryschema);
